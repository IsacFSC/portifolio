import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { hasValidAdminSession } from "@/lib/admin-auth";

/**
 * GET - Listar todos os contatos (protegido)
 * Requer: Sessão de admin válida via cookie HttpOnly
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
    if (!hasValidAdminSession(request)) {
      console.warn(`Unauthorized admin access attempt from IP: ${ip}`);
      return NextResponse.json(
        { error: "Não autorizado." },
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
