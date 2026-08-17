import { describe, it, expect } from 'vitest';
import {
  processAgroCprForeignCurrencyEngine,
  processRuralInsuranceSubsidyPsrEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: CPR em Moeda Estrangeira (Lei 13.986/20) & Seguro Rural (PSR / MAPA)', () => {
  it('1. Deve registrar CPR Financeira em USD e apurar variacao cambial passiva (CPC 48)', () => {
    const resCpr = processAgroCprForeignCurrencyEngine({
      produtorRuralCnpjCpf: '10.000.000/0001-00',
      culturaAgricola: 'SOJA',
      volumeMoedaEstrangeiraUsd: 2000000.00, // US$ 2M
      taxaCambioEmissaoBrl: 5.40, // R$ 10.800.000,00
      taxaCambioFechamentoBrl: 5.60, // R$ 11.200.000,00 -> Variação = R$ 400k
      prazoMesesLiquidacao: 12,
      registradoraAutorizadaBacen: 'B3'
    });

    const dataCpr = unwrap(resCpr);
    expect(dataCpr.valorOriginalEmissaoBrl).toBe(10800000.00);
    expect(dataCpr.valorAtualizadoFechamentoBrl).toBe(11200000.00);
    expect(dataCpr.variacaoCambialPassivaBrl).toBe(400000.00);
    expect(dataCpr.registroNumeroCprB3).toContain('CPR-FX-2026-');
    expect(dataCpr.statusRegistroCpr).toBe('CPR_FINANCEIRA_DOLAR_REGISTRADA_LEI_13986');
    expect(dataCpr.diagnosticoCpr).toContain('Variacao Cambial: R$ 400.000');
  });

  it('2. Deve apurar subvencao federal de 40% ao premio do seguro rural com IOF 0% (PSR / MAPA)', () => {
    const resPsr = processRuralInsuranceSubsidyPsrEngine({
      apoliceSeguroRuralNumero: 'APOLICE-PSR-MAPA-2026-999',
      produtorRuralNome: 'Agropecuária Vale Verde Ltda',
      valorPremioTotalSeguroBrl: 500000.00, // R$ 500k
      percentualSubvencaoPsrPercent: 40.0 // 40% = R$ 200k subvenção -> Líquido = R$ 300k
    });

    const dataPsr = unwrap(resPsr);
    expect(dataPsr.valorSubvencaoGovernoFederalBrl).toBe(200000.00);
    expect(dataPsr.valorPremioLiquidoProdutorBrl).toBe(300000.00);
    expect(dataPsr.aliquotaIofAplicavelPercent).toBe(0.0);
    expect(dataPsr.statusApolicePsr).toBe('APOLICE_SUBVENCIONADA_MAPA_PSR_HOMOLOGADA');
    expect(dataPsr.diagnosticoPsr).toContain('Premio Efetivo Produtor: R$ 300.000 (IOF 0%)');
  });
});
