const fs = require('fs');

const code = `import { SpedRecord } from '../../types/sped.js';

export class SpedWriter {
  private lines: string[] = [];
  private recordCounts: Map<string, number> = new Map();

  public addRecord(registro: string, ...campos: (string | number | undefined | null)[]): void {
    const formattedFields = campos.map(f => {
      if (f === undefined || f === null) return '';
      if (typeof f === 'number') {
        // Se for inteiro puro e for indicador ou sequência curta, mantém inteiro, senão formata com 2 casas
        if (Number.isInteger(f) && (f >= 0 && f <= 9999 && !String(f).includes('.'))) {
          return String(f);
        }
        return f.toFixed(2).replace('.', ',');
      }
      return String(f).replace(/\\|/g, '');
    });

    const line = '|' + registro + '|' + formattedFields.join('|') + '|';
    this.lines.push(line);

    const count = this.recordCounts.get(registro) || 0;
    this.recordCounts.set(registro, count + 1);
  }

  public closeBlock9(): void {
    this.addRecord('9001', '0');

    for (const [reg, count] of this.recordCounts.entries()) {
      this.addRecord('9900', reg, count);
    }
    
    this.addRecord('9900', '9001', 1);
    this.addRecord('9900', '9900', this.recordCounts.size + 4);
    this.addRecord('9900', '9990', 1);
    this.addRecord('9900', '9999', 1);

    this.addRecord('9990', this.lines.length + 2);
    this.addRecord('9999', this.lines.length + 1);
  }

  public build(): string {
    return this.lines.join(String.fromCharCode(13, 10));
  }

  public getLines(): string[] {
    return [...this.lines];
  }
}
`;
fs.writeFileSync('packages/core/src/sped/formatter/sped-writer.ts', code, 'utf8');

// Ajuste nos generators para passar strings formatadas nos campos decimais
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

  const pis = (faturamentoBruto * 0.0065).toFixed(2).replace('.', ',');
  const cofins = (faturamentoBruto * 0.03).toFixed(2).replace('.', ',');
  const fatStr = faturamentoBruto.toFixed(2).replace('.', ',');

  writer.addRecord('M001', '0');
  writer.addRecord('M200', pis, '0,00', '0,00', '0,00', pis, '0,00', '0,00', '0,00', pis);
  writer.addRecord('M210', '01', fatStr, fatStr, '0,6500', '0,00', '0,00', pis, '0,00', '0,00', '0,00', '0,00', pis);
  writer.addRecord('M600', cofins, '0,00', '0,00', '0,00', cofins, '0,00', '0,00', '0,00', cofins);
  writer.addRecord('M610', '01', fatStr, fatStr, '3,0000', '0,00', '0,00', cofins, '0,00', '0,00', '0,00', '0,00', cofins);
  writer.addRecord('M990', '6');

  writer.closeBlock9();
  return writer.build();
}
`;
fs.writeFileSync('packages/core/src/sped/efd-contribuicoes/generator.ts', efdContCode, 'utf8');

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
      writer.addRecord('C170', item.numItem, item.codItem, item.descrItem, '1', 'UN', item.valorItem.toFixed(2).replace('.', ','), '0,00', '0', item.cstIcms, item.cfop, 'NAT-01', item.baseIcms.toFixed(2).replace('.', ','), item.aliqIcms.toFixed(2).replace('.', ','), item.valorIcms.toFixed(2).replace('.', ','), '0,00', '0,00', '0,00', '0', '0,00', '0,00', '0,00', '01', item.valorItem.toFixed(2).replace('.', ','), '1,65', (item.valorItem * 0.0165).toFixed(2).replace('.', ','), '01', item.valorItem.toFixed(2).replace('.', ','), '7,60', (item.valorItem * 0.0760).toFixed(2).replace('.', ','));
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

console.log('Fixed decimal string formatting in SpedWriter and generators.');
