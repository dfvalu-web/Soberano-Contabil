import { Result, Ok, Err } from '../../types/result.js';

export interface ComprehensiveIndirectDfcInput {
  empresaId: string;
  exercicioAno: number;
  lucroLiquidoExercicioBrl: number;
  // Ajustes Não Caixa:
  depreciacaoAmortizacaoBrl: number;
  provisoesContingenciasLíquidasBrl: number; // CPC 25
  resultadoEquivalenciaPatrimonialMepBrl: number; // Negativo se for ganho, positivo se for perda
  variacaoCambialNaoRealizadaDividasBrl: number;
  // Variações de Capital de Giro:
  deltaClientesContasReceberBrl: number; // Positivo se aumentou (consome caixa), negativo se diminuiu
  deltaEstoquesBrl: number;
  deltaFornecedoresContasPagarBrl: number; // Positivo se aumentou (gera caixa), negativo se diminuiu
  deltaObrigacoesTrabalhistasFiscaisBrl: number;
  // Atividades de Investimento e Financiamento:
  aquisicaoAtivoImobilizadoCapexBrl: number; // Saída
  aquisicaoAtivoIntangivelBrl: number; // Saída
  novosFinanciamentosCaptadosBrl: number; // Entrada
  amortizacaoEmprestimosFinanciamentosBrl: number; // Saída
  dividendosJcpPagosBrl: number; // Saída
  saldoInicialCaixaEquivalentesBrl: number;
}

export interface ComprehensiveIndirectDfcResult {
  empresaId: string;
  exercicioAno: number;
  lucroLiquidoAjustadoItensNaoCaixaBrl: number;
  variacaoLiquidaCapitalGiroBrl: number;
  fluxoCaixaOperacionalLiquidoBrl: number;
  fluxoCaixaInvestimentoLiquidoBrl: number;
  fluxoCaixaFinanciamentoLiquidoBrl: number;
  variacaoLiquidaTotalCaixaExercicioBrl: number;
  saldoFinalCaixaEquivalentesBrl: number;
  diagnosticoCpc03: string;
}

export function generateComprehensiveIndirectDfcCpc03(input: ComprehensiveIndirectDfcInput): Result<ComprehensiveIndirectDfcResult, Error> {
  const {
    empresaId,
    exercicioAno,
    lucroLiquidoExercicioBrl,
    depreciacaoAmortizacaoBrl,
    provisoesContingenciasLíquidasBrl,
    resultadoEquivalenciaPatrimonialMepBrl,
    variacaoCambialNaoRealizadaDividasBrl,
    deltaClientesContasReceberBrl,
    deltaEstoquesBrl,
    deltaFornecedoresContasPagarBrl,
    deltaObrigacoesTrabalhistasFiscaisBrl,
    aquisicaoAtivoImobilizadoCapexBrl,
    aquisicaoAtivoIntangivelBrl,
    novosFinanciamentosCaptadosBrl,
    amortizacaoEmprestimosFinanciamentosBrl,
    dividendosJcpPagosBrl,
    saldoInicialCaixaEquivalentesBrl
  } = input;

  if (saldoInicialCaixaEquivalentesBrl < 0) {
    return Err(new Error('Saldo inicial de caixa não pode ser negativo.'));
  }

  // 1. Lucro Líquido Ajustado por Itens Não Caixa:
  // Depreciação (+) / Provisões (+) / Perda Cambial (+) / Ganho MEP (-)
  const lucroAjustado = Number((
    lucroLiquidoExercicioBrl +
    depreciacaoAmortizacaoBrl +
    provisoesContingenciasLíquidasBrl +
    variacaoCambialNaoRealizadaDividasBrl -
    resultadoEquivalenciaPatrimonialMepBrl
  ).toFixed(2));

  // 2. Variação de Capital de Giro:
  // (- Delta Clientes) + (- Delta Estoques) + (+ Delta Fornecedores) + (+ Delta Obrigações)
  const variacaoCapitalGiro = Number((
    -deltaClientesContasReceberBrl -
    deltaEstoquesBrl +
    deltaFornecedoresContasPagarBrl +
    deltaObrigacoesTrabalhistasFiscaisBrl
  ).toFixed(2));

  // 3. Fluxo de Caixa Operacional Líquido (FCO)
  const fco = Number((lucroAjustado + variacaoCapitalGiro).toFixed(2));

  // 4. Fluxo de Caixa de Investimentos (FCI) = -(Capex + Intangíveis)
  const fci = Number((-aquisicaoAtivoImobilizadoCapexBrl - aquisicaoAtivoIntangivelBrl).toFixed(2));

  // 5. Fluxo de Caixa de Financiamentos (FCF) = Financiamentos Captados - Amortizações - Dividendos Pagos
  const fcf = Number((novosFinanciamentosCaptadosBrl - amortizacaoEmprestimosFinanciamentosBrl - dividendosJcpPagosBrl).toFixed(2));

  // 6. Variação Líquida Total e Saldo Final de Caixa
  const variacaoLiquidaTotal = Number((fco + fci + fcf).toFixed(2));
  const saldoFinalCaixa = Number((saldoInicialCaixaEquivalentesBrl + variacaoLiquidaTotal).toFixed(2));

  const diag = 'CPC 03 R2 / IAS 7 (DFC Método Indireto): Exercício ' + exercicioAno + '. Lucro Líquido R$ ' + lucroLiquidoExercicioBrl.toFixed(2) + ' (Lucro Ajustado Não Caixa: R$ ' + lucroAjustado.toFixed(2) + '). Variação Capital Giro: R$ ' + variacaoCapitalGiro.toFixed(2) + '. FCO: R$ ' + fco.toFixed(2) + ' | FCI: R$ ' + fci.toFixed(2) + ' | FCF: R$ ' + fcf.toFixed(2) + '. Variação Líquida Total: R$ ' + variacaoLiquidaTotal.toFixed(2) + ' (Saldo Final Caixa: R$ ' + saldoFinalCaixa.toFixed(2) + ').';

  return Ok({
    empresaId,
    exercicioAno,
    lucroLiquidoAjustadoItensNaoCaixaBrl: lucroAjustado,
    variacaoLiquidaCapitalGiroBrl: variacaoCapitalGiro,
    fluxoCaixaOperacionalLiquidoBrl: fco,
    fluxoCaixaInvestimentoLiquidoBrl: fci,
    fluxoCaixaFinanciamentoLiquidoBrl: fcf,
    variacaoLiquidaTotalCaixaExercicioBrl: variacaoLiquidaTotal,
    saldoFinalCaixaEquivalentesBrl: saldoFinalCaixa,
    diagnosticoCpc03: diag
  });
}
