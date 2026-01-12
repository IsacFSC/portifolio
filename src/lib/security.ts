import { headers } from "next/headers";
import crypto from "crypto";

/**
 * Sanitizar entrada para evitar XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < e >
    .trim();
}

/**
 * Validar origin para CORS
 */
export function isValidOrigin(origin: string | null): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  return origin ? allowedOrigins.includes(origin) : false;
}

/**
 * Gerar CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verificar CSRF token
 */
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}

/**
 * Obter IP do cliente
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}
