import { describe, it, expect } from 'vitest';
import {
  processInternallyGeneratedSoftwareIntangiblesCpc04,
  processAuthorizedEconomicOperatorOeaTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Softwares Intangíveis (CPC 04) & Certificação OEA (IN RFB 2.152/23)', () => {
  it('1. Deve segregar pesquisa (DRE) de desenvolvimento (Ativo Intangivel) e amortizar linearmente conforme CPC 04', () => {
    const resSoftware = processInternallyGeneratedSoftwareIntangiblesCpc04({
      projetoSoftwareId: 'PRJ-SOBERANO-AI-01',
      nomeSoftware: 'Soberano Core Financial AI Platform',
      despesasFasePesquisaBrl: 500000.00, // R$ 500k DRE
      custosFaseDesenvolvimentoElegiveisBrl: 3000000.00, // R$ 3M Ativado
      vidaUtilMeses: 60, // 5 anos -> R$ 50k/mês
      mesesAmortizadosNoAno: 6 // 6 meses = R$ 300k
    });

    const dataSoftware = unwrap(resSoftware);
    expect(dataSoftware.despesaPesquisaReconhecidaDreBrl).toBe(500000.00);
    expect(dataSoftware.valorIntangivelAtivadoBalancoBrl).toBe(3000000.00);
    expect(dataSoftware.amortizacaoMensalBrl).toBe(50000.00);
    expect(dataSoftware.amortizacaoAcumuladaPeriodoBrl).toBe(300000.00);
    expect(dataSoftware.saldoLiquidoIntangivelFinalBrl).toBe(2700000.00); // 3M - 300k
    expect(dataSoftware.statusElegibilidadeCpc04).toBe('ATIVACAO_INTANGIVEL_DESENVOLVIMENTO_CONFORME');
    expect(dataSoftware.diagnosticoCpc04).toContain('Saldo Contabil Liquido: R$ 2700000.00');
  });

  it('2. Deve apurar beneficios aduaneiros e reducao de custos portuarios do Programa OEA conforme IN RFB 2.152/23', () => {
    const resOea = processAuthorizedEconomicOperatorOeaTaxEngine({
      empresaCnpj: '12.345.678/0001-90',
      modalidadeCertificacaoOea: 'OEA_CONFORMIDADE_NIVEL_2',
      numeroCertificadoOea: 'OEA-BR-2026-00892',
      totalOperacoesImportacaoExportacaoAno: 500,
      valorTotalDesembaraçadoBrl: 50000000.00, // R$ 50M
      tempoMedioDesembaracoHorasNaoOea: 120, // 5 dias
      tempoMedioDesembaracoHorasOea: 2, // 2 horas -> Redução = 118h (4.9167 dias economizados)
      custoMedioArmazenagemDemurragePorDiaBrl: 3000.00
    });

    const dataOea = unwrap(resOea);
    expect(dataOea.percentualCanalVerdeConquistadoPercent).toBe(99.0);
    expect(dataOea.reducaoTempoDesembaracoPercent).toBe(98.33); // 118 / 120 = 98.33%
    expect(dataOea.economiaTotalArmazenagemDemurrageBrl).toBe(7375000.00); // 500 * (118/24) * 3000 = 7.375.000,00
    expect(dataOea.statusCertificacaoOea).toBe('CERTIFICACAO_OEA_RFB_HOMOLOGADA');
    expect(dataOea.diagnosticoOea).toContain('Economia Logistica/Demurrage: R$ 7375000.00');
  });
});
