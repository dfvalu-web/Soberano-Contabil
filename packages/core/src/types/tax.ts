export type SimplesAnexo = 'ANEXO_I' | 'ANEXO_II' | 'ANEXO_III' | 'ANEXO_IV' | 'ANEXO_V';

export interface SimplesBracket {
  faixa: number;
  limiteSuperior: number;
  aliquotaNominal: number; // e.g. 0.04 (4%)
  parcelaADeduzir: number;
  percentuais: {
    irpj: number;
    csll: number;
    cofins: number;
    pis: number;
    cpp: number;
    icms: number;
    iss: number;
  };
}

export interface SimplesCalculationInput {
  rbt12: number; // Receita Bruta acumulada nos últimos 12 meses
  receitaMes: number; // Receita do mês corrente
  anexo: SimplesAnexo;
  folha12Meses?: number; // Para cálculo do Fator R
  receitaMonofasica?: number; // Dedução PIS/COFINS monofásico
  receitaStIcms?: number; // Dedução ICMS ST
  isSublimiteEstadualUltrapassado?: boolean;
}

export interface SimplesCalculationResult {
  rbt12: number;
  faixa: number;
  aliquotaNominal: number;
  parcelaADeduzir: number;
  aliquotaEfetiva: number;
  fatorR?: number;
  anexoAplicado: SimplesAnexo;
  valorDevidoTotal: number;
  segregacao: {
    irpj: number;
    csll: number;
    cofins: number;
    pis: number;
    cpp: number;
    icms: number;
    iss: number;
  };
  icmsSegregadoForaDas?: number;
  issSegregadoForaDas?: number;
}

export interface LucroPresumidoInput {
  trimestre: 1 | 2 | 3 | 4;
  ano: number;
  receitaComercio: number; // presunção 8%
  receitaIndustria: number; // presunção 8%
  receitaServicosGerais: number; // presunção 32%
  receitaServicosHospitalares: number; // presunção 8%
  receitaTransportes: number; // presunção 16%
  outrasReceitas: number; // 100% tributável (ganhos de capital, rendimentos financeiros)
  retencoesFonteSofridas: {
    irrf: number;
    csrf: number; // PIS + COFINS + CSLL
    csll: number;
    inss: number;
    iss: number;
  };
}

export interface LucroPresumidoResult {
  trimestre: 1 | 2 | 3 | 4;
  ano: number;
  basePresumidaIrpj: number;
  irpjBase15: number;
  adicionalIrpj10: number;
  irpjTotalDevido: number;
  irpjRetidoFonte: number;
  irpjAPagar: number;
  
  basePresumidaCsll: number;
  csllTotalDevida: number;
  csllRetidaFonte: number;
  csllAPagar: number;
  
  pisCumulativoMensal: number; // 0.65%
  cofinsCumulativoMensal: number; // 3.00%
  csrfRetidaCompensavel: number;
  
  totalTributosFederaisAPagar: number;
}

export interface LucroRealInput {
  periodo: string; // e.g. '2026-Q1' ou '2026-03'
  lucroLiquidoAntesIrpjCsll: number;
  adicoesParteA: Array<{ descricao: string; valor: number }>;
  exclusoesParteA: Array<{ descricao: string; valor: number }>;
  saldoPrejuizoFiscalAnteriorParteB: number;
  saldoBaseNegativaCsllAnteriorParteB: number;
  receitaBrutaNaoCumulativaPisCofins: number;
  creditosInsumosEnergiaDepreciacao: number;
  retencoesFonteCompensaveis: {
    irrf: number;
    csll: number;
    pis: number;
    cofins: number;
  };
}

export interface LucroRealResult {
  lucroLiquidoContabil: number;
  totalAdicoes: number;
  totalExclusoes: number;
  lucroRealAntesCompensacao: number;
  compensacaoPrejuizoFiscal30Percent: number;
  saldoPrejuizoFiscalRemanescenteParteB: number;
  lucroRealFinalTributavel: number;
  irpj15: number;
  adicionalIrpj10: number;
  irpjDevido: number;
  irpjAPagar: number;

  baseCsllAntesCompensacao: number;
  compensacaoBaseNegativa30Percent: number;
  saldoBaseNegativaRemanescenteParteB: number;
  baseCsllFinalTributavel: number;
  csll9: number;
  csllAPagar: number;

  pisNaoCumulativoDebito: number; // 1.65%
  pisNaoCumulativoCredito: number;
  pisAPagar: number;

  cofinsNaoCumulativoDebito: number; // 7.60%
  cofinsNaoCumulativoCredito: number;
  cofinsAPagar: number;

  totalTributosFederaisDevidos: number;
}

export interface ReformaTributariaInput {
  anoSimulacao: number; // 2026 a 2033
  valorOperacao: number;
  ufOrigem: string;
  ufDestino: string;
  municipioDestinoIbge: string;
  tipoItem: 'MERCADORIA' | 'SERVICO' | 'BEM_CAPITAL';
  isRegimeDiferenciadoSaudeEducacao: boolean; // 60% de redução
  isCestaBasicaNacional: boolean; // Alíquota zero
  isImpostoSeletivoIncidente: boolean; // Cigarros, bebidas, combustíveis fósseis
  aliquotaImpostoSeletivoPercent?: number;
  
  // Dados para comparação do modelo legado
  regimeLegado: TaxRegime;
  aliquotaIcmsOrigem?: number;
  aliquotaIcmsDestino?: number;
  aliquotaIssLocal?: number;
}

export interface ReformaTributariaResult {
  anoSimulacao: number;
  valorBase: number;
  
  // Modelo Novo (Reforma EC 132/2023)
  novoModelo: {
    aliquotaCbsEfetiva: number;
    valorCbs: number;
    aliquotaIbsEfetiva: number;
    valorIbs: number;
    aliquotaImpostoSeletivo: number;
    valorImpostoSeletivo: number;
    totalTributosNovos: number;
    splitPaymentEstimado: {
      valorLiquidoFornecedor: number;
      retencaoTributariaAutomatica: number;
    };
  };

  // Modelo Legado (PIS + COFINS + ICMS + ISS + IPI)
  modeloLegado: {
    pis: number;
    cofins: number;
    icms: number;
    iss: number;
    ipi: number;
    totalTributosLegado: number;
  };

  // Análise Comparativa
  diferencaValor: number; // Novo - Legado
  variacaoPercentual: number;
  faseTransicaoDescricao: string;
}
