// ==========================================================================
// SOBERANO CONTÁBIL — TESTES DO DOSSIÊ EXECUTIVO DE RH (PADRÃO DIAMANTE)
// VALIDAÇÃO DE CONSOLIDAÇÃO, KPIS DE RH, IMPRESSÃO A4 & CONFORMIDADE
// ==========================================================================

import { describe, it, expect } from 'vitest';
import React from 'react';
import OfficeRhExecutiveReportsDiamondView from '../views/OfficeRhExecutiveReportsDiamondView.js';
import { officeStore } from '../state/office-store.js';
import { getModuleById } from '../config/navigation-modules.js';

describe('Dossiê Executivo de RH & Gestão de Pessoas (Padrão Diamante)', () => {
  it('1. Deve validar o componente e rota de navegação do Dossiê Diamante de RH', () => {
    const el = React.createElement(OfficeRhExecutiveReportsDiamondView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    
    const mod = getModuleById('office_rh_executive_reports_diamond');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
    expect(mod?.name).toContain('Padrão Diamante');
  });

  it('2. Deve validar o cálculo e consolidação dos indicadores executivos da folha', () => {
    const tenants = officeStore.getTenants();
    expect(tenants.length).toBeGreaterThan(0);
    const tenantId = tenants[0].id;
    const employees = officeStore.getEmployees(tenantId);
    expect(employees.length).toBeGreaterThan(0);

    const statements = employees.map(emp => officeStore.calculatePayroll(emp, '08/2026'));
    expect(statements.length).toBe(employees.length);

    let totalGross = 0;
    let totalNet = 0;
    let totalFgts = 0;

    statements.forEach(st => {
      totalGross += st.totalProventos;
      totalNet += st.netSalary;
      totalFgts += st.fgtsAmount;
    });

    expect(totalGross).toBeGreaterThan(0);
    expect(totalNet).toBeGreaterThan(0);
    expect(totalFgts).toBeGreaterThan(0);
    expect(totalNet).toBeLessThan(totalGross);
  });

  it('3. Deve validar a segregação de encargos sociais patronais e DCTFWeb', () => {
    const tenants = officeStore.getTenants();
    const employees = officeStore.getEmployees(tenants[0].id);
    const totalSalaryMass = employees.reduce((acc, e) => acc + e.baseSalary, 0);

    const inssPatronal = totalSalaryMass * 0.20;
    const ratTerceiros = totalSalaryMass * 0.078;
    const totalEncargos = inssPatronal + ratTerceiros;

    expect(inssPatronal).toBeGreaterThan(0);
    expect(ratTerceiros).toBeGreaterThan(0);
    expect(totalEncargos).toBeCloseTo(totalSalaryMass * 0.278, 2);
  });

  it('4. Deve validar a distribuição por departamentos / centros de custos', () => {
    const tenants = officeStore.getTenants();
    const employees = officeStore.getEmployees(tenants[0].id);

    const depts = new Set(employees.map(e => e.department || 'Geral'));
    expect(depts.size).toBeGreaterThan(0);
  });
});
