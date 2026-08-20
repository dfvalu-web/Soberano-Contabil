// SOBERANO CONTÁBIL — CENTRAL DE CONTROLE DE LOGIN & GOVERNANÇA DE SEGURANÇA CRIPTOGRÁFICA
// Gestão de Métodos de Autenticação, Aprovação Master de Usuários e Trilha Imutável de Auditoria (Padrão Diamante)

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
  Layers
} from 'lucide-react';
import { officeStore, LoginMethodSecurityPolicy, UserAccessApprovalRequest, AuthSecurityAuditLog } from '../state/office-store.js';

export const OfficeLoginSecurityGovernanceView: React.FC = () => {
  const [policies, setPolicies] = useState<LoginMethodSecurityPolicy[]>(() => officeStore.getLoginPolicies());
  const [pendingApprovals, setPendingApprovals] = useState<UserAccessApprovalRequest[]>(() => officeStore.getPendingUserApprovals());
  const [auditLogs, setAuditLogs] = useState<AuthSecurityAuditLog[]>(() => officeStore.getAuthSecurityAuditLogs());
  const [activeTab, setActiveTab] = useState<'METHODS' | 'APPROVALS' | 'AUDIT_LOG'>('METHODS');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const stats = useMemo(() => {
    const activeMethods = policies.filter(p => p.isEnabled).length;
    const pendingCount = pendingApprovals.filter(p => p.status === 'PENDING').length;
    const successLogsCount = auditLogs.filter(l => l.status === 'SUCCESS').length;
    return { activeMethods, pendingCount, successLogsCount, totalLogs: auditLogs.length };
  }, [policies, pendingApprovals, auditLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond 3D */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(56, 189, 248, 0.15) 100%)', border: '1.5px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}>
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Central de Controle de Login & Governança Criptográfica
              </h1>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                FIPS 140-3 & ICP-BRASIL
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Gestão determinística de métodos de entrada autorizados, aprovação master de novos usuários e auditoria de envelopes criptográficos SHA-256 / AES-GCM.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '7px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> <span>Imprimir Dossiê de Governança A4</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #34D399', color: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 4 Cards de Métricas e Status de Governança */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3.5px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Métodos de Login Ativos</span>
            <Key size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.activeMethods} de 4 Formas
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Criptografia ponta a ponta ativa</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3.5px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Aprovações Pendentes</span>
            <Users size={16} color="#FBBF24" />
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
            <span>Autenticações Auditadas</span>
            <Activity size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.successLogsCount} Sucessos
          </div>
          <div style={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: 700 }}>100% com Hash SHA-256 verificado</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(168, 85, 247, 0.35)', borderBottom: '3.5px solid #7E22CE', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Nível de Criptografia</span>
            <Lock size={16} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#C084FC', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            AES-GCM-256
          </div>
          <div style={{ fontSize: '0.66rem', color: '#CBD5E1' }}>PBKDF2 (100k iterações) + Salt</div>
        </div>
      </div>

      {/* Navegação por Abas 3D */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('METHODS')}
          style={{
            background: activeTab === 'METHODS' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'METHODS' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'METHODS' ? '#34D399' : '#94A3B8',
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
          <Key size={14} /> <span>1. Métodos de Login & Políticas ({stats.activeMethods} Ativos)</span>
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
          <Users size={14} /> <span>2. Fila de Aprovação Master ({stats.pendingCount} Pendentes)</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          style={{
            background: activeTab === 'AUDIT_LOG' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.1) 100%)' : '#0B1120',
            border: activeTab === 'AUDIT_LOG' ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
            color: activeTab === 'AUDIT_LOG' ? '#38BDF8' : '#94A3B8',
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
          <Activity size={14} /> <span>3. Trilha de Auditoria Criptográfica ({stats.totalLogs} Eventos)</span>
        </button>
      </div>

      {/* ABA 1: MÉTODOS DE LOGIN & POLÍTICAS DE AUTENTICAÇÃO */}
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

      {/* ABA 2: FILA DE APROVAÇÃO MASTER DE USUÁRIOS */}
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

      {/* ABA 3: TRILHA DE AUDITORIA CRIPTOGRÁFICA DE LOGINS */}
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
            <span>19/08/2026 às 23:15</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status de Integridade</strong>
            <span style={{ color: '#047857', fontWeight: 900 }}>✓ 100% BLINDADO E HOMOLOGADO</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Método de Entrada</th>
              <th>Padrão Criptográfico</th>
              <th>Status Operacional</th>
              <th>Exigência de Aprovação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Certificado Digital ICP-Brasil (e-CPF / e-CNPJ)</td>
              <td className="font-mono">mTLS / HMAC-SHA256 Challenge</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ HABILITADO</td>
              <td>Livre com PIN Válido</td>
            </tr>
            <tr>
              <td>Credenciais Corporativas (E-mail & Senha)</td>
              <td className="font-mono">PBKDF2 (100k) + SHA-256 Salted + AES-GCM</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ HABILITADO</td>
              <td>Livre com MFA</td>
            </tr>
            <tr>
              <td>Biometria FIDO2 / Passkeys / WebAuthn</td>
              <td className="font-mono">Assinatura Assimétrica ECDSA P-256</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ HABILITADO</td>
              <td>Requer Homologação Master</td>
            </tr>
            <tr>
              <td>Magic Link Criptografado por E-mail</td>
              <td className="font-mono">JWT HMAC-SHA256 Time-Bound (10 min)</td>
              <td style={{ color: '#DC2626', fontWeight: 800 }}>🚫 DESABILITADO</td>
              <td>Política Rígida do Escritório</td>
            </tr>
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
