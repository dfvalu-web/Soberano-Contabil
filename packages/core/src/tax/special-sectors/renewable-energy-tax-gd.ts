import { Result, Ok, Err } from '../../types/result.js';

export interface RenewableEnergyInput {
  unidadeConsumidoraId: string;
  modalidadeGd: 'AUTOCONSUMO_LOCAL' | 'AUTOCONSUMO_REMOTO' | 'GERACAO_COMPARTILHADA';
  energiaInjetadaKwhMes: number;
  tarifaEnergiaTeReaisPorKwh: number; // Parcela TE
  tarifaUsoSistemaTusdReaisPorKwh: number; // Parcela TUSD
  aliquotaIcmsEstadoPercent: number; // e.g. 18%
  capexUsinaSolarEquipamentosBrl: number;
}

export interface RenewableEnergyResult {
  unidadeId: string;
  modalidadeGd: string;
  economiaMensalIsencaoIcmsBrl: number;
  creditoPisCofinsCapexUsina9_25Percent: number;
  economiaAnualEstimadaBrl: number;
  diagnosticoEnergiaGd: string;
}

export function calculateRenewableEnergyTaxBenefits(input: RenewableEnergyInput): Result<RenewableEnergyResult, Error> {
  const {
    unidadeConsumidoraId,
    modalidadeGd,
    energiaInjetadaKwhMes,
    tarifaEnergiaTeReaisPorKwh,
    aliquotaIcmsEstadoPercent,
    capexUsinaSolarEquipamentosBrl
  } = input;

  if (energiaInjetadaKwhMes <= 0 || tarifaEnergiaTeReaisPorKwh <= 0) {
    return Err(new Error('Energia injetada e tarifa de energia TE devem ser superiores a zero.'));
  }

  // 1. Isenção de ICMS sobre a parcela TE (Convênio ICMS 16/2015)
  const valorTeMes = energiaInjetadaKwhMes * tarifaEnergiaTeReaisPorKwh;
  const isencaoIcmsMes = Number((valorTeMes * (aliquotaIcmsEstadoPercent / 100)).toFixed(2));

  // 2. Crédito de PIS/COFINS sobre o CAPEX fotovoltaico (9,25% não cumulativo)
  const creditoPisCofinsCapex = Number((capexUsinaSolarEquipamentosBrl * 0.0925).toFixed(2));

  const economiaAnualIcms = Number((isencaoIcmsMes * 12).toFixed(2));

  const diagnostico = 'Marco Legal da GD (Lei nº 14.300/2022): Unidade ' + unidadeConsumidoraId + ' na modalidade ' + modalidadeGd + '. Isenção anual de ICMS (Conv. 16/15) estimada em R$ ' + economiaAnualIcms.toFixed(2) + ' e crédito direto de PIS/COFINS sobre CAPEX de R$ ' + creditoPisCofinsCapex.toFixed(2) + '.';

  return Ok({
    unidadeId: unidadeConsumidoraId,
    modalidadeGd,
    economiaMensalIsencaoIcmsBrl: isencaoIcmsMes,
    creditoPisCofinsCapexUsina9_25Percent: creditoPisCofinsCapex,
    economiaAnualEstimadaBrl: economiaAnualIcms,
    diagnosticoEnergiaGd: diagnostico
  });
}
