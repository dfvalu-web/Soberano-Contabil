import { Result, Ok } from '../../types/result.js';

export interface ServiceWithholdingInput {
  transacaoId: string;
  tipoPapelEmpresa: 'TOMADORA_DE_SERVICOS' | 'PRESTADORA_DE_SERVICOS';
  tipoServico: 'SERVICOS_PROFISSIONAIS_TI_CONSULTORIA' | 'CESSAO_MAO_DE_OBRA_LIMPEZA_VIGILANCIA' | 'SERVICOS_GERAIS';
  valorBrutoNotaFiscal: number;
  aliquotaIssMunicipalPercent: number; // e.g. 5 para 5%
  optanteSimplesNacional: boolean;
}

export interface ServiceWithholdingResult {
  transacaoId: string;
  valorBrutoNotaFiscal: number;
  retencoesFederais: {
    irrfRetido: number; // 1.5%
    csrfRetido: number; // 4.65% (PIS 0.65% + COFINS 3% + CSLL 1%)
    pisRetido: number;
    cofinsRetido: number;
    csllRetida: number;
    codigoDarfCsrf: '5952';
    codigoDarfIrrf: '1708';
  };
  retencaoPrevidenciariaInss: {
    inssRetido11Percent: number;
    destinacaoDctfWeb: 'EFD-Reinf Evento R-2010/R-2020';
  };
  retencaoMunicipalIssqn: {
    issRetido: number;
    municipioRetencao: 'Tomador do Serviço (LC 116/2003)';
  };
  totalRetencoesSofridas: number;
  valorLiquidoFinanceiro: number;
}

export function calculateServiceWithholdings(input: ServiceWithholdingInput): Result<ServiceWithholdingResult, Error> {
  const { transacaoId, tipoServico, valorBrutoNotaFiscal, aliquotaIssMunicipalPercent, optanteSimplesNacional } = input;

  let irrf = 0;
  let csrf = 0;
  let inss = 0;
  let iss = 0;

  if (!optanteSimplesNacional) {
    if (tipoServico === 'SERVICOS_PROFISSIONAIS_TI_CONSULTORIA') {
      // IRRF 1.5%
      irrf = Number((valorBrutoNotaFiscal * 0.0150).toFixed(2));
      // CSRF 4.65%
      csrf = Number((valorBrutoNotaFiscal * 0.0465).toFixed(2));
    } else if (tipoServico === 'CESSAO_MAO_DE_OBRA_LIMPEZA_VIGILANCIA') {
      // INSS 11%
      inss = Number((valorBrutoNotaFiscal * 0.1100).toFixed(2));
      // IRRF 1.0% ou 1.5%
      irrf = Number((valorBrutoNotaFiscal * 0.0100).toFixed(2));
      // CSRF 4.65%
      csrf = Number((valorBrutoNotaFiscal * 0.0465).toFixed(2));
    }
  }

  // ISS Municipal retido
  if (aliquotaIssMunicipalPercent > 0) {
    iss = Number((valorBrutoNotaFiscal * (aliquotaIssMunicipalPercent / 100)).toFixed(2));
  }

  const pisRetido = Number((valorBrutoNotaFiscal * 0.0065).toFixed(2));
  const cofinsRetido = Number((valorBrutoNotaFiscal * 0.0300).toFixed(2));
  const csllRetida = Number((valorBrutoNotaFiscal * 0.0100).toFixed(2));

  const totalRetencoes = Number((irrf + csrf + inss + iss).toFixed(2));
  const valorLiquido = Number((valorBrutoNotaFiscal - totalRetencoes).toFixed(2));

  return Ok({
    transacaoId,
    valorBrutoNotaFiscal,
    retencoesFederais: {
      irrfRetido: irrf,
      csrfRetido: csrf,
      pisRetido,
      cofinsRetido,
      csllRetida,
      codigoDarfCsrf: '5952',
      codigoDarfIrrf: '1708'
    },
    retencaoPrevidenciariaInss: {
      inssRetido11Percent: inss,
      destinacaoDctfWeb: 'EFD-Reinf Evento R-2010/R-2020'
    },
    retencaoMunicipalIssqn: {
      issRetido: iss,
      municipioRetencao: 'Tomador do Serviço (LC 116/2003)'
    },
    totalRetencoesSofridas: totalRetencoes,
    valorLiquidoFinanceiro: valorLiquido
  });
}
