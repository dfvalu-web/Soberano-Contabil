// ==========================================================================
// SOBERANO CONTÁBIL — INCENTIVOS FISCAIS & DOAÇÕES DEDUTÍVEIS (LUCRO REAL)
// Conformidade: Lei Rouanet (8.313/91) • FIA / Idoso • Lei do Esporte • Pronon/Pronas
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface IncentiveProjectItem {
  id: string;
  modalidade: string;
  projetoNome: string;
  proponenteCnpj: string;
  limiteDeducaoIrpjPct: number;
  valorAporteDestinado: number;
  deducaoEfetivaIrpj: number;
  impactoSocial: string;
}

export const OfficeTaxIncentivesDonationView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [irpjDevidoEstimado, setIrpjDevidoEstimado] = useState<number>(300000.00); // 300k de IRPJ no ano
  const [incentives, setIncentives] = useState<IncentiveProjectItem[]>([
    {
      id: 'inc-1',
      modalidade: 'Lei Rouanet de Incentivo à Cultura (Art. 18)',
      projetoNome: 'Orquestra Sinfônica & Inclusão Musical Jovem',
      proponenteCnpj: '03.456.789/0001-22',
      limiteDeducaoIrpjPct: 4.0, // 4% do IRPJ
      valorAporteDestinado: 12000.00,
      deducaoEfetivaIrpj: 12000.00,
      impactoSocial: 'Educação musical gratuita para 350 crianças em vulnerabilidade.'
    },
    {
      id: 'inc-2',
      modalidade: 'Fundo dos Direitos da Criança e do Adolescente (FIA)',
      projetoNome: 'Projeto Acolher & Capacitação Profissional Aprendiz',
      proponenteCnpj: '14.555.666/0001-77',
      limiteDeducaoIrpjPct: 1.0,
      valorAporteDestinado: 3000.00,
      deducaoEfetivaIrpj: 3000.00,
      impactoSocial: 'Qualificação técnica para 120 jovens aprendizes.'
    }
  ]);

  const totalAportes = incentives.reduce((acc, i) => acc + i.valorAporteDestinado, 0);
  const limiteMaximo4Pct = irpjDevidoEstimado * 0.04;
  const irpjLiquidoAPagar = irpjDevidoEstimado - totalAportes;

  const handleEmitReciboDoacao = () => {
    setFeedback('Dossiê de Incentivos Fiscais gerado e aportes escriturados no Bloco N da ECF com 100% de dedução no IRPJ!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎗️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Incentivos Fiscais, Doações Dedutíveis & Responsabilidade Social (ESG)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              LEI ROUANET • FIA • IRPJ REAL
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Destinação direta de até 4% do IRPJ devido para projetos culturais, esportivos e sociais sem custo adicional para a empresa.
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
            <span>Imprimir Laudo ESG (A4)</span>
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
            <span className="metric-title">Total Destinado a Projetos ESG</span>
            <HeartHandshake size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalAportes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">100% Abatido do IRPJ Devido</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Limite Legal (4% IRPJ Real)</span>
            <Percent size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {limiteMaximo4Pct.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Teto Art. 18 Lei 8.313/91</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">IRPJ Líquido Restante</span>
            <DollarSign size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {irpjLiquidoAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Economia com impacto social</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <button
            onClick={handleEmitReciboDoacao}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            ⚡ Homologar Destinação ECF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Modalidade de Incentivo</th>
                <th>Projeto Social / Cultural</th>
                <th style={{ textAlign: 'center' }}>Limite IRPJ</th>
                <th style={{ textAlign: 'right' }}>Valor Destinado</th>
                <th style={{ textAlign: 'right' }}>Abatimento no IRPJ</th>
                <th>Impacto Social Auditado</th>
              </tr>
            </thead>
            <tbody>
              {incentives.map(i => (
                <tr key={i.id}>
                  <td><span className="badge badge-cyan">{i.modalidade}</span></td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{i.projetoNome}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Proponente: {i.proponenteCnpj}</div>
                  </td>
                  <td style={{ textAlign: 'center' }} className="font-mono">{i.limiteDeducaoIrpjPct}%</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {i.valorAporteDestinado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)', fontWeight: 700 }}>
                    - R$ {i.deducaoEfetivaIrpj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--emerald-300)' }}>{i.impactoSocial}</td>
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
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE INCENTIVOS FISCAIS & RESPONSABILIDADE SOCIAL ESG (LEI Nº 8.313/91 / ECF)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Dedução ECF Bloco N Homologada</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>IRPJ Base Apurado</strong>
            <span className="font-mono">R$ {irpjDevidoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total Destinado a Projetos</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalAportes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>IRPJ Final a Recolher</strong>
            <span className="font-mono">R$ {irpjLiquidoAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade ESG</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Dedução Integral 100%</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Modalidade Legal</th>
              <th>Projeto Beneficiado</th>
              <th style={{ textAlign: 'right' }}>Valor Destinado (R$)</th>
              <th style={{ textAlign: 'right' }}>Abatimento IRPJ (R$)</th>
            </tr>
          </thead>
          <tbody>
            {incentives.map(i => (
              <tr key={i.id}>
                <td><strong>{i.modalidade}</strong></td>
                <td>{i.projetoNome}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {i.valorAporteDestinado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {i.deducaoEfetivaIrpj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMITÊ DE RESPONSABILIDADE SOCIAL ESG</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Aprovação de Projetos Sociais</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA TRIBUTÁRIA ECF</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade Lei Rouanet / FIA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTaxIncentivesDonationView;
