import { describe, it, expect } from 'vitest';
import {
  processOfficePayrollEsocialCrossAuditEngine,
  processOfficeLaborLiabilitiesPreventionEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Auditoria de Folha, Malha Fina eSocial, DCTFWeb & FGTS Digital', () => {
  it('1. Deve conciliar remuneracoes eSocial S-1200/S-1210 com apuracao da DCTFWeb e FGTS Digital', () => {
    const resPayroll = processOfficePayrollEsocialCrossAuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Hospital & Maternidade São Lucas S/A',
      mesCompetencia: '2026-08',
      folhaFuncionarios: [
        {
          funcionarioCpf: '111.222.333-44',
          nome: 'Ana Paula Silva',
          salarioBaseBrl: 10000.00,
          horasExtrasBrl: 1000.00,
          adicionalInsalubridadePericulosidadeBrl: 560.00, // Bruto = 11560
          baseInssBrl: 8157.41, // Teto INSS 2026
          inssRetidoBrl: 950.00,
          baseFgtsBrl: 11560.00,
          fgtsDevidoBrl: 924.80, // 8%
          irrfRetidoBrl: 1800.00
        },
        {
          funcionarioCpf: '222.333.444-55',
          nome: 'Bruno Carvalho',
          salarioBaseBrl: 5000.00,
          horasExtrasBrl: 0,
          adicionalInsalubridadePericulosidadeBrl: 0,
          baseInssBrl: 5000.00,
          inssRetidoBrl: 520.00,
          baseFgtsBrl: 5000.00,
          fgtsDevidoBrl: 400.00,
          irrfRetidoBrl: 350.00
        }
      ],
      fapAjustado: 1.0,
      aliquotaRatPercent: 2.0,
      aliquotaTerceirosPercent: 5.8,
      isSimplesNacionalAnexoIVouLucroReal: true
    });

    const dataPayroll = unwrap(resPayroll);
    expect(dataPayroll.totalFuncionarios).toBe(2);
    expect(dataPayroll.totalRemuneracaoBrutaBrl).toBe(16560.00);
    expect(dataPayroll.totalInssSeguradosBrl).toBe(1470.00);
    expect(dataPayroll.totalFgtsDigitalBrl).toBe(1324.80);
    expect(dataPayroll.totalIrrfFonteBrl).toBe(2150.00);
    expect(dataPayroll.statusAuditoria).toBe('FOLHA_ESOCIAL_DCTFWEB_FGTS_100_CONCILIADA');
    expect(dataPayroll.diagnosticoAuditoria).toContain('100% conciliado sem divergências');
  });

  it('2. Deve auditar passivos trabalhistas, alertando pisos sindicais e risco de ferias em dobro', () => {
    const resLabor = processOfficeLaborLiabilitiesPreventionEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Comércio e Logística Delta Ltda',
      funcionariosAvaliados: [
        {
          funcionarioCpf: '333.444.555-66',
          nome: 'Carlos Eduardo',
          cargo: 'Motorista Carreteiro',
          salarioAtualBrl: 2800.00,
          pisoSalarialConvencaoBrl: 3200.00, // Alerta: abaixo do piso
          diasFeriasVencidas: 340, // Alerta: risco de dobro
          possuiHorasExtrasHabituaisSemDsr: true // Alerta: DSR pendente
        },
        {
          funcionarioCpf: '444.555.666-77',
          nome: 'Mariana Souza',
          cargo: 'Assistente Administrativo',
          salarioAtualBrl: 2500.00,
          pisoSalarialConvencaoBrl: 2200.00,
          diasFeriasVencidas: 120,
          possuiHorasExtrasHabituaisSemDsr: false
        }
      ]
    });

    const dataLabor = unwrap(resLabor);
    expect(dataLabor.totalVidasAuditadas).toBe(2);
    expect(dataLabor.alertasPisoSalarialAbaixo).toBe(1);
    expect(dataLabor.alertasFeriasEmDobro).toBe(1);
    expect(dataLabor.alertasDsrHorasExtras).toBe(1);
    expect(dataLabor.nivelRiscoTrabalhista).toBe('MEDIO_RISCO_ALERTAS');
    expect(dataLabor.statusPrevencao).toBe('AUDITORIA_TRABALHISTA_CONCLUIDA_COM_SUCESSO');
    expect(dataLabor.diagnosticoPrevencao).toContain('Pisos Salariais: 1 abaixo');
  });
});
