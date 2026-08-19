const fs = require('fs');

const code = import React, { useState, useEffect, useMemo } from 'react';
import { officeStore, Employee, PayrollStatement } from '../state/office-store.js';

export const PayrollOperationalView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [competencia, setCompetencia] = useState<string>('08/2026');
  const [selectedEmployeeForHolerite, setSelectedEmployeeForHolerite] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'FOLHA_GERAL' | 'FUNCIONARIOS' | 'HOLERITE_PREVIEW'>('FOLHA_GERAL');

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    cpf: '',
    role: '',
    cbo: '2522-10',
    department: 'Operações',
    admissionDate: '2024-01-15',
    baseSalary: 3000,
    dependantsCount: 0,
    contractType: 'CLT',
    hasVt: true,
    insalubridadeLevel: 'NONE',
    hasPericulosidade: false,
    status: 'ACTIVE'
  });

  const tenants = useMemo(() => officeStore.getTenants(), []);

  useEffect(() => {
    const load = () => {
      setEmployees(officeStore.getEmployees(selectedTenantId));
    };
    load();
    const unsub = officeStore.subscribe(load);
    return () => unsub();
  }, [selectedTenantId]);

  const currentTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  const statements: PayrollStatement[] = useMemo(() => {
    return employees.map(emp => officeStore.calculatePayroll(emp, competencia));
  }, [employees, competencia]);

  const totals = useMemo(() => {
    return statements.reduce((acc, st) => {
      acc.totalBruto += st.totalProventos;
      acc.totalDescontos += st.totalDescontos;
      acc.totalLiquido += st.netSalary;
      acc.totalInss += (st.items.find(i => i.code === '501')?.amount || 0);
      acc.totalIrrf += (st.items.find(i => i.code === '505')?.amount || 0);
      acc.totalFgts += st.fgtsAmount;
      return acc;
    }, { totalBruto: 0, totalDescontos: 0, totalLiquido: 0, totalInss: 0, totalIrrf: 0, totalFgts: 0 });
  }, [statements]);

  const handleOpenNewEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      cpf: '',
      role: '',
      cbo: '2522-10',
      department: 'Operações',
      admissionDate: new Date().toISOString().split('T')[0],
      baseSalary: 3500,
      dependantsCount: 0,
      contractType: 'CLT',
      hasVt: false,
      insalubridadeLevel: 'NONE',
      hasPericulosidade: false,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.role || !formData.baseSalary) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const empToSave: Employee = {
      id: editingEmployee ? editingEmployee.id : 'emp-' + Date.now(),
      tenantId: selectedTenantId,
      name: formData.name,
      cpf: formData.cpf,
      role: formData.role,
      cbo: formData.cbo || '2522-10',
      department: formData.department || 'Geral',
      admissionDate: formData.admissionDate || '2024-01-01',
      baseSalary: Number(formData.baseSalary),
      dependantsCount: Number(formData.dependantsCount || 0),
      contractType: formData.contractType || 'CLT',
      hasVt: !!formData.hasVt,
      insalubridadeLevel: formData.insalubridadeLevel || 'NONE',
      hasPericulosidade: !!formData.hasPericulosidade,
      status: formData.status || 'ACTIVE',
      overtime50Hours: formData.overtime50Hours,
      overtime100Hours: formData.overtime100Hours,
      unjustifiedAbsencesDays: formData.unjustifiedAbsencesDays,
      alimonyPercentage: formData.alimonyPercentage
    };

    officeStore.saveEmployee(empToSave);
    setIsModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Deseja realmente excluir este funcionário da base?')) {
      officeStore.deleteEmployee(id);
    }
  };

  const handleUpdateEvents = (emp: Employee, field: keyof Employee, val: number) => {
    const updated = { ...emp, [field]: val };
    officeStore.saveEmployee(updated);
  };

  const activeHoleriteStatement = useMemo(() => {
    if (!selectedEmployeeForHolerite) {
      if (employees.length > 0) return officeStore.calculatePayroll(employees[0], competencia);
      return null;
    }
    return officeStore.calculatePayroll(selectedEmployeeForHolerite, competencia);
  }, [selectedEmployeeForHolerite, employees, competencia]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Departamento Pessoal & Folha de Pagamento Oficial
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              eSocial S-1200 / S-1210
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cálculo instantâneo de INSS progressivo, IRRF (dedução legal vs simplificada), FGTS Digital e emissão de holerites CLT.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id} style={{ background: '#111726', color: '#fff' }}>
                {t.name} ({t.regime.replace('_', ' ')})
              </option>
            ))}
          </select>
          <button onClick={handleOpenNewEmployee} className= btn-primary-action>
            <span>➕</span> Novo Funcionário
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Folha Bruta Total</div>
          <div className=font-mono style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            R$ {totals.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)', marginTop: '4px' }}>{employees.length} colaboradores ativos</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Líquido a Pagar</div>
          <div className=font-mono style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            R$ {totals.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Disponível para Pix/TED</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>INSS Previdência (DCTFWeb)</div>
          <div className=font-mono style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>
            R$ {totals.totalInss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Retenção Folha</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>FGTS Digital (Guia Pix)</div>
          <div className=font-mono style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-400)', marginTop: '4px' }}>
            R$ {totals.totalFgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>8% encargo patronal</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>IRRF Retido na Fonte</div>
          <div className=font-mono style={{ fontSize: '1.3rem', fontWeight: 800, color: '#A78BFA', marginTop: '4px' }}>
            R$ {totals.totalIrrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>DARF Numerado</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <button onClick={() => setActiveTab('FOLHA_GERAL')} style={{ background: activeTab === 'FOLHA_GERAL' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'FOLHA_GERAL' ? '#070B12' : 'var(--text-secondary)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          📋 Resumo da Folha & Variáveis
        </button>
        <button onClick={() => setActiveTab('FUNCIONARIOS')} style={{ background: activeTab === 'FUNCIONARIOS' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'FUNCIONARIOS' ? '#070B12' : 'var(--text-secondary)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          👤 Cadastro de Colaboradores ({employees.length})
        </button>
        <button onClick={() => setActiveTab('HOLERITE_PREVIEW')} style={{ background: activeTab === 'HOLERITE_PREVIEW' ? 'var(--emerald-500)' : 'transparent', color: activeTab === 'HOLERITE_PREVIEW' ? '#070B12' : 'var(--text-secondary)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          📑 Emissão de Holerite Oficial
        </button>
      </div>

      {activeTab === 'FOLHA_GERAL' && (
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
              Apuração Mensal de Eventos • Competência {competencia} ({currentTenant.name})
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Edite as horas extras e faltas diretamente na tabela para recálculo instantâneo.
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Colaborador / Cargo</th>
                  <th style={{ padding: '12px 12px' }}>Salário Base</th>
                  <th style={{ padding: '12px 12px' }}>HE 50% (h)</th>
                  <th style={{ padding: '12px 12px' }}>HE 100% (h)</th>
                  <th style={{ padding: '12px 12px' }}>Faltas (d)</th>
                  <th style={{ padding: '12px 12px' }}>Bruto</th>
                  <th style={{ padding: '12px 12px' }}>INSS</th>
                  <th style={{ padding: '12px 12px' }}>IRRF</th>
                  <th style={{ padding: '12px 12px' }}>Líquido</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const st = officeStore.calculatePayroll(emp, competencia);
                  const inss = st.items.find(i => i.code === '501')?.amount || 0;
                  const irrf = st.items.find(i => i.code === '505')?.amount || 0;
                  return (
                    <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{emp.role} • CPF: {emp.cpf}</div>
                      </td>
                      <td className=font-mono style={{ padding: '12px 12px', color: '#fff' }}>
                        R$ {emp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <input
                          type=number
                          min=0
                          max=120
                          value={emp.overtime50Hours || 0}
                          onChange={(e) => handleUpdateEvents(emp, 'overtime50Hours', Number(e.target.value))}
                          style={{ width: '50px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '4px 6px', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <input
                          type=number
                          min=0
                          max=60
                          value={emp.overtime100Hours || 0}
                          onChange={(e) => handleUpdateEvents(emp, 'overtime100Hours', Number(e.target.value))}
                          style={{ width: '50px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '4px 6px', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <input
                          type=number
                          min=0
                          max=30
                          value={emp.unjustifiedAbsencesDays || 0}
                          onChange={(e) => handleUpdateEvents(emp, 'unjustifiedAbsencesDays', Number(e.target.value))}
                          style={{ width: '45px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '4px 6px', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>
                      <td className=font-mono style={{ padding: '12px 12px', fontWeight: 700, color: '#fff' }}>
                        R$ {st.totalProventos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className=font-mono style={{ padding: '12px 12px', color: 'var(--cyan-400)' }}>
                        R$ {inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className=font-mono style={{ padding: '12px 12px', color: '#A78BFA' }}>
                        R$ {irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className=font-mono style={{ padding: '12px 12px', fontWeight: 800, color: 'var(--emerald-400)' }}>
                        R$ {st.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedEmployeeForHolerite(emp);
                            setActiveTab('HOLERITE_PREVIEW');
                          }}
                          style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          📄 Holerite
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'FUNCIONARIOS' && (
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
              Quadro de Colaboradores Registrados ({employees.length})
            </div>
            <button onClick={handleOpenNewEmployee} className=btn-primary-action>
              <span>➕</span> Adicionar Funcionário
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Nome / CPF</th>
                  <th style={{ padding: '12px 12px' }}>Cargo / CBO</th>
                  <th style={{ padding: '12px 12px' }}>Departamento</th>
                  <th style={{ padding: '12px 12px' }}>Admissão</th>
                  <th style={{ padding: '12px 12px' }}>Salário Base</th>
                  <th style={{ padding: '12px 12px' }}>Dep. IRRF</th>
                  <th style={{ padding: '12px 12px' }}>Insalubridade / Peric.</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{emp.name}</div>
                      <div className=font-mono style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{emp.cpf}</div>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ color: '#fff' }}>{emp.role}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CBO {emp.cbo}</div>
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>{emp.department}</td>
                    <td className=font-mono style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>{emp.admissionDate}</td>
                    <td className=font-mono style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--emerald-400)' }}>
                      R$ {emp.baseSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>{emp.dependantsCount}</td>
                    <td style={{ padding: '12px 12px' }}>
                      {emp.insalubridadeLevel !== 'NONE' && (
                        <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginRight: '4px' }}>
                          Insalubridade
                        </span>
                      )}
                      {emp.hasPericulosidade && (
                        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                          Periculosidade 30%
                        </span>
                      )}
                      {emp.insalubridadeLevel === 'NONE' && !emp.hasPericulosidade && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleOpenEditEmployee(emp)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem' }}>
                          ✏️ Editar
                        </button>
                        <button onClick={() => handleDeleteEmployee(emp.id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem' }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'HOLERITE_PREVIEW' && activeHoleriteStatement && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '12px 18px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visualizando Holerite de:</span>
              <select
                value={selectedEmployeeForHolerite ? selectedEmployeeForHolerite.id : (employees[0]?.id || '')}
                onChange={(e) => {
                  const emp = employees.find(em => em.id === e.target.value);
                  if (emp) setSelectedEmployeeForHolerite(emp);
                }}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} - {e.role}</option>
                ))}
              </select>
            </div>
            <button onClick={() => window.print()} className=btn-primary-action>
              <span>🖨️</span> Imprimir / Salvar PDF
            </button>
          </div>

          <div style={{ width: '100%', maxWidth: '850px', background: '#FFFFFF', color: '#111827', borderRadius: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '2px solid #374151', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ borderBottom: '2px solid #111827', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{currentTenant.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>CNPJ: {currentTenant.cnpj}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{currentTenant.cnaePrincipal}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>RECIBO DE PAGAMENTO DE SALÁRIO</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E40AF' }}>Mês/Ano: {competencia}</div>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #9CA3AF', padding: '10px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.78rem' }}>
              <div><strong>Código:</strong> {activeHoleriteStatement.employeeId}</div>
              <div><strong>Nome:</strong> {activeHoleriteStatement.employeeName}</div>
              <div><strong>CBO:</strong> {activeHoleriteStatement.cbo}</div>
              <div><strong>Função:</strong> {activeHoleriteStatement.role}</div>
              <div><strong>CPF:</strong> {activeHoleriteStatement.cpf}</div>
              <div><strong>Admissão:</strong> {activeHoleriteStatement.admissionDate}</div>
              <div><strong>Dep. IRRF:</strong> {selectedEmployeeForHolerite?.dependantsCount || 0}</div>
              <div><strong>Tipo:</strong> Mensalista</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#F3F4F6', borderTop: '1px solid #111827', borderBottom: '1px solid #111827' }}>
                  <th style={{ padding: '6px', textAlign: 'left', width: '60px' }}>Cód.</th>
                  <th style={{ padding: '6px', textAlign: 'left' }}>Descrição do Evento</th>
                  <th style={{ padding: '6px', textAlign: 'center', width: '80px' }}>Referência</th>
                  <th style={{ padding: '6px', textAlign: 'right', width: '120px' }}>Vencimentos (R$)</th>
                  <th style={{ padding: '6px', textAlign: 'right', width: '120px' }}>Descontos (R$)</th>
                </tr>
              </thead>
              <tbody>
                {activeHoleriteStatement.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dotted #E5E7EB' }}>
                    <td style={{ padding: '6px', fontFamily: 'monospace' }}>{item.code}</td>
                    <td style={{ padding: '6px' }}>{item.description}</td>
                    <td style={{ padding: '6px', textAlign: 'center', color: '#6B7280' }}>{item.reference}</td>
                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: item.type === 'PROVENTO' ? 700 : 400 }}>
                      {item.type === 'PROVENTO' ? item.amount.toFixed(2) : ''}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'right', color: item.type === 'DESCONTO' ? '#DC2626' : '#111827', fontWeight: item.type === 'DESCONTO' ? 700 : 400 }}>
                      {item.type === 'DESCONTO' ? item.amount.toFixed(2) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '2px solid #111827', borderBottom: '2px solid #111827', padding: '8px 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div><strong>Total de Vencimentos:</strong> R$ {activeHoleriteStatement.totalProventos.toFixed(2)}</div>
              <div><strong>Total de Descontos:</strong> R$ {activeHoleriteStatement.totalDescontos.toFixed(2)}</div>
              <div style={{ background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #10B981', color: '#065F46', fontWeight: 800 }}>
                VALOR LÍQUIDO A RECEBER: R$ {activeHoleriteStatement.netSalary.toFixed(2)}
              </div>
            </div>

            <div style={{ margin: '12px 0', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '0.72rem', background: '#F9FAFB', padding: '8px', border: '1px solid #E5E7EB' }}>
              <div><strong>Salário Base:</strong><br />R$ {selectedEmployeeForHolerite?.baseSalary.toFixed(2)}</div>
              <div><strong>Sal. Contr. INSS:</strong><br />R$ {activeHoleriteStatement.baseInss.toFixed(2)}</div>
              <div><strong>Base Cálc. FGTS:</strong><br />R$ {activeHoleriteStatement.baseFgts.toFixed(2)}</div>
              <div><strong>FGTS do Mês (8%):</strong><br />R$ {activeHoleriteStatement.fgtsAmount.toFixed(2)}</div>
              <div><strong>Base Cálc. IRRF:</strong><br />R$ {activeHoleriteStatement.baseIrrf.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px dashed #9CA3AF', paddingTop: '10px', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '400px' }}>
                RECEBI DA EMPRESA ACIMA A IMPORTÂNCIA LÍQUIDA ESPECIFICADA NESTE RECIBO, DANDO PLENA E GERAL QUITAÇÃO.
              </div>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ borderBottom: '1px solid #111827', width: '100%', height: '30px' }}></div>
                <div style={{ marginTop: '4px' }}>Assinatura do Funcionário</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollOperationalView;
;

fs.writeFileSync('packages/web/src/views/PayrollOperationalView.tsx', code, 'utf8');
console.log('PayrollOperationalView.tsx created successfully!');
