/**
 * Exemplos de Testes com Vitest
 * Padrão profissional para validações
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatters, validateCPF, retryAsync, Cache } from '@/lib/professional-patterns';

// ============= TESTES DE VALIDAÇÃO =============

describe('validateCPF', () => {
  it('deve validar um CPF válido', () => {
    const validCPF = '11144477735';
    expect(validateCPF(validCPF)).toBe(true);
  });

  it('deve rejeitar CPF inválido', () => {
    expect(validateCPF('11111111111')).toBe(false);
    expect(validateCPF('123')).toBe(false);
  });

  it('deve funcionar com formatação', () => {
    const formattedCPF = '111.444.777-35';
    expect(validateCPF(formattedCPF)).toBe(true);
  });
});

// ============= TESTES DE FORMATADORES =============

describe('formatters', () => {
  describe('currency', () => {
    it('deve formatar valor em Real', () => {
      expect(formatters.currency(100)).toBe('R$ 100,00');
    });

    it('deve lidar com casas decimais', () => {
      expect(formatters.currency(99.99)).toMatch(/R\$ 99,99/);
    });
  });

  describe('phone', () => {
    it('deve formatar telefone corretamente', () => {
      expect(formatters.phone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve retornar original se inválido', () => {
      expect(formatters.phone('123')).toBe('123');
    });
  });

  describe('cpf', () => {
    it('deve formatar CPF com máscara', () => {
      expect(formatters.cpf('11144477735')).toBe('111.444.777-35');
    });
  });
});

// ============= TESTES DE RETRY =============

describe('retryAsync', () => {
  it('deve retornar sucesso na primeira tentativa', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryAsync(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('deve retentar em caso de erro', async () => {
    let attempts = 0;
    const fn = vi.fn(() => {
      attempts++;
      if (attempts < 3) throw new Error('Falha');
      return Promise.resolve('sucesso');
    });

    const result = await retryAsync(fn, 3, 10);
    expect(result).toBe('sucesso');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('deve falhar após máximo de tentativas', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Erro'));

    await expect(retryAsync(fn, 3, 10)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

// ============= TESTES DE CACHE =============

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache();
  });

  it('deve armazenar e recuperar valor', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('deve retornar null para chave inexistente', () => {
    expect(cache.get('nonexistent')).toBe(null);
  });

  it('deve expirar após TTL', async () => {
    cache.set('key', 'value', 100); // 100ms
    expect(cache.get('key')).toBe('value');

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(cache.get('key')).toBe(null);
  });

  it('deve limpar todo cache', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();

    expect(cache.get('key1')).toBe(null);
    expect(cache.get('key2')).toBe(null);
  });
});

// ============= TESTES DE INTEGRAÇÃO =============

describe('Fluxo de validação completo', () => {
  it('deve validar e formatar dados', () => {
    const cpf = '11144477735';
    
    expect(validateCPF(cpf)).toBe(true);
    expect(formatters.cpf(cpf)).toBe('111.444.777-35');
  });

  it('deve rejeitar e formatar dados inválidos', () => {
    const cpf = '12345678901';
    
    expect(validateCPF(cpf)).toBe(false);
    // Mesmo inválido, o formatador deve funcionar
    expect(formatters.cpf(cpf)).toBe('123.456.789-01');
  });
});
