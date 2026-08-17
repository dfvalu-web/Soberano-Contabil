import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type JointArrangementType = 'OPERACAO_EM_CONJUNTO' | 'EMPREENDIMENTO_CONTROLADO_CONJUNTO';

export interface JointArrangementInput {
  acordoId: string;
  nomeAcordoConsorcio: string;
  tipoAcordo: JointArrangementType;
  percentualParticipacaoEntidade: number; // Ex: 40 para 40%
  dadosOperacaoConjunta?: {
    ativosTotaisDoConsorcio: number;
    passivosTotaisDoConsorcio: number;
    receitasTotaisDoConsorcio: number;
    despesasTotaisDoConsorcio: number;
  };
  dadosJointVentureMep?: {
    patrimonioLiquidoInicialJointVenture: number;
    lucroLiquidoGeradoJointVenture: number;
  };
}

export interface JointArrangementResult {
  acordoId: string;
  tipoAcordo: JointArrangementType;
  percentualParticipacao: number;
  partidasContabeisApuradas: JournalEntryLine[];
  impactoPatrimonialLiquidoBrl: number;
  impactoResultadoExercicioBrl: number;
  diagnosticoCpc19: string;
}

export function evaluateJointArrangementCpc19(input: JointArrangementInput): Result<JointArrangementResult, Error> {
  const { acordoId, nomeAcordoConsorcio, tipoAcordo, percentualParticipacaoEntidade, dadosOperacaoConjunta, dadosJointVentureMep } = input;

  if (percentualParticipacaoEntidade <= 0 || percentualParticipacaoEntidade > 100) {
    return Err(new Error('Percentual de participação deve estar entre 1% e 100%.'));
  }

  const prop = percentualParticipacaoEntidade / 100;
  const partidas: JournalEntryLine[] = [];
  let impactoPatrimonial = 0;
  let impactoResultado = 0;

  if (tipoAcordo === 'OPERACAO_EM_CONJUNTO') {
    if (!dadosOperacaoConjunta) {
      return Err(new Error('Dados operacionais do consórcio são obrigatórios para Operação em Conjunto.'));
    }
    // Reconhece a parcela proporcional de ativos, passivos, receitas e despesas
    const ativosProp = Number((dadosOperacaoConjunta.ativosTotaisDoConsorcio * prop).toFixed(2));
    const passivosProp = Number((dadosOperacaoConjunta.passivosTotaisDoConsorcio * prop).toFixed(2));
    const receitasProp = Number((dadosOperacaoConjunta.receitasTotaisDoConsorcio * prop).toFixed(2));
    const despesasProp = Number((dadosOperacaoConjunta.despesasTotaisDoConsorcio * prop).toFixed(2));

    partidas.push({
      accountId: '1.1.9.01',
      accountCode: '1.1.9.01',
      accountName: 'Ativos Proporcionais em Operação em Conjunto (Ativo Circulante - CPC 19)',
      type: 'DEBIT',
      amount: ativosProp
    });
    partidas.push({
      accountId: '2.1.9.01',
      accountCode: '2.1.9.01',
      accountName: 'Passivos Proporcionais em Operação em Conjunto (Passivo Circulante - CPC 19)',
      type: 'CREDIT',
      amount: passivosProp
    });
    partidas.push({
      accountId: '3.1.1.09',
      accountCode: '3.1.1.09',
      accountName: 'Receita Proporcional de Consórcio / Joint Operation (Resultado - CPC 19)',
      type: 'CREDIT',
      amount: receitasProp
    });

    impactoPatrimonial = Number((ativosProp - passivosProp).toFixed(2));
    impactoResultado = Number((receitasProp - despesasProp).toFixed(2));

    const diag = 'CPC 19 / IFRS 11: Operação em Conjunto ' + nomeAcordoConsorcio + ' (' + percentualParticipacaoEntidade + '%). Reconhecimento proporcional direto de R$ ' + ativosProp.toFixed(2) + ' em ativos e R$ ' + receitasProp.toFixed(2) + ' em receitas.';

    return Ok({
      acordoId,
      tipoAcordo,
      percentualParticipacao: percentualParticipacaoEntidade,
      partidasContabeisApuradas: partidas,
      impactoPatrimonialLiquidoBrl: impactoPatrimonial,
      impactoResultadoExercicioBrl: impactoResultado,
      diagnosticoCpc19: diag
    });
  } else {
    // Joint Venture => MEP (CPC 18)
    if (!dadosJointVentureMep) {
      return Err(new Error('Dados da Joint Venture são obrigatórios para Empreendimento Controlado em Conjunto.'));
    }
    const mepResultado = Number((dadosJointVentureMep.lucroLiquidoGeradoJointVenture * prop).toFixed(2));
    const investimentoInicialProp = Number((dadosJointVentureMep.patrimonioLiquidoInicialJointVenture * prop).toFixed(2));

    partidas.push({
      accountId: '1.2.2.05',
      accountCode: '1.2.2.05',
      accountName: 'Investimento em Joint Venture (Ativo Não Circulante - CPC 19 / CPC 18)',
      type: 'DEBIT',
      amount: mepResultado
    });
    partidas.push({
      accountId: '3.1.4.01',
      accountCode: '3.1.4.01',
      accountName: 'Resultado Positivo de Equivalência Patrimonial em JV (Resultado - CPC 19)',
      type: 'CREDIT',
      amount: mepResultado
    });

    impactoPatrimonial = Number((investimentoInicialProp + mepResultado).toFixed(2));
    impactoResultado = mepResultado;

    const diag = 'CPC 19 / IFRS 11: Joint Venture ' + nomeAcordoConsorcio + ' (' + percentualParticipacaoEntidade + '%). Contabilizada pelo Método da Equivalência Patrimonial (MEP), reconhecendo R$ ' + mepResultado.toFixed(2) + ' no resultado.';

    return Ok({
      acordoId,
      tipoAcordo,
      percentualParticipacao: percentualParticipacaoEntidade,
      partidasContabeisApuradas: partidas,
      impactoPatrimonialLiquidoBrl: impactoPatrimonial,
      impactoResultadoExercicioBrl: impactoResultado,
      diagnosticoCpc19: diag
    });
  }
}
