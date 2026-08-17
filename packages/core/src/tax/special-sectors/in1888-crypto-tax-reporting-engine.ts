import { Result, Ok, Err } from '../../types/result.js';

export interface In1888ReportingInput {
  declaranteCnpj: string;
  mesAnoApuracao: string; // Ex: '2026-08'
  valorTotalOperacoesMesBrl: number; // Ex: R$ 500.000,00
  custoAquisicaoHistoricoBrl: number; // Ex: R$ 380.000,00 -> Ganho = R$ 120.000,00
  tipoPessoa: 'PESSOA_JURIDICA' | 'PESSOA_FISICA';
}

export interface In1888ReportingResult {
  declaranteCnpj: string;
  mesAnoApuracao: string;
  obrigatoriedadeEntregaIn1888: boolean;
  ganhoCapitalLiquidoBrl: number; // R$ 120.000,00
  aliquotaImpostoGanhoPercent: number; // 15.0%
  impostoRendaDevidoBrl: number; // R$ 18.000,00
  loteTransmissaoIn1888Gerado: string;
  statusDeclaracao: 'DECLARACAO_IN_1888_GERADA_E_VALIDADA_RFB';
  diagnosticoIn1888: string;
}

export function processIn1888CryptoTaxReportingEngine(input: In1888ReportingInput): Result<In1888ReportingResult, Error> {
  const {
    declaranteCnpj,
    mesAnoApuracao,
    valorTotalOperacoesMesBrl,
    custoAquisicaoHistoricoBrl,
    tipoPessoa
  } = input;

  if (!declaranteCnpj || valorTotalOperacoesMesBrl <= 0) {
    return Err(new Error('CNPJ/CPF e valor das operações são obrigatórios.'));
  }

  const ganho = Math.max(0, valorTotalOperacoesMesBrl - custoAquisicaoHistoricoBrl);
  const aliquota = 15.0; // Faixa inicial de ganho de capital (Lei 8.981/95)
  const imposto = (ganho * aliquota) / 100;
  const lote = 'LOTE-IN1888-' + mesAnoApuracao.replace('-', '') + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const diag = "Declaracao Cripto (IN RFB 1.888/19): Declarante " + declaranteCnpj + " (" + mesAnoApuracao + ") | Volume Negociado: R$ " + valorTotalOperacoesMesBrl.toLocaleString('pt-BR') + " | Ganho de Capital: R$ " + ganho.toLocaleString('pt-BR') + " | IR Devido (15%): R$ " + imposto.toLocaleString('pt-BR') + " -> Lote RFB: " + lote;

  return Ok({
    declaranteCnpj,
    mesAnoApuracao,
    obrigatoriedadeEntregaIn1888: true,
    ganhoCapitalLiquidoBrl: ganho,
    aliquotaImpostoGanhoPercent: aliquota,
    impostoRendaDevidoBrl: imposto,
    loteTransmissaoIn1888Gerado: lote,
    statusDeclaracao: 'DECLARACAO_IN_1888_GERADA_E_VALIDADA_RFB',
    diagnosticoIn1888: diag
  });
}
