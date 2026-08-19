// ==========================================================================
// SOBERANO CONTÁBIL — SEGREGAÇÃO DE RECEITAS MONOFÁSICAS PIS/COFINS (PGDAS-D)
// Conformidade: Lei 10.147/00 • Solução de Consulta COSIT 225/14 • PGDAS-D
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeMonophasicTaxSegregationView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [receitaBrutaTotal, setReceitaBrutaTotal] = useState<number>(120000.00);
  const [receitaMonofasica, setReceitaMonofasica] = useState<number>(75000.00); // 75k de medicamentos/cosméticos monofásicos
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const receitaTributadaNormal = Math.max(0, receitaBrutaTotal - receitaMonofasica);
  const percentualMonofasico = receitaBrutaTotal > 0 ? (receitaMonofasica / receitaBrutaTotal) * 100 : 0;

  // No Simples Nacional Anexo I (Comércio), PIS e COFINS representam ~12.74% da alíquota do DAS
  // Economia direta ao segregar: ~1.25% do faturamento monofásico
  const economiaPisCofinsMensal = receitaMonofasica * 0.0125;
  const economiaAnualProjetada = economiaPisCofinsMensal * 12;

  const batchId = `fis-monofasico-${selectedTenantId}-082026`;
  const lockInfo = useMemo(() => {
    return officeStore.checkDepartmentLock(selectedTenantId, batchId);
  }, [selectedTenantId, feedback]);

  const handleReleaseToAccounting = () => {
    if (lockInfo.isLocked) {
      setFeedback({
        message: 'TRAVA DE SEGURANÇA ATIVA: Esta apuração monofásica já foi liberada para a Contabilidade e está aguardando homologação ou devolução pelo Contador.',
        isError: true
      });
      return;
    }

    officeStore.releaseBatchToAccounting({
      id: batchId,
      tenantId: selectedTenantId,
      department: 'FISCAL',
      competencia: '08/2026',
      title: 'Segregação de Receitas Monofásicas PIS/COFINS (PGDAS-D)',
      description: `Receita Bruta: R$ ${receitaBrutaTotal.toLocaleString('pt-BR')} • Economia Gerada: R$ ${economiaPisCofinsMensal.toFixed(2)}`,
      sourceModuleId: 'office_monophasic_tax',
      sentBy: 'Analista Fiscal (Setor Farmácias & Autopeças)',
      totalDebits: economiaPisCofinsMensal,
      totalCredits: economiaPisCofinsMensal,
      itemsCount: 1,
      previewLines: [
        { debitAccountCode: '2.1.2.04', debitAccountName: 'DAS Simples a Recolher (Redução)', creditAccountCode: '3.1.2.01', creditAccountName: 'Deduções da Receita Bruta (PIS/COF Monofásico)', amount: economiaPisCofinsMensal, history: 'Economia Segregação PGDAS 08/2026' }
      ]
    });

    setFeedback({
      message: 'Apuração Monofásica liberada com sucesso para a Pré-Homologação Contábil! A trava de segurança foi ativada.',
      isError: false
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💊</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Segregação de Receitas Monofásicas PIS/COFINS (Farmácias & Autopeças)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              LEI 10.147/00 • PGDAS-D SEGREGAÇÃO
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Abatimento legítimo da parcela de PIS e COFINS no cálculo do Simples Nacional para produtos com tributação concentrada.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Imprimir Laudo Monofásico (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${feedback.isError ? 'var(--red-500)' : 'var(--emerald-500)'}`, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {feedback.isError ? <AlertTriangle size={20} color="#F87171" /> : <CheckCircle2 size={20} color="var(--emerald-400)" />}
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Economia Mensal Gerada no DAS</span>
            <TrendingDown size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {economiaPisCofinsMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Economia Anual: R$ {economiaAnualProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Receita Monofásica Segregada</span>
            <ShieldCheck size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {receitaMonofasica.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{percentualMonofasico.toFixed(1)}% do faturamento total</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Receita Tributada Normal</span>
            <DollarSign size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {receitaTributadaNormal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Incidência integral de PIS/COFINS</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Governança & Trava Contábil</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          {lockInfo.isLocked ? (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px dashed var(--amber-400)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--amber-300)', fontWeight: 700 }}>
              <span>🔒 Lote Travado na Contabilidade</span>
            </div>
          ) : (
            <button
              onClick={handleReleaseToAccounting}
              className="btn-primary-action"
              style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
            >
              ⚡ Liberar p/ Contabilidade (1-Click)
            </button>
          )}
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>Receita Bruta Total do Mês (R$)</label>
            <input type="number" step="100" className="form-control font-mono" value={receitaBrutaTotal} onChange={e => setReceitaBrutaTotal(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Receita com Produtos Monofásicos NCM (R$)</label>
            <input type="number" step="100" className="form-control font-mono" value={receitaMonofasica} onChange={e => setReceitaMonofasica(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO DE SEGREGAÇÃO DE PRODUTOS MONOFÁSICOS (LEI Nº 10.147/2000 / PGDAS-D)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Segregação PGDAS-D Homologada</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Faturamento Bruto Total</strong>
            <span className="font-mono">R$ {receitaBrutaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Receita Monofásica Isenta</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {receitaMonofasica.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Economia Tributária Mensal</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {economiaPisCofinsMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade Regulatória</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ COSIT 225/14 Homologada</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Segmento de Produto</th>
              <th>Enquadramento Legal</th>
              <th style={{ textAlign: 'right' }}>Receita Bruta (R$)</th>
              <th style={{ textAlign: 'right' }}>Economia Fiscal DAS (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Medicamentos e Produtos Farmacêuticos</td>
              <td>Art. 1º Lei 10.147/00 (NCM 3003/3004)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(receitaMonofasica * 0.70).toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {(economiaPisCofinsMensal * 0.70).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Perfumaria, Cosméticos e Higiene Pessoal</td>
              <td>Art. 1º Lei 10.147/00 (NCM 3303 a 3307)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(receitaMonofasica * 0.30).toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {(economiaPisCofinsMensal * 0.30).toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>TOTAL DA ECONOMIA TRIBUTÁRIA NO RECÁLCULO DO PGDAS-D MENSAL</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {economiaPisCofinsMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO FISCAL FARMACÊUTICA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Auditoria NCM / CEST</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DO SIMPLES NACIONAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade PGDAS-D</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeMonophasicTaxSegregationView;
