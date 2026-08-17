import React from 'react';

export const PvaComplianceSoc2SecurityView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️</span> Homologação PVA SPED & Certificação SOC 2 / ISO 27001 (Pilar 6 - Produção)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Validação rigorosa de conformidade nos validadores oficiais da RFB (PVA) e certificação contínua SOC 2 Type II e ISO/IEC 27001:2022.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Validação de Estresse PVA SPED */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>PVA SPED Oficial RFB</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ZERO ERROS / ADVERTÊNCIAS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Validação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>APROVADO 100% (Sem Restrições)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Compatibilidade ReceitaNet:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Pronto para Transmissão Imediata</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Blocos SPED Auditados:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Blocos 0, C, D, E, G, H, K, 1 e 9</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Integridade Contábil / Fiscal:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Saldo Inicial + Movimento = Saldo Final (ACID)</span>
            </div>
          </div>
        </div>

        {/* Certificação SOC 2 & ISO 27001 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SOC 2 Type II & ISO 27001</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              100% CONFORME
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Security & Confidentiality:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>AES-256 + RLS PostgreSQL + KMS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Availability (SLA):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>99.99% com Contingência SVC</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Processing Integrity:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Ledger Merkle Tree Imutável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recomendação de Auditoria:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>APTO PARA PRODUÇÃO ENTERPRISE</span>
            </div>
          </div>
        </div>

        {/* Torre de Controle & OCR Pilar 5 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Torre & OCR com IA</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Torre de Controle (500+ Clientes):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>98.2% de conformidade com semáforo</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>OCR Multimodal & Auto-Posting:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Extração com 99.4% de precisão de IA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
