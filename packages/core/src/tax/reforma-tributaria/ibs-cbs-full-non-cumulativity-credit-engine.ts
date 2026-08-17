import { Result, Ok, Err } from '../../types/result.js';

export interface IbsCbsCreditInput {
  operacaoId: string;
  adquirenteNome: string;
  valorAquisicaoBensCapitalImobilizadoBrl: number;
  valorAquisicaoInsumosServicosUsoConsumoBrl: number;
  aliquotaIbsPercent?: number; // Alíquota de referência padrão 17,7%
  aliquotaCbsPercent?: number; // Alíquota de referência padrão 8,8%
}

export interface IbsCbsCreditResult {
  operacaoId: string;
  adquirenteNome: string;
  creditoImediatoIbsImobilizadoBrl: number; // 100% imediato (sem 1/48 do CIAP)
  creditoImediatoCbsImobilizadoBrl: number; // 100% imediato
  creditoIbsUsoConsumoInsumosBrl: number; // Crédito amplo
  creditoCbsUsoConsumoInsumosBrl: number; // Crédito amplo
  totalCreditoIbsCbsRecuperavelBrl: number;
  vantagemFluxoCaixaVsCiapAntigoBrl: number; // Aceleração de liquidez
  diagnosticoReformaTributaria: string;
}

export function evaluateIbsCbsFullNonCumulativityCredit(input: IbsCbsCreditInput): Result<IbsCbsCreditResult, Error> {
  const {
    operacaoId,
    adquirenteNome,
    valorAquisicaoBensCapitalImobilizadoBrl,
    valorAquisicaoInsumosServicosUsoConsumoBrl,
    aliquotaIbsPercent = 17.7,
    aliquotaCbsPercent = 8.8
  } = input;

  if (valorAquisicaoBensCapitalImobilizadoBrl < 0 || valorAquisicaoInsumosServicosUsoConsumoBrl < 0) {
    return Err(new Error('Valores de aquisição não podem ser negativos.'));
  }

  // Emenda Constitucional nº 132/2023 & PLP 68/2024:
  // 1. Não cumulatividade plena e ampla (Crédito Financeiro Integral Imediato).
  // 2. Extinção da apropriação em 48 parcelas mensais do CIAP (ICMS).
  const credIbsImobilizado = Number((valorAquisicaoBensCapitalImobilizadoBrl * (aliquotaIbsPercent / 100)).toFixed(2));
  const credCbsImobilizado = Number((valorAquisicaoBensCapitalImobilizadoBrl * (aliquotaCbsPercent / 100)).toFixed(2));

  const credIbsUsoConsumo = Number((valorAquisicaoInsumosServicosUsoConsumoBrl * (aliquotaIbsPercent / 100)).toFixed(2));
  const credCbsUsoConsumo = Number((valorAquisicaoInsumosServicosUsoConsumoBrl * (aliquotaCbsPercent / 100)).toFixed(2));

  const totalCreditos = Number((credIbsImobilizado + credCbsImobilizado + credIbsUsoConsumo + credCbsUsoConsumo).toFixed(2));

  // Vantagem de Fluxo de Caixa no 1º mês vs CIAP antigo (que recebia apenas 1/48 avos)
  const ciapAntigoPrimeiroMes = (credIbsImobilizado / 48);
  const aceleracaoLiquidez = Number((credIbsImobilizado - ciapAntigoPrimeiroMes).toFixed(2));

  const diag = "Reforma Tributaria (EC 132/23 & PLP 68/24): " + adquirenteNome + ". Aquisicao Imobilizado: R$ " + valorAquisicaoBensCapitalImobilizadoBrl.toFixed(2) + " -> Credito Imediato IBS (" + aliquotaIbsPercent + "%): R$ " + credIbsImobilizado.toFixed(2) + " + CBS (" + aliquotaCbsPercent + "%): R$ " + credCbsImobilizado.toFixed(2) + " (SEM FRACIONAMENTO EM 48 MESES). Uso/Consumo: Credito IBS R$ " + credIbsUsoConsumo.toFixed(2) + " + CBS R$ " + credCbsUsoConsumo.toFixed(2) + ". Total Creditos Recuperados: R$ " + totalCreditos.toFixed(2) + " (Ganho de Liquidez Imediato vs CIAP: R$ " + aceleracaoLiquidez.toFixed(2) + ").";

  return Ok({
    operacaoId,
    adquirenteNome,
    creditoImediatoIbsImobilizadoBrl: credIbsImobilizado,
    creditoImediatoCbsImobilizadoBrl: credCbsImobilizado,
    creditoIbsUsoConsumoInsumosBrl: credIbsUsoConsumo,
    creditoCbsUsoConsumoInsumosBrl: credCbsUsoConsumo,
    totalCreditoIbsCbsRecuperavelBrl: totalCreditos,
    vantagemFluxoCaixaVsCiapAntigoBrl: aceleracaoLiquidez,
    diagnosticoReformaTributaria: diag
  });
}
