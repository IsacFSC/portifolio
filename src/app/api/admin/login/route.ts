import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/login
 * Valida a senha de admin de forma segura no servidor
 * A senha é lida apenas do ADMIN_PASSWORD (variável privada)
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: "Senha inválida" },
        { status: 400 }
      );
    }

    // Ler senha PRIVADA do servidor (não exposta no navegador)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Validar senha
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Gerar token seguro: base64(admin:senha)
    const token = Buffer.from(`admin:${adminPassword}`).toString('base64');

    return NextResponse.json(
      { token },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
