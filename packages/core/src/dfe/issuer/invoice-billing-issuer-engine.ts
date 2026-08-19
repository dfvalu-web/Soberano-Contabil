// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DE EMISSÃO DE NOTAS FISCAIS (NF-e, NFS-e, NFC-e)
// Conformidade: Manual de Orientação do Contribuinte (MOC) • Padrão Nacional NFS-e
// ==========================================================================

import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';
import { ProductCatalogItem } from '../../inventory/product-catalog-engine.js';

export type InvoiceDocumentModel = 'NFE_55' | 'NFSE_SERVICOS' | 'NFCE_65';

export interface InvoiceRecipient {
  cpfCnpj: string;
  nameOrReason: string;
  email: string;
  ieOrRg?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    uf: string;
    cep: string;
    ibgeCode: string;
  };
}

export interface InvoiceItemPayload {
  productId: string;
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  
  // Tributação Calculada
  cstOrCsosn: string;
  icmsBase: number;
  icmsRate: number;
  icmsAmount: number;
  ipiRate: number;
  ipiAmount: number;
  pisRate: number;
  pisAmount: number;
  cofinsRate: number;
  cofinsAmount: number;
  issRate: number;
  issAmount: number;
}

export interface IssueInvoiceInput {
  tenantId: string;
  emitterCnpj: string;
  emitterName: string;
  emitterRegime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  documentModel: InvoiceDocumentModel;
  natureOfOperation: string;
  issueDate: string;
  recipient: InvoiceRecipient;
  items: {
    product: ProductCatalogItem;
    quantity: number;
    unitPrice: number;
    discount?: number;
    cfop?: string;
  }[];
  paymentMethod: 'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'A_PRAZO_30_DIAS';
}

export interface IssuedInvoiceResult {
  invoiceId: string;
  documentModel: InvoiceDocumentModel;
  series: number;
  number: number;
  accessKey: string;
  protocolNumber: string;
  issueDate: string;
  status: 'AUTORIZADA_SEFAZ' | 'PROCESSADA_100';
  emitterName: string;
  emitterCnpj: string;
  recipientName: string;
  recipientCnpj: string;
  
  // Totais
  totalProductsServices: number;
  totalDiscount: number;
  totalIcms: number;
  totalIpi: number;
  totalPis: number;
  totalCofins: number;
  totalIss: number;
  totalWithholdingsCsrf: number;
  totalWithholdingsIrrf: number;
  totalInvoiceAmount: number;
  
  items: InvoiceItemPayload[];
  xmlPayloadSimulated: string;
  qrCodeUrl: string;
  journalEntries: JournalEntryLine[];
}

export class InvoiceBillingIssuerEngine {
  private invoiceSequence = 1001;

  public issueInvoice(input: IssueInvoiceInput): Result<IssuedInvoiceResult, Error> {
    if (!input.tenantId || !input.emitterCnpj || !input.items || input.items.length === 0) {
      return Err(new Error('Emitente, CNPJ e itens da nota fiscal são obrigatórios.'));
    }

    const series = 1;
    const number = this.invoiceSequence++;
    const accessKey = this.generateAccessKey(input.emitterCnpj, number, input.documentModel);
    const protocolNumber = 'PROTO-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    let totalProductsServices = 0;
    let totalDiscount = 0;
    let totalIcms = 0;
    let totalIpi = 0;
    let totalPis = 0;
    let totalCofins = 0;
    let totalIss = 0;
    let totalWithholdingsCsrf = 0;
    let totalWithholdingsIrrf = 0;

    const calculatedItems: InvoiceItemPayload[] = input.items.map(item => {
      const qty = item.quantity;
      const price = item.unitPrice;
      const discount = item.discount || 0;
      const lineTotal = Number((qty * price - discount).toFixed(2));
      totalProductsServices += Number((qty * price).toFixed(2));
      totalDiscount += discount;

      const p = item.product;
      let cfop = item.cfop || (input.documentModel === 'NFSE_SERVICOS' ? '5933' : '5102');
      let cstOrCsosn = input.emitterRegime === 'SIMPLES_NACIONAL' ? '102' : '00';
      
      let icmsAmount = 0;
      let ipiAmount = 0;
      let pisAmount = 0;
      let cofinsAmount = 0;
      let issAmount = 0;

      if (input.documentModel === 'NFSE_SERVICOS') {
        const issRate = p.issAliquotaPercent || 5.0;
        issAmount = Number((lineTotal * (issRate / 100)).toFixed(2));
        totalIss += issAmount;

        if (p.hasCsrfRetained && input.emitterRegime !== 'SIMPLES_NACIONAL') {
          totalWithholdingsCsrf += Number((lineTotal * 0.0465).toFixed(2));
        }
        if (p.hasIrrfRetained) {
          totalWithholdingsIrrf += Number((lineTotal * 0.015).toFixed(2));
        }
      } else {
        // Mercadoria / Indústria
        if (input.emitterRegime === 'SIMPLES_NACIONAL') {
          cstOrCsosn = p.isMonophasicPisCofins ? '500' : '102';
          icmsAmount = 0; // DAS Unificado
          pisAmount = 0;
          cofinsAmount = 0;
        } else {
          // Lucro Presumido ou Real
          cstOrCsosn = p.isMonophasicPisCofins ? '04' : '00';
          const icmsRate = p.icmsAliquotaPercent || 18.0;
          icmsAmount = Number((lineTotal * (icmsRate / 100)).toFixed(2));
          totalIcms += icmsAmount;

          const ipiRate = p.ipiAliquotaPercent || 0;
          ipiAmount = Number((lineTotal * (ipiRate / 100)).toFixed(2));
          totalIpi += ipiAmount;

          if (!p.isMonophasicPisCofins) {
            const pisRate = input.emitterRegime === 'LUCRO_REAL' ? 1.65 : 0.65;
            const cofinsRate = input.emitterRegime === 'LUCRO_REAL' ? 7.60 : 3.00;
            pisAmount = Number((lineTotal * (pisRate / 100)).toFixed(2));
            cofinsAmount = Number((lineTotal * (cofinsRate / 100)).toFixed(2));
            totalPis += pisAmount;
            totalCofins += cofinsAmount;
          }
        }
      }

      return {
        productId: p.id,
        code: p.code,
        description: p.name,
        ncm: p.ncm,
        cfop,
        unit: p.unit,
        quantity: qty,
        unitPrice: price,
        discount,
        totalPrice: lineTotal,
        cstOrCsosn,
        icmsBase: input.emitterRegime !== 'SIMPLES_NACIONAL' ? lineTotal : 0,
        icmsRate: p.icmsAliquotaPercent || 0,
        icmsAmount,
        ipiRate: p.ipiAliquotaPercent || 0,
        ipiAmount,
        pisRate: p.pisAliquotaPercent || 0,
        pisAmount,
        cofinsRate: p.cofinsAliquotaPercent || 0,
        cofinsAmount,
        issRate: p.issAliquotaPercent || 0,
        issAmount
      };
    });

    const totalInvoiceAmount = Number((totalProductsServices - totalDiscount + totalIpi).toFixed(2));

    // Partidas Dobradas Automáticas
    const journalEntries: JournalEntryLine[] = [
      {
        accountId: '1.1.2.01',
        accountCode: '1.1.2.01',
        accountName: `Clientes Nacionais - ${input.recipient.nameOrReason} (Ativo Circulante)`,
        type: 'DEBIT',
        amount: totalInvoiceAmount
      },
      {
        accountId: '3.1.1.01',
        accountCode: '3.1.1.01',
        accountName: input.documentModel === 'NFSE_SERVICOS' ? 'Receita Bruta de Prestação de Serviços (DRE)' : 'Receita Bruta de Venda de Mercadorias / Produtos (DRE)',
        type: 'CREDIT',
        amount: totalInvoiceAmount
      }
    ];

    const xmlPayloadSimulated = `<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><NFe><infNFe Id="NFe${accessKey}"><ide><nNF>${number}</nNF><dhEmi>${input.issueDate}</dhEmi></ide><emit><CNPJ>${input.emitterCnpj}</CNPJ><xNome>${input.emitterName}</xNome></emit><dest><CNPJ>${input.recipient.cpfCnpj}</CNPJ><xNome>${input.recipient.nameOrReason}</xNome></dest><total><vNF>${totalInvoiceAmount.toFixed(2)}</vNF></total></infNFe></NFe><protNFe><infProt><nProt>${protocolNumber}</nProt></infProt></protNFe></nfeProc>`;

    return Ok({
      invoiceId: 'INV-' + number,
      documentModel: input.documentModel,
      series,
      number,
      accessKey,
      protocolNumber,
      issueDate: input.issueDate,
      status: 'AUTORIZADA_SEFAZ',
      emitterName: input.emitterName,
      emitterCnpj: input.emitterCnpj,
      recipientName: input.recipient.nameOrReason,
      recipientCnpj: input.recipient.cpfCnpj,
      totalProductsServices: Number(totalProductsServices.toFixed(2)),
      totalDiscount: Number(totalDiscount.toFixed(2)),
      totalIcms: Number(totalIcms.toFixed(2)),
      totalIpi: Number(totalIpi.toFixed(2)),
      totalPis: Number(totalPis.toFixed(2)),
      totalCofins: Number(totalCofins.toFixed(2)),
      totalIss: Number(totalIss.toFixed(2)),
      totalWithholdingsCsrf: Number(totalWithholdingsCsrf.toFixed(2)),
      totalWithholdingsIrrf: Number(totalWithholdingsIrrf.toFixed(2)),
      totalInvoiceAmount,
      items: calculatedItems,
      xmlPayloadSimulated,
      qrCodeUrl: 'https://dfe-portal.svrs.rs.gov.br/nfe/qrCode?p=' + accessKey,
      journalEntries
    });
  }

  private generateAccessKey(cnpj: string, number: number, model: InvoiceDocumentModel): string {
    const cleanCnpj = cnpj.replace(/\D/g, '').padStart(14, '0');
    const mod = model === 'NFSE_SERVICOS' ? '00' : (model === 'NFCE_65' ? '65' : '55');
    const uf = '35'; // SP
    const aamm = '2608';
    const num = number.toString().padStart(9, '0');
    const cNF = '88291029';
    const raw = `${uf}${aamm}${cleanCnpj}${mod}001${num}1${cNF}`;
    
    // DV Módulo 11
    let sum = 0;
    let weight = 2;
    for (let i = raw.length - 1; i >= 0; i--) {
      sum += parseInt(raw[i], 10) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    const remainder = sum % 11;
    const dv = (remainder === 0 || remainder === 1) ? 0 : (11 - remainder);

    return raw + dv.toString();
  }
}
