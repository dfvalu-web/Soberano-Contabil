import { Result, Ok, Err } from '../../types/result.js';

export interface OperatingSegmentItem {
  segmentoNome: string; // Ex: 'Varejo Digital', 'Atacado Físico', 'Serviços Financeiros', 'Logística'
  receitaExternaBrl: number;
  receitaIntersegmentosBrl: number;
  resultadoOperacionalLucroOuPrejuizoBrl: number;
  ativosTotaisSegmentoBrl: number;
}

export interface SegmentReportingInput {
  empresaHoldingNome: string;
  segmentos: OperatingSegmentItem[];
}

export interface SegmentReportingResult {
  empresaHoldingNome: string;
  totalReceitaCombinadaBrl: number;
  totalReceitaExternaConsolidadaBrl: number;
  totalAtivosConsolidadosBrl: number;
  segmentosReportaveis: {
    segmentoNome: string;
    atingiuThreshold10Percent: boolean;
    criteriosAtingidos: string[];
    percentualReceitaExterna: number;
  }[];
  outrosSegmentosNaoReportaveis: string[];
  coberturaReceitaExternaReportavelPercent: number;
  atingiuRegraSuficiencia75Percent: boolean;
  diagnosticoCpc22: string;
}

export function processOperatingSegmentsAggregationCpc22(input: SegmentReportingInput): Result<SegmentReportingResult, Error> {
  const {
    empresaHoldingNome,
    segmentos
  } = input;

  if (!segmentos || segmentos.length === 0) {
    return Err(new Error('A lista de segmentos operacionais não pode ser vazia.'));
  }

  let totalReceitaExterna = 0;
  let totalReceitaIntersegmentos = 0;
  let totalAtivos = 0;
  let totalLucrosPositivos = 0;
  let totalPrejuizosNegativos = 0;

  for (const s of segmentos) {
    totalReceitaExterna += s.receitaExternaBrl;
    totalReceitaIntersegmentos += s.receitaIntersegmentosBrl;
    totalAtivos += s.ativosTotaisSegmentoBrl;
    if (s.resultadoOperacionalLucroOuPrejuizoBrl >= 0) {
      totalLucrosPositivos += s.resultadoOperacionalLucroOuPrejuizoBrl;
    } else {
      totalPrejuizosNegativos += Math.abs(s.resultadoOperacionalLucroOuPrejuizoBrl);
    }
  }

  const totalReceitaCombinada = totalReceitaExterna + totalReceitaIntersegmentos;
  const baseResultado = Math.max(totalLucrosPositivos, totalPrejuizosNegativos);

  const reportaveis: SegmentReportingResult['segmentosReportaveis'] = [];
  const naoReportaveis: string[] = [];
  let receitaExternaReportaveis = 0;

  for (const s of segmentos) {
    const recCombinada = s.receitaExternaBrl + s.receitaIntersegmentosBrl;
    const critReceita = (recCombinada / totalReceitaCombinada) >= 0.10;
    const critResultado = (Math.abs(s.resultadoOperacionalLucroOuPrejuizoBrl) / baseResultado) >= 0.10;
    const critAtivos = (s.ativosTotaisSegmentoBrl / totalAtivos) >= 0.10;

    const criterios: string[] = [];
    if (critReceita) criterios.push('Receita Combinada >= 10%');
    if (critResultado) criterios.push('Resultado Operacional >= 10%');
    if (critAtivos) criterios.push('Ativos Totais >= 10%');

    const isReportavel = critReceita || critResultado || critAtivos;
    const pctExt = Number(((s.receitaExternaBrl / totalReceitaExterna) * 100).toFixed(2));

    if (isReportavel) {
      reportaveis.push({
        segmentoNome: s.segmentoNome,
        atingiuThreshold10Percent: true,
        criteriosAtingidos: criterios,
        percentualReceitaExterna: pctExt
      });
      receitaExternaReportaveis += s.receitaExternaBrl;
    } else {
      naoReportaveis.push(s.segmentoNome);
    }
  }

  const cobertura = Number(((receitaExternaReportaveis / totalReceitaExterna) * 100).toFixed(2));
  const regra75Atingida = cobertura >= 75.0;

  const diag = "Segmentos Operacionais (CPC 22 / IFRS 8): " + empresaHoldingNome + " | Total Segmentos: " + segmentos.length + " -> Reportaveis: " + reportaveis.length + " (" + reportaveis.map(r => r.segmentoNome).join(', ') + ") | Cobertura de Receita Externa: " + cobertura + "% -> Regra dos 75% " + (regra75Atingida ? 'ATENDIDA COM SUCESSO' : 'INSUFICIENTE') + ".";

  return Ok({
    empresaHoldingNome,
    totalReceitaCombinadaBrl: totalReceitaCombinada,
    totalReceitaExternaConsolidadaBrl: totalReceitaExterna,
    totalAtivosConsolidadosBrl: totalAtivos,
    segmentosReportaveis: reportaveis,
    outrosSegmentosNaoReportaveis: naoReportaveis,
    coberturaReceitaExternaReportavelPercent: cobertura,
    atingiuRegraSuficiencia75Percent: regra75Atingida,
    diagnosticoCpc22: diag
  });
}
