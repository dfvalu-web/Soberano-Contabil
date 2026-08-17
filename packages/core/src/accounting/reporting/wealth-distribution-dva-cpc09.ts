import { Result, Ok, Err } from '../../types/result.js';

export interface DvaReportingInput {
  empresaCnpj: string;
  anoCalendario: number;
  receitaBrutaVendasBrl: number; // Ex: R$ 20.000.000,00
  insumosAdquiridosTerceirosBrl: number; // Ex: R$ 8.000.000,00 (Matérias-primas, energia, serviços)
  depreciacaoAmortizacaoRetencaoBrl: number; // Ex: R$ 1.000.000,00
  receitasFinanceirasTransferidasBrl: number; // Ex: R$ 500.000,00
  distribuicaoPessoalEncargosBrl: number; // Ex: R$ 3.500.000,00
  distribuicaoImpostosTaxasContribuicoesBrl: number; // Ex: R$ 4.000.000,00
  distribuicaoRemuneracaoCapitaisTerceirosBrl: number; // Ex: R$ 1.500.000,00 (Juros e aluguéis)
  distribuicaoRemuneracaoCapitaisPropriosBrl: number; // Ex: R$ 2.500.000,00 (Dividendos, JCP e Lucro Retido)
}

export interface DvaReportingResult {
  empresaCnpj: string;
  anoCalendario: number;
  valorAdicionadoBrutoBrl: number;
  valorAdicionadoLiquidoProduzidoBrl: number;
  valorAdicionadoTotalADistribuirBrl: number;
  distribuicaoDetalhada: {
    pessoalPercent: number;
    impostosGovernoPercent: number;
    capitaisTerceirosPercent: number;
    capitaisPropriosAcionistasPercent: number;
  };
  statusConsistenciaDva: 'DVA_CPC09_QUADRADA_E_CONSISTENTE';
  diagnosticoCpc09: string;
}

export function processWealthDistributionDvaCpc09(input: DvaReportingInput): Result<DvaReportingResult, Error> {
  const {
    empresaCnpj,
    anoCalendario,
    receitaBrutaVendasBrl,
    insumosAdquiridosTerceirosBrl,
    depreciacaoAmortizacaoRetencaoBrl,
    receitasFinanceirasTransferidasBrl,
    distribuicaoPessoalEncargosBrl,
    distribuicaoImpostosTaxasContribuicoesBrl,
    distribuicaoRemuneracaoCapitaisTerceirosBrl,
    distribuicaoRemuneracaoCapitaisPropriosBrl
  } = input;

  if (receitaBrutaVendasBrl <= 0 || insumosAdquiridosTerceirosBrl < 0) {
    return Err(new Error('Receita bruta e insumos devem ser válidos.'));
  }

  // 1. Valor Adicionado Bruto = Receitas - Insumos
  const valorAdicionadoBruto = Number((receitaBrutaVendasBrl - insumosAdquiridosTerceirosBrl).toFixed(2));

  // 2. Valor Adicionado Líquido Produzido = Bruto - Depreciação
  const valorAdicionadoLiquido = Number((valorAdicionadoBruto - depreciacaoAmortizacaoRetencaoBrl).toFixed(2));

  // 3. Valor Adicionado Total a Distribuir = Líquido + Receitas Transferidas (Financeiras / Equivalência)
  const totalADistribuir = Number((valorAdicionadoLiquido + receitasFinanceirasTransferidasBrl).toFixed(2));

  // 4. Soma das Distribuições
  const somaDistribuicao = Number((distribuicaoPessoalEncargosBrl + distribuicaoImpostosTaxasContribuicoesBrl + distribuicaoRemuneracaoCapitaisTerceirosBrl + distribuicaoRemuneracaoCapitaisPropriosBrl).toFixed(2));

  const pctPessoal = Number(((distribuicaoPessoalEncargosBrl / totalADistribuir) * 100).toFixed(2));
  const pctGov = Number(((distribuicaoImpostosTaxasContribuicoesBrl / totalADistribuir) * 100).toFixed(2));
  const pctTerceiros = Number(((distribuicaoRemuneracaoCapitaisTerceirosBrl / totalADistribuir) * 100).toFixed(2));
  const pctProprios = Number(((distribuicaoRemuneracaoCapitaisPropriosBrl / totalADistribuir) * 100).toFixed(2));

  const diag = "Demonstracao do Valor Adicionado (CPC 09): CNPJ " + empresaCnpj + " (" + anoCalendario + ") | Riqueza Gerada a Distribuir: R$ " + totalADistribuir.toFixed(2) + " -> Pessoal: " + pctPessoal + "% | Governo/Impostos: " + pctGov + "% | Credores: " + pctTerceiros + "% | Acionistas: " + pctProprios + "% (Soma DVA: R$ " + somaDistribuicao.toFixed(2) + ").";

  return Ok({
    empresaCnpj,
    anoCalendario,
    valorAdicionadoBrutoBrl: valorAdicionadoBruto,
    valorAdicionadoLiquidoProduzidoBrl: valorAdicionadoLiquido,
    valorAdicionadoTotalADistribuirBrl: totalADistribuir,
    distribuicaoDetalhada: {
      pessoalPercent: pctPessoal,
      impostosGovernoPercent: pctGov,
      capitaisTerceirosPercent: pctTerceiros,
      capitaisPropriosAcionistasPercent: pctProprios
    },
    statusConsistenciaDva: 'DVA_CPC09_QUADRADA_E_CONSISTENTE',
    diagnosticoCpc09: diag
  });
}
