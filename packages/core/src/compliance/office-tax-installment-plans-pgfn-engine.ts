import { Result, Ok, Err } from '../types/result.js';

export interface TaxInstallmentPlanInput {
  clienteCnpj: string;
  razaoSocial: string;
  modalidadeParcelamento: 'TRANSACAO_PGFN_EDITAL' | 'SIMPLES_NACIONAL_ORDINARIO' | 'PREVIDENCIARIO_RFB' | 'PERT_FEDERAL';
  valorOriginalDividaBrl: number;
  descontoObtidoJurosMultaBrl: number;
  saldoDevedorConsolidadoBrl: number;
  totalParcelasPactuadas: number;
  parcelaAtualNumero: number;
  taxaSelicMesPercent: number; // Ex: 0.85%
  parcelasEmAtrasoCount: number;
}

export interface TaxInstallmentPlanResult {
  clienteCnpj: string;
  razaoSocial: string;
  modalidadeParcelamento: string;
  valorParcelaBaseBrl: number;
  valorParcelaAtualizadaSelicBrl: number;
  saldoDevedorRemanescenteBrl: number;
  parcelasRestantes: number;
  riscoRescisaoParcelamento: 'BAIXO_EM_DIA' | 'MEDIO_1_OU_2_PARCELAS_ATRASADAS' | 'CRITICO_RISCO_RESCISAO_PERDA_DESCONTOS';
  statusParcelamento: 'PARCELAMENTO_ATIVO_REGULAR';
  diagnosticoParcelamento: string;
}

export function processOfficeTaxInstallmentPlansPgfnEngine(input: TaxInstallmentPlanInput): Result<TaxInstallmentPlanResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    modalidadeParcelamento,
    valorOriginalDividaBrl,
    descontoObtidoJurosMultaBrl,
    saldoDevedorConsolidadoBrl,
    totalParcelasPactuadas,
    parcelaAtualNumero,
    taxaSelicMesPercent,
    parcelasEmAtrasoCount
  } = input;

  if (!clienteCnpj || saldoDevedorConsolidadoBrl <= 0 || totalParcelasPactuadas <= 0) {
    return Err(new Error('CNPJ, saldo consolidado e total de parcelas são obrigatórios.'));
  }

  const parcBase = saldoDevedorConsolidadoBrl / totalParcelasPactuadas;
  const parcAtualizada = parcBase * (1 + (taxaSelicMesPercent / 100));
  const parcRestantes = Math.max(0, totalParcelasPactuadas - parcelaAtualNumero);
  const saldoRemanescente = parcBase * parcRestantes;

  let risco: 'BAIXO_EM_DIA' | 'MEDIO_1_OU_2_PARCELAS_ATRASADAS' | 'CRITICO_RISCO_RESCISAO_PERDA_DESCONTOS' = 'BAIXO_EM_DIA';
  if (parcelasEmAtrasoCount >= 3) risco = 'CRITICO_RISCO_RESCISAO_PERDA_DESCONTOS';
  else if (parcelasEmAtrasoCount > 0) risco = 'MEDIO_1_OU_2_PARCELAS_ATRASADAS';

  const diag = "Parcelamento (" + razaoSocial + " - " + modalidadeParcelamento + "): Parcela " + parcelaAtualNumero + "/" + totalParcelasPactuadas + " no valor de R$ " + parcAtualizada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (Selic: " + taxaSelicMesPercent + "%) | Saldo Remanescente: R$ " + saldoRemanescente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Risco de Rescisão: " + risco + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    modalidadeParcelamento,
    valorParcelaBaseBrl: parseFloat(parcBase.toFixed(2)),
    valorParcelaAtualizadaSelicBrl: parseFloat(parcAtualizada.toFixed(2)),
    saldoDevedorRemanescenteBrl: parseFloat(saldoRemanescente.toFixed(2)),
    parcelasRestantes: parcRestantes,
    riscoRescisaoParcelamento: risco,
    statusParcelamento: 'PARCELAMENTO_ATIVO_REGULAR',
    diagnosticoParcelamento: diag
  });
}
