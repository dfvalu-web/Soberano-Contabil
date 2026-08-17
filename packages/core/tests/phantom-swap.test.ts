import { describe, it, expect } from 'vitest';
import {
  evaluateShareBasedPaymentCpc10,
  processRealEstateSwapTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Remuneração Baseada em Ações (CPC 10) & Permuta Imobiliária (Tema 1.098 STJ)', () => {
  it('1. Deve segregar remuneração Equity-Settled no PL e Cash-Settled no Passivo reavaliado a mercado (CPC 10 R1 / IFRS 2)', () => {
    // 1.1 Cash-Settled (Phantom Shares)
    const resCash = evaluateShareBasedPaymentCpc10({
      planoId: 'PLAN-PHANTOM-01',
      beneficiarioNome: 'Diretor de Tecnologia',
      tipoLiquidacao: 'CASH_SETTLED_PHANTOM_SHARES',
      quantidadeOpcoesAcoes: 100000,
      valorJustoUnitarioDataOutorgaBrl: 30.00,
      valorJustoUnitarioDataFechamentoAtualBrl: 45.00, // Reavaliado a mercado
      periodoAquisicaoMesesTotal: 36,
      mesesDecorridos: 24, // 24/36 = 66.67% -> 3.000.000,00
      saldoProvisaoAnteriorBrl: 1000000.00
    });

    const dataCash = unwrap(resCash);
    expect(dataCash.contrapartidaClassificacao).toBe('PASSIVO_EXIGIVEL_CASH_SETTLED');
    expect(dataCash.valorTotalAcumuladoObrigacaoBrl).toBe(3000000.00);
    expect(dataCash.despesaPeriodoAtualDREBrl).toBe(2000000.00);
    expect(dataCash.partidasDobradaRemuneracao.length).toBe(2);
    expect(dataCash.diagnosticoCpc10).toContain('CPC 10 (R1) / IFRS 2 (Cash-Settled / Phantom Shares)');

    // 1.2 Equity-Settled (Stock Options)
    const resEquity = evaluateShareBasedPaymentCpc10({
      planoId: 'PLAN-STOCK-02',
      beneficiarioNome: 'CEO Executivo',
      tipoLiquidacao: 'EQUITY_SETTLED_STOCK_OPTIONS',
      quantidadeOpcoesAcoes: 50000,
      valorJustoUnitarioDataOutorgaBrl: 20.00, // Fixo
      valorJustoUnitarioDataFechamentoAtualBrl: 50.00, // Ignorado no Equity
      periodoAquisicaoMesesTotal: 24,
      mesesDecorridos: 12, // 50% -> 500.000,00
      saldoProvisaoAnteriorBrl: 0
    });

    const dataEquity = unwrap(resEquity);
    expect(dataEquity.contrapartidaClassificacao).toBe('PATRIMONIO_LIQUIDO_EQUITY_SETTLED');
    expect(dataEquity.valorTotalAcumuladoObrigacaoBrl).toBe(500000.00);
    expect(dataEquity.despesaPeriodoAtualDREBrl).toBe(500000.00);
    expect(dataEquity.partidasDobradaRemuneracao.length).toBe(2);
  });

  it('2. Deve aplicar nao incidencia de tributos federais em permuta imobiliaria sem torna (Tema 1.098 STJ)', () => {
    // 2.1 Permuta Sem Torna
    const resSemTorna = processRealEstateSwapTaxEngine({
      operacaoId: 'SWAP-01',
      tipoPermuta: 'PERMUTA_IMOVEIS_SEM_TORNA',
      parceiroPermutanteNome: 'Incorporadora Alphaville S.A.',
      valorImovelEntregueBrl: 10000000.00,
      valorImovelRecebidoBrl: 10000000.00,
      custoContabilImovelEntregueBrl: 6000000.00
    });

    const dataSem = unwrap(resSemTorna);
    expect(dataSem.baseCalculoTributavelTornaBrl).toBe(0);
    expect(dataSem.tributacaoFederalDevida.totalTributosFederaisBrl).toBe(0);
    expect(dataSem.partidasDobradaPermuta.length).toBe(2);
    expect(dataSem.diagnosticoFiscal).toContain('TEMA 1.098 DO STJ: Não incidência de IRPJ, CSLL, PIS e COFINS');

    // 2.2 Permuta Com Torna Recebida
    const resComTorna = processRealEstateSwapTaxEngine({
      operacaoId: 'SWAP-02',
      tipoPermuta: 'PERMUTA_IMOVEIS_COM_TORNA_RECEBIDA',
      parceiroPermutanteNome: 'Construtora Metropolitana Ltda',
      valorImovelEntregueBrl: 8000000.00,
      valorImovelRecebidoBrl: 6000000.00,
      valorTornaFinanceiraRecebidaBrl: 2000000.00,
      custoContabilImovelEntregueBrl: 5000000.00
    });

    const dataCom = unwrap(resComTorna);
    expect(dataCom.baseCalculoTributavelTornaBrl).toBe(2000000.00);
    expect(dataCom.tributacaoFederalDevida.totalTributosFederaisBrl).toBe(134600.00);
    expect(dataCom.partidasDobradaPermuta.length).toBe(3);
  });
});
