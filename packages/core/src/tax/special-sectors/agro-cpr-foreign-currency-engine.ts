import { Result, Ok, Err } from '../../types/result.js';

export interface AgroCprInput {
  produtorRuralCnpjCpf: string;
  culturaAgricola: 'SOJA' | 'MILHO' | 'ALGODAO' | 'CAFE';
  volumeMoedaEstrangeiraUsd: number; // Ex: US$ 2.000.000,00
  taxaCambioEmissaoBrl: number; // Ex: R$ 5.40 -> R$ 10.800.000,00
  taxaCambioFechamentoBrl: number; // Ex: R$ 5.60 -> R$ 11.200.000,00
  prazoMesesLiquidacao: number; // Ex: 12 meses
  registradoraAutorizadaBacen: 'B3' | 'CERC' | 'CRDC';
}

export interface AgroCprResult {
  produtorRuralCnpjCpf: string;
  culturaAgricola: string;
  valorOriginalEmissaoBrl: number; // R$ 10.800.000,00
  valorAtualizadoFechamentoBrl: number; // R$ 11.200.000,00
  variacaoCambialPassivaBrl: number; // R$ 400.000,00 (Despesa financeira cambial)
  registroNumeroCprB3: string;
  statusRegistroCpr: 'CPR_FINANCEIRA_DOLAR_REGISTRADA_LEI_13986';
  diagnosticoCpr: string;
}

export function processAgroCprForeignCurrencyEngine(input: AgroCprInput): Result<AgroCprResult, Error> {
  const {
    produtorRuralCnpjCpf,
    culturaAgricola,
    volumeMoedaEstrangeiraUsd,
    taxaCambioEmissaoBrl,
    taxaCambioFechamentoBrl,
    registradoraAutorizadaBacen
  } = input;

  if (!produtorRuralCnpjCpf || volumeMoedaEstrangeiraUsd <= 0 || taxaCambioEmissaoBrl <= 0) {
    return Err(new Error('CNPJ/CPF do produtor, volume em USD e taxa de câmbio são obrigatórios.'));
  }

  const valorOriginal = volumeMoedaEstrangeiraUsd * taxaCambioEmissaoBrl;
  const valorFechamento = volumeMoedaEstrangeiraUsd * taxaCambioFechamentoBrl;
  const variacaoCambial = valorFechamento - valorOriginal;
  const registroCpr = 'CPR-FX-2026-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const diag = "CPR Financeira em Moeda Estrangeira (Lei 13.986/20): US$ " + volumeMoedaEstrangeiraUsd.toLocaleString('en-US') + " (" + culturaAgricola + ") | Emissao (R$ " + taxaCambioEmissaoBrl.toFixed(2) + "): R$ " + valorOriginal.toLocaleString('pt-BR') + " | Fechamento (R$ " + taxaCambioFechamentoBrl.toFixed(2) + "): R$ " + valorFechamento.toLocaleString('pt-BR') + " | Variacao Cambial: R$ " + variacaoCambial.toLocaleString('pt-BR') + " | Registradora: " + registradoraAutorizadaBacen + " (" + registroCpr + ")";

  return Ok({
    produtorRuralCnpjCpf,
    culturaAgricola,
    valorOriginalEmissaoBrl: valorOriginal,
    valorAtualizadoFechamentoBrl: valorFechamento,
    variacaoCambialPassivaBrl: variacaoCambial,
    registroNumeroCprB3: registroCpr,
    statusRegistroCpr: 'CPR_FINANCEIRA_DOLAR_REGISTRADA_LEI_13986',
    diagnosticoCpr: diag
  });
}
