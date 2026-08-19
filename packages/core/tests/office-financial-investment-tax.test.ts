import { describe, it, expect } from 'vitest';
import {
  processOfficeFinancialInvestmentTaxEngine,
  processOfficeInvestmentAccountingReconciliationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Aplicações Financeiras, Rendimentos, IOF & IRRF Fonte (Art. 730 RIR/18)', () => {
  it('1. Deve apurar rendimento financeiro de CDB (prazo 300 dias) com IRRF 20% compensavel no IRPJ', () => {
    const resInv = processOfficeFinancialInvestmentTaxEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Distribuição Alfa S/A',
      instituicaoFinanceiraNome: 'Banco Itaú BBA S/A',
      tipoAplicacao: 'CDB_POS_FIXADO',
      valorPrincipalResgatadoBrl: 100000.00,
      valorRendimentoBrutoBrl: 10000.00,
      prazoAplicacaoDias: 300, // Faixa de 181 a 360 dias = 20%
      regimeTributario: 'LUCRO_REAL'
    });

    const dataInv = unwrap(resInv);
    expect(dataInv.rendimentoBrutoBrl).toBe(10000.00);
    expect(dataInv.valorIofRetidoBrl).toBe(0.00); // Prazo > 30 dias
    expect(dataInv.aliquotaIrrfPercent).toBe(20.0);
    expect(dataInv.valorIrrfRetidoBrl).toBe(2000.00); // 20% de 10.000
    expect(dataInv.irrfCompensavelNaApuracaoIprj).toBe(true);
    expect(dataInv.valorLiquidoCreditadoEmContaBrl).toBe(108000.00); // 100k + 10k - 2k
    expect(dataInv.statusApuracao).toBe('APLICACAO_FINANCEIRA_AUDITADA_COM_SUCESSO');
    expect(dataInv.diagnosticoInvestimento).toContain('COMPENSÁVEL NO IRPJ');
  });

  it('2. Deve gerar partidas dobradas de apropriação de receita na DRE e baixa de resgate com IRRF a compensar', () => {
    const resAcc = processOfficeInvestmentAccountingReconciliationEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Distribuição Alfa S/A',
      valorPrincipalResgateBrl: 100000.00,
      rendimentoBrutoBrl: 10000.00,
      valorIrrfRetidoBrl: 2000.00,
      valorIofBrl: 0.00,
      valorLiquidoCreditadoBrl: 108000.00,
      ehCompensavelIrrf: true
    });

    const dataAcc = unwrap(resAcc);
    expect(dataAcc.partidaDobradaResgateERendimento).toContain('1.1.01.002 Banco Conta Movimento');
    expect(dataAcc.partidaDobradaResgateERendimento).toContain('1.1.03.001 IRRF a Compensar s/ Aplicações Financeiras');
    expect(dataAcc.partidaDobradaResgateERendimento).toContain('3.1.05.001 Receitas Financeiras s/ Aplicações');
    expect(dataAcc.partidaDobradaApropriacaoMensalReceita).toContain('1.1.02.001 Aplicações de Liquidez Imediata');
    expect(dataAcc.statusContabilizacao).toBe('LANCAMENTOS_APLICACOES_FINANCEIRAS_CONCLUIDOS');
    expect(dataAcc.diagnosticoContabil).toContain('R$ 2.000,00');
  });
});
