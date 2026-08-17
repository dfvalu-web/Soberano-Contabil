import { Company } from '../../types/company.js';
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
