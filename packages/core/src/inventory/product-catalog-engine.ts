// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DE PRODUTOS, ESTOQUES & SERVIÇOS
// Conformidade: CPC 16 (Estoques) • Bloco 0200/K200 SPED • LC 116/03
// ==========================================================================

import { Result, Ok, Err } from '../types/result.js';
import { JournalEntryLine } from '../types/accounting.js';

export type ProductSectorType = 'INDUSTRIA' | 'COMERCIO' | 'SERVICOS';

export type SpedItemType = 
  | '00_MERCADORIA_REVENDA'
  | '01_MATERIA_PRIMA'
  | '02_EMBALAGEM'
  | '03_PRODUTO_PROCESSO'
  | '04_PRODUTO_ACABADO'
  | '07_MATERIAL_USO_CONSUMO'
  | '08_ATIVO_IMOBILIZADO'
  | '09_SERVICOS';

export interface BillOfMaterialItem {
  rawMaterialId: string;
  rawMaterialName: string;
  quantityRequired: number;
  unit: string;
  estimatedUnitCost: number;
}

export interface ProductCatalogItem {
  id: string;
  tenantId: string;
  code: string; // Código Interno / SKU
  barcodeEan?: string;
  name: string;
  sector: ProductSectorType;
  spedType: SpedItemType;
  unit: 'UN' | 'KG' | 'CX' | 'LT' | 'MT' | 'HR' | 'SV';
  ncm: string;
  cest?: string;
  origin: '0_NACIONAL' | '1_ESTRANGEIRA_IMPORT_DIRETA' | '2_ESTRANGEIRA_ADQ_MERC_INTERNO';
  
  // Dados Financeiros & Custo
  salePrice: number;
  costPrice: number;
  averageCost: number; // Custo Médio Ponderado
  
  // Dados de Estoque (para Indústria e Comércio)
  currentStock: number;
  minStock: number;
  maxStock: number;
  location?: string;
  
  // Tributação Vinculada
  isMonophasicPisCofins: boolean;
  isIcmsSt: boolean;
  icmsAliquotaPercent: number;
  ipiAliquotaPercent: number;
  pisAliquotaPercent: number;
  cofinsAliquotaPercent: number;
  
  // Para Serviços (LC 116/03)
  serviceCodeLc116?: string; // Ex: "17.01"
  municipalTaxCode?: string;
  issAliquotaPercent?: number;
  hasCsrfRetained?: boolean; // 4,65%
  hasIrrfRetained?: boolean; // 1,5%
  hasInssRetained?: boolean; // 11%
  
  // Para Indústria (Ficha Técnica / BOM)
  billOfMaterials?: BillOfMaterialItem[];
}

export interface StockMovementInput {
  productId: string;
  tenantId: string;
  type: 'ENTRADA_COMPRA' | 'SAIDA_VENDA' | 'BAIXA_PRODUCAO' | 'AJUSTE_INVENTARIO';
  quantity: number;
  unitPrice: number;
  documentRef: string;
  date: string;
}

export interface StockMovementResult {
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  previousAverageCost: number;
  newAverageCost: number;
  totalStockValue: number;
  journalEntries: JournalEntryLine[];
}

export class ProductCatalogEngine {
  private products: Map<string, ProductCatalogItem> = new Map();

  constructor(initialProducts: ProductCatalogItem[] = []) {
    initialProducts.forEach(p => this.products.set(p.id, p));
  }

  public registerProduct(product: ProductCatalogItem): Result<ProductCatalogItem, Error> {
    if (!product.id || !product.name || !product.code) {
      return Err(new Error('ID, Nome e Código do Produto são obrigatórios.'));
    }
    this.products.set(product.id, product);
    return Ok(product);
  }

  public getProduct(id: string): ProductCatalogItem | undefined {
    return this.products.get(id);
  }

  public listProductsByTenant(tenantId: string, sector?: ProductSectorType): ProductCatalogItem[] {
    const list = Array.from(this.products.values()).filter(p => p.tenantId === tenantId);
    if (sector) {
      return list.filter(p => p.sector === sector);
    }
    return list;
  }

  public processStockMovement(input: StockMovementInput): Result<StockMovementResult, Error> {
    const product = this.products.get(input.productId);
    if (!product) {
      return Err(new Error(`Produto com ID ${input.productId} não encontrado.`));
    }

    if (product.sector === 'SERVICOS') {
      return Err(new Error('Serviços não possuem movimentação física de estoque.'));
    }

    const previousStock = product.currentStock;
    const previousAverageCost = product.averageCost || product.costPrice;
    let newStock = previousStock;
    let newAverageCost = previousAverageCost;
    const journalEntries: JournalEntryLine[] = [];

    if (input.type === 'ENTRADA_COMPRA') {
      newStock = previousStock + input.quantity;
      const totalPreviousValue = previousStock * previousAverageCost;
      const totalNewValue = input.quantity * input.unitPrice;
      newAverageCost = newStock > 0 ? Number(((totalPreviousValue + totalNewValue) / newStock).toFixed(4)) : input.unitPrice;

      // Partidas Dobradas Contábeis de Entrada
      journalEntries.push(
        {
          accountId: '1.1.3.01',
          accountCode: '1.1.3.01',
          accountName: 'Estoques de Mercadorias / Insumos (Ativo Circulante)',
          type: 'DEBIT',
          amount: totalNewValue
        },
        {
          accountId: '2.1.1.01',
          accountCode: '2.1.1.01',
          accountName: 'Fornecedores Nacionais a Pagar (Passivo Circulante)',
          type: 'CREDIT',
          amount: totalNewValue
        }
      );
    } else if (input.type === 'SAIDA_VENDA' || input.type === 'BAIXA_PRODUCAO') {
      newStock = Math.max(0, previousStock - input.quantity);
      const totalCostMovement = Number((input.quantity * previousAverageCost).toFixed(2));

      // Partidas Dobradas Contábeis de Baixa (CMV/CPV)
      journalEntries.push(
        {
          accountId: '4.1.1.01',
          accountCode: '4.1.1.01',
          accountName: 'Custo das Mercadorias / Produtos Vendidos (CMV/CPV - DRE)',
          type: 'DEBIT',
          amount: totalCostMovement
        },
        {
          accountId: '1.1.3.01',
          accountCode: '1.1.3.01',
          accountName: 'Estoques de Mercadorias / Insumos (Ativo Circulante)',
          type: 'CREDIT',
          amount: totalCostMovement
        }
      );
    } else if (input.type === 'AJUSTE_INVENTARIO') {
      newStock = input.quantity;
      newAverageCost = input.unitPrice > 0 ? input.unitPrice : previousAverageCost;
    }

    product.currentStock = newStock;
    product.averageCost = newAverageCost;
    this.products.set(product.id, product);

    const totalStockValue = Number((newStock * newAverageCost).toFixed(2));

    return Ok({
      productId: product.id,
      productName: product.name,
      previousStock,
      newStock,
      previousAverageCost,
      newAverageCost,
      totalStockValue,
      journalEntries
    });
  }

  public calculateProductionBatchCost(productId: string, batchQuantity: number): Result<{
    productName: string;
    totalBatchCost: number;
    unitProductionCost: number;
    requiredMaterials: { name: string; totalQty: number; totalCost: number }[];
  }, Error> {
    const product = this.products.get(productId);
    if (!product || product.sector !== 'INDUSTRIA' || !product.billOfMaterials || product.billOfMaterials.length === 0) {
      return Err(new Error('Produto industrial com Ficha Técnica (BOM) válida é obrigatório.'));
    }

    let totalBatchCost = 0;
    const requiredMaterials: { name: string; totalQty: number; totalCost: number }[] = [];

    for (const bom of product.billOfMaterials) {
      const rawMat = this.products.get(bom.rawMaterialId);
      const unitCost = rawMat ? rawMat.averageCost || rawMat.costPrice : bom.estimatedUnitCost;
      const totalQty = bom.quantityRequired * batchQuantity;
      const totalCost = Number((totalQty * unitCost).toFixed(2));
      totalBatchCost += totalCost;

      requiredMaterials.push({
        name: bom.rawMaterialName,
        totalQty,
        totalCost
      });
    }

    const unitProductionCost = batchQuantity > 0 ? Number((totalBatchCost / batchQuantity).toFixed(2)) : 0;

    return Ok({
      productName: product.name,
      totalBatchCost: Number(totalBatchCost.toFixed(2)),
      unitProductionCost,
      requiredMaterials
    });
  }
}
