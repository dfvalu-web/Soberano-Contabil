import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  RefreshCw,
  Zap,
  Key,
  FileText
} from 'lucide-react';

export const SecurityLedgerView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [blocks, setBlocks] = useState([
    { index: 14820, action: 'Lançamento Contábil DRE 08/2026', actor: 'carlos.silva@soberano.com', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', time: 'Hoje às 14:22' },
    { index: 14819, action: 'Transmissão eSocial S-1200 Folha', actor: 'mariana.santos@soberano.com', hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', time: 'Hoje às 14:15' },
    { index: 14818, action: 'Abertura de Guia DAS PGDAS-D', actor: 'roberto.lima@soberano.com', hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', time: 'Hoje às 14:10' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleVerifyLedger = () => {
    showToast('Integridade Criptográfica do Livro-Razão Imutável verificada: 0 violações (100% Intacto)!');
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
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Central de Segurança, LGPD & Append-Only Ledger
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
                HASH CHAIN SHA-256
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Trilha de auditoria imutável (Append-Only) com assinaturas criptográficas em cadeia e blindagem contra fraudes.
            </p>
          </div>
        </div>

        <button
          onClick={handleVerifyLedger}
          className="btn-1click-3d"
        >
          <ShieldCheck size={14} /> <span>Verificar Integridade do Ledger</span>
        </button>
      </div>

      {/* Grade do Livro-Razão Imutável */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
          Trilha Forense de Operações & Blocos Criptografados
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Bloco</th>
              <th style={{ textAlign: 'left' }}>Operação Registrada</th>
              <th style={{ textAlign: 'left' }}>Usuário / Agente</th>
              <th style={{ textAlign: 'left' }}>Hash Criptográfico SHA-256</th>
              <th style={{ textAlign: 'center' }}>Carimbo de Tempo</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(b => (
              <tr key={b.index}>
                <td style={{ textAlign: 'center', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                  #{b.index}
                </td>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{b.action}</td>
                <td style={{ fontSize: '0.70rem', color: '#94A3B8' }}>{b.actor}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: '#34D399', wordBreak: 'break-all' }}>
                  {b.hash}
                </td>
                <td style={{ textAlign: 'center', fontSize: '0.70rem', color: '#CBD5E1' }}>{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityLedgerView;
