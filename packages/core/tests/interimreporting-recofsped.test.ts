import { describe, it, expect } from 'vitest';
import {
  processInterimReportingEffectiveTaxRateCpc21,
  processRecofSpedCustomsBondedEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Demonstrações Intermediárias (CPC 21 / ITR) & RECOF-SPED (IN RFB 2.126/22)', () => {
  it('1. Deve apurar a taxa efetiva anual estimada (ETR) e a provisao de IRPJ/CSLL no 1T conforme CPC 21 / IAS 34', () => {
    const resInterim = processInterimReportingEffectiveTaxRateCpc21({
      empresaCnpj: '12.345.678/0001-90',
      trimestreRef: '1T',
      anoCalendario: 2026,
      lucroContabilAntesTributosTrimestreBrl: 4000000.00, // R$ 4M
      lucroContabilAnualEsperadoBrl: 16000000.00, // R$ 16M
      despesasNaoDedutiveisAnuaisEstimadasBrl: 1000000.00, // + R$ 1M
      exclusoesEIncentivosFiscaisAnuaisEstimadosBrl: 3000000.00 // - R$ 3M -> Base Anual = R$ 14M -> Imposto = 4.76M -> ETR = 29.75%
    });

    const dataInterim = unwrap(resInterim);
    expect(dataInterim.taxaEfetivaAnualEstimadaPercent).toBe(29.75);
    expect(dataInterim.despesaIrpjCsllTrimestreBrl).toBe(1190000.00); // 29.75% de R$ 4M
    expect(dataInterim.lucroLiquidoTrimestreAposTributosBrl).toBe(2810000.00); // 4M - 1.19M
    expect(dataInterim.statusConformidadeCpc21).toBe('APURACAO_ITR_CPC21_CONFORME');
    expect(dataInterim.diagnosticoCpc21).toContain('Taxa Efetiva Anual Estimada (ETR): 29.75%');
  });

  it('2. Deve apurar a suspensao tributaria integral de tributos federais e ICMS no RECOF-SPED com controle no Bloco K', () => {
    const resRecof = processRecofSpedCustomsBondedEngine({
      empresaCnpj: '12.345.678/0001-90',
      numeroAtoHabilitacaoRf: 'RECOF-2026-SP-0042',
      valorInsumosImportadosCifBrl: 10000000.00, // R$ 10M
      valorInsumosNacionaisAdquiridosBrl: 5000000.00, // R$ 5M -> Total = R$ 15M
      aliquotaMediaImpostoImportacaoPercent: 14.0, // R$ 1.4M
      aliquotaMediaIpiPercent: 10.0, // 10% de (10M + 1.4M) + 10% de 5M = 1.14M + 500k = 1.64M
      aliquotaMediaPisCofinsPercent: 9.25, // 9.25% de 15M = 1.3875M
      aliquotaMediaIcmsImportacaoPercent: 18.0, // 18% de 10M = 1.8M
      percentualProducaoDestinadaExportacaoPercent: 80.0
    });

    const dataRecof = unwrap(resRecof);
    expect(dataRecof.totalInsumosAdquiridosComSuspensaoBrl).toBe(15000000.00);
    expect(dataRecof.impostosFederaisSuspensosBrl).toBe(4427500.00); // 1.4M + 1.64M + 1.3875M
    expect(dataRecof.icmsImportacaoSuspensoBrl).toBe(1800000.00); // 1.8M
    expect(dataRecof.totalEconomiaFluxoCaixaSuspensaoBrl).toBe(6227500.00); // 4.4275M + 1.8M
    expect(dataRecof.statusHabilitacaoRecof).toBe('HABILITADO_RECOF_SPED_COMPLIANT');
    expect(dataRecof.controleBlocoKSpedFiscal.statusControleInformatizado).toBe('INTEGRADO_COM_SUCESSO');
    expect(dataRecof.diagnosticoRecofSped).toContain('Economia de Fluxo de Caixa: R$ 6227500.00 com controle no Bloco K');
  });
});
