// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DO LIVRO DIÁRIO GERAL & PARTIDAS DOBRADAS ACID
// Suporte a Partidas Simples e Múltiplas, Centros de Custo e Integridade IFRS
// ==========================================================================

import { referentialChartService, AccountNode } from '../chart-of-accounts/referential-mapping';

export interface JournalEntryLine {
  id: string;
  accountCode: string; // Ex: '1.1.1.02'
  accountName: string;
  type: 'DEBITO' | 'CREDITO';
  amount: number;
  costCenterId?: string;
  costCenterName?: string;
  historyComplement?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: number; // Sequencial 1, 2, 3...
  tenantId: string;
  date: string; // YYYY-MM-DD
  standardHistoryCode?: string;
  generalHistory: string;
  lines: JournalEntryLine[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  documentType?: string; // 'NFE', 'OFX', 'FOLHA', 'IMPOSTO', 'MANUAL'
  documentNumber?: string;
  auditHash: string;
  createdAt: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
}

export class GeneralJournalEngine {
  private entries: JournalEntry[] = [];
  private entrySequence = 1000;

  constructor() {
    this.seedDefaultEntries();
  }

  /**
   * Registra um novo lançamento contábil garantindo a integridade ACID (D = C)
   */
  public postEntry(params: {
    tenantId: string;
    date: string;
    generalHistory: string;
    lines: Omit<JournalEntryLine, 'id' | 'accountName'>[];
    documentType?: string;
    documentNumber?: string;
  }): { success: boolean; entry?: JournalEntry; error?: string } {
    if (!params.lines || params.lines.length < 2) {
      return { success: false, error: 'O lançamento contábil exige no mínimo duas partidas (1 Débito e 1 Crédito).' };
    }

    let totalDebits = 0;
    let totalCredits = 0;

    const validatedLines: JournalEntryLine[] = [];

    for (let i = 0; i < params.lines.length; i++) {
      const rawLine = params.lines[i];
      const account = referentialChartService.getAccountByCode(rawLine.accountCode);

      if (!account) {
        return { success: false, error: `Conta contábil [${rawLine.accountCode}] não encontrada no Plano de Contas.` };
      }

      if (account.isSynthetic) {
        return { success: false, error: `A conta [${account.code} - ${account.name}] é sintética de grupo e não aceita lançamentos.` };
      }

      if (rawLine.amount <= 0) {
        return { success: false, error: 'O valor da linha de lançamento deve ser estritamente positivo.' };
      }

      const cleanAmount = Math.round(rawLine.amount * 100) / 100;

      if (rawLine.type === 'DEBITO') {
        totalDebits += cleanAmount;
      } else {
        totalCredits += cleanAmount;
      }

      validatedLines.push({
        id: `line-${Date.now()}-${i}`,
        accountCode: account.code,
        accountName: account.name,
        type: rawLine.type,
        amount: cleanAmount,
        costCenterId: rawLine.costCenterId,
        costCenterName: rawLine.costCenterName,
        historyComplement: rawLine.historyComplement
      });
    }

    totalDebits = Math.round(totalDebits * 100) / 100;
    totalCredits = Math.round(totalCredits * 100) / 100;
    const diff = Math.abs(totalDebits - totalCredits);

    if (diff > 0.009) {
      return {
        success: false,
        error: `Desbalanceamento de Partidas Dobradas: Débitos (R$ ${totalDebits.toFixed(2)}) != Créditos (R$ ${totalCredits.toFixed(2)}). Diferença: R$ ${diff.toFixed(2)}.`
      };
    }

    this.entrySequence += 1;
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entryNumber: this.entrySequence,
      tenantId: params.tenantId,
      date: params.date,
      generalHistory: params.generalHistory,
      lines: validatedLines,
      totalDebits,
      totalCredits,
      isBalanced: true,
      documentType: params.documentType || 'MANUAL',
      documentNumber: params.documentNumber,
      auditHash: `sha256-${Date.now()}-${totalDebits}`,
      createdAt: new Date().toISOString()
    };

    this.entries.unshift(newEntry);
    return { success: true, entry: newEntry };
  }

  /**
   * Retorna os lançamentos contábeis filtrados por Tenant e Período
   */
  public getEntries(tenantId?: string, startDate?: string, endDate?: string): JournalEntry[] {
    let filtered = this.entries;

    if (tenantId) {
      filtered = filtered.filter(e => e.tenantId === tenantId);
    }
    if (startDate) {
      filtered = filtered.filter(e => e.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(e => e.date <= endDate);
    }

    return filtered;
  }

  /**
   * Retorna os totais de Débito, Crédito e o saldo do Livro Diário
   */
  public getLedgerTotals(tenantId?: string) {
    const list = this.getEntries(tenantId);
    const totalDebits = list.reduce((acc, e) => acc + e.totalDebits, 0);
    const totalCredits = list.reduce((acc, e) => acc + e.totalCredits, 0);

    return {
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
      entriesCount: list.length
    };
  }

  /**
   * Inicializa lançamentos contábeis modelo para demonstração imediata
   */
  private seedDefaultEntries() {
    // 1. Abertura e Integralização de Capital
    this.postEntry({
      tenantId: 't1',
      date: '2026-08-01',
      generalHistory: 'Integralização de Capital Social em moeda corrente nacional',
      documentType: 'CONTRATO_SOCIAL',
      documentNumber: 'CS-001/26',
      lines: [
        { accountCode: '1.1.1.02', type: 'DEBITO', amount: 500000, historyComplement: 'Banco Conta Movimento' },
        { accountCode: '2.3.1.01', type: 'CREDITO', amount: 500000, historyComplement: 'Capital Social Realizado' }
      ]
    });

    // 2. Venda de Serviços / Software com recebimento a prazo
    this.postEntry({
      tenantId: 't1',
      date: '2026-08-05',
      generalHistory: 'Emissão de NFS-e ref. licenciamento de plataforma de software',
      documentType: 'NFSE',
      documentNumber: 'NFS-1044',
      lines: [
        { accountCode: '1.1.2.01', type: 'DEBITO', amount: 180000, costCenterName: 'Comercial & Tech', historyComplement: 'Duplicatas a Receber' },
        { accountCode: '3.1.1.02', type: 'CREDITO', amount: 180000, costCenterName: 'Comercial & Tech', historyComplement: 'Receita Bruta de Serviços' }
      ]
    });

    // 3. Apropriação de Folha de Pagamento com encargos
    this.postEntry({
      tenantId: 't1',
      date: '2026-08-10',
      generalHistory: 'Apropriação da Folha de Pagamento e Encargos Sociais 08/2026',
      documentType: 'FOLHA',
      documentNumber: 'FOLHA-08/26',
      lines: [
        { accountCode: '4.1.1.01', type: 'DEBITO', amount: 65000, costCenterName: 'Operações & Dev', historyComplement: 'Salários e Ordenados' },
        { accountCode: '2.1.2.01', type: 'CREDITO', amount: 53000, historyComplement: 'Salários Líquidos a Pagar' },
        { accountCode: '2.1.2.02', type: 'CREDITO', amount: 7200, historyComplement: 'INSS a Recolher' },
        { accountCode: '2.1.2.03', type: 'CREDITO', amount: 4800, historyComplement: 'FGTS a Recolher' }
      ]
    });

    // 4. Drogaria Alvorada - Venda de Medicamentos com recebimento via Cartão/Pix
    this.postEntry({
      tenantId: 't2',
      date: '2026-08-08',
      generalHistory: 'Venda de produtos farmacêuticos com tributação monofásica',
      documentType: 'NFCE',
      documentNumber: 'NFC-8821',
      lines: [
        { accountCode: '1.1.2.02', type: 'DEBITO', amount: 95000, historyComplement: 'Cartões e Pix a Receber' },
        { accountCode: '3.1.1.01', type: 'CREDITO', amount: 95000, historyComplement: 'Receita Bruta com Venda de Medicamentos' }
      ]
    });
  }
}

export const generalJournalEngine = new GeneralJournalEngine();
export default generalJournalEngine;