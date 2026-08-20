import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficeMultiClientClosingGridView } from '../views/OfficeMultiClientClosingGridView';
import { OfficeUniversalDropzoneOcrView } from '../views/OfficeUniversalDropzoneOcrView';
import { OfficeIntegratedClosingPipelineView } from '../views/OfficeIntegratedClosingPipelineView';
import { OfficeClientProfitabilityBiView } from '../views/OfficeClientProfitabilityBiView';
import { CorporateLegalizationCndView } from '../views/CorporateLegalizationCndView';
import { OfficeFamilyHoldingSuccessionView } from '../views/OfficeFamilyHoldingSuccessionView';

describe('Gestão & Cockpit do Escritório - Diamond Suite (Nota 10/10)', () => {
  it('1. Renderiza o Cockpit Multi-Empresa com KPIs de Carteira e filtros avançados de SLA', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeMultiClientClosingGridView)
    );

    expect(html).toContain('Cockpit Multi-Empresa em Grade &amp; Gestão de Prazos');
    expect(html).toContain('COMPETÊNCIA 08/2026');
    expect(html).toContain('Empresas na Carteira');
    expect(html).toContain('Fechadas com Sucesso');
    expect(html).toContain('Risco Iminente de Multa');
    expect(html).toContain('Volume de Tributos');
    expect(html).toContain('Exportar Matriz CSV');
  });

  it('2. Renderiza o Dropzone Massivo OCR com Split-View e autoclassificação contábil IFRS', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeUniversalDropzoneOcrView)
    );

    expect(html).toContain('Dropzone Massivo Multi-Doc &amp; OCR Inteligente');
    expect(html).toContain('IA AUTOCLASSIFICADORA');
    expect(html).toContain('Estrutura do Documento Eletrônico');
    expect(html).toContain('Chave de Acesso DF-e (44 Dígitos)');
    expect(html).toContain('Itens Extraídos &amp; Partidas Dobradas Sugeridas');
    expect(html).toContain('Partida Dobrada Contábil Automática');
  });

  it('3. Renderiza a Esteira de Fechamento Integrada com SLA e Dossiê A4', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeIntegratedClosingPipelineView)
    );

    expect(html).toContain('Esteira de Fechamento Integrada (Pipeline Fiscal');
    expect(html).toContain('Fiscal &amp; DFe');
    expect(html).toContain('Folha DP &amp; eSocial');
    expect(html).toContain('DCTFWeb &amp; Guias');
    expect(html).toContain('Contabilidade IFRS');
    expect(html).toContain('Dossiê &amp; Entrega');
  });

  it('4. Renderiza o BI de Rentabilidade com Curva ABC e Sugestor de Reajustes', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeClientProfitabilityBiView)
    );

    expect(html).toContain('BI de Rentabilidade da Carteira &amp; Sugestor de Reajustes');
    expect(html).toContain('CURVA ABC DINÂMICA');
    expect(html).toContain('Faturamento Recorrente (MRR)');
    expect(html).toContain('Simulador Inteligente de Reajuste Anual');
    expect(html).toContain('MARGEM LÍQUIDA GLOBAL');
  });

  it('5. Renderiza a Legalização Societária com Robô de Varredura de CNDs', () => {
    const html = renderToStaticMarkup(
      React.createElement(CorporateLegalizationCndView)
    );

    expect(html).toContain('Legalização Societária &amp; Robô Automático de CNDs');
    expect(html).toContain('Certificado de Regularidade Fiscal &amp; CNDs');
    expect(html).toContain('Receita Federal &amp; PGFN');
    expect(html).toContain('SEFAZ Estadual (ICMS)');
    expect(html).toContain('Caixa Econômica Federal (CRF)');
  });

  it('6. Renderiza o Planejamento Sucessório de Holding Familiar com Comparativo de ITCMD', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeFamilyHoldingSuccessionView)
    );

    expect(html).toContain('Holding Familiar &amp; Planejamento Sucessório');
    expect(html).toContain('ART. 23 LEI 9.249/95');
    expect(html).toContain('Inventário Tradicional (Judicial / Extrajudicial)');
    expect(html).toContain('Holding Familiar &amp; Doação de Quotas com Usufruto');
    expect(html).toContain('Visualizar Minuta Contratual da Holding');
  });
});
