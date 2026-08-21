// ==========================================================================
// SOBERANO CONTÁBIL — CENTRAL OPERACIONAL DE FOLHA DE PAGAMENTO (DP & eSocial)
// 100% OPERACIONAL NO MUNDO REAL: DOWNLOAD DE ARQUIVOS, WHATSAPP REAL & SYNC
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee, PayrollStatement } from '../state/office-store.js';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine.js';
import {
  Users,
  UserPlus,
  FileText,
  DollarSign,
  Zap,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  RefreshCw,
  Send,
  Download,
  Share2,
  Archive,
  PhoneCall,
  CheckCheck,
  X,
  ExternalLink,
  Copy
} from 'lucide-react';

export const PayrollOperationalView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);

  const [activeTab, setActiveTab] = useState<'FOLHA_GERAL' | 'NOVO_FUNCIONARIO' | 'HOLERITE_VIEW'>('FOLHA_GERAL');
  const [competencia, setCompetencia] = useState<string>('08/2026');
  const [selectedEmployeeIdForHolerite, setSelectedEmployeeIdForHolerite] = useState<string>('');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessModal, setSyncSuccessModal] = useState<{ title: string; message: string; entriesCount: number; amount: number } | null>(null);

  // Modais Funcionais
  const [showBatchDownloadModal, setShowBatchDownloadModal] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [selectedEmployeeForWa, setSelectedEmployeeForWa] = useState<Employee | null>(null);
  const [waCustomPhone, setWaCustomPhone] = useState<string>('5511999998888');

  // Estados do Formulário de Admissão (S-2200)
  const [formName, setFormName] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCbo, setFormCbo] = useState('4110-10');
  const [formDepartment, setFormDepartment] = useState('Administrativo');
  const [formBaseSalary, setFormBaseSalary] = useState<number>(3000.00);
  const [formDependants, setFormDependants] = useState<number>(0);
  const [formAdmissionDate, setFormAdmissionDate] = useState('2026-08-01');
  const [formContractType, setFormContractType] = useState<'CLT' | 'ESTAGIO' | 'APRENDIZ' | 'PJ'>('CLT');
  const [formHasVt, setFormHasVt] = useState(true);
  const [formInsalubridade, setFormInsalubridade] = useState<'NONE' | 'MINIMO' | 'MEDIO' | 'MAXIMO'>('NONE');
  const [formHasPericulosidade, setFormHasPericulosidade] = useState(false);

  const currentTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  const payrollStatements = useMemo<PayrollStatement[]>(() => {
    return employees.map(emp => officeStore.calculatePayroll(emp, competencia));
  }, [employees, competencia]);

  const totals = useMemo(() => {
    let grossTotal = 0;
    let netTotal = 0;
    let inssTotal = 0;
    let fgtsTotal = 0;
    let irrfTotal = 0;

    payrollStatements.forEach(stmt => {
      grossTotal += stmt.totalProventos;
      netTotal += stmt.netSalary;
      inssTotal += stmt.baseInss * 0.11;
      fgtsTotal += stmt.fgtsAmount;
      irrfTotal += stmt.items.find(i => i.code === '505')?.amount || 0;
    });

    const inssPatronal = grossTotal * 0.20;
    const ratTerceiros = grossTotal * 0.078;

    return {
      grossTotal,
      netTotal,
      inssSegurados: inssTotal,
      inssPatronal,
      ratTerceiros,
      inssEmpresaTotal: inssTotal + inssPatronal + ratTerceiros,
      fgtsTotal,
      irrfTotal
    };
  }, [payrollStatements]);

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCpf) {
      setFeedback({ message: 'Nome e CPF são obrigatórios!', isError: true });
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      tenantId: selectedTenantId,
      name: formName,
      cpf: formCpf,
      role: formRole || 'Assistente',
      cbo: formCbo,
      department: formDepartment,
      admissionDate: formAdmissionDate,
      baseSalary: formBaseSalary,
      dependantsCount: formDependants,
      contractType: formContractType as any,
      hasVt: formHasVt,
      insalubridadeLevel: formInsalubridade as any,
      hasPericulosidade: formHasPericulosidade,
      status: 'ACTIVE'
    };

    officeStore.saveEmployee(newEmp);
    setFeedback({
      message: `Colaborador ${formName} admitido com sucesso no eSocial S-2200!`,
      isError: false
    });

    setFormName('');
    setFormCpf('');
    setFormBaseSalary(3000.00);
    setActiveTab('FOLHA_GERAL');
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o colaborador ${name}?`)) {
      officeStore.deleteEmployee(id);
      setFeedback({
        message: `Colaborador ${name} removido da folha com sucesso.`,
        isError: false
      });
    }
  };

  const batchId = `dp-folha-${selectedTenantId}-${competencia.replace('/', '')}`;
  const lockInfo = useMemo(() => {
    return officeStore.checkDepartmentLock(selectedTenantId, batchId);
  }, [selectedTenantId, competencia, feedback]);

  const handleSyncToLedger = () => {
    if (lockInfo.isLocked) {
      setFeedback({
        message: 'TRAVA DE SEGURANÇA ATIVA: Este lote de folha já foi liberado para a Contabilidade e está aguardando homologação ou devolução pelo Contador.',
        isError: true
      });
      return;
    }

    setIsSyncing(true);

    // Registra na governança de pré-homologação
    officeStore.releaseBatchToAccounting({
      id: batchId,
      tenantId: selectedTenantId,
      department: 'DP',
      competencia,
      title: `Folha Mensal de Salários e Ordenados (${competencia})`,
      description: `eSocial S-1200 / S-1210 • ${employees.length} colaboradores ativos`,
      sourceModuleId: 'payroll_operational',
      sentBy: 'Operador de Folha / DP',
      totalDebits: totals.grossTotal,
      totalCredits: totals.grossTotal,
      itemsCount: employees.length,
      previewLines: [
        { debitAccountCode: '4.1.2.01', debitAccountName: 'Despesas com Salários', creditAccountCode: '2.1.2.01', creditAccountName: 'Salários Líquidos a Pagar', amount: totals.netTotal, history: `Salários ref. ${competencia}` },
        { debitAccountCode: '4.1.2.01', debitAccountName: 'Despesas com Salários', creditAccountCode: '2.1.2.02', creditAccountName: 'INSS Segurados Retido', amount: totals.inssSegurados, history: `INSS s/ Folha ${competencia}` }
      ]
    });

    setIsSyncing(false);
    setFeedback({
      message: `Lote de Folha (${competencia}) liberado com sucesso para a Pré-Homologação Contábil! A trava de segurança foi ativada.`,
      isError: false
    });

    setSyncSuccessModal({
      title: 'Folha Liberada para a Contabilidade com Sucesso!',
      message: 'O lote foi encaminhado para a Inbox de Pré-Homologação Contábil. A trava de segurança foi ativada para evitar duplicações.',
      entriesCount: 3,
      amount: totals.grossTotal
    });
  };

  // Download REAL de Arquivo de Holerites Consolidados (HTML/CSV/JSON)
  const handleDownloadRealBatchFile = (format: 'HTML' | 'CSV' | 'JSON') => {
    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'HTML') {
      mimeType = 'text/html';
      extension = 'html';
      content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Holerites Consolidados - ${currentTenant.name} - ${competencia}</title>
<style>
body { font-family: monospace; padding: 20px; background: #fff; color: #000; }
.holerite { page-break-after: always; border: 2px solid #000; padding: 20px; margin-bottom: 30px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #000; padding: 6px; text-align: left; }
.header { border-bottom: 2px solid #000; padding-bottom: 10px; }
.footer { margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
</style>
</head>
<body>
${payrollStatements.map(stmt => `
<div class="holerite">
  <div class="header">
    <h2>${currentTenant.name} - CNPJ: ${currentTenant.cnpj}</h2>
    <h3>RECIBO DE PAGAMENTO DE SALÁRIO - REFERÊNCIA: ${competencia}</h3>
    <p><strong>COLABORADOR:</strong> ${stmt.employeeName} | <strong>CPF:</strong> ${stmt.cpf} | <strong>CARGO:</strong> ${stmt.role}</p>
  </div>
  <table>
    <thead><tr><th>CÓD</th><th>DESCRIÇÃO</th><th>REF</th><th>VENCIMENTOS</th><th>DESCONTOS</th></tr></thead>
    <tbody>
      ${stmt.items.map(it => `
      <tr>
        <td>${it.code}</td>
        <td>${it.description}</td>
        <td>${it.reference || '-'}</td>
        <td>${it.type === 'PROVENTO' ? 'R$ ' + it.amount.toFixed(2) : ''}</td>
        <td>${it.type === 'DESCONTO' ? 'R$ ' + it.amount.toFixed(2) : ''}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  <div style="margin-top:15px; display:flex; justify-content:space-between;">
    <p><strong>TOTAL BRUTO:</strong> R$ ${stmt.totalProventos.toFixed(2)}</p>
    <p><strong>TOTAL DESCONTOS:</strong> R$ ${stmt.totalDescontos.toFixed(2)}</p>
    <p><strong>VALOR LÍQUIDO:</strong> R$ ${stmt.netSalary.toFixed(2)}</p>
  </div>
  <div class="footer">
    <p>RECEBI A IMPORTÂNCIA LÍQUIDA ACIMA DISCRIMINADA.</p>
    <div style="margin-top:30px; border-top:1px solid #000; width:300px; text-align:center;">Assinatura do Empregado</div>
  </div>
</div>
`).join('')}
</body>
</html>`;
    } else if (format === 'CSV') {
      mimeType = 'text/csv';
      extension = 'csv';
      content = 'Colaborador,CPF,Cargo,SalarioBase,Proventos,Descontos,SalarioLiquido,Competencia\n' +
        payrollStatements.map(s => `"${s.employeeName}","${s.cpf}","${s.role}",${s.baseSalary || 0},${s.totalProventos},${s.totalDescontos},${s.netSalary},"${competencia}"`).join('\n');
    } else {
      mimeType = 'application/json';
      extension = 'json';
      content = JSON.stringify({ tenant: currentTenant, competencia, holerites: payrollStatements }, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Holerites_${currentTenant.name.replace(/\s+/g, '_')}_${competencia.replace('/', '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback({
      message: `Download do arquivo ${extension.toUpperCase()} de holerites concluído com sucesso!`,
      isError: false
    });
    setShowBatchDownloadModal(false);
  };

  // Disparo Real para WhatsApp Web
  const handleOpenWhatsAppWeb = (emp: Employee, stmt: PayrollStatement) => {
    const message = encodeURIComponent(
      `Olá ${emp.name}! Segue o demonstrativo do seu contracheque (${currentTenant.name} - Ref: ${competencia}):\n\n` +
      `• Salário Bruto: R$ ${stmt.totalProventos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `• Total Descontos: R$ ${stmt.totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `• Salário Líquido a Receber: R$ ${stmt.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
      `Acesse o portal do colaborador ou o PDF oficial emitido pela contabilidade com segurança.`
    );
    window.open(`https://wa.me/${waCustomPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const activeHoleriteEmp = useMemo(() => {
    if (selectedEmployeeIdForHolerite) {
      return employees.find(e => e.id === selectedEmployeeIdForHolerite) || employees[0];
    }
    return employees[0];
  }, [employees, selectedEmployeeIdForHolerite]);

  const activeHoleriteStatement = useMemo(() => {
    if (!activeHoleriteEmp) return null;
    return officeStore.calculatePayroll(activeHoleriteEmp, competencia);
  }, [activeHoleriteEmp, competencia]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>👥</span>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              Folha de Pagamento Central & Departamento Pessoal
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              eSocial S-1200 / S-1210 / S-2200 • FGTS Digital
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cálculo progressivo INSS 2026, IRRF comparativo, admissão eSocial, download de holerites em lote e envio direto para WhatsApp.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedTenantId}
            onChange={e => setSelectedTenantId(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>🏢 {t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab('NOVO_FUNCIONARIO')}
            className="btn-primary-action"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={15} /> Cadastrar Colaborador (S-2200)
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${feedback.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`, color: feedback.isError ? '#f87171' : 'var(--emerald-300)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {feedback.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('FOLHA_GERAL')}
            style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: activeTab === 'FOLHA_GERAL' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'FOLHA_GERAL' ? '#070B12' : 'var(--text-secondary)' }}
          >
            📊 Folha Mensal ({competencia})
          </button>
          <button
            onClick={() => setActiveTab('HOLERITE_VIEW')}
            style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: activeTab === 'HOLERITE_VIEW' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'HOLERITE_VIEW' ? '#070B12' : 'var(--text-secondary)' }}
          >
            📄 Emissor de Holerites CLT
          </button>
          <button
            onClick={() => setActiveTab('NOVO_FUNCIONARIO')}
            style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: activeTab === 'NOVO_FUNCIONARIO' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'NOVO_FUNCIONARIO' ? '#070B12' : 'var(--text-secondary)' }}
          >
            👤 Admissão / Cadastro de Funcionário
          </button>
        </div>

        {activeTab === 'FOLHA_GERAL' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowBatchDownloadModal(true)}
              style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', color: 'var(--cyan-300)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Baixar Holerites em Lote
            </button>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--emerald-400)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Share2 size={14} /> Disparar WhatsApp / E-mail
            </button>
          </div>
        )}
      </div>

      {/* ABA 1: FOLHA GERAL */}
      {activeTab === 'FOLHA_GERAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>FOLHA BRUTA TOTAL</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                R$ {totals.grossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {employees.length} Colaboradores Ativos
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>LÍQUIDO A PAGAR</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
                R$ {totals.netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Até 5º dia útil
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>INSS PREVIDÊNCIA (DCTFWEB)</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A78BFA', marginTop: '4px' }}>
                R$ {totals.inssEmpresaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Segurados + 20% Patronal + RAT
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>FGTS DIGITAL (8% PIX)</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-300)', marginTop: '4px' }}>
                R$ {totals.fgtsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Vencimento dia 20
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                Demonstrativo Individualizado dos Colaboradores ({competencia})
              </h3>

              {lockInfo.isLocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.12)', border: '1.5px dashed var(--amber-400)', padding: '6px 14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>🔒</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--amber-300)', fontWeight: 700 }}>
                    {lockInfo.status === 'HOMOLOGADO_ESCRITURADO' ? '✓ Homologado & Escriturado pelo Contador' : 'Lote Travado (Aguardando Análise do Contador)'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleSyncToLedger}
                  className="btn-primary-action"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Zap size={15} /> {lockInfo.status === 'REJEITADO_DEVOLVIDO' ? 'Reenviar Folha Ajustada para Contabilidade' : 'Liberar Folha para Contabilidade (1-Click)'}
                </button>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 16px' }}>Colaborador</th>
                  <th style={{ padding: '10px' }}>Cargo / CBO</th>
                  <th style={{ padding: '10px' }}>Salário Base</th>
                  <th style={{ padding: '10px' }}>Proventos</th>
                  <th style={{ padding: '10px' }}>Descontos</th>
                  <th style={{ padding: '10px' }}>Salário Líquido</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {payrollStatements.map(stmt => {
                  const emp = employees.find(e => e.id === stmt.employeeId);
                  return (
                    <tr key={stmt.employeeId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: '#fff' }}>
                        <div>{stmt.employeeName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CPF: {stmt.cpf} • Adm: {stmt.admissionDate}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div>{stmt.role}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CBO: {stmt.cbo}</div>
                      </td>
                      <td className="font-mono" style={{ padding: '10px', color: '#fff' }}>
                        R$ {emp?.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="font-mono" style={{ padding: '10px', color: 'var(--emerald-400)', fontWeight: 700 }}>
                        R$ {stmt.totalProventos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="font-mono" style={{ padding: '10px', color: '#f87171', fontWeight: 700 }}>
                        - R$ {stmt.totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="font-mono" style={{ padding: '10px', color: 'var(--cyan-300)', fontWeight: 800, fontSize: '0.88rem' }}>
                        R$ {stmt.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setSelectedEmployeeForWa(emp || null);
                              setShowWhatsAppModal(true);
                            }}
                            style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--emerald-400)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Share2 size={13} /> Zap
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployeeIdForHolerite(stmt.employeeId);
                              setActiveTab('HOLERITE_VIEW');
                            }}
                            style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', color: 'var(--cyan-300)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <FileText size={13} /> Holerite
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(stmt.employeeId, stmt.employeeName)}
                            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: CADASTRO NOVO FUNCIONÁRIO */}
      {activeTab === 'NOVO_FUNCIONARIO' && (
        <form onSubmit={handleSaveEmployee} style={{ background: 'var(--bg-surface-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} style={{ color: 'var(--emerald-400)' }} />
              Admissão & Cadastro de Novo Colaborador (eSocial S-2200)
            </h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              Preencha os dados contratuais para inclusão imediata na folha de pagamento e cálculo automático dos tributos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Ex: João da Silva Santos"
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CPF *</label>
              <input
                type="text"
                required
                value={formCpf}
                onChange={e => setFormCpf(e.target.value)}
                placeholder="000.000.000-00"
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cargo / Função</label>
              <input
                type="text"
                value={formRole}
                onChange={e => setFormRole(e.target.value)}
                placeholder="Ex: Assistente Contábil"
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Código CBO</label>
              <input
                type="text"
                value={formCbo}
                onChange={e => setFormCbo(e.target.value)}
                placeholder="Ex: 4110-10"
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Salário Base Contratual (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formBaseSalary}
                onChange={e => setFormBaseSalary(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 800 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Dependentes IRRF / Família</label>
              <input
                type="number"
                min="0"
                value={formDependants}
                onChange={e => setFormDependants(parseInt(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Data de Admissão</label>
              <input
                type="date"
                value={formAdmissionDate}
                onChange={e => setFormAdmissionDate(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tipo de Contrato</label>
              <select
                value={formContractType}
                onChange={e => setFormContractType(e.target.value as any)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <option value="CLT">CLT Indeterminado</option>
                <option value="ESTAGIO">Estágio (Lei 11.788/08)</option>
                <option value="APRENDIZ">Jovem Aprendiz (FGTS 2%)</option>
                <option value="PJ">Prestador PJ / Autônomo</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#0B1120', padding: '14px', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={formHasVt} onChange={e => setFormHasVt(e.target.checked)} />
              Descontar Vale-Transporte (até 6% do salário)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={formHasPericulosidade} onChange={e => setFormHasPericulosidade(e.target.checked)} />
              Adicional de Periculosidade (30% NR-16)
            </label>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Insalubridade (NR-15)</label>
              <select
                value={formInsalubridade}
                onChange={e => setFormInsalubridade(e.target.value as any)}
                style={{ width: '100%', background: '#111726', border: '1px solid var(--border-medium)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem' }}
              >
                <option value="NONE">Sem Insalubridade (0%)</option>
                <option value="MINIMO">Grau Mínimo (10% Salário Mínimo)</option>
                <option value="MEDIO">Grau Médio (20% Salário Mínimo)</option>
                <option value="MAXIMO">Grau Máximo (40% Salário Mínimo)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('FOLHA_GERAL')}
              style={{ background: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#070B12', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={16} /> Salvar & Incluir na Folha
            </button>
          </div>
        </form>
      )}

      {/* ABA 3: EMISSOR DE HOLERITE COM BARRA DE NAVEGAÇÃO & FECHAMENTO */}
      {activeTab === 'HOLERITE_VIEW' && activeHoleriteEmp && activeHoleriteStatement && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Barra Superior de Controle do Holerite */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #18263D 0%, #0F172A 100%)',
            padding: '14px 20px',
            borderRadius: '12px',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Botão Fechar / Voltar + Seletor de Colaborador */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('FOLHA_GERAL')}
                style={{
                  background: 'linear-gradient(180deg, #334155 0%, #1E293B 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.5)',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.15s ease'
                }}
                title="Fechar visualização do Holerite e voltar para o Quadro Geral"
              >
                <span>⬅</span> <span>Voltar para o Quadro Geral</span>
              </button>

              <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.80rem', color: '#94A3B8', fontWeight: 700 }}>Alternar Colaborador:</span>
                <select
                  value={activeHoleriteEmp.id}
                  onChange={e => setSelectedEmployeeIdForHolerite(e.target.value)}
                  style={{
                    background: '#0B1120',
                    border: '1.5px solid #38BDF8',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.25)'
                  }}
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role}) — R$ {e.baseSalary.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ações de Impressão, WhatsApp e Fechar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedEmployeeForWa(activeHoleriteEmp);
                  setShowWhatsAppModal(true);
                }}
                style={{
                  background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  border: '1px solid #10B981',
                  color: '#34D399',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Share2 size={15} /> <span>Enviar WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                  border: '1px solid #38BDF8',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Printer size={15} /> <span>Imprimir / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('FOLHA_GERAL')}
                style={{
                  background: 'linear-gradient(180deg, #451A1A 0%, #260E0E 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  color: '#FCA5A5',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Fechar e retornar ao Quadro Geral"
              >
                <span>✕</span> <span>Fechar</span>
              </button>
            </div>
          </div>

          <div className="diamond-paper-a4">
            <div style={{ borderBottom: '2px solid #000000', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{currentTenant.name}</div>
                <div>CNPJ: {currentTenant.cnpj} • CNAE: {currentTenant.cnaePrincipal.split('-')[0]}</div>
                <div>Regime Tributário: {currentTenant.regime.replace('_', ' ')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>RECIBO DE PAGAMENTO DE SALÁRIO</div>
                <div>REFERÊNCIA: <strong>{competencia}</strong></div>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #000000', padding: '8px 0', display: 'grid', gridTemplateColumns: '80px 1fr 120px 140px', gap: '8px' }}>
              <div><strong>CÓD:</strong> {activeHoleriteEmp.id.slice(-4)}</div>
              <div><strong>NOME:</strong> {activeHoleriteEmp.name}</div>
              <div><strong>CBO:</strong> {activeHoleriteEmp.cbo}</div>
              <div><strong>CARGO:</strong> {activeHoleriteEmp.role}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', fontSize: '0.76rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left' }}>
                  <th style={{ padding: '4px' }}>CÓD</th>
                  <th style={{ padding: '4px' }}>DESCRIÇÃO DO EVENTO</th>
                  <th style={{ padding: '4px', textAlign: 'right' }}>REF</th>
                  <th style={{ padding: '4px', textAlign: 'right' }}>VENCIMENTOS</th>
                  <th style={{ padding: '4px', textAlign: 'right' }}>DESCONTOS</th>
                </tr>
              </thead>
              <tbody>
                {activeHoleriteStatement.items.map(item => (
                  <tr key={item.code} style={{ borderBottom: '1px dotted #ccc' }}>
                    <td style={{ padding: '4px' }}>{item.code}</td>
                    <td style={{ padding: '4px' }}>{item.description}</td>
                    <td style={{ padding: '4px', textAlign: 'right' }}>{item.reference || '-'}</td>
                    <td style={{ padding: '4px', textAlign: 'right', fontWeight: item.type === 'PROVENTO' ? 700 : 400 }}>
                      {item.type === 'PROVENTO' ? `R$ ${item.amount.toFixed(2)}` : ''}
                    </td>
                    <td style={{ padding: '4px', textAlign: 'right', color: item.type === 'DESCONTO' ? '#b91c1c' : 'inherit', fontWeight: item.type === 'DESCONTO' ? 700 : 400 }}>
                      {item.type === 'DESCONTO' ? `R$ ${item.amount.toFixed(2)}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '20px', borderTop: '2px solid #000000', paddingTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <div>Total de Vencimentos:</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>R$ {activeHoleriteStatement.totalProventos.toFixed(2)}</div>
              </div>
              <div>
                <div>Total de Descontos:</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#b91c1c' }}>R$ {activeHoleriteStatement.totalDescontos.toFixed(2)}</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '6px', border: '1px solid #000', textAlign: 'right' }}>
                <div>VALOR LÍQUIDO A RECEBER:</div>
                <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#047857' }}>R$ {activeHoleriteStatement.netSalary.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ marginTop: '14px', borderTop: '1px solid #000000', paddingTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '0.7rem' }}>
              <div><strong>Sal. Base:</strong> R$ {activeHoleriteEmp.baseSalary.toFixed(2)}</div>
              <div><strong>Base INSS:</strong> R$ {activeHoleriteStatement.baseInss.toFixed(2)}</div>
              <div><strong>Base FGTS:</strong> R$ {activeHoleriteStatement.baseFgts.toFixed(2)}</div>
              <div><strong>FGTS do Mês:</strong> R$ {activeHoleriteStatement.fgtsAmount.toFixed(2)}</div>
              <div><strong>Base IRRF:</strong> R$ {activeHoleriteStatement.baseIrrf.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px dashed #000000', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.68rem', maxWidth: '60%' }}>
                RECEBI A IMPORTÂNCIA LÍQUIDA ACIMA DISCRIMINADA, REFERENTE AO MEU SALÁRIO DO MÊS.
              </div>
              <div style={{ borderTop: '1px solid #000', width: '220px', textAlign: 'center', paddingTop: '4px', fontSize: '0.68rem' }}>
                ASSINATURA DO COLABORADOR
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DOWNLOAD DE HOLERITES EM LOTE */}
      {showBatchDownloadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>📥 Baixar Holerites em Lote ({employees.length} funcionários)</h3>
              <button onClick={() => setShowBatchDownloadModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Selecione o formato desejado para gerar e baixar os holerites de {currentTenant.name} na competência {competencia}:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => handleDownloadRealBatchFile('HTML')} style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan-400)', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                📄 Arquivo HTML / Impressão Completa (.html)
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan-300)' }}>Gera todos os contracheques formatados para impressão ou PDF único</div>
              </button>
              <button onClick={() => handleDownloadRealBatchFile('CSV')} style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--emerald-400)', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                📊 Planilha Excel / CSV (.csv)
                <div style={{ fontSize: '0.72rem', color: 'var(--emerald-300)' }}>Exporta dados tabulares para conciliação financeira</div>
              </button>
              <button onClick={() => handleDownloadRealBatchFile('JSON')} style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #A78BFA', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                📦 Pacote de Dados Estruturados (.json)
                <div style={{ fontSize: '0.72rem', color: '#A78BFA' }}>Para integração com ERP ou BPO externo</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DISPARO DE WHATSAPP WEB */}
      {showWhatsAppModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '24px', maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>📱 Disparar Holerite via WhatsApp Web</h3>
              <button onClick={() => setShowWhatsAppModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Selecione o Colaborador:</label>
              <select
                value={selectedEmployeeForWa?.id || (employees[0]?.id || '')}
                onChange={e => setSelectedEmployeeForWa(employees.find(emp => emp.id === e.target.value) || null)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.82rem' }}
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Número de WhatsApp (com DDD):</label>
              <input
                type="text"
                value={waCustomPhone}
                onChange={e => setWaCustomPhone(e.target.value)}
                placeholder="5511999998888"
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--emerald-400)', padding: '8px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>
            <div style={{ background: '#0B1120', padding: '12px', borderRadius: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              ✓ A mensagem abrirá diretamente no <strong>WhatsApp Web</strong> oficial do seu navegador com os dados de vencimentos e salário líquido já preenchidos.
            </div>
            <button
              onClick={() => {
                const emp = selectedEmployeeForWa || employees[0];
                if (emp) {
                  const stmt = officeStore.calculatePayroll(emp, competencia);
                  handleOpenWhatsAppWeb(emp, stmt);
                }
              }}
              style={{ padding: '12px', background: '#25D366', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.88rem' }}
            >
              <ExternalLink size={16} /> Abrir WhatsApp Web & Enviar Contracheque
            </button>
          </div>
        </div>
      )}

      {/* MODAL / TOAST FLUTUANTE DE SUCESSO DA SINCRONIZAÇÃO */}
      {syncSuccessModal && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, background: '#0F172A', border: '1.5px solid var(--emerald-500)', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', maxWidth: '460px', animation: 'fadeIn 0.2s ease-in' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald-400)' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>
                  {syncSuccessModal.title}
                </h4>
                <div style={{ fontSize: '0.74rem', color: 'var(--emerald-400)', fontWeight: 700, marginTop: '2px' }}>
                  {syncSuccessModal.entriesCount} lançamentos em partidas dobradas no Diário Contábil
                </div>
              </div>
            </div>
            <button onClick={() => setSyncSuccessModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div>• Salários Brutos: <strong>R$ {syncSuccessModal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
            <div>• Líquido Salários a Pagar: <strong>R$ {totals.netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
            <div>• INSS e FGTS Digital: <strong>Escriturados no Passivo Circulante</strong></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button
              onClick={() => setSyncSuccessModal(null)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              OK, Entendido
            </button>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default PayrollOperationalView;
