import React from 'react';

export const InterimReportingRecofSpedView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📊</span> Demonstrações Intermediárias (CPC 21 / ITR) & RECOF-SPED (IN RFB 2.126/22)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Taxa efetiva anual estimada de IRPJ/CSLL em balanços trimestrais (CPC 21 / IAS 34) e suspensão total de tributos no RECOF-SPED com Bloco K.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Demonstrações Intermediárias CPC 21 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Taxa Efetiva ITR (CPC 21)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ETR PONDERADA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Contábil 1T/2026:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 4.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Anual Esperado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 16.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa Efetiva Estimada (ETR):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>29.75% (em vez de 34% nominal)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Despesa IRPJ/CSLL Trimestral:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 1.190.000,00 (Líquido: R$ 2,81M)</span>
            </div>
          </div>
        </div>

        {/* Regime Aduaneiro RECOF-SPED */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>RECOF-SPED (Entreposto)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              IN RFB 2.126/22
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Insumos Importados + Nacionais:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 15.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributos Federais Suspensos:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 4.427.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ICMS Importação Suspenso:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 1.800.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho Total de Caixa:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 6.227.500,00 de Suspensão</span>
            </div>
          </div>
        </div>

        {/* Moeda Estrangeira & Agro PIS/COFINS */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Moeda & Agro</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Conversão CPC 02 (CTA no PL):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Diferença cambial em outros resultados</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Crédito Presumido Agro (Leis 10.925/12.058):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>PIS/COFINS ressarcível via PER/DCOMP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
