import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calculator,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const AccountingOfficeHubView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [activePilar, setActivePilar] = useState<'ALL' | 'CONTABIL' | 'FISCAL' | 'DP' | 'AUDITORIA'>('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [pilarStats, setPilarStats] = useState({
    contabil: { status: '100% CONCILIADO', entries: 14850, balanced: true, lastUpdate: 'Hoje às 14:20' },
    fiscal: { status: 'APURADO', das: 12840.50, spedValid: true, lastUpdate: 'Hoje às 14:25' },
    dp: { status: 'FOLHA FECHADA', colabs: 38, esocialS1299: true, lastUpdate: 'Hoje às 14:18' },
    auditoria: { status: 'MALHA ZERO', cndScore: '100% REGULAR', alertsFixed: 42, lastUpdate: 'Hoje às 14:28' }
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleExecutePilar = (pilarName: string, message: string) => {
    setIsProcessing(pilarName);
    setTimeout(() => {
      setIsProcessing(null);
      setNotification(message);
      setTimeout(() => setNotification(null), 4000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {/* Notificação Flutuante de Sucesso */}
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
          gap: '10px',
          animation: 'fadeIn 0.3s ease-in-out'
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
            🏢
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Central do Escritório de Contabilidade (4 Pilares)
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
                CARTEIRA 100% AUDITADA
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Centro de comando operacional unificado: Fechamento Contábil, Apuração Fiscal, Folha DP/eSocial e Blindagem de Malhas.
            </p>
          </div>
        </div>

        {/* Controles de Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#0B1120',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Competência:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34D399',
                fontWeight: 900,
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="2026-08" style={{ background: '#111726', color: '#fff' }}>Agosto / 2026 (Atual)</option>
              <option value="2026-07" style={{ background: '#111726', color: '#fff' }}>Julho / 2026 (Fechado)</option>
              <option value="2026-06" style={{ background: '#111726', color: '#fff' }}>Junho / 2026 (Fechado)</option>
            </select>
          </div>

          <button
            onClick={() => handleExecutePilar('ALL', 'Todos os 4 Pilares da Carteira foram sincronizados com sucesso!')}
            className="btn-1click-3d"
            disabled={isProcessing !== null}
          >
            <Zap size={15} />
            <span>{isProcessing === 'ALL' ? 'Processando...' : 'Sincronizar 4 Pilares 1-Click'}</span>
          </button>
        </div>
      </div>

      {/* Seletor de Filtro de Abas 3D */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'Todos os 4 Pilares', icon: '🌐' },
          { id: 'CONTABIL', label: '1. Pilar Contábil', icon: '📊' },
          { id: 'FISCAL', label: '2. Pilar Fiscal & Tributário', icon: '🧾' },
          { id: 'DP', label: '3. Pilar DP & eSocial', icon: '👥' },
          { id: 'AUDITORIA', label: '4. Pilar Auditoria & Malhas', icon: '🛡️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePilar(tab.id as any)}
            style={{
              background: activePilar === tab.id
                ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(180deg, #182236 0%, #0E1626 100%)',
              color: activePilar === tab.id ? '#FFFFFF' : '#94A3B8',
              border: activePilar === tab.id ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: activePilar === tab.id ? '2.5px solid #065F46' : '2px solid rgba(0, 0, 0, 0.5)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: activePilar === tab.id ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Interativo dos 4 Pilares */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        
        {/* PILAR 1: CONTÁBIL */}
        {(activePilar === 'ALL' || activePilar === 'CONTABIL') && (
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(59, 130, 246, 0.35)',
            borderBottom: '3px solid #2563EB',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📊</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                  1. Pilar Contábil & IFRS
                </h3>
              </div>
              <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(96, 165, 250, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900 }}>
                {pilarStats.contabil.status}
              </span>
            </div>

            <div style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Conciliação Bancária OFX:</span>
                <span style={{ fontWeight: 800, color: '#34D399' }}>100% Conciliado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Lançamentos no Mês:</span>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{pilarStats.contabil.entries.toLocaleString()} partidas</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Demonstrações Emitidas:</span>
                <span style={{ fontWeight: 700, color: '#60A5FA' }}>Balancete, BP, DRE, DFC</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => handleExecutePilar('CONTABIL', 'Partidas Dobradas e Razão Contábil recalculados com sucesso!')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
                  border: '1px solid #60A5FA',
                  borderBottom: '2px solid #1E40AF',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Play size={13} /> <span>Recalcular Balancete</span>
              </button>
            </div>
          </div>
        )}

        {/* PILAR 2: FISCAL */}
        {(activePilar === 'ALL' || activePilar === 'FISCAL') && (
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderBottom: '3px solid #059669',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧾</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                  2. Pilar Fiscal & Tributário
                </h3>
              </div>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900 }}>
                {pilarStats.fiscal.status}
              </span>
            </div>

            <div style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Simples Nacional (PGDAS):</span>
                <span style={{ fontWeight: 800, color: '#34D399' }}>R$ {pilarStats.fiscal.das.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>SPED Fiscal & Contribuições:</span>
                <span style={{ fontWeight: 800, color: '#34D399' }}>Validado PVA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Cruzamento DF-e x SEFAZ:</span>
                <span style={{ fontWeight: 700, color: '#34D399' }}>Zero Notas Faltantes</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => handleExecutePilar('FISCAL', 'Guias DAS e DARFs tributários gerados com código Pix!')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  border: '1px solid #34D399',
                  borderBottom: '2px solid #065F46',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={13} /> <span>Emitir Guias com Pix</span>
              </button>
            </div>
          </div>
        )}

        {/* PILAR 3: DP / RH */}
        {(activePilar === 'ALL' || activePilar === 'DP') && (
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(168, 85, 247, 0.35)',
            borderBottom: '3px solid #7C3AED',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>👥</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                  3. Pilar DP & eSocial
                </h3>
              </div>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', border: '1px solid rgba(192, 132, 252, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900 }}>
                {pilarStats.dp.status}
              </span>
            </div>

            <div style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Colaboradores Ativos:</span>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{pilarStats.dp.colabs} Vidas CLT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Eventos eSocial (S-1200):</span>
                <span style={{ fontWeight: 800, color: '#34D399' }}>Transmitidos</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>FGTS Digital & DCTFWeb:</span>
                <span style={{ fontWeight: 700, color: '#C084FC' }}>Guias Prontas</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => handleExecutePilar('DP', 'Holerites e Espelhos de Ponto disponibilizados no Portal!')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)',
                  border: '1px solid #C084FC',
                  borderBottom: '2px solid #5B21B6',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Users size={13} /> <span>Disparar Holerites</span>
              </button>
            </div>
          </div>
        )}

        {/* PILAR 4: AUDITORIA PREVENTIVA */}
        {(activePilar === 'ALL' || activePilar === 'AUDITORIA') && (
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderBottom: '3px solid #D97706',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                  4. Pilar Auditoria & Malha Zero
                </h3>
              </div>
              <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900 }}>
                {pilarStats.auditoria.status}
              </span>
            </div>

            <div style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Monitoramento de CNDs:</span>
                <span style={{ fontWeight: 800, color: '#34D399' }}>{pilarStats.auditoria.cndScore}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Inconsistências Evitadas:</span>
                <span style={{ fontWeight: 800, color: '#FBBF24' }}>{pilarStats.auditoria.alertsFixed} alertas sanados</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Cruzamento Folha x DCTFWeb:</span>
                <span style={{ fontWeight: 700, color: '#34D399' }}>Bate no Centavo</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => handleExecutePilar('AUDITORIA', 'Varredura de CNDs e Malhas Fiscais concluída: 0 riscos!')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)',
                  border: '1px solid #FBBF24',
                  borderBottom: '2px solid #92400E',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={13} /> <span>Auditar Malha Fina</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AccountingOfficeHubView;
