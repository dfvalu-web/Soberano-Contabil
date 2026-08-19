// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DO BALANCETE DE VERIFICAÇÃO DE 8 COLUNAS
// Agregação Hierárquica em 5 Níveis, Prova dos 9 e Drill-Down Analítico
// ==========================================================================

import { referentialChartService, AccountNode, AccountNature } from '../chart-of-accounts/referential-mapping';
import { generalJournalEngine, JournalEntry } from '../ledger/general-journal-engine';

export interface TrialBalanceRow {
  code: string;
  reducedCode: number;
  name: string;
  nature: AccountNature;
  level: number;
  isSynthetic: boolean;
  parentCode?: string;

  // 8 Colunas Canônicas
  initialDebit: number;
  initialCredit: number;
  periodDebit: number;
  periodCredit: number;
  finalDebit: number;
  finalCredit: number;
  closingDebit: number;
  closingCredit: number;

  netCurrentBalance: number; // Saldo líquido no período
}

export interface TrialBalanceReport {
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  rows: TrialBalanceRow[];
  totalInitialDebit: number;
  totalInitialCredit: number;
  totalPeriodDebit: number;
  totalPeriodCredit: number;
  totalFinalDebit: number;
  totalFinalCredit: number;
  isBalanced: boolean; // Prova dos 9: Débitos == Créditos
}

export class TrialBalanceEngine {
  public generateTrialBalance(tenantId: string, startDate?: string, endDate?: string): TrialBalanceReport {
    const allAccounts = referentialChartService.getAllAccounts();
    const entries = generalJournalEngine.getEntries(tenantId, startDate, endDate);

    // Mapeamento dos movimentos por conta analítica
    const analyticalMovements = new Map<string, { debits: number; credits: number }>();

    for (const entry of entries) {
      for (const line of entry.lines) {
        const current = analyticalMovements.get(line.accountCode) || { debits: 0, credits: 0 };
        if (line.type === 'DEBITO') {
          current.debits += line.amount;
        } else {
          current.credits += line.amount;
        }
        analyticalMovements.set(line.accountCode, current);
      }
    }

    // 1. Inicializa todas as linhas de contas
    const rowMap = new Map<string, TrialBalanceRow>();

    for (const acc of allAccounts) {
      const mov = analyticalMovements.get(acc.code) || { debits: 0, credits: 0 };
      const periodDeb = Math.round(mov.debits * 100) / 100;
      const periodCred = Math.round(mov.credits * 100) / 100;

      rowMap.set(acc.code, {
        code: acc.code,
        reducedCode: acc.reducedCode,
        name: acc.name,
        nature: acc.nature,
        level: acc.level,
        isSynthetic: acc.isSynthetic,
        parentCode: acc.parentCode,
        initialDebit: 0,
        initialCredit: 0,
        periodDebit: periodDeb,
        periodCredit: periodCred,
        finalDebit: 0,
        finalCredit: 0,
        closingDebit: 0,
        closingCredit: 0,
        netCurrentBalance: 0
      });
    }

    // 2. Agregação bottom-up dos níveis analíticos para os grupos sintéticos
    const sortedAccounts = [...allAccounts].sort((a, b) => b.level - a.level);

    for (const acc of sortedAccounts) {
      if (acc.isSynthetic) {
        let sumDeb = 0;
        let sumCred = 0;

        for (const [code, r] of rowMap.entries()) {
          if (!r.isSynthetic && (code.startsWith(acc.code + '.') || code.startsWith(acc.code))) {
            sumDeb += r.periodDebit;
            sumCred += r.periodCredit;
          }
        }

        const row = rowMap.get(acc.code)!;
        row.periodDebit = Math.round(sumDeb * 100) / 100;
        row.periodCredit = Math.round(sumCred * 100) / 100;
      }
    }

    // 3. Cálculo dos Saldos Finais (Devedor vs Credor)
    for (const [, row] of rowMap.entries()) {
      const diff = row.periodDebit - row.periodCredit;

      if (row.nature === 'DEVEDORA') {
        if (diff >= 0) {
          row.finalDebit = Math.round(diff * 100) / 100;
          row.finalCredit = 0;
        } else {
          row.finalDebit = 0;
          row.finalCredit = Math.round(Math.abs(diff) * 100) / 100;
        }
        row.netCurrentBalance = diff;
      } else {
        const credDiff = row.periodCredit - row.periodDebit;
        if (credDiff >= 0) {
          row.finalCredit = Math.round(credDiff * 100) / 100;
          row.finalDebit = 0;
        } else {
          row.finalCredit = 0;
          row.finalDebit = Math.round(Math.abs(credDiff) * 100) / 100;
        }
        row.netCurrentBalance = credDiff;
      }
    }

    const finalRows = Array.from(rowMap.values()).filter(r => r.periodDebit > 0 || r.periodCredit > 0 || r.level <= 2);

    const level1Rows = finalRows.filter(r => r.level === 1);
    const totalPeriodDebit = level1Rows.reduce((sum, r) => sum + r.periodDebit, 0);
    const totalPeriodCredit = level1Rows.reduce((sum, r) => sum + r.periodCredit, 0);
    const totalFinalDebit = level1Rows.reduce((sum, r) => sum + r.finalDebit, 0);
    const totalFinalCredit = level1Rows.reduce((sum, r) => sum + r.finalCredit, 0);

    return {
      tenantId,
      periodStart: startDate || '2026-08-01',
      periodEnd: endDate || '2026-08-31',
      rows: finalRows,
      totalInitialDebit: 0,
      totalInitialCredit: 0,
      totalPeriodDebit: Math.round(totalPeriodDebit * 100) / 100,
      totalPeriodCredit: Math.round(totalPeriodCredit * 100) / 100,
      totalFinalDebit: Math.round(totalFinalDebit * 100) / 100,
      totalFinalCredit: Math.round(totalFinalCredit * 100) / 100,
      isBalanced: Math.abs(totalPeriodDebit - totalPeriodCredit) < 0.01
    };
  }
}

export const trialBalanceEngine = new TrialBalanceEngine();
export default trialBalanceEngine;