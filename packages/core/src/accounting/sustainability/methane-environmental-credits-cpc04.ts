import { Result, Ok, Err } from '../../types/result.js';

export type EnvironmentalCreditIntent = 'NEGOCIACAO_TRADING_MERCADO' | 'CONFORMIDADE_METAS_PROPRIAS';

export interface MethaneCreditInput {
  projetoId: string;
  projetoNome: string; // Ex: 'Projeto Biometano & Captura de Metano Aterro Soberano'
  finalidadeContabil: EnvironmentalCreditIntent;
  quantidadeCreditosMetanoTco2e: number;
  custoUnitarioGeracaoCapturaBrl: number;
  cotacaoMercadoUnitarioBrl: number; // Preço por tCO2e / crédito
}

export interface MethaneCreditResult {
  projetoId: string;
  projetoNome: string;
  classificacaoContabil: 'CPC16_ESTOQUE_VALOR_JUSTO' | 'CPC04_INTANGIVEL_AO_CUSTO';
  quantidadeCreditos: number;
  custoTotalGeracaoBrl: number;
  valorTotalBalançoBrl: number;
  ganhoAjusteValorJustoBrl: number; // Apenas se Estoque Trading
  lancamentosContabeis: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  }[];
  diagnosticoMetano: string;
}

export function processMethaneEnvironmentalCreditsCpc04(input: MethaneCreditInput): Result<MethaneCreditResult, Error> {
  const {
    projetoId,
    projetoNome,
    finalidadeContabil,
    quantidadeCreditosMetanoTco2e,
    custoUnitarioGeracaoCapturaBrl,
    cotacaoMercadoUnitarioBrl
  } = input;

  if (quantidadeCreditosMetanoTco2e <= 0 || custoUnitarioGeracaoCapturaBrl <= 0) {
    return Err(new Error('Quantidade de créditos e custo de geração devem ser maiores que zero.'));
  }

  // CPC 04 & CPC 16:
  // 1. Se mantidos para negociação (Trading): CPC 16 ao Valor Justo menos custos de venda.
  // 2. Se mantidos para conformidade interna: CPC 04 Intangível ao Custo Histórico.
  const custoTotal = Number((quantidadeCreditosMetanoTco2e * custoUnitarioGeracaoCapturaBrl).toFixed(2));
  const valorMercadoTotal = Number((quantidadeCreditosMetanoTco2e * cotacaoMercadoUnitarioBrl).toFixed(2));

  let classificacao: 'CPC16_ESTOQUE_VALOR_JUSTO' | 'CPC04_INTANGIVEL_AO_CUSTO' = 'CPC16_ESTOQUE_VALOR_JUSTO';
  let valorBalanco = valorMercadoTotal;
  let ganhoFv = Number((valorMercadoTotal - custoTotal).toFixed(2));

  const lancamentos = [];

  if (finalidadeContabil === 'NEGOCIACAO_TRADING_MERCADO') {
    classificacao = 'CPC16_ESTOQUE_VALOR_JUSTO';
    valorBalanco = valorMercadoTotal;

    lancamentos.push({
      debito: '1.1.5.08 - Estoque de Ativos Ambientais e Créditos de Metano (Trading)',
      credito: '1.1.1.02 - Bancos / Custos de Operação do Biodigestor',
      valor: custoTotal,
      historico: 'Geração e certificação de ' + quantidadeCreditosMetanoTco2e + ' créditos de metano para venda'
    });

    if (ganhoFv > 0) {
      lancamentos.push({
        debito: '1.1.5.08 - Estoque de Ativos Ambientais e Créditos de Metano (Trading)',
        credito: '3.1.1.30 - Ganho por Ajuste a Valor Justo de Créditos Ambientais (DRE)',
        valor: ganhoFv,
        historico: 'Ajuste a valor justo de mercado de créditos de metano'
      });
    }
  } else {
    classificacao = 'CPC04_INTANGIVEL_AO_CUSTO';
    valorBalanco = custoTotal;
    ganhoFv = 0;

    lancamentos.push({
      debito: '1.2.4.05 - Ativos Intangíveis Ambientais (Conformidade de Descarbonização)',
      credito: '1.1.1.02 - Bancos / Custos de Operação do Biodigestor',
      valor: custoTotal,
      historico: 'Ativação de créditos de metano mantidos para neutralização de pegada de carbono própria'
    });
  }

  const diag = "Creditos Ambientais de Metano (CPC 04/16): " + projetoNome + " (" + finalidadeContabil + "). Qtd: " + quantidadeCreditosMetanoTco2e.toLocaleString('pt-BR') + " tCO2e | Custo Total: R$ " + custoTotal.toFixed(2) + " -> Balanco (" + classificacao + "): R$ " + valorBalanco.toFixed(2) + " (Ganho FVTPL na DRE: R$ " + ganhoFv.toFixed(2) + ").";

  return Ok({
    projetoId,
    projetoNome,
    classificacaoContabil: classificacao,
    quantidadeCreditos: quantidadeCreditosMetanoTco2e,
    custoTotalGeracaoBrl: custoTotal,
    valorTotalBalançoBrl: valorBalanco,
    ganhoAjusteValorJustoBrl: ganhoFv,
    lancamentosContabeis: lancamentos,
    diagnosticoMetano: diag
  });
}
