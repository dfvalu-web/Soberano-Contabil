import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ContingentEarnoutInput {
  aquisicaoId: string;
  adquirenteNome: string;
  adquiridaNome: string;
  valorEarnoutEstimadoInicialBrl: number; // Valor Justo na Data da Aquisição
  metaEbitdaContratadaBrl: number;
  ebitdaEfetivoAlcancadoBrl: number;
  valorEarnoutRemensuradoFechamentoBrl: number; // Novo Valor Justo
}

export interface ContingentEarnoutResult {
  aquisicaoId: string;
  adquirenteNome: string;
  adquiridaNome: string;
  valorInicialPassivoEarnoutBrl: number;
  novoValorJustoPassivoEarnoutBrl: number;
  variacaoValorJustoResultadoDrebBrl: number; // Ganho/Perda na DRE
  isGoodwillInalterado: boolean; // Goodwill NÃO é alterado após período de mensuração
  partidasDobradaRemensuracao: JournalEntryLine[];
  diagnosticoCpc15e48: string;
}

export function evaluateContingentEarnoutAccountingCpc15(input: ContingentEarnoutInput): Result<ContingentEarnoutResult, Error> {
  const {
    aquisicaoId,
    adquirenteNome,
    adquiridaNome,
    valorEarnoutEstimadoInicialBrl,
    metaEbitdaContratadaBrl,
    ebitdaEfetivoAlcancadoBrl,
    valorEarnoutRemensuradoFechamentoBrl
  } = input;

  if (valorEarnoutEstimadoInicialBrl < 0 || valorEarnoutRemensuradoFechamentoBrl < 0) {
    return Err(new Error('Valores de Earn-out devem ser maiores ou iguais a zero.'));
  }

  // CPC 15 R1 Itens 39-40 e 58:
  // Contraprestação contingente liquidável em caixa é classificada como Passivo Financeiro (CPC 48).
  // Alterações no valor justo da contraprestação contingente após a data de aquisição
  // NÃO afetam o Goodwill e devem ser reconhecidas diretamente no resultado do exercício (DRE).
  const variacaoValorJusto = Number((valorEarnoutRemensuradoFechamentoBrl - valorEarnoutEstimadoInicialBrl).toFixed(2));
  const partidas: JournalEntryLine[] = [];

  if (variacaoValorJusto > 0) {
    // Aumento do Passivo de Earn-out -> Despesa na DRE
    partidas.push({
      accountId: '3.2.3.10',
      accountCode: '3.2.3.10',
      accountName: 'Despesa com Remensuração de Earn-out / Contraprestação Contingente (Resultado - CPC 15/48)',
      type: 'DEBIT',
      amount: variacaoValorJusto
    });

    partidas.push({
      accountId: '2.2.2.20',
      accountCode: '2.2.2.20',
      accountName: 'Contas a Pagar por Aquisição de Investimentos - Earn-out (Passivo Não Circulante - CPC 48)',
      type: 'CREDIT',
      amount: variacaoValorJusto
    });
  } else if (variacaoValorJusto < 0) {
    // Redução do Passivo de Earn-out (metas não batidas) -> Ganho na DRE
    const ganho = Math.abs(variacaoValorJusto);
    partidas.push({
      accountId: '2.2.2.20',
      accountCode: '2.2.2.20',
      accountName: 'Contas a Pagar por Aquisição de Investimentos - Earn-out (Passivo Não Circulante - CPC 48)',
      type: 'DEBIT',
      amount: ganho
    });

    partidas.push({
      accountId: '3.1.2.20',
      accountCode: '3.1.2.20',
      accountName: 'Ganho com Reversão/Ajuste de Earn-out em M&A (Resultado - CPC 15/48)',
      type: 'CREDIT',
      amount: ganho
    });
  }

  const diag = 'Contraprestação Contingente / Earn-out (CPC 15 R1 & CPC 48): ' + adquirenteNome + ' na compra de ' + adquiridaNome + '. Meta EBITDA: R$ ' + metaEbitdaContratadaBrl.toFixed(2) + ' | Realizado: R$ ' + ebitdaEfetivoAlcancadoBrl.toFixed(2) + '. Passivo Inicial: R$ ' + valorEarnoutEstimadoInicialBrl.toFixed(2) + ' -> Remensurado: R$ ' + valorEarnoutRemensuradoFechamentoBrl.toFixed(2) + ' (Impacto na DRE: R$ ' + variacaoValorJusto.toFixed(2) + '). GOODWILL INALTERADO.';

  return Ok({
    aquisicaoId,
    adquirenteNome,
    adquiridaNome,
    valorInicialPassivoEarnoutBrl: valorEarnoutEstimadoInicialBrl,
    novoValorJustoPassivoEarnoutBrl: valorEarnoutRemensuradoFechamentoBrl,
    variacaoValorJustoResultadoDrebBrl: variacaoValorJusto,
    isGoodwillInalterado: true,
    partidasDobradaRemensuracao: partidas,
    diagnosticoCpc15e48: diag
  });
}
