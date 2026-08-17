import { describe, it, expect } from 'vitest';
import {
  evaluateLiquidationBasisAccountingCpc00,
  processAfrmmShippingTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Base de Liquidação (CPC 00 R2) & AFRMM Navegação e BR do Mar (Lei 14.301/22)', () => {
  it('1. Deve descontinuar Going Concern e apurar perda por realizacao de ativos e custos de liquidacao (CPC 00 R2 / ASC 205-30)', () => {
    const resLiq = evaluateLiquidationBasisAccountingCpc00({
      entidadeId: 'LIQ-01',
      razaoSocial: 'Companhia Industrial em Descontinuidade S.A.',
      valorContabilHistoricoAtivosBrl: 10000000.00,
      valorEstimadoRealizacaoLiquidacaoAtivosBrl: 6000000.00, // Perda de 4M
      custosEstimadosLiquidacaoEncerramentoBrl: 1500000.00, // Provisão de 1.5M
      passivoExigivelHistoricoBrl: 4000000.00 // Total Passivo = 5.5M -> PL Residual = 0.5M
    });

    const dataLiq = unwrap(resLiq);
    expect(dataLiq.ajusteDesvalorizacaoAtivosLiquidacaoBrl).toBe(4000000.00);
    expect(dataLiq.totalAtivosBaseLiquidacaoBrl).toBe(6000000.00);
    expect(dataLiq.provisaoCustosLiquidacaoBrl).toBe(1500000.00);
    expect(dataLiq.totalPassivosBaseLiquidacaoBrl).toBe(5500000.00);
    expect(dataLiq.patrimonioLiquidoLiquidacaoResidualBrl).toBe(500000.00);
    expect(dataLiq.partidasDobradaTransgressaoContinuidade.length).toBe(4);
    expect(dataLiq.diagnosticoCpc00).toContain('Base Contábil de Liquidação');
  });

  it('2. Deve apurar AFRMM para longo curso/cabotagem (8%), fluvial (40%) e isencao para ZFM e REB (Lei 14.301/22)', () => {
    // 2.1 Navegação de Longo Curso (Alíquota 8% do AFRMM integrado ao custo do estoque)
    const resLongo = processAfrmmShippingTaxEngine({
      conhecimentoEmbarqueId: 'BL-987654',
      tipoNavegacao: 'LONGO_CURSO',
      condicaoEspecial: 'OPERACAO_GERAL',
      valorFreteMaritimoBrl: 500000.00
    });

    const dataLongo = unwrap(resLongo);
    expect(dataLongo.isIsentoOuSuspenso).toBe(false);
    expect(dataLongo.aliquotaAfrmmPercent).toBe(8.0);
    expect(dataLongo.valorAfrmmDevidoBrl).toBe(40000.00);
    expect(dataLongo.integracaoCustoEstoqueBrl).toBe(40000.00);
    expect(dataLongo.diagnosticoFiscal).toContain('BR do Mar Lei nº 14.301/22');

    // 2.2 Navegação Destinada à Zona Franca de Manaus (Isenção/Suspensão Legal)
    const resZfm = processAfrmmShippingTaxEngine({
      conhecimentoEmbarqueId: 'BL-ZFM-111',
      tipoNavegacao: 'CABOTAGEM',
      condicaoEspecial: 'DESTINACAO_ZONA_FRANCA_MANAUS',
      valorFreteMaritimoBrl: 200000.00
    });

    const dataZfm = unwrap(resZfm);
    expect(dataZfm.isIsentoOuSuspenso).toBe(true);
    expect(dataZfm.aliquotaAfrmmPercent).toBe(0);
    expect(dataZfm.valorAfrmmDevidoBrl).toBe(0);
    expect(dataZfm.diagnosticoFiscal).toContain('ISENÇÃO / SUSPENSÃO APLICADA');
  });
});
