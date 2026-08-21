import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';
import React, { useState, useMemo } from 'react';
import {
  Activity,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Layers,
  FileCheck,
  RefreshCw,
  Play,
  CheckCircle2,
  Filter,
  DollarSign,
  Download,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [selectedRegime, setSelectedRegime] = useState<string>('ALL');
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [notification, setNotification] = useState<string | null>(null);

  // Alertas dinâmicos com resolução interativa
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Divergência de ICMS-ST em NF-e de Entrada (Fornecedor SP)', severity: 'MEDIA', status: 'PENDENTE', economy: 1450.00 },
    { id: 2, title: 'Item monofásico de PIS/COFINS tributado indevidamente no Simples', severity: 'ALTA', status: 'PENDENTE', economy: 3280.40 },
    { id: 3, title: 'Fechamento S-1299 eSocial sem DARF Previdenciário emitido', severity: 'BAIXA', status: 'RESOLVIDO', economy: 0.00 }
  ]);

  // Score dinâmico
  const scoreFiscal = useMemo(() => {
    const pendingCount = alerts.filter(a => a.status === 'PENDENTE').length;
    if (pendingCount === 0) return 100;
    if (pendingCount === 1) return 98.4;
    return 94.2;
  }, [alerts]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleResolveAlert = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVIDO' } : a));
    showToast('Inconsistência fiscal corrigida e ajustada nas apurações com sucesso!');
  };

  const handleRunFullScan = () => {
    setIsScanning(true);
    setScanProgress(20);
    setTimeout(() => setScanProgress(60), 400);
    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      showToast('Varredura completa do SPED PVA & Malhas Fiscais concluída: 100% Regular!');
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {/* Toast Notification */}
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

      {/* Header com Identidade 3D 4K */}
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
                Cockpit Fiscal & Contábil Autônomo
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
                PIPELINE ZERO-TOUCH ATIVO
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Monitoramento em tempo real de conformidade SPED, apuração híbrida e esteira DF-e de alta velocidade.
            </p>
          </div>
        </div>

        {/* Controles de Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SmartPeriodPicker compact={true} />

          <button
            onClick={handleRunFullScan}
            disabled={isScanning}
            className="btn-1click-3d"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            <span>{isScanning ? 'Varrendo PVA...' : 'Executar Varredura SPED'}</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas e KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Score Fiscal Pre-Flight</span>
            <ShieldCheck size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {scoreFiscal}%
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
            Validação algorítmica sem pendências impeditivas
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>DF-e Ingeridos (Zero-Touch)</span>
            <Zap size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            14.820 NFs
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
            99.2% contabilizados automaticamente
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(168, 85, 247, 0.35)', borderBottom: '3px solid #7C3AED', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Tributos Apurados</span>
            <TrendingUp size={16} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#C084FC', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            R$ 482.350
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
            DAS, DCTFWeb e IRPJ/CSLL
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(245, 158, 11, 0.35)', borderBottom: '3px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Obrigações SPED</span>
            <FileCheck size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            5 / 5 Prontas
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
            ECD, ECF, EFD-ICMS & Reinf
          </div>
        </div>
      </div>

      {/* Radar de Inconsistências com Correção 1-Click */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Central de Diagnóstico & Correção Fiscal Interativa
            </h3>
            <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.74rem' }}>
              Detectores de malhas fiscais preditivas com resolução em 1-Click e proteção de caixa.
            </p>
          </div>
          <button
            onClick={() => {
              setAlerts(prev => prev.map(a => ({ ...a, status: 'RESOLVIDO' })));
              showToast('Todos os alertas fiscais foram saneados com sucesso!');
            }}
            style={{
              background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
              border: '1px solid #34D399',
              color: '#FFFFFF',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> <span>Resolver Todos 1-Click</span>
          </button>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Diagnóstico / Inconsistência</th>
              <th style={{ textAlign: 'center' }}>Severidade</th>
              <th style={{ textAlign: 'right' }}>Economia / Risco Evitado</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação Corretiva</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.title}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.severity === 'ALTA' ? 'rgba(239, 68, 68, 0.2)' : item.severity === 'MEDIA' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    color: item.severity === 'ALTA' ? '#FCA5A5' : item.severity === 'MEDIA' ? '#FDE68A' : '#BAE6FD'
                  }}>
                    {item.severity}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>
                  {item.economy > 0 ? item.economy.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Protegido'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.status === 'RESOLVIDO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: item.status === 'RESOLVIDO' ? '#34D399' : '#FBBF24',
                    border: item.status === 'RESOLVIDO' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    {item.status === 'RESOLVIDO' ? '✓ Resolvido' : '⏳ Pendente'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {item.status === 'PENDENTE' ? (
                    <button
                      onClick={() => handleResolveAlert(item.id)}
                      style={{
                        background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.70rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Corrigir 1-Click
                    </button>
                  ) : (
                    <span style={{ color: '#34D399', fontSize: '0.72rem', fontWeight: 800 }}>✓ Regularizado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Dossiê Executivo Diamante para Impressão & Conformidade A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">RELATÓRIO EXECUTIVO CONSOLIDADO</div>
              <div className="diamond-subtitle">Painel de Conformidade e Performance Fiscal & Contábil • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
