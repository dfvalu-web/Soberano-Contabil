import React from 'react';

export const OfficeFinancialInvestmentTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📈</span> Aplicações Financeiras & IRRF Retido Fonte
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Conciliação de extratos de CDB/Fundos, apuração de IOF regressivo, retenção de IRRF Fonte (Art. 730 RIR/18) e compensação no IRPJ/CSLL.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CPC 48 / IFRS 9 • ART. 730 RIR/18
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Rendimentos e Resgates */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rendimentos Financeiros</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AGOSTO / 2026
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Principal Resgatado (CDB / Fundos):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 200.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rendimento Bruto Auferido:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+ R$ 18.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IOF Retido (Regressivo):</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>- R$ 0,00 (Prazo &gt; 30 dias)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IRRF Retido na Fonte (20%):</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>R$ 3.700,00 (COMPENSÁVEL)</span>
            </div>
          </div>
        </div>

        {/* Ativo de IRRF a Compensar & IRPJ */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ativo Tributário (IRRF)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONTA 1.1.03.001
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Saldo Acumulado de IRRF:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 14.800,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Abatimento no IRPJ Trimestral:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Compensação automática na ECF</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Informe de Rendimentos Bancário:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% conciliado c/ Razão</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Fiscal Realizada:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 14.800,00 DE DÉBITO REDUZIDO</span>
            </div>
          </div>
        </div>

        {/* Lançamentos Contábeis de Rendimentos e Resgate */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Razão & DRE (Partidas Dobradas)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AUTO-INTEGRADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Receita Financeira na DRE:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>D - Aplicações | C - Receitas Financeiras (3.1.05.001)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Liquidação do Resgate Bancário:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>D - Banco | D - IRRF a Compensar | C - Aplicações</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Conciliação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERADO E AUDITADO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
