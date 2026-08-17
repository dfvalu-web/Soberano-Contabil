import { describe, it, expect } from 'vitest';
import {
  processCarveOutFinancialStatementsCpc18,
  processZfmCreditoEstimuloIcmsAmEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Carve-Out Statements (CPC 18/IFRS) & ZFM Crédito Estímulo ICMS AM', () => {
  it('1. Deve gerar demonstracoes contabeis combinadas de cisao com push-down accounting (CPC 18)', () => {
    const resCarve = processCarveOutFinancialStatementsCpc18({
      unidadeNegocioId: 'BU-SAAS-01',
      unidadeNegocioNome: 'Divisão de Software Corporativo e IA',
      empresaMatrizNome: 'Soberano Holdings S.A.',
      anoExercicio: 2026,
      receitaOperacionalBrutaBrl: 50000000.00, // 50M
      custosDiretosBrl: 15000000.00, // 15M
      despesasOperacionaisDiretasBrl: 12000000.00, // 12M
      despesasCorporativasCompartilhadasPushDownBrl: 2500000.00, // 2.5M
      ativosDiretosAlocadosBrl: 50000000.00, // 50M
      passivosDiretosAlocadosBrl: 12000000.00 // 12M -> PL = 38M
    });

    const dataCarve = unwrap(resCarve);
    expect(dataCarve.ebitdaCarveOutBrl).toBe(15875000.00); // 45.375M - 15M - 14.5M = 15.875M
    expect(dataCarve.patrimonioLiquidoAtribuivelBrl).toBe(38000000.00); // 50M - 12M
    expect(dataCarve.margemEbitdaPercent).toBe(34.99); // 15.875M / 45.375M ~ 34.99%
    expect(dataCarve.diagnosticoCarveOut).toContain('EBITDA Carve-Out: R$ 15875000.00');
  });

  it('2. Deve apurar credito estimulo de ICMS (75%) e deducoes FTI e FMPES no Polo Industrial de Manaus (Lei AM 2.826/03)', () => {
    const resZfm = processZfmCreditoEstimuloIcmsAmEngine({
      fabricaId: 'PIM-ELETRO-01',
      fabricaNome: 'Soberano Eletroeletrônicos da Amazônia Ltda',
      competencia: '2026-04',
      icmsDebitoSaidasBrl: 15000000.00, // 15M
      icmsCreditoEntradasBrl: 5000000.00, // 5M -> Saldo Devedor = 10M
      percentualCreditoEstimuloAmPercent: 75.0, // 75%
      aliquotaFtiPercent: 2.0, // 2%
      aliquotaFmpesPercent: 6.0 // 6%
    });

    const dataZfm = unwrap(resZfm);
    expect(dataZfm.saldoDevedorIcmsBrutoBrl).toBe(10000000.00);
    expect(dataZfm.valorCreditoEstimuloApropriadoBrl).toBe(7500000.00); // 75% de 10M
    expect(dataZfm.icmsEfetivoARecolherSefazAmBrl).toBe(2500000.00); // 10M - 7.5M
    expect(dataZfm.contribuicaoFmpesDevidaBrl).toBe(450000.00); // 6% de 7.5M = 450k
    expect(dataZfm.contribuicaoFtiDevidaBrl).toBe(150000.00); // 2% de 7.5M = 150k
    expect(dataZfm.economiaTributariaTotalBrl).toBe(6900000.00); // 7.5M - 600k
    expect(dataZfm.diagnosticoZfmIcmsAm).toContain('Economia Tributaria Liquida: R$ 6900000.00');
  });
});
