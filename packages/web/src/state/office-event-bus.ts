// ==========================================================================
// SOBERANO CONTÁBIL — BARRAMENTO CENTRAL DE EVENTOS CONTÁBEIS & FISCAIS
// Sincronização em Tempo Real entre Módulos Setoriais, Livro Diário & DRE
// ==========================================================================

export type AccountingEventType =
  | 'MONOPHASIC_TAX_SEGREGATED'
  | 'PAYROLL_CLOSED'
  | 'LABOR_TERMINATION_EXECUTED'
  | 'SECTORIAL_OPERATION_POSTED'
  | 'BANK_RECONCILIATION_SYNCED'
  | 'ANNUAL_CLOSING_ARE_EXECUTED';

export interface BaseAccountingEvent {
  id: string;
  type: AccountingEventType;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  description: string;
}

export interface MonophasicTaxSegregatedPayload extends BaseAccountingEvent {
  type: 'MONOPHASIC_TAX_SEGREGATED';
  faturamentoTotal: number;
  receitaMonofasica: number;
  receitaIcmsSt: number;
  dasNormal: number;
  dasSegregado: number;
  economiaTributaria: number;
  debitAccount: string;
  creditAccount: string;
}

export interface PayrollClosedPayload extends BaseAccountingEvent {
  type: 'PAYROLL_CLOSED';
  competencia: string;
  totalBruto: number;
  totalLiquido: number;
  totalInss: number;
  totalIrrf: number;
  totalFgts: number;
  employeesCount: number;
}

export interface SectorialOperationPayload extends BaseAccountingEvent {
  type: 'SECTORIAL_OPERATION_POSTED';
  sectorName: string; // Ex: 'Agronegócio', 'Farmácia', 'Construção Civil RET', 'Startups Lei do Bem'
  operationType: string; // Ex: 'Venda de Soja CPR', 'Crédito P&D Lei do Bem', 'Retenção RET 4%'
  amount: number;
  debitAccount: string;
  creditAccount: string;
  legalBase: string; // Ex: 'Art. 193 Lei 6.404/76', 'Lei 11.196/05'
  auditHash: string;
}

export type OfficeEventPayload =
  | MonophasicTaxSegregatedPayload
  | PayrollClosedPayload
  | SectorialOperationPayload
  | BaseAccountingEvent;

export interface LedgerSyncRecord {
  id: string;
  eventId: string;
  date: string;
  tenantId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  history: string;
  legalBase?: string;
  isAcidSynced: boolean;
}

type EventCallback = (event: OfficeEventPayload) => void;

class OfficeEventBus {
  private listeners: Map<AccountingEventType | '*', Set<EventCallback>> = new Map();
  private ledgerSyncLog: LedgerSyncRecord[] = [];
  private eventHistory: OfficeEventPayload[] = [];

  constructor() {
    this.initDefaultSyncListeners();
  }

  /**
   * Subscribe to specific or all accounting events
   */
  public subscribe(eventType: AccountingEventType | '*', callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Publish an accounting/fiscal event across all modules
   */
  public emit(event: OfficeEventPayload): void {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 500) this.eventHistory.pop();

    // Notify specific listeners
    const specificListeners = this.listeners.get(event.type);
    if (specificListeners) {
      specificListeners.forEach(cb => {
        try {
          cb(event);
        } catch (err) {
          console.error('[OfficeEventBus] Listener error:', err);
        }
      });
    }

    // Notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(cb => {
        try {
          cb(event);
        } catch (err) {
          console.error('[OfficeEventBus] Wildcard listener error:', err);
        }
      });
    }
  }

  /**
   * Internal automatic ledger synchronization rules
   */
  private initDefaultSyncListeners(): void {
    // 1. Sincronização de Segregação Monofásica -> Livro Diário
    this.subscribe('MONOPHASIC_TAX_SEGREGATED', (evt) => {
      const p = evt as MonophasicTaxSegregatedPayload;
      const record: LedgerSyncRecord = {
        id: 'sync-mono-' + Date.now(),
        eventId: p.id,
        date: new Date().toISOString().split('T')[0],
        tenantId: p.tenantId,
        debitAccount: p.debitAccount || '2.1.1.01 - Simples Nacional a Recolher [Passivo]',
        creditAccount: p.creditAccount || '3.1.2.05 - Deduções da Receita Monofásica / PIS COFINS [Resultado]',
        amount: p.economiaTributaria,
        history: `Vlr. ref. economia e exclusão monofásica PGDAS-D (${p.tenantName})`,
        legalBase: 'Art. 18 Lei Complementar 123/2006 & Lei 10.147/2000',
        isAcidSynced: true
      };
      this.ledgerSyncLog.unshift(record);
    });

    // 2. Sincronização de Fechamento de Folha -> Livro Diário
    this.subscribe('PAYROLL_CLOSED', (evt) => {
      const p = evt as PayrollClosedPayload;
      const record: LedgerSyncRecord = {
        id: 'sync-pay-' + Date.now(),
        eventId: p.id,
        date: new Date().toISOString().split('T')[0],
        tenantId: p.tenantId,
        debitAccount: '4.1.1.01 - Despesas com Salários e Ordenados [Resultado]',
        creditAccount: '2.1.2.01 - Salários e Encargos a Pagar [Passivo]',
        amount: p.totalBruto,
        history: `Vlr. ref. apropriação da folha de pagamento ${p.competencia} (${p.employeesCount} colaboradores)`,
        legalBase: 'CLT Art. 459 & Pronunciamento Técnico CPC 33',
        isAcidSynced: true
      };
      this.ledgerSyncLog.unshift(record);
    });

    // 3. Sincronização de Operações Setoriais Especializadas -> Livro Diário
    this.subscribe('SECTORIAL_OPERATION_POSTED', (evt) => {
      const p = evt as SectorialOperationPayload;
      const record: LedgerSyncRecord = {
        id: 'sync-sec-' + Date.now(),
        eventId: p.id,
        date: new Date().toISOString().split('T')[0],
        tenantId: p.tenantId,
        debitAccount: p.debitAccount,
        creditAccount: p.creditAccount,
        amount: p.amount,
        history: `Vlr. ref. ${p.operationType} [${p.sectorName}] • ${p.description}`,
        legalBase: p.legalBase,
        isAcidSynced: true
      };
      this.ledgerSyncLog.unshift(record);
    });
  }

  /**
   * Get all synced ledger records
   */
  public getLedgerSyncRecords(tenantId?: string): LedgerSyncRecord[] {
    if (!tenantId) return this.ledgerSyncLog;
    return this.ledgerSyncLog.filter(r => r.tenantId === tenantId);
  }

  /**
   * Get recent event history
   */
  public getEventHistory(tenantId?: string): OfficeEventPayload[] {
    if (!tenantId) return this.eventHistory;
    return this.eventHistory.filter(e => e.tenantId === tenantId);
  }

  /**
   * Reset logs (for testing purposes)
   */
  public clear(): void {
    this.ledgerSyncLog = [];
    this.eventHistory = [];
  }
}

export const officeEventBus = new OfficeEventBus();
export default officeEventBus;