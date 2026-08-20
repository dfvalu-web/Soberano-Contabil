import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  UniversalLegacyMigrationEngine,
  LEGACY_SOFTWARE_CATALOG
} from '../engines/universal-migration-engine';
import { OfficeClientOnboardingMigrationView } from '../views/OfficeClientOnboardingMigrationView';

describe('Motor Universal de Migração & Importação de Sistemas Legados', () => {
  it('1. LEGACY_SOFTWARE_CATALOG: disponibiliza os 10 principais sistemas contábeis do mercado + SPED/eSocial', () => {
    expect(LEGACY_SOFTWARE_CATALOG.length).toBeGreaterThanOrEqual(10);

    const dominio = LEGACY_SOFTWARE_CATALOG.find(s => s.id === 'DOMINIO_THOMSON_REUTERS');
    expect(dominio?.name).toBe('Domínio Sistemas');
    expect(dominio?.vendor).toBe('Thomson Reuters');

    const alterdata = LEGACY_SOFTWARE_CATALOG.find(s => s.id === 'ALTERDATA_PACK');
    expect(alterdata?.name).toBe('Alterdata Pack');

    const fortes = LEGACY_SOFTWARE_CATALOG.find(s => s.id === 'FORTES_TECNOLOGIA');
    expect(fortes?.name).toBe('Fortes Tecnologia');

    const sped = LEGACY_SOFTWARE_CATALOG.find(s => s.id === 'SPED_ECD_OFICIAL');
    expect(sped?.name).toContain('SPED Contábil');
  });

  it('2. UniversalLegacyMigrationEngine: processa arquivos de sistemas legados e calcula integridade SHA-256', () => {
    const content = '0000|01|DOMINIO|2026|1.1.1.01.01|Caixa Geral|D|15420.50';
    const batch = UniversalLegacyMigrationEngine.parseLegacyFile(
      content,
      'DOMINIO_THOMSON_REUTERS',
      'exportacao_dominio.txt'
    );

    expect(batch.batchId).toBeDefined();
    expect(batch.fileSha256).toHaveLength(64);
    expect(batch.totalAccountsDetected).toBeGreaterThan(0);
    expect(batch.totalEmployeesDetected).toBeGreaterThan(0);
    expect(batch.totalPartnersDetected).toBeGreaterThan(0);
  });

  it('3. UniversalLegacyMigrationEngine: realiza De-Para automático com alta confiança para contas IFRS/RFB', () => {
    const matchCaixa = UniversalLegacyMigrationEngine.mapToSoberanoStandard('Caixa Geral Filial 01', '1.1.1.01');
    expect(matchCaixa.code).toBe('1.1.1.01.0001');
    expect(matchCaixa.score).toBeGreaterThanOrEqual(95);

    const matchBanco = UniversalLegacyMigrationEngine.mapToSoberanoStandard('Banco Itau Conta Corrente', '1.1.1.02');
    expect(matchBanco.code).toBe('1.1.1.02.0001');
    expect(matchBanco.score).toBeGreaterThanOrEqual(95);

    const matchFornec = UniversalLegacyMigrationEngine.mapToSoberanoStandard('Fornecedores Nacionais Diversos', '2.1.1.01');
    expect(matchFornec.code).toBe('2.1.1.01.0001');
    expect(matchFornec.score).toBeGreaterThanOrEqual(95);

    const matchSalario = UniversalLegacyMigrationEngine.mapToSoberanoStandard('Salarios a Pagar Folha', '2.1.2.01');
    expect(matchSalario.code).toBe('2.1.2.01.0001');
    expect(matchSalario.score).toBeGreaterThanOrEqual(95);
  });

  it('4. UniversalLegacyMigrationEngine: valida equilíbrio exato de partidas dobradas e equação patrimonial', () => {
    const batch = UniversalLegacyMigrationEngine.parseLegacyFile(
      'SAMPLE_DATA',
      'SPED_ECD_OFICIAL',
      'ecd_2025.sped'
    );

    expect(batch.isBalanced).toBe(true);
    expect(batch.balanceDifference).toBe(0);
    expect(batch.totalOpeningBalanceDebit).toBe(batch.totalOpeningBalanceCredit);
  });

  it('5. OfficeClientOnboardingMigrationView: renderiza o painel executivo com abas 3D e Dossiê A4', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeClientOnboardingMigrationView)
    );

    expect(html).toContain('Central Universal de Migração');
    expect(html).toContain('10 SISTEMAS COMPATÍVEIS');
    expect(html).toContain('Domínio Sistemas');
    expect(html).toContain('Alterdata Pack');
    expect(html).toContain('Fortes Tecnologia');
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('LAUDO OFICIAL DE MIGRAÇÃO E HOMOLOGAÇÃO DE SALDOS CONTÁBEIS');
  });
});
