import { Result, Ok, Err } from '../../types/result.js';

export interface ReidiProjectInput {
  projetoHabilitadoId: string;
  setorInfraestrutura: 'ENERGIA' | 'SANEAMENTO' | 'TRANSPORTES' | 'TELECOMUNICACOES' | 'PORTOS';
  numeroPortariaMinisterialHabilitacao: string;
  valorTotalAquisicoesBensCapitalServicos: number;
}

export interface ReidiProjectResult {
  projetoHabilitadoId: string;
  setor: string;
  portariaHabilitacao: string;
  valorTotalAquisicoes: number;
  suspensaoTributariaApurada: {
    pisSuspenso1_65Percent: number;
    cofinsSuspensa7_60Percent: number;
    totalPisCofinsSuspenso9_25Percent: number;
  };
  desembolsoFinanceiroLiquido: number;
  diagnosticoReidi: string;
}

export function calculateReidiTaxSuspension(input: ReidiProjectInput): Result<ReidiProjectResult, Error> {
  const { projetoHabilitadoId, setorInfraestrutura, numeroPortariaMinisterialHabilitacao, valorTotalAquisicoesBensCapitalServicos } = input;

  if (valorTotalAquisicoesBensCapitalServicos <= 0) {
    return Err(new Error('Valor das aquisições deve ser superior a zero.'));
  }

  const pisSuspenso = Number((valorTotalAquisicoesBensCapitalServicos * 0.0165).toFixed(2));
  const cofinsSuspensa = Number((valorTotalAquisicoesBensCapitalServicos * 0.0760).toFixed(2));
  const totalSuspenso = Number((pisSuspenso + cofinsSuspensa).toFixed(2));
  const desembolsoLiquido = Number((valorTotalAquisicoesBensCapitalServicos - totalSuspenso).toFixed(2));

  const diagnostico = 'Projeto habilitado no REIDI (Lei nº 11.488/2007) via Portaria ' + numeroPortariaMinisterialHabilitacao + '. A suspensão de 9,25% de PIS/COFINS desonera R$ ' + totalSuspenso.toFixed(2) + ' do CAPEX da obra.';

  return Ok({
    projetoHabilitadoId,
    setor: setorInfraestrutura,
    portariaHabilitacao: numeroPortariaMinisterialHabilitacao,
    valorTotalAquisicoes: valorTotalAquisicoesBensCapitalServicos,
    suspensaoTributariaApurada: {
      pisSuspenso1_65Percent: pisSuspenso,
      cofinsSuspensa7_60Percent: cofinsSuspensa,
      totalPisCofinsSuspenso9_25Percent: totalSuspenso
    },
    desembolsoFinanceiroLiquido: desembolsoLiquido,
    diagnosticoReidi: diagnostico
  });
}
