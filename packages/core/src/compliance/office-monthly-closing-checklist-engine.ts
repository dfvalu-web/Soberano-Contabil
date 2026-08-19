import { Result, Ok, Err } from '../types/result.js';

export interface MonthlyClosingInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string; // Ex: '2026-08'
  conciliacaoBancaria100Feita: boolean;
  apuracaoFiscalConcluida: boolean;
  efdReinfTransmitido: boolean;
  folhaPagamentoFechada: boolean;
  esocialS1299Transmitido: boolean;
  dctfwebTransmitida: boolean;
  balanceteVerificacaoEquilibrado: boolean;
}

export interface MonthlyClosingResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  scoreConformidadeFechamentoPercent: number; // 0 a 100%
  bloqueioLancamentosRetroativosAtivo: boolean;
  statusFechamento: 'COMPETENCIA_MENSAL_FECHADA_E_TRAVADA' | 'FECHAMENTO_PENDENTE_ITENS_EM_ABERTO';
  diagnosticoFechamento: string;
}

export function processOfficeMonthlyClosingChecklistEngine(input: MonthlyClosingInput): Result<MonthlyClosingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    conciliacaoBancaria100Feita,
    apuracaoFiscalConcluida,
    efdReinfTransmitido,
    folhaPagamentoFechada,
    esocialS1299Transmitido,
    dctfwebTransmitida,
    balanceteVerificacaoEquilibrado
  } = input;

  if (!clienteCnpj || !mesCompetencia) {
    return Err(new Error('CNPJ do cliente e mês de competência são obrigatórios.'));
  }

  let itensConcluidos = 0;
  const totalItens = 7;

  if (conciliacaoBancaria100Feita) itensConcluidos++;
  if (apuracaoFiscalConcluida) itensConcluidos++;
  if (efdReinfTransmitido) itensConcluidos++;
  if (folhaPagamentoFechada) itensConcluidos++;
  if (esocialS1299Transmitido) itensConcluidos++;
  if (dctfwebTransmitida) itensConcluidos++;
  if (balanceteVerificacaoEquilibrado) itensConcluidos++;

  const score = (itensConcluidos / totalItens) * 100;
  const isFechado = score === 100;
  const status = isFechado ? 'COMPETENCIA_MENSAL_FECHADA_E_TRAVADA' : 'FECHAMENTO_PENDENTE_ITENS_EM_ABERTO';

  const diag = "Fechamento Mensal (" + razaoSocial + " - Competência " + mesCompetencia + "): " + itensConcluidos + "/" + totalItens + " itens concluídos (" + score.toFixed(1) + "%) -> Status: " + status + " | Trava de lançamentos: " + (isFechado ? 'ATIVADA' : 'DESATIVADA') + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    scoreConformidadeFechamentoPercent: parseFloat(score.toFixed(1)),
    bloqueioLancamentosRetroativosAtivo: isFechado,
    statusFechamento: status,
    diagnosticoFechamento: diag
  });
}
