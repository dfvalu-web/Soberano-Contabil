// SOBERANO CONTÁBIL — MOTOR INTELIGENTE DE SANDBOX & QUARENTENA EMPRESARIAL
// Isolamento seguro de empresas para testes, reclassificações contábeis, auditoria pré-liberação e simulações tributárias

export interface SandboxDiagnosticCheck {
  id: string;
  name: string;
  category: 'CONTABIL' | 'FISCAL' | 'FOLHA_DP' | 'SISTEMICA';
  status: 'PASSED' | 'WARNING' | 'FAILED';
  details: string;
  recommendation: string;
}

export interface SandboxScenarioResult {
  scenarioName: string;
  appliedAt: string;
  taxImpactMonthly: number;
  cashFlowImpact: number;
  complianceScore: number;
  observations: string[];
}

export interface SandboxCompanyInstance {
  id: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  originalTaxRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  sandboxTaxRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  quarantineReason: string;
  quarantineDate: string;
  isolatedBy: string;
  status: 'EM_QUARENTENA' | 'EM_SIMULACAO' | 'AUDITORIA_APROVADA' | 'PRONTO_PARA_PRODUCAO';
  assetBalance: number;
  liabilityBalance: number;
  balanceDifference: number;
  isBalanced: boolean;
  totalTransactionsIsolated: number;
  totalEmployeesIsolated: number;
  appliedScenarios: SandboxScenarioResult[];
  diagnosticChecks: SandboxDiagnosticCheck[];
}

export class OfficeSandboxEngine {
  private static mockInstances: SandboxCompanyInstance[] = [
    {
      id: 'SBX-001',
      cnpj: '33.123.456/0001-88',
      corporateName: 'DELTA TECH INFORMATICA E SERVICOS DIGITAIS LTDA',
      tradeName: 'Delta Cloud Systems',
      originalTaxRegime: 'SIMPLES_NACIONAL',
      sandboxTaxRegime: 'LUCRO_PRESUMIDO',
      quarantineReason: 'Simulação de Migração Tributária (Estouro de Sublimite ICMS) e Auditoria de Balanço',
      quarantineDate: '20/08/2026 09:30',
      isolatedBy: 'dfvalu@gmail.com',
      status: 'EM_SIMULACAO',
      assetBalance: 1850400.50,
      liabilityBalance: 1850400.50,
      balanceDifference: 0.00,
      isBalanced: true,
      totalTransactionsIsolated: 412,
      totalEmployeesIsolated: 18,
      appliedScenarios: [
        {
          scenarioName: 'Enquadramento no Lucro Presumido (Alíquota Efetiva 13.33% com Fator R)',
          appliedAt: '20/08/2026 10:15',
          taxImpactMonthly: -12450.00,
          cashFlowImpact: 149400.00,
          complianceScore: 99.2,
          observations: [
            'Economia tributária líquida estimada de R$ 149.400,00 ao ano comparado ao Anexo V do Simples.',
            'Redução de risco fiscal em relação a créditos acumulados de ISSQN municipal.'
          ]
        }
      ],
      diagnosticChecks: [
        {
          id: 'CHK-01',
          name: 'Equação Patrimonial de Abertura',
          category: 'CONTABIL',
          status: 'PASSED',
          details: 'Total Ativo (R$ 1.850.400,50) == Total Passivo + PL (R$ 1.850.400,50).',
          recommendation: 'Conciliação em partidas dobradas 100% perfeita.'
        },
        {
          id: 'CHK-02',
          name: 'Convergência eSocial S-1010 x S-5001',
          category: 'FOLHA_DP',
          status: 'PASSED',
          details: 'Todas as 18 rubricas salariais com incidências de INSS e FGTS homologadas.',
          recommendation: 'Folha de pagamento pronta para transmissão sem alertas de divergência.'
        },
        {
          id: 'CHK-03',
          name: 'SPED Fiscal EFD ICMS/IPI Bloco C100',
          category: 'FISCAL',
          status: 'WARNING',
          details: '4 notas fiscais de entrada de ativo imobilizado aguardam validação de crédito CIAP.',
          recommendation: 'Aprovar o crédito de 1/48 avos do ICMS antes da publicação em produção.'
        },
        {
          id: 'CHK-04',
          name: 'Certidões Negativas de Débitos (CND RFB / FGTS / CNDT)',
          category: 'SISTEMICA',
          status: 'PASSED',
          details: 'Todas as 3 certidões válidas e vigentes até Dezembro/2026.',
          recommendation: 'Nenhuma pendência fiscal cadastrada no e-CAC.'
        }
      ]
    },
    {
      id: 'SBX-002',
      cnpj: '11.987.654/0001-22',
      corporateName: 'OMEGA LOGISTICA E TRANSPORTES RODOVIARIOS S/A',
      tradeName: 'Omega Express Cargo',
      originalTaxRegime: 'LUCRO_REAL',
      sandboxTaxRegime: 'LUCRO_REAL',
      quarantineReason: 'Investigação de Divergência de Inventário Físico vs Contábil (Bloco K do SPED)',
      quarantineDate: '19/08/2026 16:45',
      isolatedBy: 'dfvalu@gmail.com',
      status: 'EM_QUARENTENA',
      assetBalance: 5420000.00,
      liabilityBalance: 5418200.00,
      balanceDifference: 1800.00,
      isBalanced: false,
      totalTransactionsIsolated: 1250,
      totalEmployeesIsolated: 64,
      appliedScenarios: [],
      diagnosticChecks: [
        {
          id: 'CHK-01',
          name: 'Equação Patrimonial de Abertura',
          category: 'CONTABIL',
          status: 'FAILED',
          details: 'Diferença de R$ 1.800,00 no grupo de Estoques de Combustível.',
          recommendation: 'Realizar lançamento de ajuste de inventário a crédito de Estoques e débito de CMV.'
        },
        {
          id: 'CHK-02',
          name: 'Auditoria de Folha e Ponto Eletrônico',
          category: 'FOLHA_DP',
          status: 'PASSED',
          details: 'Horas extras de motoristas alinhadas à Lei 13.103/2015.',
          recommendation: 'Massa salarial 100% conciliada.'
        }
      ]
    }
  ];

  public static getIsolatedCompanies(): SandboxCompanyInstance[] {
    return [...this.mockInstances];
  }

  public static isolateCompany(
    cnpj: string,
    corporateName: string,
    tradeName: string,
    taxRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL',
    reason: string,
    userEmail: string
  ): SandboxCompanyInstance {
    const newId = 'SBX-' + Math.floor(100 + Math.random() * 900);
    const newInstance: SandboxCompanyInstance = {
      id: newId,
      cnpj,
      corporateName,
      tradeName,
      originalTaxRegime: taxRegime,
      sandboxTaxRegime: taxRegime,
      quarantineReason: reason,
      quarantineDate: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      isolatedBy: userEmail,
      status: 'EM_QUARENTENA',
      assetBalance: 1250000.00,
      liabilityBalance: 1250000.00,
      balanceDifference: 0.00,
      isBalanced: true,
      totalTransactionsIsolated: 180,
      totalEmployeesIsolated: 12,
      appliedScenarios: [],
      diagnosticChecks: [
        {
          id: 'CHK-01',
          name: 'Equação Patrimonial de Abertura',
          category: 'CONTABIL',
          status: 'PASSED',
          details: 'Total Ativo == Total Passivo + PL.',
          recommendation: 'Pronto para testes e simulações seguras.'
        }
      ]
    };
    this.mockInstances.unshift(newInstance);
    return newInstance;
  }

  public static runDeepDiagnostic(instanceId: string): SandboxCompanyInstance | null {
    const inst = this.mockInstances.find(i => i.id === instanceId);
    if (!inst) return null;

    inst.status = inst.isBalanced ? 'AUDITORIA_APROVADA' : 'EM_QUARENTENA';
    return { ...inst };
  }

  public static applyTaxScenario(
    instanceId: string,
    targetRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'
  ): SandboxCompanyInstance | null {
    const inst = this.mockInstances.find(i => i.id === instanceId);
    if (!inst) return null;

    inst.sandboxTaxRegime = targetRegime;
    inst.status = 'EM_SIMULACAO';
    inst.appliedScenarios.push({
      scenarioName: `Simulação de Enquadramento no ${targetRegime}`,
      appliedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      taxImpactMonthly: targetRegime === 'LUCRO_PRESUMIDO' ? -8500 : -14200,
      cashFlowImpact: targetRegime === 'LUCRO_PRESUMIDO' ? 102000 : 170400,
      complianceScore: 98.8,
      observations: [
        `Cenário de ${targetRegime} testado com sucesso no Sandbox sem nenhum impacto na produção.`,
        'Relatórios contábeis e fiscais simulados gerados para tomada de decisão.'
      ]
    });

    return { ...inst };
  }

  public static fixDiscrepancy(instanceId: string): SandboxCompanyInstance | null {
    const inst = this.mockInstances.find(i => i.id === instanceId);
    if (!inst) return null;

    inst.liabilityBalance = inst.assetBalance;
    inst.balanceDifference = 0.00;
    inst.isBalanced = true;
    inst.status = 'AUDITORIA_APROVADA';
    inst.diagnosticChecks.forEach(chk => {
      if (chk.id === 'CHK-01') {
        chk.status = 'PASSED';
        chk.details = 'Divergência corrigida no Sandbox! Partidas dobradas 100% conciliadas.';
      }
    });

    return { ...inst };
  }

  public static promoteToProduction(instanceId: string, userEmail: string): { success: boolean; message: string } {
    const inst = this.mockInstances.find(i => i.id === instanceId);
    if (!inst) return { success: false, message: 'Empresa não encontrada no Sandbox.' };

    if (!inst.isBalanced) {
      return { success: false, message: 'Impossível promover para produção: a empresa possui divergências não resolvidas.' };
    }

    inst.status = 'PRONTO_PARA_PRODUCAO';
    return {
      success: true,
      message: `Empresa "${inst.corporateName}" homologada com sucesso e promovida para a produção por ${userEmail}!`
    };
  }

  public static releaseFromQuarantine(instanceId: string): boolean {
    const idx = this.mockInstances.findIndex(i => i.id === instanceId);
    if (idx !== -1) {
      this.mockInstances.splice(idx, 1);
      return true;
    }
    return false;
  }
}
