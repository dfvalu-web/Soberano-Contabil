import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Zap,
  Users,
  FileCheck
} from 'lucide-react';

export const OfficeFamilyHoldingSuccessionView: React.FC = () => {
  const [patrimonioImoveis, setPatrimonioImoveis] = useState<number>(15000000);
  const [rendaAluguelMensal, setRendaAluguelMensal] = useState<number>(85000);
  const [aliquotaItcmd, setAliquotaItcmd] = useState<number>(8.0);
  const [notification, setNotification] = useState<string | null>(null);

  // Cálculos Tributários PF vs Holding
  const irpfAluguelAnual = (rendaAluguelMensal * 12) * 0.275;
  const holdingAluguelAnual = (rendaAluguelMensal * 12) * 0.1133;
  const economiaAnualAluguel = irpfAluguelAnual - holdingAluguelAnual;

  const itcmdInventarioPF = patrimonioImoveis * (aliquotaItcmd / 100);
  const itcmdHoldingPlanejada = (patrimonioImoveis * 0.4) * (aliquotaItcmd / 100);
  const economiaSucessoria = itcmdInventarioPF - itcmdHoldingPlanejada;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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

      {/* Header 3D 4K */}
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
            🏰
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Holding Familiar & Planejamento Sucessório
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
                BLINDAGEM PATRIMONIAL & ITCMD
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Simulador de eficiência tributária para proteção patrimonial, redução de IRPF em locações e sucessão sem inventário judicial.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Dossiê de Planejamento Sucessório & Holding gerado com sucesso!')}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Emitir Parecer de Holding</span>
        </button>
      </div>

      {/* Controles do Simulador */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Patrimônio Imobiliário Total (R$):</label>
          <input
            type="number"
            value={patrimonioImoveis}
            onChange={(e) => setPatrimonioImoveis(Number(e.target.value))}
            style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '8px 12px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 900, marginTop: '4px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Renda Mensal de Locação (R$):</label>
          <input
            type="number"
            value={rendaAluguelMensal}
            onChange={(e) => setRendaAluguelMensal(Number(e.target.value))}
            style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#34D399', padding: '8px 12px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 900, marginTop: '4px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Alíquota ITCMD Estadual (%):</label>
          <input
            type="number"
            value={aliquotaItcmd}
            onChange={(e) => setAliquotaItcmd(Number(e.target.value))}
            style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FBBF24', padding: '8px 12px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 900, marginTop: '4px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Resultados Comparativos PF vs Holding */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#34D399', fontWeight: 900 }}>
            💰 Economia na Tributação de Aluguéis (Anual)
          </h3>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tributação Pessoa Física (27,5%):</span>
              <span style={{ color: '#F87171', fontWeight: 700 }}>{irpfAluguelAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tributação Holding Familiar (11,33%):</span>
              <span style={{ color: '#34D399', fontWeight: 700 }}>{holdingAluguelAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', fontSize: '0.85rem' }}>
              <strong style={{ color: '#FFFFFF' }}>Economia Anual Líquida:</strong>
              <strong style={{ color: '#34D399' }}>+ {economiaAnualAluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#38BDF8', fontWeight: 900 }}>
            🏛️ Economia no Planejamento Sucessório (ITCMD)
          </h3>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Custo ITCMD Inventário Tradicional:</span>
              <span style={{ color: '#F87171', fontWeight: 700 }}>{itcmdInventarioPF.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Custo Doação Quotas c/ Reserva de Usufruto:</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>{itcmdHoldingPlanejada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', fontSize: '0.85rem' }}>
              <strong style={{ color: '#FFFFFF' }}>Economia Patrimonial:</strong>
              <strong style={{ color: '#38BDF8' }}>+ {economiaSucessoria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
          </div>
        </div>
      </div>
    
      {/* Dossiê Diamante A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">PARECER EXECUTIVO DE HOLDING FAMILIAR</div>
              <div className="diamond-subtitle">Planejamento Tributário e Sucessório Patrimonial • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFamilyHoldingSuccessionView;
