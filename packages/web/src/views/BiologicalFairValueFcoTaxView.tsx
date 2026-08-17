import React from 'react';

export const BiologicalFairValueFcoTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🐂</span> Valor Justo Biológico (CPC 29) & Subvenções do FCO (Lei 7.827/89)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Decomposição do valor justo biológico (crescimento físico vs preço de mercado) e apuração de subvenções do FCO Centro-Oeste com isenção no LALUR.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Ativos Biológicos CPC 29 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rebanho Nelore (CPC 29)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ITEM 50 CONFORME
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rebanho Inicial (24 @/cab):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 5.016.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rebanho Final (34 @/cab):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 7.752.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho Físico (Engorda 10 @):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 2.090.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Efeito Preço (@ R$ 220 -> R$ 240):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>+ R$ 646.000,00 (Total: R$ 2,736M)</span>
            </div>
          </div>
        </div>

        {/* Subvenções do FCO Centro-Oeste */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Subvenção FCO (Centro-Oeste)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 12.973 ART. 30
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Financiamento FCO (MT/MS/GO):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 8.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Juros Mercado vs FCO com Bônus:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>14.5% vs 7.225% a.a.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subvenção Econômica de Juros:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 582.000,00 (Reserva PL)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Fiscal (Zero IRPJ/CSLL):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 197.880,00 no LALUR</span>
            </div>
          </div>
        </div>

        {/* Demonstrações Intermediárias & RECOF */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>ITR & RECOF-SPED</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Taxa Efetiva Trimestral (CPC 21):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>ETR de 29.75% no 1T/2026</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>RECOF-SPED (IN RFB 2.126):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>R$ 6,22M em suspensão de tributos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
