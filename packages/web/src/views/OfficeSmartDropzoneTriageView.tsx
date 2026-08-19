import React from 'react';

export const OfficeSmartDropzoneTriageView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📥</span> Triagem Inteligente & Dropzone Massivo
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Funil de entrada de arquivos dos clientes com triagem automática: XMLs de notas para o Fiscal, OFXs para o Contábil e Atestados/Ponto para o RH/DP.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            DROPZONE MULTI-FORMATO AUTOMATIZADO
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Dropzone de Upload Massivo */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '2px dashed #3b82f6', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>📁</div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Arraste os arquivos do cliente aqui</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Suporta .XML (NF-e/NFS-e/CT-e), .OFX (Extratos Bancários), .PDF (Atestados/ASO), .CSV (Ponto Eletrônico) e .TXT (SPED).
          </p>
          <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            Selecionar Lote de Arquivos (Batch Upload)
          </button>
        </div>

        {/* Painel de Triagem em Tempo Real */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Destino dos Documentos</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              100% ROTEADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>XMLs NF-e/NFS-e $\rightarrow$ Depto Fiscal:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>240 Arquivos Roteados</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>OFXs Extratos $\rightarrow$ Depto Contábil:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>12 Extratos Bancários</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ponto/Atestados $\rightarrow$ Depto Pessoal:</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>18 Documentos de DP</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Esteira:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>PROCESSAMENTO EM SEGUNDO PLANO ATIVO</span>
            </div>
          </div>
        </div>

        {/* Eficiência Operacional */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ganhos para o Escritório</h3>
            <span style={{ background: '#8b5cf620', color: '#8b5cf6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              PRODUTIVIDADE MÁXIMA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Zero Separação Manual de Pastas:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Classificação automática por inteligência documental</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Alimentação Direta dos Módulos:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Notas no Fiscal, Extrato na Conciliação e Atestados no DP</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo de Triagem:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>REDUÇÃO DE HORAS PARA SEGUNDOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
