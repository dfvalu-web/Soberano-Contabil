import { Result, Ok, Err } from '../types/result.js';

export interface ServiceInvoiceRetentionInput {
  clienteCnpj: string;
  razaoSocial: string;
  tipoServico: 'SERVICOS_PROFISSIONAIS' | 'LIMPEZA_CONSERVACAO' | 'VIGILANCIA_SEGURANCA' | 'CONSULTORIA_TI';
  valorBrutoNotaBrl: number;
  municipioTomadorPrestadorIguais: boolean;
  aliquotaIssLocalPercent: number; // Ex: 2% a 5%
}

export interface CalculatedRetentionsResult {
  clienteCnpj: string;
  razaoSocial: string;
  valorBrutoNotaBrl: number;
  aliquotaIrrfPercent: number;
  valorIrrfBrl: number;
  aliquotaCsrfPercent: number;
  valorCsrfBrl: number;
  aliquotaInssPercent: number;
  valorInssBrl: number;
  valorIssRetidoBrl: number;
  valorLiquidoPagarBrl: number;
  statusCalculo: 'RETENCOES_APURADAS_COM_SUCESSO';
  diagnosticoRetencoes: string;
}

export function processOfficeCsrfIrrfRetentionCrossauditEngine(input: ServiceInvoiceRetentionInput): Result<CalculatedRetentionsResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    tipoServico,
    valorBrutoNotaBrl,
    municipioTomadorPrestadorIguais,
    aliquotaIssLocalPercent
  } = input;

  if (!clienteCnpj || valorBrutoNotaBrl <= 0) {
    return Err(new Error('CNPJ e valor bruto da nota positivo são obrigatórios.'));
  }

  // IRRF: 1.5% para serviços profissionais/TI, 1.0% para limpeza/vigilância
  const aliqIrrf = (tipoServico === 'SERVICOS_PROFISSIONAIS' || tipoServico === 'CONSULTORIA_TI') ? 1.5 : 1.0;
  const valorIrrf = (valorBrutoNotaBrl * aliqIrrf) / 100;

  // CSRF: 4.65% (PIS 0.65% + COFINS 3% + CSLL 1%)
  const aliqCsrf = 4.65;
  const valorCsrf = (valorBrutoNotaBrl * aliqCsrf) / 100;

  // INSS: 11% para cessão de mão de obra (limpeza/vigilância)
  const aliqInss = (tipoServico === 'LIMPEZA_CONSERVACAO' || tipoServico === 'VIGILANCIA_SEGURANCA') ? 11.0 : 0.0;
  const valorInss = (valorBrutoNotaBrl * aliqInss) / 100;

  // ISS Retido: se estabelecido em município diferente ou por substituição tributária
  const valorIss = !municipioTomadorPrestadorIguais ? (valorBrutoNotaBrl * aliquotaIssLocalPercent) / 100 : 0;

  const totalRetencoes = valorIrrf + valorCsrf + valorInss + valorIss;
  const valorLiquido = valorBrutoNotaBrl - totalRetencoes;

  const diag = "Cálculo de Retenções (" + razaoSocial + " - " + tipoServico + "): Bruto: R$ " + valorBrutoNotaBrl.toLocaleString('pt-BR') + " | IRRF: R$ " + valorIrrf.toLocaleString('pt-BR') + " | CSRF: R$ " + valorCsrf.toLocaleString('pt-BR') + " | INSS: R$ " + valorInss.toLocaleString('pt-BR') + " | ISS: R$ " + valorIss.toLocaleString('pt-BR') + " -> Líquido a Pagar ao Prestador: R$ " + valorLiquido.toLocaleString('pt-BR') + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    valorBrutoNotaBrl: parseFloat(valorBrutoNotaBrl.toFixed(2)),
    aliquotaIrrfPercent: aliqIrrf,
    valorIrrfBrl: parseFloat(valorIrrf.toFixed(2)),
    aliquotaCsrfPercent: aliqCsrf,
    valorCsrfBrl: parseFloat(valorCsrf.toFixed(2)),
    aliquotaInssPercent: aliqInss,
    valorInssBrl: parseFloat(valorInss.toFixed(2)),
    valorIssRetidoBrl: parseFloat(valorIss.toFixed(2)),
    valorLiquidoPagarBrl: parseFloat(valorLiquido.toFixed(2)),
    statusCalculo: 'RETENCOES_APURADAS_COM_SUCESSO',
    diagnosticoRetencoes: diag
  });
}
