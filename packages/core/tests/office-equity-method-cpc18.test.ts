import { describe, it, expect } from 'vitest';
import {
  processOfficeEquityMethodCpc18Engine,
  processOfficeEquityAccountingLalurEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Equivalência Patrimonial (MEP - CPC 18 e LALUR ECF)', () => {
  it('1. Deve apurar ganho de MEP de R$ 80.000,00 (40% de 200k), reducao por dividendos (R$ 20k) e saldo do investimento', () => {
    const resMep = processOfficeEquityMethodCpc18Engine({
      investidoraCnpj: '11.111.111/0001-11',
      investidoraRazaoSocial: 'Holding Empresarial Soberana S/A',
      investidaCnpj: '22.222.222/0001-22',
      investidaRazaoSocial: 'Logística Express Coligada Ltda',
      percentualParticipacaoSocietariaPercent: 40.0,
      patrimonioLiquidoInicialInvestidaBrl: 1000000.00,
      lucroLiquidoPeriodoInvestidaBrl: 200000.00,
      lucrosNaoRealizadosIntercompanyBrl: 0.00,
      dividendosDistribuidosInvestidaBrl: 50000.00
    });

    const dataMep = unwrap(resMep);
    expect(dataMep.percentualParticipacaoPercent).toBe(40.0);
    expect(dataMep.lucroLiquidoAjustadoInvestidaBrl).toBe(200000.00);
    expect(dataMep.valorResultadoEquivalenciaPatrimonialBrl).toBe(80000.00); // 40% de 200k
    expect(dataMep.tipoResultadoMep).toBe('GANHO_EQUIVALENCIA_POSITIVA');
    expect(dataMep.valorReducaoDividendosReceberBrl).toBe(20000.00); // 40% de 50k
    expect(dataMep.patrimonioLiquidoFinalInvestidaBrl).toBe(1150000.00); // 1M + 200k - 50k
    expect(dataMep.saldoFinalInvestimentoInvestidoraBrl).toBe(460000.00); // 40% de 1.15M
    expect(dataMep.statusApuracao).toBe('MEP_CPC18_APURADO_COM_SUCESSO');
    expect(dataMep.diagnosticoMep).toContain('Equivalência Patrimonial CPC 18');
  });

  it('2. Deve gerar exclusao no LALUR (Bloco M300 ECF) e partidas dobradas de resultado de MEP e dividendos a receber', () => {
    const resLalur = processOfficeEquityAccountingLalurEngine({
      investidoraRazaoSocial: 'Holding Empresarial Soberana S/A',
      investidaRazaoSocial: 'Logística Express Coligada Ltda',
      valorResultadoMepBrl: 80000.00,
      tipoResultadoMep: 'GANHO_EQUIVALENCIA_POSITIVA',
      valorDividendosReceberBrl: 20000.00
    });

    const dataLalur = unwrap(resLalur);
    expect(dataLalur.ajusteLalurBlocoM300).toContain('Exclusão de Ganho de Equivalência Patrimonial');
    expect(dataLalur.partidaDobradaMepResultado).toContain('1.2.02.001 Participações Societárias');
    expect(dataLalur.partidaDobradaMepResultado).toContain('3.2.01.001 Receita de Equivalência Patrimonial');
    expect(dataLalur.partidaDobradaDividendos).toContain('1.1.03.008 Dividendos a Receber');
    expect(dataLalur.statusContabilizacao).toBe('MEP_CONCILIADO_LALUR_ECF_E_RAZAO');
    expect(dataLalur.diagnosticoLalur).toContain('LALUR & Razão');
  });
});
