import { describe, it, expect } from 'vitest';
import {
  processFinancialBpoWorkflowEngine,
  processFinancialBpoCashflowDreEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: BPO Financeiro do Escritório, Open Finance & DRE Gerencial', () => {
  it('1. Deve processar contas a pagar, contas a receber e gerar partidas dobradas na contabilidade', () => {
    const resBpo = processFinancialBpoWorkflowEngine({
      clienteCnpj: '11.222.333/0001-44',
      razaoSocialCliente: 'Clínica Médica & Diagnóstico Alfa Ltda',
      mesReferencia: '2026-08',
      transacoesMes: [
        {
          transacaoId: 'TX-REC-001',
          tipoTransacao: 'RECEBIMENTO_CLIENTE',
          valorBrl: 150000.00,
          dataCompetencia: '2026-08-05',
          aprovadoPeloCliente: true,
          conciliadoOpenFinance: true
        },
        {
          transacaoId: 'TX-PAG-001',
          tipoTransacao: 'PAGAMENTO_FORNECEDOR',
          valorBrl: 45000.00,
          dataCompetencia: '2026-08-10',
          aprovadoPeloCliente: true,
          conciliadoOpenFinance: true
        },
        {
          transacaoId: 'TX-PAG-002',
          tipoTransacao: 'PAGAMENTO_FOLHA',
          valorBrl: 35000.00,
          dataCompetencia: '2026-08-05',
          aprovadoPeloCliente: true,
          conciliadoOpenFinance: true
        }
      ]
    });

    const dataBpo = unwrap(resBpo);
    expect(dataBpo.totalTransacoesProcessadas).toBe(3);
    expect(dataBpo.totalRecebimentosBrl).toBe(150000.00);
    expect(dataBpo.totalPagamentosBrl).toBe(80000.00);
    expect(dataBpo.saldoLiquidoMovimentadoBrl).toBe(70000.00);
    expect(dataBpo.totalLancamentosContabeisGerados).toBe(6); // 3 * 2
    expect(dataBpo.statusBpo).toBe('BPO_FINANCEIRO_CONCILIADO_E_INTEGRADO_CONTABILIDADE');
    expect(dataBpo.diagnosticoBpo).toContain('Clínica Médica & Diagnóstico Alfa Ltda');
  });

  it('2. Deve apurar DRE Gerencial com margem de contribuicao e EBITDA operacional', () => {
    const resDre = processFinancialBpoCashflowDreEngine({
      clienteCnpj: '11.222.333/0001-44',
      receitaBrutaVendasBrl: 200000.00,
      deducoesTributosVendasBrl: 20000.00, // Receita Líquida = 180k
      custosProdutosServicosBrl: 60000.00, // Lucro Bruto = 120k (66.7%)
      despesasOperacionaisAdmBrl: 40000.00, // EBITDA = 80k (44.4%)
      despesasFinanceirasLiquidasBrl: 5000.00 // Lucro Líquido = 75k
    });

    const dataDre = unwrap(resDre);
    expect(dataDre.receitaLiquidaBrl).toBe(180000.00);
    expect(dataDre.lucroBrutoBrl).toBe(120000.00);
    expect(dataDre.margemBrutaPercent).toBe(66.7);
    expect(dataDre.lucroOperacionalEbitdaBrl).toBe(80000.00);
    expect(dataDre.margemEbitdaPercent).toBe(44.4);
    expect(dataDre.lucroLiquidoGerencialBrl).toBe(75000.00);
    expect(dataDre.statusDre).toBe('DRE_GERENCIAL_BPO_PROCESSADA_COM_SUCESSO');
    expect(dataDre.diagnosticoDre).toContain('EBITDA: R$ 80.000');
  });
});
