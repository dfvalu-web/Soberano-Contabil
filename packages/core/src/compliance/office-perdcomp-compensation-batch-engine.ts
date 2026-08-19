import { Result, Ok, Err } from '../types/result.js';

export interface PerdcompBatchInput {
  clienteCnpj: string;
  razaoSocial: string;
  valorCreditoPrincipalBrl: number;
  taxaSelicAcumuladaMediaPercent: number; // Ex: 25.4% nos últimos 5 anos
  percentualHonorariosEscritorioPercent: number; // Ex: 20%
}

export interface PerdcompBatchResult {
  clienteCnpj: string;
  razaoSocial: string;
  valorCreditoPrincipalBrl: number;
  valorCorrecaoSelicBrl: number;
  valorTotalLiquidoRestituivelBrl: number;
  honorariosExitoEscritorioBrl: number;
  statusPerdcomp: 'LOTE_PERDCOMP_WEB_PRONTO_PARA_TRANSMISSAO';
  diagnosticoPerdcomp: string;
}

export function processOfficePerdcompCompensationBatchEngine(input: PerdcompBatchInput): Result<PerdcompBatchResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    valorCreditoPrincipalBrl,
    taxaSelicAcumuladaMediaPercent,
    percentualHonorariosEscritorioPercent
  } = input;

  if (!clienteCnpj || valorCreditoPrincipalBrl <= 0) {
    return Err(new Error('CNPJ e valor do crédito principal positivo são obrigatórios.'));
  }

  const correcaoSelic = (valorCreditoPrincipalBrl * taxaSelicAcumuladaMediaPercent) / 100;
  const valorTotal = valorCreditoPrincipalBrl + correcaoSelic;
  const honorarios = (valorTotal * percentualHonorariosEscritorioPercent) / 100;

  const diag = "Lote PER/DCOMP Web (" + razaoSocial + "): Crédito Principal: R$ " + valorCreditoPrincipalBrl.toLocaleString('pt-BR') + " | Correção SELIC: R$ " + correcaoSelic.toLocaleString('pt-BR') + " | Total a Recuperar: R$ " + valorTotal.toLocaleString('pt-BR') + " | Honorários de Êxito do Escritório: R$ " + honorarios.toLocaleString('pt-BR') + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    valorCreditoPrincipalBrl: parseFloat(valorCreditoPrincipalBrl.toFixed(2)),
    valorCorrecaoSelicBrl: parseFloat(correcaoSelic.toFixed(2)),
    valorTotalLiquidoRestituivelBrl: parseFloat(valorTotal.toFixed(2)),
    honorariosExitoEscritorioBrl: parseFloat(honorarios.toFixed(2)),
    statusPerdcomp: 'LOTE_PERDCOMP_WEB_PRONTO_PARA_TRANSMISSAO',
    diagnosticoPerdcomp: diag
  });
}
