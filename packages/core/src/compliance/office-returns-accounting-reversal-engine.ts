import { Result, Ok, Err } from '../types/result.js';

export interface ReturnsAccountingInput {
  empresaCnpj: string;
  razaoSocial: string;
  valorBrutoDevolucaoBrl: number;
  valorCreditoIcmsBrl: number;
  valorCreditoPisCofinsBrl: number;
  custoEstoqueReincorporadoCmvBrl: number;
}

export interface ReturnsAccountingResult {
  empresaCnpj: string;
  razaoSocial: string;
  partidaDobradaDevolucaoReceita: string;
  partidaDobradaReincorporacaoEstoqueCmv: string;
  statusContabilizacao: 'LANCAMENTOS_DEVOLUCAO_CONCLUIDOS';
  diagnosticoContabil: string;
}

export function processOfficeReturnsAccountingReversalEngine(input: ReturnsAccountingInput): Result<ReturnsAccountingResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    valorBrutoDevolucaoBrl,
    valorCreditoIcmsBrl,
    valorCreditoPisCofinsBrl,
    custoEstoqueReincorporadoCmvBrl
  } = input;

  if (!empresaCnpj || valorBrutoDevolucaoBrl <= 0) {
    return Err(new Error('CNPJ da empresa e valor bruto da devolução são obrigatórios.'));
  }

  const valorLiquidoAReceber = valorBrutoDevolucaoBrl;

  const lancamentoReceita = "D - 3.1.01.002 Devolução de Vendas (R$ " + valorBrutoDevolucaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | D - 1.1.03.002 ICMS a Recuperar (R$ " + valorCreditoIcmsBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | D - 1.1.03.003 PIS/COFINS a Recuperar (R$ " + valorCreditoPisCofinsBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | C - 1.1.02.001 Clientes / Contas a Receber (R$ " + (valorBrutoDevolucaoBrl + valorCreditoIcmsBrl + valorCreditoPisCofinsBrl).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ")";

  const lancamentoCmv = "D - 1.1.04.001 Estoques de Mercadorias | C - 4.1.01.001 Custo das Mercadorias Vendidas (CMV) no valor de R$ " + custoEstoqueReincorporadoCmvBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Lançamento Contábil Devolução (" + razaoSocial + "): Redução de receita bruta de R$ " + valorBrutoDevolucaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " e reincorporação ao estoque/estorno de CMV de R$ " + custoEstoqueReincorporadoCmvBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    partidaDobradaDevolucaoReceita: lancamentoReceita,
    partidaDobradaReincorporacaoEstoqueCmv: lancamentoCmv,
    statusContabilizacao: 'LANCAMENTOS_DEVOLUCAO_CONCLUIDOS',
    diagnosticoContabil: diag
  });
}
