import { Result, Ok } from '../../types/result.js';

export interface IssqnInput {
  valorServico: number;
  aliquotaIssMunicipal: number;
  codigoServicoLc116: string;
  isRetencaoTomador: boolean;
  municipioPrestadorIbge: string;
  municipioTomadorIbge: string;
}

export interface IssqnResult {
  valorBase: number;
  aliquotaAplicada: number;
  issDevidoTotal: number;
  issRetidoTomador: number;
  issAPagarPrestador: number;
  responsavelRecolhimento: 'PRESTADOR' | 'TOMADOR';
}

export function calculateIssqn(input: IssqnInput): Result<IssqnResult, Error> {
  const { valorServico, aliquotaIssMunicipal, isRetencaoTomador } = input;
  const aliquota = Math.min(Math.max(aliquotaIssMunicipal, 0.02), 0.05);
  const issDevidoTotal = Number((valorServico * aliquota).toFixed(2));
  const issRetidoTomador = isRetencaoTomador ? issDevidoTotal : 0;
  const issAPagarPrestador = isRetencaoTomador ? 0 : issDevidoTotal;

  return Ok({
    valorBase: valorServico,
    aliquotaAplicada: aliquota,
    issDevidoTotal,
    issRetidoTomador,
    issAPagarPrestador,
    responsavelRecolhimento: isRetencaoTomador ? 'TOMADOR' : 'PRESTADOR'
  });
}
