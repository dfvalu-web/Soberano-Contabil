import { Company } from '../../types/company.js';
import { SpedWriter } from '../formatter/sped-writer.js';

export function generateEfdContribuicoes(
  company: Company,
  mesAno: { mes: number; ano: number },
  faturamentoBruto: number
): string {
  const writer = new SpedWriter();

  const mesStr = mesAno.mes.toString().padStart(2, '0');
  const dataInicio = `${mesAno.ano}${mesStr}01`;
  const dataFim = `${mesAno.ano}${mesStr}28`;

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
