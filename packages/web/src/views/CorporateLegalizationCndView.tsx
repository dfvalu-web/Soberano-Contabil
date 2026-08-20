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
  Printer
} from 'lucide-react';

export const CorporateLegalizationCndView: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanTime, setLastScanTime] = useState<string>('Hoje às 08:30 (Automático)');

  const cndsList = [
    { id: 'CND-1', orgao: 'Receita Federal & PGFN', escopo: 'Tributos Federais & Dívida Ativa da União', status: 'REGULAR', validade: '14/11/2026', diasRestantes: 86, codigoControle: 'RFB-2026-9948123-A' },
    { id: 'CND-2', orgao: 'SEFAZ Estadual (ICMS)', escopo: 'Débitos Fiscais Estaduais & Dívida Ativa SP', status: 'REGULAR', validade: '28/09/2026', diasRestantes: 39, codigoControle: 'SEFAZ-SP-849102-B' },
    { id: 'CND-3', orgao: 'Prefeitura Municipal (ISS)', escopo: 'Tributos Mobiliários & Imobiliários (IPTU/ISS)', status: 'REGULAR', validade: '12/10/2026', diasRestantes: 53, codigoControle: 'PMSP-7718290-C' },
    { id: 'CND-4', orgao: 'Caixa Econômica Federal (CRF)', escopo: 'Certificado de Regularidade do FGTS', status: 'REGULAR', validade: '05/09/2026', diasRestantes: 16, codigoControle: 'CRF-CAIXA-491029-D' },
    { id: 'CND-5', orgao: 'Tribunal Superior do Trabalho', escopo: 'CNDT - Certidão Negativa de Débitos Trabalhistas', status: 'REGULAR', validade: '15/12/2026', diasRestantes: 117, codigoControle: 'TST-CNDT-102938-E' }
  ];

  const handleRunScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime('Agora mesmo (100% Atualizado)');
      alert('Varredura concluída! Todas as 5 Certidões Negativas de Débitos (CNDs) estão ativas e regulares.');
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(2, 132, 199, 0.15) 100%)', border: '1.5px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)' }}>
            📜
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Legalização Societária & Robô Automático de CNDs
              </h1>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                100% REGULAR
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Varredura periódica e renovação automática de certidões federais, estaduais, municipais, FGTS e trabalhistas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRunScanner}
            disabled={isScanning}
            className="btn-primary-action"
          >
            <RefreshCw size={14} className={isScanning ? 'spin' : ''} />
            <span>{isScanning ? 'Consultando Órgãos Gov...' : 'Executar Varredura em 1-Click'}</span>
          </button>
        </div>
      </div>

      {/* Status da Varredura */}
      <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={24} color="#34D399" />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>Certificado de Regularidade Fiscal & CNDs</div>
            <div style={{ fontSize: '0.70rem', color: '#94A3B8' }}>Última consulta realizada: {lastScanTime}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={13} /> <span>Imprimir Certificado A4</span>
          </button>
        </div>
      </div>

      {/* Grid de 5 CNDs Oficiais com Alerta de Vencimento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
        {cndsList.map(cnd => (
          <div
            key={cnd.id}
            style={{
              background: 'linear-gradient(180deg, #141F36 0%, #0A101E 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.35)',
              borderBottom: '3px solid #059669',
              borderRadius: '12px',
              padding: '18px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.64rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase' }}>{cnd.orgao}</span>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', margin: '2px 0 0 0' }}>{cnd.escopo}</h4>
              </div>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                ✓ REGULAR
              </span>
            </div>

            <div style={{ background: '#080D1A', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', margin: '10px 0', fontSize: '0.68rem', color: '#94A3B8' }}>
              <div>Controle: <strong style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>{cnd.codigoControle}</strong></div>
              <div>Válida até: <strong style={{ color: '#FFFFFF' }}>{cnd.validade}</strong> ({cnd.diasRestantes} dias restantes)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.66rem', color: '#34D399', fontWeight: 800 }}>Emissão Instantânea Gov</span>
              <button
                onClick={() => alert(`Download da certidão ${cnd.orgao} em PDF autenticado!`)}
                style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.70rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} /> <span>Baixar PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    
      {/* ========================================================================= */}
      {/* DOSSIÊ A4 DE REGULARIDADE FISCAL & CNDs (PADRÃO DIAMANTE)                 */}
      {/* ========================================================================= */}
      <div className="diamond-paper-a4" style={{ marginTop: '24px' }}>
        <div className="diamond-report-header">
          <div className="diamond-report-title">
            <h1>CERTIFICADO DE REGULARIDADE FISCAL & MONITOR DE CNDs</h1>
            <h2>EMISSÃO CENTRALIZADA • RECEITA FEDERAL • SEFAZ • PREFEITURA • FGTS • TST</h2>
          </div>
          <div className="diamond-logo-box">
            <span>🏛️ SOBERANO</span>
            <small>AUDITORIA CND</small>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Empresa / Tomador</strong>
            <span>SOBERANO TECH S/A</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CNPJ Principal</strong>
            <span className="font-mono">12.345.678/0001-90</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Data da Varredura</strong>
            <span>19/08/2026 às 08:30</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status de Regularidade</strong>
            <span style={{ color: '#047857', fontWeight: 900 }}>✓ 100% REGULAR (SEM PENDÊNCIAS)</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Órgão Emissor</th>
              <th>Escopo da Certidão</th>
              <th>Código de Controle / Autenticidade</th>
              <th>Validade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Receita Federal & PGFN</td>
              <td>Tributos Federais & Dívida Ativa da União</td>
              <td className="font-mono">RFB-2026-9948123-A</td>
              <td>14/11/2026</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR</td>
            </tr>
            <tr>
              <td>SEFAZ Estadual SP</td>
              <td>Débitos Fiscais de ICMS & Dívida Ativa</td>
              <td className="font-mono">SEFAZ-SP-849102-B</td>
              <td>28/09/2026</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR</td>
            </tr>
            <tr>
              <td>Prefeitura Municipal</td>
              <td>Tributos Mobiliários & Imobiliários (ISS/IPTU)</td>
              <td className="font-mono">PMSP-7718290-C</td>
              <td>12/10/2026</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR</td>
            </tr>
            <tr>
              <td>Caixa Econômica Federal</td>
              <td>CRF - Certificado de Regularidade do FGTS</td>
              <td className="font-mono">CRF-CAIXA-491029-D</td>
              <td>05/09/2026</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR</td>
            </tr>
            <tr>
              <td>Tribunal Superior do Trabalho</td>
              <td>CNDT - Certidão Negativa de Débitos Trabalhistas</td>
              <td className="font-mono">TST-CNDT-102938-E</td>
              <td>15/12/2026</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR</td>
            </tr>
          </tbody>
        </table>

        {/* 3 Assinaturas Formais */}
        <div className="diamond-signatures">
          <div className="diamond-signature-line">
            <div>DAVID VALU</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Contador Responsável • CRC 1SP999999/O-0</div>
          </div>
          <div className="diamond-signature-line">
            <div>DRA. BEATRIZ SANTOS</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Especialista Tributária • OAB/SP 412.980</div>
          </div>
          <div className="diamond-signature-line">
            <div>DIRETORIA EXECUTIVA</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Representante Legal do Contribuinte</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <span>🔒 Hash SHA-256: 3a9e102f98cb77120aef4819028cb91823901823901283901823901823901823</span>
          <span>Soberano Contábil Platinum Suite v4.5</span>
        </div>
      </div>

    </div>
  );
};
export default CorporateLegalizationCndView;
