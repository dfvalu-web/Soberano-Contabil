import { describe, it, expect } from 'vitest';
import {
  processPostgresMultiTenantRlsAdapter,
  processImmutableS3ObjectLockStorage,
  unwrap
} from '../src/index.js';

describe('TESTES: PostgreSQL Multi-Tenant (RLS) & S3 Object Lock WORM (Pilar 2 - Produção)', () => {
  it('1. Deve configurar sessao com RLS nativo garantindo isolamento total por tenantId e CNPJ no PostgreSQL', () => {
    const resPg = processPostgresMultiTenantRlsAdapter({
      contextoTenant: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        cnpjEmpresa: '12.345.678/0001-90',
        usuarioId: 'usr-contador-chefe'
      },
      tabela: 'lancamentos_contabeis',
      operacao: 'SELECT',
      parametrosSql: { ano: 2026 }
    });

    const dataPg = unwrap(resPg);
    expect(dataPg.statusSegurancaIsolamento).toBe('ISOLAMENTO_RLS_ATIVO_GARANTIDO');
    expect(dataPg.comandoSessaoExecutado).toContain("SET LOCAL app.current_tenant_id = '00000000-0000-0000-0000-000000000001'");
    expect(dataPg.rlsPoliticaAtivada).toContain('CREATE POLICY lancamentos_contabeis_tenant_isolation');
    expect(dataPg.tempoExecucaoQueryMs).toBe(4);
    expect(dataPg.diagnosticoPostgres).toContain('Isolamento Total sem risco de contaminação de dados');
  });

  it('2. Deve aplicar S3 Object Lock em modo Compliance com retencao obrigatoria de 5 anos (CTN Art. 173)', () => {
    const resS3 = processImmutableS3ObjectLockStorage({
      tenantId: '00000000-0000-0000-0000-000000000001',
      bucketName: 'soberano-sped-immutable-vault',
      objectKey: '2026/04/NFe35260400000000000191550010000000011000000018.xml',
      conteudoBytes: '<NFe>XML COMPLETO ASSINADO</NFe>',
      retencaoLegalAnos: 5
    });

    const dataS3 = unwrap(resS3);
    expect(dataS3.modoRetencaoObjectLock).toBe('COMPLIANCE_WORM_IMUTAVEL');
    expect(dataS3.dataBloqueioRetencaoAte).toContain('2031-');
    expect(dataS3.hashSha256Inviolavel).toBeDefined();
    expect(dataS3.certificadoCustodiaDigital.statusCustodia).toBe('CUSTODIA_DIGITAL_IMUTAVEL_INVIOLAVEL');
    expect(dataS3.diagnosticoS3Worm).toContain('Bloqueio de exclusao ativo conforme CTN Art. 173');
  });
});
