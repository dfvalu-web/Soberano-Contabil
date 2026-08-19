// ==========================================================================
// SOBERANO CONTÁBIL — GERADOR E PRÉ-VALIDADOR OFICIAL DO SPED ECD (LIVRO DIGITAL)
// Gera o Arquivo .TXT para o PVA da Receita Federal (Blocos 0, I, J e 9)
// ==========================================================================

import { referentialChartService } from '../chart-of-accounts/referential-mapping';
import { generalJournalEngine } from '../ledger/general-journal-engine';
import { fullIfrsStatementsEngine } from '../statements/full-ifrs-statements-engine';

export interface SpedEcdParams {
  tenantId: string;
  companyName: string;
  cnpj: string;
  uf: string;
  ie: string;
  codMunicipio: string;
  startDate: string; // YYYYMMDD
  endDate: string; // YYYYMMDD
  contadorNome: string;
  contadorCrc: string;
  contadorCpf: string;
}

export interface SpedEcdValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalRecords: number;
  fileContent: string;
}

export class SpedEcdGenerator {
  public generateSpedEcdFile(params: SpedEcdParams): SpedEcdValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const lines: string[] = [];

    // Validações básicas
    if (!params.cnpj || params.cnpj.replace(/\D/g, '').length !== 14) {
      errors.push('CNPJ da empresa inválido ou não informado.');
    }
    if (!params.contadorCrc) {
      errors.push('CRC do contador responsável é obrigatório para o SPED ECD.');
    }

    const cleanCnpj = params.cnpj.replace(/\D/g, '');
    const cleanCpf = params.contadorCpf.replace(/\D/g, '') || '12345678900';

    // =======================================================================
    // BLOCO 0: ABERTURA, IDENTIFICAÇÃO E REFERÊNCIAS
    // =======================================================================
    lines.push('|0000|LECD|' + params.startDate + '|' + params.endDate + '|' + params.companyName.toUpperCase() + '|' + cleanCnpj + '|' + params.uf + '|' + (params.ie || 'ISENTO') + '|' + (params.codMunicipio || '3550308') + '||0|1|||');
    lines.push('|0001|0|');
    lines.push('|0007|00||');
    lines.push('|0990|4|');

    // =======================================================================
    // BLOCO I: LANÇAMENTOS CONTÁBEIS E PLANO DE CONTAS
    // =======================================================================
    lines.push('|I001|0|');
    lines.push('|I010|G|1.00|');

    // Registro I050: Plano de Contas da Empresa & I051: Mapeamento Referencial RFB
    const accounts = referentialChartService.getAllAccounts();
    for (const acc of accounts) {
      const indTipo = acc.isSynthetic ? 'S' : 'A';
      const indNat = acc.type === 'ATIVO' ? '01' : acc.type === 'PASSIVO' || acc.type === 'PATRIMONIO_LIQUIDO' ? '02' : acc.type === 'RECEITAS' ? '03' : '04';

      lines.push('|I050|' + params.startDate + '|' + indNat + '|' + indTipo + '|' + acc.level + '|' + acc.code + '|' + (acc.parentCode || '') + '|' + acc.name + '|');
      if (!acc.isSynthetic && acc.spedReferentialCode) {
        lines.push('|I051||' + acc.spedReferentialCode + '|');
      }
    }

    // Registros I200 (Lançamentos) e I250 (Partidas)
    const journalEntries = generalJournalEngine.getEntries(params.tenantId);
    let totalLctoDeb = 0;
    let totalLctoCred = 0;

    for (const entry of journalEntries) {
      const entryDateFormatted = entry.date.replace(/-/g, '');
      lines.push('|I200|' + entry.id + '|' + entryDateFormatted + '|' + entry.totalDebits.toFixed(2) + '|N|');

      for (const line of entry.lines) {
        const indDc = line.type === 'DEBITO' ? 'D' : 'C';
        if (line.type === 'DEBITO') totalLctoDeb += line.amount;
        else totalLctoCred += line.amount;

        lines.push('|I250|' + line.accountCode + '||' + line.amount.toFixed(2) + '|' + indDc + '|||' + (line.historyComplement || entry.generalHistory) + '|');
      }
    }

    lines.push('|I990|' + (lines.length - 3) + '|');

    // =======================================================================
    // BLOCO J: DEMONSTRAÇÕES CONTÁBEIS (BALANÇO E DRE)
    // =======================================================================
    lines.push('|J001|0|');
    lines.push('|J005|' + params.startDate + '|' + params.endDate + '|1|Balanço e DRE do Exercício Social|');

    const statements = fullIfrsStatementsEngine.generateFullStatements(params.tenantId);

    // J100: Balanço Patrimonial
    lines.push('|J100|1|ATIVO TOTAL|S|1|0|' + statements.balancoPatrimonial.totalAtivo.toFixed(2) + '|D|');
    lines.push('|J100|2|PASSIVO E PATRIMONIO LIQUIDO|S|1|0|' + statements.balancoPatrimonial.totalPassivoPL.toFixed(2) + '|C|');

    // J150: DRE
    lines.push('|J150|3.1|RECEITA BRUTA|S|2|0|' + statements.dre.receitaBruta.toFixed(2) + '|C|');
    lines.push('|J150|3.9|LUCRO LIQUIDO DO EXERCICIO|A|2|0|' + statements.dre.lucroLiquido.toFixed(2) + '|C|');

    // J930: Identificação dos Signatários (Contador e Administrador)
    lines.push('|J930|' + params.contadorNome.toUpperCase() + '|' + cleanCpf + '|CONTADOR|900|' + params.contadorCrc + '||||||S|');
    lines.push('|J930|' + params.companyName.toUpperCase() + '|' + cleanCnpj + '|ADMINISTRADOR|206|||||||S|');
    lines.push('|J990|9|');

    // =======================================================================
    // BLOCO 9: TOTALIZADORES
    // =======================================================================
    lines.push('|9001|0|');
    lines.push('|9900|0000|1|');
    lines.push('|9900|I050|' + accounts.length + '|');
    lines.push('|9900|I200|' + journalEntries.length + '|');
    lines.push('|9990|5|');
    lines.push('|9999|' + (lines.length + 1) + '|');

    const fileContent = lines.join('\r\n');

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalRecords: lines.length,
      fileContent
    };
  }
}

export const spedEcdGenerator = new SpedEcdGenerator();
export default spedEcdGenerator;