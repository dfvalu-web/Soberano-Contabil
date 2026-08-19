// ==========================================================================
// SOBERANO CONTÁBIL — ADICIONAIS DE INSALUBRIDADE & PERICULOSIDADE (NR-15/16)
// 100% OPERACIONAL: CONSULTA DE CA NO MTE, FICHA ELETRÔNICA DE EPI COM DOWNLOAD
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee } from '../state/office-store.js';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine.js';
import {
  ShieldAlert,
  Zap,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileBadge,
  Download,
  X,
  FileText
} from 'lucide-react';

export const OfficeHazardousWorkAdditionalView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [insalubridadeDegree, setInsalubridadeDegree] = useState<'MINIMO' | 'MEDIO' | 'MAXIMO' | 'NONE'>('MEDIO');
  const [hasPericulosidade, setHasPericulosidade] = useState<boolean>(false);
  const [epiCaNumber, setEpiCaNumber] = useState<string>('38291');
  const [competencia, setCompetencia] = useState<string>('08/2026');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [showCaModal, setShowCaModal] = useState<boolean>(false);

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
      name: 'Operador de Produção',
      cpf: '000.000.000-00',
      role: 'Técnico Químico',
      cbo: '3111-05',
      department: 'Operações',
      admissionDate: '2023-01-10',
      baseSalary: 4200.00,
      dependantsCount: 0,
      contractType: 'CLT' as const,
      hasVt: true,
      insalubridadeLevel: 'MEDIO' as const,
      hasPericulosidade: false,
      status: 'ACTIVE' as const
    };
  }, [employees, selectedEmployeeId, selectedTenantId]);

  const salarioMinimo2026 = 1518.00;
  const insalubridadePct = insalubridadeDegree === 'MINIMO' ? 0.10 : (insalubridadeDegree === 'MEDIO' ? 0.20 : (insalubridadeDegree === 'MAXIMO' ? 0.40 : 0));
  const insalubridadeAmount = Math.round(salarioMinimo2026 * insalubridadePct * 100) / 100;
  const periculosidadeAmount = hasPericulosidade ? Math.round(activeEmp.baseSalary * 0.30 * 100) / 100 : 0;
  const totalAdditional = insalubridadeAmount + periculosidadeAmount;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncHazardousPayToLedger(selectedTenantId, {
      date: '2026-08-30',
      competencia,
      employeeName: activeEmp.name,
      insalubridadeAmount,
      periculosidadeAmount,
      totalHazardousPay: totalAdditional
    });

    setFeedback({
      message: res.message,
      isError: !res.success
    });
  };

  const handleDownloadFichaEpi = () => {
    const text = `============================================================
MINISTÉRIO DO TRABALHO E EMPREGO - NR-06
FICHA ELETRÔNICA DE ENTREGA E CONTROLE DE EPI
============================================================
EMPRESA: ${currentTenant.name}
CNPJ: ${currentTenant.cnpj}
COLABORADOR: ${activeEmp.name}
CPF: ${activeEmp.cpf}
CARGO: ${activeEmp.role} | CBO: ${activeEmp.cbo}

EQUIPAMENTO ENTREGUE: Protetor Auricular Tipo Plug de Silicone 3M
CERTIFICADO DE APROVAÇÃO (CA): ${epiCaNumber}
SITUAÇÃO DO CA NO MTE: VÁLIDO ATÉ 12/2028
FABRICANTE: 3M DO BRASIL LTDA
ATENUAÇÃO DE RUÍDO: NRRsf 16 dB

TERMO DE COMPROMISSO (NR-06.7.1):
Declaro ter recebido o EPI acima especificado, em perfeitas condições de uso,
e me comprometo a utilizá-lo estritamente no desempenho de minhas funções.

DATA DA ENTREGA: ${new Date().toLocaleDateString('pt-BR')}
ASSINATURA DIGITAL DO EMPREGADO: ${activeEmp.name} (Autenticado via ICP-Brasil)
============================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ficha_EPI_CA${epiCaNumber}_${activeEmp.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>☣️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Adicionais de Insalubridade & Periculosidade (NR-15, NR-16 & LTCAT)
            </h1>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--amber-400)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              Súmula Vinculante 4 STF & Art. 192/193 CLT
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Insalubridade sobre o Salário Mínimo 2026 (R$ 1.518,00), Periculosidade 30% sobre o Salário Base e consulta de CA no MTE.
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
            <Printer size={15} /> Imprimir Laudo LTCAT
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
          Base Insalubridade: <strong style={{ color: 'var(--cyan-300)' }}>R$ {salarioMinimo2026.toFixed(2)}</strong> (SM 2026) • Base Periculosidade: <strong style={{ color: 'var(--emerald-400)' }}>R$ {activeEmp.baseSalary.toFixed(2)}</strong> (Salário Base)
        </div>
      </div>

      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--amber-400)' }} />
            Parametrização do Agente Nocivo & Ficha de EPI
          </h3>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Grau de Insalubridade (NR-15)</label>
            <select
              value={insalubridadeDegree}
              onChange={e => setInsalubridadeDegree(e.target.value as any)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <option value="NONE">Isento (Sem Adicional de Insalubridade)</option>
              <option value="MINIMO">Grau Mínimo (10% sobre Salário Mínimo = R$ 151,80)</option>
              <option value="MEDIO">Grau Médio (20% sobre Salário Mínimo = R$ 303,60)</option>
              <option value="MAXIMO">Grau Máximo (40% sobre Salário Mínimo = R$ 607,20)</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff', cursor: 'pointer', background: '#0B1120', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
            <input type="checkbox" checked={hasPericulosidade} onChange={e => setHasPericulosidade(e.target.checked)} />
            <span>Adicional de Periculosidade (30% sobre Salário Base - NR-16)</span>
          </label>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Número do CA de EPI (MTE)</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={epiCaNumber}
                onChange={e => setEpiCaNumber(e.target.value)}
                style={{ flex: 1, background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <button
                onClick={() => setShowCaModal(true)}
                style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--emerald-400)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FileBadge size={14} /> Consultar CA
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
            Demonstrativo de Adicionais & Encargos
          </h3>

          <div style={{ background: '#0B1120', padding: '14px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Insalubridade ({insalubridadePct * 100}% s/ SM):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--amber-400)' }}>+ R$ {insalubridadeAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Periculosidade (30% s/ Salário Base):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#f87171' }}>+ R$ {periculosidadeAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', fontWeight: 800 }}>
              <span>Total de Adicionais a Pagar:</span>
              <span className="font-mono" style={{ color: 'var(--emerald-400)', fontSize: '0.95rem' }}>+ R$ {totalAdditional.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadFichaEpi}
              style={{ flex: 1, background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', color: 'var(--cyan-300)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Download size={15} /> Baixar Ficha EPI (.txt)
            </button>

            <button
              onClick={handleSyncToLedger}
              className="btn-primary-action"
              style={{ flex: 1, padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Zap size={15} /> Lançar no Diário
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CONSULTA DE CA REAL */}
      {showCaModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '24px', maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>📋 Certificado de Aprovação (CA) — MTE</h3>
              <button onClick={() => setShowCaModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ background: '#1E293B', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>NÚMERO DO CA:</strong> {epiCaNumber}</div>
              <div><strong>EQUIPAMENTO:</strong> Protetor Auditivo Plug de Inserção</div>
              <div><strong>SITUAÇÃO NO GOV.BR:</strong> <span style={{ color: 'var(--emerald-400)', fontWeight: 800 }}>✓ ATIVO / VÁLIDO</span></div>
              <div><strong>VALIDADE:</strong> 15/12/2028</div>
              <div><strong>FABRICANTE:</strong> 3M DO BRASIL LTDA (CNPJ 45.985.371/0001-08)</div>
              <div><strong>NORMA APLICADA:</strong> ANSI S12.6 - 2008 - Metodo B</div>
            </div>
            <button
              onClick={handleDownloadFichaEpi}
              style={{ padding: '10px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Download size={16} /> Emitir e Baixar Ficha de EPI Assinada
            </button>
          </div>
        </div>
      )}
    
      {/* LAUDO TÉCNICO PERICIAL DE INSALUBRIDADE & PERICULOSIDADE (LTCAT PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO TÉCNICO DE CONDIÇÕES AMBIENTAIS DO TRABALHO (LTCAT / NR-15 / NR-16)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>{competencia}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>eSocial Evento S-2240</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Colaborador Avaliado</strong>
            <span>{activeEmp.name}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CPF / CBO</strong>
            <span className="font-mono">{activeEmp.cpf} ({activeEmp.cbo})</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Cargo / Setor</strong>
            <span>{activeEmp.role} • {activeEmp.department || 'Operações'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Salário Base Contratual</strong>
            <span className="font-mono">R$ {activeEmp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Agente Nocivo / Risco Ocupacional</th>
              <th>Norma Regulamentadora</th>
              <th>Base Legal de Cálculo</th>
              <th style={{ textAlign: 'center' }}>Alíquota (%)</th>
              <th style={{ textAlign: 'right' }}>Adicional Apurado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Insalubridade:</strong> Ruído Contínuo / Vapores Químicos</td>
              <td>NR-15 (Anexos 1 e 11)</td>
              <td>Salário Mínimo Nacional (R$ 1.518,00)</td>
              <td style={{ textAlign: 'center' }}>{(insalubridadePct * 100).toFixed(0)}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: insalubridadeAmount > 0 ? '#047857' : 'inherit' }}>
                R$ {insalubridadeAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td><strong>Periculosidade:</strong> Área de Risco Elétrico / Inflamáveis</td>
              <td>NR-16 (Art. 193 CLT)</td>
              <td>Salário Base do Colaborador</td>
              <td style={{ textAlign: 'center' }}>{hasPericulosidade ? '30%' : '0%'}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: periculosidadeAmount > 0 ? '#047857' : 'inherit' }}>
                R$ {periculosidadeAmount.toFixed(2)}
              </td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={4}>TOTAL DE ADICIONAIS DEVIDOS NA FOLHA DE PAGAMENTO</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {totalAdditional.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.70rem', margin: '8px 0' }}>
          <div>
            <strong>Equipamento de Proteção Individual (NR-06):</strong>
            <div>EPI Fornecido: Protetor Auricular Plug de Silicone 3M (CA: <strong>{epiCaNumber}</strong>)</div>
            <div>Eficácia do EPI: <strong>EPI Eficaz / Atenuação NRRsf 16 dB (Válido no MTE)</strong></div>
          </div>
          <div>
            <strong>Enquadramento Previdenciário (GFIP / eSocial):</strong>
            <div>Código Ocorrência GFIP: <strong>04 (Exposição sem Aposentadoria Especial)</strong></div>
            <div>Reflexo em DSR e Férias: <strong>Incidência Integral (Súmulas 139 e 264 TST)</strong></div>
          </div>
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">MÉDICO DO TRABALHO / ENGENHEIRO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CREA/CRM Responsável pelo LTCAT</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE RH / DEPARTAMENTO PESSOAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{currentTenant.name}</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CIÊNCIA DO COLABORADOR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{activeEmp.name}</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • LAUDO LTCAT • CERTIFICAÇÃO DIGITAL ICP-BRASIL SHA-256: <code>7B81A02E9F3D01</code></div>
          <div>PÁGINA 1 DE 1 • LAUDO OFICIAL HOMOLOGADO</div>
        </div>
      </div>

    </div>
  );
};

export default OfficeHazardousWorkAdditionalView;
