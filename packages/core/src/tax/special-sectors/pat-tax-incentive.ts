import { Result, Ok } from '../../types/result.js';

export interface PatIncentiveInput {
  anoCalendario: number;
  totalDespesasAlimentacaoTrabalhadoresAte5Sm: number;
  irpjDevidoApuradoAliquota15: number;
}

export interface PatIncentiveResult {
  anoCalendario: number;
  despesasAlimentacaoElegiveis: number;
  incentivoPatCalculado15Percent: number;
  limiteMaximoDeducaoIrpj4Percent: number;
  deducaoEfetivaIrpjNoExercicio: number;
  excessoIncentivoACompensarProximosAnos: number;
  irpjLiquidoAPagar: number;
}

export function calculatePatTaxIncentive(input: PatIncentiveInput): Result<PatIncentiveResult, Error> {
  const { anoCalendario, totalDespesasAlimentacaoTrabalhadoresAte5Sm, irpjDevidoApuradoAliquota15 } = input;

  const incentivoCalculado = Number((totalDespesasAlimentacaoTrabalhadoresAte5Sm * 0.15).toFixed(2));
  const limiteDeducao = Number((irpjDevidoApuradoAliquota15 * 0.04).toFixed(2));

  const deducaoEfetiva = Number(Math.min(incentivoCalculado, limiteDeducao).toFixed(2));
  const excessoCompensar = Number(Math.max(0, incentivoCalculado - limiteDeducao).toFixed(2));
  const irpjLiquido = Number((irpjDevidoApuradoAliquota15 - deducaoEfetiva).toFixed(2));

  return Ok({
    anoCalendario,
    despesasAlimentacaoElegiveis: totalDespesasAlimentacaoTrabalhadoresAte5Sm,
    incentivoPatCalculado15Percent: incentivoCalculado,
    limiteMaximoDeducaoIrpj4Percent: limiteDeducao,
    deducaoEfetivaIrpjNoExercicio: deducaoEfetiva,
    excessoIncentivoACompensarProximosAnos: excessoCompensar,
    irpjLiquidoAPagar: irpjLiquido
  });
}
