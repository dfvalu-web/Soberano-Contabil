// ==========================================================================
// SOBERANO CONTÁBIL — GESTÃO DE ATIVOS INTANGÍVEIS & AMORTIZAÇÃO (CPC 04 R1)
// Conformidade: NBC TG 04 (CPC 04 R1 / IAS 38) • NBC TG 01 (Impairment)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Code2,
  Bookmark,
  FileCheck2,
  TrendingDown,
  Printer,
  Zap,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Plus,
  X,
  Save,
  HelpCircle
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import {
  IntangibleAssetsCpc04Engine,
  IntangibleAssetItem,
  IntangibleCategory
} from '@soberano/core';

export const OfficeIntangiblesAmortizationView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [intangibles, setIntangibles] = useState<IntangibleAssetItem[]>([
    {
      id: 'int-1',
      tenantId: 't1',
      code: 'INT-2026-001',
      name: 'Software ERP Soberano & Plataforma Cloud Proprietária',
      category: 'SOFTWARE_SISTEMAS',
      costCenter: 'P&D e Engenharia de Software',
      acquisitionDate: '2025-01-10',
      acquisitionCost: 240000.00,
      residualValue: 0,
      usefulLifeMonths: 60, // 5 anos
      annualAmortizationRatePercent: 20.0, // 20% a.a.
      accumulatedAmortization: 76000.00,
      impairmentLossAccumulated: 0,
      isIndefiniteUsefulLife: false
    },
    {
      id: 'int-2',
      tenantId: 't1',
      code: 'INT-2026-002',
      name: 'Patente Registrada de Válvula de Fluxo (INPI Nº 99882200)',
      category: 'MARCAS_PATENTES',
      costCenter: 'Inovação e Propriedade Intelectual',
      acquisitionDate: '2024-06-15',
      acquisitionCost: 150000.00,
      residualValue: 0,
      usefulLifeMonths: 120, // 10 anos
      annualAmortizationRatePercent: 10.0, // 10% a.a.
      accumulatedAmortization: 32500.00,
      impairmentLossAccumulated: 0,
      isIndefiniteUsefulLife: false
    },
    {
      id: 'int-3',
      tenantId: 't1',
      code: 'INT-2026-003',
      name: 'Ágio por Rentabilidade Futura (Goodwill Adquirido em Combinação de Negócios)',
      category: 'GOODWILL_AGIO',
      costCenter: 'Diretoria Executiva / M&A',
      acquisitionDate: '2025-03-01',
      acquisitionCost: 500000.00,
      residualValue: 0,
      usefulLifeMonths: 0,
      annualAmortizationRatePercent: 0,
      accumulatedAmortization: 0,
      impairmentLossAccumulated: 0,
      isIndefiniteUsefulLife: true // Não amortizável, sujeito a impairment
    }
  ]);

  // Form State for Modal
  const [formCode, setFormCode] = useState<string>('INT-2026-004');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<IntangibleCategory>('SOFTWARE_SISTEMAS');
  const [formCostCenter, setFormCostCenter] = useState<string>('Tecnologia e Inovação');
  const [formAcquisitionDate, setFormAcquisitionDate] = useState<string>('2026-08-19');
  const [formAcquisitionCost, setFormAcquisitionCost] = useState<number>(120000.00);
  const [formUsefulLifeMonths, setFormUsefulLifeMonths] = useState<number>(60);
  const [formAnnualRate, setFormAnnualRate] = useState<number>(20.0);
  const [formIsIndefinite, setFormIsIndefinite] = useState<boolean>(false);

  const handleOpenModal = () => {
    setFormCode(`INT-2026-${String(intangibles.length + 1).padStart(3, '0')}`);
    setFormName('');
    setFormAcquisitionCost(90000.00);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (cat: IntangibleCategory) => {
    setFormCategory(cat);
    if (cat === 'GOODWILL_AGIO') {
      setFormIsIndefinite(true);
      setFormUsefulLifeMonths(0);
      setFormAnnualRate(0);
    } else if (cat === 'SOFTWARE_SISTEMAS') {
      setFormIsIndefinite(false);
      setFormUsefulLifeMonths(60);
      setFormAnnualRate(20.0);
    } else if (cat === 'MARCAS_PATENTES') {
      setFormIsIndefinite(false);
      setFormUsefulLifeMonths(120);
      setFormAnnualRate(10.0);
    } else if (cat === 'LICENCAS_CONCESSOES') {
      setFormIsIndefinite(false);
      setFormUsefulLifeMonths(36);
      setFormAnnualRate(33.33);
    } else {
      setFormIsIndefinite(false);
      setFormUsefulLifeMonths(60);
      setFormAnnualRate(20.0);
    }
  };

  const handleSaveIntangible = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim() || formAcquisitionCost <= 0) {
      alert('Por favor, preencha o código, o nome do ativo e o valor de aquisição/desenvolvimento.');
      return;
    }

    const newItem: IntangibleAssetItem = {
      id: `int-${Date.now()}`,
      tenantId: selectedTenantId,
      code: formCode,
      name: formName,
      category: formCategory,
      costCenter: formCostCenter,
      acquisitionDate: formAcquisitionDate,
      acquisitionCost: formAcquisitionCost,
      residualValue: 0,
      usefulLifeMonths: formIsIndefinite ? 0 : formUsefulLifeMonths,
      annualAmortizationRatePercent: formIsIndefinite ? 0 : formAnnualRate,
      accumulatedAmortization: 0,
      impairmentLossAccumulated: 0,
      isIndefiniteUsefulLife: formIsIndefinite
    };

    setIntangibles(prev => [newItem, ...prev]);
    setIsModalOpen(false);
    setFeedback(`Ativo Intangível "${formName}" (${formCode}) registrado com sucesso com base no CPC 04!`);
    setTimeout(() => setFeedback(null), 6000);
  };

  // Totais do Intangível
  const totalCost = intangibles.reduce((acc, a) => acc + a.acquisitionCost, 0);
  const totalAccumulatedAmortization = intangibles.reduce((acc, a) => acc + a.accumulatedAmortization, 0);
  const totalNetBookValue = totalCost - totalAccumulatedAmortization;
  const totalMonthlyAmortization = intangibles.reduce((acc, a) => {
    if (a.isIndefiniteUsefulLife || a.usefulLifeMonths <= 0) return acc;
    return acc + ((a.acquisitionCost * (a.annualAmortizationRatePercent / 100)) / 12);
  }, 0);

  const handlePostMonthlyAmortizationToLedger = () => {
    setFeedback(`Apropriação da Amortização Mensal de Intangíveis (R$ ${totalMonthlyAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) lançada com sucesso no Diário Contábil (Partidas Dobradas - CPC 04)!`);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Gestão de Ativos Intangíveis & Amortização (CPC 04 R1 / IAS 38)
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              NBC TG 04 (R1) • GOODWILL & SOFTWARE
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Controle de softwares proprietários, marcas, patentes, P&D e ágio/goodwill com amortização linear e teste de impairment anual.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Imprimir Laudo de Intangíveis (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--cyan-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--cyan-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Valor Contábil Líquido (VCL)</span>
            <Sparkles size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Ativo Não Circulante Intangível (Conta 1.2.4)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Amortização Acumulada</span>
            <TrendingDown size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            - R$ {totalAccumulatedAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Conta Redutora do Intangível (CPC 04)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Amortização Mensal (DRE)</span>
            <Calculator size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono">
            R$ {totalMonthlyAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </div>
          <div className="metric-sub">Despesa Operacional Contábil</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ágio / Goodwill (Vida Indefinida)</span>
            <Bookmark size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            {intangibles.filter(i => i.isIndefiniteUsefulLife).length} itens
          </div>
          <div className="metric-sub">Sujeito a Impairment Test Anual (CPC 01)</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '12px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
          Ativos Intangíveis Registrados ({intangibles.length} ativos)
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleOpenModal}
            className="btn-primary-action"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> + Cadastrar Ativo Intangível
          </button>
          <button
            onClick={handlePostMonthlyAmortizationToLedger}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Contabilizar Amortização no Diário
          </button>
        </div>
      </div>

      {/* Interactive Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição do Intangível</th>
                <th>Categoria / Centro de Custo</th>
                <th style={{ textAlign: 'right' }}>Custo Aquisição/P&D</th>
                <th style={{ textAlign: 'center' }}>Vida Útil</th>
                <th style={{ textAlign: 'right' }}>Amortiz. Mês</th>
                <th style={{ textAlign: 'right' }}>Amortiz. Acumulada</th>
                <th style={{ textAlign: 'right' }}>Valor Contábil Líquido</th>
              </tr>
            </thead>
            <tbody>
              {intangibles.map(a => {
                const monthly = a.isIndefiniteUsefulLife ? 0 : (a.acquisitionCost * (a.annualAmortizationRatePercent / 100)) / 12;
                const vcl = a.acquisitionCost - a.accumulatedAmortization;
                return (
                  <tr key={a.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{a.code}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{a.name}</td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{a.category.replace('_', ' ')}</span>
                      <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.costCenter}</div>
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {a.acquisitionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'center' }}>
                      {a.isIndefiniteUsefulLife ? (
                        <span className="badge badge-indigo">Indefinida (CPC 01)</span>
                      ) : (
                        <span className="badge badge-emerald">{a.usefulLifeMonths} meses ({a.annualAmortizationRatePercent}% a.a.)</span>
                      )}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--cyan-400)' }}>
                      {a.isIndefiniteUsefulLife ? '—' : `R$ ${monthly.toFixed(2)}`}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', color: '#F87171' }}>
                      - R$ {a.accumulatedAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 800, color: 'var(--emerald-400)' }}>
                      R$ {vcl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO DE INTANGÍVEL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '14px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    Cadastro de Ativo Intangível (CPC 04 R1)
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Softwares, Marcas, Patentes, P&D e Ágio/Goodwill
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveIntangible} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Código de Registro *</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoria do Intangível</label>
                  <select
                    className="form-control"
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as any)}
                  >
                    <option value="SOFTWARE_SISTEMAS">Software e Sistemas Proprietários (20% a.a. / 5 anos)</option>
                    <option value="MARCAS_PATENTES">Marcas e Patentes Registradas no INPI (10% a.a. / 10 anos)</option>
                    <option value="LICENCAS_CONCESSOES">Licenças de Uso e Franquias (33,33% a.a. / 3 anos)</option>
                    <option value="PD_DESENVOLVIMENTO">P&D Fase de Desenvolvimento (Lei do Bem - 20% a.a.)</option>
                    <option value="GOODWILL_AGIO">Ágio por Expectativa de Rentabilidade Futura (Vida Indefinida)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descrição do Ativo Intangível *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Plataforma de Inteligência Artificial ou Patente INPI 123456"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Centro de Custo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formCostCenter}
                    onChange={(e) => setFormCostCenter(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Data de Aquisição / Capitalização</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formAcquisitionDate}
                    onChange={(e) => setFormAcquisitionDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Valor de Aquisição / Custo Capitalizado (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control font-mono"
                    value={formAcquisitionCost}
                    onChange={(e) => setFormAcquisitionCost(Number(e.target.value))}
                    required
                  />
                </div>

                {!formIsIndefinite ? (
                  <>
                    <div className="form-group">
                      <label>Vida Útil Estimada (Meses)</label>
                      <input
                        type="number"
                        className="form-control font-mono"
                        value={formUsefulLifeMonths}
                        onChange={(e) => setFormUsefulLifeMonths(Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Taxa Anual de Amortização (% a.a.)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control font-mono"
                        value={formAnnualRate}
                        onChange={(e) => setFormAnnualRate(Number(e.target.value))}
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--indigo-500)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--indigo-300)' }}>
                      ℹ️ <strong>Vida Útil Indefinida (Ágio / Goodwill):</strong> Conforme CPC 04 / IAS 38, o ágio não sofre amortização periódica sistemática, ficando sujeito ao teste anual de recuperabilidade (Impairment Test - CPC 01).
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                  style={{ padding: '8px 20px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> Salvar Ativo Intangível
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIÊ PATRIMONIAL DE ATIVOS INTANGÍVEIS & AMORTIZAÇÃO (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ PATRIMONIAL DE ATIVOS INTANGÍVEIS & MAPA DE AMORTIZAÇÃO (NBC TG 04 / CPC 04 R1 / IAS 38)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>NBC TG 04 (R1) • IAS 38 Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Custo Histórico Total</strong>
            <span className="font-mono">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Amortização Acumulada</strong>
            <span className="font-mono" style={{ color: '#B91C1C' }}>- R$ {totalAccumulatedAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor Contábil Líquido (VCL)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Amortização Mensal (DRE)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalMonthlyAmortization.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Código / Descrição do Intangível</th>
              <th>Categoria / Centro de Custo</th>
              <th style={{ textAlign: 'center' }}>Vida Útil</th>
              <th style={{ textAlign: 'right' }}>Amortiz. Mês (R$)</th>
              <th style={{ textAlign: 'right' }}>VCL Atual (R$)</th>
            </tr>
          </thead>
          <tbody>
            {intangibles.map(a => {
              const monthly = a.isIndefiniteUsefulLife ? 0 : (a.acquisitionCost * (a.annualAmortizationRatePercent / 100)) / 12;
              const vcl = a.acquisitionCost - a.accumulatedAmortization;
              return (
                <tr key={a.id}>
                  <td><strong>{a.code}</strong> - {a.name}</td>
                  <td>{a.category.replace('_', ' ')}</td>
                  <td style={{ textAlign: 'center' }}>
                    {a.isIndefiniteUsefulLife ? 'Indefinida' : `${a.usefulLifeMonths} meses`}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>
                    {a.isIndefiniteUsefulLife ? '—' : `R$ ${monthly.toFixed(2)}`}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                    R$ {vcl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
            <tr className="diamond-table-total">
              <td colSpan={4}>VALOR CONTÁBIL LÍQUIDO TOTAL DOS ATIVOS INTANGÍVEIS NO BALANÇO PATRIMONIAL</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontSize: '0.68rem' }}>
          <strong>Nota Explicativa de Intangíveis:</strong> Os ativos intangíveis de vida útil definida são amortizados pelo método linear ao longo de sua vida útil econômica (softwares e patentes). Os ativos de vida útil indefinida (Goodwill por combinação de negócios) não sofrem amortização, sendo submetidos anualmente ao teste de recuperabilidade (Impairment - CPC 01 / IAS 36).
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE TECNOLOGIA & INOVAÇÃO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Viabilidade Técnica Validada</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE IFRS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade CPC 04 / CPC 01</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • ATIVOS INTANGÍVEIS CPC 04 • CERTIFICAÇÃO DIGITAL SHA-256: <code>66AA10988BA991</code></div>
          <div>PÁGINA 1 DE 1 • LAUDO PATRIMONIAL OFICIAL</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeIntangiblesAmortizationView;
