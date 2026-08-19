import { describe, it, expect } from 'vitest';
import { trialBalanceEngine } from '../src/accounting/reports/trial-balance-engine';
import { officialBooksEngine } from '../src/accounting/reports/official-books-engine';

describe('Módulo Contábil — Fase 2: Balancete de 8 Colunas & Livros Oficiais', () => {

  describe('1. Balancete de Verificação de 8 Colunas', () => {
    it('deve gerar o balancete consolidado com equilíbrio perfeito entre Débitos e Créditos', () => {
      const report = trialBalanceEngine.generateTrialBalance('t1');
      expect(report.rows.length).toBeGreaterThan(0);
      expect(report.isBalanced).toBe(true);
      expect(report.totalPeriodDebit).toBe(report.totalPeriodCredit);
    });

    it('deve agregar os valores dos níveis analíticos para os grupos sintéticos de Nível 1 e 2', () => {
      const report = trialBalanceEngine.generateTrialBalance('t1');
      const rowAtivoTotal = report.rows.find(r => r.code === '1');
      const rowAtivoCirculante = report.rows.find(r => r.code === '1.1');

      expect(rowAtivoTotal).toBeDefined();
      expect(rowAtivoCirculante).toBeDefined();
      expect(rowAtivoTotal!.periodDebit).toBeGreaterThanOrEqual(rowAtivoCirculante!.periodDebit);
    });
  });

  describe('2. Livro Razão Analítico', () => {
    it('deve extrair a ficha analítica com cálculo de saldo progressivo', () => {
      const card = officialBooksEngine.generateLedgerCard('t1', '1.1.1.02');
      expect(card).not.toBeNull();
      expect(card?.accountCode).toBe('1.1.1.02');
      expect(card?.lines.length).toBeGreaterThanOrEqual(1);
      expect(card?.finalBalance).toBeGreaterThan(0);
    });
  });

  describe('3. Livro Diário Geral & Termos Legais DREI', () => {
    it('deve gerar Termo de Abertura e Termo de Encerramento com CRC e dados oficiais', () => {
      const book = officialBooksEngine.generateOfficialJournalBook({
        tenantId: 't1',
        empresaNome: 'Soberano Tech S/A',
        cnpj: '12.345.678/0001-90',
        nire: '35.901.234.567',
        contadorNome: 'David Contador Master',
        contadorCrc: 'CRC-SP 123456/O-0',
        anoExercicio: 2026
      });

      expect(book.terms.termoAbertura).toContain('TERMO DE ABERTURA');
      expect(book.terms.termoAbertura).toContain('Soberano Tech S/A');
      expect(book.terms.termoEncerramento).toContain('TERMO DE ENCERRAMENTO');
      expect(book.terms.termoEncerramento).toContain('CRC-SP 123456/O-0');
      expect(book.isBalanced).toBe(true);
    });
  });
});