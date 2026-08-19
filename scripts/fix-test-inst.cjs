const fs = require('fs');

const testCode = `import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxInstallmentPlansPgfnEngine,
  processOfficeTaxDebtAmortizationAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Parcelamentos Tributários Ativos (PGFN & Simples)', () => {
  it('1. Deve calcular parcelas atualizadas pela Selic, saldo remanescente e classificar risco de rescisao', () => {
    const resInst = processOfficeTaxInstallmentPlansPgfnEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio de Calçados Modelo Paulista Ltda',
      modalidadeParcelamento: 'TRANSACAO_PGFN_EDITAL',
      valorOriginalDividaBrl: 300000.00,
      descontoObtidoJurosMultaBrl: 180000.00,
      saldoDevedorConsolidadoBrl: 120000.00,
      totalParcelasPactuadas: 60,
      parcelaAtualNumero: 12,
      taxaSelicMesPercent: 0.90,
      parcelasEmAtrasoCount: 0
    });

    const dataInst = unwrap(resInst);
    expect(dataInst.valorParcelaBaseBrl).toBe(2000.00); // 120k / 60
    expect(dataInst.valorParcelaAtualizadaSelicBrl).toBeCloseTo(2018.00, 2); // 2000 * 1.009
    expect(dataInst.saldoDevedorRemanescenteBrl).toBe(96000.00); // 2000 * 48
    expect(dataInst.parcelasRestantes).toBe(48);
    expect(dataInst.riscoRescisaoParcelamento).toBe('BAIXO_EM_DIA');
    expect(dataInst.statusParcelamento).toBe('PARCELAMENTO_ATIVO_REGULAR');
    expect(dataInst.diagnosticoParcelamento).toContain('TRANSACAO_PGFN_EDITAL');
  });

  it('2. Deve amortizar divida contabilmente, reconhecer ganho por remissao e segregar Passivo Circulante e Nao Circulante', () => {
    const resAmort = processOfficeTaxDebtAmortizationAccountingEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Metalúrgica Aliança S/A',
      valorDividaTotalOriginalBrl: 500000.00,
      valorDescontoTransacaoBrl: 200000.00, // Ganho de 200k no resultado
      valorParcelaPagaBrl: 5000.00,
      totalParcelasRestantes: 60
    });

    const dataAmort = unwrap(resAmort);
    expect(dataAmort.lancamentoContabilGanhoRemissaoBrl).toBe(200000.00);
    expect(dataAmort.passivoCirculanteAjustadoBrl).toBe(60000.00); // (300k/60)*12 = 60k
    expect(dataAmort.passivoNaoCirculanteLongoPrazoBrl).toBe(240000.00); // (300k/60)*48 = 240k
    expect(dataAmort.partidaDobradaGerada).toContain('2.1.03.001 Tributos Parcelados');
    expect(dataAmort.statusAmortizacao).toBe('AMORTIZACAO_CONTABIL_PARCELAMENTO_CONCLUIDA');
    expect(dataAmort.diagnosticoAmortizacao).toContain('Ganho de Transação');
  });
});
`;

fs.writeFileSync('packages/core/tests/office-tax-installments.test.ts', testCode, 'utf8');
console.log('Fixed test assertion in office-tax-installments.test.ts');
