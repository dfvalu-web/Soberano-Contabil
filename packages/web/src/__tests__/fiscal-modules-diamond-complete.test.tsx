import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficeInboundDfeBookkeepingView } from '../views/OfficeInboundDfeBookkeepingView.js';
import { OfficeDdaBankingNfeMatchingView } from '../views/OfficeDdaBankingNfeMatchingView.js';
import { ExtendedWarrantyDifalFcpView } from '../views/ExtendedWarrantyDifalFcpView.js';
import { OfficeTaxReformTransitionView } from '../views/OfficeTaxReformTransitionView.js';
import { OfficeReturnsTaxAdjustmentView } from '../views/OfficeReturnsTaxAdjustmentView.js';
import { OfficeIssqnWithholdingCpomView } from '../views/OfficeIssqnWithholdingCpomView.js';
import { OfficeReinfR4000DctfwebCrossAuditView } from '../views/OfficeReinfR4000DctfwebCrossAuditView.js';
import { OfficeAnnualTaxPlanningView } from '../views/OfficeAnnualTaxPlanningView.js';
import { OfficeTaxDiscrepanciesNotificationsView } from '../views/OfficeTaxDiscrepanciesNotificationsView.js';
import { OfficeTaxInstallmentsPgfnView } from '../views/OfficeTaxInstallmentsPgfnView.js';
import { OfficeTaxIncentivesDonationView } from '../views/OfficeTaxIncentivesDonationView.js';
import { OfficeStateAncillaryDeclarationsView } from '../views/OfficeStateAncillaryDeclarationsView.js';
import { OfficeMonophasicTaxSegregationView } from '../views/OfficeMonophasicTaxSegregationView.js';
import { OfficeFiscalDocumentOcrView } from '../views/OfficeFiscalDocumentOcrView.js';

describe('Soberano Contábil — Suíte Completa de Módulos Fiscais Diamante 10/10', () => {
  it('1. Renderiza DF-e de Entrada com Dossiê A4 e Manifestação SEFAZ', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeInboundDfeBookkeepingView));
    expect(html).toContain('DF-e de Entrada, Manifestação SEFAZ');
    expect(html).toContain('DOSSIÊ EXECUTIVO DE AUDITORIA DE ENTRADAS');
  });

  it('2. Renderiza Conciliação DDA Bancário vs NF-e com Dossiê A4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeDdaBankingNfeMatchingView));
    expect(html).toContain('Conciliação DDA Bancário');
    expect(html).toContain('FEBRABAN DDA');
  });

  it('3. Renderiza DIFAL Interestadual & FCP com Matriz de 27 UFs', () => {
    const html = renderToStaticMarkup(React.createElement(ExtendedWarrantyDifalFcpView));
    expect(html).toContain('DIFAL Interestadual');
    expect(html).toContain('GNRE DIGITAL');
  });

  it('4. Renderiza Reforma Tributária 2026 (IBS / CBS) com Transição', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeTaxReformTransitionView));
    expect(html).toContain('Simulador da Reforma Tributária');
    expect(html).toContain('CBS FEDERAL');
  });

  it('5. Renderiza Devoluções & Estornos de Tributos com CPC 16', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeReturnsTaxAdjustmentView));
    expect(html).toContain('Devoluções de Mercadorias');
    expect(html).toContain('SINIEF');
  });

  it('6. Renderiza ISSQN Tomador & CPOM Municipal LC 116', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeIssqnWithholdingCpomView));
    expect(html).toContain('ISSQN Tomador');
    expect(html).toContain('LEI COMPLEMENTAR 116/03');
  });

  it('7. Renderiza EFD-Reinf Série R-4000 & Cruzamento DCTFWeb', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeReinfR4000DctfwebCrossAuditView));
    expect(html).toContain('EFD-Reinf Série R-4000');
    expect(html).toContain('IN RFB 2.043/21');
  });

  it('8. Renderiza Planejamento Tributário Anual & Matriz de Elisão', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeAnnualTaxPlanningView));
    expect(html).toContain('Planejamento Tributário Anual');
    expect(html).toContain('ELISÃO FISCAL');
  });

  it('9. Renderiza Radar de Malha Fina Fiscal RFB/SEFAZ', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeTaxDiscrepanciesNotificationsView));
    expect(html).toContain('Radar de Malha Fina Tributária');
    expect(html).toContain('CRUZAMENTOS SPED');
  });

  it('10. Renderiza Parcelamentos Fiscais & Transação PGFN', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeTaxInstallmentsPgfnView));
    expect(html).toContain('Parcelamentos Fiscais');
    expect(html).toContain('LEI 13.988/20');
  });

  it('11. Renderiza Incentivos Fiscais ESG & Lei Rouanet / FIA', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeTaxIncentivesDonationView));
    expect(html).toContain('Incentivos Fiscais');
    expect(html).toContain('LEI ROUANET');
  });

  it('12. Renderiza Obrigações Estaduais GIA / SPED Bloco E', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeStateAncillaryDeclarationsView));
    expect(html).toContain('Obrigações Estaduais');
    expect(html).toContain('SEFAZ SPED BLOCO E');
  });

  it('13. Renderiza Monofásicos PIS/COFINS com Trava de Governança SoD', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeMonophasicTaxSegregationView));
    expect(html).toContain('Segregação de Receitas Monofásicas PIS/COFINS');
    expect(html).toContain('LEI 10.147/00');
  });

  it('14. Renderiza Dropzone OCR Neural de Documentos Fiscais', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeFiscalDocumentOcrView));
    expect(html).toContain('Dropzone Massivo Multi-Documentos Fiscais');
    expect(html).toContain('IA NEURAL OCR');
  });
});