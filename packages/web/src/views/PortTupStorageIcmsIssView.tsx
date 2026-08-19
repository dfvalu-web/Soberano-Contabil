import React from 'react';

export const PortTupStorageIcmsIssView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🚢</span> Portos, Terminais TUP (Lei 12.815/13), IFRS 16 & Armazenagem ISSQN
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Gestão de Terminais de Uso Privado e Arrendamentos ANTAQ, contabilidade de direito de uso (IFRS 16) e resolução tributária de Capatazia e Armazenagem.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Terminais TUP & Arrendamento ANTAQ (IFRS 16) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Arrendamento Portuário (IFRS 16)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 12.815/13 & ANTAQ
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Outorga Portuária:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>TUP & Arrendamento Público</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ativo de Direito de Uso:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Valor Presente dos Berços e Cais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Amortização Contábil:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Linear durante Prazo de Concessão</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Regulação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HOMOLOGADO ANTAQ</span>
            </div>
          </div>
        </div>

        {/* Resolução de Conflito ICMS vs ISSQN */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Capatazia & Armazenagem</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LC 116/03 SUBITEM 20.01
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Incidência Tributária:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>ISSQN Municipal (2% a 5%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ICMS Armazenagem:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Não Incidência (Súmula 166 STJ)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Operações Alfandegadas:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Recintos Alfandegados e Portos Secos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>BLINDAGEM CONTRA BITRIBUTAÇÃO</span>
            </div>
          </div>
        </div>

        {/* Integração Aduaneira & Receita Federal */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Siscomex & DU-E / DUIMP</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PORTAL ÚNICO SISCOMEX
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Controle de Atracação & Carga:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Integração com CCT Importação e Exportação</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Tarifa de Praticagem Portuária:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Dedução regular e retenção na fonte conforme normas DPC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
