import React from 'react';

export const DvaWealthJcpTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>💎</span> Demonstração do Valor Adicionado (CPC 09) & Juros s/ Capital Próprio (JCP)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Distribuição da riqueza gerada (pessoal, governo, credores e acionistas) e dedução fiscal de JCP no Lucro Real (Lei 9.249/95 e Lei 14.789/23).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Demonstração do Valor Adicionado CPC 09 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Valor Adicionado (CPC 09)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DVA CONSISTENTE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Riqueza Total a Distribuir:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 11.500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pessoal & Encargos (30.43%):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 3.500.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Governo / Impostos (34.78%):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>R$ 4.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Credores (13%) & Acionistas (21.7%):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 4.000.000,00 (Total 100%)</span>
            </div>
          </div>
        </div>

        {/* Juros sobre o Capital Próprio JCP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>JCP (Lei 9.249 / Lei 14.789)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              GANHO LÍQUIDO 19%
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PL Ajustado (excluído incentivos):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 28.000.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>JCP Dedutível (TLP 6.80% a.a.):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 1.904.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia IRPJ/CSLL (34%):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 647.360,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ganho Líquido (após 15% IRRF):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 361.760,00 de Caixa</span>
            </div>
          </div>
        </div>

        {/* FIDCs CPC 48 & CPR Agro */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>FIDCs & CPRs</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Securitização FIDC (CPC 48):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Derecognition integral de carteira cedida</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>CPRs Agro e Verde (Lei 13.986):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Isenção total de IOF e tributação regressiva</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
