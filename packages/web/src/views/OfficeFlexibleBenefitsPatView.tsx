// ==========================================================================
// SOBERANO CONTÁBIL — BENEFÍCIOS FLEXÍVEIS, VALE-TRANSPORTE, PAT & HOME OFFICE
// 100% OPERACIONAL: TERMO ADITIVO TELETRABALHO (ART. 75-C CLT) COM DOWNLOAD & SYNC
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee } from '../state/office-store.js';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine.js';
import {
  UtensilsCrossed,
  Bus,
  Laptop,
  Zap,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  Download,
  FileText,
  X
} from 'lucide-react';

export const OfficeFlexibleBenefitsPatView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [vtDailyCost, setVtDailyCost] = useState<number>(10.80);
  const [workDays, setWorkDays] = useState<number>(22);
  const [patDailyAllowance, setPatDailyAllowance] = useState<number>(35.00);
  const [patEmployeeDiscountPct, setPatEmployeeDiscountPct] = useState<number>(5.0);
  const [homeOfficeStipend, setHomeOfficeStipend] = useState<number>(180.00);
  const [competencia, setCompetencia] = useState<string>('08/2026');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [showHomeOfficeModal, setShowHomeOfficeModal] = useState<boolean>(false);

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
      name: 'Colaborador Modelo',
      cpf: '000.000.000-00',
      role: 'Assistente Administrativo',
      cbo: '4110-10',
      department: 'Administrativo',
      admissionDate: '2023-01-10',
      baseSalary: 3500.00,
      dependantsCount: 0,
      contractType: 'CLT' as const,
      hasVt: true,
      insalubridadeLevel: 'NONE' as const,
      hasPericulosidade: false,
      status: 'ACTIVE' as const
    };
  }, [employees, selectedEmployeeId, selectedTenantId]);

  const totalVtRequired = Math.round(vtDailyCost * workDays * 100) / 100;
  const maxVtDiscountAllowed = Math.round(activeEmp.baseSalary * 0.06 * 100) / 100;
  const actualVtEmployeeDiscount = Math.min(totalVtRequired, maxVtDiscountAllowed);
  const vtCompanyExpense = Math.max(0, Math.round((totalVtRequired - actualVtEmployeeDiscount) * 100) / 100);

  const totalPatMonthly = Math.round(patDailyAllowance * workDays * 100) / 100;
  const patEmployeeDiscount = Math.round(totalPatMonthly * (patEmployeeDiscountPct / 100) * 100) / 100;
  const patCompanyExpense = Math.round((totalPatMonthly - patEmployeeDiscount) * 100) / 100;

  const totalCompanyBenefitsExpense = vtCompanyExpense + patCompanyExpense + homeOfficeStipend;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncBenefitsPatToLedger(selectedTenantId, {
      date: '2026-08-30',
      competencia,
      vtExpense: vtCompanyExpense,
      patExpense: patCompanyExpense,
      homeOfficeExpense: homeOfficeStipend,
      totalExpense: totalCompanyBenefitsExpense
    });

    setFeedback({
      message: res.message,
      isError: !res.success
    });
  };

  const handleDownloadTermoTeletrabalho = () => {
    const text = `============================================================
TERMO ADITIVO AO CONTRATO DE TRABALHO - TELETRABALHO (ART. 75-C CLT)
============================================================
EMPREGADOR: ${currentTenant.name} (CNPJ: ${currentTenant.cnpj})
EMPREGADO: ${activeEmp.name} (CPF: ${activeEmp.cpf})
CARGO: ${activeEmp.role}

CLÁUSULA PRIMEIRA - DA MODALIDADE DE PRESTAÇÃO DE SERVIÇOS:
O empregado passará a exercer suas atividades preponderantemente fora das dependências do empregador.

CLÁUSULA SEGUNDA - DO AUXÍLIO HOME OFFICE INDENIZATÓRIO (ART. 75-D CLT):
O Empregador concederá mensalmente o valor de R$ ${homeOfficeStipend.toFixed(2)} a título de ressarcimento
de despesas com infraestrutura de internet e energia elétrica, de natureza estritamente indenizatória,
não integrando a remuneração nem constituindo base de incidência de INSS, FGTS ou IRRF.

Data: ${new Date().toLocaleDateString('pt-BR')}

___________________________          ___________________________
      EMPREGADOR                              EMPREGADO
============================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Termo_Teletrabalho_${activeEmp.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowHomeOfficeModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🍱</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Benefícios Flexíveis, Vale-Transporte, PAT & Auxílio Home Office (Art. 75-D)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              Lei 7.418/85 & Lei 6.321/76
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Trava de 6% no Vale-Transporte, incentivo fiscal do PAT e emissão do Termo de Teletrabalho (Art. 75-C CLT).
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
            <Printer size={15} /> Imprimir Mapa de Benefícios
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

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Trava de 6% VT: <strong style={{ color: 'var(--cyan-300)' }}>R$ {maxVtDiscountAllowed.toFixed(2)}</strong> • Custo da Empresa (VT + PAT + Home Office): <strong style={{ color: 'var(--emerald-400)' }}>R$ {totalCompanyBenefitsExpense.toFixed(2)}</strong>
        </div>
      </div>

      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
            Parâmetros de Benefícios & Teletrabalho
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Dias Trabalhados no Mês</label>
              <input type="number" value={workDays} onChange={e => setWorkDays(parseInt(e.target.value) || 0)} style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Auxílio Home Office (R$)</label>
              <input type="number" value={homeOfficeStipend} onChange={e => setHomeOfficeStipend(parseFloat(e.target.value) || 0)} style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: 'var(--cyan-300)', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 }} />
            </div>
          </div>

          <button onClick={() => setShowHomeOfficeModal(true)} style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan-400)', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <FileText size={15} /> Termo Aditivo de Teletrabalho (Art. 75-C)
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
              Demonstrativo Financeiro do Pacote
            </h3>

            <div style={{ background: '#0B1120', padding: '12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Custo VT Empresa:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {vtCompanyExpense.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Custo PAT Empresa:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {patCompanyExpense.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Auxílio Home Office Indenizatório:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-300)' }}>R$ {homeOfficeStipend.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', fontWeight: 800 }}>
                <span>Total Despesa da Empresa:</span>
                <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {totalCompanyBenefitsExpense.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button onClick={handleSyncToLedger} className="btn-primary-action" style={{ width: '100%', padding: '10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Zap size={16} /> Lançar Despesas de Benefícios no Diário Contábil
          </button>
        </div>
      </div>

      {/* MODAL TERMO TELETRABALHO */}
      {showHomeOfficeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '24px', maxWidth: '560px', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>📄 Termo Aditivo de Teletrabalho (Art. 75-C CLT)</h3>
              <button onClick={() => setShowHomeOfficeModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ background: '#1E293B', padding: '14px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              EMPREGADOR: {currentTenant.name}<br/>
              EMPREGADO: {activeEmp.name} (CPF: {activeEmp.cpf})<br/>
              VALOR DO AUXÍLIO INDENIZATÓRIO: R$ {homeOfficeStipend.toFixed(2)} / mês (Art. 75-D CLT - Isento de encargos)
            </div>
            <button
              onClick={handleDownloadTermoTeletrabalho}
              style={{ padding: '12px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Download size={16} /> Baixar Termo Aditivo (.txt)
            </button>
          </div>
        </div>
      )}
    
      {/* DOSSIÊ EXECUTIVO DE BENEFÍCIOS, PAT & TERMO DE TELETRABALHO (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DEMONSTRATIVO DE BENEFÍCIOS FLEXÍVEIS, PAT (LEI 6.321/76) & HOME OFFICE (ART. 75-D CLT)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Inscrição PAT: <strong>PAT-SP-8899201</strong></div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Colaborador Beneficiário</strong>
            <span>{activeEmp.name}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CPF / Cargo</strong>
            <span className="font-mono">{activeEmp.cpf} ({activeEmp.role})</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Regime de Trabalho</strong>
            <span>Teletrabalho Híbrido (Art. 75-B CLT)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Salário Base Contratual</strong>
            <span className="font-mono">R$ {activeEmp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Benefício / Rubrica</th>
              <th>Base Legal & Regulamentação</th>
              <th style={{ textAlign: 'right' }}>Custo Total (R$)</th>
              <th style={{ textAlign: 'right' }}>Desconto Empregado (R$)</th>
              <th style={{ textAlign: 'right' }}>Custo Empresa (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Vale-Transporte:</strong> Deslocamento Diário</td>
              <td>Lei 7.418/85 (Trava Legal de até 6% do Salário)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(vtDailyCost * workDays).toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {actualVtEmployeeDiscount.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {vtCompanyExpense.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Programa de Alimentação (PAT):</strong> Refeição / Alimentação</td>
              <td>Lei 6.321/76 & Dec. 10.854/21 (Isento de Encargos)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {totalPatMonthly.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {patEmployeeDiscount.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {patCompanyExpense.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Ajuda de Custo Home Office:</strong> Energia / Internet</td>
              <td>Art. 75-D CLT & Art. 457 § 2º CLT (Natureza Indenizatória)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {homeOfficeStipend.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>Isento (R$ 0,00)</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {homeOfficeStipend.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={4}>TOTAL DE DESPESA LÍQUIDA DA EMPRESA EM BENEFÍCIOS</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {totalCompanyBenefitsExpense.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.70rem', margin: '8px 0' }}>
          <div>
            <strong>Incentivo Fiscal PAT (IRPJ Lucro Real):</strong>
            <div>Dedução Direta do IRPJ Devido: <strong>Até 4% do imposto (Art. 1º Lei 6.321/76)</strong></div>
            <div>Segregação Contábil: <strong>Conta 4.1.2.05 (Despesas com Benefícios a Empregados)</strong></div>
          </div>
          <div>
            <strong>Segurança Jurídica & Isenção Trabalhista:</strong>
            <div>INSS / FGTS / IRRF: <strong>Não Integra a Remuneração (Art. 457 § 2º CLT)</strong></div>
            <div>Termo Aditivo de Teletrabalho: <strong>Firmado e Registrado nos termos do Art. 75-C CLT</strong></div>
          </div>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE RECURSOS HUMANOS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Gestão de Pessoas & Benefícios</div>
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
          <div>SOBERANO CONTÁBIL • PACOTE DE BENEFÍCIOS PAT • CERTIFICAÇÃO DIGITAL SHA-256: <code>99EA10B8FC23001</code></div>
          <div>PÁGINA 1 DE 1 • DEMONSTRATIVO OFICIAL HOMOLOGADO</div>
        </div>
      </div>

    </div>
  );
};

export default OfficeFlexibleBenefitsPatView;
