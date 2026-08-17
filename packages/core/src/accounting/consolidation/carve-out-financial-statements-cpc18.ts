import { Result, Ok, Err } from '../../types/result.js';

export interface CarveOutBusinessUnitInput {
  unidadeNegocioId: string;
  unidadeNegocioNome: string; // Ex: 'Divisão de Software Corporativo (SaaS Division)'
  empresaMatrizNome: string; // Ex: 'Soberano Holdings S.A.'
  anoExercicio: number; // Ex: 2026
  receitaOperacionalBrutaBrl: number;
  custosDiretosBrl: number;
  despesasOperacionaisDiretasBrl: number;
  despesasCorporativasCompartilhadasPushDownBrl: number; // Rateio corporativo
  ativosDiretosAlocadosBrl: number;
  passivosDiretosAlocadosBrl: number;
}

export interface CarveOutFinancialStatementsResult {
  unidadeNegocioId: string;
  unidadeNegocioNome: string;
  anoExercicio: number;
  ebitdaCarveOutBrl: number;
  lucroLiquidoCarveOutBrl: number; // Após push-down accounting
  patrimonioLiquidoAtribuivelBrl: number; // Ativos - Passivos
  margemEbitdaPercent: number;
  demonstracaoResultadoCombinada: {
    receitaLiquida: number;
    lucroBruto: number;
    despesasOperacionaisTotais: number;
    ebitda: number;
    lucroLiquido: number;
  };
  diagnosticoCarveOut: string;
}

export function processCarveOutFinancialStatementsCpc18(input: CarveOutBusinessUnitInput): Result<CarveOutFinancialStatementsResult, Error> {
  const {
    unidadeNegocioId,
    unidadeNegocioNome,
    empresaMatrizNome,
    anoExercicio,
    receitaOperacionalBrutaBrl,
    custosDiretosBrl,
    despesasOperacionaisDiretasBrl,
    despesasCorporativasCompartilhadasPushDownBrl,
    ativosDiretosAlocadosBrl,
    passivosDiretosAlocadosBrl
  } = input;

  if (receitaOperacionalBrutaBrl <= 0 || custosDiretosBrl < 0) {
    return Err(new Error('Receita operacional bruta deve ser positiva.'));
  }

  // CPC 18 / IFRS Carve-Out Guidelines:
  // 1. Receita Líquida (dedução padrão de tributos s/ receita ~ 9,25% PIS/COFINS)
  const tributosSobreReceita = receitaOperacionalBrutaBrl * 0.0925;
  const receitaLiquida = Number((receitaOperacionalBrutaBrl - tributosSobreReceita).toFixed(2));
  const lucroBruto = Number((receitaLiquida - custosDiretosBrl).toFixed(2));

  // 2. Despesas Operacionais Totais = Diretas + Push-Down Compartilhado
  const totalDespesasOperacionais = Number((despesasOperacionaisDiretasBrl + despesasCorporativasCompartilhadasPushDownBrl).toFixed(2));
  const ebitda = Number((lucroBruto - totalDespesasOperacionais).toFixed(2));

  // 3. Lucro Líquido pós IRPJ/CSLL (34%)
  const irpjCsll = Math.max(0, ebitda * 0.34);
  const lucroLiquido = Number((ebitda - irpjCsll).toFixed(2));

  // 4. Patrimônio Líquido Carve-Out = Ativos Alocados - Passivos Alocados
  const plCarveOut = Number((ativosDiretosAlocadosBrl - passivosDiretosAlocadosBrl).toFixed(2));
  const margemEbitda = Number(((ebitda / receitaLiquida) * 100).toFixed(2));

  const diag = "Carve-Out Financial Statements (CPC 18/IFRS): " + unidadeNegocioNome + " (Cisao de " + empresaMatrizNome + " - Exercicio " + anoExercicio + "). Receita Liq: R$ " + receitaLiquida.toFixed(2) + " | Lucro Bruto: R$ " + lucroBruto.toFixed(2) + " | Push-Down Corp: R$ " + despesasCorporativasCompartilhadasPushDownBrl.toFixed(2) + " -> EBITDA Carve-Out: R$ " + ebitda.toFixed(2) + " (" + margemEbitda + "%) | Lucro Liq: R$ " + lucroLiquido.toFixed(2) + " | PL Atribuivel: R$ " + plCarveOut.toFixed(2) + ".";

  return Ok({
    unidadeNegocioId,
    unidadeNegocioNome,
    anoExercicio,
    ebitdaCarveOutBrl: ebitda,
    lucroLiquidoCarveOutBrl: lucroLiquido,
    patrimonioLiquidoAtribuivelBrl: plCarveOut,
    margemEbitdaPercent: margemEbitda,
    demonstracaoResultadoCombinada: {
      receitaLiquida,
      lucroBruto,
      despesasOperacionaisTotais: totalDespesasOperacionais,
      ebitda,
      lucroLiquido
    },
    diagnosticoCarveOut: diag
  });
}
