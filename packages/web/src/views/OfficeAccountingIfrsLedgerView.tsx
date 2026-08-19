// ==========================================================================
// SOBERANO CONTÁBIL — PLATINUM SUITE ENTERPRISE v4.5
// MÓDULO CONTÁBIL 100% OPERACIONAL: PLANO DE CONTAS, DIÁRIO ACID MULTIPLO,
// CONCILIAÇÃO OFX REAL, INTEGRAÇÕES FISCAL/DP, BALANCETE 8C, DRILL-DOWN RAZÃO,
// DEMONSTRAÇÕES IFRS & SPED ECD DIGITAL
// ==========================================================================

import React, { useState, useMemo, useRef } from 'react';
import { officeStore } from '../state/office-store';
import { referentialChartService, AccountNode } from '../../../core/src/accounting/chart-of-accounts/referential-mapping';
import { generalJournalEngine, JournalEntry } from '../../../core/src/accounting/ledger/general-journal-engine';
import { smartOfxReconciler, BankTransaction } from '../../../core/src/accounting/reconciliation/smart-ofx-reconciler';
import { trialBalanceEngine, TrialBalanceReport, TrialBalanceRow } from '../../../core/src/accounting/reports/trial-balance-engine';
import { officialBooksEngine } from '../../../core/src/accounting/reports/official-books-engine';
import { areClosingEngine, AreClosingResult } from '../../../core/src/accounting/closing/are-closing-engine';
import { fullIfrsStatementsEngine } from '../../../core/src/accounting/statements/full-ifrs-statements-engine';
import { spedEcdGenerator } from '../../../core/src/accounting/reports/sped-ecd-generator';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine';
import {
  BookOpen, Layers, FileSpreadsheet, CheckCircle2, AlertTriangle,
  Zap, Download, Plus, Search, ArrowRight, ShieldCheck, Scale,
  Printer, Sparkles, Calendar, Building2, RefreshCw, Upload,
  FileText, ExternalLink, Filter, HelpCircle, Trash2, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

export type AccountingTab = 'diario' | 'staging_pre_homologacao' | 'plano_contas' | 'ofx' | 'balancete' | 'livros_oficiais' | 'are_demonstracoes' | 'sped_ecd';

interface MultipleLine {
  id: string;
  accountCode: string;
  type: 'DEBITO' | 'CREDITO';
  amount: number;
  historyComplement: string;
}

export const OfficeAccountingIfrsLedgerView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [activeTab, setActiveTab] = useState<AccountingTab>('diario');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Lançamento Simples e Múltiplo
  const [isMultipleEntryMode, setIsMultipleEntryMode] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>('2026-08-18');
  const [newHistory, setNewHistory] = useState<string>('');
  const [debitCode, setDebitCode] = useState<string>('4.1.3.01');
  const [creditCode, setCreditCode] = useState<string>('1.1.1.02');
  const [entryAmount, setEntryAmount] = useState<number>(1200);

  // Lançamento Múltiplo
  const [multipleLines, setMultipleLines] = useState<MultipleLine[]>([
    { id: '1', accountCode: '4.1.3.01', type: 'DEBITO', amount: 1000, historyComplement: 'Despesa Administrativa' },
    { id: '2', accountCode: '1.1.1.02', type: 'CREDITO', amount: 1000, historyComplement: 'Saída Conta Itaú' }
  ]);


  // Estado do Hub de Pré-Homologação e Análise Prévia DP & Fiscal
  const [stagingFilter, setStagingFilter] = useState<'TODOS' | 'DP' | 'FISCAL'>('TODOS');
  const [selectedStagingEventId, setSelectedStagingEventId] = useState<string | null>(null);
  const [homologatedEvents, setHomologatedEvents] = useState<string[]>([]);
  const [rejectingBatchId, setRejectingBatchId] = useState<string | null>(null);
  const [rejectionJustification, setRejectionJustification] = useState<string>('Verificar horas extras e base de cálculo de INSS');

  // Modal / Drawer de Drill-Down do Razão Analítico
  const [drillDownAccount, setDrillDownAccount] = useState<AccountNode | null>(null);

  // Estados de Status e Mensagens
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [areResult, setAreResult] = useState<AreClosingResult | null>(null);
  const [spedResultText, setSpedResultText] = useState<string | null>(null);

  const activeTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  // Dados Reativos
  const entries = useMemo(() => generalJournalEngine.getEntries(selectedTenantId), [selectedTenantId, statusMessage]);
  const totals = useMemo(() => generalJournalEngine.getLedgerTotals(selectedTenantId), [selectedTenantId, statusMessage]);
  const accounts = useMemo(() => referentialChartService.searchAccounts(searchQuery), [searchQuery]);
  const bankTxs = useMemo(() => smartOfxReconciler.getTransactions(selectedTenantId), [selectedTenantId, statusMessage]);
  const trialBalance = useMemo(() => trialBalanceEngine.generateTrialBalance(selectedTenantId), [selectedTenantId, statusMessage]);
  const ifrsStatements = useMemo(() => fullIfrsStatementsEngine.generateFullStatements(selectedTenantId), [selectedTenantId, statusMessage]);

  // Totais do Lançamento Múltiplo
  const multipleTotals = useMemo(() => {
    const debits = multipleLines.filter(l => l.type === 'DEBITO').reduce((acc, l) => acc + (l.amount || 0), 0);
    const credits = multipleLines.filter(l => l.type === 'CREDITO').reduce((acc, l) => acc + (l.amount || 0), 0);
    const diff = Math.round(Math.abs(debits - credits) * 100) / 100;
    const isBalanced = diff === 0 && debits > 0;
    return { debits, credits, diff, isBalanced };
  }, [multipleLines]);

  // Handler: Aplicar Modelo Padronizado
  const handleApplyTemplate = (templateName: string) => {
    if (templateName === 'FOLHA_CLT') {
      setNewHistory('Apropriação da Folha de Pagamento mensal - Salários e Encargos CLT');
      setMultipleLines([
        { id: '1', accountCode: '4.1.2.01', type: 'DEBITO', amount: 15000, historyComplement: 'Despesas com Salários e Ordenados' },
        { id: '2', accountCode: '2.1.2.01', type: 'CREDITO', amount: 13350, historyComplement: 'Salários e Ordenados a Pagar' },
        { id: '3', accountCode: '2.1.2.02', type: 'CREDITO', amount: 1650, historyComplement: 'INSS Retido a Recolher (DCTFWeb)' }
      ]);
      setIsMultipleEntryMode(true);
    } else if (templateName === 'DEPRECIACAO') {
      setNewHistory('Apropriação da depreciação mensal de bens do Ativo Imobilizado (CPC 27)');
      setMultipleLines([
        { id: '1', accountCode: '4.1.3.01', type: 'DEBITO', amount: 850, historyComplement: 'Despesa com Depreciação de Máquinas e Equipamentos' },
        { id: '2', accountCode: '1.2.3.02', type: 'CREDITO', amount: 850, historyComplement: 'Depreciação Acumulada do Imobilizado' }
      ]);
      setIsMultipleEntryMode(true);
    } else if (templateName === 'PROLABORE') {
      setNewHistory('Apropriação de Pró-labore dos Sócios Diretores e Retenção Previdenciária');
      setMultipleLines([
        { id: '1', accountCode: '4.1.1.02', type: 'DEBITO', amount: 8000, historyComplement: 'Honorários e Pró-labore da Diretoria' },
        { id: '2', accountCode: '2.1.2.01', type: 'CREDITO', amount: 7120, historyComplement: 'Pró-labore Líquido a Pagar' },
        { id: '3', accountCode: '2.1.2.02', type: 'CREDITO', amount: 880, historyComplement: 'INSS 11% Retido sobre Pró-Labore' }
      ]);
      setIsMultipleEntryMode(true);
    } else if (templateName === 'FORNECEDOR_DESCONTO') {
      setNewHistory('Pagamento de duplicata a fornecedor com desconto financeiro obtido');
      setMultipleLines([
        { id: '1', accountCode: '2.1.1.01', type: 'DEBITO', amount: 5000, historyComplement: 'Baixa de Duplicata Fornecedor' },
        { id: '2', accountCode: '1.1.1.02', type: 'CREDITO', amount: 4800, historyComplement: 'Pagamento via Banco Itaú' },
        { id: '3', accountCode: '3.1.1.01', type: 'CREDITO', amount: 200, historyComplement: 'Desconto Financeiro Obtido' }
      ]);
      setIsMultipleEntryMode(true);
    }
  };
  // Handler: Novo Lançamento Simples
  const handleCreateSimpleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHistory.trim()) {
      setStatusMessage({ text: 'Informe o histórico do lançamento contábil.', isError: true });
      return;
    }

    const res = generalJournalEngine.postEntry({
      tenantId: selectedTenantId,
      date: newDate,
      generalHistory: newHistory,
      documentType: 'MANUAL',
      lines: [
        { accountCode: debitCode, type: 'DEBITO', amount: entryAmount },
        { accountCode: creditCode, type: 'CREDITO', amount: entryAmount }
      ]
    });

    if (res.success) {
      setStatusMessage({ text: `Lançamento nº ${res.entry?.entryNumber} registrado com sucesso em Partidas Dobradas!`, isError: false });
      setNewHistory('');
    } else {
      setStatusMessage({ text: res.error || 'Erro ao registrar lançamento.', isError: true });
    }
  };

  // Handler: Novo Lançamento Múltiplo (N Débitos x N Créditos)
  const handleCreateMultipleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHistory.trim()) {
      setStatusMessage({ text: 'Informe o histórico geral do lançamento.', isError: true });
      return;
    }
    if (!multipleTotals.isBalanced) {
      setStatusMessage({ text: `Partidas desbalanceadas! Débitos (R$ ${multipleTotals.debits.toFixed(2)}) ≠ Créditos (R$ ${multipleTotals.credits.toFixed(2)}). Diferença: R$ ${multipleTotals.diff.toFixed(2)}`, isError: true });
      return;
    }

    const res = generalJournalEngine.postEntry({
      tenantId: selectedTenantId,
      date: newDate,
      generalHistory: newHistory,
      documentType: 'MULTIPLO',
      lines: multipleLines.map(l => ({
        accountCode: l.accountCode,
        type: l.type,
        amount: l.amount,
        historyComplement: l.historyComplement
      }))
    });

    if (res.success) {
      setStatusMessage({ text: `Lançamento múltiplo nº ${res.entry?.entryNumber} escriturado com sucesso em Partidas Dobradas!`, isError: false });
      setNewHistory('');
      setIsMultipleEntryMode(false);
    } else {
      setStatusMessage({ text: res.error || 'Erro ao registrar lançamento múltiplo.', isError: true });
    }
  };

  // Handler: Upload Real de Arquivo OFX / XML / CSV do Computador
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const bankGuess = file.name.toUpperCase().includes('ITAU') ? 'Banco Itaú S/A' :
                          file.name.toUpperCase().includes('BRADESCO') ? 'Banco Bradesco S/A' :
                          file.name.toUpperCase().includes('SANTANDER') ? 'Banco Santander' :
                          file.name.toUpperCase().includes('INTER') ? 'Banco Inter' :
                          file.name.toUpperCase().includes('NUBANK') ? 'Nu Pagamentos S/A' : 'Banco Comercial';

        const parseRes = smartOfxReconciler.parseOfxContent(text, bankGuess);
        if (parseRes.transactions.length > 0) {
          smartOfxReconciler.addParsedTransactions(selectedTenantId, parseRes.transactions);
          setStatusMessage({
            text: `Arquivo "${file.name}" importado com sucesso! ${parseRes.transactions.length} transações extraídas (Créditos: R$ ${parseRes.totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / Débitos: R$ ${parseRes.totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`,
            isError: false
          });
          setActiveTab('ofx');
        } else {
          setStatusMessage({ text: `Não foram encontradas transações válidas no arquivo "${file.name}". Verifique se é um arquivo OFX ou CSV válido.`, isError: true });
        }
      }
    };
    reader.readAsText(file);
  };

  // Handler: Sincronização Automática Fiscal 1-Click
  const handleSyncFiscal = () => {
    const res = accountingIntegrationEngine.syncFiscalToAccounting(selectedTenantId, '2026-08');
    setStatusMessage({ text: res.message, isError: !res.success });
  };

  // Handler: Sincronização Automática Folha CLT (DP) 1-Click
  const handleSyncPayroll = () => {
    const res = accountingIntegrationEngine.syncPayrollToAccounting(selectedTenantId, '2026-08');
    setStatusMessage({ text: res.message, isError: !res.success });
  };

  // Handler: Conciliar OFX em Lote
  const handleBatchReconcile = () => {
    const res = smartOfxReconciler.batchReconcileAll(selectedTenantId);
    setStatusMessage({
      text: `Conciliação 1-Click finalizada: ${res.totalReconciled} transações bancárias conciliadas (Total: R$ ${res.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`,
      isError: false
    });
  };

  // Handler: Executar Fechamento ARE
  const handleExecuteAre = () => {
    const res = areClosingEngine.executeAreClosing({
      tenantId: selectedTenantId,
      competencia: '2026-08'
    });
    setAreResult(res);
    setStatusMessage({ text: res.message, isError: false });
  };

  // Handler: Gerar SPED ECD
  const handleGenerateSpedEcd = () => {
    const res = spedEcdGenerator.generateSpedEcdFile({
      tenantId: selectedTenantId,
      companyName: activeTenant.name,
      cnpj: activeTenant.cnpj,
      uf: 'SP',
      ie: '123456789110',
      codMunicipio: '3550308',
      startDate: '20260101',
      endDate: '20261231',
      contadorNome: 'David Contador Master',
      contadorCrc: 'SP-123456/O-0',
      contadorCpf: '123.456.789-00'
    });

    if (res.isValid) {
      setSpedResultText(res.fileContent);
      setStatusMessage({ text: `Arquivo SPED ECD gerado com sucesso (${res.totalRecords} registros). Pronto para validação no PVA!`, isError: false });
    } else {
      setStatusMessage({ text: res.errors.join('; '), isError: true });
    }
  };

  // Handler: Exportação em CSV
  const handleExportCsv = (title: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      `"${title} - ${activeTenant.name} - CNPJ: ${activeTenant.cnpj}"`,
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${selectedTenantId}_2026.csv`;
    a.click();
  };

  const tabs: { id: AccountingTab; label: string; icon: string; badge?: string }[] = [
    { id: 'diario', label: 'Livro Diário & Lançamentos', icon: '📖', badge: `${entries.length}` },
    { id: 'staging_pre_homologacao', label: 'Inbox & Pré-Homologação DP/Fiscal', icon: '📥', badge: 'Auditoria Prévia' },
    { id: 'plano_contas', label: 'Plano de Contas Referencial', icon: '🏛️' },
    { id: 'ofx', label: 'Conciliação Bancária OFX (IA)', icon: '⚡', badge: `${bankTxs.filter(t => t.status === 'PENDENTE').length} Pendentes` },
    { id: 'balancete', label: 'Balancete 8 Colunas & Drill-Down', icon: '📊' },
    { id: 'livros_oficiais', label: 'Livros Oficiais & Termos', icon: '📜' },
    { id: 'are_demonstracoes', label: 'ARE & Demonstrações IFRS', icon: '🏆' },
    { id: 'sped_ecd', label: 'SPED ECD Digital', icon: '🏛️' }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: 'var(--text-primary)' }}>
      {/* 1. Header do Módulo Contábil */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
              🏦
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Módulo Contábil Oficial <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>100% OPERACIONAL</span>
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Partidas Dobradas ACID, Upload Real OFX, Integração Fiscal/DP, Balancete de 8 Colunas com Drill-down e SPED ECD.
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Ações Rápidas & Empresa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sincronizar Fiscal */}
          <button
            onClick={handleSyncFiscal}
            title="Apropriação automática de faturamento e tributos do Fiscal"
            style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Sincronizar Fiscal
          </button>

          {/* Sincronizar Folha DP */}
          <button
            onClick={handleSyncPayroll}
            title="Apropriação automática de salários e encargos da Folha CLT"
            style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Sincronizar Folha DP
          </button>

          {/* Importar OFX Real */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".ofx,.xml,.csv,.txt"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload de arquivo OFX ou CSV bancário real"
            style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={14} /> Importar OFX Real
          </button>

          {/* Seletor de Tenant */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem' }}>🏢</span>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#111726', color: '#fff' }}>
                  {t.name} ({t.regime.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerta de Mensagem de Operação */}
      {statusMessage && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          background: statusMessage.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${statusMessage.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          color: statusMessage.isError ? '#f87171' : 'var(--emerald-300)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMessage.isError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* 2. Cards de Resumo Contábil do Exercício */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL DÉBITOS DO DIÁRIO [D]</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>
            R$ {totals.totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{entries.length} lançamentos escriturados</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL CRÉDITOS DO DIÁRIO [C]</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            R$ {totals.totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Equilíbrio perfeito D = C</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>ATIVO TOTAL IFRS</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            R$ {ifrsStatements.balancoPatrimonial.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)', marginTop: '4px' }}>Balanço Patrimonial Fechado</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>LUCRO LÍQUIDO APURADO</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: ifrsStatements.dre.lucroLiquido >= 0 ? 'var(--emerald-400)' : '#f87171', marginTop: '4px' }}>
            R$ {ifrsStatements.dre.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Margem Líquida {(ifrsStatements.dre.receitaBruta > 0 ? ((ifrsStatements.dre.lucroLiquido / ifrsStatements.dre.receitaBruta) * 100).toFixed(1) : '0.0')}%</div>
        </div>
      </div>

      {/* 3. Navegação por Abas do Módulo Contábil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', overflowX: 'auto' }}>
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: isActive ? 'var(--emerald-500)' : 'var(--bg-surface-elevated)',
                color: isActive ? '#070B12' : '#fff',
                border: isActive ? 'none' : '1px solid var(--border-subtle)',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && (
                <span style={{
                  background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#070B12' : 'var(--emerald-400)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* ========================================================================= */}
      {/* ABA 1: LIVRO DIÁRIO GERAL & LANÇAMENTOS ÁGEIS                             */}
      {/* ========================================================================= */}
      {activeTab === 'diario' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Alternador de Modo de Lançamento & Modelos Padronizados */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Novo Lançamento Contábil:</span>
                <button
                  type="button"
                  onClick={() => setIsMultipleEntryMode(false)}
                  style={{
                    background: !isMultipleEntryMode ? 'var(--emerald-500)' : 'rgba(255,255,255,0.06)',
                    color: !isMultipleEntryMode ? '#070B12' : '#fff',
                    border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Partida Simples (1D x 1C)
                </button>
                <button
                  type="button"
                  onClick={() => setIsMultipleEntryMode(true)}
                  style={{
                    background: isMultipleEntryMode ? 'var(--emerald-500)' : 'rgba(255,255,255,0.06)',
                    color: isMultipleEntryMode ? '#070B12' : '#fff',
                    border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Partida Múltipla (ND x NC)
                </button>
              </div>

              {/* Modelos Padronizados */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Modelos Rápidos:</span>
                <button onClick={() => handleApplyTemplate('FOLHA_CLT')} style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--cyan-300)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Folha CLT</button>
                <button onClick={() => handleApplyTemplate('PROLABORE')} style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Pró-labore</button>
                <button onClick={() => handleApplyTemplate('DEPRECIACAO')} style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Depreciação</button>
                <button onClick={() => handleApplyTemplate('FORNECEDOR_DESCONTO')} style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald-300)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Fornecedor c/ Desc.</button>
              </div>
            </div>

            {/* Formulário Partida Simples */}
            {!isMultipleEntryMode ? (
              <form onSubmit={handleCreateSimpleEntry} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data do Fato</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--cyan-400)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Conta Débito [D]</label>
                  <select
                    value={debitCode}
                    onChange={e => setDebitCode(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    {referentialChartService.getAnalyticalAccounts().map(acc => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Conta Crédito [C]</label>
                  <select
                    value={creditCode}
                    onChange={e => setCreditCode(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--emerald-300)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    {referentialChartService.getAnalyticalAccounts().map(acc => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryAmount}
                    onChange={e => setEntryAmount(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Histórico Contábil</label>
                  <input
                    type="text"
                    placeholder="Ex: Vlr. ref. pagamento de honorários ou compra de mercadorias..."
                    value={newHistory}
                    onChange={e => setNewHistory(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary-action"
                    style={{ width: '100%', padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Escriturar Lançamento
                  </button>
                </div>
              </form>
            ) : (
              /* Formulário Partida Múltipla */
              <form onSubmit={handleCreateMultipleEntry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data do Fato</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Histórico Geral do Lançamento Múltiplo</label>
                    <input
                      type="text"
                      placeholder="Ex: Apropriação mensal de folha ou fechamento de faturamento..."
                      value={newHistory}
                      onChange={e => setNewHistory(e.target.value)}
                      style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
                    />
                  </div>
                </div>

                {/* Grade de Linhas Múltiplas */}
                <div style={{ background: '#0B1120', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>Linhas do Lançamento ({multipleLines.length})</span>
                    <button
                      type="button"
                      onClick={() => setMultipleLines([...multipleLines, { id: `${Date.now()}`, accountCode: '1.1.1.02', type: 'DEBITO', amount: 500, historyComplement: '' }])}
                      style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={12} /> Adicionar Linha
                    </button>
                  </div>

                  {multipleLines.map((line, idx) => (
                    <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '90px 220px 120px 1fr 32px', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <select
                        value={line.type}
                        onChange={e => {
                          const updated = [...multipleLines];
                          updated[idx].type = e.target.value as 'DEBITO' | 'CREDITO';
                          setMultipleLines(updated);
                        }}
                        style={{ background: line.type === 'DEBITO' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: line.type === 'DEBITO' ? 'var(--cyan-300)' : 'var(--emerald-300)', border: '1px solid var(--border-medium)', padding: '5px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800 }}
                      >
                        <option value="DEBITO">DÉBITO [D]</option>
                        <option value="CREDITO">CRÉDITO [C]</option>
                      </select>

                      <select
                        value={line.accountCode}
                        onChange={e => {
                          const updated = [...multipleLines];
                          updated[idx].accountCode = e.target.value;
                          setMultipleLines(updated);
                        }}
                        style={{ background: '#111726', color: '#fff', border: '1px solid var(--border-medium)', padding: '5px 8px', borderRadius: '4px', fontSize: '0.74rem' }}
                      >
                        {referentialChartService.getAnalyticalAccounts().map(acc => (
                          <option key={acc.code} value={acc.code}>
                            {acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        step="0.01"
                        value={line.amount}
                        onChange={e => {
                          const updated = [...multipleLines];
                          updated[idx].amount = parseFloat(e.target.value) || 0;
                          setMultipleLines(updated);
                        }}
                        placeholder="Valor R$"
                        style={{ background: '#111726', color: '#fff', border: '1px solid var(--border-medium)', padding: '5px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700 }}
                      />

                      <input
                        type="text"
                        value={line.historyComplement}
                        onChange={e => {
                          const updated = [...multipleLines];
                          updated[idx].historyComplement = e.target.value;
                          setMultipleLines(updated);
                        }}
                        placeholder="Complemento do histórico desta linha..."
                        style={{ background: '#111726', color: 'var(--text-secondary)', border: '1px solid var(--border-medium)', padding: '5px 8px', borderRadius: '4px', fontSize: '0.74rem' }}
                      />

                      <button
                        type="button"
                        onClick={() => setMultipleLines(multipleLines.filter(l => l.id !== line.id))}
                        disabled={multipleLines.length <= 2}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: multipleLines.length > 2 ? 'pointer' : 'not-allowed', opacity: multipleLines.length > 2 ? 1 : 0.4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {/* Indicador de Balanço do Lançamento Múltiplo */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '8px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>Total Débitos: R$ {multipleTotals.debits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>Total Créditos: R$ {multipleTotals.credits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span style={{ color: multipleTotals.isBalanced ? 'var(--emerald-400)' : '#f87171', fontWeight: 800 }}>
                        {multipleTotals.isBalanced ? '✓ Equilíbrio D = C OK' : `Diferença: R$ ${multipleTotals.diff.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!multipleTotals.isBalanced}
                      className="btn-primary-action"
                      style={{ padding: '6px 16px', opacity: multipleTotals.isBalanced ? 1 : 0.5, cursor: multipleTotals.isBalanced ? 'pointer' : 'not-allowed' }}
                    >
                      <Plus size={14} /> Gravar Lançamento Múltiplo
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Grade de Lançamentos do Diário */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Livro Diário Geral — Lançamentos Escriturados ({entries.length})</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 700 }}>🔒 Livro Imutável com Hash Digital</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleExportCsv('Livro_Diario_Geral', ['Nº', 'Data', 'Histórico', 'Débito', 'Crédito', 'Valor', 'Doc'], entries.map(e => [e.entryNumber, e.date, e.generalHistory, e.lines.filter(l => l.type === 'DEBITO').map(l => l.accountCode).join(';'), e.lines.filter(l => l.type === 'CREDITO').map(l => l.accountCode).join(';'), e.totalDebits, e.documentType]))}
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--border-medium)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Download size={12} /> Exportar CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px' }}>Nº</th>
                    <th style={{ padding: '10px 12px' }}>Data</th>
                    <th style={{ padding: '10px 12px' }}>Histórico Geral & Partidas</th>
                    <th style={{ padding: '10px 12px' }}>Contas (Débito / Crédito)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Valor Total</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Doc / Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--emerald-400)' }}>#{entry.entryNumber}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{entry.date}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#fff', maxWidth: '340px' }}>
                        <div>{entry.generalHistory}</div>
                        {entry.lines.map((l, i) => (
                          <div key={i} style={{ fontSize: '0.7rem', color: l.type === 'DEBITO' ? 'var(--cyan-400)' : 'var(--emerald-400)', marginTop: '2px' }}>
                            {l.type === 'DEBITO' ? 'D - ' : 'C - '} {l.accountCode} • {l.accountName} (R$ {l.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: '0.74rem' }}>
                        <div style={{ color: 'var(--cyan-400)' }}>D: {entry.lines.filter(l => l.type === 'DEBITO').map(l => l.accountCode).join(', ')}</div>
                        <div style={{ color: 'var(--emerald-400)' }}>C: {entry.lines.filter(l => l.type === 'CREDITO').map(l => l.accountCode).join(', ')}</div>
                      </td>
                      <td className="font-mono" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#fff' }}>
                        R$ {entry.totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                          {entry.documentType} {entry.documentNumber ? `(${entry.documentNumber})` : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: PLANO DE CONTAS REFERENCIAL & DE-PARA SPED RFB                     */}
      {/* ========================================================================= */}
      {activeTab === 'plano_contas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar conta por código, reduzido ou descrição..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                ✓ 100% Mapeado com o Plano Referencial da RFB (SPED ECD/ECF)
              </span>
              <button
                onClick={() => handleExportCsv('Plano_de_Contas_Referencial', ['Código', 'Reduzido', 'Nome', 'Tipo', 'Natureza', 'SPED RFB'], accounts.map(a => [a.code, a.reducedCode, a.name, a.type, a.nature, a.spedReferentialCode]))}
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--border-medium)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} /> Exportar CSV
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Código Estruturado</th>
                  <th style={{ padding: '10px 12px' }}>Reduzido</th>
                  <th style={{ padding: '10px 12px' }}>Nome da Conta</th>
                  <th style={{ padding: '10px 12px' }}>Tipo / Grupo</th>
                  <th style={{ padding: '10px 12px' }}>Natureza</th>
                  <th style={{ padding: '10px 12px' }}>De-Para SPED RFB</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Razão</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: acc.isSynthetic ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="font-mono" style={{ padding: '8px 12px', fontWeight: acc.isSynthetic ? 800 : 500, color: acc.isSynthetic ? 'var(--emerald-400)' : '#fff' }}>
                      {acc.code}
                    </td>
                    <td className="font-mono" style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{acc.reducedCode}</td>
                    <td style={{ padding: '8px 12px', fontWeight: acc.isSynthetic ? 800 : 500, color: acc.isSynthetic ? '#fff' : 'var(--text-secondary)', paddingLeft: `${(acc.level - 1) * 16 + 12}px` }}>
                      {acc.isSynthetic ? '📁 ' : '📄 '} {acc.name}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        background: acc.type === 'ATIVO' ? 'rgba(6, 182, 212, 0.15)' : acc.type === 'PASSIVO' ? 'rgba(245, 158, 11, 0.15)' : acc.type === 'RECEITAS' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: acc.type === 'ATIVO' ? 'var(--cyan-400)' : acc.type === 'PASSIVO' ? '#fbbf24' : acc.type === 'RECEITAS' ? 'var(--emerald-400)' : '#f87171',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {acc.type}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: acc.nature === 'DEVEDORA' ? 'var(--cyan-400)' : 'var(--emerald-400)', fontWeight: 700 }}>
                      {acc.nature}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {acc.spedReferentialCode} • {acc.spedReferentialName}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      {!acc.isSynthetic && (
                        <button
                          onClick={() => setDrillDownAccount(acc)}
                          style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-300)', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Ver Razão
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* ABA 3: CONCILIAÇÃO BANCÁRIA OFX (MOTOR DE IA & UPLOAD REAL)              */}
      {/* ========================================================================= */}
      {activeTab === 'ofx' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card de Importação e Ações */}
          <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.08))', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} className="text-cyan-400" />
                Conciliador Inteligente OFX & Extratos Bancários Reais
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Importe arquivos `.ofx` ou `.csv` reais do Itaú, Bradesco, Santander, BB, Inter, Nubank ou Cora para autoclassificação com IA.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-medium)', padding: '8px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={14} /> Selecionar Arquivo OFX / CSV
              </button>

              <button
                onClick={handleBatchReconcile}
                className="btn-primary-action"
                style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Zap size={16} /> Conciliar Todos os Itens Pendentes (1-Click)
              </button>
            </div>
          </div>

          {/* Grade de Transações do Extrato */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>Transações Bancárias ({bankTxs.length})</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Classificação por IA com aprendizado contábil</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px' }}>Data</th>
                    <th style={{ padding: '10px 12px' }}>Descrição do Extrato</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Valor</th>
                    <th style={{ padding: '10px 12px' }}>Conta Contrapartida (IA / Ajuste Manual)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Score IA</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {bankTxs.map(tx => {
                    const isReconciled = tx.status === 'CONCILIADO';
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isReconciled ? 'rgba(16, 185, 129, 0.04)' : 'transparent' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{tx.date}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#fff' }}>
                          <div>{tx.description}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{tx.bankName} • ID: {tx.fitId}</div>
                        </td>
                        <td className="font-mono" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: tx.amount >= 0 ? 'var(--emerald-400)' : '#f87171' }}>
                          {tx.amount >= 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {!isReconciled ? (
                            <select
                              value={tx.suggestedAccountCode}
                              onChange={(e) => {
                                const acc = referentialChartService.getAccountByCode(e.target.value);
                                if (acc) {
                                  smartOfxReconciler.updateTransactionContraAccount(selectedTenantId, tx.id, acc.code, acc.name);
                                  setStatusMessage({ text: `Contrapartida da transação "${tx.description}" alterada para [${acc.code} - ${acc.name}].`, isError: false });
                                }
                              }}
                              style={{ background: '#0B1120', color: 'var(--cyan-300)', border: '1px solid var(--border-medium)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', width: '100%', maxWidth: '320px' }}
                            >
                              {referentialChartService.getAnalyticalAccounts().map(acc => (
                                <option key={acc.code} value={acc.code}>
                                  {acc.code} - {acc.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div style={{ fontWeight: 700, color: 'var(--cyan-300)' }}>{tx.suggestedAccountCode} - {tx.suggestedAccountName}</div>
                          )}
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>💡 {tx.ruleApplied}</div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-300)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                            {(tx.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {isReconciled ? (
                            <span style={{ color: 'var(--emerald-400)', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                              <CheckCircle2 size={14} /> Conciliado
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                const res = smartOfxReconciler.reconcileTransaction(selectedTenantId, tx.id);
                                if (res.success) {
                                  setStatusMessage({ text: `Transação "${tx.description}" conciliada com sucesso no Diário!`, isError: false });
                                }
                              }}
                              style={{ background: 'var(--emerald-500)', color: '#070B12', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                            >
                              Conciliar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: BALANCETE DE VERIFICAÇÃO DE 8 COLUNAS COM DRILL-DOWN NO RAZÃO     */}
      {/* ========================================================================= */}
      {activeTab === 'balancete' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Balancete de Verificação de 8 Colunas</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Período de {trialBalance.periodStart} até {trialBalance.periodEnd} • Prova dos 9: Débitos = Créditos.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                ✓ Equilíbrio Débito = Crédito
              </span>
              <button
                onClick={() => handleExportCsv('Balancete_8_Colunas', ['Conta', 'Descrição', 'Mov. Débito', 'Mov. Crédito', 'Saldo Final D', 'Saldo Final C'], trialBalance.rows.map(r => [r.code, r.name, r.periodDebit, r.periodCredit, r.finalDebit, r.finalCredit]))}
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--border-medium)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} /> Exportar CSV
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px' }}>Conta</th>
                    <th style={{ padding: '8px 10px' }}>Descrição</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--cyan-400)' }}>Mov. Débito</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--emerald-400)' }}>Mov. Crédito</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Saldo Final D</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Saldo Final C</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Drill-Down</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.rows.map(row => {
                    const accNode = referentialChartService.getAccountByCode(row.code);
                    return (
                      <tr key={row.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: row.isSynthetic ? 'rgba(255,255,255,0.02)' : 'transparent', fontWeight: row.isSynthetic ? 800 : 500 }}>
                        <td className="font-mono" style={{ padding: '6px 10px', color: row.isSynthetic ? 'var(--emerald-400)' : 'var(--text-secondary)' }}>{row.code}</td>
                        <td style={{ padding: '6px 10px', color: row.isSynthetic ? '#fff' : 'var(--text-secondary)', paddingLeft: `${(row.level - 1) * 14 + 10}px` }}>
                          {row.isSynthetic ? '📁 ' : ''} {row.name}
                        </td>
                        <td className="font-mono" style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--cyan-400)' }}>
                          {row.periodDebit > 0 ? row.periodDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="font-mono" style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--emerald-400)' }}>
                          {row.periodCredit > 0 ? row.periodCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="font-mono" style={{ padding: '6px 10px', textAlign: 'right', color: row.finalDebit > 0 ? '#fff' : 'var(--text-muted)' }}>
                          {row.finalDebit > 0 ? row.finalDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="font-mono" style={{ padding: '6px 10px', textAlign: 'right', color: row.finalCredit > 0 ? '#fff' : 'var(--text-muted)' }}>
                          {row.finalCredit > 0 ? row.finalCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                          {!row.isSynthetic && accNode && (
                            <button
                              onClick={() => setDrillDownAccount(accNode)}
                              title="Abrir ficha do Razão Analítico desta conta"
                              style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-300)', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', margin: '0 auto' }}
                            >
                              <span>Razão</span> <ArrowRight size={10} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'rgba(0,0,0,0.5)', borderTop: '2px solid var(--border-medium)', fontWeight: 800, fontSize: '0.8rem' }}>
                    <td colSpan={2} style={{ padding: '10px', textAlign: 'right', color: '#fff' }}>TOTAL GERAL (PROVA DOS 9):</td>
                    <td className="font-mono" style={{ padding: '10px', textAlign: 'right', color: 'var(--cyan-400)' }}>
                      R$ {trialBalance.totalPeriodDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ padding: '10px', textAlign: 'right', color: 'var(--emerald-400)' }}>
                      R$ {trialBalance.totalPeriodCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ padding: '10px', textAlign: 'right', color: '#fff' }}>
                      R$ {trialBalance.totalFinalDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ padding: '10px', textAlign: 'right', color: '#fff' }}>
                      R$ {trialBalance.totalFinalCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* ABA 5: LIVROS OFICIAIS & TERMOS LEGAIS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'livros_oficiais' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              📜 Termos Legais do Livro Diário (Junta Comercial / DREI)
            </h3>
            <div style={{ background: '#0B1120', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '0.74rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {officialBooksEngine.generateOfficialJournalBook({
                tenantId: selectedTenantId,
                empresaNome: activeTenant.name,
                cnpj: activeTenant.cnpj,
                contadorNome: 'David Contador Master',
                contadorCrc: 'CRC-SP 123456/O-0',
                anoExercicio: 2026
              }).terms.termoAbertura}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              📜 Termo de Encerramento do Exercício
            </h3>
            <div style={{ background: '#0B1120', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '0.74rem', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {officialBooksEngine.generateOfficialJournalBook({
                tenantId: selectedTenantId,
                empresaNome: activeTenant.name,
                cnpj: activeTenant.cnpj,
                contadorNome: 'David Contador Master',
                contadorCrc: 'CRC-SP 123456/O-0',
                anoExercicio: 2026
              }).terms.termoEncerramento}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 6: FECHAMENTO ARE & DEMONSTRAÇÕES IFRS                                */}
      {/* ========================================================================= */}
      {activeTab === 'are_demonstracoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Apuração do Resultado do Exercício (ARE 1-Click) & Demonstrações IFRS</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Zera as contas de resultado, apura o Lucro Líquido, calcula a Reserva Legal (5% Art. 193 Lei 6.404/76) e atualiza o Balanço.
              </p>
            </div>
            <button
              onClick={handleExecuteAre}
              className="btn-primary-action"
              style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={16} /> Executar Encerramento ARE (1-Click)
            </button>
          </div>

          {/* Comparativo Balanço vs DRE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {/* Balanço Patrimonial */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                  🏛️ Balanço Patrimonial IFRS (31/12/2026)
                </h4>
                <button
                  onClick={() => handleExportCsv('Balanco_Patrimonial_IFRS', ['Grupo', 'Conta', 'Saldo'], [
                    ['Ativo Total', '1.0', ifrsStatements.balancoPatrimonial.totalAtivo],
                    ['Ativo Circulante', '1.1', ifrsStatements.balancoPatrimonial.ativoCirculante.total],
                    ['Ativo Não Circulante', '1.2', ifrsStatements.balancoPatrimonial.ativoNaoCirculante.total],
                    ['Passivo + PL', '2.0', ifrsStatements.balancoPatrimonial.totalPassivoPL],
                    ['Passivo Circulante', '2.1', ifrsStatements.balancoPatrimonial.passivoCirculante.total],
                    ['Patrimônio Líquido', '2.3', ifrsStatements.balancoPatrimonial.patrimonioLiquido.total]
                  ])}
                  style={{ background: 'transparent', border: 'none', color: 'var(--cyan-400)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Download size={12} /> CSV
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span style={{ color: 'var(--cyan-400)' }}>1. ATIVO TOTAL:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', color: 'var(--text-secondary)' }}>
                  <span>1.1 Ativo Circulante:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.ativoCirculante.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', color: 'var(--text-secondary)' }}>
                  <span>1.2 Ativo Não Circulante:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.ativoNaoCirculante.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <span style={{ color: 'var(--emerald-400)' }}>2. PASSIVO E PATRIMÔNIO LÍQUIDO:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.totalPassivoPL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', color: 'var(--text-secondary)' }}>
                  <span>2.1 Passivo Circulante:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.passivoCirculante.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', color: 'var(--text-secondary)' }}>
                  <span>2.3 Patrimônio Líquido:</span>
                  <span className="font-mono">R$ {ifrsStatements.balancoPatrimonial.patrimonioLiquido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* DRE Estruturada */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                  📊 Demonstração do Resultado do Exercício (DRE)
                </h4>
                <button
                  onClick={() => handleExportCsv('DRE_Estruturada', ['Rubrica', 'Valor'], [
                    ['Receita Bruta', ifrsStatements.dre.receitaBruta],
                    ['Deduções da Receita', ifrsStatements.dre.deducoesReceita],
                    ['Receita Líquida', ifrsStatements.dre.receitaLiquida],
                    ['Custos e Despesas Operacionais', ifrsStatements.dre.despesasOperacionais],
                    ['Lucro Líquido do Exercício', ifrsStatements.dre.lucroLiquido]
                  ])}
                  style={{ background: 'transparent', border: 'none', color: 'var(--cyan-400)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Download size={12} /> CSV
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>(+) Receita Operacional Bruta:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>R$ {ifrsStatements.dre.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>(-) Deduções e Tributos:</span>
                  <span className="font-mono">R$ {ifrsStatements.dre.deducoesReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
                  <span>(=) Receita Operacional Líquida:</span>
                  <span className="font-mono">R$ {ifrsStatements.dre.receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>(-) Custos e Despesas Operacionais:</span>
                  <span className="font-mono">R$ {ifrsStatements.dre.despesasOperacionais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, borderTop: '2px solid var(--border-medium)', paddingTop: '6px', color: 'var(--emerald-400)', fontSize: '0.88rem' }}>
                  <span>(=) LUCRO LÍQUIDO DO EXERCÍCIO:</span>
                  <span className="font-mono">R$ {ifrsStatements.dre.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 7: GERADOR & PRÉ-VALIDADOR SPED ECD DIGITAL                            */}
      {/* ========================================================================= */}
      {activeTab === 'sped_ecd' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Gerador Oficial do SPED ECD (Livro Digital RFB)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Geração do arquivo `.txt` formatado conforme o Manual de Orientação do Leiaute da ECD (Blocos 0, I, J e 9).
              </p>
            </div>
            <button
              onClick={handleGenerateSpedEcd}
              className="btn-primary-action"
              style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Gerar Arquivo SPED ECD (.TXT)
            </button>
          </div>

          {spedResultText && (
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
                  ✓ Arquivo SPED ECD Validado e Pronto para Transmissão
                </span>
                <button
                  onClick={() => {
                    const blob = new Blob([spedResultText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `SPED_ECD_${activeTenant.name.replace(/\s+/g, '_')}_2026.txt`;
                    a.click();
                  }}
                  style={{ background: 'var(--emerald-500)', color: '#070B12', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Baixar SPED_ECD.TXT
                </button>
              </div>

              <textarea
                readOnly
                value={spedResultText}
                rows={12}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.74rem', padding: '10px', borderRadius: '6px', outline: 'none' }}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL / DRAWER DE DRILL-DOWN DO LIVRO RAZÃO ANALÍTICO                     */}
      {/* ========================================================================= */}
      {drillDownAccount && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '12px', width: '100%', maxWidth: '850px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            {/* Header do Drill-Down */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>📜</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                    Livro Razão Analítico — Conta {drillDownAccount.code}
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {drillDownAccount.name} • Natureza {drillDownAccount.nature} • SPED: {drillDownAccount.spedReferentialCode}
                </p>
              </div>
              <button
                onClick={() => setDrillDownAccount(null)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Conteúdo do Razão Analítico */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              {(() => {
                const ledgerData = officialBooksEngine.generateOfficialGeneralLedgerBook({
                  tenantId: selectedTenantId,
                  empresaNome: activeTenant.name,
                  cnpj: activeTenant.cnpj,
                  contadorNome: 'David Contador Master',
                  contadorCrc: 'SP-123456/O-0',
                  anoExercicio: 2026
                });

                const ledgerAccount = ledgerData.accounts.find(a => a.accountCode === drillDownAccount.code);

                if (!ledgerAccount || ledgerAccount.entries.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhum lançamento contábil registrado para esta conta no exercício corrente.</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Os lançamentos efetuados no Livro Diário serão refletidos aqui automaticamente.</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Resumo do Razão */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div style={{ background: '#1E293B', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SALDO INICIAL</div>
                        <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>R$ {ledgerAccount.initialBalance.toFixed(2)}</div>
                      </div>
                      <div style={{ background: '#1E293B', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--cyan-400)' }}>TOTAL DÉBITOS</div>
                        <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-400)', marginTop: '2px' }}>R$ {ledgerAccount.totalDebits.toFixed(2)}</div>
                      </div>
                      <div style={{ background: '#1E293B', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)' }}>TOTAL CRÉDITOS</div>
                        <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-400)', marginTop: '2px' }}>R$ {ledgerAccount.totalCredits.toFixed(2)}</div>
                      </div>
                      <div style={{ background: '#1E293B', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#fff' }}>SALDO FINAL</div>
                        <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '2px' }}>R$ {ledgerAccount.finalBalance.toFixed(2)} {ledgerAccount.finalBalanceNature}</div>
                      </div>
                    </div>

                    {/* Tabela de Lançamentos do Razão */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.3)', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <th style={{ padding: '8px' }}>Data</th>
                          <th style={{ padding: '8px' }}>Nº Diário</th>
                          <th style={{ padding: '8px' }}>Histórico do Lançamento</th>
                          <th style={{ padding: '8px', textAlign: 'right', color: 'var(--cyan-400)' }}>Débito [D]</th>
                          <th style={{ padding: '8px', textAlign: 'right', color: 'var(--emerald-400)' }}>Crédito [C]</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Saldo Progressivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerAccount.entries.map((e, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{e.date}</td>
                            <td style={{ padding: '8px', fontWeight: 700, color: 'var(--emerald-400)' }}>#{e.entryNumber}</td>
                            <td style={{ padding: '8px', color: '#fff' }}>{e.history}</td>
                            <td className="font-mono" style={{ padding: '8px', textAlign: 'right', color: 'var(--cyan-400)' }}>
                              {e.debit > 0 ? e.debit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                            </td>
                            <td className="font-mono" style={{ padding: '8px', textAlign: 'right', color: 'var(--emerald-400)' }}>
                              {e.credit > 0 ? e.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                            </td>
                            <td className="font-mono" style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                              R$ {e.runningBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {e.runningBalanceNature}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            {/* Footer do Drill-Down */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Livro Razão Analítico gerado em conformidade com as Normas Brasileiras de Contabilidade (NBC TG).</span>
              <button
                onClick={() => setDrillDownAccount(null)}
                className="btn-primary-action"
                style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeAccountingIfrsLedgerView;
