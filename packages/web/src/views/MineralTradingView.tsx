import React from 'react';

export const MineralTradingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🚢</span> Drawback Integrado, AAP / OCI & Comércio Exterior
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Desoneração de II, IPI e ICMS no Drawback (Portaria SECEX 44/2020) e Ajuste de Avaliação Patrimonial no PL com tributos diferidos (CPC 26).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Drawback Integrado */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Drawback Integrado (SECEX 44)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SUSPENSÃO ATIVA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ato Concessório:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AC-SECEX-2026-0044</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Insumos Desonerados CIF:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 10.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Exportação FOB Vinculada:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 25.000.000,00 (+150%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Tributária Total:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 6.175.000,00</span>
            </div>
          </div>
        </div>

        {/* AAP & Outros Resultados Abrangentes */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>AAP & OCI no PL (CPC 26)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DRA CONCILIADO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>AAP Bruto (Forex + Hedge):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 4.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributos Diferidos (34%):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 1.360.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>AAP Líquido no Patrimônio Líquido:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 2.640.000,00</span>
            </div>
          </div>
        </div>

        {/* Recursos Minerais CPC 34 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Recursos Minerais & Tradings</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MINERAÇÃO & DU-E
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Jazidas Minerais (CPC 34):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Transferido para Ativo em Produção</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Exportação Indireta (LC 87/96):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Controle estrito de 180 dias da DU-E</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
