import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficeIntegratedClosingPipelineView } from '../views/OfficeIntegratedClosingPipelineView';
import { OfficePredictiveTaxAuditRadarView } from '../views/OfficePredictiveTaxAuditRadarView';
import { OfficeMonthlyConsolidatedBookView } from '../views/OfficeMonthlyConsolidatedBookView';
import { OfficeStrategicTaxRegimeComparisonView } from '../views/OfficeStrategicTaxRegimeComparisonView';
import { CompanyTenant } from '../state/office-store';

const mockTenant: CompanyTenant = {
  id: 'tenant-1',
  name: 'Soberano Tech S/A',
  cnpj: '12.345.678/0001-90',
  cnaePrincipal: '6201-5/01 - Desenvolvimento de Softwares',
  regime: 'LUCRO_REAL',
  status: 'REGULAR',
  activeModules: ['accounting', 'tax', 'payroll']
};

describe('Strategic Diamond Four Modules Suite', () => {
  it('1. Módulo 1: Esteira de Fechamento Integrada (Pipeline) renderiza as 5 etapas e tarefas', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeIntegratedClosingPipelineView, { tenant: mockTenant }));
    expect(html).toContain('Esteira de Fechamento Integrada');
    expect(html).toContain('Fiscal &amp; DFe');
    expect(html).toContain('Folha DP &amp; eSocial');
    expect(html).toContain('DCTFWeb &amp; Guias');
    expect(html).toContain('Contabilidade IFRS');
    expect(html).toContain('Dossiê &amp; Entrega');
    expect(html).toContain('Detalhamento de Tarefas &amp; Triangulação Departamental');
  });

  it('2. Módulo 2: Radar de Malhas Fiscais & Auditoria Preventiva renderiza os cruzamentos RFB e Art. 138 CTN', () => {
    const html = renderToStaticMarkup(React.createElement(OfficePredictiveTaxAuditRadarView, { tenant: mockTenant }));
    expect(html).toContain('Radar de Malhas Fiscais &amp; Auditoria Preventiva RFB');
    expect(html).toContain('Score de Conformidade');
    expect(html).toContain('Art. 138 CTN');
    expect(html).toContain('Matriz de Cruzamentos Preditivos da Receita Federal');
    expect(html).toContain('EFD-Contribuições (PIS/COFINS) vs Receita Líquida no Razão ECD');
  });

  it('3. Módulo 3: Book Contábil Mensal Consolidado (A4) renderiza DRE, Balanço, CNDs e assinaturas', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeMonthlyConsolidatedBookView, { tenant: mockTenant }));
    expect(html).toContain('Book Contábil Mensal Consolidado');
    expect(html).toContain('RATING AAA • CRÉDITO APROVADO');
    expect(html).toContain('1. Demonstração do Resultado do Exercício');
    expect(html).toContain('2. Balanço Patrimonial Sintético');
    expect(html).toContain('3. Quadro Oficial de Regularidade &amp; Certidões Negativas');
    expect(html).toContain('DAVID VALU');
  });

  it('4. Módulo 4: Simulador de Planejamento Tributário 2026-2033 renderiza os 3 regimes e cronograma IBS/CBS', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeStrategicTaxRegimeComparisonView, { tenant: mockTenant }));
    expect(html).toContain('Simulador de Planejamento Tributário Comparativo');
    expect(html).toContain('Lucro Presumido');
    expect(html).toContain('Lucro Real (Não-Cumulativo)');
    expect(html).toContain('Novo Regime Dual IBS/CBS (2027-2033)');
    expect(html).toContain('Cronograma Oficial de Transição do Novo IVA Dual');
    expect(html).toContain('EC 132/23 • LC 214/25');
  });
});
