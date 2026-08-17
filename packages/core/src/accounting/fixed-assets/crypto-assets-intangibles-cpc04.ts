import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type CryptoHoldingPurposeType = 'INVESTIMENTO_LONGO_PRAZO_INTANGIVEL' | 'TRADING_BROKER_DEALER_ESTOQUE';

export interface CryptoAssetAccountingInput {
  carteiraId: string;
  criptoativoNome: string; // Ex: 'Bitcoin (BTC)' ou 'Ethereum (ETH)'
  propositoNegocio: CryptoHoldingPurposeType;
  quantidadeTokens: number;
  custoAquisicaoUnitarioBrl: number;
  cotacaoFechamentoUnitarioBrl: number;
  recompensasStakingRecebidasTokens?: number; // Recompensas de Proof-of-Stake
}

export interface CryptoAssetAccountingResult {
  carteiraId: string;
  criptoativoNome: string;
  propositoNegocio: CryptoHoldingPurposeType;
  custoTotalAquisicaoBrl: number;
  valorJustoAtualTotalBrl: number;
  ajusteValorJustoResultadoBrl: number;
  receitaStakingRewardsBrl: number;
  partidasDobradaAquisicaoEStaking: JournalEntryLine[];
  diagnosticoCpc04: string;
}

export function evaluateCryptoAssetAccountingCpc04(input: CryptoAssetAccountingInput): Result<CryptoAssetAccountingResult, Error> {
  const {
    carteiraId,
    criptoativoNome,
    propositoNegocio,
    quantidadeTokens,
    custoAquisicaoUnitarioBrl,
    cotacaoFechamentoUnitarioBrl,
    recompensasStakingRecebidasTokens = 0
  } = input;

  if (quantidadeTokens <= 0 || custoAquisicaoUnitarioBrl <= 0 || cotacaoFechamentoUnitarioBrl <= 0) {
    return Err(new Error('Quantidade de tokens e cotações devem ser superiores a zero.'));
  }

  const custoTotal = Number((quantidadeTokens * custoAquisicaoUnitarioBrl).toFixed(2));
  const valorJustoTotal = Number((quantidadeTokens * cotacaoFechamentoUnitarioBrl).toFixed(2));

  // IFRIC 2019 & CPC 04 / CPC 16:
  // Se for Estoque (Broker/Dealer): mensurado a valor justo deduzido de despesas de venda na DRE
  // Se for Intangível (Longo Prazo): mensurado ao custo sujeito a teste de recuperabilidade (impairment)
  let ajusteResultado = 0;
  if (propositoNegocio === 'TRADING_BROKER_DEALER_ESTOQUE') {
    ajusteResultado = Number((valorJustoTotal - custoTotal).toFixed(2));
  }

  // Receita de Staking Rewards a valor justo na data do recebimento
  const receitaStaking = Number((recompensasStakingRecebidasTokens * cotacaoFechamentoUnitarioBrl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (propositoNegocio === 'TRADING_BROKER_DEALER_ESTOQUE') {
    // D: Estoques de Criptoativos a Valor Justo (Ativo Circulante - CPC 16 / IFRIC 2019)
    partidas.push({
      accountId: '1.1.4.20',
      accountCode: '1.1.4.20',
      accountName: 'Estoques de Criptoativos para Trading (Ativo Circulante - CPC 16)',
      type: 'DEBIT',
      amount: custoTotal
    });
    // C: Caixa / Bancos
    partidas.push({
      accountId: '1.1.1.01',
      accountCode: '1.1.1.01',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoTotal
    });
  } else {
    // D: Ativos Intangíveis - Criptoativos (Ativo Não Circulante - CPC 04 / IFRIC 2019)
    partidas.push({
      accountId: '1.2.4.10',
      accountCode: '1.2.4.10',
      accountName: 'Criptoativos e Ativos Digitais (Ativo Intangível - CPC 04)',
      type: 'DEBIT',
      amount: custoTotal
    });
    // C: Caixa / Bancos
    partidas.push({
      accountId: '1.1.1.01',
      accountCode: '1.1.1.01',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoTotal
    });
  }

  if (receitaStaking > 0) {
    // D: Criptoativos em Custódia (Ativo)
    partidas.push({
      accountId: '1.1.4.20',
      accountCode: '1.1.4.20',
      accountName: 'Criptoativos Recebidos por Staking (Ativo)',
      type: 'DEBIT',
      amount: receitaStaking
    });
    // C: Receitas Operacionais de Staking / Validação de Rede (Resultado - DRE)
    partidas.push({
      accountId: '3.1.1.30',
      accountCode: '3.1.1.30',
      accountName: 'Receitas com Staking Rewards e Mineração (Resultado)',
      type: 'CREDIT',
      amount: receitaStaking
    });
  }

  const diag = 'CPC 04 / CPC 16 & Decisão IFRIC 2019 (Criptoativos): ' + criptoativoNome + ' (' + propositoNegocio + '). Custo de aquisição R$ ' + custoTotal.toFixed(2) + ' (Valor Justo R$ ' + valorJustoTotal.toFixed(2) + '). ' + (propositoNegocio === 'TRADING_BROKER_DEALER_ESTOQUE' ? 'Ajuste de Valor Justo na DRE: R$ ' + ajusteResultado.toFixed(2) + '.' : 'Mantido ao custo no Ativo Intangível.') + (receitaStaking > 0 ? ' Receita de Staking Rewards apurada: R$ ' + receitaStaking.toFixed(2) + '.' : '');

  return Ok({
    carteiraId,
    criptoativoNome,
    propositoNegocio,
    custoTotalAquisicaoBrl: custoTotal,
    valorJustoAtualTotalBrl: valorJustoTotal,
    ajusteValorJustoResultadoBrl: ajusteResultado,
    receitaStakingRewardsBrl: receitaStaking,
    partidasDobradaAquisicaoEStaking: partidas,
    diagnosticoCpc04: diag
  });
}
