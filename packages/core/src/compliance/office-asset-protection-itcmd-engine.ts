import { Result, Ok, Err } from '../types/result.js';

export interface AssetProtectionInput {
  familiaNome: string;
  totalPatriarcasDoadores: number;
  totalHerdeirosDonatarios: number;
  possuiReservaUsufrutoVitalicio: boolean;
  possuiClausulaIncomunicabilidade: boolean;
  possuiClausulaImpenhorabilidade: boolean;
  possuiClausulaInalienabilidade: boolean;
  possuiClausulaReversao: boolean;
}

export interface AssetProtectionResult {
  familiaNome: string;
  scoreBlindagemPatrimonialPercent: number; // 0 a 100%
  clausulasAtivas: string[];
  nivelProtecaoPatrimonial: 'BLINDAGEM_MAXIMA_ESTRUTURADA' | 'PROTECAO_PARCIAL';
  statusProtecao: 'CONTRATO_SOCIAL_HOLDING_BLINDADO';
  diagnosticoProtecao: string;
}

export function processOfficeAssetProtectionItcmdEngine(input: AssetProtectionInput): Result<AssetProtectionResult, Error> {
  const {
    familiaNome,
    totalPatriarcasDoadores,
    totalHerdeirosDonatarios,
    possuiReservaUsufrutoVitalicio,
    possuiClausulaIncomunicabilidade,
    possuiClausulaImpenhorabilidade,
    possuiClausulaInalienabilidade,
    possuiClausulaReversao
  } = input;

  if (!familiaNome || totalPatriarcasDoadores <= 0 || totalHerdeirosDonatarios <= 0) {
    return Err(new Error('Nome da família e relação de doadores/herdeiros são obrigatórios.'));
  }

  const clausulas: string[] = [];
  let score = 0;

  if (possuiReservaUsufrutoVitalicio) {
    score += 20;
    clausulas.push('Reserva de Usufruto Vitalício e Político aos Patriarcas');
  }
  if (possuiClausulaIncomunicabilidade) {
    score += 20;
    clausulas.push('Incomunicabilidade (Proteção contra divórcio/cônjuges dos herdeiros)');
  }
  if (possuiClausulaImpenhorabilidade) {
    score += 20;
    clausulas.push('Impenhorabilidade (Blindagem contra credores dos herdeiros)');
  }
  if (possuiClausulaInalienabilidade) {
    score += 20;
    clausulas.push('Inalienabilidade (Herdeiros impedidos de vender sem anuência)');
  }
  if (possuiClausulaReversao) {
    score += 20;
    clausulas.push('Cláusula de Reversão (Bens retornam aos pais em caso de pré-morte do filho)');
  }

  const nivel = score === 100 ? 'BLINDAGEM_MAXIMA_ESTRUTURADA' : 'PROTECAO_PARCIAL';

  const diag = "Blindagem Patrimonial (" + familiaNome + "): " + clausulas.length + " cláusulas restritivas ativas (" + score + "% de score de proteção) -> Nível: " + nivel + " com preservação do poder de gestão e voto dos patriarcas.";

  return Ok({
    familiaNome,
    scoreBlindagemPatrimonialPercent: score,
    clausulasAtivas: clausulas,
    nivelProtecaoPatrimonial: nivel,
    statusProtecao: 'CONTRATO_SOCIAL_HOLDING_BLINDADO',
    diagnosticoProtecao: diag
  });
}
