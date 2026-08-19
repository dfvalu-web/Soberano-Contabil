const fs = require('fs');

// Categorização Estratégica Focada no Core Business:
// 1. Escritório & Produtividade
// 2. Comércio & Varejo
// 3. Indústria & Fábricas
// 4. Serviços & Profissionais
// 5. Departamento Pessoal & eSocial
// 6. Contabilidade & SPED
// 7. Societário & Advisory
// 8. Segurança & Certificados
// 9. Setoriais Avançados & Nichos (Gaveta Opcional)

const coreCategories = [
  {
    category: 'Gestão & Produtividade do Escritório',
    icon: '📊',
    isCore: true,
    tag: 'ESCRITORIO',
    items: [
      { id: 'office_multi_client_grid', label: 'Cockpit Multi-Empresa em Grade', icon: '🚦', file: 'OfficeMultiClientClosingGridView' },
      { id: 'office_universal_dropzone_ocr', label: 'Dropzone Massivo Multi-Doc OCR', icon: '📂', file: 'OfficeUniversalDropzoneOcrView' },
      { id: 'office_batch_dispatch_bundle', label: 'Disparo em Lote 1-Click (Guias/Pix)', icon: '🚀', file: 'OfficeBatchDispatchBundleView' },
      { id: 'dashboard', label: 'Cockpit Executivo Principal', icon: '📊', file: 'DashboardView' },
      { id: 'accounting_office_hub', label: 'Central do Escritório (4 Pilares)', icon: '🏛️', file: 'AccountingOfficeHubView' },
      { id: 'office_daily_operations', label: 'Operações Diárias (3 Pilares)', icon: '⚙️', file: 'OfficeDailyOperationsHubView' },
      { id: 'office_monthly_closing', label: 'Fechamento Mensal & Dossiê', icon: '🗓️', file: 'OfficeMonthlyClosingChecklistView' },
      { id: 'office_tasks_productivity', label: 'Tarefas & SLAs da Equipe', icon: '📋', file: 'OfficeTasksProductivitySlaView' },
      { id: 'office_client_profitability_bi', label: 'BI & Rentabilidade da Carteira', icon: '📈', file: 'OfficeClientProfitabilityBiView' },
      { id: 'client_portal_office', label: 'Portal do Cliente (B2B)', icon: '🌐', file: 'ClientPortalOfficeView' }
    ]
  },
  {
    category: 'Comércio & Varejo',
    icon: '🏪',
    isCore: true,
    tag: 'COMERCIO',
    items: [
      { id: 'office_monophasic_tax', label: 'Monofásicos PIS/COFINS (Farmácias)', icon: '💊', file: 'OfficeMonophasicTaxSegregationView' },
      { id: 'office_card_pix_crossaudit', label: 'Cruzamento Cartões/PIX vs DF-e', icon: '💳', file: 'OfficeCardPixCrossAuditView' },
      { id: 'office_returns_tax', label: 'Devoluções & Estornos de Crédito', icon: '🔄', file: 'OfficeReturnsTaxAdjustmentView' },
      { id: 'office_inventory_block_hk', label: 'Estoques & SPED Bloco H/K', icon: '📦', file: 'OfficeInventoryBlockHKTaxAdjustmentView' },
      { id: 'office_dda_matching', label: 'DDA Bancário vs Notas de Entrada', icon: '📑', file: 'OfficeDdaBankingNfeMatchingView' },
      { id: 'office_inbound_dfe', label: 'DF-e Entrada & Manifestação SEFAZ', icon: '📥', file: 'OfficeInboundDfeBookkeepingView' },
      { id: 'office_state_ancillary', label: 'Obrigações Estaduais (GIA/DeSTDA)', icon: '🏛️', file: 'OfficeStateAncillaryDeclarationsView' },
      { id: 'warranty_difal_fcp', label: 'DIFAL & Fundo de Combate à Pobreza', icon: '🛡️', file: 'ExtendedWarrantyDifalFcpView' }
    ]
  },
  {
    category: 'Indústria & Manufatura',
    icon: '🏭',
    isCore: true,
    tag: 'INDUSTRIA',
    items: [
      { id: 'office_ciap_block_g', label: 'CIAP Bloco G SPED (1/48 Avos)', icon: '🏗️', file: 'OfficeCiapSpedBlockGView' },
      { id: 'office_fixed_assets_ciap', label: 'Ativo Imobilizado Fabril', icon: '🏭', file: 'OfficeFixedAssetsCiapBlocoGView' },
      { id: 'office_annual_closing_are', label: 'Custos CPV & ARE Anual 1-Click', icon: '🏁', file: 'OfficeAnnualClosingAreView' },
      { id: 'office_tax_credit_recovery', label: 'Recuperação Créditos PIS/COFINS', icon: '💎', file: 'OfficeTaxCreditRecoveryView' },
      { id: 'office_tax_reform_transition', label: 'Reforma Tributária IBS/CBS Fabril', icon: '⚖️', file: 'OfficeTaxReformTransitionView' },
      { id: 'office_tax_arrears', label: 'Recálculo de Tributos em Atraso', icon: '⏱️', file: 'OfficeTaxArrearsRecalculatorView' },
      { id: 'office_perdcomp_negative_balance', label: 'PER/DCOMP & Saldos Negativos', icon: '📑', file: 'OfficePerDcompNegativeBalanceView' }
    ]
  },
  {
    category: 'Prestadores de Serviços & PJ',
    icon: '💼',
    isCore: true,
    tag: 'SERVICOS',
    items: [
      { id: 'office_optimal_prolabore', label: 'Pró-Labore & Fator R (28%)', icon: '💰', file: 'OfficeOptimalProlaboreDividendsView' },
      { id: 'office_federal_tax_withholding', label: 'Retenções Federais (CSRF 4,65%)', icon: '🏛️', file: 'OfficeFederalTaxWithholdingView' },
      { id: 'office_issqn_withholding', label: 'ISS Tomador & CPOM Municipal', icon: '🏙️', file: 'OfficeIssqnWithholdingCpomView' },
      { id: 'office_reinf_r4000', label: 'EFD-Reinf R-4000 & DCTFWeb', icon: '📋', file: 'OfficeReinfR4000DctfwebCrossAuditView' },
      { id: 'office_tax_withholdings', label: 'Retenções na Fonte & Comprovantes', icon: '📑', file: 'OfficeTaxWithholdingsReinfView' },
      { id: 'office_carne_leao_irpf', label: 'Carnê-Leão & Livro Caixa IRPF', icon: '🦁', file: 'OfficeCarneLeaoCashBookIrpfView' },
      { id: 'tax', label: 'Simulador Tributário (3 Regimes)', icon: '🧮', file: 'TaxEngineView' },
      { id: 'financial_bpo_office', label: 'BPO Financeiro & Fluxo de Caixa', icon: '💼', file: 'FinancialBpoOfficeView' }
    ]
  },
  {
    category: 'Departamento Pessoal & eSocial',
    icon: '👥',
    isCore: true,
    tag: 'DP',
    items: [
      { id: 'payroll', label: 'Folha de Pagamento Central & Encargos', icon: '👥', file: 'PayrollView' },
      { id: 'office_labor_termination', label: 'Rescisão Trabalhista & TRCT', icon: '📄', file: 'OfficeLaborTerminationTrctView' },
      { id: 'office_absence_dsr_vacation', label: 'Faltas Injustificadas & Férias CLT', icon: '⏱️', file: 'OfficeAbsenceDsrVacationPenaltyView' },
      { id: 'office_hazardous_work', label: 'Insalubridade & Periculosidade (NR-15/16)', icon: '☣️', file: 'OfficeHazardousWorkAdditionalView' },
      { id: 'office_flexible_benefits_pat', label: 'Benefícios Flexíveis, VT & PAT', icon: '🍱', file: 'OfficeFlexibleBenefitsPatView' },
      { id: 'office_cprb_payroll_relief', label: 'Desoneração da Folha (CPRB)', icon: '📉', file: 'OfficeCprbPayrollReliefView' },
      { id: 'office_alimony_child_support', label: 'Pensão Alimentícia Judicial', icon: '⚖️', file: 'OfficeAlimonyChildSupportPayrollView' },
      { id: 'office_overtime_night_dsr', label: 'Horas Extras, Noturno & DSR', icon: '⏰', file: 'OfficeOvertimeNightDsrView' },
      { id: 'office_payroll_esocial_audit', label: 'Auditoria Folha & eSocial', icon: '🛡️', file: 'OfficePayrollEsocialAuditView' },
      { id: 'office_sst_esocial', label: 'SST eSocial & PPP Digital', icon: '🦺', file: 'OfficeSstEsocialPppView' },
      { id: 'office_vacation_leaves', label: 'Férias & Controle de Ponto', icon: '🏖️', file: 'OfficeVacationLeavesTimeTrackingView' },
      { id: 'office_payroll_provisions', label: 'Provisões de Férias e 13º Salário', icon: '📊', file: 'OfficePayrollProvisionsTerminationView' }
    ]
  },
  {
    category: 'Contabilidade, IFRS & SPED',
    icon: '📚',
    isCore: true,
    tag: 'CONTABIL',
    items: [
      { id: 'accounting', label: 'Contabilidade IFRS & Razão Digital', icon: '📖', file: 'AccountingView' },
      { id: 'office_annual_closing', label: 'Fechamento Anual & Notas Explicativas', icon: '📊', file: 'OfficeAnnualAccountingClosingView' },
      { id: 'office_equity_method_cpc18', label: 'Equivalência Patrimonial (MEP - CPC 18)', icon: '🏢', file: 'OfficeEquityMethodCpc18View' },
      { id: 'office_ecd_ecf_junta', label: 'ECD, ECF & Livros Junta Comercial', icon: '🏛️', file: 'OfficeEcdEcfJuntaRegistryView' },
      { id: 'sped', label: 'Suíte SPED & Validador PVA', icon: '📄', file: 'SpedView' },
      { id: 'office_sped_batch_prevalidator', label: 'Pré-Validador SPED em Lote', icon: '🔍', file: 'OfficeSpedBatchPrevalidatorView' },
      { id: 'dfe', label: 'Auditoria DF-e & Malhas Fiscais', icon: '⚡', file: 'DfeAuditView' },
      { id: 'dfc_merger', label: 'DFC Demonstração Fluxos de Caixa', icon: '🌊', file: 'DfcMergerBackupView' },
      { id: 'dva_wealth_jcp', label: 'DVA Demonstração Valor Adicionado', icon: '💎', file: 'DvaWealthJcpTaxView' }
    ]
  },
  {
    category: 'Societário, Legalização & Advisory',
    icon: '🏛️',
    isCore: true,
    tag: 'SOCIETARIO',
    items: [
      { id: 'corporate_legalization_cnd', label: 'Legalização & Gestão de CNDs', icon: '📜', file: 'CorporateLegalizationCndView' },
      { id: 'office_redesim_viability', label: 'Viabilidade Redesim & Licenças', icon: '🏢', file: 'OfficeRedesimViabilityLicensingView' },
      { id: 'office_family_holding', label: 'Holding Familiar & Sucessão', icon: '🏰', file: 'OfficeFamilyHoldingSuccessionView' },
      { id: 'office_strategic_valuation', label: 'Valuation & Advisory Estratégico', icon: '🎯', file: 'OfficeStrategicAdvisoryValuationView' },
      { id: 'office_corporate_governance', label: 'Governança & Atas Digitais', icon: '⚖️', file: 'OfficeCorporateGovernanceAssemblyView' },
      { id: 'office_fees_billing', label: 'Honorários & Cobrança Escritório', icon: '🧾', file: 'OfficeFeesBillingDunningView' },
      { id: 'office_client_onboarding', label: 'Onboarding & Migração Clientes', icon: '🚀', file: 'OfficeClientOnboardingMigrationView' },
      { id: 'office_electronic_attorney', label: 'Procurações e-CAC & DJE', icon: '⚖️', file: 'OfficeElectronicAttorneyDjeView' }
    ]
  },
  {
    category: 'Segurança, HSM & Conformidade',
    icon: '🛡️',
    isCore: true,
    tag: 'SEGURANCA',
    items: [
      { id: 'security', label: 'Segurança & Ledger ACID', icon: '🛡️', file: 'SecurityLedgerView' },
      { id: 'office_digital_certificates', label: 'Certificados Digitais & Assinador', icon: '🔐', file: 'OfficeDigitalCertificatesSignerView' },
      { id: 'cloud_hsm_pfx_vault', label: 'Cloud HSM & Cofre PFX A1', icon: '🔒', file: 'CloudHsmPfxVaultView' },
      { id: 'office_aml_coaf', label: 'Prevenção PLD & COAF / CFC', icon: '🚨', file: 'OfficeAmlCoafComplianceView' },
      { id: 'gov_webservices_prod', label: 'WebServices Gov em Produção', icon: '🔌', file: 'GovWebservicesProductionView' },
      { id: 'sefaz_k8s_prod', label: 'SEFAZ mTLS & Transmissão Segura', icon: '☸️', file: 'SefazDirectTransmissionK8sView' }
    ]
  }
];

// Carregar os 74 modulos setoriais e avançados na gaveta sob demanda
const p3 = JSON.parse(fs.readFileSync('scripts/cat-part3.json', 'utf8'));
const sectorialCat = p3.find(c => c.category.includes('Setoriais')) || {
  category: 'Setoriais Avançados, Mercado & Agro (Sob Demanda)',
  icon: '🌐',
  items: []
};
sectorialCat.category = 'Módulos Setoriais & Especiais (Sob Demanda)';
sectorialCat.isCore = false;
sectorialCat.tag = 'SETORIAL';

const allCategories = [...coreCategories, sectorialCat];

let totalCore = 0;
coreCategories.forEach(c => totalCore += c.items.length);
console.log('Total Core Essential Modules:', totalCore);
console.log('Total Sectorial/Advanced Modules:', sectorialCat.items.length);
console.log('Total Global Modules in System:', totalCore + sectorialCat.items.length);

fs.writeFileSync('scripts/core-and-advanced-categories.json', JSON.stringify(allCategories, null, 2), 'utf8');
console.log('Strategic categories matrix saved successfully.');
