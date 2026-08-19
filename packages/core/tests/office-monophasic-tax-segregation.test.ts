import { describe, it, expect } from 'vitest';
import {
  processOfficeMonophasicTaxSegregationEngine,
  processOfficeMonophasicPgdasEfdAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Produtos Monofásicos PIS/COFINS (Lei 10.147/00 e Simples Nacional)', () => {
  it('1. Deve segregar receitas monofasicas de farmacia e calcular reducao do DAS com economia de R$ 558,00', () => {
    const resMono = processOfficeMonophasicTaxSegregationEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Drogaria & Farmácia Popular Ltda',
      ramoAtividade: 'FARMACIA_DROGARIA',
      faturamentoBrutoTotalBrl: 100000.00,
      receitaItensMonofasicosBrl: 80000.00, // 80k monofásico
      aliquotaEfetivaDasPercent: 4.5
    });

    const dataMono = unwrap(resMono);
    expect(dataMono.faturamentoBrutoTotalBrl).toBe(100000.00);
    expect(dataMono.receitaItensMonofasicosBrl).toBe(80000.00);
    expect(dataMono.receitaItensTributacaoNormalBrl).toBe(20000.00);
    expect(dataMono.valorDasSemSegregacaoBrl).toBe(4500.00); // 4.5% de 100k
    expect(dataMono.valorDasComSegregacaoCorretaBrl).toBe(3942.00); // 900 + 3042
    expect(dataMono.economiaTributariaMensalDasBrl).toBe(558.00); // 4500 - 3942
    expect(dataMono.statusSegregacao).toBe('PRODUTOS_MONOFASICOS_SEGREGADOS_COM_SUCESSO');
    expect(dataMono.diagnosticoMonofasico).toContain('Zero bitributação Lei 10.147/00');
  });

  it('2. Deve aplicar CST 04 e gerar registros na EFD-Contribuicoes e partidas dobradas de receita e DAS', () => {
    const resEfd = processOfficeMonophasicPgdasEfdAccountingEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Drogaria & Farmácia Popular Ltda',
      valorReceitaMonofasicaBrl: 80000.00,
      valorDasApuradoBrl: 3942.00
    });

    const dataEfd = unwrap(resEfd);
    expect(dataEfd.cstPisCofinsUtilizado).toBe('04_OPERACAO_TRIBUTAVEL_MONOFASICA_ALIQUOTA_ZERO');
    expect(dataEfd.registroEfdContribuicoes).toBe('REGISTRO_C170_C100_M100_M500');
    expect(dataEfd.partidaDobradaReceitaMonofasica).toContain('3.1.01.001 Receita Bruta de Vendas (Monofásicos)');
    expect(dataEfd.partidaDobradaProvisaoDas).toContain('2.1.02.001 Simples Nacional DAS a Recolher');
    expect(dataEfd.statusEscrituracao).toBe('ESCRITURACAO_MONOFASICA_CONCLUIDA');
    expect(dataEfd.diagnosticoEfd).toContain('CST 04');
  });
});
