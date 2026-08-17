import { Result, Ok, Err } from '../../types/result.js';

export interface BorrowingCostsInput {
  projetoId: string;
  descricaoAtivoQualificavel: string; // Ex: 'Construção de Nova Fábrica de Biocombustíveis'
  desembolsoMedioPeriodoBrl: number; // Ex: R$ 10.000.000,00
  financiamentoEspecificoBrl: number; // Ex: R$ 6.000.000,00 a 12% a.a.
  taxaJurosEspecificoPercent: number; // 12%
  financiamentoGeralBrl: number; // Ex: R$ 4.000.000,00 da dívida corporativa
  taxaMediaPonderadaGeralPercent: number; // 14.5% a.a.
  receitaFinanceiraAplicacaoTemporariaBrl?: number; // Ex: R$ 50.000,00
}

export interface BorrowingCostsResult {
  projetoId: string;
  descricaoAtivoQualificavel: string;
  jurosEspecificosCapitalizadosBrl: number;
  jurosGeraisCapitalizadosBrl: number;
  totalJurosCapitalizadosImobilizadoBrl: number;
  statusElegibilidadeCpc20: 'ATIVO_QUALIFICAVEL_CAPITALIZACAO_ATIVA';
  lancamentoContabilSugerido: {
    debitoImobilizadoEmAndamentoBrl: number;
    creditoJurosFinanciamentoPassivoBrl: number;
    creditoReceitaFinanceiraDiferidaBrl: number;
  };
  diagnosticoCpc20: string;
}

export function processQualifyingAssetsBorrowingCostsCpc20(input: BorrowingCostsInput): Result<BorrowingCostsResult, Error> {
  const {
    projetoId,
    descricaoAtivoQualificavel,
    desembolsoMedioPeriodoBrl,
    financiamentoEspecificoBrl,
    taxaJurosEspecificoPercent,
    financiamentoGeralBrl,
    taxaMediaPonderadaGeralPercent,
    receitaFinanceiraAplicacaoTemporariaBrl = 0
  } = input;

  if (desembolsoMedioPeriodoBrl <= 0 || taxaJurosEspecificoPercent < 0 || taxaMediaPonderadaGeralPercent < 0) {
    return Err(new Error('Desembolso e taxas de juros devem ser positivos.'));
  }

  // 1. Juros de Financiamento Específico: Juros Brutos - Rendimento de Aplicações Temporárias
  const jurosEspecificosBrutos = financiamentoEspecificoBrl * (taxaJurosEspecificoPercent / 100);
  const jurosEspecificosLiquidos = Math.max(0, jurosEspecificosBrutos - receitaFinanceiraAplicacaoTemporariaBrl);

  // 2. Juros de Financiamento Geral: Recursos Gerais * Taxa Média Ponderada
  const jurosGerais = financiamentoGeralBrl * (taxaMediaPonderadaGeralPercent / 100);

  const totalCapitalizado = Number((jurosEspecificosLiquidos + jurosGerais).toFixed(2));

  const diag = "Capitalizacao de Juros (CPC 20 / IAS 23): Projeto " + projetoId + " (" + descricaoAtivoQualificavel + ") | Desembolso: R$ " + desembolsoMedioPeriodoBrl.toFixed(2) + " -> Juros Especificos: R$ " + jurosEspecificosLiquidos.toFixed(2) + " (deduzido de R$ " + receitaFinanceiraAplicacaoTemporariaBrl.toFixed(2) + " aplic.) | Juros Gerais (WACC " + taxaMediaPonderadaGeralPercent + "%): R$ " + jurosGerais.toFixed(2) + " -> Total Ativado no Capex: R$ " + totalCapitalizado.toFixed(2) + ".";

  return Ok({
    projetoId,
    descricaoAtivoQualificavel,
    jurosEspecificosCapitalizadosBrl: Number(jurosEspecificosLiquidos.toFixed(2)),
    jurosGeraisCapitalizadosBrl: Number(jurosGerais.toFixed(2)),
    totalJurosCapitalizadosImobilizadoBrl: totalCapitalizado,
    statusElegibilidadeCpc20: 'ATIVO_QUALIFICAVEL_CAPITALIZACAO_ATIVA',
    lancamentoContabilSugerido: {
      debitoImobilizadoEmAndamentoBrl: totalCapitalizado,
      creditoJurosFinanciamentoPassivoBrl: Number((jurosEspecificosBrutos + jurosGerais).toFixed(2)),
      creditoReceitaFinanceiraDiferidaBrl: receitaFinanceiraAplicacaoTemporariaBrl
    },
    diagnosticoCpc20: diag
  });
}
