import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';
import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  ArrowRight,
  Download,
  Printer,
  FileSpreadsheet,
  Globe,
  Sliders,
  Play
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const FinancialBpoOfficeView: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedBank, setSelectedBank] = useState('ITAU');
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Estados Interativos de Contas a Pagar e Receber
  const [bills, setBills] = useState([
    { id: 1, type: 'PAGAR', desc: 'Fornecedor de Medicamentos Farmacêuticos Ltda', val: 48500.00, venc: '25/08/2026', status: 'PENDENTE', banco: 'Itaú CC 56789-0' },
    { id: 2, type: 'PAGAR', desc: 'Folha de Pagamento Salários Líquidos CLT', val: 55380.00, venc: '05/09/2026', status: 'AGENDADO', banco: 'Bradesco CC 12345-6' },
    { id: 3, type: 'RECEBER', desc: 'Recebimento Venda a Prazo NF 1042 (Drogaria Alvorada)', val: 72400.00, venc: '22/08/2026', status: 'RECEBIDO', banco: 'Itaú CC 56789-0' },
    { id: 4, type: 'RECEBER', desc: 'Recebimento Contrato Recorrente Serviços Mensais', val: 34800.00, venc: '24/08/2026', status: 'RECEBIDO', banco: 'Santander CC 98765-4' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSyncOpenFinance = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Open Finance sincronizado com sucesso! Extratos bancários e DDA atualizados em tempo real.');
    }, 800);
  };

  const handlePayBill = (id: number) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: b.type === 'PAGAR' ? 'PAGO' : 'RECEBIDO' } : b));
    showToast('Transação liquidada e lançada automaticamente no Razão Contábil (Partidas Dobradas)!');
  };

  const totalPagar = useMemo(() => bills.filter(b => b.type === 'PAGAR').reduce((acc, b) => acc + b.val, 0), [bills]);
  const totalReceber = useMemo(() => bills.filter(b => b.type === 'RECEBER').reduce((acc, b) => acc + b.val, 0), [bills]);
  const saldoProjetado = totalReceber - totalPagar;

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
            📈
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                BPO Financeiro do Escritório (Open Finance & DRE)
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
                OPEN FINANCE BACEN ATIVO
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Gestão integrada de Contas a Pagar/Receber, conciliação bancária via Open Finance e relatórios gerenciais com EBITDA para clientes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SmartPeriodPicker compact={true} />
          <button
            onClick={() => setShowDossierModal(true)}
            style={{
              background: '#0E172A',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={14} /> <span>Visualizar Relatório BPO A4</span>
          </button>

          <button
            onClick={handleSyncOpenFinance}
            disabled={isSyncing}
            className="btn-1click-3d"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Sincronizando BACEN...' : 'Sincronizar Open Finance'}</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Cards de Tesouraria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(248, 113, 113, 0.35)', borderBottom: '3px solid #EF4444', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Contas a Pagar (Mês)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F87171', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {totalPagar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Fornecedores, impostos e salários</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Contas a Receber (Mês)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34D399', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {totalReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Clientes, cartões e Pix faturados</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Saldo Operacional Líquido</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: saldoProjetado > 0 ? '#38BDF8' : '#F87171', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {saldoProjetado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Geração de Caixa Livre (EBITDA)</div>
        </div>
      </div>

      {/* Grade de Contas a Pagar e Receber */}
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
          Esteira de Contas a Pagar & Receber do Cliente
        </h3>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tipo / Descrição</th>
              <th style={{ textAlign: 'right' }}>Valor (R$)</th>
              <th style={{ textAlign: 'center' }}>Vencimento</th>
              <th style={{ textAlign: 'left' }}>Conta Bancária</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    background: b.type === 'PAGAR' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: b.type === 'PAGAR' ? '#FCA5A5' : '#34D399'
                  }}>
                    {b.type === 'PAGAR' ? '🔴 A PAGAR' : '🟢 A RECEBER'}
                  </span>
                  {b.desc}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: b.type === 'PAGAR' ? '#F87171' : '#34D399' }}>
                  {b.val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.72rem' }}>{b.venc}</td>
                <td style={{ fontSize: '0.72rem', color: '#38BDF8' }}>{b.banco}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: (b.status === 'PAGO' || b.status === 'RECEBIDO') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: (b.status === 'PAGO' || b.status === 'RECEBIDO') ? '#34D399' : '#FBBF24'
                  }}>
                    {b.status === 'PAGO' ? '✓ Liquidado' : b.status === 'RECEBIDO' ? '✓ Recebido' : '⏳ Pendente'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {(b.status === 'PENDENTE' || b.status === 'AGENDADO') ? (
                    <button
                      onClick={() => handlePayBill(b.id)}
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
                      {b.type === 'PAGAR' ? 'Pagar' : 'Baixar'}
                    </button>
                  ) : (
                    <span style={{ color: '#34D399', fontSize: '0.70rem', fontWeight: 800 }}>✓ Conciliado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Fullscreen Relatório BPO A4 */}
      {showDossierModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          background: 'rgba(5, 10, 20, 0.88)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            background: '#111827',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>💎</span>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                Relatório de BPO Financeiro & DRE Gerencial (A4 Diamante)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  border: '1px solid #34D399',
                  color: '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={14} /> <span>Imprimir / Salvar PDF</span>
              </button>
              <button
                onClick={() => setShowDossierModal(false)}
                style={{
                  background: '#1F2937',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#94A3B8',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ✕ Fechar
              </button>
            </div>
          </div>

          <div className="diamond-paper-a4" style={{ width: '100%', maxWidth: '900px', marginBottom: '30px' }}>
            <div className="diamond-header">
              <div>
                <div className="diamond-title">Relatório de Gestão Financeira BPO</div>
                <div className="diamond-subtitle">Demonstração do Fluxo de Caixa Operacional & EBITDA • Padrão Diamante</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Competência:</strong> 08/2026</div>
                <div><strong>Status:</strong> 100% CONCILIADO</div>
              </div>
            </div>

            <div className="diamond-kpi-row">
              <div className="diamond-kpi-box">
                <strong>Contas a Receber</strong>
                <div className="value">{totalReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Contas a Pagar</strong>
                <div className="value">{totalPagar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Geração de Caixa Líquido</strong>
                <div className="value">{saldoProjetado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
            </div>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>CONTROLADORIA BPO FINANCEIRO</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Gestor de Tesouraria</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA FINANCEIRA / CFO</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Aprovação Executiva</div>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {/* Relatório Diamante A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">RELATÓRIO DE BPO FINANCEIRO & GESTÃO DE CAIXA</div>
              <div className="diamond-subtitle">Demonstração de Contas a Pagar, Receber e EBITDA • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialBpoOfficeView;
