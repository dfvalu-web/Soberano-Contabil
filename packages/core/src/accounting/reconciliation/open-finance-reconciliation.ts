import { Result, Ok } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface BankTransactionEvent {
  id: string;
  banco: string;
  dataTransacao: string;
  tipo: 'PIX_RECEBIDO' | 'PIX_ENVIADO' | 'TED_RECEBIDA' | 'BOLETO_LIQUIDADO' | 'TARIFA_BANCARIA';
  valor: number;
  documentoCpfCnpjContraparte?: string;
  nomeContraparte?: string;
  descricaoOriginal: string;
}

export interface ReconciliationMatchResult {
  transacaoId: string;
  tipo: string;
  valor: number;
  data: string;
  statusConciliacao: 'CONCILIADO_AUTOMATICO' | 'CONCILIADO_COM_DIVERGENCIA' | 'PENDENTE_ANALISE';
  scoreConfiancaPercent: number;
  partidasDobradaSugeridas: JournalEntryLine[];
}

export function processOpenFinanceTransaction(
  event: BankTransactionEvent
): Result<ReconciliationMatchResult, Error> {
  const isCredito = event.tipo === 'PIX_RECEBIDO' || event.tipo === 'TED_RECEBIDA';
  const isTarifa = event.tipo === 'TARIFA_BANCARIA';

  const partidas: JournalEntryLine[] = [];
  let score = 95;

  if (isCredito) {
    // D: Banco Conta Movimento / C: Clientes a Receber
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'DEBIT',
      amount: event.valor
    });
    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes Nacionais - Duplicatas a Receber (Ativo Circulante)',
      type: 'CREDIT',
      amount: event.valor
    });
  } else if (isTarifa) {
    // D: Despesas Bancárias / C: Bancos
    partidas.push({
      accountId: '4.1.3.02',
      accountCode: '4.1.3.02',
      accountName: 'Despesas com Tarifas e Serviços Bancários (Resultado)',
      type: 'DEBIT',
      amount: event.valor
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: event.valor
    });
    score = 100;
  } else {
    // D: Fornecedores a Pagar / C: Bancos
    partidas.push({
      accountId: '2.1.1.01',
      accountCode: '2.1.1.01',
      accountName: 'Fornecedores Nacionais a Pagar (Passivo Circulante)',
      type: 'DEBIT',
      amount: event.valor
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: event.valor
    });
  }

  return Ok({
    transacaoId: event.id,
    tipo: event.tipo,
    valor: event.valor,
    data: event.dataTransacao,
    statusConciliacao: 'CONCILIADO_AUTOMATICO',
    scoreConfiancaPercent: score,
    partidasDobradaSugeridas: partidas
  });
}
