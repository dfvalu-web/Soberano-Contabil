/**
 * SOBERANO CONTÁBIL — CFO DECISION & RESOURCE ALLOCATION TYPES
 * Prescriptive AI Diagnostician, Cross-Referenced Metrics (Accounting + Tax + Payroll), and Capital Allocation.
 */

export type PrescriptiveSeverity = 'POSITIVO' | 'ATENCAO' | 'CRITICO' | 'INFORMATIVO';
export type DiagnosticCategory = 'CAIXA_LIQUIDEZ' | 'EFICIENCIA_OPERACIONAL' | 'TRIBUTARIO_FISCAL' | 'ESTRATEGIA_DIVIDA' | 'FOLHA_PESSOAL';

export interface PrescriptiveDiagnostic {
  id: string;
  categoria: DiagnosticCategory;
  severidade: PrescriptiveSeverity;
  titulo: string;
  parecerTexto: string;
  impactoFinanceiroEstimado: number;
  recomendacaoAcao: string;
  prioridade: number; // 1 (mais urgente) a 5
}

export interface CrossReferencedMetrics {
  receitaBruta: number;
  receitaLiquida: number;
  ebitda: number;
  lucroLiquido: number;
  
  // Departamento Pessoal & Folha
  massaSalarialTotal: number;
  encargosFolhaTotal: number;
  headcount: number;
  custoPerCapitaMensal: number;
  fatorRPercent: number;
  isFatorRSuficienteAnexoIII: boolean;
  
  // Fiscal & Tributário
  economiaMonofasicaTotal: number;
  creditosTributariosApurados: number;
  regimeTributario: string;

  // Fluxo de Caixa Livre
  fluxoCaixaOperacionalFco: number;
  capexPeriodo: number;
  variacaoNcg: number;
  freeCashFlowFirmFCFF: number; // Fluxo de Caixa Livre da Empresa
  freeCashFlowEquityFCFE: number; // Fluxo de Caixa Livre do Acionista
}

export interface CreditCapacityLimit {
  ebitdaAnual: number;
  dividaTotalAtual: number;
  caixaAtual: number;
  dividaLiquidaAtual: number;
  alavancagemAtualDividaEbitda: number;
  
  /** Multiplicador prudencial padrão CVM / Mercado (ex: 2.5x EBITDA) */
  limiteMaximoAlavancagemMultiplicador: number;
  /** Teto máximo de endividamento bruto seguro */
  capacidadeTotalEndividamento: number;
  /** Capacidade adicional de tomada de crédito seguro (sem estrangular liquidez) */
  capacidadeAdicionalCreditoSaudavel: number;
  /** Índice de Cobertura do Serviço da Dívida (ICSD / DSCR) */
  dscrProjetado: number;
  
  statusCredito: 'APTO_A_EXPANSAO' | 'MODERADO' | 'LIMITE_ATINGIDO' | 'DESALAVANCAR_URGENTE';
  parecerCredito: string;
}

export interface CapitalAllocationPlan {
  freeCashFlowDisponivel: number;
  
  // Reservas e Alocações
  reservaOperacionalMinima: number;
  reservaOperacionalPercent: number;
  
  reinvestimentoExpansaoCapex: number;
  reinvestimentoExpansaoPercent: number;
  
  distribuicaoDividendosIsentos: number;
  distribuicaoDividendosPercent: number;
  
  amortizacaoDivida: number;
  amortizacaoDividaPercent: number;
  
  parecerAlocacao: string;
}

export interface CfoDecisionReport {
  crossMetrics: CrossReferencedMetrics;
  creditCapacity: CreditCapacityLimit;
  allocationPlan: CapitalAllocationPlan;
  diagnostics: PrescriptiveDiagnostic[];
  dataEmissao: string;
}
