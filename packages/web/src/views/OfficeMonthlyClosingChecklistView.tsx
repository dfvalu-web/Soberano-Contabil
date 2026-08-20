import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Calendar,
  Layers,
  FileCheck,
  ShieldCheck,
  Zap,
  Building2,
  DollarSign
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store.js';

interface OfficeMonthlyClosingChecklistViewProps {
  tenant?: CompanyTenant;
}

export const OfficeMonthlyClosingChecklistView: React.FC<OfficeMonthlyClosingChecklistViewProps> = ({ tenant }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [isLocked, setIsLocked] = useState(true);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [checklist, setChecklist] = useState([
    { id: 1, pilar: 'Contábil', title: 'Conciliação Bancária OFX / Extratos Cartões', done: true, details: '100% Conciliado • 148 lançamentos' },
    { id: 2, pilar: 'Contábil', title: 'Apuração do Resultado do Exercício (ARE) & Balancete', done: true, details: 'Ativo = Passivo + PL equilibrado' },
    { id: 3, pilar: 'Fiscal', title: 'Importação & Manifestação DF-e (Entradas e Saídas)', done: true, details: '482 notas escrituradas' },
    { id: 4, pilar: 'Fiscal', title: 'Apuração Tributária e Emissão Guias DAS / DARF', done: true, details: 'R$ 148.920,40 emitidos com Pix' },
    { id: 5, pilar: 'Fiscal', title: 'Pré-Validação & Geração SPED Fiscal / EFD', done: true, details: 'PVA 0 inconsistências' },
    { id: 6, pilar: 'DP / eSocial', title: 'Fechamento de Folha CLT, Pró-Labore & S-1299', done: true, details: '38 colaboradores processados' },
    { id: 7, pilar: 'DP / eSocial', title: 'Transmissão DCTFWeb & Emissão FGTS Digital', done: true, details: 'Recibos governamentais gravados' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
    showToast('Item de encerramento atualizado!');
  };

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
    showToast(isLocked ? 'Competência destravada para ajustes operacionais!' : 'Competência 100% travada e blindada contra alterações retroativas!');
  };

  const completedCount = checklist.filter(c => c.done).length;

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
            🔒
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Fechamento Mensal dos 3 Pilares & Dossiê
              </h1>
              <span style={{
                background: isLocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isLocked ? '#34D399' : '#FBBF24',
                border: isLocked ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                {isLocked ? '🔒 COMPETÊNCIA TRAVADA (ACID)' : '🔓 COMPETÊNCIA EM EDIÇÃO'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Checklist de encerramento mensal dos 3 Pilares com bloqueio formal de competência e emissão do Dossiê Diamante.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '7px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
          >
            <option value="2026-08">Competência 08/2026</option>
            <option value="2026-07">Competência 07/2026</option>
            <option value="2026-06">Competência 06/2026</option>
          </select>

          <button
            onClick={handleToggleLock}
            style={{
              background: isLocked ? 'linear-gradient(180deg, #374151 0%, #1F2937 100%)' : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
              border: isLocked ? '1px solid #9CA3AF' : '1px solid #34D399',
              color: '#FFFFFF',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{isLocked ? 'Destravar Competência' : 'Travar Competência'}</span>
          </button>

          <button
            onClick={() => setShowDossierModal(true)}
            className="btn-1click-3d"
          >
            <Printer size={14} /> <span>Visualizar Dossiê A4</span>
          </button>
        </div>
      </div>

      {/* Grid Interativo do Checklist */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Checklist Operacional dos 3 Pilares ({completedCount}/{checklist.length} Itens Concluídos)
            </h3>
            <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.74rem' }}>
              Clique em qualquer item para alternar o status e recalcular as travas de fechamento.
            </p>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: completedCount === checklist.length ? '#34D399' : '#FBBF24', fontFamily: 'var(--font-mono)' }}>
            {Math.round((completedCount / checklist.length) * 100)}%
          </div>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Pilar Departamental</th>
              <th style={{ textAlign: 'left' }}>Item de Encerramento Crítico</th>
              <th style={{ textAlign: 'left' }}>Detalhamento / Recibo</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map(item => (
              <tr key={item.id}>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: item.done ? '#34D399' : '#FBBF24',
                    border: item.done ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    {item.done ? '✓ OK' : '⏳ Pendente'}
                  </span>
                </td>
                <td style={{ fontWeight: 800, color: item.pilar === 'Contábil' ? '#60A5FA' : item.pilar === 'Fiscal' ? '#34D399' : '#C084FC' }}>
                  {item.pilar}
                </td>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.title}</td>
                <td style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.details}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    style={{
                      background: item.done ? '#0B1120' : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      border: item.done ? '1px solid rgba(255,255,255,0.15)' : '1px solid #34D399',
                      color: item.done ? '#94A3B8' : '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {item.done ? 'Reabrir' : 'Concluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Fullscreen Dossiê A4 */}
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
                Dossiê Mensal de Encerramento (Padrão Diamante A4)
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
                <div className="diamond-title">DOSSIÊ MENSAL DE FECHAMENTO CONTÁBIL</div>
                <div className="diamond-subtitle">Certificado de Encerramento e Trava de Competência • Padrão Diamante</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Competência:</strong> {selectedMonth}</div>
                <div><strong>Status:</strong> TRAVADO COM SUCESSO</div>
              </div>
            </div>

            <div className="diamond-meta-grid">
              <div className="diamond-meta-item">
                <strong>Empresa / Entidade</strong>
                <span>{tenant?.name || 'Soberano Tech S/A'}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>CNPJ</strong>
                <span>{tenant?.cnpj || '12.345.678/0001-90'}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Regime Tributário</strong>
                <span>Lucro Real</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Conformidade Fiscal</strong>
                <span style={{ color: '#047857' }}>100% REGULAR</span>
              </div>
            </div>

            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Pilar</th>
                  <th>Atividade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.pilar}</strong></td>
                    <td>{item.title}</td>
                    <td style={{ color: item.done ? '#047857' : '#DC2626', fontWeight: 800 }}>
                      {item.done ? '✓ 100% Concluído' : 'Pendente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DIRETORIA CONTÁBIL</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>CRC Ativo</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA FINANCEIRA</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>CFO / Tesouraria</div>
              </div>
              <div className="diamond-signature-line">
                <div>COMPLIANCE & RISCOS</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Auditoria Interna</div>
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
              <div className="diamond-title">DOSSIÊ MENSAL DE FECHAMENTO CONTÁBIL</div>
              <div className="diamond-subtitle">Certificado de Encerramento e Trava de Competência • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeMonthlyClosingChecklistView;
