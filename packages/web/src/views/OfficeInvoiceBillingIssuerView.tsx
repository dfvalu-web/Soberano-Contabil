// SOBERANO CONTÁBIL — EMISSOR INTELIGENTE DE NOTAS FISCAIS (NF-e, NFS-e, NFC-e)
// Integração Completa com Cadastro de Clientes/Fornecedores e Seletores Inteligentes de Natureza de Operação

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
  Plus
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import { INITIAL_PARTNERS, BusinessPartner } from './OfficeBusinessPartnersRegistryView';

export type InvoiceDocModel = 'NFE_55' | 'NFSE_SERVICOS' | 'NFCE_65';

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

  // Item Selecionado
  const [quantity, setQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(480.00);
  const [discount, setDiscount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const demoProduct = {
    id: 'prod-ind-01',
    code: 'IND-ACAB-01',
    name: 'Válvula Esfero-Industrial 2" em Aço Inox',
    ncm: '8481.80.95',
    origin: '0' as const,
    cfop: docModel === 'NFE_55' ? '5.101' : '5.102',
    icmsCst: '00',
    icmsRate: 18,
    ipiRate: 5,
    pisRate: 1.65,
    cofinsRate: 7.6,
    issRate: docModel === 'NFSE_SERVICOS' ? 5 : 0
  };

  const handleDocModelChange = (model: InvoiceDocModel) => {
    setDocModel(model);
    setNatureOfOperation(NATURE_OPTIONS[model][0]);
    setIsCustomNature(false);
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
          productId: demoProduct.id,
          code: demoProduct.code,
          name: demoProduct.name,
          ncm: demoProduct.ncm,
          origin: demoProduct.origin,
          cfop: demoProduct.cfop,
          quantity,
          unitPrice,
          discountAmount: discount,
          icmsCst: demoProduct.icmsCst,
          icmsRate: demoProduct.icmsRate,
          ipiRate: demoProduct.ipiRate,
          pisRate: demoProduct.pisRate,
          cofinsRate: demoProduct.cofinsRate,
          issRate: demoProduct.issRate
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
            Emissão integrada com amarrações do Cadastro de Clientes/Fornecedores, cálculo fiscal determinístico e lançamento contábil em 1-Click.
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

          <button onClick={() => window.print()} className="btn-1click-3d" style={{ padding: '6px 14px', fontSize: '0.76rem' }}>
            <Printer size={14} />
            <span>Imprimir DANFE Diamante (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: feedback.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: '1px solid ' + (feedback.isSuccess ? '#10B981' : '#EF4444'), padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {feedback.isSuccess ? <CheckCircle2 size={18} color="#34D399" /> : <AlertCircle size={18} color="#EF4444" />}
          <span style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 700 }}>{feedback.message}</span>
        </div>
      )}

      {/* Model Selector & Inputs */}
      <div className="no-print" style={{ background: 'linear-gradient(180deg, #131E35 0%, #0C1220 100%)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)' }}>
        
        {/* Seletor de Modelo de Documento */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => handleDocModelChange('NFE_55')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFE_55' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              background: docModel === 'NFE_55' ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFE_55' ? '#ffffff' : '#94A3B8',
              border: docModel === 'NFE_55' ? '2px solid #38BDF8' : '1.5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: docModel === 'NFE_55' ? '0 6px 20px -2px rgba(2, 132, 199, 0.45)' : 'none'
            }}
          >
            <Receipt size={18} color={docModel === 'NFE_55' ? '#ffffff' : '#38BDF8'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NF-e Modelo 55</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFE_55' ? 0.95 : 0.7 }}>Produtos & Indústria</div>
            </div>
            {docModel === 'NFE_55' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDocModelChange('NFSE_SERVICOS')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFSE_SERVICOS' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              background: docModel === 'NFSE_SERVICOS' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFSE_SERVICOS' ? '#ffffff' : '#94A3B8',
              border: docModel === 'NFSE_SERVICOS' ? '2px solid #34D399' : '1.5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: docModel === 'NFSE_SERVICOS' ? '0 6px 20px -2px rgba(5, 150, 105, 0.45)' : 'none'
            }}
          >
            <FileText size={18} color={docModel === 'NFSE_SERVICOS' ? '#ffffff' : '#34D399'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NFS-e Padrão Nacional</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFSE_SERVICOS' ? 0.95 : 0.7 }}>Serviços Municipais</div>
            </div>
            {docModel === 'NFSE_SERVICOS' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDocModelChange('NFCE_65')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFCE_65' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              background: docModel === 'NFCE_65' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFCE_65' ? '#ffffff' : '#94A3B8',
              border: docModel === 'NFCE_65' ? '2px solid #A78BFA' : '1.5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: docModel === 'NFCE_65' ? '0 6px 20px -2px rgba(124, 58, 237, 0.45)' : 'none'
            }}
          >
            <QrCode size={18} color={docModel === 'NFCE_65' ? '#ffffff' : '#A78BFA'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NFC-e Modelo 65</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFCE_65' ? 0.95 : 0.7 }}>Varejo Cupom Fiscal</div>
            </div>
            {docModel === 'NFCE_65' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>
        </div>

        {/* Form Grid 3D */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* 1. Natureza da Operação com Seletor Inteligente */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                Natureza da Operação (Fiscal) *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomNature(prev => !prev)}
                style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.64rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {isCustomNature ? '← Usar Lista Padrão' : '✎ Digitar Outra'}
              </button>
            </div>

            {isCustomNature ? (
              <input
                type="text"
                value={natureOfOperation}
                onChange={(e) => setNatureOfOperation(e.target.value)}
                placeholder="Informe a natureza customizada..."
                style={{ width: '100%', background: '#0B1120', border: '1px solid #34D399', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 700, outline: 'none' }}
              />
            ) : (
              <select
                value={natureOfOperation}
                onChange={(e) => setNatureOfOperation(e.target.value)}
                style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#34D399', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
              >
                {NATURE_OPTIONS[docModel].map((nat, idx) => (
                  <option key={idx} value={nat} style={{ background: '#0F172A', color: '#FFFFFF', fontWeight: 600 }}>
                    {nat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Destinatário Conectado ao Cadastro de Clientes e Fornecedores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              Destinatário / Tomador (Do Cadastro Central) *
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => handlePartnerSelect(e.target.value)}
              style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              {INITIAL_PARTNERS.map(p => (
                <option key={p.id} value={p.id} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  {p.partnerType === 'CLIENTE' ? '🏢' : '🏭'} {p.name} ({p.documentNumber})
                </option>
              ))}
            </select>
          </div>

          {/* 3. CNPJ / CPF Auto-Preenchido */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              CNPJ / CPF do Destinatário
            </label>
            <input
              type="text"
              readOnly
              value={destCnpj}
              style={{ width: '100%', background: '#0A0E18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#38BDF8', padding: '8px 12px', fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
            />
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

        {/* Item Selection Card */}
        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(10, 15, 28, 0.8)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="#34D399" />
              <span>Item Selecionado: {demoProduct.name}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              NCM: {demoProduct.ncm} • CFOP: {demoProduct.cfop}
            </span>
          </div>

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
