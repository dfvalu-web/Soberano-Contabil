import { describe, it, expect } from 'vitest';
import {
  processExtendedWarrantyLongTermProvisionsCpc25,
  processDifalNonTaxpayerFcpTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Garantias Estendidas (CPC 25/47) & DIFAL Não Contribuinte com FCP (LC 190/22)', () => {
  it('1. Deve calcular provisao de garantia de fabrica a valor presente (CPC 25) e receita diferida de garantia estendida (CPC 47)', () => {
    // 1.1 Provisão de fábrica CPC 25
    const resFabrica = processExtendedWarrantyLongTermProvisionsCpc25({
      contratoId: 'GAR-FAB-001',
      tipoGarantia: 'GARANTIA_LEGAL_FABRICA_CPC25',
      volumeVendasBrl: 1000000.00,
      prazoMeses: 24,
      taxaSinistralidadeEsperadaPercent: 3.5, // R$ 35k nominal
      taxaDescontoAvpAnualPercent: 10.5
    });

    const dataFabrica = unwrap(resFabrica);
    expect(dataFabrica.montanteTotalNominalBrl).toBe(35000.00);
    expect(dataFabrica.passivoProvisaoPresenteBrl).toBe(28664.44);
    expect(dataFabrica.ajusteValorPresenteAvpBrl).toBe(6335.56);
    expect(dataFabrica.diagnosticoGarantia).toContain('Provisao Nominal: R$ 35000.00 (AVP Desconto: R$ 6335.56 -> Passivo Presente Reconhecido: R$ 28664.44)');

    // 1.2 Garantia estendida CPC 47
    const resEstendida = processExtendedWarrantyLongTermProvisionsCpc25({
      contratoId: 'GAR-EST-001',
      tipoGarantia: 'GARANTIA_ESTENDIDA_CONTRATUAL_CPC47',
      volumeVendasBrl: 1000000.00,
      prazoMeses: 24,
      taxaSinistralidadeEsperadaPercent: 3.5,
      taxaDescontoAvpAnualPercent: 10.5
    });

    const dataEstendida = unwrap(resEstendida);
    expect(dataEstendida.receitaDiferidaPassivoBrl).toBe(1000000.00);
    expect(dataEstendida.apropriacaoMensalDreBrl).toBe(41666.67);
    expect(dataEstendida.diagnosticoGarantia).toContain('Apropriacao Linear para DRE: R$ 41666.67/mes');
  });

  it('2. Deve apurar DIFAL com base de calculo dupla e FCP de 2% para nao contribuinte conforme LC 190/2022', () => {
    const resDifal = processDifalNonTaxpayerFcpTaxEngine({
      documentoFiscalNumero: 'NFe-889911',
      ufOrigem: 'SP',
      ufDestino: 'BA',
      valorOperacaoComFreteIpiBrl: 10000.00,
      aliquotaInterestadualOrigemPercent: 7.0, // 7% interestadual SP->BA
      aliquotaInternaDestinoPercent: 18.0, // 18% interna BA
      aliquotaFcpPercent: 2.0 // 2% FCP BA
    });

    const dataDifal = unwrap(resDifal);
    // Base 1 = 10.000 - 700 = 9.300
    // Base 2 = 9.300 / (1 - 0.20) = 11.625,00
    expect(dataDifal.icmsOrigemBrl).toBe(700.00);
    expect(dataDifal.baseCalculoDuplaDestinoBrl).toBe(11625.00);
    expect(dataDifal.icmsDestinoTotalBrl).toBe(2092.50); // 18% de 11.625
    expect(dataDifal.fcpDestinoBrl).toBe(232.50); // 2% de 11.625
    expect(dataDifal.difalLiquidoDestinoBrl).toBe(1392.50); // 2.092,50 - 700,00
    expect(dataDifal.totalRecolhimentoGnreDestinoBrl).toBe(1625.00); // 1.392,50 + 232,50
    expect(dataDifal.escrituracaoSpedBlocoC101.vlIcmsDifalDest).toBe(1392.50);
    expect(dataDifal.escrituracaoSpedBlocoC101.vlIcmsFcpDest).toBe(232.50);
    expect(dataDifal.diagnosticoDifal).toContain('Total GNRE: R$ 1625.00');
  });
});
