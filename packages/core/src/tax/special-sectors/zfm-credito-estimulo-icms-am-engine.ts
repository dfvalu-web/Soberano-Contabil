import { Result, Ok, Err } from '../../types/result.js';

export interface ZfmIcmsAmInput {
  fabricaId: string;
  fabricaNome: string; // Ex: 'Soberano Eletroeletrônicos da Amazônia Ltda'
  competencia: string; // Ex: '2026-04'
  icmsDebitoSaidasBrl: number;
  icmsCreditoEntradasBrl: number;
  percentualCreditoEstimuloAmPercent?: number; // Padrão 55%, 75% ou 100% (ex: 75% para bens finais de informática/eletrônicos)
  aliquotaFtiPercent?: number; // FTI: 1,5% sobre o faturamento ou percentual do benefício
  aliquotaFmpesPercent?: number; // FMPES: 6,0% sobre o crédito estímulo apropriado
}

export interface ZfmIcmsAmResult {
  fabricaId: string;
  fabricaNome: string;
  competencia: string;
  saldoDevedorIcmsBrutoBrl: number; // Débitos - Créditos
  percentualCreditoEstimuloPercent: number;
  valorCreditoEstimuloApropriadoBrl: number; // Saldo Devedor * % Estímulo
  icmsEfetivoARecolherSefazAmBrl: number; // Saldo Devedor - Estímulo
  contribuicaoFtiDevidaBrl: number; // Contribuição ao FTI
  contribuicaoFmpesDevidaBrl: number; // 6% s/ crédito estímulo
  economiaTributariaTotalBrl: number;
  diagnosticoZfmIcmsAm: string;
}

export function processZfmCreditoEstimuloIcmsAmEngine(input: ZfmIcmsAmInput): Result<ZfmIcmsAmResult, Error> {
  const {
    fabricaId,
    fabricaNome,
    competencia,
    icmsDebitoSaidasBrl,
    icmsCreditoEntradasBrl,
    percentualCreditoEstimuloAmPercent = 75.0,
    aliquotaFtiPercent = 2.0,
    aliquotaFmpesPercent = 6.0
  } = input;

  if (icmsDebitoSaidasBrl < 0 || icmsCreditoEntradasBrl < 0) {
    return Err(new Error('Débitos e créditos de ICMS não podem ser negativos.'));
  }

  // Lei Estadual AM nº 2.826/2003 & Decreto nº 23.994/2003:
  // 1. Saldo Devedor Bruto de ICMS
  const saldoDevedorBruto = Math.max(0, icmsDebitoSaidasBrl - icmsCreditoEntradasBrl);

  // 2. Crédito Estímulo do Amazonas
  const valorCreditoEstimulo = Number((saldoDevedorBruto * (percentualCreditoEstimuloAmPercent / 100)).toFixed(2));

  // 3. ICMS Efetivo a Recolher
  const icmsEfetivo = Number((saldoDevedorBruto - valorCreditoEstimulo).toFixed(2));

  // 4. Fundos Obrigatórios Estaduais:
  // FMPES = 6% sobre o Crédito Estímulo
  const fmpes = Number((valorCreditoEstimulo * (aliquotaFmpesPercent / 100)).toFixed(2));
  // FTI = 2% sobre o benefício / crédito estímulo
  const fti = Number((valorCreditoEstimulo * (aliquotaFtiPercent / 100)).toFixed(2));

  // Economia Líquida = Crédito Estímulo - (FTI + FMPES)
  const economiaLiquida = Number((valorCreditoEstimulo - (fti + fmpes)).toFixed(2));

  const diag = "Incentivos Fiscais ZFM / ICMS AM (Lei 2.826/03): " + fabricaNome + " (" + competencia + "). Saldo Devedor Bruto: R$ " + saldoDevedorBruto.toFixed(2) + " | Credito Estimulo (" + percentualCreditoEstimuloAmPercent + "%): R$ " + valorCreditoEstimulo.toFixed(2) + " -> ICMS Efetivo SEFAZ AM: R$ " + icmsEfetivo.toFixed(2) + " | FMPES (6%): R$ " + fmpes.toFixed(2) + " | FTI (" + aliquotaFtiPercent + "%): R$ " + fti.toFixed(2) + " -> Economia Tributaria Liquida: R$ " + economiaLiquida.toFixed(2) + ".";

  return Ok({
    fabricaId,
    fabricaNome,
    competencia,
    saldoDevedorIcmsBrutoBrl: saldoDevedorBruto,
    percentualCreditoEstimuloPercent: percentualCreditoEstimuloAmPercent,
    valorCreditoEstimuloApropriadoBrl: valorCreditoEstimulo,
    icmsEfetivoARecolherSefazAmBrl: icmsEfetivo,
    contribuicaoFtiDevidaBrl: fti,
    contribuicaoFmpesDevidaBrl: fmpes,
    economiaTributariaTotalBrl: economiaLiquida,
    diagnosticoZfmIcmsAm: diag
  });
}
