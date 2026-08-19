import { describe, it, expect } from 'vitest';
import {
  calculateLiquidityRatios,
  calculateProfitabilityRatios,
  calculateDuPont5StageDecomposition,
  calculateSolvencyAndCreditRisk,
  calculateWorkingCapitalAndCycles,
  generateCompleteFinancialAnalysisReport,
  FinancialInputData
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
  PRESET_EXPANSION_SCENARIOS
} from '../src/accounting/analysis/financial-simulator-engine.js';
import { generateCfoExecutiveDossier } from '../src/reports/cfo-executive-dossier.js';
import { BalanceSheet, IncomeStatement } from '../src/types/accounting.js';
import { Company } from '../src/types/company.js';

describe('CFO Financial Analysis & Decision Engine', () => {
  const mockFinancialInput: FinancialInputData = {
    ativoCirculante: 850000,
    disponibilidades: 250000,
    contasAReceber: 300000,
    estoques: 200000,
    realizavelLongoPrazo: 150000,
    ativoPermanenteImobilizado: 1000000,
    totalAtivo: 2000000,

    passivoCirculante: 400000,
    fornecedores: 180000,
    emprestimosFinanciamentosCp: 120000,
    passivoNaoCirculante: 500000,
    emprestimosFinanciamentosLp: 400000,
    patrimonioLiquido: 1100000,
    lucrosAcumuladosRetidos: 400000,
    totalPassivoEPl: 2000000,

    receitaBruta: 3500000,
    deducoesReceita: 300000,
    receitaLiquida: 3200000,
    custoProdutosVendidos: 1600000,
    lucroBruto: 1600000,
    despesasOperacionaisVendasGerais: 800000,
    ebitda: 950000,
    depreciacaoAmortizacao: 150000,
    lucroOperacionalEbit: 800000,
    despesasFinanceirasLiquidas: 80000,
    lucroAntesImpostosEbt: 720000,
    impostosSobreLucro: 180000,
    lucroLiquido: 540000,

    tenantId: 'tenant-test-1',
    empresa: 'Indústria e Comércio Alpha S/A',
    cnpj: '12.345.678/0001-90',
    periodo: '2026'
  };

  describe('1. Liquidity Ratios Engine', () => {
    it('calculates standard liquidity ratios accurately', () => {
      const ratios = calculateLiquidityRatios(mockFinancialInput);

      expect(ratios.liquidezCorrente).toBeCloseTo(850000 / 400000, 2);
      expect(ratios.liquidezSeca).toBeCloseTo((850000 - 200000) / 400000, 2);
      expect(ratios.liquidezImediata).toBe(0.63);
      expect(ratios.liquidezGeral).toBeCloseTo((850000 + 150000) / (400000 + 500000), 2);
      expect(ratios.status).toBe('EXCELENTE');
      expect(ratios.diagnostico).toContain('Excelente folga financeira');
    });

    it('handles zero liabilities edge case gracefully', () => {
      const zeroLiabilities: FinancialInputData = {
        ...mockFinancialInput,
        passivoCirculante: 0,
        passivoNaoCirculante: 0
      };
      const ratios = calculateLiquidityRatios(zeroLiabilities);
      expect(ratios.liquidezCorrente).toBe(999);
      expect(ratios.liquidezSeca).toBe(999);
    });
  });

  describe('2. Profitability Ratios & Margins', () => {
    it('computes gross, ebitda, ebit, and net margins correctly', () => {
      const prof = calculateProfitabilityRatios(mockFinancialInput);

      expect(prof.margemBrutaPercent).toBeCloseTo((1600000 / 3200000) * 100, 2);
      expect(prof.margemEbitdaPercent).toBeCloseTo((950000 / 3200000) * 100, 2);
      expect(prof.margemOperacionalPercent).toBeCloseTo((800000 / 3200000) * 100, 2);
      expect(prof.margemLiquidaPercent).toBeCloseTo((540000 / 3200000) * 100, 2);
      expect(prof.roePercent).toBeCloseTo((540000 / 1100000) * 100, 2);
      expect(prof.roaPercent).toBeCloseTo((540000 / 2000000) * 100, 2);
      expect(prof.roicPercent).toBeGreaterThan(0);
      expect(prof.status).toBe('EXCELENTE');
    });
  });

  describe('3. DuPont 5-Stage Decomposition with Zero Discrepancy', () => {
    it('proves strict mathematical identity: Tax Burden * Interest Burden * EBIT Margin * Asset Turnover * Equity Multiplier = ROE', () => {
      const dupont = calculateDuPont5StageDecomposition(mockFinancialInput);

      expect(dupont.taxBurden).toBeCloseTo(540000 / 720000, 4);
      expect(dupont.interestBurden).toBeCloseTo(720000 / 800000, 4);
      expect(dupont.ebitMargin).toBeCloseTo(800000 / 3200000, 4);
      expect(dupont.assetTurnover).toBeCloseTo(3200000 / 2000000, 4);
      expect(dupont.equityMultiplier).toBeCloseTo(2000000 / 1100000, 4);

      expect(dupont.discrepancia).toBeLessThan(0.005);
      expect(dupont.isIdentidadeVerificada).toBe(true);
      expect(dupont.isPassivoADescoberto).toBe(false);
    });

    it('identifies passivo a descoberto (negative equity) properly', () => {
      const negativeEquityInput: FinancialInputData = {
        ...mockFinancialInput,
        patrimonioLiquido: -200000
      };
      const dupont = calculateDuPont5StageDecomposition(negativeEquityInput);
      expect(dupont.isPassivoADescoberto).toBe(true);
      expect(dupont.interpretacao).toContain('Passivo a Descoberto');
    });
  });

  describe('4. Solvency & Credit Risk (Altman Z" Brasil & Stephen Kanitz)', () => {
    it('evaluates Altman Z" Emerging Markets Brasil and Kanitz Thermometer in safe zone', () => {
      const solvency = calculateSolvencyAndCreditRisk(mockFinancialInput);

      expect(solvency.altmanZScore.zScoreBrasilEmergingValue).toBeGreaterThan(2.60);
      expect(solvency.altmanZScore.status).toBe('ZONA_SEGURA');
      expect(solvency.kanitzTermometro.fatorInsolvencia).toBeGreaterThan(0);
      expect(solvency.kanitzTermometro.status).toBe('SOLVENTE');
      expect(solvency.status).toBe('EXCELENTE');
    });

    it('detects high-risk distress scenario accurately', () => {
      const distressedInput: FinancialInputData = {
        ...mockFinancialInput,
        ativoCirculante: 200000,
        passivoCirculante: 800000,
        passivoNaoCirculante: 1200000,
        patrimonioLiquido: 50000,
        lucroLiquido: -300000,
        lucroOperacionalEbit: -150000,
        lucrosAcumuladosRetidos: 0
      };
      const solvency = calculateSolvencyAndCreditRisk(distressedInput);
      expect(solvency.altmanZScore.status).toBe('ZONA_PERIGO');
      expect(solvency.kanitzTermometro.status).toBe('INSOLVENTE');
      expect(solvency.status).toBe('CRITICO');
    });
  });

  describe('5. Working Capital & Fleuriet Model', () => {
    it('computes PME, PMRV, PMPF, Operating/Cash Cycle and classifies Fleuriet structure', () => {
      const wc = calculateWorkingCapitalAndCycles(mockFinancialInput);

      expect(wc.prazoMedioEstocagemPme).toBeGreaterThan(0);
      expect(wc.prazoMedioRecebimentoPmrv).toBeGreaterThan(0);
      expect(wc.prazoMedioPagamentoPmpf).toBeGreaterThan(0);
      expect(wc.cicloOperacionalDias).toBe(wc.prazoMedioEstocagemPme + wc.prazoMedioRecebimentoPmrv);
      expect(wc.cicloCaixaFinanceiroDias).toBe(wc.cicloOperacionalDias - wc.prazoMedioPagamentoPmpf);

      expect(wc.capitalGiroLiquidoCdg).toBe(850000 - 400000);
      expect(wc.saldoTesouraria).toBe(wc.capitalGiroLiquidoCdg - wc.necessidadeCapitalGiroNcg);
      expect(wc.efeitoTesouraDetectado).toBe(false);
      expect(wc.classificacaoFleuriet.tipo).toBeLessThanOrEqual(2);
    });

    it('detects Efeito Tesoura (Scissors Effect) when short debt balloons', () => {
      const scissorsInput: FinancialInputData = {
        ...mockFinancialInput,
        ativoCirculante: 500000,
        disponibilidades: 10000,
        estoques: 300000,
        contasAReceber: 190000,
        passivoCirculante: 700000,
        emprestimosFinanciamentosCp: 500000,
        fornecedores: 200000
      };
      const wc = calculateWorkingCapitalAndCycles(scissorsInput);
      expect(wc.efeitoTesouraDetectado).toBe(true);
      expect(wc.classificacaoFleuriet.tipo).toBe(5);
    });
  });

  describe('6. Complete Financial Analysis Report Generation', () => {
    it('aggregates all 5 dimensions into a unified score and report', () => {
      const report = generateCompleteFinancialAnalysisReport(mockFinancialInput);

      expect(report.scoreGeralSaude).toBeGreaterThanOrEqual(80);
      expect(report.statusGeral).toBe('EXCELENTE');
      expect(report.resumoExecutivo.length).toBe(5);
      expect(report.tenantId).toBe('tenant-test-1');
      expect(report.empresa).toBe('Indústria e Comércio Alpha S/A');
    });
  });

  describe('7. CFO Decision Copilot & Prescriptive Diagnostics', () => {
    it('cross-references tax monofásicos, Fator R, Free Cash Flows, and safe debt capacity', () => {
      const financialReport = generateCompleteFinancialAnalysisReport(mockFinancialInput);
      const copilotInput: CfoCopilotInput = {
        financialReport,
        massaSalarialTotal: 450000,
        encargosFolhaTotal: 150000,
        headcount: 25,
        economiaMonofasicaTotal: 84000,
        creditosTributariosApurados: 25000,
        regimeTributario: 'SIMPLES_NACIONAL',
        alavancagemDesejadaMultiplicador: 2.5
      };

      const result = runCfoPrescriptiveCopilot(copilotInput);

      expect(result.crossMetrics.fatorRPercent).toBeGreaterThan(0);
      expect(result.crossMetrics.freeCashFlowFirmFCFF).toBeGreaterThan(0);
      expect(result.crossMetrics.freeCashFlowEquityFCFE).toBeGreaterThan(0);

      expect(result.creditCapacity.statusCredito).toBe('APTO_A_EXPANSAO');
      expect(result.creditCapacity.capacidadeAdicionalCreditoSaudavel).toBeGreaterThan(0);

      expect(result.diagnostics.length).toBeGreaterThanOrEqual(4);
      expect(result.allocationPlan.reservaOperacionalPercent).toBe(25);
      expect(result.allocationPlan.reinvestimentoExpansaoPercent).toBe(45);
      expect(result.allocationPlan.distribuicaoDividendosPercent).toBe(30);
    });
  });

  describe('8. Financial Simulator & What-If Engine', () => {
    it('computes PEC, PEF, PEE, Margin of Safety and Capital Budgeting (NPV, IRR, Payback)', () => {
      const scenario = PRESET_EXPANSION_SCENARIOS.NOVA_FILIAL;
      const simulation = runExpansionSimulation(scenario);

      // Break-even
      expect(simulation.breakEven.pontoEquilibrioContabilMensal).toBeGreaterThan(0);
      expect(simulation.breakEven.pontoEquilibrioFinanceiroMensal).toBeLessThan(simulation.breakEven.pontoEquilibrioContabilMensal);
      expect(simulation.breakEven.pontoEquilibrioEconomicoMensal).toBeGreaterThan(simulation.breakEven.pontoEquilibrioContabilMensal);
      expect(simulation.breakEven.margemSegurancaOperacionalPercent).toBeGreaterThan(0);

      // Capital Budgeting
      expect(simulation.capitalBudgeting.fluxosMensais.length).toBe(36);
      expect(simulation.capitalBudgeting.vpl).toBeGreaterThan(0);
      expect(simulation.capitalBudgeting.tirPercentAnual).toBeGreaterThan(12);
      expect(simulation.capitalBudgeting.paybackDescontadoMeses).toBeLessThan(36);
      expect(simulation.capitalBudgeting.statusViabilidade).toBe('ALTAMENTE_VIAVEL');
    });

    it('validates Newton-Raphson IRR solver directly', () => {
      const capex = 100000;
      const cashFlows = Array(12).fill(10000);
      const irr = solveIrrNewtonRaphson(capex, cashFlows);
      expect(irr).toBeGreaterThan(0.01);
      expect(irr).toBeLessThan(0.05);
    });
  });

  describe('9. Executive Dossier Generation & Security Audit', () => {
    it('compiles full dossier with SHA-256 hash and governance signatures', () => {
      const financialReport = generateCompleteFinancialAnalysisReport(mockFinancialInput);
      const cfoReport = runCfoPrescriptiveCopilot({
        financialReport,
        massaSalarialTotal: 400000,
        encargosFolhaTotal: 120000,
        headcount: 20
      });
      const simulation = runExpansionSimulation(PRESET_EXPANSION_SCENARIOS.NOVA_FILIAL);

      const mockCompany: Company = {
        id: 'comp-1',
        razaoSocial: 'SOBERANO INDÚSTRIA E COMÉRCIO LTDA',
        cnpj: '12.345.678/0001-90',
        regimeTributario: 'LUCRO_PRESUMIDO',
        cnaePrincipal: '6920-6/01',
        uf: 'SP',
        tenantId: 'tenant-test-1',
        tipoCertificado: 'A1',
        status: 'ACTIVE'
      };

      const mockBalanceSheet: BalanceSheet = {
        dataReferencia: '2026-12-31',
        ativoCirculante: [{ codigoConta: '1.1.01', descricao: 'Caixa', saldoInicial: 100000, totalDebitos: 200000, totalCreditos: 50000, valorPeriodoAtual: 250000, valorPeriodoAnterior: 100000 }],
        ativoNaoCirculante: [{ codigoConta: '1.2.01', descricao: 'Imobilizado', saldoInicial: 900000, totalDebitos: 150000, totalCreditos: 50000, valorPeriodoAtual: 1000000, valorPeriodoAnterior: 900000 }],
        totalAtivo: 2000000,
        passivoCirculante: [{ codigoConta: '2.1.01', descricao: 'Fornecedores', saldoInicial: 100000, totalDebitos: 50000, totalCreditos: 130000, valorPeriodoAtual: 180000, valorPeriodoAnterior: 100000 }],
        passivoNaoCirculante: [{ codigoConta: '2.2.01', descricao: 'Financiamentos', saldoInicial: 450000, totalDebitos: 50000, totalCreditos: 100000, valorPeriodoAtual: 500000, valorPeriodoAnterior: 450000 }],
        patrimonioLiquido: [{ codigoConta: '2.3.01', descricao: 'Capital Social', saldoInicial: 1000000, totalDebitos: 0, totalCreditos: 100000, valorPeriodoAtual: 1100000, valorPeriodoAnterior: 1000000 }],
        totalPassivoEPatrimonioLiquido: 2000000
      };

      const mockIncomeStatement: IncomeStatement = {
        periodo: '2026',
        receitaBruta: 3500000,
        deducoesReceitaBruta: 300000,
        receitaLiquida: 3200000,
        custosOperacionais: 1600000,
        lucroBruto: 1600000,
        despesasOperacionais: 800000,
        resultadoOperacional: 800000,
        receitasFinanceiras: 20000,
        despesasFinanceiras: 100000,
        resultadoAntesTributacao: 720000,
        provisaoIrpjCsll: 180000,
        lucroLiquidoExercicio: 540000
      };

      const dossierResult = generateCfoExecutiveDossier(
        mockCompany,
        financialReport,
        cfoReport,
        mockBalanceSheet,
        mockIncomeStatement,
        simulation
      );

      expect(dossierResult.isOk()).toBe(true);
      const dossier = dossierResult._unsafeUnwrap();
      expect(dossier.cabecalho.empresa).toBe('SOBERANO INDÚSTRIA E COMÉRCIO LTDA');
      expect(dossier.cabecalho.hashIntegridadeSha256).toContain('SHA256:cfo_12345678000190');
      expect(dossier.sumarioExecutivo.scoreGeralSaude).toBeGreaterThanOrEqual(80);
      expect(dossier.governancaESignatures.contadorCrc).toContain('CRC/SP');
    });
  });
});
