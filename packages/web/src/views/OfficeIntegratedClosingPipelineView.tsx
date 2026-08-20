import React, { useState } from 'react';
import {
  Workflow,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  ChevronRight,
  Building2,
  Calendar,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store';

interface StageTask {
  id: string;
  title: string;
  department: 'Fiscal' | 'DP' | 'Tributário' | 'Contábil' | 'Diretoria';
  status: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE';
  responsible: string;
  itemsCount: number;
  criticality: 'ALTA' | 'MEDIA' | 'BAIXA';
  legalRef: string;
}

export const OfficeIntegratedClosingPipelineView: React.FC<{ tenant?: CompanyTenant }> = ({ tenant }) => {
  const [activeStage, setActiveStage] = useState<number>(3); // 1 to 5
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showA4Dossier, setShowA4Dossier] = useState<boolean>(false);

  const stages = [
    {
      step: 1,
      name: 'Fiscal & DFe',
      icon: '💰',
      subtitle: 'Captura DFe, EFD ICMS/IPI & PIS/COFINS',
      status: 'CONCLUIDO',
      progress: 100,
      slaHours: '4.5h'
    },
    {
      step: 2,
      name: 'Folha DP & eSocial',
      icon: '👥',
      subtitle: 'Apuração CLT, S-1200 & FGTS Digital',
      status: 'CONCLUIDO',
      progress: 100,
      slaHours: '3.2h'
    },
    {
      step: 3,
      name: 'DCTFWeb & Guias',
      icon: '📑',
      subtitle: 'Fechamento DCTFWeb & DARFs Previdenciários',
      status: 'EM_ANDAMENTO',
      progress: 75,
      slaHours: '1.8h'
    },
    {
      step: 4,
      name: 'Contabilidade IFRS',
      icon: '📚',
      subtitle: 'Partidas Dobradas, Razão & ARE CPC 00',
      status: 'PENDENTE',
      progress: 0,
      slaHours: 'Estimado 2.0h'
    },
    {
      step: 5,
      name: 'Dossiê & Entrega',
      icon: '🏆',
      subtitle: 'Balanço, DRE & 3 Assinaturas Formais',
      status: 'PENDENTE',
      progress: 0,
      slaHours: 'Estimado 1.0h'
    }
  ];

  const tasks: StageTask[] = [
    { id: 'T1', title: 'Validação de NF-e/NFC-e de Entrada e Saída (100% conciliadas)', department: 'Fiscal', status: 'CONCLUIDO', responsible: 'Robô Fiscal DFe', itemsCount: 482, criticality: 'ALTA', legalRef: 'Ajuste SINIEF 07/05' },
    { id: 'T2', title: 'Segregação Monofásica PIS/COFINS e Alíquota Zero', department: 'Fiscal', status: 'CONCLUIDO', responsible: 'Auditor Tributário', itemsCount: 64, criticality: 'ALTA', legalRef: 'Lei 10.147/00' },
    { id: 'T3', title: 'Fechamento de Folha de Pagamento CLT & Pró-labore', department: 'DP', status: 'CONCLUIDO', responsible: 'Especialista DP', itemsCount: 38, criticality: 'ALTA', legalRef: 'CLT Art. 457' },
    { id: 'T4', title: 'Transmissão eSocial Eventos Periódicos S-1200 e S-1210', department: 'DP', status: 'CONCLUIDO', responsible: 'Gateway eSocial', itemsCount: 38, criticality: 'ALTA', legalRef: 'Manual MOS v.S-1.3' },
    { id: 'T5', title: 'Transmissão DCTFWeb e Geração de DARF Previdenciário Único', department: 'Tributário', status: 'EM_ANDAMENTO', responsible: 'Tributário Gov', itemsCount: 1, criticality: 'ALTA', legalRef: 'IN RFB 2.005/21' },
    { id: 'T6', title: 'Emissão de Guias com QR Code Pix e Envio Automático ao Cliente', department: 'Tributário', status: 'PENDENTE', responsible: 'Disparo em Lote', itemsCount: 4, criticality: 'MEDIA', legalRef: 'Res. CGSN 140/18' },
    { id: 'T7', title: 'Integração Contábil Automática de Folha, Faturamento e Extratos', department: 'Contabil', status: 'PENDENTE', responsible: 'Motor IFRS 1-Click', itemsCount: 620, criticality: 'ALTA', legalRef: 'NBC TG Estrutura Conceitual' },
    { id: 'T8', title: 'Apuração do Resultado do Exercício (ARE) & Balanço Patrimonial', department: 'Contabil', status: 'PENDENTE', responsible: 'Contador Responsável', itemsCount: 1, criticality: 'ALTA', legalRef: 'CPC 26 (R1)' }
  ];

  const handleAdvancePipeline = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (activeStage < 5) {
        setActiveStage(prev => prev + 1);
      }
    }, 900);
  };

  return (
    <div className="pipeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header Executivo 3D */}
      <div
        style={{
          background: 'linear-gradient(135deg, #131E35 0%, #0B1120 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
              color: '#070B12',
              fontWeight: 900
            }}
          >
            <Workflow size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Esteira de Fechamento Integrada (Pipeline Fiscal ➔ DP ➔ Contábil)
              </h2>
              <span
                style={{
                  background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.5)',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                }}
              >
                DIAMOND MASTER
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Orquestração determinística em linha do tempo com sincronização automática e quitação formal de obrigações.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowA4Dossier(prev => !prev)}
            style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.76rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.35)'
            }}
          >
            <Printer size={14} />
            {showA4Dossier ? 'Ocultar Dossiê A4' : 'Visualizar Dossiê A4'}
          </button>

          <button
            onClick={handleAdvancePipeline}
            disabled={isProcessing}
            className="btn-1click-3d"
            style={{ padding: '6px 16px', fontSize: '0.78rem' }}
          >
            <Zap size={14} />
            {isProcessing ? 'Sincronizando...' : '⚡ Avançar Etapa 1-Click'}
          </button>
        </div>
      </div>

      {/* 2. Barra de Linha do Tempo 3D (Pipeline Stages) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px'
        }}
      >
        {stages.map((st) => {
          const isCurrent = activeStage === st.step;
          const isDone = st.status === 'CONCLUIDO' || activeStage > st.step;

          return (
            <div
              key={st.step}
              onClick={() => setActiveStage(st.step)}
              style={{
                background: isCurrent
                  ? 'linear-gradient(180deg, #1D2B48 0%, #101B2E 100%)'
                  : 'linear-gradient(180deg, #141E33 0%, #0D1424 100%)',
                border: isCurrent
                  ? '1.5px solid #34D399'
                  : isDone
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: isCurrent ? '2px solid #059669' : '2px solid rgba(0, 0, 0, 0.4)',
                borderRadius: '10px',
                padding: '12px 14px',
                cursor: 'pointer',
                boxShadow: isCurrent
                  ? '0 0 16px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 3px 8px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>{st.icon}</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isDone ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: isDone ? '#34D399' : isCurrent ? '#38BDF8' : '#94A3B8',
                    border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {isDone ? 'CONCLUÍDO' : isCurrent ? 'EM ANDAMENTO' : 'PENDENTE'}
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                Etapa {st.step}: {st.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                {st.subtitle}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                <span>SLA: {st.slaHours}</span>
                <span style={{ fontWeight: 800, color: isDone ? '#34D399' : '#FFFFFF' }}>
                  {isDone ? '100%' : isCurrent ? `${st.progress}%` : '0%'}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isDone ? '100%' : isCurrent ? `${st.progress}%` : '0%',
                    height: '100%',
                    background: isDone ? '#10B981' : '#06B6D4',
                    borderRadius: '2px',
                    boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Tabela de Atividades da Esteira */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131D33 0%, #0A0F1D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: '#34D399' }} />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Detalhamento de Tarefas & Triangulação Departamental
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
            Competência Ativa: <strong style={{ color: '#34D399' }}>{selectedCompetencia}</strong>
          </span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Dossiê Oficial A4 Diamante de Encerramento (Impressão Cristalina) */}
      {showA4Dossier && (
        <div className="diamond-report-card" style={{ marginTop: '10px' }}>
          <div className="diamond-paper-a4">
            {/* Header do Dossiê */}
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

            {/* Metadados */}
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

            {/* KPIs do Fechamento */}
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
                <strong>Partidas Dobradas</strong>
                <div className="value">620 Lanç.</div>
              </div>
            </div>

            {/* Quadro de Parecer Técnico */}
            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Dimensão Operacional</th>
                  <th>Sistema Governamental</th>
                  <th>Base Legal / Resolução</th>
                  <th>Resultado da Auditoria</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Escrituração Fiscal Digital</td>
                  <td>SPED EFD ICMS/IPI & Contribuições</td>
                  <td>Ajuste SINIEF 02/09 • Lei 10.833/03</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Transmitido sem inconsistências</td>
                </tr>
                <tr>
                  <td>Folha de Pagamento & Encargos</td>
                  <td>eSocial & FGTS Digital</td>
                  <td>Decreto 8.373/14 • Lei 14.438/22</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Eventos S-1200/S-1210 Validados</td>
                </tr>
                <tr>
                  <td>Tributos Federais & Previdência</td>
                  <td>DCTFWeb & DARF Único</td>
                  <td>IN RFB nº 2.005/2021</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Guias emitidas com Pix Copia-e-Cola</td>
                </tr>
                <tr>
                  <td>Contabilidade IFRS / NBC TG</td>
                  <td>ECD / ECF Sped Contábil</td>
                  <td>NBC TG 26 (R5) • Lei 11.638/07</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Balancete e ARE Integrados em 1-Click</td>
                </tr>
              </tbody>
            </table>

            {/* 3 Assinaturas Formais Padrão Diamante */}
            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DAVID VALU</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Contador Responsável • CRC 1SP999999/O-0</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA EXECUTIVA</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Soberano Tech S/A • Representante Legal</div>
              </div>
              <div className="diamond-signature-line">
                <div>COMITÊ DE AUDITORIA & RISCOS</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Parecer Técnico Independente IFRS</div>
              </div>
            </div>

            {/* Selo e Watermark */}
            <div className="diamond-watermark-seal">
              <span>🔒 Hash SHA-256: 8f9b2c01948e77a1bc34d92ef10874c930491823948712398471239487123490</span>
              <span>Soberano Contábil Platinum Suite v4.5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OfficeIntegratedClosingPipelineView;
