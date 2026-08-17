import { describe, it, expect } from 'vitest';
import { createStandardChartOfAccounts } from '../src/accounting/chart-of-accounts/standard-chart.js';
import { DoubleEntryEngine } from '../src/accounting/ledger/double-entry.js';
import { generateFinancialStatements } from '../src/accounting/statements/financial-statements.js';
import { calculateInss, calculateIrrf } from '../src/payroll/calculator/inss-irrf.js';
import { calculateMonthlyPayroll } from '../src/payroll/calculator/payroll-engine.js';
import { calculateTermination } from '../src/payroll/terminations/termination-calculator.js';
import { unwrap } from '../src/types/result.js';

describe('Motor Contábil & IFRS', () => {
  it('deve realizar lançamentos em partidas dobradas e manter o balanço patrimonial perfeitamente equilibrado', () => {
    const contas = createStandardChartOfAccounts('tenant-01');
    const engine = new DoubleEntryEngine(contas);

    // 1. Abertura e Integralização de Capital Social: D=Banco (1.1.1.02) R$ 100.000 | C=Capital Social (2.3.1.01) R$ 100.000
    const entry1 = engine.postEntry(
      'tenant-01',
      '2026-01-02',
      'Integralização de Capital Social',
      [
        { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 100000.00 },
        { accountId: '2.3.1.01', accountCode: '2.3.1.01', accountName: 'Capital Social Subscrito', type: 'CREDIT', amount: 100000.00 }
      ]
    );
    expect(unwrap(entry1).totalDebito).toBe(100000.00);

    // 2. Compra de Mercadorias à vista: D=Estoque (1.1.3.01) R$ 30.000 | C=Banco (1.1.1.02) R$ 30.000
    const entry2 = engine.postEntry(
      'tenant-01',
      '2026-01-05',
      'Compra de Mercadorias para Revenda',
      [
        { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Mercadorias para Revenda', type: 'DEBIT', amount: 30000.00 },
        { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'CREDIT', amount: 30000.00 }
      ]
    );
    expect(unwrap(entry2).totalDebito).toBe(30000.00);

    // 3. Venda de Mercadorias a prazo: D=Clientes (1.1.2.01) R$ 50.000 | C=Receita (3.1.1.01) R$ 50.000
    const entry3 = engine.postEntry(
      'tenant-01',
      '2026-01-10',
      'Venda de Mercadorias a Prazo',
      [
        { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'DEBIT', amount: 50000.00 },
        { accountId: '3.1.1.01', accountCode: '3.1.1.01', accountName: 'Receita de Venda de Mercadorias', type: 'CREDIT', amount: 50000.00 }
      ]
    );
    expect(unwrap(entry3).totalDebito).toBe(50000.00);

    // 4. Baixa de CMV: D=CMV (4.1.1.01) R$ 20.000 | C=Estoque (1.1.3.01) R$ 20.000
    const entry4 = engine.postEntry(
      'tenant-01',
      '2026-01-10',
      'Baixa de CMV',
      [
        { accountId: '4.1.1.01', accountCode: '4.1.1.01', accountName: 'Custo das Mercadorias Vendidas (CMV)', type: 'DEBIT', amount: 20000.00 },
        { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Mercadorias para Revenda', type: 'CREDIT', amount: 20000.00 }
      ]
    );
    expect(unwrap(entry4).totalDebito).toBe(20000.00);

    // Gera Demonstrações Financeiras
    const stmts = unwrap(generateFinancialStatements(engine.getAccounts(), '2026-01-01', '2026-01-31'));
    expect(stmts.incomeStatement.receitaBruta).toBe(50000.00);
    expect(stmts.incomeStatement.custosOperacionais).toBe(20000.00);
    expect(stmts.incomeStatement.lucroBruto).toBe(30000.00);
    expect(stmts.balanceSheet.isEquilibrado).toBe(true);
    expect(stmts.balanceSheet.diferenca).toBeLessThan(1.00);
  });
});

describe('Recursos Humanos & Folha de Pagamento', () => {
  it('deve calcular o INSS progressivo acumulado conforme tabela 2026', () => {
    const { inssTotal } = calculateInss(5000.00);
    // Faixa 1 (até 1518.00 * 7.5%) = 113.85
    // Faixa 2 (1518.01 a 2793.88 * 9%) = (2793.88 - 1518.00) * 0.09 = 114.83
    // Faixa 3 (2793.89 a 4190.83 * 12%) = (4190.83 - 2793.88) * 0.12 = 167.63
    // Faixa 4 (4190.84 a 5000.00 * 14%) = (5000.00 - 4190.83) * 0.14 = 113.28
    // Total esperado aproximado: 509.59
    expect(inssTotal).toBeCloseTo(509.59, 1);
  });

  it('deve calcular rescisão sem justa causa com multa rescisória de 40% do FGTS', () => {
    const res = calculateTermination({
      tipo: 'DEMISSAO_SEM_JUSTA_CAUSA',
      dataAdmissao: '2024-01-01',
      dataDemissao: '2026-01-01', // 2 anos -> 36 dias de aviso prévio
      salarioBase: 3000.00,
      motivoAvisoPrevio: 'INDENIZADO',
      saldoFgtsAcumulado: 6000.00,
      mesesTrabalhadosAnoCorrente: 1,
      diasSaldoSalario: 10,
      feriasVencidas: false
    });

    const data = unwrap(res);
    expect(data.diasAvisoPrevioTotal).toBe(36);
    expect(data.fgts.multaRescisoriaFgts).toBe(2400.00); // 6.000 * 40%
    expect(data.fgts.percentualMulta).toBe(40);
    expect(data.fgts.permiteSeguroDesemprego).toBe(true);
  });

  it('deve calcular rescisão por acordo mútuo (Art. 484-A CLT) com 50% de aviso e 20% de multa FGTS', () => {
    const res = calculateTermination({
      tipo: 'ACORDO_MUTUO_ART_484_A',
      dataAdmissao: '2025-01-01',
      dataDemissao: '2026-01-01',
      salarioBase: 3000.00,
      motivoAvisoPrevio: 'INDENIZADO',
      saldoFgtsAcumulado: 3000.00,
      mesesTrabalhadosAnoCorrente: 1,
      diasSaldoSalario: 10,
      feriasVencidas: false
    });

    const data = unwrap(res);
    expect(data.fgts.multaRescisoriaFgts).toBe(600.00); // 3.000 * 20%
    expect(data.fgts.saldoFgtsLiberadoSaque).toBe(2400.00); // 80% do saldo
    expect(data.fgts.permiteSeguroDesemprego).toBe(false);
  });
});
