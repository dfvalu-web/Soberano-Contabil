import React from 'react';

export const OfficeEcdEcfJuntaRegistryView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏛️</span> Escrituração Digital (ECD/ECF) & Registro na Junta Comercial
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Geração de SPED ECD (Livro Diário Geral 'G', Termos I030, Balanço J100, DRE J150 e Notas J800), assinatura digital e autenticação automática na Junta Comercial (Decreto 8.683/16).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            DECRETO 8.683/16 & DREI
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Geração da ECD SPED */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SPED Contábil (ECD)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VALIDADO PVA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tipo de Livro Contábil:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Livro Diário Geral ('G')</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Termos de Abertura / Encerramento:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Registro I030 com NIRE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Balanço (J100) & DRE (J150):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Demonstrações IFRS Amarradas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Validação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO ADVERTÊNCIAS NO PVA</span>
            </div>
          </div>
        </div>

        {/* Assinatura Digital e-CPF / e-CNPJ */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Assinaturas Digitais</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DUPLO SIGNATÁRIO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Contador Responsável (Qualif. 900):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Assinado (e-CPF A1)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Administrador / Sócio (Qualif. 206):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>✓ Assinado (e-CNPJ / e-CPF)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recibo de Entrega SPED:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Transmitido à Receita Federal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Chave de Autenticação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HASH CRIPTOGRÁFICO SHA-256</span>
            </div>
          </div>
        </div>

        {/* Autenticação Digital na Junta Comercial */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Registro na Junta (DREI)</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              VALIDADE JURÍDICA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Autenticação Automática Decreto 8.683:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Dispensa autenticação física na Junta Comercial</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Disponibilização para Licitações e Bancos:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Emissão de Livro Diário com Termo de Autenticação</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% HOMOLOGADO PERANTE O DREI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
