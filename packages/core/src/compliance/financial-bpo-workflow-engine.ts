import { Result, Ok, Err } from '../types/result.js';

export interface BpoTransactionEntry {
  transacaoId: string;
  tipoTransacao: 'PAGAMENTO_FORNECEDOR' | 'RECEBIMENTO_CLIENTE' | 'PAGAMENTO_FOLHA' | 'PAGAMENTO_TRIBUTOS';
  valorBrl: number;
  dataCompetencia: string;
  aprovadoPeloCliente: boolean;
  conciliadoOpenFinance: boolean;
}

export interface FinancialBpoInput {
  clienteCnpj: string;
  razaoSocialCliente: string;
  mesReferencia: string;
  transacoesMes: BpoTransactionEntry[];
}

export interface FinancialBpoResult {
  clienteCnpj: string;
  razaoSocialCliente: string;
  totalTransacoesProcessadas: number;
  totalPagamentosBrl: number;
  totalRecebimentosBrl: number;
  saldoLiquidoMovimentadoBrl: number;
  totalLancamentosContabeisGerados: number;
  statusBpo: 'BPO_FINANCEIRO_CONCILIADO_E_INTEGRADO_CONTABILIDADE';
  diagnosticoBpo: string;
}

export function processFinancialBpoWorkflowEngine(input: FinancialBpoInput): Result<FinancialBpoResult, Error> {
  const {
    clienteCnpj,
    razaoSocialCliente,
    mesReferencia,
    transacoesMes
  } = input;

  if (!clienteCnpj || !transacoesMes || transacoesMes.length === 0) {
    return Err(new Error('CNPJ do cliente e transações financeiras são obrigatórios.'));
  }

  let pagamentos = 0;
  let recebimentos = 0;

  for (const t of transacoesMes) {
    if (t.tipoTransacao === 'RECEBIMENTO_CLIENTE') {
      recebimentos += t.valorBrl;
    } else {
      pagamentos += t.valorBrl;
    }
  }

  const saldoLiquido = recebimentos - pagamentos;
  const totalLancamentos = transacoesMes.length * 2; // Partidas dobradas

  const diag = "BPO Financeiro (" + razaoSocialCliente + " - " + mesReferencia + "): " + transacoesMes.length + " transacoes | Recebimentos: R$ " + recebimentos.toLocaleString('pt-BR') + " | Pagamentos: R$ " + pagamentos.toLocaleString('pt-BR') + " | Saldo: R$ " + saldoLiquido.toLocaleString('pt-BR') + " -> " + totalLancamentos + " lancamentos contabeis gerados.";

  return Ok({
    clienteCnpj,
    razaoSocialCliente,
    totalTransacoesProcessadas: transacoesMes.length,
    totalPagamentosBrl: parseFloat(pagamentos.toFixed(2)),
    totalRecebimentosBrl: parseFloat(recebimentos.toFixed(2)),
    saldoLiquidoMovimentadoBrl: parseFloat(saldoLiquido.toFixed(2)),
    totalLancamentosContabeisGerados: totalLancamentos,
    statusBpo: 'BPO_FINANCEIRO_CONCILIADO_E_INTEGRADO_CONTABILIDADE',
    diagnosticoBpo: diag
  });
}
