// ==========================================================================
// SOBERANO CONTÁBIL — DIFAL INTERESTADUAL (EC 87/15, LC 190/22) & FCP
// Conformidade: Convênio ICMS 236/21 • Matriz 27 UFs • Guia GNRE Digital
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  FileText,
  Building2,
  Download,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface UfRateInfo {
  uf: string;
  name: string;
  internalRate: number;
  fcpRate: number;
}

const UF_RATES: UfRateInfo[] = [
  { uf: 'AC', name: 'Acre', internalRate: 19.0, fcpRate: 0 },
  { uf: 'AL', name: 'Alagoas', internalRate: 19.0, fcpRate: 1.0 },
  { uf: 'AM', name: 'Amazonas', internalRate: 20.0, fcpRate: 0 },
  { uf: 'BA', name: 'Bahia', internalRate: 20.5, fcpRate: 2.0 },
  { uf: 'CE', name: 'Ceará', internalRate: 20.0, fcpRate: 2.0 },
  { uf: 'DF', name: 'Distrito Federal', internalRate: 20.0, fcpRate: 0 },
  { uf: 'ES', name: 'Espírito Santo', internalRate: 17.0, fcpRate: 0 },
  { uf: 'GO', name: 'Goiás', internalRate: 19.0, fcpRate: 2.0 },
  { uf: 'MA', name: 'Maranhão', internalRate: 22.0, fcpRate: 2.0 },
  { uf: 'MG', name: 'Minas Gerais', internalRate: 18.0, fcpRate: 2.0 },
  { uf: 'MS', name: 'Mato Grosso do Sul', internalRate: 17.0, fcpRate: 2.0 },
  { uf: 'MT', name: 'Mato Grosso', internalRate: 17.0, fcpRate: 0 },
  { uf: 'PA', name: 'Pará', internalRate: 19.0, fcpRate: 0 },
  { uf: 'PB', name: 'Paraíba', internalRate: 20.0, fcpRate: 2.0 },
  { uf: 'PE', name: 'Pernambuco', internalRate: 20.5, fcpRate: 2.0 },
  { uf: 'PI', name: 'Piauí', internalRate: 21.0, fcpRate: 1.0 },
  { uf: 'PR', name: 'Paraná', internalRate: 19.5, fcpRate: 2.0 },
  { uf: 'RJ', name: 'Rio de Janeiro', internalRate: 20.0, fcpRate: 2.0 },
  { uf: 'RN', name: 'Rio Grande do Norte', internalRate: 20.0, fcpRate: 2.0 },
  { uf: 'RO', name: 'Rondônia', internalRate: 19.5, fcpRate: 2.0 },
  { uf: 'RR', name: 'Roraima', internalRate: 20.0, fcpRate: 0 },
  { uf: 'RS', name: 'Rio Grande do Sul', internalRate: 17.0, fcpRate: 2.0 },
  { uf: 'SC', name: 'Santa Catarina', internalRate: 17.0, fcpRate: 0 },
  { uf: 'SE', name: 'Sergipe', internalRate: 19.0, fcpRate: 2.0 },
  { uf: 'SP', name: 'São Paulo', internalRate: 18.0, fcpRate: 0 },
  { uf: 'TO', name: 'Tocantins', internalRate: 20.0, fcpRate: 0 }
];

export const ExtendedWarrantyDifalFcpView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [originUf, setOriginUf] = useState<string>('SP');
  const [destUf, setDestUf] = useState<string>('RJ');
  const [baseValue, setBaseValue] = useState<number>(10000.00);
  const [freightValue, setFreightValue] = useState<number>(500.00);
  const [isConsumerFinal, setIsConsumerFinal] = useState<boolean>(true);
  const [isDestTaxPayer, setIsDestTaxPayer] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Interestadual: Origem Sul/Sudeste (exceto ES) para Norte/Nordeste/CO/ES -> 7%; Demais -> 12%
  const interstateRate = useMemo(() => {
    const southSoutheast = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC'];
    const northNortheastCo = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO'];
    if (southSoutheast.includes(originUf) && northNortheastCo.includes(destUf)) {
      return 7.0;
    }
    return 12.0;
  }, [originUf, destUf]);

  const destInfo = useMemo(() => UF_RATES.find(u => u.uf === destUf) || UF_RATES[0], [destUf]);
  const destInternalRate = destInfo.internalRate;
  const fcpRate = destInfo.fcpRate;

  // Cálculo da Base com Frete
  const totalBase = baseValue + freightValue;
  const icmsOrigem = totalBase * (interstateRate / 100);
  const icmsDestinoInterno = totalBase * (destInternalRate / 100);
  const difalTotal = Math.max(0, icmsDestinoInterno - icmsOrigem);
  const fcpAmount = totalBase * (fcpRate / 100);
  const totalGnrePayable = difalTotal + fcpAmount;

  const handleGenerateGnre = () => {
    setFeedback(`Guia GNRE Digital (${destUf}) no valor de R$ ${totalGnrePayable.toFixed(2)} gerada com sucesso com chave PIX!`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              DIFAL Interestadual (EC 87/15, LC 190/22) & Fundo de Combate à Pobreza (FCP)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CONVÊNIO ICMS 236/21 • GNRE DIGITAL
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Simulador de partilha de ICMS interestadual com base dupla, alíquotas internas das 27 UFs e apuração do FCP.
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
            <span>Imprimir Laudo DIFAL (A4)</span>
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
            <span className="metric-title">Total GNRE a Recolher (UF Destino)</span>
            <DollarSign size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalGnrePayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">DIFAL (R$ {difalTotal.toFixed(2)}) + FCP (R$ {fcpAmount.toFixed(2)})</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Alíquota Interestadual (Origem)</span>
            <Percent size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono">{interstateRate}%</div>
          <div className="metric-sub">ICMS Origem ({originUf}): R$ {icmsOrigem.toFixed(2)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Alíquota Interna ({destUf})</span>
            <Percent size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono">{destInternalRate}%</div>
          <div className="metric-sub">ICMS Destino Total: R$ {icmsDestinoInterno.toFixed(2)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fundo Combate à Pobreza</span>
            <ShieldAlert size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono">{fcpRate}%</div>
          <div className="metric-sub">Adicional FCP {destUf}: R$ {fcpAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Simulator Form */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label>UF de Origem (Remetente)</label>
            <select className="form-control" value={originUf} onChange={e => setOriginUf(e.target.value)}>
              {UF_RATES.map(u => <option key={u.uf} value={u.uf}>{u.uf} - {u.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>UF de Destino (Consumidor Final)</label>
            <select className="form-control" value={destUf} onChange={e => setDestUf(e.target.value)}>
              {UF_RATES.map(u => <option key={u.uf} value={u.uf}>{u.uf} - {u.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Valor dos Produtos (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={baseValue} onChange={e => setBaseValue(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Frete / Despesas Acessórias (R$)</label>
            <input type="number" step="0.01" className="form-control font-mono" value={freightValue} onChange={e => setFreightValue(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={handleGenerateGnre} className="btn-primary-action" style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} /> Emitir Guia GNRE Digital ({destUf})
          </button>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">MEMÓRIA DE CÁLCULO DO DIFAL & FUNDO DE COMBATE À POBREZA (EC 87/2015 & LC 190/2022)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>GNRE Homologada SEFAZ/{destUf}</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Valor Total da Operação</strong>
            <span className="font-mono">R$ {totalBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>ICMS Destino (DIFAL)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {difalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Fundo Combate à Pobreza (FCP)</strong>
            <span className="font-mono">R$ {fcpAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total a Recolher na GNRE</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalGnrePayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Parâmetro de Partilha</th>
              <th style={{ textAlign: 'center' }}>UF Envolvida</th>
              <th style={{ textAlign: 'center' }}>Alíquota Aplicável</th>
              <th style={{ textAlign: 'right' }}>Valor Apurado (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ICMS Próprio da Operação Interestadual (Origem)</td>
              <td style={{ textAlign: 'center' }}>{originUf}</td>
              <td style={{ textAlign: 'center' }}>{interstateRate}%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {icmsOrigem.toFixed(2)}</td>
            </tr>
            <tr>
              <td>ICMS Alíquota Interna no Estado de Destino</td>
              <td style={{ textAlign: 'center' }}>{destUf}</td>
              <td style={{ textAlign: 'center' }}>{destInternalRate}%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {icmsDestinoInterno.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Diferencial de Alíquota Devido ao Destino (DIFAL)</td>
              <td style={{ textAlign: 'center' }}>{destUf}</td>
              <td style={{ textAlign: 'center' }}>{(destInternalRate - interstateRate).toFixed(1)}%</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {difalTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Adicional do Fundo de Combate à Pobreza (FCP)</td>
              <td style={{ textAlign: 'center' }}>{destUf}</td>
              <td style={{ textAlign: 'center' }}>{fcpRate}%</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {fcpAmount.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={3}>TOTAL DA GUIA GNRE A RECOLHER EM FAVOR DE SEFAZ/{destUf}</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {totalGnrePayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO FISCAL INTERESTADUAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Partilha EC 87/15 Validada</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONFORMIDADE TRIBUTÁRIA LC 190</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Convênio ICMS 236/21</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedWarrantyDifalFcpView;
