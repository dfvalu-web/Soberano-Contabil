// ==========================================================================
// SOBERANO CONTÁBIL — PARCELAMENTOS FISCAIS & TRANSAÇÃO TRIBUTÁRIA PGFN/RFB
// Conformidade: Lei 13.988/2020 • Portaria PGFN 6.757/22 • Regularize / e-CAC
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Building2,
  Coins
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface InstallmentPlanItem {
  id: string;
  modalidadeNome: string;
  orgaoCredor: 'PGFN' | 'RFB' | 'ESTADO' | 'MUNICIPIO';
  valorDividaOriginal: number;
  descontoJurosMulta: number;
  valorDividaConsolidada: number;
  quantidadeParcelas: number;
  valorParcelaAtual: number;
  statusAdesao: 'ATIVO_REGULAR' | 'PENDENTE_ADESAO' | 'EM_ATRASO';
}

export const OfficeTaxInstallmentsPgfnView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [installments, setInstallments] = useState<InstallmentPlanItem[]>([
    {
      id: 'inst-1',
      modalidadeNome: 'Transação Excepcional PGFN (Capacidade de Pagamento C/D)',
      orgaoCredor: 'PGFN',
      valorDividaOriginal: 180000.00,
      descontoJurosMulta: 65000.00, // 65k de desconto
      valorDividaConsolidada: 115000.00,
      quantidadeParcelas: 120,
      valorParcelaAtual: 958.33,
      statusAdesao: 'ATIVO_REGULAR'
    },
    {
      id: 'inst-2',
      modalidadeNome: 'Parcelamento Ordinário Simples Nacional (Art. 21 LC 123)',
      orgaoCredor: 'RFB',
      valorDividaOriginal: 45000.00,
      descontoJurosMulta: 0,
      valorDividaConsolidada: 45000.00,
      quantidadeParcelas: 60,
      valorParcelaAtual: 750.00,
      statusAdesao: 'ATIVO_REGULAR'
    }
  ]);

  const totalConsolidado = installments.reduce((acc, i) => acc + i.valorDividaConsolidada, 0);
  const totalDescontos = installments.reduce((acc, i) => acc + i.descontoJurosMulta, 0);
  const totalParcelasMensais = installments.reduce((acc, i) => acc + i.valorParcelaAtual, 0);

  const handleEmitDarfParcela = () => {
    setFeedback('Guias DAS/DARF das parcelas do mês emitidas com código de barras e chave PIX com sucesso!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Parcelamentos Fiscais & Transação Tributária PGFN / RFB
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              LEI 13.988/20 • REGULARIZE PGFN
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Controle de termos de transação por capacidade de pagamento, amortização de parcelas e emissão de guias mensais DAS/DARF.
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
            <span>Imprimir Laudo Parcelamentos (A4)</span>
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
            <span className="metric-title">Passivo Consolidado em Acordo</span>
            <Coins size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalConsolidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{installments.length} Contratos Ativos</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Desconto Obtido (Juros/Multa)</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Economia Lei 13.988/2020</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Parcela Mensal Consolidada</span>
            <Calculator size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            R$ {totalParcelasMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </div>
          <div className="metric-sub">Compromisso financeiro fixo</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida</span>
            <Zap size={18} color="var(--emerald-400)" />
          </div>
          <button
            onClick={handleEmitDarfParcela}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            ⚡ Emitir Guias do Mês
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Modalidade de Acordo</th>
                <th>Órgão Credor</th>
                <th style={{ textAlign: 'right' }}>Dívida Original</th>
                <th style={{ textAlign: 'right' }}>Desconto Obtido</th>
                <th style={{ textAlign: 'right' }}>Saldo Consolidado</th>
                <th style={{ textAlign: 'center' }}>Prazo</th>
                <th style={{ textAlign: 'right' }}>Parcela Mensal</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {installments.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{i.modalidadeNome}</td>
                  <td><span className="badge badge-cyan">{i.orgaoCredor}</span></td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {i.valorDividaOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                    - R$ {i.descontoJurosMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {i.valorDividaConsolidada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>{i.quantidadeParcelas}x</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--amber-400)' }}>
                    R$ {i.valorParcelaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge-emerald">✓ Regular</span></td>
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
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE TRANSAÇÃO TRIBUTÁRIA & PARCELAMENTOS ESPECIAIS (LEI Nº 13.988/2020)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>CND Positiva com Efeitos de Negativa Válida</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Passivo Total Consolidado</strong>
            <span className="font-mono">R$ {totalConsolidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Descontos Concedidos</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Compromisso Mensal</strong>
            <span className="font-mono">R$ {totalParcelasMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status de Regularidade Fiscal</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ CND-e Ativa e Regular</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Termo de Transação / Modalidade</th>
              <th>Credor</th>
              <th style={{ textAlign: 'right' }}>Desconto (R$)</th>
              <th style={{ textAlign: 'center' }}>Prazo</th>
              <th style={{ textAlign: 'right' }}>Parcela Mensal (R$)</th>
            </tr>
          </thead>
          <tbody>
            {installments.map(i => (
              <tr key={i.id}>
                <td><strong>{i.modalidadeNome}</strong></td>
                <td>{i.orgaoCredor}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {i.descontoJurosMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'center' }}>{i.quantidadeParcelas} meses</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {i.valorParcelaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE PASSIVOS TRIBUTÁRIOS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Acompanhamento PGFN / RFB</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA / CLIENTE</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Termo de Transação Homologado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTaxInstallmentsPgfnView;
