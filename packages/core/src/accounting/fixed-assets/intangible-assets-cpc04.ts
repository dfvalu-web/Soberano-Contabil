import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface RdProjectInput {
  projetoId: string;
  nomeProjeto: string; // Ex: 'Plataforma IA Soberano Contábil 2.0'
  gastosFasePesquisaBrl: number;
  gastosFaseDesenvolvimentoBrl: number;
  viabilidadeTecnicaEComercialAtestada: boolean;
  vidaUtilMeses?: number; // Se undefined -> Vida Útil Indefinida
  mesesAmortizacaoExercicio?: number;
}

export interface RdProjectResult {
  projetoId: string;
  nomeProjeto: string;
  totalDespesaPesquisaResultadoBrl: number;
  totalAtivoIntangivelCapitalizadoBrl: number;
  vidaUtilClassificacao: 'DEFINIDA' | 'INDEFINIDA';
  despesaAmortizacaoExercicioBrl: number;
  saldoContabilLiquidoFinalBrl: number;
  partidasDobradaIntangivel: JournalEntryLine[];
  diagnosticoCpc04: string;
}

export function evaluateIntangibleAssetAndRdCpc04(input: RdProjectInput): Result<RdProjectResult, Error> {
  const {
    projetoId,
    nomeProjeto,
    gastosFasePesquisaBrl,
    gastosFaseDesenvolvimentoBrl,
    viabilidadeTecnicaEComercialAtestada,
    vidaUtilMeses,
    mesesAmortizacaoExercicio = 0
  } = input;

  if (gastosFasePesquisaBrl < 0 || gastosFaseDesenvolvimentoBrl < 0) {
    return Err(new Error('Gastos de pesquisa e desenvolvimento não podem ser negativos.'));
  }

  const partidas: JournalEntryLine[] = [];

  // 1. Fase de Pesquisa: 100% Despesa do Período no Resultado (CPC 04, Item 54)
  if (gastosFasePesquisaBrl > 0) {
    partidas.push({
      accountId: '3.1.3.08',
      accountCode: '3.1.3.08',
      accountName: 'Despesas com Pesquisa Científica e Tecnológica (Resultado - CPC 04)',
      type: 'DEBIT',
      amount: gastosFasePesquisaBrl
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento / Fornecedores (Ativo/Passivo)',
      type: 'CREDIT',
      amount: gastosFasePesquisaBrl
    });
  }

  // 2. Fase de Desenvolvimento: Capitalizado no Ativo Intangível se viabilidade atestada
  let ativoCapitalizado = 0;
  if (gastosFaseDesenvolvimentoBrl > 0) {
    if (viabilidadeTecnicaEComercialAtestada) {
      ativoCapitalizado = gastosFaseDesenvolvimentoBrl;
      partidas.push({
        accountId: '1.2.4.02',
        accountCode: '1.2.4.02',
        accountName: 'Softwares e Projetos em Desenvolvimento (Ativo Não Circulante - CPC 04)',
        type: 'DEBIT',
        amount: gastosFaseDesenvolvimentoBrl
      });
      partidas.push({
        accountId: '1.1.1.02',
        accountCode: '1.1.1.02',
        accountName: 'Banco Conta Movimento / Salários a Pagar (Ativo/Passivo)',
        type: 'CREDIT',
        amount: gastosFaseDesenvolvimentoBrl
      });
    } else {
      // Se não atestada viabilidade, vai para despesa
      partidas.push({
        accountId: '3.1.3.09',
        accountCode: '3.1.3.09',
        accountName: 'Despesas com Desenvolvimento Não Qualificado (Resultado - CPC 04)',
        type: 'DEBIT',
        amount: gastosFaseDesenvolvimentoBrl
      });
      partidas.push({
        accountId: '1.1.1.02',
        accountCode: '1.1.1.02',
        accountName: 'Banco Conta Movimento / Fornecedores (Ativo/Passivo)',
        type: 'CREDIT',
        amount: gastosFaseDesenvolvimentoBrl
      });
    }
  }

  // 3. Amortização Periódica
  let despesaAmortizacao = 0;
  const isVidaUtilDefinida = vidaUtilMeses !== undefined && vidaUtilMeses > 0;

  if (isVidaUtilDefinida && ativoCapitalizado > 0 && mesesAmortizacaoExercicio > 0) {
    const amortizacaoMensal = ativoCapitalizado / vidaUtilMeses;
    despesaAmortizacao = Number((amortizacaoMensal * mesesAmortizacaoExercicio).toFixed(2));

    partidas.push({
      accountId: '3.1.2.06',
      accountCode: '3.1.2.06',
      accountName: 'Despesa com Amortização de Intangíveis (Resultado - CPC 04)',
      type: 'DEBIT',
      amount: despesaAmortizacao
    });
    partidas.push({
      accountId: '1.2.4.90',
      accountCode: '1.2.4.90',
      accountName: 'Amortização Acumulada de Intangíveis (Ativo Não Circulante - CPC 04)',
      type: 'CREDIT',
      amount: despesaAmortizacao
    });
  }

  const saldoLiquidoFinal = Number((ativoCapitalizado - despesaAmortizacao).toFixed(2));

  const diag = 'CPC 04 (R1) / IAS 38: Projeto ' + nomeProjeto + '. Pesquisa (Despesa imediata): R$ ' + gastosFasePesquisaBrl.toFixed(2) + '. Desenvolvimento (Capitalizado no Ativo): R$ ' + ativoCapitalizado.toFixed(2) + '. Classificação: Vida Útil ' + (isVidaUtilDefinida ? 'Definida (' + vidaUtilMeses + ' meses)' : 'Indefinida (Sujeito a Impairment anual)') + '. Amortização no exercício: R$ ' + despesaAmortizacao.toFixed(2) + '. Saldo líquido contábil final: R$ ' + saldoLiquidoFinal.toFixed(2) + '.';

  return Ok({
    projetoId,
    nomeProjeto,
    totalDespesaPesquisaResultadoBrl: gastosFasePesquisaBrl,
    totalAtivoIntangivelCapitalizadoBrl: ativoCapitalizado,
    vidaUtilClassificacao: isVidaUtilDefinida ? 'DEFINIDA' : 'INDEFINIDA',
    despesaAmortizacaoExercicioBrl: despesaAmortizacao,
    saldoContabilLiquidoFinalBrl: saldoLiquidoFinal,
    partidasDobradaIntangivel: partidas,
    diagnosticoCpc04: diag
  });
}
