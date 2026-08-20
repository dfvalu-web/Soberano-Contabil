import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ChevronDown,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { officeStore, PeriodFilterState, PeriodFilterMode, DEFAULT_PERIOD_FILTER } from '../state/office-store.js';

interface SmartPeriodPickerProps {
  compact?: boolean;
  onPeriodChange?: (period: PeriodFilterState) => void;
}

export const SmartPeriodPicker: React.FC<SmartPeriodPickerProps> = ({ compact = false, onPeriodChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [periodState, setPeriodState] = useState<PeriodFilterState>(() => officeStore.getPeriodFilter());
  const [activeTab, setActiveTab] = useState<PeriodFilterMode>(periodState.mode);

  // Form local
  const [selectedYear, setSelectedYear] = useState<number>(periodState.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(periodState.month || 8);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(periodState.quarter || 3);
  const [selectedSemester, setSelectedSemester] = useState<number>(periodState.semester || 2);
  const [customStart, setCustomStart] = useState<string>(periodState.startDate);
  const [customEnd, setCustomEnd] = useState<string>(periodState.endDate);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = officeStore.subscribePeriodFilter((newFilter) => {
      setPeriodState(newFilter);
      if (onPeriodChange) onPeriodChange(newFilter);
    });
    return unsubscribe;
  }, [onPeriodChange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const applyPeriod = (mode: PeriodFilterMode, customParams?: Partial<PeriodFilterState>) => {
    let newFilter: PeriodFilterState;

    if (mode === 'MONTH') {
      const m = customParams?.month || selectedMonth;
      const y = customParams?.year || selectedYear;
      const lastDay = new Date(y, m, 0).getDate();
      const mStr = String(m).padStart(2, '0');
      newFilter = {
        mode: 'MONTH',
        year: y,
        month: m,
        startDate: `${y}-${mStr}-01`,
        endDate: `${y}-${mStr}-${lastDay}`,
        label: `${monthNames[m - 1]} / ${y}`
      };
    } else if (mode === 'QUARTER') {
      const q = customParams?.quarter || selectedQuarter;
      const y = customParams?.year || selectedYear;
      const startM = (q - 1) * 3 + 1;
      const endM = q * 3;
      const lastDay = new Date(y, endM, 0).getDate();
      const sMStr = String(startM).padStart(2, '0');
      const eMStr = String(endM).padStart(2, '0');
      newFilter = {
        mode: 'QUARTER',
        year: y,
        quarter: q,
        startDate: `${y}-${sMStr}-01`,
        endDate: `${y}-${eMStr}-${lastDay}`,
        label: `${q}º Trimestre / ${y} (${monthNames[startM - 1].slice(0, 3)} a ${monthNames[endM - 1].slice(0, 3)})`
      };
    } else if (mode === 'SEMESTER') {
      const s = customParams?.semester || selectedSemester;
      const y = customParams?.year || selectedYear;
      const startM = s === 1 ? 1 : 7;
      const endM = s === 1 ? 6 : 12;
      const lastDay = new Date(y, endM, 0).getDate();
      const sMStr = String(startM).padStart(2, '0');
      const eMStr = String(endM).padStart(2, '0');
      newFilter = {
        mode: 'SEMESTER',
        year: y,
        semester: s,
        startDate: `${y}-${sMStr}-01`,
        endDate: `${y}-${eMStr}-${lastDay}`,
        label: `${s}º Semestre / ${y} (${monthNames[startM - 1].slice(0, 3)} a ${monthNames[endM - 1].slice(0, 3)})`
      };
    } else if (mode === 'YEAR') {
      const y = customParams?.year || selectedYear;
      newFilter = {
        mode: 'YEAR',
        year: y,
        startDate: `${y}-01-01`,
        endDate: `${y}-12-31`,
        label: `Exercício Anual ${y}`
      };
    } else if (mode === 'YTD') {
      const y = customParams?.year || selectedYear;
      newFilter = {
        mode: 'YTD',
        year: y,
        startDate: `${y}-01-01`,
        endDate: `${y}-08-20`,
        label: `Acumulado YTD ${y} (01/01 a 20/08)`
      };
    } else {
      // CUSTOM
      const sDate = customParams?.startDate || customStart;
      const eDate = customParams?.endDate || customEnd;
      newFilter = {
        mode: 'CUSTOM',
        year: selectedYear,
        startDate: sDate,
        endDate: eDate,
        label: `Personalizado: ${sDate.split('-').reverse().join('/')} a ${eDate.split('-').reverse().join('/')}`
      };
    }

    setPeriodState(newFilter);
    officeStore.setPeriodFilter(newFilter);
    if (onPeriodChange) onPeriodChange(newFilter);
    setIsOpen(false);
  };

  // Presets rápidos
  const handleQuickPreset = (preset: string) => {
    const today = '2026-08-20';
    if (preset === 'HOJE') {
      applyPeriod('CUSTOM', { startDate: today, endDate: today });
    } else if (preset === '7D') {
      applyPeriod('CUSTOM', { startDate: '2026-08-14', endDate: today });
    } else if (preset === '30D') {
      applyPeriod('CUSTOM', { startDate: '2026-07-21', endDate: today });
    } else if (preset === 'MES_ATUAL') {
      applyPeriod('MONTH', { year: 2026, month: 8 });
    } else if (preset === 'MES_ANTERIOR') {
      applyPeriod('MONTH', { year: 2026, month: 7 });
    } else if (preset === '3T') {
      applyPeriod('QUARTER', { year: 2026, quarter: 3 });
    } else if (preset === 'ANO_2026') {
      applyPeriod('YEAR', { year: 2026 });
    } else if (preset === 'YTD') {
      applyPeriod('YTD', { year: 2026 });
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Botão Gatilho Diamond 3D */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderBottom: '3px solid #0284C7',
          borderRadius: '9px',
          color: '#FFFFFF',
          padding: compact ? '5px 10px' : '7px 14px',
          fontSize: compact ? '0.74rem' : '0.78rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ color: '#38BDF8', display: 'flex', alignItems: 'center' }}>
          <Calendar size={14} />
        </span>
        <span style={{ color: '#F1F5F9', fontWeight: 800 }}>
          {periodState.label}
        </span>
        <span style={{
          background: 'rgba(56, 189, 248, 0.15)',
          color: '#38BDF8',
          padding: '1px 5px',
          borderRadius: '4px',
          fontSize: '0.62rem',
          fontWeight: 900,
          textTransform: 'uppercase'
        }}>
          {periodState.mode}
        </span>
        <ChevronDown size={13} color="#94A3B8" />
      </button>

      {/* Popover Flutuante 3D (Glassmorphism) */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          zIndex: 99999,
          width: '390px',
          background: 'linear-gradient(180deg, #131E33 0%, #090E1A 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 189, 248, 0.25)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          color: '#FFFFFF'
        }}>
          {/* Header do Popover */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎛️</span>
              <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Seletor Temporal Multi-Granular</strong>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.2)', color: '#38BDF8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, outline: 'none' }}
            >
              <option value="2026">Ano 2026</option>
              <option value="2025">Ano 2025</option>
              <option value="2024">Ano 2024</option>
            </select>
          </div>

          {/* Abas de Modo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', background: '#0B1120', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['MONTH', 'QUARTER', 'SEMESTER', 'YEAR', 'CUSTOM'] as PeriodFilterMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveTab(mode)}
                style={{
                  background: activeTab === mode ? 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)' : 'transparent',
                  border: 'none',
                  color: activeTab === mode ? '#FFFFFF' : '#94A3B8',
                  padding: '5px 2px',
                  borderRadius: '5px',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {mode === 'MONTH' ? 'Mês' : mode === 'QUARTER' ? 'Trimestre' : mode === 'SEMESTER' ? 'Semestre' : mode === 'YEAR' ? 'Anual' : 'Custom'}
              </button>
            ))}
          </div>

          {/* Conteúdo por Aba */}
          {activeTab === 'MONTH' && (
            <div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700 }}>Selecione o Mês / Competência:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {monthNames.map((mName, idx) => {
                  const mNum = idx + 1;
                  const isSelected = selectedMonth === mNum;
                  return (
                    <button
                      key={mNum}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(mNum);
                        applyPeriod('MONTH', { month: mNum });
                      }}
                      style={{
                        background: isSelected ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : '#0B1120',
                        border: isSelected ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.1)',
                        color: isSelected ? '#FFFFFF' : '#CBD5E1',
                        padding: '6px 4px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {mName.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'QUARTER' && (
            <div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700 }}>Trimestre Fiscal (Apuração IRPJ/CSLL & EBITDA):</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[
                  { q: 1, label: '1º Trimestre (1T)', range: 'Jan a Mar' },
                  { q: 2, label: '2º Trimestre (2T)', range: 'Abr a Jun' },
                  { q: 3, label: '3º Trimestre (3T)', range: 'Jul a Set' },
                  { q: 4, label: '4º Trimestre (4T)', range: 'Out a Dez' }
                ].map((item) => {
                  const isSelected = selectedQuarter === item.q;
                  return (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => {
                        setSelectedQuarter(item.q);
                        applyPeriod('QUARTER', { quarter: item.q });
                      }}
                      style={{
                        background: isSelected ? 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)' : '#0B1120',
                        border: isSelected ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>{item.label}</div>
                      <div style={{ fontSize: '0.64rem', color: isSelected ? '#E0F2FE' : '#64748B' }}>{item.range}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'SEMESTER' && (
            <div>
              <div style={{ fontSize: '0.70rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700 }}>Semestre Contábil:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[
                  { s: 1, label: '1º Semestre (1S)', range: 'Janeiro a Junho' },
                  { s: 2, label: '2º Semestre (2S)', range: 'Julho a Dezembro' }
                ].map((item) => {
                  const isSelected = selectedSemester === item.s;
                  return (
                    <button
                      key={item.s}
                      type="button"
                      onClick={() => {
                        setSelectedSemester(item.s);
                        applyPeriod('SEMESTER', { semester: item.s });
                      }}
                      style={{
                        background: isSelected ? 'linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)' : '#0B1120',
                        border: isSelected ? '1.5px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>{item.label}</div>
                      <div style={{ fontSize: '0.64rem', color: isSelected ? '#F3E8FF' : '#64748B' }}>{item.range}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'YEAR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => applyPeriod('YEAR', { year: selectedYear })}
                style={{
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  border: '1.5px solid #34D399',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🏆 Exercício Contábil Completo {selectedYear} (Jan a Dez)
              </button>
              <button
                type="button"
                onClick={() => applyPeriod('YTD', { year: selectedYear })}
                style={{
                  background: '#0B1120',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📈 Acumulado do Ano até Hoje (YTD {selectedYear})
              </button>
            </div>
          )}

          {activeTab === 'CUSTOM' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>Data Início:</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 8px', borderRadius: '6px', fontSize: '0.74rem', marginTop: '2px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>Data Fim:</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 8px', borderRadius: '6px', fontSize: '0.74rem', marginTop: '2px', outline: 'none' }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => applyPeriod('CUSTOM', { startDate: customStart, endDate: customEnd })}
                className="btn-1click-3d"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Zap size={14} /> <span>Filtrar Intervalo Personalizado</span>
              </button>
            </div>
          )}

          {/* Presets Rápidos */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
              ⚡ Presets Rápidos 1-Click:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {[
                { id: 'HOJE', label: 'Hoje' },
                { id: '7D', label: 'Últimos 7D' },
                { id: '30D', label: 'Últimos 30D' },
                { id: 'MES_ATUAL', label: 'Mês Atual' },
                { id: 'MES_ANTERIOR', label: 'Mês Anterior' },
                { id: '3T', label: '3º Trimestre (3T)' },
                { id: 'YTD', label: 'YTD' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickPreset(p.id)}
                  style={{
                    background: '#0B1120',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38BDF8',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPeriodPicker;
