import { Result, Ok, Err } from '../../types/result.js';

export interface PlrEmployeeInput {
  colaboradorId: string;
  nome: string;
  cargo: string;
  valorPlrBrutoCalculado: number;
}

export interface PlrCalculationResult {
  colaboradorId: string;
  nome: string;
  valorPlrBruto: number;
  isencaoInssPatronal: number; // 0% de INSS
  isencaoFgts: number; // 0% de FGTS
  irrfExclusivoFontePlr: number;
  valorPlrLiquidoReceber: number;
  dedutibilidadeTotalLalurLucroReal: number;
}

export function calculatePlrProfitSharing(input: PlrEmployeeInput): Result<PlrCalculationResult, Error> {
  const { colaboradorId, nome, valorPlrBrutoCalculado } = input;

  if (valorPlrBrutoCalculado <= 0) {
    return Err(new Error('Valor de PLR deve ser superior a zero.'));
  }

  // Tabela Exclusiva na Fonte de PLR (Lei 10.101/2000):
  // Até 7.640,80: Isento
  // 7.640,81 a 9.922,28: 7.5% (Dedução 573.06)
  // 9.922,29 a 13.167,00: 15.0% (Dedução 1.317.23)
  // 13.167,01 a 16.380,38: 22.5% (Dedução 2.304.76)
  // Acima de 16.380,38: 27.5% (Dedução 3.123.78)

  let irrf = 0;
  if (valorPlrBrutoCalculado <= 7640.80) {
    irrf = 0;
  } else if (valorPlrBrutoCalculado <= 9922.28) {
    irrf = Number((valorPlrBrutoCalculado * 0.075 - 573.06).toFixed(2));
  } else if (valorPlrBrutoCalculado <= 13167.00) {
    irrf = Number((valorPlrBrutoCalculado * 0.150 - 1317.23).toFixed(2));
  } else if (valorPlrBrutoCalculado <= 16380.38) {
    irrf = Number((valorPlrBrutoCalculado * 0.225 - 2304.76).toFixed(2));
  } else {
    irrf = Number((valorPlrBrutoCalculado * 0.275 - 3123.78).toFixed(2));
  }

  irrf = Math.max(0, irrf);
  const liquido = Number((valorPlrBrutoCalculado - irrf).toFixed(2));

  return Ok({
    colaboradorId,
    nome,
    valorPlrBruto: valorPlrBrutoCalculado,
    isencaoInssPatronal: 0,
    isencaoFgts: 0,
    irrfExclusivoFontePlr: irrf,
    valorPlrLiquidoReceber: liquido,
    dedutibilidadeTotalLalurLucroReal: valorPlrBrutoCalculado
  });
}
