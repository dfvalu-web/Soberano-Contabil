import { describe, it, expect } from 'vitest';
import { accountingIntegrationEngine } from '../src/accounting/integration/accounting-integration-engine';
import { generalJournalEngine } from '../src/accounting/ledger/general-journal-engine';
import { trialBalanceEngine } from '../src/accounting/reports/trial-balance-engine';

describe('Sincronização Fiscal-Contábil Avançada (23 Submódulos Fiscais)', () => {
  it('deve sincronizar retenções federais (CSRF 4,65% e IRRF 1,5%) com o Livro Diário', () => {
    const res = accountingIntegrationEngine.syncFiscalWithholdingsToLedger('t1', {
      date: '2026-08-18',
      providerName: 'Consultoria Tributária Platinum Ltda',
      invoiceNumber: 'NF-9821',
      grossAmount: 10000.00,
      csrfAmount: 465.00, // 4.65%
      irrfAmount: 150.00, // 1.50%
      issAmount: 200.00   // 2.00%
    });

    expect(res.success).toBe(true);
    expect(res.entry).toBeDefined();
    expect(res.entry?.totalDebits).toBe(10000.00);
    expect(res.entry?.totalCredits).toBe(10000.00);
  });

  it('deve escriturar apropriação mensal de crédito CIAP Bloco G (1/48 Avos de ICMS)', () => {
    const res = accountingIntegrationEngine.syncCiapCreditToLedger('t1', {
      date: '2026-08-20',
      competencia: '2026-08',
      monthlyCreditAmount: 1250.00,
      assetName: 'Torno CNC Industrial Multieixos',
      parcelNumber: 14
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(1250.00);
    expect(res.entry?.totalCredits).toBe(1250.00);
  });

  it('deve registrar pagamento de guia tributária (DAS / DARF) com baixa bancária', () => {
    const res = accountingIntegrationEngine.syncTaxPaymentToLedger('t1', {
      date: '2026-08-20',
      taxType: 'PGDAS-D Simples Nacional',
      amount: 7225.00,
      bankAccountCode: '1.1.1.02'
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(7225.00);
    expect(res.entry?.totalCredits).toBe(7225.00);
  });

  it('deve apropriar encargos moratórios (Taxa Selic + Multa de Mora Art. 61) no recálculo', () => {
    const res = accountingIntegrationEngine.syncTaxArrearsToLedger('t1', {
      date: '2026-08-22',
      taxType: 'DARF IRPJ Estimativa',
      principal: 15000.00,
      interestSelic: 450.00,
      fineMora: 300.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(750.00);
    expect(res.entry?.totalCredits).toBe(750.00);
  });

  it('deve contabilizar compensação eletrônica PER/DCOMP entre crédito e débito', () => {
    const res = accountingIntegrationEngine.syncPerDcompOffsetToLedger('t1', {
      date: '2026-08-24',
      perDcompNumber: 'PERDCOMP-2026-8841',
      creditType: 'Saldo Negativo IRPJ',
      debitType: 'PIS/COFINS Débito Corrente',
      offsetAmount: 8500.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(8500.00);
    expect(res.entry?.totalCredits).toBe(8500.00);
  });

  it('deve escriturar perdas e quebras de estoques apuradas no SPED Bloco H/K', () => {
    const res = accountingIntegrationEngine.syncInventoryAdjustmentToLedger('t1', {
      date: '2026-08-25',
      reason: 'Avaria no transporte e umidade em armazém',
      adjustmentAmount: 2400.00,
      itemCode: 'PROD-882',
      itemName: 'Insumo Químico Reagente Grau Industrial'
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(2400.00);
    expect(res.entry?.totalCredits).toBe(2400.00);
  });

  it('deve escriturar doação e incentivo fiscal (Lei Rouanet / FIA) com dedução no IRPJ', () => {
    const res = accountingIntegrationEngine.syncTaxIncentivesDonationToLedger('t1', {
      date: '2026-08-26',
      projectType: 'LEI_ROUANET_ART18',
      projectName: 'Orquestra Sinfônica Jovem Brasileira',
      donationAmount: 5000.00,
      taxDeductionAmount: 5000.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(5000.00);
    expect(res.entry?.totalCredits).toBe(5000.00);
  });

  it('deve manter o Balancete de 8 Colunas rigorosamente balanceado após todas as operações fiscais', () => {
    const tb = trialBalanceEngine.generateTrialBalance('t1');
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalPeriodDebit).toBe(tb.totalPeriodCredit);
    expect(tb.totalFinalDebit).toBe(tb.totalFinalCredit);
  });
});
