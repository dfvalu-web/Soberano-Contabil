import { Result, Ok, Err } from '../../types/result.js';

export interface ReidiTaxInput {
  projetoId: string;
  projetoNome: string; // Ex: 'Complexo Eólico & Linha de Transmissão Soberano'
  setorInfraestrutura: 'ENERGIA' | 'SANEAMENTO' | 'RODOVIAS' | 'FERROVIAS' | 'PORTOS';
  anoExercicio: number; // Ex: 2026
  aquisicaoMaquinasEquipamentosBrl: number;
  aquisicaoServicosObrasConstrucaoBrl: number;
  importacaoBensCapitalBrl: number;
}

export interface ReidiTaxResult {
  projetoId: string;
  projetoNome: string;
  setorInfraestrutura: string;
  valorTotalCapexHabilitadoBrl: number;
  suspensaoPis165PercentBrl: number;
  suspensaoCofins760PercentBrl: number;
  totalDesoneracaoReidi925PercentBrl: number;
  economiaFinanceiraLiquidaBrl: number;
  diagnosticoReidi: string;
}

export function processReidiInfrastructureTaxEngine(input: ReidiTaxInput): Result<ReidiTaxResult, Error> {
  const {
    projetoId,
    projetoNome,
    setorInfraestrutura,
    anoExercicio,
    aquisicaoMaquinasEquipamentosBrl,
    aquisicaoServicosObrasConstrucaoBrl,
    importacaoBensCapitalBrl
  } = input;

  const totalCapex = Number((aquisicaoMaquinasEquipamentosBrl + aquisicaoServicosObrasConstrucaoBrl + importacaoBensCapitalBrl).toFixed(2));

  if (totalCapex <= 0) {
    return Err(new Error('Total do investimento em capex deve ser maior que zero.'));
  }

  // Lei nº 11.488/2007 e Decreto nº 6.144/2007:
  // Suspensão de PIS (1,65%) e COFINS (7,60%) = 9,25% sobre aquisições domésticas e importações
  const suspPis = Number((totalCapex * 0.0165).toFixed(2));
  const suspCofins = Number((totalCapex * 0.0760).toFixed(2));
  const totalDesoneracao = Number((suspPis + suspCofins).toFixed(2));

  const diag = "Regime Especial REIDI (Lei 11.488/07): " + projetoNome + " (" + setorInfraestrutura + " - Exercicio " + anoExercicio + "). Capex Habilitado: R$ " + totalCapex.toFixed(2) + " (Maquinas: R$ " + aquisicaoMaquinasEquipamentosBrl.toFixed(2) + ", Servicos: R$ " + aquisicaoServicosObrasConstrucaoBrl.toFixed(2) + ", Importacao: R$ " + importacaoBensCapitalBrl.toFixed(2) + "). Suspensao PIS (1,65%): R$ " + suspPis.toFixed(2) + " | Suspensao COFINS (7,60%): R$ " + suspCofins.toFixed(2) + " = Total Desoneracao REIDI (9,25%): R$ " + totalDesoneracao.toFixed(2) + " convertida em aliquota zero no imobilizado.";

  return Ok({
    projetoId,
    projetoNome,
    setorInfraestrutura,
    valorTotalCapexHabilitadoBrl: totalCapex,
    suspensaoPis165PercentBrl: suspPis,
    suspensaoCofins760PercentBrl: suspCofins,
    totalDesoneracaoReidi925PercentBrl: totalDesoneracao,
    economiaFinanceiraLiquidaBrl: totalDesoneracao,
    diagnosticoReidi: diag
  });
}
