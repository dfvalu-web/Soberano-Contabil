import { describe, it, expect } from 'vitest';
import {
  processFirstTimeIfrsTransitionReconciliationCpc37,
  processReiqChemicalIndustrySpecialTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Transição IFRS (CPC 37 / IFRS 1) & Regime REIQ Química (Lei 14.374/22)', () => {
  it('1. Deve reconciliar PL de abertura na transicao IFRS com deemed cost e tributos diferidos conforme CPC 37', () => {
    const resTransition = processFirstTimeIfrsTransitionReconciliationCpc37({
      empresaCnpj: '12.345.678/0001-90',
      dataTransicao: '2025-01-01',
      patrimonioLiquidoAnteriorBrgaapBrl: 50000000.00, // R$ 50M
      ajusteCustoAtribuidoImobilizadoBrl: 8000000.00, // + R$ 8M Deemed cost
      eliminacaoDespesasDiferidasPreOperacionaisBrl: 1500000.00, // - R$ 1.5M
      ajusteArrendamentosIfrs16DireitoUsoBrl: 4000000.00, // Ativo + 4M
      passivoArrendamentoInicialBrl: 4200000.00, // Passivo - 4.2M -> Líquido = - R$ 200k
      aliquotaTributosDiferidosPercent: 34.0 // 34% de 8M = R$ 2.720.000,00 passivo fiscal diferido
    });

    const dataTransition = unwrap(resTransition);
    expect(dataTransition.patrimonioLiquidoAnteriorBrl).toBe(50000000.00);
    expect(dataTransition.totalAjustesBrutosLucrosAcumuladosBrl).toBe(6300000.00); // 8M - 1.5M - 200k = 6.3M
    expect(dataTransition.efeitoTributosDiferidosPassivoAtivoBrl).toBe(2720000.00); // 34% de 8M
    expect(dataTransition.variacaoLiquidaPlTransicaoBrl).toBe(3580000.00); // 6.3M - 2.72M = 3.58M
    expect(dataTransition.patrimonioLiquidoAberturaIfrsBrl).toBe(53580000.00); // 50M + 3.58M
    expect(dataTransition.statusAprovacaoCpc37).toBe('BALANCO_ABERTURA_IFRS_HOMOLOGADO');
    expect(dataTransition.diagnosticoCpc37).toContain('PL de Abertura IFRS: R$ 53580000.00');
  });

  it('2. Deve apurar reducao de PIS/COFINS em materias-primas petroquimicas no REIQ conforme Lei 14.374/22', () => {
    const resReiq = processReiqChemicalIndustrySpecialTaxEngine({
      empresaCnpj: '12.345.678/0001-90',
      anoCalendario: 2026,
      valorAquisicaoNaftaPetroquimicaBrl: 20000000.00, // R$ 20M
      aliquotaPadraoPisPercent: 1.65, // R$ 330k
      aliquotaPadraoCofinsPercent: 7.60, // R$ 1.520k -> Total Padrão = R$ 1.850k
      aliquotaReiqPisPercent: 1.52, // R$ 304k
      aliquotaReiqCofinsPercent: 6.98, // R$ 1.396k -> Total REIQ = R$ 1.700k
      cumpriuContrapartidaInvestimentoSustentavel: true
    });

    const dataReiq = unwrap(resReiq);
    expect(dataReiq.pisPadraoSemReiqBrl).toBe(330000.00);
    expect(dataReiq.cofinsPadraoSemReiqBrl).toBe(1520000.00);
    expect(dataReiq.pisDevidoComReiqBrl).toBe(304000.00);
    expect(dataReiq.cofinsDevidoComReiqBrl).toBe(1396000.00);
    expect(dataReiq.economiaTributariaReiqBrl).toBe(150000.00); // 1.85M - 1.70M
    expect(dataReiq.statusHabilitacaoReiq).toBe('HABILITADO_REIQ_LEI14374_CONFORME');
    expect(dataReiq.diagnosticoReiq).toContain('Economia Tributaria Direta: R$ 150000.00');
  });
});
