import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Printer,
  Calendar,
  DollarSign,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { officeStore, PeriodFilterState, DEFAULT_PERIOD_FILTER } from '../state/office-store.js';
import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';

export const OfficeExecutiveBoardManagementReportsView: React.FC = () => {
  const [period, setPeriod] = useState<PeriodFilterState>(() => officeStore.getPeriodFilter());
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsub = officeStore.subscribePeriodFilter((newPeriod) => {
      setPeriod(newPeriod);
    });
    return unsub;
  }, []);

  const multiplier = period.mode === 'QUARTER' ? 3 : period.mode === 'SEMESTER' ? 6 : period.mode === 'YEAR' ? 12 : 1;
  const baseReceita = 420000.00 * multiplier;
  const baseCusto = 231000.00 * multiplier;
  const lucroBruto = baseReceita - baseCusto;
  const ebitda = 94500.00 * multiplier;
  const lucroLiquido = 72400.00 * multiplier;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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

      {/* Header Executivo 3D 4K com Seletor Temporal Embutido */}
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
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Relatórios Gerenciais & Contabilidade Consultiva (Diretoria)
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
                ADVISORY & CFO VIRTUAL
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Período Ativo: <strong style={{ color: '#38BDF8' }}>{period.label}</strong> ({period.startDate} a {period.endDate}) • DRE Gerencial, EBITDA e Margem de Contribuição.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <SmartPeriodPicker compact={true} />

          <button
            onClick={() => setShowDossierModal(true)}
            className="btn-1click-3d"
          >
            <Printer size={14} /> <span>Visualizar Relatório Executivo A4</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Performance Financeira com Valores Dinâmicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Receita Líquida ({period.label})</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38BDF8', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {baseReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 700 }}>▲ +14.2% vs período anterior</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Lucro Bruto Operacional</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34D399', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Margem Bruta: 45.0%</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(192, 132, 252, 0.35)', borderBottom: '3px solid #7C3AED', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>EBITDA (Geração de Caixa)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#C084FC', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {ebitda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#C084FC', fontWeight: 700 }}>Margem EBITDA: 22.5%</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Lucro Líquido Final</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FBBF24', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
            {lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Margem Líquida: 17.2%</div>
        </div>
      </div>

      {/* Tabela de Demonstração DRE */}
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
            Demonstração do Resultado do Exercício (DRE) • {period.label}
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
            Competência: {period.startDate} até {period.endDate}
          </span>
        </div>

        <table className="diamond-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Conta / Grupo DRE</th>
              <th style={{ textAlign: 'right' }}>Valor ({period.label})</th>
              <th style={{ textAlign: 'right' }}>Análise Vertical (%)</th>
              <th style={{ textAlign: 'center' }}>Classificação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 800, color: '#FFFFFF' }}>(=) RECEITA OPERACIONAL BRUTA</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#38BDF8' }}>{(baseReceita * 1.12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', color: '#CBD5E1' }}>100.0%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>Faturamento</span></td>
            </tr>
            <tr>
              <td style={{ color: '#F87171' }}>(-) Deduções da Receita Bruta (Impostos s/ Venda)</td>
              <td style={{ textAlign: 'right', color: '#F87171' }}>- {(baseReceita * 0.12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', color: '#CBD5E1' }}>-12.0%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>Tributos</span></td>
            </tr>
            <tr style={{ background: 'rgba(56, 189, 248, 0.05)' }}>
              <td style={{ fontWeight: 800, color: '#38BDF8' }}>(=) RECEITA OPERACIONAL LÍQUIDA</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#38BDF8' }}>{baseReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#38BDF8' }}>100.0%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>Base 100%</span></td>
            </tr>
            <tr>
              <td style={{ color: '#F87171' }}>(-) Custos dos Produtos / Serviços Vendidos (CPV/CSP)</td>
              <td style={{ textAlign: 'right', color: '#F87171' }}>- {baseCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', color: '#CBD5E1' }}>-55.0%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>Custos Diretos</span></td>
            </tr>
            <tr style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
              <td style={{ fontWeight: 800, color: '#34D399' }}>(=) LUCRO BRUTO</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>45.0%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>Resultado Bruto</span></td>
            </tr>
            <tr style={{ background: 'rgba(192, 132, 252, 0.08)' }}>
              <td style={{ fontWeight: 900, color: '#C084FC' }}>(=) EBITDA / LAJIDA (Geração Operacional de Caixa)</td>
              <td style={{ textAlign: 'right', fontWeight: 900, color: '#C084FC' }}>{ebitda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', fontWeight: 900, color: '#C084FC' }}>22.5%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.2)', color: '#C084FC' }}>EBITDA</span></td>
            </tr>
            <tr style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
              <td style={{ fontWeight: 900, color: '#FBBF24' }}>(=) LUCRO LÍQUIDO DO PERÍODO</td>
              <td style={{ textAlign: 'right', fontWeight: 900, color: '#FBBF24' }}>{lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={{ textAlign: 'right', fontWeight: 900, color: '#FBBF24' }}>17.2%</td>
              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}>Lucro Final</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Fullscreen Dossiê Executivo A4 */}
      {showDossierModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          background: 'rgba(5, 10, 20, 0.88)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            background: '#111827',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>💎</span>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                RELATÓRIO GERENCIAL EXECUTIVO • {period.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  border: '1px solid #34D399',
                  color: '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={14} /> <span>Imprimir / Salvar PDF</span>
              </button>
              <button
                onClick={() => setShowDossierModal(false)}
                style={{
                  background: '#1F2937',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#94A3B8',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ✕ Fechar
              </button>
            </div>
          </div>

          <div className="diamond-paper-a4" style={{ width: '100%', maxWidth: '900px', marginBottom: '30px' }}>
            <div className="diamond-header">
              <div>
                <div className="diamond-title">RELATÓRIO EXECUTIVO DE GESTÃO & RESULTADOS</div>
                <div className="diamond-subtitle">Demonstração do Resultado do Exercício & Análise de Margens • Padrão Diamante</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
                <div><strong>Competência / Período:</strong> {period.label}</div>
                <div><strong>Intervalo:</strong> {period.startDate} até {period.endDate}</div>
                <div><strong>Regime:</strong> {period.mode}</div>
              </div>
            </div>

            <div className="diamond-kpi-row">
              <div className="diamond-kpi-box">
                <strong>Receita Líquida</strong>
                <div className="value">{baseReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>Lucro Bruto</strong>
                <div className="value">{lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
              <div className="diamond-kpi-box">
                <strong>EBITDA Operacional</strong>
                <div className="value">{ebitda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
            </div>

            <div className="diamond-signatures">
              <div className="diamond-signature-line">
                <div>DIRETORIA DE CONTROLADORIA</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>CRC Ativo • Período {period.label}</div>
              </div>
              <div className="diamond-signature-line">
                <div>DIRETORIA EXECUTIVA / CFO</div>
                <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Aprovação de Resultados</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeExecutiveBoardManagementReportsView;
