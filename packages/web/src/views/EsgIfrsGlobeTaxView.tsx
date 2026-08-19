// ==========================================================================
// SOBERANO CONTÁBIL — DEMONSTRAÇÕES DE SUSTENTABILIDADE ESG (IFRS S1 / IFRS S2)
// Emissões de Carbono (Escopos 1, 2 e 3), Provisões Ambientais CPC 25 & NBC T 15
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Globe2,
  TreePine,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Building2,
  Zap,
  TrendingDown
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const EsgIfrsGlobeTaxView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [exercicio, setExercicio] = useState<string>('Exercício 2026');

  // Emissões de Carbono tCO2e
  const [emissoesEscopo1, setEmissoesEscopo1] = useState<number>(340); // Frotas / Combustão
  const [emissoesEscopo2, setEmissoesEscopo2] = useState<number>(180); // Energia Elétrica
  const [emissoesEscopo3, setEmissoesEscopo3] = useState<number>(520); // Cadeia de Fornecedores

  // Investimentos ESG & Provisões Ambientais
  const [investimentoEnergiaSolar, setInvestimentoEnergiaSolar] = useState<number>(450000.00);
  const [creditosCarbonoAdquiridos, setCreditosCarbonoAdquiridos] = useState<number>(75000.00);
  const [provisaoPassivoAmbiental, setProvisaoPassivoAmbiental] = useState<number>(120000.00);

  const totalEmissoesTco2 = emissoesEscopo1 + emissoesEscopo2 + emissoesEscopo3;
  const intensidadeCarbono = (totalEmissoesTco2 / 12.8); // tCO2 por R$ milhão de receita

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Demonstrações de Sustentabilidade ESG (IFRS S1 / IFRS S2 & NBC T 15)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              IFRS S1 / S2 • ISSB • TAXONOMIA VERDE
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Métricas de governança climática, inventário de emissões de GEE (Escopos 1, 2 e 3) e provisões ambientais auditadas.
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
            <span>Imprimir Relatório ESG (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Inventário Total de Emissões</span>
            <Globe2 size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            {totalEmissoesTco2} tCO₂e
          </div>
          <div className="metric-sub">Escopo 1 + Escopo 2 + Escopo 3</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Investimento em Transição Verde</span>
            <TreePine size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {investimentoEnergiaSolar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Energia Solar & Eficiência Energética</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Passivos & Provisões Ambientais</span>
            <ShieldCheck size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            R$ {provisaoPassivoAmbiental.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Recuperação de Áreas Degradadas (CPC 25)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Score ESG / ISSB</span>
            <CheckCircle2 size={18} color="#fff" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)', fontSize: '1.1rem' }}>
            NÍVEL A+ EXCELÊNCIA
          </div>
          <div className="metric-sub">Taxonomia IFRS S1/S2 Atendida</div>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="no-print panel-card">
        <div style={{ padding: '12px 0 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros de Governança Climática & Sustentabilidade</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Emissões Escopo 1 (Frotas e Combustão Direta - tCO₂e)</label>
            <input
              type="number"
              className="form-control font-mono"
              value={emissoesEscopo1}
              onChange={e => setEmissoesEscopo1(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Emissões Escopo 2 (Consumo de Energia Elétrica - tCO₂e)</label>
            <input
              type="number"
              className="form-control font-mono"
              value={emissoesEscopo2}
              onChange={e => setEmissoesEscopo2(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Emissões Escopo 3 (Cadeia de Valor e Fornecedores - tCO₂e)</label>
            <input
              type="number"
              className="form-control font-mono"
              value={emissoesEscopo3}
              onChange={e => setEmissoesEscopo3(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Investimento em Projetos ESG & Energia Solar (R$)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={investimentoEnergiaSolar}
              onChange={e => setInvestimentoEnergiaSolar(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">RELATÓRIO DE SUSTENTABILIDADE ESG & GOVERNANÇA CLIMÁTICA (IFRS S1 / IFRS S2)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>EXERCÍCIO: <strong>{exercicio}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Padrão ISSB Global</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Inventário Total de GEE</strong>
            <span className="font-mono">{totalEmissoesTco2} tCO₂e</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Intensidade de Carbono</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>{intensidadeCarbono.toFixed(2)} tCO₂e / R$ Milhão</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Investimentos Verdes Realizados</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {investimentoEnergiaSolar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Classificação de Governança</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>Score A+ (Líder Setorial)</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Inventário de Gases de Efeito Estufa (Protocolo GHG / IFRS S2)</th>
              <th style={{ textAlign: 'right' }}>Emissões (tCO₂e)</th>
              <th style={{ textAlign: 'center' }}>% Part.</th>
              <th style={{ textAlign: 'center' }}>Meta de Neutralidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Escopo 1:</strong> Emissões Diretas (Frotas Próprias, Processos Industriais e Geradores)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>{emissoesEscopo1}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{((emissoesEscopo1 / totalEmissoesTco2) * 100).toFixed(1)}%</td>
              <td style={{ textAlign: 'center', color: '#047857' }}>Redução 30% até 2030</td>
            </tr>
            <tr>
              <td><strong>Escopo 2:</strong> Emissões Indiretas por Consumo de Energia da Rede Elétrica</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>{emissoesEscopo2}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{((emissoesEscopo2 / totalEmissoesTco2) * 100).toFixed(1)}%</td>
              <td style={{ textAlign: 'center', color: '#047857' }}>100% Energia Renovável</td>
            </tr>
            <tr>
              <td><strong>Escopo 3:</strong> Outras Emissões Indiretas na Cadeia de Valor e Logística Tercerizada</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>{emissoesEscopo3}</td>
              <td style={{ textAlign: 'center' }} className="font-mono">{((emissoesEscopo3 / totalEmissoesTco2) * 100).toFixed(1)}%</td>
              <td style={{ textAlign: 'center', color: '#047857' }}>Engajamento de Fornecedores</td>
            </tr>
            <tr className="diamond-table-total">
              <td>TOTAL DE EMISSÕES DE GASES DE EFEITO ESTUFA NO EXERCÍCIO</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>{totalEmissoesTco2} tCO₂e</td>
              <td style={{ textAlign: 'center', fontWeight: 800 }}>100,0%</td>
              <td style={{ textAlign: 'center', color: '#047857', fontWeight: 800 }}>Net Zero 2040</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE SUSTENTABILIDADE & ESG</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Padrão IFRS S1 / S2</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE ESG</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Asseguração Limitada / Razoável</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsgIfrsGlobeTaxView;
