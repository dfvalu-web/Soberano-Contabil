import { Result, Ok, Err } from '../../types/result.js';

export type WesternAmazonAlcZone = 'AMAZONIA_OCIDENTAL_RO_AC_RR_AM' | 'ALC_GUAJARA_MIRIM' | 'ALC_MACAPA_SANTANA' | 'ALC_TABATINGA' | 'ALC_CRUZEIRO_DO_SUL';

export interface WesternAmazonTaxInput {
  documentoNumero: string;
  zonaBeneficiada: WesternAmazonAlcZone;
  valorOperacaoFaturamentoBrl: number;
  aliquotaIpiPadraoPercent: number; // Ex: 12%
  aliquotaPisCofinsPadraoPercent: number; // Ex: 9.25%
  aliquotaIcmsInternaPercent: number; // Ex: 17.5%
  percentualCreditoPresumidoIcmsPercent?: number; // Ex: 75%
}

export interface WesternAmazonTaxResult {
  documentoNumero: string;
  zonaBeneficiada: WesternAmazonAlcZone;
  valorOperacaoFaturamentoBrl: number;
  isencaoIpiBrl: number;
  desoneracaoPisCofinsAliquotaZeroBrl: number;
  icmsDevidoComCreditoPresumidoBrl: number;
  creditoPresumidoIcmsApropriadoBrl: number;
  totalBeneficioFiscalRegionalBrl: number;
  fundamentoLegal: string;
  diagnosticoAmazoniaOcidental: string;
}

export function processWesternAmazonAlcTaxEngine(input: WesternAmazonTaxInput): Result<WesternAmazonTaxResult, Error> {
  const {
    documentoNumero,
    zonaBeneficiada,
    valorOperacaoFaturamentoBrl,
    aliquotaIpiPadraoPercent,
    aliquotaPisCofinsPadraoPercent,
    aliquotaIcmsInternaPercent,
    percentualCreditoPresumidoIcmsPercent = 75.0
  } = input;

  if (valorOperacaoFaturamentoBrl <= 0) {
    return Err(new Error('Valor da operação deve ser positivo.'));
  }

  // 1. Isenção de IPI (Decreto-Lei 288/67 e Decreto-Lei 356/68)
  const isencaoIpi = Number((valorOperacaoFaturamentoBrl * (aliquotaIpiPadraoPercent / 100)).toFixed(2));

  // 2. Alíquota Zero de PIS/COFINS (Leis 10.637/02 e 10.833/03)
  const desoneracaoPisCofins = Number((valorOperacaoFaturamentoBrl * (aliquotaPisCofinsPadraoPercent / 100)).toFixed(2));

  // 3. ICMS com Crédito Presumido Regional
  const icmsNominal = valorOperacaoFaturamentoBrl * (aliquotaIcmsInternaPercent / 100);
  const creditoPresumido = Number((icmsNominal * (percentualCreditoPresumidoIcmsPercent / 100)).toFixed(2));
  const icmsDevido = Number((icmsNominal - creditoPresumido).toFixed(2));

  const totalBeneficio = Number((isencaoIpi + desoneracaoPisCofins + creditoPresumido).toFixed(2));

  const fundLegal = 'Decreto-Lei nº 356/1968, Lei nº 10.637/2002 e Convênio ICMS 65/1988';

  const diag = "Incentivos Amazonia Ocidental / ALC (" + zonaBeneficiada + "): Doc " + documentoNumero + " | Faturamento: R$ " + valorOperacaoFaturamentoBrl.toFixed(2) + " -> Isencao IPI (" + aliquotaIpiPadraoPercent + "%): R$ " + isencaoIpi.toFixed(2) + " | Aliquota Zero PIS/COFINS (" + aliquotaPisCofinsPadraoPercent + "%): R$ " + desoneracaoPisCofins.toFixed(2) + " | Credito Presumido ICMS (" + percentualCreditoPresumidoIcmsPercent + "%): R$ " + creditoPresumido.toFixed(2) + " -> Beneficio Fiscal Total: R$ " + totalBeneficio.toFixed(2) + ".";

  return Ok({
    documentoNumero,
    zonaBeneficiada,
    valorOperacaoFaturamentoBrl,
    isencaoIpiBrl: isencaoIpi,
    desoneracaoPisCofinsAliquotaZeroBrl: desoneracaoPisCofins,
    icmsDevidoComCreditoPresumidoBrl: icmsDevido,
    creditoPresumidoIcmsApropriadoBrl: creditoPresumido,
    totalBeneficioFiscalRegionalBrl: totalBeneficio,
    fundamentoLegal: fundLegal,
    diagnosticoAmazoniaOcidental: diag
  });
}
