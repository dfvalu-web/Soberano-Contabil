import { Result, Ok, Err } from '../../types/result.js';

export interface OperatingSegmentInput {
  segmentoId: string;
  nomeSegmento: string;
  receitaExterna: number;
  receitaIntersegmento: number;
  resultadoOperacional: number;
  ativosTotais: number;
  passivosTotais: number;
}

export interface SegmentReportingResult {
  periodoAno: number;
  segmentosReportaveis: Array<{
    segmentoId: string;
    nomeSegmento: string;
    receitaTotal: number;
    resultadoOperacional: number;
    ativosTotais: number;
    motivoElegibilidade: string;
  }>;
  segmentosNaoReportaveisAgregados: {
    quantidadeSegmentos: number;
    receitaTotalAgregada: number;
    ativosAgregados: number;
  };
  totalConsolidado: {
    receitaExternaConsolidada: number;
    resultadoOperacionalConsolidado: number;
    ativosTotaisConsolidados: number;
  };
  regra75PorcentoAtendida: boolean;
  percentualReceitaExternaReportavel: number;
  diagnosticoCpc22: string;
}

export function evaluateSegmentReportingCpc22(
  periodoAno: number,
  segmentos: OperatingSegmentInput[]
): Result<SegmentReportingResult, Error> {
  if (!segmentos || segmentos.length === 0) {
    return Err(new Error('Pelo menos um segmento operacional deve ser informado.'));
  }

  // 1. Totais combinados
  const receitaCombinadaTotal = segmentos.reduce((acc, s) => acc + s.receitaExterna + s.receitaIntersegmento, 0);
  const receitaExternaTotal = segmentos.reduce((acc, s) => acc + s.receitaExterna, 0);
  const ativosCombinadosTotal = segmentos.reduce((acc, s) => acc + s.ativosTotais, 0);
  const resultadoConsolidado = segmentos.reduce((acc, s) => acc + s.resultadoOperacional, 0);

  const lucrosCombinados = segmentos.filter(s => s.resultadoOperacional > 0).reduce((acc, s) => acc + s.resultadoOperacional, 0);
  const prejuizosCombinadosAbs = Math.abs(segmentos.filter(s => s.resultadoOperacional < 0).reduce((acc, s) => acc + s.resultadoOperacional, 0));
  const baseResultado10 = Math.max(lucrosCombinados, prejuizosCombinadosAbs) * 0.10;

  const thresholdReceita10 = receitaCombinadaTotal * 0.10;
  const thresholdAtivos10 = ativosCombinadosTotal * 0.10;

  const reportaveis: SegmentReportingResult['segmentosReportaveis'] = [];
  let outrosRec = 0;
  let outrosAtivos = 0;
  let outrosCount = 0;

  for (const seg of segmentos) {
    const recTot = seg.receitaExterna + seg.receitaIntersegmento;
    const atendeReceita = recTot >= thresholdReceita10;
    const atendeResultado = Math.abs(seg.resultadoOperacional) >= baseResultado10;
    const atendeAtivos = seg.ativosTotais >= thresholdAtivos10;

    if (atendeReceita || atendeResultado || atendeAtivos) {
      const motivos: string[] = [];
      if (atendeReceita) motivos.push('Receita >= 10%');
      if (atendeResultado) motivos.push('Resultado >= 10%');
      if (atendeAtivos) motivos.push('Ativos >= 10%');

      reportaveis.push({
        segmentoId: seg.segmentoId,
        nomeSegmento: seg.nomeSegmento,
        receitaTotal: recTot,
        resultadoOperacional: seg.resultadoOperacional,
        ativosTotais: seg.ativosTotais,
        motivoElegibilidade: motivos.join(', ')
      });
    } else {
      outrosRec += recTot;
      outrosAtivos += seg.ativosTotais;
      outrosCount++;
    }
  }

  // Regra dos 75% da receita externa
  const receitaExternaReportaveis = segmentos
    .filter(s => reportaveis.some(r => r.segmentoId === s.segmentoId))
    .reduce((acc, s) => acc + s.receitaExterna, 0);

  const pct75 = Number(((receitaExternaReportaveis / (receitaExternaTotal || 1)) * 100).toFixed(2));
  const regraOk = pct75 >= 75.0;

  const diagnostico = 'CPC 22 / IFRS 8: Identificados ' + reportaveis.length + ' segmentos reportáveis representando ' + pct75.toFixed(2) + '% da receita externa total. ' + (regraOk ? 'Critério de suficiência de 75% atendido.' : 'Atenção: Regra dos 75% não atingida; adicione mais segmentos.');

  return Ok({
    periodoAno,
    segmentosReportaveis: reportaveis,
    segmentosNaoReportaveisAgregados: {
      quantidadeSegmentos: outrosCount,
      receitaTotalAgregada: outrosRec,
      ativosAgregados: outrosAtivos
    },
    totalConsolidado: {
      receitaExternaConsolidada: receitaExternaTotal,
      resultadoOperacionalConsolidado: resultadoConsolidado,
      ativosTotaisConsolidados: ativosCombinadosTotal
    },
    regra75PorcentoAtendida: regraOk,
    percentualReceitaExternaReportavel: pct75,
    diagnosticoCpc22: diagnostico
  });
}
