import React from 'react';

export const Zfm40SuframaPinAutomationView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏭</span> ZFM 4.0, P&D Tecnológico SUFRAMA (Lei 8.387/91) & Guias PIN-ZFM
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Incentivos de Indústria 4.0 na Zona Franca de Manaus, apuração do crédito financeiro de TIC (5% P&D) e automação de internamento aduaneiro PIN.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* P&D Obrigatório SUFRAMA (Lei 8.387/91) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>P&D SUFRAMA (5% TIC)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              LEI 8.387/91 ART. 2º
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Investimento Obrigatório:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>5% da Receita Líquida de Informática</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crédito Financeiro Gerado:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>100% Compensável com Tributos Federais</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Reserva de Lucros no PL:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Art. 195-A da Lei 6.404/76</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Obrigação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>HOMOLOGADO SUFRAMA</span>
            </div>
          </div>
        </div>

        {/* Automação de Guias PIN-ZFM */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Internamento Aduaneiro PIN</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DESONERAÇÃO AUTOMÁTICA
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Isenção de IPI:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100% Desonerado na Entrada</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PIS / COFINS Entrada:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Alíquota Zero (Lei 10.996/04)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Validação SEFAZ-AM:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Protocolo PIN em Tempo Real</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Risco Aduaneiro:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO GLOSA DE CRÉDITO</span>
            </div>
          </div>
        </div>

        {/* Integração Indústria 4.0 */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Rastreabilidade de Insumos</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              SPED BLOCO K
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Processo Produtivo Básico (PPB):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Rastreabilidade de componentes e etapas fabris</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Auditoria de Estoques:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Integração direta com o Bloco K do SPED Fiscal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
