import { Result, Ok, Err } from '../../types/result.js';

export interface CooperativeTaxInput {
  cooperativaId: string;
  cooperativaNome: string; // Ex: 'Cooperativa Agropecuária Soberana Ltda'
  receitaAtoCooperativoTipicoBrl: number; // Operações com cooperados associados
  sobraLiquidaAtoTipicoBrl: number; // Sobras do ato típico (não tributadas)
  receitaAtoCooperativoAtipicoBrl: number; // Vendas a terceiros não cooperados
  lucroLiquidoAtoAtipicoBrl: number; // Lucro com terceiros (tributado ordinariamente)
}

export interface CooperativeTaxResult {
  cooperativaId: string;
  cooperativaNome: string;
  receitaAtoTipicoBrl: number;
  sobrasTipicasIsentasBrl: number;
  receitaAtoAtipicoBrl: number;
  lucroAtipicoTributavelBrl: number;
  irpjDevidoAtoAtipicoBrl: number; // 15% + 10% adicional
  csllDevidaAtoAtipicoBrl: number; // 9%
  pisCofinsDevidoAtipicoBrl: number; // 9,25% sobre receita atípica
  totalTributosCooperativaBrl: number;
  diagnosticoFiscal: string;
}

export function processCooperativesTypicalAtypicalTaxEngine(input: CooperativeTaxInput): Result<CooperativeTaxResult, Error> {
  const {
    cooperativaId,
    cooperativaNome,
    receitaAtoCooperativoTipicoBrl,
    sobraLiquidaAtoTipicoBrl,
    receitaAtoCooperativoAtipicoBrl,
    lucroLiquidoAtoAtipicoBrl
  } = input;

  if (receitaAtoCooperativoTipicoBrl < 0 || receitaAtoCooperativoAtipicoBrl < 0) {
    return Err(new Error('Receitas devem ser maiores ou iguais a zero.'));
  }

  // Lei nº 5.764/1971 Art. 79 e Art. 86 / Lei nº 9.532/1997 Art. 15:
  // 1. Ato Cooperativo Típico (com associados): Não incidência de IRPJ e CSLL sobre sobras.
  // 2. Ato Cooperativo Atípico (com terceiros): Tributação integral ordinária:
  //    - IRPJ: 15% + 10% sobre o lucro excedente a R$ 240k/ano
  //    - CSLL: 9%
  //    - PIS (1,65%) e COFINS (7,60%) = 9,25% sobre a receita do ato atípico
  const irpjBase = lucroLiquidoAtoAtipicoBrl * 0.15;
  const irpjAdicional = Math.max(0, (lucroLiquidoAtoAtipicoBrl - 240000.00) * 0.10);
  const irpjTotal = Number((irpjBase + irpjAdicional).toFixed(2));

  const csllTotal = Number((lucroLiquidoAtoAtipicoBrl * 0.09).toFixed(2));
  const pisCofinsAtipico = Number((receitaAtoCooperativoAtipicoBrl * 0.0925).toFixed(2));

  const totalTributos = Number((irpjTotal + csllTotal + pisCofinsAtipico).toFixed(2));

  const diag = "Sociedades Cooperativas (Lei nº 5.764/1971): " + cooperativaNome + ". Ato Tipico (Cooperados): Receita R$ " + receitaAtoCooperativoTipicoBrl.toFixed(2) + " (Sobras R$ " + sobraLiquidaAtoTipicoBrl.toFixed(2) + " 100% ISENTAS DE IRPJ/CSLL). Ato Atipico (Terceiros): Receita R$ " + receitaAtoCooperativoAtipicoBrl.toFixed(2) + " (Lucro R$ " + lucroLiquidoAtoAtipicoBrl.toFixed(2) + "). TRIBUTOS ATIPICOS: IRPJ R$ " + irpjTotal.toFixed(2) + " + CSLL R$ " + csllTotal.toFixed(2) + " + PIS/COFINS R$ " + pisCofinsAtipico.toFixed(2) + " = Total R$ " + totalTributos.toFixed(2) + ".";

  return Ok({
    cooperativaId,
    cooperativaNome,
    receitaAtoTipicoBrl: receitaAtoCooperativoTipicoBrl,
    sobrasTipicasIsentasBrl: sobraLiquidaAtoTipicoBrl,
    receitaAtoAtipicoBrl: receitaAtoCooperativoAtipicoBrl,
    lucroAtipicoTributavelBrl: lucroLiquidoAtoAtipicoBrl,
    irpjDevidoAtoAtipicoBrl: irpjTotal,
    csllDevidaAtoAtipicoBrl: csllTotal,
    pisCofinsDevidoAtipicoBrl: pisCofinsAtipico,
    totalTributosCooperativaBrl: totalTributos,
    diagnosticoFiscal: diag
  });
}
