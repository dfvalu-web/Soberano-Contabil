import { Result, Ok, Err } from '../../types/result.js';

export interface StockOptionGrantInput {
  planoId: string;
  beneficiarioNome: string;
  cargo: string;
  quantidadeOpcoesExercidas: number;
  precoExercicioPagoPorAcaoBrl: number; // Strike Price pago
  valorMercadoAcaoNoExercicioBrl: number; // Preço de mercado na data do exercício
  temOnerosidadeReal: boolean; // Empregado pagou pelo exercício?
  temRiscoMercado: boolean; // Sem garantia de recompra fixa pela empresa?
  precoVendaFuturaAcaoBrl?: number; // Para cálculo do ganho de capital na alienação
}

export interface StockOptionGrantResult {
  planoId: string;
  beneficiarioNome: string;
  naturezaJuridicaPlano: 'MERCANTIL_SEM_ENCARGOS_FOLHA' | 'REMUNERATORIA_SALARIAL';
  ganhoEconomicoNoExercicioBrl: number; // (Mercado - Strike) * Qtd
  encargosFolhaInssPatronalBrl: number; // 0 se Mercantil; 20% CPP + RAT se Salarial
  fgtsDevidoBrl: number; // 0 se Mercantil; 8% se Salarial
  irrfFolhaDevidoBrl: number; // 0 se Mercantil; 27,5% se Salarial
  irpfGanhoCapitalAliencaoFuturaBrl: number; // 15% sobre o ganho de capital na venda
  diagnosticoStjTema1226: string;
}

export function evaluateStockOptionsStjTema1226(input: StockOptionGrantInput): Result<StockOptionGrantResult, Error> {
  const {
    planoId,
    beneficiarioNome,
    cargo,
    quantidadeOpcoesExercidas,
    precoExercicioPagoPorAcaoBrl,
    valorMercadoAcaoNoExercicioBrl,
    temOnerosidadeReal,
    temRiscoMercado,
    precoVendaFuturaAcaoBrl
  } = input;

  if (quantidadeOpcoesExercidas <= 0 || valorMercadoAcaoNoExercicioBrl <= 0) {
    return Err(new Error('Quantidade de ações e valor de mercado devem ser superiores a zero.'));
  }

  // Tese Vinculante do STJ (Tema Repetitivo 1226 / REsp 2.069.644 e 2.074.564):
  // Planos de Stock Options com onerosidade real e risco de mercado possuem natureza estritamente mercantil.
  // Não incidem INSS patronal, FGTS e IRRF no momento da outorga ou do exercício.
  // A tributação recai unicamente como Ganho de Capital no IRPF no momento da posterior alienação das ações.
  const isMercantil = temOnerosidadeReal && temRiscoMercado && precoExercicioPagoPorAcaoBrl > 0;
  const ganhoNoExercicio = Number((Math.max(0, (valorMercadoAcaoNoExercicioBrl - precoExercicioPagoPorAcaoBrl) * quantidadeOpcoesExercidas)).toFixed(2));

  let inssPatronal = 0;
  let fgts = 0;
  let irrfFolha = 0;
  let irpfGanhoCapital = 0;

  if (isMercantil) {
    // Natureza Mercantil (STJ 1226): 0 encargos na folha
    if (precoVendaFuturaAcaoBrl && precoVendaFuturaAcaoBrl > precoExercicioPagoPorAcaoBrl) {
      // Ganho de Capital = Preço de Venda - Preço de Custo (Strike Pago)
      const lucroVenda = (precoVendaFuturaAcaoBrl - precoExercicioPagoPorAcaoBrl) * quantidadeOpcoesExercidas;
      irpfGanhoCapital = Number((lucroVenda * 0.15).toFixed(2));
    }
  } else {
    // Natureza Salarial (Ações gratuitas / sem risco): Tributação integral na folha
    inssPatronal = Number((ganhoNoExercicio * 0.28).toFixed(2)); // CPP 20% + RAT 3% + Terceiros 5%
    fgts = Number((ganhoNoExercicio * 0.08).toFixed(2)); // 8% FGTS
    irrfFolha = Number((ganhoNoExercicio * 0.275).toFixed(2)); // 27,5% IRRF Teto
  }

  const natureza: 'MERCANTIL_SEM_ENCARGOS_FOLHA' | 'REMUNERATORIA_SALARIAL' = isMercantil
    ? 'MERCANTIL_SEM_ENCARGOS_FOLHA'
    : 'REMUNERATORIA_SALARIAL';

  const diag = "Stock Options (STJ Tema Repetitivo 1226): " + beneficiarioNome + " (" + cargo + "). " + quantidadeOpcoesExercidas + " acoes | Strike: R$ " + precoExercicioPagoPorAcaoBrl.toFixed(2) + " vs Mercado Exercicio: R$ " + valorMercadoAcaoNoExercicioBrl.toFixed(2) + ". Natureza: " + natureza + ". " + (isMercantil ? "ISENTO DE INSS, FGTS E IRRF NA FOLHA. Tributacao exclusiva de IRPF Ganho de Capital na venda futura (R$ " + irpfGanhoCapital.toFixed(2) + ")." : "INCIDENCIA DE ENCARGOS FOLHA: INSS Patronal R$ " + inssPatronal.toFixed(2) + " + FGTS R$ " + fgts.toFixed(2) + " + IRRF R$ " + irrfFolha.toFixed(2) + ".");

  return Ok({
    planoId,
    beneficiarioNome,
    naturezaJuridicaPlano: natureza,
    ganhoEconomicoNoExercicioBrl: ganhoNoExercicio,
    encargosFolhaInssPatronalBrl: inssPatronal,
    fgtsDevidoBrl: fgts,
    irrfFolhaDevidoBrl: irrfFolha,
    irpfGanhoCapitalAliencaoFuturaBrl: irpfGanhoCapital,
    diagnosticoStjTema1226: diag
  });
}
