import { describe, it, expect } from 'vitest';
import { createStandardChartOfAccounts } from '../src/accounting/chart-of-accounts/standard-chart.js';
import { DoubleEntryEngine } from '../src/accounting/ledger/double-entry.js';
import { generateDfcStatement, generateDmplStatement } from '../src/accounting/statements/dfc-dmpl.js';
import { executeAnnualClosing } from '../src/accounting/closing/are-closure.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 3: Motor Contabil Avancado (DFC, DMPL e Fechamento Anual ARE)', () => {
  it('deve gerar DFC (Metodo Indireto) e DMPL com equilibrio contábil', () => {
    const contas = createStandardChartOfAccounts('tenant-01');
    const dfcRes = generateDfcStatement(contas, 100000.00, '2026-01-01', '2026-12-31', 'INDIRETO');
    const dfc = unwrap(dfcRes);

    expect(dfc.totalFluxoOperacional).toBeDefined();
    expect(dfc.saldoFinalCaixa).toBe(Number((dfc.saldoInicialCaixa + dfc.variacaoLiquidaCaixaEquivalentes).toFixed(2)));

    const dmplRes = generateDmplStatement(100000.00, 10000.00, 50000.00, 80000.00, 20000.00, '2026-01-01', '2026-12-31');
    const dmpl = unwrap(dmplRes);

    expect(dmpl.totalPatrimonioLiquidoInicial).toBe(160000.00);
    expect(dmpl.totalPatrimonioLiquidoFinal).toBe(220000.00); // 160k + 80k lucro - 20k dividendos = 220k
    expect(dmpl.variacaoTotalPl).toBe(60000.00);
  });

  it('deve executar o Fechamento Anual (ARE) zerando contas de resultado e creditando o PL', () => {
    const contas = createStandardChartOfAccounts('tenant-01');
    const engine = new DoubleEntryEngine(contas);

    // 1. Receita de R$ 100.000,00
    engine.postEntry('tenant-01', '2026-12-10', 'Venda a Vista', [
      { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos', type: 'DEBIT', amount: 100000.00 },
      { accountId: '3.1.1.01', accountCode: '3.1.1.01', accountName: 'Receita de Venda', type: 'CREDIT', amount: 100000.00 }
    ]);

    // 2. Despesas de CMV de R$ 40.000,00
    engine.postEntry('tenant-01', '2026-12-10', 'Reconhecimento CMV', [
      { accountId: '4.1.1.01', accountCode: '4.1.1.01', accountName: 'CMV', type: 'DEBIT', amount: 40000.00 },
      { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Estoques', type: 'CREDIT', amount: 40000.00 }
    ]);

    // Executa fechamento anual
    const closureRes = executeAnnualClosing(engine, 'tenant-01', '2026-12-31', '2.3.1.01', 'Capital e Reservas');
    const closure = unwrap(closureRes);

    expect(closure.totalReceitasZeradas).toBe(100000.00);
    expect(closure.totalDespesasCustosZerados).toBe(40000.00);
    expect(closure.resultadoLiquidoExercicio).toBe(60000.00); // Lucro de 60k

    // Verifica se as contas de resultado ficaram com saldo zero
    const contasPosFechamento = engine.getAccounts();
    const receitaAtual = contasPosFechamento.find(c => c.codigo === '3.1.1.01')!;
    const cmvAtual = contasPosFechamento.find(c => c.codigo === '4.1.1.01')!;

    expect(receitaAtual.saldoAtual).toBe(0.00);
    expect(cmvAtual.saldoAtual).toBe(0.00);
  });
});
