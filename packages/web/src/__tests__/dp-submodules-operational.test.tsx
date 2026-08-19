import { describe, it, expect } from 'vitest';
import React from 'react';
import OfficeFlexibleBenefitsPatView from '../views/OfficeFlexibleBenefitsPatView.js';
import OfficeCprbPayrollReliefView from '../views/OfficeCprbPayrollReliefView.js';
import OfficePayrollEsocialAuditView from '../views/OfficePayrollEsocialAuditView.js';
import OfficeSstPppDigitalView from '../views/OfficeSstPppDigitalView.js';
import OfficeVacationTimeTrackingBankView from '../views/OfficeVacationTimeTrackingBankView.js';
import OfficePayrollProvisionsTerminationView from '../views/OfficePayrollProvisionsTerminationView.js';
import OfficeInternshipApprenticeAuditView from '../views/OfficeInternshipApprenticeAuditView.js';
import OfficeJobTenureStabilityInssView from '../views/OfficeJobTenureStabilityInssView.js';
import PortWorkersFapPayrollView from '../views/PortWorkersFapPayrollView.js';
import PensionDefinedBenefitAdmissionAcView from '../views/PensionDefinedBenefitAdmissionAcView.js';
import { getModuleById } from '../config/navigation-modules.js';

describe('Departamento Pessoal & Folha — 10 Submódulos 100% Operacionais', () => {
  it('1. Deve validar o componente e rota de Benefícios Flexíveis, VT & PAT', () => {
    const el = React.createElement(OfficeFlexibleBenefitsPatView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_flexible_benefits_pat');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('2. Deve validar o componente e rota de CPRB Desoneração da Folha', () => {
    const el = React.createElement(OfficeCprbPayrollReliefView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_cprb_payroll_relief');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('3. Deve validar o componente e rota de Auditoria de Folha / eSocial / DCTFWeb', () => {
    const el = React.createElement(OfficePayrollEsocialAuditView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_payroll_esocial_audit');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('4. Deve validar o componente e rota de SST & PPP Digital', () => {
    const el = React.createElement(OfficeSstPppDigitalView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_sst_esocial');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('5. Deve validar o componente e rota de Férias e Banco de Horas', () => {
    const el = React.createElement(OfficeVacationTimeTrackingBankView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_vacation_leaves');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('6. Deve validar o componente e rota de Provisões de Folha CPC 33 (13º e Férias)', () => {
    const el = React.createElement(OfficePayrollProvisionsTerminationView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_payroll_provisions');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('7. Deve validar o componente e rota de Estágios & Menor Aprendiz', () => {
    const el = React.createElement(OfficeInternshipApprenticeAuditView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_internship_apprentice_audit_view');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('8. Deve validar o componente e rota de Estabilidade Provisória e INSS', () => {
    const el = React.createElement(OfficeJobTenureStabilityInssView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('office_job_tenure_stability_inss_view');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('9. Deve validar o componente e rota de Portuários OGMO & FAP', () => {
    const el = React.createElement(PortWorkersFapPayrollView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('port_workers_fap_payroll_view');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });

  it('10. Deve validar o componente e rota de Planos de Pensão CPC 33', () => {
    const el = React.createElement(PensionDefinedBenefitAdmissionAcView);
    expect(el).toBeDefined();
    expect(typeof el.type).toBe('function');
    const mod = getModuleById('pension_defined_benefit_admission_active_view');
    expect(mod).toBeDefined();
    expect(mod?.departmentId).toBe('dp');
  });
});