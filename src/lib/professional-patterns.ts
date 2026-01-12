/**
 * Exemplos de Padrões e Hooks Customizados
 * Usados em aplicações full stack profissionais
 */

import { useCallback, useState, useRef, useEffect } from 'react';

// ============= TIPOS PROFISSIONAIS =============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
}

// ============= HOOKS CUSTOMIZADOS =============

/**
 * Hook para chamadas HTTP com tratamento de erro
 * Padrão comum em vagas de full stack
 */
export function useApi<T>(
  url: string,
  options?: RequestInit
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido');
      }

      setData(result.data ?? null);
    } catch (err) {
      const error: ApiError = {
        status: 500,
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        code: 'API_ERROR',
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, fetchData };
}

/**
 * Hook para loading e debounce
 * Comum em formulários e buscas
 */
export function useLoadingWithDebounce(ms: number = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (loading) {
      setIsLoading(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, ms);
    }
  }, [ms]);

  return { isLoading, setLoading };
}

/**
 * Hook para gerenciar estado de lista com paginação
 */
export function useList<T extends { id: string | number }>(
  initialData: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const add = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((id: T['id']) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const update = useCallback((id: T['id'], updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const paginated = items.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return {
    items,
    paginated,
    add,
    remove,
    update,
    page,
    setPage,
    pageSize,
    setPageSize,
    total: items.length,
    hasMore: page * pageSize < items.length,
  };
}

/**
 * Hook para lazy loading com observador (Intersection Observer)
 * Muito usado em infinite scroll
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

// ============= UTILITÁRIOS PROFISSIONAIS =============

/**
 * Classe para tratamento de erros customizado
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Funcção para retry com exponential backoff
 * Usado em requisições críticas
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Validador de CPF (exemplo de validação customizada)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

/**
 * Formatadores de dados comuns
 */
export const formatters = {
  currency: (value: number, locale: string = 'pt-BR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  date: (date: Date | string, locale: string = 'pt-BR') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  phone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) return phone;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  },

  cpf: (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  },
};

/**
 * Classe para caching em memória
 * Simples implementação que pode ser escalada
 */
export class Cache<T> {
  private store = new Map<string, { value: T; expiry: number }>();

  set(key: string, value: T, ttlMs: number = 60000) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.store.clear();
  }
}
