import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxReformTransitionEngine,
  processOfficeTaxPlanningRegimeSimulatorEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Reforma Tributária (IBS/CBS) & Planejamento Tributário da Carteira', () => {
  it('1. Deve simular a transicao da reforma tributaria para 2026 (fase teste) e 2027 (extincao PIS/COFINS)', () => {
    const res2026 = processOfficeTaxReformTransitionEngine({
      clienteCnpj: '11.111.111/0001-11',
      anoSimulacao: 2026,
      faturamentoMensalBrl: 100000.00,
      totalComprasInsumosBrl: 30000.00,
      setorAtividade: 'SERVICOS'
    });

    const data2026 = unwrap(res2026);
    expect(data2026.anoSimulacao).toBe(2026);
    expect(data2026.aliquotaCbsPercent).toBe(0.9);
    expect(data2026.aliquotaIbsPercent).toBe(0.1);
    expect(data2026.valorEstimadoCbsBrl).toBe(630.00); // 70k * 0.9%
    expect(data2026.valorEstimadoIbsBrl).toBe(70.00);  // 70k * 0.1%
    expect(data2026.statusTransicao).toBe('TRANSICAO_REFORMA_TRIBUTARIA_SIMULADA_COM_SUCESSO');
    expect(data2026.diagnosticoTransicao).toContain('Fase de Teste Operacional');

    const res2027 = processOfficeTaxReformTransitionEngine({
      clienteCnpj: '11.111.111/0001-11',
      anoSimulacao: 2027,
      faturamentoMensalBrl: 100000.00,
      totalComprasInsumosBrl: 30000.00,
      setorAtividade: 'SERVICOS'
    });

    const data2027 = unwrap(res2027);
    expect(data2027.aliquotaCbsPercent).toBe(8.8);
    expect(data2027.valorEstimadoCbsBrl).toBe(6160.00); // 70k * 8.8%
    expect(data2027.diagnosticoTransicao).toContain('Extinção de PIS/COFINS');
  });

  it('2. Deve comparar a carga tributaria entre Simples, Presumido e Real e recomendar a melhor opcao', () => {
    const resPlan = processOfficeTaxPlanningRegimeSimulatorEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Tech Solutions Consultoria em TI Ltda',
      faturamentoAnualBrl: 1200000.00,
      comprasInsumosAnualBrl: 200000.00,
      folhaPagamentoAnualBrl: 300000.00,
      margemLucroEstimadaPercent: 15.0
    });

    const dataPlan = unwrap(resPlan);
    expect(dataPlan.cargaEstimadaSimplesBrl).toBe(132000.00); // 1.2M * 11%
    expect(dataPlan.cargaEstimadaPresumidoBrl).toBe(195960.00); // 1.2M * 16.33%
    expect(dataPlan.cargaEstimadaRealBrl).toBe(213700.00); // (180k * 34%) + (1M * 9.25%) + (1.2M * 5%) = 61.2k + 92.5k + 60k
    expect(dataPlan.regimeMaisEconomico).toBe('SIMPLES_NACIONAL');
    expect(dataPlan.economiaAnualEstimadaBrl).toBe(63960.00); // 195.96k - 132k
    expect(dataPlan.statusPlanejamento).toBe('PLANEJAMENTO_TRIBUTARIO_CONCLUIDO_COM_RECOMENDACAO');
    expect(dataPlan.diagnosticoPlanejamento).toContain('Regime mais economico -> SIMPLES_NACIONAL');
  });
});
