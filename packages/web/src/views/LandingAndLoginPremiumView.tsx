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
  Calendar,
  Clock,
  TrendingUp,
  Check,
  X,
  FileText,
  Sliders,
  DollarSign,
  Layers,
  ChevronDown
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

  // Calculadora Interativa de ROI
  const [clientsCount, setClientsCount] = useState<number>(60);
  const hoursSavedPerMonth = Math.round(clientsCount * 5.5);
  const monthlyCostSavings = Math.round(hoursSavedPerMonth * 45); // R$ 45/hora de analista

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
    <div className="landing-marketing-container" style={{ minHeight: '100vh', background: '#070B14', color: '#FFFFFF', overflowX: 'hidden' }}>
      
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
          padding: '12px 32px',
          background: 'rgba(9, 15, 28, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #0284C7 100%)',
              border: '2px solid rgba(52, 211, 153, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.82rem',
              color: '#070B12',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 0 16px rgba(16, 185, 129, 0.6)'
            }}
          >
            SC
          </div>
          <div>
            <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Soberano <span style={{ color: '#34D399', textShadow: '0 0 12px rgba(52, 211, 153, 0.5)' }}>Contábil</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em' }}>
              PLATINUM SUITE ENTERPRISE v4.5
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.76rem', fontWeight: 700 }}>
          <a href="#diferenciais" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Diferenciais</a>
          <a href="#comparativo" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Comparativo</a>
          <a href="#pilares" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Pilares</a>
          <a href="#roi" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>Calculadora ROI</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => handleExecuteLogin()}
            className="btn-1click-3d"
            style={{ padding: '6px 14px', fontSize: '0.74rem' }}
          >
            <Zap size={13} /> Testar em 1-Click
          </button>
          <a
            href="#login-section"
            style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.74rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lock size={12} style={{ color: '#38BDF8' }} /> Login
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION COM VÍDEO BACKGROUND 4K                                  */}
      {/* ========================================================================= */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '60px 24px' }}>
        
        {/* Vídeo Background */}
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
              opacity: 0.30,
              filter: 'saturate(1.2) contrast(1.1) brightness(0.7)'
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(10, 18, 36, 0.7) 0%, rgba(5, 9, 18, 0.95) 85%, #070B14 100%)',
              backdropFilter: 'blur(3px)'
            }}
          />
        </div>

        {/* Conteúdo Central do Hero */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)', border: '1px solid rgba(52, 211, 153, 0.5)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
            <Sparkles size={16} style={{ color: '#34D399' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34D399', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              O Futuro da Contabilidade Empresarial & Tributária
            </span>
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            A Plataforma Definitiva de <br />
            <span style={{ background: 'linear-gradient(135deg, #34D399 0%, #38BDF8 50%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>
              Inteligência Contábil, Fiscal & Trabalhista
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '780px', lineHeight: 1.6, margin: '6px 0 10px 0' }}>
            Unificamos <strong>181 rotinas corporativas</strong>, rigor IFRS/CPC, folha determinística CLT, pré-auditoria contra malhas fiscais da Receita Federal e simulador da Reforma Tributária 2026–2033 em uma experiência 3D 4K sem precedentes.
          </p>

          {/* Badges Flutuantes 3D */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <div className="control-pod-3d" style={{ padding: '6px 14px' }}>
              <span style={{ color: '#34D399', fontWeight: 900, fontSize: '0.84rem' }}>🚀 +92%</span>
              <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Produtividade Operacional</span>
            </div>
            <div className="control-pod-3d" style={{ padding: '6px 14px' }}>
              <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: '0.84rem' }}>🛡️ Zero</span>
              <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Malhas Fiscais (Art. 138 CTN)</span>
            </div>
            <div className="control-pod-3d" style={{ padding: '6px 14px' }}>
              <span style={{ color: '#FBBF24', fontWeight: 900, fontSize: '0.84rem' }}>📑 Rating AAA</span>
              <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Book Contábil para Bancos</span>
            </div>
            <div className="control-pod-3d" style={{ padding: '6px 14px' }}>
              <span style={{ color: '#A78BFA', fontWeight: 900, fontSize: '0.84rem' }}>⚖️ 2026–2033</span>
              <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Reforma IBS/CBS Nativa</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
            <button
              onClick={() => handleExecuteLogin()}
              className="btn-1click-3d"
              style={{ padding: '12px 28px', fontSize: '0.92rem' }}
            >
              <Zap size={18} /> Explorar Cockpit em 1-Click
            </button>
            <a
              href="#login-section"
              style={{
                background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: '2px solid rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Lock size={16} style={{ color: '#38BDF8' }} /> Acesso Corporativo
            </a>
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
          
          {/* Card 1 */}
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

          {/* Card 2 */}
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

          {/* Card 3 */}
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

          {/* Card 4 */}
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

          {/* Card 5 */}
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

          {/* Card 6 */}
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
      {/* 6. SEÇÃO DE LOGIN CORPORATIVO & ACESSO RÁPIDO 3D                          */}
      {/* ========================================================================= */}
      <section id="login-section" style={{ padding: '80px 24px', background: '#090F1C', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          
          <div
            style={{
              background: 'linear-gradient(180deg, #151F36 0%, #0C1322 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.4)',
              borderBottom: '3px solid rgba(5, 150, 105, 0.7)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 20px rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#34D399' }} />
                <h2 style={{ fontSize: '1.02rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Acesso Corporativo Seguro
                </h2>
              </div>
              <span style={{ fontSize: '0.60rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                AES-256
              </span>
            </div>

            {/* Perfis */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Selecione o Perfil de Demonstração
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
                  Senha de Acesso / Token
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
                  <span>🔐 Entrar no Sistema ({selectedProfile.name})</span>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0', fontSize: '0.64rem', color: '#64748B' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span>OU AUTENTIQUE COM</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

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
                🔒 Lendo Certificado ICP-Brasil... Conexão Criptografada!
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.62rem', color: '#64748B' }}>
              <ShieldCheck size={12} style={{ color: '#10B981' }} />
              Criptografia AES-256 • Conforme LGPD & ICP-Brasil
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER INSTITUCIONAL COMPLETO COM SELOS DE AUDITORIA                  */}
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
