import { Result, Ok, Err } from '../types/result.js';

export interface NegativeBalanceSelicInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  valorOriginalSaldoNegativoBrl: number;
  taxaSelicAcumuladaPercent: number; // Ex: 12.5%
}

export interface NegativeBalanceSelicResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  valorOriginalSaldoNegativoBrl: number;
  valorAtualizacaoSelicBrl: number;
  valorTotalAtualizadoCreditoBrl: number;
  partidaDobradaAtualizacaoSelic: string;
  statusSaldoNegativo: 'SALDO_NEGATIVO_ATUALIZADO_E_APTO_PERDCOMP';
  diagnosticoSaldoNegativo: string;
}

export function processOfficeIrpjCsllNegativeBalanceSelicEngine(input: NegativeBalanceSelicInput): Result<NegativeBalanceSelicResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    valorOriginalSaldoNegativoBrl,
    taxaSelicAcumuladaPercent
  } = input;

  if (!clienteCnpj || valorOriginalSaldoNegativoBrl <= 0 || anoExercicio < 2000) {
    return Err(new Error('CNPJ, valor do saldo negativo e ano do exercício são obrigatórios.'));
  }

  const selicBrl = (valorOriginalSaldoNegativoBrl * taxaSelicAcumuladaPercent) / 100;
  const totalAtualizado = valorOriginalSaldoNegativoBrl + selicBrl;

  const lancamento = "D - 1.1.03.001 IRPJ/CSLL a Recuperar (Ativo Circulante) | C - 3.2.01.002 Receita Financeira com Atualização Selic de Créditos Tributários (DRE) no valor de R$ " + selicBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Saldo Negativo IRPJ/CSLL (" + razaoSocial + " - " + anoExercicio + "): Valor Original R$ " + valorOriginalSaldoNegativoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " + Selic (" + taxaSelicAcumuladaPercent + "%) R$ " + selicBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " = Saldo Total Atualizado R$ " + totalAtualizado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " habilitado para compensação via PER/DCOMP Web.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    valorOriginalSaldoNegativoBrl: parseFloat(valorOriginalSaldoNegativoBrl.toFixed(2)),
    valorAtualizacaoSelicBrl: parseFloat(selicBrl.toFixed(2)),
    valorTotalAtualizadoCreditoBrl: parseFloat(totalAtualizado.toFixed(2)),
    partidaDobradaAtualizacaoSelic: lancamento,
    statusSaldoNegativo: 'SALDO_NEGATIVO_ATUALIZADO_E_APTO_PERDCOMP',
    diagnosticoSaldoNegativo: diag
  });
}
