import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronsDown,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
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

export interface DigitalCertificateItem {
  id: string;
  type: 'e-CPF' | 'e-CNPJ';
  holderName: string;
  documentNumber: string;
  issuerAuthority: string;
  model: 'A1_ARQUIVO' | 'A3_TOKEN_SMARTCARD';
  validUntil: string;
  crcOrOab?: string;
  associatedProfile: UserProfile;
}

export const INSTALLED_CERTIFICATES: DigitalCertificateItem[] = [
  {
    id: 'cert-david',
    type: 'e-CPF',
    holderName: 'DAVID VALU',
    documentNumber: '123.456.789-00',
    issuerAuthority: 'AC SOLUTI Multipla v5 (ICP-Brasil)',
    model: 'A3_TOKEN_SMARTCARD',
    validUntil: '14/10/2027',
    crcOrOab: 'CRC 1SP999999/O-0',
    associatedProfile: PRESET_PROFILES[0]
  },
  {
    id: 'cert-soberano-cnpj',
    type: 'e-CNPJ',
    holderName: 'SOBERANO CONTABIL PLATINUM LTDA',
    documentNumber: '12.345.678/0001-90',
    issuerAuthority: 'AC SERPRO RFB v5 (ICP-Brasil)',
    model: 'A1_ARQUIVO',
    validUntil: '05/03/2027',
    crcOrOab: 'Escritório Matriz',
    associatedProfile: PRESET_PROFILES[0]
  },
  {
    id: 'cert-beatriz',
    type: 'e-CPF',
    holderName: 'BEATRIZ SANTOS',
    documentNumber: '987.654.321-11',
    issuerAuthority: 'AC CERTISIGN v5 (ICP-Brasil)',
    model: 'A3_TOKEN_SMARTCARD',
    validUntil: '22/08/2026',
    crcOrOab: 'OAB/SP 412.980 • CRC',
    associatedProfile: PRESET_PROFILES[1]
  },
  {
    id: 'cert-carlos',
    type: 'e-CPF',
    holderName: 'CARLOS MENDES',
    documentNumber: '456.789.123-22',
    issuerAuthority: 'AC VALID v5 (ICP-Brasil)',
    model: 'A1_ARQUIVO',
    validUntil: '18/11/2026',
    crcOrOab: 'Coordenador DP',
    associatedProfile: PRESET_PROFILES[2]
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

  // Certificate Selection States
  const [selectedCertId, setSelectedCertId] = useState<string>('cert-david');
  const [certPin, setCertPin] = useState<string>('');
  const [customCertFile, setCustomCertFile] = useState<string>('');

  // UI Status States
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Calculadora Interativa de ROI
  const [clientsCount, setClientsCount] = useState<number>(60);
  const hoursSavedPerMonth = Math.round(clientsCount * 5.5);
  const monthlyCostSavings = Math.round(hoursSavedPerMonth * 45); // R$ 45/hora

  
  // Contact Form States (PJ vs PF & 3D 4K Form)
  const [contactPersonType, setContactPersonType] = useState<'PJ' | 'PF'>('PJ');
  const [contactName, setContactName] = useState<string>('');
  const [contactCompany, setContactCompany] = useState<string>('');
  const [contactDoc, setContactDoc] = useState<string>('');
  const [contactEmployees, setContactEmployees] = useState<string>('6-20');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactPhoneAlt, setContactPhoneAlt] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactCity, setContactCity] = useState<string>('São Paulo');
  const [contactState, setContactState] = useState<string>('SP');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactInterests, setContactInterests] = useState<string[]>([
    'Esteira Contábil IFRS',
    'Emissor & Fiscal SPED'
  ]);
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);
  const [contactFeedback, setContactFeedback] = useState<{ success: boolean; message: string; protocol: string } | null>(null);

  const toggleContactInterest = (interest: string) => {
    setContactInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSendContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactDoc.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      alert('Por favor, preencha os campos obrigatórios (Nome, Documento, Telefone e E-mail).');
      return;
    }

    setIsSubmittingContact(true);
    const protocolNum = 'SOB-' + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactFeedback({
        success: true,
        protocol: protocolNum,
        message: `Sua solicitação (${contactPersonType}) foi registrada com sucesso sob o protocolo ${protocolNum}. Nosso consultor sênior entrará em contato via WhatsApp/Telefone em até 15 minutos!`
      });

      // Limpar campos
      setContactName('');
      setContactCompany('');
      setContactDoc('');
      setContactPhone('');
      setContactPhoneAlt('');
      setContactEmail('');
      setContactMessage('');
    }, 900);
  };

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
    setErrorMessage('');
    setSuccessMessage('');

    if (!certPin.trim()) {
      setErrorMessage('Por favor, digite a senha PIN do Certificado Digital / Token A3 para autorizar a chave privada.');
      return;
    }

    setIsAuthenticating(true);
    const chosenCert = INSTALLED_CERTIFICATES.find(c => c.id === selectedCertId) || INSTALLED_CERTIFICATES[0];

    setTimeout(() => {
      setIsAuthenticating(false);
      if (customCertFile) {
        const customProfile: UserProfile = {
          id: 'user-cert-' + Date.now(),
          name: customCertFile.replace(/\.[^/.]+$/, "").toUpperCase(),
          role: 'MASTER_ACCOUNTANT',
          roleLabel: 'Titular de Certificado A1 (.pfx)',
          email: 'certificado.a1@soberanocontabil.com.br',
          avatarIcon: '🔑',
          initialModuleId: 'office_integrated_closing_pipeline'
        };
        setSuccessMessage(`Certificado A1 validado na cadeia ICP-Brasil com sucesso!`);
        setTimeout(() => onLoginSuccess(customProfile), 400);
      } else {
        setSuccessMessage(`Certificado "${chosenCert.holderName}" autenticado com sucesso via mTLS ICP-Brasil!`);
        setTimeout(() => onLoginSuccess(chosenCert.associatedProfile), 400);
      }
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

          <a
            href="#contato"
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
            Contato
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
                🔑 Certificado Digital
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <KeyRound size={18} style={{ color: '#38BDF8' }} />
                    <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF' }}>
                      Selecione o Certificado Digital ICP-Brasil
                    </div>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    Selecione um certificado detectado no repositório/token ou importe um arquivo <strong>.pfx/.p12</strong>:
                  </p>

                  {/* Lista de Certificados Detectados */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {INSTALLED_CERTIFICATES.map(cert => {
                      const isSelected = selectedCertId === cert.id && !customCertFile;
                      return (
                        <div
                          key={cert.id}
                          onClick={() => { setSelectedCertId(cert.id); setCustomCertFile(''); }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: isSelected ? 'linear-gradient(180deg, rgba(2, 132, 199, 0.25) 0%, rgba(3, 105, 161, 0.15) 100%)' : '#0B1120',
                            border: isSelected ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 0 10px rgba(56, 189, 248, 0.25)' : 'none'
                          }}
                        >
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.76rem', fontWeight: 900, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                                {cert.holderName}
                              </span>
                              <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', background: cert.type === 'e-CPF' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(167, 139, 250, 0.2)', color: cert.type === 'e-CPF' ? '#34D399' : '#A78BFA' }}>
                                {cert.type}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.62rem', color: '#64748B', marginTop: '2px' }}>
                              {cert.issuerAuthority} • Val: {cert.validUntil}
                            </div>
                          </div>
                          {isSelected && (
                            <span style={{ color: '#38BDF8', fontSize: '0.76rem', fontWeight: 900 }}>●</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Campo de PIN / Senha do Token */}
                  <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.66rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Senha PIN do Token / Certificado
                    </label>
                    <input
                      type="password"
                      value={certPin}
                      onChange={(e) => setCertPin(e.target.value)}
                      placeholder="PIN do Certificado..."
                      style={{ width: '100%', background: '#070B14', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#38BDF8', padding: '6px 10px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                    />
                  </div>

                  {/* Botão de Autenticação */}
                  <button
                    type="button"
                    onClick={handleExecuteCertificate}
                    disabled={isAuthenticating}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                      border: '1.5px solid #38BDF8',
                      borderBottom: '2.5px solid #075985',
                      color: '#FFFFFF',
                      padding: '9px',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.80rem',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px rgba(56, 189, 248, 0.45)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isAuthenticating ? '🔒 Validando Chave mTLS ICP-Brasil...' : '🔑 Conectar com o Certificado Selecionado'}
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

        {/* ===================================================================== */}
        {/* CORTINA DE TRANSIÇÃO 3D 4K COM LASER PRISMÁTICO & INDICADOR DE ROLAGEM */}
        {/* ===================================================================== */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          {/* Drapeado Curvo de Cortina 3D (SVG Holográfico com Degradê Gradual) */}
          <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}>
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '80px', display: 'block' }}
            >
              <defs>
                <linearGradient id="curtainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#070B14" stopOpacity="0" />
                  <stop offset="40%" stopColor="#070B14" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#070B14" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="curtainWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0E172A" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#131E35" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0E172A" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 C320,120 420,0 720,60 C1020,120 1120,0 1440,40 L1440,120 L0,120 Z"
                fill="url(#curtainWaveFill)"
              />
              <path
                d="M0,60 C360,130 540,10 720,75 C900,130 1080,10 1440,60 L1440,120 L0,120 Z"
                fill="url(#curtainGradient)"
              />
            </svg>
          </div>

          {/* Feixe Laser Neon Prismático Animado */}
          <div className="curtain-laser-beam" />

          {/* Pod Central Flutuante com Seta Animada e Ação de Revelação */}
          <div style={{ position: 'absolute', bottom: '14px', zIndex: 35 }}>
            <a
              href="#pilares"
              className="curtain-trigger-pod"
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 20px',
                borderRadius: '30px',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(52, 211, 153, 0.6)',
                borderBottom: '2.5px solid #059669',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: '#34D399', fontSize: '0.76rem' }}>✨</span>
              <span style={{ textShadow: '0 0 10px rgba(52, 211, 153, 0.5)' }}>EXPLORAR PILARES & RECURSOS</span>
              <ChevronsDown size={15} style={{ color: '#34D399' }} />
            </a>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4.5. OS 4 PILARES ARQUITETURAIS DO SOBERANO CONTÁBIL                      */}
      {/* ========================================================================= */}
      <section id="pilares" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.1) 100%)', color: '#38BDF8', fontSize: '0.70rem', fontWeight: 900, border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)', marginBottom: '12px' }}>
            <span>🏛️</span> OS 4 PILARES ARQUITETURAIS DO SOBERANO CONTÁBIL
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Engenharia de Alta Precisão para o Escritório do Futuro
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '750px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Uma plataforma holística projetada para unificar Contabilidade IFRS, Inteligência Fiscal, Departamento Pessoal e Governança Corporativa em perfeita harmonia.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          
          {/* Pilar 1 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #15223C 0%, #0A101E 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.45)',
              borderBottom: '3.5px solid #059669',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(16, 185, 129, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)', border: '1.5px solid #34D399', borderBottom: '2px solid #065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(16, 185, 129, 0.4)' }}>
                  🏛️
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900, boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                  NBC TG • IFRS
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
                1. Contabilidade & IFRS
              </h3>
              <p style={{ fontSize: '0.80rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                Partidas dobradas automáticas, conciliação bancária OFX em lote, Balanço Patrimonial em tempo real, DRE gerencial, DFC e encerramento anual ARE com 1-Click.
              </p>
            </div>
            <div style={{ background: 'rgba(8, 13, 26, 0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.25)', fontSize: '0.72rem', color: '#34D399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> Plano de Contas Referencial SPED ECD/ECF
            </div>
          </div>

          {/* Pilar 2 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #15223C 0%, #0A101E 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              borderBottom: '3.5px solid #0284C7',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(2, 132, 199, 0.15) 100%)', border: '1.5px solid #38BDF8', borderBottom: '2px solid #0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(56, 189, 248, 0.4)' }}>
                  ⚡
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900, boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)' }}>
                  SPED • REFORMA IBS/CBS
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
                2. Fiscal & Tributário
              </h3>
              <p style={{ fontSize: '0.80rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                Dropzone OCR massivo, captura direta SEFAZ WebService, apuração PGDAS-D, segregação de monofásicos PIS/COFINS, Reinf R-4000 e prontidão total para a Reforma Tributária.
              </p>
            </div>
            <div style={{ background: 'rgba(8, 13, 26, 0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> Emissor de NF-e, NFS-e, NFC-e Integrado
            </div>
          </div>

          {/* Pilar 3 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #15223C 0%, #0A101E 100%)',
              border: '1.5px solid rgba(167, 139, 250, 0.45)',
              borderBottom: '3.5px solid #7C3AED',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(124, 58, 237, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(124, 58, 237, 0.15) 100%)', border: '1.5px solid #A78BFA', borderBottom: '2px solid #5B21B6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(167, 139, 250, 0.4)' }}>
                  👥
                </div>
                <span style={{ background: 'rgba(124, 58, 237, 0.18)', color: '#C4B5FD', border: '1px solid rgba(167, 139, 250, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900, boxShadow: '0 0 10px rgba(124, 58, 237, 0.2)' }}>
                  CLT • eSOCIAL S-1.2
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
                3. Departamento Pessoal
              </h3>
              <p style={{ fontSize: '0.80rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                Cálculo determinístico de Folha CLT, rescisões TRCT com aviso prévio proporcional, gestão de férias e ponto eletrônico com validação estrita do eSocial e FGTS Digital.
              </p>
            </div>
            <div style={{ background: 'rgba(8, 13, 26, 0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(167, 139, 250, 0.25)', fontSize: '0.72rem', color: '#A78BFA', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> Recibos e Holerites Assinados em 1-Click
            </div>
          </div>

          {/* Pilar 4 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #15223C 0%, #0A101E 100%)',
              border: '1.5px solid rgba(251, 191, 36, 0.45)',
              borderBottom: '3.5px solid #D97706',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(245, 158, 11, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%)', border: '1.5px solid #FBBF24', borderBottom: '2px solid #B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(245, 158, 11, 0.4)' }}>
                  🛡️
                </div>
                <span style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 900, boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }}>
                  HSM • ICP-BRASIL
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
                4. Governança & CFO Virtual
              </h3>
              <p style={{ fontSize: '0.80rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                Cofre seguro de Certificados Digitais A1/A3, trilha forense imutável, análise financeira com modelo DuPont em 5 estágios, liquidez, solvência e pareceres de IA.
              </p>
            </div>
            <div style={{ background: 'rgba(8, 13, 26, 0.85)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.25)', fontSize: '0.72rem', color: '#FBBF24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> Dossiês Executivos A4 Oficiais para Bancos
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. SEÇÃO DOS 6 GRANDES DIFERENCIAIS COMPETITIVOS                          */}
      {/* ========================================================================= */}
      <section id="diferenciais" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.70rem', fontWeight: 900, border: '1px solid rgba(52, 211, 153, 0.35)', marginBottom: '12px', boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)' }}>
            <span>⚡</span> DIFERENCIAIS ÚNICOS DE MERCADO
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Construído para Eliminar 100% do Retrabalho
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Enquanto os sistemas legados operam em silos isolados com arquivos de texto manuais, o Soberano Contábil integra tudo em memória de alta performance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          
          {/* Card 1 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.35)',
              borderBottom: '3.5px solid #059669',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', border: '1.5px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(16, 185, 129, 0.5)' }}>
              <Workflow size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              1. Esteira de Fechamento Integrada (5 Etapas)
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Triangulação automática <strong>Fiscal ➔ DP ➔ DCTFWeb ➔ Contábil ➔ Dossiê</strong> com cálculo de SLA e avanço em 1-Click. O sócio do escritório sabe exatamente o status de cada cliente da carteira em tempo real.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderBottom: '3.5px solid #0284C7',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '1.5px solid #7DD3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(2, 132, 199, 0.5)' }}>
              <Radar size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              2. Radar Preditivo contra Malhas Fiscais
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Simulação prévia dos algoritmos da Receita Federal e SEFAZ: cruzamento DIMP/PIX vs EFD, eSocial vs DCTFWeb e EFD vs ECD, com botão de <strong>auto-ajuste preventivo com isenção de multas (Art. 138 do CTN)</strong>.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(251, 191, 36, 0.35)',
              borderBottom: '3.5px solid #D97706',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(245, 158, 11, 0.5)' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              3. Book Contábil Executivo A4 (Rating AAA)
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Caderno executivo unificado com Capa, Parecer DuPont do CFO Virtual, DRE, Balanço IFRS, CNDs e <strong>3 Assinaturas Formais (Contador CRC, Diretor e Auditor)</strong> sem quebras de página para apresentação a bancos.
            </p>
          </div>

          {/* Card 4 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(167, 139, 250, 0.35)',
              borderBottom: '3.5px solid #7C3AED',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(124, 58, 237, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', border: '1.5px solid #C4B5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(139, 92, 246, 0.5)' }}>
              <Scale size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              4. Motor da Reforma Tributária (2026–2033)
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Simulador comparativo completo: Lucro Presumido vs Lucro Real vs Novo IVA Dual (IBS estadual/municipal + CBS federal - LC 214/25) com cronograma de transição gradual e créditos de insumos.
            </p>
          </div>

          {/* Card 5 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(6, 182, 212, 0.35)',
              borderBottom: '3.5px solid #0891B2',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(6, 182, 212, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', border: '1.5px solid #67E8F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(6, 182, 212, 0.5)' }}>
              <FileSpreadsheet size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              5. Dropzone Massivo com OCR Inteligente
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Arraste centenas de arquivos (XML de NF-e/NFC-e/NFS-e, Danfes em PDF, extratos bancários OFX/DDA) com leitura OCR e <strong>autoclassificação automática de CFOP, CST e plano de contas</strong>.
            </p>
          </div>

          {/* Card 6 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderBottom: '3.5px solid #059669',
              borderRadius: '16px',
              padding: '26px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)', border: '1.5px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070B12', marginBottom: '16px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 0 18px rgba(52, 211, 153, 0.5)' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              6. Folha CLT & eSocial/SST Determinístico
            </h3>
            <p style={{ fontSize: '0.80rem', color: '#94A3B8', marginTop: '10px', lineHeight: 1.6 }}>
              Processamento com DSR sobre horas extras, provisões trabalhistas CPC 33 (13º/férias), laudos SST com PPP Digital (S-2240) e quitação Homolognet rescisória em 1 clique.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TABELA COMPARATIVA: SOBERANO CONTÁBIL VS SISTEMAS TRADICIONAIS          */}
      {/* ========================================================================= */}
      <section id="comparativo" style={{ padding: '80px 24px', background: '#080D1A', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.70rem', fontWeight: 900, border: '1px solid rgba(56, 189, 248, 0.35)', marginBottom: '12px', boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)' }}>
              <span>📊</span> COMPARATIVO TECNOLÓGICO
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Por que o Soberano Contábil é Líder Absoluto?
            </h2>
          </div>

          <div
            style={{
              background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderBottom: '3.5px solid #0284C7',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.80rem' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #182542 0%, #0E1628 100%)', borderBottom: '2px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ textAlign: 'left', padding: '16px 20px', width: '34%', color: '#E2E8F0', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Capacidade / Funcionalidade
                  </th>
                  <th style={{ textAlign: 'center', padding: '16px 16px', width: '33%', color: '#94A3B8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sistemas Legados de Mercado
                  </th>
                  <th style={{ textAlign: 'center', padding: '16px 20px', width: '33%', color: '#34D399', fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'rgba(16, 185, 129, 0.12)', borderLeft: '1px solid rgba(52, 211, 153, 0.3)' }}>
                    💎 Soberano Contábil Platinum Suite
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    title: 'Integração Fiscal ➔ DP ➔ Contábil',
                    legacy: 'Exportação manual de TXT com retrabalho',
                    soberano: '✓ Esteira em 5 Etapas 1-Click em Memória'
                  },
                  {
                    title: 'Prevenção contra Malhas Fiscais',
                    legacy: 'Descoberta tardia após notificação RFB',
                    soberano: '✓ Radar Preditivo com Auto-Ajuste (Art. 138 CTN)'
                  },
                  {
                    title: 'Reforma Tributária (EC 132/23)',
                    legacy: 'Inexistente ou sem transição temporal',
                    soberano: '✓ Simulador IBS/CBS 2026–2033 Nativo'
                  },
                  {
                    title: 'Dossiês A4 para Bancos & Investidores',
                    legacy: 'Relatórios genéricos com quebras visuais',
                    soberano: '✓ Dossiês Executivos Oficiais com 3 Assinaturas'
                  },
                  {
                    title: 'Captura e Leitura de Documentos',
                    legacy: 'Digitação manual ou upload unitário lento',
                    soberano: '✓ Dropzone Massivo OCR + Autoclassificação'
                  },
                  {
                    title: 'Análise Econômico-Financeira',
                    legacy: 'Balancetes frios sem inteligência consultiva',
                    soberano: '✓ CFO Virtual com DuPont em 5 Estágios & WACC'
                  }
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(15, 23, 42, 0.45)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <td style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 800 }}>
                      {row.title}
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 16px', color: '#F87171', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>✕</span>
                        {row.legacy}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px 20px', color: '#34D399', fontWeight: 900, background: 'rgba(16, 185, 129, 0.08)', borderLeft: '1px solid rgba(52, 211, 153, 0.2)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                        {row.soberano}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALCULADORA INTERATIVA DE RETORNO SOBRE O INVESTIMENTO (ROI)           */}
      {/* ========================================================================= */}
      <section id="roi" style={{ padding: '80px 24px', maxWidth: '1050px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.45)',
            borderBottom: '3.5px solid #059669',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.70rem', fontWeight: 900, border: '1px solid rgba(52, 211, 153, 0.4)', boxShadow: '0 0 16px rgba(16, 185, 129, 0.25)' }}>
              <Sliders size={13} /> CALCULADORA DE ECONOMIA OPERACIONAL
            </div>
            <h2 style={{ fontSize: '2.0rem', fontWeight: 900, color: '#FFFFFF', marginTop: '12px', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Descubra quanto seu escritório economiza por mês
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '680px', margin: '0 auto' }}>
            
            {/* Slider Pod 3D */}
            <div style={{ background: '#080D1A', padding: '20px 24px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#E2E8F0' }}>Empresas Atendidas na Carteira:</span>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '4px 12px', borderRadius: '8px', boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)' }}>
                  <strong style={{ fontSize: '1.2rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>{clientsCount} clientes</strong>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={clientsCount}
                onChange={(e) => setClientsCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer', height: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#64748B', marginTop: '6px', fontWeight: 700 }}>
                <span>5 clientes</span>
                <span>150 clientes</span>
                <span>300 clientes</span>
              </div>
            </div>

            {/* Resultado 3D 4K */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div
                style={{
                  background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  borderBottom: '3.5px solid #0284C7',
                  padding: '20px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tempo Economizado / Mês</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)', margin: '8px 0 4px 0', textShadow: '0 0 16px rgba(56, 189, 248, 0.5)' }}>
                  {hoursSavedPerMonth} horas
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Equivalente a {(hoursSavedPerMonth / 160).toFixed(1)} analistas dedicados</div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
                  border: '1.5px solid rgba(52, 211, 153, 0.45)',
                  borderBottom: '3.5px solid #059669',
                  padding: '20px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Economia Financeira Direta</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)', margin: '8px 0 4px 0', textShadow: '0 0 16px rgba(52, 211, 153, 0.6)' }}>
                  R$ {monthlyCostSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>R$ {(monthlyCostSavings * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} economizados por ano</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                onClick={() => handleDirectLoginWithProfile(PRESET_PROFILES[0])}
                className="btn-1click-3d"
                style={{ padding: '12px 32px', fontSize: '0.92rem', borderRadius: '10px' }}
              >
                <span>⚡</span> Entrar em 1-Click & Ativar Esta Economia Imediata
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5.5. SEÇÃO DE CONTATO & FORMULÁRIO COMPLETO PJ / PF 3D 4K                */}
      {/* ========================================================================= */}
      <section id="contato" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.70rem', fontWeight: 900, border: '1px solid rgba(52, 211, 153, 0.4)', boxShadow: '0 0 16px rgba(16, 185, 129, 0.25)', marginBottom: '12px' }}>
            <span>📞</span> CANAL DIRETO & CONSULTORIA CORPORATIVA
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Fale com Nossos Especialistas & Solicite uma Proposta
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '720px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Atendimento sob medida para escritórios de contabilidade, empresas de todos os portes e profissionais. Preencha o formulário para atendimento prioritário.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(300px, 1fr)', gap: '28px', alignItems: 'start' }}>
          
          {/* Coluna 1: Formulário 3D 4K Interativo */}
          <div
            style={{
              background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.45)',
              borderBottom: '3.5px solid #059669',
              borderRadius: '18px',
              padding: '32px',
              boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.18)'
            }}
          >
            {/* Seletor 3D: Pessoa Jurídica vs Pessoa Física */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: '#080D1A', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                onClick={() => setContactPersonType('PJ')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: contactPersonType === 'PJ' ? '1.5px solid #34D399' : '1px solid transparent',
                  borderBottom: contactPersonType === 'PJ' ? '2.5px solid #059669' : 'none',
                  background: contactPersonType === 'PJ' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.14) 100%)' : 'transparent',
                  color: contactPersonType === 'PJ' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: contactPersonType === 'PJ' ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Building2 size={16} color={contactPersonType === 'PJ' ? '#34D399' : '#94A3B8'} />
                <span>Pessoa Jurídica (PJ / Empresa)</span>
              </button>

              <button
                type="button"
                onClick={() => setContactPersonType('PF')}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: contactPersonType === 'PF' ? '1.5px solid #38BDF8' : '1px solid transparent',
                  borderBottom: contactPersonType === 'PF' ? '2.5px solid #0284C7' : 'none',
                  background: contactPersonType === 'PF' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.28) 0%, rgba(2, 132, 199, 0.14) 100%)' : 'transparent',
                  color: contactPersonType === 'PF' ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: contactPersonType === 'PF' ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(56, 189, 248, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <User size={16} color={contactPersonType === 'PF' ? '#38BDF8' : '#94A3B8'} />
                <span>Pessoa Física (PF / Autônomo)</span>
              </button>
            </div>

            {contactFeedback && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10B981', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#34D399" />
                  <span style={{ fontSize: '0.90rem', fontWeight: 900, color: '#FFFFFF' }}>Solicitação Enviada com Sucesso!</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
                  {contactFeedback.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSendContactForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Linha 1: Dados Principais (PJ vs PF) */}
              {contactPersonType === 'PJ' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Razão Social ou Nome Fantasia *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        placeholder="Ex: Soberano Indústria & Comércio S/A"
                        style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        CNPJ da Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactDoc}
                        onChange={(e) => setContactDoc(e.target.value)}
                        placeholder="00.000.000/0000-00"
                        style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#34D399', padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Nome do Responsável / Solicitante *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ex: David Valu"
                        style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Número Estimado de Funcionários
                      </label>
                      <select
                        value={contactEmployees}
                        onChange={(e) => setContactEmployees(e.target.value)}
                        style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#38BDF8', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="1-5">👥 1 a 5 colaboradores</option>
                        <option value="6-20">👥 6 a 20 colaboradores</option>
                        <option value="21-50">👥 21 a 50 colaboradores</option>
                        <option value="51-100">👥 51 a 100 colaboradores</option>
                        <option value="100+">🏢 Mais de 100 colaboradores (Enterprise)</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: David Valu"
                      style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      CPF (Pessoa Física) *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactDoc}
                      onChange={(e) => setContactDoc(e.target.value)}
                      placeholder="000.000.000-00"
                      style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#38BDF8', padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Telefones & E-mail */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Telefone Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Telefone Fixo / Comercial (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={contactPhoneAlt}
                    onChange={(e) => setContactPhoneAlt(e.target.value)}
                    placeholder="(11) 3333-3333"
                    style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Localização */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={contactCity}
                    onChange={(e) => setContactCity(e.target.value)}
                    placeholder="São Paulo"
                    style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    UF
                  </label>
                  <select
                    value={contactState}
                    onChange={(e) => setContactState(e.target.value)}
                    style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="PR">PR</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="BA">BA</option>
                    <option value="GO">GO</option>
                    <option value="DF">DF</option>
                  </select>
                </div>
              </div>

              {/* Módulos de Interesse */}
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Módulos e Soluções de Maior Interesse
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Esteira Contábil IFRS',
                    'Emissor & Fiscal SPED',
                    'Folha CLT & eSocial',
                    'BPO Financeiro & CFO Virtual',
                    'Reforma Tributária 2026',
                    'Dropzone Massivo OCR'
                  ].map(mod => {
                    const isSelected = contactInterests.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleContactInterest(mod)}
                        style={{
                          background: isSelected ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)' : '#080D1A',
                          border: isSelected ? '1.5px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#34D399' : '#94A3B8',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.70rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.25)' : 'none'
                        }}
                      >
                        <span>{isSelected ? '✓' : '+'}</span> {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mensagem Opcional */}
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Mensagem ou Detalhes Específicos da sua Operação
                </label>
                <textarea
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Descreva brevemente o volume de notas, colaboradores ou necessidades específicas do seu negócio..."
                  style={{ width: '100%', background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Botão de Envio Master 3D 4K */}
              <button
                type="submit"
                disabled={isSubmittingContact}
                className="btn-1click-3d"
                style={{ width: '100%', padding: '12px 20px', fontSize: '0.90rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={16} />
                <span>{isSubmittingContact ? 'Enviando Solicitação...' : '⚡ Enviar Proposta & Falar com Consultor Especialista'}</span>
              </button>
            </form>
          </div>

          {/* Coluna 2: Cards 3D de Contato Imediato e Credenciais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Card 1: WhatsApp Corporativo */}
            <div
              style={{
                background: 'linear-gradient(180deg, #152438 0%, #0A1220 100%)',
                border: '1.5px solid rgba(52, 211, 153, 0.45)',
                borderBottom: '3.5px solid #059669',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.2), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: '1.5px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#FFFFFF' }}>WhatsApp Corporativo Oficial</div>
                  <div style={{ fontSize: '0.70rem', color: '#34D399', fontWeight: 800 }}>Atendimento Prioritário em Tempo Real</div>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                Converse diretamente com nosso time comercial e tire dúvidas sobre integração e planos.
              </p>
              <div style={{ background: '#080D1A', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>(11) 98765-4321</strong>
                <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>ONLINE AGORA</span>
              </div>
            </div>

            {/* Card 2: E-mail e Sede */}
            <div
              style={{
                background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderBottom: '3.5px solid #0284C7',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', border: '1.5px solid #7DD3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 0 16px rgba(2, 132, 199, 0.5)' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#FFFFFF' }}>E-mail & Sede Corporativa</div>
                  <div style={{ fontSize: '0.70rem', color: '#38BDF8', fontWeight: 800 }}>São Paulo / SP • Brasil</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#38BDF8" />
                  <span>atendimento@soberanocontabil.com.br</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#38BDF8" />
                  <span>Av. Paulista, 1000 - Bela Vista, São Paulo/SP</span>
                </div>
              </div>
            </div>

            {/* Card 3: Garantias e SLA */}
            <div
              style={{
                background: 'linear-gradient(180deg, #18233C 0%, #0D1426 100%)',
                border: '1.5px solid rgba(251, 191, 36, 0.35)',
                borderBottom: '3.5px solid #D97706',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="#FBBF24" />
                <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF' }}>Compromisso Soberano de Qualidade</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.6 }}>
                <li>Tempo de resposta inicial em menos de 15 minutos;</li>
                <li>Conformidade integral com LGPD & Criptografia AES-256;</li>
                <li>Onboarding técnico conduzido por Contadores com CRC Ativo.</li>
              </ul>
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
