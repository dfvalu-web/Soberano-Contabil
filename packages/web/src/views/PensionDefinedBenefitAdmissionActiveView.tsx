import React from 'react';

export const PensionDefinedBenefitAdmissionActiveView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏛️</span> Planos de Pensão (CPC 33) & Admissão Temporária Ativa (IN 1.600/15)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Obrigações atuariais de benefício definido e remensurações em ORA (CPC 33 / IAS 19) e suspensão tributária em aperfeiçoamento ativo e reexportação.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Avaliação Atuarial CPC 33 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Benefício Definido (CPC 33)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ATUARIAL CONFORME
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Obrigação DBO / Ativos do Plano:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 55,35M / R$ 46,21M</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Déficit Passivo no Balanço:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 9.140.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Despesa Reconhecida na DRE:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 3.340.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Remensuração Atuarial em ORA (PL):</span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>- R$ 600.000,00</span>
            </div>
          </div>
        </div>

        {/* Admissão Temporária Aperfeiçoamento Ativo */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Aperfeiçoamento Ativo</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SUSPENSÃO TOTAL 100%
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Aduaneiro CIF da Turbina:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 15.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributos Federais Suspensos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 5.875.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ICMS Importação Suspenso:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 2.700.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Tributária Total:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 8.575.500,00 de Caixa</span>
            </div>
          </div>
        </div>

        {/* Transição IFRS & REIQ Química */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>IFRS & REIQ</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Balanço IFRS 1 (CPC 37):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>PL homologado de R$ 53,58M</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>REIQ Química (Lei 14.374):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Economia de R$ 150k de PIS/COFINS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
