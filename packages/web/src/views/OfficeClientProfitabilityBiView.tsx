import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Calculator,
  ArrowRight,
  PieChart,
  Download
} from 'lucide-react';

export const OfficeClientProfitabilityBiView: React.FC = () => {
  const [targetMargin, setTargetMargin] = useState<number>(50); // %
  const [inflationIndex, setInflationIndex] = useState<string>('IPCA'); // 'IPCA' | 'IGP-M'
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(4.8); // %
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');

  const clientsData = [
    { id: 'C1', name: 'SOBERANO TECH S/A', regime: 'Lucro Real', currentFee: 6500.00, hoursSpent: 42, hourlyCost: 55.00, totalCost: 2310.00, marginPct: 64.5, curve: 'A', status: 'ALTA_RENTABILIDADE' },
    { id: 'C2', name: 'DROGARIA ALVORADA LTDA', regime: 'Simples Nacional (Monofásico)', currentFee: 2800.00, hoursSpent: 28, hourlyCost: 55.00, totalCost: 1540.00, marginPct: 45.0, curve: 'B', status: 'RENTABILIDADE_MEDIA' },
    { id: 'C3', name: 'DISTRIBUIDORA FARMACÊUTICA BRASIL', regime: 'Lucro Presumido', currentFee: 4200.00, hoursSpent: 35, hourlyCost: 55.00, totalCost: 1925.00, marginPct: 54.2, curve: 'A', status: 'ALTA_RENTABILIDADE' },
    { id: 'C4', name: 'CONSTRUTORA & ENGENHARIA DELTA', regime: 'Lucro Real (Obra)', currentFee: 3200.00, hoursSpent: 58, hourlyCost: 55.00, totalCost: 3190.00, marginPct: 0.3, curve: 'C', status: 'DEFICITARIO' },
    { id: 'C5', name: 'LOGÍSTICA & TRANSPORTES VELOX', regime: 'Lucro Presumido', currentFee: 3900.00, hoursSpent: 32, hourlyCost: 55.00, totalCost: 1760.00, marginPct: 54.8, curve: 'B', status: 'ALTA_RENTABILIDADE' }
  ];

  const filteredClients = clientsData.filter(c => {
    if (selectedClientFilter === 'ALL') return true;
    if (selectedClientFilter === 'DEFICITARIO') return c.marginPct < 20;
    if (selectedClientFilter === 'ALTA') return c.marginPct >= 50;
    return true;
  });

  const totalMrr = clientsData.reduce((acc, c) => acc + c.currentFee, 0);
  const totalCost = clientsData.reduce((acc, c) => acc + c.totalCost, 0);
  const overallMargin = Math.round(((totalMrr - totalCost) / totalMrr) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond 3D */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)', border: '1.5px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}>
            📈
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                BI de Rentabilidade da Carteira & Sugestor de Reajustes
              </h1>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                CURVA ABC DINÂMICA
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Análise de custo homem/hora da equipe vs honorário cobrado com sugestão automática de reajuste contratual por inflação e complexidade.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34D399', padding: '6px 14px', borderRadius: '8px', fontSize: '0.80rem', fontWeight: 900 }}>
            MARGEM LÍQUIDA GLOBAL: {overallMargin}%
          </span>
        </div>
      </div>

      {/* 4 Cards de Métricas da Carteira */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3.5px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Faturamento Recorrente (MRR)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)', margin: '6px 0 2px 0' }}>
            R$ {totalMrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Honorários mensais da carteira ativa</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(239, 68, 68, 0.35)', borderBottom: '3.5px solid #DC2626', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Custo Total de Processamento</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', fontFamily: 'var(--font-mono)', margin: '6px 0 2px 0' }}>
            R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#64748B' }}>195 horas de analistas alocadas</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3.5px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Lucro Operacional Líquido</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)', margin: '6px 0 2px 0' }}>
            R$ {(totalMrr - totalCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: 700 }}>Retorno líquido sobre a folha interna</div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3.5px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Contratos em Alerta de Déficit</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24', fontFamily: 'var(--font-mono)', margin: '6px 0 2px 0' }}>
            1 Empresa
          </div>
          <div style={{ fontSize: '0.66rem', color: '#F87171', fontWeight: 700 }}>Margem inferior a 10% (Reajuste Urgente)</div>
        </div>
      </div>

      {/* Simulador de Reajuste Contratual & IPCA */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calculator size={18} color="#38BDF8" />
          <span style={{ fontSize: '0.90rem', fontWeight: 900, color: '#FFFFFF' }}>
            Simulador Inteligente de Reajuste Anual & Reprecificação
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Índice de Inflação Oficial
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['IPCA (IBGE)', 'IGP-M (FGV)', 'INPC'].map(idx => (
                <button
                  key={idx}
                  onClick={() => setInflationIndex(idx)}
                  style={{
                    flex: 1,
                    background: inflationIndex === idx ? 'rgba(56, 189, 248, 0.25)' : '#080D1A',
                    border: inflationIndex === idx ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                    color: inflationIndex === idx ? '#38BDF8' : '#94A3B8',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {idx}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Taxa Acumulada nos Últimos 12 Meses ({annualInflationRate}%)
            </label>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.1"
              value={annualInflationRate}
              onChange={(e) => setAnnualInflationRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => alert(`Cartas de reajuste contratual de ${annualInflationRate}% geradas para todos os clientes elegíveis!`)}
              className="btn-primary-action"
            >
              <Sparkles size={14} /> <span>Emitir Minutas de Reajuste em 1-Click</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Rentabilidade por Cliente */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
          border: '1.5px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(180deg, #182542 0%, #0E1628 100%)', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0' }}>
              <th style={{ padding: '14px 16px', width: '28%' }}>Cliente / Regime Tributário</th>
              <th style={{ padding: '14px 10px', width: '12%' }}>Curva ABC</th>
              <th style={{ padding: '14px 10px', width: '15%' }}>Honorário Atual</th>
              <th style={{ padding: '14px 10px', width: '12%' }}>Horas Gastas</th>
              <th style={{ padding: '14px 10px', width: '15%' }}>Custo Real</th>
              <th style={{ padding: '14px 10px', width: '12%' }}>Margem %</th>
              <th style={{ padding: '14px 16px', width: '16%', textAlign: 'center' }}>Novo Honorário ({annualInflationRate}%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c, idx) => {
              const suggestedFee = c.currentFee * (1 + (annualInflationRate / 100));
              return (
                <tr
                  key={c.id}
                  style={{
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'rgba(15, 23, 42, 0.35)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{c.name}</div>
                    <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>{c.regime}</div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: c.curve === 'A' ? 'rgba(16, 185, 129, 0.2)' : c.curve === 'B' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: c.curve === 'A' ? '#34D399' : c.curve === 'B' ? '#38BDF8' : '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 900 }}>
                      CLASSE {c.curve}
                    </span>
                  </td>

                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FFFFFF' }}>
                    R$ {c.currentFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td style={{ padding: '12px 10px', color: '#CBD5E1' }}>
                    {c.hoursSpent} horas /mês
                  </td>

                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', color: '#EF4444' }}>
                    R$ {c.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ color: c.marginPct >= 50 ? '#34D399' : c.marginPct >= 20 ? '#FBBF24' : '#EF4444', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                      {c.marginPct}%
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.35)', color: '#34D399', padding: '4px 8px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
                      R$ {suggestedFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export default OfficeClientProfitabilityBiView;
