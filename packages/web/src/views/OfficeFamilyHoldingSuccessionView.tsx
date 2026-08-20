import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  FileText,
  Download,
  Printer,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';

export const OfficeFamilyHoldingSuccessionView: React.FC = () => {
  const [patrimonioTotal, setPatrimonioTotal] = useState<number>(15000000); // R$ 15MM
  const [showMinutaModal, setShowMinutaModal] = useState<boolean>(false);

  // Cálculos comparativos: Inventário Tradicional vs Holding Familiar
  const custoInventarioItcmd = patrimonioTotal * 0.08; // 8% Max ITCMD
  const custoInventarioAdvogado = patrimonioTotal * 0.07; // 7% OAB
  const custoInventarioCartorio = patrimonioTotal * 0.02; // 2% Custas
  const totalCustoInventario = custoInventarioItcmd + custoInventarioAdvogado + custoInventarioCartorio;

  const custoHoldingItcmd = (patrimonioTotal * 0.3) * 0.04; // Integralização pelo valor histórico (IRPF Art. 23)
  const custoHoldingHonorarios = 65000.00;
  const custoHoldingJuntaCartorio = 15000.00;
  const totalCustoHolding = custoHoldingItcmd + custoHoldingHonorarios + custoHoldingJuntaCartorio;
  const economiaTotal = totalCustoInventario - totalCustoHolding;
  const economiaPct = Math.round((economiaTotal / totalCustoInventario) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond 3D */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%)', border: '1.5px solid #FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)' }}>
            🏰
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Holding Familiar & Planejamento Sucessório
              </h1>
              <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                ART. 23 LEI 9.249/95
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Simulador comparativo Inventário Judicial vs Holding Patrimonial com geração da minuta completa do Contrato Social.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowMinutaModal(true)}
            className="btn-primary-action"
          >
            <FileText size={14} /> <span>Visualizar Minuta Contratual da Holding</span>
          </button>
        </div>
      </div>

      {/* Slider Interativo do Patrimônio Familiar */}
      <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderRadius: '14px', padding: '20px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#E2E8F0' }}>Valor Total do Patrimônio da Família (Imóveis + Participações):</span>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '4px 14px', borderRadius: '8px' }}>
            <strong style={{ fontSize: '1.2rem', color: '#FBBF24', fontFamily: 'var(--font-mono)' }}>
              R$ {patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>
        <input
          type="range"
          min="1000000"
          max="50000000"
          step="500000"
          value={patrimonioTotal}
          onChange={(e) => setPatrimonioTotal(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
        />
      </div>

      {/* Comparativo de Custos Lado a Lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        {/* Inventário Tradicional (Custo Elevado) */}
        <div style={{ background: 'linear-gradient(180deg, #181928 0%, #0E0F1A 100%)', border: '1.5px solid rgba(239, 68, 68, 0.4)', borderBottom: '3.5px solid #DC2626', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#EF4444', margin: 0 }}>
              Inventário Tradicional (Judicial / Extrajudicial)
            </h3>
            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 900 }}>
              ALTO CUSTO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>ITCMD Estadual (Até 8% com EC 132/23):</span>
              <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoInventarioItcmd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Honorários Advocatícios (Tabela OAB ~7%):</span>
              <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoInventarioAdvogado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Custas Processuais & Escritura Pública (~2%):</span>
              <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoInventarioCartorio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: '#FFFFFF' }}>Custo Total Estimado:</span>
              <strong style={{ fontSize: '1.25rem', color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
                R$ {totalCustoInventario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

        {/* Holding Familiar (Planejamento Blindado) */}
        <div style={{ background: 'linear-gradient(180deg, #13242E 0%, #09141C 100%)', border: '1.5px solid rgba(52, 211, 153, 0.45)', borderBottom: '3.5px solid #059669', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34D399', margin: 0 }}>
              Holding Familiar & Doação de Quotas com Usufruto
            </h3>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 900 }}>
              ECONOMIA DE {economiaPct}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>ITCMD na Doação com Usufruto (Base Histórica):</span>
              <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoHoldingItcmd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Honorários Contábeis/Jurídicos Especializados:</span>
              <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoHoldingHonorarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Taxas de Junta Comercial & Registro de Imóveis:</span>
              <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>R$ {custoHoldingJuntaCartorio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: '#FFFFFF' }}>Custo Total na Holding:</span>
              <strong style={{ fontSize: '1.25rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                R$ {totalCustoHolding.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Minuta Contratual da Holding */}
      {showMinutaModal && (
        <div style={{ background: '#0F172A', border: '1.5px solid #38BDF8', borderRadius: '14px', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Minuta do Contrato Social da Holding Patrimonial (Padrão Diamante)
            </h3>
            <button onClick={() => setShowMinutaModal(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ background: '#080D1A', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.76rem', color: '#E2E8F0', lineHeight: 1.6, maxHeight: '300px', overflowY: 'auto' }}>
            <p><strong>CLÁUSULA PRIMEIRA - DA DENOMINAÇÃO E SEDE:</strong> A sociedade gira sob a denominação social de <em>SOBERANO PATRIMONIAL HOLDING FAMILIAR LTDA</em>, com sede na Capital do Estado de São Paulo.</p>
            <p><strong>CLÁUSULA SEGUNDA - DO OBJETO SOCIAL:</strong> A sociedade tem por objeto a administração de bens próprios, compra, venda e locação de imóveis e participação no capital de outras sociedades (Holding Pura e Mista).</p>
            <p><strong>CLÁUSULA TERCEIRA - DAS CLÁUSULAS DE PROTEÇÃO PATRIMONIAL:</strong> Todas as quotas doadas aos herdeiros gravam-se com as cláusulas expressas de <strong>INCOMUNICABILIDADE, IMPENHORABILIDADE, INALIENABILIDADE e REVERSÃO</strong>, garantindo aos doadores o <strong>USUFRUTO VITALÍCIO com direito a 100% dos votos e dividendos</strong>.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => window.print()} className="btn-primary-action">
              <Printer size={14} /> <span>Imprimir Minuta Completa A4</span>
            </button>
          </div>
        </div>
      )}

    
      {/* ========================================================================= */}
      {/* DOSSIÊ A4 DE HOLDING FAMILIAR & SUCESSÃO (PADRÃO DIAMANTE)                */}
      {/* ========================================================================= */}
      <div className="diamond-paper-a4" style={{ marginTop: '24px' }}>
        <div className="diamond-report-header">
          <div className="diamond-report-title">
            <h1>ESTUDO DE VIABILIDADE: HOLDING FAMILIAR & PLANEJAMENTO SUCESSÓRIO</h1>
            <h2>ART. 23 DA LEI 9.249/95 • EC 132/23 • USUFRUTO VITALÍCIO & BLINDAGEM PATRIMONIAL</h2>
          </div>
          <div className="diamond-logo-box">
            <span>🏰 SOBERANO</span>
            <small>HOLDING SUITE</small>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Grupo Familiar</strong>
            <span>FAMÍLIA SOBERANO PATRIMONIAL</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Patrimônio Total Avaliado</strong>
            <span className="font-mono">R$ {patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Economia Tributária Líquida</strong>
            <span style={{ color: '#047857', fontWeight: 900 }}>R$ {economiaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({economiaPct}%)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Regime Sucessório</strong>
            <span>Doação de Quotas com Reserva de Usufruto 100%</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Dimensão de Custo</th>
              <th>Inventário Tradicional (Judicial)</th>
              <th>Holding Familiar Planejada</th>
              <th>Economia para a Família</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Imposto sobre Transmissão (ITCMD)</td>
              <td style={{ color: '#DC2626', fontWeight: 800 }}>R$ {custoInventarioItcmd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>R$ {custoHoldingItcmd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 900 }}>- R$ {(custoInventarioItcmd - custoHoldingItcmd).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Honorários Advocatícios & Avaliações</td>
              <td style={{ color: '#DC2626', fontWeight: 800 }}>R$ {custoInventarioAdvogado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>R$ {custoHoldingHonorarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 900 }}>- R$ {(custoInventarioAdvogado - custoHoldingHonorarios).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Custas de Cartório & Junta Comercial</td>
              <td style={{ color: '#DC2626', fontWeight: 800 }}>R$ {custoInventarioCartorio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 800 }}>R$ {custoHoldingJuntaCartorio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 900 }}>- R$ {(custoInventarioCartorio - custoHoldingJuntaCartorio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="diamond-table-total">
              <td><strong>CUSTO TOTAL FINAL</strong></td>
              <td style={{ color: '#DC2626', fontWeight: 900 }}>R$ {totalCustoInventario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 900 }}>R$ {totalCustoHolding.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#047857', fontWeight: 900 }}>ECONOMIA DE {economiaPct}%</td>
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
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Consultora em Direito Societário & Sucessório</div>
          </div>
          <div className="diamond-signature-line">
            <div>PATRIARCA / MATRIARCA</div>
            <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Doador & Usufrutuário Vitalício</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <span>🔒 Parecer Técnico Registrado • Hash SHA-256: 7f819028cb91823901823901283901823901823901823091283091283091283</span>
          <span>Soberano Contábil Platinum Suite v4.5</span>
        </div>
      </div>

    </div>
  );
};
export default OfficeFamilyHoldingSuccessionView;
