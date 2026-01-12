import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

/**
 * Middleware: Validar token de autenticação
 * Espera header: X-Admin-Token: Bearer <base64(admin:senha)>
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
 * GET - Listar todos os contatos (protegido)
 * Requer: Header X-Admin-Token com token válido
 * Rate limit: 10 requisições por minuto por IP
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // 1. Rate limiting (10 req/min)
    const rateLimitResult = await checkRateLimit(
      `api:admin:contacts:${ip}`,
      10,
      60000
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Muitas requisições. Tente novamente mais tarde.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            ),
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          },
        }
      );
    }

    // 2. Validar autenticação
    if (!validateAdminToken(request)) {
      console.warn(`Unauthorized admin access attempt from IP: ${ip}`);
      return NextResponse.json(
        { error: "Não autorizado. Token inválido." },
        { status: 401 }
      );
    }

    // 3. Buscar contatos
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    // 4. Retornar com headers de segurança
    return NextResponse.json(contacts, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-RateLimit-Limit": String(rateLimitResult.limit),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
