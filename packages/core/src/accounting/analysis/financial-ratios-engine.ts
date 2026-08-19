/**
 * SOBERANO CONTÁBIL — FINANCIAL RATIOS & DUPONT ENGINE
 * High-precision deterministic engine for Liquidity, Profitability, 5-Stage DuPont,
 * Altman Z''-Score (Brazil/Emerging Markets), Kanitz Thermometer, and Working Capital/Fleuriet.
 */

import {
  LiquidityRatios,
  ProfitabilityRatios,
  DuPont5StageDecomposition,
  SolvencyAndCreditRisk,
  WorkingCapitalAndCycles,
  CompleteFinancialAnalysisReport,
  FinancialHealthScore
} from '../../types/financial-analysis.js';
import { BalanceSheet, IncomeStatement } from '../../types/accounting.js';

export interface FinancialInputData {
  ativoCirculante: number;
  disponibilidades: number;
  contasAReceber: number;
  estoques: number;
  realizavelLongoPrazo: number;
  ativoPermanenteImobilizado: number;
  totalAtivo: number;

  passivoCirculante: number;
  fornecedores: number;
  emprestimosFinanciamentosCp: number;
  passivoNaoCirculante: number;
  emprestimosFinanciamentosLp: number;
  patrimonioLiquido: number;
  lucrosAcumuladosRetidos: number;
  totalPassivoEPl: number;

  receitaBruta: number;
  deducoesReceita: number;
  receitaLiquida: number;
  custoProdutosVendidos: number;
  lucroBruto: number;
  despesasOperacionaisVendasGerais: number;
  ebitda: number;
  depreciacaoAmortizacao: number;
  lucroOperacionalEbit: number;
  despesasFinanceirasLiquidas: number;
  lucroAntesImpostosEbt: number;
  impostosSobreLucro: number;
  lucroLiquido: number;

  tenantId?: string;
  empresa?: string;
  cnpj?: string;
  periodo?: string;
}

export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (!denominator || isNaN(denominator) || Math.abs(denominator) < 1e-9) {
    return fallback;
  }
  const result = numerator / denominator;
  return isNaN(result) || !isFinite(result) ? fallback : result;
}

export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function calculateLiquidityRatios(input: FinancialInputData): LiquidityRatios {
  const ac = input.ativoCirculante || 0;
  const disp = input.disponibilidades || 0;
  const est = input.estoques || 0;
  const rlp = input.realizavelLongoPrazo || 0;
  const pc = input.passivoCirculante || 0;
  const pnc = input.passivoNaoCirculante || 0;

  const lc = pc > 0 ? safeDivide(ac, pc) : 999;
  const ls = pc > 0 ? safeDivide(Math.max(0, ac - est), pc) : 999;
  const li = pc > 0 ? safeDivide(disp, pc) : 999;
  const totalExigivel = pc + pnc;
  const lg = totalExigivel > 0 ? safeDivide(ac + rlp, totalExigivel) : 999;

  let status: 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO' = 'BOM';
  let diagnostico = '';

  if (lc >= 1.5 && ls >= 1.0 && lg >= 1.0) {
    status = 'EXCELENTE';
    diagnostico = `Excelente folga financeira (LC: ${lc.toFixed(2)}, LS: ${ls.toFixed(2)}, LG: ${lg.toFixed(2)}). A empresa possui capacidade plena de honrar compromissos de curto e longo prazo.`;
  } else if (lc >= 1.0 && ls >= 0.8) {
    status = 'BOM';
    diagnostico = `Liquidez equilibrada (LC: ${lc.toFixed(2)}, LS: ${ls.toFixed(2)}). Capacidade adequada para cumprir obrigações correntes sem necessidade de liquidação emergencial de estoques.`;
  } else if (lc >= 0.8) {
    status = 'ATENCAO';
    diagnostico = `Alerta de liquidez (LC: ${lc.toFixed(2)}, LS: ${ls.toFixed(2)}). A empresa depende de giro rápido de estoque e recebimentos para cobrir obrigações imediatas.`;
  } else {
    status = 'CRITICO';
    diagnostico = `Risco de iliquidez severo (LC: ${lc.toFixed(2)} < 1.0). As obrigações de curto prazo superam os ativos circulantes disponíveis, exigindo renegociação de passivos.`;
  }

  return {
    liquidezCorrente: round(lc, 2),
    liquidezSeca: round(ls, 2),
    liquidezImediata: round(li, 2),
    liquidezGeral: round(lg, 2),
    status,
    diagnostico
  };
}

export function calculateProfitabilityRatios(input: FinancialInputData): ProfitabilityRatios {
  const recLiq = input.receitaLiquida || 0;
  const lb = input.lucroBruto || 0;
  const ebitda = input.ebitda || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const ll = input.lucroLiquido || 0;
  const pl = input.patrimonioLiquido || 0;
  const at = input.totalAtivo || 0;

  const mb = recLiq > 0 ? safeDivide(lb, recLiq) * 100 : 0;
  const mebitda = recLiq > 0 ? safeDivide(ebitda, recLiq) * 100 : 0;
  const mo = recLiq > 0 ? safeDivide(ebit, recLiq) * 100 : 0;
  const ml = recLiq > 0 ? safeDivide(ll, recLiq) * 100 : 0;
  const roe = pl !== 0 ? safeDivide(ll, pl) * 100 : 0;
  const roa = at > 0 ? safeDivide(ll, at) * 100 : 0;

  const passivoNaoOneroso = (input.passivoCirculante || 0) - (input.emprestimosFinanciamentosCp || 0);
  const capitalInvestido = Math.max(1, at - passivoNaoOneroso);
  const nopat = ebit - (input.impostosSobreLucro || 0);
  const roic = safeDivide(nopat, capitalInvestido) * 100;

  let status: 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO' = 'BOM';
  let diagnostico = '';

  if (roe >= 20 && ml >= 12) {
    status = 'EXCELENTE';
    diagnostico = `Rentabilidade de alta performance (ROE: ${roe.toFixed(2)}%, Margem Líquida: ${ml.toFixed(2)}%, Margem EBITDA: ${mebitda.toFixed(2)}%). Geração de valor substancial aos sócios.`;
  } else if (roe >= 10 && ml >= 5) {
    status = 'BOM';
    diagnostico = `Rentabilidade saudável e consistente (ROE: ${roe.toFixed(2)}%, Margem Líquida: ${ml.toFixed(2)}%). Retorno sobre o capital próprio superior ao custo de oportunidade médio de mercado.`;
  } else if (roe > 0) {
    status = 'ATENCAO';
    diagnostico = `Rentabilidade moderada/baixa (ROE: ${roe.toFixed(2)}%, Margem Líquida: ${ml.toFixed(2)}%). Necessidade de otimização de margens ou maior eficiência de custos/giro de ativos.`;
  } else {
    status = 'CRITICO';
    diagnostico = `Operação deficitária (Margem Líquida: ${ml.toFixed(2)}%, ROE: ${roe.toFixed(2)}%). A empresa opera com prejuízo líquido, consumindo o patrimônio dos sócios.`;
  }

  return {
    receitaLiquida: round(recLiq, 2),
    lucroBruto: round(lb, 2),
    ebitda: round(ebitda, 2),
    lucroOperacionalEbit: round(ebit, 2),
    lucroLiquido: round(ll, 2),
    margemBrutaPercent: round(mb, 2),
    margemEbitdaPercent: round(mebitda, 2),
    margemOperacionalPercent: round(mo, 2),
    margemLiquidaPercent: round(ml, 2),
    roePercent: round(roe, 2),
    roaPercent: round(roa, 2),
    roicPercent: round(roic, 2),
    status,
    diagnostico
  };
}

export function calculateDuPont5StageDecomposition(input: FinancialInputData): DuPont5StageDecomposition {
  const ll = input.lucroLiquido || 0;
  const ebt = input.lucroAntesImpostosEbt || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const recLiq = input.receitaLiquida || 0;
  const at = input.totalAtivo || 0;
  const pl = input.patrimonioLiquido || 0;

  const isPassivoADescoberto = pl <= 0;

  const taxBurden = ebt !== 0 ? safeDivide(ll, ebt) : 1;
  const interestBurden = ebit !== 0 ? safeDivide(ebt, ebit) : 1;
  const ebitMargin = recLiq > 0 ? safeDivide(ebit, recLiq) : 0;
  const assetTurnover = at > 0 ? safeDivide(recLiq, at) : 0;
  const equityMultiplier = !isPassivoADescoberto && pl > 0 ? safeDivide(at, pl) : 1;

  const roeCalculadoDecimal = taxBurden * interestBurden * ebitMargin * assetTurnover * equityMultiplier;
  const roeCalculadoPercent = roeCalculadoDecimal * 100;
  const roeRealPercent = !isPassivoADescoberto && pl > 0 ? safeDivide(ll, pl) * 100 : 0;

  const discrepancia = Math.abs(roeCalculadoPercent - roeRealPercent);
  const isIdentidadeVerificada = isPassivoADescoberto ? false : discrepancia < 0.005;

  let interpretacao = '';
  if (isPassivoADescoberto) {
    interpretacao = `ATENÇÃO: A empresa apresenta Passivo a Descoberto (Patrimônio Líquido negativo de R$ ${pl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). O ROE tradicional perde o significado econômico direto e a alavancagem reflete insolvência patrimonial.`;
  } else {
    interpretacao = `Decomposição DuPont 5 Estágios validada com precisão. O ROE de ${roeRealPercent.toFixed(2)}% decorre de: Retenção Tributária (${(taxBurden * 100).toFixed(1)}%), Eficiência Financeira (${(interestBurden * 100).toFixed(1)}%), Margem EBIT (${(ebitMargin * 100).toFixed(1)}%), Giro de Ativos (${assetTurnover.toFixed(2)}x) e Alavancagem (${equityMultiplier.toFixed(2)}x).`;
  }

  return {
    taxBurden: round(taxBurden, 4),
    interestBurden: round(interestBurden, 4),
    ebitMargin: round(ebitMargin, 4),
    assetTurnover: round(assetTurnover, 4),
    equityMultiplier: round(equityMultiplier, 4),
    roeCalculadoPercent: round(roeCalculadoPercent, 2),
    roeRealPercent: round(roeRealPercent, 2),
    discrepancia: round(discrepancia, 4),
    isIdentidadeVerificada,
    isPassivoADescoberto,
    interpretacao
  };
}

export function calculateSolvencyAndCreditRisk(input: FinancialInputData): SolvencyAndCreditRisk {
  const at = Math.max(1, input.totalAtivo || 1);
  const ac = input.ativoCirculante || 0;
  const pc = input.passivoCirculante || 0;
  const pnc = input.passivoNaoCirculante || 0;
  const pl = input.patrimonioLiquido || 0;
  const lucrosRetidos = input.lucrosAcumuladosRetidos || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const ll = input.lucroLiquido || 0;
  const est = input.estoques || 0;

  const totalExigivel = pc + pnc;
  const endividamentoGeral = at > 0 ? safeDivide(totalExigivel, at) * 100 : 0;
  const composicaoEndividamento = totalExigivel > 0 ? safeDivide(pc, totalExigivel) * 100 : 0;
  const grauAlavancagemFinanceira = pl > 0 ? safeDivide(at, pl) : 999;

  const x1 = safeDivide(ac - pc, at);
  const x2 = safeDivide(lucrosRetidos, at);
  const x3 = safeDivide(ebit, at);
  const x4 = totalExigivel > 0 ? safeDivide(pl, totalExigivel) : 10;

  const zScoreBrasil = 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4;

  let altmanStatus: 'ZONA_SEGURA' | 'ZONA_CINZENTA' | 'ZONA_PERIGO' = 'ZONA_SEGURA';
  let altmanDiagnostico = '';

  if (zScoreBrasil >= 2.60) {
    altmanStatus = 'ZONA_SEGURA';
    altmanDiagnostico = `Zona Segura (Z'' = ${zScoreBrasil.toFixed(2)} >= 2.60). Empresa com baixíssima probabilidade de insolvência ou recuperação judicial nos próximos 24 meses.`;
  } else if (zScoreBrasil >= 1.10) {
    altmanStatus = 'ZONA_CINZENTA';
    altmanDiagnostico = `Zona Cinzenta (Z'' = ${zScoreBrasil.toFixed(2)} entre 1.10 e 2.60). Risco de crédito moderado. Recomenda-se acompanhamento rigoroso do fluxo de caixa e estrutura de capital.`;
  } else {
    altmanStatus = 'ZONA_PERIGO';
    altmanDiagnostico = `Zona de Perigo (Z'' = ${zScoreBrasil.toFixed(2)} < 1.10). Alto risco de default/insolvência financeira. Estrutura de capital sob forte estresse.`;
  }

  const k1 = pl !== 0 ? safeDivide(ll, pl) : 0;
  const k2 = totalExigivel > 0 ? safeDivide(ac + (input.realizavelLongoPrazo || 0), totalExigivel) : 1;
  const k3 = pc > 0 ? safeDivide(Math.max(0, ac - est), pc) : 1;
  const k4 = pc > 0 ? safeDivide(ac, pc) : 1;
  const k5 = pl !== 0 ? safeDivide(totalExigivel, pl) : 10;

  const fatorInsolvenciaKanitz = 0.05 * k1 + 1.65 * k2 + 3.55 * k3 - 1.06 * k4 - 0.33 * k5;

  let kanitzStatus: 'SOLVENTE' | 'PENUMBRA' | 'INSOLVENTE' = 'SOLVENTE';
  let kanitzDiagnostico = '';

  if (fatorInsolvenciaKanitz > 0) {
    kanitzStatus = 'SOLVENTE';
    kanitzDiagnostico = `Empresa Solvente e Saudável (Fator Kanitz = +${fatorInsolvenciaKanitz.toFixed(2)} > 0). Demonstra estabilidade financeira robusta segundo a escala Kanitz.`;
  } else if (fatorInsolvenciaKanitz >= -3.0) {
    kanitzStatus = 'PENUMBRA';
    kanitzDiagnostico = `Faixa de Penumbra (Fator Kanitz = ${fatorInsolvenciaKanitz.toFixed(2)} entre 0 e -3.0). Alerta quanto à evolução da dívida de curto prazo.`;
  } else {
    kanitzStatus = 'INSOLVENTE';
    kanitzDiagnostico = `Alerta de Insolvência (Fator Kanitz = ${fatorInsolvenciaKanitz.toFixed(2)} < -3.0). Elevada probabilidade de desequilíbrio e falência segundo o modelo Kanitz.`;
  }

  let statusGeral: 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO' = 'BOM';
  if (altmanStatus === 'ZONA_SEGURA' && kanitzStatus === 'SOLVENTE' && endividamentoGeral <= 60) {
    statusGeral = 'EXCELENTE';
  } else if (altmanStatus === 'ZONA_PERIGO' || kanitzStatus === 'INSOLVENTE' || pl <= 0) {
    statusGeral = 'CRITICO';
  } else if (altmanStatus === 'ZONA_CINZENTA' || kanitzStatus === 'PENUMBRA' || endividamentoGeral > 75) {
    statusGeral = 'ATENCAO';
  }

  return {
    totalPassivoExigivel: round(totalExigivel, 2),
    patrimonioLiquido: round(pl, 2),
    endividamentoGeralPercent: round(endividamentoGeral, 2),
    composicaoEndividamentoCurtoPrazoPercent: round(composicaoEndividamento, 2),
    grauAlavancagemFinanceira: round(grauAlavancagemFinanceira, 2),
    altmanZScore: {
      x1WorkingCapitalOverAssets: round(x1, 4),
      x2RetainedEarningsOverAssets: round(x2, 4),
      x3EbitOverAssets: round(x3, 4),
      x4BookValueEquityOverLiabilities: round(x4, 4),
      zScoreBrasilEmergingValue: round(zScoreBrasil, 2),
      status: altmanStatus,
      diagnostico: altmanDiagnostico
    },
    kanitzTermometro: {
      fatorInsolvencia: round(fatorInsolvenciaKanitz, 2),
      status: kanitzStatus,
      diagnostico: kanitzDiagnostico
    },
    status: statusGeral
  };
}

export function calculateWorkingCapitalAndCycles(input: FinancialInputData): WorkingCapitalAndCycles {
  const ac = input.ativoCirculante || 0;
  const pc = input.passivoCirculante || 0;
  const disp = input.disponibilidades || 0;
  const empCp = input.emprestimosFinanciamentosCp || 0;
  const est = input.estoques || 0;
  const recLiq = input.receitaLiquida || 0;
  const cpv = input.custoProdutosVendidos || 0;
  const clientes = input.contasAReceber || 0;
  const fornec = input.fornecedores || 0;

  const aco = Math.max(0, ac - disp);
  const pco = Math.max(0, pc - empCp);
  const ncg = aco - pco;
  const cdg = ac - pc;
  const st = cdg - ncg;
  const efeitoTesoura = st < 0 && ncg > cdg;

  let tipoFleuriet = 1;
  let nomeFleuriet = '';
  let diagnosticoFleuriet = '';

  if (cdg > 0 && ncg > 0 && st > 0) {
    tipoFleuriet = 1;
    nomeFleuriet = 'Excelente (Sólida / Folga Financeira)';
    diagnosticoFleuriet = 'Empresa com estrutura de capital exemplar: CDG positivo financia integralmente a NCG e ainda gera Saldo de Tesouraria positivo.';
  } else if (cdg > 0 && ncg < 0 && st > 0) {
    tipoFleuriet = 2;
    nomeFleuriet = 'Muito Boa (Operação Financiadora)';
    diagnosticoFleuriet = 'A operação comercial gera recursos líquidos (fornecedores superam clientes e estoques), acumulando forte liquidez em tesouraria.';
  } else if (cdg > 0 && ncg > 0 && st < 0) {
    tipoFleuriet = 3;
    nomeFleuriet = 'Insatisfatória (Alerta de Tesouraria)';
    diagnosticoFleuriet = 'O CDG é positivo mas insuficiente para bancar toda a NCG, forçando captação de dívida bancária de curto prazo (Saldo de Tesouraria negativo).';
  } else if (cdg < 0 && ncg < 0 && st > 0) {
    tipoFleuriet = 4;
    nomeFleuriet = 'Instável (Alto Risco Operacional)';
    diagnosticoFleuriet = 'Saldo de tesouraria positivo sustentado apenas pelo crédito de fornecedores com CDG negativo. Vulnerável a qualquer queda de vendas.';
  } else if (cdg < 0 && ncg > 0 && st < 0) {
    tipoFleuriet = 5;
    nomeFleuriet = 'Crítica (Efeito Tesoura em Ação)';
    diagnosticoFleuriet = 'Grave desequilíbrio estrutural: CDG negativo, NCG positiva e Saldo de Tesouraria crescentemente deficitário financiado por juros bancários onerosos.';
  } else {
    tipoFleuriet = 6;
    nomeFleuriet = 'Alto Risco de Falência';
    diagnosticoFleuriet = 'Todos os parâmetros em níveis extremos de desequilíbrio e consumo de liquidez.';
  }

  const baseDias = 360;
  const pme = cpv > 0 ? safeDivide(est * baseDias, cpv) : 0;
  const pmrv = recLiq > 0 ? safeDivide(clientes * baseDias, recLiq) : 0;
  const comprasEstimadas = cpv > 0 ? cpv + (est * 0.1) : fornec;
  const pmpf = comprasEstimadas > 0 ? safeDivide(fornec * baseDias, comprasEstimadas) : 0;

  const cicloOperacional = pme + pmrv;
  const cicloCaixa = cicloOperacional - pmpf;

  return {
    necessidadeCapitalGiroNcg: round(ncg, 2),
    capitalGiroLiquidoCdg: round(cdg, 2),
    saldoTesouraria: round(st, 2),
    efeitoTesouraDetectado: efeitoTesoura,
    prazoMedioEstocagemPme: round(pme, 1),
    prazoMedioRecebimentoPmrv: round(pmrv, 1),
    prazoMedioPagamentoPmpf: round(pmpf, 1),
    cicloOperacionalDias: round(cicloOperacional, 1),
    cicloCaixaFinanceiroDias: round(cicloCaixa, 1),
    classificacaoFleuriet: {
      tipo: tipoFleuriet,
      nome: nomeFleuriet,
      diagnostico: diagnosticoFleuriet
    }
  };
}

export function calculateOverallFinancialHealthScore(
  liquidity: LiquidityRatios,
  profitability: ProfitabilityRatios,
  solvency: SolvencyAndCreditRisk,
  workingCapital: WorkingCapitalAndCycles
): FinancialHealthScore {
  let score = 50;

  if (liquidity.liquidezCorrente >= 1.5) score += 10;
  else if (liquidity.liquidezCorrente >= 1.0) score += 5;
  else score -= 10;

  if (liquidity.liquidezSeca >= 1.0) score += 10;
  else if (liquidity.liquidezSeca >= 0.7) score += 5;

  if (liquidity.liquidezGeral >= 1.0) score += 5;

  if (profitability.roePercent >= 20) score += 15;
  else if (profitability.roePercent >= 10) score += 10;
  else if (profitability.roePercent > 0) score += 5;
  else score -= 15;

  if (profitability.margemLiquidaPercent >= 12) score += 10;
  else if (profitability.margemLiquidaPercent >= 5) score += 5;
  else if (profitability.margemLiquidaPercent < 0) score -= 10;

  if (solvency.altmanZScore.status === 'ZONA_SEGURA') score += 15;
  else if (solvency.altmanZScore.status === 'ZONA_CINZENTA') score += 5;
  else score -= 15;

  if (solvency.kanitzTermometro.status === 'SOLVENTE') score += 10;
  else if (solvency.kanitzTermometro.status === 'PENUMBRA') score += 0;
  else score -= 10;

  if (solvency.endividamentoGeralPercent <= 50) score += 5;
  else if (solvency.endividamentoGeralPercent > 80) score -= 10;

  if (workingCapital.classificacaoFleuriet.tipo <= 2) score += 10;
  else if (workingCapital.classificacaoFleuriet.tipo === 3) score += 5;
  else score -= 10;

  if (workingCapital.saldoTesouraria > 0) score += 5;
  else score -= 5;

  if (!workingCapital.efeitoTesouraDetectado) score += 5;
  else score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO' = 'BOM';
  let parecer = '';

  if (score >= 80) {
    status = 'EXCELENTE';
    parecer = 'A empresa apresenta solidez financeira exemplar, com elevada liquidez, rentabilidade atrativa, margem de segurança contra insolvência e dinâmica de capital de giro saudável.';
  } else if (score >= 60) {
    status = 'BOM';
    parecer = 'A empresa possui indicadores financeiros consistentes e satisfatórios, demonstrando sustentabilidade operacional com oportunidades pontuais de otimização de giro e custos.';
  } else if (score >= 40) {
    status = 'ATENCAO';
    parecer = 'Identificados pontos de vulnerabilidade financeira, como pressão de capital de giro ou margens comprimidas. Recomenda-se implementar plano de contenção e gestão de fluxo de caixa.';
  } else {
    status = 'CRITICO';
    parecer = 'Situação de alto estresse financeiro e risco de insolvência. É prioritária a reestruturação de passivos, redução de custos fixos e recomposição da liquidez imediata.';
  }

  return {
    score,
    status,
    parecer
  };
}

export function generateCompleteFinancialAnalysisReport(input: FinancialInputData): CompleteFinancialAnalysisReport {
  const liquidity = calculateLiquidityRatios(input);
  const profitability = calculateProfitabilityRatios(input);
  const dupont = calculateDuPont5StageDecomposition(input);
  const solvency = calculateSolvencyAndCreditRisk(input);
  const workingCapital = calculateWorkingCapitalAndCycles(input);
  const overallHealth = calculateOverallFinancialHealthScore(liquidity, profitability, solvency, workingCapital);

  const resumo: string[] = [
    `Saúde Financeira Global classificada em ${overallHealth.status} com Score ${overallHealth.score}/100.`,
    `Liquidez Corrente de ${liquidity.liquidezCorrente.toFixed(2)} e Liquidez Seca de ${liquidity.liquidezSeca.toFixed(2)}.`,
    `ROE de ${profitability.roePercent.toFixed(2)}% com Margem Líquida de ${profitability.margemLiquidaPercent.toFixed(2)}% e Margem EBITDA de ${profitability.margemEbitdaPercent.toFixed(2)}%.`,
    `Altman Z''-Score Brasil de ${solvency.altmanZScore.zScoreBrasilEmergingValue.toFixed(2)} (${solvency.altmanZScore.status}) e Kanitz de ${solvency.kanitzTermometro.fatorInsolvencia.toFixed(2)} (${solvency.kanitzTermometro.status}).`,
    `Dinâmica Fleuriet tipo ${workingCapital.classificacaoFleuriet.tipo} (${workingCapital.classificacaoFleuriet.nome}) com Ciclo de Caixa de ${workingCapital.cicloCaixaFinanceiroDias.toFixed(0)} dias.`
  ];

  return {
    periodo: input.periodo || '2026',
    dataGeracao: new Date().toISOString(),
    empresa: input.empresa || 'Empresa Analisada',
    cnpj: input.cnpj || '00.000.000/0001-00',
    tenantId: input.tenantId || 'default-tenant',
    scoreGeralSaude: overallHealth.score,
    statusGeral: overallHealth.status,
    resumoExecutivo: resumo,
    liquidity,
    profitability,
    dupont,
    solvency,
    workingCapital
  };
}

export function buildFinancialInputFromStatements(
  balanceSheet: BalanceSheet,
  incomeStatement: IncomeStatement,
  metadata?: { tenantId?: string; empresa?: string; cnpj?: string }
): FinancialInputData {
  let ac = 0;
  let disp = 0;
  let clientes = 0;
  let estoques = 0;
  let rlp = 0;
  let imob = 0;

  for (const item of balanceSheet.ativoCirculante || []) {
    const val = item.valorPeriodoAtual || 0;
    ac += val;
    const desc = (item.descricao || '').toLowerCase();
    const cod = item.codigoConta || '';
    if (desc.includes('caixa') || desc.includes('banco') || desc.includes('disponib') || cod.startsWith('1.1.01')) {
      disp += val;
    } else if (desc.includes('cliente') || desc.includes('receber') || cod.startsWith('1.1.02')) {
      clientes += val;
    } else if (desc.includes('estoque') || desc.includes('mercadoria') || cod.startsWith('1.1.03')) {
      estoques += val;
    }
  }

  for (const item of balanceSheet.ativoNaoCirculante || []) {
    const val = item.valorPeriodoAtual || 0;
    const desc = (item.descricao || '').toLowerCase();
    const cod = item.codigoConta || '';
    if (desc.includes('realiz') || desc.includes('longo prazo') || cod.startsWith('1.2.01')) {
      rlp += val;
    } else {
      imob += val;
    }
  }

  let pc = 0;
  let fornec = 0;
  let empCp = 0;

  for (const item of balanceSheet.passivoCirculante || []) {
    const val = item.valorPeriodoAtual || 0;
    pc += val;
    const desc = (item.descricao || '').toLowerCase();
    const cod = item.codigoConta || '';
    if (desc.includes('forneced') || cod.startsWith('2.1.01')) {
      fornec += val;
    } else if (desc.includes('empr') || desc.includes('financ') || cod.startsWith('2.1.02')) {
      empCp += val;
    }
  }

  let pnc = 0;
  let empLp = 0;
  for (const item of balanceSheet.passivoNaoCirculante || []) {
    const val = item.valorPeriodoAtual || 0;
    pnc += val;
    const desc = (item.descricao || '').toLowerCase();
    if (desc.includes('empr') || desc.includes('financ')) {
      empLp += val;
    }
  }

  let pl = 0;
  let lucrosRetidos = 0;
  for (const item of balanceSheet.patrimonioLiquido || []) {
    const val = item.valorPeriodoAtual || 0;
    pl += val;
    const desc = (item.descricao || '').toLowerCase();
    if (desc.includes('lucro') || desc.includes('reserva')) {
      lucrosRetidos += val;
    }
  }

  const recBruta = incomeStatement.receitaBruta || 0;
  const deducoes = incomeStatement.deducoesReceitaBruta || 0;
  const recLiq = incomeStatement.receitaLiquida || Math.max(0, recBruta - deducoes);
  const cpv = incomeStatement.custosOperacionais || 0;
  const lb = incomeStatement.lucroBruto || Math.max(0, recLiq - cpv);
  const despOper = incomeStatement.despesasOperacionais || 0;
  const ebit = incomeStatement.resultadoOperacional || (lb - despOper);
  const depAmort = (recLiq * 0.03) || 10000;
  const ebitda = ebit + depAmort;
  const recFin = incomeStatement.receitasFinanceiras || 0;
  const despFin = incomeStatement.despesasFinanceiras || 0;
  const despFinLiq = despFin - recFin;
  const ebt = incomeStatement.resultadoAntesTributacao || (ebit - despFinLiq);
  const impostos = incomeStatement.provisaoIrpjCsll || 0;
  const ll = incomeStatement.lucroLiquidoExercicio || (ebt - impostos);

  return {
    ativoCirculante: ac || 1,
    disponibilidades: disp,
    contasAReceber: clientes,
    estoques: estoques,
    realizavelLongoPrazo: rlp,
    ativoPermanenteImobilizado: imob,
    totalAtivo: balanceSheet.totalAtivo || (ac + rlp + imob),

    passivoCirculante: pc || 1,
    fornecedores: fornec,
    emprestimosFinanciamentosCp: empCp,
    passivoNaoCirculante: pnc,
    emprestimosFinanciamentosLp: empLp,
    patrimonioLiquido: pl || 1,
    lucrosAcumuladosRetidos: lucrosRetidos,
    totalPassivoEPl: balanceSheet.totalPassivoEPatrimonioLiquido || (pc + pnc + pl),

    receitaBruta: recBruta,
    deducoesReceita: deducoes,
    receitaLiquida: recLiq,
    custoProdutosVendidos: cpv,
    lucroBruto: lb,
    despesasOperacionaisVendasGerais: despOper,
    ebitda: ebitda,
    depreciacaoAmortizacao: depAmort,
    lucroOperacionalEbit: ebit,
    despesasFinanceirasLiquidas: despFinLiq,
    lucroAntesImpostosEbt: ebt,
    impostosSobreLucro: impostos,
    lucroLiquido: ll,

    tenantId: metadata?.tenantId,
    empresa: metadata?.empresa,
    cnpj: metadata?.cnpj,
    periodo: incomeStatement.periodo
  };
}
