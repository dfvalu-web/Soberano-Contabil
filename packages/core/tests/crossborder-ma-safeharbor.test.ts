import { describe, it, expect } from 'vitest';
import {
  processCrossBorderMaTransferPricingSafeHarborEngine,
  processForeignAssetCapitalGainTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: M&A Cross-Border, Safe Harbors TP (IN 2.161/23) & Ganho de Capital Exterior', () => {
  it('1. Deve apurar Goodwill e aplicar Safe Harbor de 5% sobre servicos intragrupo de baixo valor', () => {
    const resMa = processCrossBorderMaTransferPricingSafeHarborEngine({
      adquirenteBrasilCnpj: '10.000.000/0001-00',
      alvoEstrangeiroNome: 'Global Tech Corp (Delaware)',
      moedaTransacao: 'USD',
      taxaCambioBrl: 5.50,
      valorAquisicaoMoedaOriginal: 20000000.00, // 20M USD
      patrimonioLiquidoIdentificavelValorJustoUsd: 14000000.00, // 14M USD -> Goodwill = 6M USD (R$ 33M)
      servicosIntragrupoCustosDiretosIndiretosUsd: 1000000.00, // 1M USD
      aplicarSafeHarborBaixoValorAgregado: true
    });

    const dataMa = unwrap(resMa);
    expect(dataMa.valorAquisicaoBrl).toBe(110000000.00); // R$ 110M
    expect(dataMa.goodwillApuradoMoedaOriginal).toBe(6000000.00); // 6M USD
    expect(dataMa.goodwillApuradoBrl).toBe(33000000.00); // R$ 33M
    expect(dataMa.safeHarborPrecoTransferenciaUsd).toBe(1050000.00); // 5% mark-up
    expect(dataMa.safeHarborPrecoTransferenciaBrl).toBe(5775000.00);
    expect(dataMa.statusMaCrossBorder).toBe('COMBINACAO_CROSS_BORDER_E_SAFE_HARBOR_HOMOLOGADOS');
    expect(dataMa.diagnosticoMa).toContain('Goodwill: R$ 33.000.000');
  });

  it('2. Deve apurar ganho de capital na alienacao de participacao no exterior (Art. 21 Lei 12.973)', () => {
    const resGanho = processForeignAssetCapitalGainTaxEngine({
      investidorBrasilCnpj: '10.000.000/0001-00',
      jurisdicaoAtivoAlienado: 'REINO_UNIDO',
      valorAlienacaoUsd: 15000000.00, // 15M USD
      custoAquisicaoHistoricoUsd: 10000000.00, // 10M USD -> Ganho = 5M USD
      taxaCambioDataAlienacaoBrl: 5.60, // R$ 28M tributável
      aliquotaIrpjCsllPercent: 34.0 // 34% de R$ 28M = R$ 9.520.000,00
    });

    const dataGanho = unwrap(resGanho);
    expect(dataGanho.ganhoCapitalMoedaEstrangeiraUsd).toBe(5000000.00);
    expect(dataGanho.ganhoCapitalTributavelBrl).toBe(28000000.00);
    expect(dataGanho.impostoDevidoIrpjCsllBrl).toBe(9520000.00);
    expect(dataGanho.statusGanhoCapital).toBe('GANHO_CAPITAL_EXTERIOR_APURADO_LEI_12973');
    expect(dataGanho.diagnosticoGanho).toContain('IRPJ/CSLL Devido: R$ 9.520.000');
  });
});
