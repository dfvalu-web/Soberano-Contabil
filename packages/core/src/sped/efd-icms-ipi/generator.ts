import { Company } from '../../types/company.js';
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
  const dataInicio = `${mesAno.ano}${mesStr}01`;
  const dataFim = `${mesAno.ano}${mesStr}28`;

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
