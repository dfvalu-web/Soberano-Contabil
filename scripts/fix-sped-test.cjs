const fs = require('fs');
const content = `import { describe, it, expect } from 'vitest';
import { generateSpedEcd } from '../src/sped/ecd/ecd-generator.js';
import { validateSpedFile } from '../src/sped/validator/pva-validator.js';
import { createStandardChartOfAccounts } from '../src/accounting/chart-of-accounts/standard-chart.js';
import { DoubleEntryEngine } from '../src/accounting/ledger/double-entry.js';
import { Company } from '../src/types/company.js';
import { unwrap } from '../src/types/result.js';

describe('SPED ECD & Validador PVA Pre-Flight', () => {
  const mockCompany: Company = {
    id: 'comp-1',
    tenantId: 'tenant-1',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO TECNOLOGIA E SERVICOS CONTABEIS LTDA',
    nomeFantasia: 'Soberano Contábil',
    cnaePrincipal: '6920601',
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

  it('deve gerar um arquivo SPED ECD válido e passar na validação Pre-Flight PVA sem erros', () => {
    const contas = createStandardChartOfAccounts('tenant-1');
    const engine = new DoubleEntryEngine(contas);
    
    engine.postEntry(
      'tenant-1',
      '2026-01-15',
      'Recebimento de Duplicatas',
      [
        { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 5000.00 },
        { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'CREDIT', amount: 5000.00 }
      ]
    );

    const spedConteudo = generateSpedEcd(mockCompany, 2026, engine.getAccounts(), engine.getEntries());
    expect(spedConteudo).toContain('|0000|LECD|01012026|31122026|');
    expect(spedConteudo).toContain('|I010|G|10.00|');
    expect(spedConteudo).toContain('|9999|');

    const validacao = unwrap(validateSpedFile('ECD', spedConteudo));
    expect(validacao.isAprovadoPreFlight).toBe(true);
    expect(validacao.totalErros).toBe(0);
    expect(validacao.totalLinhas).toBeGreaterThan(10);
  });

  it('deve acusar erro Pre-Flight quando uma conta contábil for lançada sem constar no registro I050', () => {
    const lines = [
      '|0000|LECD|01012026|31122026|EMPRESA TESTE|12345678000195|SP||3550308||0|1|',
      '|I050|01012026|D|A|4|1.1.1.01|101|Caixa Geral|',
      '|I200|1|15012026|1000,00|N|',
      '|I250|9.9.9.99||1000,00|D|1|Lancamento Fantasma|',
      '|I250|1.1.1.01||1000,00|C|1|Contrapartida|',
      '|9999|6|'
    ];
    const spedInvalido = lines.join(String.fromCharCode(10));

    const validacao = unwrap(validateSpedFile('ECD', spedInvalido));
    expect(validacao.isAprovadoPreFlight).toBe(false);
    expect(validacao.totalErros).toBeGreaterThan(0);
    expect(validacao.inconsistencias[0]?.campo).toBe('COD_CTA');
  });
});
`;
fs.writeFileSync('packages/core/tests/sped.test.ts', content, 'utf8');
console.log('Fixed sped.test.ts');
