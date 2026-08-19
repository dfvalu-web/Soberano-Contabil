import React from 'react';

export const OfficeElectronicAttorneyDjeView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📜</span> Procurações Eletrônicas e-CAC & Domicílio Judicial (DJE / CNJ)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Controle de procurações RFB/e-CAC (IN 2.066/22), FGTS Digital / Conectividade Social ICP e monitoramento do Domicílio Judicial Eletrônico (Res. CNJ 455/22).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            IN RFB 2.066/22 • RES. CNJ 455/22
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Procurações e-CAC / ICP */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Procurações RFB / e-CAC</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              100% VIGENTES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Serviços Outorgados:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>DCTFWeb, Reinf, SPED, DTE & CND</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Validade do Mandato:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Vigente até 2028 (5 anos)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Conectividade ICP / FGTS:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>✓ Outorga Ativa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Régua de Renovação:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>DISPARO AUTOMÁTICO -30 DIAS</span>
            </div>
          </div>
        </div>

        {/* Domicílio Judicial Eletrônico (DJE / CNJ) */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Domicílio Judicial (CNJ)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CADASTRO OBRIGATÓRIO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tribunais Conectados:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>TRT, TJ, TRF & TST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prazo Legal de Leitura:</span>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>3 dias úteis para ciência</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Comunicações Pendentes:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>0 intimações em atraso</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Risco de Revelia / Multa:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>ZERO RISCO PROCESSUAL</span>
            </div>
          </div>
        </div>

        {/* Central de Assinatura com 1-Click */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Renovação com 1-Click</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              WHATSAPP & E-MAIL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Assinatura via Certificado A1 / A3 / Nuvem:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>O cliente assina a procuração em 30 segundos</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Validação no Portal e-CAC:</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Ativação imediata no banco de dados da RFB</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Continuidade Operacional:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>100% GARANTIDA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
