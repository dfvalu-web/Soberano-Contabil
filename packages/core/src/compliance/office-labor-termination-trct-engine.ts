import { Result, Ok, Err } from '../types/result.js';

export interface LaborTerminationInput {
  clienteCnpj: string;
  razaoSocial: string;
  colaboradorCpf: string;
  nomeColaborador: string;
  salarioBaseBrl: number;
  motivoRescisao: 'SEM_JUSTA_CAUSA_EMPREGADOR' | 'PEDIDO_DEMISSAO_EMPREGADO' | 'ACORDO_MUTUO_ART_484A' | 'COM_JUSTA_CAUSA';
  mesesTrabalhadosAnoCorrente: number;
  anosCompletosEmpresa: number;
}

export interface LaborTerminationResult {
  clienteCnpj: string;
  razaoSocial: string;
  colaboradorCpf: string;
  nomeColaborador: string;
  motivoRescisao: string;
  valorAvisoPrevioBrl: number;
  valorDecimoTerceiroPropBrl: number;
  valorFeriasProporcionaisMaisTercoBrl: number;
  valorTotalLiquidoRescisaoBrl: number;
  documentoTrctDigitalGerado: string;
  statusRescisao: 'RESCISAO_CALCULADA_TRCT_EMITIDO';
  diagnosticoRescisao: string;
}

export function processOfficeLaborTerminationTrctEngine(input: LaborTerminationInput): Result<LaborTerminationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    colaboradorCpf,
    nomeColaborador,
    salarioBaseBrl,
    motivoRescisao,
    mesesTrabalhadosAnoCorrente,
    anosCompletosEmpresa
  } = input;

  if (!clienteCnpj || !colaboradorCpf || salarioBaseBrl <= 0) {
    return Err(new Error('CNPJ, CPF e salário base são obrigatórios.'));
  }

  // Aviso prévio proporcional Lei 12.506/11 (30 dias + 3 dias por ano completo até 90 dias)
  let diasAviso = 30;
  if (motivoRescisao === 'SEM_JUSTA_CAUSA_EMPREGADOR') {
    diasAviso = Math.min(90, 30 + (anosCompletosEmpresa * 3));
  }
  const valorAviso = motivoRescisao === 'SEM_JUSTA_CAUSA_EMPREGADOR' ? (salarioBaseBrl / 30) * diasAviso : 0;

  // 13º proporcional
  const valor13 = (salarioBaseBrl / 12) * mesesTrabalhadosAnoCorrente;

  // Férias proporcionais + 1/3
  const feriasSimples = (salarioBaseBrl / 12) * mesesTrabalhadosAnoCorrente;
  const valorFeriasTotal = feriasSimples * 1.3333333333;

  let totalLiquido = valor13 + valorFeriasTotal;
  if (motivoRescisao === 'SEM_JUSTA_CAUSA_EMPREGADOR') {
    totalLiquido += valorAviso;
  }

  const trct = "TRCT Portaria MTE nº 1.057/12 - Empregado: " + nomeColaborador + " (CPF: " + colaboradorCpf + ") | Saldo Líquido Rescisório: R$ " + totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Rescisão Trabalhista (" + nomeColaborador + " - " + motivoRescisao + "): Aviso Prévio: R$ " + valorAviso.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + diasAviso + " dias) | 13º Proporcional: R$ " + valor13.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Férias + 1/3: R$ " + valorFeriasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Total Líquido TRCT: R$ " + totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    colaboradorCpf,
    nomeColaborador,
    motivoRescisao,
    valorAvisoPrevioBrl: parseFloat(valorAviso.toFixed(2)),
    valorDecimoTerceiroPropBrl: parseFloat(valor13.toFixed(2)),
    valorFeriasProporcionaisMaisTercoBrl: parseFloat(valorFeriasTotal.toFixed(2)),
    valorTotalLiquidoRescisaoBrl: parseFloat(totalLiquido.toFixed(2)),
    documentoTrctDigitalGerado: trct,
    statusRescisao: 'RESCISAO_CALCULADA_TRCT_EMITIDO',
    diagnosticoRescisao: diag
  });
}
