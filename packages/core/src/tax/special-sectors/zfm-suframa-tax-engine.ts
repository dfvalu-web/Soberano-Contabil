import { Result, Ok, Err } from '../../types/result.js';

export type ZfmOperationType = 'VENDA_NACIONAL_DESTINO_ZFM' | 'INDUSTRIA_PIM_PPB';

export interface ZfmTaxCalculationInput {
  operacaoTipo: ZfmOperationType;
  inscricaoSuframaDestinatario: string;
  valorBrutoMercadoriasBrl: number;
  aliquotaIpiPadraoPercent: number; // Ex: 15%
  aliquotaIcmsOrigemPercent: number; // Ex: 12% ou 7%
  importacoesInsumosCifBrl?: number; // Para Indústria PIM
  percentualCreditoEstimuloIcmsAm?: number; // Ex: 75% para bens intermediários / 100% outros
}

export interface ZfmTaxCalculationResult {
  operacaoTipo: ZfmOperationType;
  suframaInscricao: string;
  valorBruto: number;
  desoneracaoPisCofinsAliquotaZero9_25Percent: number;
  desoneracaoIsencaoIpiBrl: number;
  desoneracaoIcmsDescontoPrecoBrl: number;
  creditoEstimuloIcmsAmazonasBrl: number;
  totalDesoneracaoEconomicoFiscalBrl: number;
  diagnosticoSuframaZfm: string;
}

export function calculateZfmSuframaTaxBenefits(input: ZfmTaxCalculationInput): Result<ZfmTaxCalculationResult, Error> {
  const { operacaoTipo, inscricaoSuframaDestinatario, valorBrutoMercadoriasBrl, aliquotaIpiPadraoPercent, aliquotaIcmsOrigemPercent, percentualCreditoEstimuloIcmsAm = 0 } = input;

  if (valorBrutoMercadoriasBrl <= 0) {
    return Err(new Error('Valor bruto das mercadorias ZFM deve ser superior a zero.'));
  }

  // 1. PIS/COFINS Alíquota Zero nas Vendas para ZFM (Art. 4º da Lei nº 10.996/2004)
  const pisCofinsZero = Number((valorBrutoMercadoriasBrl * 0.0925).toFixed(2));

  // 2. Isenção de IPI (Decreto-Lei nº 288/1967)
  const ipiIsento = Number((valorBrutoMercadoriasBrl * (aliquotaIpiPadraoPercent / 100)).toFixed(2));

  // 3. Desoneração de ICMS (Convênio ICMS 65/1988)
  const icmsDesonerado = Number((valorBrutoMercadoriasBrl * (aliquotaIcmsOrigemPercent / 100)).toFixed(2));

  // 4. Crédito Estímulo ICMS Amazonas (Lei Estadual AM nº 2.826/2003)
  const creditoEstimulo = Number((icmsDesonerado * (percentualCreditoEstimuloIcmsAm / 100)).toFixed(2));

  const totalBeneficio = Number((pisCofinsZero + ipiIsento + icmsDesonerado + creditoEstimulo).toFixed(2));

  const diagnostico = 'Zona Franca de Manaus (SUFRAMA nº ' + inscricaoSuframaDestinatario + '): Operação ' + operacaoTipo + '. Desoneração total de R$ ' + totalBeneficio.toFixed(2) + ' (PIS/COFINS 0%: R$ ' + pisCofinsZero.toFixed(2) + ', IPI Isento: R$ ' + ipiIsento.toFixed(2) + ', ICMS Desonerado: R$ ' + icmsDesonerado.toFixed(2) + ').';

  return Ok({
    operacaoTipo,
    suframaInscricao: inscricaoSuframaDestinatario,
    valorBruto: valorBrutoMercadoriasBrl,
    desoneracaoPisCofinsAliquotaZero9_25Percent: pisCofinsZero,
    desoneracaoIsencaoIpiBrl: ipiIsento,
    desoneracaoIcmsDescontoPrecoBrl: icmsDesonerado,
    creditoEstimuloIcmsAmazonasBrl: creditoEstimulo,
    totalDesoneracaoEconomicoFiscalBrl: totalBeneficio,
    diagnosticoSuframaZfm: diagnostico
  });
}
