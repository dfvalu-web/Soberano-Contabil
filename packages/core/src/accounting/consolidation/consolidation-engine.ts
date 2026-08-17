import { BalanceSheet, IncomeStatement } from '../../types/accounting.js';
import { Result, Ok } from '../../types/result.js';

export interface IntercompanyEliminationEntry {
  descricao: string;
  contaDebito: string;
  contaCredito: string;
  valor: number;
}

export interface ConsolidatedFinancialStatements {
  periodo: string;
  totalAtivoConsolidado: number;
  totalPassivoConsolidado: number;
  totalPatrimonioLiquidoConsolidado: number;
  totalEliminacoesAtivoPassivo: number;
  receitaLiquidaConsolidada: number;
  lucroLiquidoConsolidado: number;
  totalEliminacoesResultado: number;
  isEquilibrado: boolean;
}

export function consolidateFinancialStatements(
  matriz: { balanceSheet: BalanceSheet; incomeStatement: IncomeStatement },
  filiais: Array<{ balanceSheet: BalanceSheet; incomeStatement: IncomeStatement }>,
  eliminacoesIntercompany: IntercompanyEliminationEntry[]
): Result<ConsolidatedFinancialStatements, Error> {
  const totalEliminacoesPatrimoniais = eliminacoesIntercompany.reduce((s, e) => s + e.valor, 0);

  const somaAtivoIndividual = matriz.balanceSheet.totalAtivo + filiais.reduce((s, f) => s + f.balanceSheet.totalAtivo, 0);
  const somaPassivoIndividual = matriz.balanceSheet.totalPassivo + filiais.reduce((s, f) => s + f.balanceSheet.totalPassivo, 0);
  const somaPlIndividual = matriz.balanceSheet.totalPatrimonioLiquido + filiais.reduce((s, f) => s + f.balanceSheet.totalPatrimonioLiquido, 0);

  const totalAtivoConsolidado = Number((somaAtivoIndividual - totalEliminacoesPatrimoniais).toFixed(2));
  const totalPassivoConsolidado = Number((somaPassivoIndividual - totalEliminacoesPatrimoniais).toFixed(2));
  const totalPatrimonioLiquidoConsolidado = somaPlIndividual;

  const somaReceitas = matriz.incomeStatement.linhas.find(l => l.codigo === '3')?.valorPeriodoAtual || 0;
  const filiaisReceitas = filiais.reduce((s, f) => s + (f.incomeStatement.linhas.find(l => l.codigo === '3')?.valorPeriodoAtual || 0), 0);
  const receitaLiquidaConsolidada = Number((somaReceitas + filiaisReceitas).toFixed(2));

  const somaLucros = matriz.incomeStatement.linhas.find(l => l.codigo === '8')?.valorPeriodoAtual || 0;
  const filiaisLucros = filiais.reduce((s, f) => s + (f.incomeStatement.linhas.find(l => l.codigo === '8')?.valorPeriodoAtual || 0), 0);
  const lucroLiquidoConsolidado = Number((somaLucros + filiaisLucros).toFixed(2));

  return Ok({
    periodo: matriz.balanceSheet.periodo,
    totalAtivoConsolidado,
    totalPassivoConsolidado,
    totalPatrimonioLiquidoConsolidado,
    totalEliminacoesAtivoPassivo: totalEliminacoesPatrimoniais,
    receitaLiquidaConsolidada,
    lucroLiquidoConsolidado,
    totalEliminacoesResultado: 0,
    isEquilibrado: Math.abs(totalAtivoConsolidado - (totalPassivoConsolidado + totalPatrimonioLiquidoConsolidado)) < 0.05
  });
}
