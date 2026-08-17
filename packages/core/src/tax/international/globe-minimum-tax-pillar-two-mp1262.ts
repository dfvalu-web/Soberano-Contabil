import { Result, Ok, Err } from '../../types/result.js';

export interface GlobeMinimumTaxInput {
  multinacionalId: string;
  multinacionalNome: string; // Ex: 'Soberano Global Holdings S.A.'
  anoApuracao: number; // Ex: 2026
  receitaConsolidadaGlobalEurMilhoes: number; // Mínimo 750M EUR para enquadramento GloBE
  lucroLiquidoContabilAjustadoGlobeBrl: number; // GloBE Income
  tributosAbrangidosPagosBrl: number; // IRPJ + CSLL efetivamente pagos no Brasil
  substanciaEconomicaAtivosFolhaDeducoesBrl?: number; // Exclusão baseada em substância (SBIE)
}

export interface GlobeMinimumTaxResult {
  multinacionalId: string;
  multinacionalNome: string;
  anoApuracao: number;
  isElegivelRegrasGlobe: boolean;
  aliquotaEfetivaApuradaEtrPercent: number; // ETR = Tributos / Lucro GloBE
  aliquotaMinimaGlobalPercent: number; // 15.0% fixado pela OCDE
  aliquotaAdicionalTopUpPercent: number; // Max(0, 15% - ETR)
  adicionalCsllQdmttDevidoBrl: number; // Top-up Tax a pagar no Brasil
  diagnosticoGlobePilarDois: string;
}

export function processGlobeMinimumTaxPillarTwoMp1262(input: GlobeMinimumTaxInput): Result<GlobeMinimumTaxResult, Error> {
  const {
    multinacionalId,
    multinacionalNome,
    anoApuracao,
    receitaConsolidadaGlobalEurMilhoes,
    lucroLiquidoContabilAjustadoGlobeBrl,
    tributosAbrangidosPagosBrl,
    substanciaEconomicaAtivosFolhaDeducoesBrl = 0
  } = input;

  if (lucroLiquidoContabilAjustadoGlobeBrl <= 0) {
    return Err(new Error('Lucro contábil ajustado GloBE deve ser superior a zero.'));
  }

  // MP nº 1.262/2024 e Regras Modelo GloBE OCDE Pilar Dois:
  // 1. Elegibilidade: Grupo multinacional com receita consolidada >= 750 milhões de Euros
  const isElegivel = receitaConsolidadaGlobalEurMilhoes >= 750;

  // 2. Alíquota Efetiva (Effective Tax Rate - ETR):
  // ETR = (Tributos Abrangidos / Lucro Líquido GloBE) * 100
  const etr = Number(((tributosAbrangidosPagosBrl / lucroLiquidoContabilAjustadoGlobeBrl) * 100).toFixed(4));

  // 3. Alíquota Mínima Global = 15,0%
  const aliquotaMinima = 15.0;
  const aliquotaTopUp = Number((Math.max(0, aliquotaMinima - etr)).toFixed(4));

  // 4. Base Tributável com exclusão de substância econômica (SBIE)
  const baseTributavelAjustada = Math.max(0, lucroLiquidoContabilAjustadoGlobeBrl - substanciaEconomicaAtivosFolhaDeducoesBrl);
  const qdmttTopUpDevido = Number((baseTributavelAjustada * (aliquotaTopUp / 100)).toFixed(2));

  const diag = "Imposto Minimo Global (OCDE Pilar 2 / MP nº 1.262/2024): " + multinacionalNome + " (Ano " + anoApuracao + "). Receita Global: € " + receitaConsolidadaGlobalEurMilhoes + "M (Elegivel: " + isElegivel + "). Lucro GloBE: R$ " + lucroLiquidoContabilAjustadoGlobeBrl.toFixed(2) + " | Tributos Pagos: R$ " + tributosAbrangidosPagosBrl.toFixed(2) + " -> ALIQUOTA EFETIVA (ETR): " + etr.toFixed(2) + "%. Piso Minimo: 15,00% -> Aliquota Top-up: " + aliquotaTopUp.toFixed(2) + "%. Adicional CSLL (QDMTT) Devido no Brasil: R$ " + qdmttTopUpDevido.toFixed(2) + ".";

  return Ok({
    multinacionalId,
    multinacionalNome,
    anoApuracao,
    isElegivelRegrasGlobe: isElegivel,
    aliquotaEfetivaApuradaEtrPercent: etr,
    aliquotaMinimaGlobalPercent: aliquotaMinima,
    aliquotaAdicionalTopUpPercent: aliquotaTopUp,
    adicionalCsllQdmttDevidoBrl: qdmttTopUpDevido,
    diagnosticoGlobePilarDois: diag
  });
}
