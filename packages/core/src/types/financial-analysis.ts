/**
 * SOBERANO CONTÁBIL — FINANCIAL STATEMENT ANALYSIS & CFO ENGINE
 * Standard Financial Ratios, 5-Stage DuPont Decomposition, Solvency (Altman & Kanitz), and Working Capital Models.
 */

export type HealthStatus = 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO';

export interface LiquidityRatios {
  /** Liquidez Corrente = Ativo Circulante / Passivo Circulante */
  liquidezCorrente: number;
  /** Liquidez Seca = (Ativo Circulante - Estoques) / Passivo Circulante */
  liquidezSeca: number;
  /** Liquidez Imediata = Disponibilidades / Passivo Circulante */
  liquidezImediata: number;
  /** Liquidez Geral = (Ativo Circulante + RLP) / (Passivo Circulante + PNC) */
  liquidezGeral: number;
  /** Semáforo geral do bloco de liquidez */
  status: HealthStatus;
  /** Diagnóstico textual do perfil de liquidez */
  diagnostico: string;
}

export interface ProfitabilityRatios {
  receitaBruta: number;
  deducoesReceita: number;
  receitaLiquida: number;
  lucroBruto: number;
  ebitda: number;
  lucroOperacionalEbit: number;
  despesasFinanceirasLiquidas: number;
  lucroAntesImpostosEbt: number;
  impostosSobreLucro: number;
  lucroLiquido: number;
  
  /** Margem Bruta = (Lucro Bruto / Receita Líquida) * 100 */
  margemBrutaPercent: number;
  /** Margem EBITDA = (EBITDA / Receita Líquida) * 100 */
  margemEbitdaPercent: number;
  /** Margem Operacional = (EBIT / Receita Líquida) * 100 */
  margemOperacionalPercent: number;
  /** Margem Líquida = (Lucro Líquido / Receita Líquida) * 100 */
  margemLiquidaPercent: number;
  /** Return on Equity (ROE) = (Lucro Líquido / Patrimônio Líquido) * 100 */
  roePercent: number;
  /** Return on Assets (ROA) = (Lucro Líquido / Ativo Total) * 100 */
  roaPercent: number;
  /** Return on Invested Capital (ROIC) = (NOPAT / Capital Investido) * 100 */
  roicPercent: number;
  /** Semáforo geral do bloco de rentabilidade */
  status: HealthStatus;
  /** Diagnóstico textual da rentabilidade */
  diagnostico: string;
}

export interface DuPont5StageDecomposition {
  /** 1. Carga Tributária (Tax Burden) = Lucro Líquido / EBT */
  taxBurden: number;
  /** 2. Efeito Juros (Interest Burden) = EBT / EBIT */
  interestBurden: number;
  /** 3. Margem Operacional (EBIT Margin) = EBIT / Receita Líquida */
  ebitMargin: number;
  /** 4. Giro do Ativo (Asset Turnover) = Receita Líquida / Ativo Total */
  assetTurnover: number;
  /** 5. Multiplicador de Alavancagem (Equity Multiplier) = Ativo Total / Patrimônio Líquido */
  equityMultiplier: number;
  
  /** ROE calculado pelo produto dos 5 estágios: TB * IB * EM * AT * EM */
  roeCalculadoDuPont: number;
  /** ROE direto = Lucro Líquido / Patrimônio Líquido */
  roeDireto: number;
  /** Discrepância matemática absoluta */
  discrepancia: number;
  /** Flag de identidade verificada (discrepancia < 0.0001) */
  isIdentidadeVerificada: boolean;
  /** Alerta de Patrimônio Líquido Negativo (Passivo a Descoberto) */
  isPassivoADescoberto: boolean;
  /** Análise textual dos vetores de valor e alavancagem */
  interpretacao: string;
}

export interface SolvencyAndCreditRisk {
  /** Grau de Endividamento Geral = (Passivo Exigível Total / Ativo Total) * 100 */
  endividamentoGeralPercent: number;
  /** Composição do Endividamento Curto Prazo = (Passivo Circulante / Passivo Exigível Total) * 100 */
  composicaoEndividamentoCurtoPrazoPercent: number;
  /** Cobertura de Juros = EBIT / Despesas Financeiras Líquidas */
  coberturaJuros: number;
  passivoExigivelTotal: number;
  passivoCirculante: number;
  passivoNaoCirculante: number;
  patrimonioLiquido: number;
  ativoTotal: number;

  /** Termômetro de Solvência Altman Z''-Score para Mercados Emergentes / Brasil */
  altmanZScore: {
    x1CapitalGiroSobreAtivo: number;
    x2LucrosRetidosSobreAtivo: number;
    x3EbitSobreAtivo: number;
    x4PlSobrePassivoTotal: number;
    x5VendasSobreAtivo: number;
    zScoreValue: number;
    zScoreBrasilEmergingValue: number;
    status: 'ZONA_SEGURA' | 'ZONA_ALERTA' | 'ZONA_PERIGO';
    descricao: string;
  };

  /** Termômetro de Stephen Kanitz */
  kanitzTermometro: {
    x1RentabilidadePl: number;
    x2LiquidezGeral: number;
    x3LiquidezSeca: number;
    x4GrauEndividamento: number;
    x5EndividamentoCurtoPrazo: number;
    fatorInsolvencia: number;
    status: 'SOLVENTE' | 'PENUMBRA' | 'INSOLVENTE';
    descricao: string;
  };

  /** Semáforo consolidado de solvência */
  status: HealthStatus;
  diagnostico: string;
}

export interface WorkingCapitalAndCycles {
  /** Prazo Médio de Estocagem (PME) em dias = (Estoque Médio / CPV) * 360 */
  prazoMedioEstocagemPme: number;
  /** Prazo Médio de Recebimento de Vendas (PMRV) em dias = (Contas a Receber Médio / Receita Bruta) * 360 */
  prazoMedioRecebimentoPmrv: number;
  /** Prazo Médio de Pagamento a Fornecedores (PMPF) em dias = (Fornecedores Médio / Compras ou CPV) * 360 */
  prazoMedioPagamentoPmpf: number;
  
  /** Ciclo Operacional (dias) = PME + PMRV */
  cicloOperacionalDias: number;
  /** Ciclo de Caixa / Financeiro (dias) = PME + PMRV - PMPF */
  cicloCaixaFinanceiroDias: number;

  /** Ativo Circulante Operacional (Cíclico) = AC - Caixa/Equivalentes */
  ativoCirculanteOperacional: number;
  /** Passivo Circulante Operacional (Cíclico) = PC - Dívidas/Financiamentos CP */
  passivoCirculanteOperacional: number;
  /** Necessidade de Capital de Giro (NCG) = ACO - PCO */
  necessidadeCapitalGiroNcg: number;
  /** Capital de Giro Líquido / Capital Circulante Próprio (CDG) = AC - PC (ou PL + PNC - ANC) */
  capitalGiroLiquidoCdg: number;
  /** Saldo de Tesouraria (ST) = CDG - NCG (ou Ativo Financeiro - Passivo Financeiro) */
  saldoTesouraria: number;
  /** Efeito Tesoura: ST negativo com NCG crescente */
  efeitoTesouraDetectado: boolean;
  /** Classificação Fleuriet (Tipos 1 a 6) */
  classificacaoFleuriet: {
    tipo: number;
    nome: string;
    situacao: string;
    recomendacao: string;
  };

  status: HealthStatus;
  diagnostico: string;
}

export interface CompleteFinancialAnalysisReport {
  tenantId: string;
  empresa: string;
  cnpj: string;
  periodo: string;
  dataCalculo: string;
  scoreGeralSaude: number; // 0 a 100
  statusGeral: HealthStatus;
  
  liquidity: LiquidityRatios;
  profitability: ProfitabilityRatios;
  duPont: DuPont5StageDecomposition;
  solvency: SolvencyAndCreditRisk;
  workingCapital: WorkingCapitalAndCycles;
  
  resumoExecutivo: string[];
}
