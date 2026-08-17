import { Result, Ok, Err } from '../../types/result.js';

export type GasSupplyChainType = 'PRODUTOR_PROCESSADOR_GAS' | 'IMPORTADOR_GNL' | 'DISTRIBUIDORA_CANALIZADA' | 'CONSUMIDOR_LIVRE_TERMELETRICA';

export interface NaturalGasTaxInput {
  operacaoId: string;
  agenteCadeia: GasSupplyChainType;
  volumeMetrosCubicosM3: number;
  valorTotalOperacaoBrl: number;
  aliquotaIcmsDiferidoPercent?: number; // Ex: 12% ou 18%
}

export interface NaturalGasTaxResult {
  operacaoId: string;
  agenteCadeia: GasSupplyChainType;
  icmsDiferidoGasodutoBrl: number;
  pisNaoCumulativoDevidoBrl: number;
  cofinsNaoCumulativoDevidoBrl: number;
  totalPisCofinsDevidoBrl: number;
  creditoAproveitavelIndustriaBrl: number;
  diagnosticoFiscal: string;
}

export function processNaturalGasLngTaxEngine(input: NaturalGasTaxInput): Result<NaturalGasTaxResult, Error> {
  const {
    operacaoId,
    agenteCadeia,
    volumeMetrosCubicosM3,
    valorTotalOperacaoBrl,
    aliquotaIcmsDiferidoPercent = 12.0
  } = input;

  if (volumeMetrosCubicosM3 <= 0 || valorTotalOperacaoBrl <= 0) {
    return Err(new Error('Volume e valor da operação de gás natural devem ser superiores a zero.'));
  }

  // Lei nº 14.134/2021 (Nova Lei do Gás) & Convênio ICMS 134/2021:
  // Diferimento do ICMS nas operações de injeção e transporte na malha integrada de gasodutos
  const icmsDiferido = Number((valorTotalOperacaoBrl * (aliquotaIcmsDiferidoPercent / 100)).toFixed(2));

  // PIS (1,65%) e COFINS (7,60%) Não Cumulativo
  const pis = Number((valorTotalOperacaoBrl * 0.0165).toFixed(2));
  const cofins = Number((valorTotalOperacaoBrl * 0.0760).toFixed(2));
  const totalPisCofins = Number((pis + cofins).toFixed(2));

  // Crédito aproveitável na indústria/térmicas (9,25% sobre insumo essencial)
  const creditoIndustria = totalPisCofins;

  const diag = 'Nova Lei do Gás (Lei nº 14.134/2021 & Convênio ICMS 134/2021): ' + agenteCadeia + '. Volume: ' + volumeMetrosCubicosM3 + ' m³. ICMS Diferido na malha: R$ ' + icmsDiferido.toFixed(2) + '. PIS/COFINS Não Cumulativo (9,25%): R$ ' + totalPisCofins.toFixed(2) + ' gerando crédito integral para a indústria consumidora/térmica.';

  return Ok({
    operacaoId,
    agenteCadeia,
    icmsDiferidoGasodutoBrl: icmsDiferido,
    pisNaoCumulativoDevidoBrl: pis,
    cofinsNaoCumulativoDevidoBrl: cofins,
    totalPisCofinsDevidoBrl: totalPisCofins,
    creditoAproveitavelIndustriaBrl: creditoIndustria,
    diagnosticoFiscal: diag
  });
}
