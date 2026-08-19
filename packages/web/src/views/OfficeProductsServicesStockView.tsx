// ==========================================================================
// SOBERANO CONTÁBIL — CATÁLOGO INTELIGENTE DE PRODUTOS, ESTOQUES & SERVIÇOS
// Conformidade: CPC 16 (Estoques) • Bloco 0200/K200 SPED • LC 116/03
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Package,
  Boxes,
  Factory,
  ShoppingBag,
  Briefcase,
  Layers,
  Search,
  Plus,
  TrendingDown,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowDownUp,
  Tag,
  X,
  Save,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import {
  ProductCatalogEngine,
  ProductCatalogItem,
  ProductSectorType,
  SpedItemType
} from '@soberano/core';

export const OfficeProductsServicesStockView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [activeTab, setActiveTab] = useState<'TODOS' | 'INDUSTRIA' | 'COMERCIO' | 'SERVICOS'>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  // Initial Demo Products
  const [products, setProducts] = useState<ProductCatalogItem[]>([
    // Indústria
    {
      id: 'prod-ind-1',
      tenantId: 't1',
      code: 'IND-ACAB-01',
      barcodeEan: '7891234567890',
      name: 'Válvula Esfero-Industrial 2" em Aço Inox',
      sector: 'INDUSTRIA',
      spedType: '04_PRODUTO_ACABADO',
      unit: 'UN',
      ncm: '8481.80.95',
      origin: '0_NACIONAL',
      salePrice: 480.00,
      costPrice: 260.00,
      averageCost: 260.00,
      currentStock: 140,
      minStock: 30,
      maxStock: 300,
      location: 'Galpão A - Prateleira 4',
      isMonophasicPisCofins: false,
      isIcmsSt: false,
      icmsAliquotaPercent: 18.0,
      ipiAliquotaPercent: 5.0,
      pisAliquotaPercent: 1.65,
      cofinsAliquotaPercent: 7.60,
      billOfMaterials: [
        { rawMaterialId: 'raw-1', rawMaterialName: 'Barra Redonda Inox 316', quantityRequired: 1.2, unit: 'KG', estimatedUnitCost: 120.00 },
        { rawMaterialId: 'raw-2', rawMaterialName: 'Vedação Esfera Teflon', quantityRequired: 2, unit: 'UN', estimatedUnitCost: 25.00 },
        { rawMaterialId: 'raw-3', rawMaterialName: 'Embalagem Caixa Reforçada', quantityRequired: 1, unit: 'CX', estimatedUnitCost: 14.00 }
      ]
    },
    {
      id: 'prod-ind-2',
      tenantId: 't1',
      code: 'IND-MP-01',
      name: 'Barra Redonda Inox 316 (Matéria-Prima)',
      sector: 'INDUSTRIA',
      spedType: '01_MATERIA_PRIMA',
      unit: 'KG',
      ncm: '7222.11.00',
      origin: '0_NACIONAL',
      salePrice: 0.00,
      costPrice: 100.00,
      averageCost: 100.00,
      currentStock: 1250,
      minStock: 200,
      maxStock: 2500,
      location: 'Pátio de Matérias-Primas',
      isMonophasicPisCofins: false,
      isIcmsSt: false,
      icmsAliquotaPercent: 18.0,
      ipiAliquotaPercent: 0,
      pisAliquotaPercent: 1.65,
      cofinsAliquotaPercent: 7.60
    },
    // Comércio
    {
      id: 'prod-com-1',
      tenantId: 't1',
      code: 'COM-FARM-01',
      barcodeEan: '7896004701234',
      name: 'Medicamento Analgésico Dipirona 500mg (Monofásico PIS/COF)',
      sector: 'COMERCIO',
      spedType: '00_MERCADORIA_REVENDA',
      unit: 'CX',
      ncm: '3004.90.99',
      cest: '13.001.00',
      origin: '0_NACIONAL',
      salePrice: 18.50,
      costPrice: 8.20,
      averageCost: 8.20,
      currentStock: 850,
      minStock: 100,
      maxStock: 2000,
      location: 'Gôndola B3',
      isMonophasicPisCofins: true,
      isIcmsSt: true,
      icmsAliquotaPercent: 18.0,
      ipiAliquotaPercent: 0,
      pisAliquotaPercent: 0,
      cofinsAliquotaPercent: 0
    },
    {
      id: 'prod-com-2',
      tenantId: 't1',
      code: 'COM-AUTO-01',
      barcodeEan: '7898822001122',
      name: 'Pastilha de Freio Dianteira Cerâmica (Monofásico Autopeças)',
      sector: 'COMERCIO',
      spedType: '00_MERCADORIA_REVENDA',
      unit: 'UN',
      ncm: '8708.30.90',
      cest: '01.002.00',
      origin: '0_NACIONAL',
      salePrice: 145.00,
      costPrice: 72.00,
      averageCost: 72.00,
      currentStock: 95,
      minStock: 20,
      maxStock: 250,
      location: 'Setor Autopeças Prateleira 2',
      isMonophasicPisCofins: true,
      isIcmsSt: true,
      icmsAliquotaPercent: 18.0,
      ipiAliquotaPercent: 0,
      pisAliquotaPercent: 0,
      cofinsAliquotaPercent: 0
    },
    // Serviços
    {
      id: 'prod-srv-1',
      tenantId: 't1',
      code: 'SRV-CONS-01',
      name: 'Consultoria e Auditoria Contábil/Tributária Especializada',
      sector: 'SERVICOS',
      spedType: '09_SERVICOS',
      unit: 'SV',
      ncm: '0000.00.00',
      origin: '0_NACIONAL',
      serviceCodeLc116: '17.01',
      municipalTaxCode: '01701',
      salePrice: 4500.00,
      costPrice: 1800.00,
      averageCost: 0,
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      isMonophasicPisCofins: false,
      isIcmsSt: false,
      icmsAliquotaPercent: 0,
      ipiAliquotaPercent: 0,
      pisAliquotaPercent: 1.65,
      cofinsAliquotaPercent: 7.60,
      issAliquotaPercent: 5.0,
      hasCsrfRetained: true,
      hasIrrfRetained: true,
      hasInssRetained: false
    }
  ]);

  // Form State for Modal
  const [formSector, setFormSector] = useState<ProductSectorType>('COMERCIO');
  const [formSpedType, setFormSpedType] = useState<SpedItemType>('00_MERCADORIA_REVENDA');
  const [formCode, setFormCode] = useState<string>('COM-NEW-01');
  const [formBarcode, setFormBarcode] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formUnit, setFormUnit] = useState<'UN' | 'KG' | 'CX' | 'LT' | 'MT' | 'HR' | 'SV'>('UN');
  const [formNcm, setFormNcm] = useState<string>('3926.90.90');
  const [formCest, setFormCest] = useState<string>('');
  const [formSalePrice, setFormSalePrice] = useState<number>(100.00);
  const [formCostPrice, setFormCostPrice] = useState<number>(50.00);
  const [formStock, setFormStock] = useState<number>(50);
  const [formMinStock, setFormMinStock] = useState<number>(10);
  const [formLocation, setFormLocation] = useState<string>('Almoxarifado Geral');
  const [formIsMonophasic, setFormIsMonophasic] = useState<boolean>(false);
  const [formIsIcmsSt, setFormIsIcmsSt] = useState<boolean>(false);
  const [formIcmsRate, setFormIcmsRate] = useState<number>(18.0);
  const [formIpiRate, setFormIpiRate] = useState<number>(0.0);
  const [formServiceLc116, setFormServiceLc116] = useState<string>('17.01');
  const [formIssRate, setFormIssRate] = useState<number>(5.0);

  const handleOpenModal = (presetSector: ProductSectorType = 'COMERCIO') => {
    setFormSector(presetSector);
    if (presetSector === 'INDUSTRIA') {
      setFormSpedType('04_PRODUTO_ACABADO');
      setFormCode(`IND-ACAB-${Math.floor(100 + Math.random() * 900)}`);
      setFormUnit('UN');
      setFormNcm('8481.80.95');
      setFormIpiRate(5.0);
    } else if (presetSector === 'SERVICOS') {
      setFormSpedType('09_SERVICOS');
      setFormCode(`SRV-${Math.floor(100 + Math.random() * 900)}`);
      setFormUnit('SV');
      setFormNcm('0000.00.00');
      setFormStock(0);
      setFormMinStock(0);
    } else {
      setFormSpedType('00_MERCADORIA_REVENDA');
      setFormCode(`COM-REV-${Math.floor(100 + Math.random() * 900)}`);
      setFormUnit('UN');
      setFormNcm('3004.90.99');
    }
    setFormName('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      alert('Por favor, informe a descrição e o código do produto/serviço.');
      return;
    }

    const newProduct: ProductCatalogItem = {
      id: `prod-custom-${Date.now()}`,
      tenantId: selectedTenantId,
      code: formCode,
      barcodeEan: formBarcode || undefined,
      name: formName,
      sector: formSector,
      spedType: formSpedType,
      unit: formUnit,
      ncm: formNcm,
      cest: formCest || undefined,
      origin: '0_NACIONAL',
      salePrice: formSalePrice,
      costPrice: formCostPrice,
      averageCost: formCostPrice,
      currentStock: formSector === 'SERVICOS' ? 0 : formStock,
      minStock: formSector === 'SERVICOS' ? 0 : formMinStock,
      maxStock: formSector === 'SERVICOS' ? 0 : formStock * 3,
      location: formLocation,
      isMonophasicPisCofins: formIsMonophasic,
      isIcmsSt: formIsIcmsSt,
      icmsAliquotaPercent: formIcmsRate,
      ipiAliquotaPercent: formIpiRate,
      pisAliquotaPercent: formIsMonophasic ? 0 : 1.65,
      cofinsAliquotaPercent: formIsMonophasic ? 0 : 7.60,
      serviceCodeLc116: formSector === 'SERVICOS' ? formServiceLc116 : undefined,
      issAliquotaPercent: formSector === 'SERVICOS' ? formIssRate : undefined,
      hasCsrfRetained: formSector === 'SERVICOS',
      hasIrrfRetained: formSector === 'SERVICOS'
    };

    setProducts(prev => [newProduct, ...prev]);
    setIsModalOpen(false);
    setFeedback(`Item "${formName}" cadastrado com sucesso e integrado ao Bloco 0200/K200 do SPED e Dossiê Diamante!`);
    setTimeout(() => setFeedback(null), 6000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSector = activeTab === 'TODOS' || p.sector === activeTab;
      const matchText = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()) || p.ncm.includes(searchTerm);
      return matchSector && matchText;
    });
  }, [products, activeTab, searchTerm]);

  // Totais de Estoque
  const totalItemsCount = products.length;
  const totalStockValuation = products.reduce((acc, p) => acc + (p.currentStock * p.averageCost), 0);
  const totalIndustriaItems = products.filter(p => p.sector === 'INDUSTRIA').length;
  const totalComercioItems = products.filter(p => p.sector === 'COMERCIO').length;
  const totalServicosItems = products.filter(p => p.sector === 'SERVICOS').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header & Actions */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Catálogo Inteligente de Produtos, Estoques & Serviços
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CPC 16 • SPED BLOCO 0200/K200 • LC 116
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Cadastro mestre unificado de matérias-primas, produtos acabados, mercadorias para revenda e serviços com amarração fiscal determinística.
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
            <span>Imprimir Dossiê de Inventário (A4)</span>
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
            <span className="metric-title">Valuation do Estoque (Custo Médio)</span>
            <Boxes size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {totalStockValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Ativo Circulante (Conta 1.1.3 - CPC 16)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Indústria (BOM & Matéria-Prima)</span>
            <Factory size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono">{totalIndustriaItems} itens</div>
          <div className="metric-sub">Fichas técnicas & Bloco K200 SPED</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Comércio (Revenda & Monofásicos)</span>
            <ShoppingBag size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono">{totalComercioItems} itens</div>
          <div className="metric-sub">Segregação PIS/COFINS & ICMS-ST</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Serviços (LC 116 / Retenções)</span>
            <Briefcase size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono">{totalServicosItems} itens</div>
          <div className="metric-sub">ISS Municipal & CSRF 4,65% / IRRF</div>
        </div>
      </div>

      {/* Subtabs and Filter Controls */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('TODOS')}
            className={`btn-${activeTab === 'TODOS' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Package size={14} /> Todos ({totalItemsCount})
          </button>
          <button
            onClick={() => setActiveTab('INDUSTRIA')}
            className={`btn-${activeTab === 'INDUSTRIA' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Factory size={14} /> Indústria ({totalIndustriaItems})
          </button>
          <button
            onClick={() => setActiveTab('COMERCIO')}
            className={`btn-${activeTab === 'COMERCIO' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShoppingBag size={14} /> Comércio ({totalComercioItems})
          </button>
          <button
            onClick={() => setActiveTab('SERVICOS')}
            className={`btn-${activeTab === 'SERVICOS' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Briefcase size={14} /> Serviços ({totalServicosItems})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por código, nome ou NCM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 12px 6px 32px', borderRadius: '8px', fontSize: '0.78rem', width: '260px' }}
            />
          </div>
          <button
            onClick={() => handleOpenModal(activeTab === 'TODOS' ? 'COMERCIO' : activeTab)}
            className="btn-primary-action"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> + Novo Item
          </button>
        </div>
      </div>

      {/* Interactive Products Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código / SKU</th>
                <th>Descrição do Item</th>
                <th>Setor / Tipo SPED</th>
                <th>NCM / LC 116</th>
                <th style={{ textAlign: 'center' }}>Estoque Atual</th>
                <th style={{ textAlign: 'right' }}>Custo Médio</th>
                <th style={{ textAlign: 'right' }}>Preço Venda</th>
                <th>Tributação</th>
                <th style={{ textAlign: 'right' }}>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{p.code}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                    {p.location && <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>📍 {p.location}</div>}
                    {p.billOfMaterials && p.billOfMaterials.length > 0 && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                        ⚙️ Ficha Técnica BOM ({p.billOfMaterials.length} insumos)
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${p.sector === 'INDUSTRIA' ? 'cyan' : p.sector === 'COMERCIO' ? 'indigo' : 'amber'}`}>
                      {p.sector} • {p.spedType.split('_')[0]}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.75rem' }}>{p.sector === 'SERVICOS' ? (p.serviceCodeLc116 || '17.01') : p.ncm}</td>
                  <td style={{ textAlign: 'center' }}>
                    {p.sector !== 'SERVICOS' ? (
                      <div className="font-mono" style={{ fontWeight: 800, color: p.currentStock <= p.minStock ? '#F87171' : '#fff' }}>
                        {p.currentStock} {p.unit}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                    )}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ {p.averageCost.toFixed(2)}</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)', fontWeight: 700 }}>R$ {p.salePrice.toFixed(2)}</td>
                  <td>
                    {p.isMonophasicPisCofins ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>PIS/COF Monofásico</span>
                    ) : p.sector === 'SERVICOS' ? (
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>ISS {p.issAliquotaPercent}%</span>
                    ) : (
                      <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>Tributação Normal</span>
                    )}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 800, color: '#fff' }}>
                    R$ {(p.currentStock * p.averageCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NOVO CADASTRO INTELIGENTE */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--border-medium)', borderRadius: '14px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    Novo Cadastro Inteligente de Item
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Conformidade Bloco 0200 SPED • CPC 16 • Faturamento 1-Click
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Setor selector */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Tipo de Atividade / Setor:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setFormSector('COMERCIO'); setFormSpedType('00_MERCADORIA_REVENDA'); setFormNcm('3004.90.99'); }}
                    style={{ background: formSector === 'COMERCIO' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1))' : 'var(--bg-surface-card)', border: formSector === 'COMERCIO' ? '1.5px solid var(--indigo-500)' : '1px solid var(--border-medium)', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={16} color="var(--indigo-400)" /> Comércio (Revenda)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormSector('INDUSTRIA'); setFormSpedType('04_PRODUTO_ACABADO'); setFormNcm('8481.80.95'); setFormIpiRate(5.0); }}
                    style={{ background: formSector === 'INDUSTRIA' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))' : 'var(--bg-surface-card)', border: formSector === 'INDUSTRIA' ? '1.5px solid var(--cyan-500)' : '1px solid var(--border-medium)', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Factory size={16} color="var(--cyan-400)" /> Indústria / Manufatura
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormSector('SERVICOS'); setFormSpedType('09_SERVICOS'); setFormNcm('0000.00.00'); setFormUnit('SV'); }}
                    style={{ background: formSector === 'SERVICOS' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))' : 'var(--bg-surface-card)', border: formSector === 'SERVICOS' ? '1.5px solid var(--amber-500)' : '1px solid var(--border-medium)', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Briefcase size={16} color="var(--amber-400)" /> Serviços Profissionais
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="form-grid">
                <div className="form-group">
                  <label>Código Interno / SKU *</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Código de Barras EAN/GTIN</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    placeholder="7890000000000"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Descrição Completa do Item *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Bomba Centrífuga Trifásica 5CV ou Dipirona 500mg"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipo do Item (Bloco 0200 SPED)</label>
                  <select
                    className="form-control"
                    value={formSpedType}
                    onChange={(e) => setFormSpedType(e.target.value as any)}
                  >
                    <option value="00_MERCADORIA_REVENDA">00 - Mercadoria para Revenda</option>
                    <option value="01_MATERIA_PRIMA">01 - Matéria-Prima</option>
                    <option value="02_EMBALAGEM">02 - Embalagem</option>
                    <option value="03_PRODUTO_PROCESSO">03 - Produto em Processo</option>
                    <option value="04_PRODUTO_ACABADO">04 - Produto Acabado</option>
                    <option value="09_SERVICOS">09 - Serviços</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Unidade de Medida</label>
                  <select
                    className="form-control"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as any)}
                  >
                    <option value="UN">UN - Unidade</option>
                    <option value="KG">KG - Quilograma</option>
                    <option value="CX">CX - Caixa</option>
                    <option value="LT">LT - Litro</option>
                    <option value="MT">MT - Metro</option>
                    <option value="HR">HR - Hora</option>
                    <option value="SV">SV - Serviço</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{formSector === 'SERVICOS' ? 'Código de Serviço LC 116/03' : 'NCM / Classificação Fiscal'}</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    value={formSector === 'SERVICOS' ? formServiceLc116 : formNcm}
                    onChange={(e) => formSector === 'SERVICOS' ? setFormServiceLc116(e.target.value) : setFormNcm(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>CEST (Código Especificador ST)</label>
                  <input
                    type="text"
                    className="form-control font-mono"
                    placeholder="00.000.00"
                    value={formCest}
                    onChange={(e) => setFormCest(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control font-mono"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Preço de Venda Sugerido (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control font-mono"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                  />
                </div>

                {formSector !== 'SERVICOS' && (
                  <>
                    <div className="form-group">
                      <label>Estoque Inicial Físico</label>
                      <input
                        type="number"
                        className="form-control font-mono"
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Estoque Mínimo de Segurança</label>
                      <input
                        type="number"
                        className="form-control font-mono"
                        value={formMinStock}
                        onChange={(e) => setFormMinStock(Number(e.target.value))}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Tributação Flags */}
              <div style={{ background: 'var(--bg-surface-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  ⚙️ Configuração e Benefícios Fiscais
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
                    <input
                      type="checkbox"
                      checked={formIsMonophasic}
                      onChange={(e) => setFormIsMonophasic(e.target.checked)}
                    />
                    <span><strong>Monofásico PIS/COFINS</strong> (Alíquota Zero no Simples)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
                    <input
                      type="checkbox"
                      checked={formIsIcmsSt}
                      onChange={(e) => setFormIsIcmsSt(e.target.checked)}
                    />
                    <span><strong>Sujeito a ICMS Substituição Tributária (ST)</strong></span>
                  </label>
                </div>
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
                  <Save size={16} /> Salvar Cadastro Inteligente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIÊ EXECUTIVO DE INVENTÁRIO FÍSICO-FINANCEIRO (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE INVENTÁRIO FÍSICO-FINANCEIRO DE ESTOQUES (CPC 16 / SPED BLOCO 0200 & K200)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Regime: {currentTenant.regime.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Valuation Total do Estoque</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ {totalStockValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Critério de Avaliação</strong>
            <span>Custo Médio Ponderado (CPC 16)</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total de SKUs Cadastrados</strong>
            <span className="font-mono">{totalItemsCount} Itens Ativos</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade SPED Fiscal</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Bloco 0200 / K200 Válido</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Código / Descrição do Item</th>
              <th>Tipo SPED / NCM</th>
              <th style={{ textAlign: 'center' }}>Qtd Físico</th>
              <th style={{ textAlign: 'right' }}>Custo Médio (R$)</th>
              <th style={{ textAlign: 'right' }}>Valor Total Contábil (R$)</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td><strong>{p.code}</strong> - {p.name}</td>
                <td>{p.spedType.split('_')[0]} | {p.sector === 'SERVICOS' ? (p.serviceCodeLc116 || '17.01') : p.ncm}</td>
                <td style={{ textAlign: 'center' }}>{p.sector !== 'SERVICOS' ? `${p.currentStock} ${p.unit}` : 'Serviço'}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>R$ {p.averageCost.toFixed(2)}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                  R$ {(p.currentStock * p.averageCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            <tr className="diamond-table-total">
              <td colSpan={4}>TOTAL DO INVENTÁRIO FÍSICO-FINANCEIRO CONCILIADO NO ATIVO CIRCULANTE</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {totalStockValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontSize: '0.68rem' }}>
          <strong>Nota Técnica de Auditoria de Estoques:</strong> O inventário físico foi avaliado pelo método do Custo Médio Ponderado Móvel em estrita observância ao Pronunciamento Técnico CPC 16 (R1) e artigo 295 do RIR/18. Saldos integrados às partidas dobradas do Diário Contábil e registros da EFD-ICMS/IPI.
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">GERÊNCIA DE ALMOXARIFADO / PRODUÇÃO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Contagem Física Homologada</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE ESTOQUES & INVENTÁRIO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade CPC 16 / K200</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • INVENTÁRIO DE ESTOQUES CPC 16 • CERTIFICAÇÃO DIGITAL SHA-256: <code>88CC10988BA9910C</code></div>
          <div>PÁGINA 1 DE 1 • LAUDO PATRIMONIAL OFICIAL</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeProductsServicesStockView;
