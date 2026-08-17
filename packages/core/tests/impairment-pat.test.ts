import { describe, it, expect } from 'vitest';
import {
  performImpairmentTest,
  calculatePatTaxIncentive,
  unwrap
} from '../src/index.js';

describe('TESTES: Teste de Impairment (CPC 01 R1) & Incentivo Fiscal PAT', () => {
  it('1. Deve realizar Teste de Recuperabilidade (Impairment CPC 01) e reconhecer perda', () => {
    const res = performImpairmentTest({
      ativoOuUgcId: 'UGC-FABRICA-01',
      descricaoAtivo: 'Linha de Montagem Robótica',
      custoAquisicaoOriginal: 1000000.00,
      depreciacaoAcumulada: 300000.00, // VCL = 700.000,00
      valorJustoLiquidoDespesasVenda: 500000.00,
      fluxosCaixaFuturosEstimadosDescontados: 550000.00 // Valor em Uso (Recuperável = 550k)
    });

    const data = unwrap(res);
    expect(data.valorContabilLiquidoVcl).toBe(700000.00);
    expect(data.valorRecuperavel).toBe(550000.00);
    expect(data.houveDesvalorizacaoImpairment).toBe(true);
    expect(data.valorPerdaImpairment).toBe(150000.00); // 700k - 550k
    expect(data.novoValorContabilAposTeste).toBe(550000.00);
    expect(data.partidasDobradaImpairment.length).toBe(2);
    expect(data.partidasDobradaImpairment[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaImpairment[1]!.type).toBe('CREDIT');
  });

  it('2. Deve nao reconhecer perda de impairment quando valor recuperavel for superior ao VCL', () => {
    const res = performImpairmentTest({
      ativoOuUgcId: 'PREDIO-SEDE-01',
      descricaoAtivo: 'Edifício Sede Corporativa',
      custoAquisicaoOriginal: 2000000.00,
      depreciacaoAcumulada: 200000.00, // VCL = 1.800.000,00
      valorJustoLiquidoDespesasVenda: 2500000.00, // Recuperável = 2.500.000,00
      fluxosCaixaFuturosEstimadosDescontados: 2200000.00
    });

    const data = unwrap(res);
    expect(data.houveDesvalorizacaoImpairment).toBe(false);
    expect(data.valorPerdaImpairment).toBe(0);
    expect(data.novoValorContabilAposTeste).toBe(1800000.00);
    expect(data.partidasDobradaImpairment.length).toBe(0);
  });

  it('3. Deve calcular incentivo fiscal do PAT (Decreto 10.854/2021) com trava legal de 4% do IRPJ', () => {
    const res = calculatePatTaxIncentive({
      anoCalendario: 2026,
      totalDespesasAlimentacaoTrabalhadoresAte5Sm: 100000.00, // 15% = 15.000,00
      irpjDevidoApuradoAliquota15: 200000.00 // Trava 4% = 8.000,00
    });

    const data = unwrap(res);
    expect(data.despesasAlimentacaoElegiveis).toBe(100000.00);
    expect(data.incentivoPatCalculado15Percent).toBe(15000.00);
    expect(data.limiteMaximoDeducaoIrpj4Percent).toBe(8000.00);
    expect(data.deducaoEfetivaIrpjNoExercicio).toBe(8000.00);
    expect(data.excessoIncentivoACompensarProximosAnos).toBe(7000.00); // 15k - 8k
    expect(data.irpjLiquidoAPagar).toBe(192000.00); // 200k - 8k
  });
});
