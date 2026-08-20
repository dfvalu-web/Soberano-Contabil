import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficeSandboxEngine } from '../engines/office-sandbox-engine';
import { OfficeSandboxIsolationLabView } from '../views/OfficeSandboxIsolationLabView';

describe('Laboratório Sandbox & Quarentena Empresarial (Isolamento Pré-Produção)', () => {
  it('1. OfficeSandboxEngine: retorna empresas ativas em quarentena com isolamento de dados', () => {
    const list = OfficeSandboxEngine.getIsolatedCompanies();
    expect(list.length).toBeGreaterThanOrEqual(2);

    const delta = list.find(i => i.id === 'SBX-001');
    expect(delta?.corporateName).toContain('DELTA TECH');
    expect(delta?.status).toBe('EM_SIMULACAO');
    expect(delta?.isBalanced).toBe(true);

    const omega = list.find(i => i.id === 'SBX-002');
    expect(omega?.corporateName).toContain('OMEGA LOGISTICA');
    expect(omega?.isBalanced).toBe(false);
  });

  it('2. OfficeSandboxEngine: isola nova empresa da produção com motivo e responsável registrado', () => {
    const created = OfficeSandboxEngine.isolateCompany(
      '77.888.999/0001-00',
      'ALPHA CONSULTORIA TESTE LTDA',
      'Alpha Consult',
      'SIMPLES_NACIONAL',
      'Reabertura de Balanço 2025 para Auditoria',
      'dfvalu@gmail.com'
    );

    expect(created.id).toContain('SBX-');
    expect(created.status).toBe('EM_QUARENTENA');
    expect(created.isolatedBy).toBe('dfvalu@gmail.com');
  });

  it('3. OfficeSandboxEngine: simula cenários tributários What-If calculando economia de caixa', () => {
    const updated = OfficeSandboxEngine.applyTaxScenario('SBX-001', 'LUCRO_PRESUMIDO');
    expect(updated).not.toBeNull();
    expect(updated?.sandboxTaxRegime).toBe('LUCRO_PRESUMIDO');
    expect(updated?.appliedScenarios.length).toBeGreaterThan(0);
  });

  it('4. OfficeSandboxEngine: bloqueia promoção de empresas com divergência e homologa empresas equilibradas', () => {
    // Tentativa em empresa desbalanceada deve falhar
    const failResult = OfficeSandboxEngine.promoteToProduction('SBX-002', 'dfvalu@gmail.com');
    expect(failResult.success).toBe(false);
    expect(failResult.message).toContain('divergências');

    // Corrigir divergência
    const fixed = OfficeSandboxEngine.fixDiscrepancy('SBX-002');
    expect(fixed?.isBalanced).toBe(true);

    // Agora a promoção deve ser aprovada
    const successResult = OfficeSandboxEngine.promoteToProduction('SBX-002', 'dfvalu@gmail.com');
    expect(successResult.success).toBe(true);
    expect(successResult.message).toContain('homologada com sucesso');
  });

  it('5. OfficeSandboxIsolationLabView: renderiza o painel executivo com abas 3D e isolamento seguro', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeSandboxIsolationLabView)
    );

    expect(html).toContain('Laboratório Sandbox &amp; Quarentena Empresarial');
    expect(html).toContain('AMBIENTE SEGURO DE HOMOLOGAÇÃO');
    expect(html).toContain('Empresas em Quarentena');
    expect(html).toContain('dfvalu@gmail.com');
    expect(html).toContain('DELTA TECH');
    expect(html).toContain('OMEGA LOGISTICA');
  });
});
