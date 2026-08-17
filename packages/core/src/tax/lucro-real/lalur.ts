import { LucroRealInput, LucroRealResult } from '../../types/tax.js';
import { Result, Ok } from '../../types/result.js';

export const TAXA_IRPJ_REAL = 0.15;
export const TAXA_ADICIONAL_IRPJ_REAL = 0.10;
export const TAXA_CSLL_REAL = 0.09;
export const LIMITE_ISENCAO_TRIMESTRAL = 60000.00;
export const LIMITE_COMPENSACAO_PREJUIZO_PERCENT = 0.30;

export function calculateLucroReal(input: LucroRealInput): Result<LucroRealResult, Error> {
  const {
    lucroLiquidoAntesIrpjCsll,
    adicoesParteA,
    exclusoesParteA,
    saldoPrejuizoFiscalAnteriorParteB,
    saldoBaseNegativaCsllAnteriorParteB,
    receitaBrutaNaoCumulativaPisCofins,
    creditosInsumosEnergiaDepreciacao,
    retencoesFonteCompensaveis
  } = input;

  const totalAdicoes = Number(adicoesParteA.reduce((sum, item) => sum + item.valor, 0).toFixed(2));
  const totalExclusoes = Number(exclusoesParteA.reduce((sum, item) => sum + item.valor, 0).toFixed(2));

  const lucroRealAntesCompensacao = Number((lucroLiquidoAntesIrpjCsll + totalAdicoes - totalExclusoes).toFixed(2));

  let compensacaoPrejuizoFiscal30Percent = 0;
  let saldoPrejuizoFiscalRemanescenteParteB = saldoPrejuizoFiscalAnteriorParteB;
  let lucroRealFinalTributavel = Math.max(0, lucroRealAntesCompensacao);

  if (lucroRealAntesCompensacao > 0 && saldoPrejuizoFiscalAnteriorParteB > 0) {
    const limiteCompensacao = Number((lucroRealAntesCompensacao * LIMITE_COMPENSACAO_PREJUIZO_PERCENT).toFixed(2));
    compensacaoPrejuizoFiscal30Percent = Math.min(saldoPrejuizoFiscalAnteriorParteB, limiteCompensacao);
    lucroRealFinalTributavel = Number((lucroRealAntesCompensacao - compensacaoPrejuizoFiscal30Percent).toFixed(2));
    saldoPrejuizoFiscalRemanescenteParteB = Number((saldoPrejuizoFiscalAnteriorParteB - compensacaoPrejuizoFiscal30Percent).toFixed(2));
  } else if (lucroRealAntesCompensacao < 0) {
    saldoPrejuizoFiscalRemanescenteParteB = Number((saldoPrejuizoFiscalAnteriorParteB + Math.abs(lucroRealAntesCompensacao)).toFixed(2));
    lucroRealFinalTributavel = 0;
  }

  const irpj15 = Number((lucroRealFinalTributavel * TAXA_IRPJ_REAL).toFixed(2));
  const excessoTrimestral = Math.max(0, lucroRealFinalTributavel - LIMITE_ISENCAO_TRIMESTRAL);
  const adicionalIrpj10 = Number((excessoTrimestral * TAXA_ADICIONAL_IRPJ_REAL).toFixed(2));
  const irpjDevido = Number((irpj15 + adicionalIrpj10).toFixed(2));
  const irpjAPagar = Number(Math.max(0, irpjDevido - (retencoesFonteCompensaveis?.irrf || 0)).toFixed(2));

  const baseCsllAntesCompensacao = lucroRealAntesCompensacao;
  let compensacaoBaseNegativa30Percent = 0;
  let saldoBaseNegativaRemanescenteParteB = saldoBaseNegativaCsllAnteriorParteB;
  let baseCsllFinalTributavel = Math.max(0, baseCsllAntesCompensacao);

  if (baseCsllAntesCompensacao > 0 && saldoBaseNegativaCsllAnteriorParteB > 0) {
    const limiteCompensacaoCsll = Number((baseCsllAntesCompensacao * LIMITE_COMPENSACAO_PREJUIZO_PERCENT).toFixed(2));
    compensacaoBaseNegativa30Percent = Math.min(saldoBaseNegativaCsllAnteriorParteB, limiteCompensacaoCsll);
    baseCsllFinalTributavel = Number((baseCsllAntesCompensacao - compensacaoBaseNegativa30Percent).toFixed(2));
    saldoBaseNegativaRemanescenteParteB = Number((saldoBaseNegativaCsllAnteriorParteB - compensacaoBaseNegativa30Percent).toFixed(2));
  } else if (baseCsllAntesCompensacao < 0) {
    saldoBaseNegativaRemanescenteParteB = Number((saldoBaseNegativaCsllAnteriorParteB + Math.abs(baseCsllAntesCompensacao)).toFixed(2));
    baseCsllFinalTributavel = 0;
  }

  const csll9 = Number((baseCsllFinalTributavel * TAXA_CSLL_REAL).toFixed(2));
  const csllAPagar = Number(Math.max(0, csll9 - (retencoesFonteCompensaveis?.csll || 0)).toFixed(2));

  const pisNaoCumulativoDebito = Number((receitaBrutaNaoCumulativaPisCofins * 0.0165).toFixed(2));
  const pisNaoCumulativoCredito = Number((creditosInsumosEnergiaDepreciacao * 0.0165).toFixed(2));
  const pisAPagar = Number(Math.max(0, pisNaoCumulativoDebito - pisNaoCumulativoCredito - (retencoesFonteCompensaveis?.pis || 0)).toFixed(2));

  const cofinsNaoCumulativoDebito = Number((receitaBrutaNaoCumulativaPisCofins * 0.0760).toFixed(2));
  const cofinsNaoCumulativoCredito = Number((creditosInsumosEnergiaDepreciacao * 0.0760).toFixed(2));
  const cofinsAPagar = Number(Math.max(0, cofinsNaoCumulativoDebito - cofinsNaoCumulativoCredito - (retencoesFonteCompensaveis?.cofins || 0)).toFixed(2));

  const totalTributosFederaisDevidos = Number((irpjAPagar + csllAPagar + pisAPagar + cofinsAPagar).toFixed(2));

  return Ok({
    lucroLiquidoContabil: lucroLiquidoAntesIrpjCsll,
    totalAdicoes,
    totalExclusoes,
    lucroRealAntesCompensacao,
    compensacaoPrejuizoFiscal30Percent,
    saldoPrejuizoFiscalRemanescenteParteB,
    lucroRealFinalTributavel,
    irpj15,
    adicionalIrpj10,
    irpjDevido,
    irpjAPagar,
    baseCsllAntesCompensacao,
    compensacaoBaseNegativa30Percent,
    saldoBaseNegativaRemanescenteParteB,
    baseCsllFinalTributavel,
    csll9,
    csllAPagar,
    pisNaoCumulativoDebito,
    pisNaoCumulativoCredito,
    pisAPagar,
    cofinsNaoCumulativoDebito,
    cofinsNaoCumulativoCredito,
    cofinsAPagar,
    totalTributosFederaisDevidos
  });
}
