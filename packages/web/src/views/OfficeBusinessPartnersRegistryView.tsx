import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Printer,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export type PartnerType = 'CLIENTE' | 'FORNECEDOR' | 'AMBOS' | 'TRANSPORTADORA';

export interface BusinessPartner {
  id: string;
  name: string; // Razão Social
  tradeName: string; // Nome Fantasia
  docType: 'CNPJ' | 'CPF';
  documentNumber: string;
  stateRegistration: string; // Inscrição Estadual
  municipalRegistration?: string;
  partnerType: PartnerType;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  taxRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI';
  creditLimit: number;
  status: 'ATIVO' | 'BLOQUEADO' | 'EM_ANALISE';
  cnaePrincipal?: string;
  createdAt: string;
}

export const INITIAL_PARTNERS: BusinessPartner[] = [
  {
    id: 'part-001',
    name: 'INDÚSTRIA METALÚRGICA PAULISTA S/A',
    tradeName: 'Metalúrgica Paulista',
    docType: 'CNPJ',
    documentNumber: '12.345.678/0001-90',
    stateRegistration: '112.345.678.110',
    municipalRegistration: '987.654-3',
    partnerType: 'CLIENTE',
    email: 'fiscal@metalurgicapaulista.com.br',
    phone: '(11) 3456-7890',
    address: {
      street: 'Av. das Indústrias',
      number: '1500',
      neighborhood: 'Distrito Industrial',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04578-000'
    },
    taxRegime: 'LUCRO_REAL',
    creditLimit: 250000.00,
    status: 'ATIVO',
    cnaePrincipal: '25.11-0-00 - Fabricação de estruturas metálicas',
    createdAt: '2026-01-10'
  },
  {
    id: 'part-002',
    name: 'DISTRIBUIDORA DE ALIMENTOS BRASIL LTDA',
    tradeName: 'Brasil Alimentos',
    docType: 'CNPJ',
    documentNumber: '23.456.789/0001-01',
    stateRegistration: '223.456.789.220',
    municipalRegistration: '654.321-0',
    partnerType: 'CLIENTE',
    email: 'nfe@brasilalimentos.com.br',
    phone: '(19) 3876-5432',
    address: {
      street: 'Rua dos Comerciantes',
      number: '450',
      neighborhood: 'Jardim das Américas',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13080-000'
    },
    taxRegime: 'LUCRO_PRESUMIDO',
    creditLimit: 180000.00,
    status: 'ATIVO',
    cnaePrincipal: '46.39-7-01 - Comércio atacadista de produtos alimentícios',
    createdAt: '2026-02-05'
  },
  {
    id: 'part-003',
    name: 'PETROQUÍMICA & POLÍMEROS NACIONAL S/A',
    tradeName: 'Petroquímica Nacional',
    docType: 'CNPJ',
    documentNumber: '34.567.890/0001-12',
    stateRegistration: '334.567.890.330',
    municipalRegistration: '543.210-9',
    partnerType: 'FORNECEDOR',
    email: 'faturamento@petroquimicanacional.com.br',
    phone: '(13) 3210-9876',
    address: {
      street: 'Via Portuária',
      number: '800',
      neighborhood: 'Polo Petroquímico',
      city: 'Santos',
      state: 'SP',
      zipCode: '11015-000'
    },
    taxRegime: 'LUCRO_REAL',
    creditLimit: 500000.00,
    status: 'ATIVO',
    cnaePrincipal: '20.19-3-00 - Fabricação de outros produtos químicos',
    createdAt: '2026-01-15'
  },
  {
    id: 'part-004',
    name: 'COMÉRCIO & VAREJO MODELO LTDA',
    tradeName: 'Modelo Express',
    docType: 'CNPJ',
    documentNumber: '45.678.901/0001-23',
    stateRegistration: '445.678.901.440',
    municipalRegistration: '432.109-8',
    partnerType: 'CLIENTE',
    email: 'compras@modelovarejo.com.br',
    phone: '(21) 2580-1234',
    address: {
      street: 'Av. Rio Branco',
      number: '120',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-001'
    },
    taxRegime: 'SIMPLES_NACIONAL',
    creditLimit: 90000.00,
    status: 'ATIVO',
    cnaePrincipal: '47.12-1-00 - Comércio varejista de mercadorias',
    createdAt: '2026-03-01'
  },
  {
    id: 'part-005',
    name: 'LOGÍSTICA & TRANSPORTES EXPRESS S/A',
    tradeName: 'Express Cargas',
    docType: 'CNPJ',
    documentNumber: '56.789.012/0001-34',
    stateRegistration: '556.789.012.550',
    municipalRegistration: '321.098-7',
    partnerType: 'TRANSPORTADORA',
    email: 'cte@expresscargas.com.br',
    phone: '(41) 3344-5566',
    address: {
      street: 'Rodovia BR-116',
      number: 'Km 105',
      neighborhood: 'Polo Logístico',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '81690-000'
    },
    taxRegime: 'LUCRO_PRESUMIDO',
    creditLimit: 120000.00,
    status: 'ATIVO',
    cnaePrincipal: '49.30-2-02 - Transporte rodoviário de carga intermunicipal',
    createdAt: '2026-02-20'
  }
];

export const OfficeBusinessPartnersRegistryView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id || 'tenant-1');
  const [partners, setPartners] = useState<BusinessPartner[]>(INITIAL_PARTNERS);
  const [activeFilter, setActiveFilter] = useState<'TODOS' | 'CLIENTE' | 'FORNECEDOR' | 'TRANSPORTADORA'>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State para Novo Parceiro
  const [formName, setFormName] = useState<string>('');
  const [formTradeName, setFormTradeName] = useState<string>('');
  const [formDoc, setFormDoc] = useState<string>('');
  const [formIe, setFormIe] = useState<string>('');
  const [formType, setFormType] = useState<PartnerType>('CLIENTE');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('São Paulo');
  const [formState, setFormState] = useState<string>('SP');
  const [formRegime, setFormRegime] = useState<'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'>('LUCRO_REAL');
  const [formLimit, setFormLimit] = useState<number>(100000);

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchType = activeFilter === 'TODOS' || p.partnerType === activeFilter || p.partnerType === 'AMBOS';
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.documentNumber.includes(searchTerm) ||
        p.address.city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [partners, activeFilter, searchTerm]);

  // Contadores
  const totalClientes = partners.filter(p => p.partnerType === 'CLIENTE' || p.partnerType === 'AMBOS').length;
  const totalFornecedores = partners.filter(p => p.partnerType === 'FORNECEDOR' || p.partnerType === 'AMBOS').length;
  const totalTransportadoras = partners.filter(p => p.partnerType === 'TRANSPORTADORA').length;
  const totalLimiteConcedido = partners.reduce((acc, p) => acc + p.creditLimit, 0);

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDoc.trim()) {
      setFeedback('Informe a Razão Social e o CNPJ/CPF do parceiro comercial.');
      return;
    }

    const newPartner: BusinessPartner = {
      id: 'part-' + Date.now(),
      name: formName.trim().toUpperCase(),
      tradeName: formTradeName.trim() || formName.trim(),
      docType: formDoc.length > 14 ? 'CNPJ' : 'CPF',
      documentNumber: formDoc.trim(),
      stateRegistration: formIe.trim() || 'ISENTO',
      partnerType: formType,
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: {
        street: 'Logradouro Cadastrado',
        number: '100',
        neighborhood: 'Centro',
        city: formCity,
        state: formState,
        zipCode: '01001-000'
      },
      taxRegime: formRegime,
      creditLimit: formLimit,
      status: 'ATIVO',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPartners(prev => [newPartner, ...prev]);
    setIsModalOpen(false);
    setFeedback(`Parceiro "${newPartner.name}" cadastrado com sucesso e sincronizado no Emissor de Notas Fiscais!`);
    setTimeout(() => setFeedback(null), 4000);

    // Reset Form
    setFormName('');
    setFormTradeName('');
    setFormDoc('');
    setFormIe('');
    setFormEmail('');
    setFormPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="no-print" style={{ background: 'linear-gradient(180deg, #131E35 0%, #0C1220 100%)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 14px rgba(0, 0, 0, 0.4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>👥</span>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              Central de Clientes, Fornecedores & Parceiros Comerciais
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
              CADASTRO UNIFICADO RFB / SINTEGRA
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.78rem' }}>
            Gestão unificada de tomadores, destinatários, fornecedores e transportadoras integrada ao Emissor de NF-e, Livro Fiscal e Contas a Pagar/Receber.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="control-pod-3d"
            style={{
              padding: '4px 10px',
              background: 'linear-gradient(180deg, #18233C 0%, #0E1528 100%)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              borderBottom: '2px solid rgba(5, 150, 105, 0.6)'
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>🏢</span>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#0F172A', color: '#FFFFFF', fontWeight: 700 }}>
                  {t.name} ({t.regime.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-1click-3d"
            style={{ padding: '6px 14px', fontSize: '0.76rem' }}
          >
            <Plus size={14} />
            <span>Novo Cliente / Fornecedor</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 700 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Clientes Ativos (Tomadores)</span>
            <Building2 size={18} color="#34D399" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#34D399' }}>{totalClientes} cadastros</div>
          <div className="metric-sub">Base ativa para faturamento NF-e/NFS-e</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fornecedores Homologados</span>
            <Users size={18} color="#38BDF8" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#38BDF8' }}>{totalFornecedores} parceiros</div>
          <div className="metric-sub">Entrada de DFe & Contas a Pagar</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Transportadoras (Frete)</span>
            <Truck size={18} color="#A78BFA" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#A78BFA' }}>{totalTransportadoras} ativas</div>
          <div className="metric-sub">CT-e & MDF-e vinculados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Limite de Crédito Total</span>
            <DollarSign size={18} color="#FBBF24" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#FBBF24' }}>
            R$ {totalLimiteConcedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Análise de risco financeiro de clientes</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="no-print" style={{ background: 'linear-gradient(180deg, #131E35 0%, #0C1220 100%)', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveFilter('TODOS')}
            className={`btn-${activeFilter === 'TODOS' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Users size={13} /> Todos ({partners.length})
          </button>
          <button
            onClick={() => setActiveFilter('CLIENTE')}
            className={`btn-${activeFilter === 'CLIENTE' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Building2 size={13} /> Clientes ({totalClientes})
          </button>
          <button
            onClick={() => setActiveFilter('FORNECEDOR')}
            className={`btn-${activeFilter === 'FORNECEDOR' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Users size={13} /> Fornecedores ({totalFornecedores})
          </button>
          <button
            onClick={() => setActiveFilter('TRANSPORTADORA')}
            className={`btn-${activeFilter === 'TRANSPORTADORA' ? 'primary' : 'secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Truck size={13} /> Transportadoras ({totalTransportadoras})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Buscar por Razão Social, CNPJ ou Cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '6px 12px 6px 32px', borderRadius: '8px', fontSize: '0.78rem', width: '280px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Grid de Cards de Parceiros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            style={{
              background: 'linear-gradient(180deg, #141E34 0%, #0B1120 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 3px 10px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>
                    {partner.partnerType === 'CLIENTE' ? '🏢' : partner.partnerType === 'FORNECEDOR' ? '🏭' : partner.partnerType === 'TRANSPORTADORA' ? '🚚' : '🔄'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: partner.partnerType === 'CLIENTE' ? 'rgba(16, 185, 129, 0.2)' : partner.partnerType === 'FORNECEDOR' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(167, 139, 250, 0.2)',
                      color: partner.partnerType === 'CLIENTE' ? '#34D399' : partner.partnerType === 'FORNECEDOR' ? '#38BDF8' : '#A78BFA',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {partner.partnerType}
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  {partner.status}
                </span>
              </div>

              <h3 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                {partner.name}
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '8px' }}>
                {partner.tradeName}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.70rem', background: '#0A0F1D', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.60rem' }}>CNPJ / CPF</span>
                  <strong style={{ color: '#E2E8F0', fontFamily: 'var(--font-mono)' }}>{partner.documentNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.60rem' }}>INSCRIÇÃO ESTADUAL</span>
                  <strong style={{ color: '#E2E8F0', fontFamily: 'var(--font-mono)' }}>{partner.stateRegistration}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.60rem' }}>MUNICÍPIO / UF</span>
                  <span style={{ color: '#CBD5E1' }}>{partner.address.city} / {partner.address.state}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.60rem' }}>REGIME FISCAL</span>
                  <span style={{ color: '#38BDF8', fontWeight: 700 }}>{partner.taxRegime.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '0.70rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Limite: </span>
                <strong style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                  R$ {partner.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  title="Ver no Emissor de NF-e"
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                >
                  Faturar NF-e
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro de Novo Parceiro */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #151F36 0%, #0A101E 100%)', border: '1.5px solid rgba(52, 211, 153, 0.4)', borderRadius: '14px', padding: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: '#34D399' }} />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Cadastrar Novo Parceiro Comercial
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSavePartner} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Razão Social (Nome Oficial) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: INDÚSTRIA & COMÉRCIO EXEMPLO S/A"
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Tipo de Parceiro
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#34D399', padding: '7px 10px', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
                  >
                    <option value="CLIENTE">🏢 Cliente (Tomador)</option>
                    <option value="FORNECEDOR">🏭 Fornecedor</option>
                    <option value="AMBOS">🔄 Ambos</option>
                    <option value="TRANSPORTADORA">🚚 Transportadora</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    CNPJ ou CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDoc}
                    onChange={(e) => setFormDoc(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Inscrição Estadual (IE)
                  </label>
                  <input
                    type="text"
                    value={formIe}
                    onChange={(e) => setFormIe(e.target.value)}
                    placeholder="Ex: 110.220.330.440 ou ISENTO"
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Município
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="São Paulo"
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    UF
                  </label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', padding: '7px 10px', fontSize: '0.78rem', outline: 'none' }}
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="PR">PR</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="BA">BA</option>
                    <option value="GO">GO</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Regime Tributário
                  </label>
                  <select
                    value={formRegime}
                    onChange={(e) => setFormRegime(e.target.value as any)}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#38BDF8', padding: '7px 10px', fontSize: '0.78rem', fontWeight: 700, outline: 'none' }}
                  >
                    <option value="LUCRO_REAL">Lucro Real</option>
                    <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                    <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.2)', color: '#CBD5E1', padding: '7px 14px', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-1click-3d"
                  style={{ padding: '7px 18px', fontSize: '0.78rem' }}
                >
                  <span>✓</span> Salvar Parceiro Comercial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default OfficeBusinessPartnersRegistryView;
