import { Result, Ok, Err } from '../../types/result.js';

export interface DifalFcpCalculationInput {
  documentoFiscalNumero: string;
  ufOrigem: string;
  ufDestino: string;
  valorOperacaoComFreteIpiBrl: number;
  aliquotaInterestadualOrigemPercent: number; // Ex: 7% ou 12% ou 4% (importado)
  aliquotaInternaDestinoPercent: number; // Ex: 18% ou 20%
  aliquotaFcpPercent: number; // Ex: 2% (Fundo de Combate à Pobreza)
}

export interface DifalFcpCalculationResult {
  documentoFiscalNumero: string;
  ufOrigem: string;
  ufDestino: string;
  baseCalculoDuplaDestinoBrl: number;
  icmsOrigemBrl: number;
  icmsDestinoTotalBrl: number;
  difalLiquidoDestinoBrl: number;
  fcpDestinoBrl: number;
  totalRecolhimentoGnreDestinoBrl: number;
  escrituracaoSpedBlocoC101: {
    vlIcmsDifalDest: number;
    vlIcmsFcpDest: number;
    vlIcmsDifalRemetente: number;
  };
  diagnosticoDifal: string;
}

export function processDifalNonTaxpayerFcpTaxEngine(input: DifalFcpCalculationInput): Result<DifalFcpCalculationResult, Error> {
  const {
    documentoFiscalNumero,
    ufOrigem,
    ufDestino,
    valorOperacaoComFreteIpiBrl,
    aliquotaInterestadualOrigemPercent,
    aliquotaInternaDestinoPercent,
    aliquotaFcpPercent
  } = input;

  if (valorOperacaoComFreteIpiBrl <= 0 || aliquotaInternaDestinoPercent <= aliquotaInterestadualOrigemPercent) {
    return Err(new Error('Valor da operação deve ser positivo e alíquota interna de destino maior que a interestadual.'));
  }

  // 1. ICMS Origem
  const icmsOrigem = Number((valorOperacaoComFreteIpiBrl * (aliquotaInterestadualOrigemPercent / 100)).toFixed(2));
  
  // 2. Base Dupla de Cálculo do Destino conforme LC 190/2022:
  // Base 1 (sem ICMS origem) = Valor - ICMS Origem
  // Base 2 (Destino) = Base 1 / (1 - (Aliquota Interna + FCP))
  const aliqTotalDestinoDecimal = (aliquotaInternaDestinoPercent + aliquotaFcpPercent) / 100;
  const baseSemIcmsOrigem = valorOperacaoComFreteIpiBrl - icmsOrigem;
  const baseDuplaDestino = Number((baseSemIcmsOrigem / (1 - aliqTotalDestinoDecimal)).toFixed(2));

  // 3. Montantes de ICMS Destino e DIFAL
  const icmsDestinoTotal = Number((baseDuplaDestino * (aliquotaInternaDestinoPercent / 100)).toFixed(2));
  const fcpDestino = Number((baseDuplaDestino * (aliquotaFcpPercent / 100)).toFixed(2));
  const difalLiquidoDestino = Number((icmsDestinoTotal - icmsOrigem).toFixed(2));
  const totalGnre = Number((difalLiquidoDestino + fcpDestino).toFixed(2));

  const diag = "DIFAL Nao Contribuinte Base Dupla (LC 190/22): Doc " + documentoFiscalNumero + " (" + ufOrigem + " -> " + ufDestino + ") | Valor: R$ " + valorOperacaoComFreteIpiBrl.toFixed(2) + " -> Base Dupla Destino: R$ " + baseDuplaDestino.toFixed(2) + " | ICMS Origem (" + aliquotaInterestadualOrigemPercent + "%): R$ " + icmsOrigem.toFixed(2) + " | DIFAL Destino: R$ " + difalLiquidoDestino.toFixed(2) + " | FCP (" + aliquotaFcpPercent + "%): R$ " + fcpDestino.toFixed(2) + " | Total GNRE: R$ " + totalGnre.toFixed(2) + ".";

  return Ok({
    documentoFiscalNumero,
    ufOrigem,
    ufDestino,
    baseCalculoDuplaDestinoBrl: baseDuplaDestino,
    icmsOrigemBrl: icmsOrigem,
    icmsDestinoTotalBrl: icmsDestinoTotal,
    difalLiquidoDestinoBrl: difalLiquidoDestino,
    fcpDestinoBrl: fcpDestino,
    totalRecolhimentoGnreDestinoBrl: totalGnre,
    escrituracaoSpedBlocoC101: {
      vlIcmsDifalDest: difalLiquidoDestino,
      vlIcmsFcpDest: fcpDestino,
      vlIcmsDifalRemetente: 0.00
    },
    diagnosticoDifal: diag
  });
}
