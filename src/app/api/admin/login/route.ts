import { NextRequest, NextResponse } from "next/server";
import { checkLoginRateLimit, getClientIP } from "@/lib/rate-limit";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  isValidAdminPassword,
} from "@/lib/admin-auth";

/**
 * POST /api/admin/login
 * Valida a senha de admin de forma segura no servidor
 * A senha é lida apenas do ADMIN_PASSWORD (variável privada)
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const rateLimitResult = await checkLoginRateLimit(`admin-login:${ip}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Muitas tentativas de login. Tente novamente mais tarde.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
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

    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: "Senha inválida" },
        { status: 400 }
      );
    }

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD não configurado no servidor." },
        { status: 500 }
      );
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSessionToken();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Erro de configuração da sessão de admin." },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: getAdminSessionMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
