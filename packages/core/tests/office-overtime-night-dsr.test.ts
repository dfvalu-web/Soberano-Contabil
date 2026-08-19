import { describe, it, expect } from 'vitest';
import {
  processOfficeOvertimeNightShiftAuditEngine,
  processOfficeDsrPayrollReflexEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Horas Extras, Adicional Noturno & DSR (Arts. 59/73 CLT e Lei 605/49)', () => {
  it('1. Deve apurar HE 50%, HE 100% e Adicional Noturno com reducao da hora ficta (52m30s)', () => {
    const resOver = processOfficeOvertimeNightShiftAuditEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Carlos Eduardo Santos',
      salarioBaseBrl: 3300.00, // Hora normal = 3300 / 220 = 15.00
      divisorMensalHoras: 220,
      horasExtras50Count: 10, // 10 * (15 * 1.5) = 225.00
      horasExtras100Count: 4,  // 4 * (15 * 2.0) = 120.00
      horasNoturnasRelogioCount: 14 // 14 * 1.142857 = 16h fictas -> 16 * (15 * 0.20) = 48.00
    });

    const dataOver = unwrap(resOver);
    expect(dataOver.valorHoraNormalBrl).toBe(15.00);
    expect(dataOver.valorTotalHe50Brl).toBe(225.00);
    expect(dataOver.valorTotalHe100Brl).toBe(120.00);
    expect(dataOver.horasNoturnasFictasConvertidasCount).toBe(16.00);
    expect(dataOver.valorTotalAdicionalNoturno20Brl).toBe(48.00);
    expect(dataOver.totalVariaveisTrabalhistasBrl).toBe(393.00); // 225 + 120 + 48
    expect(dataOver.statusApuracao).toBe('HORAS_EXTRAS_E_NOTURNO_APURADOS_COM_SUCESSO');
    expect(dataOver.diagnosticoVariaveis).toContain('HE 50%');
  });

  it('2. Deve apurar reflexo de DSR sobre variaveis e encargos patronais (INSS 20% e FGTS 8%)', () => {
    const resDsr = processOfficeDsrPayrollReflexEngine({
      funcionarioCpf: '123.456.789-00',
      nomeFuncionario: 'Carlos Eduardo Santos',
      totalVariaveisBrl: 393.00,
      diasUteisMes: 25,
      domingosEFeriadosMes: 5 // DSR = (393 / 25) * 5 = 78.60
    });

    const dataDsr = unwrap(resDsr);
    expect(dataDsr.valorDsrSobreVariaveisBrl).toBe(78.60);
    expect(dataDsr.baseTotalIncidenciaInssEFgtsBrl).toBe(471.60); // 393 + 78.60
    expect(dataDsr.valorInssPatronalDevidoBrl).toBe(94.32); // 20% de 471.60
    expect(dataDsr.valorFgtsDevidoBrl).toBe(37.73); // 8% de 471.60
    expect(dataDsr.rubricaEsocialDsr).toBe('1010_DSR_SOBRE_VARIAVEIS');
    expect(dataDsr.eventoEsocial).toBe('S-1200');
    expect(dataDsr.statusDsr).toBe('DSR_E_ENCARGOS_CALCULADOS_COM_SUCESSO');
    expect(dataDsr.diagnosticoDsr).toContain('Rubrica 1010');
  });
});
