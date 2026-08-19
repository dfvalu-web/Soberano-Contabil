import React from 'react';

export const FractionalOwnershipMultipropriedadeRetView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏨</span> Multipropriedade Imobiliária (Lei 13.777/18), RET 4% & Pool Hoteleiro (CPC 47)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Gestão fiscal de frações de tempo imobiliárias, apuração do RET 4% com Patrimônio de Afetação e reconhecimento de receitas de hospitalidade hoteleira.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Multipropriedade & RET 4% (Lei 10.931/04) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>RET 4% (Patrimônio Afetação)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 10.931/2004
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alíquota Unificada:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>4,00% sobre Receita Mensal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Composição do Tributo:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>IRPJ 1,71% | CSLL 0,86% | PIS/COF 1,43%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segregação de Riscos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Patrimônio de Afetação Inviolável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Incorporação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>AVERBADO EM CARTÓRIO</span>
            </div>
          </div>
        </div>

        {/* Pool de Locação & Hospitalidade (CPC 47 / IFRS 15) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Pool de Locação Hoteleiro</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CPC 47 / IFRS 15
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Reconhecimento de Receita:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Ao Longo do Tempo (Over Time)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa de Administração Hoteleira:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>10% a 20% com ISSQN Municipal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Distribuição aos Coproprietários:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Rendimento Líquido Mensal Auditado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transparência Operacional:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO CONFLITO DE INTERESSE</span>
            </div>
          </div>
        </div>

        {/* Integração DIMOB & SPED ECF */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>DIMOB & SPED Fiscal</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DECLARAÇÕES OFICIAIS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>DIMOB (Declaração de Atividades Imobiliárias):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Contratos de Venda de Frações e Locações do Pool</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>SPED ECF Bloco P / M300:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Segregação de Receitas RET Fora do Lucro Real Regular</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
