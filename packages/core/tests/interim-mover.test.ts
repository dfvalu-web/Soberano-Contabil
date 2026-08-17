import { describe, it, expect } from 'vitest';
import {
  calculateInterimFinancialStatements,
  calculateMoverTaxIncentives,
  unwrap
} from '../src/index.js';

describe('TESTES: Demonstrações Intermediárias (CPC 21 R1) & Programa MOVER (Lei 14.902/2024)', () => {
  it('1. Deve apurar demonstracao intermedia condensada com aliquota efetiva estimada anual (CPC 21 R1)', () => {
    const res = calculateInterimFinancialStatements({
      periodoTrimestre: 2,
      anoExercicio: 2026,
      receitaLiquidaTrimestre: 12000000.00,
      lucroAntesImpostosTrimestre: 3000000.00,
      aliquotaEfetivaEstimadaAnoCompletoPercent: 28.5, // 28.5% estimado para o ano
      despesasSazonaisDiferidas: 0
    });

    const data = unwrap(res);
    expect(data.periodoTrimestre).toBe(2);
    expect(data.anoExercicio).toBe(2026);
    expect(data.receitaLiquidaTrimestre).toBe(12000000.00);
    // Provisão IRPJ/CSLL = 3M * 28.5% = 855.000,00
    expect(data.despesaProvisaoIrpjCsllTrimestre).toBe(855000.00);
    expect(data.lucroLiquidoIntermediarioTrimestre).toBe(2145000.00);
    expect(data.diagnosticoCpc21).toContain('CPC 21 R1');
  });

  it('2. Deve apurar creditos financeiros e desoneracoes do Programa MOVER (Lei 14.902/2024)', () => {
    const res = calculateMoverTaxIncentives({
      empresaHabilitadaId: 'MONTADORA-EV-01',
      anoExercicio: 2026,
      dispendiosPDIInovacaoDescarbonizacaoBrl: 5000000.00, // 5M P&D => 50% Crédito = 2.500.000,00
      habilitacaoRegimeMoverNumero: 'MOVER-MDIC-2026-089',
      importacoesAutopeçasSemSimilarNacionalUsd: 1000000.00, // USD 1M
      taxaCambialPtax: 5.00 // CIF BRL 5M => II 16% isento = 800.000,00
    });

    const data = unwrap(res);
    expect(data.creditoFinanceiroIrpjCsllGerado50Percent).toBe(2500000.00);
    expect(data.isencaoImpostoImportacaoAutopeçasBrl).toBe(800000.00);
    expect(data.totalBeneficioMoverBrl).toBe(3300000.00);
    expect(data.diagnosticoMover).toContain('MOVER-MDIC-2026-089');
  });
});
