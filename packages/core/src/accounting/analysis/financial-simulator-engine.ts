/**
 * SOBERANO CONTÁBIL — FINANCIAL SIMULATOR & CAPITAL BUDGETING ENGINE
 * What-If scenario simulations, Break-Even analysis (Accounting, Financial, Economic),
 * Margin of Safety, NPV (VPL), IRR (TIR via Newton-Raphson quadratic solver),
 * and Simple & Discounted Payback with precise fractional month interpolation.
 */

import {
  ExpansionScenarioInput,
  BreakEvenAnalysisResult,
  CapitalBudgetingResult,
  CompleteSimulationResult,
  MonthlyCashFlowProjection
} from '../../types/financial-simulator.js';
import { safeDivide, round } from './financial-ratios-engine.js';

export const PRESET_EXPANSION_SCENARIOS: Record<string, ExpansionScenarioInput> = {
  NOVA_FILIAL: {
    nomeCenario: 'Abertura de Nova Filial Comercial',
    investimentoInicialCapex: 250000,
    vidaUtilMeses: 36,
    taxaMinimaAtratividadeTmaAnual: 12,
    receitaIncrementalMensal: 80000,
    custoVariavelPercent: 45,
    custoFixoIncrementalMensal: 25000,
    depreciacaoMensal: 3500,
    precoVendaUnitarioMedio: 150,
    custoVariavelUnitarioMedio: 67.5,
    custoOportunidadeCapitalProprioMensal: 2500,
    aliquotaImpostosPercent: 12
  },
  CONTRATACAO_EQUIPE: {
    nomeCenario: 'Expansão de Equipe e Força de Vendas',
    investimentoInicialCapex: 60000,
    vidaUtilMeses: 24,
    taxaMinimaAtratividadeTmaAnual: 12,
    receitaIncrementalMensal: 45000,
    custoVariavelPercent: 30,
    custoFixoIncrementalMensal: 18000,
    depreciacaoMensal: 1000,
    precoVendaUnitarioMedio: 100,
    custoVariavelUnitarioMedio: 30,
    custoOportunidadeCapitalProprioMensal: 600,
    aliquotaImpostosPercent: 10
  },
  NOVA_MAQUINA: {
    nomeCenario: 'Aquisição de Maquinário / Equipamento de Alta Eficiência',
    investimentoInicialCapex: 180000,
    vidaUtilMeses: 48,
    taxaMinimaAtratividadeTmaAnual: 14,
    receitaIncrementalMensal: 60000,
    custoVariavelPercent: 35,
    custoFixoIncrementalMensal: 15000,
    depreciacaoMensal: 3750,
    precoVendaUnitarioMedio: 200,
    custoVariavelUnitarioMedio: 70,
    custoOportunidadeCapitalProprioMensal: 1800,
    aliquotaImpostosPercent: 15
  }
};

export function calculateBreakEvenAnalysis(scenario: ExpansionScenarioInput): BreakEvenAnalysisResult & {
  pontoEquilibrioContabilMensal: number;
  pontoEquilibrioFinanceiroMensal: number;
  pontoEquilibrioEconomicoMensal: number;
  margemSegurancaOperacionalPercent: number;
} {
  const receita = scenario.receitaIncrementalMensal || 0;
  const precoMedio = scenario.precoVendaUnitarioMedio || 100;
  const custoVarUnit = scenario.custoVariavelUnitarioMedio || 40;
  const custosFixos = scenario.custoFixoIncrementalMensal || 0;
  const depreciacao = scenario.depreciacaoMensal || 0;
  const custoOportunidade = scenario.custoOportunidadeCapitalProprioMensal || 0;

  // Margem de Contribuição Unitária e Percentual
  const margemContribuicaoUnit = Math.max(0.01, precoMedio - custoVarUnit);
  const margemContribuicaoPercent = safeDivide(margemContribuicaoUnit, precoMedio) * 100;

  // 1. Ponto de Equilíbrio Contábil (PEC) = Custos Fixos / MC
  const pecQtd = safeDivide(custosFixos, margemContribuicaoUnit);
  const pecValor = pecQtd * precoMedio;

  // 2. Ponto de Equilíbrio Financeiro (PEF) = (Custos Fixos - Depreciação) / MC
  const custosDesembolsaveis = Math.max(0, custosFixos - depreciacao);
  const pefQtd = safeDivide(custosDesembolsaveis, margemContribuicaoUnit);
  const pefValor = pefQtd * precoMedio;

  // 3. Ponto de Equilíbrio Econômico (PEE) = (Custos Fixos + Custo Oportunidade) / MC
  const peeQtd = safeDivide(custosFixos + custoOportunidade, margemContribuicaoUnit);
  const peeValor = peeQtd * precoMedio;

  // Margem de Segurança = (Receita Projetada - PEC Valor) / Receita Projetada
  const margemSegurancaValor = Math.max(0, receita - pecValor);
  const margemSegurancaPercent = receita > 0 ? safeDivide(receita - pecValor, receita) * 100 : 0;

  // Grau de Alavancagem Operacional (GAO) = MC Total / Lucro Operacional
  const mcTotal = receita * (margemContribuicaoPercent / 100);
  const lucroOperacional = mcTotal - custosFixos;
  const gao = lucroOperacional > 0 ? safeDivide(mcTotal, lucroOperacional) : 999;

  return {
    pontoEquilibrioContabilValor: round(pecValor, 2),
    pontoEquilibrioContabilMensal: round(pecValor, 2),
    pontoEquilibrioContabilQuantidade: round(pecQtd, 0),
    pontoEquilibrioFinanceiroValor: round(pefValor, 2),
    pontoEquilibrioFinanceiroMensal: round(pefValor, 2),
    pontoEquilibrioFinanceiroQuantidade: round(pefQtd, 0),
    pontoEquilibrioEconomicoValor: round(peeValor, 2),
    pontoEquilibrioEconomicoMensal: round(peeValor, 2),
    pontoEquilibrioEconomicoQuantidade: round(peeQtd, 0),
    margemSegurancaValor: round(margemSegurancaValor, 2),
    margemSegurancaPercent: round(margemSegurancaPercent, 2),
    margemSegurancaOperacionalPercent: round(margemSegurancaPercent, 2),
    grauAlavancagemOperacionalGao: round(gao, 2),
    margemContribuicaoTotal: round(mcTotal, 2),
    margemContribuicaoPercent: round(margemContribuicaoPercent, 2)
  };
}

export function solveIrrNewtonRaphson(
  capex: number,
  cashFlows: number[],
  maxIterations: number = 100,
  tolerance: number = 1e-7
): number {
  if (capex <= 0 || cashFlows.length === 0) return 0;
  
  const sumFlows = cashFlows.reduce((a, b) => a + b, 0);
  if (sumFlows <= capex) {
    return -0.05;
  }

  let r = 0.02;

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = -capex;
    let dNpv = 0;

    for (let t = 1; t <= cashFlows.length; t++) {
      const cf = cashFlows[t - 1];
      const factor = Math.pow(1 + r, t);
      npv += cf / factor;
      dNpv -= (t * cf) / (factor * (1 + r));
    }

    if (Math.abs(npv) < tolerance) {
      return r;
    }

    if (Math.abs(dNpv) < 1e-12) {
      break;
    }

    const nextR = r - (npv / dNpv);
    if (Math.abs(nextR - r) < tolerance) {
      return nextR;
    }

    r = nextR;
    if (r < -0.99) r = -0.99;
    if (r > 5.0) r = 5.0;
  }

  return r;
}

export function calculateCapitalBudgeting(scenario: ExpansionScenarioInput): CapitalBudgetingResult {
  const capex = Math.max(1, scenario.investimentoInicialCapex || 1);
  const meses = Math.max(1, Math.min(120, scenario.vidaUtilMeses || 36));
  const receita = scenario.receitaIncrementalMensal || 0;
  const cvPercent = (scenario.custoVariavelPercent || 0) / 100;
  const cv = receita * cvPercent;
  const cf = scenario.custoFixoIncrementalMensal || 0;
  const dep = scenario.depreciacaoMensal || 0;
  const aliquota = (scenario.aliquotaImpostosPercent !== undefined ? scenario.aliquotaImpostosPercent : 15) / 100;

  const lucroOperacional = receita - cv - cf;
  const impostos = lucroOperacional > 0 ? lucroOperacional * aliquota : 0;
  const lucroLiquidoMensal = lucroOperacional - impostos;
  const fluxoLiquidoMensal = Math.max(0, lucroLiquidoMensal + dep);

  const tmaAnual = (scenario.taxaMinimaAtratividadeTmaAnual || 12) / 100;
  const taxaMensal = Math.pow(1 + tmaAnual, 1 / 12) - 1;

  const fluxos: MonthlyCashFlowProjection[] = [];
  const cashFlowArray: number[] = [];

  let acumuladoSimples = -capex;
  let acumuladoDescontado = -capex;
  let paybackSimples = meses;
  let paybackDescontado = meses;
  let paybackSimplesEncontrado = false;
  let paybackDescontadoEncontrado = false;

  let vpl = -capex;

  for (let m = 1; m <= meses; m++) {
    const fDescontado = safeDivide(fluxoLiquidoMensal, Math.pow(1 + taxaMensal, m));
    vpl += fDescontado;
    cashFlowArray.push(fluxoLiquidoMensal);

    const prevSimples = acumuladoSimples;
    acumuladoSimples += fluxoLiquidoMensal;

    const prevDesc = acumuladoDescontado;
    acumuladoDescontado += fDescontado;

    if (!paybackSimplesEncontrado && acumuladoSimples >= 0) {
      const fracao = fluxoLiquidoMensal > 0 ? safeDivide(Math.abs(prevSimples), fluxoLiquidoMensal) : 0;
      paybackSimples = (m - 1) + fracao;
      paybackSimplesEncontrado = true;
    }

    if (!paybackDescontadoEncontrado && acumuladoDescontado >= 0) {
      const fracaoDesc = fDescontado > 0 ? safeDivide(Math.abs(prevDesc), fDescontado) : 0;
      paybackDescontado = (m - 1) + fracaoDesc;
      paybackDescontadoEncontrado = true;
    }

    fluxos.push({
      mes: m,
      receita: round(receita, 2),
      custosVariaveis: round(cv, 2),
      custosFixos: round(cf, 2),
      depreciacao: round(dep, 2),
      lucroOperacional: round(lucroOperacional, 2),
      impostos: round(impostos, 2),
      fluxoCaixaLiquido: round(fluxoLiquidoMensal, 2),
      fluxoDescontado: round(fDescontado, 2),
      fluxoAcumulado: round(acumuladoSimples, 2),
      fluxoAcumuladoDescontado: round(acumuladoDescontado, 2)
    });
  }

  if (!paybackSimplesEncontrado) paybackSimples = meses + 99;
  if (!paybackDescontadoEncontrado) paybackDescontado = meses + 99;

  const tirMensal = solveIrrNewtonRaphson(capex, cashFlowArray);
  const tirAnual = tirMensal > -0.99 ? (Math.pow(1 + tirMensal, 12) - 1) * 100 : -100;

  const il = safeDivide(vpl + capex, capex);

  let status: 'ALTAMENTE_VIAVEL' | 'VIAVEL_COM_RESSALVAS' | 'INVIAVEL' = 'ALTAMENTE_VIAVEL';
  let parecer = '';

  if (vpl > 0 && tirAnual >= (scenario.taxaMinimaAtratividadeTmaAnual || 12) * 1.5 && paybackDescontado <= meses * 0.7) {
    status = 'ALTAMENTE_VIAVEL';
    parecer = `PROJETO ALTAMENTE RECOMENDADO: VPL de +R$ ${vpl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com TIR de ${tirAnual.toFixed(2)}% a.a superando com folga a TMA (${(scenario.taxaMinimaAtratividadeTmaAnual || 12)}% a.a.). O investimento se paga em ${paybackDescontado.toFixed(1)} meses descontados.`;
  } else if (vpl > 0) {
    status = 'VIAVEL_COM_RESSALVAS';
    parecer = `PROJETO VIÁVEL COM RESSALVAS: VPL positivo (+R$ ${vpl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}), porém com margem de segurança moderada. Recomenda-se estrito controle orçamentário no Capex para evitar estouro de custos.`;
  } else {
    status = 'INVIAVEL';
    parecer = `PROJETO INVIÁVEL: VPL negativo (-R$ ${Math.abs(vpl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) e TIR inferior à taxa de atratividade. A geração de caixa projetada não remunera o capital investido.`;
  }

  return {
    fluxosMensais: fluxos,
    vpl: round(vpl, 2),
    tirPercentAnual: round(tirAnual, 2),
    tirPercentMensal: round(tirMensal * 100, 2),
    paybackSimplesMeses: round(paybackSimples, 1),
    paybackDescontadoMeses: round(paybackDescontado, 1),
    indiceLucratividadeIl: round(il, 2),
    statusViabilidade: status,
    parecerViabilidade: parecer
  };
}

export function runExpansionSimulation(scenario: ExpansionScenarioInput): CompleteSimulationResult & {
  breakEven: BreakEvenAnalysisResult & {
    pontoEquilibrioContabilMensal: number;
    pontoEquilibrioFinanceiroMensal: number;
    pontoEquilibrioEconomicoMensal: number;
    margemSegurancaOperacionalPercent: number;
  };
} {
  const breakEven = calculateBreakEvenAnalysis(scenario);
  const capitalBudgeting = calculateCapitalBudgeting(scenario);

  return {
    cenario: scenario,
    breakEven,
    capitalBudgeting,
    dataSimulacao: new Date().toISOString()
  };
}
