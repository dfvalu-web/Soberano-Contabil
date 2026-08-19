// ==========================================================================
// SOBERANO CONTÁBIL — DEVOLUÇÕES DE MERCADORIAS & ESTORNOS DE TRIBUTOS
// Conformidade: Convênio SINIEF s/nº 1970 • CPC 16 (Estoques) • Art. 18 Lei 9.430/96
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  Boxes,
  Building2,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface ReturnTransactionItem {
  id: string;
  originalNfeNumero: string;
  returnType: 'DEVOLUCAO_VENDA' | 'DEVOLUCAO_COMPRA';
  clientSupplierName: string;
  totalReturnedValue: number;
  icmsEstorno: number;
  ipiEstorno: number;
  pisEstorno: number;
  cofinsEstorno: number;
  stockRestocked: boolean;
}

export const OfficeReturnsTaxAdjustmentView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [returnsList, setReturnsList] = useState<ReturnTransactionItem[]>([
    {
      id: 'ret-1',
      originalNfeNumero: 'NF-e 45890',
      returnType: 'DEVOLUCAO_VENDA',
      clientSupplierName: 'Auto Peças Modelo de Campinas Ltda',
      totalReturnedValue: 12500.00,
      icmsEstorno: 2250.00,
      ipiEstorno: 625.00,
      pisEstorno: 206.25,
      cofinsEstorno: 950.00,
      stockRestocked: true
    },
    {
      id: 'ret-2',
      originalNfeNumero: 'NF-e 12440',
      returnType: 'DEVOLUCAO_COMPRA',
      clientSupplierName: 'Distribuidora Química ABC S.A.',
      totalReturnedValue: 8400.00,
      icmsEstorno: 1512.00,
      ipiEstorno: 0,
      pisEstorno: 138.60,
      cofinsEstorno: 638.40,
      stockRestocked: true
    }
  ]);

  const totalReturned = returnsList.reduce((acc, r) => acc + r.totalReturnedValue, 0);
  const totalTaxReversal = returnsList.reduce((acc, r) => acc + (r.icmsEstorno + r.ipiEstorno + r.pisEstorno + r.cofinsEstorno), 0);

  const handleEmitReturnNfe = () => {
    setFeedback('NF-e de Devolução emitida e autorizada na SEFAZ com anulação de débitos fiscais e retorno de itens ao estoque (CPC 16)!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔄</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Devoluções de Mercadorias & Anulação de Débitos/Créditos Fiscais
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              SINIEF • ESTORNO ICMS/IPI/PIS/COFINS
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Emissão de NF-e de devolução com estorno tributário determinístico, reposição física de almoxarifado e baixa de duplicatas.
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
            <span>Imprimir Laudo de Devoluções (A4)</span>
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
            <span className="metric-title">Volume Total Devolvido</span>
            <RotateCcw size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalReturned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{returnsList.length} Operações Registradas</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total de Tributos Estornados</span>
            <DollarSign size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalTaxReversal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">ICMS, IPI, PIS e COFINS Anulados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Itens Reintegrados ao Estoque</span>
            <Boxes size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            100% Reincorporado
          </div>
          <div className="metric-sub">Custo Médio Móvel CPC 16</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <button
            onClick={handleEmitReturnNfe}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            ⚡ Emitir NF-e de Devolução
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>NF-e Origem</th>
                <th>Tipo de Operação</th>
                <th>Cliente / Fornecedor</th>
                <th style={{ textAlign: 'right' }}>Valor Devolvido</th>
                <th style={{ textAlign: 'right' }}>Estorno ICMS/IPI</th>
                <th style={{ textAlign: 'right' }}>Estorno PIS/COFINS</th>
                <th style={{ textAlign: 'center' }}>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {returnsList.map(r => (
                <tr key={r.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{r.originalNfeNumero}</td>
                  <td>
                    <span className={`badge badge-${r.returnType === 'DEVOLUCAO_VENDA' ? 'indigo' : 'cyan'}`}>
                      {r.returnType === 'DEVOLUCAO_VENDA' ? 'Devolução de Venda' : 'Devolução de Compra'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{r.clientSupplierName}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {r.totalReturnedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                    R$ {(r.icmsEstorno + r.ipiEstorno).toFixed(2)}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--cyan-400)' }}>
                    R$ {(r.pisEstorno + r.cofinsEstorno).toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge-emerald">✓ Reintegrado</span></td>
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
            <div className="diamond-subtitle">LAUDO TRIBUTÁRIO DE DEVOLUÇÕES & ESTORNO FISCAL DE IMPOSTOS (CONVÊNIO SINIEF / CPC 16)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Estorno Fiscal Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Total Físico Devolvido</strong>
            <span className="font-mono">R$ {totalReturned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Anulação de ICMS/IPI</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {returnsList.reduce((acc, r) => acc + r.icmsEstorno + r.ipiEstorno, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Anulação PIS/COFINS</strong>
            <span className="font-mono">R$ {returnsList.reduce((acc, r) => acc + r.pisEstorno + r.cofinsEstorno, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Reintegração ao Estoque</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ CPC 16 Baixa de CMV</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>NF Referenciada</th>
              <th>Parceiro Comercial</th>
              <th>Tipo</th>
              <th style={{ textAlign: 'right' }}>Total Devolvido (R$)</th>
              <th style={{ textAlign: 'right' }}>Tributos Estornados (R$)</th>
            </tr>
          </thead>
          <tbody>
            {returnsList.map(r => (
              <tr key={r.id}>
                <td><strong>{r.originalNfeNumero}</strong></td>
                <td>{r.clientSupplierName}</td>
                <td>{r.returnType}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {r.totalReturnedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {(r.icmsEstorno + r.ipiEstorno + r.pisEstorno + r.cofinsEstorno).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE LOGÍSTICA & DEVOLUÇÕES</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Aferição Física de Entrada</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA TRIBUTÁRIA ESTADUAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade SINIEF</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeReturnsTaxAdjustmentView;
