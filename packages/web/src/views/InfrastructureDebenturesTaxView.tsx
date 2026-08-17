import React from 'react';

export const InfrastructureDebenturesTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏗️</span> Debêntures de Infraestrutura (Lei 14.801/24 & 12.431/11)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Emissão incentivada em projetos prioritários, exclusão adicional de 30% de juros no e-LALUR (concessionárias) e isenção de IRRF para não residentes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Debêntures Lei 14.801/24 (Super-Dedução) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Super-Dedução 130% (e-LALUR)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 14.801/2024
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dedução Contábil Ordinária:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100% dos Juros como Despesa Financeira</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Exclusão Fiscal Adicional:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>+ 30% dos Juros no Bloco M300</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Base Total Dedutível:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>130% do Custo da Dívida</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Economia Tributária Efetiva:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Redução Direta de IRPJ e CSLL</span>
            </div>
          </div>
        </div>

        {/* Investidores Não Residentes (Lei 12.431/11) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Não Residentes (Lei 12.431)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ALÍQUOTA 0,00% IRRF
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Investidores Estrangeiros:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Isenção Total de IRRF</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Paraísos Fiscais:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>15% Tributação na Fonte</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Atração de Capital Global:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Fundos Soberanos e Pensão Globais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conformidade BACEN / CVM:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Resolução CMN 4.373</span>
            </div>
          </div>
        </div>

        {/* Setores Prioritários Elegíveis */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Setores Elegíveis</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MINISTÉRIO DOS TRANSPORTES / MINAS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Saneamento Básico & Rodovias:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Concessões e Parcerias Público-Privadas (PPPs)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Energia Renovável & Portos:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Linhas de transmissão e terminais de uso privado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
