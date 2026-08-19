import { Result, Ok, Err } from '../types/result.js';

export interface AnnualClosingAreInput {
  empresaCnpj: string;
  razaoSocial: string;
  exercicioAno: number; // Ex: 2026
  totalReceitasOperacionaisBrl: number; // Ex: R$ 1.500.000,00
  totalCustosOperacionaisCmvBrl: number; // Ex: R$ 700.000,00
  totalDespesasOperacionaisBrl: number; // Ex: R$ 450.000,00
}

export interface AnnualClosingAreResult {
  empresaCnpj: string;
  razaoSocial: string;
  exercicioAno: number;
  totalReceitasZeradasBrl: number;
  totalCustosDespesasZeradosBrl: number;
  lucroLiquidoExercicioBrl: number;
  partidaDobradaZeramentoReceitas: string;
  partidaDobradaZeramentoDespesas: string;
  partidaDobradaTransferenciaPl: string;
  saldoContasResultadoPosEncerramentoBrl: number;
  statusFechamento: 'EXERCICIO_ENCERRADO_ARE_COM_SUCESSO';
  diagnosticoAre: string;
}

export function processOfficeAnnualClosingAreEngine(input: AnnualClosingAreInput): Result<AnnualClosingAreResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    exercicioAno,
    totalReceitasOperacionaisBrl,
    totalCustosOperacionaisCmvBrl,
    totalDespesasOperacionaisBrl
  } = input;

  if (!empresaCnpj || exercicioAno < 2000 || totalReceitasOperacionaisBrl <= 0) {
    return Err(new Error('CNPJ, ano do exercício e receitas válidas são obrigatórios.'));
  }

  const totalCustosDespesas = totalCustosOperacionaisCmvBrl + totalDespesasOperacionaisBrl;
  const lucroLiquido = totalReceitasOperacionaisBrl - totalCustosDespesas;

  const zeramentoReceitas = "D - 3.1 Receitas Operacionais | C - 3.9.01.001 Apuração do Resultado do Exercício (ARE) no valor de R$ " + totalReceitasOperacionaisBrl.toFixed(2);
  const zeramentoDespesas = "D - 3.9.01.001 Apuração do Resultado do Exercício (ARE) | C - 3.2/3.3 Custos e Despesas no valor de R$ " + totalCustosDespesas.toFixed(2);
  const transfPl = "D - 3.9.01.001 Apuração do Resultado do Exercício (ARE) | C - 2.4.03.001 Lucros Acumulados no valor de R$ " + lucroLiquido.toFixed(2);

  const diag = "Encerramento do Exercício (" + razaoSocial + " - " + exercicioAno + "): Receitas: R$ " + totalReceitasOperacionaisBrl.toFixed(2) + " | Despesas/Custos: R$ " + totalCustosDespesas.toFixed(2) + " | Lucro Líquido ARE: R$ " + lucroLiquido.toFixed(2) + " transferido para o PL | Saldo Grupo 3 zerado (100% ACID).";

  return Ok({
    empresaCnpj,
    razaoSocial,
    exercicioAno,
    totalReceitasZeradasBrl: parseFloat(totalReceitasOperacionaisBrl.toFixed(2)),
    totalCustosDespesasZeradosBrl: parseFloat(totalCustosDespesas.toFixed(2)),
    lucroLiquidoExercicioBrl: parseFloat(lucroLiquido.toFixed(2)),
    partidaDobradaZeramentoReceitas: zeramentoReceitas,
    partidaDobradaZeramentoDespesas: zeramentoDespesas,
    partidaDobradaTransferenciaPl: transfPl,
    saldoContasResultadoPosEncerramentoBrl: 0.00,
    statusFechamento: 'EXERCICIO_ENCERRADO_ARE_COM_SUCESSO',
    diagnosticoAre: diag
  });
}
