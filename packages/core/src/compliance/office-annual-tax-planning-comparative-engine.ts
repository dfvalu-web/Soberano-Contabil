import { Result, Ok, Err } from '../types/result.js';

export interface TaxPlanningScenarioInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number; // Ex: 2026
  faturamentoBrutoAnualBrl: number;
  folhaPagamentoAnualComEncargosBrl: number;
  comprasMercadoriasInsumosAnualBrl: number;
  despesasOperacionaisAnualBrl: number;
  tipoAtividade: 'COMERCIO' | 'SERVICOS_GERAIS' | 'SERVICOS_PROFISSIONAIS' | 'INDUSTRIA';
}

export interface RegimeComparisonDetail {
  regime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'REFORMA_TRIBUTARIA_IBS_CBS';
  totalTributosAnuaisBrl: number;
  aliquotaEfetivaTotalPercent: number;
  lucroLiquidoAposTributosBrl: number;
}

export interface TaxPlanningComparisonResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  cenarioSimplesNacional: RegimeComparisonDetail;
  cenarioLucroPresumido: RegimeComparisonDetail;
  cenarioLucroReal: RegimeComparisonDetail;
  cenarioReformaTributaria: RegimeComparisonDetail;
  regimeMaisEconomico: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'REFORMA_TRIBUTARIA_IBS_CBS';
  economiaAnualProjetadaBrl: number;
  statusPlanejamento: 'PLANEJAMENTO_TRIBUTARIO_360_CONCLUIDO';
  diagnosticoPlanejamento: string;
}

export function processOfficeAnnualTaxPlanningComparativeEngine(input: TaxPlanningScenarioInput): Result<TaxPlanningComparisonResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    faturamentoBrutoAnualBrl,
    folhaPagamentoAnualComEncargosBrl,
    comprasMercadoriasInsumosAnualBrl,
    despesasOperacionaisAnualBrl,
    tipoAtividade
  } = input;

  if (!clienteCnpj || faturamentoBrutoAnualBrl <= 0) {
    return Err(new Error('CNPJ do cliente e faturamento bruto anual positivo são obrigatórios.'));
  }

  // 1. Simples Nacional (Estimativa Anexo III ou I conforme atividade e Fator R)
  const fatorR = (folhaPagamentoAnualComEncargosBrl / faturamentoBrutoAnualBrl) * 100;
  let aliqSimples = (tipoAtividade === 'COMERCIO') ? 0.085 : (fatorR >= 28 ? 0.12 : 0.175);
  const tribSimples = faturamentoBrutoAnualBrl * aliqSimples;

  // 2. Lucro Presumido (Presunção + PIS/COFINS 3.65% + ISS/ICMS)
  const aliqPresumido = (tipoAtividade === 'COMERCIO') ? 0.11 : 0.145; // IRPJ/CSLL + PIS/COFINS + Estadual/Municipal
  const inssPatronalPresumido = folhaPagamentoAnualComEncargosBrl * 0.28; // 20% + RAT + Terceiros
  const tribPresumido = (faturamentoBrutoAnualBrl * aliqPresumido) + inssPatronalPresumido;

  // 3. Lucro Real (Lucro Contábil tributado a 34% IRPJ/CSLL + PIS/COFINS 9.25% não-cumulativo c/ créditos)
  const creditosPisCofins = comprasMercadoriasInsumosAnualBrl * 0.0925;
  const debitoPisCofins = faturamentoBrutoAnualBrl * 0.0925;
  const pisCofinsReal = Math.max(0, debitoPisCofins - creditosPisCofins);
  const lucroAntesIrCs = faturamentoBrutoAnualBrl - comprasMercadoriasInsumosAnualBrl - folhaPagamentoAnualComEncargosBrl - despesasOperacionaisAnualBrl;
  const irCsReal = Math.max(0, lucroAntesIrCs * 0.34);
  const inssPatronalReal = folhaPagamentoAnualComEncargosBrl * 0.28;
  const tribReal = irCsReal + pisCofinsReal + inssPatronalReal + (faturamentoBrutoAnualBrl * 0.04); // + ICMS/ISS

  // 4. Reforma Tributária (IBS/CBS estimada a 26.5% com crédito integral sobre compras)
  const debitoIbsCbs = faturamentoBrutoAnualBrl * 0.265;
  const creditoIbsCbs = comprasMercadoriasInsumosAnualBrl * 0.265;
  const ibsCbsLiquido = Math.max(0, debitoIbsCbs - creditoIbsCbs);
  const tribReforma = irCsReal + ibsCbsLiquido + inssPatronalReal;

  const regimes: RegimeComparisonDetail[] = [
    {
      regime: 'SIMPLES_NACIONAL',
      totalTributosAnuaisBrl: parseFloat(tribSimples.toFixed(2)),
      aliquotaEfetivaTotalPercent: parseFloat(((tribSimples / faturamentoBrutoAnualBrl) * 100).toFixed(2)),
      lucroLiquidoAposTributosBrl: parseFloat((faturamentoBrutoAnualBrl - comprasMercadoriasInsumosAnualBrl - folhaPagamentoAnualComEncargosBrl - despesasOperacionaisAnualBrl - tribSimples).toFixed(2))
    },
    {
      regime: 'LUCRO_PRESUMIDO',
      totalTributosAnuaisBrl: parseFloat(tribPresumido.toFixed(2)),
      aliquotaEfetivaTotalPercent: parseFloat(((tribPresumido / faturamentoBrutoAnualBrl) * 100).toFixed(2)),
      lucroLiquidoAposTributosBrl: parseFloat((faturamentoBrutoAnualBrl - comprasMercadoriasInsumosAnualBrl - folhaPagamentoAnualComEncargosBrl - despesasOperacionaisAnualBrl - tribPresumido).toFixed(2))
    },
    {
      regime: 'LUCRO_REAL',
      totalTributosAnuaisBrl: parseFloat(tribReal.toFixed(2)),
      aliquotaEfetivaTotalPercent: parseFloat(((tribReal / faturamentoBrutoAnualBrl) * 100).toFixed(2)),
      lucroLiquidoAposTributosBrl: parseFloat((faturamentoBrutoAnualBrl - comprasMercadoriasInsumosAnualBrl - folhaPagamentoAnualComEncargosBrl - despesasOperacionaisAnualBrl - tribReal).toFixed(2))
    },
    {
      regime: 'REFORMA_TRIBUTARIA_IBS_CBS',
      totalTributosAnuaisBrl: parseFloat(tribReforma.toFixed(2)),
      aliquotaEfetivaTotalPercent: parseFloat(((tribReforma / faturamentoBrutoAnualBrl) * 100).toFixed(2)),
      lucroLiquidoAposTributosBrl: parseFloat((faturamentoBrutoAnualBrl - comprasMercadoriasInsumosAnualBrl - folhaPagamentoAnualComEncargosBrl - despesasOperacionaisAnualBrl - tribReforma).toFixed(2))
    }
  ];

  // Ordena por menor valor de tributos
  const ordenados = [...regimes].sort((a, b) => a.totalTributosAnuaisBrl - b.totalTributosAnuaisBrl);
  const melhor = ordenados[0];
  const segundoMelhor = ordenados[1];
  const economia = segundoMelhor.totalTributosAnuaisBrl - melhor.totalTributosAnuaisBrl;

  const diag = "Planejamento Tributário " + anoExercicio + " (" + razaoSocial + "): Melhor Regime: " + melhor.regime + " (Tributos: R$ " + melhor.totalTributosAnuaisBrl.toLocaleString('pt-BR') + " / Aliq. Efetiva: " + melhor.aliquotaEfetivaTotalPercent + "%) | Economia Projetada vs 2º colocado: R$ " + economia.toLocaleString('pt-BR') + " ao ano.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    cenarioSimplesNacional: regimes[0],
    cenarioLucroPresumido: regimes[1],
    cenarioLucroReal: regimes[2],
    cenarioReformaTributaria: regimes[3],
    regimeMaisEconomico: melhor.regime,
    economiaAnualProjetadaBrl: parseFloat(economia.toFixed(2)),
    statusPlanejamento: 'PLANEJAMENTO_TRIBUTARIO_360_CONCLUIDO',
    diagnosticoPlanejamento: diag
  });
}
