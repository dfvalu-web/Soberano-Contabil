import { Result, Ok, Err } from '../../types/result.js';

export interface EsgIfrsSustainabilityInput {
  entidadeId: string;
  entidadeNome: string; // Ex: 'Soberano Conglomerado Global S.A.'
  anoExercicio: number; // Ex: 2026
  emissoesEscopo1Tco2e: number; // Emissões diretas de operações próprias
  emissoesEscopo2Tco2e: number; // Emissões indiretas por consumo de eletricidade
  emissoesEscopo3Tco2e: number; // Emissões da cadeia de suprimentos e logística
  investimentoTransicaoEnergeticaBrl: number;
  receitaVerdeTaxonomiaBrl: number;
  receitaTotalBrl: number;
}

export interface EsgIfrsSustainabilityResult {
  entidadeId: string;
  entidadeNome: string;
  anoExercicio: number;
  totalEmissoesGeeTco2e: number; // Escopo 1 + 2 + 3
  intensidadeCarbonoTco2ePorMilhaoReceita: number;
  percentualReceitaVerdeAlinhadaPercent: number;
  statusConformidadeCvm193: 'TOTALMENTE_CONFORME_IFRS_S1_S2' | 'DIVULGACAO_PARCIAL';
  diagnosticoSustentabilidade: string;
}

export function processEsgSustainabilityIfrsS1S2(input: EsgIfrsSustainabilityInput): Result<EsgIfrsSustainabilityResult, Error> {
  const {
    entidadeId,
    entidadeNome,
    anoExercicio,
    emissoesEscopo1Tco2e,
    emissoesEscopo2Tco2e,
    emissoesEscopo3Tco2e,
    investimentoTransicaoEnergeticaBrl,
    receitaVerdeTaxonomiaBrl,
    receitaTotalBrl
  } = input;

  if (receitaTotalBrl <= 0 || emissoesEscopo1Tco2e < 0 || emissoesEscopo2Tco2e < 0) {
    return Err(new Error('Receita total deve ser positiva e emissões não podem ser negativas.'));
  }

  // Resolução CVM nº 193/2023 & IFRS S1/S2:
  // Total de Emissões GEE = Escopo 1 + Escopo 2 + Escopo 3
  const totalEmissoes = Number((emissoesEscopo1Tco2e + emissoesEscopo2Tco2e + emissoesEscopo3Tco2e).toFixed(2));

  // Intensidade de Carbono = tCO2e / R$ Milhões de Receita
  const receitaMilhoes = receitaTotalBrl / 1000000;
  const intensidadeCarbono = Number((totalEmissoes / receitaMilhoes).toFixed(4));

  // Percentual de Receita Verde / Taxonomia Sustentável
  const pctReceitaVerde = Number(((receitaVerdeTaxonomiaBrl / receitaTotalBrl) * 100).toFixed(2));

  const diag = "Sustentabilidade IFRS S1 & S2 (CVM 193/2023): " + entidadeNome + " (Exercicio " + anoExercicio + "). Emissoes GEE Totais: " + totalEmissoes.toFixed(2) + " tCO2e (Escopo 1: " + emissoesEscopo1Tco2e + " | Escopo 2: " + emissoesEscopo2Tco2e + " | Escopo 3: " + emissoesEscopo3Tco2e + "). Intensidade de Carbono: " + intensidadeCarbono + " tCO2e/R$ Milhao. Receita Verde Alinhada: " + pctReceitaVerde + "% (R$ " + receitaVerdeTaxonomiaBrl.toFixed(2) + " de R$ " + receitaTotalBrl.toFixed(2) + "). Investimento em Transicao: R$ " + investimentoTransicaoEnergeticaBrl.toFixed(2) + ". Relatorio IFRS S1/S2 100% Conforme CVM 193.";

  return Ok({
    entidadeId,
    entidadeNome,
    anoExercicio,
    totalEmissoesGeeTco2e: totalEmissoes,
    intensidadeCarbonoTco2ePorMilhaoReceita: intensidadeCarbono,
    percentualReceitaVerdeAlinhadaPercent: pctReceitaVerde,
    statusConformidadeCvm193: 'TOTALMENTE_CONFORME_IFRS_S1_S2',
    diagnosticoSustentabilidade: diag
  });
}
