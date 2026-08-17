import React from 'react';

export const PerpetualAutoPartsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🍺</span> Incertezas Fiscais & Bebidas Frias
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Incertezas sobre tratamentos de tributos sobre o lucro (ICPC 22 / IFRIC 23) e regime monofásico de bebidas frias (Lei 13.097/15).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Incertezas Tributárias ICPC 22 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Incertezas Tributárias (ICPC 22)</h3>
            <span style={{ background: '#ef444420', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RISCO IRPJ/CSLL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tratamento Analisado:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Ágio com Empresa Veículo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Probabilidade Aceitação Fisco:</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>35% (Improvável Aceitação)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Método de Mensuração:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Valor Mais Provável</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Passivo Adicional Reconhecido:</span>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>R$ 10.000.000,00 (DRE)</span>
            </div>
          </div>
        </div>

        {/* Bebidas Frias Lei 13.097 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Bebidas Frias (Lei 13.097/15)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CERVEJAS & BARES
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cervejaria / Indústria:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PIS 2,32% / COFINS 10,68%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Refrigerantes:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PIS 1,86% / COFINS 8,54%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bares, Mercados & Varejo:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CST 04 - PIS/COFINS Zero</span>
            </div>
          </div>
        </div>

        {/* Títulos Perpétuos & Autopeças */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Perpétuos & Autopeças</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Debêntures Perpétuas (CPC 39):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Classificação no PL sem impacto na DRE</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Autopeças (Lei 10.485):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Alíquotas concentradas e CST 04 no varejo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
