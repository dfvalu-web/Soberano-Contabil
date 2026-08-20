/**
 * SOBERANO CONTÁBIL — PLATINUM SUITE ENTERPRISE v4.3
 * Catálogo Oficial de Navegação & Mapeamento Departamental (181 Módulos / 5 Departamentos)
 */

export type DepartmentId = 'gestao' | 'dp' | 'fiscal' | 'contabil' | 'setoriais';

export interface NavigationModule {
  id: string;
  name: string;
  label: string;
  icon: string;
  file?: string;
  badge?: string;
  isNew?: boolean;
  departmentId: DepartmentId;
  isCore: boolean;
}

export interface DepartmentCategory {
  id: DepartmentId;
  name: string;
  category: string;
  icon: string;
  iconName: string;
  tag: string;
  isCore: boolean;
  defaultCollapsed: boolean;
  modules: NavigationModule[];
  items: NavigationModule[];
}

export const DEPARTMENT_CATEGORIES: DepartmentCategory[] = [
  {
    "id": "gestao",
    "name": "Gestão & Cockpit do Escritório",
    "category": "Gestão & Cockpit do Escritório",
    "icon": "🏛️",
    "iconName": "Building2",
    "tag": "GESTAO",
    "isCore": true,
    "defaultCollapsed": false,
    "modules": [
      {
        "id": "office_sandbox_isolation_lab",
        "name": "Laboratório Sandbox & Quarentena de Empresas",
        "label": "Laboratório Sandbox & Quarentena de Empresas",
        "icon": "🧪",
        "badge": "Quarentena",
        "file": "OfficeSandboxIsolationLabView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_login_security_governance",
        "name": "Controle de Acesso & Governança de Login",
        "label": "Controle de Acesso & Governança de Login",
        "icon": "🛡️",
        "file": "OfficeLoginSecurityGovernanceView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_integrated_closing_pipeline",
        "name": "Esteira de Fechamento Integrada (Pipeline)",
        "label": "Esteira de Fechamento Integrada (Pipeline)",
        "icon": "🚀",
        "file": "OfficeIntegratedClosingPipelineView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_multi_client_grid",
        "name": "Cockpit Multi-Empresa em Grade",
        "label": "Cockpit Multi-Empresa em Grade",
        "icon": "🚦",
        "file": "OfficeMultiClientClosingGridView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_universal_dropzone_ocr",
        "name": "Dropzone Massivo Multi-Doc OCR",
        "label": "Dropzone Massivo Multi-Doc OCR",
        "icon": "📂",
        "file": "OfficeUniversalDropzoneOcrView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_batch_dispatch_bundle",
        "name": "Disparo em Lote 1-Click (Guias/Pix)",
        "label": "Disparo em Lote 1-Click (Guias/Pix)",
        "icon": "🚀",
        "file": "OfficeBatchDispatchBundleView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "dashboard",
        "name": "Cockpit Executivo Principal",
        "label": "Cockpit Executivo Principal",
        "icon": "📊",
        "file": "DashboardView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "accounting_office_hub",
        "name": "Central do Escritório (4 Pilares)",
        "label": "Central do Escritório (4 Pilares)",
        "icon": "🏛️",
        "file": "AccountingOfficeHubView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_daily_operations",
        "name": "Operações Diárias (3 Pilares)",
        "label": "Operações Diárias (3 Pilares)",
        "icon": "⚙️",
        "file": "OfficeDailyOperationsHubView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_monthly_closing",
        "name": "Fechamento Mensal & Dossiê",
        "label": "Fechamento Mensal & Dossiê",
        "icon": "🗓️",
        "file": "OfficeMonthlyClosingChecklistView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_tasks_productivity",
        "name": "Tarefas & SLAs da Equipe",
        "label": "Tarefas & SLAs da Equipe",
        "icon": "📋",
        "file": "OfficeTasksProductivitySlaView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_client_profitability_bi",
        "name": "BI & Rentabilidade da Carteira",
        "label": "BI & Rentabilidade da Carteira",
        "icon": "📈",
        "file": "OfficeClientProfitabilityBiView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "client_portal_office",
        "name": "Portal do Cliente (B2B)",
        "label": "Portal do Cliente (B2B)",
        "icon": "🌐",
        "file": "ClientPortalOfficeView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "financial_bpo_office",
        "name": "BPO Financeiro & Fluxo de Caixa",
        "label": "BPO Financeiro & Fluxo de Caixa",
        "icon": "💼",
        "file": "FinancialBpoOfficeView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "corporate_legalization_cnd",
        "name": "Legalização & Gestão de CNDs",
        "label": "Legalização & Gestão de CNDs",
        "icon": "📜",
        "file": "CorporateLegalizationCndView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_redesim_viability",
        "name": "Viabilidade Redesim & Licenças",
        "label": "Viabilidade Redesim & Licenças",
        "icon": "🏢",
        "file": "OfficeRedesimViabilityLicensingView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_family_holding",
        "name": "Holding Familiar & Sucessão",
        "label": "Holding Familiar & Sucessão",
        "icon": "🏰",
        "file": "OfficeFamilyHoldingSuccessionView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_strategic_valuation",
        "name": "Valuation & Advisory Estratégico",
        "label": "Valuation & Advisory Estratégico",
        "icon": "🎯",
        "file": "OfficeStrategicAdvisoryValuationView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_corporate_governance",
        "name": "Governança & Atas Digitais",
        "label": "Governança & Atas Digitais",
        "icon": "⚖️",
        "file": "OfficeCorporateGovernanceAssemblyView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_fees_billing",
        "name": "Honorários & Cobrança Escritório",
        "label": "Honorários & Cobrança Escritório",
        "icon": "🧾",
        "file": "OfficeFeesBillingDunningView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_client_onboarding",
        "name": "Onboarding & Migração Clientes",
        "label": "Onboarding & Migração Clientes",
        "icon": "🚀",
        "file": "OfficeClientOnboardingMigrationView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_electronic_attorney",
        "name": "Procurações e-CAC & DJE",
        "label": "Procurações e-CAC & DJE",
        "icon": "⚖️",
        "file": "OfficeElectronicAttorneyDjeView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "security",
        "name": "Segurança & Ledger ACID",
        "label": "Segurança & Ledger ACID",
        "icon": "🛡️",
        "file": "SecurityLedgerView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_digital_certificates",
        "name": "Certificados Digitais & Assinador",
        "label": "Certificados Digitais & Assinador",
        "icon": "🔐",
        "file": "OfficeDigitalCertificatesSignerView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "cloud_hsm_pfx_vault",
        "name": "Cloud HSM & Cofre PFX A1",
        "label": "Cloud HSM & Cofre PFX A1",
        "icon": "🔒",
        "file": "CloudHsmPfxVaultView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "office_aml_coaf",
        "name": "Prevenção PLD & COAF / CFC",
        "label": "Prevenção PLD & COAF / CFC",
        "icon": "🚨",
        "file": "OfficeAmlCoafComplianceView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "gov_webservices_prod",
        "name": "WebServices Gov em Produção",
        "label": "WebServices Gov em Produção",
        "icon": "🔌",
        "file": "GovWebservicesProductionView",
        "departmentId": "gestao",
        "isCore": true
      },
      {
        "id": "sefaz_k8s_prod",
        "name": "SEFAZ mTLS & Transmissão Segura",
        "label": "SEFAZ mTLS & Transmissão Segura",
        "icon": "☸️",
        "file": "SefazDirectTransmissionK8sView",
        "departmentId": "gestao",
        "isCore": true
      }
    ]
  },
  {
    "id": "dp",
    "name": "Departamento Pessoal & Folha",
    "category": "Departamento Pessoal & Folha",
    "icon": "👥",
    "iconName": "Users",
    "tag": "DP",
    "isCore": true,
    "defaultCollapsed": false,
    "modules": [
      {
        "id": "office_rh_executive_reports_diamond",
        "name": "Dossiê Executivo de RH (Padrão Diamante)",
        "label": "Dossiê Executivo de RH (Padrão Diamante)",
        "icon": "💎",
        "file": "OfficeRhExecutiveReportsDiamondView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "payroll",
        "name": "Folha de Pagamento Central & Encargos",
        "label": "Folha de Pagamento Central & Encargos",
        "icon": "👥",
        "file": "PayrollView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_labor_termination",
        "name": "Rescisão Trabalhista & TRCT",
        "label": "Rescisão Trabalhista & TRCT",
        "icon": "📄",
        "file": "OfficeLaborTerminationTrctView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_absence_dsr_vacation",
        "name": "Faltas Injustificadas & Férias CLT",
        "label": "Faltas Injustificadas & Férias CLT",
        "icon": "⏱️",
        "file": "OfficeAbsenceDsrVacationPenaltyView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_hazardous_work",
        "name": "Insalubridade & Periculosidade (NR-15/16)",
        "label": "Insalubridade & Periculosidade (NR-15/16)",
        "icon": "☣️",
        "file": "OfficeHazardousWorkAdditionalView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_flexible_benefits_pat",
        "name": "Benefícios Flexíveis, VT & PAT",
        "label": "Benefícios Flexíveis, VT & PAT",
        "icon": "🍱",
        "file": "OfficeFlexibleBenefitsPatView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_cprb_payroll_relief",
        "name": "Desoneração da Folha (CPRB)",
        "label": "Desoneração da Folha (CPRB)",
        "icon": "📉",
        "file": "OfficeCprbPayrollReliefView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_alimony_child_support",
        "name": "Pensão Alimentícia Judicial",
        "label": "Pensão Alimentícia Judicial",
        "icon": "⚖️",
        "file": "OfficeAlimonyChildSupportPayrollView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_overtime_night_dsr",
        "name": "Horas Extras, Noturno & DSR",
        "label": "Horas Extras, Noturno & DSR",
        "icon": "⏰",
        "file": "OfficeOvertimeNightDsrView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_payroll_esocial_audit",
        "name": "Auditoria Folha & eSocial",
        "label": "Auditoria Folha & eSocial",
        "icon": "🛡️",
        "file": "OfficePayrollEsocialAuditView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_sst_esocial",
        "name": "SST eSocial & PPP Digital",
        "label": "SST eSocial & PPP Digital",
        "icon": "🦺",
        "file": "OfficeSstEsocialPppView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_vacation_leaves",
        "name": "Férias & Controle de Ponto",
        "label": "Férias & Controle de Ponto",
        "icon": "🏖️",
        "file": "OfficeVacationLeavesTimeTrackingView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_payroll_provisions",
        "name": "Provisões de Férias e 13º Salário",
        "label": "Provisões de Férias e 13º Salário",
        "icon": "📊",
        "file": "OfficePayrollProvisionsTerminationView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_internship_apprentice_audit_view",
        "name": "Office Internship Apprentice Audit",
        "label": "Office Internship Apprentice Audit",
        "icon": "🌐",
        "file": "OfficeInternshipApprenticeAuditView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "office_job_tenure_stability_inss_view",
        "name": "Office Job Tenure Stability Inss",
        "label": "Office Job Tenure Stability Inss",
        "icon": "🌐",
        "file": "OfficeJobTenureStabilityInssView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "port_workers_fap_payroll_view",
        "name": "Port Workers Fap Payroll",
        "label": "Port Workers Fap Payroll",
        "icon": "🌐",
        "file": "PortWorkersFapPayrollView",
        "departmentId": "dp",
        "isCore": true
      },
      {
        "id": "pension_defined_benefit_admission_active_view",
        "name": "Pension Defined Benefit Admission Active",
        "label": "Pension Defined Benefit Admission Active",
        "icon": "🌐",
        "file": "PensionDefinedBenefitAdmissionActiveView",
        "departmentId": "dp",
        "isCore": true
      }
    ]
  },
  {
    "id": "fiscal",
    "name": "Fiscal & Tributário",
    "category": "Fiscal & Tributário",
    "icon": "⚖️",
    "iconName": "Scale",
    "tag": "FISCAL",
    "isCore": true,
    "defaultCollapsed": false,
    "modules": [
      {
        "id": "office_predictive_tax_audit_radar",
        "name": "Radar de Malhas Fiscais & Auditoria RFB",
        "label": "Radar de Malhas Fiscais & Auditoria RFB",
        "icon": "🛡️",
        "file": "OfficePredictiveTaxAuditRadarView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_strategic_tax_regime_comparison",
        "name": "Simulador Reforma Tributária 2026–2033 (IBS/CBS)",
        "label": "Simulador Reforma Tributária 2026–2033 (IBS/CBS)",
        "icon": "⚖️",
        "file": "OfficeStrategicTaxRegimeComparisonView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_sped_batch_prevalidator",
        "name": "Geração & Validação de SPEDs (EFD/ECD/ECF)",
        "label": "Geração & Validação de SPEDs (EFD/ECD/ECF)",
        "icon": "⚡",
        "file": "OfficeSpedBatchPrevalidatorView",
        "badge": "SPED PVA",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_products_services_stock",
        "name": "Catálogo de Produtos, Estoques & Serviços",
        "label": "Catálogo de Produtos, Estoques & Serviços",
        "icon": "📦",
        "file": "OfficeProductsServicesStockView",
        "departmentId": "fiscal",
        "isCore": true
},
      {
        "id": "office_business_partners_registry",
        "name": "Cadastro de Clientes, Fornecedores & Parceiros",
        "label": "Cadastro de Clientes, Fornecedores & Parceiros",
        "icon": "👥",
        "file": "OfficeBusinessPartnersRegistryView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_invoice_billing_issuer",
        "name": "Emissor de Notas Fiscais (NF-e/NFS-e/NFC-e)",
        "label": "Emissor de Notas Fiscais (NF-e/NFS-e/NFC-e)",
        "icon": "🧾",
        "file": "OfficeInvoiceBillingIssuerView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_monophasic_tax",
        "name": "Monofásicos PIS/COFINS (Farmácias)",
        "label": "Monofásicos PIS/COFINS (Farmácias)",
        "icon": "💊",
        "file": "OfficeMonophasicTaxSegregationView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_card_pix_crossaudit",
        "name": "Cruzamento Cartões/PIX vs DF-e",
        "label": "Cruzamento Cartões/PIX vs DF-e",
        "icon": "💳",
        "file": "OfficeCardPixCrossAuditView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_returns_tax",
        "name": "Devoluções & Estornos de Crédito",
        "label": "Devoluções & Estornos de Crédito",
        "icon": "🔄",
        "file": "OfficeReturnsTaxAdjustmentView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_inventory_block_hk",
        "name": "Estoques & SPED Bloco H/K",
        "label": "Estoques & SPED Bloco H/K",
        "icon": "📦",
        "file": "OfficeInventoryBlockHKTaxAdjustmentView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_dda_matching",
        "name": "DDA Bancário vs Notas de Entrada",
        "label": "DDA Bancário vs Notas de Entrada",
        "icon": "📑",
        "file": "OfficeDdaBankingNfeMatchingView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_inbound_dfe",
        "name": "DF-e Entrada & Manifestação SEFAZ",
        "label": "DF-e Entrada & Manifestação SEFAZ",
        "icon": "📥",
        "file": "OfficeInboundDfeBookkeepingView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_state_ancillary",
        "name": "Obrigações Estaduais (GIA/DeSTDA)",
        "label": "Obrigações Estaduais (GIA/DeSTDA)",
        "icon": "🏛️",
        "file": "OfficeStateAncillaryDeclarationsView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "warranty_difal_fcp",
        "name": "DIFAL & Fundo de Combate à Pobreza",
        "label": "DIFAL & Fundo de Combate à Pobreza",
        "icon": "🛡️",
        "file": "ExtendedWarrantyDifalFcpView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_ciap_block_g",
        "name": "CIAP Bloco G SPED (1/48 Avos)",
        "label": "CIAP Bloco G SPED (1/48 Avos)",
        "icon": "🏗️",
        "file": "OfficeCiapSpedBlockGView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_fixed_assets_ciap",
        "name": "Ativo Imobilizado Fabril",
        "label": "Ativo Imobilizado Fabril",
        "icon": "🏭",
        "file": "OfficeFixedAssetsCiapBlocoGView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_credit_recovery",
        "name": "Recuperação Créditos PIS/COFINS",
        "label": "Recuperação Créditos PIS/COFINS",
        "icon": "💎",
        "file": "OfficeTaxCreditRecoveryView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_reform_transition",
        "name": "Reforma Tributária IBS/CBS Fabril",
        "label": "Reforma Tributária IBS/CBS Fabril",
        "icon": "⚖️",
        "file": "OfficeTaxReformTransitionView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_arrears",
        "name": "Recálculo de Tributos em Atraso",
        "label": "Recálculo de Tributos em Atraso",
        "icon": "⏱️",
        "file": "OfficeTaxArrearsRecalculatorView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_perdcomp_negative_balance",
        "name": "PER/DCOMP & Saldos Negativos",
        "label": "PER/DCOMP & Saldos Negativos",
        "icon": "📑",
        "file": "OfficePerDcompNegativeBalanceView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_optimal_prolabore",
        "name": "Pró-Labore & Fator R (28%)",
        "label": "Pró-Labore & Fator R (28%)",
        "icon": "💰",
        "file": "OfficeOptimalProlaboreDividendsView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_federal_tax_withholding",
        "name": "Retenções Federais (CSRF 4,65%)",
        "label": "Retenções Federais (CSRF 4,65%)",
        "icon": "🏛️",
        "file": "OfficeFederalTaxWithholdingView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_issqn_withholding",
        "name": "ISS Tomador & CPOM Municipal",
        "label": "ISS Tomador & CPOM Municipal",
        "icon": "🏙️",
        "file": "OfficeIssqnWithholdingCpomView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_reinf_r4000",
        "name": "EFD-Reinf R-4000 & DCTFWeb",
        "label": "EFD-Reinf R-4000 & DCTFWeb",
        "icon": "📋",
        "file": "OfficeReinfR4000DctfwebCrossAuditView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_withholdings",
        "name": "Retenções na Fonte & Comprovantes",
        "label": "Retenções na Fonte & Comprovantes",
        "icon": "📑",
        "file": "OfficeTaxWithholdingsReinfView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_carne_leao_irpf",
        "name": "Carnê-Leão & Livro Caixa IRPF",
        "label": "Carnê-Leão & Livro Caixa IRPF",
        "icon": "🦁",
        "file": "OfficeCarneLeaoCashBookIrpfView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "tax",
        "name": "Simulador Tributário (3 Regimes)",
        "label": "Simulador Tributário (3 Regimes)",
        "icon": "🧮",
        "file": "TaxEngineView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_fiscal_document_ocr_view",
        "name": "Office Fiscal Document Ocr",
        "label": "Office Fiscal Document Ocr",
        "icon": "🌐",
        "file": "OfficeFiscalDocumentOcrView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_discrepancies_notifications_view",
        "name": "Office Tax Discrepancies Notifications",
        "label": "Office Tax Discrepancies Notifications",
        "icon": "🌐",
        "file": "OfficeTaxDiscrepanciesNotificationsView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_incentives_donation_view",
        "name": "Office Tax Incentives Donation",
        "label": "Office Tax Incentives Donation",
        "icon": "🌐",
        "file": "OfficeTaxIncentivesDonationView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_tax_installments_pgfn_view",
        "name": "Office Tax Installments Pgfn",
        "label": "Office Tax Installments Pgfn",
        "icon": "🌐",
        "file": "OfficeTaxInstallmentsPgfnView",
        "departmentId": "fiscal",
        "isCore": true
      },
      {
        "id": "office_annual_tax_planning_view",
        "name": "Office Annual Tax Planning",
        "label": "Office Annual Tax Planning",
        "icon": "🌐",
        "file": "OfficeAnnualTaxPlanningView",
        "departmentId": "fiscal",
        "isCore": true
      }
    ]
  },
  {
    "id": "contabil",
    "name": "Contabilidade & IFRS",
    "category": "Contabilidade & IFRS",
    "icon": "📚",
    "iconName": "BookOpen",
    "tag": "CONTABIL",
    "isCore": true,
    "defaultCollapsed": false,
    "modules": [
      {
        "id": "office_monthly_consolidated_book",
        "name": "Book Contábil Mensal Consolidado (A4)",
        "label": "Book Contábil Mensal Consolidado (A4)",
        "icon": "📑",
        "file": "OfficeMonthlyConsolidatedBookView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_intangibles_amortization",
        "name": "Ativos Intangíveis, Softwares & Amortização CPC 04",
        "label": "Ativos Intangíveis, Softwares & Amortização CPC 04",
        "icon": "✨",
        "file": "OfficeIntangiblesAmortizationView",
        "departmentId": "contabil",
        "isCore": true
},
      {
        "id": "office_fixed_assets_cpc27",
        "name": "Ativo Imobilizado, Depreciação CPC 27 & CIAP",
        "label": "Ativo Imobilizado, Depreciação CPC 27 & CIAP",
        "icon": "🏢",
        "file": "OfficeFixedAssetsCiapView",
        "departmentId": "contabil",
        "isCore": true
},
      {
        "id": "accounting",
        "name": "Contabilidade IFRS & Razão Digital",
        "label": "Contabilidade IFRS & Razão Digital",
        "icon": "📖",
        "file": "AccountingView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_annual_closing_are",
        "name": "Custos CPV & ARE Anual 1-Click",
        "label": "Custos CPV & ARE Anual 1-Click",
        "icon": "🏁",
        "file": "OfficeAnnualClosingAreView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_annual_closing",
        "name": "Fechamento Anual & Notas Explicativas",
        "label": "Fechamento Anual & Notas Explicativas",
        "icon": "📊",
        "file": "OfficeAnnualAccountingClosingView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_equity_method_cpc18",
        "name": "Equivalência Patrimonial (MEP - CPC 18)",
        "label": "Equivalência Patrimonial (MEP - CPC 18)",
        "icon": "🏢",
        "file": "OfficeEquityMethodCpc18View",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_ecd_ecf_junta",
        "name": "ECD, ECF & Livros Junta Comercial",
        "label": "ECD, ECF & Livros Junta Comercial",
        "icon": "🏛️",
        "file": "OfficeEcdEcfJuntaRegistryView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "sped",
        "name": "Suíte SPED & Validador PVA",
        "label": "Suíte SPED & Validador PVA",
        "icon": "📄",
        "file": "SpedView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_sped_ecd_ecf_auditor",
        "name": "Auditoria & Cruzamentos SPED (ECD/ECF)",
        "label": "Auditoria & Cruzamentos SPED (ECD/ECF)",
        "icon": "🔍",
        "file": "OfficeSpedBatchPrevalidatorView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "dfe",
        "name": "Auditoria DF-e & Malhas Fiscais",
        "label": "Auditoria DF-e & Malhas Fiscais",
        "icon": "⚡",
        "file": "DfeAuditView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "dfc_merger",
        "name": "DFC Demonstração Fluxos de Caixa",
        "label": "DFC Demonstração Fluxos de Caixa",
        "icon": "🌊",
        "file": "DfcMergerBackupView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "dva_wealth_jcp",
        "name": "DVA Demonstração Valor Adicionado",
        "label": "DVA Demonstração Valor Adicionado",
        "icon": "💎",
        "file": "DvaWealthJcpTaxView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "treasury_demonstration_view",
        "name": "Treasury Demonstration",
        "label": "Treasury Demonstration",
        "icon": "🌐",
        "file": "TreasuryDemonstrationView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "first_time_ifrs_reiq_tax_view",
        "name": "First Time Ifrs Reiq Tax",
        "label": "First Time Ifrs Reiq Tax",
        "icon": "🌐",
        "file": "FirstTimeIfrsReiqTaxView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "esg_ifrs_globe_tax_view",
        "name": "Esg Ifrs Globe Tax",
        "label": "Esg Ifrs Globe Tax",
        "icon": "🌐",
        "file": "EsgIfrsGlobeTaxView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "office_annual_dossier_audit_opinion_view",
        "name": "Office Annual Dossier Audit Opinion",
        "label": "Office Annual Dossier Audit Opinion",
        "icon": "🌐",
        "file": "OfficeAnnualDossierAuditOpinionView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "forensic_ai_view",
        "name": "Forensic Ai",
        "label": "Forensic Ai",
        "icon": "🌐",
        "file": "ForensicAiView",
        "departmentId": "contabil",
        "isCore": true
      },
      {
        "id": "financial_statement_analysis_cfo",
        "name": "Análise das Demonstrações & CFO Virtual",
        "label": "Análise das Demonstrações & CFO Virtual",
        "icon": "💎",
        "file": "OfficeCfoVirtualFinancialDecisionView",
        "departmentId": "contabil",
        "isCore": true
      }
    ]
  },
  {
    "id": "setoriais",
    "name": "Módulos Setoriais & Especiais",
    "category": "Módulos Setoriais & Especiais",
    "icon": "🌐",
    "iconName": "Globe",
    "tag": "SETORIAL",
    "isCore": false,
    "defaultCollapsed": true,
    "modules": [
      {
        "id": "agri_derivatives",
        "name": "Agro & Derivativos Climáticos",
        "label": "Agro & Derivativos Climáticos",
        "icon": "🌾",
        "file": "AgriDerivativesView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "cattle_agro_lcdpr",
        "name": "Pecuária CPC 29 & LCDPR Rural",
        "label": "Pecuária CPC 29 & LCDPR Rural",
        "icon": "🐄",
        "file": "CattleAgroLcdprView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "bearer_plants_agro",
        "name": "Plantas Portadoras & Agro",
        "label": "Plantas Portadoras & Agro",
        "icon": "🌱",
        "file": "BearerPlantsAgroView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "biological_fco_tax",
        "name": "Valor Justo CPC 29 & Subvenção",
        "label": "Valor Justo CPC 29 & Subvenção",
        "icon": "🌿",
        "file": "BiologicalFairValueFcoTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "agro_cpr_psr",
        "name": "CPR Dólar & Seguro Rural PSR",
        "label": "CPR Dólar & Seguro Rural PSR",
        "icon": "🌾",
        "file": "AgroCprForeignInsurancePsrView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "forestry_biological_debt",
        "name": "Florestas FCD & Conversão Dívidas",
        "label": "Florestas FCD & Conversão Dívidas",
        "icon": "🌲",
        "file": "ForestryBiologicalDebtView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "earnout_sugarcane",
        "name": "Earn-out em M&A & Cana/Etanol",
        "label": "Earn-out em M&A & Cana/Etanol",
        "icon": "🎋",
        "file": "EarnoutSugarcaneView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "carbon_cbio",
        "name": "Créditos Carbono & CBIOs RenovaBio",
        "label": "Créditos Carbono & CBIOs RenovaBio",
        "icon": "♻️",
        "file": "CarbonCbioView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "sbce_carbon_redd",
        "name": "Mercado Carbono SBCE & REDD+",
        "label": "Mercado Carbono SBCE & REDD+",
        "icon": "🌳",
        "file": "SbceCarbonMarketReddView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "methane_carbon_port_tax",
        "name": "Metano & Praticagem Portuária",
        "label": "Metano & Praticagem Portuária",
        "icon": "🚢",
        "file": "MethaneCarbonPortTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "zfm40_suframa_pin",
        "name": "ZFM 4.0 & Automação PIN",
        "label": "ZFM 4.0 & Automação PIN",
        "icon": "📦",
        "file": "Zfm40SuframaPinAutomationView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "carveout_zfm_tax",
        "name": "Carve-Out CPC 18 & ZFM ICMS",
        "label": "Carve-Out CPC 18 & ZFM ICMS",
        "icon": "🏭",
        "file": "CarveoutZfmTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "segments_amazon_alc",
        "name": "Segmentos CPC 22 & Amazônia ALC",
        "label": "Segmentos CPC 22 & Amazônia ALC",
        "icon": "🌴",
        "file": "SegmentsAmazonAlcTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "distribution_alc",
        "name": "Distribuição Sócios & ALCs",
        "label": "Distribuição Sócios & ALCs",
        "icon": "📦",
        "file": "DistributionAlcView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "drex_cbdc_tpft",
        "name": "DREX Real Digital & TPFTs",
        "label": "DREX Real Digital & TPFTs",
        "icon": "🪙",
        "file": "DrexCbdcTokenizedTpftView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "rwa_tokens_ibs_cbs",
        "name": "Tokens RWA & Reforma IBS/CBS",
        "label": "Tokens RWA & Reforma IBS/CBS",
        "icon": "🪙",
        "file": "RwaTokensIbsCbsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "crypto_vasp_in1888",
        "name": "Marco Cripto VASP & IN 1888",
        "label": "Marco Cripto VASP & IN 1888",
        "icon": "₿",
        "file": "CryptoVaspIn1888ComplianceView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "borrowing_crypto",
        "name": "Empréstimos Cripto & Custódia",
        "label": "Empréstimos Cripto & Custódia",
        "icon": "🔐",
        "file": "BorrowingCryptoView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "crypto_natural_gas",
        "name": "Criptoativos & Gás Natural",
        "label": "Criptoativos & Gás Natural",
        "icon": "⛽",
        "file": "CryptoNaturalGasView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "ccee_energy_tp",
        "name": "Mercado Livre CCEE & TP OCDE",
        "label": "Mercado Livre CCEE & TP OCDE",
        "icon": "⚡",
        "file": "CceeEnergyTransferPricingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "bets_cooperatives_tax",
        "name": "Apostas / Bets & Cooperativas",
        "label": "Apostas / Bets & Cooperativas",
        "icon": "🎲",
        "file": "BetsCooperativesTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "medical_cooperative_tax",
        "name": "Cooperativas Médicas & PIS",
        "label": "Cooperativas Médicas & PIS",
        "icon": "🏥",
        "file": "MedicalCooperativeTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "port_tup_storage_tax",
        "name": "Portos TUP & Armazenagem",
        "label": "Portos TUP & Armazenagem",
        "icon": "⚓",
        "file": "PortTupStorageIcmsIssView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "shopping_mall_fii_tax",
        "name": "Shopping Centers & FIIs",
        "label": "Shopping Centers & FIIs",
        "icon": "🏬",
        "file": "ShoppingMallFiiTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "fractional_multipropriedade_ret",
        "name": "Multipropriedade & RET 4%",
        "label": "Multipropriedade & RET 4%",
        "icon": "🏖️",
        "file": "FractionalOwnershipMultipropriedadeRetView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "naval_shipbuilding",
        "name": "Construção Naval & Estaleiros",
        "label": "Construção Naval & Estaleiros",
        "icon": "🚢",
        "file": "NavalShipbuildingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "resurfacing_cinema",
        "name": "Recapeamento & Cinema RECINE",
        "label": "Recapeamento & Cinema RECINE",
        "icon": "🎬",
        "file": "ResurfacingCinemaView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "concession_hospital",
        "name": "Concessões & Equiparação Hosp.",
        "label": "Concessões & Equiparação Hosp.",
        "icon": "🏥",
        "file": "ConcessionHospitalView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "hybrid_concession_vehicles",
        "name": "Concessões & Veículos Usados",
        "label": "Concessões & Veículos Usados",
        "icon": "🚗",
        "file": "HybridConcessionVehiclesView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "common_control_oil",
        "name": "Controle Comum & Royalties ANP",
        "label": "Controle Comum & Royalties ANP",
        "icon": "🛢️",
        "file": "CommonControlOilView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "telemetry_repetro",
        "name": "Telemetria & Regime REPETRO",
        "label": "Telemetria & Regime REPETRO",
        "icon": "📡",
        "file": "TelemetryRepetroView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "infrastructure_debentures",
        "name": "Debêntures de Infraestrutura",
        "label": "Debêntures de Infraestrutura",
        "icon": "🏛️",
        "file": "InfrastructureDebenturesTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "hybrid_perpetual_reidi_tax",
        "name": "Títulos Híbridos & REIDI",
        "label": "Títulos Híbridos & REIDI",
        "icon": "⚡",
        "file": "HybridPerpetualReidiTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "fidc_cpr_agro",
        "name": "FIDCs CPC 48 & CPR Agro Verde",
        "label": "FIDCs CPC 48 & CPR Agro Verde",
        "icon": "📜",
        "file": "FidcSecuritizationCprAgroView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "software_oea_customs",
        "name": "Softwares CPC 04 & OEA Receita",
        "label": "Softwares CPC 04 & OEA Receita",
        "icon": "💻",
        "file": "SoftwareIntangiblesOeaCustomsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "drawback_aap",
        "name": "Drawback & AAP / OCI",
        "label": "Drawback & AAP / OCI",
        "icon": "🚢",
        "file": "DrawbackAapView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "intercompany_drawback",
        "name": "Mútuos CPC 05 & Drawback",
        "label": "Mútuos CPC 05 & Drawback",
        "icon": "🚢",
        "file": "IntercompanyLoansDrawbackExemptionView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "borrowing_lei_do_bem",
        "name": "Juros CPC 20 & Lei do Bem P&D",
        "label": "Juros CPC 20 & Lei do Bem P&D",
        "icon": "💡",
        "file": "BorrowingCostsLeiDoBemView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "ndf_hedge_split_payment",
        "name": "NDF Hedge & Split Payment",
        "label": "NDF Hedge & Split Payment",
        "icon": "🛡️",
        "file": "NdfHedgeSplitPaymentIbsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "streaming_lease_ifrs",
        "name": "Streaming Digital & IFRS 16",
        "label": "Streaming Digital & IFRS 16",
        "icon": "🎬",
        "file": "StreamingLeaseIfrsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "sudene_maintenance_overhaul",
        "name": "Paradas CPC 27 & SUDENE",
        "label": "Paradas CPC 27 & SUDENE",
        "icon": "🏭",
        "file": "SudeneMaintenanceOverhaulView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "weather_ipi_export",
        "name": "Derivativos Climáticos & IPI",
        "label": "Derivativos Climáticos & IPI",
        "icon": "🌦️",
        "file": "WeatherIpiExportView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "actuarial_pharma",
        "name": "Previdência & Farmacêutico",
        "label": "Previdência & Farmacêutico",
        "icon": "💊",
        "file": "ActuarialPharmaView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "perpetual_autoparts",
        "name": "Perpétuos & Autopeças",
        "label": "Perpétuos & Autopeças",
        "icon": "⚙️",
        "file": "PerpetualAutoPartsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "uncertainty_beverages",
        "name": "Incertezas & Bebidas Frias",
        "label": "Incertezas & Bebidas Frias",
        "icon": "🍹",
        "file": "UncertaintyBeveragesView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "onerous_cosmetics",
        "name": "Onerosos & Cosméticos",
        "label": "Onerosos & Cosméticos",
        "icon": "💄",
        "file": "OnerousCosmeticsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "compound_recycling",
        "name": "Compostos & Reciclagem",
        "label": "Compostos & Reciclagem",
        "icon": "♻️",
        "file": "CompoundRecyclingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "revaluation_biodiesel",
        "name": "Custo Atribuído & Biodiesel",
        "label": "Custo Atribuído & Biodiesel",
        "icon": "🛢️",
        "file": "RevaluationBiodieselView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "regulatory_ev_mover",
        "name": "Regulatórios & Programa MOVER",
        "label": "Regulatórios & Programa MOVER",
        "icon": "🚗",
        "file": "RegulatoryEvMoverView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "embedded_freight",
        "name": "Derivativos & Fretes Embutidos",
        "label": "Derivativos & Fretes Embutidos",
        "icon": "🚛",
        "file": "EmbeddedFreightView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "tax_loss_saas",
        "name": "Prejuízos Fiscais & SaaS",
        "label": "Prejuízos Fiscais & SaaS",
        "icon": "💻",
        "file": "TaxLossSaasView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "lessor_construction",
        "name": "Arrendador & Obras Construção",
        "label": "Arrendador & Obras Construção",
        "icon": "🏗️",
        "file": "LessorConstructionView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "liquidation_afrmm",
        "name": "Liquidação & AFRMM Marinha",
        "label": "Liquidação & AFRMM Marinha",
        "icon": "⚓",
        "file": "LiquidationAfrmmView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "insurance_telecom",
        "name": "Seguros BBA & Telecomunicações",
        "label": "Seguros BBA & Telecomunicações",
        "icon": "📡",
        "file": "InsuranceTelecomView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "grants_cide",
        "name": "Subvenções & CIDE-Combustíveis",
        "label": "Subvenções & CIDE-Combustíveis",
        "icon": "⛽",
        "file": "GrantsCideView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "poc_leasing",
        "name": "Contratos POC & Locação Imóveis",
        "label": "Contratos POC & Locação Imóveis",
        "icon": "🏢",
        "file": "PocLeasingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "phantom_swap",
        "name": "Phantom Shares & Swaps Permuta",
        "label": "Phantom Shares & Swaps Permuta",
        "icon": "🔄",
        "file": "PhantomSwapView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "guarantee_fuels",
        "name": "Garantias & Combustíveis",
        "label": "Garantias & Combustíveis",
        "icon": "⛽",
        "file": "GuaranteeFuelsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "loans_cooperative",
        "name": "Mútuos Subsidiados & Coop.",
        "label": "Mútuos Subsidiados & Coop.",
        "icon": "🤝",
        "file": "LoansCooperativeView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "insurance_fii",
        "name": "Seguros, FIIs & Criptoativos",
        "label": "Seguros, FIIs & Criptoativos",
        "icon": "🏬",
        "file": "InsuranceFiiView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "separate_offshore",
        "name": "Demonstrações Separadas & Offshores",
        "label": "Demonstrações Separadas & Offshores",
        "icon": "🏝️",
        "file": "SeparateOffshoreView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "benefits_ret",
        "name": "Benefícios Pós-Emprego & RET",
        "label": "Benefícios Pós-Emprego & RET",
        "icon": "🏢",
        "file": "BenefitsRetView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "discontinued_future",
        "name": "Operações Descontinuadas",
        "label": "Operações Descontinuadas",
        "icon": "📦",
        "file": "DiscontinuedFutureDeliveryView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "policies_triangular",
        "name": "Políticas & Venda Triangular",
        "label": "Políticas & Venda Triangular",
        "icon": "📐",
        "file": "PoliciesTriangularView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "mineral_trading",
        "name": "Recursos Minerais & Tradings",
        "label": "Recursos Minerais & Tradings",
        "icon": "⛏️",
        "file": "MineralTradingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "goodwill_toll",
        "name": "Goodwill & Industrialização",
        "label": "Goodwill & Industrialização",
        "icon": "🏭",
        "file": "GoodwillTollView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "investment_warehouse",
        "name": "Propriedades para Investimento",
        "label": "Propriedades para Investimento",
        "icon": "🏬",
        "file": "InvestmentWarehouseView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "intangibles_returns",
        "name": "Intangíveis & Devoluções",
        "label": "Intangíveis & Devoluções",
        "icon": "💡",
        "file": "IntangiblesReturnsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "aro_bonification",
        "name": "Desmantelamento (ARO)",
        "label": "Desmantelamento (ARO)",
        "icon": "🏗️",
        "file": "AroBonificationView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "queue_esg",
        "name": "Filas & Mobilidade Urbana ESG",
        "label": "Filas & Mobilidade Urbana ESG",
        "icon": "⚡",
        "file": "QueueEsgEventsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "interim_mover",
        "name": "Demonstrações Intermediárias",
        "label": "Demonstrações Intermediárias",
        "icon": "🚗",
        "file": "InterimMoverView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "capital_markets",
        "name": "Mercado de Capitais & ZPEs",
        "label": "Mercado de Capitais & ZPEs",
        "icon": "🏛️",
        "file": "CapitalMarketsZpeView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "consolidation_consignment",
        "name": "Consolidação & Consignação",
        "label": "Consolidação & Consignação",
        "icon": "📦",
        "file": "ConsolidationConsignmentView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "beps_globe_qdmtt_tax_treaty_view",
        "name": "Beps Globe Qdmtt Tax Treaty",
        "label": "Beps Globe Qdmtt Tax Treaty",
        "icon": "🌐",
        "file": "BepsGlobeQdmttTaxTreatyView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "control_tower_ocr_ledger_view",
        "name": "Control Tower Ocr Ledger",
        "label": "Control Tower Ocr Ledger",
        "icon": "🌐",
        "file": "ControlTowerOcrLedgerView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "corporate_sso_govbr_mfa_view",
        "name": "Corporate Sso Govbr Mfa",
        "label": "Corporate Sso Govbr Mfa",
        "icon": "🌐",
        "file": "CorporateSsoGovbrMfaView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "cross_border_ma_safe_harbor_view",
        "name": "Cross Border Ma Safe Harbor",
        "label": "Cross Border Ma Safe Harbor",
        "icon": "🌐",
        "file": "CrossBorderMaSafeHarborView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "dfc_compounding_view",
        "name": "Dfc Compounding",
        "label": "Dfc Compounding",
        "icon": "🌐",
        "file": "DfcCompoundingView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "distributed_queue_whatsapp_alerts_view",
        "name": "Distributed Queue Whatsapp Alerts",
        "label": "Distributed Queue Whatsapp Alerts",
        "icon": "🌐",
        "file": "DistributedQueueWhatsappAlertsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "enterprise_production_command_center_view",
        "name": "Enterprise Production Command Center",
        "label": "Enterprise Production Command Center",
        "icon": "🌐",
        "file": "EnterpriseProductionCommandCenterView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "executive_reports_view",
        "name": "Executive Reports",
        "label": "Executive Reports",
        "icon": "🌐",
        "file": "ExecutiveReportsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "first_time_insurance_paa_view",
        "name": "First Time Insurance Paa",
        "label": "First Time Insurance Paa",
        "icon": "🌐",
        "file": "FirstTimeInsurancePaaView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "foreign_currency_agro_pis_cofins_view",
        "name": "Foreign Currency Agro Pis Cofins",
        "label": "Foreign Currency Agro Pis Cofins",
        "icon": "🌐",
        "file": "ForeignCurrencyAgroPisCofinsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "hyperinflation_iof_view",
        "name": "Hyperinflation Iof",
        "label": "Hyperinflation Iof",
        "icon": "🌐",
        "file": "HyperinflationIofView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "interim_reporting_recof_sped_view",
        "name": "Interim Reporting Recof Sped",
        "label": "Interim Reporting Recof Sped",
        "icon": "🌐",
        "file": "InterimReportingRecofSpedView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "kms_parties_grants_view",
        "name": "Kms Parties Grants",
        "label": "Kms Parties Grants",
        "icon": "🌐",
        "file": "KmsPartiesGrantsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_cfc_responsibility_transfer_view",
        "name": "Office Cfc Responsibility Transfer",
        "label": "Office Cfc Responsibility Transfer",
        "icon": "🌐",
        "file": "OfficeCfcResponsibilityTransferView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_contracts_responsibility_transfer_view",
        "name": "Office Contracts Responsibility Transfer",
        "label": "Office Contracts Responsibility Transfer",
        "icon": "🌐",
        "file": "OfficeContractsResponsibilityTransferView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_executive_board_management_reports_view",
        "name": "Office Executive Board Management Reports",
        "label": "Office Executive Board Management Reports",
        "icon": "🌐",
        "file": "OfficeExecutiveBoardManagementReportsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_fees_collection_dunning_view",
        "name": "Office Fees Collection Dunning",
        "label": "Office Fees Collection Dunning",
        "icon": "🌐",
        "file": "OfficeFeesCollectionDunningView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_financial_investment_tax_view",
        "name": "Office Financial Investment Tax",
        "label": "Office Financial Investment Tax",
        "icon": "🌐",
        "file": "OfficeFinancialInvestmentTaxView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_smart_dropzone_triage_view",
        "name": "Office Smart Dropzone Triage",
        "label": "Office Smart Dropzone Triage",
        "icon": "🌐",
        "file": "OfficeSmartDropzoneTriageView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "office_state_of_the_art_daily_automation_view",
        "name": "Office State Of The Art Daily Automation",
        "label": "Office State Of The Art Daily Automation",
        "icon": "🌐",
        "file": "OfficeStateOfTheArtDailyAutomationView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "open_finance_audit_cross_view",
        "name": "Open Finance Audit Cross",
        "label": "Open Finance Audit Cross",
        "icon": "🌐",
        "file": "OpenFinanceAuditCrossView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "postgres_multi_tenant_rls_view",
        "name": "Postgres Multi Tenant Rls",
        "label": "Postgres Multi Tenant Rls",
        "icon": "🌐",
        "file": "PostgresMultiTenantRlsView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "postgres_pgvector_otel_prometheus_view",
        "name": "Postgres Pgvector Otel Prometheus",
        "label": "Postgres Pgvector Otel Prometheus",
        "icon": "🌐",
        "file": "PostgresPgvectorOtelPrometheusView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "pva_compliance_soc2_security_view",
        "name": "Pva Compliance Soc2 Security",
        "label": "Pva Compliance Soc2 Security",
        "icon": "🌐",
        "file": "PvaComplianceSoc2SecurityView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "soc2_iso_drp_lgpd_audit_view",
        "name": "Soc2 Iso Drp Lgpd Audit",
        "label": "Soc2 Iso Drp Lgpd Audit",
        "icon": "🌐",
        "file": "Soc2IsoDrpLgpdAuditView",
        "departmentId": "setoriais",
        "isCore": false
      },
      {
        "id": "stock_options_sped_export_view",
        "name": "Stock Options Sped Export",
        "label": "Stock Options Sped Export",
        "icon": "🌐",
        "file": "StockOptionsSpedExportView",
        "departmentId": "setoriais",
        "isCore": false
      }
    ]
  }
].map((dept: any) => ({
  ...dept,
  items: dept.modules
}));

export const ALL_MODULES: NavigationModule[] = DEPARTMENT_CATEGORIES.flatMap(dept => dept.modules);

export const DEFAULT_FAVORITE_MODULE_IDS: string[] = [
  'office_login_security_governance',
  'office_sped_batch_prevalidator',
  'office_multi_client_grid',
  'office_products_services_stock',
  'office_invoice_billing_issuer',
  'office_fixed_assets_cpc27',
  'office_intangibles_amortization',
  'office_universal_dropzone_ocr',
  'payroll',
  'office_monophasic_tax',
  'accounting'
];

export function getModuleById(id: string): NavigationModule | undefined {
  return ALL_MODULES.find(m => m.id === id);
}

export function getDepartmentById(id: DepartmentId): DepartmentCategory | undefined {
  return DEPARTMENT_CATEGORIES.find(d => d.id === id);
}

export const CATEGORIES = DEPARTMENT_CATEGORIES;
