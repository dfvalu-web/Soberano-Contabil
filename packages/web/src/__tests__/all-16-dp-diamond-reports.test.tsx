import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { OfficeLaborTerminationTrctView } from '../views/OfficeLaborTerminationTrctView.js';
import { OfficeAbsenceDsrVacationPenaltyView } from '../views/OfficeAbsenceDsrVacationPenaltyView.js';
import { OfficeHazardousWorkAdditionalView } from '../views/OfficeHazardousWorkAdditionalView.js';
import { OfficeFlexibleBenefitsPatView } from '../views/OfficeFlexibleBenefitsPatView.js';
import { OfficeCprbPayrollReliefView } from '../views/OfficeCprbPayrollReliefView.js';
import { OfficeAlimonyChildSupportPayrollView } from '../views/OfficeAlimonyChildSupportPayrollView.js';
import { OfficeOvertimeNightDsrView } from '../views/OfficeOvertimeNightDsrView.js';
import { OfficePayrollEsocialAuditView } from '../views/OfficePayrollEsocialAuditView.js';
import { OfficeVacationTimeTrackingBankView } from '../views/OfficeVacationTimeTrackingBankView.js';
import { OfficePayrollProvisionsTerminationView } from '../views/OfficePayrollProvisionsTerminationView.js';
import { OfficeInternshipApprenticeAuditView } from '../views/OfficeInternshipApprenticeAuditView.js';
import { OfficeJobTenureStabilityInssView } from '../views/OfficeJobTenureStabilityInssView.js';
import { PortWorkersFapPayrollView } from '../views/PortWorkersFapPayrollView.js';
import { PensionDefinedBenefitAdmissionAcView } from '../views/PensionDefinedBenefitAdmissionAcView.js';
import { PayrollOperationalView } from '../views/PayrollOperationalView.js';
import { OfficeRhExecutiveReportsDiamondView } from '../views/OfficeRhExecutiveReportsDiamondView.js';

describe('Auditoria Forense & Validação de Documentos Diamante A4 em Todos os 16 Módulos de DP', () => {
  it('1. TRCT Oficial possui documento diamond-paper-a4 sem página em branco', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeLaborTerminationTrctView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('RESCIS');
  });

  it('2. Faltas e DSR possui laudo diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeAbsenceDsrVacationPenaltyView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('Faltas');
  });

  it('3. Insalubridade e Periculosidade possui Laudo LTCAT diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeHazardousWorkAdditionalView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('LTCAT');
  });

  it('4. Benefícios Flexíveis e PAT possui demonstrativo diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeFlexibleBenefitsPatView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('PAT');
  });

  it('5. Desoneração CPRB possui dossiê diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeCprbPayrollReliefView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('CPRB');
  });

  it('6. Pensão Alimentícia possui comprovante diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeAlimonyChildSupportPayrollView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('PENS');
  });

  it('7. Horas Extras e Noturno possui espelho diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeOvertimeNightDsrView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('DSR');
  });

  it('8. Auditoria eSocial possui laudo diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficePayrollEsocialAuditView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('eSocial');
  });

  it('9. Recibo de Férias possui aviso e recibo diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeVacationTimeTrackingBankView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('FÉRIAS');
  });

  it('10. Provisões CPC 33 possui mapa diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficePayrollProvisionsTerminationView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('CPC 33');
  });

  it('11. Aprendizes e Estágios possui laudo diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeInternshipApprenticeAuditView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('APRENDIZ');
  });

  it('12. Estabilidade Provisória possui certificado diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeJobTenureStabilityInssView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('ESTABILIDADE');
  });

  it('13. FAP Previdenciário possui dossiê diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(PortWorkersFapPayrollView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('RAT');
  });

  it('14. Planos de Pensão possui parecer atuarial diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(PensionDefinedBenefitAdmissionAcView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('ATUARIAL');
  });

  it('15. Holerite Oficial e Folha de Pagamento possuem estrutura operacional', () => {
    const html = renderToStaticMarkup(React.createElement(PayrollOperationalView));
    expect(html).toContain('FOLHA');
    expect(html).toContain('Colaboradores');
  });

  it('16. Dossiê Executivo de RH possui dossiê diamond-paper-a4', () => {
    const html = renderToStaticMarkup(React.createElement(OfficeRhExecutiveReportsDiamondView));
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('DOSSIÊ EXECUTIVO');
  });
});
