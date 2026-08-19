import { Result, Ok, Err } from '../types/result.js';

export interface DupontAnalysisInput {
  clienteCnpj: string;
  razaoSocial: string;
  receitaLiquidaAnualBrl: number;
  lucroLiquidoAnualBrl: number;
  ativoTotalBrl: number;
  patrimonioLiquidoBrl: number;
  roeMedioSetorPercent: number; // Ex: 18.0%
}

export interface DupontAnalysisResult {
  clienteCnpj: string;
  razaoSocial: string;
  margemLiquidaPercent: number; // Lucro / Receita
  giroDoAtivoVezes: number; // Receita / Ativo
  alavancagemFinanceiraVezes: number; // Ativo / PL
  roeCalculadoPercent: number; // Margem x Giro x Alavancagem
  desempenhoVsBenchmarking: 'DESEMPENHO_SUPERIOR_BENCHMARK' | 'DESEMPENHO_EM_LINHA' | 'DESEMPENHO_ABAIXO_SETOR';
  statusAnalise: 'ANALISE_DUPONT_BENCHMARKING_CONCLUIDA';
  diagnosticoDupont: string;
}

export function processOfficeSectorBenchmarkingDupontEngine(input: DupontAnalysisInput): Result<DupontAnalysisResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    receitaLiquidaAnualBrl,
    lucroLiquidoAnualBrl,
    ativoTotalBrl,
    patrimonioLiquidoBrl,
    roeMedioSetorPercent
  } = input;

  if (!clienteCnpj || receitaLiquidaAnualBrl <= 0 || ativoTotalBrl <= 0 || patrimonioLiquidoBrl <= 0) {
    return Err(new Error('CNPJ e bases patrimoniais positivas são obrigatórios para análise DuPont.'));
  }

  const margemLiquida = (lucroLiquidoAnualBrl / receitaLiquidaAnualBrl) * 100;
  const giroAtivo = receitaLiquidaAnualBrl / ativoTotalBrl;
  const alavancagem = ativoTotalBrl / patrimonioLiquidoBrl;
  const roe = (margemLiquida / 100) * giroAtivo * alavancagem * 100;

  let desempenho: 'DESEMPENHO_SUPERIOR_BENCHMARK' | 'DESEMPENHO_EM_LINHA' | 'DESEMPENHO_ABAIXO_SETOR' = 'DESEMPENHO_EM_LINHA';
  if (roe > roeMedioSetorPercent + 2) desempenho = 'DESEMPENHO_SUPERIOR_BENCHMARK';
  else if (roe < roeMedioSetorPercent - 2) desempenho = 'DESEMPENHO_ABAIXO_SETOR';

  const diag = "Análise DuPont (" + razaoSocial + "): Margem Líquida: " + margemLiquida.toFixed(1) + "% | Giro: " + giroAtivo.toFixed(2) + "x | Alavancagem: " + alavancagem.toFixed(2) + "x -> ROE: " + roe.toFixed(1) + "% vs Média Setor " + roeMedioSetorPercent.toFixed(1) + "% (" + desempenho + ").";

  return Ok({
    clienteCnpj,
    razaoSocial,
    margemLiquidaPercent: parseFloat(margemLiquida.toFixed(1)),
    giroDoAtivoVezes: parseFloat(giroAtivo.toFixed(2)),
    alavancagemFinanceiraVezes: parseFloat(alavancagem.toFixed(2)),
    roeCalculadoPercent: parseFloat(roe.toFixed(1)),
    desempenhoVsBenchmarking: desempenho,
    statusAnalise: 'ANALISE_DUPONT_BENCHMARKING_CONCLUIDA',
    diagnosticoDupont: diag
  });
}
