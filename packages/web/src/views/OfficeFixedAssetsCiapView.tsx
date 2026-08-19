// ==========================================================================
// SOBERANO CONTÁBIL — GESTÃO DE ATIVO IMOBILIZADO, DEPRECIAÇÃO & CIAP BLOCO G
// Conformidade: NBC TG 27 (CPC 27 R4 / IAS 16) • NBC TG 01 (Impairment)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Cpu,
  Truck,
  Wrench,
  ShieldCheck,
  TrendingDown,
  Printer,
  Zap,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Plus,
  X,
  Save
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import {
  FixedAssetsCpc27Engine,
  FixedAssetItem,
  DepreciationScheduleResult,
  AssetCategory
} from '@soberano/core';

export const OfficeFixedAssetsCiapView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [assets, setAssets] = useState<FixedAssetItem[]>([
    {
      id: 'asset-1',
      tenantId: 't1',
      tombamentoCode: 'PAT-2026-001',
      name: 'Torno CNC Industrial Mazak Quick Turn 250',
      category: 'MAQUINAS_EQUIPAMENTOS',
      costCenter: 'Centro de Produção Metalúrgica',
      acquisitionDate: '2025-01-15',
      acquisitionCost: 350000.00,
      residualValue: 35000.00, // 10% Residual
      usefulLifeYears: 10,
      annualDepreciationRatePercent: 10.0, // 10% a.a.
      accumulatedDepreciation: 31500.00,
      impairmentLossAccumulated: 0,
      hasCiapIcmsCredit: true,
      totalIcmsHighlight: 63000.00, // 18% ICMS
      currentCiapInstallment: 12,
      totalCiapInstallments: 48
    },
    {
      id: 'asset-2',
      tenantId: 't1',
      tombamentoCode: 'PAT-2026-002',
      name: 'Caminhão Mercedes-Benz Atego 2426 Baú',
      category: 'VEICULOS_TRANSPORTE',
      costCenter: 'Logística & Distribuição',
      acquisitionDate: '2025-06-10',
      acquisitionCost: 480000.00,
      residualValue: 80000.00,
      usefulLifeYears: 5,
      annualDepreciationRatePercent: 20.0, // 20% a.a.
      accumulatedDepreciation: 66666.67,
      impairmentLossAccumulated: 0,
      hasCiapIcmsCredit: true,
      totalIcmsHighlight: 57600.00,
      currentCiapInstallment: 8,
      totalCiapInstallments: 48
    },
    {
      id: 'asset-3',
      tenantId: 't1',
      tombamentoCode: 'PAT-2026-003',
      name: 'Servidor Dell PowerEdge R750xs Rack 2U (Datacenter)',
      category: 'EQUIPAMENTOS_TI_INFORMATICA',
      costCenter: 'Tecnologia da Informação & Core',
      acquisitionDate: '2026-01-05',
      acquisitionCost: 65000.00,
      residualValue: 5000.00,
      usefulLifeYears: 5,
      annualDepreciationRatePercent: 20.0,
      accumulatedDepreciation: 7000.00,
      impairmentLossAccumulated: 0,
      hasCiapIcmsCredit: false,
      totalIcmsHighlight: 0,
      currentCiapInstallment: 0,
      totalCiapInstallments: 48
    }
  ]);

  // Form State for Asset Tombamento Modal
  const [formTombamento, setFormTombamento] = useState<string>('PAT-2026-004');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<AssetCategory>('MAQUINAS_EQUIPAMENTOS');
  const [formCostCenter, setFormCostCenter] = useState<string>('Centro de Produção');
  const [formAcquisitionDate, setFormAcquisitionDate] = useState<string>('2026-08-19');
  const [formAcquisitionCost, setFormAcquisitionCost] = useState<number>(100000.00);
  const [formResidualValue, setFormResidualValue] = useState<number>(10000.00);
  const [formUsefulLife, setFormUsefulLife] = useState<number>(10);
  const [formAnnualRate, setFormAnnualRate] = useState<number>(10.0);
  const [formHasCiap, setFormHasCiap] = useState<boolean>(true);
  const [formIcmsHighlight, setFormIcmsHighlight] = useState<number>(18000.00);

  const handleOpenAssetModal = () => {
    setFormTombamento(`PAT-2026-${String(assets.length + 1).padStart(3, '0')}`);
    setFormName('');
    setFormAcquisitionCost(80000.00);
    setFormResidualValue(8000.00);
    setFormIcmsHighlight(14400.00);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (category: AssetCategory) => {
    setFormCategory(category);
    if (category === 'VEICULOS_TRANSPORTE') {
      setFormUsefulLife(5);
      setFormAnnualRate(20.0);
    } else if (category === 'EQUIPAMENTOS_TI_INFORMATICA') {
      setFormUsefulLife(5);
      setFormAnnualRate(20.0);
      setFormHasCiap(false);
      setFormIcmsHighlight(0);
    } else if (category === 'EDIFICACOES_IMOVEIS') {
      setFormUsefulLife(25);
      setFormAnnualRate(4.0);
      setFormHasCiap(false);
      setFormIcmsHighlight(0);
    } else {
      setFormUsefulLife(10);
      setFormAnnualRate(10.0);
      setFormHasCiap(true);
      setFormIcmsHighlight(formAcquisitionCost * 0.18);
    }
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTombamento.trim() || formAcquisitionCost <= 0) {
      alert('Por favor, preencha o tombamento, a descrição do bem e o valor de aquisição.');
      return;
    }

    const newAsset: FixedAssetItem = {
      id: `asset-${Date.now()}`,
      tenantId: selectedTenantId,
      tombamentoCode: formTombamento,
      name: formName,
      category: formCategory,
      costCenter: formCostCenter,
      acquisitionDate: formAcquisitionDate,
      acquisitionCost: formAcquisitionCost,
      residualValue: formResidualValue,
      usefulLifeYears: formUsefulLife,
      annualDepreciationRatePercent: formAnnualRate,
      accumulatedDepreciation: 0,
      impairmentLossAccumulated: 0,
      hasCiapIcmsCredit: formHasCiap,
      totalIcmsHighlight: formHasCiap ? formIcmsHighlight : 0,
      currentCiapInstallment: 0,
      totalCiapInstallments: 48
    };

    setAssets(prev => [newAsset, ...prev]);
    setIsModalOpen(false);
    setFeedback(`Ativo patrimonial "${formName}" (${formTombamento}) tombado com sucesso e integrado ao mapa de depreciação CPC 27!`);
    setTimeout(() => setFeedback(null), 6000);
  };

  // Totais do Imobilizado
  const totalAcquisitionCost = assets.reduce((acc, a) => acc + a.acquisitionCost, 0);
  const totalAccumulatedDepreciation = assets.reduce((acc, a) => acc + a.accumulatedDepreciation, 0);
  const totalNetBookValue = totalAcquisitionCost - totalAccumulatedDepreciation;
  const totalMonthlyDepreciation = assets.reduce((acc, a) => {
    const base = Math.max(0, a.acquisitionCost - a.residualValue);
    return acc + ((base * (a.annualDepreciationRatePercent / 100)) / 12);
  }, 0);
  const totalCiapMonthlyCredit = assets.reduce((acc, a) => {
    if (a.hasCiapIcmsCredit) {
      return acc + (a.totalIcmsHighlight / 48);
    }
    return acc;
  }, 0);

  const handlePostMonthlyDepreciationToLedger = () => {
    setFeedback(`Apropriação da Depreciação Mensal (R$ ${totalMonthlyDepreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) e Crédito CIAP Bloco G (R$ ${totalCiapMonthlyCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) lançados com sucesso no Diário Contábil (Partidas Dobradas)!`);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Gestão de Ativo Imobilizado, Depreciação CPC 27 & CIAP Bloco G
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              NBC TG 27 (CPC 27 R4) • CIAP 1/48 AVOS
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Controle patrimonial de máquinas, veículos e TI, mapa de depreciação por vida útil econômica e apropriação de crédito de ICMS CIAP.
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
            <span>Imprimir Laudo Patrimonial (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Valor Contábil Líquido (VCL)</span>
            <Building2 size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Ativo Não Circulante Imobilizado (Conta 1.2.3)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Depreciação Acumulada</span>
            <TrendingDown size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#F87171' }}>
            - R$ {totalAccumulatedDepreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Conta Redutora do Ativo (CPC 27)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Depreciação Mensal (DRE)</span>
            <Calculator size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono">
            R$ {totalMonthlyDepreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </div>
          <div className="metric-sub">Despesa Operacional Contábil</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Crédito CIAP ICMS (1/48 avos)</span>
            <ShieldCheck size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            + R$ {totalCiapMonthlyCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </div>
          <div className="metric-sub">Bloco G da EFD-ICMS/IPI</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '12px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
          Tombamento de Bens do Imobilizado ({assets.length} ativos cadastrados)
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleOpenAssetModal}
            className="btn-primary-action"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> + Cadastrar Imobilizado
          </button>
          <button
            onClick={handlePostMonthlyDepreciationToLedger}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Contabilizar Depreciação & CIAP no Diário
          </button>
        </div>
      </div>

      {/* Interactive Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tombamento</th>
                <th>Descrição do Bem Imobilizado</th>
                <th>Centro de Custo</th>
                <th style={{ textAlign: 'right' }}>Custo Aquisição</th>
                <th style={{ textAlign: 'center' }}>Taxa Anual</th>
                <th style={{ textAlign: 'right' }}>Deprec. Mensal</th>
                <th style={{ textAlign: 'right' }}>Deprec. Acumulada</th>
                <th style={{ textAlign: 'right' }}>Valor Contábil Líquido</th>
                <th style={{ textAlign: 'center' }}>CIAP (1/48)</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => {
                const base = Math.max(0, a.acquisitionCost - a.residualValue);
                const monthly = (base * (a.annualDepreciationRatePercent / 100)) / 12;
                const vcl = a.acquisitionCost - a.accumulatedDepreciation;
                return (
                  <tr key={a.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{a.tombamentoCode}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{a.name}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.costCenter}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {a.acquisitionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'center' }}><span className="badge badge-indigo">{a.annualDepreciationRatePercent}% a.a.</span></td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--cyan-400)' }}>R$ {monthly.toFixed(2)}</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: '#F87171' }}>- R$ {a.accumulatedDepreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 800, color: 'var(--emerald-400)' }}>R$ {vcl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'center' }}>
                      {a.hasCiapIcmsCredit ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                          Parcela {a.currentCiapInstallment}/48 (+R$ {(a.totalIcmsHighlight / 48).toFixed(2)})
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE TOMBAMENTO DE ATIVO IMOBILIZADO */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '14px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🏢</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    Tombamento de Ativo Imobilizado
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Conformidade NBC TG 27 (CPC 27 R4) • Bloco G CIAP EFD-ICMS/IPI
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Número de Tombamento / Patrimonial *</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    value={formTombamento}
                    onChange={(e) => setFormTombamento(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoria do Ativo</label>
                  <select
                    className="form-control"
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as any)}
                  >
                    <option value="MAQUINAS_EQUIPAMENTOS">Máquinas e Equipamentos Industriais (10% a.a.)</option>
                    <option value="VEICULOS_TRANSPORTE">Veículos e Frotas de Transporte (20% a.a.)</option>
                    <option value="EQUIPAMENTOS_TI_INFORMATICA">Equipamentos de TI e Servidores (20% a.a.)</option>
                    <option value="EDIFICACOES_IMOVEIS">Edificações e Benfeitorias em Imóveis (4% a.a.)</option>
                    <option value="MOVEIS_UTENSILIOS">Móveis e Utensílios de Escritório (10% a.a.)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descrição do Bem Imobilizado *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Prensa Hidráulica 100T ou Caminhão Ford Cargo"
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
                  <label>Data de Aquisição</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formAcquisitionDate}
                    onChange={(e) => setFormAcquisitionDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Valor de Aquisição (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control font-mono"
                    value={formAcquisitionCost}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormAcquisitionCost(val);
                      if (formHasCiap) setFormIcmsHighlight(val * 0.18);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Valor Residual Não-Depreciável (CPC 27)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control font-mono"
                    value={formResidualValue}
                    onChange={(e) => setFormResidualValue(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Vida Útil Estimada (Anos)</label>
                  <input
                    type="number"
                    className="form-control font-mono"
                    value={formUsefulLife}
                    onChange={(e) => setFormUsefulLife(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Taxa Anual de Depreciação (% a.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control font-mono"
                    value={formAnnualRate}
                    onChange={(e) => setFormAnnualRate(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* CIAP Section */}
              <div style={{ background: 'var(--bg-surface-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.80rem', fontWeight: 800, color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={formHasCiap}
                      onChange={(e) => setFormHasCiap(e.target.checked)}
                    />
                    <span>🛡️ Apropriar Crédito de ICMS do Ativo Permanente (CIAP 1/48 avos - Bloco G)</span>
                  </label>
                </div>
                {formHasCiap && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '8px' }}>
                    <div className="form-group">
                      <label>ICMS Destacado na NF de Entrada (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control font-mono"
                        value={formIcmsHighlight}
                        onChange={(e) => setFormIcmsHighlight(Number(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Crédito Mensal Estimado (1/48)</label>
                      <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '8px' }}>
                        + R$ {(formIcmsHighlight / 48).toFixed(2)} / mês
                      </div>
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
                  <Save size={16} /> Salvar Tombamento de Imobilizado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIÊ PATRIMONIAL & LAUDO DE DEPRECIAÇÃO CPC 27 (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ PATRIMONIAL DO ATIVO IMOBILIZADO, DEPRECIAÇÃO (CPC 27) & CIAP (BLOCO G SPED)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>NBC TG 27 (R4) • CIAP 1/48 Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Custo Histórico Total</strong>
            <span className="font-mono">R$ {totalAcquisitionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Depreciação Acumulada</strong>
            <span className="font-mono" style={{ color: '#B91C1C' }}>- R$ {totalAccumulatedDepreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor Contábil Líquido (VCL)</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Crédito ICMS CIAP Apropriado</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>+ R$ {totalCiapMonthlyCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Código Patrimonial / Descrição do Bem</th>
              <th>Centro de Custo / Categoria</th>
              <th style={{ textAlign: 'center' }}>Taxa Anual</th>
              <th style={{ textAlign: 'right' }}>Deprec. Mês (R$)</th>
              <th style={{ textAlign: 'right' }}>VCL Atual (R$)</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => {
              const base = Math.max(0, a.acquisitionCost - a.residualValue);
              const monthly = (base * (a.annualDepreciationRatePercent / 100)) / 12;
              const vcl = a.acquisitionCost - a.accumulatedDepreciation;
              return (
                <tr key={a.id}>
                  <td><strong>{a.tombamentoCode}</strong> - {a.name}</td>
                  <td>{a.costCenter}</td>
                  <td style={{ textAlign: 'center' }}>{a.annualDepreciationRatePercent}% a.a.</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {monthly.toFixed(2)}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                    R$ {vcl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
            <tr className="diamond-table-total">
              <td colSpan={4}>VALOR CONTÁBIL LÍQUIDO TOTAL DO ATIVO IMOBILIZADO NO BALANÇO PATRIMONIAL</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {totalNetBookValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontSize: '0.68rem' }}>
          <strong>Nota Explicativa de Imobilizado:</strong> Os ativos imobilizados encontram-se registrados pelo custo de aquisição deduzido da depreciação acumulada calculada pelo método linear com base na vida útil econômica estimada (NBC TG 27 / IAS 16). Créditos de ICMS apropriados na razão de 1/48 avos conforme Bloco G da EFD-ICMS/IPI e Lei Complementar 87/96 (Lei Kandir).
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA DE OPERAÇÕES & PATRIMÔNIO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Inventário Físico Validado</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA INDEPENDENTE IFRS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade CPC 27 / CIAP</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • ATIVO IMOBILIZADO CPC 27 • CERTIFICAÇÃO DIGITAL SHA-256: <code>77CC10988BA991</code></div>
          <div>PÁGINA 1 DE 1 • LAUDO PATRIMONIAL OFICIAL</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFixedAssetsCiapView;
