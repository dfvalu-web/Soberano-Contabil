import { describe, it, expect } from 'vitest';
import {
  evaluateCarbonCreditsAccountingCpc48,
  processCbioRenovabioTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Créditos de Carbono (CPC 48/04) & CBIOs RenovaBio IRRF 15% (Lei 13.576/17)', () => {
  it('1. Deve classificar creditos de carbono como Intangivel (CPC 04) ou Instrumento FVTPL com MTM (CPC 48)', () => {
    // 1.1 Compensação de Emissões Próprias (CPC 04)
    const resComp = evaluateCarbonCreditsAccountingCpc48({
      operacaoId: 'CARB-01',
      empresaNome: 'Soberano Indústria Sustentável S.A.',
      padraoCredito: 'VCS Verra Verified Carbon Standard',
      finalidade: 'COMPENSACAO_EMISSOES_PROPRIAS',
      quantidadeCreditosTco2e: 50000,
      custoAquisicaoUnitarioBrl: 40.00 // 2.000.000
    });

    const dataComp = unwrap(resComp);
    expect(dataComp.classificacaoContabil).toContain('Ativo Intangível (CPC 04)');
    expect(dataComp.valorTotalAquisicaoBrl).toBe(2000000.00);
    expect(dataComp.variacaoValorJustoDrebBrl).toBe(0);
    expect(dataComp.partidasDobrada.length).toBe(2);

    // 1.2 Negociação / Trading de Mercado (CPC 48 FVTPL)
    const resTrade = evaluateCarbonCreditsAccountingCpc48({
      operacaoId: 'CARB-02',
      empresaNome: 'Soberano Trading Ambiental S.A.',
      padraoCredito: 'Gold Standard Carbon Credits',
      finalidade: 'NEGOCIACAO_TRADING_MERCADO',
      quantidadeCreditosTco2e: 100000,
      custoAquisicaoUnitarioBrl: 30.00, // Custo = 3.000.000
      valorJustoUnitarioFechamentoBrl: 35.00 // Valor Justo = 3.500.000 -> Ganho = 500.000
    });

    const dataTrade = unwrap(resTrade);
    expect(dataTrade.classificacaoContabil).toContain('Ativo Financeiro a Valor Justo');
    expect(dataTrade.valorJustoAtualizadoBrl).toBe(3500000.00);
    expect(dataTrade.variacaoValorJustoDrebBrl).toBe(500000.00);
    expect(dataTrade.partidasDobrada.length).toBe(4);
    expect(dataTrade.diagnosticoCpc).toContain('CPC 48 - Trading / FVTPL');
  });

  it('2. Deve aplicar tributacao definitiva e exclusiva de IRRF 15% na alienacao de CBIOs (Lei 13.576/17 Art. 15-A)', () => {
    const resCbio = processCbioRenovabioTaxEngine({
      operacaoId: 'CBIO-2026-01',
      emissorPrimarioNome: 'Bioenergia Soberana Usina de Etanol S.A.',
      quantidadeCbiosVendidos: 100000, // 100 mil CBIOs
      precoVendaPorCbioBrl: 100.00 // Receita = 10.000.000
    });

    const dataCbio = unwrap(resCbio);
    expect(dataCbio.receitaBrutaAlienacaoCbioBrl).toBe(10000000.00);
    expect(dataCbio.aliquotaIrrfDefinitivoPercent).toBe(15.0);
    expect(dataCbio.valorIrrfRetidoFonteBrl).toBe(1500000.00);
    expect(dataCbio.aliquotaPisPercent).toBe(0);
    expect(dataCbio.aliquotaCofinsPercent).toBe(0);
    expect(dataCbio.isExclusaoLalurLacsObrigatoria).toBe(true);
    expect(dataCbio.valorLiquidoRecebidoBrl).toBe(8500000.00);
    expect(dataCbio.diagnosticoFiscal).toContain('IRRF Definitivo na Fonte (15%)');
  });
});
