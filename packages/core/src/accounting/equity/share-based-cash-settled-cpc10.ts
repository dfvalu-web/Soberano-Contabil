import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ShareBasedSettlementType = 'CASH_SETTLED_PHANTOM_SHARES' | 'EQUITY_SETTLED_STOCK_OPTIONS';

export interface ShareBasedPaymentInput {
  planoId: string;
  beneficiarioNome: string;
  tipoLiquidacao: ShareBasedSettlementType;
  quantidadeOpcoesAcoes: number;
  valorJustoUnitarioDataOutorgaBrl: number;
  valorJustoUnitarioDataFechamentoAtualBrl: number;
  periodoAquisicaoMesesTotal: number; // Vesting total (ex: 36 meses)
  mesesDecorridos: number;           // Ex: 12 meses
  saldoProvisaoAnteriorBrl?: number; // Saldo já reconhecido no passivo/PL em períodos anteriores
}

export interface ShareBasedPaymentResult {
  planoId: string;
  beneficiarioNome: string;
  tipoLiquidacao: ShareBasedSettlementType;
  percentualVestingAcumuladoPercent: number;
  valorTotalAcumuladoObrigacaoBrl: number;
  despesaPeriodoAtualDREBrl: number;
  contrapartidaClassificacao: 'PATRIMONIO_LIQUIDO_EQUITY_SETTLED' | 'PASSIVO_EXIGIVEL_CASH_SETTLED';
  partidasDobradaRemuneracao: JournalEntryLine[];
  diagnosticoCpc10: string;
}

export function evaluateShareBasedPaymentCpc10(input: ShareBasedPaymentInput): Result<ShareBasedPaymentResult, Error> {
  const {
    planoId,
    beneficiarioNome,
    tipoLiquidacao,
    quantidadeOpcoesAcoes,
    valorJustoUnitarioDataOutorgaBrl,
    valorJustoUnitarioDataFechamentoAtualBrl,
    periodoAquisicaoMesesTotal,
    mesesDecorridos,
    saldoProvisaoAnteriorBrl = 0
  } = input;

  if (quantidadeOpcoesAcoes <= 0 || periodoAquisicaoMesesTotal <= 0) {
    return Err(new Error('Quantidade de ações e período de aquisição devem ser superiores a zero.'));
  }

  const vestingRatio = Math.min(1, mesesDecorridos / periodoAquisicaoMesesTotal);
  const percentualVesting = Number((vestingRatio * 100).toFixed(2));

  let valorTotalObrigacao = 0;
  let classificacao: 'PATRIMONIO_LIQUIDO_EQUITY_SETTLED' | 'PASSIVO_EXIGIVEL_CASH_SETTLED' = 'PATRIMONIO_LIQUIDO_EQUITY_SETTLED';
  const partidas: JournalEntryLine[] = [];

  if (tipoLiquidacao === 'EQUITY_SETTLED_STOCK_OPTIONS') {
    // Equity-Settled: Mensurado pelo valor justo da DATA DA OUTORGA (não se reavalia)
    valorTotalObrigacao = Number((quantidadeOpcoesAcoes * valorJustoUnitarioDataOutorgaBrl * vestingRatio).toFixed(2));
    classificacao = 'PATRIMONIO_LIQUIDO_EQUITY_SETTLED';

    const despesaPeriodo = Number((valorTotalObrigacao - saldoProvisaoAnteriorBrl).toFixed(2));

    partidas.push({
      accountId: '3.1.2.10',
      accountCode: '3.1.2.10',
      accountName: 'Despesa com Remuneração Baseada em Ações - Stock Options (Resultado - CPC 10)',
      type: 'DEBIT',
      amount: despesaPeriodo
    });
    partidas.push({
      accountId: '2.4.1.08',
      accountCode: '2.4.1.08',
      accountName: 'Reserva de Opções Outorgadas Reconhecidas (Patrimônio Líquido - CPC 10)',
      type: 'CREDIT',
      amount: despesaPeriodo
    });

    const diag = 'CPC 10 (R1) / IFRS 2 (Equity-Settled): Beneficiário ' + beneficiarioNome + '. Vesting: ' + percentualVesting + '% (' + mesesDecorridos + '/' + periodoAquisicaoMesesTotal + ' meses). Mensuração fixa pelo Valor Justo da Outorga (R$ ' + valorJustoUnitarioDataOutorgaBrl.toFixed(2) + '). Crédito em Reserva de Capital no Patrimônio Líquido.';

    return Ok({
      planoId,
      beneficiarioNome,
      tipoLiquidacao,
      percentualVestingAcumuladoPercent: percentualVesting,
      valorTotalAcumuladoObrigacaoBrl: valorTotalObrigacao,
      despesaPeriodoAtualDREBrl: despesaPeriodo,
      contrapartidaClassificacao: classificacao,
      partidasDobradaRemuneracao: partidas,
      diagnosticoCpc10: diag
    });
  } else {
    // Cash-Settled (Phantom Shares / SARs): Reavaliado a cada balanço pelo VALOR JUSTO ATUAL DE FECHAMENTO
    valorTotalObrigacao = Number((quantidadeOpcoesAcoes * valorJustoUnitarioDataFechamentoAtualBrl * vestingRatio).toFixed(2));
    classificacao = 'PASSIVO_EXIGIVEL_CASH_SETTLED';

    const despesaPeriodo = Number((valorTotalObrigacao - saldoProvisaoAnteriorBrl).toFixed(2));

    partidas.push({
      accountId: '3.1.2.11',
      accountCode: '3.1.2.11',
      accountName: 'Despesa com Remuneração em Dinheiro Baseada em Ações - Phantom Shares (Resultado - CPC 10)',
      type: 'DEBIT',
      amount: despesaPeriodo
    });
    partidas.push({
      accountId: '2.1.5.15',
      accountCode: '2.1.5.15',
      accountName: 'Provisão para Remuneração Baseada em Ações - Phantom Shares (Passivo Exigível - CPC 10)',
      type: 'CREDIT',
      amount: despesaPeriodo
    });

    const diag = 'CPC 10 (R1) / IFRS 2 (Cash-Settled / Phantom Shares): Beneficiário ' + beneficiarioNome + '. Vesting: ' + percentualVesting + '% (' + mesesDecorridos + '/' + periodoAquisicaoMesesTotal + ' meses). Reavaliação a mercado pelo Valor Justo Atual (R$ ' + valorJustoUnitarioDataFechamentoAtualBrl.toFixed(2) + '). Reconhecimento no Passivo Exigível com ajuste periódico na DRE.';

    return Ok({
      planoId,
      beneficiarioNome,
      tipoLiquidacao,
      percentualVestingAcumuladoPercent: percentualVesting,
      valorTotalAcumuladoObrigacaoBrl: valorTotalObrigacao,
      despesaPeriodoAtualDREBrl: despesaPeriodo,
      contrapartidaClassificacao: classificacao,
      partidasDobradaRemuneracao: partidas,
      diagnosticoCpc10: diag
    });
  }
}
