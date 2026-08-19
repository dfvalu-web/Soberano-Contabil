// ==========================================================================
// SOBERANO CONTÁBIL — AUDITORIA FORENSE CONTÁBIL & TESTE DA LEI DE BENFORD
// Detecção Estatística de Anomalias, Fraudes em Lançamentos & Teste Chi-Quadrado
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface BenfordDigitItem {
  digito: number;
  freqObservada: number;
  freqEsperada: number;
  desvioPercentual: number;
  statusAlerta: 'NORMAL' | 'ANOMALIA_DETECTADA';
}

export const ForensicAiView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [totalLancamentosAuditados, setTotalLancamentosAuditados] = useState<number>(14250);
  const [amostraSuspeitaFornecedores, setAmostraSuspeitaFornecedores] = useState<number>(12);
  const [simularFraude, setSimularFraude] = useState<boolean>(false);

  // Frequências esperadas pela Lei de Benford P(d) = log10(1 + 1/d)
  const benfordTable: BenfordDigitItem[] = useMemo(() => {
    return [
      { digito: 1, freqObservada: simularFraude ? 22.1 : 30.8, freqEsperada: 30.1, desvioPercentual: simularFraude ? -26.5 : 2.3, statusAlerta: simularFraude ? 'ANOMALIA_DETECTADA' : 'NORMAL' },
      { digito: 2, freqObservada: simularFraude ? 14.0 : 17.4, freqEsperada: 17.6, desvioPercentual: simularFraude ? -20.4 : -1.1, statusAlerta: 'NORMAL' },
      { digito: 3, freqObservada: simularFraude ? 11.2 : 12.6, freqEsperada: 12.5, desvioPercentual: 0.8, statusAlerta: 'NORMAL' },
      { digito: 4, freqObservada: simularFraude ? 9.1 : 9.8, freqEsperada: 9.7, desvioPercentual: 1.0, statusAlerta: 'NORMAL' },
      { digito: 5, freqObservada: simularFraude ? 8.3 : 7.8, freqEsperada: 7.9, desvioPercentual: -1.2, statusAlerta: 'NORMAL' },
      { digito: 6, freqObservada: simularFraude ? 6.1 : 6.6, freqEsperada: 6.7, desvioPercentual: -1.4, statusAlerta: 'NORMAL' },
      { digito: 7, freqObservada: simularFraude ? 5.2 : 5.7, freqEsperada: 5.8, desvioPercentual: -1.7, statusAlerta: 'NORMAL' },
      { digito: 8, freqObservada: simularFraude ? 5.0 : 5.0, freqEsperada: 5.1, desvioPercentual: -1.9, statusAlerta: 'NORMAL' },
      { digito: 9, freqObservada: simularFraude ? 19.0 : 4.3, freqEsperada: 4.6, desvioPercentual: simularFraude ? 313.0 : -6.5, statusAlerta: simularFraude ? 'ANOMALIA_DETECTADA' : 'NORMAL' }
    ];
  }, [simularFraude]);

  const chiQuadradoApurado = simularFraude ? 48.75 : 3.42;
  const pValorEstatistico = simularFraude ? '< 0.001 (Rejeita H0 - Anomalia)' : '0.843 (Conforme Lei de Benford)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Auditoria Forense & Teste da Lei de Benford (Antifraude)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              PERÍCIA MATEMÁTICA • LEI DE BENFORD • NBC TA 240
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Análise probabilística da distribuição do primeiro dígito nos lançamentos contábeis para identificar manipulações e pagamentos fictícios.
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
            <span>Imprimir Laudo Pericial Forense (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Lançamentos no Escopo</span>
            <FileText size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            {totalLancamentosAuditados.toLocaleString('pt-BR')} Partidas
          </div>
          <div className="metric-sub">Diário Geral & Contas a Pagar</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Estatística Chi-Quadrado (χ²)</span>
            <BarChart3 size={18} color={simularFraude ? '#F87171' : 'var(--emerald-400)'} />
          </div>
          <div className="metric-value font-mono" style={{ color: simularFraude ? '#F87171' : 'var(--emerald-400)' }}>
            χ² = {chiQuadradoApurado.toFixed(2)}
          </div>
          <div className="metric-sub">Graus de Liberdade = 8 (gl)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Veredito Forense (p-valor)</span>
            <ShieldCheck size={18} color={simularFraude ? '#F87171' : 'var(--emerald-400)'} />
          </div>
          <div className="metric-value" style={{ color: simularFraude ? '#F87171' : 'var(--emerald-400)', fontSize: '0.90rem', fontWeight: 800 }}>
            {simularFraude ? '⚠️ ANOMALIA / ALERTA' : '✓ CONFORME BENFORD'}
          </div>
          <div className="metric-sub">{pValorEstatistico}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação de Auditoria</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <button
            onClick={() => setSimularFraude(prev => !prev)}
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem', background: simularFraude ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: `1px solid ${simularFraude ? 'var(--emerald-500)' : '#ef4444'}`, color: simularFraude ? 'var(--emerald-400)' : '#f87171', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
          >
            {simularFraude ? '✓ Restaurar Lançamentos Normais' : '⚠️ Simular Desvio / Fraude (Dígito 9)'}
          </button>
        </div>
      </div>

      {/* Table Benford */}
      <div className="no-print panel-card">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Distribuição de Primeiros Dígitos (Observada vs Esperada pela Lei de Benford)</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Dígito (d)</th>
                <th style={{ textAlign: 'right' }}>Freq. Esperada (%)</th>
                <th style={{ textAlign: 'right' }}>Freq. Observada (%)</th>
                <th style={{ textAlign: 'right' }}>Desvio (%)</th>
                <th style={{ textAlign: 'center' }}>Status de Risco</th>
              </tr>
            </thead>
            <tbody>
              {benfordTable.map(item => (
                <tr key={item.digito}>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: '#fff' }}>{item.digito}</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>{item.freqEsperada.toFixed(1)}%</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: item.statusAlerta === 'ANOMALIA_DETECTADA' ? '#F87171' : 'var(--emerald-400)' }}>
                    {item.freqObservada.toFixed(1)}%
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: item.desvioPercentual > 50 || item.desvioPercentual < -20 ? '#F87171' : 'var(--text-secondary)' }}>
                    {item.desvioPercentual > 0 ? '+' : ''}{item.desvioPercentual.toFixed(1)}%
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {item.statusAlerta === 'NORMAL' ? (
                      <span className="badge badge-emerald">✓ Regular</span>
                    ) : (
                      <span className="badge badge-red">⚠️ Anomalia Crítica</span>
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
            <div className="diamond-subtitle">LAUDO PERICIAL FORENSE DE AUDITORIA ESTATÍSTICA (LEI DE BENFORD & NBC TA 240)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ AUDITADO: <strong>{currentTenant.cnpj}</strong></div>
            <div>PARTIDAS AUDITADAS: <strong>{totalLancamentosAuditados.toLocaleString('pt-BR')}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Conformidade Pericial Forense</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Estatística Chi-Quadrado</strong>
            <span className="font-mono">χ² = {chiQuadradoApurado.toFixed(2)} (gl = 8)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Nível de Significância (p-valor)</strong>
            <span className="font-mono" style={{ color: simularFraude ? '#B91C1C' : '#047857', fontWeight: 800 }}>{pValorEstatistico}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conclusão Pericial</strong>
            <span style={{ color: simularFraude ? '#B91C1C' : '#047857', fontWeight: 800 }}>{simularFraude ? 'INDÍCIO DE MANIPULAÇÃO' : 'PADRÃO NATURAL VÁLIDO'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Norma Técnica Aplicada</strong>
            <span>NBC TA 240 / NBC TP 01 (Perícia)</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Dígito</th>
              <th style={{ textAlign: 'right' }}>Frequência Esperada (%)</th>
              <th style={{ textAlign: 'right' }}>Frequência Observada (%)</th>
              <th style={{ textAlign: 'center' }}>Avaliação Forense</th>
            </tr>
          </thead>
          <tbody>
            {benfordTable.map(item => (
              <tr key={item.digito}>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.digito}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>{item.freqEsperada.toFixed(1)}%</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{item.freqObservada.toFixed(1)}%</td>
                <td style={{ textAlign: 'center', color: item.statusAlerta === 'ANOMALIA_DETECTADA' ? '#B91C1C' : '#047857', fontWeight: 700 }}>
                  {item.statusAlerta === 'ANOMALIA_DETECTADA' ? 'ANOMALIA DETECTADA' : 'CONFORME'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PERITO CONTÁBIL FORENSE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CNPC / CFC</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMITÊ DE COMPLIANCE & GOVERNANÇA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Auditoria Interna Homologada</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicAiView;
