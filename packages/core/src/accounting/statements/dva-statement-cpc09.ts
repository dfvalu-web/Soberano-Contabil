import { Result, Ok, Err } from '../../types/result.js';

export interface DvaInput {
  anoExercicio: number;
  // 1 - Receitas
  vendasMercadoriasServicos: number;
  outrasReceitasOperacionais: number;
  provisaoCreditosLiquidacaoDuvidosa: number;
  // 2 - Insumos Adquiridos de Terceiros
  custosProdutosMercadoriasVendidos: number;
  materiaisEnergiaServicosTerceiros: number;
  // 4 - Retenções
  depreciacaoAmortizacaoExaustao: number;
  // 6 - Valor Adicionado Recebido em Transferência
  resultadoEquivalenciaPatrimonialMep: number;
  receitasFinanceiras: number;
  // 8 - Distribuição
  distribuicaoPessoalRemuneracaoBeneficiosFgts: number;
  distribuicaoImpostosTaxasContribuicoesGoverno: number;
  distribuicaoJurosAlugueisCapitaisTerceiros: number;
  distribuicaoDividendosJcpLucrosRetidosAcionistas: number;
}

export interface DvaStatementReport {
  anoExercicio: number;
  receitasTotaisItem1: number;
  insumosAdquiridosItem2: number;
  valorAdicionadoBrutoItem3: number;
  retencoesItem4: number;
  valorAdicionadoLiquidoItem5: number;
  transferenciasRecebidasItem6: number;
  valorAdicionadoTotalADistribuirItem7: number;
  distribuicaoValorAdicionadoItem8: {
    pessoal: number;
    governoTributos: number;
    remuneracaoCapitaisTerceiros: number;
    remuneracaoCapitaisProprios: number;
    totalDistribuido: number;
  };
  equilibradaDva: boolean;
  diferencaEquilibrio: number;
}

export function generateDvaStatement(input: DvaInput): Result<DvaStatementReport, Error> {
  const {
    anoExercicio,
    vendasMercadoriasServicos,
    outrasReceitasOperacionais,
    provisaoCreditosLiquidacaoDuvidosa,
    custosProdutosMercadoriasVendidos,
    materiaisEnergiaServicosTerceiros,
    depreciacaoAmortizacaoExaustao,
    resultadoEquivalenciaPatrimonialMep,
    receitasFinanceiras,
    distribuicaoPessoalRemuneracaoBeneficiosFgts,
    distribuicaoImpostosTaxasContribuicoesGoverno,
    distribuicaoJurosAlugueisCapitaisTerceiros,
    distribuicaoDividendosJcpLucrosRetidosAcionistas
  } = input;

  // 1. Receitas
  const recTot = Number((vendasMercadoriasServicos + outrasReceitasOperacionais - provisaoCreditosLiquidacaoDuvidosa).toFixed(2));
  // 2. Insumos
  const insTot = Number((custosProdutosMercadoriasVendidos + materiaisEnergiaServicosTerceiros).toFixed(2));
  // 3. VA Bruto
  const vaBruto = Number((recTot - insTot).toFixed(2));
  // 4. Retenções
  const retTot = Number(depreciacaoAmortizacaoExaustao.toFixed(2));
  // 5. VA Líquido
  const vaLiquido = Number((vaBruto - retTot).toFixed(2));
  // 6. Transferências
  const transTot = Number((resultadoEquivalenciaPatrimonialMep + receitasFinanceiras).toFixed(2));
  // 7. Total a Distribuir
  const vaTotalADistribuir = Number((vaLiquido + transTot).toFixed(2));

  // 8. Distribuição
  const totalDist = Number((
    distribuicaoPessoalRemuneracaoBeneficiosFgts +
    distribuicaoImpostosTaxasContribuicoesGoverno +
    distribuicaoJurosAlugueisCapitaisTerceiros +
    distribuicaoDividendosJcpLucrosRetidosAcionistas
  ).toFixed(2));

  const diff = Number(Math.abs(vaTotalADistribuir - totalDist).toFixed(2));
  const equilibrada = diff <= 0.05;

  if (!equilibrada) {
    return Err(new Error('DVA desbalanceada: Total a Distribuir (R$ ' + vaTotalADistribuir.toFixed(2) + ') difere do Total Distribuído (R$ ' + totalDist.toFixed(2) + ').'));
  }

  return Ok({
    anoExercicio,
    receitasTotaisItem1: recTot,
    insumosAdquiridosItem2: insTot,
    valorAdicionadoBrutoItem3: vaBruto,
    retencoesItem4: retTot,
    valorAdicionadoLiquidoItem5: vaLiquido,
    transferenciasRecebidasItem6: transTot,
    valorAdicionadoTotalADistribuirItem7: vaTotalADistribuir,
    distribuicaoValorAdicionadoItem8: {
      pessoal: distribuicaoPessoalRemuneracaoBeneficiosFgts,
      governoTributos: distribuicaoImpostosTaxasContribuicoesGoverno,
      remuneracaoCapitaisTerceiros: distribuicaoJurosAlugueisCapitaisTerceiros,
      remuneracaoCapitaisProprios: distribuicaoDividendosJcpLucrosRetidosAcionistas,
      totalDistribuido: totalDist
    },
    equilibradaDva: true,
    diferencaEquilibrio: diff
  });
}
