// ==========================================================================
// SOBERANO CONTÁBIL — PLANO DE CONTAS REFERENCIAL & DE-PARA SPED ECD / ECF
// Padrão IFRS / NBC TG / CPC & Receita Federal do Brasil (RFB)
// ==========================================================================

export type AccountType = 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO' | 'CUSTOS' | 'DESPESAS' | 'RECEITAS';
export type AccountNature = 'DEVEDORA' | 'CREDORA';
export type TaxRegime = 'LUCRO_REAL' | 'LUCRO_PRESUMIDO' | 'SIMPLES_NACIONAL' | 'IMUNES_ISENTAS';

export interface AccountNode {
  code: string; // Ex: '1.1.1.01.001'
  reducedCode: number; // Ex: 101
  name: string;
  type: AccountType;
  nature: AccountNature;
  level: number; // 1 to 5
  isSynthetic: boolean; // true = Grupo (não aceita lançamento), false = Analítica (aceita lançamento)
  parentCode?: string;
  spedReferentialCode: string; // Código correspondente no Plano Referencial da RFB (ECD/ECF)
  spedReferentialName: string;
  acceptedRegimes: TaxRegime[];
}

export const CANONICAL_CHART_OF_ACCOUNTS: AccountNode[] = [
  // =========================================================================
  // 1. ATIVO
  // =========================================================================
  {
    code: '1',
    reducedCode: 1,
    name: 'ATIVO TOTAL',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 1,
    isSynthetic: true,
    spedReferentialCode: '1',
    spedReferentialName: 'ATIVO',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1',
    reducedCode: 10,
    name: 'ATIVO CIRCULANTE',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 2,
    isSynthetic: true,
    parentCode: '1',
    spedReferentialCode: '1.01',
    spedReferentialName: 'ATIVO CIRCULANTE',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.1',
    reducedCode: 100,
    name: 'Disponibilidades / Caixa e Equivalentes de Caixa',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 3,
    isSynthetic: true,
    parentCode: '1.1',
    spedReferentialCode: '1.01.01',
    spedReferentialName: 'CAIXA E EQUIVALENTES DE CAIXA',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.1.01',
    reducedCode: 101,
    name: 'Caixa Geral',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.1',
    spedReferentialCode: '1.01.01.01.01',
    spedReferentialName: 'Caixa Moeda Nacional',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.1.02',
    reducedCode: 102,
    name: 'Bancos Conta Movimento (Itaú / Bradesco / BB)',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.1',
    spedReferentialCode: '1.01.01.02.01',
    spedReferentialName: 'Bancos Conta Movimento no País',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.1.03',
    reducedCode: 103,
    name: 'Aplicações Financeiras de Liquidez Imediata (CDB / LFT)',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.1',
    spedReferentialCode: '1.01.01.03.01',
    spedReferentialName: 'Aplicações de Liquidez Imediata',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.2',
    reducedCode: 120,
    name: 'Créditos e Contas a Receber',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 3,
    isSynthetic: true,
    parentCode: '1.1',
    spedReferentialCode: '1.01.02',
    spedReferentialName: 'CLIENTES E OUTROS CRÉDITOS',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.2.01',
    reducedCode: 121,
    name: 'Clientes Nacionais a Receber (Duplicatas)',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.2',
    spedReferentialCode: '1.01.02.01.01',
    spedReferentialName: 'Clientes - No País',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.2.02',
    reducedCode: 122,
    name: 'Cartões de Crédito / Débito e Pix a Receber',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.2',
    spedReferentialCode: '1.01.02.01.03',
    spedReferentialName: 'Administradoras de Cartões de Crédito',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.2.03',
    reducedCode: 123,
    name: 'Impostos e Contribuições a Recuperar (ICMS / PIS / COFINS)',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.2',
    spedReferentialCode: '1.01.03.01.01',
    spedReferentialName: 'Tributos a Recuperar',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.3',
    reducedCode: 130,
    name: 'Estoques de Mercadorias e Insumos',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 3,
    isSynthetic: true,
    parentCode: '1.1',
    spedReferentialCode: '1.01.04',
    spedReferentialName: 'ESTOQUES',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.3.01',
    reducedCode: 131,
    name: 'Estoque de Mercadorias para Revenda',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.3',
    spedReferentialCode: '1.01.04.01.01',
    spedReferentialName: 'Mercadorias para Revenda',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.4',
    reducedCode: 140,
    name: 'Tributos e Impostos a Recuperar',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 3,
    isSynthetic: true,
    parentCode: '1.1',
    spedReferentialCode: '1.01.03',
    spedReferentialName: 'TRIBUTOS A RECUPERAR',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.1.4.01',
    reducedCode: 141,
    name: 'ICMS a Recuperar',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.4',
    spedReferentialCode: '1.01.03.01.01',
    spedReferentialName: 'ICMS a Recuperar',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO']
  },
  {
    code: '1.1.4.02',
    reducedCode: 142,
    name: 'PIS e COFINS a Recuperar / Créditos Lei do Bem',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.1.4',
    spedReferentialCode: '1.01.03.01.03',
    spedReferentialName: 'PIS/COFINS a Compensar',
    acceptedRegimes: ['LUCRO_REAL']
  },

  // 1.2 ATIVO NÃO CIRCULANTE
  {
    code: '1.2',
    reducedCode: 150,
    name: 'ATIVO NÃO CIRCULANTE',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 2,
    isSynthetic: true,
    parentCode: '1',
    spedReferentialCode: '1.02',
    spedReferentialName: 'ATIVO NÃO CIRCULANTE',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.2.1.01',
    reducedCode: 151,
    name: 'Imobilizado - Máquinas, Veículos e Equipamentos',
    type: 'ATIVO',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.2',
    spedReferentialCode: '1.02.03.01.01',
    spedReferentialName: 'Máquinas e Equipamentos em Operação',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '1.2.1.02',
    reducedCode: 152,
    name: '(-) Depreciação Acumulada do Imobilizado',
    type: 'ATIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '1.2',
    spedReferentialCode: '1.02.03.09.01',
    spedReferentialName: '(-) Depreciação Acumulada',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },

  // =========================================================================
  // 2. PASSIVO E PATRIMÔNIO LÍQUIDO
  // =========================================================================
  {
    code: '2',
    reducedCode: 2,
    name: 'PASSIVO TOTAL & PATRIMÔNIO LÍQUIDO',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 1,
    isSynthetic: true,
    spedReferentialCode: '2',
    spedReferentialName: 'PASSIVO',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1',
    reducedCode: 20,
    name: 'PASSIVO CIRCULANTE',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 2,
    isSynthetic: true,
    parentCode: '2',
    spedReferentialCode: '2.01',
    spedReferentialName: 'PASSIVO CIRCULANTE',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.1.01',
    reducedCode: 201,
    name: 'Fornecedores Nacionais a Pagar',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.01.01.01',
    spedReferentialName: 'Fornecedores Nacionais',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.2.01',
    reducedCode: 202,
    name: 'Salários e Ordenados a Pagar',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.02.01.01',
    spedReferentialName: 'Salários e Ordenados a Pagar',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.2.02',
    reducedCode: 203,
    name: 'INSS e Previdência Social a Recolher',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.02.02.01',
    spedReferentialName: 'INSS a Recolher',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.2.03',
    reducedCode: 204,
    name: 'FGTS a Recolher (FGTS Digital)',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.02.03.01',
    spedReferentialName: 'FGTS a Recolher',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.2.04',
    reducedCode: 206,
    name: 'Provisões Trabalhistas de Férias e 13º a Pagar',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.02.04.01',
    spedReferentialName: 'Provisões Trabalhistas',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.1.3.01',
    reducedCode: 205,
    name: 'Simples Nacional a Recolher (PGDAS-D)',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.03.01.01',
    spedReferentialName: 'Simples Nacional a Recolher',
    acceptedRegimes: ['SIMPLES_NACIONAL']
  },
  {
    code: '2.1.3.02',
    reducedCode: 206,
    name: 'IRPJ e CSLL a Recolher (Lucro Real / Presumido)',
    type: 'PASSIVO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.1',
    spedReferentialCode: '2.01.03.02.01',
    spedReferentialName: 'IRPJ / CSLL a Recolher',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO']
  },

  // 2.3 PATRIMÔNIO LÍQUIDO
  {
    code: '2.3',
    reducedCode: 230,
    name: 'PATRIMÔNIO LÍQUIDO',
    type: 'PATRIMONIO_LIQUIDO',
    nature: 'CREDORA',
    level: 2,
    isSynthetic: true,
    parentCode: '2',
    spedReferentialCode: '2.03',
    spedReferentialName: 'PATRIMÔNIO LÍQUIDO',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.3.1.01',
    reducedCode: 231,
    name: 'Capital Social Subscrito e Integralizado',
    type: 'PATRIMONIO_LIQUIDO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.3',
    spedReferentialCode: '2.03.01.01.01',
    spedReferentialName: 'Capital Social Realizado',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.3.2.01',
    reducedCode: 232,
    name: 'Reserva Legal (5% do Lucro - Art. 193 Lei 6.404/76)',
    type: 'PATRIMONIO_LIQUIDO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.3',
    spedReferentialCode: '2.03.02.01.01',
    spedReferentialName: 'Reserva Legal',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '2.3.3.01',
    reducedCode: 233,
    name: 'Lucros ou Prejuízos Acumulados do Exercício',
    type: 'PATRIMONIO_LIQUIDO',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '2.3',
    spedReferentialCode: '2.03.04.01.01',
    spedReferentialName: 'Lucros/Prejuízos Acumulados',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },

  // =========================================================================
  // 3. RECEITAS OPERACIONAIS
  // =========================================================================
  {
    code: '3',
    reducedCode: 3,
    name: 'RECEITAS OPERACIONAIS',
    type: 'RECEITAS',
    nature: 'CREDORA',
    level: 1,
    isSynthetic: true,
    spedReferentialCode: '3',
    spedReferentialName: 'RECEITAS',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '3.1.1.01',
    reducedCode: 301,
    name: 'Receita Bruta com Venda de Mercadorias / Produtos',
    type: 'RECEITAS',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '3',
    spedReferentialCode: '3.01.01.01.01',
    spedReferentialName: 'Receita Bruta com Vendas no País',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '3.1.1.02',
    reducedCode: 302,
    name: 'Receita Bruta com Prestação de Serviços',
    type: 'RECEITAS',
    nature: 'CREDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '3',
    spedReferentialCode: '3.01.01.01.03',
    spedReferentialName: 'Receita Bruta com Serviços Prestados',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '3.2.1.01',
    reducedCode: 321,
    name: '(-) Deduções e Tributos sobre Vendas (ICMS/PIS/COFINS/ISS)',
    type: 'RECEITAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '3',
    spedReferentialCode: '3.01.02.01.01',
    spedReferentialName: '(-) Tributos Incidentes sobre Vendas',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },

  // =========================================================================
  // 4. DESPESAS E CUSTOS OPERACIONAIS
  // =========================================================================
  {
    code: '4',
    reducedCode: 4,
    name: 'CUSTOS E DESPESAS OPERACIONAIS',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 1,
    isSynthetic: true,
    spedReferentialCode: '4',
    spedReferentialName: 'DESPESAS E CUSTOS',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.1.01',
    reducedCode: 401,
    name: 'Despesas com Salários e Ordenados',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.01.01.01',
    spedReferentialName: 'Salários e Encargos do Pessoal',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.1.02',
    reducedCode: 402,
    name: 'Despesas com Pró-Labore da Diretoria e Sócios',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.01.01.05',
    spedReferentialName: 'Honorários de Diretores e Pró-Labore',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.2.01',
    reducedCode: 421,
    name: 'Custo das Mercadorias Vendidas (CMV) / Insumos',
    type: 'CUSTOS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.02.01.01',
    spedReferentialName: 'Custo das Mercadorias Vendidas',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.2.02',
    reducedCode: 422,
    name: 'Despesas com Encargos Sociais (INSS e FGTS)',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.01.01.02',
    spedReferentialName: 'Encargos Sociais sobre a Folha',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.2.03',
    reducedCode: 423,
    name: 'Despesas com Provisões de Férias e 13º Salário',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.01.01.03',
    spedReferentialName: 'Provisões Trabalhistas de Férias e 13º',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.3.01',
    reducedCode: 431,
    name: 'Despesas Gerais, Aluguéis, Energia e Telefonia',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.03.01.01',
    spedReferentialName: 'Despesas Gerais e Administrativas',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  },
  {
    code: '4.1.3.02',
    reducedCode: 432,
    name: 'Despesas Bancárias, Tarifas e Taxas de Cartão',
    type: 'DESPESAS',
    nature: 'DEVEDORA',
    level: 4,
    isSynthetic: false,
    parentCode: '4',
    spedReferentialCode: '4.01.04.01.01',
    spedReferentialName: 'Despesas Financeiras e Bancárias',
    acceptedRegimes: ['LUCRO_REAL', 'LUCRO_PRESUMIDO', 'SIMPLES_NACIONAL']
  }
];

export class ReferentialChartService {
  private accounts: AccountNode[] = [...CANONICAL_CHART_OF_ACCOUNTS];

  public getAllAccounts(regime?: TaxRegime): AccountNode[] {
    if (!regime) return this.accounts;
    return this.accounts.filter(acc => acc.acceptedRegimes.includes(regime));
  }

  public getAccountByCode(code: string): AccountNode | undefined {
    return this.accounts.find(a => a.code === code || String(a.reducedCode) === code);
  }

  public getAnalyticalAccounts(): AccountNode[] {
    return this.accounts.filter(a => !a.isSynthetic);
  }

  public searchAccounts(query: string): AccountNode[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.accounts;

    return this.accounts.filter(a =>
      a.code.toLowerCase().includes(q) ||
      String(a.reducedCode).includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.spedReferentialCode.toLowerCase().includes(q) ||
      a.spedReferentialName.toLowerCase().includes(q)
    );
  }
}

export const referentialChartService = new ReferentialChartService();
export default referentialChartService;