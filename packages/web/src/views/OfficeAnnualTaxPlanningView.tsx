// ==========================================================================
// SOBERANO CONTÁBIL — PLANEJAMENTO TRIBUTÁRIO ANUAL & MATRIZ DE DECISÃO
// Conformidade: Elisão Fiscal Estrita • Simples vs Presumido vs Real • Fator R
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  FileSpreadsheet,
  Building2,
  Scale
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeAnnualTaxPlanningView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [faturamentoAnual, setFaturamentoAnual] = useState<number>(1800000.00); // 1.8M/ano
  const [folhaAnual, setFolhaAnual] = useState<number>(450000.00); // Fator R = 25%
  const [comprasDespesasAnual, setComprasDespesasAnual] = useState<number>(600000.00);

  // 1. Simulação Simples Nacional (Anexo III vs V)
  const fatorR = folhaAnual / faturamentoAnual;
  const aliquotaEfetivaSimples = fatorR >= 0.28 ? 0.113 : 0.165; // Anexo III vs V
  const impostoAnualSimples = faturamentoAnual * aliquotaEfetivaSimples;

  // 2. Simulação Lucro Presumido (IRPJ 15%+10%, CSLL 9%, PIS 0.65%, COFINS 3%, ISS 5% / ICMS 18%)
  const basePresumidaIr = faturamentoAnual * 0.32; // Serviços 32%
  const irpjPresumido = (basePresumidaIr * 0.15) + Math.max(0, (basePresumidaIr - 240000) * 0.10);
  const csllPresumido = basePresumidaIr * 0.09;
  const pisCofinsPresumido = faturamentoAnual * 0.0365; // 3.65% cumulativo
  const issIcmsPresumido = faturamentoAnual * 0.05; // 5% ISS
  const inssPatronalPresumido = folhaAnual * 0.278; // 27.8%
  const impostoAnualPresumido = irpjPresumido + csllPresumido + pisCofinsPresumido + issIcmsPresumido + inssPatronalPresumido;

  // 3. Simulação Lucro Real
  const lucroReal = Math.max(0, faturamentoAnual - folhaAnual - comprasDespesasAnual);
  const irpjReal = (lucroReal * 0.15) + Math.max(0, (lucroReal - 240000) * 0.10);
  const csllReal = lucroReal * 0.09;
  const pisCofinsReal = Math.max(0, (faturamentoAnual - comprasDespesasAnual) * 0.0925);
  const inssPatronalReal = folhaAnual * 0.278;
  const impostoAnualReal = irpjReal + csllReal + pisCofinsReal + inssPatronalReal + (faturamentoAnual * 0.05);

  const bestRegime = impostoAnualSimples < impostoAnualPresumido && impostoAnualSimples < impostoAnualReal
    ? 'SIMPLES_NACIONAL'
    : impostoAnualPresumido < impostoAnualReal ? 'LUCRO_PRESUMIDO' : 'LUCRO_REAL';

  const lowestTax = Math.min(impostoAnualSimples, impostoAnualPresumido, impostoAnualReal);
  const maxTax = Math.max(impostoAnualSimples, impostoAnualPresumido, impostoAnualReal);
  const annualSavings = maxTax - lowestTax;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Planejamento Tributário Anual & Matriz Decisória de Enquadramento
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              ELISÃO FISCAL • SIMPLES vs PRESUMIDO vs REAL
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Estudo comparativo anual para escolha do melhor regime tributário com simulação do Fator R e economia fiscal projetada.
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
            <span>Imprimir Laudo de Planejamento (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Regime Tributário Recomendado</span>
            <Award size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--emerald-400)', fontSize: '1.2rem', fontWeight: 800 }}>
            {bestRegime.replace('_', ' ')}
          </div>
          <div className="metric-sub">Maior eficiência tributária e caixa livre</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Economia Anual Projetada</span>
            <TrendingUp size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Diferença contra o regime mais oneroso</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fator R Atual (Folha / Receita)</span>
            <Percent size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono">{(fatorR * 100).toFixed(1)}%</div>
          <div className="metric-sub">{fatorR >= 0.28 ? 'Apto Anexo III (Redução)' : 'Enquadrado Anexo V (Oneroso)'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Custo Tributário Mínimo</span>
            <Scale size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {lowestTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano
          </div>
          <div className="metric-sub">Carga efetiva: {((lowestTax / faturamentoAnual) * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>Faturamento Anual Projetado (R$)</label>
            <input type="number" step="1000" className="form-control font-mono" value={faturamentoAnual} onChange={e => setFaturamentoAnual(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Folha de Pagamento + Encargos Anual (R$)</label>
            <input type="number" step="1000" className="form-control font-mono" value={folhaAnual} onChange={e => setFolhaAnual(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Despesas Operacionais / Insumos Anual (R$)</label>
            <input type="number" step="1000" className="form-control font-mono" value={comprasDespesasAnual} onChange={e => setComprasDespesasAnual(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">PARECER TÉCNICO DE PLANEJAMENTO TRIBUTÁRIO & MATRIZ DE ELISÃO FISCAL ANUAL</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>EXERCÍCIO PROJETADO: <strong>2027</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Recomendação: {bestRegime.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Faturamento Base Projetado</strong>
            <span className="font-mono">R$ {faturamentoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Economia Tributária Anual</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Regime Mais Econômico</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>{bestRegime.replace('_', ' ')}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade Regulatória</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Elisão Fiscal Estrita Lei 9.430</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Regime Tributário</th>
              <th>Tributos Inclusos / Alíquota Efetiva</th>
              <th style={{ textAlign: 'right' }}>Impostos Anuais (R$)</th>
              <th style={{ textAlign: 'center' }}>Veredito Técnico</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: bestRegime === 'SIMPLES_NACIONAL' ? '#ECFDF5' : 'transparent' }}>
              <td><strong>SIMPLES NACIONAL</strong> (LC 123/06)</td>
              <td>Guia Única DAS (IRPJ/CSLL/PIS/COF/ISS/CPP) • Alíquota: {(aliquotaEfetivaSimples * 100).toFixed(1)}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {impostoAnualSimples.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700, color: bestRegime === 'SIMPLES_NACIONAL' ? '#047857' : '#64748B' }}>
                {bestRegime === 'SIMPLES_NACIONAL' ? '★ ALTAMENTE RECOMENDADO' : 'Opção Disponível'}
              </td>
            </tr>
            <tr style={{ background: bestRegime === 'LUCRO_PRESUMIDO' ? '#ECFDF5' : 'transparent' }}>
              <td><strong>LUCRO PRESUMIDO</strong> (Lei 9.430/96)</td>
              <td>Presunção 32% + PIS/COF 3,65% + CPP 27,8% • Alíquota: {((impostoAnualPresumido / faturamentoAnual) * 100).toFixed(1)}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {impostoAnualPresumido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700, color: bestRegime === 'LUCRO_PRESUMIDO' ? '#047857' : '#64748B' }}>
                {bestRegime === 'LUCRO_PRESUMIDO' ? '★ ALTAMENTE RECOMENDADO' : 'Opção Disponível'}
              </td>
            </tr>
            <tr style={{ background: bestRegime === 'LUCRO_REAL' ? '#ECFDF5' : 'transparent' }}>
              <td><strong>LUCRO REAL</strong> (RIR/18)</td>
              <td>Apuração Contábil Efetiva • Alíquota: {((impostoAnualReal / faturamentoAnual) * 100).toFixed(1)}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {impostoAnualReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700, color: bestRegime === 'LUCRO_REAL' ? '#047857' : '#64748B' }}>
                {bestRegime === 'LUCRO_REAL' ? '★ ALTAMENTE RECOMENDADO' : 'Opção Disponível'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONSULTORIA DE ELISÃO TRIBUTÁRIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Estudo de Viabilidade Econômica</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA / CLIENTE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Opção de Regime Homologada</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeAnnualTaxPlanningView;
