import { describe, it, expect } from 'vitest';
import {
  processOfficePayrollProvisionsCpc33Engine,
  processOfficeDigitalContractTerminationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Provisões de Folha (CPC 33) & Rescisões Digitais', () => {
  it('1. Deve calcular provisao mensal de 13o salario, ferias + 1/3 e encargos patronais conforme CPC 33', () => {
    const resProv = processOfficePayrollProvisionsCpc33Engine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Logística Sudeste Ltda',
      mesCompetencia: '2026-08',
      aliquotaInssPatronalPercent: 20.0,
      aliquotaRatFapPercent: 2.0,
      aliquotaTerceirosPercent: 5.8,
      aliquotaFgtsPercent: 8.0,
      colaboradores: [
        {
          cpf: '111.111.111-11',
          nome: 'Carlos Gerente',
          salarioBaseMaisMediasBrl: 12000.00,
          mesesTrabalhadosAnoCorrente: 8,
          mesesPeriodoAquisitivoFerias: 8
        }
      ]
    });

    const dataProv = unwrap(resProv);
    expect(dataProv.totalProvisao13SalarioMesBrl).toBe(1000.00); // 12000 / 12
    expect(dataProv.totalProvisaoFeriasTercoMesBrl).toBeCloseTo(1333.33, 2); // 1000 * 1.333333
    expect(dataProv.totalEncargosPatronaisProvisoesBrl).toBeCloseTo(835.33, 2); // 2333.33 * 35.8%
    expect(dataProv.totalProvisoesMensalBrl).toBeCloseTo(3168.66, 1);
    expect(dataProv.lancamentosContabeisProvisao.length).toBe(3);
    expect(dataProv.statusProvisao).toBe('PROVISOES_DE_FOLHA_APURADAS_CPC33_LANCADAS');
    expect(dataProv.diagnosticoProvisao).toContain('CPC 33');
  });

  it('2. Deve calcular rescisao contratual com aviso previo proporcional Lei 12.506 e multa 40% FGTS Digital', () => {
    const resTerm = processOfficeDigitalContractTerminationEngine({
      cpfColaborador: '222.222.222-22',
      nomeColaborador: 'Ana Assistente',
      salarioBaseBrl: 3000.00,
      tipoRescisao: 'DISPENSA_SEM_JUSTA_CAUSA',
      anosTrabalhadosCompletos: 3, // 30 + 9 = 39 dias aviso
      diasSaldoSalarioMesRescisao: 10,
      meses13Proporcional: 8,
      mesesFeriasProporcionais: 8,
      saldoFgtsParaFinsRescisoriosBrl: 10000.00
    });

    const dataTerm = unwrap(resTerm);
    expect(dataTerm.diasAvisoPrevioLei12506).toBe(39);
    expect(dataTerm.valorAvisoPrevioIndenizadoBrl).toBe(3900.00); // 100/dia * 39
    expect(dataTerm.valorSaldoSalarioBrl).toBe(1000.00); // 100/dia * 10
    expect(dataTerm.valor13ProporcionalBrl).toBe(2000.00); // (3000/12) * 8
    expect(dataTerm.valorFeriasProporcionaisTercoBrl).toBeCloseTo(2666.67, 2);
    expect(dataTerm.multaRescisoriaFgts40Brl).toBe(4000.00); // 40% de 10k
    expect(dataTerm.prazoPagamentoLimiteDias).toBe(10);
    expect(dataTerm.statusRescisao).toBe('TRCT_CALCULADO_FGTS_DIGITAL_GERADO');
    expect(dataTerm.diagnosticoRescisao).toContain('Lei 12.506');
  });
});
