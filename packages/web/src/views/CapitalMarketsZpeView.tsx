import React from 'react';

export const CapitalMarketsZpeView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📈</span> Mercado de Capitais, ZPE & Transição Energética
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Simulação de LPA Básico e Diluído (CPC 41), desonerações aduaneiras de ZPE (Lei 11.508) e créditos tributários de Energia Solar (Lei 14.300).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Mercado de Capitais - LPA */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Lucro por Ação (CPC 41)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CVM / B3 Standard
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LPA Básico (1M Ações Ordinárias)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>R$ 4,5000 / ação</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>Lucro Ordinário: R$ 4.500.000,00</div>
            </div>

            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LPA Diluído (com 100k Stock Options)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', marginTop: '4px' }}>R$ 4,0909 / ação</div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>Efeito Dilutivo: -9,09% no LPA</div>
            </div>
          </div>
        </div>

        {/* Zonas de Exportação (ZPE) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Incentivo Fiscal ZPE (Lei 11.508)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              100% SUSPENSÃO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ZPE Habilitada:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ZPE do Pecém (Ceará)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PIS/COFINS Interno Suspenso:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 925.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IPI Interno Suspenso:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 1.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>II + PIS/COFINS Importação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 2.575.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-primary)' }}>Total Desoneração ZPE:</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>R$ 4.500.000,00</span>
            </div>
          </div>
        </div>

        {/* Energia Renovável GD */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Energia Solar & GD (Lei 14.300)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              BENEFÍCIO ESG
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Isenção ICMS Tarifa TE (Conv. 16/15):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>R$ 108.000,00 / ano</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Crédito PIS/COFINS CAPEX Usina (9,25%):</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', marginTop: '2px' }}>R$ 185.000,00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
