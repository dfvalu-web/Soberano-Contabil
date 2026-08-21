import React, { useState, useEffect } from 'react';
import {
  Scale,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Printer,
  Calendar,
  Building2,
  PieChart,
  Layers,
  ArrowRight,
  Sparkles,
  Calculator
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store';

export const OfficeStrategicTaxRegimeComparisonView: React.FC<{ tenant?: CompanyTenant }> = ({ tenant }) => {
  const [faturamentoAnual, setFaturamentoAnual] = useState<number>(24000000); // R$ 24 Mi
  const [margemLucro, setMargemLucro] = useState<number>(18); // 18%
  const [folhaAnual, setFolhaAnual] = useState<number>(4800000); // R$ 4.8 Mi
  const [comprasInsumos, setComprasInsumos] = useState<number>(9600000); // R$ 9.6 Mi
  const [showA4Dossier, setShowA4Dossier] = useState<boolean>(false);

  // Cálculos Tributários Comparativos
  // 1. Simples Nacional (se aplicável até 4.8M, além disso extrapolado para fins de comparação)
  const simplesAliquotaEfetiva = faturamentoAnual <= 4800000 ? 14.5 : 22.8;
  const simplesTributoTotal = faturamentoAnual * (simplesAliquotaEfetiva / 100);

  // 2. Lucro Presumido
  // Base Presunção: 8% Comércio/Indústria ou 32% Serviços (média ponderada 12%)
  const presumidoIRPJCSLL = (faturamentoAnual * 0.12) * 0.24 + (Math.max(0, (faturamentoAnual * 0.12) - 240000) * 0.10);
  const presumidoPISCOFINS = faturamentoAnual * 0.0365; // 3.65% Cumulativo
  const presumidoICMSISS = faturamentoAnual * 0.05; // 5% Médio
  const presumidoINSSPatronal = folhaAnual * 0.278; // 20% + RAT + Terceiros
  const presumidoTributoTotal = presumidoIRPJCSLL + presumidoPISCOFINS + presumidoICMSISS + presumidoINSSPatronal;
  const presumidoAliquotaEfetiva = (presumidoTributoTotal / faturamentoAnual) * 100;

  // 3. Lucro Real
  const lucroRealBase = faturamentoAnual * (margemLucro / 100);
  const realIRPJCSLL = lucroRealBase * 0.24 + (Math.max(0, lucroRealBase - 240000) * 0.10);
  const realPISCOFINS_Debito = faturamentoAnual * 0.0925; // 9.25% Não-cumulativo
  const realPISCOFINS_Credito = comprasInsumos * 0.0925;
  const realPISCOFINS_Liquido = Math.max(0, realPISCOFINS_Debito - realPISCOFINS_Credito);
  const realICMSISS = faturamentoAnual * 0.04; // 4% líquido com créditos
  const realINSSPatronal = folhaAnual * 0.278;
  const realTributoTotal = realIRPJCSLL + realPISCOFINS_Liquido + realICMSISS + realINSSPatronal;
  const realAliquotaEfetiva = (realTributoTotal / faturamentoAnual) * 100;

  // 4. Novo Regime Dual (Reforma Tributária IBS / CBS - LC 214/25)
  // Alíquota Plena Estimada: 26.5% com crédito financeiro amplo
  const ivaDualDebito = faturamentoAnual * 0.265;
  const ivaDualCredito = comprasInsumos * 0.265;
  const ivaDualLiquido = Math.max(0, ivaDualDebito - ivaDualCredito);
  const ivaDualIRPJCSLL = realIRPJCSLL;
  const ivaDualINSSPatronal = realINSSPatronal;
  const ivaDualTributoTotal = ivaDualLiquido + ivaDualIRPJCSLL + ivaDualINSSPatronal;
  const ivaDualAliquotaEfetiva = (ivaDualTributoTotal / faturamentoAnual) * 100;

  // Encontrar o regime mais econômico
  const regimes = [
    { name: 'Lucro Presumido', total: presumidoTributoTotal, aliquota: presumidoAliquotaEfetiva, tag: 'REGIME ATUAL' },
    { name: 'Lucro Real (Não-Cumulativo)', total: realTributoTotal, aliquota: realAliquotaEfetiva, tag: 'MAIS ECONÔMICO' },
    { name: 'Novo Regime Dual IBS/CBS (2027-2033)', total: ivaDualTributoTotal, aliquota: ivaDualAliquotaEfetiva, tag: 'REFORMA TRIBUTÁRIA' }
  ];

  const melhorRegime = regimes.reduce((prev, curr) => prev.total < curr.total ? prev : curr);
  const economiaEstimada = presumidoTributoTotal - realTributoTotal;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof setShowDossierModal !== 'undefined') setShowDossierModal(false);
        if (typeof setShowA4Dossier !== 'undefined') setShowA4Dossier(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="tax-regime-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header Executivo 3D */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1938 0%, #0B1120 100%)',
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
              background: 'linear-gradient(135deg, #8B5CF6 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
              color: '#FFFFFF',
              fontWeight: 900
            }}
          >
            <Scale size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Simulador de Planejamento Tributário Comparativo (2026–2033)
              </h2>
              <span
                style={{
                  background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(109, 40, 217, 0.15) 100%)',
                  color: '#C4B5FD',
                  border: '1px solid rgba(167, 139, 250, 0.5)',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
                }}
              >
                EC 132/23 • LC 214/25
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Análise comparativa determinística: Lucro Presumido vs Lucro Real vs Transição do Novo IVA Dual (IBS/CBS).
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
            {showA4Dossier ? 'Ocultar Dossiê A4' : 'Visualizar Dossiê A4'}
          </button>
        </div>
      </div>

      {/* 2. Painel de Variáveis de Simulação (Inputs Interativos) */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131E35 0%, #0D1424 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        <div>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Faturamento Bruto Anual (R$)
          </label>
          <input
            type="number"
            value={faturamentoAnual}
            onChange={(e) => setFaturamentoAnual(Number(e.target.value))}
            style={{
              width: '100%',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#FFFFFF',
              padding: '6px 10px',
              fontSize: '0.80rem',
              fontWeight: 800,
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Margem Líquida Real Estimada (%)
          </label>
          <input
            type="number"
            value={margemLucro}
            onChange={(e) => setMargemLucro(Number(e.target.value))}
            style={{
              width: '100%',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#34D399',
              padding: '6px 10px',
              fontSize: '0.80rem',
              fontWeight: 800,
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Folha de Pagamento Anual CLT (R$)
          </label>
          <input
            type="number"
            value={folhaAnual}
            onChange={(e) => setFolhaAnual(Number(e.target.value))}
            style={{
              width: '100%',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#FFFFFF',
              padding: '6px 10px',
              fontSize: '0.80rem',
              fontWeight: 800,
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Compras de Insumos com Crédito (R$)
          </label>
          <input
            type="number"
            value={comprasInsumos}
            onChange={(e) => setComprasInsumos(Number(e.target.value))}
            style={{
              width: '100%',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#38BDF8',
              padding: '6px 10px',
              fontSize: '0.80rem',
              fontWeight: 800,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* 3. Cards Comparativos dos 3 Regimes 3D */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {regimes.map((rg) => {
          const isBest = rg.name === melhorRegime.name;

          return (
            <div
              key={rg.name}
              style={{
                background: isBest
                  ? 'linear-gradient(180deg, #1C2B48 0%, #0F1B2E 100%)'
                  : 'linear-gradient(180deg, #141E33 0%, #0C1220 100%)',
                border: isBest
                  ? '1.5px solid #34D399'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                borderBottom: isBest ? '2px solid #059669' : '2px solid rgba(0, 0, 0, 0.4)',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: isBest
                  ? '0 0 20px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 3px 8px rgba(0, 0, 0, 0.45)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {rg.name}
                </span>
                <span
                  style={{
                    fontSize: '0.60rem',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isBest ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isBest ? '#34D399' : '#94A3B8',
                    border: isBest ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {rg.tag}
                </span>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isBest ? '#34D399' : '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                R$ {rg.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                Alíquota Efetiva Global: <strong style={{ color: isBest ? '#34D399' : '#CBD5E1' }}>{rg.aliquota.toFixed(2)}%</strong>
              </div>

              {isBest && economiaEstimada > 0 && (
                <div style={{ marginTop: '10px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.70rem', color: '#34D399', fontWeight: 700 }}>
                  💡 Economia Anual Projetada: <strong>R$ {economiaEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Cronograma de Transição 2026-2033 (Reforma Tributária) */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131D33 0%, #0A0F1D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calendar size={18} style={{ color: '#34D399' }} />
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Cronograma Oficial de Transição do Novo IVA Dual (EC 132/23 & LC 214/25)
          </h3>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Exercício</th>
              <th style={{ textAlign: 'left' }}>Mecanismo Tributário / Alíquota</th>
              <th style={{ textAlign: 'left' }}>Status dos Tributos Antigos</th>
              <th style={{ textAlign: 'center' }}>Impacto Operacional</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 800, color: '#34D399' }}>2026</td>
              <td>Início do Teste: CBS 0,9% + IBS 0,1% (Compensável com PIS/COFINS)</td>
              <td>PIS, COFINS, IPI, ICMS e ISS vigentes a 100%</td>
              <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.70rem' }}>Adaptação de Sistemas DFe</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 800, color: '#38BDF8' }}>2027</td>
              <td>Vigência Plena da CBS Federal (8.8%) + Imposto Seletivo (IS)</td>
              <td style={{ color: '#DC2626', fontWeight: 700 }}>EXTINÇÃO DEFINITIVA DE PIS E COFINS</td>
              <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.70rem' }}>Crédito Financeiro Pleno</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 800, color: '#FBBF24' }}>2029–2032</td>
              <td>Entrada Gradual do IBS Estadual/Municipal (Redução 10% a.a. ICMS/ISS)</td>
              <td>ICMS e ISS reduzidos em 1/10 ao ano</td>
              <td style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.70rem' }}>Transição Federativa Mista</td>
            </tr>
            <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <td style={{ textAlign: 'center', fontWeight: 900, color: '#34D399' }}>2033</td>
              <td><strong>Vigência 100% do Novo Sistema Tributário Nacional (IBS + CBS)</strong></td>
              <td style={{ color: '#047857', fontWeight: 900 }}>EXTINÇÃO DE ICMS, ISS E IPI</td>
              <td style={{ textAlign: 'center', color: '#34D399', fontWeight: 800, fontSize: '0.70rem' }}>Não-Cumulatividade Plena</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. Dossiê Oficial A4 Diamante de Planejamento Tributário */}
      {showA4Dossier && (
        <div className="diamond-report-card" style={{ marginTop: '10px' }}>
          <div className="diamond-paper-a4">
            <div className="diamond-header">
              <div>
                <div className="diamond-title">Parecer Executivo de Planejamento Tributário</div>
                <div className="diamond-subtitle">
                  Diagnóstico Comparativo de Regimes & Projeção Reforma Tributária 2026–2033
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Protocolo:</strong> PLAN-TRIB-2026-8812</div>
                <div><strong>Data:</strong> 19/08/2026 17:45</div>
              </div>
            </div>

            <div className="diamond-meta-grid">
              <div className="diamond-meta-item">
                <strong>Empresa / Entidade</strong>
                <span>{tenant?.name || 'Soberano Tech S/A'}</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Faturamento Simulado</strong>
                <span>R$ {faturamentoAnual.toLocaleString('pt-BR')} / ano</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Regime Recomendado</strong>
                <span style={{ color: '#047857' }}>LUCRO REAL (NÃO-CUMULATIVO)</span>
              </div>
              <div className="diamond-meta-item">
                <strong>Economia Anual Projetada</strong>
                <span style={{ color: '#047857', fontWeight: 900 }}>R$ {economiaEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="diamond-kpi-row">
              <div className="diamond-kpi-box">
                <strong>Alíquota Lucro Presumido</strong>
                <div className="value">{presumidoAliquotaEfetiva.toFixed(2)}%</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Alíquota Lucro Real</strong>
                <div className="value" style={{ color: '#047857' }}>{realAliquotaEfetiva.toFixed(2)}%</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Alíquota Reforma IBS/CBS</strong>
                <div className="value">{ivaDualAliquotaEfetiva.toFixed(2)}%</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Ganho de Competitividade</strong>
                <div className="value" style={{ color: '#047857' }}>+{(presumidoAliquotaEfetiva - realAliquotaEfetiva).toFixed(2)}% Margem</div>
              </div>
            </div>

            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Tributo / Contribuição</th>
                  <th style={{ textAlign: 'right' }}>Lucro Presumido (R$)</th>
                  <th style={{ textAlign: 'right' }}>Lucro Real (R$)</th>
                  <th style={{ textAlign: 'right' }}>Reforma IBS/CBS (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>IRPJ + Adicional + CSLL</td>
                  <td style={{ textAlign: 'right' }}>{presumidoIRPJCSLL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#047857' }}>{realIRPJCSLL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{ivaDualIRPJCSLL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>PIS / COFINS (ou CBS Federal)</td>
                  <td style={{ textAlign: 'right' }}>{presumidoPISCOFINS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#047857' }}>{realPISCOFINS_Liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{(ivaDualLiquido * 0.33).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>ICMS / ISS (ou IBS Subnacional)</td>
                  <td style={{ textAlign: 'right' }}>{presumidoICMSISS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#047857' }}>{realICMSISS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{(ivaDualLiquido * 0.67).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td>INSS Patronal & Encargos Folha</td>
                  <td style={{ textAlign: 'right' }}>{presumidoINSSPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{realINSSPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{ivaDualINSSPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="diamond-table-total">
                  <td><strong>CARGA TRIBUTÁRIA TOTAL ANUAL</strong></td>
                  <td style={{ textAlign: 'right', color: '#DC2626' }}><strong>R$ {presumidoTributoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
                  <td style={{ textAlign: 'right', color: '#047857' }}><strong>R$ {realTributoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>R$ {ivaDualTributoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
                </tr>
              </tbody>
            </table>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DAVID VALU</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Consultor Tributário & Contador • CRC 1SP999999/O-0</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA FINANCEIRA (CFO)</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Soberano Tech S/A • Decisão Estratégica</div>
              </div>
              <div className="diamond-signature-line">
                <div>COMITÊ DE PLANEJAMENTO FISCAL</div>
                <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Parecer Técnico de Transição 2026–2033</div>
              </div>
            </div>

            <div className="diamond-watermark-seal">
              <span>🔒 Parecer Técnico Criptografado • SHA-256: 7f8a91bc023948e77a1029384729104928374029384720938472093847209384</span>
              <span>Soberano Contábil Platinum Suite v4.5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OfficeStrategicTaxRegimeComparisonView;
