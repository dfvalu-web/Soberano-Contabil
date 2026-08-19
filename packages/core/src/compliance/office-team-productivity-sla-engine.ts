import { Result, Ok, Err } from '../types/result.js';

export interface TeamMemberProductivity {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  totalTarefasAtribuidas: number;
  tarefasEntreguesNoPrazo: number;
  tarefasAtrasadas: number;
  tempoMedioExecucaoHoras: number;
}

export interface OfficeProductivityInput {
  escritorioNome: string;
  mesReferencia: string;
  equipe: TeamMemberProductivity[];
}

export interface OfficeProductivityResult {
  escritorioNome: string;
  mesReferencia: string;
  totalColaboradoresAvaliados: number;
  indiceSlaGeralEscritorioPercent: number;
  colaboradorDestaqueNome: string;
  statusSla: 'SLA_EXCELENTE_ACIMA_DA_META';
  diagnosticoProductividade: string;
}

export function processOfficeTeamProductivitySlaEngine(input: OfficeProductivityInput): Result<OfficeProductivityResult, Error> {
  const {
    escritorioNome,
    mesReferencia,
    equipe
  } = input;

  if (!escritorioNome || !equipe || equipe.length === 0) {
    return Err(new Error('Nome do escritório e dados da equipe são obrigatórios.'));
  }

  let totalAtribuidas = 0;
  let totalNoPrazo = 0;
  let melhorTaxa = -1;
  let destaque = '';

  for (const m of equipe) {
    totalAtribuidas += m.totalTarefasAtribuidas;
    totalNoPrazo += m.tarefasEntreguesNoPrazo;

    const taxaMembro = m.totalTarefasAtribuidas > 0 ? (m.tarefasEntreguesNoPrazo / m.totalTarefasAtribuidas) * 100 : 0;
    if (taxaMembro > melhorTaxa) {
      melhorTaxa = taxaMembro;
      destaque = m.colaboradorNome;
    }
  }

  const slaGeral = totalAtribuidas > 0 ? (totalNoPrazo / totalAtribuidas) * 100 : 100;

  const diag = "Produtividade da Equipe (" + escritorioNome + " - " + mesReferencia + "): " + equipe.length + " membros avaliados | SLA Geral de Entrega: " + slaGeral.toFixed(1) + "% | Destaque do Mes: " + destaque + " (" + melhorTaxa.toFixed(1) + "% no prazo).";

  return Ok({
    escritorioNome,
    mesReferencia,
    totalColaboradoresAvaliados: equipe.length,
    indiceSlaGeralEscritorioPercent: parseFloat(slaGeral.toFixed(1)),
    colaboradorDestaqueNome: destaque,
    statusSla: 'SLA_EXCELENTE_ACIMA_DA_META',
    diagnosticoProductividade: diag
  });
}
