import { describe, it, expect } from 'vitest';
import {
  processCorporateLegalizationRedesimEngine,
  processCndMonitoringComplianceEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Legalização Societária, Redesim & Monitor de CNDs', () => {
  it('1. Deve validar esteira societaria com viabilidade e DBE deferidos para registro em Junta Comercial', () => {
    const resCorp = processCorporateLegalizationRedesimEngine({
      processoId: 'PROC-SOC-2026-001',
      tipoProcesso: 'ABERTURA_EMPRESA',
      razaoSocialPretendida: 'Tech Prime Soluções Digitais Ltda',
      naturezaJuridica: 'LTDA',
      capitalSocialBrl: 100000.00,
      atividadesCnae: ['6201-5/01', '6202-3/00'],
      viabilidadeMunicipalAprovada: true,
      dbeReceitaFederalDeferido: true
    });

    const dataCorp = unwrap(resCorp);
    expect(dataCorp.processoId).toBe('PROC-SOC-2026-001');
    expect(dataCorp.etapaAtual).toBe('PRONTO_PARA_REGISTRO_JUNTA_COMERCIAL');
    expect(dataCorp.tempoMedioProcessamentoDias).toBe(3.0);
    expect(dataCorp.statusProcessamento).toBe('PROCESSO_SOCIETARIO_HOMOLOGADO_REDESIM');
    expect(dataCorp.diagnosticoSocietario).toContain('Tech Prime Soluções Digitais Ltda');
  });

  it('2. Deve monitorar CNDs Federal, Estadual, Municipal e CRF FGTS da carteira de clientes', () => {
    const resCnd = processCndMonitoringComplianceEngine({
      escritorioNome: 'Soberano Contabilidade & Consultoria',
      carteiraEmpresas: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Comércio Alfa Ltda',
          cndFederalValida: true,
          cndEstadualValida: true,
          cndMunicipalValida: true,
          crfFgtsValido: true
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Indústria Beta S/A',
          cndFederalValida: true,
          cndEstadualValida: true,
          cndMunicipalValida: true,
          crfFgtsValido: true
        }
      ]
    });

    const dataCnd = unwrap(resCnd);
    expect(dataCnd.totalEmpresasMonitoradas).toBe(2);
    expect(dataCnd.empresasTotalmenteRegulares).toBe(2);
    expect(dataCnd.empresasComPendenciaFiscal).toBe(0);
    expect(dataCnd.taxaConformidadeCndPercent).toBe(100.0);
    expect(dataCnd.statusMonitoramento).toBe('MONITOR_CNDS_EXECUTADO_COM_SUCESSO');
    expect(dataCnd.diagnosticoCnd).toContain('Taxa de Conformidade: 100.0%');
  });
});
