import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Percent,
  Sliders,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeClientProfitabilityBiView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [reajustePercent, setReajustePercent] = useState<number>(6.5);
  const [notification, setNotification] = useState<string | null>(null);

  const [clients, setClients] = useState(() => {
    return tenants.map((t, idx) => {
      const honorario = 3500 + idx * 1800;
      const custoHoras = 1600 + idx * 600;
      const margem = Math.round(((honorario - custoHoras) / honorario) * 100);
      return {
        id: t.id,
        name: t.name,
        cnpj: t.cnpj,
        regime: t.regime,
        honorario,
        custoHoras,
        margem,
        reajustado: false
      };
    });
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const ganhoProjetadoTotal = useMemo(() => {
    const totalHonorarios = clients.reduce((acc, c) => acc + c.honorario, 0);
    return totalHonorarios * (reajustePercent / 100) * 12;
  }, [clients, reajustePercent]);

  const handleApplyReajuste = () => {
    setClients(prev => prev.map(c => ({
      ...c,
      honorario: Math.round(c.honorario * (1 + reajustePercent / 100)),
      reajustado: true
    })));
    showToast(`Reajuste de ${reajustePercent}% aplicado na carteira! Ganho anual projetado: R$ ${ganhoProjetadoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          border: '1.5px solid #34D399',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Executivo 3D 4K */}
      <div style={{
        background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderBottom: '3px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1.5px solid #34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
          }}>
            📈
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                BI de Rentabilidade da Carteira & Sugestor de Reajustes
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                SIMULADOR IPCA/IGP-M
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Análise de margem por cliente, custo de horas/homem e simulador inteligente de reajuste de honorários.
            </p>
          </div>
        </div>
      </div>

      {/* Simulador Interativo com Slider */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(52, 211, 153, 0.35)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>Índice de Reajuste Sugerido:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>{reajustePercent.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={reajustePercent}
            onChange={(e) => setReajustePercent(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Ganho Anual Projetado no Escritório</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
            + {ganhoProjetadoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>

        <button
          onClick={handleApplyReajuste}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Aplicar Reajuste na Carteira</span>
        </button>
      </div>

      {/* Grade de Rentabilidade por Cliente */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
          Matriz de Rentabilidade por Empresa Cliente
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Empresa Cliente</th>
              <th style={{ textAlign: 'center' }}>Regime</th>
              <th style={{ textAlign: 'right' }}>Honorário Atual</th>
              <th style={{ textAlign: 'right' }}>Custo Horas/Equipe</th>
              <th style={{ textAlign: 'center' }}>Margem EBITDA</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{c.name}</td>
                <td style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.72rem' }}>{c.regime}</td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>
                  {c.honorario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ textAlign: 'right', color: '#F87171', fontWeight: 700 }}>
                  {c.custoHoras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 900, color: c.margem > 50 ? '#34D399' : '#FBBF24' }}>
                  {c.margem}%
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: c.reajustado ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    color: c.reajustado ? '#34D399' : '#38BDF8'
                  }}>
                    {c.reajustado ? '✓ Reajustado' : 'Vigente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeClientProfitabilityBiView;
