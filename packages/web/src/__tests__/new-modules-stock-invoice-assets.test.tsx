import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ProductCatalogEngine,
  InvoiceBillingIssuerEngine,
  FixedAssetsCpc27Engine,
  IntangibleAssetsCpc04Engine
} from '@soberano/core';
import { OfficeIntangiblesAmortizationView } from '../views/OfficeIntangiblesAmortizationView.js';
import { OfficeProductsServicesStockView } from '../views/OfficeProductsServicesStockView.js';
import { OfficeInvoiceBillingIssuerView } from '../views/OfficeInvoiceBillingIssuerView.js';
import { OfficeFixedAssetsCiapView } from '../views/OfficeFixedAssetsCiapView.js';

describe('Suíte de Testes: Cadastros Inteligentes, Emissor de NF-e e Ativo Imobilizado CPC 27', () => {

  describe('1. Motor de Produtos, Estoques & Serviços (ProductCatalogEngine)', () => {
    it('deve cadastrar produto industrial com ficha técnica (BOM) e calcular custo do lote', () => {
      const engine = new ProductCatalogEngine();
      const product = {
        id: 'p-ind-1',
        tenantId: 't1',
        code: 'IND-VALV-01',
        name: 'Válvula Inox',
        sector: 'INDUSTRIA' as const,
        spedType: '04_PRODUTO_ACABADO' as const,
        unit: 'UN' as const,
        ncm: '8481.80.95',
        origin: '0_NACIONAL' as const,
        salePrice: 450,
        costPrice: 200,
        averageCost: 200,
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        isMonophasicPisCofins: false,
        isIcmsSt: false,
        icmsAliquotaPercent: 18,
        ipiAliquotaPercent: 5,
        pisAliquotaPercent: 1.65,
        cofinsAliquotaPercent: 7.60,
        billOfMaterials: [
          { rawMaterialId: 'mp-1', rawMaterialName: 'Barra Inox', quantityRequired: 1.5, unit: 'KG', estimatedUnitCost: 80 },
          { rawMaterialId: 'mp-2', rawMaterialName: 'Vedações', quantityRequired: 2, unit: 'UN', estimatedUnitCost: 20 }
        ]
      };

      const res = engine.registerProduct(product);
      expect(res.success).toBe(true);

      const batchCost = engine.calculateProductionBatchCost('p-ind-1', 10);
      expect(batchCost.success).toBe(true);
      if (batchCost.success) {
        expect(batchCost.data.totalBatchCost).toBe(1600); // (1.5*80 + 2*20) * 10 = (120 + 40) * 10 = 1600
        expect(batchCost.data.unitProductionCost).toBe(160);
      }
    });

    it('deve processar movimentação de entrada (Compra) atualizando Custo Médio e gerando Partidas Dobradas', () => {
      const engine = new ProductCatalogEngine([
        {
          id: 'p-com-1',
          tenantId: 't1',
          code: 'COM-REV-01',
          name: 'Mercadoria para Revenda A',
          sector: 'COMERCIO',
          spedType: '00_MERCADORIA_REVENDA',
          unit: 'UN',
          ncm: '3004.90.99',
          origin: '0_NACIONAL',
          salePrice: 100,
          costPrice: 50,
          averageCost: 50,
          currentStock: 100,
          minStock: 20,
          maxStock: 500,
          isMonophasicPisCofins: true,
          isIcmsSt: true,
          icmsAliquotaPercent: 18,
          ipiAliquotaPercent: 0,
          pisAliquotaPercent: 0,
          cofinsAliquotaPercent: 0
        }
      ]);

      const movRes = engine.processStockMovement({
        productId: 'p-com-1',
        tenantId: 't1',
        type: 'ENTRADA_COMPRA',
        quantity: 100,
        unitPrice: 60,
        documentRef: 'NF-1002',
        date: '2026-08-19'
      });

      expect(movRes.success).toBe(true);
      if (movRes.success) {
        expect(movRes.data.newStock).toBe(200);
        expect(movRes.data.newAverageCost).toBe(55);
        expect(movRes.data.totalStockValue).toBe(11000);
        expect(movRes.data.journalEntries.length).toBe(2);
        expect(movRes.data.journalEntries[0].accountCode).toBe('1.1.3.01'); // Estoque
        expect(movRes.data.journalEntries[1].accountCode).toBe('2.1.1.01'); // Fornecedores
      }
    });

    it('deve processar saída de venda e gerar baixa em CMV/CPV', () => {
      const engine = new ProductCatalogEngine([
        {
          id: 'p-com-2',
          tenantId: 't1',
          code: 'COM-REV-02',
          name: 'Item B',
          sector: 'COMERCIO',
          spedType: '00_MERCADORIA_REVENDA',
          unit: 'UN',
          ncm: '8708.30.90',
          origin: '0_NACIONAL',
          salePrice: 150,
          costPrice: 80,
          averageCost: 80,
          currentStock: 50,
          minStock: 10,
          maxStock: 100,
          isMonophasicPisCofins: false,
          isIcmsSt: false,
          icmsAliquotaPercent: 18,
          ipiAliquotaPercent: 0,
          pisAliquotaPercent: 1.65,
          cofinsAliquotaPercent: 7.60
        }
      ]);

      const exitRes = engine.processStockMovement({
        productId: 'p-com-2',
        tenantId: 't1',
        type: 'SAIDA_VENDA',
        quantity: 10,
        unitPrice: 150,
        documentRef: 'NF-2001',
        date: '2026-08-19'
      });

      expect(exitRes.success).toBe(true);
      if (exitRes.success) {
        expect(exitRes.data.newStock).toBe(40);
        expect(exitRes.data.journalEntries.length).toBe(2);
        expect(exitRes.data.journalEntries[0].accountCode).toBe('4.1.1.01'); // CMV/CPV
        expect(exitRes.data.journalEntries[0].amount).toBe(800); // 10 * 80
      }
    });
  });

  describe('2. Motor de Emissão de Notas Fiscais (InvoiceBillingIssuerEngine)', () => {
    it('deve emitir NF-e Modelo 55 com chave de acesso de 44 dígitos e partidas contábeis', () => {
      const engine = new InvoiceBillingIssuerEngine();
      const res = engine.issueInvoice({
        tenantId: 't1',
        emitterCnpj: '00.000.000/0001-00',
        emitterName: 'EMPRESA INDUSTRIAL LTDA',
        emitterRegime: 'LUCRO_PRESUMIDO',
        documentModel: 'NFE_55',
        natureOfOperation: 'VENDA DE MERCADORIAS',
        issueDate: '2026-08-19',
        recipient: {
          cpfCnpj: '12.345.678/0001-90',
          nameOrReason: 'CLIENTE COMPRADOR S/A',
          email: 'financeiro@cliente.com.br',
          address: {
            street: 'Av Central',
            number: '500',
            neighborhood: 'Centro',
            city: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
            ibgeCode: '3550308'
          }
        },
        items: [
          {
            product: {
              id: 'p1',
              tenantId: 't1',
              code: 'PROD-1',
              name: 'Válvula Industrial',
              sector: 'INDUSTRIA',
              spedType: '04_PRODUTO_ACABADO',
              unit: 'UN',
              ncm: '8481.80.95',
              origin: '0_NACIONAL',
              salePrice: 500,
              costPrice: 250,
              averageCost: 250,
              currentStock: 100,
              minStock: 10,
              maxStock: 200,
              isMonophasicPisCofins: false,
              isIcmsSt: false,
              icmsAliquotaPercent: 18,
              ipiAliquotaPercent: 5,
              pisAliquotaPercent: 0.65,
              cofinsAliquotaPercent: 3.0
            },
            quantity: 4,
            unitPrice: 500,
            discount: 0
          }
        ],
        paymentMethod: 'PIX'
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.status).toBe('AUTORIZADA_SEFAZ');
        expect(res.data.accessKey.length).toBe(44);
        expect(res.data.totalProductsServices).toBe(2000);
        expect(res.data.totalIpi).toBe(100); // 5% de 2000
        expect(res.data.totalIcms).toBe(360); // 18% de 2000
        expect(res.data.totalInvoiceAmount).toBe(2100); // 2000 + 100 IPI
        expect(res.data.journalEntries[0].accountCode).toBe('1.1.2.01'); // Clientes
        expect(res.data.journalEntries[1].accountCode).toBe('3.1.1.01'); // Receita Bruta
      }
    });

    it('deve emitir NFS-e Padrão Nacional com retenções CSRF e IRRF', () => {
      const engine = new InvoiceBillingIssuerEngine();
      const res = engine.issueInvoice({
        tenantId: 't1',
        emitterCnpj: '00.000.000/0001-00',
        emitterName: 'CONSULTORIA EMPRESARIAL LTDA',
        emitterRegime: 'LUCRO_PRESUMIDO',
        documentModel: 'NFSE_SERVICOS',
        natureOfOperation: 'PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS',
        issueDate: '2026-08-19',
        recipient: {
          cpfCnpj: '99.888.777/0001-11',
          nameOrReason: 'TOMADOR DE SERVIÇOS S/A',
          email: 'tomador@empresa.com',
          address: {
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Jardins',
            city: 'São Paulo',
            uf: 'SP',
            cep: '01400-000',
            ibgeCode: '3550308'
          }
        },
        items: [
          {
            product: {
              id: 'srv-1',
              tenantId: 't1',
              code: 'SRV-01',
              name: 'Auditoria e Consultoria',
              sector: 'SERVICOS',
              spedType: '09_SERVICOS',
              unit: 'SV',
              ncm: '0000.00.00',
              origin: '0_NACIONAL',
              salePrice: 10000,
              costPrice: 4000,
              averageCost: 0,
              currentStock: 0,
              minStock: 0,
              maxStock: 0,
              isMonophasicPisCofins: false,
              isIcmsSt: false,
              icmsAliquotaPercent: 0,
              ipiAliquotaPercent: 0,
              pisAliquotaPercent: 0.65,
              cofinsAliquotaPercent: 3.0,
              issAliquotaPercent: 5.0,
              hasCsrfRetained: true,
              hasIrrfRetained: true
            },
            quantity: 1,
            unitPrice: 10000
          }
        ],
        paymentMethod: 'BOLETO'
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.totalIss).toBe(500); // 5% de 10.000
        expect(res.data.totalWithholdingsCsrf).toBe(465); // 4,65% de 10.000
        expect(res.data.totalWithholdingsIrrf).toBe(150); // 1,5% de 10.000
        expect(res.data.totalInvoiceAmount).toBe(10000);
      }
    });
  });

  describe('3. Motor de Ativo Imobilizado & Depreciação CPC 27 (FixedAssetsCpc27Engine)', () => {
    it('deve calcular quota de depreciação mensal CPC 27 e apropriação de CIAP 1/48 avos', () => {
      const engine = new FixedAssetsCpc27Engine();
      const asset = {
        id: 'ast-1',
        tenantId: 't1',
        tombamentoCode: 'PAT-001',
        name: 'Torno CNC Industrial',
        category: 'MAQUINAS_EQUIPAMENTOS' as const,
        costCenter: 'Produção',
        acquisitionDate: '2026-01-10',
        acquisitionCost: 120000,
        residualValue: 20000, // Base depreciável = 100.000
        usefulLifeYears: 10,
        annualDepreciationRatePercent: 10.0, // 10% a.a. = 10.000 / 12 = 833.33/mês
        accumulatedDepreciation: 0,
        impairmentLossAccumulated: 0,
        hasCiapIcmsCredit: true,
        totalIcmsHighlight: 21600, // 21600 / 48 = 450/mês
        currentCiapInstallment: 0,
        totalCiapInstallments: 48 as const
      };

      engine.registerAsset(asset);
      const depRes = engine.calculateMonthlyDepreciation('ast-1', 1.0);

      expect(depRes.success).toBe(true);
      if (depRes.success) {
        expect(depRes.data.depreciableBase).toBe(100000);
        expect(depRes.data.monthlyDepreciationQuota).toBe(833.33);
        expect(depRes.data.ciapMonthlyCreditAmount).toBe(450);
        expect(depRes.data.netBookValue).toBe(119166.67);
        expect(depRes.data.journalEntries.length).toBe(4); // 2 de depreciação + 2 de CIAP
      }
    });
  });

  describe('4. Renderização Estática das Novas Views com Dossiês Diamante', () => {
    it('OfficeProductsServicesStockView deve conter Dossiê de Inventário Diamante', () => {
      const html = renderToStaticMarkup(<OfficeProductsServicesStockView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DOSSIÊ EXECUTIVO DE INVENTÁRIO');
      expect(html).toContain('CPC 16');
    });

    it('OfficeInvoiceBillingIssuerView deve conter Emissor Inteligente e Transmissão SEFAZ', () => {
      const html = renderToStaticMarkup(<OfficeInvoiceBillingIssuerView />);
      expect(html).toContain('Emissor Inteligente de Notas Fiscais');
      expect(html).toContain('Empresa Emissora');
      expect(html).toContain('Emitir, Transmitir SEFAZ');
    });

    it('OfficeFixedAssetsCiapView deve conter Dossiê Patrimonial Diamante', () => {
      const html = renderToStaticMarkup(<OfficeFixedAssetsCiapView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DOSSIÊ PATRIMONIAL DO ATIVO IMOBILIZADO');
      expect(html).toContain('CPC 27');
    });
  });
  describe('5. Motor de Ativos Intangíveis & Amortização (IntangibleAssetsCpc04Engine)', () => {
    it('deve cadastrar software proprietário e calcular amortização mensal linear (CPC 04)', () => {
      const engine = new IntangibleAssetsCpc04Engine();
      const asset = {
        id: 'int-1',
        tenantId: 't1',
        code: 'INT-001',
        name: 'Plataforma Cloud ERP',
        category: 'SOFTWARE_SISTEMAS' as const,
        costCenter: 'Engenharia',
        acquisitionDate: '2026-01-01',
        acquisitionCost: 120000,
        residualValue: 0,
        usefulLifeMonths: 60, // 5 anos
        annualAmortizationRatePercent: 20.0, // 20% a.a. = 2.000/mês
        accumulatedAmortization: 0,
        impairmentLossAccumulated: 0,
        isIndefiniteUsefulLife: false
      };

      engine.registerIntangible(asset);
      const amortRes = engine.calculateMonthlyAmortization('int-1');

      expect(amortRes.success).toBe(true);
      if (amortRes.success) {
        expect(amortRes.data.monthlyAmortizationQuota).toBe(2000);
        expect(amortRes.data.netBookValue).toBe(118000);
        expect(amortRes.data.journalEntries[0].accountCode).toBe('4.2.1.06'); // Despesa Amortização
        expect(amortRes.data.journalEntries[1].accountCode).toBe('1.2.4.09'); // Amortização Acumulada
      }
    });

    it('deve tratar Ágio/Goodwill como vida útil indefinida (não amortizável sistematicamente)', () => {
      const engine = new IntangibleAssetsCpc04Engine();
      const goodwill = {
        id: 'gw-1',
        tenantId: 't1',
        code: 'INT-GW-01',
        name: 'Ágio por Rentabilidade Futura',
        category: 'GOODWILL_AGIO' as const,
        costCenter: 'M&A',
        acquisitionDate: '2026-01-01',
        acquisitionCost: 300000,
        residualValue: 0,
        usefulLifeMonths: 0,
        annualAmortizationRatePercent: 0,
        accumulatedAmortization: 0,
        impairmentLossAccumulated: 0,
        isIndefiniteUsefulLife: true
      };

      engine.registerIntangible(goodwill);
      const res = engine.calculateMonthlyAmortization('gw-1');

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.monthlyAmortizationQuota).toBe(0);
        expect(res.data.netBookValue).toBe(300000);
      }
    });

    it('OfficeIntangiblesAmortizationView deve conter Dossiê de Intangíveis Diamante', () => {
      const html = renderToStaticMarkup(<OfficeIntangiblesAmortizationView />);
      expect(html).toContain('diamond-paper-a4');
      expect(html).toContain('DOSSIÊ PATRIMONIAL DE ATIVOS INTANGÍVEIS');
      expect(html).toContain('CPC 04');
    });
  });

});
