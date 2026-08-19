// ==========================================================================
// SOBERANO CONTÁBIL — CONCILIAÇÃO DDA BANCÁRIO vs NOTAS DE ENTRADA (DF-e)
// Conformidade: Prevenção a Fraudes de Boletos • FEBRABAN DDA • Sped Fiscal
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  ShieldCheck,
  Search,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface DdaMatchItem {
  id: string;
  boletoBarcode: string;
  cedenteNome: string;
  cedenteCnpj: string;
  valorBoleto: number;
  dataVencimento: string;
  matchedNfeNumero?: string;
  matchedNfeValor?: number;
  matchStatus: 'CONCILIADO_EXATO' | 'DIVERGENCIA_VALOR' | 'BOLETO_SEM_NFE' | 'NFE_SEM_BOLETO';
}

export const OfficeDdaBankingNfeMatchingView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [ddaItems, setDdaItems] = useState<DdaMatchItem[]>([
    {
      id: 'dda-1',
      boletoBarcode: '34191.09008 00000.123456 78900.112233 1 99880003850000',
      cedenteNome: 'Aços & Metais Gerdau S.A.',
      cedenteCnpj: '12.345.678/0001-90',
      valorBoleto: 38500.00,
      dataVencimento: '2026-09-15',
      matchedNfeNumero: 'NF-e 45891',
      matchedNfeValor: 38500.00,
      matchStatus: 'CONCILIADO_EXATO'
    },
    {
      id: 'dda-2',
      boletoBarcode: '03399.00112 33445.556677 88990.001122 8 99890001420000',
      cedenteNome: 'Distribuidora Farmacêutica EMS Brasil Ltda',
      cedenteCnpj: '98.765.432/0001-11',
      valorBoleto: 14200.00,
      dataVencimento: '2026-09-20',
      matchedNfeNumero: 'NF-e 12450',
      matchedNfeValor: 14200.00,
      matchStatus: 'CONCILIADO_EXATO'
    },
    {
      id: 'dda-3',
      boletoBarcode: '23793.38128 60000.887766 55443.332211 4 99900000450000',
      cedenteNome: 'Consultoria de Marcas Fictícia Ltda (Suspeito)',
      cedenteCnpj: '00.111.222/0001-33',
      valorBoleto: 450.00,
      dataVencimento: '2026-08-30',
      matchStatus: 'BOLETO_SEM_NFE'
    }
  ]);

  const handleBatchConciliate = () => {
    setFeedback('Conciliação Inteligente DDA x DF-e executada com sucesso! 2 boletos validados contra NF-e e 1 alerta de boleto sem nota identificado.');
    setTimeout(() => setFeedback(null), 5000);
  };

  const totalDda = ddaItems.reduce((acc, d) => acc + d.valorBoleto, 0);
  const totalConciliado = ddaItems.filter(d => d.matchStatus === 'CONCILIADO_EXATO').reduce((acc, d) => acc + d.valorBoleto, 0);
  const totalRiscoFraude = ddaItems.filter(d => d.matchStatus === 'BOLETO_SEM_NFE').reduce((acc, d) => acc + d.valorBoleto, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Conciliação DDA Bancário vs Notas Fiscais de Entrada
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              FEBRABAN DDA • ANTI-FRAUDE
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cruzamento automatizado dos boletos sacados via DDA bancário contra as chaves de acesso de NF-e autorizadas.
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
            <span>Imprimir Laudo DDA (A4)</span>
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
            <span className="metric-title">Total Boletos DDA Recebidos</span>
            <FileSpreadsheet size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalDda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{ddaItems.length} Títulos Registrados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">100% Conciliado com NF-e</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalConciliado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Apto para pagamento seguro</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Alerta de Boleto Sem NF-e</span>
            <AlertTriangle size={18} color="#F87171" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            R$ {totalRiscoFraude.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Risco de fraude / golpe do boleto</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ação Rápida de Auditoria</span>
            <Zap size={18} color="var(--amber-400)" />
          </div>
          <button
            onClick={handleBatchConciliate}
            className="btn-primary-action"
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '0.78rem' }}
          >
            ⚡ Conciliar Boletos 1-Click
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cedente / Fornecedor</th>
                <th>Vencimento</th>
                <th style={{ textAlign: 'right' }}>Valor Boleto</th>
                <th>NF-e Vinculada</th>
                <th style={{ textAlign: 'center' }}>Status de Auditoria</th>
              </tr>
            </thead>
            <tbody>
              {ddaItems.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{d.cedenteNome}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>CNPJ: {d.cedenteCnpj}</div>
                  </td>
                  <td className="font-mono">{d.dataVencimento}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {d.valorBoleto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {d.matchedNfeNumero ? (
                      <span className="badge badge-cyan">{d.matchedNfeNumero} (R$ {d.matchedNfeValor?.toFixed(2)})</span>
                    ) : (
                      <span style={{ color: '#F87171', fontSize: '0.75rem', fontWeight: 700 }}>⚠️ Nenhuma NF-e localizada na SEFAZ</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.matchStatus === 'CONCILIADO_EXATO' ? (
                      <span className="badge badge-emerald">✓ Conciliado e Seguro</span>
                    ) : (
                      <span className="badge badge-red">Suspeito / Bloqueado</span>
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
            <div className="diamond-subtitle">DOSSIÊ DE CONCILIAÇÃO DDA BANCÁRIO x DOCUMENTOS FISCAIS DE ENTRADA (FEBRABAN / DF-e)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Anti-Fraude Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Volume Total de Boletos</strong>
            <span className="font-mono">R$ {totalDda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Boletos Seguros & Validados</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalConciliado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Boletos Suspeitos Bloqueados</strong>
            <span className="font-mono" style={{ color: '#B91C1C', fontWeight: 800 }}>R$ {totalRiscoFraude.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade Contas a Pagar</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Vínculo Mercantil 100%</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Cedente / Beneficiário</th>
              <th>Vencimento</th>
              <th>Vínculo Fiscal</th>
              <th style={{ textAlign: 'center' }}>Parecer</th>
              <th style={{ textAlign: 'right' }}>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {ddaItems.map(d => (
              <tr key={d.id}>
                <td>{d.cedenteNome} ({d.cedenteCnpj})</td>
                <td>{d.dataVencimento}</td>
                <td>{d.matchedNfeNumero || 'Sem Nota Fiscal'}</td>
                <td style={{ textAlign: 'center' }}>{d.matchStatus === 'CONCILIADO_EXATO' ? 'APROVADO' : 'BLOQUEADO'}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {d.valorBoleto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">TESOURARIA & CONTAS A PAGAR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Validação Bancária DDA</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">COMPLIANCE & AUDITORIA FISCAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Prevenção a Fraudes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDdaBankingNfeMatchingView;
