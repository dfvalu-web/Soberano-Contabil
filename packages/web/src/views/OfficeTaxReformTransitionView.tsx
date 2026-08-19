// ==========================================================================
// SOBERANO CONTÁBIL — SIMULADOR DA REFORMA TRIBUTÁRIA (EC 132/23 - IBS & CBS)
// Conformidade: Período de Transição 2026-2033 • Alíquota-Teste 0,9% CBS + 0,1% IBS
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Scale,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  FileSpreadsheet,
  Building2,
  ArrowRight
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeTaxReformTransitionView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [faturamentoMensal, setFaturamentoMensal] = useState<number>(100000.00);
  const [comprasInsumos, setComprasInsumos] = useState<number>(40000.00);
  const [estimativaIvaFinal, setEstimativaIvaFinal] = useState<number>(26.5); // Estimativa padrão 26.5% IVA Dual

  // Cenário Atual (Lucro Presumido/Real médio: PIS 1.65%, COFINS 7.6%, ICMS 18%, ISS 5%)
  const cargaAtualPisCofins = faturamentoMensal * 0.0925; // 9.25%
  const cargaAtualIcms = faturamentoMensal * 0.18; // 18%
  const creditosInsumosAtual = comprasInsumos * (0.0925 + 0.18);
  const cargaAtualLiquida = (cargaAtualPisCofins + cargaAtualIcms) - creditosInsumosAtual;

  // Cenário 2026 (Transição: 0.9% CBS + 0.1% IBS = 1.0% de alíquota teste com abatimento)
  const cbsTeste2026 = faturamentoMensal * 0.009; // 0.9%
  const ibsTeste2026 = faturamentoMensal * 0.001; // 0.1%
  const totalTeste2026 = cbsTeste2026 + ibsTeste2026;

  // Cenário Definitivo 2033 (IVA Dual Pleno com Crédito Financeiro Integral)
  const debitoIvaDual = faturamentoMensal * (estimativaIvaFinal / 100);
  const creditoIvaDual = comprasInsumos * (estimativaIvaFinal / 100);
  const cargaDefinitivaIva = debitoIvaDual - creditoIvaDual;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Simulador da Reforma Tributária (EC 132/23) — Transição 2026 e IVA Dual
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CBS FEDERAL • IBS ESTADUAL/MUNICIPAL
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Impacto da substituição de PIS, COFINS, IPI, ICMS e ISS pelo IVA Dual com não-cumulatividade plena sobre todas as aquisições.
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
            <span>Imprimir Laudo Reforma (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fase de Transição 2026 (1,0%)</span>
            <Scale size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalTeste2026.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">0,9% CBS (R$ {cbsTeste2026.toFixed(2)}) + 0,1% IBS (R$ {ibsTeste2026.toFixed(2)})</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Carga Atual Líquida</span>
            <TrendingUp size={18} color="#F87171" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            R$ {cargaAtualLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">PIS/COFINS + ICMS cumulativos/parciais</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Cenário IVA Dual ({estimativaIvaFinal}%)</span>
            <Percent size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {cargaDefinitivaIva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Crédito financeiro integral de R$ {creditoIvaDual.toFixed(2)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Variação Projetada</span>
            <Scale size={18} color={cargaDefinitivaIva < cargaAtualLiquida ? 'var(--emerald-400)' : '#F87171'} />
          </div>
          <div className="metric-value font-mono" style={{ color: cargaDefinitivaIva < cargaAtualLiquida ? 'var(--emerald-400)' : '#F87171' }}>
            {cargaDefinitivaIva < cargaAtualLiquida ? 'Economia Fiscal' : 'Aumento de Carga'}
          </div>
          <div className="metric-sub">Diferença: R$ {Math.abs(cargaDefinitivaIva - cargaAtualLiquida).toFixed(2)}/mês</div>
        </div>
      </div>

      {/* Simulator Form */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>Faturamento Bruto Mensal (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={faturamentoMensal} onChange={e => setFaturamentoMensal(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Compras & Insumos Tributados (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={comprasInsumos} onChange={e => setComprasInsumos(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Alíquota Estimada IVA Dual CBS/IBS (%)</label>
            <input type="number" step="0.1" className="form-control font-mono" value={estimativaIvaFinal} onChange={e => setEstimativaIvaFinal(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE IMPACTO DA REFORMA TRIBUTÁRIA (EMENDA CONSTITUCIONAL Nº 132/2023)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Transição 2026-2033 Homologada</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Faturamento Base Projetado</strong>
            <span className="font-mono">R$ {faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Alíquota-Teste 2026 (CBS+IBS)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>1,0% (R$ {totalTeste2026.toFixed(2)})</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Créditos Insumos IVA Dual</strong>
            <span className="font-mono">R$ {creditoIvaDual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Carga Final IVA Estimada</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {cargaDefinitivaIva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Fase de Implantação da Reforma</th>
              <th>Tributos Substituídos / Criados</th>
              <th style={{ textAlign: 'center' }}>Alíquota Efetiva</th>
              <th style={{ textAlign: 'right' }}>Valor Mensal (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ano 2026:</strong> Teste Operacional Nacional</td>
              <td>0,9% CBS (Federal) + 0,1% IBS (Estados/Municípios)</td>
              <td style={{ textAlign: 'center' }}>1,0%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {totalTeste2026.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Ano 2027:</strong> Extinção Total PIS/COFINS</td>
              <td>CBS Plena Federal + Alíquota Teste IBS</td>
              <td style={{ textAlign: 'center' }}>8,8%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(faturamentoMensal * 0.088).toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Ano 2029 a 2032:</strong> Transição Gradual ICMS/ISS</td>
              <td>Redução de 1/10 a cada ano do ICMS/ISS e aumento do IBS</td>
              <td style={{ textAlign: 'center' }}>Misto</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>Proporcional</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>ESTIMATIVA FINAL DA CARGA TRIBUTÁRIA LÍQUIDA NO REGIME IVA DUAL PLENO (2033)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {cargaDefinitivaIva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA TRIBUTÁRIA & PLANEJAMENTO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Modelagem Financeira EC 132</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE DE REFORMA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade CBS / IBS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTaxReformTransitionView;
