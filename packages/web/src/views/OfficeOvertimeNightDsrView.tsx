// ==========================================================================
// SOBERANO CONTÁBIL — HORAS EXTRAS (50%/100%), HORA NOTURNA FICTA (52m30s) & DSR
// 100% OPERACIONAL: DOWNLOAD DE ESPELHO CSV, REDUÇÃO FICTA & CONTABILIZAÇÃO
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { officeStore, Employee } from '../state/office-store.js';
import { accountingIntegrationEngine } from '../../../core/src/accounting/integration/accounting-integration-engine.js';
import {
  Clock,
  Moon,
  Zap,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Download,
  Calendar
} from 'lucide-react';

export const OfficeOvertimeNightDsrView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [monthlyHours, setMonthlyHours] = useState<number>(220);
  const [hours50, setHours50] = useState<number>(14);
  const [hours100, setHours100] = useState<number>(4);
  const [clockNightHours, setClockNightHours] = useState<number>(18);
  const [hasProrrogationSumula60, setHasProrrogationSumula60] = useState<boolean>(true);
  const [businessDays, setBusinessDays] = useState<number>(25);
  const [sundaysAndHolidays, setSundaysAndHolidays] = useState<number>(5);
  const [competencia, setCompetencia] = useState<string>('08/2026');

  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const currentTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  const activeEmp = useMemo(() => {
    if (selectedEmployeeId) {
      return employees.find(e => e.id === selectedEmployeeId) || employees[0];
    }
    return employees[0] || {
      id: 'mock-1',
      tenantId: selectedTenantId,
      name: 'Colaborador Padrão',
      cpf: '000.000.000-00',
      role: 'Técnico de Suporte',
      cbo: '3172-10',
      department: 'Operações',
      admissionDate: '2023-01-15',
      baseSalary: 4400.00,
      dependantsCount: 0,
      contractType: 'CLT' as const,
      hasVt: true,
      insalubridadeLevel: 'NONE' as const,
      hasPericulosidade: false,
      status: 'ACTIVE' as const
    };
  }, [employees, selectedEmployeeId, selectedTenantId]);

  const normalHourlyRate = monthlyHours > 0 ? (activeEmp.baseSalary / monthlyHours) : 0;

  const rate50 = normalHourlyRate * 1.50;
  const overtime50Amount = Math.round(hours50 * rate50 * 100) / 100;

  const rate100 = normalHourlyRate * 2.00;
  const overtime100Amount = Math.round(hours100 * rate100 * 100) / 100;

  const reducedFictaFactor = 60 / 52.5;
  const effectiveNightHours = Math.round((clockNightHours * reducedFictaFactor) * 100) / 100;

  const nightRate = normalHourlyRate * 0.20;
  const nightShiftAmount = Math.round(effectiveNightHours * nightRate * 100) / 100;

  const totalVariablePay = overtime50Amount + overtime100Amount + nightShiftAmount;
  const dsrReflexAmount = businessDays > 0 ? Math.round((totalVariablePay / businessDays * sundaysAndHolidays) * 100) / 100 : 0;
  const totalPayrollAddition = totalVariablePay + dsrReflexAmount;

  const handleSyncToLedger = () => {
    const res = accountingIntegrationEngine.syncOvertimeDsrToLedger(selectedTenantId, {
      date: '2026-08-30',
      competencia,
      overtime50Amount,
      overtime100Amount,
      nightShiftAmount,
      dsrReflexAmount
    });

    setFeedback({
      message: res.message,
      isError: !res.success
    });
  };

  const handleDownloadCsvEspelho = () => {
    const csv = 'Colaborador,SalarioBase,ValorHora,HE50_Qtd,HE50_Total,HE100_Qtd,HE100_Total,NoturnoRelogio,NoturnoFicto,NoturnoTotal,ReflexoDSR,TotalGeral\n' +
      `"${activeEmp.name}",${activeEmp.baseSalary.toFixed(2)},${normalHourlyRate.toFixed(2)},${hours50},${overtime50Amount.toFixed(2)},${hours100},${overtime100Amount.toFixed(2)},${clockNightHours},${effectiveNightHours.toFixed(2)},${nightShiftAmount.toFixed(2)},${dsrReflexAmount.toFixed(2)},${totalPayrollAddition.toFixed(2)}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Espelho_Horas_Extras_${activeEmp.name.replace(/\s+/g, '_')}_08-2026.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⏰</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Horas Extras (50%/100%), Noturno & Reflexo DSR (Súmula 172/60 TST)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              Hora Noturna Ficta (52m30s - Art. 73 § 1º CLT)
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cálculo com redução ficta da hora noturna, adicional de 20%, horas extras e reflexo em DSR (Súmula 172 TST).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedTenantId}
            onChange={e => {
              setSelectedTenantId(e.target.value);
              setSelectedEmployeeId('');
            }}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>🏢 {t.name}</option>
            ))}
          </select>

          <button onClick={() => window.print()} className="btn-primary-action">
            <Printer size={15} /> Imprimir Memória de Cálculo
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${feedback.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`, color: feedback.isError ? '#f87171' : 'var(--emerald-300)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {feedback.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLABORADOR:</span>
          <select
            value={activeEmp.id}
            onChange={e => setSelectedEmployeeId(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} — Salário Base: R$ {e.baseSalary.toFixed(2)} ({e.role})
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Hora Normal: <strong style={{ color: 'var(--cyan-300)' }}>R$ {normalHourlyRate.toFixed(2)}</strong> • Horas Noturnas Efetivas (Fictas): <strong style={{ color: 'var(--amber-400)' }}>{effectiveNightHours}h</strong> (de {clockNightHours}h de relógio)
        </div>
      </div>

      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--cyan-400)' }} />
            Apontamento de Horas no Mês ({competencia})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Horas Extras 50% (Qtd)</label>
              <input
                type="number"
                value={hours50}
                onChange={e => setHours50(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Horas Extras 100% (Qtd)</label>
              <input
                type="number"
                value={hours100}
                onChange={e => setHours100(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Horas Noturnas Relógio (Qtd)</label>
              <input
                type="number"
                value={clockNightHours}
                onChange={e => setClockNightHours(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Divisor de Jornada</label>
              <select
                value={monthlyHours}
                onChange={e => setMonthlyHours(parseInt(e.target.value))}
                style={{ width: '100%', background: '#0B1120', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <option value="220">220 Horas (44h semanais)</option>
                <option value="200">200 Horas (40h semanais)</option>
                <option value="180">180 Horas (36h semanais)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
            Demonstrativo de Proventos Variáveis
          </h3>

          <div style={{ background: '#0B1120', padding: '14px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Horas Extras 50% ({hours50}h x R$ {rate50.toFixed(2)}):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {overtime50Amount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Horas Extras 100% ({hours100}h x R$ {rate100.toFixed(2)}):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {overtime100Amount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Adicional Noturno (20% s/ {effectiveNightHours}h Fictas):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: '#fff' }}>R$ {nightShiftAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
              <span style={{ color: 'var(--cyan-300)' }}>Reflexo DSR (Súmula 172 TST):</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-300)' }}>+ R$ {dsrReflexAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-medium)', paddingTop: '6px', fontSize: '0.92rem', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>TOTAL PROVENTOS VARIÁVEIS:</span>
              <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {totalPayrollAddition.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadCsvEspelho}
              style={{ flex: 1, background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan-400)', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Download size={15} /> Baixar Espelho CSV
            </button>

            <button
              onClick={handleSyncToLedger}
              className="btn-primary-action"
              style={{ flex: 1, padding: '10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Zap size={16} /> Lançar no Diário
            </button>
          </div>
        </div>
      </div>
    
      {/* ESPELHO EXECUTIVO DE APURAÇÃO DE HORAS EXTRAS & NOTURNO (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DEMONSTRATIVO DE HORAS EXTRAS (50%/100%), ADICIONAL NOTURNO & DSR (SÚMULA 172 TST)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>{competencia}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Divisor: <strong>{monthlyHours}h</strong> • Valor/Hora: <strong>R$ {normalHourlyRate.toFixed(2)}</strong></div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Colaborador</strong>
            <span>{activeEmp.name}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>CPF / Cargo</strong>
            <span className="font-mono">{activeEmp.cpf} ({activeEmp.role})</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Salário Base</strong>
            <span className="font-mono">R$ {activeEmp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Hora Noturna Ficta</strong>
            <span>52min30s (Art. 73 § 1º CLT)</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Rubrica / Adicional de Jornada</th>
              <th>Fundamento Jurídico</th>
              <th style={{ textAlign: 'center' }}>Horas / Qtd</th>
              <th style={{ textAlign: 'right' }}>Valor da Hora</th>
              <th style={{ textAlign: 'right' }}>Total Devido (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Horas Extras 50%:</strong> Dias Úteis / Sábados</td>
              <td>Art. 59 CLT c/c Art. 7º XVI CF/88</td>
              <td style={{ textAlign: 'center' }}>{hours50}h</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {rate50.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {overtime50Amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Horas Extras 100%:</strong> Domingos & Feriados</td>
              <td>Art. 9º Lei 605/49 c/c Súmula 146 TST</td>
              <td style={{ textAlign: 'center' }}>{hours100}h</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {rate100.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {overtime100Amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Adicional Noturno (20%):</strong> Horário 22h às 05h</td>
              <td>Art. 73 CLT c/c Súmula 60 TST</td>
              <td style={{ textAlign: 'center' }}>{effectiveNightHours}h</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {nightRate.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {nightShiftAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Reflexo em DSR:</strong> DSR sobre Horas Extras & Noturno</td>
              <td>Súmula 172 TST & Lei 605/49 ({businessDays} dias úteis / {sundaysAndHolidays} repousos)</td>
              <td style={{ textAlign: 'center' }}>Proporcional</td>
              <td style={{ textAlign: 'right' }}>-</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#0369A1' }}>R$ {dsrReflexAmount.toFixed(2)}</td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={4}>TOTAL DE ADICIONAIS DE JORNADA A PAGAR NA FOLHA</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {totalPayrollAddition.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO OPERACIONAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Espelho de Ponto Homologado</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONFERÊNCIA DO COLABORADOR</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{activeEmp.name}</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • ESPELHO DE JORNADA • CERTIFICAÇÃO DIGITAL SHA-256: <code>55F881A02E9F3D</code></div>
          <div>PÁGINA 1 DE 1 • DEMONSTRATIVO OFICIAL HOMOLOGADO</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeOvertimeNightDsrView;
