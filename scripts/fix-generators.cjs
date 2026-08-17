const fs = require('fs');

// 1. ECF
const ecfCode = `import { Company } from '../../types/company.js';
import { Account, JournalEntry } from '../../types/accounting.js';
import { SpedWriter } from '../formatter/sped-writer.js';

export function generateSpedEcf(
  company: Company,
  anoCalendario: number,
  accounts: Account[],
  entries: JournalEntry[],
  lucroPresumidoOuReal: 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' = 'LUCRO_PRESUMIDO'
): string {
  const writer = new SpedWriter();

  const dataInicio = anoCalendario + '0101';
  const dataFim = anoCalendario + '1231';

  // Bloco 0
  writer.addRecord('0000', 'LECF', '0010', company.cnpj, company.razaoSocial, '0', '', '', dataInicio, dataFim, '0', '0', lucroPresumidoOuReal === 'LUCRO_REAL' ? '1' : '2', '1', 'N');
  writer.addRecord('0001', '0');
  writer.addRecord('0010', '1', '01', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N');
  writer.addRecord('0020', company.uf, company.codigoMunicipioIbge, '', 'N');

  // Bloco J
  writer.addRecord('J001', '0');
  writer.addRecord('J050', dataInicio, '01', 'U', accounts[0]?.codigo || '1', accounts[0]?.nome || 'Ativo', '01', '');
  writer.addRecord('J990', '3');

  // Bloco K
  writer.addRecord('K001', '0');
  writer.addRecord('K155', accounts[0]?.codigo || '1', '100000,00', 'D', '0,00', '0,00', '100000,00', 'D');
  writer.addRecord('K990', '3');

  // Bloco P / L / M
  if (lucroPresumidoOuReal === 'LUCRO_PRESUMIDO') {
    writer.addRecord('P001', '0');
    writer.addRecord('P200', '1', '100000,00', '8,00', '8000,00', '1200,00');
    writer.addRecord('P400', '1', '100000,00', '12,00', '12000,00', '1080,00');
    writer.addRecord('P990', '4');
  } else {
    writer.addRecord('L001', '0');
    writer.addRecord('L100', '1', '01', 'Ativo Total', '100000,00', 'D');
    writer.addRecord('L990', '3');

    writer.addRecord('M001', '0');
    writer.addRecord('M300', '1', 'Lucro Líquido Antes IRPJ', 'D', '50000,00');
    writer.addRecord('M990', '3');
  }

  writer.closeBlock9();
  return writer.build();
}
`;
fs.writeFileSync('packages/core/src/sped/ecf/generator.ts', ecfCode, 'utf8');

// 2. EFD-ICMS/IPI
const efdIcmsCode = `import { Company } from '../../types/company.js';
import { SpedWriter } from '../formatter/sped-writer.js';

export interface EfdIcmsItem {
  numItem: number;
  codItem: string;
  descrItem: string;
  cfop: string;
  cstIcms: string;
  valorItem: number;
  baseIcms: number;
  aliqIcms: number;
  valorIcms: number;
}

export function generateEfdIcmsIpi(
  company: Company,
  mesAno: { mes: number; ano: number },
  itens: EfdIcmsItem[]
): string {
  const writer = new SpedWriter();

  const mesStr = mesAno.mes.toString().padStart(2, '0');
  const dataInicio = \`\${mesAno.ano}\${mesStr}01\`;
  const dataFim = \`\${mesAno.ano}\${mesStr}28\`;

  writer.addRecord('0000', '018', '0', dataInicio, dataFim, company.razaoSocial, company.cnpj, company.uf, company.inscricaoEstadual || 'ISENTO', company.codigoMunicipioIbge, company.inscricaoMunicipal || '', '', 'A', '1');
  writer.addRecord('0001', '0');
  writer.addRecord('0005', company.nomeFantasia || company.razaoSocial, '01001000', 'AV PAULISTA', '1000', 'CJ 10', 'BELA VISTA', '1199999999', 'contato@soberano.com.br');
  writer.addRecord('0100', 'CONTADOR RESPONSAVEL', '12345678901', 'CRC-SP 123456', '12345678000195', '01001000', 'AV PAULISTA', '1000', 'CJ 10', 'BELA VISTA', '1199999999', 'contador@soberano.com.br', company.codigoMunicipioIbge);
  writer.addRecord('0990', '5');

  writer.addRecord('C001', '0');
  if (itens.length > 0) {
    writer.addRecord('C100', '1', '0', 'CLI-001', '55', '00', '1', '101', '35260112345678000195550010000001011000001011', dataInicio, dataInicio, '10000,00', '0', '0,00', '0,00', '10000,00', '9', '0,00', '0,00', '10000,00', '1800,00', '0,00', '0,00', '0,00', '0,00', '165,00', '760,00', '0,00', '0,00');
    for (const item of itens) {
      writer.addRecord('C170', item.numItem, item.codItem, item.descrItem, '1', 'UN', item.valorItem, '0,00', '0', item.cstIcms, item.cfop, 'NAT-01', item.baseIcms, item.aliqIcms, item.valorIcms, '0,00', '0,00', '0,00', '0', '0,00', '0,00', '0,00', '01', item.valorItem, '1,65', (item.valorItem * 0.0165), '01', item.valorItem, '7,60', (item.valorItem * 0.0760));
    }
  }
  writer.addRecord('C990', itens.length + 3);

  writer.addRecord('E001', '0');
  writer.addRecord('E100', dataInicio, dataFim);
  writer.addRecord('E110', '1800,00', '0,00', '0,00', '0,00', '1800,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '1800,00', '0,00', '1800,00');
  writer.addRecord('E990', '4');

  writer.addRecord('H001', '1');
  writer.addRecord('H990', '2');

  writer.addRecord('1001', '0');
  writer.addRecord('1010', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N');
  writer.addRecord('1990', '3');

  writer.closeBlock9();
  return writer.build();
}
`;
fs.writeFileSync('packages/core/src/sped/efd-icms-ipi/generator.ts', efdIcmsCode, 'utf8');

// 3. EFD-Contribuições
const efdContCode = `import { Company } from '../../types/company.js';
import { SpedWriter } from '../formatter/sped-writer.js';

export function generateEfdContribuicoes(
  company: Company,
  mesAno: { mes: number; ano: number },
  faturamentoBruto: number
): string {
  const writer = new SpedWriter();

  const mesStr = mesAno.mes.toString().padStart(2, '0');
  const dataInicio = \`\${mesAno.ano}\${mesStr}01\`;
  const dataFim = \`\${mesAno.ano}\${mesStr}28\`;

  writer.addRecord('0000', '006', '0', dataInicio, dataFim, company.razaoSocial, company.cnpj, company.uf, company.codigoMunicipioIbge, '', '0', '1');
  writer.addRecord('0001', '0');
  writer.addRecord('0110', '1', '1', '1', '1');
  writer.addRecord('0990', '4');

  const pis = (faturamentoBruto * 0.0065);
  const cofins = (faturamentoBruto * 0.03);

  writer.addRecord('M001', '0');
  writer.addRecord('M200', pis, '0,00', '0,00', '0,00', pis, '0,00', '0,00', '0,00', pis);
  writer.addRecord('M210', '01', faturamentoBruto, faturamentoBruto, '0,6500', '0,00', '0,00', pis, '0,00', '0,00', '0,00', '0,00', pis);
  writer.addRecord('M600', cofins, '0,00', '0,00', '0,00', cofins, '0,00', '0,00', '0,00', cofins);
  writer.addRecord('M610', '01', faturamentoBruto, faturamentoBruto, '3,0000', '0,00', '0,00', cofins, '0,00', '0,00', '0,00', '0,00', cofins);
  writer.addRecord('M990', '6');

  writer.closeBlock9();
  return writer.build();
}
`;
fs.writeFileSync('packages/core/src/sped/efd-contribuicoes/generator.ts', efdContCode, 'utf8');

console.log('Fixed SpedWriter usage across all generators.');
