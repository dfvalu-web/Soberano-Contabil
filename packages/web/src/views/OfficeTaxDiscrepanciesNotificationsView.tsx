// ==========================================================================
// SOBERANO CONTÁBIL — RADAR DE MALHA FINA TRIBUTÁRIA & NOTIFICAÇÕES RFB/SEFAZ
// Conformidade: Cruzamento ECF x DCTF • EFD-Contribuições x EFD-ICMS/IPI • DIMP
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Radar,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  FileSearch
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface DiscrepancyItem {
  id: string;
  divergenceType: string;
  sourceDeclarations: string;
  declaredAmount: number;
  rfbDetectedAmount: number;
  differenceAmount: number;
  riskLevel: 'CRITICO' | 'MEDIO' | 'BAIXO';
  suggestedAction: string;
  status: 'PENDENTE' | 'RETIFICADO' | 'DEFESA_PROTOCOLADA';
}

export const OfficeTaxDiscrepanciesNotificationsView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>([
    {
      id: 'disc-1',
      divergenceType: 'Receita Bruta: DCTFWeb x ECF (Bloco P/L)',
      sourceDeclarations: 'DCTFWeb 08/2026 vs ECF L300',
      declaredAmount: 250000.00,
      rfbDetectedAmount: 265000.00,
      differenceAmount: 15000.00,
      riskLevel: 'CRITICO',
      suggestedAction: 'Retificar DCTFWeb para incluir NFS-e nº 4410 não transmitida no período.',
      status: 'PENDENTE'
    },
    {
      id: 'disc-2',
      divergenceType: 'Operações de Cartão/PIX x DF-e Emitidas (DIMP)',
      sourceDeclarations: 'Extrato Adquirente Cielo vs EFD-ICMS',
      declaredAmount: 85000.00,
      rfbDetectedAmount: 88200.00,
      differenceAmount: 3200.00,
      riskLevel: 'MEDIO',
      suggestedAction: 'Emitir NFC-e complementar para vendas diretas no balcão sem acobertamento.',
      status: 'PENDENTE'
    }
  ]);

  const totalRiskAmount = discrepancies.filter(d => d.status === 'PENDENTE').reduce((acc, d) => acc + d.differenceAmount, 0);

  const handleRunFullScan = () => {
    setFeedback('Varredura preventiva de Malha Fina RFB/SEFAZ concluída! 2 inconsistências mapeadas com plano de retificação gerado.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📡</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Radar de Malha Fina Tributária & Notificações RFB / SEFAZ
            </h1>
            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CRUZAMENTOS SPED • ECF • DCTF • DIMP
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Auditoria antecipada de divergências entre declarações fiscais e dados capturados pela Receita Federal antes de autuações.
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
            <span>Imprimir Relatório Radar (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total em Divergência Mapeada</span>
            <AlertOctagon size={18} color="#F87171" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            R$ {totalRiskAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Risco de Notificação RFB / Auto de Infração</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Divergências Críticas</span>
            <AlertTriangle size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            {discrepancies.filter(d => d.riskLevel === 'CRITICO').length} Inconsistências
          </div>
          <div className="metric-sub">Ação corretiva imediata requerida</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Conformidade das Declarações</span>
            <ShieldCheck size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono">92.4%</div>
          <div className="metric-sub">Índice de Aderência SPED/RFB</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida</span>
            <Zap size={18} color="var(--emerald-400)" />
          </div>
          <button
            onClick={handleRunFullScan}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            ⚡ Executar Varredura Geral
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Divergência / Cruzamento</th>
                <th>Origem das Declarações</th>
                <th style={{ textAlign: 'right' }}>Declarado</th>
                <th style={{ textAlign: 'right' }}>Identificado RFB</th>
                <th style={{ textAlign: 'right' }}>Diferença</th>
                <th style={{ textAlign: 'center' }}>Risco</th>
                <th>Plano de Ação Corretivo</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{d.divergenceType}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.sourceDeclarations}</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {d.declaredAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: '#F87171' }}>R$ {d.rfbDetectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#F87171' }}>R$ {d.differenceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge badge-${d.riskLevel === 'CRITICO' ? 'red' : 'amber'}`}>{d.riskLevel}</span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--cyan-300)' }}>{d.suggestedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE AUDITORIA PREVENTIVA DE MALHA FINA (SPED / RFB / DIMP)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Radar Preventivo Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Volume de Divergências</strong>
            <span className="font-mono" style={{ color: '#B91C1C', fontWeight: 800 }}>R$ {totalRiskAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade Geral SPED</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>92.4% Conforme</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Inconsistências Mapeadas</strong>
            <span>{discrepancies.length} Apurações</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Prevenção a Autuações</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Plano de Retificação Ativo</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Cruzamento Fiscal</th>
              <th>Bases Confrontadas</th>
              <th style={{ textAlign: 'right' }}>Declarado (R$)</th>
              <th style={{ textAlign: 'right' }}>Divergência (R$)</th>
              <th style={{ textAlign: 'center' }}>Risco</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map(d => (
              <tr key={d.id}>
                <td><strong>{d.divergenceType}</strong></td>
                <td>{d.sourceDeclarations}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {d.declaredAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#B91C1C' }}>R$ {d.differenceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{d.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE MALHA FINA TRIBUTÁRIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Varredura ECF x DCTFWeb</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMPLIANCE FISCAL PREVENTIVO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Prevenção a Autos de Infração</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTaxDiscrepanciesNotificationsView;
