import { Result, Ok, Err } from '../../types/result.js';

export type AutoPartsSegmentType = 'FABRICANTE_IMPORTADOR_AUTOPECAS' | 'DISTRIBUIDORA_AUTOPECAS_VAREJO_OFICINA';
export type AutoPartsProductType = 'AUTOPECAS_GERAL' | 'PNEUS_CAMARAS_AR';

export interface AutoPartsMonophasicInput {
  operacaoId: string;
  segmento: AutoPartsSegmentType;
  tipoProduto: AutoPartsProductType;
  descricaoItem: string;
  valorTotalOperacaoBrl: number;
}

export interface AutoPartsMonophasicResult {
  operacaoId: string;
  segmento: AutoPartsSegmentType;
  tipoProduto: AutoPartsProductType;
  descricaoItem: string;
  cstPisCofinsUtilizado: string;
  aliquotaPisPercent: number;
  aliquotaCofinsPercent: number;
  pisMonofasicoDevidoBrl: number;
  cofinsMonofasicoDevidoBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processAutoPartsMonophasicTaxEngine(input: AutoPartsMonophasicInput): Result<AutoPartsMonophasicResult, Error> {
  const {
    operacaoId,
    segmento,
    tipoProduto,
    descricaoItem,
    valorTotalOperacaoBrl
  } = input;

  if (valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Valor total da operação de autopeças/pneus deve ser superior a zero.'));
  }

  if (segmento === 'FABRICANTE_IMPORTADOR_AUTOPECAS') {
    let aliqPis = 2.30;
    let aliqCofins = 10.80;

    if (tipoProduto === 'PNEUS_CAMARAS_AR') {
      aliqPis = 2.10;
      aliqCofins = 9.90;
    }

    const pis = Number((valorTotalOperacaoBrl * (aliqPis / 100)).toFixed(2));
    const cofins = Number((valorTotalOperacaoBrl * (aliqCofins / 100)).toFixed(2));

    const diag = 'Fabricante/Importador (Lei nº 10.485/2002): Item ' + descricaoItem + ' (' + tipoProduto + '). Alíquota concentrada de PIS (' + aliqPis + '%: R$ ' + pis.toFixed(2) + ') e COFINS (' + aliqCofins + '%: R$ ' + cofins.toFixed(2) + ') recolhidos na indústria (CST 02).';

    return Ok({
      operacaoId,
      segmento,
      tipoProduto,
      descricaoItem,
      cstPisCofinsUtilizado: '02',
      aliquotaPisPercent: aliqPis,
      aliquotaCofinsPercent: aliqCofins,
      pisMonofasicoDevidoBrl: pis,
      cofinsMonofasicoDevidoBrl: cofins,
      tributacaoVarejoZero: false,
      diagnosticoFiscal: diag
    });
  } else {
    // Varejistas, Lojas de Autopeças, Concessionárias e Oficinas Mecânicas: Alíquota ZERO (CST 04)
    const diag = 'Revenda / Varejo / Oficina Mecânica: Item ' + descricaoItem + '. CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero). PIS/COFINS Zero nos termos do Art. 3º da Lei nº 10.485/2002.';

    return Ok({
      operacaoId,
      segmento,
      tipoProduto,
      descricaoItem,
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
