import { Result, Ok, Err } from '../../types/result.js';

export interface OffshoreEntityInput {
  entidadeOffshoreId: string;
  nomeEntidade: string; // Ex: 'Alpha Global Investments LLC'
  paisJurisdicao: string; // Ex: 'Ilhas Virgens Britânicas (BVI)'
  lucroLiquidoExercicioUsd: number;
  taxaCambialPtax31Dezembro: number;
  tributoPagoNoExteriorUsd?: number;
  adotouOpcaoTransparenciaFiscal: boolean;
}

export interface OffshoreTaxResult {
  entidadeId: string;
  nomeEntidade: string;
  jurisdicao: string;
  lucroContabilBrl: number;
  impostoRendaDevidoBrasil15PercentBrl: number;
  creditoImpostoPagoExteriorBrl: number;
  impostoRendaLiquidoAPagarBrl: number;
  diagnosticoLei14754: string;
}

export function calculateOffshoreTaxationLaw14754(input: OffshoreEntityInput): Result<OffshoreTaxResult, Error> {
  const {
    entidadeOffshoreId,
    nomeEntidade,
    paisJurisdicao,
    lucroLiquidoExercicioUsd,
    taxaCambialPtax31Dezembro,
    tributoPagoNoExteriorUsd = 0,
    adotouOpcaoTransparenciaFiscal
  } = input;

  if (taxaCambialPtax31Dezembro <= 0) {
    return Err(new Error('Taxa cambial PTAX de 31/12 deve ser superior a zero.'));
  }

  const lucroBrl = Number((Math.max(0, lucroLiquidoExercicioUsd) * taxaCambialPtax31Dezembro).toFixed(2));

  // Alíquota fixa de 15% de IRPF sobre os lucros auferidos no exterior (Art. 3º e 5º da Lei nº 14.754/2023)
  const irBruto = Number((lucroBrl * 0.15).toFixed(2));

  // Compensação de imposto pago no exterior
  const creditoExteriorBrl = Number((tributoPagoNoExteriorUsd * taxaCambialPtax31Dezembro).toFixed(2));
  const irLiquidoAPagar = Number(Math.max(0, irBruto - creditoExteriorBrl).toFixed(2));

  const diag = 'Lei nº 14.754/2023 (Tributação de Offshores): Entidade ' + nomeEntidade + ' em ' + paisJurisdicao + '. Lucro de USD ' + lucroLiquidoExercicioUsd.toFixed(2) + ' (R$ ' + lucroBrl.toFixed(2) + '). IRPF 15% devido de R$ ' + irBruto.toFixed(2) + ' deduzido de R$ ' + creditoExteriorBrl.toFixed(2) + ' de crédito pago no exterior. Imposto líquido a recolher no Brasil: R$ ' + irLiquidoAPagar.toFixed(2) + '.' + (adotouOpcaoTransparenciaFiscal ? ' (Regime de Transparência Fiscal Ativado).' : '');

  return Ok({
    entidadeId: entidadeOffshoreId,
    nomeEntidade,
    jurisdicao: paisJurisdicao,
    lucroContabilBrl: lucroBrl,
    impostoRendaDevidoBrasil15PercentBrl: irBruto,
    creditoImpostoPagoExteriorBrl: creditoExteriorBrl,
    impostoRendaLiquidoAPagarBrl: irLiquidoAPagar,
    diagnosticoLei14754: diag
  });
}
