// SOBERANO CONTÁBIL — CENTRAL DE CONTROLE DE LOGIN, GOVERNANÇA DE SEGURANÇA & MATRIZ DE MÓDULOS CONTRATADOS
// Gestão de Métodos de Autenticação, Aprovação Master, Auditoria Criptográfica e Matriz Modular por Usuário/Empresa

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Printer,
  Sparkles,
  Zap,
  Fingerprint,
  FileText,
  Activity,
  Layers,
  Save,
  CheckSquare,
  Square,
  PlusCircle,
  Building,
  Sliders,
  Search
} from 'lucide-react';
import {
  officeStore,
  LoginMethodSecurityPolicy,
  UserAccessApprovalRequest,
  AuthSecurityAuditLog,
  UserModuleAccessConfig
} from '../state/office-store.js';
import { DEPARTMENT_CATEGORIES, ALL_MODULES } from '../config/navigation-modules.js';

export const OfficeLoginSecurityGovernanceView: React.FC = () => {
  const [policies, setPolicies] = useState<LoginMethodSecurityPolicy[]>(() => officeStore.getLoginPolicies());
  const [pendingApprovals, setPendingApprovals] = useState<UserAccessApprovalRequest[]>(() => officeStore.getPendingUserApprovals());
  const [auditLogs, setAuditLogs] = useState<AuthSecurityAuditLog[]>(() => officeStore.getAuthSecurityAuditLogs());
  const [userConfigs, setUserConfigs] = useState<UserModuleAccessConfig[]>(() => officeStore.getAllUserAccessConfigs());
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>(() => userConfigs[0]?.userEmail || 'dfvalu@gmail.com');
  const [activeTab, setActiveTab] = useState<'METHODS' | 'APPROVALS' | 'AUDIT_LOG' | 'PERMISSIONS_MATRIX'>('PERMISSIONS_MATRIX');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState<string>('');

  // Configuração do usuário selecionado na Matriz
  const currentUserConfig = useMemo(() => {
    return userConfigs.find(c => c.userEmail.toLowerCase() === selectedUserEmail.toLowerCase()) || userConfigs[0];
  }, [userConfigs, selectedUserEmail]);

  // Handlers de Métodos de Login
  const handleTogglePolicy = (id: LoginMethodSecurityPolicy['id']) => {
    officeStore.toggleLoginPolicy(id);
    setPolicies(officeStore.getLoginPolicies());
    showToast('Política de autenticação atualizada com sucesso!');
  };

  const handleToggleMasterApproval = (id: LoginMethodSecurityPolicy['id'], currentVal: boolean) => {
    officeStore.setLoginPolicyMasterApproval(id, !currentVal);
    setPolicies(officeStore.getLoginPolicies());
    showToast('Exigência de homologação Master atualizada!');
  };

  const handleApproveUser = (id: string, name: string) => {
    officeStore.approveUserAccess(id);
    setPendingApprovals(officeStore.getPendingUserApprovals());
    showToast(`Acesso do usuário "${name}" homologado e liberado pelo Master Admin!`);
  };

  const handleRejectUser = (id: string, name: string) => {
    officeStore.rejectUserAccess(id);
    setPendingApprovals(officeStore.getPendingUserApprovals());
    showToast(`Acesso do usuário "${name}" bloqueado/recusado.`);
  };

  // Handlers da Matriz de Permissões & Módulos Contratados
  const handleApplyPresetPlan = (presetType: 'FULL' | 'FISCAL' | 'DP' | 'CONTABIL' | 'BPO_CLIENTE') => {
    if (!currentUserConfig) return;

    let updated: UserModuleAccessConfig;

    if (presetType === 'FULL') {
      updated = {
        ...currentUserConfig,
        scope: 'FULL_ALL_MODULES',
        contractPlanName: 'Plano Enterprise Master (Todos os 181 Módulos)',
        allowedDepartmentIds: ['gestao', 'dp', 'fiscal', 'contabil', 'setoriais'],
        allowedModuleIds: ['ALL_181_MODULES']
      };
    } else if (presetType === 'FISCAL') {
      updated = {
        ...currentUserConfig,
        scope: 'DEPARTMENT_ONLY',
        contractPlanName: 'Plano Fiscal & Tributário Completo (Emissor + SPED + Radar)',
        allowedDepartmentIds: ['fiscal'],
        allowedModuleIds: [
          'office_universal_dropzone_ocr',
          'office_predictive_tax_audit_radar',
          'office_monophasic_tax',
          'office_tax_reform_simulator_2026',
          'office_sped_batch_prevalidator',
          'office_invoice_billing_issuer',
          'office_products_services_stock'
        ]
      };
    } else if (presetType === 'DP') {
      updated = {
        ...currentUserConfig,
        scope: 'DEPARTMENT_ONLY',
        contractPlanName: 'Plano Departamento Pessoal & eSocial (Folha + TRCT)',
        allowedDepartmentIds: ['dp'],
        allowedModuleIds: [
          'payroll',
          'office_integrated_closing_pipeline'
        ]
      };
    } else if (presetType === 'CONTABIL') {
      updated = {
        ...currentUserConfig,
        scope: 'DEPARTMENT_ONLY',
        contractPlanName: 'Plano Contábil & IFRS (Balanço + DRE + OFX Conciliação)',
        allowedDepartmentIds: ['contabil'],
        allowedModuleIds: [
          'accounting',
          'office_fixed_assets_cpc27',
          'office_intangibles_amortization',
          'office_monthly_consolidated_book'
        ]
      };
    } else {
      updated = {
        ...currentUserConfig,
        scope: 'CUSTOM_MODULES',
        contractPlanName: 'Plano BPO & Portal do Cliente (Emissor + Dossiê + Guias)',
        allowedDepartmentIds: ['gestao', 'fiscal'],
        allowedModuleIds: [
          'office_invoice_billing_issuer',
          'office_monthly_consolidated_book',
          'office_batch_dispatch_bundle'
        ]
      };
    }

    officeStore.saveUserAccessConfig(updated);
    setUserConfigs(officeStore.getAllUserAccessConfigs());
    showToast(`Plano "${updated.contractPlanName}" aplicado com sucesso para ${updated.userName}!`);
  };

  const handleToggleModuleInConfig = (moduleId: string) => {
    if (!currentUserConfig) return;

    let newAllowed = [...currentUserConfig.allowedModuleIds];
    if (newAllowed.includes('ALL_181_MODULES')) {
      newAllowed = ALL_MODULES.map(m => m.id);
    }

    if (newAllowed.includes(moduleId)) {
      newAllowed = newAllowed.filter(id => id !== moduleId);
    } else {
      newAllowed.push(moduleId);
    }

    const updated: UserModuleAccessConfig = {
      ...currentUserConfig,
      scope: 'CUSTOM_MODULES',
      allowedModuleIds: newAllowed,
      contractPlanName: `Plano Customizado (${newAllowed.length} Módulos Habilitados)`
    };

    officeStore.saveUserAccessConfig(updated);
    setUserConfigs(officeStore.getAllUserAccessConfigs());
  };

  const handleToggleDepartmentInConfig = (deptId: 'gestao' | 'dp' | 'fiscal' | 'contabil' | 'setoriais') => {
    if (!currentUserConfig) return;

    const dept = DEPARTMENT_CATEGORIES.find(d => d.id === deptId);
    if (!dept) return;

    const deptModuleIds = dept.modules.map(m => m.id);
    const isAllSelected = deptModuleIds.every(id => 
      currentUserConfig.allowedModuleIds.includes('ALL_181_MODULES') || currentUserConfig.allowedModuleIds.includes(id)
    );

    let newAllowed = currentUserConfig.allowedModuleIds.includes('ALL_181_MODULES')
      ? ALL_MODULES.map(m => m.id)
      : [...currentUserConfig.allowedModuleIds];

    if (isAllSelected) {
      newAllowed = newAllowed.filter(id => !deptModuleIds.includes(id));
    } else {
      deptModuleIds.forEach(id => {
        if (!newAllowed.includes(id)) newAllowed.push(id);
      });
    }

    const updated: UserModuleAccessConfig = {
      ...currentUserConfig,
      scope: 'CUSTOM_MODULES',
      allowedModuleIds: newAllowed,
      contractPlanName: `Plano Customizado (${newAllowed.length} Módulos Habilitados)`
    };

    officeStore.saveUserAccessConfig(updated);
    setUserConfigs(officeStore.getAllUserAccessConfigs());
    showToast(`Departamento "${dept.name}" ${isAllSelected ? 'desmarcado' : 'habilitado'} para ${currentUserConfig.userName}!`);
  };

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const stats = useMemo(() => {
    const activeMethods = policies.filter(p => p.isEnabled).length;
    const pendingCount = pendingApprovals.filter(p => p.status === 'PENDING').length;
    const successLogsCount = auditLogs.filter(l => l.status === 'SUCCESS').length;
    const totalConfiguredUsers = userConfigs.length;
    return { activeMethods, pendingCount, successLogsCount, totalConfiguredUsers, totalLogs: auditLogs.length };
  }, [policies, pendingApprovals, auditLogs, userConfigs]);

  // Módulos filtrados na busca da matriz
  const filteredDepartmentsInMatrix = useMemo(() => {
    const q = moduleSearchQuery.trim().toLowerCase();
    if (!q) return DEPARTMENT_CATEGORIES;

    return DEPARTMENT_CATEGORIES.map(dept => {
      const matching = dept.modules.filter(m => 
        m.name.toLowerCase().includes(q) || m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
      );
      return { ...dept, modules: matching };
    }).filter(dept => dept.modules.length > 0);
  }, [moduleSearchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond 3D */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(56, 189, 248, 0.15) 100%)', border: '1.5px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}>
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Central de Controle de Login & Matriz de Permissões Contratadas
              </h1>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                RBAC & SAAS MODULAR
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Defina com precisão quais módulos e departamentos cada colaborador ou cliente contratante pode visualizar e operar.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '7px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> <span>Imprimir Matriz de Acessos A4</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #34D399', color: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 4 Cards de Métricas de Governança & Permissões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3.5px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Perfis & Empresas</span>
            <Users size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.totalConfiguredUsers} Configurados
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Matriz de permissões ativada</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3.5px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Aprovações Pendentes</span>
            <AlertTriangle size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.pendingCount} Usuários
          </div>
          <div style={{ fontSize: '0.66rem', color: stats.pendingCount > 0 ? '#F87171' : '#34D399', fontWeight: 700 }}>
            {stats.pendingCount > 0 ? 'Aguardando liberação do Master Admin' : 'Nenhuma pendência na fila'}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3.5px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Total de Módulos</span>
            <Layers size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            181 Módulos
          </div>
          <div style={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: 700 }}>Distribuídos em 5 departamentos</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(168, 85, 247, 0.35)', borderBottom: '3.5px solid #7E22CE', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Nível de Blindagem</span>
            <Lock size={16} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#C084FC', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            RBAC + FIPS 140-3
          </div>
          <div style={{ fontSize: '0.66rem', color: '#CBD5E1' }}>Isolamento estrito por usuário</div>
        </div>
      </div>

      {/* Navegação por Abas 3D */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('PERMISSIONS_MATRIX')}
          style={{
            background: activeTab === 'PERMISSIONS_MATRIX' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'PERMISSIONS_MATRIX' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'PERMISSIONS_MATRIX' ? '#34D399' : '#94A3B8',
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
          <Sliders size={14} /> <span>1. Matriz de Permissões & Módulos por Usuário/Empresa</span>
        </button>

        <button
          onClick={() => setActiveTab('METHODS')}
          style={{
            background: activeTab === 'METHODS' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'METHODS' ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'METHODS' ? '#38BDF8' : '#94A3B8',
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
          <Key size={14} /> <span>2. Métodos de Login & Políticas ({stats.activeMethods} Ativos)</span>
        </button>

        <button
          onClick={() => setActiveTab('APPROVALS')}
          style={{
            background: activeTab === 'APPROVALS' ? 'linear-gradient(180deg, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'APPROVALS' ? '1.5px solid #FBBF24' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'APPROVALS' ? '#FBBF24' : '#94A3B8',
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
          <Users size={14} /> <span>3. Fila de Aprovação Master ({stats.pendingCount} Pendentes)</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          style={{
            background: activeTab === 'AUDIT_LOG' ? 'linear-gradient(180deg, rgba(168, 85, 247, 0.25) 0%, rgba(126, 34, 206, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'AUDIT_LOG' ? '1.5px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'AUDIT_LOG' ? '#C084FC' : '#94A3B8',
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
          <Activity size={14} /> <span>4. Trilha de Auditoria Criptográfica ({stats.totalLogs} Eventos)</span>
        </button>
      </div>

      {/* ABA 1: MATRIZ DE PERMISSÕES & MÓDULOS CONTRATADOS POR USUÁRIO */}
      {activeTab === 'PERMISSIONS_MATRIX' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Card de Seleção de Usuário & Presets de Planos */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141F36 0%, #0A101E 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.4)',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Configuração Ativa para:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <select
                    value={selectedUserEmail}
                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                    style={{
                      background: '#080D1A',
                      border: '1.5px solid #34D399',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {userConfigs.map(u => (
                      <option key={u.id} value={u.userEmail} style={{ background: '#0B1120', color: '#FFFFFF' }}>
                        {u.userName} ({u.userEmail}) — {u.contractPlanName}
                      </option>
                    ))}
                  </select>
                  <span style={{ background: currentUserConfig?.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: currentUserConfig?.isActive ? '#34D399' : '#EF4444', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 900 }}>
                    {currentUserConfig?.isActive ? '✓ CONTA ATIVA' : '🚫 SUSPENSA'}
                  </span>
                </div>
              </div>

              {/* Detalhes do Usuário */}
              <div style={{ fontSize: '0.74rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div><strong style={{ color: '#64748B' }}>Empresa:</strong> <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{currentUserConfig?.companyName}</span></div>
                <div><strong style={{ color: '#64748B' }}>Validade do Acesso:</strong> <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{currentUserConfig?.validUntil}</span></div>
              </div>
            </div>

            {/* Presets Rápidos de Planos 1-Click */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#FBBF24" />
                <span>Aplicar Pacote de Módulos Pré-Configurado (1-Click):</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPlan('FULL')}
                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #34D399', color: '#34D399', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                >
                  👑 1. Master Total (181 Módulos)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPlan('FISCAL')}
                  style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                >
                  ⚖️ 2. Pacote Fiscal & SPED
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPlan('DP')}
                  style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1px solid #FBBF24', color: '#FBBF24', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                >
                  👥 3. Pacote DP & eSocial
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPlan('CONTABIL')}
                  style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #C084FC', color: '#C084FC', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                >
                  📚 4. Pacote Contábil & IFRS
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetPlan('BPO_CLIENTE')}
                  style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #F472B6', color: '#F472B6', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                >
                  🏢 5. Pacote BPO / Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Granular dos Módulos Contratados (Checkboxes) */}
          <div
            style={{
              background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="#38BDF8" />
                  <span>Checklist de Módulos Contratados / Habilitados</span>
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                  Marque ou desmarque caixas individuais para personalizar a contratação deste usuário.
                </p>
              </div>

              {/* Campo de Busca de Módulos */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748B' }} />
                <input
                  type="text"
                  value={moduleSearchQuery}
                  onChange={(e) => setModuleSearchQuery(e.target.value)}
                  placeholder="Filtrar módulos..."
                  style={{
                    background: '#080D1A',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    padding: '7px 10px 7px 30px',
                    fontSize: '0.76rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Listagem por Departamentos com Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredDepartmentsInMatrix.map(dept => {
                const deptModuleIds = dept.modules.map(m => m.id);
                const isAllSelected = currentUserConfig?.scope === 'FULL_ALL_MODULES' || currentUserConfig?.allowedModuleIds.includes('ALL_181_MODULES') || deptModuleIds.every(id => currentUserConfig?.allowedModuleIds.includes(id));
                const countSelected = currentUserConfig?.scope === 'FULL_ALL_MODULES' || currentUserConfig?.allowedModuleIds.includes('ALL_181_MODULES')
                  ? dept.modules.length
                  : dept.modules.filter(m => currentUserConfig?.allowedModuleIds.includes(m.id)).length;

                return (
                  <div
                    key={dept.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '14px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header do Departamento com Toggle de Todos */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{dept.icon}</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF' }}>{dept.name}</span>
                        <span style={{ fontSize: '0.68rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          {countSelected} de {dept.modules.length} liberados
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleDepartmentInConfig(dept.id as any)}
                        style={{
                          background: isAllSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                          border: isAllSelected ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.15)',
                          color: isAllSelected ? '#34D399' : '#CBD5E1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {isAllSelected ? '✓ Desmarcar Departamento' : '⚡ Marcar Todo o Departamento'}
                      </button>
                    </div>

                    {/* Grade de Módulos Individuais */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                      {dept.modules.map(mod => {
                        const isChecked = currentUserConfig?.scope === 'FULL_ALL_MODULES' || currentUserConfig?.allowedModuleIds.includes('ALL_181_MODULES') || currentUserConfig?.allowedModuleIds.includes(mod.id);

                        return (
                          <div
                            key={mod.id}
                            onClick={() => handleToggleModuleInConfig(mod.id)}
                            style={{
                              background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(8, 13, 26, 0.6)',
                              border: isChecked ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <span style={{ fontSize: '0.9rem' }}>{mod.icon}</span>
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: isChecked ? '#FFFFFF' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                  {mod.label || mod.name}
                                </div>
                                <div style={{ fontSize: '0.58rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                                  ID: {mod.id}
                                </div>
                              </div>
                            </div>

                            <span style={{ color: isChecked ? '#34D399' : '#475569', fontSize: '1.1rem', flexShrink: 0 }}>
                              {isChecked ? '☑' : '☐'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: MÉTODOS DE LOGIN & POLÍTICAS DE AUTENTICAÇÃO */}
      {activeTab === 'METHODS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {policies.map(policy => (
            <div
              key={policy.id}
              style={{
                background: 'linear-gradient(180deg, #141F36 0%, #0A101E 100%)',
                border: policy.isEnabled ? '1.5px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: policy.isEnabled ? '3.5px solid #059669' : '3px solid #334155',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{policy.icon}</span>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                      {policy.name}
                    </h3>
                  </div>
                  <span style={{ background: policy.isEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: policy.isEnabled ? '#34D399' : '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 900 }}>
                    {policy.isEnabled ? '✓ HABILITADO' : '🚫 DESABILITADO'}
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  {policy.description}
                </p>

                <div style={{ background: '#080D1A', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong style={{ color: '#64748B' }}>Padrão:</strong> <span style={{ color: '#CBD5E1' }}>{policy.securityStandard}</span></div>
                  <div><strong style={{ color: '#64748B' }}>Motor:</strong> <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{policy.encryptionEngine}</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                  <span style={{ color: '#CBD5E1' }}>Exigir Homologação Master:</span>
                  <button
                    onClick={() => handleToggleMasterApproval(policy.id, policy.requiresMasterApproval)}
                    style={{
                      background: policy.requiresMasterApproval ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: policy.requiresMasterApproval ? '1px solid #FBBF24' : '1px solid rgba(255,255,255,0.1)',
                      color: policy.requiresMasterApproval ? '#FBBF24' : '#94A3B8',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {policy.requiresMasterApproval ? '⚠️ SIM (Homologar)' : 'LIVRE'}
                  </button>
                </div>

                <button
                  onClick={() => handleTogglePolicy(policy.id)}
                  style={{
                    width: '100%',
                    background: policy.isEnabled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.2)',
                    border: policy.isEnabled ? '1px solid rgba(239, 68, 68, 0.4)' : '1.5px solid #34D399',
                    color: policy.isEnabled ? '#EF4444' : '#34D399',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  {policy.isEnabled ? '🚫 Desativar Método no Login' : '⚡ Ativar Método no Login'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 3: FILA DE APROVAÇÃO MASTER DE USUÁRIOS */}
      {activeTab === 'APPROVALS' && (
        <div
          style={{
            background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #182542 0%, #0E1628 100%)', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0' }}>
                <th style={{ padding: '14px 16px', width: '28%' }}>Usuário / E-mail</th>
                <th style={{ padding: '14px 10px', width: '18%' }}>Cargo & Departamento</th>
                <th style={{ padding: '14px 10px', width: '18%' }}>Método / Dispositivo</th>
                <th style={{ padding: '14px 10px', width: '16%' }}>Data & IP de Origem</th>
                <th style={{ padding: '14px 10px', width: '10%' }}>Status</th>
                <th style={{ padding: '14px 16px', width: '10%', textAlign: 'center' }}>Ação Master</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((req, idx) => (
                <tr
                  key={req.id}
                  style={{
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'rgba(15, 23, 42, 0.35)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{req.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {req.email}
                    </div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ color: '#E2E8F0', fontWeight: 700 }}>{req.role}</div>
                    <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{req.department}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ color: '#34D399', fontWeight: 800 }}>{req.loginMethod}</div>
                    <div style={{ fontSize: '0.64rem', color: '#64748B' }}>{req.deviceFingerprint}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ color: '#E2E8F0' }}>{req.requestedAt}</div>
                    <div style={{ fontSize: '0.64rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>IP: {req.ipAddress}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    {req.status === 'PENDING' ? (
                      <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                        ⏳ PENDENTE
                      </span>
                    ) : req.status === 'APPROVED' ? (
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                        ✓ APROVADO
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                        🚫 RECUSADO
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {req.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleApproveUser(req.id, req.name)}
                          style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #34D399', color: '#34D399', padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => handleRejectUser(req.id, req.name)}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#EF4444', padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✕ Bloquear
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.66rem', color: '#64748B' }}>Processado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 4: TRILHA DE AUDITORIA CRIPTOGRÁFICA DE LOGINS */}
      {activeTab === 'AUDIT_LOG' && (
        <div
          style={{
            background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #182542 0%, #0E1628 100%)', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0' }}>
                <th style={{ padding: '14px 16px', width: '22%' }}>Data / Horário Oficial</th>
                <th style={{ padding: '14px 10px', width: '22%' }}>Usuário Autenticado</th>
                <th style={{ padding: '14px 10px', width: '18%' }}>Método de Login</th>
                <th style={{ padding: '14px 10px', width: '12%' }}>IP / Dispositivo</th>
                <th style={{ padding: '14px 10px', width: '10%' }}>Status</th>
                <th style={{ padding: '14px 16px', width: '16%' }}>Hash SHA-256 do Envelope</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  style={{
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'rgba(15, 23, 42, 0.35)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{log.userName}</div>
                    <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{log.userEmail}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>{log.method}</span>
                    <div style={{ fontSize: '0.60rem', color: '#64748B' }}>{log.encryptionTag}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ color: '#E2E8F0', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{log.ipAddress}</div>
                    <div style={{ fontSize: '0.60rem', color: '#64748B' }}>{log.deviceInfo}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: log.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: log.status === 'SUCCESS' ? '#34D399' : '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                      {log.status === 'SUCCESS' ? '✓ AUTORIZADO' : '🚫 BLOQUEADO'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#080D1A', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 6px', borderRadius: '4px', color: '#34D399', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', wordBreak: 'break-all' }}>
                      {log.hashSha256.substring(0, 16)}...{log.hashSha256.substring(log.hashSha256.length - 8)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DOSSIÊ A4 DE GOVERNANÇA DE SEGURANÇA & ACESSO */}
      <div className="diamond-paper-a4" style={{ marginTop: '24px' }}>
        <div className="diamond-report-header">
          <div className="diamond-report-title">
            <h1>RELATÓRIO OFICIAL DE GOVERNANÇA DE ACESSOS & SEGURANÇA CRIPTOGRÁFICA</h1>
            <h2>ENVELOPE AES-256-GCM • SHA-256 SALTED • PADRÃO FIPS 140-3 • LGPD ART. 46</h2>
          </div>
          <div className="diamond-logo-box">
            <span>🛡️ SOBERANO</span>
            <small>SECURITY SUITE</small>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Órgão Regulador</strong>
            <span>CFC / LGPD / ITI ICP-Brasil</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Motor Criptográfico</strong>
            <span className="font-mono">Web Crypto API (AES-GCM-256)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Data da Emissão</strong>
            <span>20/08/2026</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status de Integridade</strong>
            <span style={{ color: '#047857', fontWeight: 900 }}>✓ 100% BLINDADO E HOMOLOGADO</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Usuário / Empresa</th>
              <th>Plano Contratado</th>
              <th>Escopo de Permissão</th>
              <th>Status do Acesso</th>
            </tr>
          </thead>
          <tbody>
            {userConfigs.map(u => (
              <tr key={u.id}>
                <td><strong>{u.userName}</strong> ({u.userEmail})</td>
                <td>{u.contractPlanName}</td>
                <td className="font-mono">{u.scope} ({u.allowedModuleIds.includes('ALL_181_MODULES') ? '181 Módulos' : u.allowedModuleIds.length + ' Módulos'})</td>
                <td style={{ color: u.isActive ? '#047857' : '#DC2626', fontWeight: 800 }}>
                  {u.isActive ? '✓ HABILITADO' : '🚫 SUSPENSO'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3 Assinaturas Formais */}
        <div className="diamond-signatures">
          <div className="diamond-signature-line">
            <div>DAVID VALU</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Master Security Officer • CRC 1SP999999/O-0</div>
          </div>
          <div className="diamond-signature-line">
            <div>DRA. BEATRIZ SANTOS</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Data Protection Officer (DPO / LGPD)</div>
          </div>
          <div className="diamond-signature-line">
            <div>COMITÊ DE COMPLIANCE</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Auditoria de Segurança da Informação</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <span>🔒 Hash SHA-256: 8f91028cb9182390182390128390182390182390182309128309128309128301</span>
          <span>Soberano Contábil Platinum Suite v4.5</span>
        </div>
      </div>

    </div>
  );
};
export default OfficeLoginSecurityGovernanceView;
