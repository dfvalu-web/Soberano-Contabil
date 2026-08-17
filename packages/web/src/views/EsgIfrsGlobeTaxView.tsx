import React from 'react';

export const EsgIfrsGlobeTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌍</span> IFRS S1/S2 (Sustentabilidade ESG) & Imposto Mínimo Global (OCDE Pilar 2)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Relatórios de riscos climáticos e sustentabilidade (CVM 193/23) e apuração do Top-up Tax / QDMTT 15% (MP 1.262/24 GloBE).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* IFRS S1 & S2 ESG CVM 193 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Sustentabilidade (IFRS S1 & S2)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CVM 193/2023
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Emissões GEE (Escopos 1 + 2 + 3):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>45.000 tCO2e</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Intensidade de Carbono:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>45 tCO2e / R$ Milhão</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Receita Verde Alinhada (Taxonomia):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>35% (R$ 350.000.000,00)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status Conformidade ISSB/CVM:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>TOTALMENTE CONFORME</span>
            </div>
          </div>
        </div>

        {/* Imposto Mínimo Global GloBE OCDE Pilar 2 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Imposto Mínimo Global (Pilar 2)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MP 1.262 / QDMTT
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro GloBE no Brasil:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 100.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alíquota Efetiva Apurada (ETR):</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>11,50% (Piso Mínimo 15,00%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Top-up Tax Adicional CSLL (3,5%):</span>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>R$ 3.500.000,00</span>
            </div>
          </div>
        </div>

        {/* Open Finance & Auditoria Cruzada */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Open Finance & SPED</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Open Finance mTLS (BACEN):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Sincronização bancária direta e Merkle Tree</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Auditoria Cruzada (DF-e vs EFD):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Zero notas omitidas e blindagem fiscal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
