import { describe, it, expect } from 'vitest';
import {
  processOfficeAnnualClosingAreEngine,
  processOfficeDividendDistributionDmplEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Fechamento Contábil Anual 1-Click (ARE, DMPL & Dividendos Isentos)', () => {
  it('1. Deve zerar receitas e despesas na ARE apurando lucro liquido de R$ 350.000,00 e transferir ao PL', () => {
    const resAre = processOfficeAnnualClosingAreEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Holding Empresarial Soberana S/A',
      exercicioAno: 2026,
      totalReceitasOperacionaisBrl: 1500000.00,
      totalCustosOperacionaisCmvBrl: 700000.00,
      totalDespesasOperacionaisBrl: 450000.00
    });

    const dataAre = unwrap(resAre);
    expect(dataAre.totalReceitasZeradasBrl).toBe(1500000.00);
    expect(dataAre.totalCustosDespesasZeradosBrl).toBe(1150000.00);
    expect(dataAre.lucroLiquidoExercicioBrl).toBe(350000.00);
    expect(dataAre.saldoContasResultadoPosEncerramentoBrl).toBe(0.00);
    expect(dataAre.partidaDobradaTransferenciaPl).toContain('2.4.03.001 Lucros Acumulados');
    expect(dataAre.statusFechamento).toBe('EXERCICIO_ENCERRADO_ARE_COM_SUCESSO');
    expect(dataAre.diagnosticoAre).toContain('Encerramento do Exercício');
  });

  it('2. Deve constituir Reserva Legal de 5% (R$ 17.500,00) e distribuir dividendos isentos aos socios (Lei 9.249/95)', () => {
    const resDmpl = processOfficeDividendDistributionDmplEngine({
      empresaCnpj: '11.111.111/0001-11',
      razaoSocial: 'Holding Empresarial Soberana S/A',
      lucroLiquidoExercicioBrl: 350000.00,
      capitalSocialBrl: 500000.00,
      saldoReservaLegalAtualBrl: 0.00,
      percentualDistribuicaoSociosPercent: 80.0
    });

    const dataDmpl = unwrap(resDmpl);
    expect(dataDmpl.valorConstituicaoReservaLegal5PercentBrl).toBe(17500.00); // 5% de 350k
    expect(dataDmpl.valorLucroDisponivelDistribuicaoBrl).toBe(332500.00); // 350k - 17.5k
    expect(dataDmpl.valorDividendosIsentosDistribuidosBrl).toBe(266000.00); // 80% de 332.5k
    expect(dataDmpl.valorLucrosRetidosExpansaoPlBrl).toBe(66500.00); // 20% de 332.5k
    expect(dataDmpl.partidaDobradaDistribuicaoDividendos).toContain('2.1.03.001 Dividendos a Pagar aos Sócios');
    expect(dataDmpl.isencaoFiscalArt10Lei9249).toBe(true);
    expect(dataDmpl.statusDestinacao).toBe('LUCROS_DESTINADOS_DIVIDENDOS_ISENTOS_APURADOS');
    expect(dataDmpl.diagnosticoDestinacao).toContain('Dividendos Isentos aos Sócios');
  });
});
