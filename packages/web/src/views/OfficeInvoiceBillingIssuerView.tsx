// ==========================================================================
// SOBERANO CONTÁBIL — EMISSOR INTELIGENTE DE NOTAS FISCAIS (NF-e, NFS-e, NFC-e)
// 100% Integrado com Estoque, Diário Contábil e BPO Financeiro
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Send,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  DollarSign,
  QrCode,
  Zap,
  ArrowRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';
import {
  InvoiceBillingIssuerEngine,
  IssueInvoiceInput,
  IssuedInvoiceResult,
  ProductCatalogItem
} from '@soberano/core';

export const OfficeInvoiceBillingIssuerView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [docModel, setDocModel] = useState<'NFE_55' | 'NFSE_SERVICOS' | 'NFCE_65'>('NFE_55');
  const [natureOfOperation, setNatureOfOperation] = useState<string>('VENDA DE MERCADORIAS DENTRO DO ESTADO');
  
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  // Destinatário
  const [destName, setDestName] = useState<string>('INDÚSTRIA METALÚRGICA PAULISTA S/A');
  const [destCnpj, setDestCnpj] = useState<string>('12.345.678/0001-90');
  const [destCity, setDestCity] = useState<string>('São Paulo');
  const [destUf, setDestUf] = useState<string>('SP');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'A_PRAZO_30_DIAS'>('PIX');

  // Itens da Nota
  const [quantity, setQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(480.00);
  const [discount, setDiscount] = useState<number>(0.00);

  const [issuedInvoice, setIssuedInvoice] = useState<IssuedInvoiceResult | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const demoProduct: ProductCatalogItem = {
    id: 'prod-ind-1',
    tenantId: selectedTenantId,
    code: 'IND-ACAB-01',
    name: docModel === 'NFSE_SERVICOS' ? 'Consultoria e Auditoria Contábil/Tributária Especializada' : 'Válvula Esfero-Industrial 2" em Aço Inox',
    sector: docModel === 'NFSE_SERVICOS' ? 'SERVICOS' : 'INDUSTRIA',
    spedType: docModel === 'NFSE_SERVICOS' ? '09_SERVICOS' : '04_PRODUTO_ACABADO',
    unit: docModel === 'NFSE_SERVICOS' ? 'SV' : 'UN',
    ncm: docModel === 'NFSE_SERVICOS' ? '0000.00.00' : '8481.80.95',
    origin: '0_NACIONAL',
    salePrice: unitPrice,
    costPrice: 260.00,
    averageCost: 260.00,
    currentStock: 140,
    minStock: 30,
    maxStock: 300,
    isMonophasicPisCofins: false,
    isIcmsSt: false,
    icmsAliquotaPercent: 18.0,
    ipiAliquotaPercent: docModel === 'NFE_55' ? 5.0 : 0,
    pisAliquotaPercent: 1.65,
    cofinsAliquotaPercent: 7.60,
    serviceCodeLc116: '17.01',
    issAliquotaPercent: 5.0,
    hasCsrfRetained: true,
    hasIrrfRetained: true
  };

  const handleIssueInvoice = () => {
    const engine = new InvoiceBillingIssuerEngine();
    const input: IssueInvoiceInput = {
      tenantId: selectedTenantId,
      emitterCnpj: currentTenant.cnpj,
      emitterName: currentTenant.name,
      emitterRegime: currentTenant.regime,
      documentModel: docModel,
      natureOfOperation,
      issueDate: new Date().toISOString().split('T')[0],
      recipient: {
        cpfCnpj: destCnpj,
        nameOrReason: destName,
        email: 'financeiro@cliente.com.br',
        address: {
          street: 'Avenida Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: destCity,
          uf: destUf,
          cep: '01310-100',
          ibgeCode: '3550308'
        }
      },
      items: [
        {
          product: demoProduct,
          quantity,
          unitPrice,
          discount
        }
      ],
      paymentMethod
    };

    const res = engine.issueInvoice(input);
    if (res.success) {
      setIssuedInvoice(res.data);
      setFeedback({
        message: `Nota Fiscal ${docModel} Nº ${res.data.number} emitida e autorizada com sucesso! Protocolo SEFAZ: ${res.data.protocolNumber}. Estoque baixado e lançamentos contábeis gerados no Diário.`,
        isSuccess: true
      });
    } else {
      setFeedback({
        message: res.error.message,
        isSuccess: false
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧾</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Emissor Inteligente de Notas Fiscais (NF-e, NFS-e & NFC-e)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              FATURAMENTO AUTOMÁTICO ZERO-TOUCH
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Emissão integrada de notas de produtos, serviços e varejo com cálculo tributário determinístico e integração contábil 1-Click.
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
            <span>Imprimir DANFE Diamante (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: feedback.isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${feedback.isSuccess ? 'var(--emerald-500)' : '#EF4444'}`, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {feedback.isSuccess ? <CheckCircle2 size={20} color="var(--emerald-400)" /> : <AlertCircle size={20} color="#EF4444" />}
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback.message}</span>
        </div>
      )}

      {/* Model Selector & Inputs */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {/* 1. NF-e 55 */}
          <button
            type="button"
            onClick={() => { setDocModel('NFE_55'); setNatureOfOperation('VENDA DE MERCADORIAS'); }}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFE_55' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: docModel === 'NFE_55' 
                ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFE_55' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: docModel === 'NFE_55' 
                ? '2px solid #38BDF8' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: docModel === 'NFE_55' 
                ? '0 6px 20px -2px rgba(2, 132, 199, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: docModel === 'NFE_55' ? 'translateY(-1px)' : 'none'
            }}
          >
            <Receipt size={18} color={docModel === 'NFE_55' ? '#ffffff' : '#38BDF8'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NF-e Modelo 55</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFE_55' ? 0.95 : 0.7 }}>Produtos & Indústria</div>
            </div>
            {docModel === 'NFE_55' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>

          {/* 2. NFS-e Serviços */}
          <button
            type="button"
            onClick={() => { setDocModel('NFSE_SERVICOS'); setNatureOfOperation('PRESTAÇÃO DE SERVIÇOS TRIBUTADOS NO MUNICÍPIO'); }}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFSE_SERVICOS' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: docModel === 'NFSE_SERVICOS' 
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFSE_SERVICOS' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: docModel === 'NFSE_SERVICOS' 
                ? '2px solid #34D399' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: docModel === 'NFSE_SERVICOS' 
                ? '0 6px 20px -2px rgba(5, 150, 105, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: docModel === 'NFSE_SERVICOS' ? 'translateY(-1px)' : 'none'
            }}
          >
            <FileText size={18} color={docModel === 'NFSE_SERVICOS' ? '#ffffff' : '#34D399'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NFS-e Padrão Nacional</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFSE_SERVICOS' ? 0.95 : 0.7 }}>Serviços Municipais</div>
            </div>
            {docModel === 'NFSE_SERVICOS' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>

          {/* 3. NFC-e 65 */}
          <button
            type="button"
            onClick={() => { setDocModel('NFCE_65'); setNatureOfOperation('VENDA A CONSUMIDOR FINAL'); }}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: docModel === 'NFCE_65' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: docModel === 'NFCE_65' 
                ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: docModel === 'NFCE_65' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: docModel === 'NFCE_65' 
                ? '2px solid #A78BFA' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: docModel === 'NFCE_65' 
                ? '0 6px 20px -2px rgba(124, 58, 237, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: docModel === 'NFCE_65' ? 'translateY(-1px)' : 'none'
            }}
          >
            <QrCode size={18} color={docModel === 'NFCE_65' ? '#ffffff' : '#A78BFA'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>NFC-e Modelo 65</div>
              <div style={{ fontSize: '0.68rem', opacity: docModel === 'NFCE_65' ? 0.95 : 0.7 }}>Varejo Cupom Fiscal</div>
            </div>
            {docModel === 'NFCE_65' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>SELECIONADO</span>
            )}
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Natureza da Operação</label>
            <input
              type="text"
              className="form-control"
              value={natureOfOperation}
              onChange={(e) => setNatureOfOperation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Razão Social do Destinatário / Tomador</label>
            <input
              type="text"
              className="form-control"
              value={destName}
              onChange={(e) => setDestName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>CNPJ / CPF do Destinatário</label>
            <input
              type="text"
              className="form-control font-mono"
              value={destCnpj}
              onChange={(e) => setDestCnpj(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="PIX">PIX Instantâneo</option>
              <option value="BOLETO">Boleto Bancário</option>
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              <option value="A_PRAZO_30_DIAS">A Prazo (30 Dias)</option>
            </select>
          </div>
        </div>

        {/* Item Selection */}
        <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-surface-card)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
            Item Selecionado para Faturamento: {demoProduct.name} ({demoProduct.code})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                className="form-control font-mono"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Preço Unitário (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Desconto (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Total do Faturamento</label>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '6px' }}>
                R$ {(quantity * unitPrice - discount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleIssueInvoice}
            className="btn-primary-action"
            style={{ padding: '10px 24px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Zap size={16} /> Emitir, Transmitir SEFAZ & Contabilizar em 1-Click
          </button>
        </div>
      </div>

      {/* DANFE / ESPELHO OFICIAL DA NOTA FISCAL (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '10px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">
              DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA (DANFE • {docModel.replace('_', ' ')})
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ EMITENTE: <strong>{currentTenant.cnpj}</strong></div>
            <div>NÚMERO DA NOTA: <strong>Nº {issuedInvoice ? issuedInvoice.number : '1001'} - SÉRIE 1</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Status: AUTORIZADA SEFAZ</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Chave de Acesso SEFAZ (44 Dígitos)</strong>
            <span className="font-mono" style={{ fontSize: '0.62rem' }}>{issuedInvoice ? issuedInvoice.accessKey : '35260800000000000195550010000010011882910294'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Protocolo de Autorização</strong>
            <span className="font-mono">{issuedInvoice ? issuedInvoice.protocolNumber : 'PROTO-99882200'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Forma de Pagamento</strong>
            <span>{paymentMethod}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Valor Total da Nota Fiscal</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>
              R$ {(quantity * unitPrice - discount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Destinatário */}
        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontSize: '0.68rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
          <div>
            <strong>Destinatário / Tomador:</strong> {destName}
          </div>
          <div>
            <strong>CNPJ / CPF:</strong> {destCnpj}
          </div>
          <div>
            <strong>Município / UF:</strong> {destCity} - {destUf}
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Código / Descrição do Produto ou Serviço</th>
              <th>NCM / CFOP</th>
              <th style={{ textAlign: 'center' }}>Qtd</th>
              <th style={{ textAlign: 'right' }}>Unitário (R$)</th>
              <th style={{ textAlign: 'right' }}>Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{demoProduct.code}</strong> - {demoProduct.name}</td>
              <td>{demoProduct.ncm} | {docModel === 'NFSE_SERVICOS' ? '5933' : '5102'}</td>
              <td style={{ textAlign: 'center' }}>{quantity} {demoProduct.unit}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {unitPrice.toFixed(2)}</td>
              <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                R$ {(quantity * unitPrice - discount).toFixed(2)}
              </td>
            </tr>
            <tr className="diamond-table-total">
              <td colSpan={4}>VALOR LÍQUIDO TOTAL DA NOTA FISCAL ELETRÔNICA</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>
                R$ {(quantity * unitPrice - discount).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">EMITENTE RESPONSÁVEL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{currentTenant.name}</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CANHOTO / RECEBEDOR DA MERCADORIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Data de Entrega e Assinatura</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • EMISSÃO DF-E • CERTIFICAÇÃO DIGITAL SHA-256: <code>99A10988BA4400FF</code></div>
          <div>PÁGINA 1 DE 1 • DANFE OFICIAL HOMOLOGADO SEFAZ</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeInvoiceBillingIssuerView;
