import { Result, Ok, Err } from '../../types/result.js';

export interface ShoppingMallLeaseInput {
  lojaId: string;
  lojistaNome: string; // Ex: 'Soberano Megastore Varejo S.A.'
  shoppingNome: string; // Ex: 'Shopping Soberano Plaza'
  prazoContratoMeses: number; // Ex: 60 meses
  aluguelMinimoMensalGarantidoAmgBrl: number; // AMG fixo mensal
  percentualAluguelFaturamentoPercent: number; // Ex: 6% sobre faturamento
  faturamentoMensalLojaBrl: number; // Vendas do mês
  taxaDescontoIncrementalIbrAnualPercent?: number; // Ex: 11% a.a.
}

export interface ShoppingMallLeaseResult {
  lojaId: string;
  lojistaNome: string;
  shoppingNome: string;
  valorPassivoArrendamentoAmgInicialBrl: number; // Direito de Uso e Passivo reconhecido
  aluguelTotalCalculadoMesBrl: number; // Maior entre AMG e (% * Faturamento)
  despesaArrendamentoVariavelExcedenteDreBrl: number; // Lançado na DRE do mês
  despesaAmortizacaoDireitoUsoMensalBrl: number;
  lancamentosContabeisMes: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  }[];
  diagnosticoCpc06: string;
}

export function processShoppingMallVariableLeaseCpc06(input: ShoppingMallLeaseInput): Result<ShoppingMallLeaseResult, Error> {
  const {
    lojaId,
    lojistaNome,
    shoppingNome,
    prazoContratoMeses,
    aluguelMinimoMensalGarantidoAmgBrl,
    percentualAluguelFaturamentoPercent,
    faturamentoMensalLojaBrl
  } = input;

  if (aluguelMinimoMensalGarantidoAmgBrl <= 0 || prazoContratoMeses <= 0) {
    return Err(new Error('Aluguel mínimo garantido e prazo do contrato devem ser maiores que zero.'));
  }

  // CPC 06 R2 (IFRS 16) Itens 27 e 38(b):
  // 1. Apenas os pagamentos fixos (AMG) entram na mensuração inicial do Passivo e Direito de Uso.
  // 2. Os pagamentos variáveis vinculados ao faturamento NÃO entram no Passivo e são despesa na DRE no período incorrido.
  const passivoAmgTotal = Number((aluguelMinimoMensalGarantidoAmgBrl * prazoContratoMeses).toFixed(2));
  const amortizacaoMensal = Number((passivoAmgTotal / prazoContratoMeses).toFixed(2));

  const aluguelPercentualCalculado = Number((faturamentoMensalLojaBrl * (percentualAluguelFaturamentoPercent / 100)).toFixed(2));
  const aluguelTotalMes = Math.max(aluguelMinimoMensalGarantidoAmgBrl, aluguelPercentualCalculado);
  const despesaVariavelExcedente = Number((Math.max(0, aluguelTotalMes - aluguelMinimoMensalGarantidoAmgBrl)).toFixed(2));

  const lancamentos = [
    {
      debito: '2.1.4.01 - Passivo de Arrendamento Mercantil (Amortização Parcela AMG)',
      credito: '1.1.1.02 - Bancos / Fornecedor Shopping Center',
      valor: aluguelMinimoMensalGarantidoAmgBrl,
      historico: 'Pagamento de aluguel mínimo mensal garantido (AMG) da loja ' + lojaId
    }
  ];

  if (despesaVariavelExcedente > 0) {
    lancamentos.push({
      debito: '3.2.2.04 - Despesas de Arrendamento Variável sobre Faturamento (DRE)',
      credito: '1.1.1.02 - Bancos / Fornecedor Shopping Center',
      valor: despesaVariavelExcedente,
      historico: 'Pagamento de aluguel percentual variável excedente sobre vendas do mês (' + percentualAluguelFaturamentoPercent + '% s/ R$ ' + faturamentoMensalLojaBrl.toFixed(2) + ')'
    });
  }

  const diag = "Arrendamento de Shopping Center (CPC 06 R2): " + lojistaNome + " no " + shoppingNome + ". AMG: R$ " + aluguelMinimoMensalGarantidoAmgBrl.toFixed(2) + "/mes (Passivo Total 60 meses: R$ " + passivoAmgTotal.toFixed(2) + "). Faturamento Mes: R$ " + faturamentoMensalLojaBrl.toFixed(2) + " (" + percentualAluguelFaturamentoPercent + "% = R$ " + aluguelPercentualCalculado.toFixed(2) + ") -> Aluguel Total Pago: R$ " + aluguelTotalMes.toFixed(2) + " (AMG: R$ " + aluguelMinimoMensalGarantidoAmgBrl.toFixed(2) + " + Variavel DRE: R$ " + despesaVariavelExcedente.toFixed(2) + ").";

  return Ok({
    lojaId,
    lojistaNome,
    shoppingNome,
    valorPassivoArrendamentoAmgInicialBrl: passivoAmgTotal,
    aluguelTotalCalculadoMesBrl: aluguelTotalMes,
    despesaArrendamentoVariavelExcedenteDreBrl: despesaVariavelExcedente,
    despesaAmortizacaoDireitoUsoMensalBrl: amortizacaoMensal,
    lancamentosContabeisMes: lancamentos,
    diagnosticoCpc06: diag
  });
}
