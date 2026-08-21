import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';
import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  RefreshCw,
  Play
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store.js';

interface OfficeIntegratedClosingPipelineViewProps {
  tenant?: CompanyTenant;
}

export const OfficeIntegratedClosingPipelineView: React.FC<OfficeIntegratedClosingPipelineViewProps> = ({ tenant }) => {
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');
  const [showA4Dossier, setShowA4Dossier] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [stages, setStages] = useState([
    {
      id: 1,
      name: 'Etapa 1: Fiscal & DFe',
      desc: 'Captura DF-e, EFD ICMS/IPI & PIS/COFINS',
      sla: '4.5h',
      status: 'CONCLUIDO',
      progress: 100
    },
    {
      id: 2,
      name: 'Etapa 2: Folha DP & eSocial',
      desc: 'Apuração CLT, S-1200 & FGTS Digital',
      sla: '3.2h',
      status: 'CONCLUIDO',
      progress: 100
    },
    {
      id: 3,
      name: 'Etapa 3: DCTFWeb & Guias',
      desc: 'Fechamento DCTFWeb & DARFs Previdenciários',
      sla: '1.8h',
      status: 'EM_ANDAMENTO',
      progress: 75
    },
    {
      id: 4,
      name: 'Etapa 4: Contabilidade IFRS',
      desc: 'Partidas Dobradas, Razão & ARE CPC 00',
      sla: 'Estimado 2.0h',
      status: 'PENDENTE',
      progress: 0
    },
    {
      id: 5,
      name: 'Etapa 5: Dossiê & Entrega',
      desc: 'Balanço, DRE & 3 Assinaturas Formais',
      sla: 'Estimado 1.0h',
      status: 'PENDENTE',
      progress: 0
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'T1', title: 'Validação de NF-e/NFC-e de Entrada e Saída (100% conciliadas)', department: 'Fiscal', legalRef: 'Ajuste SINIEF 07/05', itemsCount: 482, responsible: 'Robô Fiscal DF-e', status: 'CONCLUIDO' },
    { id: 'T2', title: 'Segregação de Monofásicos PIS/COFINS & ICMS-ST Farmácia', department: 'Fiscal', legalRef: 'Lei 10.147/00', itemsCount: 38, responsible: 'Auditor Tributário', status: 'CONCLUIDO' },
    { id: 'T3', title: 'Fechamento de Folha de Pagamento CLT & Pró-labore', department: 'DP', legalRef: 'CLT Art. 457', itemsCount: 38, responsible: 'Especialista DP', status: 'CONCLUIDO' },
    { id: 'T4', title: 'Transmissão eSocial S-1200 / S-1210 e Emissão FGTS Digital', department: 'DP', legalRef: 'Manual MOS v.S-1.3', itemsCount: 38, responsible: 'Gateway eSocial', status: 'CONCLUIDO' },
    { id: 'T5', title: 'Transmissão DCTFWeb e Geração de DARF Previdenciário Único', department: 'Tributário', legalRef: 'IN RFB 2.005/21', itemsCount: 1, responsible: 'Tributário Gov', status: 'EM_ANDAMENTO' },
    { id: 'T6', title: 'Emissão de Guias com Pix Copia e Cola & Disparo em Lote', department: 'Tributário', legalRef: 'Res. CGSN 140/18', itemsCount: 2, responsible: 'Disparo em Lote', status: 'PENDENTE' },
    { id: 'T7', title: 'Integração Contábil Automática de Folha, Faturamento e Extratos', department: 'Contabil', legalRef: 'NBC TG Estrutura Conceitual', itemsCount: 620, responsible: 'Motor IFRS 1-Click', status: 'PENDENTE' },
    { id: 'T8', title: 'Apuração do Resultado do Exercício (ARE) & Balanço Patrimonial', department: 'Contabil', legalRef: 'CPC 26 (R1)', itemsCount: 1, responsible: 'Contador Responsável', status: 'PENDENTE' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'CONCLUIDO' ? 'PENDENTE' : 'CONCLUIDO';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    showToast('Status da tarefa atualizado com recálculo determinístico do pipeline!');
  };

  const handleAdvanceStep = () => {
    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setStages(prev => prev.map(s => {
        if (s.id < next) return { ...s, status: 'CONCLUIDO', progress: 100 };
        if (s.id === next) return { ...s, status: 'EM_ANDAMENTO', progress: 50 };
        return s;
      }));
      showToast(`Esteira avançada com sucesso para a Etapa ${next}!`);
    } else {
      showToast('O ciclo de encerramento já atingiu a Etapa 5 (Dossiê & Entrega Final)!');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof setShowDossierModal !== 'undefined') setShowDossierModal(false);
        if (typeof setShowA4Dossier !== 'undefined') setShowA4Dossier(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {/* Toast Notification */}
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
            🚀
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Esteira de Fechamento Integrada (Pipeline Fiscal ➔ DP ➔ Contábil)
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
                DIAMOND MASTER
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Orquestração determinística em linha do tempo com sincronização automática e quitação formal de obrigações.
            </p>
          </div>
        </div>

        {/* Botões de Ação de Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowA4Dossier(!showA4Dossier)}
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
            <Printer size={14} /> <span>{showA4Dossier ? 'Ocultar Dossiê' : 'Visualizar Dossiê A4'}</span>
          </button>

          <button
            onClick={handleAdvanceStep}
            className="btn-1click-3d"
          >
            <Zap size={14} /> <span>Avançar Etapa 1-Click</span>
          </button>
        </div>
      </div>

      {/* 2. Visualizador da Linha do Tempo (5 Etapas) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
        {stages.map((stage) => {
          const isActive = currentStep === stage.id;
          const isDone = stage.status === 'CONCLUIDO';
          return (
            <div
              key={stage.id}
              onClick={() => setCurrentStep(stage.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, #182C4A 0%, #0F1D33 100%)'
                  : isDone
                  ? 'linear-gradient(180deg, #10222F 0%, #0B1720 100%)'
                  : 'linear-gradient(180deg, #121A2B 0%, #0A0F1A 100%)',
                border: isActive
                  ? '1.5px solid #38BDF8'
                  : isDone
                  ? '1.5px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: isActive
                  ? '3px solid #0284C7'
                  : isDone
                  ? '3px solid #059669'
                  : '2px solid rgba(0, 0, 0, 0.5)',
                borderRadius: '10px',
                padding: '14px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '1rem' }}>
                  {stage.id === 1 ? '💰' : stage.id === 2 ? '👥' : stage.id === 3 ? '📄' : stage.id === 4 ? '📊' : '🏆'}
                </span>
                <span style={{
                  fontSize: '0.60rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isDone ? 'rgba(16, 185, 129, 0.2)' : isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: isDone ? '#34D399' : isActive ? '#38BDF8' : '#94A3B8'
                }}>
                  {isDone ? 'CONCLUÍDO' : isActive ? 'EM ANDAMENTO' : 'PENDENTE'}
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#FFFFFF' }}>{stage.name}</div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8', marginTop: '2px', minHeight: '28px' }}>{stage.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.68rem' }}>
                <span style={{ color: '#64748B' }}>SLA: {stage.sla}</span>
                <span style={{ color: isDone ? '#34D399' : isActive ? '#38BDF8' : '#64748B', fontWeight: 800 }}>{stage.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${stage.progress}%`, height: '100%', background: isDone ? '#10B981' : '#38BDF8' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Tabela de Detalhamento de Tarefas & Triangulação */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Detalhamento de Tarefas & Triangulação Departamental
            </h3>
            <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.74rem' }}>
              Competência Ativa: <strong style={{ color: '#34D399' }}>{selectedCompetencia}</strong> • Clique no status para alternar ou aprovar
            </p>
          </div>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID / Atividade</th>
              <th style={{ textAlign: 'center' }}>Departamento</th>
              <th style={{ textAlign: 'center' }}>Base Legal</th>
              <th style={{ textAlign: 'center' }}>Volumetria</th>
              <th style={{ textAlign: 'center' }}>Responsável</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <span style={{ color: '#34D399', marginRight: '6px' }}>{task.id}</span>
                  {task.title}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: task.department === 'Fiscal' ? 'rgba(16, 185, 129, 0.15)' : task.department === 'DP' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: task.department === 'Fiscal' ? '#34D399' : task.department === 'DP' ? '#38BDF8' : '#A5B4FC',
                    fontWeight: 800
                  }}>
                    {task.department}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94A3B8' }}>
                  {task.legalRef}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: '#FFFFFF' }}>
                  {task.itemsCount} registros
                </td>
                <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.70rem' }}>
                  {task.responsible}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '5px',
                      background: task.status === 'CONCLUIDO' ? 'rgba(16, 185, 129, 0.2)' : task.status === 'EM_ANDAMENTO' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: task.status === 'CONCLUIDO' ? '#34D399' : task.status === 'EM_ANDAMENTO' ? '#FBBF24' : '#94A3B8',
                      border: task.status === 'CONCLUIDO' ? '1px solid rgba(16, 185, 129, 0.4)' : task.status === 'EM_ANDAMENTO' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {task.status === 'CONCLUIDO' ? '✓ Concluído' : task.status === 'EM_ANDAMENTO' ? '⚡ Em Execução' : '⏳ Pendente'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleTaskStatus(task.id)}
                    style={{
                      background: task.status === 'CONCLUIDO' ? '#0B1120' : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      border: task.status === 'CONCLUIDO' ? '1px solid rgba(255,255,255,0.15)' : '1px solid #34D399',
                      color: task.status === 'CONCLUIDO' ? '#94A3B8' : '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {task.status === 'CONCLUIDO' ? 'Reabrir' : 'Concluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Dossiê Oficial A4 Diamante de Encerramento (MODAL FULLSCREEN DE ALTA FIDELIDADE) */}
      {showA4Dossier && (
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
          {/* Barra de Ações do Modal */}
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
                Dossiê Executivo de Encerramento (Padrão Diamante A4)
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
                onClick={() => setShowA4Dossier(false)}
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

          {/* Folha Física A4 */}
          <div className="diamond-paper-a4" style={{ width: '100%', maxWidth: '900px', marginBottom: '30px' }}>
            <div className="diamond-header">
              <div>
                <div className="diamond-title">Relatório Executivo de Encerramento Integrado</div>
                <div className="diamond-subtitle">
                  Certificado de Triangulação Fiscal, Trabalhista & IFRS • Padrão Diamante
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Protocolo:</strong> ENC-{selectedCompetencia.replace('/', '')}-0982</div>
                <div><strong>Emissão:</strong> 19/08/2026 17:30</div>
              </div>
            </div>

            <div className="diamond-meta-grid">
              <div className="diamond-meta-item">
                <strong>Empresa / Entidade</strong>
                <span>{tenant?.name || 'Soberano Tech S/A'}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>CNPJ / Regime</strong>
                <span>{tenant?.cnpj || '12.345.678/0001-90'} • Lucro Real</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Competência</strong>
                <span>{selectedCompetencia}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Status de Conformidade</strong>
                <span style={{ color: '#047857' }}>100% REGULAR (CND OK)</span>
              </div>
            </div>

            <div className="diamond-kpi-row">
              <div className="diamond-kpi-box">
                <strong>Documentos Fiscais</strong>
                <div className="value">482 NFs</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Folha eSocial (CLT)</strong>
                <div className="value">38 Colab.</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Tributos Apurados</strong>
                <div className="value">R$ 148.920,40</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Lucro Líquido Contábil</strong>
                <div className="value">R$ 382.400,00</div>
              </div>
            </div>

            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Atividade Crítica</th>
                  <th>Base Legal</th>
                  <th>Status de Conciliação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Fiscal & SPED</strong></td>
                  <td>Escrituração DF-e & EFD-ICMS/IPI</td>
                  <td>Ajuste SINIEF 07/05</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ 100% Conciliado</td>
                </tr>
                <tr>
                  <td><strong>DP & eSocial</strong></td>
                  <td>Folha de Pagamento & S-1299</td>
                  <td>CLT / Manual MOS</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ 100% Transmitido</td>
                </tr>
                <tr>
                  <td><strong>Contábil IFRS</strong></td>
                  <td>Partidas Dobradas & Balancete ARE</td>
                  <td>NBC TG / CPC 00</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Ativo = Passivo + PL</td>
                </tr>
              </tbody>
            </table>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DIRETORIA CONTÁBIL & TRIBUTÁRIA</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Contador Responsável • CRC 1SP999999/O-0</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA EXECUTIVA</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Diretor Financeiro / CFO</div>
              </div>
              <div className="diamond-signature-line">
                <div>AUDITORIA FORENSE</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Comitê de Compliance & Riscos</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeIntegratedClosingPipelineView;
