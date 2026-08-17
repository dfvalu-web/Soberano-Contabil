import { Result, Ok } from '../../types/result.js';

export interface CulturalIncentiveInput {
  anoCalendario: number;
  valorDoacaoPatrocinioLeiRouanetArt18: number;
  valorDoacaoPatrocinioLeiDoEsporte: number;
  irpjDevidoApuradoAliquota15: number;
}

export interface CulturalIncentiveResult {
  anoCalendario: number;
  deducaoEfetivaRouanet4PercentMax: number;
  deducaoEfetivaEsporte2PercentMax: number;
  totalDeducaoIncentivosCulturais: number;
  irpjFinalAPagar: number;
  excessoNaoAproveitadoRouanet: number;
  diagnosticoFiscal: string;
}

export function calculateCulturalAndSportsIncentives(input: CulturalIncentiveInput): Result<CulturalIncentiveResult, Error> {
  const { anoCalendario, valorDoacaoPatrocinioLeiRouanetArt18, valorDoacaoPatrocinioLeiDoEsporte, irpjDevidoApuradoAliquota15 } = input;

  // Trava Rouanet Art. 18: Máximo 4% do IRPJ devido
  const limiteRouanet4 = Number((irpjDevidoApuradoAliquota15 * 0.04).toFixed(2));
  const deducaoRouanet = Number(Math.min(valorDoacaoPatrocinioLeiRouanetArt18, limiteRouanet4).toFixed(2));
  const excessoRouanet = Number(Math.max(0, valorDoacaoPatrocinioLeiRouanetArt18 - limiteRouanet4).toFixed(2));

  // Trava Esporte: Máximo 2% do IRPJ devido
  const limiteEsporte2 = Number((irpjDevidoApuradoAliquota15 * 0.02).toFixed(2));
  const deducaoEsporte = Number(Math.min(valorDoacaoPatrocinioLeiDoEsporte, limiteEsporte2).toFixed(2));

  const totalDeducao = Number((deducaoRouanet + deducaoEsporte).toFixed(2));
  const irpjFinal = Number((irpjDevidoApuradoAliquota15 - totalDeducao).toFixed(2));

  const diagnostico = 'Incentivos Culturais/Esportivos aproveitados: R$ ' + totalDeducao.toFixed(2) + ' deduzidos diretamente do IRPJ devido, reduzindo o imposto para R$ ' + irpjFinal.toFixed(2) + '.';

  return Ok({
    anoCalendario,
    deducaoEfetivaRouanet4PercentMax: deducaoRouanet,
    deducaoEfetivaEsporte2PercentMax: deducaoEsporte,
    totalDeducaoIncentivosCulturais: totalDeducao,
    irpjFinalAPagar: irpjFinal,
    excessoNaoAproveitadoRouanet: excessoRouanet,
    diagnosticoFiscal: diagnostico
  });
}
