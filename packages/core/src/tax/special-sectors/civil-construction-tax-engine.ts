import { Result, Ok, Err } from '../../types/result.js';

export type ConstructionContractType = 'EMPREITADA_TOTAL_COM_FORNECIMENTO_MATERIAIS' | 'EMPREITADA_PARCIAL_MAO_DE_OBRA';

export interface CivilConstructionTaxInput {
  notaFiscalServicoId: string;
  construtoraNome: string;
  tipoContrato: ConstructionContractType;
  optanteCprbDesoneracaoFolha: boolean; // Se true -> retenção INSS é 3,5%; se false -> 11,0% (Lei 12.546/11)
  valorBrutoNotaFiscalBrl: number;
  valorMateriaisEquipamentosDeducoesBrl?: number; // Dedução comprovada de materiais incorporados à obra (Tema 247 STF)
  aliquotaIssqnMunicipalPercent?: number; // Ex: 5% ou 3%
}

export interface CivilConstructionTaxResult {
  notaFiscalServicoId: string;
  construtoraNome: string;
  baseCalculoMaoDeObraBrl: number;
  aliquotaInssRetencaoPercent: number;
  valorInssRetidoFonteBrl: number;
  baseCalculoIssqnDeducoesBrl: number;
  valorIssqnDevidoBrl: number;
  retencaoPisCofinsCsll465Brl: number;
  retencaoIrpj15Brl: number;
  valorLiquidoReceberBrl: number;
  diagnosticoFiscal: string;
}

export function processCivilConstructionTaxEngine(input: CivilConstructionTaxInput): Result<CivilConstructionTaxResult, Error> {
  const {
    notaFiscalServicoId,
    construtoraNome,
    tipoContrato,
    optanteCprbDesoneracaoFolha,
    valorBrutoNotaFiscalBrl,
    valorMateriaisEquipamentosDeducoesBrl = 0,
    aliquotaIssqnMunicipalPercent = 5.0
  } = input;

  if (valorBrutoNotaFiscalBrl <= 0) {
    return Err(new Error('Valor bruto da nota fiscal de construção civil deve ser superior a zero.'));
  }

  // Dedução de materiais e equipamentos para fins de INSS e ISSQN (IN RFB 2.110/22 & Tema 247 STF)
  // Caso haja fornecimento de materiais com previsão contratual, a base de mão de obra pode ser deduzida (mínimo 50% por presunção ou valor real comprovado)
  const deducoes = Math.min(valorMateriaisEquipamentosDeducoesBrl, valorBrutoNotaFiscalBrl * 0.70);
  const baseMaoDeObra = Number((valorBrutoNotaFiscalBrl - deducoes).toFixed(2));

  // Alíquota de Retenção de INSS: 3,5% se optante pela CPRB / Desoneração ou 11,0% se não optante
  const aliqInss = optanteCprbDesoneracaoFolha ? 3.5 : 11.0;
  const inssRetido = Number((baseMaoDeObra * (aliqInss / 100)).toFixed(2));

  // ISSQN: Incide sobre o valor bruto deduzido dos materiais incorporados (Tema 247 STF)
  const baseIss = Number((valorBrutoNotaFiscalBrl - deducoes).toFixed(2));
  const valorIss = Number((baseIss * (aliquotaIssqnMunicipalPercent / 100)).toFixed(2));

  // Retenções Federais (Lei 10.833/03 & RIR/2018):
  // 4,65% (PIS 0,65% + COFINS 3,0% + CSLL 1,0%) e 1,5% (IRPJ) sobre o valor total da prestação
  const retencao465 = Number((valorBrutoNotaFiscalBrl * 0.0465).toFixed(2));
  const retencaoIrpj = Number((valorBrutoNotaFiscalBrl * 0.0150).toFixed(2));

  const totalRetencoes = Number((inssRetido + retencao465 + retencaoIrpj).toFixed(2));
  const valorLiquido = Number((valorBrutoNotaFiscalBrl - totalRetencoes).toFixed(2));

  const diag = 'Construção Civil (IN RFB nº 2.110/22 & STF Tema 247): ' + construtoraNome + '. NF R$ ' + valorBrutoNotaFiscalBrl.toFixed(2) + ' (Dedução Materiais R$ ' + deducoes.toFixed(2) + '). Base de Mão de Obra: R$ ' + baseMaoDeObra.toFixed(2) + '. INSS Retido (' + aliqInss + '% ' + (optanteCprbDesoneracaoFolha ? 'CPRB Desoneração' : 'Regime Geral') + '): R$ ' + inssRetido.toFixed(2) + '. Retenções Federais: R$ ' + (retencao465 + retencaoIrpj).toFixed(2) + '. ISSQN (' + aliquotaIssqnMunicipalPercent + '%): R$ ' + valorIss.toFixed(2) + '. Valor Líquido: R$ ' + valorLiquido.toFixed(2) + '.';

  return Ok({
    notaFiscalServicoId,
    construtoraNome,
    baseCalculoMaoDeObraBrl: baseMaoDeObra,
    aliquotaInssRetencaoPercent: aliqInss,
    valorInssRetidoFonteBrl: inssRetido,
    baseCalculoIssqnDeducoesBrl: baseIss,
    valorIssqnDevidoBrl: valorIss,
    retencaoPisCofinsCsll465Brl: retencao465,
    retencaoIrpj15Brl: retencaoIrpj,
    valorLiquidoReceberBrl: valorLiquido,
    diagnosticoFiscal: diag
  });
}
