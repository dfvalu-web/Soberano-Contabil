import { describe, it, expect } from 'vitest';
import {
  processCceeFreeEnergyMarketTaxEngine,
  processTransferPricingOcdeLaw14596,
  unwrap
} from '../src/index.js';

describe('TESTES: Mercado Livre de Energia CCEE & Transfer Pricing OCDE (Lei 14.596/23)', () => {
  it('1. Deve apurar PIS/COFINS e diferimento/isencao de ICMS na liquidacao MCP da CCEE (Convenio 15/07)', () => {
    const resCcee = processCceeFreeEnergyMarketTaxEngine({
      agenteCceeId: 'CCEE-GEN-01',
      agenteNome: 'Soberano Comercializadora & Geradora S.A.',
      submercado: 'SUDESTE_CENTRO_OESTE',
      sobraEnergiaLiquidadaMwh: 5000, // 5.000 MWh
      precoPldMedioBrlPorMwh: 150.00, // R$ 150/MWh -> Bruto R$ 750.000,00
      aliquotaPisPadraoPercent: 1.65, // R$ 12.375,00
      aliquotaCofinsPadraoPercent: 7.60, // R$ 57.000,00
      isIsencaoIcmsConvenio1507Aplicavel: true // ICMS Isento/Diferido
    });

    const dataCcee = unwrap(resCcee);
    expect(dataCcee.valorBrutoLiquidacaoMcpBrl).toBe(750000.00);
    expect(dataCcee.valorPisDevidoBrl).toBe(12375.00);
    expect(dataCcee.valorCofinsDevidoBrl).toBe(57000.00);
    expect(dataCcee.valorIcmsDevidoBrl).toBe(0);
    expect(dataCcee.valorLiquidoReceberCceeBrl).toBe(680625.00);
    expect(dataCcee.diagnosticoFiscal).toContain('ISENTO/DIFERIDO');
  });

  it('2. Deve aplicar novo padrao OCDE de precos de transferencia ajustando a mediana no Lalur (Lei 14.596/23)', () => {
    // 2.1 Fora do intervalo interquartil (Superior ao p75) -> Ajuste à mediana
    const resTpAjuste = processTransferPricingOcdeLaw14596({
      transacaoId: 'TP-OCDE-01',
      empresaBrasileiraNome: 'Soberano Indústria Química S.A.',
      parteVinculadaExteriorNome: 'Soberano Global Chemicals Inc.',
      paisVinculada: 'ESTADOS_UNIDOS',
      metodoAdotado: 'PIC_PRECO_INDEPENDENTE_COMPARAVEL',
      precoPraticadoImportacaoUnitarioUsd: 150.00, // Preço pago
      quantidadeTransacionada: 10000, // 10.000 unidades
      taxaCambioPtaxBrlPorUsd: 5.00, // R$ 5,00/USD
      limiteInferiorInterquartilUsd: 90.00,
      medianaInterquartilUsd: 110.00, // Mediana
      limiteSuperiorInterquartilUsd: 130.00 // Limite Superior -> 150 > 130 -> Ajuste = 150 - 110 = 40 USD
    });

    const dataTpAjuste = unwrap(resTpAjuste);
    expect(dataTpAjuste.isDentroIntervaloInterquartil).toBe(false);
    expect(dataTpAjuste.ajustePrimarioTransferPricingUsd).toBe(400000.00); // 40 * 10k = 400k USD
    expect(dataTpAjuste.ajustePrimarioTransferPricingBrl).toBe(2000000.00); // 400k * 5 = 2M BRL
    expect(dataTpAjuste.adicaoLalurIrpjBrl).toBe(500000.00); // 25% de 2M = 500k
    expect(dataTpAjuste.adicaoLacsCsllBrl).toBe(180000.00); // 9% de 2M = 180k
    expect(dataTpAjuste.totalTributosAdicionaisLalurBrl).toBe(680000.00); // 34% de 2M = 680k
    expect(dataTpAjuste.diagnosticoFiscal).toContain('AJUSTE A MEDIANA');

    // 2.2 Dentro do intervalo interquartil -> Conforme Arm's Length (Sem Ajuste)
    const resTpConforme = processTransferPricingOcdeLaw14596({
      transacaoId: 'TP-OCDE-02',
      empresaBrasileiraNome: 'Soberano Indústria Química S.A.',
      parteVinculadaExteriorNome: 'Soberano Europa B.V.',
      paisVinculada: 'HOLANDA',
      metodoAdotado: 'PRL_PRECO_REVENDA_MENOS_LUCRO',
      precoPraticadoImportacaoUnitarioUsd: 120.00, // 120 está entre 90 e 130
      quantidadeTransacionada: 10000,
      taxaCambioPtaxBrlPorUsd: 5.00,
      limiteInferiorInterquartilUsd: 90.00,
      medianaInterquartilUsd: 110.00,
      limiteSuperiorInterquartilUsd: 130.00
    });

    const dataTpConforme = unwrap(resTpConforme);
    expect(dataTpConforme.isDentroIntervaloInterquartil).toBe(true);
    expect(dataTpConforme.ajustePrimarioTransferPricingBrl).toBe(0);
    expect(dataTpConforme.totalTributosAdicionaisLalurBrl).toBe(0);
    expect(dataTpConforme.diagnosticoFiscal).toContain('CONFORME ARMS LENGTH');
  });
});
