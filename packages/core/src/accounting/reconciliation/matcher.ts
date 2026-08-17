import { BankTransaction } from './ofx-parser.js';
import { Result, Ok } from '../../types/result.js';

export interface InternalBill {
  id: string;
  tipo: 'PAGAR' | 'RECEBER';
  descricao: string;
  dataVencimento: string;
  valorOriginal: number;
  favorecido: string;
  conciliado: boolean;
}

export interface MatchScore {
  transacaoBancaria: BankTransaction;
  tituloInterno?: InternalBill;
  scoreConfiancaPercentual: number;
  diferencaValor: number;
  diferencaDias: number;
  tipoConciliacaoSugerida: 'EXATA' | 'PROVAVEL_COM_JUROS_MULTA' | 'TARIFA_BANCARIA' | 'SEM_CORRESPONDENCIA';
}

export function matchBankTransactions(
  transactions: BankTransaction[],
  bills: InternalBill[]
): Result<MatchScore[], Error> {
  const results: MatchScore[] = [];

  for (const trn of transactions) {
    let bestMatch: InternalBill | undefined = undefined;
    let bestScore = 0;
    let minDiffValue = 999999;
    let minDiffDays = 999;

    const candidatos = bills.filter(b => !b.conciliado && (
      (trn.type === 'DEBIT' && b.tipo === 'PAGAR') ||
      (trn.type === 'CREDIT' && b.tipo === 'RECEBER')
    ));

    for (const b of candidatos) {
      const diffVal = Math.abs(trn.amount - b.valorOriginal);
      
      const trnTime = new Date(trn.datePosted).getTime();
      const bTime = new Date(b.dataVencimento).getTime();
      const diffDays = Math.abs(Math.round((trnTime - bTime) / (1000 * 60 * 60 * 24)));

      let score = 0;
      if (diffVal === 0) {
        score += 60;
      } else if (diffVal / b.valorOriginal < 0.05) {
        score += 40; // 5% de tolerância para juros/multa/desconto
      }

      if (diffDays === 0) {
        score += 30;
      } else if (diffDays <= 3) {
        score += 20;
      } else if (diffDays <= 7) {
        score += 10;
      }

      // Fuzzy memo text match
      const memoLower = trn.memo.toLowerCase();
      const favLower = b.favorecido.toLowerCase();
      if (memoLower.includes(favLower) || favLower.includes(memoLower)) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = b;
        minDiffValue = diffVal;
        minDiffDays = diffDays;
      }
    }

    let tipoConciliacao: MatchScore['tipoConciliacaoSugerida'] = 'SEM_CORRESPONDENCIA';
    if (bestScore >= 90) {
      tipoConciliacao = 'EXATA';
    } else if (bestScore >= 50) {
      tipoConciliacao = 'PROVAVEL_COM_JUROS_MULTA';
    } else if (trn.memo.toLowerCase().includes('tarifa') || trn.memo.toLowerCase().includes('iof')) {
      tipoConciliacao = 'TARIFA_BANCARIA';
    }

    results.push({
      transacaoBancaria: trn,
      tituloInterno: bestMatch,
      scoreConfiancaPercentual: Math.min(100, bestScore),
      diferencaValor: Number(minDiffValue.toFixed(2)),
      diferencaDias: minDiffDays,
      tipoConciliacaoSugerida: tipoConciliacao
    });
  }

  return Ok(results);
}
