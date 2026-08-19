import { Result, Ok, Err } from '../types/result.js';

export interface PortfolioHealthInput {
  escritorioNome: string;
  competenciaMesAno: string;
  totalClientesCarteiraCount: number;
  totalClientesFechadosCount: number;
  totalPendenciasCriticasCount: number;
}

export interface PortfolioHealthResult {
  escritorioNome: string;
  competenciaMesAno: string;
  indiceProdutividadeEquipePercent: number;
  nivelRiscoOperacional: 'BAIXO_RISCO' | 'MEDIO_RISCO' | 'ALTO_RISCO_GARGALO';
  slaCumprimentoStatus: 'DENTRO_DO_PRAZO_REGULAR' | 'ATENCAO_PRAZO_LIMITE';
  statusKpi: 'KPIS_SAUDE_CARTEIRA_CALCULADOS';
  diagnosticoKpi: string;
}

export function processOfficePortfolioHealthKpiEngine(input: PortfolioHealthInput): Result<PortfolioHealthResult, Error> {
  const {
    escritorioNome,
    competenciaMesAno,
    totalClientesCarteiraCount,
    totalClientesFechadosCount,
    totalPendenciasCriticasCount
  } = input;

  if (!escritorioNome || totalClientesCarteiraCount <= 0) {
    return Err(new Error('Nome do escritório e total de clientes são obrigatórios.'));
  }

  const taxaFechamento = (totalClientesFechadosCount / totalClientesCarteiraCount) * 100;

  let risco: 'BAIXO_RISCO' | 'MEDIO_RISCO' | 'ALTO_RISCO_GARGALO' = 'BAIXO_RISCO';
  let sla: 'DENTRO_DO_PRAZO_REGULAR' | 'ATENCAO_PRAZO_LIMITE' = 'DENTRO_DO_PRAZO_REGULAR';

  if (totalPendenciasCriticasCount > (totalClientesCarteiraCount * 0.2)) {
    risco = 'ALTO_RISCO_GARGALO';
    sla = 'ATENCAO_PRAZO_LIMITE';
  } else if (taxaFechamento < 50) {
    risco = 'MEDIO_RISCO';
  }

  const diag = "Saúde da Carteira (" + escritorioNome + " - " + competenciaMesAno + "): Produtividade: " + taxaFechamento.toFixed(1) + "% | Risco Operacional: " + risco + " | SLA: " + sla + ".";

  return Ok({
    escritorioNome,
    competenciaMesAno,
    indiceProdutividadeEquipePercent: parseFloat(taxaFechamento.toFixed(2)),
    nivelRiscoOperacional: risco,
    slaCumprimentoStatus: sla,
    statusKpi: 'KPIS_SAUDE_CARTEIRA_CALCULADOS',
    diagnosticoKpi: diag
  });
}
