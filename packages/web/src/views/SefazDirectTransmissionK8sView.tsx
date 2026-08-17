import React from 'react';

export const SefazDirectTransmissionK8sView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌐</span> Transmissão SEFAZ mTLS, Contingência SVC & Cluster Kubernetes
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Conexão direta em tempo real com as 27 SEFAZ estaduais, Circuit Breaker com failover SVC-AN/SVC-RS e escalabilidade em Kubernetes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* SEFAZ Direct Transmission */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SEFAZ mTLS Real-Time</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              27 UFs ONLINE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ambiente Governamental:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PRODUÇÃO SEFAZ NACIONAL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Latência Média de Resposta:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>180 ms (HTTP/2 mTLS)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Circuit Breaker:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>FECHADO (Operação Normal)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Failover Automático:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>SVC-AN / SVC-RS / EPEC Ativo</span>
            </div>
          </div>
        </div>

        {/* Cluster Kubernetes & Docker Produção */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Kubernetes Cluster HPA</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AUTO-SCALING 3-20 PODS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pods Mínimos / Máximos:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>3 réplicas (escala até 20)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Trigger HPA (CPU / RAM):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>75% CPU / 80% Memória</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ingress Controller:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Nginx + Let's Encrypt TLS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Banco & Cache Prod:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PostgreSQL 16 pgvector + Redis</span>
            </div>
          </div>
        </div>

        {/* Pensão CPC 33 & Aperfeiçoamento Ativo */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Pensão & Admissão</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Benefício Definido (CPC 33):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Déficit passivo de R$ 9,14M e ORA de R$ 600k</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Aperfeiçoamento Ativo (IN 1.600):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Suspensão de R$ 8,57M de tributos aduaneiros</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
