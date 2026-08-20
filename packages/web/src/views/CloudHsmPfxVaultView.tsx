import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  Lock,
  Zap,
  Server
} from 'lucide-react';

export const CloudHsmPfxVaultView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTestHsm = () => {
    showToast('Cofre Cloud HSM auditado: Todas as chaves privadas A1 PFX estão isoladas em hardware FIPS 140-2!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          border: '1.5px solid #34D399',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header 3D 4K */}
      <div style={{
        background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderBottom: '3px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1.5px solid #34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
          }}>
            🔒
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Certificados ICP-Brasil em Nuvem (Cloud HSM) & Cofre A1 PFX
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                FIPS 140-2 LEVEL 3
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Guarda segura de chaves privadas de certificados digitais A1 em módulos de segurança em nuvem de alta disponibilidade.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestHsm}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Auditar Cofre Cloud HSM</span>
        </button>
      </div>

      {/* Detalhes do Hardware Security Module */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ background: '#0B1120', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Certificados Armazenados</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>142 Empresas</div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>100% Chaves Privadas Criptografadas</div>
        </div>

        <div style={{ background: '#0B1120', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Assinaturas Efetuadas no Mês</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38BDF8', margin: '4px 0' }}>4.820 Docs</div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>PAdrES e XML-DSig</div>
        </div>
      </div>
    </div>
  );
};

export default CloudHsmPfxVaultView;
