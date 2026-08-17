import { Result, Ok, Err } from '../../types/result.js';

export interface BiologicalFairValueDecompositionInput {
  loteRebanhoId: string;
  categoriaAnimal: string; // Ex: 'Bovinos de Corte - Nelore Confinamento'
  quantidadeCabecasInicio: number; // Ex: 1.000 cabeças
  pesoMedioInicioKg: number; // Ex: 360 kg (24 @)
  precoArrobaInicioBrl: number; // Ex: R$ 220,00/@
  quantidadeCabecasFim: number; // Ex: 1.000 cabeças
  pesoMedioFimKg: number; // Ex: 510 kg (34 @) -> Ganho de 10 @/cabeça
  precoArrobaFimBrl: number; // Ex: R$ 240,00/@ (Alta de R$ 20/@)
  custosEstimadosPontoVendaPercent: number; // Ex: 5% (Frete, FUNRURAL, Comissão)
}

export interface BiologicalFairValueDecompositionResult {
  loteRebanhoId: string;
  categoriaAnimal: string;
  valorJustoInicialLiquidoBrl: number;
  valorJustoFinalLiquidoBrl: number;
  variacaoTotalValorJustoBrl: number;
  variacaoFisicaBiologicaCrescimentoBrl: number; // Crescimento biológico em @ avaliado ao preço inicial
  variacaoPrecoMercadoBrl: number; // Efeito da mudança de preço sobre o rebanho
  statusConformidadeCpc29Item50: 'DECOMPOSICAO_VALOR_JUSTO_CONFORME';
  lancamentoContabilDreOperacional: {
    debitoAtivoBiologicoCirculanteBrl: number;
    creditoAjusteValorJustoBiologicoDreBrl: number;
  };
  diagnosticoCpc29: string;
}

export function processBiologicalAssetsFairValueDecompositionCpc29(input: BiologicalFairValueDecompositionInput): Result<BiologicalFairValueDecompositionResult, Error> {
  const {
    loteRebanhoId,
    categoriaAnimal,
    quantidadeCabecasInicio,
    pesoMedioInicioKg,
    precoArrobaInicioBrl,
    quantidadeCabecasFim,
    pesoMedioFimKg,
    precoArrobaFimBrl,
    custosEstimadosPontoVendaPercent
  } = input;

  if (quantidadeCabecasInicio <= 0 || pesoMedioInicioKg <= 0 || precoArrobaInicioBrl <= 0 || precoArrobaFimBrl <= 0) {
    return Err(new Error('Parâmetros zootécnicos e preços de mercado devem ser positivos.'));
  }

  const fatorLiquido = (100 - custosEstimadosPontoVendaPercent) / 100;

  // 1. Conversão em Arrobas (@ = 15 kg de carcaça / peso vivo ajustado)
  const arrobasPorCabecaInicio = pesoMedioInicioKg / 15;
  const totalArrobasInicio = quantidadeCabecasInicio * arrobasPorCabecaInicio;
  const precoLiquidoInicio = precoArrobaInicioBrl * fatorLiquido;
  const valorJustoInicial = Number((totalArrobasInicio * precoLiquidoInicio).toFixed(2));

  const arrobasPorCabecaFim = pesoMedioFimKg / 15;
  const totalArrobasFim = quantidadeCabecasFim * arrobasPorCabecaFim;
  const precoLiquidoFim = precoArrobaFimBrl * fatorLiquido;
  const valorJustoFinal = Number((totalArrobasFim * precoLiquidoFim).toFixed(2));

  const variacaoTotal = Number((valorJustoFinal - valorJustoInicial).toFixed(2));

  // 2. Decomposição CPC 29 item 50:
  // Mudança Física: (Arrobas Fim - Arrobas Início) * Preço Líquido Início
  const varFisica = Number(((totalArrobasFim - totalArrobasInicio) * precoLiquidoInicio).toFixed(2));
  
  // Mudança de Preço: Total Arrobas Fim * (Preço Líquido Fim - Preço Líquido Início)
  const varPreco = Number((totalArrobasFim * (precoLiquidoFim - precoLiquidoInicio)).toFixed(2));

  const diag = "Ativos Biologicos (CPC 29 / IAS 41): Lote " + loteRebanhoId + " (" + categoriaAnimal + ") | Valor Justo: R$ " + valorJustoInicial.toFixed(2) + " -> R$ " + valorJustoFinal.toFixed(2) + " (Variacao: R$ " + variacaoTotal.toFixed(2) + ") | Mudanca Fisica/Crescimento: R$ " + varFisica.toFixed(2) + " | Mudanca de Preco Mercado: R$ " + varPreco.toFixed(2) + " na DRE Operacional.";

  return Ok({
    loteRebanhoId,
    categoriaAnimal,
    valorJustoInicialLiquidoBrl: valorJustoInicial,
    valorJustoFinalLiquidoBrl: valorJustoFinal,
    variacaoTotalValorJustoBrl: variacaoTotal,
    variacaoFisicaBiologicaCrescimentoBrl: varFisica,
    variacaoPrecoMercadoBrl: varPreco,
    statusConformidadeCpc29Item50: 'DECOMPOSICAO_VALOR_JUSTO_CONFORME',
    lancamentoContabilDreOperacional: {
      debitoAtivoBiologicoCirculanteBrl: variacaoTotal,
      creditoAjusteValorJustoBiologicoDreBrl: variacaoTotal
    },
    diagnosticoCpc29: diag
  });
}
