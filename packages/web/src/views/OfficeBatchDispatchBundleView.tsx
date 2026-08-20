import React, { useState, useMemo } from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Users,
  Smartphone,
  Mail,
  ShieldCheck,
  Zap,
  Filter,
  Download,
  FileText
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeBatchDispatchBundleView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedCompetencia, setSelectedCompetencia] = useState('08/2026');
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPortal, setChannelPortal] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const [clientDispatches, setClientDispatches] = useState(() => {
    return tenants.map((t, idx) => ({
      id: t.id,
      name: t.name,
      cnpj: t.cnpj,
      holerites: 12 + idx * 8,
      impostoPix: 4500 + idx * 3200,
      status: idx === 0 ? 'ENVIADO' : 'PRONTO',
      protocolo: idx === 0 ? `DISP-202608-${idx + 100}-SHA256` : 'Pendente'
    }));
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDispatchSingle = (id: string) => {
    setClientDispatches(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'ENVIADO',
          protocolo: `DISP-202608-${Math.floor(1000 + Math.random() * 9000)}-SHA256`
        };
      }
      return c;
    }));
    showToast('Pacote disparado com sucesso via WhatsApp & E-mail!');
  };

  const handleDispatchAll = () => {
    setClientDispatches(prev => prev.map((c, i) => ({
      ...c,
      status: 'ENVIADO',
      protocolo: `DISP-202608-${1000 + i}-SHA256`
    })));
    showToast('Todos os pacotes mensais foram disparados com protocolo de entrega digital!');
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

      {/* Header Executivo 3D 4K */}
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
            📲
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Central de Disparo em Lote • WhatsApp & E-mail
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
                PROTOCOLO JURÍDICO SHA-256
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Envio automático de pacotes mensais (Holerites + Guias Pix + Balancetes) com confirmação formal de recebimento.
            </p>
          </div>
        </div>

        <button
          onClick={handleDispatchAll}
          className="btn-1click-3d"
        >
          <Zap size={14} />
          <span>Disparar Todos os Pacotes (1-Click)</span>
        </button>
      </div>

      {/* Opções de Canais e Configuração */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>
            Canais de Entrega Ativos
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={channelWhatsapp} onChange={(e) => setChannelWhatsapp(e.target.checked)} />
              <span>📱 WhatsApp API Oficial</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={channelEmail} onChange={(e) => setChannelEmail(e.target.checked)} />
              <span>📧 E-mail SMTP Seguro</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={channelPortal} onChange={(e) => setChannelPortal(e.target.checked)} />
              <span>🌐 Portal do Cliente</span>
            </label>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Pacotes Prontos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34D399' }}>{clientDispatches.length} Empresas</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.70rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>Disparados com Sucesso</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38BDF8' }}>
              {clientDispatches.filter(c => c.status === 'ENVIADO').length} / {clientDispatches.length}
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Clientes Prontos para Envio */}
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
          Fila de Envio da Competência {selectedCompetencia}
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Empresa / CNPJ</th>
              <th style={{ textAlign: 'center' }}>Holerites</th>
              <th style={{ textAlign: 'right' }}>Guia Pix Tributos</th>
              <th style={{ textAlign: 'center' }}>Protocolo Digital</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientDispatches.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <div>{c.name}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>{c.cnpj}</div>
                </td>
                <td style={{ textAlign: 'center', color: '#BAE6FD', fontWeight: 700 }}>
                  {c.holerites} docs
                </td>
                <td style={{ textAlign: 'right', color: '#34D399', fontWeight: 800 }}>
                  {c.impostoPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: c.status === 'ENVIADO' ? '#38BDF8' : '#94A3B8' }}>
                  {c.protocolo}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: c.status === 'ENVIADO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: c.status === 'ENVIADO' ? '#34D399' : '#FBBF24',
                    border: c.status === 'ENVIADO' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    {c.status === 'ENVIADO' ? '✓ Entregue' : '⏳ Pronto'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {c.status === 'PRONTO' ? (
                    <button
                      onClick={() => handleDispatchSingle(c.id)}
                      style={{
                        background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.70rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Enviar 1-Click
                    </button>
                  ) : (
                    <span style={{ color: '#34D399', fontSize: '0.72rem', fontWeight: 800 }}>✓ Concluído</span>
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

export default OfficeBatchDispatchBundleView;
