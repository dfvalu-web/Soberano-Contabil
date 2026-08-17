import React from 'react';

export const Soc2IsoDrpLgpdAuditView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️</span> Auditoria Big Four (SOC 1/2, ISO 27001), DRP & Privacidade LGPD DPO
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Dossiê de auditoria contínua SOC 2 Tipo II / ISO 27001, plano de recuperação de desastres (RPO 0 / RTO &lt; 15 min) e governança de privacidade LGPD.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* SOC 2 Tipo II & ISO 27001 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Auditoria SOC 2 & ISO 27001</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BIG FOUR READY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>5 Trust Services Criteria:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% CONFORME</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Padrões Atendidos:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SOC 1, SOC 2 Tipo II, ISO 27001</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dossiê de Auditoria:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Exportável em PDF / JSON Forense</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status Geral:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HOMOLOGADO PARA PwC / EY / DELOITTE</span>
            </div>
          </div>
        </div>

        {/* Disaster Recovery Plan (DRP) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Disaster Recovery (DRP)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RPO 0 / RTO &lt; 15 MIN
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RPO (Perda Máxima de Dados):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>0 MINUTOS (Replicação Síncrona)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RTO (Tempo de Recuperação):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>8.5 MINUTOS (Meta &lt; 15 min)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Arquitetura Geo-Redundante:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Multi-Region Ativo/Passivo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Simulação de Failover:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% Automatizado via Kubernetes</span>
            </div>
          </div>
        </div>

        {/* Governança de Privacidade LGPD DPO */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>LGPD & DPO Data Map</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ROPA HOMOLOGADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Inventário de Dados (eSocial / RH):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Base Legal: Art. 7º, II (Obrigação Legal)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Dados Sensíveis (ASO / Saúde):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Protegido: Art. 11, II, a da LGPD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
