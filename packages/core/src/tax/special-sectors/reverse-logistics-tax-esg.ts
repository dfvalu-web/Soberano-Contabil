import { Result, Ok, Err } from '../../types/result.js';

export interface ReverseLogisticsInput {
  loteId: string;
  tipoMaterial: 'SUCATA_METALICA' | 'EMBALAGENS_PLASTICAS_RECICLADAS' | 'BATERIAS_ELETRONICOS';
  pesoToneladas: number;
  valorTotalMaterialRetornadoBrl: number;
  estadoOrigemUf: string;
  estadoDestinoUf: string;
  aliquotaIcmsInternaOuInterestadualPercent: number;
}

export interface ReverseLogisticsResult {
  loteId: string;
  tipoMaterial: string;
  icmsIsencaoDiferimentoBrl: number;
  creditoPisCofinsReciclagem9_25Percent: number;
  totalBeneficioEconomicoFiscalBrl: number;
  diagnosticoPnrsEsg: string;
}

export function calculateReverseLogisticsTaxBenefits(input: ReverseLogisticsInput): Result<ReverseLogisticsResult, Error> {
  const { loteId, tipoMaterial, valorTotalMaterialRetornadoBrl, aliquotaIcmsInternaOuInterestadualPercent } = input;

  if (valorTotalMaterialRetornadoBrl <= 0) {
    return Err(new Error('Valor do material de logística reversa deve ser superior a zero.'));
  }

  // 1. Isenção/Diferimento de ICMS na circulação de sucatas/embalagens (Convênio ICMS 99/2018)
  const icmsBeneficio = Number((valorTotalMaterialRetornadoBrl * (aliquotaIcmsInternaOuInterestadualPercent / 100)).toFixed(2));

  // 2. Crédito de PIS/COFINS em reciclagem industrial (Lei nº 11.196/2005 - Art. 47)
  const pisCofinsCredito = Number((valorTotalMaterialRetornadoBrl * 0.0925).toFixed(2));

  const totalBeneficio = Number((icmsBeneficio + pisCofinsCredito).toFixed(2));

  const diagnostico = 'Política Nacional de Resíduos Sólidos (Lei nº 12.305/2010): Lote ' + loteId + ' (' + tipoMaterial + '). Desoneração de ICMS (Conv. 99/18) de R$ ' + icmsBeneficio.toFixed(2) + ' e crédito industrial de PIS/COFINS de R$ ' + pisCofinsCredito.toFixed(2) + '.';

  return Ok({
    loteId,
    tipoMaterial,
    icmsIsencaoDiferimentoBrl: icmsBeneficio,
    creditoPisCofinsReciclagem9_25Percent: pisCofinsCredito,
    totalBeneficioEconomicoFiscalBrl: totalBeneficio,
    diagnosticoPnrsEsg: diagnostico
  });
}
