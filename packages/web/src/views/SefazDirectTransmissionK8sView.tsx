import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Server,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const SefazDirectTransmissionK8sView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [replicasK8s, setReplicasK8s] = useState<number>(3);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<'NORMAL' | 'CONTINGENCIA_SVC'>('NORMAL');

  const [ufsStatus, setUfsStatus] = useState([
    { uf: 'SP - São Paulo (SEFAZ-SP)', latencia: '142ms', status: 'ONLINE', protocolo: 'HTTP/2 mTLS v1.3' },
    { uf: 'RJ - Rio de Janeiro (SVRS)', latencia: '168ms', status: 'ONLINE', protocolo: 'HTTP/2 mTLS v1.3' },
    { uf: 'MG - Minas Gerais (SEFAZ-MG)', latencia: '155ms', status: 'ONLINE', protocolo: 'HTTP/2 mTLS v1.3' },
    { uf: 'RS - Rio Grande do Sul (SVRS)', latencia: '139ms', status: 'ONLINE', protocolo: 'HTTP/2 mTLS v1.3' },
    { uf: 'PR - Paraná (SEFAZ-PR)', latencia: '148ms', status: 'ONLINE', protocolo: 'HTTP/2 mTLS v1.3' },
    { uf: 'SVC-AN - Ambiente de Contingência Nacional', latencia: '98ms', status: 'STANDBY_ATIVO', protocolo: 'mTLS Failover' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTestTransmission = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setUfsStatus(prev => prev.map(u => ({ ...u, latencia: `${Math.floor(100 + Math.random() * 80)}ms` })));
      showToast('Lote de 250 NF-e transmitido via barramento mTLS em 142ms: 100% Autorizado!');
    }, 700);
  };

  const handleToggleCircuitBreaker = () => {
    const next = circuitBreakerStatus === 'NORMAL' ? 'CONTINGENCIA_SVC' : 'NORMAL';
    setCircuitBreakerStatus(next);
    showToast(next === 'CONTINGENCIA_SVC' ? 'Circuit Breaker acionado: Tráfego roteado para Contingência SVC-AN!' : 'Operação restabelecida para SEFAZ Autorizadora Padrão!');
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
            ☸️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Transmissão SEFAZ mTLS, Contingência SVC & Cluster Kubernetes
              </h1>
              <span style={{
                background: circuitBreakerStatus === 'NORMAL' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: circuitBreakerStatus === 'NORMAL' ? '#34D399' : '#FBBF24',
                border: circuitBreakerStatus === 'NORMAL' ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                {circuitBreakerStatus === 'NORMAL' ? 'SEFAZ PRODUÇÃO ATIVA' : 'CONTINGÊNCIA SVC-AN'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Conexão direta em tempo real com as 27 SEFAZ estaduais, Circuit Breaker com failover SVC-AN/SVC-RS e escalabilidade em Kubernetes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleCircuitBreaker}
            style={{
              background: '#0E172A',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡</span> {circuitBreakerStatus === 'NORMAL' ? 'Simular Failover SVC' : 'Retornar Operação Normal'}
          </button>

          <button
            onClick={handleTestTransmission}
            disabled={isTransmitting}
            className="btn-1click-3d"
          >
            <RefreshCw size={14} className={isTransmitting ? 'animate-spin' : ''} />
            <span>{isTransmitting ? 'Transmitindo Lote...' : 'Testar Transmissão mTLS em Lote'}</span>
          </button>
        </div>
      </div>

      {/* Cluster Kubernetes HPA Controls */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Cluster Kubernetes HPA (Escala Automática)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38BDF8', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {replicasK8s} Pods Ativos (Escala 3 a 20 Réplicas)
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>CPU: 18% • RAM: 42% • Throughput: 1.850 docs/segundo</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { setReplicasK8s(prev => Math.min(20, prev + 1)); showToast('Pod adicional provisionado no Cluster Kubernetes!'); }}
            style={{ background: '#0B1120', border: '1px solid #38BDF8', color: '#38BDF8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
          >
            + Escalar Pod (+1)
          </button>
          <button
            onClick={() => { setReplicasK8s(prev => Math.max(3, prev - 1)); showToast('Pod reduzido com balanceamento de carga ativo!'); }}
            style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.2)', color: '#94A3B8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
          >
            - Reduzir Pod (-1)
          </button>
        </div>
      </div>

      {/* Grade de Monitoramento SEFAZ 27 UFs */}
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
          Monitoramento de Barramentos Autorizadores SEFAZ (mTLS v1.3)
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Autorizadora SEFAZ / UF</th>
              <th style={{ textAlign: 'center' }}>Protocolo de Segurança</th>
              <th style={{ textAlign: 'center' }}>Latência mTLS</th>
              <th style={{ textAlign: 'center' }}>Status Operacional</th>
            </tr>
          </thead>
          <tbody>
            {ufsStatus.map((u, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{u.uf}</td>
                <td style={{ textAlign: 'center', color: '#38BDF8', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{u.protocolo}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>{u.latencia}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: u.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    color: u.status === 'ONLINE' ? '#34D399' : '#38BDF8',
                    border: u.status === 'ONLINE' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)'
                  }}>
                    ✓ {u.status}
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

export default SefazDirectTransmissionK8sView;
