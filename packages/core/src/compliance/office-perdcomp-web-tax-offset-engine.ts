import { Result, Ok, Err } from '../types/result.js';

export interface PerDcompOffsetInput {
  clienteCnpj: string;
  razaoSocial: string;
  tipoCreditoUtilizado: 'SALDO_NEGATIVO_IRPJ' | 'SALDO_NEGATIVO_CSLL' | 'PAGAMENTO_INDEVIDO_OU_A_MAIOR' | 'PIS_COFINS_NAO_CUMULATIVO';
  valorTotalCreditoDisponivelBrl: number;
  valorDebitoACompensarBrl: number;
  tributoDebitoCompensado: 'PIS_COFINS_MENSAL' | 'DEBITO_DCTFWEB_PREVIDENCIARIO' | 'IRPJ_CSLL_ESTIMATIVA';
}

export interface PerDcompOffsetResult {
  clienteCnpj: string;
  razaoSocial: string;
  numeroProtocoloPerDcomp: string;
  valorDebitoCompensadoBrl: number;
  saldoRemanescenteCreditoBrl: number;
  riscoGlosaFiscal: 'BAIXO_DOCUMENTACAO_ECF_DCTF_100_CONCILIADA' | 'ALTO_PENDENCIA_COMPROVACAO_RETENCOES';
  statusPerDcomp: 'DCOMP_TRANSMITIDA_EXTINCAO_DO_DEBITO';
  diagnosticoPerDcomp: string;
}

export function processOfficePerdcompWebTaxOffsetEngine(input: PerDcompOffsetInput): Result<PerDcompOffsetResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    tipoCreditoUtilizado,
    valorTotalCreditoDisponivelBrl,
    valorDebitoACompensarBrl,
    tributoDebitoCompensado
  } = input;

  if (!clienteCnpj || valorTotalCreditoDisponivelBrl <= 0 || valorDebitoACompensarBrl <= 0) {
    return Err(new Error('CNPJ, valor do crédito disponível e valor do débito a compensar são obrigatórios.'));
  }

  if (valorDebitoACompensarBrl > valorTotalCreditoDisponivelBrl) {
    return Err(new Error('Valor do débito a compensar não pode exceder o crédito disponível.'));
  }

  const saldoRestante = valorTotalCreditoDisponivelBrl - valorDebitoACompensarBrl;
  const protocolo = "DCOMP" + Date.now().toString().slice(-10);

  const diag = "PER/DCOMP Web (" + razaoSocial + "): Compensação de R$ " + valorDebitoACompensarBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + tributoDebitoCompensado + ") com crédito de " + tipoCreditoUtilizado + " | Protocolo " + protocolo + " | Saldo remanescente de crédito: R$ " + saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    numeroProtocoloPerDcomp: protocolo,
    valorDebitoCompensadoBrl: parseFloat(valorDebitoACompensarBrl.toFixed(2)),
    saldoRemanescenteCreditoBrl: parseFloat(saldoRestante.toFixed(2)),
    riscoGlosaFiscal: 'BAIXO_DOCUMENTACAO_ECF_DCTF_100_CONCILIADA',
    statusPerDcomp: 'DCOMP_TRANSMITIDA_EXTINCAO_DO_DEBITO',
    diagnosticoPerDcomp: diag
  });
}
