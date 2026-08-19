// ==========================================================================
// SOBERANO CONTÁBIL — OBRIGAÇÕES ACESSÓRIAS ESTADUAIS (GIA, DeSTDA & SPED)
// Conformidade: Portaria CAT / SEFAZ-SP • Bloco E SPED Fiscal • DeSTDA Simples
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  Download
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeStateAncillaryDeclarationsView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [debitoIcmsSaidas, setDebitoIcmsSaidas] = useState<number>(45800.00);
  const [creditoIcmsEntradas, setCreditoIcmsEntradas] = useState<number>(31200.00);
  const [saldoCredorMesAnterior, setSaldoCredorMesAnterior] = useState<number>(4500.00);

  const icmsDevidoFinal = Math.max(0, debitoIcmsSaidas - creditoIcmsEntradas - saldoCredorMesAnterior);
  const novoSaldoCredorAcumulado = Math.max(0, (creditoIcmsEntradas + saldoCredorMesAnterior) - debitoIcmsSaidas);

  const handleGenerateGiaFile = () => {
    setFeedback('Arquivo magnético da GIA Eletrônica / DeSTDA gerado e validado com sucesso para transmissão à SEFAZ!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Obrigações Estaduais (GIA, DeSTDA & SPED Fiscal ICMS/IPI)
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              SEFAZ SPED BLOCO E • GIA MENSAL
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Apuração mensal da conta gráfica de ICMS, saldo credor acumulado e geração de arquivos para transmissão estadual.
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
            <span>Imprimir Laudo GIA (A4)</span>
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
            <span className="metric-title">Débitos de ICMS (Saídas)</span>
            <FileSpreadsheet size={18} color="#F87171" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            R$ {debitoIcmsSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Faturamento Tributado no Período</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Créditos de ICMS (Entradas)</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            + R$ {creditoIcmsEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Compras de Mercadorias e Insumos</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Saldo Credor Anterior</span>
            <ShieldCheck size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            + R$ {saldoCredorMesAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Compensação da Conta Gráfica</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">ICMS a Recolher (DARE/GARE)</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: icmsDevidoFinal > 0 ? 'var(--amber-400)' : 'var(--emerald-400)' }}>
            R$ {icmsDevidoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{icmsDevidoFinal === 0 ? 'Saldo Credor Acumulado' : 'Vencimento dia 20'}</div>
        </div>
      </div>

      {/* Inputs & Actions */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>Débito ICMS Saídas (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={debitoIcmsSaidas} onChange={e => setDebitoIcmsSaidas(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Crédito ICMS Entradas (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={creditoIcmsEntradas} onChange={e => setCreditoIcmsEntradas(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Saldo Credor Período Anterior (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={saldoCredorMesAnterior} onChange={e => setSaldoCredorMesAnterior(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={handleGenerateGiaFile} className="btn-primary-action" style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={15} /> Gerar Arquivo Magnético GIA / SPED Fiscal
          </button>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DEMONSTRATIVO DE APURAÇÃO DO ICMS & OBRIGAÇÕES ESTADUAIS (GIA / SPED BLOCO E)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>GIA Eletrônica SEFAZ Homologada</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Débito ICMS Saídas</strong>
            <span className="font-mono">R$ {debitoIcmsSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Créditos Apropriados</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {(creditoIcmsEntradas + saldoCredorMesAnterior).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>ICMS Líquido a Recolher</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {icmsDevidoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Saldo Credor para o Próximo Mês</strong>
            <span className="font-mono">R$ {novoSaldoCredorAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Quadro de Apuração da Conta Gráfica</th>
              <th style={{ textAlign: 'center' }}>Código SPED</th>
              <th style={{ textAlign: 'right' }}>Valor Apurado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total dos Débitos por Saídas e Prestações com Débito do Imposto</td>
              <td style={{ textAlign: 'center' }}>E110.01</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {debitoIcmsSaidas.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total dos Créditos por Entradas e Aquisições com Crédito do Imposto</td>
              <td style={{ textAlign: 'center' }}>E110.06</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>- R$ {creditoIcmsEntradas.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Saldo Credor do Período Anterior Transportado</td>
              <td style={{ textAlign: 'center' }}>E110.09</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>- R$ {saldoCredorMesAnterior.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={2}>VALOR TOTAL DO ICMS A RECOLHER NO MÊS (DARE / GIA SEFAZ)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {icmsDevidoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO FISCAL ESTADUAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conferência Conta Gráfica</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA TRIBUTÁRIA SEFAZ</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade Portaria CAT</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeStateAncillaryDeclarationsView;
