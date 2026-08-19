// ==========================================================================
// SOBERANO CONTÁBIL — MOTOR DE APURAÇÃO DO RESULTADO DO EXERCÍCIO (ARE 1-CLICK)
// Zera Contas de Resultado, Apura Lucro/Prejuízo & Calcula Reserva Legal 5%
// ==========================================================================

import { trialBalanceEngine } from '../reports/trial-balance-engine';
import { generalJournalEngine, JournalEntry } from '../ledger/general-journal-engine';
import { referentialChartService } from '../chart-of-accounts/referential-mapping';

export interface AreClosingResult {
  tenantId: string;
  competencia: string;
  totalReceitas: number;
  totalDespesas: number;
  totalCustos: number;
  resultadoLiquido: number; // Positivo = Lucro, Negativo = Prejuízo
  isLucro: boolean;
  reservaLegalAmount: number; // 5% do Lucro (Art. 193 Lei 6.404/76)
  lucroDisponivelDividendos: number;
  closingEntries: JournalEntry[];
  status: 'SUCESSO' | 'ERRO';
  message: string;
}

export class AreClosingEngine {
  /**
   * Executa o fechamento do exercício em 1-Click transferindo os saldos para o Patrimônio Líquido
   */
  public executeAreClosing(params: {
    tenantId: string;
    competencia: string; // Ex: '2026-08' ou '2026'
    closingDate?: string;
    destinarDividendos?: boolean;
  }): AreClosingResult {
    const trialBalance = trialBalanceEngine.generateTrialBalance(params.tenantId);

    // Identificar contas analíticas de Receitas (Grupo 3) e Despesas/Custos (Grupo 4)
    const analyticalRows = trialBalance.rows.filter(r => !r.isSynthetic);

    const receitaRows = analyticalRows.filter(r => r.code.startsWith('3') && r.finalCredit > 0);
    const despesaRows = analyticalRows.filter(r => (r.code.startsWith('4') || r.code.startsWith('3.2')) && r.finalDebit > 0);

    const totalReceitas = receitaRows.reduce((sum, r) => sum + r.finalCredit, 0);
    const totalDespesas = despesaRows.reduce((sum, r) => sum + r.finalDebit, 0);
    const resultadoLiquido = Math.round((totalReceitas - totalDespesas) * 100) / 100;
    const isLucro = resultadoLiquido > 0;

    let reservaLegalAmount = 0;
    let lucroDisponivelDividendos = 0;

    const closingEntries: JournalEntry[] = [];
    const closeDate = params.closingDate || '2026-08-31';

    if (totalReceitas > 0 || totalDespesas > 0) {
      // 1. Zera Receitas: Debita cada conta de receita e Credita Lucros/Prejuízos Acumulados
      for (const rec of receitaRows) {
        const res = generalJournalEngine.postEntry({
          tenantId: params.tenantId,
          date: closeDate,
          generalHistory: `Encerramento ARE - Transferência de saldo da conta [${rec.name}]`,
          documentType: 'ARE_FECHAMENTO',
          lines: [
            { accountCode: rec.code, type: 'DEBITO', amount: rec.finalCredit, historyComplement: 'Encerramento de Receita' },
            { accountCode: '2.3.3.01', type: 'CREDITO', amount: rec.finalCredit, historyComplement: 'Lucros ou Prejuízos Acumulados' }
          ]
        });
        if (res.success && res.entry) closingEntries.push(res.entry);
      }

      // 2. Zera Despesas: Debita Lucros/Prejuízos Acumulados e Credita cada conta de despesa
      for (const desp of despesaRows) {
        const res = generalJournalEngine.postEntry({
          tenantId: params.tenantId,
          date: closeDate,
          generalHistory: `Encerramento ARE - Transferência de saldo da conta [${desp.name}]`,
          documentType: 'ARE_FECHAMENTO',
          lines: [
            { accountCode: '2.3.3.01', type: 'DEBITO', amount: desp.finalDebit, historyComplement: 'Lucros ou Prejuízos Acumulados' },
            { accountCode: desp.code, type: 'CREDITO', amount: desp.finalDebit, historyComplement: 'Encerramento de Despesa/Custo' }
          ]
        });
        if (res.success && res.entry) closingEntries.push(res.entry);
      }

      // 3. Se houver Lucro, calcula e destina a Reserva Legal de 5% (Art. 193 Lei 6.404/76)
      if (isLucro) {
        reservaLegalAmount = Math.round((resultadoLiquido * 0.05) * 100) / 100;
        lucroDisponivelDividendos = Math.round((resultadoLiquido - reservaLegalAmount) * 100) / 100;

        const resReserva = generalJournalEngine.postEntry({
          tenantId: params.tenantId,
          date: closeDate,
          generalHistory: `Constituição de Reserva Legal 5% sobre o Lucro Líquido (Art. 193 Lei 6.404/76)`,
          documentType: 'RESERVA_LEGAL',
          lines: [
            { accountCode: '2.3.3.01', type: 'DEBITO', amount: reservaLegalAmount, historyComplement: 'Destinação do Lucro Líquido' },
            { accountCode: '2.3.2.01', type: 'CREDITO', amount: reservaLegalAmount, historyComplement: 'Reserva Legal Estatutária' }
          ]
        });
        if (resReserva.success && resReserva.entry) closingEntries.push(resReserva.entry);
      }
    }

    return {
      tenantId: params.tenantId,
      competencia: params.competencia,
      totalReceitas: Math.round(totalReceitas * 100) / 100,
      totalDespesas: Math.round(totalDespesas * 100) / 100,
      totalCustos: 0,
      resultadoLiquido,
      isLucro,
      reservaLegalAmount,
      lucroDisponivelDividendos,
      closingEntries,
      status: 'SUCESSO',
      message: isLucro
        ? `Apuração ARE concluída com sucesso. Lucro Líquido apurado de R$ ${resultadoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Reserva Legal 5%: R$ ${reservaLegalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`
        : `Apuração ARE concluída. Prejuízo apurado de R$ ${Math.abs(resultadoLiquido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
    };
  }
}

export const areClosingEngine = new AreClosingEngine();
export default areClosingEngine;