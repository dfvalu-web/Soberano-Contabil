import { Result, Ok, Err } from '../types/result.js';

export interface TerminationInput {
  cpfColaborador: string;
  nomeColaborador: string;
  salarioBaseBrl: number;
  tipoRescisao: 'DISPENSA_SEM_JUSTA_CAUSA' | 'PEDIDO_DE_DEMISSAO' | 'ACORDO_MUTUO_ART_484A';
  anosTrabalhadosCompletos: number;
  diasSaldoSalarioMesRescisao: number; // Ex: 15 dias
  meses13Proporcional: number; // Ex: 8 meses
  mesesFeriasProporcionais: number; // Ex: 8 meses
  saldoFgtsParaFinsRescisoriosBrl: number;
}

export interface TerminationResult {
  cpfColaborador: string;
  nomeColaborador: string;
  diasAvisoPrevioLei12506: number;
  valorAvisoPrevioIndenizadoBrl: number;
  valorSaldoSalarioBrl: number;
  valor13ProporcionalBrl: number;
  valorFeriasProporcionaisTercoBrl: number;
  totalBrutoRescisaoBrl: number;
  multaRescisoriaFgts40Brl: number;
  totalLiquidoPagarTrctBrl: number;
  prazoPagamentoLimiteDias: number; // 10 dias corridos (Art. 477 CLT)
  statusRescisao: 'TRCT_CALCULADO_FGTS_DIGITAL_GERADO';
  diagnosticoRescisao: string;
}

export function processOfficeDigitalContractTerminationEngine(input: TerminationInput): Result<TerminationResult, Error> {
  const {
    cpfColaborador,
    nomeColaborador,
    salarioBaseBrl,
    tipoRescisao,
    anosTrabalhadosCompletos,
    diasSaldoSalarioMesRescisao,
    meses13Proporcional,
    mesesFeriasProporcionais,
    saldoFgtsParaFinsRescisoriosBrl
  } = input;

  if (!cpfColaborador || salarioBaseBrl <= 0) {
    return Err(new Error('CPF do colaborador e salário base positivo são obrigatórios para rescisão.'));
  }

  // Lei 12.506/11: 30 dias + 3 dias por ano completo trabalhado (máximo 90 dias)
  const diasAviso = Math.min(90, 30 + (anosTrabalhadosCompletos * 3));
  const valorDiaria = salarioBaseBrl / 30;

  let valorAviso = 0;
  let percentualMultaFgts = 0.40; // 40% sem justa causa

  if (tipoRescisao === 'DISPENSA_SEM_JUSTA_CAUSA') {
    valorAviso = valorDiaria * diasAviso;
  } else if (tipoRescisao === 'ACORDO_MUTUO_ART_484A') {
    valorAviso = (valorDiaria * diasAviso) / 2; // 50% do aviso
    percentualMultaFgts = 0.20; // 20% de multa FGTS
  } else {
    percentualMultaFgts = 0; // Pedido de demissão: sem multa FGTS
  }

  const valorSaldoSalario = valorDiaria * diasSaldoSalarioMesRescisao;
  const valor13 = (salarioBaseBrl / 12) * meses13Proporcional;
  const valorFerias = ((salarioBaseBrl / 12) * mesesFeriasProporcionais) * 1.333333;

  const totalBruto = valorAviso + valorSaldoSalario + valor13 + valorFerias;
  const multaFgts = saldoFgtsParaFinsRescisoriosBrl * percentualMultaFgts;

  // Desconto INSS simplificado sobre saldo salário e 13º
  const inss = (valorSaldoSalario + valor13) * 0.09;
  const totalLiquido = totalBruto - inss;

  const diag = "Rescisão de Contrato (" + nomeColaborador + " - " + tipoRescisao + "): Saldo Salário (" + diasSaldoSalarioMesRescisao + "d): R$ " + valorSaldoSalario.toLocaleString('pt-BR') + " | 13º: R$ " + valor13.toLocaleString('pt-BR') + " | Férias+1/3: R$ " + valorFerias.toLocaleString('pt-BR') + " | Aviso Lei 12.506 (" + diasAviso + "d): R$ " + valorAviso.toLocaleString('pt-BR') + " | Multa FGTS (" + (percentualMultaFgts * 100) + "%): R$ " + multaFgts.toLocaleString('pt-BR') + " -> Líquido TRCT: R$ " + totalLiquido.toLocaleString('pt-BR') + " (Prazo: 10 dias corridos).";

  return Ok({
    cpfColaborador,
    nomeColaborador,
    diasAvisoPrevioLei12506: diasAviso,
    valorAvisoPrevioIndenizadoBrl: parseFloat(valorAviso.toFixed(2)),
    valorSaldoSalarioBrl: parseFloat(valorSaldoSalario.toFixed(2)),
    valor13ProporcionalBrl: parseFloat(valor13.toFixed(2)),
    valorFeriasProporcionaisTercoBrl: parseFloat(valorFerias.toFixed(2)),
    totalBrutoRescisaoBrl: parseFloat(totalBruto.toFixed(2)),
    multaRescisoriaFgts40Brl: parseFloat(multaFgts.toFixed(2)),
    totalLiquidoPagarTrctBrl: parseFloat(totalLiquido.toFixed(2)),
    prazoPagamentoLimiteDias: 10,
    statusRescisao: 'TRCT_CALCULADO_FGTS_DIGITAL_GERADO',
    diagnosticoRescisao: diag
  });
}
