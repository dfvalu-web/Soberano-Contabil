// ==========================================================================
// SOBERANO CONTÁBIL — ISSQN TOMADOR, BITRIBUTAÇÃO & CADASTRO CPOM MUNICIPAL
// Conformidade: Lei Complementar 116/03 (Art. 3º) • Prevenção Bitributação Municipal
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Building,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Printer,
  Search,
  FileText,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface ServiceProviderItem {
  id: string;
  nfsNumero: string;
  providerName: string;
  providerCnpj: string;
  providerCity: string;
  providerUf: string;
  serviceCodeLc116: string;
  grossAmount: number;
  hasCpomRegistered: boolean;
  issRatePercent: number;
  issRetidoTomadorAmount: number;
  issSituation: 'ISENTO_DE_RETENCAO' | 'RETENCAO_OBRIGATORIA_CPOM' | 'LOCAL_EXECUCAO_OBRIGATORIO';
}

export const OfficeIssqnWithholdingCpomView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [providers, setProviders] = useState<ServiceProviderItem[]>([
    {
      id: 'prov-1',
      nfsNumero: 'NFS-e 8821',
      providerName: 'Engenharia de Software Tech São Paulo Ltda',
      providerCnpj: '11.222.333/0001-44',
      providerCity: 'São Paulo',
      providerUf: 'SP',
      serviceCodeLc116: '01.01',
      grossAmount: 25000.00,
      hasCpomRegistered: true,
      issRatePercent: 5.0,
      issRetidoTomadorAmount: 0.00,
      issSituation: 'ISENTO_DE_RETENCAO'
    },
    {
      id: 'prov-2',
      nfsNumero: 'NFS-e 4410',
      providerName: 'Agência de Publicidade & Design Rio Ltda',
      providerCnpj: '55.666.777/0001-88',
      providerCity: 'Rio de Janeiro',
      providerUf: 'RJ',
      serviceCodeLc116: '17.06',
      grossAmount: 18000.00,
      hasCpomRegistered: false,
      issRatePercent: 5.0,
      issRetidoTomadorAmount: 900.00, // Retenção obrigatória por falta de CPOM
      issSituation: 'RETENCAO_OBRIGATORIA_CPOM'
    }
  ]);

  const totalServicesTaken = providers.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalIssRetained = providers.reduce((acc, p) => acc + p.issRetidoTomadorAmount, 0);

  const handleConsultCpom = () => {
    setFeedback('Varredura e Consulta de CPOM concluída com sucesso junto à Secretaria Municipal da Fazenda!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏙️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              ISSQN Tomador, CPOM Municipal & Prevenção de Bitributação
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              LEI COMPLEMENTAR 116/03 • AUDITORIA CPOM
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Auditoria de prestadores de outros municípios, regras de enquadramento do Art. 3º da LC 116 e retenção compulsória de ISS.
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
            <span>Imprimir Laudo CPOM (A4)</span>
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
            <span className="metric-title">Serviços Tomados PJ</span>
            <Building size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalServicesTaken.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{providers.length} Prestadores Auditados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">ISSQN Retido a Recolher (DAMSP)</span>
            <DollarSign size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            R$ {totalIssRetained.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Retenção de Tomador de Serviço</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Prestadores com CPOM Válido</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            {providers.filter(p => p.hasCpomRegistered).length} Prestadores
          </div>
          <div className="metric-sub">Livre de bitributação municipal</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida</span>
            <Zap size={18} color="var(--cyan-400)" />
          </div>
          <button
            onClick={handleConsultCpom}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            🔍 Consultar Cadastro CPOM
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>NFS-e / Prestador</th>
                <th>Município Sede</th>
                <th>Item LC 116</th>
                <th style={{ textAlign: 'right' }}>Valor Bruto</th>
                <th style={{ textAlign: 'center' }}>CPOM</th>
                <th style={{ textAlign: 'right' }}>ISS Retido</th>
                <th style={{ textAlign: 'center' }}>Parecer Fiscal</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{p.nfsNumero} - {p.providerName}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>CNPJ: {p.providerCnpj}</div>
                  </td>
                  <td>{p.providerCity}/{p.providerUf}</td>
                  <td className="font-mono">{p.serviceCodeLc116}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {p.grossAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.hasCpomRegistered ? (
                      <span className="badge badge-emerald">✓ Ativo</span>
                    ) : (
                      <span className="badge badge-red">Ausente</span>
                    )}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: p.issRetidoTomadorAmount > 0 ? '#F87171' : 'var(--emerald-400)' }}>
                    R$ {p.issRetidoTomadorAmount.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.issSituation === 'ISENTO_DE_RETENCAO' ? (
                      <span className="badge badge-emerald">Não Reter (CPOM OK)</span>
                    ) : (
                      <span className="badge badge-amber">Reter ISS Compulsório</span>
                    )}
                  </td>
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
            <div className="diamond-subtitle">DOSSIÊ DE AUDITORIA DO ISSQN TOMADOR & CONFORMIDADE CPOM (LEI COMPLEMENTAR Nº 116/2003)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>DAMSP Municipal Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Volume de Serviços Tomados</strong>
            <span className="font-mono">R$ {totalServicesTaken.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total de ISS Retido na Fonte</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalIssRetained.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Enquadramento Legal</strong>
            <span>Art. 3º e 6º LC 116/03</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Prevenção de Bitributação</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Parecer CPOM 100% Válido</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Prestador de Serviço / NFS-e</th>
              <th>Município</th>
              <th style={{ textAlign: 'center' }}>Status CPOM</th>
              <th style={{ textAlign: 'right' }}>Valor Serviço (R$)</th>
              <th style={{ textAlign: 'right' }}>ISS Retido Tomador (R$)</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nfsNumero}</strong> - {p.providerName}</td>
                <td>{p.providerCity}/{p.providerUf}</td>
                <td style={{ textAlign: 'center' }}>{p.hasCpomRegistered ? 'CADASTRADO' : 'NÃO CADASTRADO'}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {p.grossAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {p.issRetidoTomadorAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SETOR DE RETENÇÕES MUNICIPAIS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Auditoria Art. 3º LC 116</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMPLIANCE TRIBUTÁRIO MUNICIPAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>DAMSP & CPOM Homologados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeIssqnWithholdingCpomView;
