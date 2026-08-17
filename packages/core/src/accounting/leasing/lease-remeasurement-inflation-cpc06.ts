import { Result, Ok, Err } from '../../types/result.js';

export interface LeaseRemeasurementInput {
  contratoId: string;
  arrendatarioNome: string; // Ex: 'Soberano Centros Logísticos S.A.'
  saldoPassivoArrendamentoAnteriorBrl: number;
  saldoDireitoUsoAnteriorBrl: number;
  prazoRemanescenteMeses: number;
  variacaoIndiceInflacaoAcumuladaPercent: number; // Ex: IPCA 5,80%
  taxaDescontoIncrementalIbrAnualPercent?: number; // Ex: 10,5% a.a.
}

export interface LeaseRemeasurementResult {
  contratoId: string;
  arrendatarioNome: string;
  ajustePassivoArrendamentoBrl: number; // Aumento pelo índice de inflação
  novoSaldoPassivoArrendamentoBrl: number;
  novoSaldoDireitoUsoBrl: number;
  novaDespesaAmortizacaoMensalBrl: number;
  lancamentoContabil: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  };
  diagnosticoIfrs16: string;
}

export function processLeaseRemeasurementInflationCpc06(input: LeaseRemeasurementInput): Result<LeaseRemeasurementResult, Error> {
  const {
    contratoId,
    arrendatarioNome,
    saldoPassivoArrendamentoAnteriorBrl,
    saldoDireitoUsoAnteriorBrl,
    prazoRemanescenteMeses,
    variacaoIndiceInflacaoAcumuladaPercent
  } = input;

  if (saldoPassivoArrendamentoAnteriorBrl <= 0 || prazoRemanescenteMeses <= 0) {
    return Err(new Error('Saldo do passivo e prazo remanescente devem ser maiores que zero.'));
  }

  // CPC 06 R2 (IFRS 16) Itens 39-43:
  // A remensuração decorrente de alteração em índice de preços (IPCA/IGP-M) resulta em ajuste correspondente
  // no Passivo de Arrendamento contra o Ativo de Direito de Uso (sem impacto inicial na DRE).
  const ajusteInflacao = Number((saldoPassivoArrendamentoAnteriorBrl * (variacaoIndiceInflacaoAcumuladaPercent / 100)).toFixed(2));
  const novoPassivo = Number((saldoPassivoArrendamentoAnteriorBrl + ajusteInflacao).toFixed(2));
  const novoDireitoUso = Number((saldoDireitoUsoAnteriorBrl + ajusteInflacao).toFixed(2));

  const novaAmortizacaoMensal = Number((novoDireitoUso / prazoRemanescenteMeses).toFixed(2));

  const lancamento = {
    debito: '1.2.3.01 - Ativo de Direito de Uso (CPC 06 R2)',
    credito: '2.1.4.01 - Passivo de Arrendamento Mercantil Indexado ao IPCA',
    valor: ajusteInflacao,
    historico: 'Remensuração anual de contrato de locação por variação do IPCA (' + variacaoIndiceInflacaoAcumuladaPercent + '%)'
  };

  const diag = "Remensuracao IFRS 16 / CPC 06 R2: Contrato " + contratoId + " (" + arrendatarioNome + "). IPCA Acumulado: " + variacaoIndiceInflacaoAcumuladaPercent.toFixed(2) + "% | Ajuste Passivo/Ativo: R$ " + ajusteInflacao.toFixed(2) + " -> Novo Passivo: R$ " + novoPassivo.toFixed(2) + " | Novo Direito de Uso: R$ " + novoDireitoUso.toFixed(2) + " | Nova Amortizacao Mensal: R$ " + novaAmortizacaoMensal.toFixed(2) + "/mes (" + prazoRemanescenteMeses + " meses remanescentes).";

  return Ok({
    contratoId,
    arrendatarioNome,
    ajustePassivoArrendamentoBrl: ajusteInflacao,
    novoSaldoPassivoArrendamentoBrl: novoPassivo,
    novoSaldoDireitoUsoBrl: novoDireitoUso,
    novaDespesaAmortizacaoMensalBrl: novaAmortizacaoMensal,
    lancamentoContabil: lancamento,
    diagnosticoIfrs16: diag
  });
}
