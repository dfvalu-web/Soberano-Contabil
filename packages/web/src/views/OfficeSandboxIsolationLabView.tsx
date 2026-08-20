// SOBERANO CONTÁBIL — PLATINUM SUITE ENTERPRISE v4.5
// MÓDULO SANDBOX & LABORATÓRIO DE QUARENTENA EMPRESARIAL (ISOLAMENTO SEGURO PRÉ-PRODUÇÃO)

import React, { useState, useMemo } from 'react';
import {
  TestTube2,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Sparkles,
  Building,
  Scale,
  Lock,
  Unlock,
  FileText,
  Search,
  PlusCircle,
  TrendingDown,
  Trash2,
  CheckSquare
} from 'lucide-react';
import {
  OfficeSandboxEngine,
  SandboxCompanyInstance,
  SandboxDiagnosticCheck,
  SandboxScenarioResult
} from '../engines/office-sandbox-engine.js';

export const OfficeSandboxIsolationLabView: React.FC = () => {
  const [instances, setInstances] = useState<SandboxCompanyInstance[]>(() => OfficeSandboxEngine.getIsolatedCompanies());
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('SBX-001');
  const [activeTab, setActiveTab] = useState<'QUARENTENA' | 'SIMULACAO' | 'DIAGNOSTICO' | 'HOMOLOGACAO'>('QUARENTENA');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showIsolateModal, setShowIsolateModal] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Formulário de Nova Quarentena
  const [newCnpj, setNewCnpj] = useState<string>('55.444.333/0001-99');
  const [newCorpName, setNewCorpName] = useState<string>('PRISMA SERVICOS E CONSULTORIA EMPRESARIAL LTDA');
  const [newTradeName, setNewTradeName] = useState<string>('Prisma Consult');
  const [newRegime, setNewRegime] = useState<'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'>('SIMPLES_NACIONAL');
  const [newReason, setNewReason] = useState<string>('Auditoria prévia de fechamento contábil e revisão de retenções tributárias');

  const selectedInstance = useMemo(() => {
    return instances.find(i => i.id === selectedInstanceId) || instances[0];
  }, [instances, selectedInstanceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleIsolateNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const created = OfficeSandboxEngine.isolateCompany(
      newCnpj,
      newCorpName,
      newTradeName,
      newRegime,
      newReason,
      'dfvalu@gmail.com'
    );
    setInstances(OfficeSandboxEngine.getIsolatedCompanies());
    setSelectedInstanceId(created.id);
    setShowIsolateModal(false);
    showToast(`Empresa "${created.corporateName}" isolada no Sandbox com sucesso!`);
  };

  const handleRunDiagnostic = () => {
    const updated = OfficeSandboxEngine.runDeepDiagnostic(selectedInstanceId);
    if (updated) {
      setInstances(OfficeSandboxEngine.getIsolatedCompanies());
      showToast('Varredura diagnóstica profunda concluída no Sandbox!');
    }
  };

  const handleApplyScenario = (regime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL') => {
    const updated = OfficeSandboxEngine.applyTaxScenario(selectedInstanceId, regime);
    if (updated) {
      setInstances(OfficeSandboxEngine.getIsolatedCompanies());
      showToast(`Cenário de enquadramento no ${regime} simulado com sucesso no Sandbox!`);
    }
  };

  const handleFixDiscrepancy = () => {
    const updated = OfficeSandboxEngine.fixDiscrepancy(selectedInstanceId);
    if (updated) {
      setInstances(OfficeSandboxEngine.getIsolatedCompanies());
      showToast('Divergência contábil corrigida no Sandbox! Partidas dobradas conciliadas.');
    }
  };

  const handlePromoteToProduction = () => {
    const result = OfficeSandboxEngine.promoteToProduction(selectedInstanceId, 'dfvalu@gmail.com');
    if (result.success) {
      setInstances(OfficeSandboxEngine.getIsolatedCompanies());
      showToast(result.message);
    } else {
      showToast(result.message);
    }
  };

  const handleReleaseSandbox = (id: string) => {
    OfficeSandboxEngine.releaseFromQuarantine(id);
    const remaining = OfficeSandboxEngine.getIsolatedCompanies();
    setInstances(remaining);
    if (remaining.length > 0) {
      setSelectedInstanceId(remaining[0].id);
    }
    showToast('Empresa liberada do Sandbox com sucesso.');
  };

  const filteredInstances = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return instances;
    return instances.filter(i =>
      i.corporateName.toLowerCase().includes(q) ||
      i.cnpj.includes(q) ||
      i.tradeName.toLowerCase().includes(q) ||
      i.quarantineReason.toLowerCase().includes(q)
    );
  }, [instances, searchFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond 3D com Âmbar/Neon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%)', border: '1.5px solid #FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>
            🧪
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Laboratório Sandbox & Quarentena Empresarial
              </h1>
              <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                AMBIENTE SEGURO DE HOMOLOGAÇÃO
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Isole empresas com divergências contábeis, teste simulações tributárias da Reforma e homologue dados antes de publicar na produção.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowIsolateModal(true)}
            style={{ background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', border: '1.5px solid #FCD34D', color: '#000000', padding: '8px 16px', borderRadius: '8px', fontSize: '0.80rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)' }}
          >
            <PlusCircle size={14} /> <span>Isolar Empresa no Sandbox</span>
          </button>

          <button
            onClick={() => window.print()}
            style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> <span>Laudo A4</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1.5px solid #FBBF24', color: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
          <CheckCircle2 size={18} color="#FBBF24" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 Cards de Métricas do Sandbox */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #1A1828 0%, #0D0C16 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3.5px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Empresas em Quarentena</span>
            <ShieldAlert size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {instances.length} Empresas
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>100% isoladas dos bancos de produção</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3.5px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Lançamentos Isolados</span>
            <Sliders size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {instances.reduce((sum, i) => sum + i.totalTransactionsIsolated, 0)} Lançamentos
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Auditados em memória segura</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3.5px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Homologação Patrimonial</span>
            <Scale size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {instances.filter(i => i.isBalanced).length} / {instances.length}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Empresas com partidas 100% conciliadas</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(168, 85, 247, 0.35)', borderBottom: '3.5px solid #7E22CE', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Auditoria & Auditor Master</span>
            <Lock size={16} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#C084FC', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            dfvalu@gmail.com
          </div>
          <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>Acesso exclusivo e rastreável</div>
        </div>
      </div>

      {/* Navegação por Abas do Sandbox */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('QUARENTENA')}
          style={{
            background: activeTab === 'QUARENTENA' ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'QUARENTENA' ? '1.5px solid #FBBF24' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'QUARENTENA' ? '#FBBF24' : '#94A3B8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.80rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldAlert size={14} /> <span>1. Empresas Isoladas & Quarentena ({instances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULACAO')}
          style={{
            background: activeTab === 'SIMULACAO' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'SIMULACAO' ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'SIMULACAO' ? '#38BDF8' : '#94A3B8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.80rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sliders size={14} /> <span>2. Laboratório de Simulação Tributária (What-If)</span>
        </button>

        <button
          onClick={() => setActiveTab('DIAGNOSTICO')}
          style={{
            background: activeTab === 'DIAGNOSTICO' ? 'linear-gradient(180deg, rgba(52, 211, 153, 0.25) 0%, rgba(5, 150, 105, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'DIAGNOSTICO' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'DIAGNOSTICO' ? '#34D399' : '#94A3B8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.80rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckSquare size={14} /> <span>3. Scanner de Diagnóstico & Checkpoints</span>
        </button>

        <button
          onClick={() => setActiveTab('HOMOLOGACAO')}
          style={{
            background: activeTab === 'HOMOLOGACAO' ? 'linear-gradient(180deg, rgba(168, 85, 247, 0.25) 0%, rgba(126, 34, 206, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'HOMOLOGACAO' ? '1.5px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'HOMOLOGACAO' ? '#C084FC' : '#94A3B8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.80rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileText size={14} /> <span>4. Homologação & Promoção para Produção</span>
        </button>
      </div>

      {/* ABA 1: EMPRESAS ISOLADAS & QUARENTENA */}
      {activeTab === 'QUARENTENA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Seletor & Busca de Empresas em Quarentena */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FBBF24' }}>
              Selecione uma empresa isolada para operar no Sandbox:
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748B' }} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar por nome, CNPJ ou motivo..."
                style={{ background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px 7px 30px', fontSize: '0.76rem', outline: 'none', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {filteredInstances.map(inst => {
              const isSelected = selectedInstanceId === inst.id;
              return (
                <div
                  key={inst.id}
                  onClick={() => setSelectedInstanceId(inst.id)}
                  style={{
                    background: isSelected ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.18) 0%, rgba(13, 12, 22, 0.95) 100%)' : 'linear-gradient(180deg, #141B2E 0%, #0A0F1E 100%)',
                    border: isSelected ? '2px solid #FBBF24' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderBottom: isSelected ? '3.5px solid #D97706' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: isSelected ? '0 0 20px rgba(245, 158, 11, 0.35)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.64rem', color: '#FBBF24', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                        {inst.id} • QUARENTENA ATIVA
                      </div>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#FFFFFF', margin: '3px 0 0 0' }}>
                        {inst.corporateName}
                      </h3>
                      <div style={{ fontSize: '0.68rem', color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                        CNPJ: {inst.cnpj} ({inst.tradeName})
                      </div>
                    </div>

                    <span style={{ background: inst.isBalanced ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: inst.isBalanced ? '#34D399' : '#EF4444', border: `1px solid ${inst.isBalanced ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`, padding: '2px 8px', borderRadius: '4px', fontSize: '0.60rem', fontWeight: 900 }}>
                      {inst.isBalanced ? '✓ CONCILIADO' : '⚠️ DIVERGÊNCIA'}
                    </span>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.70rem', color: '#CBD5E1', borderLeft: '3px solid #FBBF24' }}>
                    <strong>Motivo da Quarentena:</strong> {inst.quarantineReason}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                    <div>Regime: <strong style={{ color: '#E2E8F0' }}>{inst.sandboxTaxRegime}</strong></div>
                    <div>Lançamentos: <strong style={{ color: '#38BDF8' }}>{inst.totalTransactionsIsolated}</strong></div>
                    <div>Colaboradores: <strong style={{ color: '#FBBF24' }}>{inst.totalEmployeesIsolated}</strong></div>
                  </div>

                  {/* Ações Rápidas no Card */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {!inst.isBalanced && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleFixDiscrepancy(); }}
                        style={{ background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', border: '1px solid #6EE7B7', color: '#FFFFFF', padding: '5px 10px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer', flex: 1 }}
                      >
                        ✓ Corrigir Divergência (1-Click)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleReleaseSandbox(inst.id); }}
                      style={{ background: '#080D1A', border: '1px solid rgba(255,255,255,0.12)', color: '#94A3B8', padding: '5px 8px', borderRadius: '5px', fontSize: '0.68rem', cursor: 'pointer' }}
                      title="Liberar da Quarentena"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ABA 2: LABORATÓRIO DE SIMULAÇÃO TRIBUTÁRIA & WHAT-IF */}
      {activeTab === 'SIMULACAO' && (
        <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(56, 189, 248, 0.4)', borderRadius: '14px', padding: '24px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                LABORATÓRIO DE TESTE WHAT-IF • {selectedInstance?.id}
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 0 0' }}>
                Simulação de Regimes & Reforma Tributária: {selectedInstance?.corporateName}
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Alterne os parâmetros tributários em tempo real. As alterações ficam isoladas no Sandbox e não afetam os livros de produção.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleApplyScenario('LUCRO_PRESUMIDO')}
                style={{ background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)', border: '1px solid #38BDF8', color: '#FFFFFF', padding: '8px 14px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
              >
                ⚡ Simular Lucro Presumido
              </button>
              <button
                onClick={() => handleApplyScenario('LUCRO_REAL')}
                style={{ background: 'linear-gradient(180deg, #7E22CE 0%, #6B21A8 100%)', border: '1px solid #C084FC', color: '#FFFFFF', padding: '8px 14px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
              >
                ⚡ Simular Lucro Real (Não-Cumulativo)
              </button>
            </div>
          </div>

          {/* Histórico de Cenários Aplicados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38BDF8', margin: 0 }}>
              Cenários Testados na Memória Isolada:
            </h4>

            {selectedInstance?.appliedScenarios.length === 0 ? (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
                Nenhum cenário de teste executado ainda. Clique nos botões acima para simular regimes tributários no Sandbox.
              </div>
            ) : (
              selectedInstance?.appliedScenarios.map((sc, idx) => (
                <div key={idx} style={{ background: '#080D1A', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#38BDF8' }}>{sc.scenarioName}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>Testado em: {sc.appliedAt}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '4px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Impacto Mensal no Caixa:</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                        {sc.taxImpactMonthly < 0 ? `Economia de R$ ${Math.abs(sc.taxImpactMonthly).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `+ R$ ${sc.taxImpactMonthly.toFixed(2)}`}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Economia Anual Projetada:</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                        R$ {sc.cashFlowImpact.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', fontSize: '0.70rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                    {sc.observations.map((obs, oIdx) => (
                      <li key={oIdx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ABA 3: SCANNER DE DIAGNÓSTICO & CHECKPOINTS */}
      {activeTab === 'DIAGNOSTICO' && (
        <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(52, 211, 153, 0.4)', borderRadius: '14px', padding: '24px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Scanner de Integridade Pré-Produção: {selectedInstance?.corporateName}
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Checklist automatizado de 8 checkpoints contábeis, tributários e de folha para garantir zero erro na produção.
              </p>
            </div>

            <button
              onClick={handleRunDiagnostic}
              style={{ background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', border: '1.5px solid #6EE7B7', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} /> <span>Executar Varredura Diagnóstica</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedInstance?.diagnosticChecks.map(chk => (
              <div
                key={chk.id}
                style={{
                  background: '#080D1A',
                  border: chk.status === 'PASSED' ? '1px solid rgba(52, 211, 153, 0.3)' : chk.status === 'WARNING' ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                      {chk.category}
                    </span>
                    <strong style={{ fontSize: '0.86rem', color: '#FFFFFF' }}>{chk.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '4px' }}>
                    {chk.details}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '2px' }}>
                    💡 <em>{chk.recommendation}</em>
                  </div>
                </div>

                <div>
                  <span style={{ background: chk.status === 'PASSED' ? 'rgba(16, 185, 129, 0.2)' : chk.status === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: chk.status === 'PASSED' ? '#34D399' : chk.status === 'WARNING' ? '#FBBF24' : '#EF4444', border: `1px solid ${chk.status === 'PASSED' ? '#34D399' : chk.status === 'WARNING' ? '#FBBF24' : '#EF4444'}`, padding: '4px 10px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 900 }}>
                    {chk.status === 'PASSED' ? '✓ APROVADO' : chk.status === 'WARNING' ? '⚠️ ATENÇÃO' : '✕ CRÍTICO'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ABA 4: HOMOLOGAÇÃO & PROMOÇÃO PARA PRODUÇÃO */}
      {activeTab === 'HOMOLOGACAO' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(168, 85, 247, 0.4)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Promoção Segura de Sandbox para Produção
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Após todas as validações, publique os dados auditados no banco oficial do escritório com log imutável de governança.
              </p>
            </div>

            <button
              onClick={handlePromoteToProduction}
              style={{ background: 'linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)', border: '1.5px solid #C4B5FD', color: '#FFFFFF', padding: '10px 22px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)' }}
            >
              <Lock size={15} /> <span>Homologar e Publicar na Produção (1-Click)</span>
            </button>
          </div>

          {/* Dossiê Formal A4 */}
          <div className="diamond-paper-a4">
            <div className="diamond-report-header">
              <div className="diamond-report-title">
                <h1>LAUDO OFICIAL DE HOMOLOGAÇÃO SANDBOX & QUARENTENA</h1>
                <h2>AUDITORIA PRÉ-PRODUÇÃO • PARTIDAS DOBRADAS • CONFORMIDADE RFB / IFRS</h2>
              </div>
              <div className="diamond-logo-box">
                <span>🧪 SOBERANO</span>
                <small>SANDBOX LAB</small>
              </div>
            </div>

            <div className="diamond-meta-grid">
              <div className="diamond-meta-item">
                <strong>Empresa Auditada</strong>
                <span>{selectedInstance?.corporateName}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>CNPJ / Regime</strong>
                <span className="font-mono">{selectedInstance?.cnpj} • {selectedInstance?.sandboxTaxRegime}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Instância Sandbox</strong>
                <span className="font-mono">{selectedInstance?.id}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Status de Homologação</strong>
                <span style={{ color: selectedInstance?.isBalanced ? '#047857' : '#DC2626', fontWeight: 900 }}>
                  {selectedInstance?.isBalanced ? '✓ APROVADO PARA PRODUÇÃO' : '⚠️ DIVERGÊNCIA EM QUARENTENA'}
                </span>
              </div>
            </div>

            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Parâmetro de Auditoria</th>
                  <th>Valor Homologado</th>
                  <th>Status de Conformidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Total de Ativo (Balanço de Abertura)</strong></td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {selectedInstance?.assetBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Saldo Devedor Validado</td>
                </tr>
                <tr>
                  <td><strong>Total de Passivo + Patrimônio Líquido</strong></td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {selectedInstance?.liabilityBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Saldo Credor Validado</td>
                </tr>
                <tr>
                  <td><strong>Diferença de Partidas Dobradas</strong></td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {selectedInstance?.balanceDifference.toFixed(2)}</td>
                  <td style={{ color: selectedInstance?.isBalanced ? '#047857' : '#DC2626', fontWeight: 900 }}>
                    {selectedInstance?.isBalanced ? '✓ ZERO DIFERENÇA (100% BALANCEADO)' : '⚠️ DIVERGÊNCIA PENDENTE'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DAVID VALU</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Auditor Master & Desenvolvedor • CRC 1SP999999/O-0</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA DA EMPRESA</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Representante Legal do Cliente</div>
              </div>
              <div className="diamond-signature-line">
                <div>GOVERNANÇA & SEGURANÇA</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Assinatura Digital ICP-Brasil</div>
              </div>
            </div>

            <div className="diamond-watermark-seal">
              <span>🔒 Sandbox Instance: {selectedInstance?.id} • Auditado por: {selectedInstance?.isolatedBy}</span>
              <span>Soberano Contábil Isolation Engine v4.5</span>
            </div>
          </div>

        </div>
      )}

      {/* Modal para Isolar Nova Empresa */}
      {showIsolateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #141D33 0%, #0A0F1E 100%)', border: '1.5px solid #FBBF24', borderRadius: '16px', padding: '28px', maxWidth: '540px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🧪</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Isolar Empresa no Sandbox
                </h3>
              </div>
              <button onClick={() => setShowIsolateModal(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleIsolateNewCompany} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 800 }}>CNPJ da Empresa:</label>
                <input
                  type="text"
                  value={newCnpj}
                  onChange={(e) => setNewCnpj(e.target.value)}
                  style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.78rem', marginTop: '4px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 800 }}>Razão Social:</label>
                <input
                  type="text"
                  value={newCorpName}
                  onChange={(e) => setNewCorpName(e.target.value)}
                  style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.78rem', marginTop: '4px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 800 }}>Regime Tributário:</label>
                <select
                  value={newRegime}
                  onChange={(e: any) => setNewRegime(e.target.value)}
                  style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.78rem', marginTop: '4px', outline: 'none' }}
                >
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                  <option value="LUCRO_REAL">Lucro Real</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 800 }}>Motivo do Isolamento / Quarentena:</label>
                <textarea
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.78rem', marginTop: '4px', outline: 'none', resize: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowIsolateModal(false)}
                  style={{ background: '#080D1A', border: '1px solid rgba(255,255,255,0.15)', color: '#94A3B8', padding: '8px 16px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', border: '1.5px solid #FCD34D', color: '#000000', padding: '8px 20px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer' }}
                >
                  Confirmar Isolamento no Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default OfficeSandboxIsolationLabView;
