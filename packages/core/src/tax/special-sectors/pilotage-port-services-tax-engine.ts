import { Result, Ok, Err } from '../../types/result.js';

export interface PilotagePortTaxInput {
  servicoId: string;
  empresaPraticagemNome: string; // Ex: 'Soberano Praticagem da Barra & Rebocadores S.A.'
  portoNome: string; // Ex: 'Porto de Santos / Rio Grande'
  competencia: string; // Ex: '2026-04'
  receitaServicosPraticagemBrl: number;
  receitaServicosRebocadoresBrl: number;
  valorCapataziaPortuariaImportacaoBrl: number; // Para teste de exclusão STJ 1014
  aliquotaIssqnPraticagemPercent?: number; // Padrão 5% no município do porto (Item 20.01)
}

export interface PilotagePortTaxResult {
  servicoId: string;
  empresaPraticagemNome: string;
  portoNome: string;
  competencia: string;
  receitaTotalServicosPortuariosBrl: number;
  issqnDevidoMunicipioPorto5PercentBrl: number; // 5%
  pisCofinsFaturamento925PercentBrl: number; // 9,25%
  economiaExclusaoCapataziaStj1014Brl: number; // Economia de PIS/COFINS/ICMS s/ capatazia
  totalTributosDevidosBrl: number;
  diagnosticoPraticagem: string;
}

export function processPilotagePortServicesTaxEngine(input: PilotagePortTaxInput): Result<PilotagePortTaxResult, Error> {
  const {
    servicoId,
    empresaPraticagemNome,
    portoNome,
    competencia,
    receitaServicosPraticagemBrl,
    receitaServicosRebocadoresBrl,
    valorCapataziaPortuariaImportacaoBrl,
    aliquotaIssqnPraticagemPercent = 5.0
  } = input;

  if (receitaServicosPraticagemBrl <= 0) {
    return Err(new Error('Receita de serviços de praticagem deve ser superior a zero.'));
  }

  // LC 116/2003 Item 20.01 e STJ Tema Repetitivo 1014:
  // 1. ISSQN sobre Praticagem e Rebocadores devido ao município onde o porto está situado
  const receitaTotal = Number((receitaServicosPraticagemBrl + receitaServicosRebocadoresBrl).toFixed(2));
  const issqn = Number((receitaTotal * (aliquotaIssqnPraticagemPercent / 100)).toFixed(2));

  // 2. PIS (1,65%) e COFINS (7,60%) = 9,25%
  const pisCofins = Number((receitaTotal * 0.0925).toFixed(2));

  // 3. Exclusão da Capatazia da Base de Cálculo de Importação (STJ Tema 1014):
  // Desoneração de PIS/COFINS-Importação (9,65%) e ICMS (18%) sobre a capatazia pós-desembarque
  const economiaCapatazia = Number((valorCapataziaPortuariaImportacaoBrl * (0.0965 + 0.18)).toFixed(2));

  const totalTributos = Number((issqn + pisCofins).toFixed(2));

  const diag = "Servicos de Praticagem Portuaria (LC 116/03 & STJ 1014): " + empresaPraticagemNome + " (" + portoNome + " - " + competencia + "). Receita Total: R$ " + receitaTotal.toFixed(2) + " (Praticagem: R$ " + receitaServicosPraticagemBrl.toFixed(2) + " + Rebocadores: R$ " + receitaServicosRebocadoresBrl.toFixed(2) + "). ISSQN Porto (5%): R$ " + issqn.toFixed(2) + " | PIS/COFINS (9,25%): R$ " + pisCofins.toFixed(2) + " = Total Tributos: R$ " + totalTributos.toFixed(2) + " (Economia Exclusao Capatazia STJ 1014: R$ " + economiaCapatazia.toFixed(2) + ").";

  return Ok({
    servicoId,
    empresaPraticagemNome,
    portoNome,
    competencia,
    receitaTotalServicosPortuariosBrl: receitaTotal,
    issqnDevidoMunicipioPorto5PercentBrl: issqn,
    pisCofinsFaturamento925PercentBrl: pisCofins,
    economiaExclusaoCapataziaStj1014Brl: economiaCapatazia,
    totalTributosDevidosBrl: totalTributos,
    diagnosticoPraticagem: diag
  });
}
