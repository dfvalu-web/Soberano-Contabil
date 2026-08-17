import { Result, Ok, Err } from '../../types/result.js';

export interface CbioSaleInput {
  operacaoId: string;
  emissorPrimarioNome: string; // Usina de Etanol / Biodiesel
  quantidadeCbiosVendidos: number; // 1 CBIO = 1 tCO2e evitada
  precoVendaPorCbioBrl: number;
}

export interface CbioSaleResult {
  operacaoId: string;
  emissorPrimarioNome: string;
  quantidadeCbiosVendidos: number;
  receitaBrutaAlienacaoCbioBrl: number;
  aliquotaIrrfDefinitivoPercent: number; // 15% Exclusivo na Fonte
  valorIrrfRetidoFonteBrl: number; // Retenção Definitiva
  aliquotaPisPercent: number; // 0%
  aliquotaCofinsPercent: number; // 0%
  isExclusaoLalurLacsObrigatoria: boolean; // Sim (Tributação Definitiva)
  valorLiquidoRecebidoBrl: number;
  diagnosticoFiscal: string;
}

export function processCbioRenovabioTaxEngine(input: CbioSaleInput): Result<CbioSaleResult, Error> {
  const {
    operacaoId,
    emissorPrimarioNome,
    quantidadeCbiosVendidos,
    precoVendaPorCbioBrl
  } = input;

  if (quantidadeCbiosVendidos <= 0 || precoVendaPorCbioBrl <= 0) {
    return Err(new Error('Quantidade de CBIOs e preço de venda devem ser superiores a zero.'));
  }

  // Lei nº 13.576/2017 Art. 15-A (incluído pela Lei nº 13.986/2020):
  // 1. Receita Bruta da Alienação de CBIOs pelo emissor primário
  const receitaBruta = Number((quantidadeCbiosVendidos * precoVendaPorCbioBrl).toFixed(2));

  // 2. IRRF Exclusivo e Definitivo de 15% na Fonte
  const irrf = Number((receitaBruta * 0.15).toFixed(2));

  // 3. PIS e COFINS com alíquota 0%
  const valorLiquido = Number((receitaBruta - irrf).toFixed(2));

  const diag = 'RenovaBio - CBIOs (Lei nº 13.576/17 Art. 15-A): ' + emissorPrimarioNome + '. Alienação de ' + quantidadeCbiosVendidos.toLocaleString('pt-BR') + ' CBIOs a R$ ' + precoVendaPorCbioBrl.toFixed(2) + ' = Receita R$ ' + receitaBruta.toFixed(2) + '. IRRF Definitivo na Fonte (15%): R$ ' + irrf.toFixed(2) + ' (PIS/COFINS 0%). Receita EXCLUÍDA do Lalur/Lacs de IRPJ e CSLL.';

  return Ok({
    operacaoId,
    emissorPrimarioNome,
    quantidadeCbiosVendidos,
    receitaBrutaAlienacaoCbioBrl: receitaBruta,
    aliquotaIrrfDefinitivoPercent: 15.0,
    valorIrrfRetidoFonteBrl: irrf,
    aliquotaPisPercent: 0,
    aliquotaCofinsPercent: 0,
    isExclusaoLalurLacsObrigatoria: true,
    valorLiquidoRecebidoBrl: valorLiquido,
    diagnosticoFiscal: diag
  });
}
