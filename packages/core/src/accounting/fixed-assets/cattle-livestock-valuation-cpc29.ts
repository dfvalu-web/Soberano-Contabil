import { Result, Ok, Err } from '../../types/result.js';

export interface CattleLivestockInput {
  fazendaId: string;
  fazendaNome: string; // Ex: 'Fazenda Soberana Agropecuária & Confinamento'
  quantidadeCabecas: number;
  faseRebanho: 'CRIA_BEZERROS' | 'RECRIA' | 'ENGORDA_CONFINAMENTO';
  pesoMedioArrobasPorCabeca: number; // Ex: 18@ por cabeça
  cotacaoArrobaMercadoBrl: number; // Ex: R$ 240,00/@
  despesasEstimadasVendaFretePercent?: number; // Padrão 3%
  custoCriacaoAcumuladoHistoricoBrl: number; // Custo histórico de alimentação e pasto
}

export interface CattleLivestockResult {
  fazendaId: string;
  fazendaNome: string;
  pesoTotalRebanhoArrobas: number;
  valorJustoBrutoRebanhoBrl: number;
  despesasEstimadasVendaBrl: number;
  valorJustoLiquidoRebanhoBrl: number; // Valor no Balanço
  custoHistoricoAcumuladoBrl: number;
  ganhoTransformacaoBiologicaDreBrl: number; // Ajuste Valor Justo na DRE
  lancamentosContabeis: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  }[];
  diagnosticoCpc29: string;
}

export function processCattleLivestockValuationCpc29(input: CattleLivestockInput): Result<CattleLivestockResult, Error> {
  const {
    fazendaId,
    fazendaNome,
    quantidadeCabecas,
    faseRebanho,
    pesoMedioArrobasPorCabeca,
    cotacaoArrobaMercadoBrl,
    despesasEstimadasVendaFretePercent = 3.0,
    custoCriacaoAcumuladoHistoricoBrl
  } = input;

  if (quantidadeCabecas <= 0 || pesoMedioArrobasPorCabeca <= 0 || cotacaoArrobaMercadoBrl <= 0) {
    return Err(new Error('Quantidade, peso em arrobas e cotação de mercado devem ser maiores que zero.'));
  }

  // CPC 29 (IAS 41) Item 12:
  // O ativo biológico deve ser mensurado ao Valor Justo menos as despesas estimadas de venda.
  const pesoTotalArrobas = Number((quantidadeCabecas * pesoMedioArrobasPorCabeca).toFixed(2));
  const valorJustoBruto = Number((pesoTotalArrobas * cotacaoArrobaMercadoBrl).toFixed(2));
  const despesasVenda = Number((valorJustoBruto * (despesasEstimadasVendaFretePercent / 100)).toFixed(2));
  const valorJustoLiquido = Number((valorJustoBruto - despesasVenda).toFixed(2));

  // Ganho ou Perda por Variação do Valor Justo (Transformação Biológica) na DRE
  const ganhoTransformacao = Number((valorJustoLiquido - custoCriacaoAcumuladoHistoricoBrl).toFixed(2));

  const lancamentos = [
    {
      debito: '1.1.4.01 - Ativos Biológicos em Formação / Engorda (Gado de Corte)',
      credito: '1.1.5.01 - Custos Acumulados de Manejo, Pastagem e Nutrição Animal',
      valor: custoCriacaoAcumuladoHistoricoBrl,
      historico: 'Encerramento de custos de criação de ' + quantidadeCabecas + ' cabeças (' + faseRebanho + ')'
    }
  ];

  if (ganhoTransformacao !== 0) {
    lancamentos.push({
      debito: ganhoTransformacao > 0 ? '1.1.4.01 - Ativos Biológicos em Formação / Engorda (Gado de Corte)' : '3.2.2.10 - Perda por Ajuste a Valor Justo de Ativos Biológicos',
      credito: ganhoTransformacao > 0 ? '3.1.1.20 - Receita com Variação do Valor Justo de Ativos Biológicos (DRE)' : '1.1.4.01 - Ativos Biológicos em Formação / Engorda (Gado de Corte)',
      valor: Math.abs(ganhoTransformacao),
      historico: 'Ajuste a Valor Justo (CPC 29) por ganho de peso e preço de mercado do rebanho bovino'
    });
  }

  const diag = "Ativos Biologicos da Pecuaria (CPC 29 / IAS 41): " + fazendaNome + " (" + faseRebanho + "). " + quantidadeCabecas.toLocaleString('pt-BR') + " cabecas | " + pesoTotalArrobas.toFixed(2) + " @ | Cotacao: R$ " + cotacaoArrobaMercadoBrl.toFixed(2) + "/@ -> Valor Justo Bruto: R$ " + valorJustoBruto.toFixed(2) + " - Despesas Venda: R$ " + despesasVenda.toFixed(2) + " = Valor Justo Liquido Balanco: R$ " + valorJustoLiquido.toFixed(2) + " (Ganho Transformacao Biologica na DRE: R$ " + ganhoTransformacao.toFixed(2) + ").";

  return Ok({
    fazendaId,
    fazendaNome,
    pesoTotalRebanhoArrobas: pesoTotalArrobas,
    valorJustoBrutoRebanhoBrl: valorJustoBruto,
    despesasEstimadasVendaBrl: despesasVenda,
    valorJustoLiquidoRebanhoBrl: valorJustoLiquido,
    custoHistoricoAcumuladoBrl: custoCriacaoAcumuladoHistoricoBrl,
    ganhoTransformacaoBiologicaDreBrl: ganhoTransformacao,
    lancamentosContabeis: lancamentos,
    diagnosticoCpc29: diag
  });
}
