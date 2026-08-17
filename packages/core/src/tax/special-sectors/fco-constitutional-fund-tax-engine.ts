import { Result, Ok, Err } from '../../types/result.js';

export interface FcoFinancingTaxInput {
  contratoFinanciamentoId: string;
  empresaCnpj: string;
  estadoUf: 'MT' | 'MS' | 'GO' | 'DF';
  valorFinanciadoBrl: number; // Ex: R$ 8.000.000,00
  taxaJurosMercadoPercent: number; // Ex: 14.5% a.a.
  taxaJurosFcoSubvencionadaPercent: number; // Ex: 8.5% a.a.
  bonusAdimplenciaPercent: number; // Ex: 15% de desconto sobre os juros FCO
}

export interface FcoFinancingTaxResult {
  contratoFinanciamentoId: string;
  empresaCnpj: string;
  estadoUf: string;
  valorFinanciadoBrl: number;
  jurosNominaisMercadoBrl: number;
  jurosEfetivosFcoComBonusBrl: number;
  valorSubvencaoInvestimentoFcoBrl: number;
  economiaTributariaIrpjCsllBrl: number; // 34% de IRPJ/CSLL não tributável
  destinacaoReservaIncentivosFiscaisPlBrl: number;
  statusIsencaoLalur: 'EXCLUSAO_LALUR_ART30_LEI12973_DEFERIDA';
  diagnosticoFco: string;
}

export function processFcoConstitutionalFundTaxEngine(input: FcoFinancingTaxInput): Result<FcoFinancingTaxResult, Error> {
  const {
    contratoFinanciamentoId,
    empresaCnpj,
    estadoUf,
    valorFinanciadoBrl,
    taxaJurosMercadoPercent,
    taxaJurosFcoSubvencionadaPercent,
    bonusAdimplenciaPercent
  } = input;

  if (valorFinanciadoBrl <= 0 || taxaJurosMercadoPercent <= 0 || taxaJurosFcoSubvencionadaPercent <= 0) {
    return Err(new Error('Valor financiado e taxas de juros devem ser positivos.'));
  }

  // 1. Juros de Mercado vs Juros FCO com Bônus de Adimplência
  const jurosMercado = valorFinanciadoBrl * (taxaJurosMercadoPercent / 100);
  const jurosFcoBrutos = valorFinanciadoBrl * (taxaJurosFcoSubvencionadaPercent / 100);
  const jurosFcoEfetivos = Number((jurosFcoBrutos * (1 - bonusAdimplenciaPercent / 100)).toFixed(2));

  // 2. Valor da Subvenção de Encargos para Investimento (Ganho Econômico do FCO)
  const valorSubvencao = Number((jurosMercado - jurosFcoEfetivos).toFixed(2));

  // 3. Economia Tributária (Não Incidência de IRPJ/CSLL via Reserva de Incentivos Fiscais - Art. 30 da Lei 12.973/14)
  const economiaFiscal = Number((valorSubvencao * 0.34).toFixed(2));

  const diag = "Subvencao FCO Centro-Oeste (" + estadoUf + "): Contrato " + contratoFinanciamentoId + " (CNPJ " + empresaCnpj + ") | Financiamento: R$ " + valorFinanciadoBrl.toFixed(2) + " -> Juros Mercado: R$ " + jurosMercado.toFixed(2) + " vs FCO Efetivo: R$ " + jurosFcoEfetivos.toFixed(2) + " | Subvencao/Ganho Economico: R$ " + valorSubvencao.toFixed(2) + " destinada a Reserva de Incentivos no PL com economia fiscal de R$ " + economiaFiscal.toFixed(2) + ".";

  return Ok({
    contratoFinanciamentoId,
    empresaCnpj,
    estadoUf,
    valorFinanciadoBrl,
    jurosNominaisMercadoBrl: Number(jurosMercado.toFixed(2)),
    jurosEfetivosFcoComBonusBrl: jurosFcoEfetivos,
    valorSubvencaoInvestimentoFcoBrl: valorSubvencao,
    economiaTributariaIrpjCsllBrl: economiaFiscal,
    destinacaoReservaIncentivosFiscaisPlBrl: valorSubvencao,
    statusIsencaoLalur: 'EXCLUSAO_LALUR_ART30_LEI12973_DEFERIDA',
    diagnosticoFco: diag
  });
}
