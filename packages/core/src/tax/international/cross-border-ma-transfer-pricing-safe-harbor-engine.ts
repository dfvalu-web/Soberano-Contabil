import { Result, Ok, Err } from '../../types/result.js';

export interface CrossBorderMaInput {
  adquirenteBrasilCnpj: string;
  alvoEstrangeiroNome: string;
  moedaTransacao: 'USD' | 'EUR' | 'GBP';
  taxaCambioBrl: number; // Ex: 5.50
  valorAquisicaoMoedaOriginal: number; // Ex: 20.000.000 USD (R$ 110M)
  patrimonioLiquidoIdentificavelValorJustoUsd: number; // Ex: 14.000.000 USD (R$ 77M)
  servicosIntragrupoCustosDiretosIndiretosUsd: number; // Ex: 1.000.000 USD
  aplicarSafeHarborBaixoValorAgregado: boolean; // Mark-up 5% IN RFB 2.161/23
}

export interface CrossBorderMaResult {
  adquirenteBrasilCnpj: string;
  alvoEstrangeiroNome: string;
  valorAquisicaoBrl: number;
  patrimonioLiquidoIdentificavelBrl: number;
  goodwillApuradoMoedaOriginal: number; // 6.000.000 USD
  goodwillApuradoBrl: number; // R$ 33.000.000,00
  safeHarborPrecoTransferenciaUsd: number; // 1.000.000 * 1.05 = 1.050.000 USD
  safeHarborPrecoTransferenciaBrl: number;
  statusMaCrossBorder: 'COMBINACAO_CROSS_BORDER_E_SAFE_HARBOR_HOMOLOGADOS';
  diagnosticoMa: string;
}

export function processCrossBorderMaTransferPricingSafeHarborEngine(input: CrossBorderMaInput): Result<CrossBorderMaResult, Error> {
  const {
    adquirenteBrasilCnpj,
    alvoEstrangeiroNome,
    taxaCambioBrl,
    valorAquisicaoMoedaOriginal,
    patrimonioLiquidoIdentificavelValorJustoUsd,
    servicosIntragrupoCustosDiretosIndiretosUsd,
    aplicarSafeHarborBaixoValorAgregado
  } = input;

  if (!adquirenteBrasilCnpj || taxaCambioBrl <= 0 || valorAquisicaoMoedaOriginal <= 0) {
    return Err(new Error('CNPJ, taxa de câmbio e valor de aquisição são obrigatórios.'));
  }

  const valorAquisicaoBrl = valorAquisicaoMoedaOriginal * taxaCambioBrl;
  const plBrl = patrimonioLiquidoIdentificavelValorJustoUsd * taxaCambioBrl;
  const goodwillUsd = Math.max(0, valorAquisicaoMoedaOriginal - patrimonioLiquidoIdentificavelValorJustoUsd);
  const goodwillBrl = goodwillUsd * taxaCambioBrl;

  // Safe harbor: margem de 5% sobre custos (IN RFB 2.161/23 Art. 48)
  const safeHarborUsd = servicosIntragrupoCustosDiretosIndiretosUsd * 1.05;
  const safeHarborBrl = safeHarborUsd * taxaCambioBrl;

  const diag = "M&A Cross-Border (CPC 15 / IFRS 3): Aquisicao de " + alvoEstrangeiroNome + " por " + valorAquisicaoMoedaOriginal.toLocaleString('en-US') + " " + input.moedaTransacao + " (R$ " + valorAquisicaoBrl.toLocaleString('pt-BR') + ") | Goodwill: R$ " + goodwillBrl.toLocaleString('pt-BR') + " | TP Safe Harbor 5%: R$ " + safeHarborBrl.toLocaleString('pt-BR') + " -> Homologado.";

  return Ok({
    adquirenteBrasilCnpj,
    alvoEstrangeiroNome,
    valorAquisicaoBrl,
    patrimonioLiquidoIdentificavelBrl: plBrl,
    goodwillApuradoMoedaOriginal: goodwillUsd,
    goodwillApuradoBrl: goodwillBrl,
    safeHarborPrecoTransferenciaUsd: safeHarborUsd,
    safeHarborPrecoTransferenciaBrl: safeHarborBrl,
    statusMaCrossBorder: 'COMBINACAO_CROSS_BORDER_E_SAFE_HARBOR_HOMOLOGADOS',
    diagnosticoMa: diag
  });
}
