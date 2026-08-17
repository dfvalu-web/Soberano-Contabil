import { describe, it, expect } from 'vitest';
import {
  evaluateCryptoAssetAccountingCpc04,
  processNaturalGasLngTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Criptoativos CPC 04 / IFRIC 2019 & Nova Lei do Gás Natural e GNL (Lei 14.134/21)', () => {
  it('1. Deve classificar criptoativos como intangivel ou estoque e apurar staking rewards (CPC 04 / IFRIC 2019)', () => {
    // 1.1 Criptoativo Mantido como Investimento Intangível de Longo Prazo + Staking Rewards
    const resIntang = evaluateCryptoAssetAccountingCpc04({
      carteiraId: 'WALLET-ETH-01',
      criptoativoNome: 'Ethereum (ETH)',
      propositoNegocio: 'INVESTIMENTO_LONGO_PRAZO_INTANGIVEL',
      quantidadeTokens: 100.0,
      custoAquisicaoUnitarioBrl: 15000.00,
      cotacaoFechamentoUnitarioBrl: 18000.00,
      recompensasStakingRecebidasTokens: 2.5 // 2.5 ETH * 18k = 45k
    });

    const dataInt = unwrap(resIntang);
    expect(dataInt.propositoNegocio).toBe('INVESTIMENTO_LONGO_PRAZO_INTANGIVEL');
    expect(dataInt.custoTotalAquisicaoBrl).toBe(1500000.00);
    expect(dataInt.valorJustoAtualTotalBrl).toBe(1800000.00);
    expect(dataInt.ajusteValorJustoResultadoBrl).toBe(0); // Mantido ao custo no intangível
    expect(dataInt.receitaStakingRewardsBrl).toBe(45000.00);
    expect(dataInt.partidasDobradaAquisicaoEStaking.length).toBe(4);
    expect(dataInt.diagnosticoCpc04).toContain('Mantido ao custo no Ativo Intangível');

    // 1.2 Criptoativo Mantido para Trading (Estoque a Valor Justo - CPC 16 / IFRIC 2019)
    const resTrading = evaluateCryptoAssetAccountingCpc04({
      carteiraId: 'WALLET-BTC-TRADING',
      criptoativoNome: 'Bitcoin (BTC)',
      propositoNegocio: 'TRADING_BROKER_DEALER_ESTOQUE',
      quantidadeTokens: 10.0,
      custoAquisicaoUnitarioBrl: 300000.00,
      cotacaoFechamentoUnitarioBrl: 350000.00 // Ganho de 500k
    });

    const dataTrd = unwrap(resTrading);
    expect(dataTrd.propositoNegocio).toBe('TRADING_BROKER_DEALER_ESTOQUE');
    expect(dataTrd.ajusteValorJustoResultadoBrl).toBe(500000.00);
    expect(dataTrd.diagnosticoCpc04).toContain('Ajuste de Valor Justo na DRE');
  });

  it('2. Deve apurar ICMS diferido na malha e creditos de PIS/COFINS (9,25%) na cadeia do gas natural (Lei 14.134/21)', () => {
    const resGas = processNaturalGasLngTaxEngine({
      operacaoId: 'GAS-01',
      agenteCadeia: 'CONSUMIDOR_LIVRE_TERMELETRICA',
      volumeMetrosCubicosM3: 1000000.0, // 1 milhão de m³
      valorTotalOperacaoBrl: 2000000.00,
      aliquotaIcmsDiferidoPercent: 12.0
    });

    const dataGas = unwrap(resGas);
    expect(dataGas.icmsDiferidoGasodutoBrl).toBe(240000.00);
    expect(dataGas.pisNaoCumulativoDevidoBrl).toBe(33000.00);
    expect(dataGas.cofinsNaoCumulativoDevidoBrl).toBe(152000.00);
    expect(dataGas.totalPisCofinsDevidoBrl).toBe(185000.00);
    expect(dataGas.creditoAproveitavelIndustriaBrl).toBe(185000.00);
    expect(dataGas.diagnosticoFiscal).toContain('Nova Lei do Gás');
  });
});
