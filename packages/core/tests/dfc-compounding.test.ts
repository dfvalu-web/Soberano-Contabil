import { describe, it, expect } from 'vitest';
import {
  generateComprehensiveIndirectDfcCpc03,
  processCompoundingPharmacyMagistralTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: DFC Indireto com Capital de Giro (CPC 03 R2) & Farmácias de Manipulação (STF Tema 1079)', () => {
  it('1. Deve apurar DFC indireto com ajustes nao caixa, variacao de capital de giro e saldo final (CPC 03 R2 / IAS 7)', () => {
    const resDfc = generateComprehensiveIndirectDfcCpc03({
      empresaId: 'CORP-01',
      exercicioAno: 2026,
      lucroLiquidoExercicioBrl: 10000000.00,
      depreciacaoAmortizacaoBrl: 2000000.00, // (+) 2M
      provisoesContingenciasLíquidasBrl: 500000.00, // (+) 500k
      resultadoEquivalenciaPatrimonialMepBrl: 1000000.00, // (-) 1M (Ganho MEP)
      variacaoCambialNaoRealizadaDividasBrl: 300000.00, // (+) 300k -> Lucro Ajustado = 11.8M
      deltaClientesContasReceberBrl: 1000000.00, // (-) 1M
      deltaEstoquesBrl: 500000.00, // (-) 500k
      deltaFornecedoresContasPagarBrl: 800000.00, // (+) 800k
      deltaObrigacoesTrabalhistasFiscaisBrl: 200000.00, // (+) 200k -> Capital Giro = -500k -> FCO = 11.3M
      aquisicaoAtivoImobilizadoCapexBrl: 4000000.00, // FCI = -4.5M
      aquisicaoAtivoIntangivelBrl: 500000.00,
      novosFinanciamentosCaptadosBrl: 2000000.00,
      amortizacaoEmprestimosFinanciamentosBrl: 1000000.00,
      dividendosJcpPagosBrl: 3000000.00, // FCF = -2M -> Variação Total = 11.3M - 4.5M - 2M = 4.8M
      saldoInicialCaixaEquivalentesBrl: 5000000.00 // Saldo Final = 9.8M
    });

    const dataDfc = unwrap(resDfc);
    expect(dataDfc.lucroLiquidoAjustadoItensNaoCaixaBrl).toBe(11800000.00);
    expect(dataDfc.variacaoLiquidaCapitalGiroBrl).toBe(-500000.00);
    expect(dataDfc.fluxoCaixaOperacionalLiquidoBrl).toBe(11300000.00);
    expect(dataDfc.fluxoCaixaInvestimentoLiquidoBrl).toBe(-4500000.00);
    expect(dataDfc.fluxoCaixaFinanciamentoLiquidoBrl).toBe(-2000000.00);
    expect(dataDfc.variacaoLiquidaTotalCaixaExercicioBrl).toBe(4800000.00);
    expect(dataDfc.saldoFinalCaixaEquivalentesBrl).toBe(9800000.00);
    expect(dataDfc.diagnosticoCpc03).toContain('DFC Método Indireto');
  });

  it('2. Deve segregar ISSQN exclusivo sob encomenda e ICMS em produtos de prateleira em farmacias (STF Tema 1079)', () => {
    // 2.1 Medicamento Manipulado sob Encomenda (ISSQN Exclusivo 4% / Não incidência de ICMS)
    const resManip = processCompoundingPharmacyMagistralTaxEngine({
      vendaId: 'MANIP-01',
      farmaciaNome: 'Farmácia Magistral & Manipulação Ltda',
      tipoItem: 'MEDICAMENTO_MANIPULADO_SOB_ENCOMENDA',
      valorTotalItemBrl: 200.00,
      aliquotaIssqnMunicipalPercent: 4.0
    });

    const dataManip = unwrap(resManip);
    expect(dataManip.tributacaoExclusivaIssqnSTF).toBe(true);
    expect(dataManip.aliquotaIssqnPercent).toBe(4.0);
    expect(dataManip.valorIssqnDevidoBrl).toBe(8.00); // 4% de 200
    expect(dataManip.aliquotaIcmsPercent).toBe(0);
    expect(dataManip.valorIcmsDevidoBrl).toBe(0);
    expect(dataManip.totalTributosIncidentesBrl).toBe(8.00);
    expect(dataManip.diagnosticoFiscal).toContain('INCIDÊNCIA EXCLUSIVA DE ISSQN');

    // 2.2 Produto Industrializado / Balcão (ICMS 18% / Não incidência de ISSQN)
    const resPrateleira = processCompoundingPharmacyMagistralTaxEngine({
      vendaId: 'PROD-02',
      farmaciaNome: 'Farmácia Magistral & Manipulação Ltda',
      tipoItem: 'PRODUTO_INDUSTRIALIZADO_PRATELEIRA',
      valorTotalItemBrl: 150.00,
      aliquotaIcmsEstadualPercent: 18.0
    });

    const dataPrat = unwrap(resPrateleira);
    expect(dataPrat.tributacaoExclusivaIssqnSTF).toBe(false);
    expect(dataPrat.aliquotaIssqnPercent).toBe(0);
    expect(dataPrat.valorIssqnDevidoBrl).toBe(0);
    expect(dataPrat.aliquotaIcmsPercent).toBe(18.0);
    expect(dataPrat.valorIcmsDevidoBrl).toBe(27.00); // 18% de 150
    expect(dataPrat.totalTributosIncidentesBrl).toBe(27.00);
    expect(dataPrat.diagnosticoFiscal).toContain('INCIDÊNCIA DE ICMS');
  });
});
