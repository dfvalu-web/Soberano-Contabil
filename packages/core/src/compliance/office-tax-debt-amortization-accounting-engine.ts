import { Result, Ok, Err } from '../types/result.js';

export interface TaxDebtAmortizationInput {
  clienteCnpj: string;
  razaoSocial: string;
  valorDividaTotalOriginalBrl: number;
  valorDescontoTransacaoBrl: number;
  valorParcelaPagaBrl: number;
  totalParcelasRestantes: number;
}

export interface TaxDebtAmortizationResult {
  clienteCnpj: string;
  razaoSocial: string;
  lancamentoContabilGanhoRemissaoBrl: number; // Outras Receitas Operacionais
  passivoCirculanteAjustadoBrl: number; // Próximas 12 parcelas
  passivoNaoCirculanteLongoPrazoBrl: number; // Restante (> 12 parcelas)
  partidaDobradaGerada: string;
  statusAmortizacao: 'AMORTIZACAO_CONTABIL_PARCELAMENTO_CONCLUIDA';
  diagnosticoAmortizacao: string;
}

export function processOfficeTaxDebtAmortizationAccountingEngine(input: TaxDebtAmortizationInput): Result<TaxDebtAmortizationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    valorDividaTotalOriginalBrl,
    valorDescontoTransacaoBrl,
    valorParcelaPagaBrl,
    totalParcelasRestantes
  } = input;

  if (!clienteCnpj || valorDividaTotalOriginalBrl <= 0) {
    return Err(new Error('CNPJ do cliente e valor da dívida original são obrigatórios.'));
  }

  const saldoConsolidado = Math.max(0, valorDividaTotalOriginalBrl - valorDescontoTransacaoBrl);
  const valorUnitarioParcela = totalParcelasRestantes > 0 ? saldoConsolidado / totalParcelasRestantes : 0;

  const parcelasCurtoPrazo = Math.min(12, totalParcelasRestantes);
  const parcelasLongoPrazo = Math.max(0, totalParcelasRestantes - 12);

  const passivoCirculante = valorUnitarioParcela * parcelasCurtoPrazo;
  const passivoNaoCirculante = valorUnitarioParcela * parcelasLongoPrazo;

  const lancamento = "D - 2.1.03.001 Tributos Parcelados (Passivo Circulante) | C - 1.1.01.002 Banco Conta Movimento (Ativo) no valor de R$ " + valorParcelaPagaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Amortização Contábil (" + razaoSocial + "): Ganho de Transação Tributária reconhecido no resultado: R$ " + valorDescontoTransacaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Passivo Circulante (12m): R$ " + passivoCirculante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Passivo Não Circulante (Longo Prazo): R$ " + passivoNaoCirculante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    lancamentoContabilGanhoRemissaoBrl: parseFloat(valorDescontoTransacaoBrl.toFixed(2)),
    passivoCirculanteAjustadoBrl: parseFloat(passivoCirculante.toFixed(2)),
    passivoNaoCirculanteLongoPrazoBrl: parseFloat(passivoNaoCirculante.toFixed(2)),
    partidaDobradaGerada: lancamento,
    statusAmortizacao: 'AMORTIZACAO_CONTABIL_PARCELAMENTO_CONCLUIDA',
    diagnosticoAmortizacao: diag
  });
}
