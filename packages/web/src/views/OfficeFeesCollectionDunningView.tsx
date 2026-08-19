import React from 'react';

export const OfficeFeesCollectionDunningView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💳</span> Honorários, Régua de Cobrança & Suspensão CFC
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestão de mensalidades, 13º honorário e serviços extras, régua de cobrança automática via Pix e suspensão de serviços com respaldo na Resolução CFC 1.590/20.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            RESOLUÇÃO CFC 1.590/20 & PIX REVERSO
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Gestão de Honorários & 13º Honorário */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Faturamento do Escritório</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              RECEITA RECORRENTE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Honorários Mensais da Carteira:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 185.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Serviços Extraordinários Faturados:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>R$ 24.500,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Provisão de 13º Honorário Contábil:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ 185.000,00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxa de Adimplência Mensal:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>97,8% EM DIA NO VENCIMENTO</span>
            </div>
          </div>
        </div>

        {/* Régua de Cobrança Automática Pix */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Régua de Cobrança Pix</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              WHATSAPP & E-MAIL
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lembrete Preventivo (D-3):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Disparo com QR Code Pix</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cobrança Amigável (D+5):</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>2ª via c/ Multa 2% e Juros 1%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Notificação Extrajudicial (D+15):</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>Aviso Formal de Atraso</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recuperação de Inadimplentes:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>RECUPERAÇÃO EM MENOS DE 7 DIAS</span>
            </div>
          </div>
        </div>

        {/* Suspensão de Serviços com Respaldo CFC */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Suspensão CFC (Res. 1.590)</h3>
            <span style={{ background: '#ef444420', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DESONERAÇÃO TÉCNICA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Bloqueio de Entregas por Inadimplência (Superior a 60 dias):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Suspensão legal de envio de SPED e guias</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Notificação Formal com AR Digital:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Isenção de responsabilidade por multas de atraso</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Segurança Jurídica:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% AMPARADO PELO CFC & CÓDIGO CIVIL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
