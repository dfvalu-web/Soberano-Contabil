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
  X,
  Check
} from 'lucide-react';
import { officeStore, PeriodFilterState, PeriodFilterMode, DEFAULT_PERIOD_FILTER } from '../state/office-store.js';

interface SmartPeriodPickerProps {
  compact?: boolean;
  onPeriodChange?: (period: PeriodFilterState) => void;
}

export const SmartPeriodPicker: React.FC<SmartPeriodPickerProps> = ({ compact = false, onPeriodChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [periodState, setPeriodState] = useState<PeriodFilterState>(() => officeStore.getPeriodFilter());
  const [activeTab, setActiveTab] = useState<'MONTHS' | 'PERIODS' | 'CUSTOM'>('MONTHS');

  // Form local
  const [selectedYear, setSelectedYear] = useState<number>(periodState.year);
  const [selectedMonths, setSelectedMonths] = useState<number[]>(() => {
    if (periodState.selectedMonths && periodState.selectedMonths.length > 0) {
      return periodState.selectedMonths;
    }
    return [periodState.month || 8];
  });
  const [customStart, setCustomStart] = useState<string>(periodState.startDate);
  const [customEnd, setCustomEnd] = useState<string>(periodState.endDate);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; right: number }>({ top: 70, right: 20 });

  useEffect(() => {
    const unsubscribe = officeStore.subscribePeriodFilter((newFilter) => {
      setPeriodState(newFilter);
      if (newFilter.selectedMonths && newFilter.selectedMonths.length > 0) {
        setSelectedMonths(newFilter.selectedMonths);
      }
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

  // Alternar mês na seleção múltipla
  const handleToggleMonth = (mNum: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(mNum)) {
        if (prev.length === 1) return prev; // Manter pelo menos 1 mês
        return prev.filter(m => m !== mNum).sort((a, b) => a - b);
      } else {
        return [...prev, mNum].sort((a, b) => a - b);
      }
    });
  };

  // Selecionar apenas um único mês direto
  const handleSelectSingleMonth = (mNum: number) => {
    const mStr = String(mNum).padStart(2, '0');
    const lastDay = new Date(selectedYear, mNum, 0).getDate();
    const newFilter: PeriodFilterState = {
      mode: 'MONTH',
      year: selectedYear,
      month: mNum,
      selectedMonths: [mNum],
      monthsCount: 1,
      startDate: `${selectedYear}-${mStr}-01`,
      endDate: `${selectedYear}-${mStr}-${lastDay}`,
      label: `${monthNames[mNum - 1]} / ${selectedYear}`
    };
    setSelectedMonths([mNum]);
    setPeriodState(newFilter);
    officeStore.setPeriodFilter(newFilter);
    if (onPeriodChange) onPeriodChange(newFilter);
    setIsOpen(false);
  };

  // Aplicar seleção dos meses escolhidos
  const handleApplyMultiMonths = (monthsList = selectedMonths) => {
    if (monthsList.length === 0) return;
    const sorted = [...monthsList].sort((a, b) => a - b);
    const minM = sorted[0];
    const maxM = sorted[sorted.length - 1];

    const sMStr = String(minM).padStart(2, '0');
    const eMStr = String(maxM).padStart(2, '0');
    const lastDay = new Date(selectedYear, maxM, 0).getDate();

    let label = '';
    if (sorted.length === 1) {
      label = `${monthNames[minM - 1]} / ${selectedYear}`;
    } else if (sorted.length === 2 && maxM === minM + 1) {
      label = `${monthNames[minM - 1]} e ${monthNames[maxM - 1]} / ${selectedYear} (Bimestre)`;
    } else if (sorted.length === 3 && (minM === 1 || minM === 4 || minM === 7 || minM === 10) && maxM === minM + 2) {
      const qNum = Math.ceil(maxM / 3);
      label = `${qNum}º Trimestre / ${selectedYear} (${monthNames[minM - 1].slice(0, 3)} a ${monthNames[maxM - 1].slice(0, 3)})`;
    } else if (sorted.length === 4 && (minM === 1 || minM === 5 || minM === 9) && maxM === minM + 3) {
      const quadNum = Math.ceil(maxM / 4);
      label = `${quadNum}º Quadrimestre / ${selectedYear} (${monthNames[minM - 1].slice(0, 3)} a ${monthNames[maxM - 1].slice(0, 3)})`;
    } else if (sorted.length === 6 && minM === 1 && maxM === 6) {
      label = `1º Semestre / ${selectedYear} (Jan a Jun)`;
    } else if (sorted.length === 6 && minM === 7 && maxM === 12) {
      label = `2º Semestre / ${selectedYear} (Jul a Dez)`;
    } else if (sorted.length === 12) {
      label = `Exercício Anual ${selectedYear} (12 Meses)`;
    } else {
      label = `${monthNames[minM - 1].slice(0, 3)} a ${monthNames[maxM - 1].slice(0, 3)} / ${selectedYear} (${sorted.length} Meses)`;
    }

    const newFilter: PeriodFilterState = {
      mode: sorted.length === 1 ? 'MONTH' : sorted.length === 3 ? 'QUARTER' : sorted.length === 6 ? 'SEMESTER' : sorted.length === 12 ? 'YEAR' : 'MULTI_MONTH',
      year: selectedYear,
      month: sorted.length === 1 ? sorted[0] : undefined,
      selectedMonths: sorted,
      monthsCount: sorted.length,
      startDate: `${selectedYear}-${sMStr}-01`,
      endDate: `${selectedYear}-${eMStr}-${lastDay}`,
      label: label
    };

    setPeriodState(newFilter);
    officeStore.setPeriodFilter(newFilter);
    if (onPeriodChange) onPeriodChange(newFilter);
    setIsOpen(false);
  };

  // Presets
  const applyPresetMonths = (months: number[]) => {
    setSelectedMonths(months);
    handleApplyMultiMonths(months);
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
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '8px',
          color: '#FFFFFF',
          padding: compact ? '6px 12px' : '8px 16px',
          fontSize: '0.80rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.15s ease'
        }}
      >
        <Calendar size={14} color="#38BDF8" />
        <span style={{ color: '#F8FAFC', fontWeight: 800 }}>
          {periodState.label}
        </span>
        {periodState.monthsCount && periodState.monthsCount > 1 && (
          <span style={{
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38BDF8',
            padding: '1px 6px',
            borderRadius: '4px',
            fontSize: '0.64rem',
            fontWeight: 900
          }}>
            {periodState.monthsCount}M
          </span>
        )}
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
            width: '420px',
            maxWidth: 'calc(100vw - 20px)',
            maxHeight: 'calc(100vh - 90px)',
            overflowY: 'auto',
            background: '#0F172A',
            border: '1.5px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 25px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#FFFFFF'
          }}
        >
          {/* Header do Popover */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎛️</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', display: 'block' }}>Filtro de Competências do Escritório</strong>
                <span style={{ fontSize: '0.66rem', color: '#94A3B8' }}>Selecione 1 mês, múltiplos meses ou períodos fiscais</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#38BDF8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, outline: 'none' }}
              >
                <option value="2026">Ano 2026</option>
                <option value="2025">Ano 2025</option>
                <option value="2024">Ano 2024</option>
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

          {/* Abas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', background: '#1E293B', padding: '3px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('MONTHS')}
              style={{
                background: activeTab === 'MONTHS' ? '#0284C7' : 'transparent',
                border: 'none',
                color: activeTab === 'MONTHS' ? '#FFFFFF' : '#94A3B8',
                padding: '6px 2px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🗓️ Seleção de Meses ({selectedMonths.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PERIODS')}
              style={{
                background: activeTab === 'PERIODS' ? '#0284C7' : 'transparent',
                border: 'none',
                color: activeTab === 'PERIODS' ? '#FFFFFF' : '#94A3B8',
                padding: '6px 2px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ⚡ Bim / Trim / Sem
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CUSTOM')}
              style={{
                background: activeTab === 'CUSTOM' ? '#0284C7' : 'transparent',
                border: 'none',
                color: activeTab === 'CUSTOM' ? '#FFFFFF' : '#94A3B8',
                padding: '6px 2px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              📅 Por Datas
            </button>
          </div>

          {/* Aba 1: Seleção Livre de Meses com Suporte Multi-Meses */}
          {activeTab === 'MONTHS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 700 }}>
                  Clique nos meses desejados (ex: Jan + Fev):
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                    style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.66rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Todos
                  </button>
                  <span style={{ color: '#475569' }}>•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMonths([8])}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '0.66rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Apenas Atual
                  </button>
                </div>
              </div>

              {/* Grade de 12 Meses com Seleção Múltipla */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {monthNames.map((mName, idx) => {
                  const mNum = idx + 1;
                  const isChecked = selectedMonths.includes(mNum);
                  return (
                    <button
                      key={mNum}
                      type="button"
                      onClick={() => handleToggleMonth(mNum)}
                      style={{
                        background: isChecked ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : '#1E293B',
                        border: isChecked ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.06)',
                        color: isChecked ? '#FFFFFF' : '#CBD5E1',
                        padding: '10px 6px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{mName}</span>
                      {isChecked ? <Check size={14} color="#FFFFFF" /> : <span style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #475569' }} />}
                    </button>
                  );
                })}
              </div>

              {/* Botão de Aplicar Seleção Múltipla */}
              <button
                type="button"
                onClick={() => handleApplyMultiMonths()}
                style={{
                  background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                  border: '1.5px solid #38BDF8',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <CheckCircle2 size={16} />
                <span>
                  Aplicar Filtro ({selectedMonths.length} {selectedMonths.length === 1 ? 'Mês' : 'Meses Selecionados'})
                </span>
              </button>
            </div>
          )}

          {/* Aba 2: Períodos Contábeis Rápidos (Bimestres, Trimestres, Quadrimestres e Semestres) */}
          {activeTab === 'PERIODS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>
                  2 Meses (Bimestres):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                  {[
                    { label: '1º Bim (Jan-Fev)', m: [1, 2] },
                    { label: '2º Bim (Mar-Abr)', m: [3, 4] },
                    { label: '3º Bim (Mai-Jun)', m: [5, 6] },
                    { label: '4º Bim (Jul-Ago)', m: [7, 8] },
                    { label: '5º Bim (Set-Out)', m: [9, 10] },
                    { label: '6º Bim (Nov-Dez)', m: [11, 12] }
                  ].map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPresetMonths(b.m)}
                      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', color: '#38BDF8', padding: '6px 4px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>
                  3 Meses (Trimestres Fiscais - IRPJ / EBITDA):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                  {[
                    { label: '1º Trimestre (Jan a Mar)', m: [1, 2, 3] },
                    { label: '2º Trimestre (Abr a Jun)', m: [4, 5, 6] },
                    { label: '3º Trimestre (Jul a Set)', m: [7, 8, 9] },
                    { label: '4º Trimestre (Out a Dez)', m: [10, 11, 12] }
                  ].map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPresetMonths(q.m)}
                      style={{ background: '#1E293B', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#FFFFFF', padding: '8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>
                  4 & 6 Meses (Quadrimestres & Semestres):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => applyPresetMonths([1, 2, 3, 4, 5, 6])}
                    style={{ background: '#1E293B', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#C084FC', padding: '8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                  >
                    1º Semestre (Jan a Jun)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetMonths([7, 8, 9, 10, 11, 12])}
                    style={{ background: '#1E293B', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#C084FC', padding: '8px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                  >
                    2º Semestre (Jul a Dez)
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => applyPresetMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                style={{
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  border: '1.5px solid #34D399',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                🏆 Exercício Anual Completo {selectedYear} (12 Meses)
              </button>
            </div>
          )}

          {/* Aba 3: Datas Personalizadas */}
          {activeTab === 'CUSTOM' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>Data Início:</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 8px', borderRadius: '6px', fontSize: '0.74rem', marginTop: '2px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>Data Fim:</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 8px', borderRadius: '6px', fontSize: '0.74rem', marginTop: '2px', outline: 'none' }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newFilter: PeriodFilterState = {
                    mode: 'CUSTOM',
                    year: selectedYear,
                    startDate: customStart,
                    endDate: customEnd,
                    label: `${customStart.split('-').reverse().join('/')} a ${customEnd.split('-').reverse().join('/')}`
                  };
                  setPeriodState(newFilter);
                  officeStore.setPeriodFilter(newFilter);
                  if (onPeriodChange) onPeriodChange(newFilter);
                  setIsOpen(false);
                }}
                style={{
                  background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                  border: '1.5px solid #38BDF8',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} /> <span>Filtrar por Intervalo de Datas</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartPeriodPicker;
