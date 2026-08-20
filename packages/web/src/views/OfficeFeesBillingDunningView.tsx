import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  QrCode,
  FileSpreadsheet,
  Users,
  Building2
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeFeesBillingDunningView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [notification, setNotification] = useState<string | null>(null);

  const [invoices, setInvoices] = useState(() => {
    return tenants.map((t, idx) => ({
      id: `FAT-202608-${idx + 1}`,
      client: t.name,
      cnpj: t.cnpj,
      valor: 2800 + idx * 1200,
      vencimento: '10/09/2026',
      status: idx === 0 ? 'PAGO' : 'EM_ABERTO',
      pixCode: `00020126580014br.gov.bcb.pix0136SOBERANO_HONORARIOS_${idx + 1}`
    }));
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAGO' } : inv));
    showToast('Fatura liquidada e contabilizada no caixa do escritório!');
  };

  const handleSendAllPix = () => {
    showToast('Faturas de honorários e cobranças Pix disparadas para todos os clientes!');
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
            🧾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Honorários do Escritório, NFS-e & Cobrança PIX Recorrente
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
                FATURAMENTO AUTOMÁTICO
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Gestão de mensalidades do escritório, emissão automática de NFS-e municipal e cobrança com QR Code Pix dinâmico.
            </p>
          </div>
        </div>

        <button
          onClick={handleSendAllPix}
          className="btn-1click-3d"
        >
          <Send size={14} /> <span>Emitir & Disparar Faturas em Lote</span>
        </button>
      </div>

      {/* Grade de Faturas */}
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
          Controle de Mensalidades & Quitações
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Fatura / Cliente</th>
              <th style={{ textAlign: 'right' }}>Valor Mensal</th>
              <th style={{ textAlign: 'center' }}>Vencimento</th>
              <th style={{ textAlign: 'center' }}>Chave Pix / Cobrança</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <div>{inv.client}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{inv.id} • {inv.cnpj}</div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>
                  {inv.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.72rem' }}>{inv.vencimento}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => showToast('Chave Pix Copiada!')}
                    style={{ background: '#0B1120', border: '1px solid rgba(56,189,248,0.4)', color: '#38BDF8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    Copiar Pix
                  </button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: inv.status === 'PAGO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: inv.status === 'PAGO' ? '#34D399' : '#FBBF24'
                  }}>
                    {inv.status === 'PAGO' ? '✓ Liquidado' : '⏳ Em Aberto'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {inv.status === 'EM_ABERTO' ? (
                    <button
                      onClick={() => handleMarkPaid(inv.id)}
                      style={{
                        background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                        border: '1px solid #34D399',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Quitar
                    </button>
                  ) : (
                    <span style={{ color: '#34D399', fontSize: '0.70rem', fontWeight: 800 }}>✓ Baixado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Relatório Diamante A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">EXTRATO DE HONORÁRIOS CONTÁBEIS</div>
              <div className="diamond-subtitle">Demonstrativo de Faturamento, NFS-e e Cobrança Pix • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFeesBillingDunningView;
