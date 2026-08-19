import { Result, Ok, Err } from '../types/result.js';

export interface JobStabilityInput {
  empregadoCpf: string;
  empregadoNome: string;
  tipoEstabilidade: 'ACIDENTARIA_INSS_B91' | 'GESTANTE_ADCT' | 'CIPA_TITULAR_SUPLENTE' | 'PRE_APOSENTADORIA_CCT';
  dataInicioEstabilidade: string; // YYYY-MM-DD
  dataTerminoEstabilidade: string; // YYYY-MM-DD
  tentativaDemissaoData: string; // YYYY-MM-DD
}

export interface JobStabilityResult {
  empregadoCpf: string;
  empregadoNome: string;
  tipoEstabilidade: string;
  estaEmPeriodoEstabilitario: boolean;
  diasRestantesEstabilidade: number;
  bloqueioDemissaoSemJustaCausa: boolean;
  statusEstabilidade: 'ESTABILIDADE_PROVISORIA_ATIVA_BLOQUEIO_DEMISSAO' | 'PERIODO_ESTABILITARIO_CONCLUIDO';
  diagnosticoEstabilidade: string;
}

export function processOfficeJobTenureStabilityInssEngine(input: JobStabilityInput): Result<JobStabilityResult, Error> {
  const {
    empregadoCpf,
    empregadoNome,
    tipoEstabilidade,
    dataInicioEstabilidade,
    dataTerminoEstabilidade,
    tentativaDemissaoData
  } = input;

  if (!empregadoCpf || !dataInicioEstabilidade || !dataTerminoEstabilidade) {
    return Err(new Error('CPF do empregado e datas de início/término da estabilidade são obrigatórios.'));
  }

  const dtTermino = new Date(dataTerminoEstabilidade).getTime();
  const dtTentativa = new Date(tentativaDemissaoData).getTime();

  const emEstabilidade = dtTentativa <= dtTermino;
  const diasRestantes = emEstabilidade ? Math.ceil((dtTermino - dtTentativa) / (1000 * 60 * 60 * 24)) : 0;

  const status = emEstabilidade ? 'ESTABILIDADE_PROVISORIA_ATIVA_BLOQUEIO_DEMISSAO' : 'PERIODO_ESTABILITARIO_CONCLUIDO';

  const diag = "Estabilidade Provisória (" + empregadoNome + " - " + tipoEstabilidade + "): Empregado protegido até " + dataTerminoEstabilidade + " (" + diasRestantes + " dias restantes) | Demissão sem justa causa: " + (emEstabilidade ? "BLOQUEADA (Risco de Reintegração Judicial)" : "PERMITIDA") + ".";

  return Ok({
    empregadoCpf,
    empregadoNome,
    tipoEstabilidade,
    estaEmPeriodoEstabilitario: emEstabilidade,
    diasRestantesEstabilidade: diasRestantes,
    bloqueioDemissaoSemJustaCausa: emEstabilidade,
    statusEstabilidade: status,
    diagnosticoEstabilidade: diag
  });
}
