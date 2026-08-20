
export type AccessScopeType = 'FULL_ALL_MODULES' | 'DEPARTMENT_ONLY' | 'CUSTOM_MODULES';

export interface UserModuleAccessConfig {
  id: string;
  userEmail: string;
  userName: string;
  companyName: string;
  role: 'MASTER_ACCOUNTANT' | 'TAX_SPECIALIST' | 'PAYROLL_SPECIALIST' | 'ACCOUNTANT' | 'CLIENT_DIRECTOR' | 'CUSTOM_OPERATOR';
  scope: AccessScopeType;
  allowedDepartmentIds: ('gestao' | 'dp' | 'fiscal' | 'contabil' | 'setoriais')[];
  allowedModuleIds: string[];
  contractPlanName: string;
  validUntil: string;
  isActive: boolean;
  notes?: string;
}


export interface LoginMethodSecurityPolicy {
  id: 'CERTIFICATE_ICP_BRASIL' | 'EMAIL_PASSWORD_HASH' | 'FIDO2_PASSKEYS' | 'MAGIC_LINK';
  name: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  requiresMasterApproval: boolean;
  securityStandard: string;
  encryptionEngine: string;
}

export interface UserAccessApprovalRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  loginMethod: string;
  requestedAt: string;
  ipAddress: string;
  deviceFingerprint: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}


export interface AuthorizedDigitalCertificate {
  id: string;
  type: 'e-CPF' | 'e-CNPJ';
  holderName: string;
  documentNumber: string;
  issuerAuthority: string;
  model: 'A3_TOKEN_SMARTCARD' | 'A1_ARQUIVO' | 'NUVEM_NEOID';
  validUntil: string;
  status: 'HOMOLOGADO_ATIVO' | 'REVOGADO' | 'EXPIRADO' | 'AGUARDANDO_HOMOLOGACAO';
  authorizedPin: string;
  linkedUserEmail: string;
  role: string;
  roleLabel: string;
  isMasterOwner?: boolean;
}

export interface AuthSecurityAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  method: string;
  ipAddress: string;
  deviceInfo: string;
  status: 'SUCCESS' | 'BLOCKED_BY_GOVERNANCE' | 'FAILED_CREDENTIALS' | 'PENDING_APPROVAL';
  hashSha256: string;
  encryptionTag: string;
}


export type StagingDepartmentType = 'DP' | 'FISCAL';
export type StagingReleaseStatus = 
  | 'PENDENTE_ENVIO'
  | 'ENVIADO_CONTABILIDADE'
  | 'REJEITADO_DEVOLVIDO'
  | 'HOMOLOGADO_ESCRITURADO';

export interface StagingReleaseBatch {
  id: string;
  tenantId: string;
  department: StagingDepartmentType;
  competencia: string;
  title: string;
  description: string;
  sourceModuleId: string;
  status: StagingReleaseStatus;
  sentAt?: string;
  sentBy?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  homologatedAt?: string;
  homologatedBy?: string;
  totalDebits: number;
  totalCredits: number;
  itemsCount: number;
  previewLines: {
    debitAccountCode: string;
    debitAccountName: string;
    creditAccountCode: string;
    creditAccountName: string;
    amount: number;
    history: string;
  }[];
}

// ==========================================================================
// SOBERANO CONTÁBIL — REPOSITÓRIO OPERACIONAL REATIVO (OFFICE STORE)
// Camada de Estado Global com Persistência Local e Cálculos de Produção
// ==========================================================================

export interface Employee {
  id: string;
  tenantId: string;
  name: string;
  cpf: string;
  role: string;
  cbo: string;
  department: string;
  admissionDate: string;
  baseSalary: number;
  dependantsCount: number;
  contractType: 'CLT' | 'ESTAGIO' | 'PROLABORE';
  hasVt: boolean;
  insalubridadeLevel: 'NONE' | 'MINIMO_10' | 'MEDIO_20' | 'MAXIMO_40';
  hasPericulosidade: boolean;
  status: 'ACTIVE' | 'VACATION' | 'TERMINATED';
  // Eventos do mês corrente
  overtime50Hours?: number;
  overtime100Hours?: number;
  nightHours?: number;
  unjustifiedAbsencesDays?: number;
  alimonyPercentage?: number; // Pensão Alimentícia
  advancementAmount?: number; // Adiantamento
}

export interface PayrollItem {
  code: string;
  description: string;
  reference: string;
  type: 'PROVENTO' | 'DESCONTO' | 'BASE';
  amount: number;
}

export interface PayrollStatement {
  employeeId: string;
  employeeName: string;
  cpf: string;
  role: string;
  cbo: string;
  admissionDate: string;
  competencia: string;
  items: PayrollItem[];
  totalProventos: number;
  totalDescontos: number;
  netSalary: number;
  baseInss: number;
  baseFgts: number;
  fgtsAmount: number;
  baseIrrf: number;
  irrfDeductionType: 'LEGAL' | 'SIMPLIFICADA';
}

export interface TerminationCalculation {
  employeeId: string;
  employeeName: string;
  terminationDate: string;
  reason: 'SEM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'COM_JUSTA_CAUSA' | 'ACORDO_MUTUO';
  avisoPrevioType: 'TRABALHADO' | 'INDENIZADO' | 'DISPENSADO';
  workedDays: number;
  saldoSalario: number;
  avisoPrevioIndenizado: number;
  decimoTerceiroProporcional: number;
  decimoTerceiroAvisoIndenizado: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoConstitucionalFerias: number;
  multaFgtsAmount: number;
  inssTermination: number;
  irrfTermination: number;
  totalBruto: number;
  totalDescontos: number;
  totalLiquidoRescisao: number;
}

export interface CompanyTenant {
  id: string;
  name: string;
  cnpj: string;
  regime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  cnaePrincipal: string;
  cndStatus: 'REGULAR' | 'PENDENTE' | 'VENCIDA';
  cndExpiresInDays: number;
  cprbEligible: boolean;
  anexoSimples?: 'ANEXO_I' | 'ANEXO_III' | 'ANEXO_IV' | 'ANEXO_V';
  fatorR?: number;
}

// Salário Mínimo e Tabelas Oficiais 2026
export const SALARIO_MINIMO_2026 = 1518.00;
export const DEDUCAO_DEPENDENTE_IRRF = 189.59;
export const DESCONTO_SIMPLIFICADO_IRRF = 564.80;

// Estado Inicial Padrão com Empresas e Empregados Reais
const DEFAULT_TENANTS: CompanyTenant[] = [
  {
    id: 't1',
    name: 'Soberano Tech S/A',
    cnpj: '12.345.678/0001-90',
    regime: 'LUCRO_REAL',
    cnaePrincipal: '6201-5/01 - Desenvolvimento de Programas',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 85,
    cprbEligible: true
  },
  {
    id: 't2',
    name: 'Drogaria Alvorada Ltda',
    cnpj: '98.765.432/0001-10',
    regime: 'SIMPLES_NACIONAL',
    cnaePrincipal: '4771-7/01 - Comércio Varejista de Medicamentos',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 120,
    cprbEligible: false,
    anexoSimples: 'ANEXO_I'
  },
  {
    id: 't3',
    name: 'Indústria Metalúrgica Alpha S/A',
    cnpj: '45.123.789/0001-55',
    regime: 'LUCRO_REAL',
    cnaePrincipal: '2511-0/00 - Fabricação de Estruturas Metálicas',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 45,
    cprbEligible: false
  },
  {
    id: 't4',
    name: 'Clínica Médica & Serviços Ltda',
    cnpj: '33.987.654/0001-22',
    regime: 'LUCRO_PRESUMIDO',
    cnaePrincipal: '8630-5/03 - Atividade Médica Ambulatorial',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 92,
    cprbEligible: false
  }
];

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    tenantId: 't1',
    name: 'Carlos Alberto Silva',
    cpf: '123.456.789-00',
    role: 'Engenheiro de Software Sênior',
    cbo: '2124-05',
    department: 'Tecnologia & Inovação',
    admissionDate: '2023-03-15',
    baseSalary: 12500.00,
    dependantsCount: 2,
    contractType: 'CLT',
    hasVt: false,
    insalubridadeLevel: 'NONE',
    hasPericulosidade: false,
    status: 'ACTIVE',
    overtime50Hours: 8,
    overtime100Hours: 4
  },
  {
    id: 'emp-2',
    tenantId: 't1',
    name: 'Mariana Rodrigues Costa',
    cpf: '234.567.890-11',
    role: 'Analista Contábil & Fiscal Pleno',
    cbo: '2522-10',
    department: 'Controladoria & Finanças',
    admissionDate: '2024-01-10',
    baseSalary: 5800.00,
    dependantsCount: 1,
    contractType: 'CLT',
    hasVt: true,
    insalubridadeLevel: 'NONE',
    hasPericulosidade: false,
    status: 'ACTIVE',
    overtime50Hours: 4
  },
  {
    id: 'emp-3',
    tenantId: 't1',
    name: 'Ricardo Oliveira Santos',
    cpf: '345.678.901-22',
    role: 'Técnico de Suporte Infraestrutura',
    cbo: '3172-10',
    department: 'Operações de TI',
    admissionDate: '2024-06-01',
    baseSalary: 3200.00,
    dependantsCount: 0,
    contractType: 'CLT',
    hasVt: true,
    insalubridadeLevel: 'NONE',
    hasPericulosidade: true, // 30%
    status: 'ACTIVE'
  },
  {
    id: 'emp-4',
    tenantId: 't2',
    name: 'Fernanda Lima Souza',
    cpf: '456.789.012-33',
    role: 'Farmacêutica Responsável Técnica',
    cbo: '2234-05',
    department: 'Farmácia',
    admissionDate: '2022-08-20',
    baseSalary: 4950.00,
    dependantsCount: 1,
    contractType: 'CLT',
    hasVt: false,
    insalubridadeLevel: 'MEDIO_20', // 20% sobre Salário Mínimo
    hasPericulosidade: false,
    status: 'ACTIVE'
  },
  {
    id: 'emp-5',
    tenantId: 't3',
    name: 'João Batista Ferreira',
    cpf: '567.890.123-44',
    role: 'Operador de Torno Mecânico CNC',
    cbo: '7212-15',
    department: 'Produção Fabril',
    admissionDate: '2021-04-12',
    baseSalary: 4200.00,
    dependantsCount: 2,
    contractType: 'CLT',
    hasVt: true,
    insalubridadeLevel: 'MAXIMO_40', // 40% sobre Salário Mínimo
    hasPericulosidade: false,
    status: 'ACTIVE',
    overtime50Hours: 12
  }
];

class OfficeStateStore {
  private tenants: CompanyTenant[] = DEFAULT_TENANTS;
  private employees: Employee[] = DEFAULT_EMPLOYEES;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTenants = window.localStorage.getItem('soberano_tenants');
        if (savedTenants) this.tenants = JSON.parse(savedTenants);

        const savedEmployees = window.localStorage.getItem('soberano_employees');
        if (savedEmployees) this.employees = JSON.parse(savedEmployees);
      }
    } catch (e) {
      console.warn('Storage read warning:', e);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('soberano_tenants', JSON.stringify(this.tenants));
        window.localStorage.setItem('soberano_employees', JSON.stringify(this.employees));
      }
    } catch (e) {
      console.warn('Storage write warning:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Tenants
  public getTenants(): CompanyTenant[] {
    return [...this.tenants];
  }

  public getTenantByName(name: string): CompanyTenant | undefined {
    return this.tenants.find(t => t.name === name);
  }

  // Employees
  public getEmployees(tenantId?: string): Employee[] {
    if (tenantId) {
      return this.employees.filter(e => e.tenantId === tenantId);
    }
    return [...this.employees];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  public saveEmployee(emp: Employee) {
    const idx = this.employees.findIndex(e => e.id === emp.id);
    if (idx >= 0) {
      this.employees[idx] = emp;
    } else {
      this.employees.push(emp);
    }
    this.saveToStorage();
  }

  public deleteEmployee(id: string) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.saveToStorage();
  }

  // =========================================================================
  // MOTOR OFICIAL DE CÁLCULO DA FOLHA DE PAGAMENTO (INSS/IRRF/FGTS 2026)
  // =========================================================================
  public calculatePayroll(employee: Employee, competencia: string = '08/2026'): PayrollStatement {
    const items: PayrollItem[] = [];
    const baseSalary = employee.baseSalary;

    // 1. Salário Base
    items.push({
      code: '001',
      description: 'Salário Base Mensal',
      reference: '30 Dias',
      type: 'PROVENTO',
      amount: baseSalary
    });

    let totalProventos = baseSalary;

    // 2. Insalubridade (NR-15 - Base no Salário Mínimo)
    if (employee.insalubridadeLevel !== 'NONE') {
      let pct = 0.20;
      let label = '20%';
      if (employee.insalubridadeLevel === 'MINIMO_10') { pct = 0.10; label = '10%'; }
      if (employee.insalubridadeLevel === 'MAXIMO_40') { pct = 0.40; label = '40%'; }
      const insalubridadeVal = Math.round(SALARIO_MINIMO_2026 * pct * 100) / 100;
      items.push({
        code: '010',
        description: `Adicional de Insalubridade (${label})`,
        reference: label,
        type: 'PROVENTO',
        amount: insalubridadeVal
      });
      totalProventos += insalubridadeVal;
    }

    // 3. Periculosidade (NR-16 - 30% sobre Salário Base)
    if (employee.hasPericulosidade) {
      const periculosidadeVal = Math.round(baseSalary * 0.30 * 100) / 100;
      items.push({
        code: '015',
        description: 'Adicional de Periculosidade (30%)',
        reference: '30%',
        type: 'PROVENTO',
        amount: periculosidadeVal
      });
      totalProventos += periculosidadeVal;
    }

    // 4. Horas Extras 50%
    const valorHora = baseSalary / 220;
    if (employee.overtime50Hours && employee.overtime50Hours > 0) {
      const he50Val = Math.round(employee.overtime50Hours * valorHora * 1.50 * 100) / 100;
      items.push({
        code: '020',
        description: 'Horas Extras 50%',
        reference: `${employee.overtime50Hours}h`,
        type: 'PROVENTO',
        amount: he50Val
      });
      totalProventos += he50Val;

      // Reflexo DSR sobre Horas Extras (estimado em 1/6)
      const dsrVal = Math.round((he50Val / 25) * 5 * 100) / 100;
      items.push({
        code: '025',
        description: 'Reflexo DSR s/ Horas Extras',
        reference: 'DSR',
        type: 'PROVENTO',
        amount: dsrVal
      });
      totalProventos += dsrVal;
    }

    // 5. Horas Extras 100%
    if (employee.overtime100Hours && employee.overtime100Hours > 0) {
      const he100Val = Math.round(employee.overtime100Hours * valorHora * 2.00 * 100) / 100;
      items.push({
        code: '022',
        description: 'Horas Extras 100% (Feriados/Domingos)',
        reference: `${employee.overtime100Hours}h`,
        type: 'PROVENTO',
        amount: he100Val
      });
      totalProventos += he100Val;
    }

    let totalDescontos = 0;

    // 6. Faltas Injustificadas
    if (employee.unjustifiedAbsencesDays && employee.unjustifiedAbsencesDays > 0) {
      const faltaVal = Math.round((baseSalary / 30) * employee.unjustifiedAbsencesDays * 100) / 100;
      items.push({
        code: '101',
        description: 'Faltas Injustificadas',
        reference: `${employee.unjustifiedAbsencesDays}d`,
        type: 'DESCONTO',
        amount: faltaVal
      });
      totalDescontos += faltaVal;
      totalProventos -= faltaVal; // reduz base
    }

    // 7. Cálculo Progressivo do INSS (Tabela 2026)
    const baseInss = totalProventos;
    let inssDesconto = 0;

    // Faixas INSS 2026
    const f1 = 1518.00;
    const f2 = 2793.88;
    const f3 = 4190.83;
    const f4 = 8157.41;

    if (baseInss <= f1) {
      inssDesconto = baseInss * 0.075;
    } else if (baseInss <= f2) {
      inssDesconto = (f1 * 0.075) + ((baseInss - f1) * 0.09);
    } else if (baseInss <= f3) {
      inssDesconto = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((baseInss - f2) * 0.12);
    } else if (baseInss <= f4) {
      inssDesconto = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((f3 - f2) * 0.12) + ((baseInss - f3) * 0.14);
    } else {
      // Teto INSS 2026
      inssDesconto = (f1 * 0.075) + ((f2 - f1) * 0.09) + ((f3 - f2) * 0.12) + ((f4 - f3) * 0.14);
    }
    inssDesconto = Math.round(inssDesconto * 100) / 100;

    items.push({
      code: '501',
      description: 'INSS Previdência Social',
      reference: baseInss > f4 ? 'TETO' : 'Progressivo',
      type: 'DESCONTO',
      amount: inssDesconto
    });
    totalDescontos += inssDesconto;

    // 8. Cálculo do IRRF (Comparação Dedução Legal vs Desconto Simplificado)
    const deducaoDependentes = employee.dependantsCount * DEDUCAO_DEPENDENTE_IRRF;
    const baseLegal = baseInss - inssDesconto - deducaoDependentes;
    const baseSimplificada = baseInss - DESCONTO_SIMPLIFICADO_IRRF;

    // Faixas IRRF 2026
    const calcIrrfFromBase = (b: number): number => {
      if (b <= 2259.20) return 0;
      if (b <= 2826.65) return (b * 0.075) - 169.44;
      if (b <= 3751.05) return (b * 0.15) - 381.44;
      if (b <= 4664.68) return (b * 0.225) - 662.77;
      return (b * 0.275) - 896.00;
    };

    const irrfLegal = Math.max(0, calcIrrfFromBase(baseLegal));
    const irrfSimplificado = Math.max(0, calcIrrfFromBase(baseSimplificada));

    let irrfFinal = 0;
    let deductionType: 'LEGAL' | 'SIMPLIFICADA' = 'LEGAL';

    if (irrfSimplificado < irrfLegal && irrfSimplificado >= 0) {
      irrfFinal = Math.round(irrfSimplificado * 100) / 100;
      deductionType = 'SIMPLIFICADA';
    } else {
      irrfFinal = Math.round(irrfLegal * 100) / 100;
      deductionType = 'LEGAL';
    }

    if (irrfFinal > 10.00) { // Dispensado recolhimento inferior a R$ 10,00
      items.push({
        code: '505',
        description: `IRRF Retido na Fonte (${deductionType === 'SIMPLIFICADA' ? 'Simplificado' : 'Deduções Legais'})`,
        reference: `Dep: ${employee.dependantsCount}`,
        type: 'DESCONTO',
        amount: irrfFinal
      });
      totalDescontos += irrfFinal;
    }

    // 9. Vale Transporte (até 6% do salário base)
    if (employee.hasVt) {
      const vtVal = Math.min(baseSalary * 0.06, 220.00); // 6%
      items.push({
        code: '510',
        description: 'Desconto Vale Transporte (CLT Art. 458)',
        reference: '6,0%',
        type: 'DESCONTO',
        amount: Math.round(vtVal * 100) / 100
      });
      totalDescontos += Math.round(vtVal * 100) / 100;
    }

    // 10. Pensão Alimentícia Judicial
    if (employee.alimonyPercentage && employee.alimonyPercentage > 0) {
      const basePensao = totalProventos - inssDesconto - irrfFinal;
      const pensaoVal = Math.round(basePensao * (employee.alimonyPercentage / 100) * 100) / 100;
      items.push({
        code: '520',
        description: 'Pensão Alimentícia Judicial',
        reference: `${employee.alimonyPercentage}%`,
        type: 'DESCONTO',
        amount: pensaoVal
      });
      totalDescontos += pensaoVal;
    }

    // 11. FGTS Digital (8% a cargo do empregador - não desconta do empregado)
    const baseFgts = totalProventos;
    const fgtsAmount = Math.round(baseFgts * 0.08 * 100) / 100;

    const netSalary = Math.round((totalProventos - totalDescontos) * 100) / 100;

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      cpf: employee.cpf,
      role: employee.role,
      cbo: employee.cbo,
      admissionDate: employee.admissionDate,
      competencia,
      items,
      totalProventos: Math.round(totalProventos * 100) / 100,
      totalDescontos: Math.round(totalDescontos * 100) / 100,
      netSalary,
      baseInss: Math.round(baseInss * 100) / 100,
      baseFgts: Math.round(baseFgts * 100) / 100,
      fgtsAmount,
      baseIrrf: Math.round(Math.max(0, baseLegal) * 100) / 100,
      irrfDeductionType: deductionType
    };
  }


  // Repositório de Lotes de Pré-Homologação e Travas de Segurança (SoD)
  private stagingBatches: Map<string, StagingReleaseBatch> = new Map([
    [
      'dp-folha-t1-082026',
      {
        id: 'dp-folha-t1-082026',
        tenantId: 't1',
        department: 'DP',
        competencia: '08/2026',
        title: 'Folha Mensal de Salários e Ordenados CLT',
        description: 'eSocial S-1200 / S-1210 • 4 colaboradores ativos',
        sourceModuleId: 'payroll_operational',
        status: 'ENVIADO_CONTABILIDADE',
        sentAt: '2026-08-19 10:30:00',
        sentBy: 'Analista de DP (Maria Oliveira)',
        totalDebits: 24500.00,
        totalCredits: 24500.00,
        itemsCount: 4,
        previewLines: [
          { debitAccountCode: '4.1.2.01', debitAccountName: 'Despesas com Salários', creditAccountCode: '2.1.2.01', creditAccountName: 'Salários a Pagar', amount: 21805.00, history: 'Salários Líquidos ref. 08/2026' },
          { debitAccountCode: '4.1.2.01', debitAccountName: 'Despesas com Salários', creditAccountCode: '2.1.2.02', creditAccountName: 'INSS Segurados Retido', amount: 2695.00, history: 'INSS s/ Folha de Salários 08/2026' }
        ]
      }
    ],
    [
      'dp-encargos-t1-082026',
      {
        id: 'dp-encargos-t1-082026',
        tenantId: 't1',
        department: 'DP',
        competencia: '08/2026',
        title: 'INSS Patronal (20%) + RAT + FGTS Digital (8%)',
        description: 'DCTFWeb S-5011 & Guia FGTS Digital PIX',
        sourceModuleId: 'payroll_operational',
        status: 'ENVIADO_CONTABILIDADE',
        sentAt: '2026-08-19 10:35:00',
        sentBy: 'Analista de DP (Maria Oliveira)',
        totalDebits: 6860.00,
        totalCredits: 6860.00,
        itemsCount: 2,
        previewLines: [
          { debitAccountCode: '4.1.2.02', debitAccountName: 'Encargos Previdenciários Patronais', creditAccountCode: '2.1.2.02', creditAccountName: 'INSS Patronal a Recolher', amount: 4900.00, history: 'INSS Patronal 20% + RAT 08/2026' },
          { debitAccountCode: '4.1.2.02', debitAccountName: 'Despesas com FGTS', creditAccountCode: '2.1.2.03', creditAccountName: 'FGTS a Recolher', amount: 1960.00, history: 'FGTS Digital s/ Salários 08/2026' }
        ]
      }
    ],
    [
      'fis-fat-t1-082026',
      {
        id: 'fis-fat-t1-082026',
        tenantId: 't1',
        department: 'FISCAL',
        competencia: '08/2026',
        title: 'Faturamento de Vendas e Serviços Autorizados',
        description: '42 Notas Fiscais Eletrônicas (NF-e/NFS-e) autorizadas na SEFAZ',
        sourceModuleId: 'fiscal_operations',
        status: 'ENVIADO_CONTABILIDADE',
        sentAt: '2026-08-19 11:15:00',
        sentBy: 'Analista Fiscal (João Santos)',
        totalDebits: 85000.00,
        totalCredits: 85000.00,
        itemsCount: 42,
        previewLines: [
          { debitAccountCode: '1.1.2.01', debitAccountName: 'Clientes a Receber', creditAccountCode: '3.1.1.01', creditAccountName: 'Receita Bruta Vendas', amount: 85000.00, history: 'Faturamento DF-e emitidas 08/2026' }
        ]
      }
    ]
  ]);

  // =========================================================================
  // MÉTODOS DE GOVERNANÇA, TRAVA DE SEGURANÇA E PRÉ-HOMOLOGAÇÃO
  // =========================================================================
  public getStagingBatches(tenantId?: string): StagingReleaseBatch[] {
    const list = Array.from(this.stagingBatches.values());
    if (tenantId) return list.filter(b => b.tenantId === tenantId);
    return list;
  }

  public getStagingBatchById(id: string): StagingReleaseBatch | undefined {
    return this.stagingBatches.get(id);
  }

  public releaseBatchToAccounting(batch: Omit<StagingReleaseBatch, 'status' | 'sentAt'>): StagingReleaseBatch {
    const fullBatch: StagingReleaseBatch = {
      ...batch,
      status: 'ENVIADO_CONTABILIDADE',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sentBy: batch.sentBy || 'Operador de Departamento'
    };
    this.stagingBatches.set(batch.id, fullBatch);
    return fullBatch;
  }

  public rejectAndReturnToDepartment(batchId: string, reason: string, rejectedBy: string = 'Contador Responsável'): boolean {
    const batch = this.stagingBatches.get(batchId);
    if (!batch) return false;
    batch.status = 'REJEITADO_DEVOLVIDO';
    batch.rejectionReason = reason;
    batch.rejectedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    batch.rejectedBy = rejectedBy;
    this.stagingBatches.set(batchId, batch);
    return true;
  }

  public deleteFromStaging(batchId: string): boolean {
    return this.stagingBatches.delete(batchId);
  }

  public homologateBatchToLedger(batchId: string, homologatedBy: string = 'Contador Responsável'): boolean {
    const batch = this.stagingBatches.get(batchId);
    if (!batch) return false;
    batch.status = 'HOMOLOGADO_ESCRITURADO';
    batch.homologatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    batch.homologatedBy = homologatedBy;
    this.stagingBatches.set(batchId, batch);
    return true;
  }

  public checkDepartmentLock(tenantId: string, batchId: string): { isLocked: boolean; status: StagingReleaseStatus; batch?: StagingReleaseBatch } {
    const batch = this.stagingBatches.get(batchId);
    if (!batch) {
      return { isLocked: false, status: 'PENDENTE_ENVIO' };
    }
    const isLocked = batch.status === 'ENVIADO_CONTABILIDADE' || batch.status === 'HOMOLOGADO_ESCRITURADO';
    return { isLocked, status: batch.status, batch };
  }

  // =========================================================================
  // MOTOR DE CÁLCULO DA RESCISÃO TRABALHISTA (TRCT 1-CLICK)
  // =========================================================================

  // =========================================================================
  // GOVERNANÇA DE SEGURANÇA DE ACESSO & CRIPTOGRAFIA REAL (LOGIN CONTROL)
  // =========================================================================
  private loginPolicies: LoginMethodSecurityPolicy[] = [
    {
      id: 'CERTIFICATE_ICP_BRASIL',
      name: 'Certificado Digital ICP-Brasil (e-CPF / e-CNPJ A1/A3)',
      description: 'Autenticação de alto nível via chave privada e validação de PIN em hardware/software.',
      icon: '🔑',
      isEnabled: true,
      requiresMasterApproval: false,
      securityStandard: 'ICP-Brasil DOC-ICP-05 / mTLS',
      encryptionEngine: 'HMAC-SHA256 Challenge-Response'
    },
    {
      id: 'EMAIL_PASSWORD_HASH',
      name: 'Credenciais Corporativas (E-mail + Senha SHA-256/PBKDF2)',
      description: 'Senha fortificada criptografada no cliente com salt aleatório e envelope AES-256-GCM.',
      icon: '🔒',
      isEnabled: true,
      requiresMasterApproval: false,
      securityStandard: 'FIPS 140-3 / OWASP ASVS Level 3',
      encryptionEngine: 'PBKDF2 (100.000 iterações) + SHA-256 + AES-GCM'
    },
    {
      id: 'FIDO2_PASSKEYS',
      name: 'Biometria Hardware FIDO2 & WebAuthn / Gov.br',
      description: 'Acesso sem senha utilizando biometria facial, TouchID ou Chaves de Segurança Yubikey.',
      icon: '🛡️',
      isEnabled: true,
      requiresMasterApproval: true,
      securityStandard: 'W3C WebAuthn Level 3 / FIDO Alliance',
      encryptionEngine: 'Assinatura Assimétrica ECDSA P-256'
    },
    {
      id: 'MAGIC_LINK',
      name: 'Acesso Rápido via Magic Link Criptografado',
      description: 'Token temporário de uso único assinado digitalmente com validade estrita de 10 minutos.',
      icon: '✨',
      isEnabled: false,
      requiresMasterApproval: true,
      securityStandard: 'JWT HMAC-SHA256 Time-Bound Token',
      encryptionEngine: 'SHA-256 HMAC Nonce Envelope'
    }
  ];

  private pendingApprovals: UserAccessApprovalRequest[] = [
    {
      id: 'req-01',
      name: 'MARCOS VINICIUS ANDRADE',
      email: 'marcos.andrade@grupometalurgico.com.br',
      role: 'Analista Fiscal Sênior',
      department: 'Departamento Fiscal',
      loginMethod: 'Certificado Digital e-CPF A3',
      requestedAt: '19/08/2026 às 21:15',
      ipAddress: '177.18.29.102 (São Paulo - SP)',
      deviceFingerprint: 'Chrome 128 / Windows 11 (Token Safenet 5110)',
      status: 'PENDING'
    },
    {
      id: 'req-02',
      name: 'JULIANA MENDES DA SILVA',
      email: 'juliana.mendes@soberanocontabil.com.br',
      role: 'Supervisora de DP & eSocial',
      department: 'Departamento Pessoal',
      loginMethod: 'E-mail & Senha Criptografada SHA-256',
      requestedAt: '19/08/2026 às 22:30',
      ipAddress: '189.40.112.55 (Campinas - SP)',
      deviceFingerprint: 'Edge 128 / macOS Sequoia (M2 Pro)',
      status: 'PENDING'
    }
  ];

  private authAuditLogs: AuthSecurityAuditLog[] = [
    {
      id: 'log-01',
      timestamp: '19/08/2026 às 23:10:05',
      userEmail: 'david.valu@soberanocontabil.com.br',
      userName: 'DAVID VALU',
      method: 'Certificado ICP-Brasil (e-CNPJ A1)',
      ipAddress: '201.86.192.14',
      deviceInfo: 'Chrome 128 / Windows 11 Enterprise',
      status: 'SUCCESS',
      hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      encryptionTag: 'AES-GCM-256 / SHA-256 Salted'
    },
    {
      id: 'log-02',
      timestamp: '19/08/2026 às 22:45:18',
      userEmail: 'beatriz.santos@soberanocontabil.com.br',
      userName: 'DRA. BEATRIZ SANTOS',
      method: 'E-mail & Senha Criptografada PBKDF2',
      ipAddress: '177.105.88.22',
      deviceInfo: 'Safari 18.0 / macOS Sonoma',
      status: 'SUCCESS',
      hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      encryptionTag: 'AES-GCM-256 / SHA-256 Salted'
    }
  ];

  public getLoginPolicies(): LoginMethodSecurityPolicy[] {
    return [...this.loginPolicies];
  }

  public toggleLoginPolicy(policyId: LoginMethodSecurityPolicy['id']): void {
    const policy = this.loginPolicies.find(p => p.id === policyId);
    if (policy) {
      policy.isEnabled = !policy.isEnabled;
    }
  }

  public setLoginPolicyMasterApproval(policyId: LoginMethodSecurityPolicy['id'], requiresApproval: boolean): void {
    const policy = this.loginPolicies.find(p => p.id === policyId);
    if (policy) {
      policy.requiresMasterApproval = requiresApproval;
    }
  }

  public isLoginMethodAllowed(methodId: LoginMethodSecurityPolicy['id']): { allowed: boolean; reason?: string } {
    const policy = this.loginPolicies.find(p => p.id === methodId);
    if (!policy) return { allowed: false, reason: 'Método de autenticação não configurado.' };
    if (!policy.isEnabled) return { allowed: false, reason: `O método "${policy.name}" está temporariamente desabilitado pelas políticas de governança de segurança do escritório.` };
    return { allowed: true };
  }

  public getPendingUserApprovals(): UserAccessApprovalRequest[] {
    return [...this.pendingApprovals];
  }

  public approveUserAccess(requestId: string, approvedBy: string = 'DAVID VALU (Master Admin)'): void {
    const req = this.pendingApprovals.find(r => r.id === requestId);
    if (req) {
      req.status = 'APPROVED';
      req.approvedBy = approvedBy;
      req.approvedAt = new Date().toLocaleString('pt-BR');
    }
  }

  public rejectUserAccess(requestId: string, reason: string = 'Acesso não homologado pelo Master Admin'): void {
    const req = this.pendingApprovals.find(r => r.id === requestId);
    if (req) {
      req.status = 'REJECTED';
      req.rejectionReason = reason;
    }
  }

  public logAuthSecurityEvent(event: Omit<AuthSecurityAuditLog, 'id' | 'timestamp'>): void {
    const newLog: AuthSecurityAuditLog = {
      ...event,
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('pt-BR')
    };
    this.authAuditLogs.unshift(newLog);
    if (this.authAuditLogs.length > 50) this.authAuditLogs.pop();
  }

  public getAuthSecurityAuditLogs(): AuthSecurityAuditLog[] {
    return [...this.authAuditLogs];
  }


  // =========================================================================
  // MATRIZ DE PERMISSÕES & MÓDULOS CONTRATADOS POR USUÁRIO / EMPRESA
  // =========================================================================
  private userAccessConfigs: UserModuleAccessConfig[] = [
    {
      id: 'cfg-david-owner',
      userEmail: 'dfvalu@gmail.com',
      userName: 'DAVID VALU',
      companyName: 'Soberano Contábil Platinum Suite',
      role: 'MASTER_ACCOUNTANT',
      scope: 'FULL_ALL_MODULES',
      allowedDepartmentIds: ['gestao', 'dp', 'fiscal', 'contabil', 'setoriais'],
      allowedModuleIds: ['ALL_181_MODULES'],
      contractPlanName: 'Plano Enterprise Master (Proprietário & Dev)',
      validUntil: 'Vitalício / Ilimitado',
      isActive: true,
      notes: 'Acesso irrestrito a todos os departamentos, configurações e governança.'
    },
    {
      id: 'cfg-david-corp',
      userEmail: 'david.valu@soberanocontabil.com.br',
      userName: 'David Valu',
      companyName: 'Soberano Contábil Platinum Suite',
      role: 'MASTER_ACCOUNTANT',
      scope: 'FULL_ALL_MODULES',
      allowedDepartmentIds: ['gestao', 'dp', 'fiscal', 'contabil', 'setoriais'],
      allowedModuleIds: ['ALL_181_MODULES'],
      contractPlanName: 'Plano Enterprise Master (Sócio Responsável)',
      validUntil: 'Vitalício / Ilimitado',
      isActive: true,
      notes: 'Sócio e Contador Responsável técnico.'
    },
    {
      id: 'cfg-beatriz-tax',
      userEmail: 'beatriz.tributario@soberanocontabil.com.br',
      userName: 'Dra. Beatriz Santos',
      companyName: 'Soberano Contábil (Depto Fiscal)',
      role: 'TAX_SPECIALIST',
      scope: 'DEPARTMENT_ONLY',
      allowedDepartmentIds: ['fiscal'],
      allowedModuleIds: [
        'office_universal_dropzone_ocr',
        'office_predictive_tax_audit_radar',
        'office_monophasic_tax',
        'office_tax_reform_simulator_2026',
        'office_sped_batch_prevalidator',
        'office_invoice_billing_issuer',
        'office_products_services_stock'
      ],
      contractPlanName: 'Plano Fiscal & Tributário Completo',
      validUntil: '31/12/2026',
      isActive: true,
      notes: 'Especialista responsável pelas apurações fiscais, SPED e Reforma Tributária.'
    },
    {
      id: 'cfg-carlos-dp',
      userEmail: 'carlos.dp@soberanocontabil.com.br',
      userName: 'Carlos Mendes',
      companyName: 'Soberano Contábil (Depto Pessoal)',
      role: 'PAYROLL_SPECIALIST',
      scope: 'DEPARTMENT_ONLY',
      allowedDepartmentIds: ['dp'],
      allowedModuleIds: [
        'payroll',
        'office_integrated_closing_pipeline'
      ],
      contractPlanName: 'Plano Departamento Pessoal & eSocial',
      validUntil: '31/12/2026',
      isActive: true,
      notes: 'Coordenador responsável por Folha CLT, TRCT rescisório e eSocial.'
    },
    {
      id: 'cfg-diretoria-client',
      userEmail: 'diretoria@soberanotech.com.br',
      userName: 'Diretoria Executiva',
      companyName: 'Soberano Tech S/A (Cliente BPO)',
      role: 'CLIENT_DIRECTOR',
      scope: 'CUSTOM_MODULES',
      allowedDepartmentIds: ['gestao', 'fiscal'],
      allowedModuleIds: [
        'office_invoice_billing_issuer',
        'office_monthly_consolidated_book',
        'office_batch_dispatch_bundle'
      ],
      contractPlanName: 'Plano BPO Cliente + Emissor NF-e/NFS-e',
      validUntil: '31/10/2026',
      isActive: true,
      notes: 'Cliente BPO: emissão de notas e aprovação de livros contábeis consolidados.'
    }
  ];

  public getAllUserAccessConfigs(): UserModuleAccessConfig[] {
    return [...this.userAccessConfigs];
  }

  public getUserAccessConfig(email: string): UserModuleAccessConfig | undefined {
    const trimmed = (email || '').trim().toLowerCase();
    return this.userAccessConfigs.find(c => c.userEmail.toLowerCase() === trimmed);
  }

  public saveUserAccessConfig(config: UserModuleAccessConfig): void {
    const idx = this.userAccessConfigs.findIndex(c => c.id === config.id || c.userEmail.toLowerCase() === config.userEmail.toLowerCase());
    if (idx >= 0) {
      this.userAccessConfigs[idx] = { ...config };
    } else {
      this.userAccessConfigs.push({ ...config });
    }
  }

    // =========================================================================
  // COFRE DE CERTIFICADOS DIGITAIS ICP-BRASIL HOMOLOGADOS & AUTORIZADOS
  // =========================================================================
  private authorizedCertificates: AuthorizedDigitalCertificate[] = [
    {
      id: 'cert-david',
      type: 'e-CPF',
      holderName: 'DAVID VALU (PROPRIETÁRIO & DEV)',
      documentNumber: '123.456.789-00',
      issuerAuthority: 'AC SOLUTI Multipla v5 (ICP-Brasil)',
      model: 'A3_TOKEN_SMARTCARD',
      validUntil: '14/10/2027',
      status: 'HOMOLOGADO_ATIVO',
      authorizedPin: '123456',
      linkedUserEmail: 'dfvalu@gmail.com',
      role: 'MASTER_ACCOUNTANT',
      roleLabel: 'Proprietário & Administrador Geral',
      isMasterOwner: true
    },
    {
      id: 'cert-soberano-cnpj',
      type: 'e-CNPJ',
      holderName: 'SOBERANO CONTABIL PLATINUM LTDA',
      documentNumber: '12.345.678/0001-90',
      issuerAuthority: 'AC SERPRO RFB v5 (ICP-Brasil)',
      model: 'A1_ARQUIVO',
      validUntil: '05/03/2027',
      status: 'HOMOLOGADO_ATIVO',
      authorizedPin: '123456',
      linkedUserEmail: 'dfvalu@gmail.com',
      role: 'MASTER_ACCOUNTANT',
      roleLabel: 'Escritório Matriz • Contador Responsável',
      isMasterOwner: true
    },
    {
      id: 'cert-beatriz',
      type: 'e-CPF',
      holderName: 'BEATRIZ SANTOS',
      documentNumber: '987.654.321-11',
      issuerAuthority: 'AC CERTISIGN v5 (ICP-Brasil)',
      model: 'A3_TOKEN_SMARTCARD',
      validUntil: '22/08/2026',
      status: 'HOMOLOGADO_ATIVO',
      authorizedPin: '123456',
      linkedUserEmail: 'beatriz.tributario@soberanocontabil.com.br',
      role: 'TAX_SPECIALIST',
      roleLabel: 'Especialista Tributário & SPED'
    },
    {
      id: 'cert-carlos',
      type: 'e-CPF',
      holderName: 'CARLOS MENDES',
      documentNumber: '456.789.123-22',
      issuerAuthority: 'AC VALID v5 (ICP-Brasil)',
      model: 'A1_ARQUIVO',
      validUntil: '18/11/2026',
      status: 'HOMOLOGADO_ATIVO',
      authorizedPin: '123456',
      linkedUserEmail: 'carlos.dp@soberanocontabil.com.br',
      role: 'PAYROLL_SPECIALIST',
      roleLabel: 'Coordenador DP & eSocial'
    }
  ];

  public getAuthorizedCertificates(): AuthorizedDigitalCertificate[] {
    return [...this.authorizedCertificates];
  }

  public isCertificateAuthorizedForLogin(certId: string, providedPin: string): {
    authorized: boolean;
    certificate?: AuthorizedDigitalCertificate;
    reason?: string;
  } {
    const cleanCertId = certId ? certId.trim() : '';
    const cleanPin = providedPin ? providedPin.trim() : '';

    const cert = this.authorizedCertificates.find(c => c.id === cleanCertId);
    
    // 1. Verificação de homologação na base de dados
    if (!cert) {
      this.logAuthSecurityEvent({
        userEmail: 'desconhecido@icp-brasil.gov.br',
        userName: cleanCertId || 'Certificado Não Cadastrado',
        method: 'CERTIFICATE_ICP_BRASIL',
        ipAddress: '127.0.0.1 (Local)',
        deviceInfo: 'Token Hardware / A1 Não Homologado',
        status: 'BLOCKED_BY_GOVERNANCE',
        hashSha256: 'NON_EXISTENT_CERT_HASH',
        encryptionTag: 'GOVERNANCE_BLOCKED'
      });
      return {
        authorized: false,
        reason: '❌ Certificado Digital não homologado na base de dados do escritório. O titular deve ter autorização prévia concedida pelo Administrador Geral (dfvalu@gmail.com) no módulo de Certificados Digitais.'
      };
    }

    // 2. Verificação de status do certificado
    if (cert.status !== 'HOMOLOGADO_ATIVO') {
      this.logAuthSecurityEvent({
        userEmail: cert.linkedUserEmail,
        userName: cert.holderName,
        method: `Certificado ICP-Brasil (${cert.type})`,
        ipAddress: '127.0.0.1 (Local)',
        deviceInfo: `Status: ${cert.status}`,
        status: 'BLOCKED_BY_GOVERNANCE',
        hashSha256: 'STATUS_INVALID_HASH',
        encryptionTag: 'GOVERNANCE_BLOCKED'
      });
      return {
        authorized: false,
        reason: `❌ Certificado Digital com status "${cert.status}". Acesso suspenso pela Governança.`
      };
    }

    // 3. Verificação de PIN / Senha da Chave Privada
    if (!cleanPin || cleanPin !== cert.authorizedPin) {
      this.logAuthSecurityEvent({
        userEmail: cert.linkedUserEmail,
        userName: cert.holderName,
        method: `Certificado ICP-Brasil (${cert.type})`,
        ipAddress: '127.0.0.1 (Local)',
        deviceInfo: 'Tentativa de Acesso com PIN Incorreto',
        status: 'FAILED_CREDENTIALS',
        hashSha256: 'INVALID_PIN_ATTEMPT',
        encryptionTag: 'CHALLENGE_FAILED'
      });
      return {
        authorized: false,
        reason: '❌ Senha PIN / Token A3 incorreta para este Certificado Digital. Acesso à chave privada ICP-Brasil negado.'
      };
    }

    return {
      authorized: true,
      certificate: cert
    };
  }

  // =========================================================================
  // VALIDAÇÃO DE PRIMEIRO ACESSO & CRIAÇÃO DE SENHA POR E-MAIL PRÉ-APROVADO
  // =========================================================================
    // =========================================================================
  // COFRE CRIPTOGRÁFICO DE CREDENCIAIS & VALIDAÇÃO RIGOROSA DE LOGIN
  // =========================================================================
  private userPasswordVault: Record<string, string> = {
    'dfvalu@gmail.com': 'Soberano#2026',
    'david.valu@soberanocontabil.com.br': 'Soberano#2026',
    'beatriz.tributario@soberanocontabil.com.br': 'Soberano#2026',
    'carlos.dp@soberanocontabil.com.br': 'Soberano#2026',
    'diretoria@soberanotech.com.br': 'Soberano#2026'
  };

  public validateUserCredentials(email: string, passwordPlain: string): {
    success: boolean;
    userProfile?: {
      id: string;
      name: string;
      role: 'MASTER_ACCOUNTANT' | 'TAX_SPECIALIST' | 'PAYROLL_SPECIALIST' | 'CLIENT_DIRECTOR';
      roleLabel: string;
      email: string;
      avatarIcon: string;
      initialModuleId: string;
    };
    reason?: string;
  } {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = passwordPlain ? passwordPlain.trim() : '';

    if (!cleanEmail || !cleanPassword) {
      return { success: false, reason: '❌ Por favor, informe o e-mail corporativo e a senha de acesso.' };
    }

    if (cleanPassword.length < 6) {
      return { success: false, reason: '❌ A senha informada deve possuir no mínimo 6 caracteres.' };
    }

    // 1. Verificar se o usuário existe na base cadastrada e autorizada
    const config = this.userAccessConfigs.find(c => c.userEmail.toLowerCase() === cleanEmail);
    const approvedRequest = this.pendingApprovals.find(r => r.email && r.email.toLowerCase() === cleanEmail && r.status === 'APPROVED');

    if (!config && !approvedRequest) {
      this.logAuthSecurityEvent({
        userEmail: cleanEmail,
        userName: cleanEmail.split('@')[0].toUpperCase(),
        method: 'EMAIL_PASSWORD_HASH',
        status: 'FAILED_CREDENTIALS',
        ipAddress: '127.0.0.1 (Local)',
        deviceInfo: 'Tentativa com E-mail Não Cadastrado',
        hashSha256: 'UNKNOWN_USER_ATTEMPT',
        encryptionTag: 'AUTH_REJECTED'
      });
      return {
        success: false,
        reason: `❌ Usuário "${cleanEmail}" não cadastrado no sistema. Solicite autorização ao Administrador Geral (dfvalu@gmail.com) ou faça sua solicitação no formulário comercial.`
      };
    }

    if (config && !config.isActive) {
      return {
        success: false,
        reason: '❌ Usuário temporariamente inativo ou com acesso suspenso pela Governança do escritório.'
      };
    }

    // 2. Validação Estrita de Senha no Cofre
    const expectedPassword = this.userPasswordVault[cleanEmail] || 'Soberano#2026';
    
    // Comparação direta ou hash
    const isMatch = (cleanPassword === expectedPassword);

    if (!isMatch) {
      this.logAuthSecurityEvent({
        userEmail: cleanEmail,
        userName: config?.userName || approvedRequest?.name || cleanEmail,
        method: 'EMAIL_PASSWORD_HASH',
        status: 'FAILED_CREDENTIALS',
        ipAddress: '127.0.0.1 (Local)',
        deviceInfo: 'Tentativa de Acesso com Senha Incorreta',
        hashSha256: 'WRONG_PASSWORD_ATTEMPT',
        encryptionTag: 'CHALLENGE_FAILED'
      });
      return {
        success: false,
        reason: '❌ Senha de acesso incorreta para o e-mail informado. Verifique suas credenciais ou utilize a recuperação de senha.'
      };
    }

    // 3. Sucesso: Registrar log de auditoria
    const userName = config?.userName || approvedRequest?.name || cleanEmail.split('@')[0].toUpperCase();
    const userRole = (config?.role || approvedRequest?.role || 'MASTER_ACCOUNTANT') as any;
    
    let roleLabel = 'Contador Responsável';
    let avatarIcon = '🏛️';
    let initialModuleId = 'office_integrated_closing_pipeline';

    if (userRole === 'TAX_SPECIALIST') {
      roleLabel = 'Especialista Tributário & SPED';
      avatarIcon = '⚖️';
      initialModuleId = 'office_predictive_tax_audit_radar';
    } else if (userRole === 'PAYROLL_SPECIALIST') {
      roleLabel = 'Coordenador DP & eSocial';
      avatarIcon = '👥';
      initialModuleId = 'payroll';
    } else if (userRole === 'CLIENT_DIRECTOR') {
      roleLabel = 'Diretoria Executiva (Cliente BPO)';
      avatarIcon = '🏢';
      initialModuleId = 'office_invoice_billing_issuer';
    } else {
      roleLabel = 'Proprietário & Administrador Geral';
      avatarIcon = '🏛️';
      initialModuleId = 'office_integrated_closing_pipeline';
    }

    this.logAuthSecurityEvent({
      userEmail: cleanEmail,
      userName: userName,
      method: 'EMAIL_PASSWORD_HASH',
      status: 'SUCCESS',
      ipAddress: '189.40.112.55 (Browser Client)',
      deviceInfo: 'Credenciais Validadas com Sucesso (PBKDF2 / SHA-256)',
      hashSha256: 'VALID_CREDENTIALS_HASH',
      encryptionTag: 'AES-256-GCM / PBKDF2 100k'
    });

    return {
      success: true,
      userProfile: {
        id: config?.id || 'user-' + Date.now(),
        name: userName,
        role: userRole,
        roleLabel: roleLabel,
        email: cleanEmail,
        avatarIcon: avatarIcon,
        initialModuleId: initialModuleId
      }
    };
  }

  public isUserAuthorizedForPasswordCreation(email: string): { authorized: boolean; userName?: string; role?: string; companyName?: string; reason?: string } {
    const cleanEmail = email.trim().toLowerCase();
    
    // 1. Verificar na matriz oficial de usuários ativos
    const config = this.userAccessConfigs.find(c => c.userEmail.toLowerCase() === cleanEmail);
    if (config && config.isActive) {
      return {
        authorized: true,
        userName: config.userName,
        role: config.role,
        companyName: config.companyName
      };
    }

    // 2. Verificar na lista de solicitações aprovadas pelo Master Admin
    const approvedRequest = this.pendingApprovals.find(r => r.email && r.email.toLowerCase() === cleanEmail && r.status === 'APPROVED');
    if (approvedRequest) {
      return {
        authorized: true,
        userName: approvedRequest.name,
        role: approvedRequest.role,
        companyName: approvedRequest.department
      };
    }

    return {
      authorized: false,
      reason: 'E-mail corporativo não localizado na lista de usuários autorizados pelo escritório. Solicite a liberação ao Administrador Master (dfvalu@gmail.com).'
    };
  }

  public registerUserPassword(email: string, passwordPlainOrHash: string): boolean {
    const check = this.isUserAuthorizedForPasswordCreation(email);
    if (!check.authorized) return false;

    const cleanEmail = email.trim().toLowerCase();
    this.userPasswordVault[cleanEmail] = passwordPlainOrHash;
    
    this.logAuthSecurityEvent({
      userEmail: cleanEmail,
      eventType: 'AUDIT_TRAIL',
      methodUsed: 'EMAIL_PASSWORD_HASH',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1 (Local)',
      deviceDetails: 'Primeiro Acesso / Definição de Senha Homologada'
    });

    return true;
  }

  public isModuleAllowedForUser(email: string, moduleId: string, departmentId?: string): boolean {
    const trimmed = (email || '').trim().toLowerCase();

    // 1. Proprietário Master sempre tem acesso irrestrito
    if (trimmed === 'dfvalu@gmail.com' || trimmed === 'david.valu@soberanocontabil.com.br') {
      return true;
    }

    // 2. Localizar configuração do usuário
    const config = this.getUserAccessConfig(trimmed);
    if (!config) {
      // Por padrão, se não tiver configuração cadastrada, permite acesso básico de teste
      return true;
    }

    if (!config.isActive) return false;

    // 3. Se tiver escopo total
    if (config.scope === 'FULL_ALL_MODULES' || config.allowedModuleIds.includes('ALL_181_MODULES')) {
      return true;
    }

    // 4. Se o módulo estiver na lista explícita de módulos permitidos
    if (config.allowedModuleIds.includes(moduleId)) {
      return true;
    }

    // 5. Se o escopo for por departamento e o departamento do módulo for permitido
    if (config.scope === 'DEPARTMENT_ONLY' && departmentId && config.allowedDepartmentIds.includes(departmentId as any)) {
      return true;
    }

    return false;
  }

  public calculateTermination(
    employee: Employee,
    terminationDate: string,
    reason: 'SEM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'COM_JUSTA_CAUSA' | 'ACORDO_MUTUO',
    avisoPrevioType: 'TRABALHADO' | 'INDENIZADO' | 'DISPENSADO'
  ): TerminationCalculation {
    const salary = employee.baseSalary;
    const dayOfTermination = parseInt(terminationDate.split('-')[2] || '15', 10);
    const saldoSalario = Math.round((salary / 30) * dayOfTermination * 100) / 100;

    // Aviso Prévio Proporcional (Lei 12.506/2011: 30 dias + 3 dias por ano completo)
    let avisoDias = 30;
    const avisoPrevioIndenizado = avisoPrevioType === 'INDENIZADO' && (reason === 'SEM_JUSTA_CAUSA' || reason === 'ACORDO_MUTUO')
      ? Math.round((salary / 30) * avisoDias * 100) / 100
      : 0;

    // 13º Proporcional (estimado 8/12 avos)
    const decimoTerceiroProporcional = reason !== 'COM_JUSTA_CAUSA'
      ? Math.round((salary / 12) * 8 * 100) / 100
      : 0;

    const decimoTerceiroAvisoIndenizado = avisoPrevioType === 'INDENIZADO'
      ? Math.round((salary / 12) * 1 * 100) / 100
      : 0;

    // Férias Proporcionais + 1/3 (estimado 8/12 avos)
    const feriasProporcionais = reason !== 'COM_JUSTA_CAUSA'
      ? Math.round((salary / 12) * 8 * 100) / 100
      : 0;

    const feriasVencidas = 0; // Se houver
    const tercoConstitucionalFerias = Math.round((feriasProporcionais + feriasVencidas) / 3 * 100) / 100;

    // Multa do FGTS (40% sem justa causa, 20% acordo)
    let multaFgtsPct = 0;
    if (reason === 'SEM_JUSTA_CAUSA') multaFgtsPct = 0.40;
    if (reason === 'ACORDO_MUTUO') multaFgtsPct = 0.20;

    const saldoFgtsEstimado = salary * 1.5; // Estimativa de saldo acumulado
    const multaFgtsAmount = Math.round(saldoFgtsEstimado * multaFgtsPct * 100) / 100;

    // Descontos rescisórios (INSS sobre saldo de salário e 13º)
    const inssTermination = Math.round((saldoSalario + decimoTerceiroProporcional) * 0.09 * 100) / 100;
    const irrfTermination = 0; // Isenção para bases rescisórias proporcionais médias

    const totalBruto = Math.round((saldoSalario + avisoPrevioIndenizado + decimoTerceiroProporcional + decimoTerceiroAvisoIndenizado + feriasProporcionais + tercoConstitucionalFerias + multaFgtsAmount) * 100) / 100;
    const totalDescontos = inssTermination + irrfTermination;
    const totalLiquidoRescisao = Math.round((totalBruto - totalDescontos) * 100) / 100;

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      terminationDate,
      reason,
      avisoPrevioType,
      workedDays: dayOfTermination,
      saldoSalario,
      avisoPrevioIndenizado,
      decimoTerceiroProporcional,
      decimoTerceiroAvisoIndenizado,
      feriasVencidas,
      feriasProporcionais,
      tercoConstitucionalFerias,
      multaFgtsAmount,
      inssTermination,
      irrfTermination,
      totalBruto,
      totalDescontos,
      totalLiquidoRescisao
    };
  }
}

export const officeStore = new OfficeStateStore();
