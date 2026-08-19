import React from 'react';

export const OfficeCfcResponsibilityTransferView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📜</span> Governança CFC & Termo de Transferência (Res. 1.570/19)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Emissão oficial do Termo de Transferência de Responsabilidade Técnica (Entrada/Saída de clientes), inventário de livros contábeis e custódia digital por 5 anos com Timestamp ICP-Brasil.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CONFORMIDADE ÉTICA CFC 1.570/19
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Termo de Transferência de Responsabilidade */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Termo de Transferência</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VALOR PROBATÓRIO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tipo de Transferência:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Entrada de Novo Cliente</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Contador Anterior:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CRC-SP 123456/O-0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Novo Responsável Técnico:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Soberano Contábil (CRC Ativo)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status do Termo:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ASSINADO DIGITALMENTE E NOTIFICADO</span>
            </div>
          </div>
        </div>

        {/* Checklist de Documentos e Livros Transferidos */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Inventário de Livros e Obrigações</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CHECKLIST COMPLETO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Livros Diários e Razões:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Exercícios 2021 a 2025</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SPED Fiscal & EFD Contribuições:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Recibos e Arquivos TXT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Folha, GFIP/eSocial & DCTFWeb:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Eventos S-1000/S-1299</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Certidões Negativas (CNDs):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>TODAS AS CNDS VÁLIDAS</span>
            </div>
          </div>
        </div>

        {/* Custódia Digital Permanente por 5 Anos */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Guarda Digital por 5 Anos</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ART. 1.194 CÓDIGO CIVIL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Carimbo do Tempo ICP-Brasil:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Autenticidade e datação irrefutável</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Proteção perante Fiscalizações do CRC:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Histórico preservado contra reclamações futuras</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% BLINDADO PERANTE O CRC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
