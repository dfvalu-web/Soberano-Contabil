import React from 'react';

export const OfficeCorporateGovernanceAssemblyView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏛️</span> Governança Societária, Assembleias & Livros Digitais
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Reuniões de sócios e assembleias digitais (DREI 79/81/20), atas de aprovação de contas e livros societários eletrônicos autenticados (DREI 82/21).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            IN DREI 79/20, 81/20 & 82/21
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Assembleias e Reuniões de Sócios Digitais */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Deliberações Societárias</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              AGO / REUNIÃO ANUAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Quórum de Instalação:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100% do Capital Social Presente</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aprovação de Contas da Administração:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% Unânime Favorável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Destinação do Lucro & Dividendos:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Homologado conforme Balanço DRE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Ata:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ASSINADA DIGITALMENTE (ICP-BRASIL)</span>
            </div>
          </div>
        </div>

        {/* Livros Societários Eletrônicos (DREI 82/21) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Livros Societários Digitais</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ENCADERNAÇÃO ELETRÔNICA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Livro de Registro de Quotas/Ações:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Livro nº 01 Atualizado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Livro de Transferência de Quotas/Ações:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sem alterações no período</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Livro de Atas das Reuniões de Sócios:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Termos de Abertura/Encerramento OK</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo na Junta Comercial:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>AUTENTICADO COM HASH DIGITAL</span>
            </div>
          </div>
        </div>

        {/* Publicidade Legal & Compliance */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Compliance Societário</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PROTEÇÃO AOS SÓCIOS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Exoneração de Responsabilidade dos Administradores:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Aprovação formal das contas quita a gestão do exercício</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Publicidade Legal Digital:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Dispensa de jornais de grande circulação para empresas fechadas</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>BLINDAGEM SOCIETÁRIA TOTAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
