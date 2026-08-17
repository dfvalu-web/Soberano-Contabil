import { describe, it, expect } from 'vitest';
import {
  calculateOtherComprehensiveIncomeAapCpc26,
  calculateDrawbackIntegratedTaxExemptions,
  unwrap
} from '../src/index.js';

describe('TESTES: AAP & Outros Resultados Abrangentes (CPC 26) & Drawback Integrado (SECEX 44/2020)', () => {
  it('1. Deve apurar AAP bruto, tributos diferidos de 34% e reciclagem para DRE (CPC 26 R1)', () => {
    const res = calculateOtherComprehensiveIncomeAapCpc26({
      empresaId: 'HOLDING-GLOBAL-01',
      anoExercicio: 2026,
      variacaoCambialInvestimentoExteriorBrl: 2000000.00, // CPC 02
      variacaoValorJustoHedgeFluxoCaixaBrl: 1500000.00,  // CPC 48
      ganhoOuPerdaAtuarialPrevidenciaBrl: 500000.00,      // CPC 33 (Total Bruto = 4M)
      aliquotaTributosDiferidosPercent: 34,               // 34% = 1.36M (Líquido = 2.64M)
      reciclagemParaResultadoRealizadaBrl: 800000.00      // Reciclagem de 800k para DRE
    });

    const data = unwrap(res);
    expect(data.totalAapBrutoNoPlBrl).toBe(4000000.00);
    expect(data.tributosDiferidosSobreAap34PercentBrl).toBe(1360000.00);
    expect(data.totalAapLiquidoTributosNoPlBrl).toBe(2640000.00);
    expect(data.valorRecicladoParaResultadoDREBrl).toBe(800000.00);
    expect(data.partidasDobradaAap.length).toBe(5);
    expect(data.diagnosticoCpc26).toContain('Demonstração do Resultado Abrangente (DRA)');
  });

  it('2. Deve apurar desoneracoes tributarias aduaneiras e agregacao de valor no Drawback Integrado (Portaria SECEX 44)', () => {
    const res = calculateDrawbackIntegratedTaxExemptions({
      atoConcessorioNumero: 'AC-SECEX-2026-0044',
      modalidade: 'DRAWBACK_SUSPENSAO',
      valorInsumosImportadosCifUsd: 2000000.00, // USD 2M @ 5.00 = R$ 10.000.000,00
      valorInsumosNacionaisBrl: 0,
      taxaCambialPtax: 5.00,
      valorCompromissoExportacaoFobUsd: 5000000.00 // USD 5M @ 5.00 = R$ 25.000.000,00 (+150%)
    });

    const data = unwrap(res);
    expect(data.valorTotalInsumosCifBrl).toBe(10000000.00);
    expect(data.valorCompromissoExportacaoFobBrl).toBe(25000000.00);
    expect(data.tributosSuspensosIsentos.impostoImportacaoSuspenso14PercentBrl).toBe(1400000.00); // 14%
    expect(data.tributosSuspensosIsentos.ipiSuspenso10PercentBrl).toBe(1000000.00); // 10%
    expect(data.tributosSuspensosIsentos.pisCofinsImportacaoSuspenso11_75PercentBrl).toBe(1175000.00); // 11.75%
    expect(data.tributosSuspensosIsentos.afrmmSuspenso8PercentBrl).toBe(800000.00); // 8%
    expect(data.tributosSuspensosIsentos.icmsDiferido18PercentBrl).toBe(1800000.00); // 18%
    expect(data.tributosSuspensosIsentos.totalDesoneracaoDrawbackBrl).toBe(6175000.00);
    expect(data.indiceAgregacaoValorPercent).toBe(150.0);
    expect(data.diagnosticoDrawback).toContain('Ato Concessório SECEX nº AC-SECEX-2026-0044');
  });
});
