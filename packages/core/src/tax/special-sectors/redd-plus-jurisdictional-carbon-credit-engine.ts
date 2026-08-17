import { Result, Ok, Err } from '../../types/result.js';

export interface ReddPlusInput {
  geradorCreditoCnpj: string;
  estadoJurisdicaoOrigem: 'AMAZONAS' | 'PARA' | 'MATO_GROSSO' | 'RONDONIA' | 'ACRE';
  volumeCreditosReddTon: number; // Ex: 50.000 créditos REDD+ (tCO2e)
  precoVendaPorCreditoUsd: number; // Ex: 10.00 USD
  taxaCambioLiquidacaoBrl: number; // Ex: 5.50
  aliquotaGanhoCapitalIrpjPercent: number; // 15.0%
}

export interface ReddPlusResult {
  geradorCreditoCnpj: string;
  receitaBrutaVendaReddUsd: number; // 500.000 USD
  receitaBrutaVendaReddBrl: number; // R$ 2.750.000,00
  impostoPisCofinsDevidoBrl: number; // R$ 0,00 (Isenção Lei do Carbono)
  impostoGanhoCapitalIrpjBrl: number; // 15% de R$ 2.750.000 = R$ 412.500,00
  receitaLiquidaAposTributosBrl: number; // R$ 2.337.500,00
  statusRedd: 'CREDITO_REDD_JURISDICIONAL_TRIBUTADO_CONFORME_LEI';
  diagnosticoRedd: string;
}

export function processReddPlusJurisdictionalCarbonCreditEngine(input: ReddPlusInput): Result<ReddPlusResult, Error> {
  const {
    geradorCreditoCnpj,
    estadoJurisdicaoOrigem,
    volumeCreditosReddTon,
    precoVendaPorCreditoUsd,
    taxaCambioLiquidacaoBrl,
    aliquotaGanhoCapitalIrpjPercent = 15.0
  } = input;

  if (!geradorCreditoCnpj || volumeCreditosReddTon <= 0 || taxaCambioLiquidacaoBrl <= 0) {
    return Err(new Error('CNPJ, volume de créditos REDD+ e taxa de câmbio são obrigatórios.'));
  }

  const receitaUsd = volumeCreditosReddTon * precoVendaPorCreditoUsd;
  const receitaBrl = receitaUsd * taxaCambioLiquidacaoBrl;
  const pisCofinsBrl = 0; // Isenção conforme Artigo específico do Marco Legal do Carbono
  const irpjBrl = (receitaBrl * aliquotaGanhoCapitalIrpjPercent) / 100;
  const liquidaBrl = receitaBrl - irpjBrl;

  const diag = "Creditos REDD+ Jurisdicional (" + estadoJurisdicaoOrigem + "): Volume: " + volumeCreditosReddTon.toLocaleString('pt-BR') + " tCO2e | Receita: R$ " + receitaBrl.toLocaleString('pt-BR') + " | PIS/COFINS: Isento (R$ 0,00) | IRPJ (15%): R$ " + irpjBrl.toLocaleString('pt-BR') + " -> Liquido: R$ " + liquidaBrl.toLocaleString('pt-BR');

  return Ok({
    geradorCreditoCnpj,
    receitaBrutaVendaReddUsd: receitaUsd,
    receitaBrutaVendaReddBrl: receitaBrl,
    impostoPisCofinsDevidoBrl: pisCofinsBrl,
    impostoGanhoCapitalIrpjBrl: irpjBrl,
    receitaLiquidaAposTributosBrl: liquidaBrl,
    statusRedd: 'CREDITO_REDD_JURISDICIONAL_TRIBUTADO_CONFORME_LEI',
    diagnosticoRedd: diag
  });
}
