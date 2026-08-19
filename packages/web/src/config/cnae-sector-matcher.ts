// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DE INTELIGÊNCIA SETORIAL POR CNAE & REGIME
// Mapeamento Dinâmico de Módulos Especializados para Cada Perfil de Empresa
// ==========================================================================

import { CompanyTenant } from '../state/office-store';
import { NavigationModule, ALL_MODULES, getModuleById } from './navigation-modules';

export interface SectorProfile {
  id: string;
  name: string;
  categoryTitle: string;
  cnaePrefixes: string[];
  recommendedModuleIds: string[];
  legalFramework: string;
  economicBenefitSummary: string;
  colorTheme: string;
  icon: string;
}

export const SECTOR_PROFILES: SectorProfile[] = [
  {
    id: 'pharmacy_retail',
    name: 'Farmácias, Drogarias & Cosméticos',
    categoryTitle: 'Comércio Farmacêutico & Varejo',
    cnaePrefixes: ['4771', '4772', '4773', '4644', '4645', '477'],
    recommendedModuleIds: [
      'office_products_services_stock',
      'office_invoice_billing_issuer',
      'office_monophasic_tax',
      'office_inbound_dfe',
      'office_card_pix_crossaudit',
      'office_smart_dropzone_triage_view',
      'actuarial_pharma',
      'onerous_cosmetics'
    ],
    legalFramework: 'Lei 10.147/2000 (Monofásicos) & Convênios ICMS-ST',
    economicBenefitSummary: 'Redução de até 40% na Guia DAS do Simples Nacional via exclusão legal de PIS/COFINS e ICMS-ST.',
    colorTheme: '#10B981',
    icon: '💊'
  },
  {
    id: 'tech_saas',
    name: 'Tecnologia, SaaS, TI & Startups',
    categoryTitle: 'Tecnologia & Inovação',
    cnaePrefixes: ['6201', '6202', '6203', '6209', '6311', '6319', '620', '631'],
    recommendedModuleIds: [
      'office_products_services_stock',
      'office_invoice_billing_issuer',
      'office_fixed_assets_cpc27',
      'borrowing_lei_do_bem',
      'tax_loss_saas',
      'stock_options_sped_export_view',
      'software_oea_customs',
      'rwa_tokens_ibs_cbs',
      'drex_cbdc_tpft'
    ],
    legalFramework: 'Lei do Bem (Lei 11.196/2005) & Pronunciamento CPC 04 (Intangíveis)',
    economicBenefitSummary: 'Exclusão fiscal de até 160% dos gastos de P&D no Lucro Real e segurança societária em Stock Options.',
    colorTheme: '#06B6D4',
    icon: '🚀'
  },
  {
    id: 'industry_metal',
    name: 'Indústria, Manufatura & Metalurgia',
    categoryTitle: 'Indústria de Transformação',
    cnaePrefixes: ['2511', '2512', '25', '28', '29', '30', '22', '23', '24'],
    recommendedModuleIds: [
      'office_products_services_stock',
      'office_invoice_billing_issuer',
      'office_fixed_assets_cpc27',
      'office_inventory_block_hk',
      'drawback_aap',
      'office_ciap_block_g',
      'perpetual_autoparts',
      'compound_recycling',
      'weather_ipi_export'
    ],
    legalFramework: 'SPED Bloco K (Estoques) & CIAP Lei Complementar 87/96 (Lei Kandir)',
    economicBenefitSummary: 'Recuperação de 1/48 avos de ICMS no Imobilizado e isenção tributária de insumos via Drawback.',
    colorTheme: '#F59E0B',
    icon: '⚙️'
  },
  {
    id: 'medical_health',
    name: 'Clínicas Médicas, Consultórios & Saúde',
    categoryTitle: 'Serviços de Saúde & Medicina',
    cnaePrefixes: ['8630', '8610', '8640', '8650', '8690', '86', '7500'],
    recommendedModuleIds: [
      'office_optimal_prolabore',
      'office_issqn_withholding',
      'office_carne_leao_irpf',
      'medical_cooperative_tax',
      'office_reinf_r4000'
    ],
    legalFramework: 'Fator R (LC 123/06 Art. 18 §5º-J) & Equiparação Hospitalar (Lei 9.249/95)',
    economicBenefitSummary: 'Redução da alíquota do Simples de 15,5% (Anexo V) para 6% (Anexo III) e IRPJ reduzido a 8% no Presumido.',
    colorTheme: '#EC4899',
    icon: '🩺'
  },
  {
    id: 'agribusiness_rural',
    name: 'Agronegócio, Grãos & Produtor Rural',
    categoryTitle: 'Agronegócio & Agroindústria',
    cnaePrefixes: ['0111', '0112', '0115', '0121', '0151', '01', '02', '03'],
    recommendedModuleIds: [
      'cattle_agro_lcdpr',
      'bearer_plants_agro',
      'agro_cpr_psr',
      'biological_fco_tax',
      'agri_derivatives',
      'forestry_biological_debt'
    ],
    legalFramework: 'LCDPR (IN RFB 1.848/18) & CPC 29 (Ativos Biológicos / Fair Value)',
    economicBenefitSummary: 'Apuração e emissão automatizada do LCDPR com conciliação bancária e tributação pelo resultado real.',
    colorTheme: '#84CC16',
    icon: '🌾'
  },
  {
    id: 'real_estate_construction',
    name: 'Incorporação Imobiliária & Construção Civil',
    categoryTitle: 'Imobiliário & Construção',
    cnaePrefixes: ['4120', '4110', '41', '6810', '6821', '68'],
    recommendedModuleIds: [
      'fractional_multipropriedade_ret',
      'shopping_mall_fii_tax',
      'lessor_construction',
      'benefits_ret',
      'goodwill_toll'
    ],
    legalFramework: 'Patrimônio de Afetação & RET 4% (Lei 10.931/2004)',
    economicBenefitSummary: 'Unificação de IRPJ, CSLL, PIS e COFINS em guia única de apenas 4% sobre a receita das unidades.',
    colorTheme: '#8B5CF6',
    icon: '🏗️'
  }
];

/**
 * Identify the matched sector profile for a given tenant based on its CNAE code
 */
export function matchSectorProfile(tenant: CompanyTenant | undefined | null): SectorProfile | null {
  if (!tenant || !tenant.cnaePrincipal) return null;

  const rawCnae = tenant.cnaePrincipal.replace(/[^0-9]/g, ''); // Extract only digits

  for (const profile of SECTOR_PROFILES) {
    for (const prefix of profile.cnaePrefixes) {
      if (rawCnae.startsWith(prefix) || tenant.cnaePrincipal.toLowerCase().includes(profile.id)) {
        return profile;
      }
    }
  }

  // Fallback match based on tenant name keywords if CNAE digits did not match
  const nameLower = tenant.name.toLowerCase();
  if (nameLower.includes('drogaria') || nameLower.includes('farmacia') || nameLower.includes('medicamento')) {
    return SECTOR_PROFILES[0];
  }
  if (nameLower.includes('tech') || nameLower.includes('software') || nameLower.includes('s/a')) {
    return SECTOR_PROFILES[1];
  }
  if (nameLower.includes('metalurgica') || nameLower.includes('industria') || nameLower.includes('alpha')) {
    return SECTOR_PROFILES[2];
  }
  if (nameLower.includes('clinica') || nameLower.includes('medica') || nameLower.includes('saude')) {
    return SECTOR_PROFILES[3];
  }
  if (nameLower.includes('agro') || nameLower.includes('fazenda') || nameLower.includes('soja')) {
    return SECTOR_PROFILES[4];
  }

  return null;
}

/**
 * Returns the list of recommended navigation modules for the active tenant
 */
export function getRecommendedModulesForTenant(tenant: CompanyTenant | undefined | null): NavigationModule[] {
  const profile = matchSectorProfile(tenant);
  if (!profile) return [];

  return profile.recommendedModuleIds
    .map(id => getModuleById(id))
    .filter((m): m is NavigationModule => Boolean(m));
}

/**
 * Checks whether a module is recommended for the active tenant
 */
export function isModuleRecommendedForTenant(moduleId: string, tenant: CompanyTenant | undefined | null): boolean {
  const profile = matchSectorProfile(tenant);
  if (!profile) return false;
  return profile.recommendedModuleIds.includes(moduleId);
}