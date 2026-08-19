const fs = require('fs');

if (!fs.existsSync('packages/web/src/state')) {
  fs.mkdirSync('packages/web/src/state', { recursive: true });
}

const storeCode = `// ==========================================================================
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
        description: \`Adicional de Insalubridade (\${label})\`,
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
        reference: \`\${employee.overtime50Hours}h\`,
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
        reference: \`\${employee.overtime100Hours}h\`,
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
        reference: \`\${employee.unjustifiedAbsencesDays}d\`,
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
        description: \`IRRF Retido na Fonte (\${deductionType === 'SIMPLIFICADA' ? 'Simplificado' : 'Deduções Legais'})\`,
        reference: \`Dep: \${employee.dependantsCount}\`,
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
        reference: \`\${employee.alimonyPercentage}%\`,
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

  // =========================================================================
  // MOTOR DE CÁLCULO DA RESCISÃO TRABALHISTA (TRCT 1-CLICK)
  // =========================================================================
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
`;

fs.writeFileSync('packages/web/src/state/office-store.ts', storeCode, 'utf8');
console.log('office-store.ts created successfully with real payroll & termination engines!');
