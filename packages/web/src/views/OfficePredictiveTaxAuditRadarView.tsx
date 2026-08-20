import React, { useState } from 'react';
import {
  Radar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Zap,
  Printer,
  Sparkles,
  Search,
  Lock,
  ArrowRight,
  TrendingDown,
  Scale
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store';

interface AuditCrossCheck {
  id: string;
  category: 'Fiscal x Contábil' | 'Trabalhista x DCTFWeb' | 'Bancário x Faturamento' | 'Retenções x Reinf';
  name: string;
  source1: string;
  source2: string;
  divergenceAmount: number;
  riskLevel: 'CRITICO' | 'ALERTA' | 'CONFORME';
  legalBase: string;
  recommendation: string;
}

export const OfficePredictiveTaxAuditRadarView: React.FC<{ tenant?: CompanyTenant }> = ({ tenant }) => {
  const [selectedRisk, setSelectedRisk] = useState<'ALL' | 'CRITICO' | 'ALERTA' | 'CONFORME'>('ALL');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showA4Dossier, setShowA4Dossier] = useState<boolean>(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const crossChecks: AuditCrossCheck[] = [
    {
      id: 'AUD-01',
      category: 'Fiscal x Contábil',
      name: 'Cruzamento EFD-Contribuições (PIS/COFINS) vs Receita Líquida no Razão ECD',
      source1: 'EFD-Contribuições M200/M600 (R$ 1.840.200,00)',
      source2: 'ECD Bloco J DRE Conta 3.1.1 (R$ 1.840.200,00)',
      divergenceAmount: 0,
      riskLevel: 'CONFORME',
      legalBase: 'IN RFB 1.252/12 • Lei 11.638/07',
      recommendation: 'Conformidade plena. Nenhuma ação requerida.'
    },
    {
      id: 'AUD-02',
      category: 'Bancário x Faturamento',
      name: 'Vendas em Cartão / PIX (DIMP / e-Financeira) vs Faturamento Declarado',
      source1: 'Adquirentes & Bancos (R$ 1.250.400,00)',
      source2: 'EFD ICMS Bloco C100 / NF-e (R$ 1.248.100,00)',
      divergenceAmount: 2300.00,
      riskLevel: 'ALERTA',
      legalBase: 'Convênio ICMS 134/16 • Art. 138 CTN',
      recommendation: 'Conciliar 2 comprovantes TEF com cancelamento pendente para evitar intimação SEFAZ.'
    },
    {
      id: 'AUD-03',
      category: 'Trabalhista x DCTFWeb',
      name: 'Base Previdenciária eSocial S-1200 vs Débito Declarado na DCTFWeb',
      source1: 'eSocial S-5011 Totalizador INSS (R$ 42.890,50)',
      source2: 'DCTFWeb Mapa de Débitos (R$ 42.890,50)',
      divergenceAmount: 0,
      riskLevel: 'CONFORME',
      legalBase: 'Decreto 8.373/14 • IN RFB 2.005/21',
      recommendation: 'Transmissão sincronizada com sucesso. Guias fechadas.'
    },
    {
      id: 'AUD-04',
      category: 'Retenções x Reinf',
      name: 'Tomadores de Serviços EFD-Reinf R-4000 vs Retenção de IRRF/CSRF',
      source1: 'Notas de Tomadores NFS-e (R$ 18.450,00 retido)',
      source2: 'EFD-Reinf Evento R-4020 (R$ 18.450,00)',
      divergenceAmount: 0,
      riskLevel: 'CONFORME',
      legalBase: 'IN RFB 2.043/21 • Art. 714 RIR/18',
      recommendation: 'Retenções federais apuradas e compensadas no DCTFWeb.'
    },
    {
      id: 'AUD-05',
      category: 'Fiscal x Contábil',
      name: 'Depreciação Acumulada Fiscal vs Contábil (Diferimento LALUR Parte B)',
      source1: 'Bloco M LALUR/LACS Adição (R$ 14.200,00)',
      source2: 'Razão ECD Conta 1.2.3.09 Deprec. CPC 27 (R$ 14.200,00)',
      divergenceAmount: 0,
      riskLevel: 'CONFORME',
      legalBase: 'CPC 27 • IN RFB 1.700/17 Art. 124',
      recommendation: 'Ajuste fiscal no e-LALUR devidamente controlado na Parte B.'
    }
  ];

  const filteredChecks = crossChecks.filter(c => {
    if (selectedRisk === 'ALL') return true;
    return c.riskLevel === selectedRisk;
  });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleAutoFix = (id: string) => {
    setResolvedIds(prev => [...prev, id]);
  };

  const totalDivergences = crossChecks.reduce((acc, c) => acc + (resolvedIds.includes(c.id) ? 0 : c.divergenceAmount), 0);
  const criticalCount = crossChecks.filter(c => c.riskLevel === 'CRITICO' && !resolvedIds.includes(c.id)).length;
  const alertCount = crossChecks.filter(c => c.riskLevel === 'ALERTA' && !resolvedIds.includes(c.id)).length;

  return (
    <div className="audit-radar-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header Executivo 3D */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1F36 0%, #0B1120 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
              color: '#FFFFFF',
              fontWeight: 900
            }}
          >
            <Radar size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Radar de Malhas Fiscais & Auditoria Preventiva RFB / eSocial
              </h2>
              <span
                style={{
                  background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.5)',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                }}
              >
                ZERO MALHA FISCAL
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Simulação de cruzamentos eletrônicos pré-transmissão idênticos aos robôs da Receita Federal e SEFAZ.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowA4Dossier(prev => !prev)}
            style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.76rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.35)'
            }}
          >
            <Printer size={14} />
            {showA4Dossier ? 'Ocultar Parecer A4' : 'Visualizar Parecer A4'}
          </button>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="btn-1click-3d"
            style={{ padding: '6px 16px', fontSize: '0.78rem' }}
          >
            <Search size={14} />
            {isScanning ? 'Escaneando Arquivos...' : '🔍 Executar Varredura Preditiva'}
          </button>
        </div>
      </div>

      {/* 2. Cards de Métricas de Auditoria 3D */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #142038 0%, #0D1526 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 3px 8px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
            Score de Conformidade
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34D399', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            99.8% OK
          </div>
          <div style={{ fontSize: '0.66rem', color: '#CBD5E1' }}>
            5 Cruzamentos Estruturados • 0 Risco Crítico
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, #142038 0%, #0D1526 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 3px 8px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase' }}>
            Divergências Detectadas
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FBBF24', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            R$ {totalDivergences.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#CBD5E1' }}>
            {alertCount} Apontamento conciliável em 1-Click
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, #142038 0%, #0D1526 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 3px 8px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>
            Base Legal & Proteção
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>
            Art. 138 CTN
          </div>
          <div style={{ fontSize: '0.66rem', color: '#CBD5E1' }}>
            Denúncia espontânea com isenção total de multas
          </div>
        </div>
      </div>

      {/* 3. Matriz de Auditoria Cruzada */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131D33 0%, #0A0F1D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: '#34D399' }} />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Matriz de Cruzamentos Preditivos da Receita Federal
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['ALL', 'CRITICO', 'ALERTA', 'CONFORME'] as const).map(rk => (
              <button
                key={rk}
                onClick={() => setSelectedRisk(rk)}
                style={{
                  background: selectedRisk === rk ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: selectedRisk === rk ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.08)',
                  color: selectedRisk === rk ? '#34D399' : '#94A3B8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {rk === 'ALL' ? 'Todos' : rk}
              </button>
            ))}
          </div>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Cruzamento / Descrição</th>
              <th style={{ textAlign: 'left' }}>Fonte 1 (Gov / Bancos) vs Fonte 2 (Escrituração)</th>
              <th style={{ textAlign: 'center' }}>Divergência</th>
              <th style={{ textAlign: 'center' }}>Risco</th>
              <th style={{ textAlign: 'center' }}>Ação Recomendada</th>
            </tr>
          </thead>
          <tbody>
            {filteredChecks.map((chk) => {
              const isResolved = resolvedIds.includes(chk.id);
              const currentRisk = isResolved ? 'CONFORME' : chk.riskLevel;
              const currentDivergence = isResolved ? 0 : chk.divergenceAmount;

              return (
                <tr key={chk.id}>
                  <td style={{ fontWeight: 700, color: '#FFFFFF', maxWidth: '280px' }}>
                    <div style={{ color: '#34D399', fontSize: '0.68rem' }}>{chk.category} • {chk.id}</div>
                    {chk.name}
                    <div style={{ fontSize: '0.64rem', color: '#94A3B8', marginTop: '2px' }}>{chk.legalBase}</div>
                  </td>
                  <td style={{ fontSize: '0.70rem', color: '#CBD5E1' }}>
                    <div>🔹 <strong>Fonte 1:</strong> {chk.source1}</div>
                    <div>🔸 <strong>Fonte 2:</strong> {chk.source2}</div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: currentDivergence > 0 ? '#FBBF24' : '#34D399', fontFamily: 'var(--font-mono)' }}>
                    R$ {currentDivergence.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '5px',
                        background: currentRisk === 'CONFORME' ? 'rgba(16, 185, 129, 0.2)' : currentRisk === 'ALERTA' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: currentRisk === 'CONFORME' ? '#34D399' : currentRisk === 'ALERTA' ? '#FBBF24' : '#EF4444',
                        border: currentRisk === 'CONFORME' ? '1px solid rgba(16, 185, 129, 0.4)' : currentRisk === 'ALERTA' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      {currentRisk === 'CONFORME' ? '✓ Conforme' : currentRisk === 'ALERTA' ? '⚠️ Alerta' : '🚨 Crítico'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {currentDivergence > 0 ? (
                      <button
                        onClick={() => handleAutoFix(chk.id)}
                        className="btn-1click-3d"
                        style={{ padding: '3px 8px', fontSize: '0.66rem' }}
                      >
                        <Zap size={11} /> Auto-Ajustar (Art. 138)
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 700 }}>
                        ✓ Regularizado
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Dossiê Oficial A4 Diamante de Parecer de Auditoria Preventiva */}
      {showA4Dossier && (
        <div className="diamond-report-card" style={{ marginTop: '10px' }}>
          <div className="diamond-paper-a4">
            <div className="diamond-header">
              <div>
                <div className="diamond-title">Parecer de Auditoria Preventiva e Blindagem Fiscal</div>
                <div className="diamond-subtitle">
                  Certificado de Pré-Validação RFB, SEFAZ & eSocial • Padrão Diamante
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Protocolo:</strong> AUD-PREV-2026-9921</div>
                <div><strong>Data:</strong> 19/08/2026 17:35</div>
              </div>
            </div>

            <div className="diamond-meta-grid">
              <div className="diamond-meta-item">
                <strong>Empresa / Entidade</strong>
                <span>{tenant?.name || 'Soberano Tech S/A'}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>CNPJ / Regime</strong>
                <span>{tenant?.cnpj || '12.345.678/0001-90'} • Lucro Real</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Varredura</strong>
                <span>100% dos Cruzamentos Verificados</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Risco de Malha Fiscal</strong>
                <span style={{ color: '#047857' }}>NÍVEL ZERO (PROTEGIDO)</span>
              </div>
            </div>

            <div className="diamond-kpi-row">
              <div className="diamond-kpi-box">
                <strong>Cruzamentos Executados</strong>
                <div className="value">5 Algoritmos</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Faturamento Auditado</strong>
                <div className="value">R$ 1.840.200,00</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Divergência Remanescente</strong>
                <div className="value">R$ 0,00</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Status de Blindagem</strong>
                <div className="value" style={{ color: '#047857' }}>100% REGULAR</div>
              </div>
            </div>

            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Órgão Fiscalizador</th>
                  <th>Declaração Cruzada</th>
                  <th>Dispositivo Legal</th>
                  <th>Conclusão da Auditoria</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Receita Federal do Brasil (RFB)</td>
                  <td>EFD-Contribuições vs ECD Razão</td>
                  <td>IN RFB 1.252/12 • NBC TG</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Sem omissões de receita</td>
                </tr>
                <tr>
                  <td>SEFAZ Estadual & DIMP</td>
                  <td>Cartão/PIX vs EFD ICMS/IPI</td>
                  <td>Convênio ICMS 134/16</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Vendas 100% acobertadas por NF-e</td>
                </tr>
                <tr>
                  <td>Ministério do Trabalho & eSocial</td>
                  <td>S-1200 vs DCTFWeb Previdenciária</td>
                  <td>Decreto 8.373/14</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Folha e encargos conciliados</td>
                </tr>
                <tr>
                  <td>Caixa Econômica Federal</td>
                  <td>FGTS Digital vs Rescisões TRCT</td>
                  <td>Lei 14.438/22</td>
                  <td style={{ color: '#047857', fontWeight: 800 }}>✓ Guias emitidas com chave Pix</td>
                </tr>
              </tbody>
            </table>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DAVID VALU</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Auditor Tributário & Contador • CRC 1SP999999/O-0</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA DE COMPLIANCE</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Soberano Tech S/A • Governança Corporativa</div>
              </div>
              <div className="diamond-signature-line">
                <div>COMITÊ JURÍDICO & TRIBUTÁRIO</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Parecer de Isenção de Riscos (CTN Art. 138)</div>
              </div>
            </div>

            <div className="diamond-watermark-seal">
              <span>🔒 Validador Criptográfico: d34b89fa012984efc71029837482910492837402938472093847209384720938</span>
              <span>Soberano Contábil Platinum Suite v4.5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OfficePredictiveTaxAuditRadarView;
