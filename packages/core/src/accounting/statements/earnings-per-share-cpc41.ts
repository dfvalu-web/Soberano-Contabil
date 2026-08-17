import { Result, Ok, Err } from '../../types/result.js';

export interface EpsCalculationInput {
  periodoAno: number;
  lucroLiquidoDoExercicio: number;
  dividendosAcoesPreferenciaisNaoParticipantes: number;
  mediaPonderadaAcoesOrdinarias: number;
  opcoesDeAcoesOutorgadas?: {
    quantidadeOpcoes: number;
    precoExercicioUnitario: number;
    precoMedioMercadoAcao: number;
  };
}

export interface EpsCalculationResult {
  periodoAno: number;
  lucroAtribuivelAosAcionistasOrdinarios: number;
  mediaPonderadaAcoesOrdinarias: number;
  lpaBasicoBrlPorAcao: number;
  lpaDiluidoBrlPorAcao: number;
  houveEfeitoDilutivo: boolean;
  acoesIncrementaisPotenciais: number;
  diagnosticoCpc41: string;
}

export function calculateEarningsPerShare(input: EpsCalculationInput): Result<EpsCalculationResult, Error> {
  const {
    periodoAno,
    lucroLiquidoDoExercicio,
    dividendosAcoesPreferenciaisNaoParticipantes,
    mediaPonderadaAcoesOrdinarias,
    opcoesDeAcoesOutorgadas
  } = input;

  if (mediaPonderadaAcoesOrdinarias <= 0) {
    return Err(new Error('Média ponderada de ações ordinárias deve ser superior a zero.'));
  }

  const lucroOrdinario = Number((lucroLiquidoDoExercicio - dividendosAcoesPreferenciaisNaoParticipantes).toFixed(2));
  const lpaBasico = Number((lucroOrdinario / mediaPonderadaAcoesOrdinarias).toFixed(4));

  let acoesIncrementais = 0;
  let lpaDiluido = lpaBasico;
  let dilutivo = false;

  if (opcoesDeAcoesOutorgadas && opcoesDeAcoesOutorgadas.quantidadeOpcoes > 0) {
    const { quantidadeOpcoes, precoExercicioUnitario, precoMedioMercadoAcao } = opcoesDeAcoesOutorgadas;
    // Se preço de mercado > preço de exercício => Efeito dilutivo (Treasury Stock Method)
    if (precoMedioMercadoAcao > precoExercicioUnitario) {
      dilutivo = true;
      const fatorDiluicao = 1 - (precoExercicioUnitario / precoMedioMercadoAcao);
      acoesIncrementais = Math.round(quantidadeOpcoes * fatorDiluicao);
      const totalAcoesDiluidas = mediaPonderadaAcoesOrdinarias + acoesIncrementais;
      lpaDiluido = Number((lucroOrdinario / totalAcoesDiluidas).toFixed(4));
    }
  }

  const diagnostico = 'LPA Básico: R$ ' + lpaBasico.toFixed(4) + ' por ação. ' + (dilutivo ? 'LPA Diluído: R$ ' + lpaDiluido.toFixed(4) + ' por ação (considerando ' + acoesIncrementais + ' ações potenciais de Stock Options).' : 'Sem instrumentos potencialmente dilutivos.');

  return Ok({
    periodoAno,
    lucroAtribuivelAosAcionistasOrdinarios: lucroOrdinario,
    mediaPonderadaAcoesOrdinarias,
    lpaBasicoBrlPorAcao: lpaBasico,
    lpaDiluidoBrlPorAcao: lpaDiluido,
    houveEfeitoDilutivo: dilutivo,
    acoesIncrementaisPotenciais: acoesIncrementais,
    diagnosticoCpc41: diagnostico
  });
}
