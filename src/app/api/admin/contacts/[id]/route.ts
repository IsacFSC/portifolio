import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { z } from "zod";

/**
 * Validar token de autenticação
 */
function validateAdminToken(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!token || !token.startsWith("Bearer ")) {
    return false;
  }

  const expectedToken = Buffer.from(`admin:${adminPassword}`).toString(
    "base64"
  );
  const receivedToken = token.slice(7); // Remove "Bearer "

  return receivedToken === expectedToken;
}

/**
 * Validar ID (proteção contra SQL injection)
 */
const idSchema = z.string().cuid();

/**
 * PATCH - Atualizar status do contato (protegido)
 * Requer: Header X-Admin-Token
 * Body: { status: "new" | "read" }
 * Rate limit: 20 req/min
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = getClientIP(request);

    // 1. Rate limiting (20 req/min)
    const rateLimitResult = await checkRateLimit(
      `api:admin:patch:${ip}`,
      20,
      60000
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Muitas requisições." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // 2. Validar autenticação
    if (!validateAdminToken(request)) {
      console.warn(`Unauthorized PATCH attempt from IP: ${ip}`);
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    // 3. Validar ID (contra SQL injection)
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 }
      );
    }

    // 4. Parsear e validar body
    const body = await request.json();
    const statusSchema = z.object({
      status: z.enum(["new", "read"]),
    });

    const bodyValidation = statusSchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Status inválido. Use 'new' ou 'read'." },
        { status: 400 }
      );
    }

    const { status } = bodyValidation.data;

    // 5. Atualizar no banco
    const contact = await prisma.contact.update({
      where: { id: idValidation.data },
      data: { status },
    });

    return NextResponse.json(contact, {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Contato não encontrado." },
        { status: 404 }
      );
    }

    console.error("Erro ao atualizar contato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Deletar contato (protegido)
 * Requer: Header X-Admin-Token
 * Proteção: CUID validation, audit logging, rate limiting
 * Rate limit: 10 deletes/min
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = getClientIP(request);

    // 1. Rate limiting (10 delete/min)
    const rateLimitResult = await checkRateLimit(
      `api:admin:delete:${ip}`,
      10,
      60000
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Muitas requisições de deleção." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // 2. Validar autenticação
    if (!validateAdminToken(request)) {
      console.warn(`Unauthorized DELETE attempt from IP: ${ip}`);
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    // 3. Validar ID (contra SQL injection)
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 }
      );
    }

    // 4. Log para auditoria
    const contactToDelete = await prisma.contact.findUnique({
      where: { id: idValidation.data },
    });

    if (!contactToDelete) {
      return NextResponse.json(
        { error: "Contato não encontrado." },
        { status: 404 }
      );
    }

    console.log(
      `[AUDIT] Contact deleted - ID: ${idValidation.data}, Email: ${contactToDelete.email}, Time: ${new Date().toISOString()}, IP: ${ip}`
    );

    // 5. Deletar do banco
    await prisma.contact.delete({
      where: { id: idValidation.data },
    });

    return NextResponse.json(
      { success: true, message: "Contato deletado com sucesso." },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ID inválido.", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao deletar contato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
