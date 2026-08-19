import { describe, it, expect } from 'vitest';
import {
  processOfficeStrategicAdvisoryValuationEngine,
  processOfficeSectorBenchmarkingDupontEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Consultoria Estratégica, Benchmarking & Valuation', () => {
  it('1. Deve calcular valuation de equity via Multiplos de EBITDA e Fluxo de Caixa Descontado (FCD)', () => {
    const resVal = processOfficeStrategicAdvisoryValuationEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Clínicas Médicas & Diagnóstico Vida S/A',
      setorAtuacao: 'SERVICOS_SAUDE', // 8.5x EV/EBITDA
      ebitdaUltimos12MesesBrl: 2000000.00, // EV Multiplos = 17M
      dividaLiquidaBrl: 2000000.00, // Equity Multiplos = 15M
      fluxoCaixaLivreProjetadoAno1Brl: 1500000.00,
      taxaWaccPercent: 13.5,
      taxaCrescimentoPerpetuoPercent: 3.5 // spread = 10% -> EV FCD = 15M -> Equity FCD = 13M
    });

    const dataVal = unwrap(resVal);
    expect(dataVal.multiploEvEbitdaSetor).toBe(8.5);
    expect(dataVal.enterpriseValueMultiplosBrl).toBe(17000000.00);
    expect(dataVal.equityValueMultiplosBrl).toBe(15000000.00);
    expect(dataVal.equityValueFcdBrl).toBe(13000000.00);
    expect(dataVal.valuationSugeridoMedioBrl).toBe(14000000.00); // (15M + 13M) / 2
    expect(dataVal.statusValuation).toBe('VALUATION_ESTRATEGICO_CONCLUIDO_COM_SUCESSO');
    expect(dataVal.diagnosticoValuation).toContain('Valor de Mercado Médio do Equity');
  });

  it('2. Deve decompor ROE via DuPont e comparar com media de mercado setorial', () => {
    const resDup = processOfficeSectorBenchmarkingDupontEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Química Inovadora S/A',
      receitaLiquidaAnualBrl: 10000000.00,
      lucroLiquidoAnualBrl: 1500000.00, // Margem = 15%
      ativoTotalBrl: 8000000.00, // Giro = 1.25x
      patrimonioLiquidoBrl: 5000000.00, // Alavancagem = 1.6x -> ROE = 15% * 1.25 * 1.6 = 30%
      roeMedioSetorPercent: 18.0
    });

    const dataDup = unwrap(resDup);
    expect(dataDup.margemLiquidaPercent).toBe(15.0);
    expect(dataDup.giroDoAtivoVezes).toBe(1.25);
    expect(dataDup.alavancagemFinanceiraVezes).toBe(1.6);
    expect(dataDup.roeCalculadoPercent).toBe(30.0);
    expect(dataDup.desempenhoVsBenchmarking).toBe('DESEMPENHO_SUPERIOR_BENCHMARK');
    expect(dataDup.statusAnalise).toBe('ANALISE_DUPONT_BENCHMARKING_CONCLUIDA');
    expect(dataDup.diagnosticoDupont).toContain('DESEMPENHO_SUPERIOR_BENCHMARK');
  });
});
