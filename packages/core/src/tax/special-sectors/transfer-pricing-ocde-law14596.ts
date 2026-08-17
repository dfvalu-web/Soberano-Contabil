import { Result, Ok, Err } from '../../types/result.js';

export type OcdeTpMethod = 'PIC_PRECO_INDEPENDENTE_COMPARAVEL' | 'PRL_PRECO_REVENDA_MENOS_LUCRO' | 'MCL_MARGEM_LIQUIDA_TRANSACAO_TNMM';

export interface TransferPricingOcdeInput {
  transacaoId: string;
  empresaBrasileiraNome: string;
  parteVinculadaExteriorNome: string;
  paisVinculada: string;
  metodoAdotado: OcdeTpMethod;
  precoPraticadoImportacaoUnitarioUsd: number; // Preço pago à vinculada
  quantidadeTransacionada: number;
  taxaCambioPtaxBrlPorUsd: number;
  limiteInferiorInterquartilUsd: number; // Percentil 25
  medianaInterquartilUsd: number; // Percentil 50 (Preço Parâmetro Arm's Length)
  limiteSuperiorInterquartilUsd: number; // Percentil 75
}

export interface TransferPricingOcdeResult {
  transacaoId: string;
  empresaBrasileiraNome: string;
  parteVinculadaExteriorNome: string;
  metodoAdotado: OcdeTpMethod;
  isDentroIntervaloInterquartil: boolean;
  ajustePrimarioTransferPricingUsd: number;
  ajustePrimarioTransferPricingBrl: number;
  adicaoLalurIrpjBrl: number; // 25% (15% + 10% adicional)
  adicaoLacsCsllBrl: number; // 9%
  totalTributosAdicionaisLalurBrl: number; // 34%
  diagnosticoFiscal: string;
}

export function processTransferPricingOcdeLaw14596(input: TransferPricingOcdeInput): Result<TransferPricingOcdeResult, Error> {
  const {
    transacaoId,
    empresaBrasileiraNome,
    parteVinculadaExteriorNome,
    paisVinculada,
    metodoAdotado,
    precoPraticadoImportacaoUnitarioUsd,
    quantidadeTransacionada,
    taxaCambioPtaxBrlPorUsd,
    limiteInferiorInterquartilUsd,
    medianaInterquartilUsd,
    limiteSuperiorInterquartilUsd
  } = input;

  if (precoPraticadoImportacaoUnitarioUsd <= 0 || quantidadeTransacionada <= 0 || taxaCambioPtaxBrlPorUsd <= 0) {
    return Err(new Error('Preços, quantidades e taxa de câmbio devem ser superiores a zero.'));
  }

  // Lei nº 14.596/2023 (Novo Marco de Preços de Transferência - Padrão OCDE / Arm\'s Length):
  // 1. Se o preço praticado na importação estiver dentro do intervalo interquartil (p25 a p75),
  //    considera-se em conformidade com o princípio arm\'s length (sem ajuste).
  // 2. Se o preço praticado for SUPERIOR ao limite superior (p75), o preço deve ser ajustado para a MEDIANA (p50).
  const isDentroIntervalo = (
    precoPraticadoImportacaoUnitarioUsd >= limiteInferiorInterquartilUsd &&
    precoPraticadoImportacaoUnitarioUsd <= limiteSuperiorInterquartilUsd
  );

  let ajusteUnitarioUsd = 0;
  if (!isDentroIntervalo && precoPraticadoImportacaoUnitarioUsd > limiteSuperiorInterquartilUsd) {
    ajusteUnitarioUsd = precoPraticadoImportacaoUnitarioUsd - medianaInterquartilUsd;
  }

  const ajusteTotalUsd = Number((ajusteUnitarioUsd * quantidadeTransacionada).toFixed(2));
  const ajusteTotalBrl = Number((ajusteTotalUsd * taxaCambioPtaxBrlPorUsd).toFixed(2));

  // Ajuste espontâneo de IRPJ (25%) e CSLL (9%) no Lalur/Lacs
  const irpj = Number((ajusteTotalBrl * 0.25).toFixed(2));
  const csll = Number((ajusteTotalBrl * 0.09).toFixed(2));
  const totalTributos = Number((irpj + csll).toFixed(2));

  const statusMsg = isDentroIntervalo
    ? "CONFORME ARMS LENGTH (Sem Ajuste)"
    : "AJUSTE A MEDIANA: R$ " + ajusteTotalBrl.toFixed(2) + " (Adicao Lalur IRPJ 25% R$ " + irpj.toFixed(2) + " + CSLL 9% R$ " + csll.toFixed(2) + ")";

  const diag = "Precos de Transferencia OCDE (Lei nº 14.596/2023 - " + metodoAdotado + "): " + empresaBrasileiraNome + " com " + parteVinculadaExteriorNome + " (" + paisVinculada + "). Preco Praticado: US$ " + precoPraticadoImportacaoUnitarioUsd.toFixed(2) + " vs Intervalo [US$ " + limiteInferiorInterquartilUsd.toFixed(2) + " - US$ " + limiteSuperiorInterquartilUsd.toFixed(2) + "], Mediana US$ " + medianaInterquartilUsd.toFixed(2) + ". Status: " + statusMsg + ".";

  return Ok({
    transacaoId,
    empresaBrasileiraNome,
    parteVinculadaExteriorNome,
    metodoAdotado,
    isDentroIntervaloInterquartil: isDentroIntervalo,
    ajustePrimarioTransferPricingUsd: ajusteTotalUsd,
    ajustePrimarioTransferPricingBrl: ajusteTotalBrl,
    adicaoLalurIrpjBrl: irpj,
    adicaoLacsCsllBrl: csll,
    totalTributosAdicionaisLalurBrl: totalTributos,
    diagnosticoFiscal: diag
  });
}
