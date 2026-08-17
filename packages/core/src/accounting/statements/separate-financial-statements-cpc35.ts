import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type SeparateAccountingMethod = 'CUSTO_HISTORICO' | 'VALOR_JUSTO_CPC48' | 'EQUIVALENCIA_PATRIMONIAL_MEP';

export interface SeparateInvestmentInput {
  investidaId: string;
  nomeInvestida: string;
  metodoAdotado: SeparateAccountingMethod;
  custoAquisicaoOriginalBrl: number;
  lucroLiquidoInvestidaExercicioBrl: number;
  percentualParticipacao: number; // Ex: 80 para 80%
  dividendosDistribuidosPelaInvestidaBrl: number; // Ex: 1.000.000,00
  valorJustoFinalAnoBrl?: number; // Para método do Valor Justo
}

export interface SeparateInvestmentResult {
  investidaId: string;
  metodo: SeparateAccountingMethod;
  saldoInvestimentoBalancoSeparadoBrl: number;
  impactoResultadoControladoraBrl: number;
  partidasDobradaSeparadas: JournalEntryLine[];
  diagnosticoCpc35: string;
}

export function evaluateSeparateFinancialStatementsCpc35(input: SeparateInvestmentInput): Result<SeparateInvestmentResult, Error> {
  const {
    investidaId,
    nomeInvestida,
    metodoAdotado,
    custoAquisicaoOriginalBrl,
    lucroLiquidoInvestidaExercicioBrl,
    percentualParticipacao,
    dividendosDistribuidosPelaInvestidaBrl,
    valorJustoFinalAnoBrl
  } = input;

  if (custoAquisicaoOriginalBrl <= 0 || percentualParticipacao <= 0) {
    return Err(new Error('Custo de aquisição e percentual de participação devem ser superiores a zero.'));
  }

  const prop = percentualParticipacao / 100;
  const dividendosProp = Number((dividendosDistribuidosPelaInvestidaBrl * prop).toFixed(2));
  const partidas: JournalEntryLine[] = [];
  let saldoInvestimento = custoAquisicaoOriginalBrl;
  let impactoResultado = 0;

  if (metodoAdotado === 'CUSTO_HISTORICO') {
    // Investimento mantido ao custo histórico. Dividendos reconhecidos como receita de dividendos no resultado
    impactoResultado = dividendosProp;
    saldoInvestimento = custoAquisicaoOriginalBrl;

    partidas.push({
      accountId: '1.1.2.05',
      accountCode: '1.1.2.05',
      accountName: 'Dividendos a Receber de Subsidiária (Ativo Circulante - CPC 35)',
      type: 'DEBIT',
      amount: dividendosProp
    });
    partidas.push({
      accountId: '3.1.3.01',
      accountCode: '3.1.3.01',
      accountName: 'Receita de Dividendos de Investimentos ao Custo (Resultado - CPC 35)',
      type: 'CREDIT',
      amount: dividendosProp
    });
  } else if (metodoAdotado === 'VALOR_JUSTO_CPC48') {
    if (valorJustoFinalAnoBrl === undefined) {
      return Err(new Error('Valor justo é obrigatório para mensuração pelo método de Valor Justo.'));
    }
    const variacaoValorJusto = Number((valorJustoFinalAnoBrl - custoAquisicaoOriginalBrl).toFixed(2));
    saldoInvestimento = valorJustoFinalAnoBrl;
    impactoResultado = Number((variacaoValorJusto + dividendosProp).toFixed(2));

    partidas.push({
      accountId: '1.2.2.01',
      accountCode: '1.2.2.01',
      accountName: 'Investimento em Subsidiária a Valor Justo (Ativo Não Circulante - CPC 35 / CPC 48)',
      type: variacaoValorJusto >= 0 ? 'DEBIT' : 'CREDIT',
      amount: Math.abs(variacaoValorJusto)
    });
    partidas.push({
      accountId: '3.1.4.09',
      accountCode: '3.1.4.09',
      accountName: 'Ajuste a Valor Justo de Investimentos (Resultado - CPC 35)',
      type: variacaoValorJusto >= 0 ? 'CREDIT' : 'DEBIT',
      amount: Math.abs(variacaoValorJusto)
    });
  } else {
    // Equivalência Patrimonial (MEP - CPC 18)
    const mepLucro = Number((lucroLiquidoInvestidaExercicioBrl * prop).toFixed(2));
    impactoResultado = mepLucro;
    // Saldo Investimento = Custo + MEP - Dividendos
    saldoInvestimento = Number((custoAquisicaoOriginalBrl + mepLucro - dividendosProp).toFixed(2));

    partidas.push({
      accountId: '1.2.2.01',
      accountCode: '1.2.2.01',
      accountName: 'Investimento em Subsidiária por MEP (Ativo Não Circulante - CPC 35 / CPC 18)',
      type: 'DEBIT',
      amount: mepLucro
    });
    partidas.push({
      accountId: '3.1.4.01',
      accountCode: '3.1.4.01',
      accountName: 'Resultado Positivo de Equivalência Patrimonial (Resultado - CPC 35)',
      type: 'CREDIT',
      amount: mepLucro
    });
  }

  const diag = 'CPC 35 (R1) / IAS 27: Demonstrações Separadas da Controladora. Investimento em ' + nomeInvestida + ' (' + percentualParticipacao + '%) avaliado pelo método ' + metodoAdotado + '. Saldo final no balanço: R$ ' + saldoInvestimento.toFixed(2) + '. Impacto no resultado do exercício: R$ ' + impactoResultado.toFixed(2) + '.';

  return Ok({
    investidaId,
    metodo: metodoAdotado,
    saldoInvestimentoBalancoSeparadoBrl: saldoInvestimento,
    impactoResultadoControladoraBrl: impactoResultado,
    partidasDobradaSeparadas: partidas,
    diagnosticoCpc35: diag
  });
}
