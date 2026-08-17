import { describe, it, expect } from 'vitest';
import { calculateVacations, calculateThirteenthSalary, calculateMonthlyProvisions } from '../src/payroll/benefits/vacation-thirteenth.js';
import { generateEsocialS1000Xml, generateEsocialS1200Xml } from '../src/payroll/esocial/xml-generator.js';
import { Company } from '../src/types/company.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 5: Recursos Humanos, Folha & eSocial Avancado', () => {
  const mockCompany: Company = {
    id: 'comp-1',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO TECNOLOGIA LTDA',
    nomeFantasia: 'Soberano Tech',
    cnaePrincipal: '6201501',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_PRESUMIDO',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: true,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('deve calcular ferias completas (20 dias de gozo + 10 dias abono pecuniario)', () => {
    const res = calculateVacations({
      salarioBase: 6000.00,
      diasGozoFerias: 20,
      diasAbonoPecuniario: 10,
      dependentesIrrf: 1
    });

    const data = unwrap(res);
    expect(data.valorDiasFerias).toBe(4000.00); // (6000/30) * 20
    expect(data.tercoConstitucional).toBe(1333.33); // 4000 / 3
    expect(data.valorAbonoPecuniario).toBe(2000.00); // (6000/30) * 10
    expect(data.tercoAbonoPecuniario).toBe(666.67); // 2000 / 3
    expect(data.totalBrutoFerias).toBe(8000.00); // 4000 + 1333.33 + 2000 + 666.67
    expect(data.descontoInss).toBeGreaterThan(0);
    expect(data.liquidoFeriasAReceber).toBeGreaterThan(0);
  });

  it('deve calcular 13o salario na 1a parcela (50% sem desconto) e 2a parcela com descontos integrais', () => {
    const p1 = unwrap(calculateThirteenthSalary({ salarioBase: 6000.00, mesesTrabalhadosNoAno: 12, parcela: 'PRIMEIRA' }));
    expect(p1.valorBrutoParcela).toBe(3000.00);
    expect(p1.descontoInss).toBe(0);
    expect(p1.liquidoAReceber).toBe(3000.00);

    const p2 = unwrap(calculateThirteenthSalary({
      salarioBase: 6000.00,
      mesesTrabalhadosNoAno: 12,
      parcela: 'SEGUNDA',
      valorPagoPrimeiraParcela: 3000.00
    }));
    expect(p2.valorBrutoParcela).toBe(6000.00);
    expect(p2.descontoAdiantamentoPrimeiraParcela).toBe(3000.00);
    expect(p2.descontoInss).toBeGreaterThan(0);
    expect(p2.liquidoAReceber).toBeLessThan(3000.00);
  });

  it('deve calcular as provisões mensais contábeis de férias (1/12 + 1/3) e 13º com encargos patronais', () => {
    const res = calculateMonthlyProvisions({ folhaBrutaMensal: 120000.00 });
    const data = unwrap(res);

    expect(data.provisaoFeriasPrincipal).toBe(13333.33); // (120k / 12) * 4/3
    expect(data.provisaoDecimoTerceiroPrincipal).toBe(10000.00); // 120k / 12
    expect(data.totalProvisoesDoMes).toBeGreaterThan(30000.00);
  });

  it('deve gerar XMLs do eSocial válidos (S-1000 Empregador e S-1200 Remuneração)', () => {
    const s1000 = generateEsocialS1000Xml(mockCompany);
    expect(s1000).toContain('<evtInfoEmpregador');
    expect(s1000).toContain('<nrInsc>12345678000195</nrInsc>');

    const s1200 = generateEsocialS1200Xml(mockCompany, '12345678901', 'MATR-001', '2026-01', 6000.00, 650.00);
    expect(s1200).toContain('<evtRemun');
    expect(s1200).toContain('<cpfTrab>12345678901</cpfTrab>');
    expect(s1200).toContain('<vrRubr>6000.00</vrRubr>');
  });
});
