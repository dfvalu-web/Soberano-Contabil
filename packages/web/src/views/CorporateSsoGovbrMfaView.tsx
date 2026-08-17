import React from 'react';

export const CorporateSsoGovbrMfaView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔑</span> SSO Corporativo (Azure/Okta), Login Gov.br & MFA FIDO2 Passkeys
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Federação de identidades corporativas (SAML 2.0 / OIDC), níveis Prata/Ouro do Gov.br e autenticação criptográfica WebAuthn resistente a phishing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* SSO Corporativo */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SSO Federado (Azure AD / Okta)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SAML 2.0 / OIDC ATIVO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provedor de Identidade:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Azure Active Directory (Entra ID)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provisionamento:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Just-in-Time (JIT) com RBAC</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Compliance:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>SOC 2 Tipo II & ISO 27001</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sessão Unificada:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Single Logout (SLO) Habilitado</span>
            </div>
          </div>
        </div>

        {/* Login Único Gov.br & FIDO2 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Gov.br Ouro & FIDO2 Passkeys</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MFA CRIPTOGRÁFICO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nível Confiabilidade Gov.br:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>NÍVEL OURO (ICP-Brasil / TSE)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Poderes Tributários:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Assinatura SPED & DCTFWeb</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>MFA Hardware Key:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>FIDO2 / WebAuthn / TouchID</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Proteção contra Phishing:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% Criptográfico sem Senhas</span>
            </div>
          </div>
        </div>

        {/* Transmissão SEFAZ mTLS & K8s */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SEFAZ & K8s Prod</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>SEFAZ Real-Time mTLS:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Circuit breaker com contingência SVC-AN</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Kubernetes Cluster HPA:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Escala automática de 3 a 20 réplicas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
