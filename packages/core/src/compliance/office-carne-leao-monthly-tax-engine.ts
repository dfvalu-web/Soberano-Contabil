import { Result, Ok, Err } from '../types/result.js';

export interface CarneLeaoInput {
  contribuinteCpf: string;
  nomeContribuinte: string;
  mesAnoCompetencia: string; // Ex: '2026-08'
  totalRendimentosRecebidosBrl: number;
  totalDespesasLivroCaixaDedutiveisBrl: number;
  dependentesCount: number;
  pensaoAlimenticiaPagaBrl?: number;
}

export interface CarneLeaoResult {
  contribuinteCpf: string;
  nomeContribuinte: string;
  mesAnoCompetencia: string;
  totalRendimentosBrl: number;
  totalDespesasDedutiveisBrl: number;
  deducaoDependentesBrl: number;
  baseCalculoImpostoBrl: number;
  aliquotaEfetivaPercent: number;
  valorDarf0190DevidoBrl: number;
  statusApuracao: 'CARNE_LEAO_APURADO_DARF_EMITIDO';
  diagnosticoCarneLeao: string;
}

export function processOfficeCarneLeaoMonthlyTaxEngine(input: CarneLeaoInput): Result<CarneLeaoResult, Error> {
  const {
    contribuinteCpf,
    nomeContribuinte,
    mesAnoCompetencia,
    totalRendimentosRecebidosBrl,
    totalDespesasLivroCaixaDedutiveisBrl,
    dependentesCount,
    pensaoAlimenticiaPagaBrl = 0
  } = input;

  if (!contribuinteCpf || totalRendimentosRecebidosBrl <= 0) {
    return Err(new Error('CPF e total de rendimentos recebidos são obrigatórios.'));
  }

  const deducaoDep = dependentesCount * 189.59;
  const totalDeducoes = totalDespesasLivroCaixaDedutiveisBrl + deducaoDep + pensaoAlimenticiaPagaBrl;
  const baseCalculo = Math.max(0, totalRendimentosRecebidosBrl - totalDeducoes);

  // Tabela progressiva mensal
  let imposto = 0;
  if (baseCalculo <= 2259.20) {
    imposto = 0;
  } else if (baseCalculo <= 2826.65) {
    imposto = (baseCalculo * 0.075) - 169.44;
  } else if (baseCalculo <= 3751.05) {
    imposto = (baseCalculo * 0.15) - 381.44;
  } else if (baseCalculo <= 4664.68) {
    imposto = (baseCalculo * 0.225) - 662.77;
  } else {
    imposto = (baseCalculo * 0.275) - 896.00;
  }

  imposto = Math.max(0, imposto);
  const aliqEfetiva = totalRendimentosRecebidosBrl > 0 ? (imposto / totalRendimentosRecebidosBrl) * 100 : 0;

  const diag = "Carnê-Leão (" + nomeContribuinte + " - " + mesAnoCompetencia + "): Rendimentos: R$ " + totalRendimentosRecebidosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Despesas Livro Caixa: R$ " + totalDespesasLivroCaixaDedutiveisBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Base Tributável: R$ " + baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | DARF 0190: R$ " + imposto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + aliqEfetiva.toFixed(2) + "% efetiva).";

  return Ok({
    contribuinteCpf,
    nomeContribuinte,
    mesAnoCompetencia,
    totalRendimentosBrl: parseFloat(totalRendimentosRecebidosBrl.toFixed(2)),
    totalDespesasDedutiveisBrl: parseFloat(totalDespesasLivroCaixaDedutiveisBrl.toFixed(2)),
    deducaoDependentesBrl: parseFloat(deducaoDep.toFixed(2)),
    baseCalculoImpostoBrl: parseFloat(baseCalculo.toFixed(2)),
    aliquotaEfetivaPercent: parseFloat(aliqEfetiva.toFixed(2)),
    valorDarf0190DevidoBrl: parseFloat(imposto.toFixed(2)),
    statusApuracao: 'CARNE_LEAO_APURADO_DARF_EMITIDO',
    diagnosticoCarneLeao: diag
  });
}
