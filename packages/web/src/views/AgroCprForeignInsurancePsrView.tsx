import React from 'react';

export const AgroCprForeignInsurancePsrView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌾</span> CPR em Moeda Estrangeira (Lei do Agro 13.986/20) & Seguro Rural (PSR / MAPA)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Emissão de CPR Financeira em Dólar registrada na B3/Cerc, hedge cambial rural (CPC 48) e subvenção federal ao prêmio do seguro rural.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* CPR Financeira em Moeda Estrangeira */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>CPR Financeira em Dólar</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI DO AGRO 13.986/20
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Moedas Suportadas:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>USD (Dólar) e EUR (Euro)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Registro Obrigatório:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>B3 / CERC / CRDC (BACEN)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tratamento Contábil:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Hedge Cambial Natural (CPC 48 / IFRS 9)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Garantias Rurais:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Patrimônio de Afetação Rural</span>
            </div>
          </div>
        </div>

        {/* Subvenção Federal ao Prêmio do Seguro Rural (PSR / MAPA) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Seguro Rural Subvencionado</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PROGRAMA PSR (MAPA)
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subvenção Federal Direta:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Até 40% do Prêmio Pago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alíquota de IOF:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>0,00% (Decreto 6.306/07)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dedutibilidade Fiscal:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>LCDPR e e-LALUR (Prêmio Líquido)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mitigação de Clima:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PROTEÇÃO MULTIRISCO SAFRA</span>
            </div>
          </div>
        </div>

        {/* Integração LCDPR & SPED */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Escrituração Agro Digital</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LCDPR & e-LALUR
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Livro Caixa Digital Produtor Rural:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Registro Q100 de Despesas de Seguro e CPRs</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Variação Cambial da Dívida Rural:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Regime de Caixa vs Competência no e-LALUR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
