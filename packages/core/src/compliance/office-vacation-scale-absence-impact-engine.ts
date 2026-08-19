import { Result, Ok, Err } from '../types/result.js';

export interface VacationScaleAbsenceInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  totalFaltasInjustificadasPeriodo: number;
}

export interface VacationScaleAbsenceResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  totalFaltasPeriodo: number;
  diasDireitoFeriasClt: number; // 30, 24, 18, 12 ou 0 dias
  diasPerdidosFeriasCount: number;
  perdeuTotalDireitoFerias: boolean;
  enquadramentoLegalClt: string;
  statusEscala: 'ESCALA_FERIAS_ATUALIZADA_CONFORME_ART_130_CLT';
  diagnosticoEscala: string;
}

export function processOfficeVacationScaleAbsenceImpactEngine(input: VacationScaleAbsenceInput): Result<VacationScaleAbsenceResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    periodoAquisitivoInicio,
    periodoAquisitivoFim,
    totalFaltasInjustificadasPeriodo
  } = input;

  if (!funcionarioCpf || totalFaltasInjustificadasPeriodo < 0) {
    return Err(new Error('CPF do empregado e total de faltas no período são obrigatórios.'));
  }

  let diasDireito = 30;
  let enquadramento = 'Art. 130, I CLT - Até 5 faltas (30 dias de férias)';

  if (totalFaltasInjustificadasPeriodo <= 5) {
    diasDireito = 30;
    enquadramento = 'Art. 130, I CLT - Até 5 faltas (30 dias corridos)';
  } else if (totalFaltasInjustificadasPeriodo <= 14) {
    diasDireito = 24;
    enquadramento = 'Art. 130, II CLT - De 6 a 14 faltas (24 dias corridos)';
  } else if (totalFaltasInjustificadasPeriodo <= 23) {
    diasDireito = 18;
    enquadramento = 'Art. 130, III CLT - De 15 a 23 faltas (18 dias corridos)';
  } else if (totalFaltasInjustificadasPeriodo <= 32) {
    diasDireito = 12;
    enquadramento = 'Art. 130, IV CLT - De 24 a 32 faltas (12 dias corridos)';
  } else {
    diasDireito = 0;
    enquadramento = 'Art. 130 CLT - Mais de 32 faltas (Perda Total do Direito a Férias)';
  }

  const diasPerdidos = 30 - diasDireito;
  const perdeuTotal = diasDireito === 0;

  const diag = "Escala de Férias Art. 130 CLT (" + nomeFuncionario + " - PA " + periodoAquisitivoInicio + " a " + periodoAquisitivoFim + "): " + totalFaltasInjustificadasPeriodo + " faltas injustificadas -> Direito a " + diasDireito + " dias de férias (" + diasPerdidos + " dias perdidos) | " + enquadramento + ".";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    totalFaltasPeriodo: totalFaltasInjustificadasPeriodo,
    diasDireitoFeriasClt: diasDireito,
    diasPerdidosFeriasCount: diasPerdidos,
    perdeuTotalDireitoFerias: perdeuTotal,
    enquadramentoLegalClt: enquadramento,
    statusEscala: 'ESCALA_FERIAS_ATUALIZADA_CONFORME_ART_130_CLT',
    diagnosticoEscala: diag
  });
}
