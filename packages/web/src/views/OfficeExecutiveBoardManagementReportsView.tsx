import React from 'react';

export const OfficeExecutiveBoardManagementReportsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📊</span> Relatórios Gerenciais & Contabilidade Consultiva (Diretoria / Sócios)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            DRE Gerencial com EBITDA, análise vertical/horizontal, índice de margem de contribuição e simulação de Ponto de Equilíbrio (Break-Even Point).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CONTABILIDADE CONSULTIVA • ADVISORY
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* DRE Gerencial & EBITDA */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>DRE Executiva & EBITDA</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MARGEM 22.5%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Receita Líquida do Mês:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 420.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Bruto Operacional:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 189.000,00 (45.0%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EBITDA (Geração de Caixa):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 94.500,00 (22.5%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lucro Líquido Final:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 72.400,00 (17.2%)</span>
            </div>
          </div>
        </div>

        {/* Margem de Contribuição & Break-Even Point */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ponto de Equilíbrio</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SUPERAVITÁRIA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Índice Margem de Contribuição:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>42.0%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Custos Fixos Mensais:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 94.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Faturamento Mínimo (Break-Even):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 225.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Margem de Segurança:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>46.4% ACIMA DO ZERO A ZERO</span>
            </div>
          </div>
        </div>

        {/* Diagnóstico Tributário & Carga Efetiva */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Tax Health & Advisory</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              OPÇÃO OTIMIZADA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Carga Tributária Efetiva:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>11.2% sobre a Receita Bruta (Simples Anexo III)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Economia Tributária Anual Estimada:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>R$ 48.000,00 vs Lucro Presumido</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apresentação aos Sócios:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>DOSSIÊ EM PDF PRONTO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
