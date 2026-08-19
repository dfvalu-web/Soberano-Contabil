import { describe, it, expect } from 'vitest';
import {
  matchSectorProfile,
  getRecommendedModulesForTenant,
  isModuleRecommendedForTenant,
  SECTOR_PROFILES
} from '../config/cnae-sector-matcher';
import { CompanyTenant } from '../state/office-store';

describe('CNAE Sector Matcher & Industry Intelligence Engine', () => {
  const farmaciaTenant: CompanyTenant = {
    id: 't2',
    name: 'Drogaria Alvorada Ltda',
    cnpj: '98.765.432/0001-10',
    regime: 'SIMPLES_NACIONAL',
    cnaePrincipal: '4771-7/01 - Comércio Varejista de Medicamentos',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 120,
    cprbEligible: false
  };

  const techTenant: CompanyTenant = {
    id: 't1',
    name: 'Soberano Tech S/A',
    cnpj: '12.345.678/0001-90',
    regime: 'LUCRO_REAL',
    cnaePrincipal: '6201-5/01 - Desenvolvimento de Programas',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 85,
    cprbEligible: true
  };

  const metalurgicaTenant: CompanyTenant = {
    id: 't3',
    name: 'Indústria Metalúrgica Alpha S/A',
    cnpj: '45.123.789/0001-55',
    regime: 'LUCRO_REAL',
    cnaePrincipal: '2511-0/00 - Fabricação de Estruturas Metálicas',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 45,
    cprbEligible: false
  };

  const clinicaTenant: CompanyTenant = {
    id: 't4',
    name: 'Clínica Médica & Serviços Ltda',
    cnpj: '33.987.654/0001-22',
    regime: 'LUCRO_PRESUMIDO',
    cnaePrincipal: '8630-5/03 - Atividade Médica Ambulatorial',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 92,
    cprbEligible: false
  };

  const agroTenant: CompanyTenant = {
    id: 't5',
    name: 'Agropecuária Vale do Sol Ltda',
    cnpj: '11.222.333/0001-44',
    regime: 'LUCRO_REAL',
    cnaePrincipal: '0111-3/01 - Cultivo de Soja e Milho',
    cndStatus: 'REGULAR',
    cndExpiresInDays: 60,
    cprbEligible: false
  };

  it('deve conter os 6 perfis setoriais de alta lucratividade', () => {
    expect(SECTOR_PROFILES.length).toBeGreaterThanOrEqual(6);
    const ids = SECTOR_PROFILES.map(p => p.id);
    expect(ids).toContain('pharmacy_retail');
    expect(ids).toContain('tech_saas');
    expect(ids).toContain('industry_metal');
    expect(ids).toContain('medical_health');
    expect(ids).toContain('agribusiness_rural');
    expect(ids).toContain('real_estate_construction');
  });

  it('deve mapear Farmácia para o perfil de Comércio Farmacêutico com Monofásicos', () => {
    const profile = matchSectorProfile(farmaciaTenant);
    expect(profile).not.toBeNull();
    expect(profile?.id).toBe('pharmacy_retail');
    expect(profile?.legalFramework).toContain('Lei 10.147/2000');
    expect(profile?.economicBenefitSummary).toContain('Redução de até 40%');

    const recommended = getRecommendedModulesForTenant(farmaciaTenant);
    expect(recommended.length).toBeGreaterThan(0);
    const hasMonophasic = isModuleRecommendedForTenant('office_monophasic_tax', farmaciaTenant);
    expect(hasMonophasic).toBe(true);
  });

  it('deve mapear Empresa de Software/TI para Lei do Bem e RWA Tokens', () => {
    const profile = matchSectorProfile(techTenant);
    expect(profile?.id).toBe('tech_saas');
    expect(isModuleRecommendedForTenant('borrowing_lei_do_bem', techTenant)).toBe(true);
    expect(isModuleRecommendedForTenant('tax_loss_saas', techTenant)).toBe(true);
  });

  it('deve mapear Metalúrgica para Bloco K e Drawback', () => {
    const profile = matchSectorProfile(metalurgicaTenant);
    expect(profile?.id).toBe('industry_metal');
    expect(isModuleRecommendedForTenant('office_inventory_block_hk', metalurgicaTenant)).toBe(true);
    expect(isModuleRecommendedForTenant('drawback_aap', metalurgicaTenant)).toBe(true);
  });

  it('deve mapear Clínica Médica para Fator R e Retenção ISSQN', () => {
    const profile = matchSectorProfile(clinicaTenant);
    expect(profile?.id).toBe('medical_health');
    expect(isModuleRecommendedForTenant('office_optimal_prolabore', clinicaTenant)).toBe(true);
    expect(isModuleRecommendedForTenant('office_issqn_withholding', clinicaTenant)).toBe(true);
  });

  it('deve mapear Produtor Rural para LCDPR e CPC 29', () => {
    const profile = matchSectorProfile(agroTenant);
    expect(profile?.id).toBe('agribusiness_rural');
    expect(isModuleRecommendedForTenant('cattle_agro_lcdpr', agroTenant)).toBe(true);
  });

  it('deve retornar vazio ou false com segurança para empresa sem CNAE', () => {
    expect(matchSectorProfile(null)).toBeNull();
    expect(getRecommendedModulesForTenant(null)).toEqual([]);
    expect(isModuleRecommendedForTenant('office_monophasic_tax', null)).toBe(false);
  });
});