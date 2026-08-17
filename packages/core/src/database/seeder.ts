import { Company } from '../types/company.js';
import { Account } from '../types/accounting.js';
import { createStandardChartOfAccounts } from '../accounting/chart-of-accounts/standard-chart.js';
import { SecurityEngine } from '../security/crypto.js';

export interface SeedDataset {
  tenants: Array<{ id: string; name: string; slug: string }>;
  companies: Company[];
  accounts: Account[];
  users: Array<{ id: string; tenantId: string; name: string; email: string; role: string }>;
}

export function generateSeedData(): SeedDataset {
  const security = new SecurityEngine();
  const tenantId = 'tenant-soberano-01';

  const tenants = [
    {
      id: tenantId,
      name: 'Soberano Gestão Contábil & Auditoria',
      slug: 'soberano-contabil'
    }
  ];

  const companies: Company[] = [
    {
      id: 'comp-real-01',
      tenantId,
      cnpj: '12345678000195',
      razaoSocial: 'SOBERANO INDUSTRIA E TECNOLOGIA S/A',
      nomeFantasia: 'Soberano Indústria',
      cnaePrincipal: '2621300', // Fabricação de computadores e periféricos
      cnaesSecundarios: ['6201501', '4751201'],
      regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
      uf: 'SP',
      codigoMunicipioIbge: '3550308', // São Paulo
      aliquotaIssMunicipal: 0.05,
      fatorRElegivel: false,
      optanteSimples: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'comp-presumido-02',
      tenantId,
      cnpj: '98765432000188',
      razaoSocial: 'SOBERANO LOGISTICA E TRANSPORTES LTDA',
      nomeFantasia: 'Soberano Log',
      cnaePrincipal: '4930202', // Transporte rodoviário de carga
      cnaesSecundarios: [],
      regimeTributario: 'LUCRO_PRESUMIDO',
      uf: 'RJ',
      codigoMunicipioIbge: '3304557', // Rio de Janeiro
      aliquotaIssMunicipal: 0.05,
      fatorRElegivel: false,
      optanteSimples: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'comp-simples-03',
      tenantId,
      cnpj: '11223344000155',
      razaoSocial: 'SOBERANO SOFTWARES E SOLUCOES DIGITAIS ME',
      nomeFantasia: 'Soberano Digital',
      cnaePrincipal: '6202300', // Desenvolvimento de programas sob encomenda
      cnaesSecundarios: [],
      regimeTributario: 'SIMPLES_NACIONAL',
      uf: 'MG',
      codigoMunicipioIbge: '3106200', // Belo Horizonte
      aliquotaIssMunicipal: 0.03,
      fatorRElegivel: true,
      optanteSimples: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const accounts = createStandardChartOfAccounts(tenantId);

  const users = [
    {
      id: 'user-admin-01',
      tenantId,
      name: 'David Gestor Tributário',
      email: 'david@soberano.com.br',
      role: 'ADMIN'
    },
    {
      id: 'user-auditor-02',
      tenantId,
      name: 'Auditor Fiscal Senior',
      email: 'auditoria@soberano.com.br',
      role: 'TAX_AUDITOR'
    }
  ];

  return { tenants, companies, accounts, users };
}
