import { describe, it, expect } from 'vitest';
import { referentialChartService } from '../src/accounting/chart-of-accounts/referential-mapping';
import { generalJournalEngine } from '../src/accounting/ledger/general-journal-engine';
import { smartOfxReconciler } from '../src/accounting/reconciliation/smart-ofx-reconciler';

describe('Módulo Contábil — Fase 1: Plano de Contas, Diário ACID & Conciliação OFX', () => {

  describe('1. Plano de Contas Referencial & SPED ECD/ECF', () => {
    it('deve carregar todas as contas dos 5 grupos canônicos (Ativo, Passivo, PL, Custos/Despesas, Receitas)', () => {
      const accounts = referentialChartService.getAllAccounts();
      expect(accounts.length).toBeGreaterThanOrEqual(25);

      const types = new Set(accounts.map(a => a.type));
      expect(types.has('ATIVO')).toBe(true);
      expect(types.has('PASSIVO')).toBe(true);
      expect(types.has('PATRIMONIO_LIQUIDO')).toBe(true);
      expect(types.has('RECEITAS')).toBe(true);
      expect(types.has('DESPESAS')).toBe(true);
    });

    it('deve localizar contas por código reduzido e estruturado com mapeamento SPED RFB', () => {
      const contaBanco = referentialChartService.getAccountByCode('1.1.1.02');
      expect(contaBanco).toBeDefined();
      expect(contaBanco?.name).toContain('Bancos Conta Movimento');
      expect(contaBanco?.spedReferentialCode).toBe('1.01.01.02.01');
      expect(contaBanco?.isSynthetic).toBe(false);

      const contaReduzida = referentialChartService.getAccountByCode('102');
      expect(contaReduzida?.code).toBe('1.1.1.02');
    });

    it('deve realizar busca dinâmica no plano de contas', () => {
      const results = referentialChartService.searchAccounts('Simples Nacional');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].code).toBe('2.1.3.01');
    });
  });

  describe('2. Motor do Livro Diário Geral & Validação ACID de Partidas Dobradas', () => {
    it('deve permitir lançamentos balanceados de Partida Simples (1D / 1C)', () => {
      const res = generalJournalEngine.postEntry({
        tenantId: 't1',
        date: '2026-08-18',
        generalHistory: 'Compra de material de escritório à vista',
        lines: [
          { accountCode: '4.1.3.01', type: 'DEBITO', amount: 1500.00 },
          { accountCode: '1.1.1.02', type: 'CREDITO', amount: 1500.00 }
        ]
      });

      expect(res.success).toBe(true);
      expect(res.entry).toBeDefined();
      expect(res.entry?.isBalanced).toBe(true);
      expect(res.entry?.totalDebits).toBe(1500.00);
      expect(res.entry?.totalCredits).toBe(1500.00);
    });

    it('deve rejeitar com tolerância zero qualquer lançamento desbalanceado (D != C)', () => {
      const res = generalJournalEngine.postEntry({
        tenantId: 't1',
        date: '2026-08-18',
        generalHistory: 'Lançamento com erro de digitação de centavos',
        lines: [
          { accountCode: '4.1.3.01', type: 'DEBITO', amount: 1500.00 },
          { accountCode: '1.1.1.02', type: 'CREDITO', amount: 1499.50 }
        ]
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('Desbalanceamento de Partidas Dobradas');
    });

    it('deve rejeitar lançamentos em contas sintéticas de grupo', () => {
      const res = generalJournalEngine.postEntry({
        tenantId: 't1',
        date: '2026-08-18',
        generalHistory: 'Tentativa de lançamento no grupo sintético Ativo Circulante',
        lines: [
          { accountCode: '1.1', type: 'DEBITO', amount: 500.00 },
          { accountCode: '1.1.1.02', type: 'CREDITO', amount: 500.00 }
        ]
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('sintética de grupo e não aceita lançamentos');
    });
  });

  describe('3. Conciliação Bancária OFX com Autoclassificação IA', () => {
    it('deve autoclassificar corretamente despesas bancárias e tarifas', () => {
      const auto = smartOfxReconciler.autoClassifyTransaction('TARIFA PACOTE SERVICOS PJ', -75.00);
      expect(auto.accountCode).toBe('4.1.3.02');
      expect(auto.confidence).toBeGreaterThanOrEqual(0.95);
    });

    it('deve autoclassificar recebimentos de clientes via Pix', () => {
      const auto = smartOfxReconciler.autoClassifyTransaction('PIX TRANSF CLIENTE ALVORADA', 32000.00);
      expect(auto.accountCode).toBe('1.1.2.01');
      expect(auto.confidence).toBeGreaterThanOrEqual(0.90);
    });

    it('deve realizar a conciliação individual gerando a partida dobrada no Diário', () => {
      const res = smartOfxReconciler.reconcileTransaction('t1', 'tx-101');
      expect(res.success).toBe(true);
      expect(res.entry).toBeDefined();
      expect(res.entry?.documentType).toBe('OFX');

      const txs = smartOfxReconciler.getTransactions('t1');
      const tx101 = txs.find(t => t.id === 'tx-101');
      expect(tx101?.status).toBe('CONCILIADO');
    });

    it('deve executar a conciliação em lote 1-Click de todos os itens pendentes', () => {
      const batchRes = smartOfxReconciler.batchReconcileAll('t1');
      expect(batchRes.totalReconciled).toBeGreaterThanOrEqual(1);
    });
  });
});