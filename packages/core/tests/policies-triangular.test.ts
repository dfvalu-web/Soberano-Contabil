import { describe, it, expect } from 'vitest';
import {
  evaluateAccountingPoliciesAndErrorsCpc23,
  processTriangularSalesOperation,
  unwrap
} from '../src/index.js';

describe('TESTES: Políticas Contábeis e Erros (CPC 23) & Venda Triangular por Conta e Ordem (Convênio S/N 1970)', () => {
  it('1. Deve aplicar ajuste retrospectivo no DMPL para erros anteriores e prospectivo para estimativas (CPC 23)', () => {
    // 1.1 Retificação de Erro (Retrospectivo no PL/DMPL)
    const resErro = evaluateAccountingPoliciesAndErrorsCpc23({
      eventoId: 'AJUSTE-DEPREC-2024',
      descricaoEvento: 'Omissão de Depreciação de Máquinas em 2024',
      tipoEvento: 'RETIFICACAO_ERRO_EXERCICIO_ANTERIOR',
      anoExercicioAtual: 2026,
      valorImpactoFinanceiroBrl: 500000.00,
      saldoAberturaLucrosPrejuizosAcumuladosBrl: 10000000.00
    });

    const dataErro = unwrap(resErro);
    expect(dataErro.aplicacaoModalidade).toBe('RETROSPECTIVA_DMPL_PL');
    expect(dataErro.impactoNoResultadoExercicioAtualBrl).toBe(0); // Sem impacto na DRE 2026
    expect(dataErro.novoSaldoAberturaAjustadoPlBrl).toBe(9500000.00); // 10M - 500k
    expect(dataErro.partidasDobradaAjuste.length).toBe(2);
    expect(dataErro.diagnosticoCpc23).toContain('Aplicação Retrospectiva');

    // 1.2 Mudança de Estimativa Contábil (Prospectivo no Resultado)
    const resEst = evaluateAccountingPoliciesAndErrorsCpc23({
      eventoId: 'ESTIMATIVA-VIDA-UTIL-2026',
      descricaoEvento: 'Revisão da Vida Útil Econômica de Frotas de 5 para 8 anos',
      tipoEvento: 'MUDANCA_ESTIMATIVA_CONTABIL',
      anoExercicioAtual: 2026,
      valorImpactoFinanceiroBrl: 120000.00
    });

    const dataEst = unwrap(resEst);
    expect(dataEst.aplicacaoModalidade).toBe('PROSPECTIVA_RESULTADO_CORRENTE');
    expect(dataEst.impactoNoResultadoExercicioAtualBrl).toBe(120000.00);
    expect(dataEst.impactoNoSaldoAberturaPlBrl).toBe(0);
    expect(dataEst.diagnosticoCpc23).toContain('Aplicação Prospectiva');
  });

  it('2. Deve gerar e validar as 3 NFs da operacao triangular por conta e ordem (Convênio S/Nº de 1970)', () => {
    const res = processTriangularSalesOperation({
      operacaoId: 'TRIANGULAR-OP-01',
      adquirenteOriginarioNome: 'Comercial Distribuidora Delta Ltda',
      vendedorRemetenteNome: 'Indústria Metalúrgica Fornecedora S.A.',
      destinatarioFinalNome: 'Construtora Horizonte S.A.',
      valorVendaComercialBrl: 1500000.00, // Preço de venda ao cliente final
      valorCustoFornecedorBrl: 1000000.00, // Custo cobrado pela fábrica
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10
    });

    const data = unwrap(res);
    const nfs = data.notasFiscaisOperacaoTriangular;

    // NF 1: Venda Comercial (5.120)
    expect(nfs.nf1VendaComercial.cfop).toBe('5.120');
    expect(nfs.nf1VendaComercial.valorTotalBrl).toBe(1500000.00);
    expect(nfs.nf1VendaComercial.icmsDestacadoBrl).toBe(270000.00); // 18% de 1.5M

    // NF 2: Remessa Física (5.923)
    expect(nfs.nf2RemessaContaEOrdem.cfop).toBe('5.923');
    expect(nfs.nf2RemessaContaEOrdem.icmsDestacadoBrl).toBe(0); // Sem destaque de ICMS na remessa física

    // NF 3: Remessa Simbólica (5.118)
    expect(nfs.nf3SimbolicaFaturamento.cfop).toBe('5.118');
    expect(nfs.nf3SimbolicaFaturamento.valorTotalBrl).toBe(1000000.00);
    expect(nfs.nf3SimbolicaFaturamento.icmsDestacadoBrl).toBe(180000.00); // 18% de 1M
    expect(nfs.nf3SimbolicaFaturamento.ipiDestacadoBrl).toBe(100000.00);  // 10% de 1M

    expect(data.diagnosticoTriangular).toContain('Operação Triangular por Conta e Ordem');
  });
});
