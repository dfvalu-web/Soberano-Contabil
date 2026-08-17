import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface DebtForEquitySwapInput {
  operacaoId: string;
  devedorNome: string; // Ex: 'Soberano Infraestrutura S.A. - Em Recuperação Judicial'
  credorNome: string; // Ex: 'Consórcio de Bancos Credores'
  valorContabilPassivoExtintoBrl: number; // Saldo da dívida amortizada no balanço
  quantidadeAcoesEmitidas: number;
  valorJustoUnitarioAcaoBrl: number; // Cotação de mercado ou laudo de avaliação
  valorNominalCapitalSocialUnitarioBrl?: number; // Para segregação de Capital Social vs Reserva de Ágio
}

export interface DebtForEquitySwapResult {
  operacaoId: string;
  devedorNome: string;
  credorNome: string;
  valorPassivoExtintoBrl: number;
  valorJustoTotalAcoesEmitidasBrl: number;
  ganhoExtincaoDividaDrebBrl: number; // Diferença reconhecida na DRE (ICPC 09)
  aumentoCapitalSocialBrl: number;
  reservaAgioSubscricaoBrl: number;
  partidasDobrada: JournalEntryLine[];
  diagnosticoIcpc09: string;
}

export function processDebtForEquitySwapIcpc09(input: DebtForEquitySwapInput): Result<DebtForEquitySwapResult, Error> {
  const {
    operacaoId,
    devedorNome,
    credorNome,
    valorContabilPassivoExtintoBrl,
    quantidadeAcoesEmitidas,
    valorJustoUnitarioAcaoBrl,
    valorNominalCapitalSocialUnitarioBrl = 1.00
  } = input;

  if (valorContabilPassivoExtintoBrl <= 0 || quantidadeAcoesEmitidas <= 0 || valorJustoUnitarioAcaoBrl <= 0) {
    return Err(new Error('Valor do passivo, ações e cotação devem ser superiores a zero.'));
  }

  // ICPC 09 / IFRIC 19 (Extinção de Passivos com Instrumentos de Capital):
  // 1. Os instrumentos patrimoniais emitidos para extinguir a dívida são mensurados ao seu VALOR JUSTO.
  const valorJustoAcoes = Number((quantidadeAcoesEmitidas * valorJustoUnitarioAcaoBrl).toFixed(2));

  // 2. A diferença entre o valor contábil do passivo financeiro extinto e o valor justo das ações
  //    é reconhecida DIRETAMENTE NO RESULTADO DO EXERCÍCIO (DRE) como Ganho na Extinção de Dívidas.
  const ganhoExtincao = Number((Math.max(0, valorContabilPassivoExtintoBrl - valorJustoAcoes)).toFixed(2));

  // 3. Decomposição no PL (Capital Social Nominal + Reserva de Capital por Ágio na Emissão de Ações)
  const capitalSocial = Number((quantidadeAcoesEmitidas * valorNominalCapitalSocialUnitarioBrl).toFixed(2));
  const reservaAgio = Number((Math.max(0, valorJustoAcoes - capitalSocial)).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // 1. D: Empréstimos e Financiamentos / Dívidas Concursais (Passivo Exigível - ICPC 09)
  partidas.push({
    accountId: '2.1.2.01',
    accountCode: '2.1.2.01',
    accountName: 'Empréstimos Bancários e Dívidas Renegociadas (Passivo Exigível - ICPC 09)',
    type: 'DEBIT',
    amount: valorContabilPassivoExtintoBrl
  });

  // 2. C: Capital Social Subscrito e Integralizado (Patrimônio Líquido)
  partidas.push({
    accountId: '2.3.1.01',
    accountCode: '2.3.1.01',
    accountName: 'Capital Social Subscrito por Conversão de Dívida (Patrimônio Líquido)',
    type: 'CREDIT',
    amount: capitalSocial
  });

  // 3. C: Reserva de Capital - Ágio na Emissão de Ações (Patrimônio Líquido)
  if (reservaAgio > 0) {
    partidas.push({
      accountId: '2.3.2.01',
      accountCode: '2.3.2.01',
      accountName: 'Reserva de Capital - Ágio na Subscrição de Ações (Patrimônio Líquido)',
      type: 'CREDIT',
      amount: reservaAgio
    });
  }

  // 4. C: Ganho na Extinção de Passivos com Ações (Resultado - ICPC 09 / IFRIC 19)
  if (ganhoExtincao > 0) {
    partidas.push({
      accountId: '3.1.2.30',
      accountCode: '3.1.2.30',
      accountName: 'Ganho na Reestruturação e Extinção de Dívidas (Resultado - ICPC 09)',
      type: 'CREDIT',
      amount: ganhoExtincao
    });
  }

  const diag = 'Debt-for-Equity Swap (ICPC 09 / IFRIC 19): ' + devedorNome + ' com ' + credorNome + '. Dívida Extinta: R$ ' + valorContabilPassivoExtintoBrl.toFixed(2) + '. Ações Emitidas ao Valor Justo: R$ ' + valorJustoAcoes.toFixed(2) + ' (Capital R$ ' + capitalSocial.toFixed(2) + ' + Ágio R$ ' + reservaAgio.toFixed(2) + '). GANHO RECONHECIDO NA DRE: R$ ' + ganhoExtincao.toFixed(2) + '.';

  return Ok({
    operacaoId,
    devedorNome,
    credorNome,
    valorPassivoExtintoBrl: valorContabilPassivoExtintoBrl,
    valorJustoTotalAcoesEmitidasBrl: valorJustoAcoes,
    ganhoExtincaoDividaDrebBrl: ganhoExtincao,
    aumentoCapitalSocialBrl: capitalSocial,
    reservaAgioSubscricaoBrl: reservaAgio,
    partidasDobrada: partidas,
    diagnosticoIcpc09: diag
  });
}
