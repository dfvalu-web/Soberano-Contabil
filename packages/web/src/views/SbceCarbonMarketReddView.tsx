import React from 'react';

export const SbceCarbonMarketReddView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌿</span> Mercado de Carbono Regulado (SBCE), Créditos REDD+ & Ativos Ambientais
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sistema Brasileiro de Comércio de Emissões (Lei do Carbono), Cotas Brasileiras de Emissão (CBE), créditos REDD+ e desoneração fiscal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* SBCE Mercado Regulado */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SBCE Mercado Regulado</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              &gt; 25.000 tCO2e/ANO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ativo Regulado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Cota Brasileira de Emissão (CBE)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação Contábil:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Ativo Intangível (CPC 04 / IAS 38)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Compensação de Déficit:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Entrega Anual no Registro Central</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade Regulatória:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% HOMOLOGADO SBCE</span>
            </div>
          </div>
        </div>

        {/* Créditos REDD+ Jurisdicionais */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Créditos REDD+ Jurisdicional</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DESMATAMENTO EVITADO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PIS / COFINS:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>ISENÇÃO LEGAL (0,00%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributação de Ganho de Capital:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>15% Alíquota Definitiva</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Jurisdições Ativas:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Amazonas, Pará, Mato Grosso, etc.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Marco Legal do Carbono Aprovado</span>
            </div>
          </div>
        </div>

        {/* Registro Central & Rastreabilidade */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Registro Central & Auditoria</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RASTREABILIDADE SHA-256
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Aposentadoria de Créditos:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Baixa irrevogável no Ledger para meta líquida zero</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Dupla Contagem:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Blindado contra dupla reivindicação internacional</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
