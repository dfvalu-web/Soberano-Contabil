import { describe, it, expect } from 'vitest';
import {
  evaluateSeparateFinancialStatementsCpc35,
  calculateOffshoreTaxationLaw14754,
  unwrap
} from '../src/index.js';

describe('TESTES: Demonstrações Separadas (CPC 35) & Tributação de Offshores (Lei 14.754/2023)', () => {
  it('1. Deve mensurar investimentos nas demonstracoes separadas por Custo, Valor Justo e MEP (CPC 35)', () => {
    // 1.1 Custo Histórico
    const resCusto = evaluateSeparateFinancialStatementsCpc35({
      investidaId: 'SUB-ALPHA-01',
      nomeInvestida: 'Alpha Agro S.A.',
      metodoAdotado: 'CUSTO_HISTORICO',
      custoAquisicaoOriginalBrl: 10000000.00,
      lucroLiquidoInvestidaExercicioBrl: 4000000.00,
      percentualParticipacao: 80,
      dividendosDistribuidosPelaInvestidaBrl: 1000000.00 // 80% = 800k receita dividendos
    });

    const dataCusto = unwrap(resCusto);
    expect(dataCusto.saldoInvestimentoBalancoSeparadoBrl).toBe(10000000.00);
    expect(dataCusto.impactoResultadoControladoraBrl).toBe(800000.00);
    expect(dataCusto.partidasDobradaSeparadas.length).toBe(2);

    // 1.2 Equivalência Patrimonial (MEP)
    const resMep = evaluateSeparateFinancialStatementsCpc35({
      investidaId: 'SUB-BETA-02',
      nomeInvestida: 'Beta Logística S.A.',
      metodoAdotado: 'EQUIVALENCIA_PATRIMONIAL_MEP',
      custoAquisicaoOriginalBrl: 5000000.00,
      lucroLiquidoInvestidaExercicioBrl: 2000000.00, // 80% = 1.6M MEP
      percentualParticipacao: 80,
      dividendosDistribuidosPelaInvestidaBrl: 500000.00 // 80% = 400k reduz saldo
    });

    const dataMep = unwrap(resMep);
    expect(dataMep.impactoResultadoControladoraBrl).toBe(1600000.00);
    // Saldo = 5M + 1.6M - 400k = 6.200.000,00
    expect(dataMep.saldoInvestimentoBalancoSeparadoBrl).toBe(6200000.00);
  });

  it('2. Deve apurar IRPF de 15% sobre lucros de entidades offshores com compensacao de impostos (Lei 14.754/2023)', () => {
    const res = calculateOffshoreTaxationLaw14754({
      entidadeOffshoreId: 'OFF-BVI-HOLDING-01',
      nomeEntidade: 'Global Wealth Holdings LLC',
      paisJurisdicao: 'BVI (Ilhas Virgens Britânicas)',
      lucroLiquidoExercicioUsd: 1000000.00, // USD 1M
      taxaCambialPtax31Dezembro: 5.00, // R$ 5.000.000,00 (IRPF 15% = 750k)
      tributoPagoNoExteriorUsd: 50000.00, // USD 50k = R$ 250k crédito
      adotouOpcaoTransparenciaFiscal: true
    });

    const data = unwrap(res);
    expect(data.lucroContabilBrl).toBe(5000000.00);
    expect(data.impostoRendaDevidoBrasil15PercentBrl).toBe(750000.00);
    expect(data.creditoImpostoPagoExteriorBrl).toBe(250000.00);
    expect(data.impostoRendaLiquidoAPagarBrl).toBe(500000.00);
    expect(data.diagnosticoLei14754).toContain('Global Wealth Holdings LLC');
  });
});
