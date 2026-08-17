import { describe, it, expect } from 'vitest';
import {
  processBetsGamingTaxEngineLaw14790,
  processCooperativesTypicalAtypicalTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Apostas / Bets (Lei 14.790/23) & Cooperativas (Lei 5.764/71)', () => {
  it('1. Deve apurar GGR (12%), IRRF sobre premios (15%) e taxa SPA/MF para bets (Lei 14.790/23)', () => {
    const resBet = processBetsGamingTaxEngineLaw14790({
      operadorBetId: 'BET-01',
      operadorNome: 'Soberano Apostas & Jogos Online S.A.',
      totalApostasArrecadadasBrl: 100000000.00, // 100M apostas
      totalPremiosPagosApostadoresBrl: 85000000.00, // 85M prêmios -> GGR = 15M
      totalPremiosIndividuaisTributaveisBrl: 10000000.00 // 10M tributáveis
    });

    const dataBet = unwrap(resBet);
    expect(dataBet.grossGamingRevenueGgrBrl).toBe(15000000.00); // 15M GGR
    expect(dataBet.contribuicaoSocialGgr12PercentBrl).toBe(1800000.00); // 12% de 15M = 1.8M
    expect(dataBet.irrfSobrePremios15PercentBrl).toBe(1500000.00); // 15% de 10M = 1.5M
    expect(dataBet.taxaFiscalizacaoSpaMfBrl).toBe(50000.00);
    expect(dataBet.totalTributosApuradosBrl).toBe(3350000.00); // 1.8M + 1.5M + 50k
    expect(dataBet.diagnosticoFiscal).toContain('12% GGR = R$ 1800000.00');
  });

  it('2. Deve segregar ato cooperativo tipico isento vs ato atipico tributado (Lei 5.764/71)', () => {
    const resCoop = processCooperativesTypicalAtypicalTaxEngine({
      cooperativaId: 'COOP-AGRO-01',
      cooperativaNome: 'Cooperativa Agropecuária Soberana Ltda',
      receitaAtoCooperativoTipicoBrl: 80000000.00, // 80M
      sobraLiquidaAtoTipicoBrl: 10000000.00, // 10M Sobras isentas
      receitaAtoCooperativoAtipicoBrl: 20000000.00, // 20M Atípico
      lucroLiquidoAtoAtipicoBrl: 3000000.00 // 3M Lucro atípico
    });

    const dataCoop = unwrap(resCoop);
    expect(dataCoop.sobrasTipicasIsentasBrl).toBe(10000000.00);
    expect(dataCoop.irpjDevidoAtoAtipicoBrl).toBe(726000.00); // 15% de 3M (450k) + 10% de 2.76M (276k) = 726k
    expect(dataCoop.csllDevidaAtoAtipicoBrl).toBe(270000.00); // 9% de 3M = 270k
    expect(dataCoop.pisCofinsDevidoAtipicoBrl).toBe(1850000.00); // 9,25% de 20M = 1.85M
    expect(dataCoop.totalTributosCooperativaBrl).toBe(2846000.00);
    expect(dataCoop.diagnosticoFiscal).toContain('100% ISENTAS DE IRPJ/CSLL');
  });
});
