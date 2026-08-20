import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const ClientPortalOfficeView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [requests, setRequests] = useState([
    { id: 1, type: 'Certidão CND Municipal', date: '18/08/2026', status: 'ENTREGUE', file: 'CND_PMSP_2026.pdf' },
    { id: 2, type: 'Holerite 08/2026 de Colaborador', date: '19/08/2026', status: 'ENTREGUE', file: 'Holerite_CarlosSilva.pdf' },
    { id: 3, type: 'Segunda Via Guia DAS Simples', date: '20/08/2026', status: 'PROCESSANDO', file: 'Guia_DAS_082026.pdf' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleNewRequest = () => {
    const newReq = {
      id: requests.length + 1,
      type: 'Nova Solicitação de Documento Contábil',
      date: 'Hoje',
      status: 'PROCESSANDO',
      file: 'Documento_Gerado.pdf'
    };
    setRequests([newReq, ...requests]);
    showToast('Solicitação recebida pelo escritório com protocolo SLA de atendimento!');
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
            🌐
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Portal do Cliente do Escritório (B2B)
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
                AUTOATENDIMENTO DIGITAL
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Ambiente de autoatendimento para clientes: download de guias, envio de documentos e chamados operacionais.
            </p>
          </div>
        </div>

        <button
          onClick={handleNewRequest}
          className="btn-1click-3d"
        >
          <Send size={14} /> <span>Abrir Chamado / Solicitação</span>
        </button>
      </div>

      {/* Grade de Documentos e Solicitações */}
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
          Central de Downloads & Solicitações do Cliente
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tipo de Solicitação / Documento</th>
              <th style={{ textAlign: 'center' }}>Data</th>
              <th style={{ textAlign: 'center' }}>Arquivo / Formato</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{req.type}</td>
                <td style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.72rem' }}>{req.date}</td>
                <td style={{ textAlign: 'center', color: '#38BDF8', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{req.file}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: req.status === 'ENTREGUE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: req.status === 'ENTREGUE' ? '#34D399' : '#FBBF24'
                  }}>
                    {req.status === 'ENTREGUE' ? '✓ Disponível' : '⏳ Em Produção'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => showToast(`Download de ${req.file} iniciado!`)}
                    style={{
                      background: 'linear-gradient(180deg, #18263D 0%, #0F172A 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38BDF8',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.70rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={12} /> <span>Baixar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientPortalOfficeView;
