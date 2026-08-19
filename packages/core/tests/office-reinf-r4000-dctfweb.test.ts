import { describe, it, expect } from 'vitest';
import {
  processOfficeReinfR4000Block40AuditEngine,
  processOfficeReinfDctfwebOfxCrossauditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: EFD-Reinf Série R-4000 & Cruzamento Tríplice com DCTFWeb/OFX', () => {
  it('1. Deve apurar eventos R-4010 PF e R-4020 PJ com totalizacao de IRRF e CRF', () => {
    const resReinf = processOfficeReinfR4000Block40AuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Serviços Médicos e Hospitalares Paulista S/A',
      mesCompetencia: '2026-08',
      totalEventosR4010PfCount: 15,
      totalEventosR4020PjCount: 30,
      baseCalculoR4010PfBrl: 100000.00,
      irrfRetidoR4010PfBrl: 15000.00,
      baseCalculoR4020PjBrl: 200000.00,
      irrfRetidoR4020PjBrl: 3000.00, // 1.5%
      crfPisCofinsCsllRetidoR4020PjBrl: 9300.00 // 4.65%
    });

    const dataReinf = unwrap(resReinf);
    expect(dataReinf.totalEventosGerados).toBe(45);
    expect(dataReinf.totalIrrfRetidoBrl).toBe(18000.00); // 15k + 3k
    expect(dataReinf.totalCrfRetidoBrl).toBe(9300.00);
    expect(dataReinf.totalTributosRetidosReinfBrl).toBe(27300.00);
    expect(dataReinf.eventoFechamentoR4099Gerado).toBe(true);
    expect(dataReinf.statusReinf).toBe('REINF_R4000_VALIDADA_SEM_ERROS_PRONTA_TRANSMISSAO');
    expect(dataReinf.diagnosticoReinf).toContain('45 eventos apurados');
  });

  it('2. Deve realizar cruzamento triplice conforme entre Reinf, DCTFWeb e Extrato OFX', () => {
    const resCross = processOfficeReinfDctfwebOfxCrossauditEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Engenharia e Construções Metrópole Ltda',
      mesCompetencia: '2026-08',
      totalRetencoesReinfBrl: 27300.00,
      totalDebitoApuradoDctfwebBrl: 27300.00,
      totalDarfPagoExtratoOfxBrl: 27300.00
    });

    const dataCross = unwrap(resCross);
    expect(dataCross.divergenciaReinfVsDctfwebBrl).toBe(0.00);
    expect(dataCross.divergenciaDctfwebVsOfxBrl).toBe(0.00);
    expect(dataCross.statusConciliacaoTriplice).toBe('CONCILIACAO_TRIPLICE_100_PORCENTO_CONFORME');
    expect(dataCross.diagnosticoConciliacao).toContain('CONCILIACAO_TRIPLICE_100_PORCENTO_CONFORME');
  });
});
