import { describe, it, expect } from 'vitest';
import { calculateLucroPresumido } from '../src/tax/lucro-presumido/calculator.js';
import { calculateLucroReal } from '../src/tax/lucro-real/lalur.js';
import { unwrap } from '../src/types/result.js';

describe('Motor Tributário: Lucro Presumido', () => {
  it('deve calcular IRPJ com adicional de 10% quando a base presumida trimestral excede R$ 60.000', () => {
    // Serviços Gerais: 32% sobre R$ 300.000,00 = Base R$ 96.000,00
    // Excedente = 96.000 - 60.000 = 36.000,00
    // IRPJ 15% = 14.400,00 | Adicional 10% = 3.600,00 | Total IRPJ = 18.000,00
    // CSLL 9% sobre (300.000 * 32% = 96.000) = 8.640,00
    const res = calculateLucroPresumido({
      trimestre: 1,
      ano: 2026,
      receitaComercio: 0,
      receitaIndustria: 0,
      receitaServicosGerais: 300000.00,
      receitaServicosHospitalares: 0,
      receitaTransportes: 0,
      outrasReceitas: 0,
      retencoesFonteSofridas: { irrf: 4500.00, csrf: 0, csll: 0, inss: 0, iss: 0 }
    });

    const data = unwrap(res);
    expect(data.basePresumidaIrpj).toBe(96000.00);
    expect(data.irpjBase15).toBe(14400.00);
    expect(data.adicionalIrpj10).toBe(3600.00);
    expect(data.irpjTotalDevido).toBe(18000.00);
    expect(data.irpjAPagar).toBe(13500.00); // 18.000 - 4.500 retido
    expect(data.csllTotalDevida).toBe(8640.00);
    expect(data.pisCumulativoMensal).toBe(1950.00); // 300.000 * 0.65%
    expect(data.cofinsCumulativoMensal).toBe(9000.00); // 300.000 * 3.00%
  });
});

describe('Motor Tributário: Lucro Real e Lalur/Lacs', () => {
  it('deve aplicar a trava de 30% na compensação de prejuízo fiscal da Parte B do Lalur', () => {
    // Lucro Líquido = 200.000 + Adições 50.000 - Exclusões 10.000 = Lucro Real antes comp: 240.000,00
    // Saldo Prejuízo Parte B = 100.000,00
    // Limite 30% = 240.000 * 30% = 72.000,00
    // Lucro Real Tributável = 240.000 - 72.000 = 168.000,00
    // Saldo Remanescente Parte B = 100.000 - 72.000 = 28.000,00
    const res = calculateLucroReal({
      periodo: '2026-Q1',
      lucroLiquidoAntesIrpjCsll: 200000.00,
      adicoesParteA: [{ descricao: 'Multas punitivas indedutíveis', valor: 50000.00 }],
      exclusoesParteA: [{ descricao: 'Receita de equivalência patrimonial', valor: 10000.00 }],
      saldoPrejuizoFiscalAnteriorParteB: 100000.00,
      saldoBaseNegativaCsllAnteriorParteB: 100000.00,
      receitaBrutaNaoCumulativaPisCofins: 500000.00,
      creditosInsumosEnergiaDepreciacao: 200000.00,
      retencoesFonteCompensaveis: { irrf: 0, csll: 0, pis: 0, cofins: 0 }
    });

    const data = unwrap(res);
    expect(data.lucroRealAntesCompensacao).toBe(240000.00);
    expect(data.compensacaoPrejuizoFiscal30Percent).toBe(72000.00);
    expect(data.saldoPrejuizoFiscalRemanescenteParteB).toBe(28000.00);
    expect(data.lucroRealFinalTributavel).toBe(168000.00);
    expect(data.pisAPagar).toBeCloseTo(4950.00, 1); // (500k * 1.65%) - (200k * 1.65%) = 8250 - 3300 = 4950
    expect(data.cofinsAPagar).toBeCloseTo(22800.00, 1); // (500k * 7.60%) - (200k * 7.60%) = 38000 - 15200 = 22800
  });
});
