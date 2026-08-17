import React from 'react';

export const CloudHsmPfxVaultView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔐</span> Certificados ICP-Brasil em Nuvem (Cloud HSM) & Cofre A1 PFX (Pilar 3 - Produção)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Assinatura digital remota em nuvem (BirdID, NeoID, SafeID e VIDaaS) e cofre criptografado AES-256-GCM para certificados corporativos A1.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Cloud HSM ICP-Brasil */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cloud HSM (BirdID / NeoID)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ICP-BRASIL EM NUVEM
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provedor Conectado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>BirdID Soluti / NeoID SERPRO</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Autenticação Segura:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>OAuth2 PKCE com OTP Push</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dependência de Token USB:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>ZERO (100% Remoto e Seguro)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Algoritmo de Assinatura:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>SHA256withRSA (XMLDSig)</span>
            </div>
          </div>
        </div>

        {/* Cofre A1 PFX Vault */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cofre Criptográfico A1 PFX</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AES-256-GCM & KMS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Envelope Encryption:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Chave Mestre KMS Dedicada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rotinas Automáticas Noturnas:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>HABILITADAS (Emissão em Lote)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança de Senhas:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Cifrada em Repouso e em Trânsito</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria de Acessos:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Registrada no Ledger Merkle</span>
            </div>
          </div>
        </div>

        {/* PostgreSQL RLS & Storage S3 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>PostgreSQL & S3 WORM</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Isolamento Multi-Tenant:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Row Level Security nativo no PostgreSQL</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Cofre de Retenção WORM:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Bloqueio de exclusão por 5 anos (CTN)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
