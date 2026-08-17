import React from 'react';

export const UncertaintyBeveragesView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>💄</span> Contratos Onerosos & Cosméticos Monofásicos
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Provisões para contratos onerosos (CPC 25 / IAS 37) e regime monofásico de cosméticos e perfumaria (Lei 10.147/00 & Dec. 8.393/15).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Contratos Onerosos CPC 25 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contratos Onerosos (CPC 25)</h3>
            <span style={{ background: '#ef444420', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PROVISÃO DE PERDAS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Custos Inevitáveis vs Benefício:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 8,0M vs R$ 5,0M</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prejuízo de Cumprimento:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 3.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Multa por Rescisão:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 2.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provisão Reconhecida (Menor Custo):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 2.000.000,00 (Rescisão)</span>
            </div>
          </div>
        </div>

        {/* Cosméticos e Perfumaria Lei 10.147 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cosméticos & Perfumaria</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 10.147 / CST 04
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Indústria / Equiparado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PIS 2,20% / COFINS 10,30%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Decreto nº 8.393/15:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Equiparação Atacadista</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Perfumarias & Salões:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CST 04 - PIS/COFINS Zero</span>
            </div>
          </div>
        </div>

        {/* Incertezas & Bebidas Frias */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Incertezas & Bebidas Frias</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Incertezas de IRPJ/CSLL (ICPC 22):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Provisão de posições tributárias improváveis</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Bebidas Frias (Lei 13.097):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Cervejarias CST 02 e varejo CST 04</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
