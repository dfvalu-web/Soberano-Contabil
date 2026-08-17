import { describe, it, expect } from 'vitest';
import {
  processWealthDistributionDvaCpc09,
  processInterestOnOwnCapitalJcpTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Demonstração do Valor Adicionado (CPC 09) & Juros s/ Capital Próprio (JCP)', () => {
  it('1. Deve apurar o valor adicionado gerado e a distribuicao percentual conforme CPC 09 (DVA)', () => {
    const resDva = processWealthDistributionDvaCpc09({
      empresaCnpj: '12.345.678/0001-90',
      anoCalendario: 2026,
      receitaBrutaVendasBrl: 20000000.00, // R$ 20M
      insumosAdquiridosTerceirosBrl: 8000000.00, // R$ 8M -> Bruto = R$ 12M
      depreciacaoAmortizacaoRetencaoBrl: 1000000.00, // R$ 1M -> Líquido = R$ 11M
      receitasFinanceirasTransferidasBrl: 500000.00, // R$ 500k -> Total a Distribuir = R$ 11.5M
      distribuicaoPessoalEncargosBrl: 3500000.00, // 30.43%
      distribuicaoImpostosTaxasContribuicoesBrl: 4000000.00, // 34.78%
      distribuicaoRemuneracaoCapitaisTerceirosBrl: 1500000.00, // 13.04%
      distribuicaoRemuneracaoCapitaisPropriosBrl: 2500000.00 // 21.74%
    });

    const dataDva = unwrap(resDva);
    expect(dataDva.valorAdicionadoBrutoBrl).toBe(12000000.00);
    expect(dataDva.valorAdicionadoLiquidoProduzidoBrl).toBe(11000000.00);
    expect(dataDva.valorAdicionadoTotalADistribuirBrl).toBe(11500000.00);
    expect(dataDva.distribuicaoDetalhada.pessoalPercent).toBe(30.43);
    expect(dataDva.distribuicaoDetalhada.impostosGovernoPercent).toBe(34.78);
    expect(dataDva.statusConsistenciaDva).toBe('DVA_CPC09_QUADRADA_E_CONSISTENTE');
    expect(dataDva.diagnosticoCpc09).toContain('Riqueza Gerada a Distribuir: R$ 11500000.00');
  });

  it('2. Deve apurar JCP dedutivel sobre PL ajustado pela TLP com ganho fiscal liquido de 19% conforme Leis 9.249/95 e 14.789/23', () => {
    const resJcp = processInterestOnOwnCapitalJcpTaxEngine({
      empresaCnpj: '12.345.678/0001-90',
      anoCalendario: 2026,
      capitalSocialIntegralizadoBrl: 20000000.00, // R$ 20M
      reservasDeLucrosElegiveisBrl: 10000000.00, // + R$ 10M
      reservaIncentivosFiscaisExcluidasLei14789Brl: 2000000.00, // - R$ 2M -> PL Ajustado = R$ 28M
      taxaTlpTjlpAnualPercent: 6.80, // 6.80% sobre R$ 28M = R$ 1.904.000,00 JCP
      lucroLiquidoExercicioAntesJcpBrl: 6000000.00, // Limite 50% = R$ 3M (JCP R$ 1.904k está abaixo)
      lucrosAcumuladosEReservasBrl: 10000000.00
    });

    const dataJcp = unwrap(resJcp);
    expect(dataJcp.patrimonioLiquidoAjustadoBaseJcpBrl).toBe(28000000.00);
    expect(dataJcp.valorJcpCalculadoPelaTlpBrl).toBe(1904000.00);
    expect(dataJcp.valorJcpDedutivelMaximoBrl).toBe(1904000.00);
    expect(dataJcp.economiaTributariaIrpjCsllBrl).toBe(647360.00); // 34% de R$ 1.904.000,00
    expect(dataJcp.irrfRetidoFonte15PercentBrl).toBe(285600.00); // 15% de R$ 1.904.000,00
    expect(dataJcp.ganhoFiscalLiquidoEfetivoBrl).toBe(361760.00); // 647.360 - 285.600 = 361.760 (19% líquido)
    expect(dataJcp.statusDedutibilidade).toBe('JCP_DEDUTIVEL_LUCRO_REAL_CONFORME');
    expect(dataJcp.diagnosticoJcp).toContain('Ganho Tributario Liquido: R$ 361760.00');
  });
});
