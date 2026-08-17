import React from 'react';

export const ControlTowerOcrLedgerView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🗼</span> Torre de Controle Contábil & OCR de Comprovantes com IA (Pilar 5 - Produção)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Painel de gestão unificada de 500+ clientes com semáforo fiscal e conversão automática de recibos/PIX em lançamentos no Ledger.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Torre de Controle Multi-Clientes */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Torre de Controle (500 Clientes)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              98.2% EM DIA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Clientes Transmitidos (Verde):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>491 empresas (SPED / DCTFWeb)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>A Vencer em 5 dias (Amarelo):</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>7 empresas (Avisadas via WhatsApp)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pendências Críticas (Vermelho):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>2 empresas (Bloqueio de Certificado)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Volume de Guias Fiscais Gerenciadas:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>R$ 14.580.000,00</span>
            </div>
          </div>
        </div>

        {/* OCR Multimodal com IA */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>OCR Multimodal & Auto-Posting</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              99.4% CONFIANÇA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Documento Lido:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Comprovante PIX Combustível</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fornecedor Reconhecido:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Posto Conveniado (CNPJ Validado)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação Contábil Automática:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>3.2.1.04 - Combustíveis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lançamento no Ledger:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>GRAVADO COM HASH MERKLE</span>
            </div>
          </div>
        </div>

        {/* Filas BullMQ & WhatsApp Pilar 4 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Filas & Mensageria</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>BullMQ / Redis (8 Workers):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Processamento assíncrono de 1k XMLs/s</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>WhatsApp Business Cloud API:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Disparo automático de DARFs e avisos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
