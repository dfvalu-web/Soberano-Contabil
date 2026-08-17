import React from 'react';

export const DrexCbdcTokenizedTpftView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏛️</span> DREX Real Digital (BACEN), TPFTs Tokenizados & Smart Contracts DvP
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Plataforma de liquidação atômica Delivery versus Payment (DvP), custódia de títulos públicos tokenizados e tributação de renda fixa (CPC 48 / IFRS 9).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* DREX Real Digital & Custódia TPFT */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Custódia TPFT (DREX)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              REDE PILOTO BACEN
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Títulos Tokenizados Suportados:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Tesouro Selic, IPCA+ & Prefixado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação Contábil:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Custo Amortizado (CPC 48 / IFRS 9)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apropriação de Rendimentos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Taxa Efetiva de Juros Diária</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Custódia:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>BLINDADO EM SMART CONTRACT</span>
            </div>
          </div>
        </div>

        {/* Liquidação Atômica DvP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Liquidação Atômica DvP</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ZERO RISCO DE CONTRAPARTE
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo de Liquidação:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Delivery versus Payment (DvP)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo de Confirmação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Instantâneo (&lt; 2 segundos)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tributação IRRF Regressivo:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>22,5% a 15% Retido na Fonte</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Interoperabilidade:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>SELIC, B3 & Banco Central</span>
            </div>
          </div>
        </div>

        {/* Integração Contábil & Fiscal */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Escrituração SPED & DIRF</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              INFORME AUTOMÁTICO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>SPED ECD / ECF:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Contas de Renda Fixa e Receitas Financeiras Atualizadas</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>EFD-Reinf / DIRF:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Eventos R-4000 de Retenção na Fonte Automáticos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
