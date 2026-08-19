import { describe, it, expect } from 'vitest';
import {
  processOfficeFatorROptimizerEngine,
  processOfficeOptimalProlaboreDividendsEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Pró-Labore Ótimo, Fator R & Lucros Isentos', () => {
  it('1. Deve calcular Fator R, identificar Anexo V e sugerir ajuste de pro-labore para enquadrar no Anexo III', () => {
    const resFator = processOfficeFatorROptimizerEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Tech Solutions Consultoria em TI Ltda',
      receitaBrutaAcumulada12MesesBrl: 300000.00,
      faturamentoMesAtualBrl: 25000.00,
      folhaAtualAcumulada12MesesBrl: 60000.00 // 20% (< 28% -> Anexo V)
    });

    const dataFator = unwrap(resFator);
    expect(dataFator.fatorRAtualPercent).toBe(20.0);
    expect(dataFator.enquadramentoAtual).toBe('ANEXO_V_ALIQUOTA_MAJORADA');
    expect(dataFator.folhaIdealNecessaria12MesesBrl).toBe(84000.00); // 300k * 28%
    expect(dataFator.ajusteProLaboreMesAtualBrl).toBe(24000.00); // 84k - 60k
    expect(dataFator.economiaTributariaEstimadaMesBrl).toBe(2375.00); // 25k * 9.5%
    expect(dataFator.statusOtimizacao).toBe('FATOR_R_OTIMIZADO_ANEXO_III');
    expect(dataFator.diagnosticoFatorR).toContain('Fator R Atual = 20.00%');
  });

  it('2. Deve simular divisao de renda entre pro-labore com teto INSS e distribuicao de lucros isentos', () => {
    const resDiv = processOfficeOptimalProlaboreDividendsEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Clínica Médica Cardiologia Avançada S/S',
      regimeTributario: 'SIMPLES_NACIONAL',
      lucroLiquidoMensalDisponivelBrl: 50000.00,
      proLaboreSugeridoBrl: 8157.41 // Teto INSS 2026
    });

    const dataDiv = unwrap(resDiv);
    expect(dataDiv.valorProLaboreBrutoBrl).toBe(8157.41);
    expect(dataDiv.valorInssRetidoBrl).toBeCloseTo(897.32, 2); // 8157.41 * 11%
    expect(dataDiv.valorLucrosIsentosDistribuidosBrl).toBeCloseTo(41842.59, 2);
    expect(dataDiv.cargaEfetivaPercent).toBeLessThan(6.0); // Custo tributário total muito reduzido
    expect(dataDiv.statusPlanejamento).toBe('PLANEJAMENTO_PROLABORE_LUCROS_CONCLUIDO');
    expect(dataDiv.diagnosticoPlanejamento).toContain('Lucros Isentos');
  });
});
