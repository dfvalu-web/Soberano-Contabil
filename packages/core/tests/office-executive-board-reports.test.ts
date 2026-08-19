import { describe, it, expect } from 'vitest';
import {
  processOfficeExecutiveBoardManagementReportsEngine,
  processOfficeBreakEvenMarginConsultingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Relatórios Gerenciais & Consultoria de Ponto de Equilíbrio', () => {
  it('1. Deve gerar DRE Gerencial com EBITDA e margens calculadas para diretoria', () => {
    const resReport = processOfficeExecutiveBoardManagementReportsEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Tecnologia em Sistemas Inteligentes Ltda',
      mesCompetencia: '2026-08',
      receitaBrutaBrl: 500000.00,
      deducoesTributosSobreVendasBrl: 50000.00, // 10%
      custoProdutosMercadoriasServicosBrl: 150000.00,
      despesasOperacionaisFixasBrl: 100000.00,
      despesasDepreciacaoAmortizacaoBrl: 20000.00,
      resultadoFinanceiroLiquidoBrl: 10000.00
    });

    const dataReport = unwrap(resReport);
    expect(dataReport.receitaLiquidaBrl).toBe(450000.00);
    expect(dataReport.lucroBrutoBrl).toBe(300000.00); // 450k - 150k
    expect(dataReport.margemBrutaPercent).toBeCloseTo(66.7, 1);
    expect(dataReport.ebitdaOperacionalBrl).toBe(200000.00); // 300k - 100k
    expect(dataReport.margemEbitdaPercent).toBeCloseTo(44.4, 1);
    expect(dataReport.lucroLiquidoMesBrl).toBe(190000.00); // 200k - 20k + 10k
    expect(dataReport.cargaTributariaEfetivaPercent).toBe(10.0);
    expect(dataReport.statusRelatorio).toBe('RELATORIO_DIRETORIA_GERADO_COM_SUCESSO');
    expect(dataReport.diagnosticoDiretoria).toContain('Receita Líquida: R$ 450.000,00');
  });

  it('2. Deve calcular Ponto de Equilibrio (Break-Even), Margem de Contribuicao e seguranca operacional', () => {
    const resBreak = processOfficeBreakEvenMarginConsultingEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Comércio de Ferramentas e Ferragens Paulistana Ltda',
      faturamentoAtualBrl: 400000.00,
      custosVariaveisTotaisBrl: 240000.00, // Margem Contribuição = 160k (40%)
      custosDespesasFixasMensaisBrl: 100000.00 // Ponto de Equilíbrio = 100k / 0.40 = 250k
    });

    const dataBreak = unwrap(resBreak);
    expect(dataBreak.margemContribuicaoTotalBrl).toBe(160000.00);
    expect(dataBreak.indiceMargemContribuicaoPercent).toBe(40.0);
    expect(dataBreak.pontoEquilibrioContabilBrl).toBe(250000.00);
    expect(dataBreak.margemSegurancaOperacionalPercent).toBe(37.5); // (400k - 250k)/400k = 37.5%
    expect(dataBreak.situacaoOperacional).toBe('EMPRESA_SUPERAVITARIA_LUCRO');
    expect(dataBreak.statusConsultoria).toBe('CONSULTORIA_PONTO_EQUILIBRIO_CONCLUIDA');
    expect(dataBreak.diagnosticoConsultoria).toContain('Ponto de Equilíbrio');
  });
});
