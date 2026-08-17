const fs = require('fs');

// 1. Fix transfer-pricing-ocde-law14596.ts
fs.writeFileSync('packages/core/src/tax/special-sectors/transfer-pricing-ocde-law14596.ts', `import { Result, Ok, Err } from '../../types/result.js';

export type OcdeTpMethod = 'PIC_PRECO_INDEPENDENTE_COMPARAVEL' | 'PRL_PRECO_REVENDA_MENOS_LUCRO' | 'MCL_MARGEM_LIQUIDA_TRANSACAO_TNMM';

export interface TransferPricingOcdeInput {
  transacaoId: string;
  empresaBrasileiraNome: string;
  parteVinculadaExteriorNome: string;
  paisVinculada: string;
  metodoAdotado: OcdeTpMethod;
  precoPraticadoImportacaoUnitarioUsd: number; // Preço pago à vinculada
  quantidadeTransacionada: number;
  taxaCambioPtaxBrlPorUsd: number;
  limiteInferiorInterquartilUsd: number; // Percentil 25
  medianaInterquartilUsd: number; // Percentil 50 (Preço Parâmetro Arm's Length)
  limiteSuperiorInterquartilUsd: number; // Percentil 75
}

export interface TransferPricingOcdeResult {
  transacaoId: string;
  empresaBrasileiraNome: string;
  parteVinculadaExteriorNome: string;
  metodoAdotado: OcdeTpMethod;
  isDentroIntervaloInterquartil: boolean;
  ajustePrimarioTransferPricingUsd: number;
  ajustePrimarioTransferPricingBrl: number;
  adicaoLalurIrpjBrl: number; // 25% (15% + 10% adicional)
  adicaoLacsCsllBrl: number; // 9%
  totalTributosAdicionaisLalurBrl: number; // 34%
  diagnosticoFiscal: string;
}

export function processTransferPricingOcdeLaw14596(input: TransferPricingOcdeInput): Result<TransferPricingOcdeResult, Error> {
  const {
    transacaoId,
    empresaBrasileiraNome,
    parteVinculadaExteriorNome,
    paisVinculada,
    metodoAdotado,
    precoPraticadoImportacaoUnitarioUsd,
    quantidadeTransacionada,
    taxaCambioPtaxBrlPorUsd,
    limiteInferiorInterquartilUsd,
    medianaInterquartilUsd,
    limiteSuperiorInterquartilUsd
  } = input;

  if (precoPraticadoImportacaoUnitarioUsd <= 0 || quantidadeTransacionada <= 0 || taxaCambioPtaxBrlPorUsd <= 0) {
    return Err(new Error('Preços, quantidades e taxa de câmbio devem ser superiores a zero.'));
  }

  // Lei nº 14.596/2023 (Novo Marco de Preços de Transferência - Padrão OCDE / Arm\\'s Length):
  // 1. Se o preço praticado na importação estiver dentro do intervalo interquartil (p25 a p75),
  //    considera-se em conformidade com o princípio arm\\'s length (sem ajuste).
  // 2. Se o preço praticado for SUPERIOR ao limite superior (p75), o preço deve ser ajustado para a MEDIANA (p50).
  const isDentroIntervalo = (
    precoPraticadoImportacaoUnitarioUsd >= limiteInferiorInterquartilUsd &&
    precoPraticadoImportacaoUnitarioUsd <= limiteSuperiorInterquartilUsd
  );

  let ajusteUnitarioUsd = 0;
  if (!isDentroIntervalo && precoPraticadoImportacaoUnitarioUsd > limiteSuperiorInterquartilUsd) {
    ajusteUnitarioUsd = precoPraticadoImportacaoUnitarioUsd - medianaInterquartilUsd;
  }

  const ajusteTotalUsd = Number((ajusteUnitarioUsd * quantidadeTransacionada).toFixed(2));
  const ajusteTotalBrl = Number((ajusteTotalUsd * taxaCambioPtaxBrlPorUsd).toFixed(2));

  // Ajuste espontâneo de IRPJ (25%) e CSLL (9%) no Lalur/Lacs
  const irpj = Number((ajusteTotalBrl * 0.25).toFixed(2));
  const csll = Number((ajusteTotalBrl * 0.09).toFixed(2));
  const totalTributos = Number((irpj + csll).toFixed(2));

  const statusMsg = isDentroIntervalo
    ? "CONFORME ARMS LENGTH (Sem Ajuste)"
    : "AJUSTE A MEDIANA: R$ " + ajusteTotalBrl.toFixed(2) + " (Adicao Lalur IRPJ 25% R$ " + irpj.toFixed(2) + " + CSLL 9% R$ " + csll.toFixed(2) + ")";

  const diag = "Precos de Transferencia OCDE (Lei nº 14.596/2023 - " + metodoAdotado + "): " + empresaBrasileiraNome + " com " + parteVinculadaExteriorNome + " (" + paisVinculada + "). Preco Praticado: US$ " + precoPraticadoImportacaoUnitarioUsd.toFixed(2) + " vs Intervalo [US$ " + limiteInferiorInterquartilUsd.toFixed(2) + " - US$ " + limiteSuperiorInterquartilUsd.toFixed(2) + "], Mediana US$ " + medianaInterquartilUsd.toFixed(2) + ". Status: " + statusMsg + ".";

  return Ok({
    transacaoId,
    empresaBrasileiraNome,
    parteVinculadaExteriorNome,
    metodoAdotado,
    isDentroIntervaloInterquartil: isDentroIntervalo,
    ajustePrimarioTransferPricingUsd: ajusteTotalUsd,
    ajustePrimarioTransferPricingBrl: ajusteTotalBrl,
    adicaoLalurIrpjBrl: irpj,
    adicaoLacsCsllBrl: csll,
    totalTributosAdicionaisLalurBrl: totalTributos,
    diagnosticoFiscal: diag
  });
}
`, 'utf8');

// 2. Fix ccee-transferpricing-ocde.test.ts
fs.writeFileSync('packages/core/tests/ccee-transferpricing-ocde.test.ts', `import { describe, it, expect } from 'vitest';
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
`, 'utf8');

console.log('Fixed quotes and strings in TP OCDE module and test.');
