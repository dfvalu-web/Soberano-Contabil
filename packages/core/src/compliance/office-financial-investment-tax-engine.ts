import { Result, Ok, Err } from '../types/result.js';

export interface FinancialInvestmentTaxInput {
  clienteCnpj: string;
  razaoSocial: string;
  instituicaoFinanceiraNome: string;
  tipoAplicacao: 'CDB_POS_FIXADO' | 'FUNDO_DI' | 'LCI_LCA' | 'TESOURO_SELIC';
  valorPrincipalResgatadoBrl: number;
  valorRendimentoBrutoBrl: number;
  prazoAplicacaoDias: number;
  regimeTributario: 'LUCRO_REAL' | 'LUCRO_PRESUMIDO' | 'SIMPLES_NACIONAL';
}

export interface FinancialInvestmentTaxResult {
  clienteCnpj: string;
  razaoSocial: string;
  rendimentoBrutoBrl: number;
  valorIofRetidoBrl: number;
  rendimentoTributavelLiquidoIofBrl: number;
  aliquotaIrrfPercent: number;
  valorIrrfRetidoBrl: number;
  irrfCompensavelNaApuracaoIprj: boolean;
  valorLiquidoCreditadoEmContaBrl: number;
  statusApuracao: 'APLICACAO_FINANCEIRA_AUDITADA_COM_SUCESSO';
  diagnosticoInvestimento: string;
}

export function processOfficeFinancialInvestmentTaxEngine(input: FinancialInvestmentTaxInput): Result<FinancialInvestmentTaxResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    instituicaoFinanceiraNome,
    tipoAplicacao,
    valorPrincipalResgatadoBrl,
    valorRendimentoBrutoBrl,
    prazoAplicacaoDias,
    regimeTributario
  } = input;

  if (!clienteCnpj || valorPrincipalResgatadoBrl <= 0 || valorRendimentoBrutoBrl < 0) {
    return Err(new Error('CNPJ, valor principal e rendimento são obrigatórios.'));
  }

  // Tabela IOF Regressivo (Dec. 6.306/07) - se < 30 dias
  let iofPerc = 0;
  if (prazoAplicacaoDias < 30) {
    iofPerc = Math.max(0, (30 - prazoAplicacaoDias) * 3.33) / 100;
  }
  const valorIof = valorRendimentoBrutoBrl * iofPerc;
  const rendimentoTributavel = Math.max(0, valorRendimentoBrutoBrl - valorIof);

  // Alíquota IRRF Regressiva (Lei 11.033/04 e Art. 730 RIR/18)
  let aliquotaIrrf = 15.0;
  if (tipoAplicacao === 'LCI_LCA' && regimeTributario === 'SIMPLES_NACIONAL') {
    aliquotaIrrf = 0.0;
  } else if (prazoAplicacaoDias <= 180) {
    aliquotaIrrf = 22.5;
  } else if (prazoAplicacaoDias <= 360) {
    aliquotaIrrf = 20.0;
  } else if (prazoAplicacaoDias <= 720) {
    aliquotaIrrf = 17.5;
  } else {
    aliquotaIrrf = 15.0;
  }

  const valorIrrf = (rendimentoTributavel * aliquotaIrrf) / 100;
  const ehCompensavel = regimeTributario !== 'SIMPLES_NACIONAL';

  const valorLiquido = valorPrincipalResgatadoBrl + valorRendimentoBrutoBrl - valorIof - valorIrrf;

  const diag = "Investimento Financeiro (" + razaoSocial + " - " + instituicaoFinanceiraNome + " / " + tipoAplicacao + "): Rendimento Bruto: R$ " + valorRendimentoBrutoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | IOF: R$ " + valorIof.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | IRRF (" + aliquotaIrrf + "%): R$ " + valorIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + (ehCompensavel ? "COMPENSÁVEL NO IRPJ" : "TRIBUTAÇÃO DEFINITIVA") + ") | Valor Líquido Creditado: R$ " + valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    rendimentoBrutoBrl: parseFloat(valorRendimentoBrutoBrl.toFixed(2)),
    valorIofRetidoBrl: parseFloat(valorIof.toFixed(2)),
    rendimentoTributavelLiquidoIofBrl: parseFloat(rendimentoTributavel.toFixed(2)),
    aliquotaIrrfPercent: aliquotaIrrf,
    valorIrrfRetidoBrl: parseFloat(valorIrrf.toFixed(2)),
    irrfCompensavelNaApuracaoIprj: ehCompensavel,
    valorLiquidoCreditadoEmContaBrl: parseFloat(valorLiquido.toFixed(2)),
    statusApuracao: 'APLICACAO_FINANCEIRA_AUDITADA_COM_SUCESSO',
    diagnosticoInvestimento: diag
  });
}
