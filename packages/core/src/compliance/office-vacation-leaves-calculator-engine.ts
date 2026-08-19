import { Result, Ok, Err } from '../types/result.js';

export interface EmployeeVacationInput {
  cpf: string;
  nome: string;
  salarioBaseBrl: number;
  dataInicioAquisitivo: string;
  dataFimAquisitivo: string;
  diasGozoFerias: number; // Ex: 20 ou 30 dias
  venderAbonoPecuniario10Dias: boolean;
  adiantamento13Salario: boolean;
  faltasInjustificadasNoPeriodoQtd: number;
}

export interface EmployeeVacationResult {
  cpf: string;
  nome: string;
  diasDireitoFerias: number;
  valorDiasGozoBrl: number;
  valorTercoConstitucionalBrl: number;
  valorAbonoPecuniarioBrl: number;
  valorTercoAbonoBrl: number;
  valorAdiantamento13Brl: number;
  totalBrutoFeriasBrl: number;
  descontoInssFeriasBrl: number;
  descontoIrrfFeriasBrl: number;
  totalLiquidoPagarFeriasBrl: number;
  prazoPagamentoLimite: string; // 2 dias antes do início do gozo (Art. 145 CLT)
  statusCalculo: 'RECIBO_DE_FERIAS_CALCULADO_ESOCIAL_S2230_PRONTO';
  diagnosticoFerias: string;
}

export function processOfficeVacationLeavesCalculatorEngine(input: EmployeeVacationInput): Result<EmployeeVacationResult, Error> {
  const {
    cpf,
    nome,
    salarioBaseBrl,
    diasGozoFerias,
    venderAbonoPecuniario10Dias,
    adiantamento13Salario,
    faltasInjustificadasNoPeriodoQtd
  } = input;

  if (!cpf || salarioBaseBrl <= 0) {
    return Err(new Error('CPF do colaborador e salário base positivo são obrigatórios.'));
  }

  // Tabela de perda de dias de férias por faltas injustificadas (Art. 130 CLT)
  let diasDireito = 30;
  if (faltasInjustificadasNoPeriodoQtd >= 6 && faltasInjustificadasNoPeriodoQtd <= 14) diasDireito = 24;
  else if (faltasInjustificadasNoPeriodoQtd >= 15 && faltasInjustificadasNoPeriodoQtd <= 23) diasDireito = 18;
  else if (faltasInjustificadasNoPeriodoQtd >= 24 && faltasInjustificadasNoPeriodoQtd <= 32) diasDireito = 12;
  else if (faltasInjustificadasNoPeriodoQtd > 32) diasDireito = 0;

  const valorDiaria = salarioBaseBrl / 30;
  const valorGozo = valorDiaria * diasGozoFerias;
  const valorTercoGozo = valorGozo / 3;

  let valorAbono = 0;
  let valorTercoAbono = 0;
  if (venderAbonoPecuniario10Dias) {
    valorAbono = valorDiaria * 10;
    valorTercoAbono = valorAbono / 3;
  }

  let valorAdiantamento13 = 0;
  if (adiantamento13Salario) {
    valorAdiantamento13 = salarioBaseBrl * 0.50; // 50% de adiantamento
  }

  const baseCalculoTributavel = valorGozo + valorTercoGozo;
  const inss = Math.min(950.00, baseCalculoTributavel * 0.09);
  const irrf = baseCalculoTributavel > 2259.20 ? (baseCalculoTributavel - inss) * 0.075 - 169.44 : 0;

  const totalBruto = valorGozo + valorTercoGozo + valorAbono + valorTercoAbono + valorAdiantamento13;
  const totalLiquido = totalBruto - inss - Math.max(0, irrf);

  const diag = "Recibo de Férias (" + nome + " - CPF " + cpf + "): Gozo de " + diasGozoFerias + " dias | Bruto: R$ " + totalBruto.toLocaleString('pt-BR') + " (1/3: R$ " + valorTercoGozo.toLocaleString('pt-BR') + ") | Abono: R$ " + valorAbono.toLocaleString('pt-BR') + " | Líquido a Pagar: R$ " + totalLiquido.toLocaleString('pt-BR') + " (Pagamento obrigatório até 2 dias antes do início do gozo - Art. 145 CLT).";

  return Ok({
    cpf,
    nome,
    diasDireitoFerias: diasDireito,
    valorDiasGozoBrl: parseFloat(valorGozo.toFixed(2)),
    valorTercoConstitucionalBrl: parseFloat(valorTercoGozo.toFixed(2)),
    valorAbonoPecuniarioBrl: parseFloat(valorAbono.toFixed(2)),
    valorTercoAbonoBrl: parseFloat(valorTercoAbono.toFixed(2)),
    valorAdiantamento13Brl: parseFloat(valorAdiantamento13.toFixed(2)),
    totalBrutoFeriasBrl: parseFloat(totalBruto.toFixed(2)),
    descontoInssFeriasBrl: parseFloat(inss.toFixed(2)),
    descontoIrrfFeriasBrl: parseFloat(Math.max(0, irrf).toFixed(2)),
    totalLiquidoPagarFeriasBrl: parseFloat(totalLiquido.toFixed(2)),
    prazoPagamentoLimite: '2_DIAS_UTEIS_ANTES_DO_INICIO',
    statusCalculo: 'RECIBO_DE_FERIAS_CALCULADO_ESOCIAL_S2230_PRONTO',
    diagnosticoFerias: diag
  });
}
