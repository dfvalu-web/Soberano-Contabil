import { Result, Ok, Err } from '../types/result.js';

export interface OvertimeNightInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  salarioBaseBrl: number;
  divisorMensalHoras: number; // Ex: 220h
  horasExtras50Count: number;
  horasExtras100Count: number;
  horasNoturnasRelogioCount: number; // 22h às 05h (horas normais de 60min)
}

export interface OvertimeNightResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  valorHoraNormalBrl: number;
  valorTotalHe50Brl: number;
  valorTotalHe100Brl: number;
  horasNoturnasFictasConvertidasCount: number; // Fator 1.142857 (52m30s)
  valorTotalAdicionalNoturno20Brl: number;
  totalVariaveisTrabalhistasBrl: number;
  statusApuracao: 'HORAS_EXTRAS_E_NOTURNO_APURADOS_COM_SUCESSO';
  diagnosticoVariaveis: string;
}

export function processOfficeOvertimeNightShiftAuditEngine(input: OvertimeNightInput): Result<OvertimeNightResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    salarioBaseBrl,
    divisorMensalHoras = 220,
    horasExtras50Count,
    horasExtras100Count,
    horasNoturnasRelogioCount
  } = input;

  if (!funcionarioCpf || salarioBaseBrl <= 0 || divisorMensalHoras <= 0) {
    return Err(new Error('CPF, salário base e divisor mensal são obrigatórios.'));
  }

  const valorHoraNormal = salarioBaseBrl / divisorMensalHoras;

  // HE 50% e 100%
  const totalHe50 = horasExtras50Count * (valorHoraNormal * 1.50);
  const totalHe100 = horasExtras100Count * (valorHoraNormal * 2.00);

  // Hora Ficta Noturna (60 / 52.5 = 1.14285714)
  const horasFictas = horasNoturnasRelogioCount * (60 / 52.5);
  const totalNoturno = horasFictas * (valorHoraNormal * 0.20); // 20% de adicional

  const totalVariaveis = totalHe50 + totalHe100 + totalNoturno;

  const diag = "Apuração de Variáveis (" + nomeFuncionario + "): Hora Normal: R$ " + valorHoraNormal.toFixed(2) + " | HE 50% (" + horasExtras50Count + "h): R$ " + totalHe50.toFixed(2) + " | HE 100% (" + horasExtras100Count + "h): R$ " + totalHe100.toFixed(2) + " | Noturno (" + horasNoturnasRelogioCount + "h relógio -> " + horasFictas.toFixed(2) + "h fictas): R$ " + totalNoturno.toFixed(2) + " | Total: R$ " + totalVariaveis.toFixed(2) + ".";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    valorHoraNormalBrl: parseFloat(valorHoraNormal.toFixed(2)),
    valorTotalHe50Brl: parseFloat(totalHe50.toFixed(2)),
    valorTotalHe100Brl: parseFloat(totalHe100.toFixed(2)),
    horasNoturnasFictasConvertidasCount: parseFloat(horasFictas.toFixed(2)),
    valorTotalAdicionalNoturno20Brl: parseFloat(totalNoturno.toFixed(2)),
    totalVariaveisTrabalhistasBrl: parseFloat(totalVariaveis.toFixed(2)),
    statusApuracao: 'HORAS_EXTRAS_E_NOTURNO_APURADOS_COM_SUCESSO',
    diagnosticoVariaveis: diag
  });
}
