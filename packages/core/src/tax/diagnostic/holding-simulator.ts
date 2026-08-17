import { Result, Ok } from '../../types/result.js';

export interface HoldingSimulationInput {
  receitaAlugueisMensal: number;
  valorTotalImoveisMercado: number;
  valorTotalImoveisCustoDeclaradoIR: number;
  ufLocalizacaoImoveis: string;
  aliquotaItcmdEstadualPercent: number; // e.g. 4 para 4% ou progressivo até 8%
  previsaoVendaImoveisAno: number;
}

export interface HoldingComparisonResult {
  tributacaoPessoaFisica: {
    irpfMensalAlugueis: number;
    aliquotaEfetivaIrpfPercent: number;
    irpfAnualTotal: number;
  };
  tributacaoHoldingPresumido: {
    irpjCsllPisCofinsMensal: number;
    aliquotaEfetivaPjPercent: number;
    tributacaoAnualTotalPj: number;
  };
  economiaAnualAlugueis: number;
  economiaPercentual: number;
  planejamentoSucessorio: {
    itcmdDoacaoComUsufruto: number;
    custoInventarioJudicialTradicionalEstimado: number;
    economiaPlanejamentoSucessorio: number;
    isImunidadeItbiIntegralizacaoAplicavel: boolean;
  };
  diagnosticoEstrategico: string;
}

export function runHoldingSimulation(input: HoldingSimulationInput): Result<HoldingComparisonResult, Error> {
  const {
    receitaAlugueisMensal,
    valorTotalImoveisMercado,
    valorTotalImoveisCustoDeclaradoIR,
    aliquotaItcmdEstadualPercent
  } = input;

  // 1. Tributação na Pessoa Física (Carnê-Leão tabela progressiva 27,5% com dedução média)
  const parcelaDeduzirIrrf = 896.00;
  const irpfMensal = Math.max(0, Number(((receitaAlugueisMensal * 0.275) - parcelaDeduzirIrrf).toFixed(2)));
  const aliqEfetivaPf = Number(((irpfMensal / receitaAlugueisMensal) * 100).toFixed(2));
  const irpfAnual = Number((irpfMensal * 12).toFixed(2));

  // 2. Tributação na Holding (Lucro Presumido Imobiliário: IRPJ 4,8% + Adicional 10% + CSLL 2,88% + PIS 0,65% + COFINS 3% => ~11,33% a 14,53%)
  const aliqPresumidoFederal = 0.1133;
  const tributosPjMensal = Number((receitaAlugueisMensal * aliqPresumidoFederal).toFixed(2));
  const aliqEfetivaPj = 11.33;
  const tributosPjAnual = Number((tributosPjMensal * 12).toFixed(2));

  const economiaAnual = Number((irpfAnual - tributosPjAnual).toFixed(2));
  const economiaPercent = Number((((irpfAnual - tributosPjAnual) / irpfAnual) * 100).toFixed(2));

  // 3. Sucessão & ITCMD
  const baseItcmd = valorTotalImoveisCustoDeclaradoIR; // Na holding, pode ser doado pelo custo histórico das quotas
  const itcmdHolding = Number((baseItcmd * (aliquotaItcmdEstadualPercent / 100)).toFixed(2));
  const custoInventarioTradicional = Number((valorTotalImoveisMercado * ((aliquotaItcmdEstadualPercent / 100) + 0.06)).toFixed(2)); // ITCMD s/ mercado + 6% honorários/custas
  const economiaSucessao = Number((custoInventarioTradicional - itcmdHolding).toFixed(2));

  const diagnostico = `A estruturação de Holding Patrimonial gera uma economia tributária imediata de R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano na locação (${economiaPercent}% de redução de carga fiscal), além de mitigar custos de inventário em R$ ${economiaSucessao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;

  return Ok({
    tributacaoPessoaFisica: {
      irpfMensalAlugueis: irpfMensal,
      aliquotaEfetivaIrpfPercent: aliqEfetivaPf,
      irpfAnualTotal: irpfAnual
    },
    tributacaoHoldingPresumido: {
      irpjCsllPisCofinsMensal: tributosPjMensal,
      aliquotaEfetivaPjPercent: aliqEfetivaPj,
      tributacaoAnualTotalPj: tributosPjAnual
    },
    economiaAnualAlugueis: economiaAnual,
    economiaPercentual: economiaPercent,
    planejamentoSucessorio: {
      itcmdDoacaoComUsufruto: itcmdHolding,
      custoInventarioJudicialTradicionalEstimado: custoInventarioTradicional,
      economiaPlanejamentoSucessorio: economiaSucessao,
      isImunidadeItbiIntegralizacaoAplicavel: true
    },
    diagnosticoEstrategico: diagnostico
  });
}
