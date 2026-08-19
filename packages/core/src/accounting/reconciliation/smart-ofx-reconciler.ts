// ==========================================================================
// SOBERANO CONTÁBIL — RECONCILIADOR BANCÁRIO OFX INTELIGENTE COM IA
// Parser OFX/CSV e Motor de Autoclassificação com Geração de Partidas Dobradas
// ==========================================================================

import { generalJournalEngine, JournalEntry } from '../ledger/general-journal-engine';
import { referentialChartService } from '../chart-of-accounts/referential-mapping';

export interface BankTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // positive = credit (entry), negative = debit (exit)
  description: string;
  fitId: string;
  bankName: string;
  suggestedAccountCode: string;
  suggestedAccountName: string;
  confidenceScore: number; // 0.0 to 1.0 (ex: 0.95 = 95%)
  ruleApplied: string;
  status: 'PENDENTE' | 'CONCILIADO' | 'IGNORADO';
  generatedJournalEntryId?: string;
}

export interface OfxParseResult {
  bankId: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  transactions: BankTransaction[];
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
}

export class SmartOfxReconciler {
  private transactions: Map<string, BankTransaction[]> = new Map(); // Key = tenantId

  constructor() {
    this.seedDefaultTransactions();
  }

  /**
   * Analisa texto de extrato OFX ou CSV e extrai as transações com autoclassificação
   */
  public parseOfxContent(ofxText: string, bankName: string = 'Banco Itaú'): OfxParseResult {
    const transactions: BankTransaction[] = [];
    let totalCredits = 0;
    let totalDebits = 0;

    // Regex para capturar blocos <STMTTRN>...</STMTTRN>
    const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match;

    while ((match = trnRegex.exec(ofxText)) !== null) {
      const block = match[1];

      const typeMatch = /<TRNTYPE>([^<\r\n]+)/i.exec(block);
      const dateMatch = /<DTPOSTED>(\d{8})/i.exec(block);
      const amountMatch = /<TRNAMT>([-\d.,]+)/i.exec(block);
      const fitIdMatch = /<FITID>([^<\r\n]+)/i.exec(block);
      const memoMatch = /<MEMO>([^<\r\n]+)/i.exec(block);

      if (dateMatch && amountMatch) {
        const rawDate = dateMatch[1];
        const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;
        const amount = parseFloat(amountMatch[1].replace(',', '.'));
        const memo = memoMatch ? memoMatch[1].trim() : 'Transação Bancária';
        const fitId = fitIdMatch ? fitIdMatch[1].trim() : `fit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

        if (amount >= 0) {
          totalCredits += amount;
        } else {
          totalDebits += Math.abs(amount);
        }

        const classification = this.autoClassifyTransaction(memo, amount);

        transactions.push({
          id: `tx-${fitId}`,
          date: formattedDate,
          amount,
          description: memo,
          fitId,
          bankName,
          suggestedAccountCode: classification.accountCode,
          suggestedAccountName: classification.accountName,
          confidenceScore: classification.confidence,
          ruleApplied: classification.rule,
          status: 'PENDENTE'
        });
      }
    }

    // Se o formato não for XML OFX padrão, gerar transações a partir de linhas CSV/Texto simples
    if (transactions.length === 0 && ofxText.trim().length > 0) {
      const lines = ofxText.split('\n');
      for (const line of lines) {
        const parts = line.split(/[;,]/);
        if (parts.length >= 3) {
          const datePart = parts[0].trim();
          const memoPart = parts[1].trim();
          const amountPart = parseFloat(parts[2].replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

          if (!isNaN(amountPart) && memoPart) {
            const classification = this.autoClassifyTransaction(memoPart, amountPart);
            if (amountPart >= 0) totalCredits += amountPart;
            else totalDebits += Math.abs(amountPart);

            transactions.push({
              id: `tx-csv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              date: datePart.includes('-') ? datePart : new Date().toISOString().split('T')[0],
              amount: amountPart,
              description: memoPart,
              fitId: `fit-csv-${Date.now()}`,
              bankName,
              suggestedAccountCode: classification.accountCode,
              suggestedAccountName: classification.accountName,
              confidenceScore: classification.confidence,
              ruleApplied: classification.rule,
              status: 'PENDENTE'
            });
          }
        }
      }
    }

    return {
      bankId: '341',
      accountNumber: '44912-0',
      startDate: transactions.length > 0 ? transactions[0].date : new Date().toISOString().split('T')[0],
      endDate: transactions.length > 0 ? transactions[transactions.length - 1].date : new Date().toISOString().split('T')[0],
      transactions,
      totalCredits: Math.round(totalCredits * 100) / 100,
      totalDebits: Math.round(totalDebits * 100) / 100,
      netBalance: Math.round((totalCredits - totalDebits) * 100) / 100
    };
  }

  /**
   * Motor de IA de autoclassificação baseado em padrões e regras fiscais/contábeis
   */
  public autoClassifyTransaction(memo: string, amount: number): {
    accountCode: string;
    accountName: string;
    confidence: number;
    rule: string;
  } {
    const text = memo.toUpperCase();

    // 1. Tarifas e Despesas Bancárias
    if (text.includes('TARIFA') || text.includes('MANUT') || text.includes('TED') || text.includes('DOC') || text.includes('ENCARGOS') || text.includes('IOF')) {
      return {
        accountCode: '4.1.3.02',
        accountName: 'Despesas Bancárias, Tarifas e Taxas de Cartão',
        confidence: 0.98,
        rule: 'Regra Padrão: Despesas Financeiras e Tarifas de Manutenção Bancária'
      };
    }

    // 2. Salários e Encargos do Pessoal
    if (text.includes('FOLHA') || text.includes('SALARIO') || text.includes('PAGTO SAL') || text.includes('PRO-LABORE') || text.includes('ADIANTAMENTO')) {
      return {
        accountCode: '2.1.2.01',
        accountName: 'Salários e Ordenados a Pagar',
        confidence: 0.95,
        rule: 'Regra Padrão: Liquidação de Passivo Trabalhista / Folha'
      };
    }

    // 3. Impostos e Tributos Federais / Estaduais
    if (text.includes('DAS') || text.includes('DARF') || text.includes('GPS') || text.includes('FGTS') || text.includes('RECEITA FEDERAL') || text.includes('SEFAZ')) {
      return {
        accountCode: '2.1.3.01',
        accountName: 'Simples Nacional a Recolher (PGDAS-D)',
        confidence: 0.94,
        rule: 'Regra Padrão: Recolhimento de Guias Fiscais e Tributos'
      };
    }

    // 4. Recebimento de Clientes / Vendas / Pix
    if (amount > 0 && (text.includes('PIX') || text.includes('TRANSF') || text.includes('TED') || text.includes('DEPOSITO') || text.includes('CRED') || text.includes('CIELO') || text.includes('REDE') || text.includes('STONE'))) {
      return {
        accountCode: '1.1.2.01',
        accountName: 'Clientes Nacionais a Receber (Duplicatas)',
        confidence: 0.92,
        rule: 'Regra Padrão: Recebimento de Clientes / Liquidação de Duplicatas'
      };
    }

    // 5. Pagamento a Fornecedores / Insumos
    if (amount < 0 && (text.includes('FORNECEDOR') || text.includes('BOLETO') || text.includes('PAGTO') || text.includes('COMPRA') || text.includes('DISTRIBUIDORA'))) {
      return {
        accountCode: '2.1.1.01',
        accountName: 'Fornecedores Nacionais a Pagar',
        confidence: 0.90,
        rule: 'Regra Padrão: Pagamento a Fornecedores de Mercadorias e Insumos'
      };
    }

    // Fallback padrão
    if (amount > 0) {
      return {
        accountCode: '3.1.1.01',
        accountName: 'Receita Bruta com Venda de Mercadorias / Produtos',
        confidence: 0.75,
        rule: 'Regra Heurística: Entrada de Recursos Operacionais'
      };
    } else {
      return {
        accountCode: '4.1.3.01',
        accountName: 'Despesas Gerais, Aluguéis, Energia e Telefonia',
        confidence: 0.75,
        rule: 'Regra Heurística: Saída Operacional / Despesa Administrativa'
      };
    }
  }

  /**
   * Executa a conciliação de uma transação, gerando automaticamente a partida dobrada no Diário
   */
  public reconcileTransaction(tenantId: string, transactionId: string, customAccountCode?: string): { success: boolean; entry?: JournalEntry; error?: string } {
    const list = this.transactions.get(tenantId) || [];
    const tx = list.find(t => t.id === transactionId);

    if (!tx) {
      return { success: false, error: 'Transação bancária não encontrada.' };
    }

    if (tx.status === 'CONCILIADO') {
      return { success: false, error: 'Esta transação já foi conciliada anteriormente.' };
    }

    const contraAccountCode = customAccountCode || tx.suggestedAccountCode;
    const absAmount = Math.abs(tx.amount);

    // Banco Conta Movimento
    const bankAccountCode = '1.1.1.02';

    let lines: { accountCode: string; type: 'DEBITO' | 'CREDITO'; amount: number; historyComplement?: string }[];

    if (tx.amount > 0) {
      // Entrada de Dinheiro: Débito Banco / Crédito Conta Contrapartida (ex: Clientes)
      lines = [
        { accountCode: bankAccountCode, type: 'DEBITO', amount: absAmount, historyComplement: `Entrada ref. ${tx.description}` },
        { accountCode: contraAccountCode, type: 'CREDITO', amount: absAmount, historyComplement: tx.description }
      ];
    } else {
      // Saída de Dinheiro: Débito Conta Contrapartida (ex: Fornecedores) / Crédito Banco
      lines = [
        { accountCode: contraAccountCode, type: 'DEBITO', amount: absAmount, historyComplement: tx.description },
        { accountCode: bankAccountCode, type: 'CREDITO', amount: absAmount, historyComplement: `Saída bancária ref. ${tx.description}` }
      ];
    }

    const result = generalJournalEngine.postEntry({
      tenantId,
      date: tx.date,
      generalHistory: `Conciliação Bancária OFX (${tx.bankName}) • ${tx.description}`,
      documentType: 'OFX',
      documentNumber: tx.fitId,
      lines
    });

    if (result.success && result.entry) {
      tx.status = 'CONCILIADO';
      tx.generatedJournalEntryId = result.entry.id;
      return { success: true, entry: result.entry };
    }

    return { success: false, error: result.error };
  }

  /**
   * Executa a conciliação em lote 1-Click de todas as transações com confiança >= 85%
   */
  public batchReconcileAll(tenantId: string): { totalReconciled: number; totalAmount: number } {
    const list = this.transactions.get(tenantId) || [];
    let totalReconciled = 0;
    let totalAmount = 0;

    for (const tx of list) {
      if (tx.status === 'PENDENTE' && tx.confidenceScore >= 0.85) {
        const res = this.reconcileTransaction(tenantId, tx.id);
        if (res.success) {
          totalReconciled++;
          totalAmount += Math.abs(tx.amount);
        }
      }
    }

    return {
      totalReconciled,
      totalAmount: Math.round(totalAmount * 100) / 100
    };
  }


  public addParsedTransactions(tenantId: string, txs: BankTransaction[]): number {
    const list = this.transactions.get(tenantId) || [];
    list.unshift(...txs);
    this.transactions.set(tenantId, list);
    return list.length;
  }

  public updateTransactionContraAccount(tenantId: string, txId: string, accountCode: string, accountName: string): boolean {
    const list = this.transactions.get(tenantId) || [];
    const tx = list.find(t => t.id === txId);
    if (tx) {
      tx.suggestedAccountCode = accountCode;
      tx.suggestedAccountName = accountName;
      tx.ruleApplied = 'Classificação Manual Personalizada';
      tx.confidenceScore = 1.0;
      return true;
    }
    return false;
  }
  public getTransactions(tenantId: string): BankTransaction[] {
    return this.transactions.get(tenantId) || [];
  }

  private seedDefaultTransactions() {
    const t1Txs: BankTransaction[] = [
      {
        id: 'tx-101',
        date: '2026-08-12',
        amount: 45000.00,
        description: 'PIX RECEBIDO CLIENTE TECH SOLUTIONS LTDA',
        fitId: 'fit-pix-45000',
        bankName: 'Banco Itaú S/A',
        suggestedAccountCode: '1.1.2.01',
        suggestedAccountName: 'Clientes Nacionais a Receber (Duplicatas)',
        confidenceScore: 0.96,
        ruleApplied: 'Autoclassificação IA: Recebimento Pix de Clientes',
        status: 'PENDENTE'
      },
      {
        id: 'tx-102',
        date: '2026-08-14',
        amount: -89.50,
        description: 'TARIFA MENSALIDADE CONTA CORRENTE PJ',
        fitId: 'fit-tar-8950',
        bankName: 'Banco Itaú S/A',
        suggestedAccountCode: '4.1.3.02',
        suggestedAccountName: 'Despesas Bancárias, Tarifas e Taxas de Cartão',
        confidenceScore: 0.99,
        ruleApplied: 'Autoclassificação IA: Tarifa Bancária Mensal',
        status: 'PENDENTE'
      },
      {
        id: 'tx-103',
        date: '2026-08-15',
        amount: -12800.00,
        description: 'PAGTO FORNECEDOR DELL COMPUTADORES BRASIL',
        fitId: 'fit-forn-12800',
        bankName: 'Banco Itaú S/A',
        suggestedAccountCode: '2.1.1.01',
        suggestedAccountName: 'Fornecedores Nacionais a Pagar',
        confidenceScore: 0.94,
        ruleApplied: 'Autoclassificação IA: Pagamento de Fornecedor',
        status: 'PENDENTE'
      },
      {
        id: 'tx-104',
        date: '2026-08-16',
        amount: -4800.00,
        description: 'PAGTO GUIA GPS / INSS PREVIDÊNCIA SOCIAL',
        fitId: 'fit-gps-4800',
        bankName: 'Banco Itaú S/A',
        suggestedAccountCode: '2.1.2.02',
        suggestedAccountName: 'INSS e Previdência Social a Recolher',
        confidenceScore: 0.98,
        ruleApplied: 'Autoclassificação IA: Recolhimento Tributário Previdenciário',
        status: 'PENDENTE'
      }
    ];

    this.transactions.set('t1', t1Txs);
    this.transactions.set('t2', [
      {
        id: 'tx-201',
        date: '2026-08-10',
        amount: 28500.00,
        description: 'CREDITO CIELO VENDAS CARTAO DE DEBITO',
        fitId: 'fit-cielo-28500',
        bankName: 'Banco Bradesco S/A',
        suggestedAccountCode: '1.1.2.02',
        suggestedAccountName: 'Cartões de Crédito / Débito e Pix a Receber',
        confidenceScore: 0.97,
        ruleApplied: 'Autoclassificação IA: Liquidação de Vendas Cartão de Débito',
        status: 'PENDENTE'
      }
    ]);
  }
}

export const smartOfxReconciler = new SmartOfxReconciler();
export default smartOfxReconciler;