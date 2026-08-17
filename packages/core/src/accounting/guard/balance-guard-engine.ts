import { Account, JournalEntry } from '../../types/accounting.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface BalanceAnomaly {
  accountId: string;
  accountCode: string;
  accountName: string;
  tipoAnomalia: 'SALDO_INVERTIDO_PROIBIDO' | 'DESBALANCEAMENTO_DEBITO_CREDITO' | 'CONTA_SINTETICA_COM_LANCAMENTO';
  saldoAtual: number;
  descricao: string;
}

export interface BalanceGuardReport {
  isTotalmenteIntegro: boolean;
  totalContasAnalisadas: number;
  totalAtivo: number;
  totalPassivo: number;
  totalPatrimonioLiquido: number;
  diferencaEquacaoPatrimonial: number;
  totalAnomalias: number;
  anomalias: BalanceAnomaly[];
}

export function inspectBalanceIntegrity(
  accounts: Account[],
  entries: JournalEntry[]
): Result<BalanceGuardReport, Error> {
  const anomalias: BalanceAnomaly[] = [];

  let totalAtivo = 0;
  let totalPassivo = 0;
  let totalPl = 0;

  for (const acc of accounts) {
    if (acc.tipo === 'SINTETICA' && Math.abs(acc.saldoAtual) > 0) {
      const temLancamentoDireto = entries.some(e => e.linhas.some(l => l.accountId === acc.id));
      if (temLancamentoDireto) {
        anomalias.push({
          accountId: acc.id,
          accountCode: acc.codigo,
          accountName: acc.nome,
          tipoAnomalia: 'CONTA_SINTETICA_COM_LANCAMENTO',
          saldoAtual: acc.saldoAtual,
          descricao: 'Contas sintéticas não podem receber lançamentos diretos.'
        });
      }
    }

    if (acc.codigo.startsWith('1.1.1') && acc.saldoAtual < 0) {
      anomalias.push({
        accountId: acc.id,
        accountCode: acc.codigo,
        accountName: acc.nome,
        tipoAnomalia: 'SALDO_INVERTIDO_PROIBIDO',
        saldoAtual: acc.saldoAtual,
        descricao: 'Conta de disponibilidades/caixa não pode apresentar saldo credor/negativo.'
      });
    }

    if (acc.codigo.startsWith('1.')) totalAtivo += acc.saldoAtual;
    else if (acc.codigo.startsWith('2.1.') || acc.codigo.startsWith('2.2.')) totalPassivo += acc.saldoAtual;
    else if (acc.codigo.startsWith('2.3.')) totalPl += acc.saldoAtual;
  }

  const diffEquacao = Number(Math.abs(totalAtivo - (totalPassivo + totalPl)).toFixed(2));

  return Ok({
    isTotalmenteIntegro: anomalias.length === 0,
    totalContasAnalisadas: accounts.length,
    totalAtivo: Number(totalAtivo.toFixed(2)),
    totalPassivo: Number(totalPassivo.toFixed(2)),
    totalPatrimonioLiquido: Number(totalPl.toFixed(2)),
    diferencaEquacaoPatrimonial: diffEquacao,
    totalAnomalias: anomalias.length,
    anomalias
  });
}
