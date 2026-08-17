import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface IntercompanyConsolidationInput {
  grupoEconomicoId: string;
  nomeGrupo: string;
  percentualParticipacaoControladora: number; // Ex: 80 para 80% (NCI = 20%)
  // Saldos cruzados
  mutuoAtivoControladoraBrl: number;
  mutuoPassivoControladaBrl: number;
  // Transações de vendas internas
  vendasIntercompanyAnoBrl: number;
  lucroNaoRealizadoEstoquesFinaisBrl: number;
  // Resultados individuais
  patrimonioLiquidoControladaBrl: number;
  lucroLiquidoControladaExercicioBrl: number;
}

export interface IntercompanyConsolidationResult {
  grupoId: string;
  nomeGrupo: string;
  percentualControladora: number;
  percentualNciNaoControladores: number;
  totalEliminacoesMutuosBrl: number;
  totalEliminacoesVendasInternasBrl: number;
  lucroNaoRealizadoEliminadoEstoqueBrl: number;
  saldoNciNoPatrimonioLiquidoConsolidadoBrl: number;
  parcelaNciNoResultadoConsolidadoBrl: number;
  partidasDobradaConsolidacao: JournalEntryLine[];
  diagnosticoCpc36: string;
}

export function executeAdvancedConsolidationCpc36(input: IntercompanyConsolidationInput): Result<IntercompanyConsolidationResult, Error> {
  const {
    grupoEconomicoId,
    nomeGrupo,
    percentualParticipacaoControladora,
    mutuoAtivoControladoraBrl,
    mutuoPassivoControladaBrl,
    vendasIntercompanyAnoBrl,
    lucroNaoRealizadoEstoquesFinaisBrl,
    patrimonioLiquidoControladaBrl,
    lucroLiquidoControladaExercicioBrl
  } = input;

  if (percentualParticipacaoControladora <= 0 || percentualParticipacaoControladora >= 100) {
    return Err(new Error('Percentual da controladora deve estar entre 1% e 99% para apuração de consolidação com NCI.'));
  }

  const nciPerc = 100 - percentualParticipacaoControladora;
  const nciProp = nciPerc / 100;

  // 1. Participação dos Não Controladores (NCI)
  const nciPl = Number((patrimonioLiquidoControladaBrl * nciProp).toFixed(2));
  const nciResultado = Number((lucroLiquidoControladaExercicioBrl * nciProp).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // 2. Eliminação de Mútuos Cruzados
  const eliminacaoMutuo = Math.min(mutuoAtivoControladoraBrl, mutuoPassivoControladaBrl);
  if (eliminacaoMutuo > 0) {
    partidas.push({
      accountId: '2.1.2.01',
      accountCode: '2.1.2.01',
      accountName: 'Eliminação de Mútuo Intercompany (Passivo Circulante - CPC 36)',
      type: 'DEBIT',
      amount: eliminacaoMutuo
    });
    partidas.push({
      accountId: '1.1.2.09',
      accountCode: '1.1.2.09',
      accountName: 'Eliminação de Mútuo Intercompany (Ativo Circulante - CPC 36)',
      type: 'CREDIT',
      amount: eliminacaoMutuo
    });
  }

  // 3. Eliminação de Vendas Intercompany
  if (vendasIntercompanyAnoBrl > 0) {
    partidas.push({
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Eliminação de Receitas de Vendas Intercompany (Resultado - CPC 36)',
      type: 'DEBIT',
      amount: vendasIntercompanyAnoBrl
    });
    partidas.push({
      accountId: '3.1.2.01',
      accountCode: '3.1.2.01',
      accountName: 'Eliminação de Custo das Vendas Intercompany (Resultado - CPC 36)',
      type: 'CREDIT',
      amount: vendasIntercompanyAnoBrl
    });
  }

  // 4. Eliminação de Lucro Não Realizado em Estoques
  if (lucroNaoRealizadoEstoquesFinaisBrl > 0) {
    partidas.push({
      accountId: '3.1.2.01',
      accountCode: '3.1.2.01',
      accountName: 'Ajuste de Lucro Não Realizado em Estoques (Resultado - CPC 36)',
      type: 'DEBIT',
      amount: lucroNaoRealizadoEstoquesFinaisBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias (Ativo Circulante - CPC 36)',
      type: 'CREDIT',
      amount: lucroNaoRealizadoEstoquesFinaisBrl
    });
  }

  const diag = 'CPC 36 (R3) / IFRS 10: Consolidação de ' + nomeGrupo + ' (' + percentualParticipacaoControladora + '% Controladora / ' + nciPerc + '% Não Controladores - NCI). Eliminados R$ ' + eliminacaoMutuo.toFixed(2) + ' em mútuos, R$ ' + vendasIntercompanyAnoBrl.toFixed(2) + ' em vendas internas e R$ ' + lucroNaoRealizadoEstoquesFinaisBrl.toFixed(2) + ' de lucro não realizado em estoques. NCI no PL: R$ ' + nciPl.toFixed(2) + ' e no Resultado: R$ ' + nciResultado.toFixed(2) + '.';

  return Ok({
    grupoId: grupoEconomicoId,
    nomeGrupo,
    percentualControladora: percentualParticipacaoControladora,
    percentualNciNaoControladores: nciPerc,
    totalEliminacoesMutuosBrl: eliminacaoMutuo,
    totalEliminacoesVendasInternasBrl: vendasIntercompanyAnoBrl,
    lucroNaoRealizadoEliminadoEstoqueBrl: lucroNaoRealizadoEstoquesFinaisBrl,
    saldoNciNoPatrimonioLiquidoConsolidadoBrl: nciPl,
    parcelaNciNoResultadoConsolidadoBrl: nciResultado,
    partidasDobradaConsolidacao: partidas,
    diagnosticoCpc36: diag
  });
}
