// ==========================================================================
// SOBERANO CONTÁBIL — ADOÇÃO INICIAL DAS NORMAS INTERNACIONAIS (IFRS 1 / CPC 37)
// Transição Contábil, Custo Atribuído (Deemed Cost) e Ajuste a Valor Presente (AVP)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  TrendingUp,
  CheckCircle2,
  Printer,
  Building2,
  Scale,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const FirstTimeIfrsReiqTaxView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [dataTransicao, setDataTransicao] = useState<string>('01/01/2026');

  // Ajustes de Transição
  const [valorHistoricoImobilizado, setValorHistoricoImobilizado] = useState<number>(2400000.00);
  const [custoAtribuidoLaudoDeemedCost, setCustoAtribuidoLaudoDeemedCost] = useState<number>(3800000.00);
  const [ajusteValorPresenteAvp, setAjusteValorPresenteAvp] = useState<number>(140000.00);
  const [efeitoTributarioDiferidoIrpjCsll, setEfeitoTributarioDiferidoIrpjCsll] = useState<number>(476000.00); // 34% sobre o ganho de deemed cost

  const ganhoDeemedCostBruto = custoAtribuidoLaudoDeemedCost - valorHistoricoImobilizado;
  const ganhoLiquidoPatrimonioLiquido = ganhoDeemedCostBruto - efeitoTributarioDiferidoIrpjCsll - ajusteValorPresenteAvp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Adoção Inicial das Normas IFRS (CPC 37 / IFRS 1) & Deemed Cost
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CPC 37 • CPC 27 • CUSTO ATRIBUÍDO • AVP
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Balanço de abertura da transição IFRS, avaliação de custo atribuído de imobilizado e conciliação do Patrimônio Líquido.
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
            <span>Imprimir Laudo de Transição IFRS (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ganho Bruto Deemed Cost</span>
            <TrendingUp size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            + R$ {ganhoDeemedCostBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Reavaliação Laudo de Engenharia (CPC 27)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Passivo Fiscal Diferido (34%)</span>
            <Scale size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            R$ {efeitoTributarioDiferidoIrpjCsll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Tributos Diferidos s/ Reavaliação (CPC 32)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ajuste Líquido ao PL de Abertura</span>
            <Sparkles size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            + R$ {ganhoLiquidoPatrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Acréscimo Direto em Ajustes de Avaliação</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Status da Transição</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)', fontSize: '0.95rem' }}>
            100% HOMOLOGADO
          </div>
          <div className="metric-sub">Balanço de Abertura IFRS Aprovado</div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="no-print panel-card">
        <div style={{ padding: '12px 0 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros de Transição & Laudo de Avaliação Pericial</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Valor Contábil Histórico do Imobilizado (R$)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={valorHistoricoImobilizado}
              onChange={e => setValorHistoricoImobilizado(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Valor de Custo Atribuído (Laudo Pericial de Engenharia)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={custoAtribuidoLaudoDeemedCost}
              onChange={e => setCustoAtribuidoLaudoDeemedCost(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Ajuste a Valor Presente (AVP - CPC 12)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={ajusteValorPresenteAvp}
              onChange={e => setAjusteValorPresenteAvp(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">LAUDO TÉCNICO DE ADOÇÃO INICIAL DAS NORMAS INTERNACIONAIS (IFRS 1 / CPC 37)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>DATA TRANSIÇÃO: <strong>{dataTransicao}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Balanço de Abertura IFRS</div>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo dos Ajustes de Transição Contábil</th>
              <th style={{ textAlign: 'right' }}>Valor Bruto (R$)</th>
              <th style={{ textAlign: 'right' }}>Tributos Diferidos (R$)</th>
              <th style={{ textAlign: 'right' }}>Efeito Líquido no PL (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Custo Atribuído (*Deemed Cost*) de Terrenos e Edificações Industriais</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {ganhoDeemedCostBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {efeitoTributarioDiferidoIrpjCsll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 700 }}>+ R$ {(ganhoDeemedCostBruto - efeitoTributarioDiferidoIrpjCsll).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Ajuste a Valor Presente de Contas a Receber e Financiamentos (CPC 12)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {ajusteValorPresenteAvp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 0,00</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {ajusteValorPresenteAvp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="diamond-table-total">
              <td>AJUSTE TOTAL LIQUIDO AO PATRIMÔNIO LÍQUIDO DE ABERTURA (IFRS 1)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(ganhoDeemedCostBruto - ajusteValorPresenteAvp).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {efeitoTributarioDiferidoIrpjCsll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>+ R$ {ganhoLiquidoPatrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">PERITO AVALIADOR DE ENGENHARIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CREA / Laudo Deemed Cost</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE IFRS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CPC 37 / IFRS 1 Homologado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeIfrsReiqTaxView;
