import { describe, it, expect } from 'vitest';
import {
  processBiologicalAssetsFairValueDecompositionCpc29,
  processFcoConstitutionalFundTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Valor Justo Biológico (CPC 29) & Subvenções do FCO (Lei 7.827/89)', () => {
  it('1. Deve decompor o valor justo do rebanho em mudanca fisica vs mudanca de preco conforme CPC 29 item 50', () => {
    const resBio = processBiologicalAssetsFairValueDecompositionCpc29({
      loteRebanhoId: 'REB-NELORE-CONFINA-01',
      categoriaAnimal: 'Bovinos de Corte - Nelore Confinamento',
      quantidadeCabecasInicio: 1000,
      pesoMedioInicioKg: 360, // 24 @ -> 24.000 @ * R$ 209,00 líq = R$ 5.016.000,00
      precoArrobaInicioBrl: 220.00,
      quantidadeCabecasFim: 1000,
      pesoMedioFimKg: 510, // 34 @ -> 34.000 @ * R$ 228,00 líq = R$ 7.752.000,00 -> Variação Total = R$ 2.736.000,00
      precoArrobaFimBrl: 240.00,
      custosEstimadosPontoVendaPercent: 5.0 // 95% líquido
    });

    const dataBio = unwrap(resBio);
    expect(dataBio.valorJustoInicialLiquidoBrl).toBe(5016000.00);
    expect(dataBio.valorJustoFinalLiquidoBrl).toBe(7752000.00);
    expect(dataBio.variacaoTotalValorJustoBrl).toBe(2736000.00);
    expect(dataBio.variacaoFisicaBiologicaCrescimentoBrl).toBe(2090000.00); // 10.000 @ ganhas * R$ 209 líq
    expect(dataBio.variacaoPrecoMercadoBrl).toBe(646000.00); // 34.000 @ * (R$ 228 - R$ 209 = R$ 19)
    expect(dataBio.statusConformidadeCpc29Item50).toBe('DECOMPOSICAO_VALOR_JUSTO_CONFORME');
    expect(dataBio.diagnosticoCpc29).toContain('Mudanca Fisica/Crescimento: R$ 2090000.00 | Mudanca de Preco Mercado: R$ 646000.00');
  });

  it('2. Deve apurar subvencao de encargos do FCO Centro-Oeste e exclusao no LALUR para Reserva de Incentivos no PL', () => {
    const resFco = processFcoConstitutionalFundTaxEngine({
      contratoFinanciamentoId: 'FCO-AGRO-2026-MT-099',
      empresaCnpj: '12.345.678/0001-90',
      estadoUf: 'MT',
      valorFinanciadoBrl: 8000000.00, // R$ 8M
      taxaJurosMercadoPercent: 14.5, // 14.5% = R$ 1.160.000,00
      taxaJurosFcoSubvencionadaPercent: 8.5, // 8.5% = R$ 680k
      bonusAdimplenciaPercent: 15.0 // 15% bônus -> Juros FCO = R$ 578.000,00 -> Subvenção = R$ 582.000,00
    });

    const dataFco = unwrap(resFco);
    expect(dataFco.valorFinanciadoBrl).toBe(8000000.00);
    expect(dataFco.jurosNominaisMercadoBrl).toBe(1160000.00);
    expect(dataFco.jurosEfetivosFcoComBonusBrl).toBe(578000.00);
    expect(dataFco.valorSubvencaoInvestimentoFcoBrl).toBe(582000.00); // 1.16M - 578k
    expect(dataFco.economiaTributariaIrpjCsllBrl).toBe(197880.00); // 34% de R$ 582k
    expect(dataFco.destinacaoReservaIncentivosFiscaisPlBrl).toBe(582000.00);
    expect(dataFco.statusIsencaoLalur).toBe('EXCLUSAO_LALUR_ART30_LEI12973_DEFERIDA');
    expect(dataFco.diagnosticoFco).toContain('Subvencao/Ganho Economico: R$ 582000.00 destinada a Reserva de Incentivos');
  });
});
