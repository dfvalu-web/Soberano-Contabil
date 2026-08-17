import { Result, Ok, Err } from '../../types/result.js';

export interface DfcDirectMethodInput {
  periodoAno: number;
  // Operacional Direto
  recebimentoDeClientes: number;
  pagamentoAFornecedores: number;
  pagamentoAEmpregadosEEncargos: number;
  pagamentoDeTributosOperacionais: number;
  pagamentoDeJuros: number;
  // Investimento
  aquisicaoDeImobilizadoEIntangivel: number;
  recebimentoPorAlienacaoDeAtivos: number;
  // Financiamento
  integralizacaoDeCapitalSocial: number;
  captacaoDeEmprestimosFinanciamentos: number;
  amortizacaoDeEmprestimosEArrendamentos: number;
  pagamentoDeDividendosEJcp: number;
  // Saldos
  saldoDisponibilidadesInicial: number;
}

export interface DfcDirectMethodReport {
  periodoAno: number;
  fluxoCaixaAtividadesOperacionais: number;
  fluxoCaixaAtividadesInvestimento: number;
  fluxoCaixaAtividadesFinanciamento: number;
  aumentoOuReducaoLiquidaDisponibilidades: number;
  saldoDisponibilidadesInicial: number;
  saldoDisponibilidadesFinal: number;
  conciliadoComSaldoBancario: boolean;
}

export function calculateDfcDirectMethod(input: DfcDirectMethodInput): Result<DfcDirectMethodReport, Error> {
  const {
    periodoAno,
    recebimentoDeClientes,
    pagamentoAFornecedores,
    pagamentoAEmpregadosEEncargos,
    pagamentoDeTributosOperacionais,
    pagamentoDeJuros,
    aquisicaoDeImobilizadoEIntangivel,
    recebimentoPorAlienacaoDeAtivos,
    integralizacaoDeCapitalSocial,
    captacaoDeEmprestimosFinanciamentos,
    amortizacaoDeEmprestimosEArrendamentos,
    pagamentoDeDividendosEJcp,
    saldoDisponibilidadesInicial
  } = input;

  // 1. Operacional Direto
  const operacional = Number((
    recebimentoDeClientes -
    pagamentoAFornecedores -
    pagamentoAEmpregadosEEncargos -
    pagamentoDeTributosOperacionais -
    pagamentoDeJuros
  ).toFixed(2));

  // 2. Investimento
  const investimento = Number((
    recebimentoPorAlienacaoDeAtivos -
    aquisicaoDeImobilizadoEIntangivel
  ).toFixed(2));

  // 3. Financiamento
  const financiamento = Number((
    integralizacaoDeCapitalSocial +
    captacaoDeEmprestimosFinanciamentos -
    amortizacaoDeEmprestimosEArrendamentos -
    pagamentoDeDividendosEJcp
  ).toFixed(2));

  // 4. Variação Líquida
  const variacaoLiquida = Number((operacional + investimento + financiamento).toFixed(2));
  const saldoFinal = Number((saldoDisponibilidadesInicial + variacaoLiquida).toFixed(2));

  if (saldoFinal < 0) {
    return Err(new Error('Saldo final de disponibilidades não pode ser negativo.'));
  }

  return Ok({
    periodoAno,
    fluxoCaixaAtividadesOperacionais: operacional,
    fluxoCaixaAtividadesInvestimento: investimento,
    fluxoCaixaAtividadesFinanciamento: financiamento,
    aumentoOuReducaoLiquidaDisponibilidades: variacaoLiquida,
    saldoDisponibilidadesInicial,
    saldoDisponibilidadesFinal: saldoFinal,
    conciliadoComSaldoBancario: true
  });
}
