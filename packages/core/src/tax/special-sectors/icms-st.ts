import { Result, Ok } from '../../types/result.js';

export interface IcmsStInput {
  valorOperacao: number;
  valorFreteSeguroOutrasDespesas?: number;
  mvaOriginalPercent: number;
  aliquotaInterestadualPercent: number;
  aliquotaInternaDestinoPercent: number;
  isInterestadual: boolean;
}

export interface IcmsStResult {
  baseCalculoProprio: number;
  icmsProprio: number;
  mvaAjustadaPercent: number;
  baseCalculoSt: number;
  icmsStTotalDevido: number;
}

export function calculateIcmsSt(input: IcmsStInput): Result<IcmsStResult, Error> {
  const {
    valorOperacao,
    valorFreteSeguroOutrasDespesas = 0,
    mvaOriginalPercent,
    aliquotaInterestadualPercent,
    aliquotaInternaDestinoPercent,
    isInterestadual
  } = input;

  const baseCalculoProprio = Number((valorOperacao + valorFreteSeguroOutrasDespesas).toFixed(2));
  const icmsProprio = Number((baseCalculoProprio * aliquotaInterestadualPercent).toFixed(2));

  let mvaAjustada = mvaOriginalPercent;
  if (isInterestadual && aliquotaInternaDestinoPercent > aliquotaInterestadualPercent) {
    const numerador = (1 + mvaOriginalPercent) * (1 - aliquotaInterestadualPercent);
    const denominador = 1 - aliquotaInternaDestinoPercent;
    mvaAjustada = Number(((numerador / denominador) - 1).toFixed(4));
  }

  const baseCalculoSt = Number((baseCalculoProprio * (1 + mvaAjustada)).toFixed(2));
  const debitoIcmsStBruto = Number((baseCalculoSt * aliquotaInternaDestinoPercent).toFixed(2));
  const icmsStTotalDevido = Number(Math.max(0, debitoIcmsStBruto - icmsProprio).toFixed(2));

  return Ok({
    baseCalculoProprio,
    icmsProprio,
    mvaAjustadaPercent: mvaAjustada,
    baseCalculoSt,
    icmsStTotalDevido
  });
}

export function calculateDifalEc87(
  valorOperacao: number,
  aliquotaInterestadual: number,
  aliquotaInternaDestino: number
): { difalTotal: number; aliquotaDiferencial: number } {
  const aliquotaDiferencial = Math.max(0, aliquotaInternaDestino - aliquotaInterestadual);
  const difalTotal = Number((valorOperacao * aliquotaDiferencial).toFixed(2));
  return { difalTotal, aliquotaDiferencial };
}
