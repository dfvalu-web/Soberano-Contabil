import { Result, Ok, Err } from '../../types/result.js';

export type CosmeticsSegmentType = 'FABRICANTE_IMPORTADOR_COSMETICOS' | 'DISTRIBUIDORA_EQUIPARADA_A_INDUSTRIAL' | 'VAREJO_PERFUMARIA_DROGARIA_SALAO';
export type CosmeticsCategoryType = 'PERFUMARIA_E_FRAGRANCIAS' | 'MAQUIAGEM_E_COSMETICOS' | 'HIGIENE_PESSOAL_DESODORANTES';

export interface CosmeticsMonophasicInput {
  operacaoId: string;
  segmento: CosmeticsSegmentType;
  categoriaProduto: CosmeticsCategoryType;
  produtoDescricao: string;
  valorTotalOperacaoBrl: number;
}

export interface CosmeticsMonophasicResult {
  operacaoId: string;
  segmento: CosmeticsSegmentType;
  categoriaProduto: CosmeticsCategoryType;
  produtoDescricao: string;
  cstPisCofinsUtilizado: string;
  aliquotaPisPercent: number;
  aliquotaCofinsPercent: number;
  pisMonofasicoDevidoBrl: number;
  cofinsMonofasicoDevidoBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processCosmeticsMonophasicTaxEngine(input: CosmeticsMonophasicInput): Result<CosmeticsMonophasicResult, Error> {
  const {
    operacaoId,
    segmento,
    categoriaProduto,
    produtoDescricao,
    valorTotalOperacaoBrl
  } = input;

  if (valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Valor total da operação de cosméticos/perfumaria deve ser superior a zero.'));
  }

  if (segmento === 'FABRICANTE_IMPORTADOR_COSMETICOS' || segmento === 'DISTRIBUIDORA_EQUIPARADA_A_INDUSTRIAL') {
    // Alíquotas Concentradas da Lei nº 10.147/2000: PIS 2,20% e COFINS 10,30%
    const aliqPis = 2.20;
    const aliqCofins = 10.30;

    const pis = Number((valorTotalOperacaoBrl * (aliqPis / 100)).toFixed(2));
    const cofins = Number((valorTotalOperacaoBrl * (aliqCofins / 100)).toFixed(2));

    const diag = (segmento === 'FABRICANTE_IMPORTADOR_COSMETICOS' ? 'Indústria/Importador' : 'Distribuidor Equiparado a Industrial (Dec. 8.393/15)') + ': Produto ' + produtoDescricao + ' (' + categoriaProduto + '). PIS (' + aliqPis + '%: R$ ' + pis.toFixed(2) + ') e COFINS (' + aliqCofins + '%: R$ ' + cofins.toFixed(2) + ') recolhidos na origem (CST 02).';

    return Ok({
      operacaoId,
      segmento,
      categoriaProduto,
      produtoDescricao,
      cstPisCofinsUtilizado: '02',
      aliquotaPisPercent: aliqPis,
      aliquotaCofinsPercent: aliqCofins,
      pisMonofasicoDevidoBrl: pis,
      cofinsMonofasicoDevidoBrl: cofins,
      tributacaoVarejoZero: false,
      diagnosticoFiscal: diag
    });
  } else {
    // Perfumarias, Lojas de Cosméticos, Drogarias e Salões de Beleza: Alíquota ZERO (CST 04)
    const diag = 'Revenda / Perfumaria / Salão de Beleza / Varejo: Produto ' + produtoDescricao + '. CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero de PIS e COFINS nos termos da Lei nº 10.147/2000).';

    return Ok({
      operacaoId,
      segmento,
      categoriaProduto,
      produtoDescricao,
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
