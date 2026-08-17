import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type CarbonCreditIntent = 'COMPENSACAO_EMISSOES_PROPRIAS' | 'NEGOCIACAO_TRADING_MERCADO';

export interface CarbonCreditInput {
  operacaoId: string;
  empresaNome: string;
  padraoCredito: string; // Ex: 'VCS Verra / CBIO RenovaBio / GS Gold Standard'
  finalidade: CarbonCreditIntent;
  quantidadeCreditosTco2e: number;
  custoAquisicaoUnitarioBrl: number;
  valorJustoUnitarioFechamentoBrl?: number; // Para Trading (CPC 48)
}

export interface CarbonCreditResult {
  operacaoId: string;
  empresaNome: string;
  finalidade: CarbonCreditIntent;
  classificacaoContabil: string; // CPC 04 Intangível vs CPC 48 Instrumento Financeiro FVTPL
  valorTotalAquisicaoBrl: number;
  valorJustoAtualizadoBrl: number;
  variacaoValorJustoDrebBrl: number; // Marcação a Mercado
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc: string;
}

export function evaluateCarbonCreditsAccountingCpc48(input: CarbonCreditInput): Result<CarbonCreditResult, Error> {
  const {
    operacaoId,
    empresaNome,
    padraoCredito,
    finalidade,
    quantidadeCreditosTco2e,
    custoAquisicaoUnitarioBrl,
    valorJustoUnitarioFechamentoBrl
  } = input;

  if (quantidadeCreditosTco2e <= 0 || custoAquisicaoUnitarioBrl <= 0) {
    return Err(new Error('Quantidade e custo dos créditos de carbono devem ser superiores a zero.'));
  }

  const valorTotalAquisicao = Number((quantidadeCreditosTco2e * custoAquisicaoUnitarioBrl).toFixed(2));
  const partidas: JournalEntryLine[] = [];

  if (finalidade === 'COMPENSACAO_EMISSOES_PROPRIAS') {
    // CPC 04 - Ativo Intangível (Mantido para compensação/aposentadoria - custo histórico sem reavaliação)
    partidas.push({
      accountId: '1.2.4.15',
      accountCode: '1.2.4.15',
      accountName: 'Créditos de Carbono para Compensação Ambiental (Ativo Intangível - CPC 04)',
      type: 'DEBIT',
      amount: valorTotalAquisicao
    });

    partidas.push({
      accountId: '1.1.1.01',
      accountCode: '1.1.1.01',
      accountName: 'Bancos Conta Movimento - Pagamento Aquisição Carbono (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorTotalAquisicao
    });

    const diag = 'Créditos de Carbono (CPC 04 - Intangível): ' + empresaNome + ' (' + padraoCredito + '). ' + quantidadeCreditosTco2e.toLocaleString('pt-BR') + ' tCO2e adquiridos por R$ ' + valorTotalAquisicao.toFixed(2) + '. Finalidade: Neutralização/Aposentadoria de emissões de GEE. Mensurado pelo Custo Histórico.';

    return Ok({
      operacaoId,
      empresaNome,
      finalidade,
      classificacaoContabil: 'Ativo Intangível (CPC 04) - Custo Histórico',
      valorTotalAquisicaoBrl: valorTotalAquisicao,
      valorJustoAtualizadoBrl: valorTotalAquisicao,
      variacaoValorJustoDrebBrl: 0,
      partidasDobrada: partidas,
      diagnosticoCpc: diag
    });
  }

  // Finalidade: NEGOCIACAO_TRADING_MERCADO (CPC 48 - Instrumento Financeiro a Valor Justo via Resultado / FVTPL)
  const precoFechamento = valorJustoUnitarioFechamentoBrl || custoAquisicaoUnitarioBrl;
  const valorJustoAtual = Number((quantidadeCreditosTco2e * precoFechamento).toFixed(2));
  const variacaoValorJusto = Number((valorJustoAtual - valorTotalAquisicao).toFixed(2));

  // 1. Compra
  partidas.push({
    accountId: '1.1.3.10',
    accountCode: '1.1.3.10',
    accountName: 'Créditos de Carbono Mantidos para Negociação (Ativo Financeiro FVTPL - CPC 48)',
    type: 'DEBIT',
    amount: valorTotalAquisicao
  });

  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento - Liquidação Trading Carbono (Ativo Circulante)',
    type: 'CREDIT',
    amount: valorTotalAquisicao
  });

  // 2. Marcação a Mercado (MTM)
  if (variacaoValorJusto > 0) {
    partidas.push({
      accountId: '1.1.3.10',
      accountCode: '1.1.3.10',
      accountName: 'Créditos de Carbono Mantidos para Negociação - Ajuste a Valor Justo (CPC 48)',
      type: 'DEBIT',
      amount: variacaoValorJusto
    });
    partidas.push({
      accountId: '3.1.2.10',
      accountCode: '3.1.2.10',
      accountName: 'Ganho com Marcação a Mercado de Ativos Ambientais (Resultado - CPC 48)',
      type: 'CREDIT',
      amount: variacaoValorJusto
    });
  }

  const diag = 'Créditos de Carbono (CPC 48 - Trading / FVTPL): ' + empresaNome + ' (' + padraoCredito + '). ' + quantidadeCreditosTco2e.toLocaleString('pt-BR') + ' tCO2e. Custo: R$ ' + valorTotalAquisicao.toFixed(2) + ' -> Valor Justo: R$ ' + valorJustoAtual.toFixed(2) + ' (Variação DRE: R$ ' + variacaoValorJusto.toFixed(2) + ').';

  return Ok({
    operacaoId,
    empresaNome,
    finalidade,
    classificacaoContabil: 'Ativo Financeiro a Valor Justo no Resultado (CPC 48 FVTPL)',
    valorTotalAquisicaoBrl: valorTotalAquisicao,
    valorJustoAtualizadoBrl: valorJustoAtual,
    variacaoValorJustoDrebBrl: variacaoValorJusto,
    partidasDobrada: partidas,
    diagnosticoCpc: diag
  });
}
