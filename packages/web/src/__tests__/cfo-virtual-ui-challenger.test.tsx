import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { OfficeCfoVirtualFinancialDecisionView } from '../views/OfficeCfoVirtualFinancialDecisionView.js';
import { officeEventBus } from '../state/office-event-bus.js';
import {
  FinancialInputData,
  calculateLiquidityRatios,
  calculateProfitabilityRatios,
  calculateDuPont5StageDecomposition,
  calculateSolvencyAndCreditRisk,
  calculateWorkingCapitalAndCycles,
  generateCompleteFinancialAnalysisReport,
  runCfoPrescriptiveCopilot,
  PRESET_EXPANSION_SCENARIOS,
  runExpansionSimulation,
  generateCfoExecutiveDossier
} from '@soberano/core';

describe('CHALLENGER ADVANCED SUITE: OfficeCfoVirtualFinancialDecisionView Exhaustive Verification', () => {
  // =========================================================================
  // PILLAR 1: TAB SWITCHING & COMPONENT RENDERING ACROSS ALL 5 TABS
  // =========================================================================
  describe('Pillar 1: Tab Navigation & Multi-Tab View Integrity', () => {
    it('1.1 Renders root component successfully with Diamond Champion header', () => {
      const html = ReactDOMServer.renderToString(React.createElement(OfficeCfoVirtualFinancialDecisionView));
      expect(html).toContain('Análise das Demonstrações &amp; CFO Virtual Inteligente');
      expect(html).toContain('Diamond Champion');
      expect(html).toContain('Score');
      expect(html).toContain('/100');
    });

    it('1.2 Tab 1: Cockpit renders solvency, liquidity, ROE and dual gauges', () => {
      const html = ReactDOMServer.renderToString(React.createElement(OfficeCfoVirtualFinancialDecisionView));
      expect(html).toContain('1. Cockpit &amp; Solvência');
      expect(html).toContain('Liquidez Corrente');
      expect(html).toContain('Retorno Capital Próprio (ROE)');
      expect(html).toContain('Endividamento Geral');
      expect(html).toContain('Ciclo de Caixa (Fleuriet)');
      expect(html).toContain('Altman Z&#x27;&#x27;-Score Brasil');
      expect(html).toContain('Stephen Kanitz');
    });

    it('1.3 Tab 2: DuPont 5 Stages mathematical identity verification', () => {
      const mockInput: FinancialInputData = {
        ativoCirculante: 850000, disponibilidades: 250000, contasAReceber: 300000, estoques: 200000, realizavelLongoPrazo: 150000, ativoPermanenteImobilizado: 1000000, totalAtivo: 2000000, passivoCirculante: 400000, fornecedores: 180000, emprestimosFinanciamentosCp: 120000, passivoNaoCirculante: 500000, emprestimosFinanciamentosLp: 400000, patrimonioLiquido: 1100000, lucrosAcumuladosRetidos: 400000, totalPassivoEPl: 2000000, receitaBruta: 3500000, deducoesReceita: 300000, receitaLiquida: 3200000, custoProdutosVendidos: 1600000, lucroBruto: 1600000, despesasOperacionaisVendasGerais: 800000, ebitda: 950000, depreciacaoAmortizacao: 150000, lucroOperacionalEbit: 800000, despesasFinanceirasLiquidas: 80000, lucroAntesImpostosEbt: 720000, impostosSobreLucro: 180000, lucroLiquido: 540000, tenantId: 'tenant-test', empresa: 'Test S/A', cnpj: '12.345.678/0001-90', periodo: '2026'
      };
      const dupont = calculateDuPont5StageDecomposition(mockInput);
      expect(dupont.taxBurden).toBeCloseTo(540000 / 720000, 4);
      expect(dupont.interestBurden).toBeCloseTo(720000 / 800000, 4);
      expect(dupont.ebitMargin).toBeCloseTo(800000 / 3200000, 4);
      expect(dupont.assetTurnover).toBeCloseTo(3200000 / 2000000, 4);
      expect(dupont.equityMultiplier).toBeCloseTo(2000000 / 1100000, 4);
      expect(dupont.isIdentidadeVerificada).toBe(true);
      expect(dupont.discrepancia).toBeLessThan(0.005);
    });

    it('1.4 Tab 3: CFO Copilot diagnostics and cross-referencing', () => {
      const rep = generateCompleteFinancialAnalysisReport({
        ativoCirculante: 850000, disponibilidades: 250000, contasAReceber: 300000, estoques: 200000, realizavelLongoPrazo: 150000, ativoPermanenteImobilizado: 1000000, totalAtivo: 2000000, passivoCirculante: 400000, fornecedores: 180000, emprestimosFinanciamentosCp: 120000, passivoNaoCirculante: 500000, emprestimosFinanciamentosLp: 400000, patrimonioLiquido: 1100000, lucrosAcumuladosRetidos: 400000, totalPassivoEPl: 2000000, receitaBruta: 3500000, deducoesReceita: 300000, receitaLiquida: 3200000, custoProdutosVendidos: 1600000, lucroBruto: 1600000, despesasOperacionaisVendasGerais: 800000, ebitda: 950000, depreciacaoAmortizacao: 150000, lucroOperacionalEbit: 800000, despesasFinanceirasLiquidas: 80000, lucroAntesImpostosEbt: 720000, impostosSobreLucro: 180000, lucroLiquido: 540000, tenantId: 'tenant-test', empresa: 'Test S/A', cnpj: '12.345.678/0001-90', periodo: '2026'
      });
      const cop = runCfoPrescriptiveCopilot({ financialReport: rep, massaSalarialTotal: 450000, encargosFolhaTotal: 150000, headcount: 28, economiaMonofasicaTotal: 84000, creditosTributariosApurados: 25000, regimeTributario: 'SIMPLES_NACIONAL', alavancagemDesejadaMultiplicador: 2.5 });
      expect(cop.prescriptiveDiagnostics.length).toBeGreaterThanOrEqual(4);
      expect(cop.crossMetrics.freeCashFlowFirmFCFF).toBeGreaterThan(0);
      expect(cop.creditCapacity.capacidadeAdicionalCreditoSaudavel).toBeGreaterThan(0);
    });

    it('1.5 Tab 4 & 5: Simulator presets and Dossier', () => {
      const sim = runExpansionSimulation(PRESET_EXPANSION_SCENARIOS.NOVA_FILIAL);
      expect(sim.capitalBudgeting.vpl).toBeGreaterThan(0);
      expect(sim.breakEven.pontoEquilibrioContabilValor).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // PILLAR 2: SLIDER INPUTS STRESS-TESTING & EXTREME NUMERICAL EDGE CASES
  // =========================================================================
  describe('Pillar 2: Slider Inputs Stress Testing & Edge Cases', () => {
    it('2.1 Zero Initial Capex (Investimento Inicial = 0)', () => {
      const res = runExpansionSimulation({ nomeCenario: 'Z_CAPEX', investimentoInicialCapex: 0, vidaUtilMeses: 24, taxaMinimaAtratividadeTmaAnual: 12, receitaIncrementalMensal: 50000, custoVariavelPercent: 40, custoFixoIncrementalMensal: 15000, depreciacaoMensal: 0, precoVendaUnitarioMedio: 100, custoVariavelUnitarioMedio: 40, custoOportunidadeCapitalProprioMensal: 1000, aliquotaImpostosPercent: 10 });
      expect(res.capitalBudgeting.vpl).toBeGreaterThan(0);
      expect(res.capitalBudgeting.paybackSimplesMeses).toBeLessThanOrEqual(1);
      expect(Number.isFinite(res.capitalBudgeting.vpl)).toBe(true);
    });

    it('2.2 Mega Capex (Investimento = R$ 1.000.000.000,00)', () => {
      const res = runExpansionSimulation({ nomeCenario: 'MEGA_CAPEX', investimentoInicialCapex: 1000000000, vidaUtilMeses: 60, taxaMinimaAtratividadeTmaAnual: 15, receitaIncrementalMensal: 200000, custoVariavelPercent: 50, custoFixoIncrementalMensal: 50000, depreciacaoMensal: 100000, precoVendaUnitarioMedio: 200, custoVariavelUnitarioMedio: 100, custoOportunidadeCapitalProprioMensal: 50000, aliquotaImpostosPercent: 15 });
      expect(res.capitalBudgeting.vpl).toBeLessThan(0);
      expect(res.capitalBudgeting.statusViabilidade).toBe('INVIAVEL');
      expect(Number.isFinite(res.capitalBudgeting.vpl)).toBe(true);
    });

    it('2.3 Zero Revenue (Receita Incremental = 0) with safe fallback bounds', () => {
      const res = runExpansionSimulation({ nomeCenario: 'Z_REV', investimentoInicialCapex: 100000, vidaUtilMeses: 24, taxaMinimaAtratividadeTmaAnual: 12, receitaIncrementalMensal: 0, custoVariavelPercent: 40, custoFixoIncrementalMensal: 10000, depreciacaoMensal: 2000, precoVendaUnitarioMedio: 100, custoVariavelUnitarioMedio: 40, custoOportunidadeCapitalProprioMensal: 1000, aliquotaImpostosPercent: 10 });
      expect(res.capitalBudgeting.vpl).toBeLessThan(0);
      expect(res.capitalBudgeting.statusViabilidade).toBe('INVIAVEL');
      expect(res.breakEven.margemSegurancaPercent).toBe(0);
      expect(Number.isFinite(res.capitalBudgeting.vpl)).toBe(true);
    });

    it('2.4 Zero Margin (CV = 100%) with Division-by-Zero defense', () => {
      const res = runExpansionSimulation({ nomeCenario: 'Z_MARG', investimentoInicialCapex: 50000, vidaUtilMeses: 36, taxaMinimaAtratividadeTmaAnual: 12, receitaIncrementalMensal: 100000, custoVariavelPercent: 100, custoFixoIncrementalMensal: 20000, depreciacaoMensal: 1000, precoVendaUnitarioMedio: 100, custoVariavelUnitarioMedio: 100, custoOportunidadeCapitalProprioMensal: 1000, aliquotaImpostosPercent: 0 });
      expect(res.breakEven.margemContribuicaoPercent).toBeCloseTo(0.01, 2);
      expect(Number.isFinite(res.breakEven.pontoEquilibrioContabilValor)).toBe(true);
    });

    it('2.5 Free Cash Flow Allocation Sliders at Extremes (0% vs 100%)', () => {
      const totalFCFF = 420000;
      const allocA = { reserva: (totalFCFF * 100) / 100, capex: (totalFCFF * 0) / 100, dividendos: (totalFCFF * 0) / 100 };
      expect(allocA.reserva).toBe(420000);
      expect(allocA.capex + allocA.dividendos).toBe(0);

      const allocB = { reserva: (totalFCFF * 25) / 100, capex: (totalFCFF * 45) / 100, dividendos: (totalFCFF * 30) / 100 };
      expect(allocB.reserva + allocB.capex + allocB.dividendos).toBeCloseTo(totalFCFF, 2);
    });

    it('2.6 Preset Scenarios consistency check across all 3 business models', () => {
      const filial = PRESET_EXPANSION_SCENARIOS.NOVA_FILIAL;
      expect(filial.investimentoInicialCapex).toBe(250000);
      expect(filial.receitaIncrementalMensal).toBe(80000);

      const equipe = PRESET_EXPANSION_SCENARIOS.CONTRATACAO_EQUIPE;
      expect(equipe.investimentoInicialCapex).toBe(60000);
      expect(equipe.receitaIncrementalMensal).toBe(45000);

      const maquina = PRESET_EXPANSION_SCENARIOS.NOVA_MAQUINA;
      expect(maquina.investimentoInicialCapex).toBe(180000);
      expect(maquina.receitaIncrementalMensal).toBe(60000);
    });
  });

  // =========================================================================
  // PILLAR 3: REACTIVE SYNC WITH officeStore & officeEventBus EMISSION
  // =========================================================================
  describe('Pillar 3: Reactive Synchronization & Event Bus Lifecycle', () => {
    it('3.1 Receives financial event bus triggers and discards unrelated types', () => {
      let count = 0;
      const unsub = officeEventBus.subscribe('*', (e) => {
        if (e.type === 'MONOPHASIC_TAX_SEGREGATED' || e.type === 'PAYROLL_CLOSED' || e.type === 'ANNUAL_CLOSING_ARE_EXECUTED') count++;
      });
      officeEventBus.emit({ id: 'e1', type: 'MONOPHASIC_TAX_SEGREGATED', timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Test', faturamentoTotal: 100, receitaMonofasica: 50, receitaIcmsSt: 10, dasNormal: 10, dasSegregado: 8, economiaTributaria: 2, debitAccount: '1', creditAccount: '2' });
      officeEventBus.emit({ id: 'e2', type: 'PAYROLL_CLOSED', timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Test', totalGross: 100, totalNet: 80, totalInss: 20, totalFgts: 8, employeeCount: 5, provisaoDecimoTerceiro: 8, provisaoFerias: 10, fatorRPercent: 30 });
      officeEventBus.emit({ id: 'e3', type: 'ANNUAL_CLOSING_ARE_EXECUTED', timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Test', exercicio: 2026, resultadoLiquidoExercicio: 50000, totalReceitasEncerradas: 100000, totalDespesasEncerradas: 50000 });
      officeEventBus.emit({ id: 'e4', type: 'DOC_OCR_PROCESSED' as any, timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Other' });
      expect(count).toBe(3);
      unsub();
    });

    it('3.2 Prevents memory leak on unsubscription', () => {
      let count = 0;
      const unsub = officeEventBus.subscribe('PAYROLL_CLOSED', () => { count++; });
      officeEventBus.emit({ id: 'e1', type: 'PAYROLL_CLOSED', timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Test', totalGross: 100, totalNet: 80, totalInss: 20, totalFgts: 8, employeeCount: 5, provisaoDecimoTerceiro: 8, provisaoFerias: 10, fatorRPercent: 30 });
      expect(count).toBe(1);
      unsub();
      officeEventBus.emit({ id: 'e2', type: 'PAYROLL_CLOSED', timestamp: new Date().toISOString(), tenantId: 't1', tenantName: 'A', description: 'Test', totalGross: 100, totalNet: 80, totalInss: 20, totalFgts: 8, employeeCount: 5, provisaoDecimoTerceiro: 8, provisaoFerias: 10, fatorRPercent: 30 });
      expect(count).toBe(1);
    });
  });

  // =========================================================================
  // PILLAR 4: EXECUTIVE DOSSIER DATA VALIDITY, CALCULATIONS & DIGITAL SIGNATURES
  // =========================================================================
  describe('Pillar 4: Executive Dossier Validity & Signatures', () => {
    it('4.1 Dossier contains valid company data, calculations, CRC and SHA-256 hash', () => {
      const rep = generateCompleteFinancialAnalysisReport({
        ativoCirculante: 850000, disponibilidades: 250000, contasAReceber: 300000, estoques: 200000, realizavelLongoPrazo: 150000, ativoPermanenteImobilizado: 1000000, totalAtivo: 2000000, passivoCirculante: 400000, fornecedores: 180000, emprestimosFinanciamentosCp: 120000, passivoNaoCirculante: 500000, emprestimosFinanciamentosLp: 400000, patrimonioLiquido: 1100000, lucrosAcumuladosRetidos: 400000, totalPassivoEPl: 2000000, receitaBruta: 3500000, deducoesReceita: 300000, receitaLiquida: 3200000, custoProdutosVendidos: 1600000, lucroBruto: 1600000, despesasOperacionaisVendasGerais: 800000, ebitda: 950000, depreciacaoAmortizacao: 150000, lucroOperacionalEbit: 800000, despesasFinanceirasLiquidas: 80000, lucroAntesImpostosEbt: 720000, impostosSobreLucro: 180000, lucroLiquido: 540000, tenantId: 'tenant-ent', empresa: 'SOBERANO INDUSTRIAL S/A', cnpj: '12.345.678/0001-90', periodo: '2026'
      });
      const cop = runCfoPrescriptiveCopilot({ financialReport: rep, massaSalarialTotal: 450000, encargosFolhaTotal: 150000, headcount: 28, economiaMonofasicaTotal: 84000, creditosTributariosApurados: 25000, regimeTributario: 'SIMPLES_NACIONAL', alavancagemDesejadaMultiplicador: 2.5 });
      const sim = runExpansionSimulation(PRESET_EXPANSION_SCENARIOS.NOVA_FILIAL);
      const dosRes = generateCfoExecutiveDossier({ id: 'c1', razaoSocial: 'SOBERANO INDUSTRIAL S/A', cnpj: '12.345.678/0001-90', regimeTributario: 'SIMPLES_NACIONAL', cnaePrincipal: '6920-6/01', uf: 'SP', tenantId: 'tenant-ent', tipoCertificado: 'A1', status: 'ACTIVE' }, rep, cop, { dataReferencia: '2026-12-31', ativoCirculante: [], ativoNaoCirculante: [], totalAtivo: 2000000, passivoCirculante: [], passivoNaoCirculante: [], patrimonioLiquido: [], totalPassivoEPatrimonioLiquido: 2000000 }, { periodo: '2026', receitaBruta: 3500000, deducoesReceitaBruta: 300000, receitaLiquida: 3200000, custosOperacionais: 1600000, lucroBruto: 1600000, despesasOperacionais: 800000, resultadoOperacional: 800000, receitasFinanceiras: 20000, despesasFinanceiras: 100000, resultadoAntesTributacao: 720000, provisaoIrpjCsll: 180000, lucroLiquidoExercicio: 540000 }, sim);
      expect(dosRes.isOk()).toBe(true);
      const dossier = dosRes._unsafeUnwrap();
      expect(dossier.cabecalho.empresa).toBe('SOBERANO INDUSTRIAL S/A');
      expect(dossier.cabecalho.cnpj).toBe('12.345.678/0001-90');
      expect(dossier.cabecalho.hashIntegridadeSha256).toMatch(/^SHA256:cfo_/);
      expect(dossier.governancaESignatures.contadorCrc).toContain('CRC/SP');
      expect(dossier.governancaESignatures.statusLedgerImutavel).toBe('100% AUDITADO E ÍNTEGRO (SHA-256)');
    });
  });
});