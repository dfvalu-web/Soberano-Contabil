import { describe, it, expect } from 'vitest';
import React from 'react';
import { OfficeCfoVirtualFinancialDecisionView } from '../views/OfficeCfoVirtualFinancialDecisionView.js';
import { officeEventBus, MonophasicTaxSegregatedPayload } from '../state/office-event-bus.js';
import { getModuleById, ALL_MODULES } from '../config/navigation-modules.js';

describe('CFO Virtual Financial Decision View & Dashboard Suite', () => {
  it('verifies navigation module is correctly registered in contabil category', () => {
    const mod = getModuleById('financial_statement_analysis_cfo');
    expect(mod).toBeDefined();
    expect(mod?.name).toBe('Análise das Demonstrações & CFO Virtual');
    expect(mod?.departmentId).toBe('contabil');
    expect(mod?.isCore).toBe(true);
    expect(mod?.icon).toBe('💎');
  });

  it('renders OfficeCfoVirtualFinancialDecisionView element as a valid React component', () => {
    const element = React.createElement(OfficeCfoVirtualFinancialDecisionView);
    expect(element).toBeDefined();
    expect(typeof element.type).toBe('function');
  });

  it('verifies officeEventBus communication for financial analysis and tax sync', () => {
    let eventReceived = false;
    const unsub = officeEventBus.subscribe('MONOPHASIC_TAX_SEGREGATED', (event) => {
      if (event.type === 'MONOPHASIC_TAX_SEGREGATED') {
        eventReceived = true;
      }
    });

    const eventPayload: MonophasicTaxSegregatedPayload = {
      id: 'evt-test-1',
      type: 'MONOPHASIC_TAX_SEGREGATED',
      timestamp: new Date().toISOString(),
      tenantId: 'tenant-test-1',
      tenantName: 'Indústria Alpha S/A',
      description: 'Segregação de Monofásicos PIS/COFINS',
      faturamentoTotal: 500000,
      receitaMonofasica: 150000,
      receitaIcmsSt: 50000,
      dasNormal: 35000,
      dasSegregado: 28000,
      economiaTributaria: 7000,
      debitAccount: '1.1.02.01 - Clientes',
      creditAccount: '3.1.01.01 - Receita Bruta'
    };

    officeEventBus.emit(eventPayload);

    expect(eventReceived).toBe(true);
    unsub();
  });
});
