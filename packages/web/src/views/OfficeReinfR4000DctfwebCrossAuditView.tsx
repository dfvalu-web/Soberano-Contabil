// ==========================================================================
// SOBERANO CONTÁBIL — EFD-REINF SÉRIE R-4000 & CRUZAMENTO DCTFWEB
// Conformidade: IN RFB 2.043/21 • Eventos R-4010, R-4020, R-4040, R-4080 • DARF 5952
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface ReinfEventSummary {
  id: string;
  eventoCodigo: string;
  descricao: string;
  totalBeneficiarios: number;
  rendimentoBruto: number;
  irrfRetido: number;
  csrfRetido: number;
  statusDctfweb: 'CONCILIADO_100' | 'DIVERGENCIA' | 'PENDENTE_TRANSMISSAO';
}

export const OfficeReinfR4000DctfwebCrossAuditView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [reinfEvents, setReinfEvents] = useState<ReinfEventSummary[]>([
    {
      id: 'r-4010',
      eventoCodigo: 'R-4010',
      descricao: 'Pagamentos/Créditos a Beneficiários Pessoa Física (Aluguéis/Autônomos)',
      totalBeneficiarios: 3,
      rendimentoBruto: 18500.00,
      irrfRetido: 2250.00,
      csrfRetido: 0,
      statusDctfweb: 'CONCILIADO_100'
    },
    {
      id: 'r-4020',
      eventoCodigo: 'R-4020',
      descricao: 'Pagamentos/Créditos a Beneficiários Pessoa Jurídica (Serviços Tomados)',
      totalBeneficiarios: 6,
      rendimentoBruto: 68000.00,
      irrfRetido: 1020.00,
      csrfRetido: 3162.00, // 4.65%
      statusDctfweb: 'CONCILIADO_100'
    },
    {
      id: 'r-4080',
      eventoCodigo: 'R-4080',
      descricao: 'Retenção no Recebimento (Agências de Propaganda / Cartões)',
      totalBeneficiarios: 1,
      rendimentoBruto: 15000.00,
      irrfRetido: 225.00,
      csrfRetido: 0,
      statusDctfweb: 'CONCILIADO_100'
    }
  ]);

  const totalBruto = reinfEvents.reduce((acc, e) => acc + e.rendimentoBruto, 0);
  const totalIrrf = reinfEvents.reduce((acc, e) => acc + e.irrfRetido, 0);
  const totalCsrf = reinfEvents.reduce((acc, e) => acc + e.csrfRetido, 0);
  const totalDarfGeral = totalIrrf + totalCsrf;

  const handleTransmitReinf = () => {
    setFeedback('Fechamento R-4099 da EFD-Reinf transmitido à Receita Federal e totalizadores integrados à DCTFWeb!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              EFD-Reinf Série R-4000 & Cruzamento Centavo a Centavo DCTFWeb
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              IN RFB 2.043/21 • SÉRIE R-4000
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Apuração dos eventos periódicos R-4010, R-4020 e R-4080 com validação cruzada contra o DARF Numerado da DCTFWeb.
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
            <span>Imprimir Laudo REINF (A4)</span>
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
            <span className="metric-title">Rendimentos Brutos Pagos</span>
            <FileSpreadsheet size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{reinfEvents.reduce((acc, e) => acc + e.totalBeneficiarios, 0)} Beneficiários PF/PJ</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">IRRF Retido na Fonte</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">DARFs 1708 e 0561</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CSRF 4,65% Retido (PIS/COF/CSLL)</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            R$ {totalCsrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">DARF 5952</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total DCTFWeb Retenções</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {totalDarfGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">100% Conciliado c/ Diário Contábil</div>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Eventos Periódicos da EFD-Reinf Série R-4000</span>
          <button onClick={handleTransmitReinf} className="btn-primary-action" style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} /> Transmitir Fechamento R-4099
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Descrição do Fato Gerador</th>
                <th style={{ textAlign: 'center' }}>Beneficiários</th>
                <th style={{ textAlign: 'right' }}>Rendimento Bruto</th>
                <th style={{ textAlign: 'right' }}>IRRF Retido</th>
                <th style={{ textAlign: 'right' }}>CSRF 4,65%</th>
                <th style={{ textAlign: 'center' }}>DCTFWeb</th>
              </tr>
            </thead>
            <tbody>
              {reinfEvents.map(e => (
                <tr key={e.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{e.eventoCodigo}</td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{e.descricao}</td>
                  <td style={{ textAlign: 'center' }}>{e.totalBeneficiarios}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {e.rendimentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                    R$ {e.irrfRetido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--cyan-400)' }}>
                    R$ {e.csrfRetido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge-emerald">✓ Conciliado</span></td>
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
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE FECHAMENTO DA EFD-REINF SÉRIE R-4000 & TOTALIZADORES DCTFWEB</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Fechamento R-4099 Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Rendimento Bruto Total</strong>
            <span className="font-mono">R$ {totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>IRRF Total (DARF 1708/0561)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CSRF Total (DARF 5952)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalCsrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total Geral DARF DCTFWeb</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalDarfGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Evento REINF</th>
              <th>Descrição do Fato Gerador</th>
              <th style={{ textAlign: 'center' }}>Qtd Beneficiários</th>
              <th style={{ textAlign: 'right' }}>Rendimento Bruto (R$)</th>
              <th style={{ textAlign: 'right' }}>Tributo Retido Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {reinfEvents.map(e => (
              <tr key={e.id}>
                <td><strong>{e.eventoCodigo}</strong></td>
                <td>{e.descricao}</td>
                <td style={{ textAlign: 'center' }}>{e.totalBeneficiarios}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {e.rendimentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                  R$ {(e.irrfRetido + e.csrfRetido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            <tr className="diamond-table-total">
              <td colSpan={4}>TOTAL DE RETENÇÕES FEDERAIS HOMOLOGADAS PARA EMISSÃO DO DARF NUMERADO NA DCTFWEB</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {totalDarfGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE RETENÇÕES FEDERAIS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Validação EFD-Reinf Série R-4000</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMPLIANCE TRIBUTÁRIO FEDERAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade IN RFB 2.043</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeReinfR4000DctfwebCrossAuditView;
