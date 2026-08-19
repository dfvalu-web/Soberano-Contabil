import { Result, Ok, Err } from '../types/result.js';

export interface OfficeTaskItem {
  tarefaId: string;
  titulo: string;
  departamento: 'CONTABIL' | 'FISCAL' | 'DEPARTAMENTO_PESSOAL' | 'SOCIETARIO';
  clienteCnpj: string;
  responsavelNome: string;
  dataLimiteLegal: string; // YYYY-MM-DD
  status: 'A_FAZER' | 'EM_ANDAMENTO' | 'REVISAO_AUDITORIA' | 'CONCLUIDO';
}

export interface OfficeTaskKanbanInput {
  escritorioNome: string;
  mesCompetencia: string;
  tarefas: OfficeTaskItem[];
}

export interface OfficeTaskKanbanResult {
  escritorioNome: string;
  mesCompetencia: string;
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasEmAndamento: number;
  tarefasEmRevisao: number;
  tarefasAFazer: number;
  taxaConclusaoPercent: number;
  statusQuadro: 'KANBAN_ESCRITORIO_ATUALIZADO_SUCESSO';
  diagnosticoQuadro: string;
}

export function processOfficeTaskKanbanEngine(input: OfficeTaskKanbanInput): Result<OfficeTaskKanbanResult, Error> {
  const {
    escritorioNome,
    mesCompetencia,
    tarefas
  } = input;

  if (!escritorioNome || !tarefas || tarefas.length === 0) {
    return Err(new Error('Nome do escritório e lista de tarefas são obrigatórios.'));
  }

  let concluidas = 0;
  let andamento = 0;
  let revisao = 0;
  let afazer = 0;

  for (const t of tarefas) {
    if (t.status === 'CONCLUIDO') concluidas++;
    else if (t.status === 'EM_ANDAMENTO') andamento++;
    else if (t.status === 'REVISAO_AUDITORIA') revisao++;
    else if (t.status === 'A_FAZER') afazer++;
  }

  const taxa = (concluidas / tarefas.length) * 100;

  const diag = "Kanban do Escritorio (" + escritorioNome + " - " + mesCompetencia + "): " + tarefas.length + " tarefas mapeadas | Concluidas: " + concluidas + " (" + taxa.toFixed(1) + "%) | Em Andamento: " + andamento + " | Revisao: " + revisao + " | A Fazer: " + afazer + " -> Fluxo operacional saudavel.";

  return Ok({
    escritorioNome,
    mesCompetencia,
    totalTarefas: tarefas.length,
    tarefasConcluidas: concluidas,
    tarefasEmAndamento: andamento,
    tarefasEmRevisao: revisao,
    tarefasAFazer: afazer,
    taxaConclusaoPercent: parseFloat(taxa.toFixed(1)),
    statusQuadro: 'KANBAN_ESCRITORIO_ATUALIZADO_SUCESSO',
    diagnosticoQuadro: diag
  });
}
