/**
 * SOBERANO CONTÁBIL — VIRTUAL CFO FINANCIAL DECISION COPILOT
 * Cross-referencing Accounting, Tax (Monophasic & Fator R), and Payroll.
 * Solvency analysis, Free Cash Flow (FCFF/FCFE), Healthy Debt Capacity,
 * and Prescriptive Multi-Quadrant Diagnostic Generator.
 */

import {
  CfoCrossMetrics,
  HealthyDebtCapacity,
  PrescriptiveDiagnostic,
  CapitalAllocationPlan,
  CfoDecisionReport
} from '../../types/cfo-decision.js';
import { CompleteFinancialAnalysisReport } from '../../types/financial-analysis.js';
import { safeDivide, round } from './financial-ratios-engine.js';

export interface CfoCopilotInput {
  financialReport: CompleteFinancialAnalysisReport;
  massaSalarialTotal: number;
  encargosFolhaTotal?: number;
  headcount?: number;
  economiaMonofasicaTotal?: number;
  creditosTributariosApurados?: number;
  regimeTributario?: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  alavancagemDesejadaMultiplicador?: number;
  despesasFinanceirasJurosMes?: number;
  amortizacaoPrincipalMes?: number;
}

export function calculateCrossReferencedMetrics(input: CfoCopilotInput): CfoCrossMetrics & {
  fatorRPercent: number;
} {
  const fa = input.financialReport;
  const recLiq = fa.profitability.receitaLiquida || 0;
  const ebitda = fa.profitability.ebitda || 0;
  const ebit = fa.profitability.lucroOperacionalEbit || 0;
  const ll = fa.profitability.lucroLiquido || 0;

  const folhaTotal = input.massaSalarialTotal + (input.encargosFolhaTotal || 0);
  const recBruta = recLiq * 1.1; // estimate if not provided
  const fatorR = recBruta > 0 ? safeDivide(folhaTotal, recBruta) * 100 : 0;

  let statusFatorR: 'ENQUADRADO_ANEXO_III' | 'DESENQUADRADO_ANEXO_V' | 'NAO_APLICAVEL' = 'NAO_APLICAVEL';
  let economiaFatorR = 0;

  if (input.regimeTributario === 'SIMPLES_NACIONAL' || !input.regimeTributario) {
    if (fatorR >= 28) {
      statusFatorR = 'ENQUADRADO_ANEXO_III';
      economiaFatorR = recBruta * 0.095;
    } else {
      statusFatorR = 'DESENQUADRADO_ANEXO_V';
    }
  }

  const nopat = ebit * 0.85;
  const depAmort = Math.max(0, ebitda - ebit);
  const capex = ebitda * 0.2;
  const deltaNcg = fa.workingCapital.necessidadeCapitalGiroNcg * 0.1;

  const fcff = nopat + depAmort - capex - deltaNcg;
  const jurosLiq = (input.despesasFinanceirasJurosMes || 8000) * 12;
  const amortDivida = (input.amortizacaoPrincipalMes || 10000) * 12;
  const fcfe = fcff - jurosLiq - amortDivida;

  const econMonofasica = input.economiaMonofasicaTotal || 0;
  const percentFolha = recBruta > 0 ? safeDivide(folhaTotal, recBruta) * 100 : 0;

  return {
    fatorR: round(fatorR, 2),
    fatorRPercent: round(fatorR, 2),
    statusFatorR,
    economiaAnualEstimadaFatorR: round(economiaFatorR, 2),
    economiaMonofasicaAnualRecuperavel: round(econMonofasica, 2),
    impactoFolhaSobreReceitaPercent: round(percentFolha, 2),
    freeCashFlowFirmFCFF: round(fcff, 2),
    freeCashFlowEquityFCFE: round(fcfe, 2),
    ebitdaRunRateAnual: round(ebitda, 2),
    nopat: round(nopat, 2)
  };
}

export function calculateCreditCapacityLimit(
  input: CfoCopilotInput,
  crossMetrics: CfoCrossMetrics
): HealthyDebtCapacity & {
  statusCredito: string;
} {
  const fa = input.financialReport;
  const ebitda = Math.max(1, fa.profitability.ebitda || 1);
  const dividaAtual = fa.solvency.totalPassivoExigivel || 0;
  const multiplicador = input.alavancagemDesejadaMultiplicador || 2.5;

  const limiteMaximoDivida = ebitda * multiplicador;
  const capacidadeAdicional = Math.max(0, limiteMaximoDivida - dividaAtual);

  const servicoDividaAnual = ((input.despesasFinanceirasJurosMes || 8000) + (input.amortizacaoPrincipalMes || 10000)) * 12;
  const dscr = servicoDividaAnual > 0 ? safeDivide(ebitda, servicoDividaAnual) : 999;
  const dividaSobreEbitda = safeDivide(dividaAtual, ebitda);

  let nivelRisco: 'BAIXO' | 'MODERADO' | 'ELEVADO' | 'CRITICO' = 'BAIXO';
  let statusCredito = 'APTO_A_EXPANSAO';
  let recomendacao = '';

  if (dividaSobreEbitda <= 2.5 && dscr >= 1.3) {
    nivelRisco = 'BAIXO';
    statusCredito = 'APTO_A_EXPANSAO';
    recomendacao = `Excelente capacidade de endividamento saudável (Dívida/EBITDA de ${dividaSobreEbitda.toFixed(2)}x). Capacidade adicional de captação de até R$ ${capacidadeAdicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
  } else if (dividaSobreEbitda <= 3.5) {
    nivelRisco = 'MODERADO';
    statusCredito = 'EXPANSAO_MODERADA';
    recomendacao = 'Alavancagem moderada. Recomenda-se cautela em novas captações.';
  } else {
    nivelRisco = 'CRITICO';
    statusCredito = 'DESALAVANCAGEM_URGENTE';
    recomendacao = 'Alto risco de insolvência. Prioridade total para desalavancagem.';
  }

  return {
    dividaLiquidaAtual: round(dividaAtual, 2),
    dividaSobreEbitda: round(dividaSobreEbitda, 2),
    indiceCoberturaServicoDividaDscr: round(dscr, 2),
    capacidadeAdicionalCreditoSaudavel: round(capacidadeAdicional, 2),
    limiteMaximoEndividamentoRecomendado: round(limiteMaximoDivida, 2),
    nivelRisco,
    statusCredito,
    recomendacao
  };
}

export function generatePrescriptiveDiagnostics(
  input: CfoCopilotInput,
  crossMetrics: CfoCrossMetrics,
  debtCapacity: HealthyDebtCapacity
): PrescriptiveDiagnostic[] {
  const fa = input.financialReport;
  const diagnostics: PrescriptiveDiagnostic[] = [];

  // 1. Fiscal
  if (crossMetrics.statusFatorR === 'ENQUADRADO_ANEXO_III') {
    diagnostics.push({
      quadrante: 'OTIMIZACAO_FISCAL',
      titulo: 'Blindagem do Fator R no Simples Nacional (Anexo III)',
      diagnostico: `Folha em ${crossMetrics.fatorR.toFixed(1)}% garantindo enquadramento no Anexo III.`,
      prescricaoAcao: 'Manter pró-labore e folha para preservar a economia fiscal.',
      impactoEsperado: `Economia estimada de ~R$ ${crossMetrics.economiaAnualEstimadaFatorR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ao ano.`,
      prioridade: 'MEDIA'
    });
  } else {
    diagnostics.push({
      quadrante: 'OTIMIZACAO_FISCAL',
      titulo: 'Ajuste Estratégico de Pró-labore para Fator R >= 28%',
      diagnostico: `Fator R em ${crossMetrics.fatorR.toFixed(1)}% (< 28%), enquadrado no Anexo V.`,
      prescricaoAcao: 'Adequar folha para migrar ao Anexo III.',
      impactoEsperado: 'Redução de alíquota efetiva em até 9.5% sobre receita bruta.',
      prioridade: 'ALTA'
    });
  }

  // 2. Capital de Giro
  if (fa.workingCapital.efeitoTesouraDetectado) {
    diagnostics.push({
      quadrante: 'CAPITAL_DE_GIRO',
      titulo: 'Efeito Tesoura Detectado na Operação',
      diagnostico: 'Saldo de Tesouraria deficitário financiado por dívida bancária de curto prazo.',
      prescricaoAcao: 'Reduzir PMRV e renegociar prazos com fornecedores.',
      impactoEsperado: 'Reversão da queima de caixa operacional.',
      prioridade: 'URGENTE'
    });
  } else {
    diagnostics.push({
      quadrante: 'CAPITAL_DE_GIRO',
      titulo: 'Equilíbrio e Folga em Tesouraria',
      diagnostico: `Saldo de Tesouraria positivo (+R$ ${fa.workingCapital.saldoTesouraria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`,
      prescricaoAcao: 'Manter reservas remuneradas em CDI de liquidez imediata.',
      impactoEsperado: 'Rendimento financeiro acessório seguro.',
      prioridade: 'BAIXA'
    });
  }

  // 3. Estrutura de Capital
  diagnostics.push({
    quadrante: 'ESTRUTURA_CAPITAL',
    titulo: 'Otimização da Estrutura de Capital e Crédito',
    diagnostico: `Dívida/EBITDA em ${debtCapacity.dividaSobreEbitda.toFixed(2)}x com risco ${debtCapacity.nivelRisco}.`,
    prescricaoAcao: debtCapacity.recomendacao,
    impactoEsperado: 'Manutenção de rating bancário saudável.',
    prioridade: debtCapacity.nivelRisco === 'CRITICO' ? 'URGENTE' : 'MEDIA'
  });

  // 4. Geração de Valor
  diagnostics.push({
    quadrante: 'GERACAO_VALOR',
    titulo: 'Maximização do ROE e Distribuição Estratégica',
    diagnostico: `ROE de ${fa.profitability.roePercent.toFixed(2)}% e Margem EBITDA de ${fa.profitability.margemEbitdaPercent.toFixed(2)}%.`,
    prescricaoAcao: 'Reinvestir em expansão com TIR superior ao custo de capital.',
    impactoEsperado: 'Crescimento composto do patrimônio líquido.',
    prioridade: 'MEDIA'
  });

  return diagnostics;
}

export function calculateCapitalAllocationPlan(
  crossMetrics: CfoCrossMetrics,
  debtCapacity: HealthyDebtCapacity,
  financialReport: CompleteFinancialAnalysisReport
): CapitalAllocationPlan & {
  reservaOperacionalPercent: number;
  reinvestimentoExpansaoPercent: number;
  distribuicaoDividendosPercent: number;
} {
  const fcf = Math.max(0, crossMetrics.freeCashFlowFirmFCFF);

  const percentReserva = 25;
  const percentCapex = 45;
  const percentDividendos = 30;
  const percentDividas = 0;

  const reserva = fcf * (percentReserva / 100);
  const capex = fcf * (percentCapex / 100);
  const dividendos = fcf * (percentDividendos / 100);

  return {
    fluxoCaixaLivreBase: round(fcf, 2),
    percentualReservaSeguranca: percentReserva,
    reservaOperacionalPercent: percentReserva,
    valorReservaSeguranca: round(reserva, 2),
    percentualAmortizacaoDividas: percentDividas,
    valorAmortizacaoDividas: 0,
    percentualReinvestimentoCapex: percentCapex,
    reinvestimentoExpansaoPercent: percentCapex,
    valorReinvestimentoCapex: round(capex, 2),
    percentualDistribuicaoDividendos: percentDividendos,
    distribuicaoDividendosPercent: percentDividendos,
    valorDistribuicaoDividendos: round(dividendos, 2),
    justificativaEstrategica: `Alocação recomendada: 25% Reserva Operacional, 45% Reinvestimento em Expansão e 30% Dividendos com base no FCFF de R$ ${fcf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
  };
}

export function runCfoPrescriptiveCopilot(input: CfoCopilotInput): CfoDecisionReport & {
  diagnostics: PrescriptiveDiagnostic[];
  allocationPlan: CapitalAllocationPlan & {
    reservaOperacionalPercent: number;
    reinvestimentoExpansaoPercent: number;
    distribuicaoDividendosPercent: number;
  };
} {
  const crossMetrics = calculateCrossReferencedMetrics(input);
  const debtCapacity = calculateCreditCapacityLimit(input, crossMetrics);
  const diagnostics = generatePrescriptiveDiagnostics(input, crossMetrics, debtCapacity);
  const allocationPlan = calculateCapitalAllocationPlan(crossMetrics, debtCapacity, input.financialReport);

  const pareceresExecutivos: string[] = [
    `FCFF estimado em R$ ${crossMetrics.freeCashFlowFirmFCFF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com EBITDA de R$ ${crossMetrics.ebitdaRunRateAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
    `Capacidade adicional de endividamento saudável de R$ ${debtCapacity.capacidadeAdicionalCreditoSaudavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Status: ${debtCapacity.statusCredito}).`,
    `Economia anual tributária de R$ ${crossMetrics.economiaAnualEstimadaFatorR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pelo Fator R e R$ ${crossMetrics.economiaMonofasicaAnualRecuperavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em monofásicos.`,
    `Plano de Capital: 25% Reserva, 45% Expansão e 30% Dividendos.`
  ];

  return {
    dataAnalise: new Date().toISOString(),
    empresa: input.financialReport.empresa,
    cnpj: input.financialReport.cnpj,
    crossMetrics,
    creditCapacity: debtCapacity,
    prescriptiveDiagnostics: diagnostics,
    diagnostics,
    capitalAllocation: allocationPlan,
    allocationPlan,
    pareceresExecutivos
  };
}

export const generateCfoDecisionReport = runCfoPrescriptiveCopilot;
