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
  RotateCcw,
  X
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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; right: number }>({ top: 70, right: 20 });

  useEffect(() => {
    const unsubscribe = officeStore.subscribePeriodFilter((newFilter) => {
      setPeriodState(newFilter);
      if (onPeriodChange) onPeriodChange(newFilter);
    });
    return unsubscribe;
  }, [onPeriodChange]);

  const updatePopoverPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top = rect.bottom + 6;
      const right = Math.max(12, window.innerWidth - rect.right);
      setPopoverPos({ top, right });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePopoverPosition();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePopoverPosition);
      window.addEventListener('scroll', updatePopoverPosition, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
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
        label: `${q}º Trimestre / ${y}`
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
        label: `${s}º Semestre / ${y}`
      };
    } else if (mode === 'YEAR') {
      const y = customParams?.year || selectedYear;
      newFilter = {
        mode: 'YEAR',
        year: y,
        startDate: `${y}-01-01`,
        endDate: `${y}-12-31`,
        label: `Exercício ${y}`
      };
    } else if (mode === 'YTD') {
      const y = customParams?.year || selectedYear;
      newFilter = {
        mode: 'YTD',
        year: y,
        startDate: `${y}-01-01`,
        endDate: `${y}-08-20`,
        label: `YTD ${y}`
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
        label: `${sDate.split('-').reverse().join('/')} a ${eDate.split('-').reverse().join('/')}`
      };
    }

    setPeriodState(newFilter);
    officeStore.setPeriodFilter(newFilter);
    if (onPeriodChange) onPeriodChange(newFilter);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Botão Único Ultra Premium */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          color: '#FFFFFF',
          padding: compact ? '6px 12px' : '8px 16px',
          fontSize: '0.80rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.15s ease'
        }}
      >
        <Calendar size={14} color="#38BDF8" />
        <span style={{ color: '#F8FAFC', fontWeight: 800 }}>
          {periodState.label}
        </span>
        <ChevronDown size={14} color="#94A3B8" />
      </button>

      {/* Popover em 1º Plano Absoluto */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: `${popoverPos.top}px`,
            right: `${popoverPos.right}px`,
            zIndex: 99999999,
            width: '360px',
            maxWidth: 'calc(100vw - 24px)',
            background: '#0F172A',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#FFFFFF'
          }}
        >
          {/* Header do Popover */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1rem' }}>📅</span>
              <strong style={{ fontSize: '0.82rem', color: '#FFFFFF' }}>Selecionar Competência</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#38BDF8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, outline: 'none' }}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Abas Super Limpas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#1E293B', padding: '3px', borderRadius: '6px' }}>
            {(['MONTH', 'QUARTER', 'SEMESTER', 'YEAR'] as PeriodFilterMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveTab(mode)}
                style={{
                  background: activeTab === mode ? '#0284C7' : 'transparent',
                  border: 'none',
                  color: activeTab === mode ? '#FFFFFF' : '#94A3B8',
                  padding: '5px 2px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {mode === 'MONTH' ? 'Mensal' : mode === 'QUARTER' ? 'Trimestral' : mode === 'SEMESTER' ? 'Semestral' : 'Anual'}
              </button>
            ))}
          </div>

          {/* Grade de Meses */}
          {activeTab === 'MONTH' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {monthNames.map((mName, idx) => {
                const mNum = idx + 1;
                const isSelected = selectedMonth === mNum && periodState.mode === 'MONTH';
                return (
                  <button
                    key={mNum}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(mNum);
                      applyPeriod('MONTH', { month: mNum });
                    }}
                    style={{
                      background: isSelected ? '#10B981' : '#1E293B',
                      border: isSelected ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.06)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      padding: '8px 4px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Grade de Trimestres */}
          {activeTab === 'QUARTER' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {[
                { q: 1, label: '1º Trimestre (1T)', range: 'Janeiro a Março' },
                { q: 2, label: '2º Trimestre (2T)', range: 'Abril a Junho' },
                { q: 3, label: '3º Trimestre (3T)', range: 'Julho a Setembro' },
                { q: 4, label: '4º Trimestre (4T)', range: 'Outubro a Dezembro' }
              ].map((item) => {
                const isSelected = selectedQuarter === item.q && periodState.mode === 'QUARTER';
                return (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => {
                      setSelectedQuarter(item.q);
                      applyPeriod('QUARTER', { quarter: item.q });
                    }}
                    style={{
                      background: isSelected ? '#0284C7' : '#1E293B',
                      border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF',
                      padding: '10px 8px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.62rem', color: isSelected ? '#E0F2FE' : '#94A3B8' }}>{item.range}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Grade de Semestres */}
          {activeTab === 'SEMESTER' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {[
                { s: 1, label: '1º Semestre (1S)', range: 'Janeiro a Junho' },
                { s: 2, label: '2º Semestre (2S)', range: 'Julho a Dezembro' }
              ].map((item) => {
                const isSelected = selectedSemester === item.s && periodState.mode === 'SEMESTER';
                return (
                  <button
                    key={item.s}
                    type="button"
                    onClick={() => {
                      setSelectedSemester(item.s);
                      applyPeriod('SEMESTER', { semester: item.s });
                    }}
                    style={{
                      background: isSelected ? '#8B5CF6' : '#1E293B',
                      border: isSelected ? '1px solid #C084FC' : '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF',
                      padding: '10px 8px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.62rem', color: isSelected ? '#F3E8FF' : '#94A3B8' }}>{item.range}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Anual */}
          {activeTab === 'YEAR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => applyPeriod('YEAR', { year: selectedYear })}
                style={{
                  background: '#10B981',
                  border: '1px solid #34D399',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🏆 Exercício Completo {selectedYear} (Jan a Dez)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartPeriodPicker;
