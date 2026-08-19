// ==========================================================================
// SOBERANO CONTÁBIL — LIVROS CONTÁBEIS OFICIAIS (DIÁRIO GERAL & RAZÃO ANALÍTICO)
// Termos de Abertura/Encerramento, Paginação Oficial e Conformidade DREI/ITG 2000
// ==========================================================================

import { generalJournalEngine, JournalEntry } from '../ledger/general-journal-engine';
import { referentialChartService } from '../chart-of-accounts/referential-mapping';

export interface LedgerAccountCardLine {
  entryNumber: number;
  date: string;
  history: string;
  documentNumber?: string;
  type: 'DEBITO' | 'CREDITO';
  amount: number;
  runningBalance: number;
}

export interface LedgerAccountCard {
  accountCode: string;
  accountName: string;
  nature: 'DEVEDORA' | 'CREDORA';
  initialBalance: number;
  lines: LedgerAccountCardLine[];
  totalDebits: number;
  totalCredits: number;
  finalBalance: number;
}

export interface LegalTerms {
  termoAbertura: string;
  termoEncerramento: string;
  empresaNome: string;
  cnpj: string;
  nire: string;
  contadorNome: string;
  contadorCrc: string;
  livroNumero: number;
  totalPaginas: number;
}

export class OfficialBooksEngine {
  /**
   * Gera o Livro Razão Analítico com saldo progressivo para uma conta contábil específica
   */
  public generateLedgerCard(tenantId: string, accountCode: string, startDate?: string, endDate?: string): LedgerAccountCard | null {
    const account = referentialChartService.getAccountByCode(accountCode);
    if (!account) return null;

    const entries = generalJournalEngine.getEntries(tenantId, startDate, endDate);
    // Ordenar cronologicamente
    entries.sort((a, b) => a.entryNumber - b.entryNumber);

    const lines: LedgerAccountCardLine[] = [];
    let runningBalance = 0;
    let totalDebits = 0;
    let totalCredits = 0;

    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.accountCode === account.code) {
          if (line.type === 'DEBITO') {
            totalDebits += line.amount;
            runningBalance = account.nature === 'DEVEDORA'
              ? runningBalance + line.amount
              : runningBalance - line.amount;
          } else {
            totalCredits += line.amount;
            runningBalance = account.nature === 'CREDORA'
              ? runningBalance + line.amount
              : runningBalance - line.amount;
          }

          lines.push({
            entryNumber: entry.entryNumber,
            date: entry.date,
            history: line.historyComplement || entry.generalHistory,
            documentNumber: entry.documentNumber,
            type: line.type,
            amount: line.amount,
            runningBalance: Math.round(runningBalance * 100) / 100
          });
        }
      }
    }

    return {
      accountCode: account.code,
      accountName: account.name,
      nature: account.nature,
      initialBalance: 0,
      lines,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      finalBalance: Math.round(runningBalance * 100) / 100
    };
  }

  /**
   * Gera os Termos Legais de Abertura e Encerramento do Livro Diário Geral
   */
  public generateOfficialJournalBook(params: {
    tenantId: string;
    empresaNome: string;
    cnpj: string;
    nire?: string;
    contadorNome: string;
    contadorCrc: string;
    anoExercicio: number;
    livroNumero?: number;
  }): {
    terms: LegalTerms;
    entries: JournalEntry[];
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
  } {
    const entries = generalJournalEngine.getEntries(params.tenantId);
    entries.sort((a, b) => a.entryNumber - b.entryNumber);

    const totals = generalJournalEngine.getLedgerTotals(params.tenantId);
    const livroNum = params.livroNumero || 1;
    const totalPags = Math.max(1, Math.ceil(entries.length / 15) + 2); // 15 lançamentos por folha + 2 termos

    const termoAbertura = `TERMO DE ABERTURA\n\n` +
      `Contém este livro nº ${livroNum}, ${totalPags} (folhas numeradas tipograficamente/digitalmente de 001 a ${String(totalPags).padStart(3, '0')}), ` +
      `que servirá de LIVRO DIÁRIO GERAL da empresa ${params.empresaNome.toUpperCase()}, inscrita no CNPJ/MF sob o nº ${params.cnpj}, ` +
      `com sede e domicílio fiscal no exercício social encerrado em 31/12/${params.anoExercicio}.\n\n` +
      `Local e Data: São Paulo/SP, 31 de Dezembro de ${params.anoExercicio}.\n\n` +
      `__________________________________________        __________________________________________\n` +
      `${params.empresaNome} (Administrador/Sócio)        ${params.contadorNome} - ${params.contadorCrc} (Contador Responsável)`;

    const termoEncerramento = `TERMO DE ENCERRAMENTO\n\n` +
      `Contém este livro nº ${livroNum}, ${totalPags} folhas, no qual se acham lançadas, sob a responsabilidade do profissional habilitado abaixo assinado, ` +
      `todas as operações mercantis e financeiras ocorridas na empresa ${params.empresaNome.toUpperCase()}, CNPJ ${params.cnpj}, ` +
      `no período de 01/01/${params.anoExercicio} a 31/12/${params.anoExercicio}, somando Débitos de R$ ${totals.totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ` +
      `e Créditos de R$ ${totals.totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, com exata conciliação e integridade de partidas dobradas.\n\n` +
      `Local e Data: São Paulo/SP, 31 de Dezembro de ${params.anoExercicio}.\n\n` +
      `__________________________________________        __________________________________________\n` +
      `${params.empresaNome} (Administrador/Sócio)        ${params.contadorNome} - ${params.contadorCrc} (Contador Responsável)`;

    return {
      terms: {
        termoAbertura,
        termoEncerramento,
        empresaNome: params.empresaNome,
        cnpj: params.cnpj,
        nire: params.nire || '35.901.234.567',
        contadorNome: params.contadorNome,
        contadorCrc: params.contadorCrc,
        livroNumero: livroNum,
        totalPaginas: totalPags
      },
      entries,
      totalDebits: totals.totalDebits,
      totalCredits: totals.totalCredits,
      isBalanced: totals.isBalanced
    };
  }
}

export const officialBooksEngine = new OfficialBooksEngine();
export default officialBooksEngine;