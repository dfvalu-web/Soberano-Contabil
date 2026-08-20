// SOBERANO CONTÁBIL — EMISSOR INTELIGENTE DE NOTAS FISCAIS (NF-e, NFS-e, NFC-e)
// Integração Completa com Cadastro de Clientes/Fornecedores, Catálogo de Produtos e Motor Fiscal de CFOP/CST/NCM

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Receipt,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Search,
  DollarSign,
  Package,
  Layers,
  ChevronDown,
  Plus,
  Sparkles,
  Zap,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import { INITIAL_PARTNERS, BusinessPartner } from './OfficeBusinessPartnersRegistryView';

export type InvoiceDocModel = 'NFE_55' | 'NFSE_SERVICOS' | 'NFCE_65';

export interface CatalogProductItem {
  id: string;
  code: string;
  name: string;
  category: string;
  ncm: string;
  origin: '0' | '1' | '2';
  cfopInterno: string;
  cfopInterstadual: string;
  icmsCst: string;
  icmsRate: number;
  pisCst: string;
  pisRate: number;
  cofinsCst: string;
  cofinsRate: number;
  issRate: number;
  standardPrice: number;
  isMonofasico?: boolean;
}

export const PRODUCT_CATALOG: CatalogProductItem[] = [
  {
    id: 'prod-01',
    code: 'IND-ACAB-01',
    name: 'Válvula Esfero-Industrial 2" em Aço Inox',
    category: 'Indústria Metalúrgica',
    ncm: '8481.80.95',
    origin: '0',
    cfopInterno: '5.101',
    cfopInterstadual: '6.101',
    icmsCst: '00 (Tributado Integralmente)',
    icmsRate: 18,
    pisCst: '01 (Tributável)',
    pisRate: 1.65,
    cofinsCst: '01 (Tributável)',
    cofinsRate: 7.6,
    issRate: 0,
    standardPrice: 480.00
  },
  {
    id: 'prod-02',
    code: 'MED-MONO-02',
    name: 'Dipirona Sódica 500mg Cx c/ 20 Comprimidos',
    category: 'Farmacêutico (Monofásico)',
    ncm: '3004.90.99',
    origin: '0',
    cfopInterno: '5.102',
    cfopInterstadual: '6.102',
    icmsCst: '60 (Cobrado por ST)',
    icmsRate: 0,
    pisCst: '04 (Monofásico - Alíquota Zero)',
    pisRate: 0,
    cofinsCst: '04 (Monofásico - Alíquota Zero)',
    cofinsRate: 0,
    issRate: 0,
    standardPrice: 15.00,
    isMonofasico: true
  },
  {
    id: 'prod-03',
    code: 'MAT-ACO-03',
    name: 'Perfil de Aço Galvanizado 6 Metros',
    category: 'Material de Construção',
    ncm: '7216.50.00',
    origin: '0',
    cfopInterno: '5.101',
    cfopInterstadual: '6.101',
    icmsCst: '00 (Tributado Integralmente)',
    icmsRate: 18,
    pisCst: '01 (Tributável)',
    pisRate: 1.65,
    cofinsCst: '01 (Tributável)',
    cofinsRate: 7.6,
    issRate: 0,
    standardPrice: 294.50
  },
  {
    id: 'prod-04',
    code: 'SRV-TI-04',
    name: 'Licenciamento de Software SaaS & Cloud Analytics',
    category: 'Serviço de Tecnologia',
    ncm: '1.0101 (NBS)',
    origin: '0',
    cfopInterno: '1.07',
    cfopInterstadual: '1.07',
    icmsCst: 'Isento',
    icmsRate: 0,
    pisCst: '01 (Tributável)',
    pisRate: 0.65,
    cofinsCst: '01 (Tributável)',
    cofinsRate: 3.0,
    issRate: 5,
    standardPrice: 1850.00
  },
  {
    id: 'prod-05',
    code: 'SRV-CONT-05',
    name: 'Consultoria Tributária & Auditoria IFRS Contábil',
    category: 'Serviço Profissional',
    ncm: '1.0501 (NBS)',
    origin: '0',
    cfopInterno: '17.19',
    cfopInterstadual: '17.19',
    icmsCst: 'Isento',
    icmsRate: 0,
    pisCst: '01 (Tributável)',
    pisRate: 0.65,
    cofinsCst: '01 (Tributável)',
    cofinsRate: 3.0,
    issRate: 5,
    standardPrice: 3500.00
  },
  {
    id: 'prod-06',
    code: 'ALIM-CAFE-06',
    name: 'Café Gourmet Especial Torrado e Moído 500g',
    category: 'Alimentos / Varejo',
    ncm: '0901.21.00',
    origin: '0',
    cfopInterno: '5.102',
    cfopInterstadual: '6.102',
    icmsCst: '20 (Com Redução de Base)',
    icmsRate: 7,
    pisCst: '01 (Tributável)',
    pisRate: 1.65,
    cofinsCst: '01 (Tributável)',
    cofinsRate: 7.6,
    issRate: 0,
    standardPrice: 32.00
  }
];

export const NATURE_OPTIONS: Record<InvoiceDocModel, string[]> = {
  NFE_55: [
    'Venda de Mercadoria Adquirida de Terceiros (CFOP 5.102 / 6.102)',
    'Venda de Produção do Estabelecimento (CFOP 5.101 / 6.101)',
    'Venda de Mercadoria c/ ICMS-ST (CFOP 5.405 / 6.405)',
    'Remessa para Industrialização por Encomenda (CFOP 5.901 / 6.901)',
    'Remessa para Conserto ou Reparo (CFOP 5.915 / 6.915)',
    'Devolução de Mercadoria de Compra (CFOP 5.202 / 6.202)',
    'Transferência de Mercadoria entre Filiais (CFOP 5.152 / 6.152)',
    'Venda de Ativo Imobilizado (CFOP 5.551 / 6.551)'
  ],
  NFSE_SERVICOS: [
    'Prestação de Serviços de Tecnologia, Software & Dados (Item 1.07 LC 116)',
    'Serviços Contábeis, Auditoria & BPO Financeiro (Item 17.19 LC 116)',
    'Serviços de Manutenção, Suporte & Infraestrutura (Item 14.01 LC 116)',
    'Serviços de Consultoria Empresarial & Gestão (Item 17.01 LC 116)',
    'Prestação de Serviços com Retenção de ISSQN no Município'
  ],
  NFCE_65: [
    'Venda a Consumidor Final Presencial (CFOP 5.102)',
    'Venda a Consumidor Final com Entrega em Domicílio (CFOP 5.102)'
  ]
};

export const OfficeInvoiceBillingIssuerView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const issueAutomatedInvoice = (payload: any) => officeStore.issueAutomatedInvoice(payload);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id || 'tenant-1');
  const [docModel, setDocModel] = useState<InvoiceDocModel>('NFE_55');

  // Natureza da Operação
  const [natureOfOperation, setNatureOfOperation] = useState<string>(NATURE_OPTIONS.NFE_55[0]);
  const [isCustomNature, setIsCustomNature] = useState<boolean>(false);

  // Destinatário / Tomador Conectado ao Cadastro
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(INITIAL_PARTNERS[0].id);
  const [destName, setDestName] = useState<string>(INITIAL_PARTNERS[0].name);
  const [destCnpj, setDestCnpj] = useState<string>(INITIAL_PARTNERS[0].documentNumber);
  const [destIe, setDestIe] = useState<string>(INITIAL_PARTNERS[0].stateRegistration);
  const [destCity, setDestCity] = useState<string>(INITIAL_PARTNERS[0].address.city);
  const [destUf, setDestUf] = useState<string>(INITIAL_PARTNERS[0].address.state);

  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'A_PRAZO_30_DIAS'>('PIX');

  // Produto Selecionado do Catálogo
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCT_CATALOG[0].id);
  const [quantity, setQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(PRODUCT_CATALOG[0].standardPrice);
  const [discount, setDiscount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  // Produto atual selecionado
  const currentProduct = useMemo(() => {
    return PRODUCT_CATALOG.find(p => p.id === selectedProductId) || PRODUCT_CATALOG[0];
  }, [selectedProductId]);

  // Inteligência de CFOP Geográfico (Interna vs Interestadual)
  const isInterestadual = destUf.toUpperCase() !== 'SP';
  const effectiveCfop = docModel === 'NFSE_SERVICOS'
    ? currentProduct.cfopInterno
    : isInterestadual
      ? currentProduct.cfopInterstadual
      : currentProduct.cfopInterno;

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const prod = PRODUCT_CATALOG.find(p => p.id === productId);
    if (prod) {
      setUnitPrice(prod.standardPrice);
    }
  };

  const handleDocModelChange = (model: InvoiceDocModel) => {
    setDocModel(model);
    setNatureOfOperation(NATURE_OPTIONS[model][0]);
    setIsCustomNature(false);

    // Ajustar produto padrão de acordo com o modelo
    if (model === 'NFSE_SERVICOS') {
      setSelectedProductId('prod-04');
      setUnitPrice(1850.00);
    } else {
      setSelectedProductId('prod-01');
      setUnitPrice(480.00);
    }
  };

  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    const partner = INITIAL_PARTNERS.find(p => p.id === partnerId);
    if (partner) {
      setDestName(partner.name);
      setDestCnpj(partner.documentNumber);
      setDestIe(partner.stateRegistration);
      setDestCity(partner.address.city);
      setDestUf(partner.address.state);
    }
  };

  const grossTotal = quantity * unitPrice;
  const netTotal = Math.max(0, grossTotal - discount);

  const handleTransmitInvoice = () => {
    const res = issueAutomatedInvoice({
      tenantId: selectedTenantId,
      docModel,
      natureOfOperation,
      customer: {
        name: destName,
        cnpjCpf: destCnpj,
        ie: destIe,
        state: destUf,
        city: destCity
      },
      paymentMethod,
      items: [
        {
          productId: currentProduct.id,
          code: currentProduct.code,
          name: currentProduct.name,
          ncm: currentProduct.ncm,
          origin: currentProduct.origin,
          cfop: effectiveCfop,
          quantity,
          unitPrice,
          discountAmount: discount,
          icmsCst: currentProduct.icmsCst,
          icmsRate: currentProduct.icmsRate,
          ipiRate: 5,
          pisRate: currentProduct.pisRate,
          cofinsRate: currentProduct.cofinsRate,
          issRate: currentProduct.issRate
        }
      ]
    });

    if (res.success && res.data) {
      setFeedback({
        message: 'Nota Fiscal ' + docModel + ' Nº ' + res.data.number + ' autorizada com sucesso na SEFAZ! Protocolo: ' + res.data.protocolNumber + '. Estoque baixado e lançamentos contábeis gerados no Diário.',
        isSuccess: true
      });
    } else {
      setFeedback({
        message: res.error?.message || 'Erro na transmissão da nota fiscal.',
        isSuccess: false
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="no-print" style={{ background: 'linear-gradient(180deg, #131E35 0%, #0C1220 100%)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 14px rgba(0, 0, 0, 0.4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🧾</span>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              Emissor Inteligente de Notas Fiscais (NF-e, NFS-e & NFC-e)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
              FATURAMENTO AUTOMÁTICO ZERO-TOUCH
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.78rem' }}>
            Emissão integrada com amarrações do Cadastro de Clientes/Fornecedores, catálogo de produtos com CFOP/CST/NCM e lançamento contábil em 1-Click.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="control-pod-3d"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px'
            }}
          >
            <span style={{ fontSize: '0.70rem', color: '#94A3B8', fontWeight: 700 }}>Empresa Emissora:</span>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34D399',
                fontSize: '0.78rem',
                fontWeight: 900,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#0B1120', color: '#fff' }}>
                  {t.name} (CNPJ: {t.cnpj})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modelo de Documento Fiscal (Abas 3D) */}
      <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => handleDocModelChange('NFE_55')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: docModel === 'NFE_55' ? '1.5px solid #34D399' : '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: docModel === 'NFE_55' ? '3px solid #059669' : '1px solid rgba(255, 255, 255, 0.08)',
            background: docModel === 'NFE_55' ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.12) 100%)' : 'rgba(15, 23, 42, 0.6)',
            color: docModel === 'NFE_55' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: docModel === 'NFE_55' ? '0 0 16px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <FileText size={18} color={docModel === 'NFE_55' ? '#34D399' : '#94A3B8'} />
          <span>NF-e Modelo 55 (Mercadorias & Indústria)</span>
        </button>

        <button
          type="button"
          onClick={() => handleDocModelChange('NFSE_SERVICOS')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: docModel === 'NFSE_SERVICOS' ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: docModel === 'NFSE_SERVICOS' ? '3px solid #0284C7' : '1px solid rgba(255, 255, 255, 0.08)',
            background: docModel === 'NFSE_SERVICOS' ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.12) 100%)' : 'rgba(15, 23, 42, 0.6)',
            color: docModel === 'NFSE_SERVICOS' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: docModel === 'NFSE_SERVICOS' ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Receipt size={18} color={docModel === 'NFSE_SERVICOS' ? '#38BDF8' : '#94A3B8'} />
          <span>NFS-e Padrão Nacional (Serviços & Retenções)</span>
        </button>

        <button
          type="button"
          onClick={() => handleDocModelChange('NFCE_65')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: docModel === 'NFCE_65' ? '1.5px solid #FBBF24' : '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: docModel === 'NFCE_65' ? '3px solid #D97706' : '1px solid rgba(255, 255, 255, 0.08)',
            background: docModel === 'NFCE_65' ? 'linear-gradient(180deg, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.12) 100%)' : 'rgba(15, 23, 42, 0.6)',
            color: docModel === 'NFCE_65' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: docModel === 'NFCE_65' ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <QrCode size={18} color={docModel === 'NFCE_65' ? '#FBBF24' : '#94A3B8'} />
          <span>NFC-e Modelo 65 (Varejo & Cupom Fiscal)</span>
        </button>
      </div>

      {feedback && (
        <div style={{ background: feedback.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: feedback.isSuccess ? '1px solid #10B981' : '1px solid #EF4444', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {feedback.isSuccess ? <CheckCircle2 size={20} color="#10B981" /> : <AlertCircle size={20} color="#EF4444" />}
          <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      {/* Formulário Principal de Emissão */}
      <div style={{ background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3.5px solid #059669', borderRadius: '16px', padding: '24px', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)' }}>
        
        {/* Grid de Configurações da Operação */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* 1. Natureza da Operação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                Natureza da Operação (Fiscal)
              </label>
              <button
                type="button"
                onClick={() => setIsCustomNature(!isCustomNature)}
                style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 700 }}
              >
                {isCustomNature ? '« Selecionar Sugestão' : '+ Digitar Livre'}
              </button>
            </div>

            {isCustomNature ? (
              <input
                type="text"
                value={natureOfOperation}
                onChange={(e) => setNatureOfOperation(e.target.value)}
                placeholder="Digite a natureza da operação..."
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }}
              />
            ) : (
              <select
                value={natureOfOperation}
                onChange={(e) => setNatureOfOperation(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                {NATURE_OPTIONS[docModel].map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Destinatário / Tomador (Conectado ao Cadastro Central) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                Destinatário / Tomador (Do Cadastro Central)
              </label>
              <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 800 }}>✓ VINCULADO AO CADASTRO</span>
            </div>

            <select
              value={selectedPartnerId}
              onChange={(e) => handlePartnerSelect(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#34D399', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              {INITIAL_PARTNERS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.documentNumber} • {p.address.state})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Documento e UF do Destinatário */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              CNPJ / CPF & Localidade
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={destCnpj}
                style={{ flex: 2, background: '#0A0E18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#38BDF8', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
              />
              <input
                type="text"
                readOnly
                value={`${destCity} / ${destUf}`}
                style={{ flex: 1, background: '#0A0E18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.74rem', fontWeight: 800, textAlign: 'center' }}
              />
            </div>
          </div>

          {/* 4. Forma de Pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              Forma de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FBBF24', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              <option value="PIX">⚡ PIX Instantâneo com QR Code</option>
              <option value="BOLETO">📄 Boleto Bancário Registrado</option>
              <option value="CARTAO_CREDITO">💳 Cartão de Crédito</option>
              <option value="A_PRAZO_30_DIAS">⏳ Faturamento a Prazo (30 Dias)</option>
            </select>
          </div>
        </div>

        {/* Seletor de Produto do Catálogo Expandido */}
        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(10, 15, 28, 0.85)', borderRadius: '12px', border: '1.5px solid rgba(56, 189, 248, 0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#38BDF8" />
              <span>Catálogo de Produtos & Serviços (Ficha Cadastral Fiscal)</span>
            </div>
            
            {isInterestadual ? (
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                ⚡ Operação Interestadual (SP ➔ {destUf}) • CFOP {effectiveCfop}
              </span>
            ) : (
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900 }}>
                ✓ Operação Interna (SP ➔ SP) • CFOP {effectiveCfop}
              </span>
            )}
          </div>

          {/* Dropdown do Catálogo de Produtos */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Selecione o Item Cadastrado
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              style={{ width: '100%', background: '#080D1A', border: '1.5px solid rgba(56, 189, 248, 0.4)', borderRadius: '8px', color: '#FFFFFF', padding: '9px 12px', fontSize: '0.82rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              {PRODUCT_CATALOG.map(prod => (
                <option key={prod.id} value={prod.id}>
                  [{prod.code}] {prod.name} — NCM: {prod.ncm} — R$ {prod.standardPrice.toFixed(2)} ({prod.category})
                </option>
              ))}
            </select>
          </div>

          {/* Tags Fiscais Extraídas do Produto Selecionado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '16px', background: '#070B14', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block', fontWeight: 800 }}>NCM / NBS:</span>
              <strong style={{ fontSize: '0.78rem', color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{currentProduct.ncm}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block', fontWeight: 800 }}>CFOP APLICADO:</span>
              <strong style={{ fontSize: '0.78rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>{effectiveCfop}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block', fontWeight: 800 }}>CST ICMS:</span>
              <strong style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>{currentProduct.icmsCst}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block', fontWeight: 800 }}>CST PIS/COFINS:</span>
              <strong style={{ fontSize: '0.74rem', color: currentProduct.isMonofasico ? '#34D399' : '#CBD5E1' }}>{currentProduct.pisCst}</strong>
            </div>
          </div>

          {/* Quantidades e Valores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#fff', padding: '7px 10px', fontSize: '0.80rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Preço Unitário (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#fff', padding: '7px 10px', fontSize: '0.80rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Desconto Comercial (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#fff', padding: '7px 10px', fontSize: '0.80rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div style={{ background: '#070C16', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Valor Total da Nota</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                R$ {netTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação Master */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleTransmitInvoice}
            className="btn-1click-3d"
            style={{ padding: '10px 24px', fontSize: '0.86rem' }}
          >
            <span>⚡</span> Emitir, Transmitir SEFAZ & Contabilizar em 1-Click
          </button>
        </div>
      </div>
    </div>
  );
};
export default OfficeInvoiceBillingIssuerView;
