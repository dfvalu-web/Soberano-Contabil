import { Result, Ok, Err } from '../../types/result.js';

export interface RelatedPartyTransactionInput {
  transacaoId: string;
  nomeParteRelacionada: string;
  naturezaRelacionamento: 'CONTROLADORA' | 'COLIGADA' | 'ADMINISTRADOR_CHAVE' | 'ENTIDADE_CONTROLE_COMUM';
  tipoTransacao: 'MUTUO_FINANCEIRO' | 'COMPRA_VENDA_BENS' | 'PRESTACAO_SERVICOS' | 'GARANTIA_AVAL_PRESTADO';
  valorTransacaoPeriodoBrl: number;
  saldoFinalContasReceberPagarBrl: number;
  taxaJurosAplicadaPercentAno?: number;
  taxaMercadoBenchmarkPercentAno?: number;
}

export interface RelatedPartiesReportResult {
  anoExercicio: number;
  totalTransacoesPartesRelacionadasBrl: number;
  totalSaldosEmAbertoBrl: number;
  todasTransacoesEmCondicoesComutativas: boolean;
  minutaNotaExplicativaCpc05: string;
  diagnosticoCpc05: string;
}

export function generateRelatedPartiesDisclosureCpc05(
  anoExercicio: number,
  transacoes: RelatedPartyTransactionInput[]
): Result<RelatedPartiesReportResult, Error> {
  if (!transacoes || transacoes.length === 0) {
    return Err(new Error('Lista de transações com partes relacionadas não pode estar vazia.'));
  }

  let totalTrans = 0;
  let totalSaldos = 0;
  let comutativas = true;

  for (const t of transacoes) {
    totalTrans += t.valorTransacaoPeriodoBrl;
    totalSaldos += t.saldoFinalContasReceberPagarBrl;

    if (t.taxaJurosAplicadaPercentAno !== undefined && t.taxaMercadoBenchmarkPercentAno !== undefined) {
      if (Math.abs(t.taxaJurosAplicadaPercentAno - t.taxaMercadoBenchmarkPercentAno) > 3.0) {
        comutativas = false;
      }
    }
  }

  const nota = 'NOTA EXPLICATIVA Nº XX - TRANSAÇÕES COM PARTES RELACIONADAS (CPC 05 R1 / IAS 24): No exercício social findo em ' + anoExercicio + ', a Companhia realizou transações com controladoras, coligadas e administradores-chave totalizando R$ ' + totalTrans.toFixed(2) + ', com saldos em aberto de R$ ' + totalSaldos.toFixed(2) + '. Todas as operações foram contratadas no curso normal dos negócios e em condições estritamente comutativas (Arm\'s Length).';

  const diag = 'CPC 05 R1: Mapeadas ' + transacoes.length + ' transações com partes relacionadas. Total de R$ ' + totalTrans.toFixed(2) + ' e saldos de R$ ' + totalSaldos.toFixed(2) + '. ' + (comutativas ? 'Condições estritamente comutativas comprovadas.' : 'Alerta: Divergência de taxas frente a benchmarks de mercado.');

  return Ok({
    anoExercicio,
    totalTransacoesPartesRelacionadasBrl: Number(totalTrans.toFixed(2)),
    totalSaldosEmAbertoBrl: Number(totalSaldos.toFixed(2)),
    todasTransacoesEmCondicoesComutativas: comutativas,
    minutaNotaExplicativaCpc05: nota,
    diagnosticoCpc05: diag
  });
}
