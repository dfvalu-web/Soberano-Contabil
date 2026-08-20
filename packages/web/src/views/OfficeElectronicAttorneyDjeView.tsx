import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building2,
  ShieldCheck,
  Zap,
  FileText
} from 'lucide-react';

export const OfficeElectronicAttorneyDjeView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [intimacoes, setIntimacoes] = useState([
    { id: 'INT-2026-091', tribunal: 'TRT 2ª Região (SP)', vara: '42ª Vara do Trabalho', prazo: '28/08/2026', status: 'CIENCIA_TOMADA', processo: '1002345-88.2026.5.02.0042' },
    { id: 'INT-2026-092', tribunal: 'TJSP - Tribunal de Justiça', vara: '3ª Vara Cível Central', prazo: '02/09/2026', status: 'PENDENTE_LEITURA', processo: '1048291-12.2026.8.26.0100' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDarCiencia = (id: string) => {
    setIntimacoes(prev => prev.map(item => item.id === id ? { ...item, status: 'CIENCIA_TOMADA' } : item));
    showToast('Ciência eletrônica confirmada no Domicílio Judicial (CNJ) com protocolo formal!');
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
            ⚖️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Procurações Eletrônicas e-CAC & Domicílio Judicial (DJE / CNJ)
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
                RADAR CNJ & DJE
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Varredura de intimações no Domicílio Judicial Eletrônico e controle de outorgas de procurações na Receita Federal.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Varredura do DJE/CNJ concluída: Nenhuma intimação com prazo vencido!')}
          className="btn-1click-3d"
        >
          <RefreshCw size={14} /> <span>Sincronizar Domicílio Judicial</span>
        </button>
      </div>

      {/* Grade de Intimações */}
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
          Intimações & Citações Judiciais Eletrônicas (CNJ)
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tribunal / Órgão</th>
              <th style={{ textAlign: 'left' }}>Processo</th>
              <th style={{ textAlign: 'center' }}>Prazo Fatal</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {intimacoes.map(it => (
              <tr key={it.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <div>{it.tribunal}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{it.vara}</div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38BDF8' }}>{it.processo}</td>
                <td style={{ textAlign: 'center', color: '#FBBF24', fontWeight: 700 }}>{it.prazo}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: it.status === 'CIENCIA_TOMADA' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: it.status === 'CIENCIA_TOMADA' ? '#34D399' : '#FCA5A5'
                  }}>
                    {it.status === 'CIENCIA_TOMADA' ? '✓ Ciência Tomada' : '⚠️ Leitura Pendente'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {it.status === 'PENDENTE_LEITURA' ? (
                    <button
                      onClick={() => handleDarCiencia(it.id)}
                      style={{ background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', border: '1px solid #34D399', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Dar Ciência 1-Click
                    </button>
                  ) : (
                    <span style={{ color: '#34D399', fontSize: '0.70rem', fontWeight: 800 }}>Ok</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeElectronicAttorneyDjeView;
