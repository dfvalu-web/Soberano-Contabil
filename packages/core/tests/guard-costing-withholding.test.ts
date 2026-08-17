import { describe, it, expect } from 'vitest';
import {
  inspectBalanceIntegrity,
  calculateCostOfGoodsManufactured,
  calculateServiceWithholdings,
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Guardião de Integridade, Contabilidade de Custos (CPC 16) & Retenções na Fonte', () => {
  it('1. Deve inspecionar integridade de saldos contabeis e alertar sobre anomalias ou saldos invertidos', () => {
    const contas = createStandardChartOfAccounts('tenant-01');
    const engine = new DoubleEntryEngine(contas);

    engine.postEntry('tenant-01', '2026-01-10', 'Capital Social Inicial', [
      { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 200000.00 },
      { accountId: '2.3.1.01', accountCode: '2.3.1.01', accountName: 'Capital Social Subscrito', type: 'CREDIT', amount: 200000.00 }
    ]);

    const res = inspectBalanceIntegrity(engine.getAccounts(), engine.getEntries());
    const data = unwrap(res);

    expect(data.isTotalmenteIntegro).toBe(true);
    expect(data.totalAtivo).toBe(200000.00);
    expect(data.totalPatrimonioLiquido).toBe(200000.00);
    expect(data.diferencaEquacaoPatrimonial).toBe(0);
    expect(data.totalAnomalias).toBe(0);
  });

  it('2. Deve apurar Custo dos Produtos Vendidos (CPV - CPC 16) pelo custeio por absorcao integral', () => {
    const res = calculateCostOfGoodsManufactured({
      periodo: '2026-01',
      estoqueInicialMateriaPrima: 20000.00,
      comprasMateriaPrimaPeriodo: 80000.00,
      estoqueFinalMateriaPrima: 30000.00, // MP Consumida = 70.000,00
      maoDeObraDiretaModPeriodo: 40000.00,
      custosIndiretosFabricacaoCif: {
        energiaEletricaFabrica: 15000.00,
        depreciacaoMaquinasFabrica: 10000.00,
        manutencaoEInsumosIndiretos: 5000.00 // Total CIF = 30.000,00 => CPP = 140.000,00
      },
      estoqueInicialProdutosEmElaboracao: 10000.00,
      estoqueFinalProdutosEmElaboracao: 20000.00, // CPA = 10k + 140k - 20k = 130.000,00
      estoqueInicialProdutosAcabados: 50000.00,
      estoqueFinalProdutosAcabados: 40000.00 // CPV = 50k + 130k - 40k = 140.000,00
    });

    const data = unwrap(res);
    expect(data.materiaPrimaConsumidaMp).toBe(70000.00);
    expect(data.totalCustosIndiretosCif).toBe(30000.00);
    expect(data.custoProducaoPeriodoCpp).toBe(140000.00);
    expect(data.custoProducaoAcabadaCpa).toBe(130000.00);
    expect(data.custoProdutosVendidosCpv).toBe(140000.00);
    expect(data.partidasDobradaCpv.length).toBe(2);
  });

  it('3. Deve calcular retencoes tributarias federais (CSRF 4,65% e IRRF 1,5%) e municipais (ISS)', () => {
    const res = calculateServiceWithholdings({
      transacaoId: 'SERV-TI-001',
      tipoPapelEmpresa: 'TOMADORA_DE_SERVICOS',
      tipoServico: 'SERVICOS_PROFISSIONAIS_TI_CONSULTORIA',
      valorBrutoNotaFiscal: 10000.00,
      aliquotaIssMunicipalPercent: 5, // ISS = R$ 500,00
      optanteSimplesNacional: false
    });

    const data = unwrap(res);
    expect(data.valorBrutoNotaFiscal).toBe(10000.00);
    expect(data.retencoesFederais.irrfRetido).toBe(150.00); // 1.5%
    expect(data.retencoesFederais.csrfRetido).toBe(465.00); // 4.65% (PIS 65 + COFINS 300 + CSLL 100)
    expect(data.retencaoMunicipalIssqn.issRetido).toBe(500.00); // 5%
    expect(data.totalRetencoesSofridas).toBe(1115.00);
    expect(data.valorLiquidoFinanceiro).toBe(8885.00);
  });
});
