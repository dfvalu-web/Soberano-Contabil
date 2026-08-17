import React from 'react';

export const ForeignCurrencyAgroPisCofinsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌐</span> Conversão de Moeda Estrangeira (CPC 02) & Crédito Presumido Agro (PIS/COFINS)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Consolidação de subsidiárias internacionais com ajuste de conversão (CTA no PL) e crédito presumido agropecuário (Leis 10.925/04 e 12.058/09).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Conversão de Moeda Estrangeira CPC 02 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Conversão de Moeda (CPC 02)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CTA NO PL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subsidiária no Exterior:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Soberano Global LLC (USD)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ativos Convertidos (R$ 5,60):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 28.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Líquido DRE (R$ 5,35):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 2.675.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ajuste Acumulado de Conversão (CTA):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>- R$ 875.000,00 (Reserva no PL)</span>
            </div>
          </div>
        </div>

        {/* Crédito Presumido Agro PIS/COFINS */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Crédito Presumido Agro</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEIS 10.925 & 12.058
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Compras Produtor Rural PF:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 5.000.000,00 (Grãos / Carnes)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PIS Presumido (0.99%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 49.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>COFINS Presumido (4.56%):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 228.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Ressarcível (PER/DCOMP):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 277.500,00 de Crédito</span>
            </div>
          </div>
        </div>

        {/* Segmentos CPC 22 & Amazônia ALC */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Segmentos & ALC</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Segmentos CODM (CPC 22):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Regra dos 75% de cobertura de receita</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Amazônia Ocidental & ALC:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Isenção IPI e crédito presumido ICMS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
