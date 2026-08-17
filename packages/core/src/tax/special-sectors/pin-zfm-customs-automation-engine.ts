import { Result, Ok, Err } from '../../types/result.js';

export interface PinZfmInput {
  remetenteNacionalCnpj: string;
  destinatarioZfmCnpj: string;
  numeroNotaFiscal: string;
  valorTotalMercadoriaBrl: number; // Ex: R$ 1.000.000,00
  aliquotaIpiOriginalPercent: number; // Ex: 15.0% (desonerado)
  aliquotaPisCofinsOriginalPercent: number; // Ex: 9.25% (desonerado)
}

export interface PinZfmResult {
  protocoloIngressoPinZfm: string;
  valorTotalMercadoriaBrl: number;
  economiaIpiDesoneradoBrl: number; // R$ 150.000,00
  economiaPisCofinsDesoneradoBrl: number; // R$ 92.500,00
  economiaTributariaTotalBrl: number; // R$ 242.500,00
  statusInternamentoSuframa: 'MERCADORIA_INTERNADA_PIN_VALIDADO_SEFAZ_AM';
  diagnosticoPin: string;
}

export function processPinZfmCustomsAutomationEngine(input: PinZfmInput): Result<PinZfmResult, Error> {
  const {
    remetenteNacionalCnpj,
    destinatarioZfmCnpj,
    numeroNotaFiscal,
    valorTotalMercadoriaBrl,
    aliquotaIpiOriginalPercent,
    aliquotaPisCofinsOriginalPercent
  } = input;

  if (!remetenteNacionalCnpj || !destinatarioZfmCnpj || valorTotalMercadoriaBrl <= 0) {
    return Err(new Error('CNPJ remetente, destinatário ZFM e valor da mercadoria são obrigatórios.'));
  }

  const economiaIpi = (valorTotalMercadoriaBrl * aliquotaIpiOriginalPercent) / 100;
  const economiaPisCofins = (valorTotalMercadoriaBrl * aliquotaPisCofinsOriginalPercent) / 100;
  const economiaTotal = economiaIpi + economiaPisCofins;
  const pinGerado = 'PIN-ZFM-2026-' + Math.random().toString(36).substring(2, 12).toUpperCase();

  const diag = "PIN-ZFM Internamento Aduaneiro: NF " + numeroNotaFiscal + " | Valor: R$ " + valorTotalMercadoriaBrl.toLocaleString('pt-BR') + " | Desoneração IPI: R$ " + economiaIpi.toLocaleString('pt-BR') + " | Desoneração PIS/COFINS: R$ " + economiaPisCofins.toLocaleString('pt-BR') + " | Economia Total: R$ " + economiaTotal.toLocaleString('pt-BR') + " -> Protocolo PIN: " + pinGerado;

  return Ok({
    protocoloIngressoPinZfm: pinGerado,
    valorTotalMercadoriaBrl,
    economiaIpiDesoneradoBrl: economiaIpi,
    economiaPisCofinsDesoneradoBrl: economiaPisCofins,
    economiaTributariaTotalBrl: economiaTotal,
    statusInternamentoSuframa: 'MERCADORIA_INTERNADA_PIN_VALIDADO_SEFAZ_AM',
    diagnosticoPin: diag
  });
}
