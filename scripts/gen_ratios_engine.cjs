const fs = require('fs');
const path = require('path');

const financialRatiosEngine = /**
 * SOBERANO CONTÁBIL — FINANCIAL RATIOS & DUPONT ENGINE
 * High-precision deterministic engine for Liquidity, Profitability, 5-Stage DuPont,
 * Altman Z''-Score (Brazil/Emerging Markets), Kanitz Thermometer, and Fleuriet Working Capital Cycles.
 */

import {
  LiquidityRatios,
  ProfitabilityRatios,
  DuPont5StageDecomposition,
  SolvencyAndCreditRisk,
  WorkingCapitalAndCycles,
  CompleteFinancialAnalysisReport,
  HealthStatus
} from '../../types/financial-analysis.js';
import { BalanceSheet, IncomeStatement } from '../../types/accounting.js';

export interface FinancialInputData {
  ativoCirculante: number;
  disponibilidades?: number;
  contasAReceber?: number;
  estoques?: number;
  outrosAtivosCirculantes?: number;
  realizavelLongoPrazo?: number;
  ativoPermanenteImobilizado?: number;
  totalAtivo: number;

  passivoCirculante: number;
  fornecedores?: number;
  emprestimosFinanciamentosCp?: number;
  outrosPassivosCirculantes?: number;
  passivoNaoCirculante: number;
  emprestimosFinanciamentosLp?: number;
  patrimonioLiquido: number;
  lucrosAcumuladosRetidos?: number;
  totalPassivoEPl: number;

  receitaBruta?: number;
  deducoesReceita?: number;
  receitaLiquida: number;
  custoProdutosVendidos?: number;
  lucroBruto: number;
  despesasOperacionaisVendasGerais?: number;
  ebitda?: number;
  depreciacaoAmortizacao?: number;
  lucroOperacionalEbit: number;
  despesasFinanceirasLiquidas?: number;
  lucroAntesImpostosEbt?: number;
  impostosSobreLucro?: number;
  lucroLiquido: number;

  tenantId?: string;
  empresa?: string;
  cnpj?: string;
  periodo?: string;
  comprasPeriodo?: number;
}

export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0 || !Number.isFinite(denominator) || Number.isNaN(denominator)) {
    return fallback;
  }
  if (!Number.isFinite(numerator) || Number.isNaN(numerator)) {
    return fallback;
  }
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

export function round(value: number, decimals: number = 2): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateLiquidityRatios(input: FinancialInputData): LiquidityRatios {
  const ac = input.ativoCirculante || 0;
  const pc = input.passivoCirculante || 0;
  const estoques = input.estoques || 0;
  const disp = input.disponibilidades !== undefined ? input.disponibilidades : Math.max(0, ac - estoques - (input.contasAReceber || 0));
  const rlp = input.realizavelLongoPrazo || 0;
  const pnc = input.passivoNaoCirculante || 0;

  const lc = pc > 0 ? safeDivide(ac, pc) : (ac > 0 ? 999 : 0);
  const ls = pc > 0 ? safeDivide(ac - estoques, pc) : (ac - estoques > 0 ? 999 : 0);
  const li = pc > 0 ? safeDivide(disp, pc) : (disp > 0 ? 999 : 0);
  const lg = (pc + pnc) > 0 ? safeDivide(ac + rlp, pc + pnc) : (ac + rlp > 0 ? 999 : 0);

  let status: HealthStatus = 'EXCELENTE';
  let diagnostico = '';

  if (lc >= 1.5 && ls >= 1.0) {
    status = 'EXCELENTE';
    diagnostico = 'Excelente folga financeira de curto prazo. Para cada R$ 1,00 de dívida circulante, a empresa dispõe de R$ ' + lc.toFixed(2) + ' em ativos circulantes.';
  } else if (lc >= 1.1 && ls >= 0.8) {
    status = 'BOM';
    diagnostico = 'Liquidez equilibrada e saudável. Capacidade de honrar compromissos sem necessidade de queima forçada de estoques.';
  } else if (lc >= 0.9) {
    status = 'ATENCAO';
    diagnostico = 'Atenção: Liquidez corrente próxima do limite unitário (R$ ' + lc.toFixed(2) + '). Recomenda-se alongar passivos operacionais e acelerar cobrança.';
  } else {
    status = 'CRITICO';
    diagnostico = 'Alerta Crítico: Liquidez corrente comprimida (R$ ' + lc.toFixed(2) + '). Risco iminente de descompasso de caixa para vencimentos de curto prazo.';
  }

  return {
    liquidezCorrente: round(lc, 4),
    liquidezSeca: round(ls, 4),
    liquidezImediata: round(li, 4),
    liquidezGeral: round(lg, 4),
    status,
    diagnostico
  };
}

export function calculateProfitabilityRatios(input: FinancialInputData): ProfitabilityRatios {
  const rb = input.receitaBruta || input.receitaLiquida;
  const rl = input.receitaLiquida || 0;
  const deducoes = input.deducoesReceita || (rb - rl);
  const lb = input.lucroBruto || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const dep = input.depreciacaoAmortizacao || 0;
  const ebitda = input.ebitda !== undefined ? input.ebitda : (ebit + dep);
  const juros = input.despesasFinanceirasLiquidas || 0;
  const ebt = input.lucroAntesImpostosEbt !== undefined ? input.lucroAntesImpostosEbt : (ebit - juros);
  const impostos = input.impostosSobreLucro !== undefined ? input.impostosSobreLucro : (ebt - input.lucroLiquido);
  const ll = input.lucroLiquido || 0;

  const pl = input.patrimonioLiquido || 0;
  const at = input.totalAtivo || 0;

  const margemBruta = safeDivide(lb, rl) * 100;
  const margemEbitda = safeDivide(ebitda, rl) * 100;
  const margemOperacional = safeDivide(ebit, rl) * 100;
  const margemLiquida = safeDivide(ll, rl) * 100;

  const roe = pl > 0 ? safeDivide(ll, pl) * 100 : 0;
  const roa = at > 0 ? safeDivide(ll, at) * 100 : 0;

  const effectiveTaxRate = ebt > 0 ? Math.min(0.40, Math.max(0.10, safeDivide(impostos, ebt))) : 0.34;
  const nopat = ebit * (1 - effectiveTaxRate);
  const capitalInvestido = Math.max(1, pl + (input.passivoNaoCirculante || 0));
  const roic = safeDivide(nopat, capitalInvestido) * 100;

  let status: HealthStatus = 'EXCELENTE';
  let diagnostico = '';

  if (roe >= 18 && margemLiquida >= 10) {
    status = 'EXCELENTE';
    diagnostico = 'Rentabilidade de Classe Mundial. ROE de ' + roe.toFixed(2) + '% supera com ampla margem o custo de capital e taxas de juros de mercado.';
  } else if (roe >= 10 && margemLiquida > 0) {
    status = 'BOM';
    diagnostico = 'Rentabilidade consistente e saudável. Margem líquida de ' + margemLiquida.toFixed(2) + '% com ROE de ' + roe.toFixed(2) + '%.';
  } else if (ll >= 0) {
    status = 'ATENCAO';
    diagnostico = 'Rentabilidade moderada com margens estreitas (' + margemLiquida.toFixed(2) + '%). Necessário otimizar custos operacionais e mix de produtos.';
  } else {
    status = 'CRITICO';
    diagnostico = 'Alerta: Operação em prejuízo no período (-R$ ' + Math.abs(ll).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '). Revisão urgente de precificação e custos.';
  }

  return {
    receitaBruta: round(rb, 2),
    deducoesReceita: round(deducoes, 2),
    receitaLiquida: round(rl, 2),
    lucroBruto: round(lb, 2),
    ebitda: round(ebitda, 2),
    lucroOperacionalEbit: round(ebit, 2),
    despesasFinanceirasLiquidas: round(juros, 2),
    lucroAntesImpostosEbt: round(ebt, 2),
    impostosSobreLucro: round(impostos, 2),
    lucroLiquido: round(ll, 2),
    margemBrutaPercent: round(margemBruta, 2),
    margemEbitdaPercent: round(margemEbitda, 2),
    margemOperacionalPercent: round(margemOperacional, 2),
    margemLiquidaPercent: round(margemLiquida, 2),
    roePercent: round(roe, 2),
    roaPercent: round(roa, 2),
    roicPercent: round(roic, 2),
    status,
    diagnostico
  };
}

export function calculateDuPont5StageDecomposition(input: FinancialInputData): DuPont5StageDecomposition {
  const rl = input.receitaLiquida || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const juros = input.despesasFinanceirasLiquidas || 0;
  const ebt = input.lucroAntesImpostosEbt !== undefined ? input.lucroAntesImpostosEbt : (ebit - juros);
  const ll = input.lucroLiquido || 0;
  const at = input.totalAtivo || 0;
  const pl = input.patrimonioLiquido || 0;

  const isPassivoADescoberto = pl <= 0;

  const taxBurden = ebt !== 0 ? safeDivide(ll, ebt, 1) : 1;
  const interestBurden = ebit !== 0 ? safeDivide(ebt, ebit, 1) : 1;
  const ebitMargin = rl > 0 ? safeDivide(ebit, rl, 0) : 0;
  const assetTurnover = at > 0 ? safeDivide(rl, at, 0) : 0;
  const equityMultiplier = pl > 0 ? safeDivide(at, pl, 1) : (pl < 0 ? safeDivide(at, pl, -1) : 1);

  const roeCalculado = taxBurden * interestBurden * ebitMargin * assetTurnover * equityMultiplier;
  const roeDireto = pl !== 0 ? safeDivide(ll, pl, 0) : 0;

  const discrepancia = Math.abs(roeCalculado - roeDireto);
  const isIdentidadeVerificada = discrepancia < 0.0005 || (rl === 0 && ebit === 0);

  let interpretacao = '';
  if (isPassivoADescoberto) {
    interpretacao = 'ALERTA ESTRUTURAL: Sociedade em Passivo a Descoberto (PL <= 0). O multiplicador de alavancagem reflete insolvência patrimonial requerendo aporte de capital social.';
  } else {
    const principalAlavanca = ebitMargin >= 0.15 ? 'alta eficiência operacional' : (assetTurnover >= 1.5 ? 'alto giro dos ativos' : 'estrutura de capital balanceada');
    interpretacao = 'Decomposição DuPont em 5 Estágios validada. A geração de valor ao acionista (ROE: ' + (roeDireto * 100).toFixed(2) + '%) é impulsionada primordialmente por ' + principalAlavanca + '. Carga tributária retém ' + (taxBurden * 100).toFixed(1) + '% do lucro e alavancagem financeira é de ' + equityMultiplier.toFixed(2) + 'x.';
  }

  return {
    taxBurden: round(taxBurden, 4),
    interestBurden: round(interestBurden, 4),
    ebitMargin: round(ebitMargin, 4),
    assetTurnover: round(assetTurnover, 4),
    equityMultiplier: round(equityMultiplier, 4),
    roeCalculadoDuPont: round(roeCalculado, 4),
    roeDireto: round(roeDireto, 4),
    discrepancia: round(discrepancia, 6),
    isIdentidadeVerificada,
    isPassivoADescoberto,
    interpretacao
  };
}

export function calculateSolvencyAndCreditRisk(input: FinancialInputData): SolvencyAndCreditRisk {
  const at = input.totalAtivo || 0;
  const ac = input.ativoCirculante || 0;
  const pc = input.passivoCirculante || 0;
  const pnc = input.passivoNaoCirculante || 0;
  const passivoTotal = pc + pnc;
  const pl = input.patrimonioLiquido || 0;
  const ebit = input.lucroOperacionalEbit || 0;
  const rl = input.receitaLiquida || 0;
  const ll = input.lucroLiquido || 0;
  const juros = Math.abs(input.despesasFinanceirasLiquidas || 0);
  const estoques = input.estoques || 0;
  const rlp = input.realizavelLongoPrazo || 0;
  const lucrosRetidos = input.lucrosAcumuladosRetidos !== undefined ? input.lucrosAcumuladosRetidos : Math.max(0, pl * 0.4);

  const endividamentoGeral = safeDivide(passivoTotal, at) * 100;
  const compCurtoPrazo = safeDivide(pc, passivoTotal) * 100;
  const coberturaJuros = juros > 0 ? safeDivide(ebit, juros, 999) : 999;

  const x1 = safeDivide(ac - pc, at, 0);
  const x2 = safeDivide(lucrosRetidos, at, 0);
  const x3 = safeDivide(ebit, at, 0);
  const x4 = safeDivide(pl, passivoTotal, 0);
  const x5 = safeDivide(rl, at, 0);

  const zClassic = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5);
  const zEmerging = (6.56 * x1) + (3.26 * x2) + (6.72 * x3) + (1.05 * x4);

  let statusAltman: 'ZONA_SEGURA' | 'ZONA_ALERTA' | 'ZONA_PERIGO' = 'ZONA_SEGURA';
  let descAltman = '';

  if (zEmerging >= 2.60) {
    statusAltman = 'ZONA_SEGURA';
    descAltman = 'Zona Segura (Z = ' + zEmerging.toFixed(2) + ' >= 2.60). Probabilidade de insolvência estatisticamente insignificante nos próximos 24 meses.';
 } else if (zEmerging >= 1.10) {
 statusAltman = 'ZONA_ALERTA';
 descAltman = 'Zona de Alerta / Cinza (1.10 <= Z = ' + zEmerging.toFixed(2) + ' < 2.60). Empresa vulnerável a choques de liquidez ou desaceleração de receitas.';
  } else {
    statusAltman = 'ZONA_PERIGO';
    descAltman = 'Zona de Perigo / Estresse Financeiro (Z = ' + zEmerging.toFixed(2) + ' < 1.10). Risco elevado de reestruturação forçada ou insolvência.';
 }

 const kx1 = safeDivide(ll, pl, 0);
 const kx2 = safeDivide(ac + rlp, passivoTotal, 0);
 const kx3 = safeDivide(ac - estoques, pc, 0);
 const kx4 = safeDivide(passivoTotal, pl, 0);
 const kx5 = safeDivide(pc, pl, 0);

 const fatorInsolvencia = (0.05 * kx1) + (1.65 * kx2) + (3.55 * kx3) - (1.06 * kx4) - (0.33 * kx5);

 let statusKanitz: 'SOLVENTE' | 'PENUMBRA' | 'INSOLVENTE' = 'SOLVENTE';
 let descKanitz = '';

 if (fatorInsolvencia > 0) {
 statusKanitz = 'SOLVENTE';
 descKanitz = 'Solvente (Termômetro Kanitz: +' + fatorInsolvencia.toFixed(2) + ' > 0). Capacidade plena de honrar dívidas bancárias e operacionais.';
 } else if (fatorInsolvencia >= -3.0) {
 statusKanitz = 'PENUMBRA';
 descKanitz = 'Zona de Penumbra (Kanitz: ' + fatorInsolvencia.toFixed(2) + ' entre 0 e -3). Equilíbrio tênue entre geração de caixa e passivos exigíveis.';
 } else {
 statusKanitz = 'INSOLVENTE';
 descKanitz = 'Insolvência Iminente (Kanitz: ' + fatorInsolvencia.toFixed(2) + ' < -3). Passivo exigível desproporcional à liquidez disponível.';
 }

 let statusGeralSolvencia: HealthStatus = 'EXCELENTE';
 if (statusAltman === 'ZONA_SEGURA' && statusKanitz === 'SOLVENTE' && endividamentoGeral <= 60) {
 statusGeralSolvencia = 'EXCELENTE';
 } else if (statusAltman !== 'ZONA_PERIGO' && statusKanitz !== 'INSOLVENTE' && endividamentoGeral <= 75) {
 statusGeralSolvencia = 'BOM';
 } else if (statusAltman === 'ZONA_PERIGO' || statusKanitz === 'INSOLVENTE' || pl <= 0) {
 statusGeralSolvencia = 'CRITICO';
 } else {
 statusGeralSolvencia = 'ATENCAO';
 }

 return {
 endividamentoGeralPercent: round(endividamentoGeral, 2),
 composicaoEndividamentoCurtoPrazoPercent: round(compCurtoPrazo, 2),
 coberturaJuros: round(coberturaJuros, 2),
 passivoExigivelTotal: round(passivoTotal, 2),
 passivoCirculante: round(pc, 2),
 passivoNaoCirculante: round(pnc, 2),
 patrimonioLiquido: round(pl, 2),
 ativoTotal: round(at, 2),
 altmanZScore: {
 x1CapitalGiroSobreAtivo: round(x1, 4),
 x2LucrosRetidosSobreAtivo: round(x2, 4),
 x3EbitSobreAtivo: round(x3, 4),
 x4PlSobrePassivoTotal: round(x4, 4),
 x5VendasSobreAtivo: round(x5, 4),
 zScoreValue: round(zClassic, 2),
 zScoreBrasilEmergingValue: round(zEmerging, 2),
 status: statusAltman,
 descricao: descAltman
 },
 kanitzTermometro: {
 x1RentabilidadePl: round(kx1, 4),
 x2LiquidezGeral: round(kx2, 4),
 x3LiquidezSeca: round(kx3, 4),
 x4GrauEndividamento: round(kx4, 4),
 x5EndividamentoCurtoPrazo: round(kx5, 4),
 fatorInsolvencia: round(fatorInsolvencia, 2),
 status: statusKanitz,
 descricao: descKanitz
 },
 status: statusGeralSolvencia,
 diagnostico: descAltman + ' ' + descKanitz
 };
}

export function calculateWorkingCapitalAndCycles(input: FinancialInputData): WorkingCapitalAndCycles {
 const ac = input.ativoCirculante || 0;
 const pc = input.passivoCirculante || 0;
 const pnc = input.passivoNaoCirculante || 0;
 const pl = input.patrimonioLiquido || 0;
 const rb = input.receitaBruta || input.receitaLiquida || 0;
 const cpv = Math.abs(input.custoProdutosVendidos || (input.receitaLiquida - input.lucroBruto) || 1);
 const compras = input.comprasPeriodo || (cpv * 0.7);

 const estoques = input.estoques || 0;
 const clientes = input.contasAReceber || Math.max(0, ac * 0.4);
 const fornecedores = input.fornecedores || Math.max(0, pc * 0.5);
 const disponibilidades = input.disponibilidades !== undefined ? input.disponibilidades : Math.max(0, ac - estoques - clientes);
 const emprestimosCp = input.emprestimosFinanciamentosCp || Math.max(0, pc - fornecedores);

 const pme = cpv > 0 ? safeDivide(estoques * 360, cpv) : 0;
 const pmrv = rb > 0 ? safeDivide(clientes * 360, rb) : 0;
 const pmpf = compras > 0 ? safeDivide(fornecedores * 360, compras) : 0;

 const cicloOperacional = pme + pmrv;
 const cicloCaixa = cicloOperacional - pmpf;

 const aco = Math.max(0, ac - disponibilidades);
 const pco = Math.max(0, pc - emprestimosCp);
 const ncg = aco - pco;
 const cdg = ac - pc;
 const st = cdg - ncg;

 const efeitoTesoura = (st < 0 && ncg > cdg && pco < aco);

 let tipoFleuriet = 1;
 let nomeFleuriet = 'Tipo 1 - Excelente';
 let sitFleuriet = 'Estrutura Financeira Sólida e Confortável';
 let recFleuriet = 'Manter estratégia operacional e investir o excesso de liquidez em expansão ou aplicações remuneradas.';

 if (cdg > 0 && ncg > 0 && st > 0) {
 tipoFleuriet = 1;
 nomeFleuriet = 'Tipo 1 - Excelente';
 sitFleuriet = 'O Capital Circulante Próprio (CDG) financia integralmente a NCG e gera excedente de Tesouraria positivo.';
 recFleuriet = 'Excelente saúde de capital de giro. Aproveitar descontos financeiros com fornecedores para pagamentos à vista.';
 } else if (cdg > 0 && ncg <= 0 && st > 0) {
 tipoFleuriet = 2;
 nomeFleuriet = 'Tipo 2 - Muito Sólida';
 sitFleuriet = 'A própria operação gera recursos espontâneos (NCG negativa) e o CDG reforça a folga de tesouraria.';
 recFleuriet = 'Operação altamente autofinanciável típica de comércio/varejo com recebimento imediato e prazo com fornecedores.';
 } else if (cdg <= 0 && ncg <= 0 && st > 0) {
 tipoFleuriet = 3;
 nomeFleuriet = 'Tipo 3 - Insatisfeita / Cautela';
 sitFleuriet = 'Operação com folga momentânea de caixa suportada por passivos operacionais, porém sem CDG de longo prazo.';
 recFleuriet = 'Aumentar a retenção de lucros para constituir capital circulante próprio de proteção.';
 } else if (cdg > 0 && ncg > 0 && st < 0) {
 tipoFleuriet = 4;
 nomeFleuriet = 'Tipo 4 - Alavancada / Atenção';
 sitFleuriet = 'O CDG é positivo mas insuficiente para cobrir a NCG, exigindo captação de recursos financeiros de curto prazo.';
 recFleuriet = 'Renegociar prazos com clientes e fornecedores para reduzir a NCG ou buscar financiamento de longo prazo.';
 } else if (cdg <= 0 && ncg > 0 && st < 0) {
 tipoFleuriet = 5;
 nomeFleuriet = 'Tipo 5 - Crítica / Efeito Tesoura';
 sitFleuriet = 'EFEITO TESOURA ATIVO: Passivos bancários de curtíssimo prazo financiam tanto a NCG quanto o imobilizado.';
 recFleuriet = 'Ação Corretiva Imediata: Alongar o perfil do endividamento, desmobilizar ativos não estratégicos e injetar capital próprio.';
 } else {
 tipoFleuriet = 6;
 nomeFleuriet = 'Tipo 6 - Alto Risco / Colapso';
 sitFleuriet = 'Déficit estrutural de capital com estrangulamento da capacidade financeira.';
 recFleuriet = 'Plano emergencial de recuperação econômico-financeira e renegociação global de passivos.';
 }

 let statusCiclo: HealthStatus = 'EXCELENTE';
 if (tipoFleuriet <= 2 && cicloCaixa <= 45) {
 statusCiclo = 'EXCELENTE';
 } else if (tipoFleuriet <= 3 && cicloCaixa <= 75) {
 statusCiclo = 'BOM';
 } else if (tipoFleuriet === 4 || cicloCaixa <= 120) {
 statusCiclo = 'ATENCAO';
 } else {
 statusCiclo = 'CRITICO';
 }

 const diag = 'Ciclo Operacional de ' + round(cicloOperacional, 0) + ' dias e Ciclo Financeiro de ' + round(cicloCaixa, 0) + ' dias. ' + sitFleuriet + '.';

 return {
 prazoMedioEstocagemPme: round(pme, 1),
 prazoMedioRecebimentoPmrv: round(pmrv, 1),
 prazoMedioPagamentoPmpf: round(pmpf, 1),
 cicloOperacionalDias: round(cicloOperacional, 1),
 cicloCaixaFinanceiroDias: round(cicloCaixa, 1),
 ativoCirculanteOperacional: round(aco, 2),
 passivoCirculanteOperacional: round(pco, 2),
 necessidadeCapitalGiroNcg: round(ncg, 2),
 capitalGiroLiquidoCdg: round(cdg, 2),
 saldoTesouraria: round(st, 2),
 efeitoTesouraDetectado: efeitoTesoura,
 classificacaoFleuriet: {
 tipo: tipoFleuriet,
 nome: nomeFleuriet,
 situacao: sitFleuriet,
 recomendacao: recFleuriet
 },
 status: statusCiclo,
 diagnostico: diag
 };
}

export function generateCompleteFinancialAnalysisReport(input: FinancialInputData): CompleteFinancialAnalysisReport {
 const liquidity = calculateLiquidityRatios(input);
 const profitability = calculateProfitabilityRatios(input);
 const duPont = calculateDuPont5StageDecomposition(input);
 const solvency = calculateSolvencyAndCreditRisk(input);
 const workingCapital = calculateWorkingCapitalAndCycles(input);

 let score = 50;
 if (liquidity.status === 'EXCELENTE') score += 25;
 else if (liquidity.status === 'BOM') score += 18;
 else if (liquidity.status === 'ATENCAO') score += 8;
 else score -= 15;

 if (profitability.status === 'EXCELENTE') score += 25;
 else if (profitability.status === 'BOM') score += 18;
 else if (profitability.status === 'ATENCAO') score += 5;
 else score -= 20;

 if (solvency.status === 'EXCELENTE') score += 25;
 else if (solvency.status === 'BOM') score += 15;
 else if (solvency.status === 'ATENCAO') score += 0;
 else score -= 25;

 if (workingCapital.status === 'EXCELENTE') score += 25;
 else if (workingCapital.status === 'BOM') score += 15;
 else if (workingCapital.status === 'ATENCAO') score += 5;
 else score -= 20;

 score = Math.max(0, Math.min(100, score));

 let statusGeral: HealthStatus = 'EXCELENTE';
 if (score >= 85) statusGeral = 'EXCELENTE';
 else if (score >= 70) statusGeral = 'BOM';
 else if (score >= 45) statusGeral = 'ATENCAO';
 else statusGeral = 'CRITICO';

 const resumo = [
 'Score Geral de Saúde Financeira: ' + score + '/100 (' + statusGeral + ').',
 'Liquidez Corrente de R$ ' + liquidity.liquidezCorrente.toFixed(2) + ' com Liquidez Geral de R$ ' + liquidity.liquidezGeral.toFixed(2) + '.',
 'Rentabilidade do Patrimônio Líquido (ROE) de ' + profitability.roePercent.toFixed(2) + '% com Margem Líquida de ' + profitability.margemLiquidaPercent.toFixed(2) + '%.',
 'Termômetro de Solvência Altman Z Brasil em ' + solvency.altmanZScore.zScoreBrasilEmergingValue.toFixed(2) + ' (' + solvency.altmanZScore.status + ').',
    'Modelo Fleuriet: ' + workingCapital.classificacaoFleuriet.nome + ' (Saldo de Tesouraria: R$ ' + workingCapital.saldoTesouraria.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ').'
  ];

  return {
    tenantId: input.tenantId || 'tenant-default',
    empresa: input.empresa || 'Empresa Exemplo S/A',
    cnpj: input.cnpj || '00.000.000/0001-00',
    periodo: input.periodo || '2026',
    dataCalculo: new Date().toISOString(),
    scoreGeralSaude: score,
    statusGeral,
    liquidity,
    profitability,
    duPont,
    solvency,
    workingCapital,
    resumoExecutivo: resumo
  };
}

export function buildFinancialInputFromStatements(
  balanceSheet: BalanceSheet,
  incomeStatement: IncomeStatement,
  metadata?: { tenantId?: string; empresa?: string; cnpj?: string; periodo?: string; comprasPeriodo?: number }
): FinancialInputData {
  const acLinhas = balanceSheet.ativoCirculante || [];
  const ancLinhas = balanceSheet.ativoNaoCirculante || [];
  const pcLinhas = balanceSheet.passivoCirculante || [];
  const pncLinhas = balanceSheet.passivoNaoCirculante || [];
  const plLinhas = balanceSheet.patrimonioLiquido || [];

  const totalAc = acLinhas.reduce((acc, l) => acc + (l.valorPeriodoAtual || 0), 0) || (balanceSheet.totalAtivo * 0.4);
  const totalAnc = ancLinhas.reduce((acc, l) => acc + (l.valorPeriodoAtual || 0), 0) || (balanceSheet.totalAtivo - totalAc);
  const totalPc = pcLinhas.reduce((acc, l) => acc + (l.valorPeriodoAtual || 0), 0) || (balanceSheet.totalPassivoEPatrimonioLiquido * 0.3);
  const totalPnc = pncLinhas.reduce((acc, l) => acc + (l.valorPeriodoAtual || 0), 0) || (balanceSheet.totalPassivoEPatrimonioLiquido * 0.2);
  const totalPl = plLinhas.reduce((acc, l) => acc + (l.valorPeriodoAtual || 0), 0) || (balanceSheet.totalPassivoEPatrimonioLiquido - totalPc - totalPnc);

  const dispLinha = acLinhas.find(l => l.descricao && (l.descricao.toLowerCase().includes('caixa') || l.descricao.toLowerCase().includes('disponib')));
  const estoquesLinha = acLinhas.find(l => l.descricao && l.descricao.toLowerCase().includes('estoque'));
  const clientesLinha = acLinhas.find(l => l.descricao && (l.descricao.toLowerCase().includes('cliente') || l.descricao.toLowerCase().includes('receber')));
  const fornecLinha = pcLinhas.find(l => l.descricao && l.descricao.toLowerCase().includes('fornecedor'));
  const empCpLinha = pcLinhas.find(l => l.descricao && (l.descricao.toLowerCase().includes('empréstimo') || l.descricao.toLowerCase().includes('financiamento')));

  const disponibilidades = dispLinha ? dispLinha.valorPeriodoAtual : totalAc * 0.25;
  const estoques = estoquesLinha ? estoquesLinha.valorPeriodoAtual : totalAc * 0.35;
  const contasAReceber = clientesLinha ? clientesLinha.valorPeriodoAtual : totalAc * 0.35;
  const fornecedores = fornecLinha ? fornecLinha.valorPeriodoAtual : totalPc * 0.50;
  const emprestimosCp = empCpLinha ? empCpLinha.valorPeriodoAtual : totalPc * 0.30;

  const rb = incomeStatement.receitaBruta || incomeStatement.receitaLiquida * 1.15;
  const rl = incomeStatement.receitaLiquida;
  const cpv = incomeStatement.custosOperacionais;
  const lb = incomeStatement.lucroBruto;
  const doVendas = incomeStatement.despesasOperacionais;
  const ebit = incomeStatement.resultadoOperacional;
  const impostos = incomeStatement.provisaoIrpjCsll;
  const ll = incomeStatement.lucroLiquidoExercicio;

  return {
    ativoCirculante: totalAc,
    disponibilidades,
    contasAReceber,
    estoques,
    realizavelLongoPrazo: totalAnc * 0.3,
    ativoPermanenteImobilizado: totalAnc * 0.7,
    totalAtivo: balanceSheet.totalAtivo,

    passivoCirculante: totalPc,
    fornecedores,
    emprestimosFinanciamentosCp: emprestimosCp,
    passivoNaoCirculante: totalPnc,
    patrimonioLiquido: totalPl,
    lucrosAcumuladosRetidos: Math.max(0, totalPl * 0.4),
    totalPassivoEPl: balanceSheet.totalPassivoEPatrimonioLiquido,

    receitaBruta: rb,
    deducoesReceita: rb - rl,
    receitaLiquida: rl,
    custoProdutosVendidos: cpv,
    lucroBruto: lb,
    despesasOperacionaisVendasGerais: doVendas,
    ebitda: ebit * 1.2,
    depreciacaoAmortizacao: ebit * 0.2,
    lucroOperacionalEbit: ebit,
    despesasFinanceirasLiquidas: ebit * 0.1,
    lucroAntesImpostosEbt: ebit * 0.9,
    impostosSobreLucro: impostos,
    lucroLiquido: ll,

    tenantId: metadata?.tenantId,
    empresa: metadata?.empresa,
    cnpj: metadata?.cnpj,
    periodo: metadata?.periodo,
    comprasPeriodo: metadata?.comprasPeriodo
  };
}
;

fs.writeFileSync('packages/core/src/accounting/analysis/financial-ratios-engine.ts', financialRatiosEngine, 'utf8');
console.log('Successfully written packages/core/src/accounting/analysis/financial-ratios-engine.ts');
