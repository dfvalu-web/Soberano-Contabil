import { Result, Ok, Err } from '../../types/result.js';

export type RecyclingMaterialType = 'SUCATA_PLASTICO' | 'SUCATA_PAPEL_PAPELAO' | 'SUCATA_VIDRO' | 'SUCATA_FERRO_ACO_ALUMINIO';
export type RecyclingPartyType = 'INDUSTRIA_RECICLADORA_TRANSFORMADORA' | 'COOPERATIVA_CATADORES_PESSOA_FISICA' | 'COMERCIO_ATACADISTA_SUCATA';

export interface RecyclingTaxInput {
  operacaoId: string;
  tipoMaterial: RecyclingMaterialType;
  tipoAdquirente: RecyclingPartyType;
  tipoVendedor: RecyclingPartyType;
  valorTotalOperacaoBrl: number;
}

export interface RecyclingTaxResult {
  operacaoId: string;
  tipoMaterial: RecyclingMaterialType;
  suspensaoPisCofinsVenda: boolean;
  aliquotaPisCreditoPresumidoPercent: number;
  aliquotaCofinsCreditoPresumidoPercent: number;
  valorCreditoPresumidoPisBrl: number;
  valorCreditoPresumidoCofinsBrl: number;
  totalCreditoPresumidoApropriadoBrl: number;
  diagnosticoFiscal: string;
}

export function processRecyclingPackagingTaxEngine(input: RecyclingTaxInput): Result<RecyclingTaxResult, Error> {
  const {
    operacaoId,
    tipoMaterial,
    tipoAdquirente,
    tipoVendedor,
    valorTotalOperacaoBrl
  } = input;

  if (valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Valor da operação de reciclagem de materiais deve ser superior a zero.'));
  }

  // Lei nº 11.196/2005, Art. 48: Suspensão de PIS/COFINS na venda de desperdícios, resíduos ou aparas
  const suspensaoVenda = true;

  let aliqPisCred = 0;
  let aliqCofinsCred = 0;
  let pisCred = 0;
  let cofinsCred = 0;

  // Lei nº 12.058/2009 & Lei 11.196/2005: Indústria adquirente de cooperativa ou PF faz jus a crédito presumido de PIS (0,825% a 1,65%) e COFINS (3,80% a 7,60%)
  if (tipoAdquirente === 'INDUSTRIA_RECICLADORA_TRANSFORMADORA' && tipoVendedor === 'COOPERATIVA_CATADORES_PESSOA_FISICA') {
    aliqPisCred = 0.825; // 50% da alíquota básica
    aliqCofinsCred = 3.80;

    pisCred = Number((valorTotalOperacaoBrl * (aliqPisCred / 100)).toFixed(2));
    cofinsCred = Number((valorTotalOperacaoBrl * (aliqCofinsCred / 100)).toFixed(2));
  }

  const totalCred = Number((pisCred + cofinsCred).toFixed(2));

  const diag = 'Regime de Reciclagem (Lei nº 11.196/2005 & Lei nº 12.058/2009): Material ' + tipoMaterial + '. Venda com SUSPENSÃO de PIS/COFINS nos termos do Art. 48 da Lei 11.196/05. ' + (totalCred > 0 ? 'Indústria Transformadora faz jus a CRÉDITO PRESUMIDO de PIS (' + aliqPisCred + '%: R$ ' + pisCred.toFixed(2) + ') e COFINS (' + aliqCofinsCred + '%: R$ ' + cofinsCred.toFixed(2) + ') totalizando R$ ' + totalCred.toFixed(2) + ' de crédito fiscal.' : 'Sem crédito presumido na etapa.');

  return Ok({
    operacaoId,
    tipoMaterial,
    suspensaoPisCofinsVenda: suspensaoVenda,
    aliquotaPisCreditoPresumidoPercent: aliqPisCred,
    aliquotaCofinsCreditoPresumidoPercent: aliqCofinsCred,
    valorCreditoPresumidoPisBrl: pisCred,
    valorCreditoPresumidoCofinsBrl: cofinsCred,
    totalCreditoPresumidoApropriadoBrl: totalCred,
    diagnosticoFiscal: diag
  });
}
