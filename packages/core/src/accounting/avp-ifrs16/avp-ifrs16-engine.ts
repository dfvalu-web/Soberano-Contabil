import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface AvpInput {
  transacaoId: string;
  tipoTransacao: 'CLIENTES_A_RECEBER' | 'FORNECEDORES_A_PAGAR';
  valorNominalFuturo: number;
  prazoMeses: number;
  taxaDescontoMensalPercent: number; // e.g. 1.0 para 1.0% a.m.
}

export interface AvpResult {
  transacaoId: string;
  valorNominalFuturo: number;
  valorPresenteCalculado: number;
  valorAjusteAvp: number;
  taxaDescontoEfetiva: number;
  partidasDobradaSugeridas: JournalEntryLine[];
}

export function calculateAvp(input: AvpInput): Result<AvpResult, Error> {
  const { transacaoId, tipoTransacao, valorNominalFuturo, prazoMeses, taxaDescontoMensalPercent } = input;

  if (valorNominalFuturo <= 0 || prazoMeses <= 0) {
    return Err(new Error('Valor nominal futuro e prazo em meses devem ser superiores a zero.'));
  }

  const taxaMensalDecimal = taxaDescontoMensalPercent / 100;
  const fatorDesconto = Math.pow(1 + taxaMensalDecimal, prazoMeses);
  const valorPresente = Number((valorNominalFuturo / fatorDesconto).toFixed(2));
  const valorAjusteAvp = Number((valorNominalFuturo - valorPresente).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (tipoTransacao === 'CLIENTES_A_RECEBER') {
    // D: Clientes (Valor Nominal) / C: (-) AVP Contas a Receber / C: Receita Bruta (Valor Presente)
    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes Nacionais - Valor Nominal (Ativo)',
      type: 'DEBIT',
      amount: valorNominalFuturo
    });
    partidas.push({
      accountId: '1.1.2.09',
      accountCode: '1.1.2.09',
      accountName: '(-) Ajuste a Valor Presente AVP de Clientes (Redutora do Ativo)',
      type: 'CREDIT',
      amount: valorAjusteAvp
    });
    partidas.push({
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Receita Bruta Reconhecida a Valor Presente (Resultado - CPC 12)',
      type: 'CREDIT',
      amount: valorPresente
    });
  }

  return Ok({
    transacaoId,
    valorNominalFuturo,
    valorPresenteCalculado: valorPresente,
    valorAjusteAvp,
    taxaDescontoEfetiva: taxaDescontoMensalPercent,
    partidasDobradaSugeridas: partidas
  });
}

export interface Ifrs16LeaseInput {
  contratoId: string;
  descricaoBemArrendado: string;
  valorParcelaMensal: number;
  prazoContratoMeses: number;
  taxaJurosMensalPercent: number; // Taxa incremental de empréstimo
}

export interface Ifrs16LeaseResult {
  contratoId: string;
  valorAtivoDireitoDeUsoInicial: number;
  valorPassivoArrendamentoInicial: number;
  despesaAmortizacaoMensal: number;
  jurosPrimeiroMes: number;
  custoTotalMensalResultado: number;
  partidasDobradaInicial: JournalEntryLine[];
}

export function calculateIfrs16Lease(input: Ifrs16LeaseInput): Result<Ifrs16LeaseResult, Error> {
  const { contratoId, valorParcelaMensal, prazoContratoMeses, taxaJurosMensalPercent } = input;

  const i = taxaJurosMensalPercent / 100;
  // VP da anuidade: VP = Parcela * [1 - (1+i)^-n] / i
  const fatorAnuidade = (1 - Math.pow(1 + i, -prazoContratoMeses)) / i;
  const valorPresentePassivo = Number((valorParcelaMensal * fatorAnuidade).toFixed(2));
  const amortizacaoMensal = Number((valorPresentePassivo / prazoContratoMeses).toFixed(2));
  const jurosMes1 = Number((valorPresentePassivo * i).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.2.3.05',
      accountCode: '1.2.3.05',
      accountName: 'Ativo de Direito de Uso - Arrendamentos Mercantis (Ativo Não Circulante - CPC 06 R2)',
      type: 'DEBIT',
      amount: valorPresentePassivo
    },
    {
      accountId: '2.2.1.05',
      accountCode: '2.2.1.05',
      accountName: 'Passivo de Arrendamento Mercantil (Passivo Não Circulante - IFRS 16)',
      type: 'CREDIT',
      amount: valorPresentePassivo
    }
  ];

  return Ok({
    contratoId,
    valorAtivoDireitoDeUsoInicial: valorPresentePassivo,
    valorPassivoArrendamentoInicial: valorPresentePassivo,
    despesaAmortizacaoMensal: amortizacaoMensal,
    jurosPrimeiroMes: jurosMes1,
    custoTotalMensalResultado: Number((amortizacaoMensal + jurosMes1).toFixed(2)),
    partidasDobradaInicial: partidas
  });
}
