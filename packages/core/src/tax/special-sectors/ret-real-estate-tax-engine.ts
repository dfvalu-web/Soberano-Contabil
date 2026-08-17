import { Result, Ok, Err } from '../../types/result.js';

export type RetModalityType = 'RET_PADRAO_4_PERCENT' | 'RET_MCMV_INTERESSE_SOCIAL_1_PERCENT';

export interface RetIncorporationInput {
  incorporacaoId: string;
  nomeEmpreendimento: string; // Ex: 'Residencial Reserva Imperial'
  numeroMatriculaRgiAfetacao: string;
  modalidade: RetModalityType;
  receitaMensalIncorporacaoBrl: number;
}

export interface RetIncorporationResult {
  incorporacaoId: string;
  empreendimento: string;
  matriculaRgi: string;
  modalidade: RetModalityType;
  receitaBrutaBrl: number;
  aliquotaUnificadaPercent: number;
  tributosUnificadosRet: {
    irpjBrl: number;
    csllBrl: number;
    pisBrl: number;
    cofinsBrl: number;
    totalRetAPagarBrl: number;
  };
  diagnosticoRet: string;
}

export function calculateRetRealEstateTax(input: RetIncorporationInput): Result<RetIncorporationResult, Error> {
  const { incorporacaoId, nomeEmpreendimento, numeroMatriculaRgiAfetacao, modalidade, receitaMensalIncorporacaoBrl } = input;

  if (receitaMensalIncorporacaoBrl <= 0) {
    return Err(new Error('Receita mensal da incorporação deve ser superior a zero.'));
  }

  let aliquotaTotal = 4.0;
  let irpjPerc = 1.26;
  let csllPerc = 0.66;
  let pisPerc = 0.37;
  let cofinsPerc = 1.71;

  if (modalidade === 'RET_MCMV_INTERESSE_SOCIAL_1_PERCENT') {
    aliquotaTotal = 1.0;
    irpjPerc = 0.31;
    csllPerc = 0.16;
    pisPerc = 0.09;
    cofinsPerc = 0.44;
  }

  const irpj = Number((receitaMensalIncorporacaoBrl * (irpjPerc / 100)).toFixed(2));
  const csll = Number((receitaMensalIncorporacaoBrl * (csllPerc / 100)).toFixed(2));
  const pis = Number((receitaMensalIncorporacaoBrl * (pisPerc / 100)).toFixed(2));
  const cofins = Number((receitaMensalIncorporacaoBrl * (cofinsPerc / 100)).toFixed(2));
  const totalRet = Number((irpj + csll + pis + cofins).toFixed(2));

  const diag = 'RET Construção Civil (Lei nº 10.931/2004 - Matrícula RGI nº ' + numeroMatriculaRgiAfetacao + '): Empreendimento ' + nomeEmpreendimento + ' (' + modalidade + '). Tributo unificado de ' + aliquotaTotal + '% totalizando R$ ' + totalRet.toFixed(2) + ' (IRPJ: R$ ' + irpj.toFixed(2) + ', CSLL: R$ ' + csll.toFixed(2) + ', PIS: R$ ' + pis.toFixed(2) + ', COFINS: R$ ' + cofins.toFixed(2) + ') sobre receita de R$ ' + receitaMensalIncorporacaoBrl.toFixed(2) + '.';

  return Ok({
    incorporacaoId,
    empreendimento: nomeEmpreendimento,
    matriculaRgi: numeroMatriculaRgiAfetacao,
    modalidade,
    receitaBruta: receitaMensalIncorporacaoBrl,
    aliquotaUnificadaPercent: aliquotaTotal,
    tributosUnificadosRet: {
      irpjBrl: irpj,
      csllBrl: csll,
      pisBrl: pis,
      cofinsBrl: cofins,
      totalRetAPagarBrl: totalRet
    },
    diagnosticoRet: diag
  });
}
