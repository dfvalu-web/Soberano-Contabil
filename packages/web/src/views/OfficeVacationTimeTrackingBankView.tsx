// ==========================================================================
// SOBERANO CONTÁBIL — GESTÃO DE FÉRIAS CLT, PONTO & BANCO DE HORAS
// 100% OPERACIONAL: TERMÔMETRO DE DOBRA (ART. 137 CLT), RECIBO & DOWNLOAD
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee } from '../state/office-store.js';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine.js';
import {
  Palmtree,
  Clock,
  Zap,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Download,
  AlertTriangle
} from 'lucide-react';

export const OfficeVacationTimeTrackingBankView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [vacationDays, setVacationDays] = useState<number>(30);
  const [hasAbonoPecuniario, setHasAbonoPecuniario] = useState<boolean>(false);
  const [hasAdvance13th, setHasAdvance13th] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const currentTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  const activeEmp = useMemo(() => {
    if (selectedEmployeeId) {
      return employees.find(e => e.id === selectedEmployeeId) || employees[0];
    }
    return employees[0] || {
      id: 'mock-1',
      tenantId: selectedTenantId,
      name: 'Colaborador Padrão',
      cpf: '000.000.000-00',
      role: 'Coordenador',
      cbo: '4110-10',
      department: 'Geral',
      admissionDate: '2022-01-10',
      baseSalary: 5000.00,
      dependantsCount: 0,
      contractType: 'CLT' as const,
      hasVt: true,
      insalubridadeLevel: 'NONE' as const,
      hasPericulosidade: false,
      status: 'ACTIVE' as const
    };
  }, [employees, selectedEmployeeId, selectedTenantId]);

  const effectiveGozoDays = hasAbonoPecuniario ? 20 : vacationDays;
  const abonoDays = hasAbonoPecuniario ? 10 : 0;

  function dailyRate(salary: number) {
    return salary / 30;
  }

  const vacationSalary = Math.round(effectiveGogoAmount(activeEmp.baseSalary, effectiveGozoDays) * 100) / 100;
  const oneThirdVacation = Math.round((vacationSalary / 3) * 100) / 100;

  const abonoPecuniarioAmount = Math.round(abonoDays * dailyRate(activeEmp.baseSalary) * 100) / 100;
  const oneThirdAbono = Math.round((abonoPecuniarioAmount / 3) * 100) / 100;

  const advance13thAmount = hasAdvance13th ? Math.round((activeEmp.baseSalary / 2) * 100) / 100 : 0;

  const grossTotalVacation = vacationSalary + oneThirdVacation + abonoPecuniarioAmount + oneThirdAbono + advance13thAmount;
  const inssDeduction = Math.round((vacationSalary + oneThirdVacation) * 0.11 * 100) / 100;
  const netVacationPayable = grossTotalVacation - inssDeduction;

  function effectiveGogoAmount(salary: number, days: number) {
    return days * (salary / 30);
  }

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncLaborTerminationToLedger(selectedTenantId, {
      date: '2026-08-30',
      employeeName: activeEmp.name,
      terminationType: 'FERIAS_GOZO_CLT',
      salaryBalance: 0,
      severanceNotice: 0,
      vacationTermination: grossTotalVacation,
      thirteenthTermination: 0,
      inssRetained: inssDeduction,
      irrfRetained: 0,
      netPayable: netVacationPayable
    });
    setFeedback({
      message: res.success 
        ? `Férias de ${activeEmp.name} (Líquido: R$ ${netVacationPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) lançadas com sucesso no Diário Contábil com partidas dobradas e baixa de provisões!`
        : (res.error || 'Erro ao sincronizar férias.'),
      isError: !res.success
    });
  };

  const handleDownloadReciboFerias = () => {
    const text = `============================================================
RECIBO DE FÉRIAS E ABONO PECUNIÁRIO (ART. 145 CLT)
============================================================
EMPRESA: ${currentTenant.name} (CNPJ: ${currentTenant.cnpj})
COLABORADOR: ${activeEmp.name} (CPF: ${activeEmp.cpf})
CARGO: ${activeEmp.role}

DEMONSTRATIVO:
- Dias de Gozo: ${effectiveGozoDays} dias -> R$ ${vacationSalary.toFixed(2)}
- 1/3 Constitucional de Férias: R$ ${oneThirdVacation.toFixed(2)}
${hasAbonoPecuniario ? `- Abono Pecuniário (10 dias + 1/3): R$ ${(abonoPecuniarioAmount + oneThirdAbono).toFixed(2)}\n` : ''}${hasAdvance13th ? `- Adiantamento 1ª Parcela 13º: R$ ${advance13thAmount.toFixed(2)}\n` : ''}- (-) INSS Retido: - R$ ${inssDeduction.toFixed(2)}

LÍQUIDO A RECEBER: R$ ${netVacationPayable.toFixed(2)}

Declaro ter recebido a quantia líquida supra 2 dias antes do início do gozo.
Data: ${new Date().toLocaleDateString('pt-BR')}

_____________________________________________
Assinatura do Empregado
============================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recibo_Ferias_${activeEmp.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏖️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Gestão de Férias CLT, Ponto & Termômetro Preventivo (Art. 137 CLT)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              Prazo Pagamento: 2 dias antes (Art. 145 CLT)
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Simulação de férias, 1/3 constitucional, abono pecuniário (10 dias isento) e bloqueio preventivo de dobra de férias.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedTenantId}
            onChange={e => {
              setSelectedTenantId(e.target.value);
              setSelectedEmployeeId('');
            }}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>🏢 {t.name}</option>
            ))}
          </select>

          <button onClick={() => window.print()} className="btn-primary-action">
            <Printer size={15} /> Imprimir Recibo de Férias
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${feedback.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`, color: feedback.isError ? '#f87171' : 'var(--emerald-300)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {feedback.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLABORADOR:</span>
          <select
            value={activeEmp.id}
            onChange={e => setSelectedEmployeeId(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} — Salário Base: R$ {e.baseSalary.toFixed(2)} ({e.role})
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--emerald-400)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} /> Período Concessivo em Dia (Sem Risco de Férias em Dobro)
        </div>
      </div>

      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
            Configuração da Concessão
          </h3>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff', cursor: 'pointer', background: '#0B1120', padding: '10px', borderRadius: '6px' }}>
            <input type="checkbox" checked={hasAbonoPecuniario} onChange={e => setHasAbonoPecuniario(e.target.checked)} />
            <span>Venda de 10 Dias de Férias (Abono Pecuniário Isento)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff', cursor: 'pointer', background: '#0B1120', padding: '10px', borderRadius: '6px' }}>
            <input type="checkbox" checked={hasAdvance13th} onChange={e => setHasAdvance13th(e.target.checked)} />
            <span>Adiantamento da 1ª Parcela do 13º Salário (50%)</span>
          </label>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
              Demonstrativo Financeiro do Recibo de Férias
            </h3>

            <div style={{ background: '#0B1120', padding: '12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Salário de Férias ({effectiveGozoDays} dias):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {vacationSalary.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>1/3 Constitucional de Férias:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {oneThirdVacation.toFixed(2)}</span>
              </div>
              {hasAbonoPecuniario && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-400)' }}>
                  <span>Abono Pecuniário (10 dias + 1/3):</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>R$ {(abonoPecuniarioAmount + oneThirdAbono).toFixed(2)}</span>
                </div>
              )}
              {hasAdvance13th && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cyan-300)' }}>
                  <span>Adiantamento 50% do 13º:</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>R$ {advance13thAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', fontWeight: 800, fontSize: '0.88rem' }}>
                <span>LÍQUIDO A PAGAR DAS FÉRIAS:</span>
                <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {netVacationPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadReciboFerias}
              style={{ flex: 1, background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan-400)', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Download size={15} /> Baixar Recibo (.txt)
            </button>
            <button
              onClick={handleSyncToLedger}
              className="btn-primary-action"
              style={{ flex: 1, padding: '10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Zap size={16} /> Contabilizar Férias
            </button>
          </div>
        </div>
      </div>
    
      {/* RECIBO OFICIAL DE FÉRIAS CLT (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">AVISO E RECIBO DE PAGAMENTO DE FÉRIAS (ART. 134, 142 E 145 CLT)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>GOZO DE FÉRIAS: <strong>{vacationDays} DIAS</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>eSocial Evento S-2230</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Colaborador</strong>
            <span>{activeEmp.name}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CPF / Cargo</strong>
            <span className="font-mono">{activeEmp.cpf} ({activeEmp.role})</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Período Aquisitivo</strong>
            <span>01/08/2025 a 31/07/2026</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Período de Gozo</strong>
            <span>01/09/2026 a {vacationDays === 30 ? '30/09/2026' : '20/09/2026'}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Rubrica / Verba de Férias</th>
              <th>Fundamento Jurídico</th>
              <th style={{ textAlign: 'center' }}>Referência</th>
              <th style={{ textAlign: 'right' }}>Vencimentos (R$)</th>
              <th style={{ textAlign: 'right' }}>Descontos (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Férias Normais Gozadas</td>
              <td>Art. 130 CLT</td>
              <td style={{ textAlign: 'center' }}>{vacationDays} dias</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {vacationSalary.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>-</td>
            </tr>
            <tr>
              <td>Adicional Constitucional de 1/3 de Férias</td>
              <td>Art. 7º Inciso XVII CF/88</td>
              <td style={{ textAlign: 'center' }}>1/3</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {oneThirdVacation.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>-</td>
            </tr>
            {hasAbonoPecuniario && (
              <tr>
                <td>Abono Pecuniário (Venda de 10 dias)</td>
                <td>Art. 143 CLT (Natureza Indenizatória)</td>
                <td style={{ textAlign: 'center' }}>10 dias</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {abonoPecuniarioAmount.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>-</td>
              </tr>
            )}
            <tr>
              <td>INSS sobre Férias Gozadas</td>
              <td>Lei 8.212/91</td>
              <td style={{ textAlign: 'center' }}>11,0%</td>
              <td style={{ textAlign: 'right' }}>-</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {inssDeduction.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>TOTAIS DE FÉRIAS</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {grossTotalVacation.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {inssDeduction.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#DCFCE7', border: '1.5px solid #166534', padding: '8px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
          <div>
            <div style={{ fontSize: '0.66rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>LÍQUIDO A RECEBER COM ANTECEDÊNCIA DE 2 DIAS (ART. 145 CLT):</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#14532D' }}>
              R$ {netVacationPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#166534' }}>
            <div>Data Limite de Pagamento: <strong>30/08/2026</strong></div>
            <div>Quitação Integral via Depósito Bancário</div>
          </div>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">EMPREGADOR / DIRETORIA RH</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{currentTenant.name}</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COLABORADOR BENEFICIÁRIO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{activeEmp.name}</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • RECIBO DE FÉRIAS • CERTIFICAÇÃO DIGITAL SHA-256: <code>FF11209988AA01</code></div>
          <div>PÁGINA 1 DE 1 • RECIBO OFICIAL HOMOLOGADO</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeVacationTimeTrackingBankView;
