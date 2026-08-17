import { describe, it, expect } from 'vitest';
import {
  processSbceRegulatedCarbonMarketTaxEngine,
  processReddPlusJurisdictionalCarbonCreditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Mercado de Carbono Regulado (SBCE), Créditos REDD+ & Ativos Ambientais', () => {
  it('1. Deve apurar obrigacao de entrega no SBCE para emissor acima de 25.000 tCO2e (CPC 04)', () => {
    const resSbce = processSbceRegulatedCarbonMarketTaxEngine({
      empresaReguladaCnpj: '10.000.000/0001-00',
      setorAtividade: 'SIDERURGIA',
      emissoesAnuaisGheeTco2e: 45000, // 45.000 tCO2e
      limiteEmissaoGratuitoCbeTco2e: 35000, // Déficit = 10.000 tCO2e
      cotasAdquiridasMercadoCbe: 10000,
      precoMedioPorCbeBrl: 120.00 // R$ 1.200.000,00
    });

    const dataSbce = unwrap(resSbce);
    expect(dataSbce.enquadramentoReguladosbce).toBe(true);
    expect(dataSbce.deficitEmissoesTco2e).toBe(10000);
    expect(dataSbce.custoTotalCumprimentoSbceBrl).toBe(1200000.00);
    expect(dataSbce.classificacaoContabilCbe).toBe('ATIVO_INTANGIVEL_CUMPRIMENTO_META_CPC04');
    expect(dataSbce.statusConformidadeSbce).toBe('OBRIGACAO_SBCE_100_PERCENT_COMPENSADA');
    expect(dataSbce.diagnosticoSbce).toContain('Compensado com 10.000 CBEs');
  });

  it('2. Deve apurar venda de creditos REDD+ jurisdicionais com isencao de PIS/COFINS e 15% de IRPJ', () => {
    const resRedd = processReddPlusJurisdictionalCarbonCreditEngine({
      geradorCreditoCnpj: '10.000.000/0001-00',
      estadoJurisdicaoOrigem: 'AMAZONAS',
      volumeCreditosReddTon: 50000, // 50.000 tCO2e
      precoVendaPorCreditoUsd: 10.00, // 500k USD
      taxaCambioLiquidacaoBrl: 5.50, // R$ 2.750.000,00
      aliquotaGanhoCapitalIrpjPercent: 15.0 // 15% de R$ 2.75M = R$ 412.500,00
    });

    const dataRedd = unwrap(resRedd);
    expect(dataRedd.receitaBrutaVendaReddBrl).toBe(2750000.00);
    expect(dataRedd.impostoPisCofinsDevidoBrl).toBe(0.00); // Isenção
    expect(dataRedd.impostoGanhoCapitalIrpjBrl).toBe(412500.00);
    expect(dataRedd.receitaLiquidaAposTributosBrl).toBe(2337500.00);
    expect(dataRedd.statusRedd).toBe('CREDITO_REDD_JURISDICIONAL_TRIBUTADO_CONFORME_LEI');
    expect(dataRedd.diagnosticoRedd).toContain('PIS/COFINS: Isento');
  });
});
