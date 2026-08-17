import { Result, Ok } from '../../types/result.js';

export interface LeiDoBemInput {
  anoBase: number;
  totalGastosOperacionaisPesquisaDesenvolvimento: number;
  houveIncrementoPesquisadoresSuperior5Percent: boolean;
  patentesConcedidasNoAno: boolean;
}

export interface LeiDoBemResult {
  anoBase: number;
  totalGastosPdDeclarados: number;
  percentualExclusaoLalur: number; // 60% a 80%
  valorExclusaoLalurParteA: number;
  economiaTributariaIrpjCsll34Percent: number;
  reducaoIpiMaquinasPd50PercentEstimada: number;
  diagnosticoBeneficio: string;
}

export function calculateLeiDoBem(input: LeiDoBemInput): Result<LeiDoBemResult, Error> {
  const { anoBase, totalGastosOperacionaisPesquisaDesenvolvimento, houveIncrementoPesquisadoresSuperior5Percent, patentesConcedidasNoAno } = input;

  let percentual = 0.60; // Regra geral 60%
  if (houveIncrementoPesquisadoresSuperior5Percent) percentual += 0.10; // +10%
  if (patentesConcedidasNoAno) percentual += 0.10; // +10% (máx 80%)

  const valorExclusao = Number((totalGastosOperacionaisPesquisaDesenvolvimento * percentual).toFixed(2));
  const economiaIrpjCsll = Number((valorExclusao * 0.34).toFixed(2));
  const reducaoIpi = Number((totalGastosOperacionaisPesquisaDesenvolvimento * 0.10 * 0.50).toFixed(2)); // Estimativa IPI 10% com redução de 50%

  return Ok({
    anoBase,
    totalGastosPdDeclarados: totalGastosOperacionaisPesquisaDesenvolvimento,
    percentualExclusaoLalur: Number((percentual * 100).toFixed(0)),
    valorExclusaoLalurParteA: valorExclusao,
    economiaTributariaIrpjCsll34Percent: economiaIrpjCsll,
    reducaoIpiMaquinasPd50PercentEstimada: reducaoIpi,
    diagnosticoBeneficio: `A aplicação dos incentivos da Lei do Bem (Lei nº 11.196/05) permite a exclusão de R$ ${valorExclusao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} na Parte A do LALUR/LACS, gerando economia fiscal líquida de R$ ${economiaIrpjCsll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em IRPJ/CSLL.`
  });
}

export interface SudeneIncentiveInput {
  lucroDaExploracaoApurado: number;
  taxaReducaoBeneficioPercent?: number; // Padrão 75%
}

export interface SudeneIncentiveResult {
  lucroDaExploracao: number;
  irpjPadrao15SemIncentivo: number;
  irpjComReducao75Percent: number;
  economiaTributariaDireta: number;
  obrigacaoDestinacaoReservaIncentivosFiscaisPL: number;
}

export function calculateSudeneIncentive(input: SudeneIncentiveInput): Result<SudeneIncentiveResult, Error> {
  const { lucroDaExploracaoApurado, taxaReducaoBeneficioPercent = 75 } = input;

  const irpj15Padrao = Number((lucroDaExploracaoApurado * 0.15).toFixed(2));
  const reducaoBeneficio = Number((irpj15Padrao * (taxaReducaoBeneficioPercent / 100)).toFixed(2));
  const irpjComReducao = Number((irpj15Padrao - reducaoBeneficio).toFixed(2));

  return Ok({
    lucroDaExploracao: lucroDaExploracaoApurado,
    irpjPadrao15SemIncentivo: irpj15Padrao,
    irpjComReducao75Percent: irpjComReducao,
    economiaTributariaDireta: reducaoBeneficio,
    obrigacaoDestinacaoReservaIncentivosFiscaisPL: reducaoBeneficio // Deve ser retido em Reserva de Incentivos Fiscais no PL (Art. 195-A Lei 6.404/76)
  });
}
