import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type AccountingChangeType = 'RETIFICACAO_ERRO_EXERCICIO_ANTERIOR' | 'MUDANCA_POLITICA_CONTABIL' | 'MUDANCA_ESTIMATIVA_CONTABIL';

export interface AccountingChangeInput {
  eventoId: string;
  descricaoEvento: string; // Ex: 'Omissão de Depreciação de Equipamentos em 2024' ou 'Revisão da Vida Útil de Frotas'
  tipoEvento: AccountingChangeType;
  anoExercicioAtual: number;
  valorImpactoFinanceiroBrl: number;
  saldoAberturaLucrosPrejuizosAcumuladosBrl?: number; // Para aplicação retrospectiva
}

export interface AccountingChangeResult {
  eventoId: string;
  tipoEvento: AccountingChangeType;
  aplicacaoModalidade: 'RETROSPECTIVA_DMPL_PL' | 'PROSPECTIVA_RESULTADO_CORRENTE';
  impactoNoResultadoExercicioAtualBrl: number;
  impactoNoSaldoAberturaPlBrl: number;
  novoSaldoAberturaAjustadoPlBrl: number;
  partidasDobradaAjuste: JournalEntryLine[];
  diagnosticoCpc23: string;
}

export function evaluateAccountingPoliciesAndErrorsCpc23(input: AccountingChangeInput): Result<AccountingChangeResult, Error> {
  const {
    eventoId,
    descricaoEvento,
    tipoEvento,
    anoExercicioAtual,
    valorImpactoFinanceiroBrl,
    saldoAberturaLucrosPrejuizosAcumuladosBrl = 0
  } = input;

  if (valorImpactoFinanceiroBrl === 0) {
    return Err(new Error('Valor do impacto financeiro do ajuste deve ser diferente de zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (tipoEvento === 'RETIFICACAO_ERRO_EXERCICIO_ANTERIOR' || tipoEvento === 'MUDANCA_POLITICA_CONTABIL') {
    // Aplicação Retrospectiva: Ajuste direto no saldo de abertura de Lucros/Prejuízos Acumulados no PL (DMPL)
    const novoSaldoPl = Number((saldoAberturaLucrosPrejuizosAcumuladosBrl - valorImpactoFinanceiroBrl).toFixed(2));

    partidas.push({
      accountId: '2.4.2.01',
      accountCode: '2.4.2.01',
      accountName: 'Ajustes de Exercícios Anteriores - Lucros/Prejuízos Acumulados (PL/DMPL - CPC 23)',
      type: valorImpactoFinanceiroBrl > 0 ? 'DEBIT' : 'CREDIT',
      amount: Math.abs(valorImpactoFinanceiroBrl)
    });
    partidas.push({
      accountId: '1.2.3.90',
      accountCode: '1.2.3.90',
      accountName: 'Depreciação Acumulada / Passivo de Ajuste Anterior (Ativo/Passivo - CPC 23)',
      type: valorImpactoFinanceiroBrl > 0 ? 'CREDIT' : 'DEBIT',
      amount: Math.abs(valorImpactoFinanceiroBrl)
    });

    const diag = 'CPC 23 / IAS 8 (Aplicação Retrospectiva): Evento ' + descricaoEvento + ' (' + tipoEvento + '). Ajustado saldo de abertura do PL em R$ ' + valorImpactoFinanceiroBrl.toFixed(2) + ' (Saldo de abertura ajustado de R$ ' + saldoAberturaLucrosPrejuizosAcumuladosBrl.toFixed(2) + ' para R$ ' + novoSaldoPl.toFixed(2) + '). Sem impacto no resultado do exercício de ' + anoExercicioAtual + '.';

    return Ok({
      eventoId,
      tipoEvento,
      aplicacaoModalidade: 'RETROSPECTIVA_DMPL_PL',
      impactoNoResultadoExercicioAtualBrl: 0,
      impactoNoSaldoAberturaPlBrl: valorImpactoFinanceiroBrl,
      novoSaldoAberturaAjustadoPlBrl: novoSaldoPl,
      partidasDobradaAjuste: partidas,
      diagnosticoCpc23: diag
    });
  } else {
    // Mudança de Estimativa Contábil: Aplicação Prospectiva no Resultado
    partidas.push({
      accountId: '3.1.2.05',
      accountCode: '3.1.2.05',
      accountName: 'Despesa de Depreciação - Nova Estimativa (Resultado - CPC 23)',
      type: 'DEBIT',
      amount: Math.abs(valorImpactoFinanceiroBrl)
    });
    partidas.push({
      accountId: '1.2.3.90',
      accountCode: '1.2.3.90',
      accountName: 'Depreciação Acumulada (Ativo Não Circulante - CPC 23)',
      type: 'CREDIT',
      amount: Math.abs(valorImpactoFinanceiroBrl)
    });

    const diag = 'CPC 23 / IAS 8 (Aplicação Prospectiva): Mudança de Estimativa Contábil ' + descricaoEvento + '. Reconhecido impacto de R$ ' + valorImpactoFinanceiroBrl.toFixed(2) + ' no resultado do exercício corrente (' + anoExercicioAtual + ') e períodos futuros.';

    return Ok({
      eventoId,
      tipoEvento,
      aplicacaoModalidade: 'PROSPECTIVA_RESULTADO_CORRENTE',
      impactoNoResultadoExercicioAtualBrl: valorImpactoFinanceiroBrl,
      impactoNoSaldoAberturaPlBrl: 0,
      novoSaldoAberturaAjustadoPlBrl: saldoAberturaLucrosPrejuizosAcumuladosBrl,
      partidasDobradaAjuste: partidas,
      diagnosticoCpc23: diag
    });
  }
}
