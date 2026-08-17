import React from 'react';

export const BepsGlobeQdmttTaxTreatyView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌐</span> BEPS GloBE Pilar 2 (QDMTT 15%) & Acordos de Bitributação (ADT / ECF X340)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Tributação mínima global da OCDE (IN RFB 2.228/24), apuração de Top-Up Tax e compensação de imposto pago no exterior via tratados internacionais.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* BEPS GloBE Pilar 2 QDMTT */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>GloBE Pilar 2 (QDMTT)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ALÍQUOTA MÍNIMA 15%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Limiar de Receita Global:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>&ge; 750 Milhões de Euros</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mecanismo de Arrecadação:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>QDMTT Nacional (IN RFB 2.228/24)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Top-Up Tax Apurado:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Cálculo ETR Jurisdicional</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status OCDE:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONFORME REGRAS MODELO</span>
            </div>
          </div>
        </div>

        {/* Acordos de Bitributação (ADT / TIEA) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Tratados Bilaterais (ADT)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ART. 26 LEI 12.973
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Países com Tratado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Espanha, França, Portugal, etc.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aproveitamento de Crédito:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Limitado a 34% IRPJ/CSLL Brasil</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Escrituração Digital:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>SPED ECF Registros X340 / X350</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Blindagem Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Zero Risco de Dupla Tributação</span>
            </div>
          </div>
        </div>

        {/* SPED ECF Bloco X */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SPED ECF Bloco X</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              OPERAÇÕES EXTERIOR
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Registro X340:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Identificação de Filiais, Coligadas e Controladas no Exterior</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Registro X350:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Demonstração de Resultados e Tributos Pagos no Exterior</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
