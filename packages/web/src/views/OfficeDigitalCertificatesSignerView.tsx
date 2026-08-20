import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  Zap,
  Lock
} from 'lucide-react';

export const OfficeDigitalCertificatesSignerView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAssinarEmLote = () => {
    showToast('Lote de 18 documentos assinado digitalmente com Certificado ICP-Brasil (PAdrES / CAdES)!');
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
            🔐
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Certificados Digitais, Cofre Seguro & Assinador ICP-Brasil
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
                ASSINATURA QUALIFICADA
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Assinador eletrônico e qualificado de balanços, declarações, contratos e PDFs com certificados A1/A3 ICP-Brasil.
            </p>
          </div>
        </div>

        <button
          onClick={handleAssinarEmLote}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Assinar Lote de Documentos</span>
        </button>
      </div>

      {/* Painel do Certificado Ativo */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(52, 211, 153, 0.35)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Certificado Digital Master Ativo</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>SOBERANO AUDITORIA & CONTABILIDADE LTDA</div>
          <div style={{ fontSize: '0.74rem', color: '#38BDF8' }}>e-CNPJ A1 • AC SERASA RFB v5 • Validade: 14/11/2027</div>
        </div>
        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid #34D399', padding: '6px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.76rem' }}>
          ✓ COFRE BLINDADO (AES-256)
        </span>
      </div>
    </div>
  );
};

export default OfficeDigitalCertificatesSignerView;
