import { Result, Ok, Err } from '../types/result.js';

export interface ClientClosingStatusInput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  statusDpFolha: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE';
  statusFiscalSped: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE';
  statusContabilBalancete: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE';
  statusGuiasDctfWeb: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE';
  statusCndRegularidade: 'VALIDA' | 'EXPIRADA_OU_COM_PENDENCIA';
}

export interface MultiClientClosingGridInput {
  escritorioCnpj: string;
  escritorioNome: string;
  competenciaMesAno: string;
  clientesStatus: ClientClosingStatusInput[];
}

export interface ClientEvaluatedOutput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: string;
  statusGeralCliente: 'TOTALMENTE_FECHADO_VERDE' | 'EM_PROGRESSO_AMARELO' | 'ATENCAO_CRITICA_VERMELHO';
  percentualConclusaoClientePercent: number;
}

export interface MultiClientClosingGridResult {
  escritorioNome: string;
  competenciaMesAno: string;
  totalClientesCarteiraCount: number;
  totalClientesTotalmenteFechadosCount: number;
  totalClientesEmAndamentoCount: number;
  totalClientesComPendenciaCriticaCount: number;
  taxaFechamentoEscritorioPercent: number;
  clientesAvaliados: ClientEvaluatedOutput[];
  statusGrade: 'GRADE_MULTI_EMPRESA_CONSOLIDADA_COM_SUCESSO';
  diagnosticoGrade: string;
}

export function processOfficeMultiClientClosingGridEngine(input: MultiClientClosingGridInput): Result<MultiClientClosingGridResult, Error> {
  const {
    escritorioCnpj,
    escritorioNome,
    competenciaMesAno,
    clientesStatus
  } = input;

  if (!escritorioCnpj || !clientesStatus || clientesStatus.length === 0) {
    return Err(new Error('CNPJ do escritório e lista de clientes da carteira são obrigatórios.'));
  }

  let totalFechados = 0;
  let totalAndamento = 0;
  let totalCriticos = 0;
  const avaliados: ClientEvaluatedOutput[] = [];

  for (const c of clientesStatus) {
    let pontos = 0;
    if (c.statusDpFolha === 'CONCLUIDO') pontos += 20;
    if (c.statusFiscalSped === 'CONCLUIDO') pontos += 20;
    if (c.statusContabilBalancete === 'CONCLUIDO') pontos += 20;
    if (c.statusGuiasDctfWeb === 'CONCLUIDO') pontos += 20;
    if (c.statusCndRegularidade === 'VALIDA') pontos += 20;

    let statusGeral: 'TOTALMENTE_FECHADO_VERDE' | 'EM_PROGRESSO_AMARELO' | 'ATENCAO_CRITICA_VERMELHO' = 'EM_PROGRESSO_AMARELO';

    if (pontos === 100) {
      statusGeral = 'TOTALMENTE_FECHADO_VERDE';
      totalFechados++;
    } else if (c.statusCndRegularidade === 'EXPIRADA_OU_COM_PENDENCIA' || (c.statusDpFolha === 'PENDENTE' && c.statusFiscalSped === 'PENDENTE')) {
      statusGeral = 'ATENCAO_CRITICA_VERMELHO';
      totalCriticos++;
    } else {
      statusGeral = 'EM_PROGRESSO_AMARELO';
      totalAndamento++;
    }

    avaliados.push({
      clienteCnpj: c.clienteCnpj,
      razaoSocial: c.razaoSocial,
      regimeTributario: c.regimeTributario,
      statusGeralCliente: statusGeral,
      percentualConclusaoClientePercent: pontos
    });
  }

  const taxaFechamento = (totalFechados / clientesStatus.length) * 100;

  const diag = "Cockpit Multi-Empresa (" + escritorioNome + " - " + competenciaMesAno + "): " + clientesStatus.length + " clientes na grade | Fechados: " + totalFechados + " (" + taxaFechamento.toFixed(1) + "%) | Em Andamento: " + totalAndamento + " | Pendências Críticas: " + totalCriticos + ".";

  return Ok({
    escritorioNome,
    competenciaMesAno,
    totalClientesCarteiraCount: clientesStatus.length,
    totalClientesTotalmenteFechadosCount: totalFechados,
    totalClientesEmAndamentoCount: totalAndamento,
    totalClientesComPendenciaCriticaCount: totalCriticos,
    taxaFechamentoEscritorioPercent: parseFloat(taxaFechamento.toFixed(2)),
    clientesAvaliados: avaliados,
    statusGrade: 'GRADE_MULTI_EMPRESA_CONSOLIDADA_COM_SUCESSO',
    diagnosticoGrade: diag
  });
}
