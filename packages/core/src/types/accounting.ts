export type AccountNature = 'DEBIT' | 'CREDIT';
export type AccountType = 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO' | 'RECEITA' | 'CUSTO' | 'DESPESA';

export interface Account {
  id: string;
  tenantId: string;
  codigo: string; // e.g. "1.1.01.01.001"
  codigoReduzido: number;
  nome: string;
  natureza: AccountNature;
  tipo: AccountType;
  nivel: number;
  isAnalitica: boolean; // analítica aceita lançamentos; sintética apenas soma
  codigoContaReferencialRfb?: string;
  saldoAtual: number;
}

export interface JournalEntryLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  historicoComplementar?: string;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  numeroLancamento: number;
  data: string; // YYYY-MM-DD
  historicoPadrao: string;
  linhas: JournalEntryLine[];
  totalDebito: number;
  totalCredito: number;
  documentoOrigem?: {
    tipo: 'NFE' | 'NFCE' | 'CTE' | 'NFSE' | 'OFX' | 'FOLHA' | 'MANUAL';
    numeroChave?: string;
  };
  criadoEm: Date;
  hashTransacao: string; // Hash SHA-256 encadeado
}

export interface FinancialStatementLine {
  codigo: string;
  descricao: string;
  nivel: number;
  valorPeriodoAtual: number;
  valorPeriodoAnterior?: number;
  isDestaque?: boolean;
}

export interface BalanceSheet {
  dataFechamento: string;
  ativoCirculante: FinancialStatementLine[];
  ativoNaoCirculante: FinancialStatementLine[];
  totalAtivo: number;
  
  passivoCirculante: FinancialStatementLine[];
  passivoNaoCirculante: FinancialStatementLine[];
  patrimonioLiquido: FinancialStatementLine[];
  totalPassivoEPatrimonioLiquido: number;
  
  isEquilibrado: boolean;
  diferenca: number;
}

export interface IncomeStatement {
  periodoInicio: string;
  periodoFim: string;
  linhas: FinancialStatementLine[];
  receitaBruta: number;
  deducoesReceita: number;
  receitaLiquida: number;
  custosOperacionais: number;
  lucroBruto: number;
  despesasOperacionais: number;
  resultadoOperacional: number;
  provisaoIrpjCsll: number;
  lucroLiquidoExercicio: number;
}
