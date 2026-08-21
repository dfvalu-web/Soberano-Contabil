import { SmartPeriodPicker } from './components/SmartPeriodPicker.js';
import { OfficeLoginSecurityGovernanceView } from './views/OfficeLoginSecurityGovernanceView.js';
import { OfficeSandboxIsolationLabView } from './views/OfficeSandboxIsolationLabView.js';
import { OfficeBusinessPartnersRegistryView } from './views/OfficeBusinessPartnersRegistryView.js';
import { OfficeIntangiblesAmortizationView } from './views/OfficeIntangiblesAmortizationView.js';
import { OfficeIntegratedClosingPipelineView } from './views/OfficeIntegratedClosingPipelineView.js';
import { OfficePredictiveTaxAuditRadarView } from './views/OfficePredictiveTaxAuditRadarView.js';
import { OfficeMonthlyConsolidatedBookView } from './views/OfficeMonthlyConsolidatedBookView.js';
import { OfficeStrategicTaxRegimeComparisonView } from './views/OfficeStrategicTaxRegimeComparisonView.js';
import { LandingAndLoginPremiumView, UserProfile, PRESET_PROFILES } from './views/LandingAndLoginPremiumView.js';

import { OfficeProductsServicesStockView } from './views/OfficeProductsServicesStockView.js';
import { OfficeInvoiceBillingIssuerView } from './views/OfficeInvoiceBillingIssuerView.js';
import { OfficeFixedAssetsCiapView } from './views/OfficeFixedAssetsCiapView.js';
﻿import { CnaeSectorBanner } from './components/CnaeSectorBanner.js';
import { officeStore } from './state/office-store.js';
import { SidebarNavigation } from './components/SidebarNavigation';
import { DEPARTMENT_CATEGORIES as CATEGORIES, getModuleById, ALL_MODULES } from './config/navigation-modules';
import { getRecommendedModulesForTenant } from './config/cnae-sector-matcher';
import { QuickFilterTab } from './components/SidebarNavigation';
import React, { useState, useMemo, useEffect } from 'react';
import { OfficeMultiClientClosingGridView } from './views/OfficeMultiClientClosingGridView.js';
import { OfficeUniversalDropzoneOcrView } from './views/OfficeUniversalDropzoneOcrView.js';
import { OfficeBatchDispatchBundleView } from './views/OfficeBatchDispatchBundleView.js';
import { DashboardView } from './views/DashboardView.js';
import { AccountingOfficeHubView } from './views/AccountingOfficeHubView.js';
import { OfficeDailyOperationsHubView } from './views/OfficeDailyOperationsHubView.js';
import { OfficeMonthlyClosingChecklistView } from './views/OfficeMonthlyClosingChecklistView.js';
import { OfficeTasksProductivitySlaView } from './views/OfficeTasksProductivitySlaView.js';
import { OfficeClientProfitabilityBiView } from './views/OfficeClientProfitabilityBiView.js';
import { ClientPortalOfficeView } from './views/ClientPortalOfficeView.js';
import { OfficeMonophasicTaxSegregationView } from './views/OfficeMonophasicTaxSegregationView.js';
import { OfficeCardPixCrossAuditView } from './views/OfficeCardPixCrossAuditView.js';
import { OfficeReturnsTaxAdjustmentView } from './views/OfficeReturnsTaxAdjustmentView.js';
import { OfficeInventoryBlockHKTaxAdjustmentView } from './views/OfficeInventoryBlockHKTaxAdjustmentView.js';
import { OfficeDdaBankingNfeMatchingView } from './views/OfficeDdaBankingNfeMatchingView.js';
import { OfficeInboundDfeBookkeepingView } from './views/OfficeInboundDfeBookkeepingView.js';
import { OfficeStateAncillaryDeclarationsView } from './views/OfficeStateAncillaryDeclarationsView.js';
import { ExtendedWarrantyDifalFcpView } from './views/ExtendedWarrantyDifalFcpView.js';
import { OfficeCiapSpedBlockGView } from './views/OfficeCiapSpedBlockGView.js';
import { OfficeFixedAssetsCiapBlocoGView } from './views/OfficeFixedAssetsCiapBlocoGView.js';
import { OfficeAnnualClosingAreView } from './views/OfficeAnnualClosingAreView.js';
import { OfficeTaxCreditRecoveryView } from './views/OfficeTaxCreditRecoveryView.js';
import { OfficeTaxReformTransitionView } from './views/OfficeTaxReformTransitionView.js';
import { OfficeTaxArrearsRecalculatorView } from './views/OfficeTaxArrearsRecalculatorView.js';
import { OfficePerDcompNegativeBalanceView } from './views/OfficePerDcompNegativeBalanceView.js';
import { OfficeOptimalProlaboreDividendsView } from './views/OfficeOptimalProlaboreDividendsView.js';
import { OfficeFederalTaxWithholdingView } from './views/OfficeFederalTaxWithholdingView.js';
import { OfficeIssqnWithholdingCpomView } from './views/OfficeIssqnWithholdingCpomView.js';
import { OfficeReinfR4000DctfwebCrossAuditView } from './views/OfficeReinfR4000DctfwebCrossAuditView.js';
import { OfficeTaxWithholdingsReinfView } from './views/OfficeTaxWithholdingsReinfView.js';
import { OfficeCarneLeaoCashBookIrpfView } from './views/OfficeCarneLeaoCashBookIrpfView.js';
import { TaxEngineView } from './views/TaxEngineView.js';
import { FinancialBpoOfficeView } from './views/FinancialBpoOfficeView.js';
import { PayrollOperationalView } from './views/PayrollOperationalView.js';
import { OfficeRhExecutiveReportsDiamondView } from './views/OfficeRhExecutiveReportsDiamondView.js';
import { OfficeLaborTerminationTrctView } from './views/OfficeLaborTerminationTrctView.js';
import { OfficeAbsenceDsrVacationPenaltyView } from './views/OfficeAbsenceDsrVacationPenaltyView.js';
import { OfficeHazardousWorkAdditionalView } from './views/OfficeHazardousWorkAdditionalView.js';
import { OfficeFlexibleBenefitsPatView } from './views/OfficeFlexibleBenefitsPatView.js';
import { OfficeCprbPayrollReliefView } from './views/OfficeCprbPayrollReliefView.js';
import { OfficeAlimonyChildSupportPayrollView } from './views/OfficeAlimonyChildSupportPayrollView.js';
import { OfficeOvertimeNightDsrView } from './views/OfficeOvertimeNightDsrView.js';
import { OfficePayrollEsocialAuditView } from './views/OfficePayrollEsocialAuditView.js';
import { OfficeSstEsocialPppView } from './views/OfficeSstEsocialPppView.js';
import { OfficeVacationLeavesTimeTrackingView } from './views/OfficeVacationLeavesTimeTrackingView.js';
import { OfficePayrollProvisionsTerminationView } from './views/OfficePayrollProvisionsTerminationView.js';
import { OfficeAccountingIfrsLedgerView } from './views/OfficeAccountingIfrsLedgerView.js';
import { OfficeCfoVirtualFinancialDecisionView } from './views/OfficeCfoVirtualFinancialDecisionView.js';
import { OfficeAnnualAccountingClosingView } from './views/OfficeAnnualAccountingClosingView.js';
import { OfficeEquityMethodCpc18View } from './views/OfficeEquityMethodCpc18View.js';
import { OfficeEcdEcfJuntaRegistryView } from './views/OfficeEcdEcfJuntaRegistryView.js';
import { SpedView } from './views/SpedView.js';
import { OfficeSpedBatchPrevalidatorView } from './views/OfficeSpedBatchPrevalidatorView.js';
import { DfeAuditView } from './views/DfeAuditView.js';
import { DfcMergerBackupView } from './views/DfcMergerBackupView.js';
import { DvaWealthJcpTaxView } from './views/DvaWealthJcpTaxView.js';
import { CorporateLegalizationCndView } from './views/CorporateLegalizationCndView.js';
import { OfficeRedesimViabilityLicensingView } from './views/OfficeRedesimViabilityLicensingView.js';
import { OfficeFamilyHoldingSuccessionView } from './views/OfficeFamilyHoldingSuccessionView.js';
import { OfficeStrategicAdvisoryValuationView } from './views/OfficeStrategicAdvisoryValuationView.js';
import { OfficeCorporateGovernanceAssemblyView } from './views/OfficeCorporateGovernanceAssemblyView.js';
import { OfficeFeesBillingDunningView } from './views/OfficeFeesBillingDunningView.js';
import { OfficeClientOnboardingMigrationView } from './views/OfficeClientOnboardingMigrationView.js';
import { OfficeElectronicAttorneyDjeView } from './views/OfficeElectronicAttorneyDjeView.js';
import { SecurityLedgerView } from './views/SecurityLedgerView.js';
import { OfficeDigitalCertificatesSignerView } from './views/OfficeDigitalCertificatesSignerView.js';
import { CloudHsmPfxVaultView } from './views/CloudHsmPfxVaultView.js';
import { OfficeAmlCoafComplianceView } from './views/OfficeAmlCoafComplianceView.js';
import { GovWebservicesProductionView } from './views/GovWebservicesProductionView.js';
import { SefazDirectTransmissionK8sView } from './views/SefazDirectTransmissionK8sView.js';
import { AgriDerivativesView } from './views/AgriDerivativesView.js';
import { CattleAgroLcdprView } from './views/CattleAgroLcdprView.js';
import { BearerPlantsAgroView } from './views/BearerPlantsAgroView.js';
import { BiologicalFairValueFcoTaxView } from './views/BiologicalFairValueFcoTaxView.js';
import { AgroCprForeignInsurancePsrView } from './views/AgroCprForeignInsurancePsrView.js';
import { ForestryBiologicalDebtView } from './views/ForestryBiologicalDebtView.js';
import { EarnoutSugarcaneView } from './views/EarnoutSugarcaneView.js';
import { CarbonCbioView } from './views/CarbonCbioView.js';
import { SbceCarbonMarketReddView } from './views/SbceCarbonMarketReddView.js';
import { MethaneCarbonPortTaxView } from './views/MethaneCarbonPortTaxView.js';
import { Zfm40SuframaPinAutomationView } from './views/Zfm40SuframaPinAutomationView.js';
import { CarveoutZfmTaxView } from './views/CarveoutZfmTaxView.js';
import { SegmentsAmazonAlcTaxView } from './views/SegmentsAmazonAlcTaxView.js';
import { DistributionAlcView } from './views/DistributionAlcView.js';
import { DrexCbdcTokenizedTpftView } from './views/DrexCbdcTokenizedTpftView.js';
import { RwaTokensIbsCbsView } from './views/RwaTokensIbsCbsView.js';
import { CryptoVaspIn1888ComplianceView } from './views/CryptoVaspIn1888ComplianceView.js';
import { BorrowingCryptoView } from './views/BorrowingCryptoView.js';
import { CryptoNaturalGasView } from './views/CryptoNaturalGasView.js';
import { CceeEnergyTransferPricingView } from './views/CceeEnergyTransferPricingView.js';
import { BetsCooperativesTaxView } from './views/BetsCooperativesTaxView.js';
import { MedicalCooperativeTaxView } from './views/MedicalCooperativeTaxView.js';
import { PortTupStorageIcmsIssView } from './views/PortTupStorageIcmsIssView.js';
import { ShoppingMallFiiTaxView } from './views/ShoppingMallFiiTaxView.js';
import { FractionalOwnershipMultipropriedadeRetView } from './views/FractionalOwnershipMultipropriedadeRetView.js';
import { NavalShipbuildingView } from './views/NavalShipbuildingView.js';
import { ResurfacingCinemaView } from './views/ResurfacingCinemaView.js';
import { ConcessionHospitalView } from './views/ConcessionHospitalView.js';
import { HybridConcessionVehiclesView } from './views/HybridConcessionVehiclesView.js';
import { CommonControlOilView } from './views/CommonControlOilView.js';
import { TelemetryRepetroView } from './views/TelemetryRepetroView.js';
import { InfrastructureDebenturesTaxView } from './views/InfrastructureDebenturesTaxView.js';
import { HybridPerpetualReidiTaxView } from './views/HybridPerpetualReidiTaxView.js';
import { FidcSecuritizationCprAgroView } from './views/FidcSecuritizationCprAgroView.js';
import { SoftwareIntangiblesOeaCustomsView } from './views/SoftwareIntangiblesOeaCustomsView.js';
import { DrawbackAapView } from './views/DrawbackAapView.js';
import { IntercompanyLoansDrawbackExemptionView } from './views/IntercompanyLoansDrawbackExemptionView.js';
import { BorrowingCostsLeiDoBemView } from './views/BorrowingCostsLeiDoBemView.js';
import { NdfHedgeSplitPaymentIbsView } from './views/NdfHedgeSplitPaymentIbsView.js';
import { StreamingLeaseIfrsView } from './views/StreamingLeaseIfrsView.js';
import { SudeneMaintenanceOverhaulView } from './views/SudeneMaintenanceOverhaulView.js';
import { WeatherIpiExportView } from './views/WeatherIpiExportView.js';
import { ActuarialPharmaView } from './views/ActuarialPharmaView.js';
import { PerpetualAutoPartsView } from './views/PerpetualAutoPartsView.js';
import { UncertaintyBeveragesView } from './views/UncertaintyBeveragesView.js';
import { OnerousCosmeticsView } from './views/OnerousCosmeticsView.js';
import { CompoundRecyclingView } from './views/CompoundRecyclingView.js';
import { RevaluationBiodieselView } from './views/RevaluationBiodieselView.js';
import { RegulatoryEvMoverView } from './views/RegulatoryEvMoverView.js';
import { EmbeddedFreightView } from './views/EmbeddedFreightView.js';
import { TaxLossSaasView } from './views/TaxLossSaasView.js';
import { LessorConstructionView } from './views/LessorConstructionView.js';
import { LiquidationAfrmmView } from './views/LiquidationAfrmmView.js';
import { InsuranceTelecomView } from './views/InsuranceTelecomView.js';
import { GrantsCideView } from './views/GrantsCideView.js';
import { PocLeasingView } from './views/PocLeasingView.js';
import { PhantomSwapView } from './views/PhantomSwapView.js';
import { GuaranteeFuelsView } from './views/GuaranteeFuelsView.js';
import { LoansCooperativeView } from './views/LoansCooperativeView.js';
import { InsuranceFiiView } from './views/InsuranceFiiView.js';
import { SeparateOffshoreView } from './views/SeparateOffshoreView.js';
import { BenefitsRetView } from './views/BenefitsRetView.js';
import { DiscontinuedFutureDeliveryView } from './views/DiscontinuedFutureDeliveryView.js';
import { PoliciesTriangularView } from './views/PoliciesTriangularView.js';
import { MineralTradingView } from './views/MineralTradingView.js';
import { GoodwillTollView } from './views/GoodwillTollView.js';
import { InvestmentWarehouseView } from './views/InvestmentWarehouseView.js';
import { IntangiblesReturnsView } from './views/IntangiblesReturnsView.js';
import { AroBonificationView } from './views/AroBonificationView.js';
import { QueueEsgEventsView } from './views/QueueEsgEventsView.js';
import { InterimMoverView } from './views/InterimMoverView.js';
import { CapitalMarketsZpeView } from './views/CapitalMarketsZpeView.js';
import { ConsolidationConsignmentView } from './views/ConsolidationConsignmentView.js';
import { BepsGlobeQdmttTaxTreatyView } from './views/BepsGlobeQdmttTaxTreatyView.js';
import { ControlTowerOcrLedgerView } from './views/ControlTowerOcrLedgerView.js';
import { CorporateSsoGovbrMfaView } from './views/CorporateSsoGovbrMfaView.js';
import { CrossBorderMaSafeHarborView } from './views/CrossBorderMaSafeHarborView.js';
import { DfcCompoundingView } from './views/DfcCompoundingView.js';
import { DistributedQueueWhatsappAlertsView } from './views/DistributedQueueWhatsappAlertsView.js';
import { EnterpriseProductionCommandCenterView } from './views/EnterpriseProductionCommandCenterView.js';
import { EsgIfrsGlobeTaxView } from './views/EsgIfrsGlobeTaxView.js';
import { ExecutiveReportsView } from './views/ExecutiveReportsView.js';
import { FirstTimeIfrsReiqTaxView } from './views/FirstTimeIfrsReiqTaxView.js';
import { FirstTimeInsurancePaaView } from './views/FirstTimeInsurancePaaView.js';
import { ForeignCurrencyAgroPisCofinsView } from './views/ForeignCurrencyAgroPisCofinsView.js';
import { ForensicAiView } from './views/ForensicAiView.js';
import { HyperinflationIofView } from './views/HyperinflationIofView.js';
import { InterimReportingRecofSpedView } from './views/InterimReportingRecofSpedView.js';
import { KmsPartiesGrantsView } from './views/KmsPartiesGrantsView.js';
import { OfficeAnnualDossierAuditOpinionView } from './views/OfficeAnnualDossierAuditOpinionView.js';
import { OfficeAnnualTaxPlanningView } from './views/OfficeAnnualTaxPlanningView.js';
import { OfficeCfcResponsibilityTransferView } from './views/OfficeCfcResponsibilityTransferView.js';
import { OfficeContractsResponsibilityTransferView } from './views/OfficeContractsResponsibilityTransferView.js';
import { OfficeExecutiveBoardManagementReportsView } from './views/OfficeExecutiveBoardManagementReportsView.js';
import { OfficeFeesCollectionDunningView } from './views/OfficeFeesCollectionDunningView.js';
import { OfficeFinancialInvestmentTaxView } from './views/OfficeFinancialInvestmentTaxView.js';
import { OfficeFiscalDocumentOcrView } from './views/OfficeFiscalDocumentOcrView.js';
import { OfficeInternshipApprenticeAuditView } from './views/OfficeInternshipApprenticeAuditView.js';
import { OfficeJobTenureStabilityInssView } from './views/OfficeJobTenureStabilityInssView.js';
import { OfficeSmartDropzoneTriageView } from './views/OfficeSmartDropzoneTriageView.js';
import { OfficeStateOfTheArtDailyAutomationView } from './views/OfficeStateOfTheArtDailyAutomationView.js';
import { OfficeTaxDiscrepanciesNotificationsView } from './views/OfficeTaxDiscrepanciesNotificationsView.js';
import { OfficeTaxIncentivesDonationView } from './views/OfficeTaxIncentivesDonationView.js';
import { OfficeTaxInstallmentsPgfnView } from './views/OfficeTaxInstallmentsPgfnView.js';
import { OpenFinanceAuditCrossView } from './views/OpenFinanceAuditCrossView.js';
import { PensionDefinedBenefitAdmissionActiveView } from './views/PensionDefinedBenefitAdmissionActiveView.js';
import { PortWorkersFapPayrollView } from './views/PortWorkersFapPayrollView.js';
import { PostgresMultiTenantRlsView } from './views/PostgresMultiTenantRlsView.js';
import { PostgresPgvectorOtelPrometheusView } from './views/PostgresPgvectorOtelPrometheusView.js';
import { PvaComplianceSoc2SecurityView } from './views/PvaComplianceSoc2SecurityView.js';
import { Soc2IsoDrpLgpdAuditView } from './views/Soc2IsoDrpLgpdAuditView.js';
import { StockOptionsSpedExportView } from './views/StockOptionsSpedExportView.js';
import { TreasuryDemonstrationView } from './views/TreasuryDemonstrationView.js';

// Navigation categories and types imported from ./config/navigation-modules

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('soberano_auth_session') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('soberano_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRESET_PROFILES[0];
  });
  const [currentModuleId, setCurrentModuleId] = useState<string>('office_integrated_closing_pipeline');
  const isMasterOwner = currentUser?.email?.toLowerCase() === 'dfvalu@gmail.com' || currentUser?.email?.toLowerCase() === 'david.valu@soberanocontabil.com.br';

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setIsAuthenticated(true);
    if (profile.initialModuleId) {
      setCurrentModuleId(profile.initialModuleId);
    }
    try {
      localStorage.setItem('soberano_auth_session', 'true');
      localStorage.setItem('soberano_auth_user', JSON.stringify(profile));
    } catch {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('soberano_auth_session');
    } catch {}
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<QuickFilterTab>('todos');

  // Compute active tab dynamically based on currentModuleId
  const activeDepartmentTab = useMemo<QuickFilterTab>(() => {
    const mod = getModuleById(currentModuleId);
    if (mod) {
      if (mod.departmentId === 'gestao') return 'core';
      if (mod.departmentId === 'dp') return 'dp';
      if (mod.departmentId === 'fiscal') return 'fiscal';
      if (mod.departmentId === 'contabil') return 'contabil';
      if (mod.departmentId === 'setoriais') return 'setoriais';
    }
    return activeFilterTab;
  }, [currentModuleId, activeFilterTab]);

  const handleSelectTopCategory = (tabId: QuickFilterTab) => {
    setActiveFilterTab(tabId);
    if (tabId === 'core') {
      setCurrentModuleId('office_multi_client_grid');
    } else if (tabId === 'dp') {
      setCurrentModuleId('payroll');
    } else if (tabId === 'fiscal') {
      setCurrentModuleId('office_monophasic_tax');
    } else if (tabId === 'contabil') {
      setCurrentModuleId('accounting');
    } else if (tabId === 'setoriais') {
      setCurrentModuleId('agri_derivatives');
    } else if (tabId === 'cnae') {
      const recs = getRecommendedModulesForTenant(currentTenantObj);
      if (recs && recs.length > 0) {
        setCurrentModuleId(recs[0].id);
      }
    }
  };
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({
    'Módulos Setoriais & Especiais (Sob Demanda)': true
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isRightDeckOpen, setIsRightDeckOpen] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedTenant, setSelectedTenant] = useState<string>('Soberano Tech S/A');
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const currentTenantObj = useMemo(() => {
    return tenants.find(t => t.name === selectedTenant || t.id === selectedTenant) || tenants[0];
  }, [tenants, selectedTenant]);
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  const collapseAllCategories = () => {
    const collapsed: { [key: string]: boolean } = {};
    CATEGORIES.forEach(c => { collapsed[c.category] = true; });
    setCollapsedCategories(collapsed);
  };

  const filteredCategories = useMemo(() => {
    let list = CATEGORIES;

    if (activeFilterTab === 'core') {
      list = list.filter(cat => cat.isCore);
    } else if (activeFilterTab !== 'todos') {
      list = list.filter(cat => 
        (cat.tag && cat.tag === activeFilterTab) ||
        cat.category.toLowerCase().includes(activeFilterTab.toLowerCase())
      );
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();

    return list.map(cat => {
      const matchedItems = cat.items.filter(
        item => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || cat.category.toLowerCase().includes(query)
      );
      return {
        ...cat,
        items: matchedItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery, activeFilterTab]);

  const totalVisibleModules = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  const activeModule = useMemo(() => {
    for (const cat of CATEGORIES) {
      const found = cat.items.find(i => i.id === currentModuleId);
      if (found) return { ...found, category: cat.category };
    }
    return { id: 'office_multi_client_grid', label: 'Cockpit Multi-Empresa em Grade', icon: '🚦', file: 'OfficeMultiClientClosingGridView', category: 'Gestão & Produtividade do Escritório' };
  }, [currentModuleId]);

  if (!isAuthenticated) {
    return <LandingAndLoginPremiumView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* ========================================================================= */}
      {/* 1. TOPBAR GLOBAL CORPORATIVA (HEADER PRINCIPAL)                          */}
      {/* ========================================================================= */}
      <header className="app-topbar-global">
        {/* FLANCO ESQUERDO: MENU + BRAND 3D + BREADCRUMB 3D */}
        <div className="topbar-left-flank">
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              padding: '5px 9px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>☰</span> {isSidebarOpen ? 'Recolher' : 'Menu'}
          </button>

          {/* Logo 3D 4K */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #0891B2 100%)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderBottom: '2px solid #065F46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.78rem',
              color: '#070B12',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              SC
            </div>
            <span style={{ fontWeight: 900, fontSize: '0.88rem', color: '#FFFFFF', letterSpacing: '-0.02em', whiteSpace: 'nowrap', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Soberano <span style={{ color: '#34D399', textShadow: '0 0 12px rgba(52, 211, 153, 0.6)' }}>Contábil</span>
            </span>
            <span style={{
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)',
              color: '#34D399',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              borderBottom: '1.5px solid rgba(5, 150, 105, 0.6)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.58rem',
              fontWeight: 900,
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3)'
            }}>
              PRO
            </span>
          </div>


        </div>

        {/* FLANCO CENTRAL: 3D LUXURY CONTROL PODS */}
        <div className="topbar-center-flank">
          <div className="control-pod-3d" style={{ maxWidth: '320px' }}>
            <span style={{ fontSize: '0.85rem' }}>🏢</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.76rem',
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '210px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.name} style={{ background: '#111726', color: '#fff' }}>
                  {t.name} ({t.regime.replace('_', ' ')})
                </option>
              ))}
            </select>
            <span style={{
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)',
              color: '#34D399',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.56rem',
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)'
            }}>
              CND OK
            </span>
          </div>

          <SmartPeriodPicker />
        </div>

        {/* FLANCO DIREITO: 3D STATUS GOV + BOTÕES 3D 4K */}
        <div className="topbar-right-flank">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'linear-gradient(180deg, #141E32 0%, #0C1220 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
            padding: '3px',
            borderRadius: '8px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 6px rgba(0, 0, 0, 0.35)'
          }}>
            <button
              type="button"
              onClick={() => setCurrentModuleId('sefaz_k8s_prod')}
              style={{
                background: currentModuleId === 'sefaz_k8s_prod' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                border: currentModuleId === 'sefaz_k8s_prod' ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#34D399',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              title="🟢 SEFAZ Nacional Online (Latência 35ms) • Clique para abrir Transmissão mTLS, Contingência SVC & Kubernetes"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.9)' }}></span>
              <span>SEFAZ</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>|</span>
            <button
              type="button"
              onClick={() => setCurrentModuleId('office_payroll_esocial_audit')}
              style={{
                background: currentModuleId === 'office_payroll_esocial_audit' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: currentModuleId === 'office_payroll_esocial_audit' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#38BDF8',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              title="🔵 eSocial Governamental Online • Clique para abrir a Central de Eventos, S-1299 & DCTFWeb"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 8px rgba(6, 182, 212, 0.9)' }}></span>
              <span>eSocial</span>
            </button>
          </div>

          {isMasterOwner && (
            <button
              onClick={() => setCurrentModuleId('office_login_security_governance')}
              className="btn-copilot-3d"
              style={{
                background: currentModuleId === 'office_login_security_governance'
                  ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.2) 100%)'
                  : 'linear-gradient(180deg, #18263D 0%, #0F172A 100%)',
                border: currentModuleId === 'office_login_security_governance'
                  ? '1.5px solid #34D399'
                  : '1px solid rgba(52, 211, 153, 0.45)',
                color: '#34D399',
                fontWeight: 800
              }}
              title="Central de Controle de Login, Aprovação de Acessos & Criptografia"
            >
              <span>🛡️</span> Controle de Acesso
            </button>
          )}
          <button
            onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
            className="btn-1click-3d"
          >
            <span>🚀</span> 1-Click
          </button>

          <button
            onClick={() => setIsRightDeckOpen(prev => !prev)}
            className={`btn-copilot-3d ${isRightDeckOpen ? 'active' : ''}`}
          >
            <span>🤖</span> {isRightDeckOpen ? 'Copiloto' : 'Copiloto'}
          </button>



          {/* Botão de Deslogar / Sair 3D */}
          <button
            onClick={handleLogout}
            title="Encerrar sessão e voltar para a Página Principal"
            style={{
              background: 'linear-gradient(180deg, #3B1818 0%, #1F0D0D 100%)',
              border: '1.5px solid rgba(239, 68, 68, 0.6)',
              borderBottom: '2.5px solid rgba(185, 28, 28, 0.9)',
              color: '#FCA5A5',
              fontWeight: 900,
              fontSize: '0.74rem',
              padding: '5px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 3px 8px rgba(0, 0, 0, 0.5), 0 0 12px rgba(239, 68, 68, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '0.82rem' }}>🚪</span> Sair
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CORPO PRINCIPAL COM 3 COLUNAS (SIDEBAR + WORKSPACE + RIGHT DECK)          */}
      {/* ========================================================================= */}
      <div className="app-body-layout">
        {/* ======================================================================= */}
        {/* 2. SIDEBAR ESQUERDA (NAVEGAÃ‡ÃƒO CATEGORIZADA CORE)                       */}
        {/* ======================================================================= */}
        <SidebarNavigation
          currentModuleId={currentModuleId}
          onSelectModule={setCurrentModuleId}
          tenant={currentTenantObj}
          className={isSidebarOpen ? '' : 'collapsed'}
        />

        {/* ======================================================================= */}
        {/* 3. WORKSPACE CENTRAL (CANVAS PRINCIPAL DO MÃ“DULO)                       */}
        {/* ======================================================================= */}
        <main className="app-center-workspace">
          {/* Renderização do Módulo Ativo */}
          <CnaeSectorBanner tenant={currentTenantObj} onSelectModule={setCurrentModuleId} currentModuleId={currentModuleId} />
          <div className="view-card-container">
          {currentModuleId === 'office_sandbox_isolation_lab' && (
            isMasterOwner ? (
              <OfficeSandboxIsolationLabView />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', background: '#111827', borderRadius: '12px', border: '1.5px solid rgba(239,68,68,0.4)', color: '#FFFFFF' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🧪 🚫</div>
                <h2 style={{ color: '#EF4444', fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>Acesso Restrito ao Master Owner</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginTop: '8px', maxWidth: '600px', marginInline: 'auto' }}>
                  Este módulo de Laboratório Sandbox & Quarentena Empresarial é confidencial e de acesso exclusivo do Administrador Geral e Proprietário do Soberano Contábil (dfvalu@gmail.com).
                </p>
              </div>
            )
          )}
          {currentModuleId === 'office_integrated_closing_pipeline' && <OfficeIntegratedClosingPipelineView tenant={currentTenantObj} />}
          {currentModuleId === 'office_predictive_tax_audit_radar' && <OfficePredictiveTaxAuditRadarView tenant={currentTenantObj} />}
          {currentModuleId === 'office_monthly_consolidated_book' && <OfficeMonthlyConsolidatedBookView tenant={currentTenantObj} />}
          {currentModuleId === 'office_strategic_tax_regime_comparison' && <OfficeStrategicTaxRegimeComparisonView tenant={currentTenantObj} />}
          {currentModuleId === 'office_login_security_governance' && (
            isMasterOwner ? (
              <OfficeLoginSecurityGovernanceView />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', background: '#111827', borderRadius: '12px', border: '1.5px solid rgba(239,68,68,0.4)', color: '#FFFFFF' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️ 🚫</div>
                <h2 style={{ color: '#EF4444', fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>Acesso Restrito ao Proprietário</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginTop: '8px', maxWidth: '600px', marginInline: 'auto' }}>
                  Este módulo de Governança Criptográfica e Controle de Logins é confidencial e de acesso exclusivo do Administrador Geral e Proprietário do Soberano Contábil (dfvalu@gmail.com).
                </p>
              </div>
            )
          )}
          {currentModuleId === 'office_multi_client_grid' && <OfficeMultiClientClosingGridView />}
          {currentModuleId === 'office_universal_dropzone_ocr' && <OfficeUniversalDropzoneOcrView />}
          {currentModuleId === 'office_batch_dispatch_bundle' && <OfficeBatchDispatchBundleView />}
          {currentModuleId === 'dashboard' && <DashboardView />}
          {currentModuleId === 'accounting_office_hub' && <AccountingOfficeHubView />}
          {currentModuleId === 'office_daily_operations' && <OfficeDailyOperationsHubView />}
          {currentModuleId === 'office_monthly_closing' && <OfficeMonthlyClosingChecklistView />}
          {currentModuleId === 'office_tasks_productivity' && <OfficeTasksProductivitySlaView />}
          {currentModuleId === 'office_client_profitability_bi' && <OfficeClientProfitabilityBiView />}
          {currentModuleId === 'client_portal_office' && <ClientPortalOfficeView />}
          {currentModuleId === 'office_monophasic_tax' && <OfficeMonophasicTaxSegregationView />}
          {currentModuleId === 'office_card_pix_crossaudit' && <OfficeCardPixCrossAuditView />}
          {currentModuleId === 'office_returns_tax' && <OfficeReturnsTaxAdjustmentView />}
          {currentModuleId === 'office_inventory_block_hk' && <OfficeInventoryBlockHKTaxAdjustmentView />}
          {currentModuleId === 'office_dda_matching' && <OfficeDdaBankingNfeMatchingView />}
          {currentModuleId === 'office_inbound_dfe' && <OfficeInboundDfeBookkeepingView />}
          {currentModuleId === 'office_state_ancillary' && <OfficeStateAncillaryDeclarationsView />}
          {currentModuleId === 'warranty_difal_fcp' && <ExtendedWarrantyDifalFcpView />}
          {currentModuleId === 'office_ciap_block_g' && <OfficeCiapSpedBlockGView />}
          
          {currentModuleId === 'office_products_services_stock' && <OfficeProductsServicesStockView />}
          {currentModuleId === 'office_invoice_billing_issuer' && <OfficeInvoiceBillingIssuerView />}
          {currentModuleId === 'office_business_partners_registry' && <OfficeBusinessPartnersRegistryView />}
          {(currentModuleId === 'office_fixed_assets_ciap' || currentModuleId === 'office_fixed_assets_cpc27') && <OfficeFixedAssetsCiapView />}
          {currentModuleId === 'office_intangibles_amortization' && <OfficeIntangiblesAmortizationView />}

          {currentModuleId === 'office_annual_closing_are' && <OfficeAnnualClosingAreView />}
          {currentModuleId === 'office_tax_credit_recovery' && <OfficeTaxCreditRecoveryView />}
          {currentModuleId === 'office_tax_reform_transition' && <OfficeTaxReformTransitionView />}
          {currentModuleId === 'office_tax_arrears' && <OfficeTaxArrearsRecalculatorView />}
          {currentModuleId === 'office_perdcomp_negative_balance' && <OfficePerDcompNegativeBalanceView />}
          {currentModuleId === 'office_optimal_prolabore' && <OfficeOptimalProlaboreDividendsView />}
          {currentModuleId === 'office_federal_tax_withholding' && <OfficeFederalTaxWithholdingView />}
          {currentModuleId === 'office_issqn_withholding' && <OfficeIssqnWithholdingCpomView />}
          {currentModuleId === 'office_reinf_r4000' && <OfficeReinfR4000DctfwebCrossAuditView />}
          {currentModuleId === 'office_tax_withholdings' && <OfficeTaxWithholdingsReinfView />}
          {currentModuleId === 'office_carne_leao_irpf' && <OfficeCarneLeaoCashBookIrpfView />}
          {currentModuleId === 'tax' && <TaxEngineView />}
          {currentModuleId === 'financial_bpo_office' && <FinancialBpoOfficeView />}
          {currentModuleId === 'office_rh_executive_reports_diamond' && <OfficeRhExecutiveReportsDiamondView />}
          {currentModuleId === 'payroll' && <PayrollOperationalView />}
          {currentModuleId === 'office_labor_termination' && <OfficeLaborTerminationTrctView />}
          {currentModuleId === 'office_absence_dsr_vacation' && <OfficeAbsenceDsrVacationPenaltyView />}
          {currentModuleId === 'office_hazardous_work' && <OfficeHazardousWorkAdditionalView />}
          {currentModuleId === 'office_flexible_benefits_pat' && <OfficeFlexibleBenefitsPatView />}
          {currentModuleId === 'office_cprb_payroll_relief' && <OfficeCprbPayrollReliefView />}
          {currentModuleId === 'office_alimony_child_support' && <OfficeAlimonyChildSupportPayrollView />}
          {currentModuleId === 'office_overtime_night_dsr' && <OfficeOvertimeNightDsrView />}
          {currentModuleId === 'office_payroll_esocial_audit' && <OfficePayrollEsocialAuditView />}
          {currentModuleId === 'office_sst_esocial' && <OfficeSstEsocialPppView />}
          {currentModuleId === 'office_vacation_leaves' && <OfficeVacationLeavesTimeTrackingView />}
          {currentModuleId === 'office_payroll_provisions' && <OfficePayrollProvisionsTerminationView />}
          {currentModuleId === 'accounting' && <OfficeAccountingIfrsLedgerView />}
          {(currentModuleId === 'financial_statement_analysis_cfo' || currentModuleId === 'financial_analysis') && <OfficeCfoVirtualFinancialDecisionView />}
          {currentModuleId === 'office_annual_closing' && <OfficeAnnualAccountingClosingView />}
          {currentModuleId === 'office_equity_method_cpc18' && <OfficeEquityMethodCpc18View />}
          {currentModuleId === 'office_ecd_ecf_junta' && <OfficeEcdEcfJuntaRegistryView />}
          {currentModuleId === 'sped' && <SpedView />}
          {currentModuleId === 'office_sped_batch_prevalidator' && <OfficeSpedBatchPrevalidatorView />}
          {currentModuleId === 'dfe' && <DfeAuditView />}
          {currentModuleId === 'dfc_merger' && <DfcMergerBackupView />}
          {currentModuleId === 'dva_wealth_jcp' && <DvaWealthJcpTaxView />}
          {currentModuleId === 'corporate_legalization_cnd' && <CorporateLegalizationCndView />}
          {currentModuleId === 'office_redesim_viability' && <OfficeRedesimViabilityLicensingView />}
          {currentModuleId === 'office_family_holding' && <OfficeFamilyHoldingSuccessionView />}
          {currentModuleId === 'office_strategic_valuation' && <OfficeStrategicAdvisoryValuationView />}
          {currentModuleId === 'office_corporate_governance' && <OfficeCorporateGovernanceAssemblyView />}
          {currentModuleId === 'office_fees_billing' && <OfficeFeesBillingDunningView />}
          {currentModuleId === 'office_client_onboarding' && <OfficeClientOnboardingMigrationView />}
          {currentModuleId === 'office_electronic_attorney' && <OfficeElectronicAttorneyDjeView />}
          {currentModuleId === 'security' && <SecurityLedgerView />}
          {currentModuleId === 'office_digital_certificates' && <OfficeDigitalCertificatesSignerView />}
          {currentModuleId === 'cloud_hsm_pfx_vault' && <CloudHsmPfxVaultView />}
          {currentModuleId === 'office_aml_coaf' && <OfficeAmlCoafComplianceView />}
          {currentModuleId === 'gov_webservices_prod' && <GovWebservicesProductionView />}
          {currentModuleId === 'sefaz_k8s_prod' && <SefazDirectTransmissionK8sView />}
          {currentModuleId === 'agri_derivatives' && <AgriDerivativesView />}
          {currentModuleId === 'cattle_agro_lcdpr' && <CattleAgroLcdprView />}
          {currentModuleId === 'bearer_plants_agro' && <BearerPlantsAgroView />}
          {currentModuleId === 'biological_fco_tax' && <BiologicalFairValueFcoTaxView />}
          {currentModuleId === 'agro_cpr_psr' && <AgroCprForeignInsurancePsrView />}
          {currentModuleId === 'forestry_biological_debt' && <ForestryBiologicalDebtView />}
          {currentModuleId === 'earnout_sugarcane' && <EarnoutSugarcaneView />}
          {currentModuleId === 'carbon_cbio' && <CarbonCbioView />}
          {currentModuleId === 'sbce_carbon_redd' && <SbceCarbonMarketReddView />}
          {currentModuleId === 'methane_carbon_port_tax' && <MethaneCarbonPortTaxView />}
          {currentModuleId === 'zfm40_suframa_pin' && <Zfm40SuframaPinAutomationView />}
          {currentModuleId === 'carveout_zfm_tax' && <CarveoutZfmTaxView />}
          {currentModuleId === 'segments_amazon_alc' && <SegmentsAmazonAlcTaxView />}
          {currentModuleId === 'distribution_alc' && <DistributionAlcView />}
          {currentModuleId === 'drex_cbdc_tpft' && <DrexCbdcTokenizedTpftView />}
          {currentModuleId === 'rwa_tokens_ibs_cbs' && <RwaTokensIbsCbsView />}
          {currentModuleId === 'crypto_vasp_in1888' && <CryptoVaspIn1888ComplianceView />}
          {currentModuleId === 'borrowing_crypto' && <BorrowingCryptoView />}
          {currentModuleId === 'crypto_natural_gas' && <CryptoNaturalGasView />}
          {currentModuleId === 'ccee_energy_tp' && <CceeEnergyTransferPricingView />}
          {currentModuleId === 'bets_cooperatives_tax' && <BetsCooperativesTaxView />}
          {currentModuleId === 'medical_cooperative_tax' && <MedicalCooperativeTaxView />}
          {currentModuleId === 'port_tup_storage_tax' && <PortTupStorageIcmsIssView />}
          {currentModuleId === 'shopping_mall_fii_tax' && <ShoppingMallFiiTaxView />}
          {currentModuleId === 'fractional_multipropriedade_ret' && <FractionalOwnershipMultipropriedadeRetView />}
          {currentModuleId === 'naval_shipbuilding' && <NavalShipbuildingView />}
          {currentModuleId === 'resurfacing_cinema' && <ResurfacingCinemaView />}
          {currentModuleId === 'concession_hospital' && <ConcessionHospitalView />}
          {currentModuleId === 'hybrid_concession_vehicles' && <HybridConcessionVehiclesView />}
          {currentModuleId === 'common_control_oil' && <CommonControlOilView />}
          {currentModuleId === 'telemetry_repetro' && <TelemetryRepetroView />}
          {currentModuleId === 'infrastructure_debentures' && <InfrastructureDebenturesTaxView />}
          {currentModuleId === 'hybrid_perpetual_reidi_tax' && <HybridPerpetualReidiTaxView />}
          {currentModuleId === 'fidc_cpr_agro' && <FidcSecuritizationCprAgroView />}
          {currentModuleId === 'software_oea_customs' && <SoftwareIntangiblesOeaCustomsView />}
          {currentModuleId === 'drawback_aap' && <DrawbackAapView />}
          {currentModuleId === 'intercompany_drawback' && <IntercompanyLoansDrawbackExemptionView />}
          {currentModuleId === 'borrowing_lei_do_bem' && <BorrowingCostsLeiDoBemView />}
          {currentModuleId === 'ndf_hedge_split_payment' && <NdfHedgeSplitPaymentIbsView />}
          {currentModuleId === 'streaming_lease_ifrs' && <StreamingLeaseIfrsView />}
          {currentModuleId === 'sudene_maintenance_overhaul' && <SudeneMaintenanceOverhaulView />}
          {currentModuleId === 'weather_ipi_export' && <WeatherIpiExportView />}
          {currentModuleId === 'actuarial_pharma' && <ActuarialPharmaView />}
          {currentModuleId === 'perpetual_autoparts' && <PerpetualAutoPartsView />}
          {currentModuleId === 'uncertainty_beverages' && <UncertaintyBeveragesView />}
          {currentModuleId === 'onerous_cosmetics' && <OnerousCosmeticsView />}
          {currentModuleId === 'compound_recycling' && <CompoundRecyclingView />}
          {currentModuleId === 'revaluation_biodiesel' && <RevaluationBiodieselView />}
          {currentModuleId === 'regulatory_ev_mover' && <RegulatoryEvMoverView />}
          {currentModuleId === 'embedded_freight' && <EmbeddedFreightView />}
          {currentModuleId === 'tax_loss_saas' && <TaxLossSaasView />}
          {currentModuleId === 'lessor_construction' && <LessorConstructionView />}
          {currentModuleId === 'liquidation_afrmm' && <LiquidationAfrmmView />}
          {currentModuleId === 'insurance_telecom' && <InsuranceTelecomView />}
          {currentModuleId === 'grants_cide' && <GrantsCideView />}
          {currentModuleId === 'poc_leasing' && <PocLeasingView />}
          {currentModuleId === 'phantom_swap' && <PhantomSwapView />}
          {currentModuleId === 'guarantee_fuels' && <GuaranteeFuelsView />}
          {currentModuleId === 'loans_cooperative' && <LoansCooperativeView />}
          {currentModuleId === 'insurance_fii' && <InsuranceFiiView />}
          {currentModuleId === 'separate_offshore' && <SeparateOffshoreView />}
          {currentModuleId === 'benefits_ret' && <BenefitsRetView />}
          {currentModuleId === 'discontinued_future' && <DiscontinuedFutureDeliveryView />}
          {currentModuleId === 'policies_triangular' && <PoliciesTriangularView />}
          {currentModuleId === 'mineral_trading' && <MineralTradingView />}
          {currentModuleId === 'goodwill_toll' && <GoodwillTollView />}
          {currentModuleId === 'investment_warehouse' && <InvestmentWarehouseView />}
          {currentModuleId === 'intangibles_returns' && <IntangiblesReturnsView />}
          {currentModuleId === 'aro_bonification' && <AroBonificationView />}
          {currentModuleId === 'queue_esg' && <QueueEsgEventsView />}
          {currentModuleId === 'interim_mover' && <InterimMoverView />}
          {currentModuleId === 'capital_markets' && <CapitalMarketsZpeView />}
          {currentModuleId === 'consolidation_consignment' && <ConsolidationConsignmentView />}
          {currentModuleId === 'beps_globe_qdmtt_tax_treaty_view' && <BepsGlobeQdmttTaxTreatyView />}
          {currentModuleId === 'control_tower_ocr_ledger_view' && <ControlTowerOcrLedgerView />}
          {currentModuleId === 'corporate_sso_govbr_mfa_view' && <CorporateSsoGovbrMfaView />}
          {currentModuleId === 'cross_border_ma_safe_harbor_view' && <CrossBorderMaSafeHarborView />}
          {currentModuleId === 'dfc_compounding_view' && <DfcCompoundingView />}
          {currentModuleId === 'distributed_queue_whatsapp_alerts_view' && <DistributedQueueWhatsappAlertsView />}
          {currentModuleId === 'enterprise_production_command_center_view' && <EnterpriseProductionCommandCenterView />}
          {currentModuleId === 'esg_ifrs_globe_tax_view' && <EsgIfrsGlobeTaxView />}
          {currentModuleId === 'executive_reports_view' && <ExecutiveReportsView />}
          {currentModuleId === 'first_time_ifrs_reiq_tax_view' && <FirstTimeIfrsReiqTaxView />}
          {currentModuleId === 'first_time_insurance_paa_view' && <FirstTimeInsurancePaaView />}
          {currentModuleId === 'foreign_currency_agro_pis_cofins_view' && <ForeignCurrencyAgroPisCofinsView />}
          {currentModuleId === 'forensic_ai_view' && <ForensicAiView />}
          {currentModuleId === 'hyperinflation_iof_view' && <HyperinflationIofView />}
          {currentModuleId === 'interim_reporting_recof_sped_view' && <InterimReportingRecofSpedView />}
          {currentModuleId === 'kms_parties_grants_view' && <KmsPartiesGrantsView />}
          {currentModuleId === 'office_annual_dossier_audit_opinion_view' && <OfficeAnnualDossierAuditOpinionView />}
          {currentModuleId === 'office_annual_tax_planning_view' && <OfficeAnnualTaxPlanningView />}
          {currentModuleId === 'office_cfc_responsibility_transfer_view' && <OfficeCfcResponsibilityTransferView />}
          {currentModuleId === 'office_contracts_responsibility_transfer_view' && <OfficeContractsResponsibilityTransferView />}
          {currentModuleId === 'office_executive_board_management_reports_view' && <OfficeExecutiveBoardManagementReportsView />}
          {currentModuleId === 'office_fees_collection_dunning_view' && <OfficeFeesCollectionDunningView />}
          {currentModuleId === 'office_financial_investment_tax_view' && <OfficeFinancialInvestmentTaxView />}
          {currentModuleId === 'office_fiscal_document_ocr_view' && <OfficeFiscalDocumentOcrView />}
          {currentModuleId === 'office_internship_apprentice_audit_view' && <OfficeInternshipApprenticeAuditView />}
          {currentModuleId === 'office_job_tenure_stability_inss_view' && <OfficeJobTenureStabilityInssView />}
          {currentModuleId === 'office_smart_dropzone_triage_view' && <OfficeSmartDropzoneTriageView />}
          {currentModuleId === 'office_state_of_the_art_daily_automation_view' && <OfficeStateOfTheArtDailyAutomationView />}
          {currentModuleId === 'office_tax_discrepancies_notifications_view' && <OfficeTaxDiscrepanciesNotificationsView />}
          {currentModuleId === 'office_tax_incentives_donation_view' && <OfficeTaxIncentivesDonationView />}
          {currentModuleId === 'office_tax_installments_pgfn_view' && <OfficeTaxInstallmentsPgfnView />}
          {currentModuleId === 'open_finance_audit_cross_view' && <OpenFinanceAuditCrossView />}
          {currentModuleId === 'pension_defined_benefit_admission_active_view' && <PensionDefinedBenefitAdmissionActiveView />}
          {currentModuleId === 'port_workers_fap_payroll_view' && <PortWorkersFapPayrollView />}
          {currentModuleId === 'postgres_multi_tenant_rls_view' && <PostgresMultiTenantRlsView />}
          {currentModuleId === 'postgres_pgvector_otel_prometheus_view' && <PostgresPgvectorOtelPrometheusView />}
          {currentModuleId === 'pva_compliance_soc2_security_view' && <PvaComplianceSoc2SecurityView />}
          {currentModuleId === 'soc2_iso_drp_lgpd_audit_view' && <Soc2IsoDrpLgpdAuditView />}
          {currentModuleId === 'stock_options_sped_export_view' && <StockOptionsSpedExportView />}
          {currentModuleId === 'treasury_demonstration_view' && <TreasuryDemonstrationView />}

          </div>
        </main>

        {/* ======================================================================= */}
        {/* 4. PAINEL LATERAL DIREITO (COPILOTO IA & COCKPIT DE AÃ‡Ã•ES IMEDIATAS)     */}
        {/* ======================================================================= */}
        <aside className={`app-right-deck ${isRightDeckOpen ? '' : 'collapsed'}`}>
          {/* Header do Deck Direito */}
          <div className="right-deck-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>
              <span>🤖</span> Copiloto & Inteligência IA
            </div>
            <button
              onClick={() => setIsRightDeckOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Fechar painel"
            >
              âœ•
            </button>
          </div>

          {/* ConteÃºdo RolÃ¡vel do Deck Direito */}
          <div className="right-deck-scroll">
            {/* 1. Semáforo em Tempo Real da Empresa Ativa */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>🚦 Semáforo de Fechamento</span>
                <span style={{ color: 'var(--emerald-400)', fontSize: '0.7rem' }}>{selectedCompetencia}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>👥 Folha DP / eSocial:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 100% Transmitida</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>âš–ï¸ Fiscal / DAS & DARFs:</span>
                  <span style={{ color: 'var(--amber-400)', fontWeight: 700 }}>🟡 Calculado (Pendente Disparo)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>📚 Contábil / ARE Balancete:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 D=C Zero Dif (ACID)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>📜 CNDs Fed/Est/Mun:</span>
                  <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>🟢 Todas Válidas</span>
                </div>
              </div>
            </div>

            {/* 2. Dicas & Insights do Copiloto Contábil IA */}
            <div className="deck-card" style={{ borderLeft: '3px solid #06B6D4' }}>
              <div className="deck-card-title">
                <span>💡 Diagnóstico Forense IA</span>
                <span style={{ color: 'var(--cyan-400)' }}>Ativo</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <p style={{ marginBottom: '6px' }}>
                  📌 <strong>Oportunidade Tributária:</strong> Esta empresa possui produtos com NCM monofásico que podem reduzir o DAS em até <strong style={{ color: 'var(--emerald-400)' }}>34%</strong>.
                </p>
                <p>
🛡️ <strong>Alerta Preventivo:</strong> Divergência zero detectada entre NF-e de entrada e extrato bancário DDA.
                </p>
              </div>
              <button
                onClick={() => setCurrentModuleId('office_monophasic_tax')}
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan-400)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
🔍 Otimizar Tributos Agora
              </button>
            </div>

            {/* 3. Ações Rápidas de 1-Click */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>⚡ Ações Rápidas 1-Click</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => setCurrentModuleId('office_batch_dispatch_bundle')}
                  className="btn-deck-action"
                >
                  <span>🚀 Disparo Lote WhatsApp/Pix</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_universal_dropzone_ocr')}
                  className="btn-deck-action"
                >
                  <span>📂 Arraste OCR Massivo</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_sped_batch_prevalidator')}
                  className="btn-deck-action"
                >
                  <span>🔍 Pré-Validar SPED em Lote</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={() => setCurrentModuleId('office_annual_closing_are')}
                  className="btn-deck-action"
                >
                  <span>🏛️ Encerramento ARE 1-Click</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* 4. Protocolos Digitais & Trilha de Auditoria */}
            <div className="deck-card">
              <div className="deck-card-title">
                <span>🔒 Protocolos Digitais (SHA-256)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Fechamento Folha {selectedCompetencia}</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>HASH: 8f9b2a...3c41</div>
                  <div style={{ color: 'var(--emerald-400)', fontSize: '0.65rem' }}>Assinado ICP-Brasil • 100% Válido</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Pacote Guias DAS Disparado</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.64rem' }}>HASH: 4e71a0...99f2</div>
                  <div style={{ color: 'var(--emerald-400)', fontSize: '0.65rem' }}>Entrega Comprovada WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
