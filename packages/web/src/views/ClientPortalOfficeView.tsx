import React from 'react';

export const ClientPortalOfficeView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📲</span> Portal do Cliente do Escritório (B2B)
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Canal direto de comunicação, entrega protocolada de guias (DAS, DARF, Folha) e recebimento de demandas de RH e extratos bancários.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: '#10b98120', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            ENTREGA 100% PROTOCOLADA
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Painel de Guias e Documentos Disponibilizados */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Guias do Mês (Cliente)</h3>
            <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DISPONÍVEL PARA DOWNLOAD
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Guia DAS - Simples Nacional</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Vencimento: 20/08/2026</div>
              </div>
              <span style={{ fontWeight: 700, color: '#10b981' }}>R$ 14.850,20</span>
            </div>

            <div style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>DAE FGTS Digital / DCTFWeb</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Vencimento: 15/08/2026</div>
              </div>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>R$ 8.920,40</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocolo Jurídico de Envio:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>CONFIRMADO POR HASH</span>
            </div>
          </div>
        </div>

        {/* Central de Solicitações do Cliente */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Solicitações do Cliente</h3>
            <span style={{ background: '#8b5cf620', color: '#8b5cf6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              TRIAGEM INTELIGENTE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Admissão de Colaborador (eSocial):</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Validação automática de CPF e CBO</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Envio de Extrato Bancário (OFX):</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>Importação direta para a conciliação contábil</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo Médio de Resposta:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Até 4 horas úteis</span>
            </div>
          </div>
        </div>

        {/* Alertas Automáticos WhatsApp & E-mail */}
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Notificações Push / WhatsApp</h3>
            <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              DISPAROS AUTOMÁTICOS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Lembrete de Vencimento de Guias:</div>
              <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>Avisos automáticos em D-5, D-2 e no dia do vencimento</div>
            </div>
            <div style={{ background: 'var(--surface-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Código PIX Copia e Cola:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Pagamento instantâneo de DAS e FGTS no WhatsApp</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Redução de Inadimplência:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>98% DE EFICIÊNCIA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
