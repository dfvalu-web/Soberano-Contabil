import { Result, Ok, Err } from '../types/result.js';

export interface DsrPayrollReflexInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  totalVariaveisBrl: number;
  diasUteisMes: number; // Ex: 25
  domingosEFeriadosMes: number; // Ex: 5
  aliquotaInssPatronalPercent?: number; // 20%
  aliquotaFgtsPercent?: number; // 8%
}

export interface DsrPayrollReflexResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  valorDsrSobreVariaveisBrl: number;
  baseTotalIncidenciaInssEFgtsBrl: number;
  valorInssPatronalDevidoBrl: number;
  valorFgtsDevidoBrl: number;
  rubricaEsocialDsr: '1010_DSR_SOBRE_VARIAVEIS';
  eventoEsocial: 'S-1200';
  statusDsr: 'DSR_E_ENCARGOS_CALCULADOS_COM_SUCESSO';
  diagnosticoDsr: string;
}

export function processOfficeDsrPayrollReflexEngine(input: DsrPayrollReflexInput): Result<DsrPayrollReflexResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    totalVariaveisBrl,
    diasUteisMes,
    domingosEFeriadosMes,
    aliquotaInssPatronalPercent = 20.0,
    aliquotaFgtsPercent = 8.0
  } = input;

  if (!funcionarioCpf || totalVariaveisBrl < 0 || diasUteisMes <= 0 || domingosEFeriadosMes <= 0) {
    return Err(new Error('CPF, variáveis e contagem de dias úteis e repousos são obrigatórios.'));
  }

  // DSR = (Total Variáveis / Dias Úteis) * Domingos e Feriados (Lei 605/49)
  const valorDsr = (totalVariaveisBrl / diasUteisMes) * domingosEFeriadosMes;
  const baseTotal = totalVariaveisBrl + valorDsr;

  const inssPatronal = (baseTotal * aliquotaInssPatronalPercent) / 100;
  const fgts = (baseTotal * aliquotaFgtsPercent) / 100;

  const diag = "Reflexo em DSR (" + nomeFuncionario + "): Variáveis: R$ " + totalVariaveisBrl.toFixed(2) + " | DSR (" + domingosEFeriadosMes + " repousos / " + diasUteisMes + " dias úteis): R$ " + valorDsr.toFixed(2) + " | Base Encargos: R$ " + baseTotal.toFixed(2) + " (INSS 20%: R$ " + inssPatronal.toFixed(2) + " | FGTS 8%: R$ " + fgts.toFixed(2) + ") | eSocial S-1200 Rubrica 1010.";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    valorDsrSobreVariaveisBrl: parseFloat(valorDsr.toFixed(2)),
    baseTotalIncidenciaInssEFgtsBrl: parseFloat(baseTotal.toFixed(2)),
    valorInssPatronalDevidoBrl: parseFloat(inssPatronal.toFixed(2)),
    valorFgtsDevidoBrl: parseFloat(fgts.toFixed(2)),
    rubricaEsocialDsr: '1010_DSR_SOBRE_VARIAVEIS',
    eventoEsocial: 'S-1200',
    statusDsr: 'DSR_E_ENCARGOS_CALCULADOS_COM_SUCESSO',
    diagnosticoDsr: diag
  });
}
