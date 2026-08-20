import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Building2,
  MapPin,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const OfficeRedesimViabilityLicensingView: React.FC = () => {
  const [razaoSocial, setRazaoSocial] = useState('SOBERANO HEALTH & NUTRITION LTDA');
  const [municipio, setMunicipio] = useState('São Paulo / SP');
  const [cnaePrincipal, setCnaePrincipal] = useState('4771-7/01 - Comércio varejista de produtos farmacêuticos');
  const [notification, setNotification] = useState<string | null>(null);

  const [viabilityStatus, setViabilityStatus] = useState<'APROVADA' | 'EM_ANALISE'>('APROVADA');
  const [protocolo, setProtocolo] = useState('SPP2608199482');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSimularViabilidade = () => {
    setViabilityStatus('EM_ANALISE');
    setTimeout(() => {
      setViabilityStatus('APROVADA');
      setProtocolo(`SPP2608${Math.floor(100000 + Math.random() * 900000)}`);
      showToast('Consulta Prévia de Viabilidade e Licenciamento APROVADA na Junta Comercial e Prefeitura!');
    }, 800);
  };

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

      {/* Header 3D 4K */}
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
            🧭
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Viabilidade Redesim & Licenciamento Integrado
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
                INTEGRAÇÃO REDESIM / JUCESP
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Consulta prévia de viabilidade de nome empresarial, zoneamento urbano municipal e geração do DBE perante a Receita Federal.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimularViabilidade}
          className="btn-1click-3d"
        >
          <Zap size={14} /> <span>Consultar Viabilidade 1-Click</span>
        </button>
      </div>

      {/* Formulário Interativo de Viabilidade */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
          Dados para Abertura / Alteração Contratual
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Nome Empresarial Sugerido:</label>
            <input
              type="text"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, marginTop: '4px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Município / UF:</label>
            <input
              type="text"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginTop: '4px', outline: 'none' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>CNAE Principal:</label>
            <input
              type="text"
              value={cnaePrincipal}
              onChange={(e) => setCnaePrincipal(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#34D399', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginTop: '4px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Parecer do Protocolo */}
        <div style={{ background: '#0B1120', padding: '14px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase' }}>Protocolo Nacional Redesim</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{protocolo}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase' }}>Status de Viabilidade</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34D399' }}>✓ VIABILIDADE APROVADA</div>
          </div>
          <button
            onClick={() => showToast('DBE transmitido e gerado para assinatura gov.br!')}
            className="btn-1click-3d"
          >
            <span>📄</span> Gerar DBE Receita Federal
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficeRedesimViabilityLicensingView;
