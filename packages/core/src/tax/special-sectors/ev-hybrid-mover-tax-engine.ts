import { Result, Ok, Err } from '../../types/result.js';

export type VehiclePropulsionType = 'ELETRICO_PURO_BEV' | 'HIBRIDO_PLUG_IN_PHEV' | 'HIBRIDO_FLEX_HEV' | 'COMBUSTAO_FOSSIL';

export interface EvHybridMoverInput {
  veiculoId: string;
  modeloNome: string;
  tipoPropulsao: VehiclePropulsionType;
  eficienciaEnergeticaMjKm: number; // Ex: 1.10 MJ/km para elétricos vs 1.85 para combustão
  valorNotaFiscalFabricaBrl: number;
  dispendioInvestimentoPesquisaMoverBrl?: number; // Investimento em P&D para crédito financeiro
}

export interface EvHybridMoverResult {
  veiculoId: string;
  modeloNome: string;
  tipoPropulsao: VehiclePropulsionType;
  aliquotaIpiVerdeEfetivaPercent: number;
  valorIpiVerdeDevidoBrl: number;
  creditoFinanceiroMoverApropriadoBrl: number;
  diagnosticoFiscal: string;
}

export function processEvHybridMoverTaxEngine(input: EvHybridMoverInput): Result<EvHybridMoverResult, Error> {
  const {
    veiculoId,
    modeloNome,
    tipoPropulsao,
    eficienciaEnergeticaMjKm,
    valorNotaFiscalFabricaBrl,
    dispendioInvestimentoPesquisaMoverBrl = 0
  } = input;

  if (valorNotaFiscalFabricaBrl <= 0 || eficienciaEnergeticaMjKm <= 0) {
    return Err(new Error('Valor da NF de fábrica e eficiência energética devem ser superiores a zero.'));
  }

  // Tabela de IPI Verde - Programa MOVER (Lei nº 14.902/2024 & Decreto nº 12.053/2024):
  // 1. BEV (Elétrico Puro): Alíquota incentivada de 2,0%
  // 2. PHEV / HEV Flex (Híbrido Flex): Alíquota de 4,0% a 7,0%
  // 3. Combustão Fóssil: Alíquota de 11,0% a 15,0%
  let aliqIpi = 11.0;

  if (tipoPropulsao === 'ELETRICO_PURO_BEV') {
    aliqIpi = 2.0;
  } else if (tipoPropulsao === 'HIBRIDO_PLUG_IN_PHEV') {
    aliqIpi = 4.0;
  } else if (tipoPropulsao === 'HIBRIDO_FLEX_HEV') {
    aliqIpi = 5.5;
  }

  // Bonificação por Alta Eficiência Energética (< 1.20 MJ/km reduz 1.0 ponto percentual de IPI)
  if (eficienciaEnergeticaMjKm <= 1.20 && aliqIpi > 2.0) {
    aliqIpi = Number((aliqIpi - 1.0).toFixed(1));
  }

  const valorIpi = Number((valorNotaFiscalFabricaBrl * (aliqIpi / 100)).toFixed(2));

  // Crédito Financeiro do Programa MOVER (Art. 6º da Lei 14.902/24):
  // 50% de crédito fiscal compensável com tributos federais sobre dispêndios em P&D de mobilidade verde
  const creditoFinanceiroMover = Number((dispendioInvestimentoPesquisaMoverBrl * 0.50).toFixed(2));

  const diag = 'Programa MOVER & IPI Verde (Lei nº 14.902/2024): Modelo ' + modeloNome + ' (' + tipoPropulsao + ' - Eficiência ' + eficienciaEnergeticaMjKm + ' MJ/km). Alíquota de IPI Verde fixada em ' + aliqIpi + '% (R$ ' + valorIpi.toFixed(2) + '). ' + (creditoFinanceiroMover > 0 ? 'Crédito Financeiro MOVER apurado: R$ ' + creditoFinanceiroMover.toFixed(2) + ' compensável com IRPJ/CSLL/PIS/COFINS.' : 'Sem crédito financeiro.');

  return Ok({
    veiculoId,
    modeloNome,
    tipoPropulsao,
    aliquotaIpiVerdeEfetivaPercent: aliqIpi,
    valorIpiVerdeDevidoBrl: valorIpi,
    creditoFinanceiroMoverApropriadoBrl: creditoFinanceiroMover,
    diagnosticoFiscal: diag
  });
}
