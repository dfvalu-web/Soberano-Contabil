import { describe, it, expect } from 'vitest';
import { accountingIntegrationEngine } from '../src/accounting/integration/accounting-integration-engine';
import { generalJournalEngine } from '../src/accounting/ledger/general-journal-engine';
import { smartOfxReconciler } from '../src/accounting/reconciliation/smart-ofx-reconciler';
import { trialBalanceEngine } from '../src/accounting/reports/trial-balance-engine';

describe('Módulo Contábil Operacional — Integrações & Uploads', () => {
  it('deve sincronizar faturamento e tributos do módulo fiscal gerando partidas dobradas no Diário', () => {
    const res = accountingIntegrationEngine.syncFiscalToAccounting('t1', '2026-08');
    expect(res.success).toBe(true);
    expect(res.entriesCreated.length).toBe(3);
    expect(res.totalGrossRevenue).toBe(85000);
    expect(res.totalTaxesAccrued).toBe(7225);

    // Verificar se todas as entradas criadas estão perfeitamente balanceadas (D = C)
    for (const entry of res.entriesCreated) {
      expect(entry.totalDebits).toBe(entry.totalCredits);
    }
  });

  it('deve sincronizar a folha de pagamento CLT (salários, encargos e provisões) com o Diário', () => {
    const res = accountingIntegrationEngine.syncPayrollToAccounting('t1', '2026-08');
    expect(res.success).toBe(true);
    expect(res.entriesCreated.length).toBe(3);
    expect(res.totalGrossPayroll).toBe(24500);

    for (const entry of res.entriesCreated) {
      expect(entry.totalDebits).toBe(entry.totalCredits);
    }
  });

  it('deve permitir adicionar transações bancárias parseadas de arquivo e editar conta contrapartida', () => {
    const parsed = smartOfxReconciler.parseOfxContent(`
      <OFX>
        <STMTTRN>
          <TRNTYPE>DEBIT</TRNTYPE>
          <DTPOSTED>20260818</DTPOSTED>
          <TRNAMT>-350.00</TRNAMT>
          <FITID>upload-test-999</FITID>
          <MEMO>PAGTO ENERGIA ELETRICA ENEL SP</MEMO>
        </STMTTRN>
      </OFX>
    `, 'Banco Santander');

    expect(parsed.transactions.length).toBe(1);
    expect(parsed.transactions[0].amount).toBe(-350.00);

    smartOfxReconciler.addParsedTransactions('t1', parsed.transactions);
    const txs = smartOfxReconciler.getTransactions('t1');
    const added = txs.find(t => t.fitId === 'upload-test-999');
    expect(added).toBeDefined();

    // Atualizar contrapartida manualmente
    const updated = smartOfxReconciler.updateTransactionContraAccount('t1', added!.id, '4.1.3.01', 'Despesas Gerais e Energia');
    expect(updated).toBe(true);

    // Conciliar
    const recRes = smartOfxReconciler.reconcileTransaction('t1', added!.id);
    expect(recRes.success).toBe(true);
    expect(recRes.entry?.totalDebits).toBe(350);
    expect(recRes.entry?.totalCredits).toBe(350);
  });

  it('deve manter o Balancete de 8 Colunas rigorosamente equilibrado após as integrações', () => {
    const tb = trialBalanceEngine.generateTrialBalance('t1');
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalPeriodDebit).toBe(tb.totalPeriodCredit);
    expect(tb.totalFinalDebit).toBe(tb.totalFinalCredit);
  });
});
