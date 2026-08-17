import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type TreasuryOperationType = 'RECOMPRA_AQUISICAO' | 'ALIENACAO_COM_AGIO' | 'CANCELAMENTO_ACOES';

export interface TreasurySharesInput {
  transacaoId: string;
  tipoOperacao: TreasuryOperationType;
  quantidadeAcoes: number;
  valorTotalAquisicaoBrl: number; // Para recompra ou custo histórico das ações
  valorTotalVendaBrl?: number;    // Para alienação
  saldoReservasLucrosDisponiveisBrl: number; // Para checagem de limite legal (Art. 30 Lei 6.404)
}

export interface TreasurySharesResult {
  transacaoId: string;
  tipoOperacao: TreasuryOperationType;
  quantidadeAcoes: number;
  saldoAcoesEmTesourariaRedutoraPlBrl: number;
  reservaCapitalAgioAlienacaoPlBrl: number;
  limiteLegalReservasAtingido: boolean;
  partidasDobradaTesouraria: JournalEntryLine[];
  diagnosticoCpc08: string;
}

export function processTreasurySharesOperation(input: TreasurySharesInput): Result<TreasurySharesResult, Error> {
  const {
    transacaoId,
    tipoOperacao,
    quantidadeAcoes,
    valorTotalAquisicaoBrl,
    valorTotalVendaBrl = 0,
    saldoReservasLucrosDisponiveisBrl
  } = input;

  if (quantidadeAcoes <= 0 || valorTotalAquisicaoBrl <= 0) {
    return Err(new Error('Quantidade de ações e valor da transação devem ser superiores a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (tipoOperacao === 'RECOMPRA_AQUISICAO') {
    // Checagem de Limite Legal (Art. 30 da Lei 6.404/76 e Resolução CVM nº 77/2022)
    const limiteExcedido = valorTotalAquisicaoBrl > saldoReservasLucrosDisponiveisBrl;
    if (limiteExcedido) {
      return Err(new Error('Valor de recompra (R$ ' + valorTotalAquisicaoBrl.toFixed(2) + ') excede o saldo de reservas de lucros disponíveis (R$ ' + saldoReservasLucrosDisponiveisBrl.toFixed(2) + '). Recompra ilegal nos termos do Art. 30 da Lei 6.404/76.'));
    }

    // D: Ações em Tesouraria (Conta Redutora do PL - CPC 08)
    partidas.push({
      accountId: '2.4.4.01',
      accountCode: '2.4.4.01',
      accountName: 'Ações Próprias em Tesouraria (Conta Redutora do PL - CPC 08)',
      type: 'DEBIT',
      amount: valorTotalAquisicaoBrl
    });
    // C: Caixa / Bancos
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorTotalAquisicaoBrl
    });

    const diag = 'Ações em Tesouraria (CPC 08 R1 & Art. 30 Lei 6.404/76): Recompra de ' + quantidadeAcoes + ' ações próprias por R$ ' + valorTotalAquisicaoBrl.toFixed(2) + '. Conta redutora do PL registrada com sucesso. Saldo de reservas disponíveis suficiente.';

    return Ok({
      transacaoId,
      tipoOperacao,
      quantidadeAcoes,
      saldoAcoesEmTesourariaRedutoraPlBrl: valorTotalAquisicaoBrl,
      reservaCapitalAgioAlienacaoPlBrl: 0,
      limiteLegalReservasAtingido: false,
      partidasDobradaTesouraria: partidas,
      diagnosticoCpc08: diag
    });
  } else if (tipoOperacao === 'ALIENACAO_COM_AGIO') {
    const agioCapital = Number((valorTotalVendaBrl - valorTotalAquisicaoBrl).toFixed(2));

    // D: Caixa (Pelo valor da venda)
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorTotalVendaBrl
    });
    // C: Ações em Tesouraria (Pelo custo original)
    partidas.push({
      accountId: '2.4.4.01',
      accountCode: '2.4.4.01',
      accountName: 'Ações Próprias em Tesouraria (Conta Redutora do PL - CPC 08)',
      type: 'CREDIT',
      amount: valorTotalAquisicaoBrl
    });
    // C: Reserva de Capital - Ágio na Alienação de Ações em Tesouraria (PL - CPC 08)
    if (agioCapital > 0) {
      partidas.push({
        accountId: '2.4.1.05',
        accountCode: '2.4.1.05',
        accountName: 'Reserva de Capital - Ágio na Alienação de Ações em Tesouraria (PL - CPC 08)',
        type: 'CREDIT',
        amount: agioCapital
      });
    }

    const diag = 'Alienação de Ações em Tesouraria (CPC 08 R1): Venda de ' + quantidadeAcoes + ' ações por R$ ' + valorTotalVendaBrl.toFixed(2) + ' (Custo: R$ ' + valorTotalAquisicaoBrl.toFixed(2) + '). Ágio de R$ ' + agioCapital.toFixed(2) + ' creditado diretamente na Reserva de Capital no PL sem impacto na DRE.';

    return Ok({
      transacaoId,
      tipoOperacao,
      quantidadeAcoes,
      saldoAcoesEmTesourariaRedutoraPlBrl: 0,
      reservaCapitalAgioAlienacaoPlBrl: agioCapital,
      limiteLegalReservasAtingido: false,
      partidasDobradaTesouraria: partidas,
      diagnosticoCpc08: diag
    });
  } else {
    // Cancelamento de Ações em Tesouraria contra Reservas
    partidas.push({
      accountId: '2.4.2.05',
      accountCode: '2.4.2.05',
      accountName: 'Reserva Estatutária / Lucros para Cancelamento de Ações (PL)',
      type: 'DEBIT',
      amount: valorTotalAquisicaoBrl
    });
    partidas.push({
      accountId: '2.4.4.01',
      accountCode: '2.4.4.01',
      accountName: 'Ações Próprias em Tesouraria (Conta Redutora do PL - CPC 08)',
      type: 'CREDIT',
      amount: valorTotalAquisicaoBrl
    });

    const diag = 'Cancelamento de Ações em Tesouraria: ' + quantidadeAcoes + ' ações no valor de R$ ' + valorTotalAquisicaoBrl.toFixed(2) + ' canceladas contra reservas de lucros sem alteração do capital subscrito.';

    return Ok({
      transacaoId,
      tipoOperacao,
      quantidadeAcoes,
      saldoAcoesEmTesourariaRedutoraPlBrl: 0,
      reservaCapitalAgioAlienacaoPlBrl: 0,
      limiteLegalReservasAtingido: false,
      partidasDobradaTesouraria: partidas,
      diagnosticoCpc08: diag
    });
  }
}
