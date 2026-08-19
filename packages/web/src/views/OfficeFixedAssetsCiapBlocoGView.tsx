import React from 'react';

export const OfficeFixedAssetsCiapBlocoGView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏭</span> Ativo Imobilizado (CPC 27) & CIAP Bloco G
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestão patrimonial de ativos, depreciação linear/acelerada, vida útil econômica, teste de recuperabilidade (CPC 01) e apropriação de 1/48 avos de ICMS no CIAP.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            CPC 27 / CPC 01 & SPED BLOCO G
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Ativo Imobilizado & Depreciação (CPC 27) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Depreciação Patrimonial</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              MÉTODO LINEAR
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Custo Total de Aquisição do Imobilizado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 1.250.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cota Mensal de Depreciação (CPC 27):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 10.416,67</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Depreciação Acumulada no Período:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 250.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Valor Contábil Líquido (VCL):</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 1.000.000,00</span>
            </div>
          </div>
        </div>

        {/* CIAP & Créditos 1/48 avos de ICMS (Bloco G) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>CIAP (Bloco G SPED)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              1/48 AVOS ICMS
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fator de Apropriação Mensal:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>88,50% (Saídas Trib. / Total)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bens em Apropriação Ativa:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>12 Máquinas Fabris</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crédito ICMS Apropriado no Mês:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 4.425,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Escrituração SPED:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>REGISTROS G110/G125 VÁLIDOS</span>
            </div>
          </div>
        </div>

        {/* Teste de Impairment & Controle Patrimonial */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Impairment & Placas</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CPC 01 REVISADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Teste de Impairment Anual (CPC 01):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Valor recuperável superior ao contábil (Sem perdas)</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Emplacamento e Tombamento com QR Code:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Inventário físico rastreável por smartphone</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria Contábil:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONFORMIDADE IFRS COMPLETA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
