import { Result, Ok, Err } from '../types/result.js';

export interface TimeTrackingInput {
  cpf: string;
  nome: string;
  salarioHoraBrl: number;
  horasNormaisTrabalhadasMes: number; // Ex: 220h
  horasExtras50Qtd: number;
  horasExtras100Qtd: number;
  horasNoturnasQtd: number;
  horasBancoCreditoQtd: number;
  horasBancoDebitoQtd: number;
}

export interface TimeTrackingResult {
  cpf: string;
  nome: string;
  valorTotalHorasExtras50Brl: number;
  valorTotalHorasExtras100Brl: number;
  valorAdicionalNoturnoBrl: number;
  valorDsrSobreVariaveisBrl: number;
  saldoFinalBancoHorasQtd: number;
  totalVariaveisAPagarBrl: number;
  statusPonto: 'ESPELHO_DE_PONTO_FECHADO_CONFORME_PORTARIA_671_MTE';
  diagnosticoPonto: string;
}

export function processOfficeTimeTrackingOvertimeBankEngine(input: TimeTrackingInput): Result<TimeTrackingResult, Error> {
  const {
    cpf,
    nome,
    salarioHoraBrl,
    horasExtras50Qtd,
    horasExtras100Qtd,
    horasNoturnasQtd,
    horasBancoCreditoQtd,
    horasBancoDebitoQtd
  } = input;

  if (!cpf || salarioHoraBrl <= 0) {
    return Err(new Error('CPF do colaborador e valor do salário hora são obrigatórios.'));
  }

  const vHe50 = horasExtras50Qtd * (salarioHoraBrl * 1.5);
  const vHe100 = horasExtras100Qtd * (salarioHoraBrl * 2.0);
  const vNoturno = horasNoturnasQtd * (salarioHoraBrl * 0.20); // 20% Adicional Noturno Urbano

  // DSR sobre variáveis (~1/6 ou ~16.67%)
  const dsr = (vHe50 + vHe100 + vNoturno) / 6;

  const totalVariaveis = vHe50 + vHe100 + vNoturno + dsr;
  const saldoBancoHoras = horasBancoCreditoQtd - horasBancoDebitoQtd;

  const diag = "Espelho de Ponto (" + nome + " - Portaria 671 MTE): HE 50%: R$ " + vHe50.toLocaleString('pt-BR') + " | HE 100%: R$ " + vHe100.toLocaleString('pt-BR') + " | Adicional Noturno: R$ " + vNoturno.toLocaleString('pt-BR') + " | DSR s/ Variáveis: R$ " + dsr.toLocaleString('pt-BR') + " -> Total a Pagar na Folha: R$ " + totalVariaveis.toLocaleString('pt-BR') + " (Saldo Banco de Horas: " + saldoBancoHoras + "h).";

  return Ok({
    cpf,
    nome,
    valorTotalHorasExtras50Brl: parseFloat(vHe50.toFixed(2)),
    valorTotalHorasExtras100Brl: parseFloat(vHe100.toFixed(2)),
    valorAdicionalNoturnoBrl: parseFloat(vNoturno.toFixed(2)),
    valorDsrSobreVariaveisBrl: parseFloat(dsr.toFixed(2)),
    saldoFinalBancoHorasQtd: parseFloat(saldoBancoHoras.toFixed(2)),
    totalVariaveisAPagarBrl: parseFloat(totalVariaveis.toFixed(2)),
    statusPonto: 'ESPELHO_DE_PONTO_FECHADO_CONFORME_PORTARIA_671_MTE',
    diagnosticoPonto: diag
  });
}
