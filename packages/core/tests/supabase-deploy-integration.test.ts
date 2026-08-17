import { describe, it, expect } from 'vitest';
import {
  createSupabaseClientAdapter,
  unwrap
} from '../src/index.js';

describe('TESTES: Integração Supabase Enterprise (PostgreSQL 16, pgvector, RLS & Auth)', () => {
  it('1. Deve validar conexao e conformidade RLS / pgvector com Supabase', () => {
    const res = createSupabaseClientAdapter({
      supabaseUrl: 'https://soberano-enterprise.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.soberano_mock_key'
    });

    const data = unwrap(res);
    expect(data.status).toBe('CONNECTED');
    expect(data.databaseEngine).toBe('PostgreSQL 16 (Supabase Enterprise)');
    expect(data.pgvectorEnabled).toBe(true);
    expect(data.rowLevelSecurityActive).toBe(true);
  });
});
