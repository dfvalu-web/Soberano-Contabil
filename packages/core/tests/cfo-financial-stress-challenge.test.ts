import { describe, it, expect } from 'vitest';
import {
  calculateLiquidityRatios,
  calculateProfitabilityRatios,
  calculateDuPont5StageDecomposition,
  calculateSolvencyAndCreditRisk,
  calculateWorkingCapitalAndCycles,
  generateCompleteFinancialAnalysisReport,
  FinancialInputData,
  safeDivide,
  round
} from '../src/accounting/analysis/financial-ratios-engine.js';
import {
  calculateCrossReferencedMetrics,
  calculateCreditCapacityLimit,
  calculateCapitalAllocationPlan,
  generatePrescriptiveDiagnostics,
  runCfoPrescriptiveCopilot,
  CfoCopilotInput
} from '../src/accounting/analysis/cfo-decision-copilot.js';
import {
  calculateBreakEvenAnalysis,
  calculateCapitalBudgeting,
  solveIrrNewtonRaphson,
  runExpansionSimulation,
  ExpansionScenarioInput
} from '../src/accounting/analysis/financial-simulator-engine.js';

describe('Adversarial Financial Math and Stress Suite', () => {

  const baseInput: FinancialInputData = {
    ativoCirculante: 500000,
    disponibilidades: 100000,
    contasAReceber: 200000,
    estoques: 200000,
    realizavelLongoPrazo: 100000,
    ativoPermanenteImobilizado: 400000,
    totalAtivo: 1000000,

    passivoCirculante: 300000,
    fornecedores: 150000,
    emprestimosFinanciamentosCp: 50000,
    passivoNaoCirculante: 200000,
    emprestimosFinanciamentosLp: 150000,
    patrimonioLiquido: 500000,
    lucrosAcumuladosRetidos: 200000,
    totalPassivoEPl: 1000000,

    receitaBruta: 2200000,
    deducoesReceita: 200000,
    receitaLiquida: 2000000,
    custoProdutosVendidos: 1000000,
    lucroBruto: 1000000,
    despesasOperacionaisVendasGerais: 600000,
    ebitda: 450000,
    depreciacaoAmortizacao: 50000,
    lucroOperacionalEbit: 400000,
    despesasFinanceirasLiquidas: 40000,
    lucroAntesImpostosEbt: 360000,
    impostosSobreLucro: 90000,
    lucroLiquido: 270000
  };

  describe('1. Division by Zero and Extreme Null Value Stress', () => {
    it('handles zero liabilities (PC=0, PNC=0) without NaN or unhandled Infinity', () => {
      const input: FinancialInputData = {
        ...baseInput,
        passivoCirculante: 0,
        fornecedores: 0,
        emprestimosFinanciamentosCp: 0,
        passivoNaoCirculante: 0,
        emprestimosFinanciamentosLp: 0,
        patrimonioLiquido: 1000000,
        totalPassivoEPl: 1000000
      };

      const liq = calculateLiquidityRatios(input);
      expect(Number.isFinite(liq.liquidezCorrente)).toBe(true);
      expect(Number.isFinite(liq.liquidezSeca)).toBe(true);
      expect(Number.isFinite(liq.liquidezImediata)).toBe(true);
      expect(Number.isFinite(liq.liquidezGeral)).toBe(true);
      expect(liq.liquidezCorrente).toBe(999);

      const solv = calculateSolvencyAndCreditRisk(input);
      expect(Number.isFinite(solv.endividamentoGeralPercent)).toBe(true);
      expect(Number.isFinite(solv.composicaoEndividamentoCurtoPrazoPercent)).toBe(true);
      expect(Number.isFinite(solv.altmanZScore.zScoreBrasilEmergingValue)).toBe(true);
      expect(Number.isFinite(solv.kanitzTermometro.fatorInsolvencia)).toBe(true);
    });

    it('handles zero revenue (Receita=0) across all margin and working capital formulas', () => {
      const input: FinancialInputData = {
        ...baseInput,
        receitaBruta: 0,
        deducoesReceita: 0,
        receitaLiquida: 0,
        lucroBruto: 0,
        ebitda: 0,
        lucroOperacionalEbit: 0,
        lucroAntesImpostosEbt: 0,
        lucroLiquido: 0
      };

      const prof = calculateProfitabilityRatios(input);
      expect(prof.margemBrutaPercent).toBe(0);
      expect(prof.margemEbitdaPercent).toBe(0);
      expect(prof.margemOperacionalPercent).toBe(0);
      expect(prof.margemLiquidaPercent).toBe(0);
      expect(Number.isNaN(prof.roePercent)).toBe(false);
      expect(Number.isNaN(prof.roaPercent)).toBe(false);

      const wc = calculateWorkingCapitalAndCycles(input);
      expect(Number.isFinite(wc.prazoMedioRecebimentoPmrv)).toBe(true);
      expect(wc.prazoMedioRecebimentoPmrv).toBe(0);
      expect(Number.isFinite(wc.cicloOperacionalDias)).toBe(true);
      expect(Number.isFinite(wc.cicloCaixaFinanceiroDias)).toBe(true);

      const dupont = calculateDuPont5StageDecomposition(input);
      expect(dupont.ebitMargin).toBe(0);
      expect(dupont.assetTurnover).toBe(0);
      expect(Number.isFinite(dupont.roeCalculadoPercent)).toBe(true);
    });

    it('handles zero total assets (Ativo=0) gracefully without crashing', () => {
      const input: FinancialInputData = {
        ...baseInput,
        ativoCirculante: 0,
        disponibilidades: 0,
        contasAReceber: 0,
        estoques: 0,
        realizavelLongoPrazo: 0,
        ativoPermanenteImobilizado: 0,
        totalAtivo: 0
      };

      const prof = calculateProfitabilityRatios(input);
      expect(prof.roaPercent).toBe(0);

      const dupont = calculateDuPont5StageDecomposition(input);
      expect(dupont.assetTurnover).toBe(0);
      expect(Number.isFinite(dupont.roeCalculadoPercent)).toBe(true);

      const solv = calculateSolvencyAndCreditRisk(input);
      expect(Number.isFinite(solv.altmanZScore.zScoreBrasilEmergingValue)).toBe(true);
      expect(Number.isFinite(solv.kanitzTermometro.fatorInsolvencia)).toBe(true);
    });

    it('handles zero equity (PL=0) and negative equity (PL < 0 / Passivo a Descoberto)', () => {
      const zeroPlInput: FinancialInputData = {
        ...baseInput,
        patrimonioLiquido: 0
      };

      const profZero = calculateProfitabilityRatios(zeroPlInput);
      expect(profZero.roePercent).toBe(0);

      const dupontZero = calculateDuPont5StageDecomposition(zeroPlInput);
      expect(dupontZero.isPassivoADescoberto).toBe(true);
      expect(dupontZero.isIdentidadeVerificada).toBe(false);

      const negativePlInput: FinancialInputData = {
        ...baseInput,
        patrimonioLiquido: -300000,
        totalPassivoEPl: 1000000,
        passivoCirculante: 800000,
        passivoNaoCirculante: 500000
      };

      const profNeg = calculateProfitabilityRatios(negativePlInput);
      expect(Number.isFinite(profNeg.roePercent)).toBe(true);
      expect(profNeg.roePercent).toBeCloseTo((270000 / -300000) * 100, 2);

      const dupontNeg = calculateDuPont5StageDecomposition(negativePlInput);
      expect(dupontNeg.isPassivoADescoberto).toBe(true);
      expect(dupontNeg.interpretacao).toContain('Passivo a Descoberto');

      const solvNeg = calculateSolvencyAndCreditRisk(negativePlInput);
      expect(solvNeg.status).toBe('CRITICO');
    });

    it('handles extremely leveraged balance sheets (Liabilities >> Assets)', () => {
      const highlyLeveragedInput: FinancialInputData = {
        ...baseInput,
        totalAtivo: 1000000,
        ativoCirculante: 400000,
        passivoCirculante: 1200000,
        passivoNaoCirculante: 800000,
        patrimonioLiquido: -1000000,
        lucroOperacionalEbit: 50000,
        ebitda: 70000,
        lucroLiquido: -200000
      };

      const solv = calculateSolvencyAndCreditRisk(highlyLeveragedInput);
      expect(solv.endividamentoGeralPercent).toBe(200); // 2,000,000 / 1,000,000 * 100
      expect(solv.status).toBe('CRITICO');
      expect(solv.altmanZScore.status).toBe('ZONA_PERIGO');
      // Documenting empirical observation for Kanitz in negative equity scenarios
      expect(Number.isFinite(solv.kanitzTermometro.fatorInsolvencia)).toBe(true);
    });
  });

  describe('2. Negative Operating Cash Flows and Negative EBITDA Stress', () => {
    it('evaluates CFO copilot when EBITDA is negative or zero', () => {
      const negativeEbitdaInput: FinancialInputData = {
        ...baseInput,
        receitaLiquida: 1000000,
        ebitda: -150000,
        lucroOperacionalEbit: -200000,
        lucroAntesImpostosEbt: -250000,
        lucroLiquido: -250000
      };

      const report = generateCompleteFinancialAnalysisReport(negativeEbitdaInput);
      const copilotInput: CfoCopilotInput = {
        financialReport: report,
        massaSalarialTotal: 300000,
        encargosFolhaTotal: 100000
      };

      const decision = runCfoPrescriptiveCopilot(copilotInput);

      expect(Number.isFinite(decision.crossMetrics.freeCashFlowFirmFCFF)).toBe(true);
      expect(Number.isFinite(decision.crossMetrics.freeCashFlowEquityFCFE)).toBe(true);
      expect(decision.creditCapacity.dividaSobreEbitda).toBeGreaterThanOrEqual(0);
      expect(decision.creditCapacity.nivelRisco).toBe('CRITICO');
      expect(decision.creditCapacity.statusCredito).toBe('DESALAVANCAGEM_URGENTE');
    });
  });

  describe('3. DuPont 5-Stage Algebraic Identity Across 100 Random Scenarios', () => {
    it('strictly satisfies Tax Burden * Interest Burden * EBIT Margin * Asset Turnover * Equity Multiplier = ROE (error < 0.005%) for all valid positive scenarios', () => {
      for (let i = 1; i <= 100; i++) {
        const totalAtivo = 500000 + i * 25000;
        const pl = 200000 + (i % 20) * 15000;
        const recLiq = 1000000 + i * 50000;
        const ebit = 100000 + (i * 3500);
        const despFin = 10000 + (i * 500);
        const ebt = ebit - despFin;
        const imp = ebt * 0.25;
        const ll = ebt - imp;

        const testInput: FinancialInputData = {
          ...baseInput,
          totalAtivo,
          patrimonioLiquido: pl,
          receitaLiquida: recLiq,
          lucroOperacionalEbit: ebit,
          lucroAntesImpostosEbt: ebt,
          impostosSobreLucro: imp,
          lucroLiquido: ll
        };

        const dupont = calculateDuPont5StageDecomposition(testInput);

        const trueRoe = (ll / pl) * 100;

        expect(dupont.isIdentidadeVerificada).toBe(true);
        expect(dupont.discrepancia).toBeLessThan(0.005);
        expect(dupont.roeCalculadoPercent).toBeCloseTo(dupont.roeRealPercent, 2);

        // Verify product of 4-decimal rounded reporting ratios is within normal discretization tolerance (< 0.1%)
        const productOfRounded = (dupont.taxBurden * dupont.interestBurden * dupont.ebitMargin * dupont.assetTurnover * dupont.equityMultiplier) * 100;
        expect(Math.abs(productOfRounded - trueRoe)).toBeLessThan(0.1);
      }
    });
  });

  describe('4. Altman Z-Score Brasil and Stephen Kanitz Zone Calibration', () => {
    it('verifies exact threshold boundaries for Altman Z Brasil (2.60 and 1.10)', () => {
      const makeAltmanInput = (x1: number, x2: number, x3: number, x4: number): FinancialInputData => {
        const at = 1000000;
        const totalExigivel = 400000;
        const pc = 200000;
        const pnc = 200000;
        const pl = x4 * totalExigivel;
        const ac = x1 * at + pc;
        const ret = x2 * at;
        const ebit = x3 * at;

        return {
          ...baseInput,
          totalAtivo: at,
          ativoCirculante: ac,
          passivoCirculante: pc,
          passivoNaoCirculante: pnc,
          patrimonioLiquido: pl,
          lucrosAcumuladosRetidos: ret,
          lucroOperacionalEbit: ebit,
          lucroLiquido: ebit * 0.7
        };
      };

      const safe = calculateSolvencyAndCreditRisk(makeAltmanInput(0.2, 0.2, 0.1, 1.0));
      expect(safe.altmanZScore.status).toBe('ZONA_SEGURA');
      expect(safe.altmanZScore.zScoreBrasilEmergingValue).toBeGreaterThanOrEqual(2.60);

      const grey = calculateSolvencyAndCreditRisk(makeAltmanInput(0.05, 0.05, 0.05, 0.5));
      expect(grey.altmanZScore.status).toBe('ZONA_CINZENTA');
      expect(grey.altmanZScore.zScoreBrasilEmergingValue).toBeGreaterThanOrEqual(1.10);
      expect(grey.altmanZScore.zScoreBrasilEmergingValue).toBeLessThan(2.60);

      const distress = calculateSolvencyAndCreditRisk(makeAltmanInput(-0.1, -0.1, -0.05, 0.1));
      expect(distress.altmanZScore.status).toBe('ZONA_PERIGO');
      expect(distress.altmanZScore.zScoreBrasilEmergingValue).toBeLessThan(1.10);
    });

    it('verifies exact threshold boundaries for Kanitz Thermometer (0.0 and -3.0)', () => {
      const solventInput: FinancialInputData = {
        ...baseInput,
        lucroLiquido: 100000,
        patrimonioLiquido: 500000,
        ativoCirculante: 400000,
        realizavelLongoPrazo: 100000,
        passivoCirculante: 150000,
        passivoNaoCirculante: 100000,
        estoques: 50000
      };
      const solvRes = calculateSolvencyAndCreditRisk(solventInput);
      expect(solvRes.kanitzTermometro.status).toBe('SOLVENTE');
      expect(solvRes.kanitzTermometro.fatorInsolvencia).toBeGreaterThan(0);

      const insolventInput: FinancialInputData = {
        ...baseInput,
        lucroLiquido: -300000,
        patrimonioLiquido: 50000,
        ativoCirculante: 100000,
        realizavelLongoPrazo: 0,
        passivoCirculante: 600000,
        passivoNaoCirculante: 400000,
        estoques: 80000
      };
      const insolvRes = calculateSolvencyAndCreditRisk(insolventInput);
      expect(insolvRes.kanitzTermometro.status).toBe('INSOLVENTE');
      expect(insolvRes.kanitzTermometro.fatorInsolvencia).toBeLessThan(-3.0);
    });
  });

  describe('5. Newton-Raphson IRR Solver and What-If Capital Budgeting Stress', () => {
    it('handles zero or negative capex without infinite loop or NaN', () => {
      expect(solveIrrNewtonRaphson(0, [100, 200])).toBe(0);
      expect(solveIrrNewtonRaphson(-5000, [100, 200])).toBe(0);
      expect(solveIrrNewtonRaphson(10000, [])).toBe(0);
    });

    it('returns negative baseline when total cash flow is less than capex (unprofitable project)', () => {
      const irr = solveIrrNewtonRaphson(100000, [10000, 10000, 10000]);
      expect(irr).toBe(-0.05);
    });

    it('solves exact IRR for high cash flows and rapidly converging annuities', () => {
      const capex = 1000;
      const cashFlows = [500, 600, 700];
      const irr = solveIrrNewtonRaphson(capex, cashFlows);
      
      let npvAtIrr = -capex;
      for (let t = 1; t <= cashFlows.length; t++) {
        npvAtIrr += cashFlows[t - 1] / Math.pow(1 + irr, t);
      }
      expect(Math.abs(npvAtIrr)).toBeLessThan(1e-4);
    });

    it('handles multi-sign cash flows in Newton-Raphson solver without non-convergence', () => {
      const capex = 1000;
      const multiSignFlows = [500, -200, 800, -100, 600];
      const irr = solveIrrNewtonRaphson(capex, multiSignFlows);

      expect(Number.isFinite(irr)).toBe(true);
      expect(irr).toBeGreaterThan(0);

      let npvAtIrr = -capex;
      for (let t = 1; t <= multiSignFlows.length; t++) {
        npvAtIrr += multiSignFlows[t - 1] / Math.pow(1 + irr, t);
      }
      expect(Math.abs(npvAtIrr)).toBeLessThan(1e-4);
    });

    it('stress-tests extreme discount rates (TMA=0%, TMA=50%, TMA=200%) in Capital Budgeting', () => {
      const scenarioZeroTma: ExpansionScenarioInput = {
        nomeCenario: 'TMA Zero',
        investimentoInicialCapex: 100000,
        vidaUtilMeses: 24,
        taxaMinimaAtratividadeTmaAnual: 0,
        receitaIncrementalMensal: 20000,
        custoVariavelPercent: 30,
        custoFixoIncrementalMensal: 5000,
        depreciacaoMensal: 1000
      };
      const resZero = calculateCapitalBudgeting(scenarioZeroTma);
      expect(Number.isFinite(resZero.vpl)).toBe(true);
      expect(Number.isFinite(resZero.tirPercentAnual)).toBe(true);
      expect(resZero.paybackSimplesMeses).toBeLessThanOrEqual(24);

      const scenarioHighTma: ExpansionScenarioInput = {
        ...scenarioZeroTma,
        taxaMinimaAtratividadeTmaAnual: 200
      };
      const resHigh = calculateCapitalBudgeting(scenarioHighTma);
      expect(Number.isFinite(resHigh.vpl)).toBe(true);
      expect(resHigh.vpl).toBeLessThan(resZero.vpl);
    });

    it('verifies exact linear interpolation of fractional month payback', () => {
      const fractionalScenario: ExpansionScenarioInput = {
        nomeCenario: 'Payback Test',
        investimentoInicialCapex: 100,
        vidaUtilMeses: 10,
        taxaMinimaAtratividadeTmaAnual: 0,
        receitaIncrementalMensal: 40,
        custoVariavelPercent: 0,
        custoFixoIncrementalMensal: 0,
        depreciacaoMensal: 0,
        aliquotaImpostosPercent: 0
      };

      const result = calculateCapitalBudgeting(fractionalScenario);
      expect(result.paybackSimplesMeses).toBe(2.5);
      expect(result.paybackDescontadoMeses).toBe(2.5);
    });

    it('handles projects that never recover investment within lifespan', () => {
      const unpayableScenario: ExpansionScenarioInput = {
        nomeCenario: 'Never Payback',
        investimentoInicialCapex: 1000000,
        vidaUtilMeses: 12,
        taxaMinimaAtratividadeTmaAnual: 15,
        receitaIncrementalMensal: 5000,
        custoVariavelPercent: 50,
        custoFixoIncrementalMensal: 10000,
        depreciacaoMensal: 500
      };

      const result = calculateCapitalBudgeting(unpayableScenario);
      expect(result.statusViabilidade).toBe('INVIAVEL');
      expect(result.paybackSimplesMeses).toBeGreaterThan(12);
      expect(result.paybackDescontadoMeses).toBeGreaterThan(12);
      expect(result.vpl).toBeLessThan(0);
    });
  });

  describe('6. Break-Even Analysis Edge Cases and Zero Margin', () => {
    it('handles equal sale price and variable cost (zero contribution margin) safely', () => {
      const zeroMarginScenario: ExpansionScenarioInput = {
        nomeCenario: 'Zero MC',
        investimentoInicialCapex: 50000,
        vidaUtilMeses: 12,
        receitaIncrementalMensal: 50000,
        precoVendaUnitarioMedio: 100,
        custoVariavelUnitarioMedio: 100,
        custoFixoIncrementalMensal: 10000
      };

      const be = calculateBreakEvenAnalysis(zeroMarginScenario);
      expect(Number.isFinite(be.pontoEquilibrioContabilValor)).toBe(true);
      expect(Number.isFinite(be.margemSegurancaPercent)).toBe(true);
    });
  });
});
