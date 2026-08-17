import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface StockOptionGrantInput {
  planoId: string;
  beneficiarioNome: string;
  quantidadeOpcoesOutorgadas: number;
  valorJustoUnitarioOpcaoBlackScholes: number; // Fair value unitário na concessão
  prazoVestingMeses: number; // Período de carência
  taxaEsperadaTurnoverPercent: number; // e.g. 5 para 5%
}

export interface StockOptionVestingMonthlyResult {
  planoId: string;
  valorJustoTotalOutorgado: number;
  despesaVestingMensal: number;
  partidasDobradaVesting: JournalEntryLine[];
  diagnosticoCpc10: string;
}

export function calculateMonthlyStockOptionVesting(input: StockOptionGrantInput): Result<StockOptionVestingMonthlyResult, Error> {
  const { planoId, beneficiarioNome, quantidadeOpcoesOutorgadas, valorJustoUnitarioOpcaoBlackScholes, prazoVestingMeses, taxaEsperadaTurnoverPercent } = input;

  if (quantidadeOpcoesOutorgadas <= 0 || valorJustoUnitarioOpcaoBlackScholes <= 0 || prazoVestingMeses <= 0) {
    return Err(new Error('Parâmetros do plano de opções de ações devem ser superiores a zero.'));
  }

  const fatorRetencao = (100 - taxaEsperadaTurnoverPercent) / 100;
  const valorJustoTotal = Number((quantidadeOpcoesOutorgadas * valorJustoUnitarioOpcaoBlackScholes * fatorRetencao).toFixed(2));
  const despesaMensal = Number((valorJustoTotal / prazoVestingMeses).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '4.1.2.15',
      accountCode: '4.1.2.15',
      accountName: 'Despesas com Remuneração Baseada em Ações / Stock Options (Resultado - CPC 10)',
      type: 'DEBIT',
      amount: despesaMensal
    },
    {
      accountId: '2.3.3.01',
      accountCode: '2.3.3.01',
      accountName: 'Reserva de Opções Outorgadas (Patrimônio Líquido - CPC 10)',
      type: 'CREDIT',
      amount: despesaMensal
    }
  ];

  const diagnostico = 'Plano de opções para ' + beneficiarioNome + ': Apropriação mensal de R$ ' + despesaMensal.toFixed(2) + ' no resultado contra a Reserva de Opções Outorgadas no PL durante o vesting de ' + prazoVestingMeses + ' meses.';

  return Ok({
    planoId,
    valorJustoTotalOutorgado: valorJustoTotal,
    despesaVestingMensal: despesaMensal,
    partidasDobradaVesting: partidas,
    diagnosticoCpc10: diagnostico
  });
}
