import { Result, Ok, Err } from '../../types/result.js';

export interface BepsGlobeInput {
  holdingMultinacionalCnpj: string;
  jurisdicaoOperacao: string; // Ex: 'BRASIL', 'IRLANDA', 'PAISES_BAIXOS'
  anoCalendario: number;
  receitaGlobalGrupoEurMilhoes: number; // Limiar OCDE >= 750M EUR
  lucroLiquidoAjustadoGlobeBrl: number; // Ex: R$ 50.000.000,00
  tributosCobertosAjustadosPagosBrl: number; // Ex: R$ 5.000.000,00 (ETR = 10%)
  aliquotaMinimaGlobalPercent: number; // 15.0%
}

export interface BepsGlobeResult {
  holdingMultinacionalCnpj: string;
  jurisdicaoOperacao: string;
  taxaEfetivaTributacaoEtrPercent: number; // Ex: 10.0%
  aliquotaTopUpTaxPercent: number; // 15.0% - 10.0% = 5.0%
  impostoAdicionalQdmttDevidoBrl: number; // 5% de R$ 50M = R$ 2.500.000,00
  statusConformidadeOcde: 'TOP_UP_TAX_QDMTT_APURADO_15_PERCENT';
  escrituracaoSpedEcfBlocoX: string;
  diagnosticoGlobe: string;
}

export function processBepsGlobeQdmttEngine(input: BepsGlobeInput): Result<BepsGlobeResult, Error> {
  const {
    holdingMultinacionalCnpj,
    jurisdicaoOperacao,
    receitaGlobalGrupoEurMilhoes,
    lucroLiquidoAjustadoGlobeBrl,
    tributosCobertosAjustadosPagosBrl,
    aliquotaMinimaGlobalPercent = 15.0
  } = input;

  if (!holdingMultinacionalCnpj || lucroLiquidoAjustadoGlobeBrl <= 0) {
    return Err(new Error('CNPJ da holding e lucro líquido GloBE positivo são obrigatórios.'));
  }

  if (receitaGlobalGrupoEurMilhoes < 750) {
    return Err(new Error('Grupo econômico abaixo do limiar de 750M EUR do Pilar 2 da OCDE.'));
  }

  const etrPercent = (tributosCobertosAjustadosPagosBrl / lucroLiquidoAjustadoGlobeBrl) * 100;
  const topUpTaxPercent = Math.max(0, aliquotaMinimaGlobalPercent - etrPercent);
  const qdmttDevidoBrl = (lucroLiquidoAjustadoGlobeBrl * topUpTaxPercent) / 100;

  const diag = "BEPS GloBE Pilar 2 (OCDE / IN RFB 2.228/24): Jurisdicao " + jurisdicaoOperacao + " | Lucro GloBE: R$ " + lucroLiquidoAjustadoGlobeBrl.toLocaleString('pt-BR') + " | ETR Atual: " + etrPercent.toFixed(2) + "% | Aliquota Top-up Tax: " + topUpTaxPercent.toFixed(2) + "% -> QDMTT Adicional: R$ " + qdmttDevidoBrl.toLocaleString('pt-BR');

  return Ok({
    holdingMultinacionalCnpj,
    jurisdicaoOperacao,
    taxaEfetivaTributacaoEtrPercent: parseFloat(etrPercent.toFixed(2)),
    aliquotaTopUpTaxPercent: parseFloat(topUpTaxPercent.toFixed(2)),
    impostoAdicionalQdmttDevidoBrl: parseFloat(qdmttDevidoBrl.toFixed(2)),
    statusConformidadeOcde: 'TOP_UP_TAX_QDMTT_APURADO_15_PERCENT',
    escrituracaoSpedEcfBlocoX: 'REGISTRO_X340_X350_ECF_APROVADO',
    diagnosticoGlobe: diag
  });
}
