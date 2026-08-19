import { describe, it, expect, beforeEach } from 'vitest';
import {
  officeEventBus,
  MonophasicTaxSegregatedPayload,
  PayrollClosedPayload,
  SectorialOperationPayload
} from '../state/office-event-bus';

describe('OfficeEventBus — Barramento Contábil & Sincronização em Tempo Real', () => {
  beforeEach(() => {
    officeEventBus.clear();
  });

  it('deve emitir e receber eventos de segregação monofásica gerando partida dobrada no diário', () => {
    let captured = false;
    const unsub = officeEventBus.subscribe('MONOPHASIC_TAX_SEGREGATED', (evt) => {
      expect(evt.tenantId).toBe('t2');
      captured = true;
    });

    const payload: MonophasicTaxSegregatedPayload = {
      id: 'evt-mono-1',
      type: 'MONOPHASIC_TAX_SEGREGATED',
      timestamp: new Date().toISOString(),
      tenantId: 't2',
      tenantName: 'Drogaria Alvorada Ltda',
      description: 'Segregação de PIS/COFINS e ICMS-ST Farmácia',
      faturamentoTotal: 180000,
      receitaMonofasica: 115000,
      receitaIcmsSt: 115000,
      dasNormal: 17100,
      dasSegregado: 10947.50,
      economiaTributaria: 6152.50,
      debitAccount: '2.1.1.01 - Simples Nacional a Recolher [Passivo]',
      creditAccount: '3.1.2.05 - Deduções da Receita Monofásica [Resultado]'
    };

    officeEventBus.emit(payload);
    expect(captured).toBe(true);

    const records = officeEventBus.getLedgerSyncRecords('t2');
    expect(records.length).toBe(1);
    expect(records[0].amount).toBe(6152.50);
    expect(records[0].isAcidSynced).toBe(true);
    expect(records[0].legalBase).toContain('Lei Complementar 123/2006');

    unsub();
  });

  it('deve sincronizar o fechamento de folha de pagamento com as contas de resultado e passivo', () => {
    const payload: PayrollClosedPayload = {
      id: 'evt-pay-1',
      type: 'PAYROLL_CLOSED',
      timestamp: new Date().toISOString(),
      tenantId: 't1',
      tenantName: 'Soberano Tech S/A',
      description: 'Fechamento Folha 08/2026',
      competencia: '08/2026',
      totalBruto: 45000,
      totalLiquido: 36200,
      totalInss: 4800,
      totalIrrf: 4000,
      totalFgts: 3600,
      employeesCount: 5
    };

    officeEventBus.emit(payload);

    const records = officeEventBus.getLedgerSyncRecords('t1');
    expect(records.length).toBe(1);
    expect(records[0].amount).toBe(45000);
    expect(records[0].debitAccount).toContain('4.1.1.01 - Despesas com Salários');
    expect(records[0].creditAccount).toContain('2.1.2.01 - Salários e Encargos a Pagar');
  });

  it('deve sincronizar operações setoriais especializadas (Agro CPR, Lei do Bem, etc.)', () => {
    const payload: SectorialOperationPayload = {
      id: 'evt-sec-1',
      type: 'SECTORIAL_OPERATION_POSTED',
      timestamp: new Date().toISOString(),
      tenantId: 't5',
      tenantName: 'Agropecuária Vale do Sol',
      description: 'Emissão de Cédula de Produto Rural CPR Soja',
      sectorName: 'Agronegócio',
      operationType: 'Emissão de CPR Física',
      amount: 250000,
      debitAccount: '1.1.1.02 - Banco Conta Movimento [Ativo]',
      creditAccount: '2.1.3.01 - Financiamentos Rurais CPR [Passivo]',
      legalBase: 'Lei 8.929/1994 (Cédula de Produto Rural)',
      auditHash: 'sha256-abc123cpr'
    };

    officeEventBus.emit(payload);

    const records = officeEventBus.getLedgerSyncRecords('t5');
    expect(records.length).toBe(1);
    expect(records[0].amount).toBe(250000);
    expect(records[0].history).toContain('Emissão de CPR Física');
  });
});