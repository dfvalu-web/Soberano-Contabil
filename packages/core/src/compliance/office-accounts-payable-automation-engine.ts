import { Result, Ok, Err } from '../types/result.js';

export interface AccountsPayableInput {
  clienteCnpj: string;
  razaoSocial: string;
  fornecedorNome: string;
  fornecedorCnpj: string;
  valorTotalTituloBrl: number;
  dataEmissao: string;
  dataVencimento: string;
  dataLiquidacaoDda?: string;
  contaContabilDespesaOuEstoque: string; // Ex: '1.1.04.001' ou '3.1.01.001'
}

export interface AccountsPayableResult {
  clienteCnpj: string;
  razaoSocial: string;
  fornecedorNome: string;
  valorTotalTituloBrl: number;
  partidaDobradaProvisao: string;
  partidaDobradaLiquidacaoDda: string;
  statusTitulo: 'TITULO_PROVISIONADO_E_LIQUIDADO_DDA';
  diagnosticoContasPagar: string;
}

export function processOfficeAccountsPayableAutomationEngine(input: AccountsPayableInput): Result<AccountsPayableResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    fornecedorNome,
    fornecedorCnpj,
    valorTotalTituloBrl,
    dataEmissao,
    dataVencimento,
    dataLiquidacaoDda,
    contaContabilDespesaOuEstoque
  } = input;

  if (!clienteCnpj || valorTotalTituloBrl <= 0 || !fornecedorCnpj) {
    return Err(new Error('CNPJ do cliente, CNPJ do fornecedor e valor do título são obrigatórios.'));
  }

  const provisao = "D - " + contaContabilDespesaOuEstoque + " | C - 2.1.01.001 Fornecedores Nacionais (Passivo Circulante) no valor de R$ " + valorTotalTituloBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const liquidacao = "D - 2.1.01.001 Fornecedores Nacionais | C - 1.1.01.002 Banco Conta Movimento (Ativo) no valor de R$ " + valorTotalTituloBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Contas a Pagar (" + razaoSocial + " - " + fornecedorNome + "): Título de R$ " + valorTotalTituloBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " provisionado e liquidado via DDA bancário em " + (dataLiquidacaoDda || dataVencimento) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    fornecedorNome,
    valorTotalTituloBrl: parseFloat(valorTotalTituloBrl.toFixed(2)),
    partidaDobradaProvisao: provisao,
    partidaDobradaLiquidacaoDda: liquidacao,
    statusTitulo: 'TITULO_PROVISIONADO_E_LIQUIDADO_DDA',
    diagnosticoContasPagar: diag
  });
}
