import { Result, Ok, Err } from '../../types/result.js';

export type BeverageSegmentType = 'FABRICANTE_IMPORTADOR_BEBIDAS_FRIAS' | 'DISTRIBUIDORA_ATACADO_VAREJO_BAR_RESTAURANTE';
export type BeverageProductType = 'CERVEJA_CHOPE' | 'REFRIGERANTE_ENERGETICO' | 'AGUA_MINERAL';

export interface ColdBeveragesInput {
  operacaoId: string;
  segmento: BeverageSegmentType;
  tipoBebida: BeverageProductType;
  marcaDescricao: string;
  valorTotalOperacaoBrl: number;
}

export interface ColdBeveragesResult {
  operacaoId: string;
  segmento: BeverageSegmentType;
  tipoBebida: BeverageProductType;
  marcaDescricao: string;
  cstPisCofinsUtilizado: string;
  aliquotaPisPercent: number;
  aliquotaCofinsPercent: number;
  pisMonofasicoDevidoBrl: number;
  cofinsMonofasicoDevidoBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processColdBeveragesTaxEngine(input: ColdBeveragesInput): Result<ColdBeveragesResult, Error> {
  const {
    operacaoId,
    segmento,
    tipoBebida,
    marcaDescricao,
    valorTotalOperacaoBrl
  } = input;

  if (valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Valor total da operação de bebidas frias deve ser superior a zero.'));
  }

  if (segmento === 'FABRICANTE_IMPORTADOR_BEBIDAS_FRIAS') {
    let aliqPis = 2.32;
    let aliqCofins = 10.68;

    if (tipoBebida === 'REFRIGERANTE_ENERGETICO') {
      aliqPis = 1.86;
      aliqCofins = 8.54;
    } else if (tipoBebida === 'AGUA_MINERAL') {
      aliqPis = 1.65;
      aliqCofins = 7.60;
    }

    const pis = Number((valorTotalOperacaoBrl * (aliqPis / 100)).toFixed(2));
    const cofins = Number((valorTotalOperacaoBrl * (aliqCofins / 100)).toFixed(2));

    const diag = 'Fabricante/Cervejaria (Lei nº 13.097/2015): Produto ' + marcaDescricao + ' (' + tipoBebida + '). PIS (' + aliqPis + '%: R$ ' + pis.toFixed(2) + ') e COFINS (' + aliqCofins + '%: R$ ' + cofins.toFixed(2) + ') recolhidos na indústria (CST 02).';

    return Ok({
      operacaoId,
      segmento,
      tipoBebida,
      marcaDescricao,
      cstPisCofinsUtilizado: '02',
      aliquotaPisPercent: aliqPis,
      aliquotaCofinsPercent: aliqCofins,
      pisMonofasicoDevidoBrl: pis,
      cofinsMonofasicoDevidoBrl: cofins,
      tributacaoVarejoZero: false,
      diagnosticoFiscal: diag
    });
  } else {
    // Distribuidores, Bares, Restaurantes e Supermercados: Alíquota ZERO (CST 04)
    const diag = 'Revenda / Bar / Restaurante / Varejo: Produto ' + marcaDescricao + '. CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero de PIS e COFINS nos termos do Art. 28 da Lei nº 13.097/2015).';

    return Ok({
      operacaoId,
      segmento,
      tipoBebida,
      marcaDescricao,
      cstPisCofinsUtilizado: '04',
      aliquotaPisPercent: 0,
      aliquotaCofinsPercent: 0,
      pisMonofasicoDevidoBrl: 0,
      cofinsMonofasicoDevidoBrl: 0,
      tributacaoVarejoZero: true,
      diagnosticoFiscal: diag
    });
  }
}
