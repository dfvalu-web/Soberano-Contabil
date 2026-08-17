import { Result, Ok, Err } from '../../types/result.js';

export interface FapEstablishmentInput {
  estabelecimentoId: string;
  cnpjFilial: string;
  estabelecimentoNome: string; // Ex: 'Soberano Filial Fábrica 01 / Filial Centro Logístico'
  folhaPagamentoMensalBrl: number;
  aliquotaRatBasePercent: number; // 1%, 2% ou 3%
  fapEstabelecimento: number; // Varia de 0.5000 a 2.0000
}

export interface FapEstablishmentResult {
  estabelecimentoId: string;
  cnpjFilial: string;
  estabelecimentoNome: string;
  aliquotaRatBasePercent: number;
  fapEstabelecimento: number;
  aliquotaRatAjustadaEfetivaPercent: number; // RAT * FAP
  valorRatMensalDevidoBrl: number;
  statusFap: 'BONUS_ECONOMIA' | 'NEUTRO' | 'MALUS_SOBRECUSTO';
  diferencialFinanceiroMensalVsNeutroBrl: number; // Economia (se negativo) ou Custo Extra (se positivo)
  economiaAnualProjetadaBrl: number; // Com 13º salário (13,33 folhas)
  diagnosticoPrevidenciario: string;
}

export function processFapEstablishmentRatEngine(input: FapEstablishmentInput): Result<FapEstablishmentResult, Error> {
  const {
    estabelecimentoId,
    cnpjFilial,
    estabelecimentoNome,
    folhaPagamentoMensalBrl,
    aliquotaRatBasePercent,
    fapEstabelecimento
  } = input;

  if (folhaPagamentoMensalBrl <= 0 || aliquotaRatBasePercent <= 0 || fapEstabelecimento < 0.5 || fapEstabelecimento > 2.0) {
    return Err(new Error('Folha, RAT e FAP (entre 0.5 e 2.0) devem ser válidos.'));
  }

  // Decreto nº 10.410/2020 e Art. 202-A do RPS:
  // O FAP é aplicado por estabelecimento (CNPJ de cada filial).
  // Alíquota RAT Ajustada = RAT Base * FAP (com 4 casas decimais)
  const aliquotaRatAjustada = Number((aliquotaRatBasePercent * fapEstabelecimento).toFixed(4));
  const valorRatDevido = Number((folhaPagamentoMensalBrl * (aliquotaRatAjustada / 100)).toFixed(2));

  // Custo neutro de referência (FAP = 1,0000)
  const valorRatNeutro = Number((folhaPagamentoMensalBrl * (aliquotaRatBasePercent / 100)).toFixed(2));
  const diferencialMensal = Number((valorRatDevido - valorRatNeutro).toFixed(2));

  let status: 'BONUS_ECONOMIA' | 'NEUTRO' | 'MALUS_SOBRECUSTO' = 'NEUTRO';
  if (fapEstabelecimento < 1.0) {
    status = 'BONUS_ECONOMIA';
  } else if (fapEstabelecimento > 1.0) {
    status = 'MALUS_SOBRECUSTO';
  }

  // Economia ou Sobrecusto Anual Projetado (12 meses + 13º = 13,33 folhas)
  const diferencialAnual = Number((Math.abs(diferencialMensal) * 13.33).toFixed(2));

  const diag = "FAP por Estabelecimento (Decreto 10.410/20): " + estabelecimentoNome + " (CNPJ " + cnpjFilial + "). RAT Base: " + aliquotaRatBasePercent + "% | FAP: " + fapEstabelecimento.toFixed(4) + " -> RAT AJUSTADO: " + aliquotaRatAjustada.toFixed(4) + "%. RAT Mensal: R$ " + valorRatDevido.toFixed(2) + " (" + status + ": " + (diferencialMensal < 0 ? "Economia Mensal de R$ " + Math.abs(diferencialMensal).toFixed(2) : diferencialMensal > 0 ? "Sobrecusto Mensal de R$ " + diferencialMensal.toFixed(2) : "Custo Neutro") + " -> Impacto Anual: R$ " + diferencialAnual.toFixed(2) + ").";

  return Ok({
    estabelecimentoId,
    cnpjFilial,
    estabelecimentoNome,
    aliquotaRatBasePercent,
    fapEstabelecimento,
    aliquotaRatAjustadaEfetivaPercent: aliquotaRatAjustada,
    valorRatMensalDevidoBrl: valorRatDevido,
    statusFap: status,
    diferencialFinanceiroMensalVsNeutroBrl: diferencialMensal,
    economiaAnualProjetadaBrl: diferencialAnual,
    diagnosticoPrevidenciario: diag
  });
}
