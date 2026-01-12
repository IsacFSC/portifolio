// Rate limit simples em memória (para desenvolvimento)
// Em produção, usar Redis com @upstash/ratelimit

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
) {
  const now = Date.now();

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Nova janela ou identificador novo
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      pending: 0,
      limit: maxRequests,
      reset: now + windowMs,
      remaining: maxRequests - 1,
    };
  }

  if (record.count >= maxRequests) {
    // Limite atingido
    return {
      success: false,
      pending: 0,
      limit: maxRequests,
      reset: record.resetAt,
      remaining: 0,
    };
  }

  // Incrementar contador
  record.count++;
  return {
    success: true,
    pending: 0,
    limit: maxRequests,
    reset: record.resetAt,
    remaining: maxRequests - record.count,
  };
}

/**
 * Rate limit específico para login: máximo 3 tentativas em 15 minutos
 */
export async function checkLoginRateLimit(identifier: string) {
  const maxAttempts = 3;
  const windowMs = 15 * 60 * 1000; // 15 minutos
  return checkRateLimit(`login:${identifier}`, maxAttempts, windowMs);
}

/**
 * Extrai IP da requisição (considera proxies)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}
