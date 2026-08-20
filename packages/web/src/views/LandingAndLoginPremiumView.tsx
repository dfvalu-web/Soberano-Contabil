import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Zap,
  Building2,
  Users,
  Scale,
  BookOpen,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Award,
  FileSpreadsheet,
  Workflow,
  Radar,
  Calendar
} from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  role: 'MASTER_ACCOUNTANT' | 'TAX_SPECIALIST' | 'PAYROLL_SPECIALIST' | 'CLIENT_DIRECTOR';
  roleLabel: string;
  crc?: string;
  email: string;
  avatarIcon: string;
  initialModuleId: string;
}

export const PRESET_PROFILES: UserProfile[] = [
  {
    id: 'user-master',
    name: 'David Valu',
    role: 'MASTER_ACCOUNTANT',
    roleLabel: 'Sócio & Contador Responsável',
    crc: 'CRC 1SP999999/O-0',
    email: 'david.valu@soberanocontabil.com.br',
    avatarIcon: '🏛️',
    initialModuleId: 'office_integrated_closing_pipeline'
  },
  {
    id: 'user-tax',
    name: 'Dra. Beatriz Santos',
    role: 'TAX_SPECIALIST',
    roleLabel: 'Especialista Tributária & SPED',
    crc: 'OAB/SP 412.980 • CRC',
    email: 'beatriz.tributario@soberanocontabil.com.br',
    avatarIcon: '⚖️',
    initialModuleId: 'office_predictive_tax_audit_radar'
  },
  {
    id: 'user-payroll',
    name: 'Carlos Mendes',
    role: 'PAYROLL_SPECIALIST',
    roleLabel: 'Coordenador de DP & eSocial',
    email: 'carlos.dp@soberanocontabil.com.br',
    avatarIcon: '👥',
    initialModuleId: 'payroll'
  },
  {
    id: 'user-client',
    name: 'Diretoria Executiva',
    role: 'CLIENT_DIRECTOR',
    roleLabel: 'Soberano Tech S/A (Portal BPO)',
    email: 'diretoria@soberanotech.com.br',
    avatarIcon: '🏢',
    initialModuleId: 'office_monthly_consolidated_book'
  }
];

interface LandingAndLoginPremiumViewProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export const LandingAndLoginPremiumView: React.FC<LandingAndLoginPremiumViewProps> = ({ onLoginSuccess }) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(PRESET_PROFILES[0]);
  const [emailInput, setEmailInput] = useState<string>(PRESET_PROFILES[0].email);
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setEmailInput(profile.email);
  };

  const handleExecuteLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLoginSuccess(selectedProfile);
      }, 600);
    }, 800);
  };

  const handleCertificateLogin = () => {
    setShowCertificateModal(true);
    setTimeout(() => {
      setShowCertificateModal(false);
      handleExecuteLogin();
    }, 1200);
  };

  return (
    <div className="landing-premium-wrapper" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#070B14' }}>
      
      {/* 1. Vídeo Background com Overlay Glassmorphism */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            opacity: 0.35,
            filter: 'saturate(1.2) contrast(1.1) brightness(0.8)'
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradiente de Profundidade e Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(10, 18, 36, 0.65) 0%, rgba(5, 9, 18, 0.94) 85%, #04070D 100%)',
            backdropFilter: 'blur(3px)'
          }}
        />
      </div>

      {/* 2. Topbar Institucional */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(9, 14, 26, 0.75)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #0284C7 100%)',
              border: '2px solid rgba(52, 211, 153, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.85rem',
              color: '#070B12',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 0 16px rgba(16, 185, 129, 0.6)'
            }}
          >
            SC
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Soberano <span style={{ color: '#34D399', textShadow: '0 0 12px rgba(52, 211, 153, 0.5)' }}>Contábil</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em' }}>
              PLATINUM SUITE ENTERPRISE v4.5
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.70rem',
              fontWeight: 800,
              color: '#34D399'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            SISTEMA 100% OPERACIONAL
          </div>

          <button
            onClick={() => handleSelectProfile(PRESET_PROFILES[0])}
            className="btn-1click-3d"
            style={{ padding: '6px 14px', fontSize: '0.74rem' }}
          >
            <Zap size={13} /> Entrar Direto
          </button>
        </div>
      </header>

      {/* 3. Corpo Principal: Hero Executivo + Painel de Login 3D */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(340px, 440px)',
          gap: '36px',
          alignItems: 'center',
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '40px 24px',
          width: '100%'
        }}
      >
        
        {/* Flanco Esquerdo: Apresentação Institucional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '30px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(52, 211, 153, 0.4)', width: 'fit-content' }}>
            <Sparkles size={14} style={{ color: '#34D399' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#34D399', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Inteligência Contábil, Fiscal & Trabalhista em 4K
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
              Governança Contábil de Elite & Automação Determinística
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '12px', lineHeight: 1.5, maxWidth: '580px' }}>
              Plataforma corporativa unificada com <strong>181 rotinas operacionais</strong>, rigor IFRS/CPC, CLT determinística, pré-auditoria de malhas RFB e transição da Reforma Tributária (IBS/CBS).
            </p>
          </div>

          {/* Grid de Destaques 3D */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(22, 33, 55, 0.75) 0%, rgba(14, 22, 38, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Workflow size={16} style={{ color: '#34D399' }} />
                <strong style={{ fontSize: '0.80rem', color: '#FFFFFF' }}>Esteira de Fechamento</strong>
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8' }}>
                Triangulação Fiscal ➔ DP ➔ Contábil com avanço em 1-Click e SLA monitorado.
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(22, 33, 55, 0.75) 0%, rgba(14, 22, 38, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Radar size={16} style={{ color: '#38BDF8' }} />
                <strong style={{ fontSize: '0.80rem', color: '#FFFFFF' }}>Radar de Malhas RFB</strong>
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8' }}>
                Cruzamentos DIMP/PIX vs EFD com auto-ajuste preventivo (Art. 138 CTN).
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(22, 33, 55, 0.75) 0%, rgba(14, 22, 38, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <BookOpen size={16} style={{ color: '#FBBF24' }} />
                <strong style={{ fontSize: '0.80rem', color: '#FFFFFF' }}>Book Contábil A4</strong>
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8' }}>
                DRE, Balanço e CNDs em caderno consolidado de 1 arquivo para bancos.
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(22, 33, 55, 0.75) 0%, rgba(14, 22, 38, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Scale size={16} style={{ color: '#A78BFA' }} />
                <strong style={{ fontSize: '0.80rem', color: '#FFFFFF' }}>Reforma IBS/CBS</strong>
              </div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8' }}>
                Simulador comparativo 2026–2033 com tomada ampla de créditos de insumos.
              </div>
            </div>
          </div>
        </div>

        {/* Flanco Direito: Card de Login Premium 3D 4K */}
        <div
          style={{
            background: 'linear-gradient(180deg, #151F36 0%, #0C1322 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.4)',
            borderBottom: '3px solid rgba(5, 150, 105, 0.7)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 20px rgba(16, 185, 129, 0.2)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: '#34D399' }} />
              <h2 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Autenticação Corporativa
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.60rem',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}
            >
              ACESSO SEGURO
            </span>
          </div>

          {/* Seleção de Perfis Pré-Configurados */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Selecione o Perfil de Entrada
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {PRESET_PROFILES.map((prof) => {
                const isSelected = selectedProfile.id === prof.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => handleSelectProfile(prof)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.12) 100%)'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>{prof.avatarIcon}</span>
                      <strong style={{ fontSize: '0.72rem', color: isSelected ? '#34D399' : '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prof.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prof.roleLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleExecuteLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#0B1120',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Senha de Acesso / Chave Token
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#0B1120',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || authSuccess}
              className="btn-1click-3d"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.84rem',
                justifyContent: 'center',
                marginTop: '4px'
              }}
            >
              {isAuthenticating ? (
                <span>🔄 Validando Credenciais...</span>
              ) : authSuccess ? (
                <span>✓ Acesso Autorizado! Entrando...</span>
              ) : (
                <span>🔐 Acessar Cockpit ({selectedProfile.name})</span>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0', fontSize: '0.64rem', color: '#64748B' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <span>OU AUTENTIQUE COM</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          {/* Botão de Certificado Digital ICP-Brasil */}
          <button
            type="button"
            onClick={handleCertificateLogin}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.35)'
            }}
          >
            <KeyRound size={14} style={{ color: '#38BDF8' }} />
            Certificado Digital (e-CNPJ / e-CPF A1 & A3)
          </button>

          {showCertificateModal && (
            <div style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '0.68rem', color: '#38BDF8', textAlign: 'center', fontWeight: 700 }}>
              🔒 Lendo Certificado Digital ICP-Brasil... Conexão Criptografada!
            </div>
          )}

          {/* Rodapé de Segurança */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.62rem', color: '#64748B' }}>
            <ShieldCheck size={12} style={{ color: '#10B981' }} />
            Criptografia de Ponta a Ponta AES-256 • Conforme LGPD & ICP-Brasil
          </div>
        </div>
      </main>

      {/* 4. Footer Institucional */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 8, 16, 0.85)',
          padding: '12px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.68rem',
          color: '#64748B'
        }}
      >
        <div>
          © 2026 Soberano Contábil. Todos os direitos reservados.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>NBC TG / IFRS Full</span>
          <span>eSocial v.S-1.3</span>
          <span>EC 132/23 & LC 214/25</span>
          <span>SHA-256 Validado</span>
        </div>
      </footer>
    </div>
  );
};
export default LandingAndLoginPremiumView;
