import { describe, it, expect } from 'vitest';
import {
  processForeignSubsidiariesCurrencyTranslationCpc02,
  processAgroindustryPisCofinsPresumedCreditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Conversão de Moeda Estrangeira (CPC 02) & Crédito Presumido Agro (PIS/COFINS)', () => {
  it('1. Deve converter demonstracoes de subsidiaria no exterior com CTA no PL conforme CPC 02 / IAS 21', () => {
    const resTranslation = processForeignSubsidiariesCurrencyTranslationCpc02({
      subsidiariaId: 'SUB-USA-01',
      subsidiariaNome: 'Soberano Global Holdings LLC',
      moedaFuncional: 'USD',
      ativosTotaisMoedaEstrangeira: 5000000.00, // US$ 5M * 5.60 = R$ 28M
      passivosTotaisMoedaEstrangeira: 2000000.00, // US$ 2M * 5.60 = R$ 11.2M -> PL = R$ 16.8M
      patrimonioLiquidoHistoricoBrl: 15000000.00, // R$ 15M histórico
      lucroLiquidoAnoMoedaEstrangeira: 500000.00, // US$ 500k * 5.35 = R$ 2.675M DRE
      taxaCambioFechamentoBrl: 5.60,
      taxaCambioMediaPeriodoBrl: 5.35
    });

    const dataTranslation = unwrap(resTranslation);
    expect(dataTranslation.ativosConvertidosBrl).toBe(28000000.00);
    expect(dataTranslation.passivosConvertidosBrl).toBe(11200000.00);
    expect(dataTranslation.patrimonioLiquidoFechamentoBrl).toBe(16800000.00);
    expect(dataTranslation.lucroLiquidoConvertidoDreBrl).toBe(2675000.00);
    expect(dataTranslation.ajusteAcumuladoConversaoCtaPlBrl).toBe(-875000.00); // 16.8M - (15M + 2.675M) = -875k
    expect(dataTranslation.statusConversao).toBe('CONVERSAO_CPC02_HOMOLOGADA_COM_SUCESSO');
    expect(dataTranslation.diagnosticoCpc02).toContain('Ajuste de Avaliacao Patrimonial (CTA no PL): R$ -875000.00');
  });

  it('2. Deve apurar credito presumido de PIS (0.99%) e COFINS (4.56%) em compras de graos/carnes de produtor PF', () => {
    const resAgro = processAgroindustryPisCofinsPresumedCreditEngine({
      empresaCnpj: '12.345.678/0001-90',
      cadeiaProdutiva: 'GRAOS_SOJA_MILHO_LEI10925',
      valorAquisicaoInsumosProdutorPfBrl: 5000000.00, // R$ 5M
      aliquotaPercentualPresumidoSobrePadraoPercent: 60.0 // 60% de 1.65% e 7.60%
    });

    const dataAgro = unwrap(resAgro);
    expect(dataAgro.aliquotaEfetivaPisPercent).toBe(0.99); // 60% * 1.65
    expect(dataAgro.aliquotaEfetivaCofinsPercent).toBe(4.56); // 60% * 7.60
    expect(dataAgro.creditoPresumidoPisBrl).toBe(49500.00); // 0.99% de R$ 5M
    expect(dataAgro.creditoPresumidoCofinsBrl).toBe(228000.00); // 4.56% de R$ 5M
    expect(dataAgro.totalCreditoPresumidoApropriadoBrl).toBe(277500.00); // 49.5k + 228k
    expect(dataAgro.escrituracaoEfdContribuicoes.registroM100Pis).toBe('M100_CREDITO_PRESUMIDO_AGRO_PIS');
    expect(dataAgro.diagnosticoAgroPisCofins).toContain('Credito Total Apropriado: R$ 277500.00 (Ressarcivel via PER/DCOMP)');
  });
});
