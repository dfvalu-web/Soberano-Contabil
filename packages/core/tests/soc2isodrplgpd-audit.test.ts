import { describe, it, expect } from 'vitest';
import {
  processSoc2Iso27001AuditDrpEngine,
  processLgpdDpoPrivacyDataMapEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Auditoria Big Four (SOC 1/2, ISO 27001), DRP & Privacidade LGPD DPO', () => {
  it('1. Deve validar criterios SOC 2 Tipo II, certificacoes ISO 27001 e metricas de DRP (RPO 0m / RTO < 15m)', () => {
    const resSoc2 = processSoc2Iso27001AuditDrpEngine({
      empresaCnpj: '12.345.678/0001-90',
      anoPeriodoAuditoria: 2026,
      escopoSistemas: ['FASTIFY_CORE_API', 'POSTGRES_PGVECTOR', 'S3_WORM_VAULT', 'KMS_VAULT'],
      testarSimulacaoDrpFailover: true
    });

    const dataSoc2 = unwrap(resSoc2);
    expect(dataSoc2.criteriosTrustServicesValidados.seguranca).toBe(true);
    expect(dataSoc2.criteriosTrustServicesValidados.disponibilidade).toBe(true);
    expect(dataSoc2.criteriosTrustServicesValidados.integridadeProcessamento).toBe(true);
    expect(dataSoc2.metricasDrpResiliencia.rpoMinutosAlcancado).toBe(0);
    expect(dataSoc2.metricasDrpResiliencia.rtoMinutosAlcancado).toBeLessThanOrEqual(15);
    expect(dataSoc2.statusAuditoria).toBe('SOC2_TIPO2_E_ISO27001_CONFORME_BIG4');
    expect(dataSoc2.diagnosticoSoc2).toContain('5 Trust Criteria: 100% OK');
  });

  it('2. Deve mapear dados pessoais de RH/eSocial com base legal Art. 7º II e Art. 11 II da LGPD', () => {
    const resLgpd = processLgpdDpoPrivacyDataMapEngine({
      tenantCnpj: '12.345.678/0001-90',
      categoriaTitulares: 'COLABORADORES_ESOCIAL',
      dadosPessoaisTratados: ['CPF', 'SALARIO_HOLERITE', 'DADOS_BANCARIOS', 'ASO_SAUDE'],
      finalidadeTratamento: 'Cumprimento de Obrigações Trabalhistas, Previdenciárias e Fiscais (eSocial / DCTFWeb)',
      prazoRetencaoAnos: 5
    });

    const dataLgpd = unwrap(resLgpd);
    expect(dataLgpd.baseLegalLgpd).toBe('ART_7_II_CUMPRIMENTO_OBRIGACAO_LEGAL');
    expect(dataLgpd.dadosSensiveisIdentificados).toBe(true);
    expect(dataLgpd.baseLegalDadosSensiveis).toBe('ART_11_II_A_CUMPRIMENTO_OBRIGACAO_LEGAL');
    expect(dataLgpd.statusRopa).toBe('INVENTARIO_ROPA_LGPD_CONFORME_ANPD');
    expect(dataLgpd.medidasSegurancaAtivas).toContain('Criptografia AES-256 em Repouso');
    expect(dataLgpd.diagnosticoLgpd).toContain('Inventário Homologado para DPO/ANPD.');
  });
});
