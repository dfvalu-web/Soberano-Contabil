// ==========================================================================
// SOBERANO CONTÁBIL — GESTÃO DE ATIVOS INTANGÍVEIS & AMORTIZAÇÃO (CPC 04 R1)
// Conformidade: NBC TG 04 (CPC 04 R1 / IAS 38) • NBC TG 01 (Impairment) • Lei do Bem
// ==========================================================================

import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type IntangibleCategory = 
  | 'SOFTWARE_SISTEMAS'
  | 'MARCAS_PATENTES'
  | 'LICENCAS_CONCESSOES'
  | 'GOODWILL_AGIO'
  | 'DIREITOS_AUTORAIS'
  | 'PD_DESENVOLVIMENTO';

export interface IntangibleAssetItem {
  id: string;
  tenantId: string;
  code: string; // Ex: INT-2026-001
  name: string;
  category: IntangibleCategory;
  costCenter: string;
  acquisitionDate: string;
  acquisitionCost: number;
  residualValue: number; // Geralmente 0 para intangíveis (CPC 04)
  usefulLifeMonths: number; // Se 0 -> Vida Útil Indefinida (não amortizável)
  annualAmortizationRatePercent: number; // Ex: 20% a.a. para software
  accumulatedAmortization: number;
  impairmentLossAccumulated: number; // CPC 01
  isIndefiniteUsefulLife: boolean;
}

export interface AmortizationScheduleResult {
  assetId: string;
  code: string;
  name: string;
  amortizableBase: number;
  monthlyAmortizationQuota: number;
  accumulatedAmortizationUpdated: number;
  netBookValue: number;
  journalEntries: JournalEntryLine[];
}

export class IntangibleAssetsCpc04Engine {
  private intangibles: Map<string, IntangibleAssetItem> = new Map();

  constructor(initialAssets: IntangibleAssetItem[] = []) {
    initialAssets.forEach(a => this.intangibles.set(a.id, a));
  }

  public registerIntangible(asset: IntangibleAssetItem): Result<IntangibleAssetItem, Error> {
    if (!asset.id || !asset.code || !asset.name || asset.acquisitionCost <= 0) {
      return Err(new Error('ID, Código, Nome e Custo de Aquisição positivo são obrigatórios.'));
    }
    this.intangibles.set(asset.id, asset);
    return Ok(asset);
  }

  public getIntangible(id: string): IntangibleAssetItem | undefined {
    return this.intangibles.get(id);
  }

  public listIntangiblesByTenant(tenantId: string): IntangibleAssetItem[] {
    return Array.from(this.intangibles.values()).filter(a => a.tenantId === tenantId);
  }

  public calculateMonthlyAmortization(assetId: string): Result<AmortizationScheduleResult, Error> {
    const asset = this.intangibles.get(assetId);
    if (!asset) {
      return Err(new Error(`Ativo intangível com ID ${assetId} não encontrado.`));
    }

    if (asset.isIndefiniteUsefulLife || asset.usefulLifeMonths <= 0) {
      // Intangíveis de vida útil indefinida (ex: Ágio/Goodwill) não são amortizados
      const netBookValue = Number((asset.acquisitionCost - asset.accumulatedAmortization - asset.impairmentLossAccumulated).toFixed(2));
      return Ok({
        assetId: asset.id,
        code: asset.code,
        name: asset.name,
        amortizableBase: 0,
        monthlyAmortizationQuota: 0,
        accumulatedAmortizationUpdated: asset.accumulatedAmortization,
        netBookValue,
        journalEntries: []
      });
    }

    const amortizableBase = Math.max(0, asset.acquisitionCost - asset.residualValue);
    const monthlyQuota = Number(((amortizableBase * (asset.annualAmortizationRatePercent / 100)) / 12).toFixed(2));
    const newAccumulated = Math.min(amortizableBase, Number((asset.accumulatedAmortization + monthlyQuota).toFixed(2)));
    const netBookValue = Number((asset.acquisitionCost - newAccumulated - asset.impairmentLossAccumulated).toFixed(2));

    asset.accumulatedAmortization = newAccumulated;
    this.intangibles.set(asset.id, asset);

    // Partidas Dobradas Contábeis de Amortização (CPC 04)
    const journalEntries: JournalEntryLine[] = [
      {
        accountId: '4.2.1.06',
        accountCode: '4.2.1.06',
        accountName: `Despesas com Amortização de Intangíveis - ${asset.name} (DRE - CPC 04)`,
        type: 'DEBIT',
        amount: monthlyQuota
      },
      {
        accountId: '1.2.4.09',
        accountCode: '1.2.4.09',
        accountName: `(-) Amortização Acumulada de Intangíveis - ${asset.name} (Conta Redutora Ativo Não Circulante)`,
        type: 'CREDIT',
        amount: monthlyQuota
      }
    ];

    return Ok({
      assetId: asset.id,
      code: asset.code,
      name: asset.name,
      amortizableBase,
      monthlyAmortizationQuota: monthlyQuota,
      accumulatedAmortizationUpdated: newAccumulated,
      netBookValue,
      journalEntries
    });
  }
}
