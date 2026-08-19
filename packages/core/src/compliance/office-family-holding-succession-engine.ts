import { Result, Ok, Err } from '../types/result.js';

export interface FamilyHoldingInput {
  familiaNome: string;
  valorImoveisCustoHistoricoIrpfBrl: number;
  valorImoveisMercadoBrl: number;
  rendaAluguelMensalBrl: number;
  aliquotaItcmdEstadoPercent: number; // Ex: 4% a 8%
  percentualHonorariosInventarioPercent: number; // Ex: 10%
  percentualCustasJudiciaisCartorioPercent: number; // Ex: 3%
}

export interface FamilyHoldingResult {
  familiaNome: string;
  custoTotalInventarioTradicionalBrl: number;
  custoTotalConstituicaoHoldingBrl: number;
  economiaTributariaSucessoriaBrl: number;
  economiaMensalAluguelPjVsPfBrl: number;
  statusPlanejamento: 'PLANEJAMENTO_SUCESSORIO_ESTRUTURADO_COM_SUCESSO';
  diagnosticoPlanejamento: string;
}

export function processOfficeFamilyHoldingSuccessionEngine(input: FamilyHoldingInput): Result<FamilyHoldingResult, Error> {
  const {
    familiaNome,
    valorImoveisCustoHistoricoIrpfBrl,
    valorImoveisMercadoBrl,
    rendaAluguelMensalBrl,
    aliquotaItcmdEstadoPercent,
    percentualHonorariosInventarioPercent,
    percentualCustasJudiciaisCartorioPercent
  } = input;

  if (!familiaNome || valorImoveisMercadoBrl <= 0) {
    return Err(new Error('Nome da família e patrimônio imobiliário de mercado positivo são obrigatórios.'));
  }

  // 1. Custo do Inventário Tradicional (calculado sobre Valor de Mercado)
  const itcmdInventario = (valorImoveisMercadoBrl * aliquotaItcmdEstadoPercent) / 100;
  const honorariosAdvogado = (valorImoveisMercadoBrl * percentualHonorariosInventarioPercent) / 100;
  const custasJudiciais = (valorImoveisMercadoBrl * percentualCustasJudiciaisCartorioPercent) / 100;
  const totalInventario = itcmdInventario + honorariosAdvogado + custasJudiciais;

  // 2. Custo na Holding Familiar (Integralização a Custo Histórico de IRPF - Art. 23 Lei 9.249/95 + ITBI / ITCMD na doação de quotas)
  // ITCMD na doação de quotas incide sobre o valor patrimonial contábil (ou com desconto de usufruto de 1/3 a 1/2)
  const baseDoacaoQuotas = valorImoveisCustoHistoricoIrpfBrl * 0.67; // 2/3 da nua propriedade
  const itcmdHolding = (baseDoacaoQuotas * aliquotaItcmdEstadoPercent) / 100;
  const custosAberturaHolding = 35000.00; // Honorários societários e taxas de Junta
  const totalHolding = itcmdHolding + custosAberturaHolding;

  const economiaSucessoria = totalInventario - totalHolding;

  // 3. Economia de IRPF sobre Aluguel (PF 27,5% vs PJ Presumido 11,33%)
  const impostoPfMensal = rendaAluguelMensalBrl * 0.275;
  const impostoPjMensal = rendaAluguelMensalBrl * 0.1133;
  const economiaAluguelMensal = Math.max(0, impostoPfMensal - impostoPjMensal);

  const diag = "Holding Familiar (" + familiaNome + "): Patrimônio: R$ " + valorImoveisMercadoBrl.toLocaleString('pt-BR') + " | Custo Inventário: R$ " + totalInventario.toLocaleString('pt-BR') + " | Custo Holding: R$ " + totalHolding.toLocaleString('pt-BR') + " | Economia na Sucessão: R$ " + economiaSucessoria.toLocaleString('pt-BR') + " | Economia Mensal em Aluguéis: R$ " + economiaAluguelMensal.toLocaleString('pt-BR') + "/mês.";

  return Ok({
    familiaNome,
    custoTotalInventarioTradicionalBrl: parseFloat(totalInventario.toFixed(2)),
    custoTotalConstituicaoHoldingBrl: parseFloat(totalHolding.toFixed(2)),
    economiaTributariaSucessoriaBrl: parseFloat(economiaSucessoria.toFixed(2)),
    economiaMensalAluguelPjVsPfBrl: parseFloat(economiaAluguelMensal.toFixed(2)),
    statusPlanejamento: 'PLANEJAMENTO_SUCESSORIO_ESTRUTURADO_COM_SUCESSO',
    diagnosticoPlanejamento: diag
  });
}
