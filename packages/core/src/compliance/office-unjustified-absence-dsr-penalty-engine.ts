import { Result, Ok, Err } from '../types/result.js';

export interface UnjustifiedAbsenceInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  salarioBaseBrl: number;
  quantidadeDiasFaltasInjustificadas: number;
  quantidadeDsrDescontadosCount: number; // 1 DSR por semana com falta
}

export interface UnjustifiedAbsenceResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  valorDiaSalarioBrl: number;
  valorTotalDescontoFaltasBrl: number;
  valorTotalDescontoDsrBrl: number;
  totalDescontosFolhaBrl: number;
  remuneracaoLiquidaDevidaBrl: number;
  rubricaEsocialFalta: '5002_FALTAS_INJUSTIFICADAS';
  rubricaEsocialDsrDescontado: '5003_DSR_DESCONTADO';
  statusApuracao: 'FALTAS_E_DSR_APURADOS_COM_SUCESSO';
  diagnosticoFaltas: string;
}

export function processOfficeUnjustifiedAbsenceDsrPenaltyEngine(input: UnjustifiedAbsenceInput): Result<UnjustifiedAbsenceResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    salarioBaseBrl,
    quantidadeDiasFaltasInjustificadas,
    quantidadeDsrDescontadosCount
  } = input;

  if (!funcionarioCpf || salarioBaseBrl <= 0 || quantidadeDiasFaltasInjustificadas < 0) {
    return Err(new Error('CPF, salário base e quantidade de faltas são obrigatórios.'));
  }

  const valorDia = salarioBaseBrl / 30; // Padrão mensalista

  const descontoFaltas = quantidadeDiasFaltasInjustificadas * valorDia;
  const descontoDsr = quantidadeDsrDescontadosCount * valorDia;
  const totalDescontos = descontoFaltas + descontoDsr;
  const salarioLiquido = Math.max(0, salarioBaseBrl - totalDescontos);

  const diag = "Faltas e DSR (" + nomeFuncionario + "): Salário: R$ " + salarioBaseBrl.toFixed(2) + " (Dia: R$ " + valorDia.toFixed(2) + ") | " + quantidadeDiasFaltasInjustificadas + " faltas (R$ " + descontoFaltas.toFixed(2) + ") + " + quantidadeDsrDescontadosCount + " DSRs perdidos (R$ " + descontoDsr.toFixed(2) + ") | Desconto Total: R$ " + totalDescontos.toFixed(2) + " | eSocial Rubricas 5002/5003.";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    valorDiaSalarioBrl: parseFloat(valorDia.toFixed(2)),
    valorTotalDescontoFaltasBrl: parseFloat(descontoFaltas.toFixed(2)),
    valorTotalDescontoDsrBrl: parseFloat(descontoDsr.toFixed(2)),
    totalDescontosFolhaBrl: parseFloat(totalDescontos.toFixed(2)),
    remuneracaoLiquidaDevidaBrl: parseFloat(salarioLiquido.toFixed(2)),
    rubricaEsocialFalta: '5002_FALTAS_INJUSTIFICADAS',
    rubricaEsocialDsrDescontado: '5003_DSR_DESCONTADO',
    statusApuracao: 'FALTAS_E_DSR_APURADOS_COM_SUCESSO',
    diagnosticoFaltas: diag
  });
}
