import { describe, it, expect } from 'vitest';
import {
  processOfficeCiapBlockGFactorEngine,
  processOfficeCiapAccountingSpedEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: CIAP Bloco G SPED Fiscal & Apropriação 1/48 (LC 87/96)', () => {
  it('1. Deve calcular fracao 1/48 (R$ 1.000,00), fator de saidas tributadas (90%) e credito apropriavel (R$ 900,00)', () => {
    const resCiap = processOfficeCiapBlockGFactorEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria Metalúrgica Soberana S/A',
      competenciaMesAno: '2026-08',
      identificacaoBemImobilizado: 'Injetora Termoplástica Robótica 2026',
      valorIcmsTotalDestacadoNfeBrl: 48000.00, // 48k / 48 = 1.000,00 por mês
      numeroParcelaAtualMesCount: 1, // Parcela 01/48
      valorSaidasTributadasExportacaoBrl: 900000.00,
      valorTotalSaidasMesBrl: 1000000.00 // Fator = 90%
    });

    const dataCiap = unwrap(resCiap);
    expect(dataCiap.parcelaBase1De48AvosBrl).toBe(1000.00);
    expect(dataCiap.fatorSaidasTributadasPercent).toBe(90.00);
    expect(dataCiap.valorCreditoIcmsApropriavelMesBrl).toBe(900.00);
    expect(dataCiap.valorIcmsPerdidoNaoAproveitavelBrl).toBe(100.00);
    expect(dataCiap.saldoRemanescenteIcmsApropriarBrl).toBe(47000.00); // 47 parcelas x 1.000
    expect(dataCiap.statusApuracao).toBe('CIAP_BLOCO_G_APURADO_COM_SUCESSO');
    expect(dataCiap.diagnosticoCiap).toContain('CIAP Bloco G');
  });

  it('2. Deve gerar registros G110/G125 no SPED Fiscal e partidas dobradas de ICMS a recuperar e baixa de perda', () => {
    const resSped = processOfficeCiapAccountingSpedEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria Metalúrgica Soberana S/A',
      valorCreditoApropriadoMesBrl: 900.00,
      valorIcmsPerdidoMesBrl: 100.00,
      numeroChaveNfeAquisicao: '35260811111111000111550010000099991234567890'
    });

    const dataSped = unwrap(resSped);
    expect(dataSped.registroSpedFiscalG110).toContain('Registro G110 (Totalização Mensal do CIAP)');
    expect(dataSped.registroSpedFiscalG125).toContain('Registro G125 (Movimentação do Bem - Tipo AT Apropriação)');
    expect(dataSped.partidaDobradaApropriacaoCredito).toContain('1.1.03.002 ICMS a Recuperar (Ativo Circulante)');
    expect(dataSped.partidaDobradaBaixaIcmsPerdido).toContain('4.1.02.008 Despesas Tributárias - ICMS CIAP não Apropriado');
    expect(dataSped.statusEscrituracao).toBe('CIAP_ESCRITURADO_SPED_E_RAZAO_CONCLUIDO');
    expect(dataSped.diagnosticoSped).toContain('G110/G125');
  });
});
