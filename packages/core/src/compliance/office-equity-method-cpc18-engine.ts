import { Result, Ok, Err } from '../types/result.js';

export interface EquityMethodInput {
  investidoraCnpj: string;
  investidoraRazaoSocial: string;
  investidaCnpj: string;
  investidaRazaoSocial: string;
  percentualParticipacaoSocietariaPercent: number; // Ex: 40%
  patrimonioLiquidoInicialInvestidaBrl: number;
  lucroLiquidoPeriodoInvestidaBrl: number;
  lucrosNaoRealizadosIntercompanyBrl: number; // Estoques ainda no balanço
  dividendosDistribuidosInvestidaBrl: number; // Reduz o saldo do investimento
}

export interface EquityMethodResult {
  investidoraRazaoSocial: string;
  investidaRazaoSocial: string;
  percentualParticipacaoPercent: number;
  lucroLiquidoAjustadoInvestidaBrl: number;
  valorResultadoEquivalenciaPatrimonialBrl: number;
  tipoResultadoMep: 'GANHO_EQUIVALENCIA_POSITIVA' | 'PERDA_EQUIVALENCIA_NEGATIVA';
  valorReducaoDividendosReceberBrl: number;
  patrimonioLiquidoFinalInvestidaBrl: number;
  saldoFinalInvestimentoInvestidoraBrl: number;
  statusApuracao: 'MEP_CPC18_APURADO_COM_SUCESSO';
  diagnosticoMep: string;
}

export function processOfficeEquityMethodCpc18Engine(input: EquityMethodInput): Result<EquityMethodResult, Error> {
  const {
    investidoraCnpj,
    investidoraRazaoSocial,
    investidaCnpj,
    investidaRazaoSocial,
    percentualParticipacaoSocietariaPercent,
    patrimonioLiquidoInicialInvestidaBrl,
    lucroLiquidoPeriodoInvestidaBrl,
    lucrosNaoRealizadosIntercompanyBrl,
    dividendosDistribuidosInvestidaBrl
  } = input;

  if (!investidoraCnpj || !investidaCnpj || percentualParticipacaoSocietariaPercent <= 0 || percentualParticipacaoSocietariaPercent > 100) {
    return Err(new Error('CNPJs e percentual de participação societária válido são obrigatórios.'));
  }

  // Lucro ajustado após expurgo de lucros não realizados intercompany
  const lucroAjustado = lucroLiquidoPeriodoInvestidaBrl - lucrosNaoRealizadosIntercompanyBrl;

  // Resultado de Equivalência Patrimonial = Percentual x Lucro Ajustado
  const resultadoMep = (lucroAjustado * percentualParticipacaoSocietariaPercent) / 100;
  const tipo = resultadoMep >= 0 ? 'GANHO_EQUIVALENCIA_POSITIVA' : 'PERDA_EQUIVALENCIA_NEGATIVA';

  // Dividendos recebidos reduzem o valor contábil do investimento (não são receita de dividendos no MEP)
  const parcelaDividendos = (dividendosDistribuidosInvestidaBrl * percentualParticipacaoSocietariaPercent) / 100;

  // PL final da investida
  const plFinalInvestida = patrimonioLiquidoInicialInvestidaBrl + lucroLiquidoPeriodoInvestidaBrl - dividendosDistribuidosInvestidaBrl;

  // Saldo contábil final do investimento na investidora
  const saldoFinalInvestimento = (plFinalInvestida * percentualParticipacaoSocietariaPercent) / 100;

  const diag = "Equivalência Patrimonial CPC 18 (" + investidoraRazaoSocial + " em " + investidaRazaoSocial + " - " + percentualParticipacaoSocietariaPercent + "%): Lucro Investida: R$ " + lucroLiquidoPeriodoInvestidaBrl.toFixed(2) + " (Expurgos Intercompany: R$ " + lucrosNaoRealizadosIntercompanyBrl.toFixed(2) + ") | Resultado MEP: R$ " + resultadoMep.toFixed(2) + " (" + tipo + ") | Dividendos a Receber: R$ " + parcelaDividendos.toFixed(2) + " | Saldo Contábil do Investimento: R$ " + saldoFinalInvestimento.toFixed(2) + ".";

  return Ok({
    investidoraRazaoSocial,
    investidaRazaoSocial,
    percentualParticipacaoPercent: percentualParticipacaoSocietariaPercent,
    lucroLiquidoAjustadoInvestidaBrl: parseFloat(lucroAjustado.toFixed(2)),
    valorResultadoEquivalenciaPatrimonialBrl: parseFloat(resultadoMep.toFixed(2)),
    tipoResultadoMep: tipo,
    valorReducaoDividendosReceberBrl: parseFloat(parcelaDividendos.toFixed(2)),
    patrimonioLiquidoFinalInvestidaBrl: parseFloat(plFinalInvestida.toFixed(2)),
    saldoFinalInvestimentoInvestidoraBrl: parseFloat(saldoFinalInvestimento.toFixed(2)),
    statusApuracao: 'MEP_CPC18_APURADO_COM_SUCESSO',
    diagnosticoMep: diag
  });
}
