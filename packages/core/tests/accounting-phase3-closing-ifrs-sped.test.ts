import { describe, it, expect } from 'vitest';
import { areClosingEngine } from '../src/accounting/closing/are-closing-engine';
import { fullIfrsStatementsEngine } from '../src/accounting/statements/full-ifrs-statements-engine';
import { spedEcdGenerator } from '../src/accounting/reports/sped-ecd-generator';

describe('Módulo Contábil — Fase 3: Fechamento ARE, Demonstrações IFRS & SPED ECD', () => {

  describe('1. Fechamento ARE (Apuração do Resultado do Exercício)', () => {
    it('deve apurar o resultado líquido e constituir a Reserva Legal de 5% (Art. 193 Lei 6.404/76)', () => {
      const closing = areClosingEngine.executeAreClosing({
        tenantId: 't1',
        competencia: '2026-08'
      });

      expect(closing.status).toBe('SUCESSO');
      expect(closing.totalReceitas).toBeGreaterThanOrEqual(0);
      if (closing.isLucro) {
        expect(closing.reservaLegalAmount).toBeCloseTo(closing.resultadoLiquido * 0.05, 1);
        expect(closing.lucroDisponivelDividendos).toBeCloseTo(closing.resultadoLiquido * 0.95, 1);
      }
    });
  });

  describe('2. Demonstrações Contábeis IFRS / CPC Completas', () => {
    it('deve gerar Balanço Patrimonial, DRE, DFC, DMPL, DVA e Notas Explicativas', () => {
      const stmts = fullIfrsStatementsEngine.generateFullStatements('t1', '2026');

      expect(stmts.balancoPatrimonial.totalAtivo).toBeGreaterThan(0);
      expect(stmts.dre.receitaBruta).toBeGreaterThanOrEqual(0);
      expect(stmts.dfc.saldoFinalCaixa).toBeGreaterThan(0);
      expect(stmts.dmpl.capitalSocial).toBe(500000);
      expect(stmts.dva.valorAdicionadoTotalDistribuir).toBeGreaterThanOrEqual(0);
      expect(stmts.notasExplicativas.nota1ContextoOperacional).toContain('regularidade contábil');
      expect(stmts.notasExplicativas.nota2BaseElaboracaoIFRS).toContain('NBC TG');
    });
  });

  describe('3. Gerador e Pré-Validador do SPED ECD', () => {
    it('deve gerar arquivo .txt formatado para o PVA do SPED ECD com Blocos 0, I, J e 9', () => {
      const res = spedEcdGenerator.generateSpedEcdFile({
        tenantId: 't1',
        companyName: 'Soberano Tech S/A',
        cnpj: '12.345.678/0001-90',
        uf: 'SP',
        ie: '123456789110',
        codMunicipio: '3550308',
        startDate: '20260101',
        endDate: '20261231',
        contadorNome: 'David Contador Master',
        contadorCrc: 'SP-123456/O-0',
        contadorCpf: '123.456.789-00'
      });

      expect(res.isValid).toBe(true);
      expect(res.errors.length).toBe(0);
      expect(res.totalRecords).toBeGreaterThan(15);
      expect(res.fileContent).toContain('|0000|LECD|20260101|20261231|SOBERANO TECH S/A|12345678000190|SP|');
      expect(res.fileContent).toContain('|I050|');
      expect(res.fileContent).toContain('|I200|');
      expect(res.fileContent).toContain('|J100|');
      expect(res.fileContent).toContain('|9999|');
    });

    it('deve acusar erro caso CNPJ ou CRC do contador não sejam informados', () => {
      const res = spedEcdGenerator.generateSpedEcdFile({
        tenantId: 't1',
        companyName: 'Empresa Incompleta',
        cnpj: '123',
        uf: 'SP',
        ie: '',
        codMunicipio: '',
        startDate: '20260101',
        endDate: '20261231',
        contadorNome: '',
        contadorCrc: '',
        contadorCpf: ''
      });

      expect(res.isValid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });
  });
});