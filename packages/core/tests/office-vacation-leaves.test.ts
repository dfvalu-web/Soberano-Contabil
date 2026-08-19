import { describe, it, expect } from 'vitest';
import {
  processOfficeVacationLeavesCalculatorEngine,
  processOfficeTimeTrackingOvertimeBankEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Férias, Ponto & Banco de Horas', () => {
  it('1. Deve calcular recibo de ferias com 1/3 constitucional e abono pecuniario de 10 dias', () => {
    const resVac = processOfficeVacationLeavesCalculatorEngine({
      cpf: '111.111.111-11',
      nome: 'Mariana Lima',
      salarioBaseBrl: 6000.00,
      dataInicioAquisitivo: '2025-08-01',
      dataFimAquisitivo: '2026-07-31',
      diasGozoFerias: 20,
      venderAbonoPecuniario10Dias: true,
      adiantamento13Salario: false,
      faltasInjustificadasNoPeriodoQtd: 0
    });

    const dataVac = unwrap(resVac);
    expect(dataVac.diasDireitoFerias).toBe(30);
    expect(dataVac.valorDiasGozoBrl).toBe(4000.00); // 200/dia * 20
    expect(dataVac.valorTercoConstitucionalBrl).toBeCloseTo(1333.33, 2);
    expect(dataVac.valorAbonoPecuniarioBrl).toBe(2000.00); // 10 dias
    expect(dataVac.valorTercoAbonoBrl).toBeCloseTo(666.67, 2);
    expect(dataVac.totalBrutoFeriasBrl).toBeCloseTo(8000.00, 2);
    expect(dataVac.totalLiquidoPagarFeriasBrl).toBeGreaterThan(6000.00);
    expect(dataVac.statusCalculo).toBe('RECIBO_DE_FERIAS_CALCULADO_ESOCIAL_S2230_PRONTO');
    expect(dataVac.diagnosticoFerias).toContain('Art. 145 CLT');
  });

  it('2. Deve fechar espelho de ponto apurando HE 50/100, adicional noturno e DSR conforme Portaria 671 MTE', () => {
    const resTime = processOfficeTimeTrackingOvertimeBankEngine({
      cpf: '222.222.222-22',
      nome: 'Rafael Operador',
      salarioHoraBrl: 20.00,
      horasNormaisTrabalhadasMes: 220,
      horasExtras50Qtd: 10, // 10h * 30 = 300
      horasExtras100Qtd: 5, // 5h * 40 = 200
      horasNoturnasQtd: 20, // 20h * 4 = 80
      horasBancoCreditoQtd: 15,
      horasBancoDebitoQtd: 5 // Saldo banco = +10h
    });

    const dataTime = unwrap(resTime);
    expect(dataTime.valorTotalHorasExtras50Brl).toBe(300.00);
    expect(dataTime.valorTotalHorasExtras100Brl).toBe(200.00);
    expect(dataTime.valorAdicionalNoturnoBrl).toBe(80.00);
    expect(dataTime.valorDsrSobreVariaveisBrl).toBeCloseTo(96.67, 2); // 580 / 6
    expect(dataTime.saldoFinalBancoHorasQtd).toBe(10.00);
    expect(dataTime.statusPonto).toBe('ESPELHO_DE_PONTO_FECHADO_CONFORME_PORTARIA_671_MTE');
    expect(dataTime.diagnosticoPonto).toContain('Portaria 671 MTE');
  });
});
