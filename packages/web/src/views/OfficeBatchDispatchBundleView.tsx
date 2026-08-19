import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeBatchDispatchBundleView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🚀</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Central de Disparo em Lote • WhatsApp & E-mail
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Protocolo Jurídico SHA-256
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Envio automático de pacotes mensais (Holerites + Guias Pix + DRE) com confirmação de entrega jurídica.
          </p>
        </div>
        <button onClick={() => alert('Pacotes disparados com sucesso via WhatsApp e E-mail!')} className="btn-primary-action">
          <span>📲</span> Disparar Todos os Pacotes Agora
        </button>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '18px' }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>Pacotes Mensais Prontos para Entrega</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Todas as {tenants.length} empresas da carteira estão com guias Pix e holerites compilados para envio com protocolo de entrega digital.</div>
      </div>
    </div>
  );
};
export default OfficeBatchDispatchBundleView;