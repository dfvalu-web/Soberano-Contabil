import { describe, it, expect } from 'vitest';
import {
  processOfficeJobTenureStabilityInssEngine,
  processOfficeLaborReinstatementIndemnityEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Estabilidade Provisória & Benefícios Previdenciários INSS', () => {
  it('1. Deve bloquear demissao de empregado em periodo estabilitario acidentario B91', () => {
    const resStab = processOfficeJobTenureStabilityInssEngine({
      empregadoCpf: '123.456.789-00',
      empregadoNome: 'Carlos Eduardo Nogueira',
      tipoEstabilidade: 'ACIDENTARIA_INSS_B91',
      dataInicioEstabilidade: '2026-01-10',
      dataTerminoEstabilidade: '2027-01-09',
      tentativaDemissaoData: '2026-08-15'
    });

    const dataStab = unwrap(resStab);
    expect(dataStab.estaEmPeriodoEstabilitario).toBe(true);
    expect(dataStab.bloqueioDemissaoSemJustaCausa).toBe(true);
    expect(dataStab.diasRestantesEstabilidade).toBeGreaterThan(140);
    expect(dataStab.statusEstabilidade).toBe('ESTABILIDADE_PROVISORIA_ATIVA_BLOQUEIO_DEMISSAO');
    expect(dataStab.diagnosticoEstabilidade).toContain('BLOQUEADA');
  });

  it('2. Deve calcular indenizacao substitutiva de estabilidade com reflexos rescisorios', () => {
    const resInd = processOfficeLaborReinstatementIndemnityEngine({
      empregadoCpf: '987.654.321-99',
      empregadoNome: 'Mariana Silveira Dias',
      salarioBaseMensalBrl: 4000.00,
      mesesRestantesEstabilidade: 6,
      decisaoEmpresa: 'PAGAMENTO_INDENIZACAO_SUBSTITUTIVA'
    });

    const dataInd = unwrap(resInd);
    expect(dataInd.totalSalariosIndenizadosBrl).toBe(24000.00); // 4k * 6
    expect(dataInd.reflexo13SalarioBrl).toBe(2000.00); // (4k*6)/12 = 2k
    expect(dataInd.reflexoFeriasComTercoBrl).toBeCloseTo(2666.60, 1); // 2000 * 1.3333
    expect(dataInd.reflexoFgtsComMulta40Brl).toBe(2688.00); // (24k * 0.08) * 1.40
    expect(dataInd.totalPassivoIndenizatorioBrl).toBeGreaterThan(31000.00);
    expect(dataInd.statusProcessamento).toBe('INDENIZACAO_ESTABILITARIA_APURADA');
    expect(dataInd.diagnosticoIndenizacao).toContain('Indenização Estabilitária');
  });
});
