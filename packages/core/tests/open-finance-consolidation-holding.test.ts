import { describe, it, expect } from 'vitest';
import {
  processOpenFinanceTransaction,
  consolidateFinancialStatements,
  runHoldingSimulation,
  unwrap
} from '../src/index.js';

describe('TESTES: Open Finance, Consolidação Contábil CPC 36 & Holding Patrimonial', () => {
  it('1. Deve conciliar transacao Open Finance PIX Recebido e gerar partidas dobradas', () => {
    const res = processOpenFinanceTransaction({
      id: 'TX-PIX-901',
      banco: '341 - Itaú Unibanco',
      dataTransacao: '2026-01-20',
      tipo: 'PIX_RECEBIDO',
      valor: 45000.00,
      documentoCpfCnpjContraparte: '98765432000188',
      nomeContraparte: 'CLIENTE VIP LTDA',
      descricaoOriginal: 'PIX RECEBIDO NF 456'
    });

    const data = unwrap(res);
    expect(data.statusConciliacao).toBe('CONCILIADO_AUTOMATICO');
    expect(data.scoreConfiancaPercent).toBeGreaterThanOrEqual(95);
    expect(data.partidasDobradaSugeridas.length).toBe(2);
    expect(data.partidasDobradaSugeridas[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaSugeridas[1]!.type).toBe('CREDIT');
  });

  it('2. Deve consolidar demonstracoes financeiras Matriz e Filiais eliminando partidas intercompany CPC 36', () => {
    const mockMatriz = {
      balanceSheet: {
        periodo: '2026-01',
        ativoCirculante: [],
        ativoNaoCirculante: [],
        totalAtivo: 1000000.00,
        passivoCirculante: [],
        passivoNaoCirculante: [],
        totalPassivo: 300000.00,
        patrimonioLiquido: [],
        totalPatrimonioLiquido: 700000.00,
        totalPassivoEPatrimonioLiquido: 1000000.00,
        isEquilibrado: true
      },
      incomeStatement: {
        periodo: '2026-01',
        linhas: [
          { codigo: '3', descricao: 'Receita Líquida', valorPeriodoAtual: 400000.00, isDestaque: true },
          { codigo: '8', descricao: 'Lucro Líquido', valorPeriodoAtual: 80000.00, isDestaque: true }
        ],
        lucroLiquidoExercicio: 80000.00
      }
    };

    const mockFilial = {
      balanceSheet: {
        periodo: '2026-01',
        ativoCirculante: [],
        ativoNaoCirculante: [],
        totalAtivo: 500000.00,
        passivoCirculante: [],
        passivoNaoCirculante: [],
        totalPassivo: 200000.00,
        patrimonioLiquido: [],
        totalPatrimonioLiquido: 300000.00,
        totalPassivoEPatrimonioLiquido: 500000.00,
        isEquilibrado: true
      },
      incomeStatement: {
        periodo: '2026-01',
        linhas: [
          { codigo: '3', descricao: 'Receita Líquida', valorPeriodoAtual: 200000.00, isDestaque: true },
          { codigo: '8', descricao: 'Lucro Líquido', valorPeriodoAtual: 40000.00, isDestaque: true }
        ],
        lucroLiquidoExercicio: 40000.00
      }
    };

    const res = consolidateFinancialStatements(mockMatriz, [mockFilial], [
      {
        descricao: 'Eliminação de mútuo financeiro intercompany Matriz x Filial',
        contaDebito: '2.1.3.01',
        contaCredito: '1.1.2.05',
        valor: 100000.00
      }
    ]);

    const data = unwrap(res);
    expect(data.totalAtivoConsolidado).toBe(1400000.00); // 1.000.000 + 500.000 - 100.000
    expect(data.totalPassivoConsolidado).toBe(400000.00); // 300.000 + 200.000 - 100.000
    expect(data.receitaLiquidaConsolidada).toBe(600000.00);
    expect(data.lucroLiquidoConsolidado).toBe(120000.00);
    expect(data.isEquilibrado).toBe(true);
  });

  it('3. Deve calcular planejamento tributario e sucessorio em Holding Patrimonial', () => {
    const res = runHoldingSimulation({
      receitaAlugueisMensal: 50000.00,
      valorTotalImoveisMercado: 10000000.00,
      valorTotalImoveisCustoDeclaradoIR: 3000000.00,
      ufLocalizacaoImoveis: 'SP',
      aliquotaItcmdEstadualPercent: 4,
      previsaoVendaImoveisAno: 0
    });

    const data = unwrap(res);
    expect(data.tributacaoPessoaFisica.irpfAnualTotal).toBeGreaterThan(data.tributacaoHoldingPresumido.tributacaoAnualTotalPj);
    expect(data.economiaAnualAlugueis).toBeGreaterThan(0);
    expect(data.economiaPercentual).toBeGreaterThan(50); // Redução típica > 50%
    expect(data.planejamentoSucessorio.economiaPlanejamentoSucessorio).toBeGreaterThan(0);
    expect(data.planejamentoSucessorio.isImunidadeItbiIntegralizacaoAplicavel).toBe(true);
  });
});
