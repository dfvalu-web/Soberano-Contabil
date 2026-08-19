import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Contabilidade & IFRS
import { AccountingView } from '../views/AccountingView';
import { OfficeAnnualAccountingClosingView } from '../views/OfficeAnnualAccountingClosingView';
import { OfficeAnnualClosingAreView } from '../views/OfficeAnnualClosingAreView';
import { OfficeEquityMethodCpc18View } from '../views/OfficeEquityMethodCpc18View';
import { DfcMergerBackupView } from '../views/DfcMergerBackupView';
import { DvaWealthJcpTaxView } from '../views/DvaWealthJcpTaxView';

// Fiscal & Tributário
import { TaxEngineView } from '../views/TaxEngineView';
import { OfficeMonophasicTaxSegregationView } from '../views/OfficeMonophasicTaxSegregationView';
import { OfficeCardPixCrossAuditView } from '../views/OfficeCardPixCrossAuditView';
import { OfficeTaxWithholdingsReinfView } from '../views/OfficeTaxWithholdingsReinfView';
import { OfficePerDcompNegativeBalanceView } from '../views/OfficePerDcompNegativeBalanceView';
import { OfficeOptimalProlaboreDividendsView } from '../views/OfficeOptimalProlaboreDividendsView';
import { OfficeCarneLeaoCashBookIrpfView } from '../views/OfficeCarneLeaoCashBookIrpfView';
import { OfficeTaxCreditRecoveryView } from '../views/OfficeTaxCreditRecoveryView';

// Gestão do Escritório & Setoriais
import { DashboardView } from '../views/DashboardView';
import { OfficeMonthlyClosingChecklistView } from '../views/OfficeMonthlyClosingChecklistView';
import { FinancialBpoOfficeView } from '../views/FinancialBpoOfficeView';
import { CorporateLegalizationCndView } from '../views/CorporateLegalizationCndView';
import { OfficeFeesBillingDunningView } from '../views/OfficeFeesBillingDunningView';
import { OfficeFamilyHoldingSuccessionView } from '../views/OfficeFamilyHoldingSuccessionView';
import { OfficeStrategicAdvisoryValuationView } from '../views/OfficeStrategicAdvisoryValuationView';
import { CattleAgroLcdprView } from '../views/CattleAgroLcdprView';
import { CryptoVaspIn1888ComplianceView } from '../views/CryptoVaspIn1888ComplianceView';
import { BenefitsRetView } from '../views/BenefitsRetView';

describe('Suíte Completa de Relatórios Executivos Padrão Diamante (Todos os Módulos do Sistema)', () => {
  describe('1. Contabilidade & IFRS', () => {
    it('AccountingView deve conter Balanço & DRE Executivo Diamante', () => {
      const html = renderToStaticMarkup(<AccountingView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DEMONSTRAÇÕES CONTÁBEIS CONSOLIDADAS');
      expect(html).toContain('diamond-signatures');
    });

    it('OfficeAnnualAccountingClosingView deve conter Dossiê de Fechamento Anual Diamante', () => {
      const html = renderToStaticMarkup(<OfficeAnnualAccountingClosingView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DOSSIÊ EXECUTIVO DE ENCERRAMENTO ANUAL');
    });

    it('OfficeAnnualClosingAreView deve conter Laudo de ARE Diamante', () => {
      const html = renderToStaticMarkup(<OfficeAnnualClosingAreView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('APURAÇÃO DO RESULTADO DO EXERCÍCIO (ARE)');
    });

    it('OfficeEquityMethodCpc18View deve conter Laudo de MEP CPC 18 Diamante', () => {
      const html = renderToStaticMarkup(<OfficeEquityMethodCpc18View />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('MÉTODO DA EQUIVALÊNCIA PATRIMONIAL');
    });

    it('DfcMergerBackupView deve conter DFC Direto Diamante', () => {
      const html = renderToStaticMarkup(<DfcMergerBackupView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DEMONSTRAÇÃO DOS FLUXOS DE CAIXA');
    });

    it('DvaWealthJcpTaxView deve conter DVA CPC 09 & JCP Diamante', () => {
      const html = renderToStaticMarkup(<DvaWealthJcpTaxView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DEMONSTRAÇÃO DO VALOR ADICIONADO');
    });
  });

  describe('2. Fiscal & Tributário', () => {
    it('TaxEngineView deve conter Parecer Tributário Comparativo Diamante', () => {
      const html = renderToStaticMarkup(<TaxEngineView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('PARECER EXECUTIVO DE PLANEJAMENTO TRIBUTÁRIO');
    });

    it('OfficeMonophasicTaxSegregationView deve conter Laudo de Monofásicos Diamante', () => {
      const html = renderToStaticMarkup(<OfficeMonophasicTaxSegregationView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('LAUDO DE SEGREGAÇÃO DE PRODUTOS MONOFÁSICOS');
    });

    it('OfficeCardPixCrossAuditView deve conter Laudo de Auditoria Cartões/PIX Diamante', () => {
      const html = renderToStaticMarkup(<OfficeCardPixCrossAuditView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('LAUDO FORENSE DE CONFRONTAÇÃO FISCAL');
    });

    it('OfficeTaxWithholdingsReinfView deve conter Comprovante de Retenções Diamante', () => {
      const html = renderToStaticMarkup(<OfficeTaxWithholdingsReinfView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('COMPROVANTE ANUAL DE RETENÇÃO DE TRIBUTOS');
    });

    it('OfficePerDcompNegativeBalanceView deve conter Declaração PER/DCOMP Diamante', () => {
      const html = renderToStaticMarkup(<OfficePerDcompNegativeBalanceView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DECLARAÇÃO DE COMPENSAÇÃO ELETRÔNICA');
    });

    it('OfficeOptimalProlaboreDividendsView deve conter Dossiê Fator R 28% Diamante', () => {
      const html = renderToStaticMarkup(<OfficeOptimalProlaboreDividendsView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('FATOR R (28%)');
    });

    it('OfficeCarneLeaoCashBookIrpfView deve conter Carnê-Leão & Livro Caixa Diamante', () => {
      const html = renderToStaticMarkup(<OfficeCarneLeaoCashBookIrpfView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('LIVRO CAIXA');
    });

    it('OfficeTaxCreditRecoveryView deve conter Laudo de Recuperação de Créditos Diamante', () => {
      const html = renderToStaticMarkup(<OfficeTaxCreditRecoveryView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('RECUPERAÇÃO DE CRÉDITOS TRIBUTÁRIOS');
    });
  });

  describe('3. Gestão do Escritório & Setoriais', () => {
    it('DashboardView deve conter Relatório Executivo Consolidado Diamante', () => {
      const html = renderToStaticMarkup(<DashboardView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('RELATÓRIO EXECUTIVO CONSOLIDADO');
    });

    it('OfficeMonthlyClosingChecklistView deve conter Dossiê Mensal de Fechamento Diamante', () => {
      const html = renderToStaticMarkup(<OfficeMonthlyClosingChecklistView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DOSSIÊ MENSAL DE FECHAMENTO CONTÁBIL');
    });

    it('FinancialBpoOfficeView deve conter Relatório de BPO Financeiro Diamante', () => {
      const html = renderToStaticMarkup(<FinancialBpoOfficeView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('BPO FINANCEIRO');
    });

    it('CorporateLegalizationCndView deve conter Certificado de CNDs Diamante', () => {
      const html = renderToStaticMarkup(<CorporateLegalizationCndView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('CERTIFICADO DE REGULARIDADE FISCAL');
    });

    it('OfficeFeesBillingDunningView deve conter Extrato de Honorários Diamante', () => {
      const html = renderToStaticMarkup(<OfficeFeesBillingDunningView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('HONORÁRIOS CONTÁBEIS');
    });

    it('OfficeFamilyHoldingSuccessionView deve conter Dossiê de Holding Familiar Diamante', () => {
      const html = renderToStaticMarkup(<OfficeFamilyHoldingSuccessionView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('HOLDING FAMILIAR');
    });

    it('OfficeStrategicAdvisoryValuationView deve conter Laudo de Valuation Diamante', () => {
      const html = renderToStaticMarkup(<OfficeStrategicAdvisoryValuationView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('VALUATION');
    });

    it('CattleAgroLcdprView deve conter Dossiê Agro & LCDPR Diamante', () => {
      const html = renderToStaticMarkup(<CattleAgroLcdprView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('PECUÁRIA');
      expect(html).toContain('LCDPR');
    });

    it('CryptoVaspIn1888ComplianceView deve conter Dossiê Cripto IN 1888 Diamante', () => {
      const html = renderToStaticMarkup(<CryptoVaspIn1888ComplianceView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('CRIPTOATIVOS');
    });

    it('BenefitsRetView deve conter Dossiê RET Imobiliário Diamante', () => {
      const html = renderToStaticMarkup(<BenefitsRetView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('REGIME ESPECIAL DE TRIBUTAÇÃO');
    });
  });
});
