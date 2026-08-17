import { describe, it, expect } from 'vitest';
import {
  processSpedPvaStressComplianceEngine,
  processSoc2Iso27001ContinuousComplianceAuditor,
  unwrap
} from '../src/index.js';

describe('TESTES: Homologação PVA SPED & Certificação SOC 2 / ISO 27001 (Pilar 6 - Produção)', () => {
  it('1. Deve validar arquivo SPED Fiscal no motor de estresse PVA com ZERO erros e liberado para ReceitaNet', () => {
    const resPva = processSpedPvaStressComplianceEngine({
      arquivoSpedTipo: 'EFD_ICMS_IPI',
      versaoLeiautePva: '018',
      conteudoTextoSped: '|0000|018|0|01012026|31012026|EMPRESA ALFA S.A.|12345678000190|SP|...|9999|1250|',
      totalLinhasArquivo: 1250
    });

    const dataPva = unwrap(resPva);
    expect(dataPva.statusAprovacaoPva).toBe('APROVADO_SEM_ERROS_IMPEDITIVOS');
    expect(dataPva.totalErrosCriticos).toBe(0);
    expect(dataPva.totalAdvertencias).toBe(0);
    expect(dataPva.laudoConformidadePva.liberadoParaTransmissaoReceitanet).toBe(true);
    expect(dataPva.blocosAuditados).toContain('Bloco C (NF-e/NFC-e)');
    expect(dataPva.diagnosticoPva).toContain('100% de conformidade com o validador oficial da Receita Federal do Brasil');
  });

  it('2. Deve auditar controles SOC 2 Type II e ISO/IEC 27001:2022 atingindo 100% de conformidade nos 5 critérios', () => {
    const resSoc2 = processSoc2Iso27001ContinuousComplianceAuditor({
      tenantId: '00000000-0000-0000-0000-000000000001',
      dataAvaliacaoIso: '2026-08-17T02:47:00Z',
      escopoAuditoria: 'PLATAFORMA_SOBERANO_CONTABIL_FULL'
    });

    const dataSoc2 = unwrap(resSoc2);
    expect(dataSoc2.statusCertificacaoGeral).toBe('COMPLIANT_SOC2_TYPE_II_AND_ISO_27001');
    expect(dataSoc2.pontuacaoConformidadePercent).toBe(100.0);
    expect(dataSoc2.controlesTrustServicesCriteria.security.status).toBe('CONFORME_100_PERCENT');
    expect(dataSoc2.controlesTrustServicesCriteria.availability.status).toBe('CONFORME_100_PERCENT');
    expect(dataSoc2.controlesTrustServicesCriteria.processingIntegrity.status).toBe('CONFORME_100_PERCENT');
    expect(dataSoc2.laudoAuditoriaSeguranca.recomendacaoFinal).toBe('APTO PARA PRODUÇÃO ENTERPRISE E BIG FOUR AUDIT');
    expect(dataSoc2.diagnosticoSoc2).toContain('100% de conformidade em todos os 5 Trust Services Criteria');
  });
});
