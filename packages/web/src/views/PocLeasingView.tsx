import React from 'react';

export const PocLeasingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏢</span> Phantom Shares, Bônus Executivos & Permutas Imobiliárias
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Remuneração cash-settled reavaliada a valor justo (CPC 10 / IFRS 2) e não incidência de tributos em permuta sem torna (Tema 1.098 STJ).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Phantom Shares CPC 10 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Phantom Shares (CPC 10)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CASH-SETTLED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Plano de Bônus:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100.000 Phantom Shares</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vesting Decorrido:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>24 de 36 meses (66,67%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Justo Atual (Mercado):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 45,00 / ação</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provisão no Passivo Exigível:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 3.000.000,00</span>
            </div>
          </div>
        </div>

        {/* Permuta Imobiliária STJ 1.098 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Permuta de Imóveis (STJ 1.098)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SEM TORNA = TRIBUTO ZERO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Imóvel Entregue (Terreno):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 10.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Imóveis Recebidos (Unidades):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 10.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributação Federal STJ:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 0,00 (Não Incidência)</span>
            </div>
          </div>
        </div>

        {/* Contratos POC & Locação */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Contratos POC & Locação</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Construção Civil POC (CPC 47):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Ativos e passivos de contrato conciliados</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Locação de Bens (STF 31):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Não incidência de ICMS e ISS em remessas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
