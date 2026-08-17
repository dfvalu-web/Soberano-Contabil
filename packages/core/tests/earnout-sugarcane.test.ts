import { describe, it, expect } from 'vitest';
import {
  evaluateContingentEarnoutAccountingCpc15,
  processSugarcaneEthanolPresumedCreditTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Earn-out em M&A (CPC 15/48) & Crédito Presumido Cana/Etanol (Lei 12.865/13)', () => {
  it('1. Deve remensurar passivo de earn-out a valor justo na DRE mantendo goodwill inalterado (CPC 15 R1 & CPC 48)', () => {
    // 1.1 Metas batidas -> Aumento do Passivo / Despesa na DRE
    const resAumento = evaluateContingentEarnoutAccountingCpc15({
      aquisicaoId: 'ACQ-01',
      adquirenteNome: 'Soberano Capital M&A S.A.',
      adquiridaNome: 'Tech Inovação Ltda',
      valorEarnoutEstimadoInicialBrl: 10000000.00,
      metaEbitdaContratadaBrl: 20000000.00,
      ebitdaEfetivoAlcancadoBrl: 25000000.00, // Superou meta
      valorEarnoutRemensuradoFechamentoBrl: 14000000.00 // Aumento de 4M
    });

    const dataAumento = unwrap(resAumento);
    expect(dataAumento.novoValorJustoPassivoEarnoutBrl).toBe(14000000.00);
    expect(dataAumento.variacaoValorJustoResultadoDrebBrl).toBe(4000000.00);
    expect(dataAumento.isGoodwillInalterado).toBe(true);
    expect(dataAumento.partidasDobradaRemensuracao.length).toBe(2);
    expect(dataAumento.diagnosticoCpc15e48).toContain('GOODWILL INALTERADO');

    // 1.2 Metas frustradas -> Redução do Passivo / Ganho na DRE
    const resReducao = evaluateContingentEarnoutAccountingCpc15({
      aquisicaoId: 'ACQ-02',
      adquirenteNome: 'Soberano Capital M&A S.A.',
      adquiridaNome: 'Varejo Beta Ltda',
      valorEarnoutEstimadoInicialBrl: 5000000.00,
      metaEbitdaContratadaBrl: 10000000.00,
      ebitdaEfetivoAlcancadoBrl: 4000000.00, // Não atingiu
      valorEarnoutRemensuradoFechamentoBrl: 1000000.00 // Redução de 4M
    });

    const dataReducao = unwrap(resReducao);
    expect(dataReducao.variacaoValorJustoResultadoDrebBrl).toBe(-4000000.00);
    expect(dataReducao.novoValorJustoPassivoEarnoutBrl).toBe(1000000.00);
  });

  it('2. Deve apurar credito presumido agroindustrial de PIS/COFINS sobre a compra de cana-de-acucar (Lei 12.865/13 Art. 31)', () => {
    const resCana = processSugarcaneEthanolPresumedCreditTaxEngine({
      usinaId: 'USINA-01',
      usinaNome: 'Usina Soberana Bioetanol & Açúcar S.A.',
      valorAquisicaoCanaProdutorRuralBrl: 50000000.00, // 50M
      percentualCreditoPresumidoPercent: 50.0 // 50% de 9,25% = 4,625%
    });

    const dataCana = unwrap(resCana);
    expect(dataCana.aliquotaEfetivaCreditoPresumidoPercent).toBe(4.625);
    expect(dataCana.valorCreditoPisBrl).toBe(412500.00); // 50M * 0.825%
    expect(dataCana.valorCreditoCofinsBrl).toBe(1900000.00); // 50M * 3.8%
    expect(dataCana.valorCreditoPresumidoPisCofinsBrl).toBe(2312500.00); // Total 4,625%
    expect(dataCana.diagnosticoFiscal).toContain('CRÉDITO PRESUMIDO AGROINDUSTRIAL (4.625%)');
  });
});
