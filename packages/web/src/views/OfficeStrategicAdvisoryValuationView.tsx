import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Percent,
  Sliders,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';

export const OfficeStrategicAdvisoryValuationView: React.FC = () => {
  const [ebitdaAnual, setEbitdaAnual] = useState<number>(4200000);
  const [multiploEbitda, setMultiploEbitda] = useState<number>(6.5);
  const [taxaWacc, setTaxaWacc] = useState<number>(14.0);
  const [crescimentoPerpetuidade, setCrescimentoPerpetuidade] = useState<number>(3.5);
  const [dividaLiquida, setDividaLiquida] = useState<number>(1800000);
  const [notification, setNotification] = useState<string | null>(null);

  // Valuation por Múltiplos
  const enterpriseValueMultiplos = ebitdaAnual * multiploEbitda;
  const equityValueMultiplos = enterpriseValueMultiplos - dividaLiquida;

  // Valuation por Fluxo de Caixa Descontado (Perpetuidade Simplificada)
  const enterpriseValueDcf = (ebitdaAnual * 0.75 * (1 + crescimentoPerpetuidade / 100)) / ((taxaWacc - crescimentoPerpetuidade) / 100);
  const equityValueDcf = enterpriseValueDcf - dividaLiquida;

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
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Consultoria Estratégica, Benchmarking & Valuation
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
                MODELAGEM DCF & MULTIPLOS
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Avaliação de empresas (M&A), cálculo de valor justo por Fluxo de Caixa Descontado e Múltiplos Setoriais de EBITDA.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Laudo Executivo de Valuation gerado com sucesso!')}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Emitir Laudo de Valuation</span>
        </button>
      </div>

      {/* Sliders Interativos */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>EBITDA Anual (R$):</label>
          <input
            type="number"
            value={ebitdaAnual}
            onChange={(e) => setEbitdaAnual(Number(e.target.value))}
            style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '8px 12px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 900, marginTop: '4px', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Múltiplo Setorial EV/EBITDA ({multiploEbitda}x):</label>
          <input
            type="range"
            min="3"
            max="15"
            step="0.5"
            value={multiploEbitda}
            onChange={(e) => setMultiploEbitda(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38BDF8', marginTop: '8px', cursor: 'pointer' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Custo Médio de Capital - WACC ({taxaWacc}%):</label>
          <input
            type="range"
            min="8"
            max="25"
            step="0.5"
            value={taxaWacc}
            onChange={(e) => setTaxaWacc(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10B981', marginTop: '8px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Resultados de Avaliação */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#38BDF8', fontWeight: 900 }}>
            Valor da Empresa por Múltiplos de EBITDA
          </h3>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Enterprise Value (EV):</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{enterpriseValueMultiplos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dívida Líquida Deduzida:</span>
              <span style={{ color: '#F87171', fontWeight: 700 }}>- {dividaLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '1.1rem' }}>
              <strong style={{ color: '#FFFFFF' }}>Equity Value (Valor aos Sócios):</strong>
              <strong style={{ color: '#34D399' }}>{equityValueMultiplos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#34D399', fontWeight: 900 }}>
            Valor Justo por Fluxo de Caixa Descontado (DCF)
          </h3>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Valor Presente dos Fluxos Futuros:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{enterpriseValueDcf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dívida Líquida Deduzida:</span>
              <span style={{ color: '#F87171', fontWeight: 700 }}>- {dividaLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '1.1rem' }}>
              <strong style={{ color: '#FFFFFF' }}>Equity Value (DCF):</strong>
              <strong style={{ color: '#34D399' }}>{equityValueDcf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
          </div>
        </div>
      </div>
    
      {/* Laudo Diamante A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">LAUDO DE VALUATION & AVALIAÇÃO ECONÔMICA</div>
              <div className="diamond-subtitle">Modelagem por Fluxo de Caixa Descontado (DCF) e Múltiplos EBITDA • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeStrategicAdvisoryValuationView;
