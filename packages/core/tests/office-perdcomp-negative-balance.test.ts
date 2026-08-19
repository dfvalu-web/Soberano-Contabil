import { describe, it, expect } from 'vitest';
import {
  processOfficePerdcompWebTaxOffsetEngine,
  processOfficeIrpjCsllNegativeBalanceSelicEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: PER/DCOMP Web & Saldos Negativos de IRPJ/CSLL', () => {
  it('1. Deve atualizar saldo negativo de IRPJ/CSLL pela taxa Selic e gerar lancamento contabil', () => {
    const resSelic = processOfficeIrpjCsllNegativeBalanceSelicEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Indústria Delta Brasil S/A',
      anoExercicio: 2025,
      valorOriginalSaldoNegativoBrl: 200000.00,
      taxaSelicAcumuladaPercent: 10.0
    });

    const dataSelic = unwrap(resSelic);
    expect(dataSelic.valorOriginalSaldoNegativoBrl).toBe(200000.00);
    expect(dataSelic.valorAtualizacaoSelicBrl).toBe(20000.00); // 10% de 200k
    expect(dataSelic.valorTotalAtualizadoCreditoBrl).toBe(220000.00);
    expect(dataSelic.partidaDobradaAtualizacaoSelic).toContain('1.1.03.001 IRPJ/CSLL a Recuperar');
    expect(dataSelic.partidaDobradaAtualizacaoSelic).toContain('Receita Financeira com Atualização Selic');
    expect(dataSelic.statusSaldoNegativo).toBe('SALDO_NEGATIVO_ATUALIZADO_E_APTO_PERDCOMP');
  });

  it('2. Deve transmitir DCOMP para extincao de debito tributario federal com saldo remanescente', () => {
    const resOff = processOfficePerdcompWebTaxOffsetEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Indústria Delta Brasil S/A',
      tipoCreditoUtilizado: 'SALDO_NEGATIVO_IRPJ',
      valorTotalCreditoDisponivelBrl: 220000.00,
      valorDebitoACompensarBrl: 70000.00,
      tributoDebitoCompensado: 'DEBITO_DCTFWEB_PREVIDENCIARIO'
    });

    const dataOff = unwrap(resOff);
    expect(dataOff.valorDebitoCompensadoBrl).toBe(70000.00);
    expect(dataOff.saldoRemanescenteCreditoBrl).toBe(150000.00);
    expect(dataOff.numeroProtocoloPerDcomp).toContain('DCOMP');
    expect(dataOff.riscoGlosaFiscal).toBe('BAIXO_DOCUMENTACAO_ECF_DCTF_100_CONCILIADA');
    expect(dataOff.statusPerDcomp).toBe('DCOMP_TRANSMITIDA_EXTINCAO_DO_DEBITO');
    expect(dataOff.diagnosticoPerDcomp).toContain('Saldo remanescente de crédito: R$ 150.000,00');
  });
});
