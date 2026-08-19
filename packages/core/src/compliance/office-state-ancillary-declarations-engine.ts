import { Result, Ok, Err } from '../types/result.js';

export interface StateAncillaryInput {
  clienteCnpj: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  uf: 'SP' | 'MG' | 'SC' | 'RJ' | 'PR' | 'RS' | 'BA';
  tipoDeclaracao: 'GIA_SP' | 'DESTDA_SIMPLES' | 'DIME_SC' | 'DAPI_MG' | 'SINTEGRA';
  mesAnoCompetencia: string;
  valorTotalDebitosIcmsBrl: number;
  valorTotalCreditosIcmsBrl: number;
  valorIcmsStDevidoBrl: number;
  valorDifalDevidoBrl: number;
}

export interface StateAncillaryResult {
  clienteCnpj: string;
  razaoSocial: string;
  tipoDeclaracao: string;
  mesAnoCompetencia: string;
  saldoIcmsProprioARecolherBrl: number;
  saldoIcmsStARecolherBrl: number;
  saldoDifalARecolherBrl: number;
  arquivoEstruturadoGerado: string;
  statusDeclaracao: 'DECLARACAO_ESTADUAL_APURADA_E_PRONTA_ENVIO';
  diagnosticoEstadual: string;
}

export function processOfficeStateAncillaryDeclarationsEngine(input: StateAncillaryInput): Result<StateAncillaryResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    inscricaoEstadual,
    uf,
    tipoDeclaracao,
    mesAnoCompetencia,
    valorTotalDebitosIcmsBrl,
    valorTotalCreditosIcmsBrl,
    valorIcmsStDevidoBrl,
    valorDifalDevidoBrl
  } = input;

  if (!clienteCnpj || !inscricaoEstadual || !mesAnoCompetencia) {
    return Err(new Error('CNPJ, IE e competência são obrigatórios.'));
  }

  const saldoIcms = Math.max(0, valorTotalDebitosIcmsBrl - valorTotalCreditosIcmsBrl);

  const arquivo = tipoDeclaracao + "_" + uf + "_" + mesAnoCompetencia.replace('-', '') + "_" + inscricaoEstadual + ".txt";

  const diag = "Obrigação Estadual (" + razaoSocial + " - " + tipoDeclaracao + " / " + uf + "): ICMS Próprio a Recolher: R$ " + saldoIcms.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | ICMS ST: R$ " + valorIcmsStDevidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | DIFAL: R$ " + valorDifalDevidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Arquivo: " + arquivo + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    tipoDeclaracao,
    mesAnoCompetencia,
    saldoIcmsProprioARecolherBrl: parseFloat(saldoIcms.toFixed(2)),
    saldoIcmsStARecolherBrl: parseFloat(valorIcmsStDevidoBrl.toFixed(2)),
    saldoDifalARecolherBrl: parseFloat(valorDifalDevidoBrl.toFixed(2)),
    arquivoEstruturadoGerado: arquivo,
    statusDeclaracao: 'DECLARACAO_ESTADUAL_APURADA_E_PRONTA_ENVIO',
    diagnosticoEstadual: diag
  });
}
