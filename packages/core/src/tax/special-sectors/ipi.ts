import { Result, Ok } from '../../types/result.js';

export interface IpiInput {
  valorProduto: number;
  valorFreteSeguroOutrasDespesas?: number;
  aliquotaTipiPercent: number;
  isImuneOuIsento: boolean;
}

export interface IpiResult {
  baseCalculoIpi: number;
  aliquotaTipi: number;
  valorIpiDevido: number;
}

export function calculateIpi(input: IpiInput): Result<IpiResult, Error> {
  const { valorProduto, valorFreteSeguroOutrasDespesas = 0, aliquotaTipiPercent, isImuneOuIsento } = input;
  if (isImuneOuIsento) {
    return Ok({ baseCalculoIpi: 0, aliquotaTipi: 0, valorIpiDevido: 0 });
  }
  const baseCalculoIpi = Number((valorProduto + valorFreteSeguroOutrasDespesas).toFixed(2));
  const valorIpiDevido = Number((baseCalculoIpi * aliquotaTipiPercent).toFixed(2));

  return Ok({ baseCalculoIpi, aliquotaTipi: aliquotaTipiPercent, valorIpiDevido });
}
