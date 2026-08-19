import { Result, Ok, Err } from '../types/result.js';

export interface InvestmentAccountingInput {
  clienteCnpj: string;
  razaoSocial: string;
  valorPrincipalResgateBrl: number;
  rendimentoBrutoBrl: number;
  valorIrrfRetidoBrl: number;
  valorIofBrl: number;
  valorLiquidoCreditadoBrl: number;
  ehCompensavelIrrf: boolean;
}

export interface InvestmentAccountingResult {
  clienteCnpj: string;
  razaoSocial: string;
  partidaDobradaResgateERendimento: string;
  partidaDobradaApropriacaoMensalReceita: string;
  statusContabilizacao: 'LANCAMENTOS_APLICACOES_FINANCEIRAS_CONCLUIDOS';
  diagnosticoContabil: string;
}

export function processOfficeInvestmentAccountingReconciliationEngine(input: InvestmentAccountingInput): Result<InvestmentAccountingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    valorPrincipalResgateBrl,
    rendimentoBrutoBrl,
    valorIrrfRetidoBrl,
    valorIofBrl,
    valorLiquidoCreditadoBrl,
    ehCompensavelIrrf
  } = input;

  if (!clienteCnpj || valorPrincipalResgateBrl <= 0) {
    return Err(new Error('CNPJ do cliente e valor principal de resgate são obrigatórios.'));
  }

  const contaIrrf = ehCompensavelIrrf ? '1.1.03.001 IRRF a Compensar s/ Aplicações Financeiras' : '3.2.02.001 Despesa Tributária c/ IRRF Definitivo';

  const resgate = "D - 1.1.01.002 Banco Conta Movimento (R$ " + valorLiquidoCreditadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | D - " + contaIrrf + " (R$ " + valorIrrfRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | D - 3.2.01.005 Despesas com IOF (R$ " + valorIofBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | C - 1.1.02.001 Aplicações de Liquidez Imediata (R$ " + valorPrincipalResgateBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | C - 3.1.05.001 Receitas Financeiras s/ Aplicações (R$ " + rendimentoBrutoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ")";

  const apropriacao = "D - 1.1.02.001 Aplicações de Liquidez Imediata | C - 3.1.05.001 Receitas Financeiras no valor de R$ " + rendimentoBrutoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Lançamento Contábil Aplicações (" + razaoSocial + "): Resgate de R$ " + valorPrincipalResgateBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " com crédito de rendimento de R$ " + rendimentoBrutoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " e apropriação de IRRF de R$ " + valorIrrfRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    partidaDobradaResgateERendimento: resgate,
    partidaDobradaApropriacaoMensalReceita: apropriacao,
    statusContabilizacao: 'LANCAMENTOS_APLICACOES_FINANCEIRAS_CONCLUIDOS',
    diagnosticoContabil: diag
  });
}
