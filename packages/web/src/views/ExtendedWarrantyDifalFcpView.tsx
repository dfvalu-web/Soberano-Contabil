import React from 'react';

export const ExtendedWarrantyDifalFcpView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️</span> Garantias Estendidas (CPC 25/47) & DIFAL Não Contribuinte com FCP (LC 190/22)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Provisões atuariais de garantia a valor presente (CPC 25), receita diferida (CPC 47) e ICMS DIFAL com base de cálculo dupla para e-commerce.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Garantias Estendidas CPC 25 / CPC 47 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Garantias (CPC 25 vs 47)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AVP & DIFERIMENTO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Volume de Vendas:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 1.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Garantia de Fábrica (CPC 25):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 28.665,03 (Passivo Presente)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Garantia Estendida (CPC 47):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 1.000.000,00 (Receita Diferida)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apropriação Mensal DRE:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 41.666,67 / mês (24 meses)</span>
            </div>
          </div>
        </div>

        {/* DIFAL Não Contribuinte LC 190/22 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>DIFAL & FCP (Base Dupla)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LC 190/2022
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Operação Interestadual:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SP ➔ BA (R$ 10.000,00)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Base de Cálculo Dupla Destino:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 11.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DIFAL Líquido Destino:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 1.370,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total GNRE (DIFAL + FCP 2%):</span>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>R$ 1.600,00 (Guia Emitida)</span>
            </div>
          </div>
        </div>

        {/* NDF Hedge & Split Payment */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>NDF & Split Payment</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>NDF Forex Hedge (CPC 48):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Contabilidade de cobertura em DRA/PL</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Split Payment IBS/CBS:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Liquidação bancária no BACEN/PIX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
