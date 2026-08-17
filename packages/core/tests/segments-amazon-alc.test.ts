import { describe, it, expect } from 'vitest';
import {
  processOperatingSegmentsAggregationCpc22,
  processWesternAmazonAlcTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Segmentos Operacionais (CPC 22 / IFRS 8) & Amazônia Ocidental / ALC', () => {
  it('1. Deve identificar segmentos reportaveis pelo criterio de 10% e verificar regra de suficiencia dos 75% conforme CPC 22', () => {
    const resSegments = processOperatingSegmentsAggregationCpc22({
      empresaHoldingNome: 'Grupo Varejista Nacional S.A.',
      segmentos: [
        {
          segmentoNome: 'Varejo Digital (E-commerce)',
          receitaExternaBrl: 10000000.00,
          receitaIntersegmentosBrl: 1000000.00,
          resultadoOperacionalLucroOuPrejuizoBrl: 1500000.00,
          ativosTotaisSegmentoBrl: 20000000.00
        },
        {
          segmentoNome: 'Atacado Físico B2B',
          receitaExternaBrl: 6000000.00,
          receitaIntersegmentosBrl: 500000.00,
          resultadoOperacionalLucroOuPrejuizoBrl: 800000.00,
          ativosTotaisSegmentoBrl: 15000000.00
        },
        {
          segmentoNome: 'Serviços Financeiros & Crédito',
          receitaExternaBrl: 2000000.00,
          receitaIntersegmentosBrl: 200000.00,
          resultadoOperacionalLucroOuPrejuizoBrl: 300000.00,
          ativosTotaisSegmentoBrl: 5000000.00
        }
      ]
    });

    const dataSegments = unwrap(resSegments);
    expect(dataSegments.totalReceitaExternaConsolidadaBrl).toBe(18000000.00);
    expect(dataSegments.totalAtivosConsolidadosBrl).toBe(40000000.00);
    expect(dataSegments.segmentosReportaveis.length).toBe(3); // Todos atingiram >= 10%
    expect(dataSegments.coberturaReceitaExternaReportavelPercent).toBe(100.0);
    expect(dataSegments.atingiuRegraSuficiencia75Percent).toBe(true);
    expect(dataSegments.diagnosticoCpc22).toContain('Regra dos 75% ATENDIDA COM SUCESSO');
  });

  it('2. Deve apurar isencao de IPI, aliquota zero PIS/COFINS e credito presumido de ICMS na Amazonia Ocidental / ALC', () => {
    const resAlc = processWesternAmazonAlcTaxEngine({
      documentoNumero: 'NFe-778899',
      zonaBeneficiada: 'AMAZONIA_OCIDENTAL_RO_AC_RR_AM',
      valorOperacaoFaturamentoBrl: 1000000.00, // R$ 1M
      aliquotaIpiPadraoPercent: 12.0, // R$ 120k isenção
      aliquotaPisCofinsPadraoPercent: 9.25, // R$ 92.5k desoneração
      aliquotaIcmsInternaPercent: 17.5, // R$ 175k nominal
      percentualCreditoPresumidoIcmsPercent: 75.0 // 75% de R$ 175k = R$ 131.250,00
    });

    const dataAlc = unwrap(resAlc);
    expect(dataAlc.isencaoIpiBrl).toBe(120000.00);
    expect(dataAlc.desoneracaoPisCofinsAliquotaZeroBrl).toBe(92500.00);
    expect(dataAlc.creditoPresumidoIcmsApropriadoBrl).toBe(131250.00);
    expect(dataAlc.icmsDevidoComCreditoPresumidoBrl).toBe(43750.00); // 175k - 131.25k
    expect(dataAlc.totalBeneficioFiscalRegionalBrl).toBe(343750.00); // 120k + 92.5k + 131.25k
    expect(dataAlc.diagnosticoAmazoniaOcidental).toContain('Beneficio Fiscal Total: R$ 343750.00');
  });
});
