import React from 'react';

export const MedicalCooperativeTaxView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🩺</span> Cooperativas Médicas (Lei 5.764/71), PIS Folha 1% & eSocial S-1200
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Segregação fiscal de atos cooperativos vs não cooperativos (ANS/Unimeds), apuração do PIS sobre folha de salários (1%) e retenção de INSS 11%.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Atos Cooperativos vs Não Cooperativos */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Segregação de Atos (Lei 5.764)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 5.764/71 & ANS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Atos Cooperativos Típicos:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Não Incidência de IRPJ/CSLL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Atos Não Cooperativos:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Lucro Real Tributável Ordinário</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Destinação Estatutária:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>FATES & Fundo de Reserva</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PIS Folha de Salários:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>1,00% (MP 2.158-35/01)</span>
            </div>
          </div>
        </div>

        {/* Retenção Previdenciária de Médicos Cooperados */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Produção Médica & INSS 11%</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              eSocial S-1200 / S-1210
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Alíquota de Retenção:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>11% Limitada ao Teto INSS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Teto Previdenciário (2026):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>R$ 8.157,41</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transmissão Eletrônica:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Eventos S-1200 e DCTFWeb</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auditoria Trabalhista:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% BLINDADO NA RECEITA</span>
            </div>
          </div>
        </div>

        {/* Integração ANS & DIOPS Financeiro */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Conformidade ANS</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DIOPS & PROVISÕES TÉCNICAS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>DIOPS Financeiro:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Demonstrações de Informações da Saúde Suplementar</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Provisão de Eventos Ocorridos (PEONA):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Cálculo Atuarial e Ativos Garantidores Vinculados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
