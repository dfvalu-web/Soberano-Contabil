import { Result, Ok, Err } from '../types/result.js';

export interface ServiceTaxAccountingInput {
  clienteTomadorCnpj: string;
  prestadorRazaoSocial: string;
  valorBrutoBrl: number;
  valorIssRetidoBrl: number;
  valorLiquidoBrl: number;
  contaDespesaServico: string; // Ex: '3.1.02.005 Serviços de Terceiros PJ'
}

export interface ServiceTaxAccountingResult {
  clienteTomadorCnpj: string;
  prestadorRazaoSocial: string;
  partidaDobradaDespesaEPassivo: string;
  partidaDobradaRecolhimentoGuiaIss: string;
  statusContabilizacao: 'LANCAMENTOS_ISS_TOMADOR_CONCLUIDOS';
  diagnosticoContabil: string;
}

export function processOfficeCpomServiceTaxAccountingEngine(input: ServiceTaxAccountingInput): Result<ServiceTaxAccountingResult, Error> {
  const {
    clienteTomadorCnpj,
    prestadorRazaoSocial,
    valorBrutoBrl,
    valorIssRetidoBrl,
    valorLiquidoBrl,
    contaDespesaServico
  } = input;

  if (!clienteTomadorCnpj || valorBrutoBrl <= 0) {
    return Err(new Error('CNPJ do tomador e valor bruto do serviço são obrigatórios.'));
  }

  const provisao = "D - " + contaDespesaServico + " (R$ " + valorBrutoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | C - 2.1.02.003 ISS a Recolher - Retenções na Fonte (R$ " + valorIssRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | C - 2.1.01.001 Fornecedores / Contas a Pagar (R$ " + valorLiquidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ")";
  const recolhimento = "D - 2.1.02.003 ISS a Recolher | C - 1.1.01.002 Banco Conta Movimento no valor de R$ " + valorIssRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Lançamento Contábil ISS Tomador (" + prestadorRazaoSocial + "): Provisão gerada com retenção de R$ " + valorIssRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " e líquido de R$ " + valorLiquidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteTomadorCnpj,
    prestadorRazaoSocial,
    partidaDobradaDespesaEPassivo: provisao,
    partidaDobradaRecolhimentoGuiaIss: recolhimento,
    statusContabilizacao: 'LANCAMENTOS_ISS_TOMADOR_CONCLUIDOS',
    diagnosticoContabil: diag
  });
}
