import { describe, it, expect } from 'vitest';
import { accountingIntegrationEngine } from '../src/accounting/integration/accounting-integration-engine';
import { generalJournalEngine } from '../src/accounting/ledger/general-journal-engine';
import { trialBalanceEngine } from '../src/accounting/reports/trial-balance-engine';

describe('Sincronização DP-Contábil Avançada (16 Submódulos de Folha e RH)', () => {
  it('deve escriturar rescisão trabalhista TRCT com aviso prévio, férias/13º e multa de 40% do FGTS', () => {
    const res = accountingIntegrationEngine.syncLaborTerminationToLedger('t1', {
      date: '2026-08-20',
      employeeName: 'Carlos Alberto Silva',
      terminationType: 'SEM_JUSTA_CAUSA',
      salaryBalance: 2400.00,
      severanceNotice: 4800.00,
      vacationTermination: 3200.00,
      thirteenthTermination: 1600.00,
      fgtsFine40: 3840.00,
      inssRetained: 264.00,
      irrfRetained: 180.00
    });

    expect(res.success).toBe(true);
    expect(res.entry).toBeDefined();
    expect(res.entry?.totalDebits).toBe(res.entry?.totalCredits);
  });

  it('deve escriturar adicionais de Insalubridade (NR-15) e Periculosidade (NR-16)', () => {
    const res = accountingIntegrationEngine.syncHazardousPayToLedger('t1', {
      date: '2026-08-30',
      competencia: '2026-08',
      insalubridadeAmount: 1412.00, // 40% SM
      periculosidadeAmount: 1800.00, // 30% SB
      employeeCount: 4
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(3212.00);
    expect(res.entry?.totalCredits).toBe(3212.00);
  });

  it('deve escriturar Horas Extras (50%/100%), Adicional Noturno e Reflexo DSR', () => {
    const res = accountingIntegrationEngine.syncOvertimeDsrToLedger('t1', {
      date: '2026-08-30',
      competencia: '2026-08',
      overtime50Amount: 1200.00,
      overtime100Amount: 600.00,
      nightShiftAmount: 450.00,
      dsrReflexAmount: 450.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(2700.00);
    expect(res.entry?.totalCredits).toBe(2700.00);
  });

  it('deve contabilizar Benefícios Flexíveis, Vale-Transporte (6%) e PAT', () => {
    const res = accountingIntegrationEngine.syncFlexibleBenefitsPatToLedger('t1', {
      date: '2026-08-30',
      competencia: '2026-08',
      totalVtCost: 3500.00,
      vtEmployeeDiscount: 1200.00, // 6%
      totalPatMealCost: 6000.00,
      patEmployeeDiscount: 600.00,
      healthInsuranceEmployer: 4000.00,
      healthInsuranceEmployeeDiscount: 1000.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(res.entry?.totalCredits);
  });

  it('deve escriturar retenção e repasse de Pensão Alimentícia Judicial', () => {
    const res = accountingIntegrationEngine.syncAlimonyChildSupportToLedger('t1', {
      date: '2026-08-30',
      competencia: '2026-08',
      employeeName: 'Fernando Rocha',
      beneficiaryName: 'Mariana Rocha (Filha menor)',
      alimonyAmount: 1500.00,
      processNumber: '0012345-88.2026.8.26.0100'
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(1500.00);
    expect(res.entry?.totalCredits).toBe(1500.00);
  });

  it('deve contabilizar Desoneração da Folha (CPRB Lei 12.546/11)', () => {
    const res = accountingIntegrationEngine.syncCprbPayrollReliefToLedger('t1', {
      date: '2026-08-30',
      competencia: '2026-08',
      grossRevenue: 250000.00,
      cprbRate: 0.025, // 2.5%
      cprbAmount: 6250.00
    });

    expect(res.success).toBe(true);
    expect(res.entry?.totalDebits).toBe(6250.00);
    expect(res.entry?.totalCredits).toBe(6250.00);
  });

  it('deve manter o Balancete de 8 Colunas rigorosamente equilibrado após todos os eventos de DP', () => {
    const tb = trialBalanceEngine.generateTrialBalance('t1');
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalPeriodDebit).toBe(tb.totalPeriodCredit);
    expect(tb.totalFinalDebit).toBe(tb.totalFinalCredit);
  });
});
