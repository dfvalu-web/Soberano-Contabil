import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Zap,
  Layers,
  ArrowRight,
  Database,
  Building2,
  FileCheck
} from 'lucide-react';

export const OfficeClientOnboardingMigrationView: React.FC = () => {
  const [origemSistema, setOrigemSistema] = useState('DOMINIO');
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartMigration = () => {
    setIsMigrating(true);
    setProgress(15);
    setTimeout(() => setProgress(50), 300);
    setTimeout(() => setProgress(85), 600);
    setTimeout(() => {
      setProgress(100);
      setIsMigrating(false);
      showToast('Migração concluída com sucesso! Plano de contas, saldos anteriores e colaboradores importados.');
    }, 900);
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
            🔄
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Central Universal de Migração & Importação de Sistemas Legados
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
                10 SISTEMAS COMPATÍVEIS
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Importador automatizado de bases legadas (Domínio Sistemas, Alterdata Pack, TOTVS Protheus, Questor, Contmatic, Fortes Tecnologia).
            </p>
          </div>
        </div>
      </div>

      {/* Painel Interativo de Migração */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Sistema de Origem (Legado):</label>
            <select
              value={origemSistema}
              onChange={(e) => setOrigemSistema(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, marginTop: '4px', outline: 'none' }}
            >
              <option value="DOMINIO">Domínio Sistemas (Thomson Reuters)</option>
              <option value="ALTERDATA">Alterdata Pack</option>
              <option value="TOTVS">TOTVS Protheus / RM</option>
              <option value="QUESTOR">Questor Contábil</option>
              <option value="CONTMATIC">Contmatic Phoenix</option>
              <option value="FORTES">Fortes Tecnologia</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Arquivo de Backup (.bak / .sql / .zip):</label>
            <div style={{ background: '#0B1120', border: '1px dashed rgba(56, 189, 248, 0.4)', padding: '7px 12px', borderRadius: '6px', fontSize: '0.76rem', color: '#CBD5E1', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>backup_empresa_completo.zip</span>
              <span style={{ color: '#34D399', fontWeight: 800 }}>Pronto</span>
            </div>
          </div>
        </div>

        {isMigrating && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
              <span style={{ color: '#38BDF8' }}>Convertendo Plano de Contas & Lançamentos...</span>
              <span style={{ fontWeight: 800, color: '#34D399' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #38BDF8, #34D399)' }}></div>
            </div>
          </div>
        )}

        <button
          onClick={handleStartMigration}
          disabled={isMigrating}
          className="btn-1click-3d"
          style={{ alignSelf: 'flex-start' }}
        >
          <Zap size={14} /> <span>{isMigrating ? 'Migrando Base de Dados...' : 'Iniciar Migração 1-Click'}</span>
        </button>
      </div>

      {/* Dossiê Oficial A4 Diamante */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">LAUDO OFICIAL DE MIGRAÇÃO E HOMOLOGAÇÃO DE SALDOS CONTÁBEIS</div>
              <div className="diamond-subtitle">Certificado de Conversão De-Para e Partidas Dobradas • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeClientOnboardingMigrationView;
