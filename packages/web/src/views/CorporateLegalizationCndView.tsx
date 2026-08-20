import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
  FileText,
  Clock,
  Printer,
  Zap,
  Play
} from 'lucide-react';

export const CorporateLegalizationCndView: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanTime, setLastScanTime] = useState<string>('Hoje às 14:30 (Varredura Automática)');
  const [notification, setNotification] = useState<string | null>(null);

  const [cndsList, setCndsList] = useState([
    { id: 'CND-1', orgao: 'Receita Federal & PGFN', escopo: 'Tributos Federais & Dívida Ativa da União', status: 'REGULAR', validade: '14/11/2026', diasRestantes: 86, codigoControle: 'RFB-2026-9948123-A' },
    { id: 'CND-2', orgao: 'SEFAZ Estadual (ICMS)', escopo: 'Débitos Fiscais Estaduais & Dívida Ativa SP', status: 'REGULAR', validade: '28/09/2026', diasRestantes: 39, codigoControle: 'SEFAZ-SP-849102-B' },
    { id: 'CND-3', orgao: 'Prefeitura Municipal (ISS)', escopo: 'Tributos Mobiliários & Imobiliários (IPTU/ISS)', status: 'REGULAR', validade: '12/10/2026', diasRestantes: 53, codigoControle: 'PMSP-7718290-C' },
    { id: 'CND-4', orgao: 'Caixa Econômica Federal (CRF)', escopo: 'Certificado de Regularidade do FGTS', status: 'REGULAR', validade: '05/09/2026', diasRestantes: 16, codigoControle: 'CRF-CAIXA-491029-D' },
    { id: 'CND-5', orgao: 'Tribunal Superior do Trabalho', escopo: 'CNDT - Certidão Negativa de Débitos Trabalhistas', status: 'REGULAR', validade: '15/12/2026', diasRestantes: 117, codigoControle: 'TST-CNDT-102938-E' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRunScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime('Agora mesmo (100% Atualizado)');
      showToast('Varredura concluída! Todas as 5 CNDs perante RFB, SEFAZ, Prefeitura, FGTS e TST estão ativas e regulares.');
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

      {/* Header Diamond 3D */}
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
            📜
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Legalização Societária & Robô Automático de CNDs
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
                100% REGULAR
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Varredura periódica e renovação automática de certidões federais, estaduais, municipais, FGTS e trabalhistas.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunScanner}
          disabled={isScanning}
          className="btn-1click-3d"
        >
          <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
          <span>{isScanning ? 'Varrendo Órgãos Públicos...' : 'Disparar Varredura Automática de CNDs'}</span>
        </button>
      </div>

      {/* Grade de Certidões Negativas */}
      <div style={{
        background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
            Painel de Certidões Negativas de Débitos (CNDs)
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{lastScanTime}</span>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Órgão Emissor / Escopo</th>
              <th style={{ textAlign: 'center' }}>Código de Autenticidade</th>
              <th style={{ textAlign: 'center' }}>Validade</th>
              <th style={{ textAlign: 'center' }}>Dias Restantes</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Certidão PDF</th>
            </tr>
          </thead>
          <tbody>
            {cndsList.map(cnd => (
              <tr key={cnd.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                  <div>{cnd.orgao}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>{cnd.escopo}</div>
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.70rem', color: '#38BDF8' }}>
                  {cnd.codigoControle}
                </td>
                <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.72rem' }}>{cnd.validade}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: cnd.diasRestantes < 30 ? '#FBBF24' : '#34D399' }}>
                  {cnd.diasRestantes} dias
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    ✓ REGULAR
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => showToast(`Download da certidão autenticada ${cnd.orgao} iniciado!`)}
                    style={{
                      background: 'linear-gradient(180deg, #18263D 0%, #0F172A 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38BDF8',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.70rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={12} /> <span>PDF Oficial</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Certificado Diamante A4 */}
      <div className="diamond-report-card" style={{ marginTop: '16px' }}>
        <div className="diamond-paper-a4">
          <div className="diamond-header">
            <div>
              <div className="diamond-title">CERTIFICADO DE REGULARIDADE FISCAL</div>
              <div className="diamond-subtitle">Dossiê Consolidado de Certidões Negativas de Débitos (CNDs) • Padrão Diamante</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateLegalizationCndView;
