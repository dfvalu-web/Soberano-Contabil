import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ConcessionaryLoanType = 'SUBVENCAO_GOVERNAMENTAL_SUBSIDIADA' | 'PARTE_RELACIONADA_SOCIOS';

export interface ConcessionaryLoanInput {
  emprestimoId: string;
  instituicaoCredoraNome: string; // Ex: 'BNDES Finame Inovação'
  tipoEmprestimo: ConcessionaryLoanType;
  valorNominalRecebidoBrl: number;
  taxaJurosNominalAnualPercent: number; // Ex: 4.0% a.a.
  taxaJurosMercadoAnualPercent: number; // Ex: 12.0% a.a.
  prazoAnos: number;                   // Ex: 5 anos
}

export interface ConcessionaryLoanResult {
  emprestimoId: string;
  instituicaoCredoraNome: string;
  tipoEmprestimo: ConcessionaryLoanType;
  valorJustoInicialPassivoEmprestimoBrl: number;
  beneficioTaxaSubsidiadaBrl: number;
  despesaJurosAno1TaxaEfetivaBrl: number;
  partidasDobradaReconhecimentoInicial: JournalEntryLine[];
  partidasDobradaExercicioAno1: JournalEntryLine[];
  diagnosticoCpc48: string;
}

export function evaluateConcessionaryLoanBelowMarketCpc48(input: ConcessionaryLoanInput): Result<ConcessionaryLoanResult, Error> {
  const {
    emprestimoId,
    instituicaoCredoraNome,
    tipoEmprestimo,
    valorNominalRecebidoBrl,
    taxaJurosNominalAnualPercent,
    taxaJurosMercadoAnualPercent,
    prazoAnos
  } = input;

  if (valorNominalRecebidoBrl <= 0 || prazoAnos <= 0 || taxaJurosMercadoAnualPercent <= 0) {
    return Err(new Error('Valor, prazo e taxa de mercado devem ser superiores a zero.'));
  }

  // Amortização linear do principal com juros simples sobre saldo devedor
  // Para simplificação padronizada: Pagamento em parcela única (bullet) ao final do prazo
  const jurosNominaisTotal = valorNominalRecebidoBrl * (taxaJurosNominalAnualPercent / 100) * prazoAnos;
  const montanteFinalDevido = valorNominalRecebidoBrl + jurosNominaisTotal;

  // Valor Presente descontado pela taxa de mercado: VP = Montante / ((1 + r_mercado)^n)
  const fatorMercado = Math.pow(1 + (taxaJurosMercadoAnualPercent / 100), prazoAnos);
  const valorJustoInicialPassivo = Number((montanteFinalDevido / fatorMercado).toFixed(2));

  // Benefício Econômico = Valor Nominal Recebido - Valor Justo Inicial da Dívida
  const beneficioSubsidiado = Number((valorNominalRecebidoBrl - valorJustoInicialPassivo).toFixed(2));

  // Juros Efetivos do Ano 1 = VP * Taxa de Mercado
  const despesaJurosAno1 = Number((valorJustoInicialPassivo * (taxaJurosMercadoAnualPercent / 100)).toFixed(2));

  const partidasInicial: JournalEntryLine[] = [];

  // D: Caixa / Bancos (Valor Total Recebido)
  partidasInicial.push({
    accountId: '1.1.1.02',
    accountCode: '1.1.1.02',
    accountName: 'Banco Conta Movimento (Ativo Circulante)',
    type: 'DEBIT',
    amount: valorNominalRecebidoBrl
  });

  // C: Financiamentos e Empréstimos a Pagar a Valor Justo (Passivo Não Circulante - CPC 48)
  partidasInicial.push({
    accountId: '2.2.1.05',
    accountCode: '2.2.1.05',
    accountName: 'Financiamentos Bancários a Pagar a Custo Amortizado (Passivo Não Circulante - CPC 48)',
    type: 'CREDIT',
    amount: valorJustoInicialPassivo
  });

  if (tipoEmprestimo === 'SUBVENCAO_GOVERNAMENTAL_SUBSIDIADA') {
    // C: Subvenção Governamental a Apropriar (Passivo Não Circulante - CPC 07)
    partidasInicial.push({
      accountId: '2.2.4.01',
      accountCode: '2.2.4.01',
      accountName: 'Receita de Subvenção Governamental Diferida - Juros Subsidiados (Passivo Não Circulante - CPC 07)',
      type: 'CREDIT',
      amount: beneficioSubsidiado
    });
  } else {
    // C: Transação de Capital com Sócios (Patrimônio Líquido - CPC 05 / CPC 48)
    partidasInicial.push({
      accountId: '2.4.1.09',
      accountCode: '2.4.1.09',
      accountName: 'Reserva de Capital - Transação Concessiva de Sócios (Patrimônio Líquido - CPC 05)',
      type: 'CREDIT',
      amount: beneficioSubsidiado
    });
  }

  const partidasAno1: JournalEntryLine[] = [];
  // D: Despesa Financeira pela Taxa Efetiva de Mercado
  partidasAno1.push({
    accountId: '3.1.5.01',
    accountCode: '3.1.5.01',
    accountName: 'Despesas Financeiras de Empréstimos pela Taxa Efetiva de Juros (Resultado - CPC 48)',
    type: 'DEBIT',
    amount: despesaJurosAno1
  });
  // C: Financiamentos Bancários (Acréscimo ao Passivo)
  partidasAno1.push({
    accountId: '2.2.1.05',
    accountCode: '2.2.1.05',
    accountName: 'Financiamentos Bancários a Pagar (Atualização da Dívida - CPC 48)',
    type: 'CREDIT',
    amount: despesaJurosAno1
  });

  const diag = 'CPC 48 / IFRS 9 & CPC 07 / IAS 20 (Empréstimos Concessivos): Credor ' + instituicaoCredoraNome + '. Valor Nominal: R$ ' + valorNominalRecebidoBrl.toFixed(2) + ' a ' + taxaJurosNominalAnualPercent + '% a.a. vs Mercado ' + taxaJurosMercadoAnualPercent + '% a.a. em ' + prazoAnos + ' anos. Passivo Inicial Mensurado a Valor Justo: R$ ' + valorJustoInicialPassivo.toFixed(2) + '. Benefício Subsidiado Reconhecido: R$ ' + beneficioSubsidiado.toFixed(2) + ' (' + (tipoEmprestimo === 'SUBVENCAO_GOVERNAMENTAL_SUBSIDIADA' ? 'Subvenção no Passivo - CPC 07' : 'Capital no PL - CPC 05') + '). Despesa de juros Ano 1: R$ ' + despesaJurosAno1.toFixed(2) + '.';

  return Ok({
    emprestimoId,
    instituicaoCredoraNome,
    tipoEmprestimo,
    valorJustoInicialPassivoEmprestimoBrl: valorJustoInicialPassivo,
    beneficioTaxaSubsidiadaBrl: beneficioSubsidiado,
    despesaJurosAno1TaxaEfetivaBrl: despesaJurosAno1,
    partidasDobradaReconhecimentoInicial: partidasInicial,
    partidasDobradaExercicioAno1: partidasAno1,
    diagnosticoCpc48: diag
  });
}
