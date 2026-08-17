import { Account, JournalEntry, JournalEntryLine } from '../../types/accounting.js';
import { Result, Ok, Err } from '../../types/result.js';

// Simple deterministic hash for ledger integrity (runs in Node & Browser environments)
function simpleSha256Simulated(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
}

export class DoubleEntryEngine {
  private accountsMap: Map<string, Account>;
  private lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000';
  private entries: JournalEntry[] = [];
  private sequenceCounter: number = 1;

  constructor(initialAccounts: Account[]) {
    this.accountsMap = new Map();
    initialAccounts.forEach(acc => this.accountsMap.set(acc.id, { ...acc }));
  }

  public getAccounts(): Account[] {
    return Array.from(this.accountsMap.values());
  }

  public getEntries(): JournalEntry[] {
    return [...this.entries];
  }

  public postEntry(
    tenantId: string,
    data: string,
    historicoPadrao: string,
    linhas: JournalEntryLine[],
    documentoOrigem?: JournalEntry['documentoOrigem']
  ): Result<JournalEntry, Error> {
    if (!linhas || linhas.length < 2) {
      return Err(new Error('Um lançamento em partidas dobradas exige no mínimo duas linhas (um débito e um crédito).'));
    }

    let totalDebito = 0;
    let totalCredito = 0;

    for (const linha of linhas) {
      const conta = this.accountsMap.get(linha.accountId);
      if (!conta) {
        return Err(new Error('Conta com ID ' + linha.accountId + ' não encontrada no plano de contas.'));
      }
      if (!conta.isAnalitica) {
        return Err(new Error('A conta ' + conta.codigo + ' - ' + conta.nome + ' é sintética e não aceita lançamentos diretos.'));
      }
      if (linha.amount <= 0) {
        return Err(new Error('O valor de cada linha de lançamento deve ser positivo.'));
      }

      if (linha.type === 'DEBIT') {
        totalDebito += linha.amount;
      } else {
        totalCredito += linha.amount;
      }
    }

    totalDebito = Number(totalDebito.toFixed(2));
    totalCredito = Number(totalCredito.toFixed(2));

    if (Math.abs(totalDebito - totalCredito) > 0.001) {
      return Err(new Error('Partidas dobradas desbalanceadas: Total Débito (R$ ' + totalDebito.toFixed(2) + ') != Total Crédito (R$ ' + totalCredito.toFixed(2) + ').'));
    }

    for (const linha of linhas) {
      const conta = this.accountsMap.get(linha.accountId)!;
      if (conta.natureza === 'DEBIT') {
        conta.saldoAtual += linha.type === 'DEBIT' ? linha.amount : -linha.amount;
      } else {
        conta.saldoAtual += linha.type === 'CREDIT' ? linha.amount : -linha.amount;
      }
      conta.saldoAtual = Number(conta.saldoAtual.toFixed(2));
    }

    const payloadToHash = JSON.stringify({
      prevHash: this.lastHash,
      numero: this.sequenceCounter,
      tenantId,
      data,
      historicoPadrao,
      linhas,
      totalDebito
    });
    const hashTransacao = simpleSha256Simulated(payloadToHash);
    this.lastHash = hashTransacao;

    const entry: JournalEntry = {
      id: 'JE-' + Date.now() + '-' + this.sequenceCounter,
      tenantId,
      numeroLancamento: this.sequenceCounter++,
      data,
      historicoPadrao,
      linhas,
      totalDebito,
      totalCredito,
      documentoOrigem,
      criadoEm: new Date(),
      hashTransacao
    };

    this.entries.push(entry);
    return Ok(entry);
  }
}
