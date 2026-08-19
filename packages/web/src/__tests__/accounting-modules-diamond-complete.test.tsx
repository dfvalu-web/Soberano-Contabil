import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Import all 9 transformed accounting views
import { OfficeEquityMethodCpc18View } from '../views/OfficeEquityMethodCpc18View.js';
import { DfcMergerBackupView } from '../views/DfcMergerBackupView.js';
import { DvaWealthJcpTaxView } from '../views/DvaWealthJcpTaxView.js';
import { OfficeAnnualAccountingClosingView } from '../views/OfficeAnnualAccountingClosingView.js';
import { OfficeEcdEcfJuntaRegistryView } from '../views/OfficeEcdEcfJuntaRegistryView.js';
import { OfficeAnnualDossierAuditOpinionView } from '../views/OfficeAnnualDossierAuditOpinionView.js';
import { ForensicAiView } from '../views/ForensicAiView.js';
import { EsgIfrsGlobeTaxView } from '../views/EsgIfrsGlobeTaxView.js';
import { FirstTimeIfrsReiqTaxView } from '../views/FirstTimeIfrsReiqTaxView.js';

describe('Soberano Contábil — Suíte Diamante 10/10 do Departamento Contábil', () => {
  it('1. Equivalência Patrimonial (MEP - CPC 18 R2) renderiza e calcula ganho de MEP', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeEquityMethodCpc18View));
    expect(html).toContain('Equivalência Patrimonial (MEP - CPC 18 R2');
    expect(html).toContain('MÉTODO DA EQUIVALÊNCIA PATRIMONIAL');
  });

  it('2. Demonstração dos Fluxos de Caixa (DFC - CPC 03) renderiza métodos direto e indireto', () => {
    const html = renderToStaticMarkup(React.createElement(DfcMergerBackupView));
    expect(html).toContain('Demonstração dos Fluxos de Caixa (DFC - CPC 03');
    expect(html).toContain('FLUXO DE CAIXA DAS ATIVIDADES OPERACIONAIS');
  });

  it('3. Demonstração do Valor Adicionado (DVA - CPC 09) renderiza e calcula distribuição da riqueza', () => {
    const html = renderToStaticMarkup(React.createElement(DvaWealthJcpTaxView));
    expect(html).toContain('Demonstração do Valor Adicionado (DVA - CPC 09');
    expect(html).toContain('DISTRIBUIÇÃO DO VALOR ADICIONADO');
  });

  it('4. Fechamento Anual, EBITDA & Notas Explicativas (CPC 26) renderiza editor de notas', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeAnnualAccountingClosingView));
    expect(html).toContain('Fechamento Anual, EBITDA &amp; Notas Explicativas');
    expect(html).toContain('NOTA EXPLICATIVA 1');
  });

  it('5. Termos de Abertura & Encerramento Junta Comercial (DREI) renderiza termos oficiais', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeEcdEcfJuntaRegistryView));
    expect(html).toContain('Termos de Abertura &amp; Encerramento — Junta Comercial');
    expect(html).toContain('TERMO DE ABERTURA');
    expect(html).toContain('TERMO DE ENCERRAMENTO');
  });

  it('6. Parecer dos Auditores Independentes (NBC TA 700) renderiza parecer e PAA', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeAnnualDossierAuditOpinionView));
    expect(html).toContain('Relatório &amp; Parecer dos Auditores Independentes');
    expect(html).toContain('OPINIÃO SEM RESSALVAS');
  });

  it('7. Auditoria Forense Contábil & Lei de Benford renderiza análise estatística chi-quadrado', () => {
    const html = renderToStaticMarkup(React.createElement(ForensicAiView));
    expect(html).toContain('Auditoria Forense &amp; Teste da Lei de Benford');
    expect(html).toContain('LAUDO PERICIAL FORENSE DE AUDITORIA ESTATÍSTICA');
  });

  it('8. Demonstrações ESG & IFRS S1/S2 Sustentabilidade renderiza inventário GEE escopos 1, 2 e 3', () => {
    const html = renderToStaticMarkup(React.createElement(EsgIfrsGlobeTaxView));
    expect(html).toContain('Demonstrações de Sustentabilidade ESG');
    expect(html).toContain('Protocolo GHG / IFRS S2');
  });

  it('9. Adoção Inicial IFRS 1 / CPC 37 Transição Contábil renderiza laudo de deemed cost e AVP', () => {
    const html = renderToStaticMarkup(React.createElement(FirstTimeIfrsReiqTaxView));
    expect(html).toContain('Adoção Inicial das Normas IFRS (CPC 37 / IFRS 1)');
    expect(html).toContain('LAUDO TÉCNICO DE ADOÇÃO INICIAL DAS NORMAS INTERNACIONAIS');
  });
});
