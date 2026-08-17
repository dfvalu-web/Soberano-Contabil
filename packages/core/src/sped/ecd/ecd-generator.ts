import { SpedWriter } from '../formatter/sped-writer.js';
import { Company } from '../../types/company.js';
import { Account, JournalEntry } from '../../types/accounting.js';

export function generateSpedEcd(
  company: Company,
  ano: number,
  accounts: Account[],
  entries: JournalEntry[]
): string {
  const writer = new SpedWriter();

  // BLOCO 0 - Abertura e Identificação
  writer.addRecord('0000', 'LECD', `0101${ano}`, `3112${ano}`, company.razaoSocial, company.cnpj, company.uf, company.inscricaoEstadual || '', company.codigoMunicipioIbge, '', '0', '1');
  writer.addRecord('0001', '0'); // Abertura do Bloco 0
  writer.addRecord('0007', '00', '00'); // Outras Inscrições / CNAE
  writer.addRecord('0990', '4'); // Encerramento Bloco 0

  // BLOCO I - Lançamentos Contábeis
  writer.addRecord('I001', '0'); // Abertura do Bloco I
  writer.addRecord('I010', 'G', '10.00'); // Livro Diário Geral
  writer.addRecord('I030', 'TERMO DE ABERTURA', '1', 'LIVRO DIARIO', company.razaoSocial, company.cnpj);

  // I050 - Plano de Contas
  for (const acc of accounts) {
    writer.addRecord('I050', `0101${ano}`, acc.tipo === 'ATIVO' || acc.tipo === 'DESPESA' || acc.tipo === 'CUSTO' ? 'D' : 'C', acc.isAnalitica ? 'A' : 'S', acc.nivel, acc.codigo, acc.codigoReduzido, acc.nome);
    if (acc.codigoContaReferencialRfb) {
      writer.addRecord('I051', '1', acc.codigoContaReferencialRfb); // Mapeamento Plano Referencial RFB
    }
  }

  // I150 e I155 - Saldos Periódicos
  writer.addRecord('I150', `0101${ano}`, `3112${ano}`);
  for (const acc of accounts) {
    if (acc.isAnalitica) {
      writer.addRecord('I155', acc.codigo, acc.codigoReduzido, '0,00', 'D', '0,00', '0,00', Math.abs(acc.saldoAtual), acc.saldoAtual >= 0 ? 'D' : 'C');
    }
  }

  // I200 e I250 - Lançamentos Contábeis em Partidas Dobradas
  for (const entry of entries) {
    const dataFormatada = entry.data.replace(/-/g, '');
    writer.addRecord('I200', entry.numeroLancamento, dataFormatada, entry.totalDebito, 'N');
    for (const linha of entry.linhas) {
      writer.addRecord('I250', linha.accountCode, '', linha.amount, linha.type === 'DEBIT' ? 'D' : 'C', entry.numeroLancamento, entry.historicoPadrao);
    }
  }

  writer.addRecord('I990', '100'); // Encerramento Bloco I

  // BLOCO J - Demonstrações Contábeis
  writer.addRecord('J001', '0'); // Abertura Bloco J
  writer.addRecord('J005', `0101${ano}`, `3112${ano}`, '1', 'DEMONSTRACOES CONTABEIS');
  writer.addRecord('J100', '1', '1', 'TOTAL DO ATIVO', '0', '100000,00', 'D'); // Balanço J100
  writer.addRecord('J150', '1', '1', 'RECEITA BRUTA', '0', '100000,00', 'C'); // DRE J150
  writer.addRecord('J900', 'TERMO DE ENCERRAMENTO', '1', 'LIVRO DIARIO', company.razaoSocial, company.cnpj);
  writer.addRecord('J930', 'CONTADOR RESPONSAVEL', '12345678900', 'CONTADOR', 'CRC 12345/O', 'contador@soberano.com.br', '1199999999');
  writer.addRecord('J990', '10'); // Encerramento Bloco J

  // BLOCO 9 - Encerramento e Totalizadores
  writer.closeBlock9();

  return writer.build();
}
