import { Result, Ok, Err } from '../../types/result.js';

export interface HotelPoolRevenueInput {
  operadoraHoteleiraCnpj: string;
  mesCompetencia: string; // Ex: '2026-08'
  receitaBrutaDiariasPoolBrl: number; // Ex: R$ 800.000,00
  taxaAdministracaoHoteleiraPercent: number; // Ex: 15.0%
  despesasOperacionaisCondominiaisBrl: number; // Ex: R$ 250.000,00
  aliquotaIssqnPercent: number; // Ex: 5.0% sobre serviço de hotelaria
}

export interface HotelPoolRevenueResult {
  operadoraHoteleiraCnpj: string;
  mesCompetencia: string;
  receitaBrutaDiariasPoolBrl: number;
  taxaAdministracaoRetidaBrl: number; // 15% de R$ 800k = R$ 120.000,00
  impostoIssqnDevidoBrl: number; // 5% de R$ 120k = R$ 6.000,00
  rendimentoLiquidoDistribuivelPoolBrl: number; // R$ 800k - R$ 120k - R$ 250k = R$ 430.000,00
  statusReconhecimentoCpc47: 'RECEITAS_RECONHECIDAS_AO_LONGO_DO_TEMPO_OVER_TIME';
  diagnosticoPool: string;
}

export function processHotelPoolRevenueRecognitionCpc47Engine(input: HotelPoolRevenueInput): Result<HotelPoolRevenueResult, Error> {
  const {
    operadoraHoteleiraCnpj,
    mesCompetencia,
    receitaBrutaDiariasPoolBrl,
    taxaAdministracaoHoteleiraPercent = 15.0,
    despesasOperacionaisCondominiaisBrl,
    aliquotaIssqnPercent = 5.0
  } = input;

  if (!operadoraHoteleiraCnpj || receitaBrutaDiariasPoolBrl <= 0) {
    return Err(new Error('CNPJ da operadora e receita de diárias são obrigatórios.'));
  }

  const taxaAdm = (receitaBrutaDiariasPoolBrl * taxaAdministracaoHoteleiraPercent) / 100;
  const issqn = (taxaAdm * aliquotaIssqnPercent) / 100;
  const distribuivel = Math.max(0, receitaBrutaDiariasPoolBrl - taxaAdm - despesasOperacionaisCondominiaisBrl);

  const diag = "Pool Hoteleiro (CPC 47 / IFRS 15): Receita Diarias: R$ " + receitaBrutaDiariasPoolBrl.toLocaleString('pt-BR') + " (" + mesCompetencia + ") | Taxa Adm (15%): R$ " + taxaAdm.toLocaleString('pt-BR') + " (ISSQN: R$ " + issqn.toLocaleString('pt-BR') + ") | Despesas: R$ " + despesasOperacionaisCondominiaisBrl.toLocaleString('pt-BR') + " -> Rendimento Liquido aos Coproprietarios: R$ " + distribuivel.toLocaleString('pt-BR');

  return Ok({
    operadoraHoteleiraCnpj,
    mesCompetencia,
    receitaBrutaDiariasPoolBrl,
    taxaAdministracaoRetidaBrl: parseFloat(taxaAdm.toFixed(2)),
    impostoIssqnDevidoBrl: parseFloat(issqn.toFixed(2)),
    rendimentoLiquidoDistribuivelPoolBrl: parseFloat(distribuivel.toFixed(2)),
    statusReconhecimentoCpc47: 'RECEITAS_RECONHECIDAS_AO_LONGO_DO_TEMPO_OVER_TIME',
    diagnosticoPool: diag
  });
}
