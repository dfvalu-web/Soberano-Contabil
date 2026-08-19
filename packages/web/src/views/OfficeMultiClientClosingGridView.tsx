import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeMultiClientClosingGridView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [filterRegime, setFilterRegime] = useState<string>('ALL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Central de Fechamento Multi-Cliente & Cockpit Geral
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Visão Panorâmica da Carteira
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Acompanhamento em tempo real de DP, Fiscal, Contábil e CNDs de todas as empresas do escritório.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={filterRegime} onChange={(e) => setFilterRegime(e.target.value)} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            <option value="ALL">Todos os Regimes Tributários</option>
            <option value="SIMPLES_NACIONAL">Simples Nacional</option>
            <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
            <option value="LUCRO_REAL">Lucro Real</option>
          </select>
          <button onClick={() => alert('Competência fechada em lote!')} className="btn-primary-action">
            <span>⚡</span> Fechar Competência em Lote
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead><tr style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}><th style={{ padding: '12px 16px' }}>Empresa / CNPJ</th><th style={{ padding: '12px' }}>Regime</th><th style={{ padding: '12px' }}>DP & Folha</th><th style={{ padding: '12px' }}>Fiscal & DAS</th><th style={{ padding: '12px' }}>Contabilidade</th><th style={{ padding: '12px' }}>CNDs</th><th style={{ padding: '12px', textAlign: 'center' }}>Ações</th></tr></thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 700, color: '#fff' }}>{t.name}</div><div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CNPJ: {t.cnpj}</div></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>{t.regime.replace('_', ' ')}</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Fechada</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Transmitido</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Conciliado</span></td>
                <td style={{ padding: '12px' }}><span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>✅ Em Dia</span></td>
                <td style={{ padding: '12px', textAlign: 'center' }}><button onClick={() => alert('Operando empresa ' + t.name)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>🔍 Operar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OfficeMultiClientClosingGridView;