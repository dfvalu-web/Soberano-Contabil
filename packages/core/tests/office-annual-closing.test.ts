import { describe, it, expect } from 'vitest';
import {
  processOfficeAnnualAccountingClosingEngine,
  processOfficeFinancialStatementsDisclosureNotesEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Fechamento Contábil Anual, Demonstrações & Notas Explicativas', () => {
  it('1. Deve apurar o resultado anual (ARE), constituir Reserva Legal (5%) e destinar dividendos', () => {
    const resClosing = processOfficeAnnualAccountingClosingEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria Metalúrgica Soberana S/A',
      anoExercicio: 2026,
      capitalSocialIntegralizadoBrl: 1000000.00, // Teto 20% = 200k
      saldoReservaLegalAnteriorBrl: 180000.00, // Espaço restante = 20k
      totalReceitasExercicioBrl: 5000000.00,
      totalDespesasCustosExercicioBrl: 4000000.00, // Lucro = 1.000.000
      percentualDividendosDistribuidosPercent: 50.0 // 50%
    });

    const dataClosing = unwrap(resClosing);
    expect(dataClosing.lucroLiquidoExercicioBrl).toBe(1000000.00);
    // 5% de 1M seria 50k, mas como só tem 20k de espaço para o teto de 20%, limita a 20k
    expect(dataClosing.constituicaoReservaLegal5Brl).toBe(20000.00);
    expect(dataClosing.totalDividendosDistribuidosBrl).toBe(490000.00); // (1M - 20k) * 50%
    expect(dataClosing.saldoRetencaoLucrosInvestimentosBrl).toBe(490000.00);
    expect(dataClosing.statusFechamento).toBe('EXERCICIO_CONTABIL_ENCERRADO_COM_SUCESSO');
    expect(dataClosing.diagnosticoFechamento).toContain('Partidas de encerramento geradas');
  });

  it('2. Deve emitir as 5 demonstracoes contabeis e compilar 12 notas explicativas CPC 26', () => {
    const resDisclosure = processOfficeFinancialStatementsDisclosureNotesEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Holding Empresarial Progresso Ltda',
      anoExercicio: 2026,
      totalAtivoBrl: 10000000.00,
      totalPassivoPatrimonioLiquidoBrl: 10000000.00,
      contadorResponsavelNome: 'Dr. Roberto Santos',
      contadorRegistroCrc: 'CRC-SP 123456/O-0'
    });

    const dataDisclosure = unwrap(resDisclosure);
    expect(dataDisclosure.demonstracoesGeradas.length).toBe(5);
    expect(dataDisclosure.totalNotasExplicativasCompiladas).toBe(12);
    expect(dataDisclosure.termosLivroDiarioProntos).toBe(true);
    expect(dataDisclosure.statusDivulgacao).toBe('DEMONSTRACOES_E_NOTAS_EXPLICATIVAS_EMITIDAS_CPC26');
    expect(dataDisclosure.diagnosticoDivulgacao).toContain('5 Demonstrações integradas');
  });
});
