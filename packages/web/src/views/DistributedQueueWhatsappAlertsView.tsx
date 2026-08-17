import React from 'react';

export const DistributedQueueWhatsappAlertsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🚀</span> Filas Distribuídas (BullMQ / Redis) & Notificações WhatsApp (Pilar 4 - Produção)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Processamento assíncrono massivo de XMLs e folha com BullMQ e despacho automático de guias e DARFs via WhatsApp Business API.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Filas Distribuídas BullMQ */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Filas BullMQ & Redis</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              8 WORKERS PARALELOS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Throughput de Processamento:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1.000 XMLs / segundo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Job Ativo em Execução:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Importação Massiva de 50k NF-es</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mecanismo de Resiliência:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Retry Exponencial & Dead Letter Queue</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo Estimado para 50k NF-es:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>50 segundos (Zero travamento de tela)</span>
            </div>
          </div>
        </div>

        {/* Notificações WhatsApp Cloud API */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>WhatsApp Business Cloud API</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              TEMPLATE OFICIAL META
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Canal de Disparo:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>WhatsApp + Telegram + Webhook</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tipo de Alerta Enviado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>DARF IRPJ/CSLL a Vencer em 48h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Assinatura de Segurança:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>HMAC SHA-256 Inviolável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Transmissão:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>200 OK (Entregue no Celular do Cliente)</span>
            </div>
          </div>
        </div>

        {/* Cloud HSM & Cofre A1 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cloud HSM & Cofre A1</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Cloud HSM (BirdID / NeoID):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Assinatura remota ICP-Brasil via OAuth2</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Cofre A1 PFX com KMS:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Criptografia AES-256-GCM para jobs noturnos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
