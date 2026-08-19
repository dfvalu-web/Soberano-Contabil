// ==========================================================================
// SOBERANO CONTÁBIL — GESTÃO DE ATIVO IMOBILIZADO, DEPRECIAÇÃO & CIAP BLOCO G
// Conformidade: NBC TG 27 (CPC 27 R4 / IAS 16) • NBC TG 01 (CPC 01 Impairment)
// ==========================================================================

import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type AssetCategory = 
  | 'MAQUINAS_EQUIPAMENTOS'
  | 'VEICULOS_TRANSPORTE'
  | 'EDIFICACOES_IMOVEIS'
  | 'EQUIPAMENTOS_TI_INFORMATICA'
  | 'MOVEIS_UTENSILIOS'
  | 'INSTALACOES_INDUSTRIAIS';

export interface FixedAssetItem {
  id: string;
  tenantId: string;
  tombamentoCode: string; // Número Patrimonial
  name: string;
  category: AssetCategory;
  costCenter: string;
  acquisitionDate: string;
  acquisitionCost: number;
  residualValue: number; // Valor residual não depreciável (CPC 27)
  usefulLifeYears: number; // Vida útil econômica estimada
  annualDepreciationRatePercent: number; // Taxa Anual RFB (10%, 20%, 4%, etc.)
  
  // Dados de Depreciação Acumulada
  accumulatedDepreciation: number;
  impairmentLossAccumulated: number; // Perda por Redução ao Valor Recuperável (CPC 01)
  
  // Crédito de ICMS Ativo Permanente (CIAP Bloco G)
  hasCiapIcmsCredit: boolean;
  totalIcmsHighlight: number;
  currentCiapInstallment: number; // 1 a 48
  totalCiapInstallments: 48;
}

export interface DepreciationScheduleResult {
  assetId: string;
  tombamentoCode: string;
  name: string;
  depreciableBase: number;
  monthlyDepreciationQuota: number;
  accumulatedDepreciationUpdated: number;
  netBookValue: number;
  ciapMonthlyCreditAmount: number;
  journalEntries: JournalEntryLine[];
}

export class FixedAssetsCpc27Engine {
  private assets: Map<string, FixedAssetItem> = new Map();

  constructor(initialAssets: FixedAssetItem[] = []) {
    initialAssets.forEach(a => this.assets.set(a.id, a));
  }

  public registerAsset(asset: FixedAssetItem): Result<FixedAssetItem, Error> {
    if (!asset.id || !asset.tombamentoCode || !asset.name || asset.acquisitionCost <= 0) {
      return Err(new Error('ID, Tombamento, Nome e Custo de Aquisição positivo são obrigatórios.'));
    }
    this.assets.set(asset.id, asset);
    return Ok(asset);
  }

  public getAsset(id: string): FixedAssetItem | undefined {
    return this.assets.get(id);
  }

  public listAssetsByTenant(tenantId: string): FixedAssetItem[] {
    return Array.from(this.assets.values()).filter(a => a.tenantId === tenantId);
  }

  public calculateMonthlyDepreciation(assetId: string, saídasTributadasRatio: number = 1.0): Result<DepreciationScheduleResult, Error> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      return Err(new Error(`Ativo com ID ${assetId} não encontrado.`));
    }

    // Base depreciável = Custo de Aquisição - Valor Residual
    const depreciableBase = Math.max(0, asset.acquisitionCost - asset.residualValue);
    
    // Quota mensal = (Base Depreciável * (Taxa Anual / 100)) / 12
    const monthlyQuota = Number(((depreciableBase * (asset.annualDepreciationRatePercent / 100)) / 12).toFixed(2));
    
    // Atualiza acumulado sem ultrapassar a base depreciável
    const newAccumulated = Math.min(depreciableBase, Number((asset.accumulatedDepreciation + monthlyQuota).toFixed(2)));
    
    // Valor Contábil Líquido (VCL) = Custo - Depreciação Acumulada - Impairment
    const netBookValue = Number((asset.acquisitionCost - newAccumulated - asset.impairmentLossAccumulated).toFixed(2));

    // CIAP: 1/48 avos por mês * Fator de Saídas Tributadas
    let ciapCredit = 0;
    if (asset.hasCiapIcmsCredit && asset.currentCiapInstallment < 48) {
      const installmentBase = asset.totalIcmsHighlight / 48;
      ciapCredit = Number((installmentBase * saídasTributadasRatio).toFixed(2));
      asset.currentCiapInstallment += 1;
    }

    asset.accumulatedDepreciation = newAccumulated;
    this.assets.set(asset.id, asset);

    // Partidas Dobradas Contábeis (CPC 27)
    const journalEntries: JournalEntryLine[] = [
      {
        accountId: '4.2.1.05',
        accountCode: '4.2.1.05',
        accountName: `Despesas com Depreciação de Imobilizado - ${asset.name} (DRE - CPC 27)`,
        type: 'DEBIT',
        amount: monthlyQuota
      },
      {
        accountId: '1.2.3.09',
        accountCode: '1.2.3.09',
        accountName: `(-) Depreciação Acumulada - ${asset.name} (Conta Redutora Ativo Não Circulante)`,
        type: 'CREDIT',
        amount: monthlyQuota
      }
    ];

    if (ciapCredit > 0) {
      journalEntries.push(
        {
          accountId: '1.1.4.01',
          accountCode: '1.1.4.01',
          accountName: 'ICMS a Recuperar sobre Ativo Imobilizado (CIAP 1/48 avos - Ativo Circulante)',
          type: 'DEBIT',
          amount: ciapCredit
        },
        {
          accountId: '1.2.4.01',
          accountCode: '1.2.4.01',
          accountName: 'ICMS s/ Imobilizado a Apropriar (Ativo Não Circulante)',
          type: 'CREDIT',
          amount: ciapCredit
        }
      );
    }

    return Ok({
      assetId: asset.id,
      tombamentoCode: asset.tombamentoCode,
      name: asset.name,
      depreciableBase,
      monthlyDepreciationQuota: monthlyQuota,
      accumulatedDepreciationUpdated: newAccumulated,
      netBookValue,
      ciapMonthlyCreditAmount: ciapCredit,
      journalEntries
    });
  }
}
