import { describe, it, expect } from 'vitest';
import {
  processSefazDirectTransmissionCircuitBreaker,
  processSefazContingencyModeEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Transmissão SEFAZ mTLS, Contingência SVC & Cluster Kubernetes', () => {
  it('1. Deve transmitir NFe na SEFAZ de origem com Circuit Breaker fechado e acionar contingencia SVC-AN em caso de falha', () => {
    const chaveNfe = '35260812345678000190550010000001231000001234';

    // Transmissão Normal na SEFAZ SP
    const resNormal = processSefazDirectTransmissionCircuitBreaker({
      ufOrigem: 'SP',
      chaveAcessoNfe: chaveNfe,
      xmlAssinadoNfe: '<NFe>...</NFe>',
      tempoRespostaMsEsperado: 180,
      simularFalhaSefazOrigem: false
    });

    const dataNormal = unwrap(resNormal);
    expect(dataNormal.statusTransmissao).toBe('AUTORIZADO_SEFAZ_ORIGEM');
    expect(dataNormal.circuitBreakerStatus).toBe('FECHADO_OPERACAO_NORMAL');
    expect(dataNormal.tempoLatenciaMs).toBe(180);
    expect(dataNormal.ambiente).toBe('PRODUCAO_SEFAZ');

    // Transmissão com Falha na Origem -> Failover para SVC-AN
    const resFalha = processSefazDirectTransmissionCircuitBreaker({
      ufOrigem: 'SP',
      chaveAcessoNfe: chaveNfe,
      xmlAssinadoNfe: '<NFe>...</NFe>',
      tempoRespostaMsEsperado: 180,
      simularFalhaSefazOrigem: true
    });

    const dataFalha = unwrap(resFalha);
    expect(dataFalha.statusTransmissao).toBe('AUTORIZADO_CONTINGENCIA_SVC_AN');
    expect(dataFalha.circuitBreakerStatus).toBe('ABERTO_CIRCUITO_EM_CONTINGENCIA');
    expect(dataFalha.motivoStatusSefaz).toContain('Contingencia SVC-AN');
    expect(dataFalha.diagnosticoSefaz).toContain('Circuit Breaker: ABERTO_CIRCUITO_EM_CONTINGENCIA');
  });

  it('2. Deve homologar emissao em contingencia SVC-AN com tpEmis e texto de DANFE conforme Ajustes SINIEF', () => {
    const chaveNfe = '35260812345678000190550010000001231000001234';

    const resContingencia = processSefazContingencyModeEngine({
      chaveAcessoNfe: chaveNfe,
      tipoEmissao: '6_CONTINGENCIA_SVC_AN',
      justificativaContingencia: 'Indisponibilidade temporária na SEFAZ de Origem',
      dhEntradaContingenciaIso: '2026-08-17T15:00:00-03:00'
    });

    const dataContingencia = unwrap(resContingencia);
    expect(dataContingencia.tpEmisDanfe).toBe('6');
    expect(dataContingencia.justificativaValida).toBe(true);
    expect(dataContingencia.textoDanfeContingencia).toBe('DANFE EMITIDO EM CONTINGÊNCIA - SVC-AN (Sefaz Virtual Ambiente Nacional)');
    expect(dataContingencia.statusHomologacaoContingencia).toBe('CONTINGENCIA_OFICIAL_CONFAZ_HOMOLOGADA');
    expect(dataContingencia.diagnosticoContingencia).toContain('DANFE Homologado.');
  });
});
