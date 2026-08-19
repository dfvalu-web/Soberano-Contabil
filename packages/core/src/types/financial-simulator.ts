/**
 * SOBERANO CONTÁBIL — FINANCIAL SIMULATOR & WHAT-IF ENGINE TYPES
 * Expansion Scenarios, Multi-Level Break-Even, NPV, IRR, and Simple/Discounted Payback.
 */

export type ExpansionProjectType = 'NOVA_FILIAL' | 'CONTRATACAO_EQUIPE' | 'NOVA_MAQUINA_TECNOLOGIA' | 'CUSTOMIZADO';

export interface ExpansionScenarioInput {
  tipoProjeto: ExpansionProjectType;
  nomeProjeto: string;
  
  /** Investimento Inicial em Bens de Capital / Estrutura (CAPEX) */
  investimentoInicialCapex: number;
  /** Receita Bruta / Líquida Adicional Estimada por Mês */
  receitaIncrementalMensal: number;
  /** Custos e Despesas Variáveis em % sobre a Receita Incremental (ex: 40%) */
  custoVariavelPercent: number;
  /** Custos e Despesas Fixas Adicionais Desembolsáveis por Mês (ex: aluguel, equipe) */
  custoFixoIncrementalMensal: number;
  /** Depreciação / Amortização Contábil Mensal dos Ativos Adquiridos */
  depreciacaoMensal: number;
  /** Horizonte de Análise do Projeto em Meses (ex: 24, 36, 60 meses) */
  vidaUtilMeses: number;
  /** Taxa Mínima de Atratividade (TMA / WACC) Anual em % (ex: 12% a.a.) */
  taxaMinimaAtratividadeTmaAnual: number;
  /** Alíquota Efetiva de Tributos sobre o Lucro Incremental (ex: 15% ou 34%) */
  aliquotaImpostosPercent?: number;
}

export interface BreakEvenAnalysisResult {
  /** Margem de Contribuição em % (1 - Custo Variável %) */
  margemContribuicaoPercent: number;
  /** Margem de Contribuição em R$ por período */
  margemContribuicaoValor: number;
  
  /** Ponto de Equilíbrio Contábil (PEC) = Custos Fixos Totais / MC% */
  pontoEquilibrioContabilMensal: number;
  /** Ponto de Equilíbrio Financeiro (PEF) = (Custos Fixos - Depreciação) / MC% */
  pontoEquilibrioFinanceiroMensal: number;
  /** Ponto de Equilíbrio Econômico (PEE) = (Custos Fixos + Custo Oportunidade Mensal do CAPEX) / MC% */
  pontoEquilibrioEconomicoMensal: number;
  
  /** Receita Projetada Mensal */
  receitaProjetadaMensal: number;
  /** Margem de Segurança Operacional = ((Receita Projetada - PEC) / Receita Projetada) * 100 */
  margemSegurancaOperacionalPercent: number;
  /** Grau de Alavancagem Operacional (GAO) = Margem Contribuição / Lucro Operacional */
  grauAlavancagemOperacionalGao: number;
}

export interface MonthlyCashFlowProjection {
  mes: number;
  receita: number;
  custosVariaveis: number;
  custosFixos: number;
  depreciacao: number;
  lucroOperacional: number;
  impostos: number;
  fluxoCaixaLiquido: number;
  fluxoDescontado: number;
  fluxoAcumulado: number;
  fluxoAcumuladoDescontado: number;
}

export interface CapitalBudgetingResult {
  fluxosMensais: MonthlyCashFlowProjection[];
  
  /** Valor Presente Líquido (VPL / NPV) */
  vpl: number;
  /** Taxa Interna de Retorno (TIR / IRR) Anual em % */
  tirPercentAnual: number;
  /** Taxa Interna de Retorno (TIR / IRR) Mensal em % */
  tirPercentMensal: number;
  /** Payback Simples em Meses (com interpolação linear) */
  paybackSimplesMeses: number;
  /** Payback Descontado em Meses (com interpolação linear) */
  paybackDescontadoMeses: number;
  /** Índice de Lucratividade (IL) = (VPL + CAPEX) / CAPEX */
  indiceLucratividadeIl: number;
  
  statusViabilidade: 'ALTAMENTE_VIAVEL' | 'VIAVEL_COM_RESSALVAS' | 'INVIAVEL';
  parecerViabilidade: string;
}

export interface CompleteSimulationResult {
  cenario: ExpansionScenarioInput;
  breakEven: BreakEvenAnalysisResult;
  capitalBudgeting: CapitalBudgetingResult;
  dataSimulacao: string;
}
