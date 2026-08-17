import { Company } from '../../types/company.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface AccumulatedTaxCreditInput {
  tipoCredito: 'ICMS_EXPORTACAO_DIFAL_ECREDAC' | 'PIS_COFINS_EXPORTACAO_NAO_CUMULATIVO' | 'IPI_SALDO_CREDOR_RESSARCIMENTO';
  periodoApuracao: string;
  valorSaldoCredorTotal: number;
  valorDebitosPropriosCompensaveisNoPeriodo: number;
  debitosTributosFederaisParaCompensacaoCruzadaDctfWeb: {
    irpjDevido: number;
    csllDevida: number;
    inssPrevidenciarioPatronal: number;
  };
}

export interface CreditRecoveryReport {
  empresa: string;
  cnpj: string;
  tipoCredito: string;
  valorCreditoAcumuladoTotal: number;
  valorCompensadoProprio: number;
  saldoDisponivelParaRessarcimentoOuCompensacaoCruzada: number;
  planoCompensacaoCruzadaPerDcomp: {
    compensacaoIrpj: number;
    compensacaoCsll: number;
    compensacaoInssPatronal: number;
    totalCompensadoCruzado: number;
    saldoRemanescenteParaPedidoRessarcimentoDinheiro: number;
  };
  numeroControlePerDcompSugerido: string;
  diagnosticoRessarcimento: string;
}

export function processCreditRecoveryPerDcomp(
  company: Company,
  input: AccumulatedTaxCreditInput
): Result<CreditRecoveryReport, Error> {
  const { tipoCredito, valorSaldoCredorTotal, valorDebitosPropriosCompensaveisNoPeriodo, debitosTributosFederaisParaCompensacaoCruzadaDctfWeb } = input;

  if (valorSaldoCredorTotal <= 0) {
    return Err(new Error('Saldo credor para ressarcimento deve ser superior a zero.'));
  }

  const compensadoProprio = Math.min(valorSaldoCredorTotal, valorDebitosPropriosCompensaveisNoPeriodo);
  let saldoDisponivel = Number((valorSaldoCredorTotal - compensadoProprio).toFixed(2));

  // Compensação cruzada PER/DCOMP
  const compIrpj = Math.min(saldoDisponivel, debitosTributosFederaisParaCompensacaoCruzadaDctfWeb.irpjDevido);
  saldoDisponivel = Number((saldoDisponivel - compIrpj).toFixed(2));

  const compCsll = Math.min(saldoDisponivel, debitosTributosFederaisParaCompensacaoCruzadaDctfWeb.csllDevida);
  saldoDisponivel = Number((saldoDisponivel - compCsll).toFixed(2));

  const compInss = Math.min(saldoDisponivel, debitosTributosFederaisParaCompensacaoCruzadaDctfWeb.inssPrevidenciarioPatronal);
  saldoDisponivel = Number((saldoDisponivel - compInss).toFixed(2));

  const totalCruzado = Number((compIrpj + compCsll + compInss).toFixed(2));

  const numPerDcomp = 'PERDCOMP-' + company.cnpj.replace(/\D/g, '').substring(0, 8) + '-' + Date.now().toString().substring(5);

  const diagnostico = `Foi gerado plano de monetização de crédito acumulado de ${tipoCredito}. Foram compensados R$ ${totalCruzado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em débitos federais/previdenciários (DCTFWeb), restando R$ ${saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para restituição em conta corrente bancária.`;

  return Ok({
    empresa: company.razaoSocial,
    cnpj: company.cnpj,
    tipoCredito,
    valorCreditoAcumuladoTotal: valorSaldoCredorTotal,
    valorCompensadoProprio: compensadoProprio,
    saldoDisponivelParaRessarcimentoOuCompensacaoCruzada: Number((valorSaldoCredorTotal - compensadoProprio).toFixed(2)),
    planoCompensacaoCruzadaPerDcomp: {
      compensacaoIrpj: compIrpj,
      compensacaoCsll: compCsll,
      compensacaoInssPatronal: compInss,
      totalCompensadoCruzado: totalCruzado,
      saldoRemanescenteParaPedidoRessarcimentoDinheiro: saldoDisponivel
    },
    numeroControlePerDcompSugerido: numPerDcomp,
    diagnosticoRessarcimento: diagnostico
  });
}
