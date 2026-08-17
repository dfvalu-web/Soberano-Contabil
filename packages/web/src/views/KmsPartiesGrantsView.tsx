import React from 'react';

export const KmsPartiesGrantsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔐</span> Segurança KMS, Partes Relacionadas & Subvenções
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Rotação de chaves mestras KEK/DEK, conformidade societária de mútuos (CPC 05) e apuração de crédito fiscal de 25% de subvenções (Lei 14.789).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* KMS Key Rotation */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Gerenciador de Chaves KMS</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              KEK v2 ATIVA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Algoritmo:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AES-256-GCM Envelope Encryption</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Rotação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Zero-Downtime Concluído</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DEKs Cifradas:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>100% Re-encriptadas em v2</span>
            </div>
          </div>
        </div>

        {/* Partes Relacionadas CPC 05 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Partes Relacionadas (CPC 05)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ARM'S LENGTH OK
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total de Mútuos Intercompany:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 5.800.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa Praticada vs Mercado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>11,50% vs 11,25% a.a.</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              ✓ Nota Explicativa padronizada gerada para publicação CVM
            </div>
          </div>
        </div>

        {/* Subvenções Lei 14.789/2023 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Subvenções (Lei 14.789/23)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              25% CRÉDITO IRPJ
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Crédito Fiscal de IRPJ:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>R$ 2.000.000,00 (25% de R$ 8M)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Destinação no PL:</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', marginTop: '2px' }}>Reserva de Incentivos Fiscais (Art. 195-A)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
