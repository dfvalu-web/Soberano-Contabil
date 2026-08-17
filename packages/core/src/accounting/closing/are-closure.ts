import { Account, JournalEntry, JournalEntryLine } from '../../types/accounting.js';
import { DoubleEntryEngine } from '../ledger/double-entry.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface AreClosureReport {
  dataEncerramento: string;
  totalReceitasZeradas: number;
  totalDespesasCustosZerados: number;
  resultadoLiquidoExercicio: number; // Positivo = Lucro, Negativo = Prejuízo
  lancamentosEncerramento: JournalEntry[];
}

export function executeAnnualClosing(
  engine: DoubleEntryEngine,
  tenantId: string,
  dataEncerramento: string,
  contaAreId: string = '2.3.2.01', // Conta de ARE / Lucros Acumulados no PL
  contaAreNome: string = 'Lucros ou Prejuízos Acumulados'
): Result<AreClosureReport, Error> {
  const accounts = engine.getAccounts();
  const contasResultado = accounts.filter(a => (a.tipo === 'RECEITA' || a.tipo === 'CUSTO' || a.tipo === 'DESPESA') && a.saldoAtual !== 0 && a.isAnalitica);

  if (contasResultado.length === 0) {
    return Err(new Error('Nao ha contas de resultado com saldo em aberto para encerramento.'));
  }

  let totalReceitas = 0;
  let totalDespesasCustos = 0;
  const linhasEncerramento: JournalEntryLine[] = [];

  for (const conta of contasResultado) {
    const saldo = Math.abs(conta.saldoAtual);
    if (conta.tipo === 'RECEITA') {
      totalReceitas += saldo;
      // Para zerar uma receita (saldo credor), debita-se a receita
      linhasEncerramento.push({
        accountId: conta.id,
        accountCode: conta.codigo,
        accountName: conta.nome,
        type: 'DEBIT',
        amount: saldo,
        complementaryHistory: 'Encerramento de Conta de Receita para ARE'
      });
    } else {
      // CUSTO ou DESPESA (saldo devedor), credita-se a despesa
      totalDespesasCustos += saldo;
      linhasEncerramento.push({
        accountId: conta.id,
        accountCode: conta.codigo,
        accountName: conta.nome,
        type: 'CREDIT',
        amount: saldo,
        complementaryHistory: 'Encerramento de Conta de Despesa/Custo para ARE'
      });
    }
  }

  totalReceitas = Number(totalReceitas.toFixed(2));
  totalDespesasCustos = Number(totalDespesasCustos.toFixed(2));
  const resultadoLiquido = Number((totalReceitas - totalDespesasCustos).toFixed(2));

  if (resultadoLiquido > 0) {
    // Lucro Líquido: Credita-se a conta de Patrimônio Líquido (ARE / Lucros Acumulados)
    linhasEncerramento.push({
      accountId: contaAreId,
      accountCode: contaAreId,
      accountName: contaAreNome,
      type: 'CREDIT',
      amount: resultadoLiquido,
      complementaryHistory: 'Transferencia do Lucro Liquido do Exercicio para o PL'
    });
  } else if (resultadoLiquido < 0) {
    // Prejuízo Líquido: Debita-se a conta de Patrimônio Líquido
    linhasEncerramento.push({
      accountId: contaAreId,
      accountCode: contaAreId,
      accountName: contaAreNome,
      type: 'DEBIT',
      amount: Math.abs(resultadoLiquido),
      complementaryHistory: 'Transferencia do Prejuizo do Exercicio para o PL'
    });
  }

  const postResult = engine.postEntry(
    tenantId,
    dataEncerramento,
    'Apuracao do Resultado do Exercicio (ARE) e Fechamento Anual',
    linhasEncerramento,
    { tipo: 'MANUAL', chave: 'ARE-' + dataEncerramento }
  );

  if (!postResult.success) {
    return Err(postResult.error);
  }

  return Ok({
    dataEncerramento,
    totalReceitasZeradas: totalReceitas,
    totalDespesasCustosZerados: totalDespesasCustos,
    resultadoLiquidoExercicio: resultadoLiquido,
    lancamentosEncerramento: [postResult.data]
  });
}
