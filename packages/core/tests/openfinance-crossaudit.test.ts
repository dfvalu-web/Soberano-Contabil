import { describe, it, expect } from 'vitest';
import {
  processOpenFinanceMtlsSync,
  processCrossAuditEfdDfeEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Open Finance BACEN (mTLS) & Auditoria Cruzada DF-e vs SPED', () => {
  it('1. Deve estabelecer sessao mTLS e sincronizar extratos do Open Finance com o Ledger Merkle (BACEN nº 1/2020)', () => {
    const resOf = processOpenFinanceMtlsSync({
      config: {
        instituicaoBancariaCodigo: '001 - Banco do Brasil S.A.',
        clientCertificateThumbprint: 'A1B2C3D4E5F678901234567890ABCDEF12345678',
        authEndpointUrl: 'https://openbanking.bb.com.br/oauth2/token',
        accountsEndpointUrl: 'https://openbanking.bb.com.br/open-banking/v1/accounts',
        isMtlsHandshakeStrict: true
      },
      contaNumero: '12345-6',
      dataInicio: '2026-04-01',
      dataFim: '2026-04-30',
      transacoesSimuladasCount: 150
    });

    const dataOf = unwrap(resOf);
    expect(dataOf.statusMtlsHandshake).toBe('ESTABELECIDO_COM_SUCESSO');
    expect(dataOf.totalTransacoesImportadas).toBe(150);
    expect(dataOf.saldoFinalConciliadoBrl).toBe(1250850.45);
    expect(dataOf.isSincronizadoLedgerMerkle).toBe(true);
    expect(dataOf.diagnosticoOpenFinance).toContain('Open Finance Brasil (BACEN nº 1/2020)');
  });

  it('2. Deve cruzar notas fiscais SEFAZ com escrituracao do Bloco C do SPED detectando notas omitidas', () => {
    const resAudit = processCrossAuditEfdDfeEngine({
      empresaNome: 'Soberano Logística & Distribuição S.A.',
      cnpj: '12.345.678/0001-90',
      competencia: '2026-04',
      notasFiscaisSefazXml: [
        {
          chaveAcessoNfe: '35260412345678000190550010000010011000010011',
          numeroNota: 1001,
          valorTotalNfeBrl: 50000.00,
          valorIcmsNfeBrl: 9000.00,
          cfopNfe: '5102'
        },
        {
          chaveAcessoNfe: '35260412345678000190550010000010021000010022',
          numeroNota: 1002,
          valorTotalNfeBrl: 80000.00,
          valorIcmsNfeBrl: 14400.00,
          cfopNfe: '5102'
        }
      ],
      registrosEfdSpedBlocoC: [
        // Apenas a NF 1001 foi escriturada; a NF 1002 foi omitida
        {
          chaveAcessoSped: '35260412345678000190550010000010011000010011',
          numeroDocumento: 1001,
          valorDocumentoBrl: 50000.00,
          valorIcmsSpedBrl: 9000.00,
          cfopSped: '5102'
        }
      ]
    });

    const dataAudit = unwrap(resAudit);
    expect(dataAudit.totalNotasSefazAnalisadas).toBe(2);
    expect(dataAudit.totalRegistrosSpedAnalisados).toBe(1);
    expect(dataAudit.totalDivergenciasEncontradas).toBe(1);
    expect(dataAudit.divergencias[0].tipoDivergencia).toBe('NOTA_OMITIDA_NO_SPED');
    expect(dataAudit.divergencias[0].impactoFinanceiroEstimadoBrl).toBe(14400.00);
    expect(dataAudit.statusAuditoria).toBe('DIVERGENCIAS_DETECTADAS_RISCO_FISCAL');
    expect(dataAudit.diagnosticoAuditoriaCruzada).toContain('Auditoria Cruzada DF-e vs SPED');
  });
});
