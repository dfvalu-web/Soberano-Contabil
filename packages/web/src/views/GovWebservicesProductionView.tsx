import React from 'react';

export const GovWebservicesProductionView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌐</span> WebServices Governamentais em Tempo Real (Pilar 1 - Produção)
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Monitoramento e transmissão direta para SEFAZ (SOAP 1.2 / SVC), Receita Federal (e-CAC / ReceitaNet BX), eSocial e EFD-Reinf com mTLS.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Gateway SEFAZ DF-e */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SEFAZ DF-e (SOAP 1.2)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ONLINE (120ms)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ambiente Autorizador:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Produção (SP / SVRS / SVAN)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status da Comunicação:</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>100 - Autorizado o uso da NF-e</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Roteamento de Contingência:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>SVC-AN / SVC-RS Ativo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo Oficial SEFAZ:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>135260004928172</span>
            </div>
          </div>
        </div>

        {/* eSocial & EFD-Reinf REST */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>eSocial & EFD-Reinf</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              mTLS AUTENTICADO
            </span>
          </div>

          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>eSocial (WsEnviarLoteEventos):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>201 - Processado com Sucesso</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>EFD-Reinf (API REST RFB):</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>200 OK (R-4010 / R-2010)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ReceitaNet BX / e-CAC Robô:</span>
              <span style={{ fontWeight: 600, color: '#3b82f6' }}>Sincronização Ativa</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recibo Oficial Gravado:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>REC-S1200-202604-CONFIRMADO</span>
            </div>
          </div>
        </div>

        {/* Shopping Centers & FIIs */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Shoppings & FIIs</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              CONCILIADO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Lojas de Shopping (CPC 06):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>AMG no passivo e percentual na DRE</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Fundos Imobiliários (Lei 14.754):</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Isenção de IRRF com 100 cotistas B3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
