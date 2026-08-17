import { describe, it, expect } from 'vitest';
import { generateSpedEcf } from '../src/sped/ecf/generator.js';
import { generateEfdIcmsIpi } from '../src/sped/efd-icms-ipi/generator.js';
import { generateEfdContribuicoes } from '../src/sped/efd-contribuicoes/generator.js';
import { validateSpedFile } from '../src/sped/validator/pva-validator.js';
import { Company } from '../src/types/company.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 4: Suite SPED Completa (ECF, EFD-ICMS/IPI e EFD-Contribuicoes)', () => {
  const mockCompany: Company = {
    id: 'comp-1',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO INDUSTRIA E COMERCIO LTDA',
    nomeFantasia: 'Soberano Indústria',
    cnaePrincipal: '4751201',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_PRESUMIDO',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('deve gerar ECF (Sped Contábil Fiscal) válida com Blocos 0, J, K, P e 9', () => {
    const ecfTxt = generateSpedEcf(mockCompany, 2025, [], []);
    expect(ecfTxt).toContain('|0000|LECF|');
    expect(ecfTxt).toContain('|P200|1|100000,00|8,00|8000,00|1200,00|');
    expect(ecfTxt).toContain('|9999|');

    const val = validateSpedFile('ECF', ecfTxt);
    const rep = unwrap(val);
    expect(rep.isAprovadoPreFlight).toBe(true);
    expect(rep.totalErros).toBe(0);
  });

  it('deve gerar EFD ICMS/IPI (Sped Fiscal) com Blocos 0, C100/C170, E110 e 9', () => {
    const efdTxt = generateEfdIcmsIpi(mockCompany, { mes: 1, ano: 2026 }, [
      {
        numItem: 1,
        codItem: 'PROD-001',
        descrItem: 'Item Comercial A',
        cfop: '5102',
        cstIcms: '00',
        valorItem: 10000.00,
        baseIcms: 10000.00,
        aliqIcms: 18.00,
        valorIcms: 1800.00
      }
    ]);

    expect(efdTxt).toContain('|C100|1|0|CLI-001|55|');
    expect(efdTxt).toContain('|C170|1|PROD-001|Item Comercial A|1|UN|10000,00|');
    expect(efdTxt).toContain('|E110|1800,00|');
    expect(efdTxt).toContain('|9999|');

    const val = validateSpedFile('EFD_ICMS_IPI', efdTxt);
    const rep = unwrap(val);
    expect(rep.isAprovadoPreFlight).toBe(true);
  });

  it('deve gerar EFD-Contribuições com Apuração de PIS (M200) e COFINS (M600)', () => {
    const contTxt = generateEfdContribuicoes(mockCompany, { mes: 1, ano: 2026 }, 100000.00);
    expect(contTxt).toContain('|M200|650,00|');
    expect(contTxt).toContain('|M600|3000,00|');
    expect(contTxt).toContain('|9999|');

    const val = validateSpedFile('EFD_CONTRIBUICOES', contTxt);
    const rep = unwrap(val);
    expect(rep.isAprovadoPreFlight).toBe(true);
  });
});
