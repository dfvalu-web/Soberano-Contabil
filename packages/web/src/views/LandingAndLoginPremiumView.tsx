import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  FileSpreadsheet,
  Workflow,
  Radar,
  Calendar,
  Sliders,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  RefreshCw,
  Mail,
  User,
  Check
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
  // Auth Modes: 'LOGIN' | 'REGISTER' | 'RECOVERY' | 'CERTIFICATE'
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'RECOVERY' | 'CERTIFICATE'>('LOGIN');

  // Login Form States
  const [emailInput, setEmailInput] = useState<string>('david.valu@soberanocontabil.com.br');
  const [passwordInput, setPasswordInput] = useState<string>('Soberano@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Register Form States
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regOfficeName, setRegOfficeName] = useState<string>('');
  const [regRole, setRegRole] = useState<'MASTER_ACCOUNTANT' | 'TAX_SPECIALIST' | 'PAYROLL_SPECIALIST'>('MASTER_ACCOUNTANT');

  // Recovery Form States
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoverySent, setRecoverySent] = useState<boolean>(false);

  // UI Status States
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Calculadora Interativa de ROI
  const [clientsCount, setClientsCount] = useState<number>(60);
  const hoursSavedPerMonth = Math.round(clientsCount * 5.5);
  const monthlyCostSavings = Math.round(hoursSavedPerMonth * 45); // R$ 45/hora

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = authMode === 'REGISTER' ? regPassword : passwordInput;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;
    return score;
  }, [authMode, regPassword, passwordInput]);

  const handleSelectPresetProfile = (prof: UserProfile) => {
    setEmailInput(prof.email);
    setPasswordInput('Soberano@2026');
    setAuthMode('LOGIN');
    setErrorMessage('');
  };

  const handleDirectLoginWithProfile = (prof: UserProfile) => {
    setIsAuthenticating(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(prof);
    }, 500);
  };

  const handleExecuteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validações robustas de email
    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Por favor, informe um endereço de e-mail corporativo válido.');
      return;
    }

    if (!passwordInput || passwordInput.length < 4) {
      setErrorMessage('A senha informada deve possuir no mínimo 6 caracteres.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);

      // Verificar se é algum perfil pré-configurado
      const foundPreset = PRESET_PROFILES.find(p => p.email.toLowerCase() === trimmedEmail);
      if (foundPreset) {
        setSuccessMessage(`Bem-vindo(a), ${foundPreset.name}! Acessando cockpit...`);
        setTimeout(() => onLoginSuccess(foundPreset), 400);
        return;
      }

      // Se for um novo usuário autenticado
      const customUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: trimmedEmail.split('@')[0].toUpperCase(),
        role: 'MASTER_ACCOUNTANT',
        roleLabel: 'Contador Responsável • ' + (trimmedEmail.split('@')[1] || 'Empresa'),
        email: trimmedEmail,
        avatarIcon: '🏛️',
        initialModuleId: 'office_integrated_closing_pipeline'
      };

      setSuccessMessage(`Autenticação autorizada com sucesso! Redirecionando...`);
      setTimeout(() => onLoginSuccess(customUser), 400);
    }, 700);
  };

  const handleExecuteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Por favor, informe o seu nome completo.');
      return;
    }

    const trimmedEmail = regEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Informe um e-mail corporativo válido para criar sua conta.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: regName.trim(),
        role: regRole,
        roleLabel: regRole === 'MASTER_ACCOUNTANT' ? 'Sócio & Contador' : regRole === 'TAX_SPECIALIST' ? 'Especialista Fiscal' : 'Especialista DP',
        crc: regRole === 'MASTER_ACCOUNTANT' ? 'CRC Ativo' : undefined,
        email: trimmedEmail,
        avatarIcon: regRole === 'MASTER_ACCOUNTANT' ? '🏛️' : regRole === 'TAX_SPECIALIST' ? '⚖️' : '👥',
        initialModuleId: regRole === 'TAX_SPECIALIST' ? 'office_predictive_tax_audit_radar' : regRole === 'PAYROLL_SPECIALIST' ? 'payroll' : 'office_integrated_closing_pipeline'
      };

      setSuccessMessage('Conta corporativa criada com sucesso! Acessando...');
      setTimeout(() => onLoginSuccess(newUser), 500);
    }, 800);
  };

  const handleExecuteRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setErrorMessage('Informe um e-mail válido para envio das instruções.');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setRecoverySent(true);
    }, 800);
  };

  const handleExecuteCertificate = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(PRESET_PROFILES[0]);
    }, 1000);
  };

  return (
    <div className="landing-marketing-container" style={{ minHeight: '100vh', background: '#070B14', color: '#FFFFFF', position: 'relative' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOPBAR INSTITUCIONAL FIXA COM GLASSMORPHISM                            */}
      {/* ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 28px',
          background: 'linear-gradient(180deg, rgba(14, 23, 42, 0.95) 0%, rgba(8, 14, 27, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(52, 211, 153, 0.4)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.75), 0 0 24px rgba(16, 185, 129, 0.2)'
        }}
      >
        {/* Logo & Marca Diamond 3D */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #34D399 0%, #059669 45%, #0284C7 100%)',
              border: '1.5px solid #6EE7B7',
              borderBottom: '2.5px solid #064E3B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.86rem',
              color: '#070B12',
              boxShadow: 'inset 0 2px 2px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(52, 211, 153, 0.8)',
              textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              transform: 'perspective(500px) translateZ(5px)'
            }}
          >
            SC
          </div>
          <div>
            <div style={{ fontSize: '1.08rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Soberano <span style={{ color: '#34D399', textShadow: '0 0 16px rgba(52, 211, 153, 0.75)' }}>Contábil</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.58rem', color: '#38BDF8', fontWeight: 900, letterSpacing: '0.04em' }}>
              <span>💎</span> PLATINUM SUITE ENTERPRISE v4.5
            </div>
          </div>
        </div>

        {/* Links de Navegação em Cápsula Pod 3D */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(180deg, rgba(20, 30, 52, 0.75) 0%, rgba(10, 16, 30, 0.9) 100%)',
            padding: '4px 8px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          <a
            href="#diferenciais"
            style={{
              color: '#E2E8F0',
              textDecoration: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)';
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 10px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Diferenciais
          </a>

          <a
            href="#comparativo"
            style={{
              color: '#E2E8F0',
              textDecoration: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)';
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 10px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Comparativo
          </a>

          <a
            href="#pilares"
            style={{
              color: '#E2E8F0',
              textDecoration: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)';
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 10px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Pilares
          </a>

          <a
            href="#roi"
            style={{
              color: '#E2E8F0',
              textDecoration: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)';
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 10px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Calculadora ROI
          </a>
        </nav>

        {/* Botões de Ação Master 3D 4K */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => handleDirectLoginWithProfile(PRESET_PROFILES[0])}
            style={{
              background: 'linear-gradient(180deg, #10B981 0%, #059669 60%, #047857 100%)',
              border: '1.5px solid #6EE7B7',
              borderBottom: '2.5px solid #064E3B',
              color: '#FFFFFF',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 4px 16px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 6px 20px rgba(16, 185, 129, 0.65), 0 0 28px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 4px 16px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.35)';
            }}
          >
            <Zap size={14} /> <span>Entrar em 1-Click</span>
          </button>

          <a
            href="#login-card-anchor"
            style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              borderBottom: '2.5px solid rgba(0, 0, 0, 0.6)',
              color: '#FFFFFF',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.8)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 18px rgba(56, 189, 248, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(0, 0, 0, 0.5)';
            }}
          >
            <Lock size={13} style={{ color: '#38BDF8' }} /> <span>Autenticação</span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION COM VÍDEO BACKGROUND 4K & GRID INTEGRADO                 */}
      {/* ========================================================================= */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '50px 24px' }}>
        
        {/* Vídeo Background em Alta Claridade */}
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
              opacity: 0.75,
              filter: 'saturate(1.25) contrast(1.05) brightness(1.05)'
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Overlay Leve Translúcido */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(10, 18, 36, 0.25) 0%, rgba(7, 11, 20, 0.65) 75%, #070B14 100%)',
              backdropFilter: 'blur(1px)'
            }}
          />
        </div>

        {/* Grid Hero: Apresentação à Esquerda + Card de Autenticação Robusto à Direita */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1360px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(360px, 460px)',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          
          {/* Lado Esquerdo: Mensagem de Impacto & Métricas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)', border: '1px solid rgba(52, 211, 153, 0.6)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)', width: 'fit-content' }}>
              <Sparkles size={16} style={{ color: '#34D399' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34D399', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Tecnologia Contábil de Elite em 4K
              </span>
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.85)' }}>
              A Plataforma Definitiva de <br />
              <span style={{ background: 'linear-gradient(135deg, #34D399 0%, #38BDF8 50%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>
                Inteligência Contábil, Fiscal & Trabalhista
              </span>
            </h1>

            <p style={{ fontSize: '0.96rem', color: '#CBD5E1', lineHeight: 1.6, maxWidth: '580px', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Integração fluida em <strong>181 rotinas corporativas</strong> com rigor IFRS/CPC, folha determinística CLT, pré-auditoria contra malhas fiscais da Receita Federal e motor da Reforma Tributária 2026–2033.
            </p>

            {/* Badges Flutuantes 3D */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div className="control-pod-3d" style={{ padding: '6px 12px' }}>
                <span style={{ color: '#34D399', fontWeight: 900, fontSize: '0.80rem' }}>🚀 +92%</span>
                <span style={{ fontSize: '0.72rem', color: '#E2E8F0' }}>Produtividade Operacional</span>
              </div>
              <div className="control-pod-3d" style={{ padding: '6px 12px' }}>
                <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: '0.80rem' }}>🛡️ Zero</span>
                <span style={{ fontSize: '0.72rem', color: '#E2E8F0' }}>Malhas Fiscais (Art. 138 CTN)</span>
              </div>
              <div className="control-pod-3d" style={{ padding: '6px 12px' }}>
                <span style={{ color: '#FBBF24', fontWeight: 900, fontSize: '0.80rem' }}>📑 Rating AAA</span>
                <span style={{ fontSize: '0.72rem', color: '#E2E8F0' }}>Book Contábil para Bancos</span>
              </div>
            </div>

            {/* Acesso Instantâneo aos 4 Perfis de Demonstração */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Acesse como um dos Perfis Corporativos (1-Click):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {PRESET_PROFILES.map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => handleDirectLoginWithProfile(prof)}
                    className="dept-accordion-card"
                    style={{
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.0rem' }}>{prof.avatarIcon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prof.name}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#34D399', fontWeight: 700 }}>
                        {prof.roleLabel.split('•')[0]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Direito: CARD DE AUTENTICAÇÃO ROBUSTO 3D 4K */}
          <div
            id="login-card-anchor"
            style={{
              background: 'linear-gradient(180deg, #141F35 0%, #0A101E 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.45)',
              borderBottom: '3px solid rgba(5, 150, 105, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 24px rgba(16, 185, 129, 0.25)',
              position: 'relative'
            }}
          >
            {/* Header com Abas de Autenticação */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '16px', gap: '6px' }}>
              <button
                type="button"
                onClick={() => { setAuthMode('LOGIN'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  background: authMode === 'LOGIN' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.12) 100%)' : 'transparent',
                  border: authMode === 'LOGIN' ? '1px solid #34D399' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: authMode === 'LOGIN' ? '#34D399' : '#94A3B8',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🔐 Entrar
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('REGISTER'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  background: authMode === 'REGISTER' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.12) 100%)' : 'transparent',
                  border: authMode === 'REGISTER' ? '1px solid #34D399' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: authMode === 'REGISTER' ? '#34D399' : '#94A3B8',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✨ Criar Conta
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('CERTIFICATE'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  background: authMode === 'CERTIFICATE' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.12) 100%)' : 'transparent',
                  border: authMode === 'CERTIFICATE' ? '1px solid #38BDF8' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: authMode === 'CERTIFICATE' ? '#38BDF8' : '#94A3B8',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🪪 e-CNPJ
              </button>
            </div>

            {/* Mensagens de Alerta e Sucesso */}
            {errorMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '6px', padding: '8px 10px', fontSize: '0.72rem', color: '#FCA5A5', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '6px', padding: '8px 10px', fontSize: '0.72rem', color: '#34D399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORMULÁRIO 1: LOGIN POR EMAIL */}
            {authMode === 'LOGIN' && (
              <form onSubmit={handleExecuteLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    E-mail Corporativo
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '10px', color: '#64748B' }} />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="seu.nome@escritorio.com.br"
                      required
                      style={{
                        width: '100%',
                        background: '#0B1120',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        padding: '8px 10px 8px 32px',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('RECOVERY')}
                      style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '10px', color: '#64748B' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      style={{
                        width: '100%',
                        background: '#0B1120',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        padding: '8px 34px 8px 32px',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', color: '#94A3B8' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#10B981' }}
                    />
                    Lembrar neste navegador
                  </label>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>Conexão Segura SSL</span>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="btn-1click-3d"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.86rem',
                    justifyContent: 'center',
                    marginTop: '6px'
                  }}
                >
                  {isAuthenticating ? (
                    <span>🔄 Autenticando...</span>
                  ) : (
                    <span>🔐 Entrar no Soberano Contábil</span>
                  )}
                </button>
              </form>
            )}

            {/* FORMULÁRIO 2: REGISTRO DE NOVO USUÁRIO */}
            {authMode === 'REGISTER' && (
              <form onSubmit={handleExecuteRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    required
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="joao@escritorio.com.br"
                    required
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Senha de Acesso
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  />
                  {/* Barra de Força da Senha */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${passwordStrength}%`, height: '100%', background: passwordStrength > 75 ? '#10B981' : passwordStrength > 40 ? '#FBBF24' : '#EF4444' }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>
                      {passwordStrength > 75 ? 'Forte' : passwordStrength > 40 ? 'Média' : 'Fraca'}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Perfil de Atuação
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#34D399', padding: '7px 10px', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
                  >
                    <option value="MASTER_ACCOUNTANT">🏛️ Sócio / Contador Responsável</option>
                    <option value="TAX_SPECIALIST">⚖️ Especialista Fiscal & Tributário</option>
                    <option value="PAYROLL_SPECIALIST">👥 Especialista de DP & eSocial</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="btn-1click-3d"
                  style={{ width: '100%', padding: '10px', fontSize: '0.84rem', justifyContent: 'center', marginTop: '4px' }}
                >
                  {isAuthenticating ? 'Criando Conta...' : '✨ Criar Conta & Entrar'}
                </button>
              </form>
            )}

            {/* FORMULÁRIO 3: RECUPERAÇÃO DE SENHA */}
            {authMode === 'RECOVERY' && (
              <form onSubmit={handleExecuteRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>
                  Informe o seu e-mail corporativo para enviarmos o link com o token de redefinição de senha segura.
                </p>

                {recoverySent ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #34D399', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <CheckCircle2 size={24} style={{ color: '#34D399', margin: '0 auto 6px auto' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF' }}>Instruções Enviadas!</div>
                    <div style={{ fontSize: '0.68rem', color: '#CBD5E1', marginTop: '4px' }}>
                      Verifique a sua caixa de entrada para redefinir sua senha.
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('LOGIN'); setRecoverySent(false); }}
                      style={{ marginTop: '10px', background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '5px 12px', borderRadius: '6px', fontSize: '0.70rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Voltar ao Login
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        E-mail de Recuperação
                      </label>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="seu.email@escritorio.com.br"
                        required
                        style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.80rem', outline: 'none' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="btn-1click-3d"
                      style={{ width: '100%', padding: '9px', fontSize: '0.82rem', justifyContent: 'center' }}
                    >
                      {isAuthenticating ? 'Enviando...' : '📧 Enviar Link de Recuperação'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMode('LOGIN')}
                      style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '0.70rem', cursor: 'pointer', textAlign: 'center' }}
                    >
                      Voltar ao Login
                    </button>
                  </>
                )}
              </form>
            )}

            {/* FORMULÁRIO 4: CERTIFICADO DIGITAL ICP-BRASIL */}
            {authMode === 'CERTIFICATE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <KeyRound size={32} style={{ color: '#38BDF8', margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Autenticação com Certificado Digital
                  </div>
                  <p style={{ fontSize: '0.70rem', color: '#94A3B8', margin: '6px 0 12px 0' }}>
                    Compatível com <strong>e-CNPJ</strong> e <strong>e-CPF</strong> em modelos <strong>A1 (Arquivo)</strong> e <strong>A3 (Token / SmartCard)</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={handleExecuteCertificate}
                    disabled={isAuthenticating}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                      border: '1px solid #38BDF8',
                      borderBottom: '2px solid #075985',
                      color: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.80rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
                    }}
                  >
                    {isAuthenticating ? '🔒 Lendo Chave ICP-Brasil...' : '🔑 Conectar com Certificado Digital'}
                  </button>
                </div>
              </div>
            )}

            {/* Rodapé de Segurança */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.62rem', color: '#64748B' }}>
              <ShieldCheck size={12} style={{ color: '#10B981' }} />
              Criptografia AES-256 • Conforme LGPD & ICP-Brasil
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEÇÃO DOS 6 GRANDES DIFERENCIAIS COMPETITIVOS                          */}
      {/* ========================================================================= */}
      <section id="diferenciais" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Diferenciais Únicos de Mercado
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            Construído para Eliminar 100% do Retrabalho
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            Enquanto os sistemas legados operam em silos isolados com arquivos de texto manuais, o Soberano Contábil integra tudo em memória de alta performance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          
          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '14px' }}>
              <Workflow size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              1. Esteira de Fechamento Integrada (5 Etapas)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Triangulação automática <strong>Fiscal ➔ DP ➔ DCTFWeb ➔ Contábil ➔ Dossiê</strong> com cálculo de SLA e avanço em 1-Click. O sócio do escritório sabe exatamente o status de cada cliente da carteira em tempo real.
            </p>
          </div>

          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '14px' }}>
              <Radar size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              2. Radar Preditivo contra Malhas Fiscais
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Simulação prévia dos algoritmos da Receita Federal e SEFAZ: cruzamento DIMP/PIX vs EFD, eSocial vs DCTFWeb e EFD vs ECD, com botão de <strong>auto-ajuste preventivo com isenção de multas (Art. 138 do CTN)</strong>.
            </p>
          </div>

          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '14px' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              3. Book Contábil Executivo A4 (Rating AAA)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Caderno executivo unificado com Capa, Parecer DuPont do CFO Virtual, DRE, Balanço IFRS, CNDs e <strong>3 Assinaturas Formais (Contador CRC, Diretor e Auditor)</strong> sem quebras de página para apresentação a bancos.
            </p>
          </div>

          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '14px' }}>
              <Scale size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              4. Motor da Reforma Tributária (2026–2033)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Simulador comparativo completo: Lucro Presumido vs Lucro Real vs Novo IVA Dual (IBS estadual/municipal + CBS federal - LC 214/25) com cronograma de transição gradual e créditos de insumos.
            </p>
          </div>

          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '14px' }}>
              <FileSpreadsheet size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              5. Dropzone Massivo com OCR Inteligente
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Arraste centenas de arquivos (XML de NF-e/NFC-e/NFS-e, Danfes em PDF, extratos bancários OFX/DDA) com leitura OCR e <strong>autoclassificação automática de CFOP, CST e plano de contas</strong>.
            </p>
          </div>

          <div className="dept-accordion-card" style={{ padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '14px' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              6. Folha CLT & eSocial/SST Determinístico
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Processamento com DSR sobre horas extras, provisões trabalhistas CPC 33 (13º/férias), laudos SST com PPP Digital (S-2240) e quitação Homolognet rescisória em 1 clique.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TABELA COMPARATIVA: SOBERANO CONTÁBIL VS SISTEMAS TRADICIONAIS          */}
      {/* ========================================================================= */}
      <section id="comparativo" style={{ padding: '60px 24px', background: '#0B1120', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Comparativo Tecnológico
            </div>
            <h2 style={{ fontSize: '2.0rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
              Por que o Soberano Contábil é Líder Absoluto?
            </h2>
          </div>

          <table className="diamond-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '35%' }}>Capacidade / Funcionalidade</th>
                <th style={{ textAlign: 'center', width: '30%', color: '#94A3B8' }}>Sistemas Legados de Mercado</th>
                <th style={{ textAlign: 'center', width: '35%', color: '#34D399', fontWeight: 900 }}>Soberano Contábil Platinum Suite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Integração Fiscal ➔ DP ➔ Contábil</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Exportação manual de TXT com retrabalho</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ Esteira em 5 Etapas 1-Click em Memória</td>
              </tr>
              <tr>
                <td><strong>Prevenção contra Malhas Fiscais</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Descoberta tardia após notificação RFB</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ Radar Preditivo com Auto-Ajuste (Art. 138 CTN)</td>
              </tr>
              <tr>
                <td><strong>Reforma Tributária (EC 132/23)</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Inexistente ou sem transição temporal</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ Simulador IBS/CBS 2026–2033 Nativo</td>
              </tr>
              <tr>
                <td><strong>Dossiês A4 para Bancos & Investidores</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Relatórios genéricos com quebras visuais</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ Dossiês Executivos Oficiais com 3 Assinaturas</td>
              </tr>
              <tr>
                <td><strong>Captura e Leitura de Documentos</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Digitação manual ou upload unitário lento</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ Dropzone Massivo OCR + Autoclassificação</td>
              </tr>
              <tr>
                <td><strong>Análise Econômico-Financeira</strong></td>
                <td style={{ textAlign: 'center', color: '#EF4444' }}>Balancetes frios sem inteligência consultiva</td>
                <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800 }}>✓ CFO Virtual com DuPont em 5 Estágios & WACC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALCULADORA INTERATIVA DE RETORNO SOBRE O INVESTIMENTO (ROI)           */}
      {/* ========================================================================= */}
      <section id="roi" style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #131E35 0%, #0B1120 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.68rem', fontWeight: 900 }}>
              <Sliders size={12} /> CALCULADORA DE ECONOMIA OPERACIONAL
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginTop: '8px' }}>
              Descubra quanto seu escritório economiza por mês
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#CBD5E1' }}>Empresas Atendidas na Carteira:</span>
                <strong style={{ fontSize: '1.05rem', color: '#34D399' }}>{clientsCount} clientes</strong>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={clientsCount}
                onChange={(e) => setClientsCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginTop: '10px' }}>
              <div className="control-pod-3d" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Tempo Economizado / Mês</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                  {hoursSavedPerMonth} horas
                </div>
                <div style={{ fontSize: '0.66rem', color: '#CBD5E1', marginTop: '2px' }}>
                  Eliminação de digitação e fechamentos em 1-Click
                </div>
              </div>

              <div className="control-pod-3d" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Economia Financeira Direta</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                  R$ {monthlyCostSavings.toLocaleString('pt-BR')} /mês
                </div>
                <div style={{ fontSize: '0.66rem', color: '#CBD5E1', marginTop: '2px' }}>
                  Ganho de margem operacional líquida
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOOTER INSTITUCIONAL COMPLETO COM SELOS DE AUDITORIA                  */}
      {/* ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#04070D',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.72rem',
          color: '#64748B'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 800, color: '#FFFFFF' }}>SOBERANO CONTÁBIL PLATINUM SUITE</span>
          <span>•</span>
          <span>© 2026 Todos os direitos reservados</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontWeight: 700 }}>
          <span style={{ color: '#34D399' }}>✓ NBC TG / IFRS Full</span>
          <span style={{ color: '#38BDF8' }}>✓ eSocial v.S-1.3</span>
          <span style={{ color: '#FBBF24' }}>✓ EC 132/23 & LC 214/25</span>
          <span style={{ color: '#A78BFA' }}>✓ ICP-Brasil / LGPD</span>
        </div>
      </footer>
    </div>
  );
};
export default LandingAndLoginPremiumView;
