import { Result, Ok, Err } from '../../types/result.js';

export interface CceeEnergyMarketInput {
  agenteCceeId: string;
  agenteNome: string; // Ex: 'Soberano Comercializadora & Geradora de Energia S.A.'
  submercado: 'SUDESTE_CENTRO_OESTE' | 'SUL' | 'NORDESTE' | 'NORTE';
  sobraEnergiaLiquidadaMwh: number; // Ex: 5.000 MWh
  precoPldMedioBrlPorMwh: number; // Preço de Liquidação das Diferenças (Ex: R$ 150/MWh)
  aliquotaPisPadraoPercent?: number; // 1,65%
  aliquotaCofinsPadraoPercent?: number; // 7,60%
  aliquotaIcmsPadraoPercent?: number; // 18% (Isenção/Diferimento conforme Convênio ICMS 15/07)
  isIsencaoIcmsConvenio1507Aplicavel?: boolean;
}

export interface CceeEnergyMarketResult {
  agenteCceeId: string;
  agenteNome: string;
  submercado: string;
  valorBrutoLiquidacaoMcpBrl: number;
  valorPisDevidoBrl: number;
  valorCofinsDevidoBrl: number;
  valorIcmsDevidoBrl: number;
  valorLiquidoReceberCceeBrl: number;
  diagnosticoFiscal: string;
}

export function processCceeFreeEnergyMarketTaxEngine(input: CceeEnergyMarketInput): Result<CceeEnergyMarketResult, Error> {
  const {
    agenteCceeId,
    agenteNome,
    submercado,
    sobraEnergiaLiquidadaMwh,
    precoPldMedioBrlPorMwh,
    aliquotaPisPadraoPercent = 1.65,
    aliquotaCofinsPadraoPercent = 7.60,
    aliquotaIcmsPadraoPercent = 18.0,
    isIsencaoIcmsConvenio1507Aplicavel = true
  } = input;

  if (sobraEnergiaLiquidadaMwh <= 0 || precoPldMedioBrlPorMwh <= 0) {
    return Err(new Error('Volume de energia e PLD devem ser superiores a zero.'));
  }

  // 1. Valor Bruto da Liquidação no MCP da CCEE = Volume (MWh) * PLD
  const valorBruto = Number((sobraEnergiaLiquidadaMwh * precoPldMedioBrlPorMwh).toFixed(2));

  // 2. Tributação Federal: PIS e COFINS incidentes sobre a receita de liquidação no MCP
  const pis = Number((valorBruto * (aliquotaPisPadraoPercent / 100)).toFixed(2));
  const cofins = Number((valorBruto * (aliquotaCofinsPadraoPercent / 100)).toFixed(2));

  // 3. Tributação Estadual: ICMS no MCP da CCEE
  // Sob as regras do Convênio ICMS nº 15/2007 e Convênio ICMS nº 77/2011,
  // a liquidação no MCP pode ter diferimento ou isenção na câmara de compensação.
  let icms = 0;
  if (!isIsencaoIcmsConvenio1507Aplicavel) {
    icms = Number((valorBruto * (aliquotaIcmsPadraoPercent / 100)).toFixed(2));
  }

  const valorLiquido = Number((valorBruto - (pis + cofins + icms)).toFixed(2));

  const diag = 'CCEE Mercado Livre de Energia (' + submercado + '): ' + agenteNome + '. Liquidação MCP: ' + sobraEnergiaLiquidadaMwh.toLocaleString('pt-BR') + ' MWh a R$ ' + precoPldMedioBrlPorMwh.toFixed(2) + '/MWh = R$ ' + valorBruto.toFixed(2) + '. PIS (1,65%): R$ ' + pis.toFixed(2) + ' + COFINS (7,60%): R$ ' + cofins.toFixed(2) + '. ICMS: ' + (isIsencaoIcmsConvenio1507Aplicavel ? 'ISENTO/DIFERIDO (Convênio ICMS 15/07)' : 'R$ ' + icms.toFixed(2)) + ' -> Valor Líquido CCEE: R$ ' + valorLiquido.toFixed(2) + '.';

  return Ok({
    agenteCceeId,
    agenteNome,
    submercado,
    valorBrutoLiquidacaoMcpBrl: valorBruto,
    valorPisDevidoBrl: pis,
    valorCofinsDevidoBrl: cofins,
    valorIcmsDevidoBrl: icms,
    valorLiquidoReceberCceeBrl: valorLiquido,
    diagnosticoFiscal: diag
  });
}
