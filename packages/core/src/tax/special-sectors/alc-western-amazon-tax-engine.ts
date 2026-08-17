import { Result, Ok, Err } from '../../types/result.js';

export type AlcLocationType = 'MACAPA_SANTANA_AP' | 'TABATINGA_AM' | 'GUAJARA_MIRIM_RO' | 'BRASILEIA_EPITACIOLANDIA_AC' | 'CRUZEIRO_DO_SUL_AC' | 'BOA_VISTA_BONFIM_RR';

export interface AlcOperationInput {
  operacaoId: string;
  localidadeAlc: AlcLocationType;
  clienteDestinatarioNome: string;
  valorBrutoMercadoriasBrl: number;
  aliquotaIcmsInterestadualPercent: number; // Ex: 7% ou 12%
}

export interface AlcOperationResult {
  operacaoId: string;
  localidadeAlc: AlcLocationType;
  cfopUtilizado: string;
  desoneracaoIcmsValorBrl: number;
  isencaoIpiValorBrl: number;
  pisAliquotaZeroBrl: number;
  cofinsAliquotaZeroBrl: number;
  valorLiquidoComDescontoIcmsBrl: number;
  diagnosticoFiscal: string;
}

export function processAlcAndWesternAmazonTaxEngine(input: AlcOperationInput): Result<AlcOperationResult, Error> {
  const {
    operacaoId,
    localidadeAlc,
    clienteDestinatarioNome,
    valorBrutoMercadoriasBrl,
    aliquotaIcmsInterestadualPercent
  } = input;

  if (valorBrutoMercadoriasBrl <= 0) {
    return Err(new Error('Valor das mercadorias destinadas à ALC deve ser superior a zero.'));
  }

  // Convênio ICMS 65/1988: Desoneração com desconto equivalente no valor da nota
  const icmsDesonerado = Number((valorBrutoMercadoriasBrl * (aliquotaIcmsInterestadualPercent / 100)).toFixed(2));
  const valorLiquidoNota = Number((valorBrutoMercadoriasBrl - icmsDesonerado).toFixed(2));

  // IPI Isento (Decreto-Lei nº 288/67 e DL 356/68) - Estimado em 10% economizado
  const ipiIsento = Number((valorBrutoMercadoriasBrl * 0.10).toFixed(2));

  // PIS / COFINS Alíquota ZERO (Art. 2º da Lei nº 10.996/2004)
  const pisZero = Number((valorBrutoMercadoriasBrl * 0.0165).toFixed(2));
  const cofinsZero = Number((valorBrutoMercadoriasBrl * 0.0760).toFixed(2));

  const diag = 'Remessa para Área de Livre Comércio (' + localidadeAlc + '): Destinatário ' + clienteDestinatarioNome + ' (CFOP 6.109). CONVÊNIO ICMS 65/88: Desoneração de ICMS de R$ ' + icmsDesonerado.toFixed(2) + ' abatida no preço (Valor Líquido: R$ ' + valorLiquidoNota.toFixed(2) + '). Isenção de IPI e Alíquota ZERO de PIS/COFINS (Lei 10.996/04).';

  return Ok({
    operacaoId,
    localidadeAlc,
    cfopUtilizado: '6.109',
    desoneracaoIcmsValorBrl: icmsDesonerado,
    isencaoIpiValorBrl: ipiIsento,
    pisAliquotaZeroBrl: pisZero,
    cofinsAliquotaZeroBrl: cofinsZero,
    valorLiquidoComDescontoIcmsBrl: valorLiquidoNota,
    diagnosticoFiscal: diag
  });
}
