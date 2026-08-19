import { Result, Ok, Err } from '../types/result.js';

export interface FatorROptimizerInput {
  clienteCnpj: string;
  razaoSocial: string;
  receitaBrutaAcumulada12MesesBrl: number;
  faturamentoMesAtualBrl: number;
  folhaAtualAcumulada12MesesBrl: number;
}

export interface FatorROptimizerResult {
  clienteCnpj: string;
  razaoSocial: string;
  fatorRAtualPercent: number;
  enquadramentoAtual: 'ANEXO_III_ALIQUOTA_REDUZIDA' | 'ANEXO_V_ALIQUOTA_MAJORADA';
  folhaIdealNecessaria12MesesBrl: number; // 28% da RBT12
  ajusteProLaboreMesAtualBrl: number;
  economiaTributariaEstimadaMesBrl: number; // Diferença de ~9.5% entre Anexo V e III
  statusOtimizacao: 'FATOR_R_OTIMIZADO_ANEXO_III';
  diagnosticoFatorR: string;
}

export function processOfficeFatorROptimizerEngine(input: FatorROptimizerInput): Result<FatorROptimizerResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    receitaBrutaAcumulada12MesesBrl,
    faturamentoMesAtualBrl,
    folhaAtualAcumulada12MesesBrl
  } = input;

  if (!clienteCnpj || receitaBrutaAcumulada12MesesBrl <= 0 || faturamentoMesAtualBrl < 0) {
    return Err(new Error('CNPJ e receita bruta válida são obrigatórios.'));
  }

  const fatorR = (folhaAtualAcumulada12MesesBrl / receitaBrutaAcumulada12MesesBrl) * 100;
  const meta28Folha = receitaBrutaAcumulada12MesesBrl * 0.28;
  const deficitFolha = Math.max(0, meta28Folha - folhaAtualAcumulada12MesesBrl);

  const enquadramento = fatorR >= 28 ? 'ANEXO_III_ALIQUOTA_REDUZIDA' : 'ANEXO_V_ALIQUOTA_MAJORADA';
  // Economia média de 15.5% (Anexo V) - 6.0% (Anexo III) = 9.5% sobre o faturamento do mês
  const economiaMes = faturamentoMesAtualBrl * 0.095;

  const diag = "Otimizador Fator R (" + razaoSocial + "): Fator R Atual = " + fatorR.toFixed(2) + "% -> " + enquadramento + " | Meta de Folha (28%): R$ " + meta28Folha.toLocaleString('pt-BR') + " | Pró-labore sugerido para atingir Anexo III: R$ " + (deficitFolha > 0 ? deficitFolha.toLocaleString('pt-BR') : 'JÁ ATINGIDO') + " -> Economia estimada de R$ " + economiaMes.toLocaleString('pt-BR') + "/mês.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    fatorRAtualPercent: parseFloat(fatorR.toFixed(2)),
    enquadramentoAtual: enquadramento,
    folhaIdealNecessaria12MesesBrl: parseFloat(meta28Folha.toFixed(2)),
    ajusteProLaboreMesAtualBrl: parseFloat(deficitFolha.toFixed(2)),
    economiaTributariaEstimadaMesBrl: parseFloat(economiaMes.toFixed(2)),
    statusOtimizacao: 'FATOR_R_OTIMIZADO_ANEXO_III',
    diagnosticoFatorR: diag
  });
}
