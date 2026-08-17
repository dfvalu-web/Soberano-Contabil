import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ContractPerformanceObligation {
  id: string;
  descricao: string;
  precoVendaIndividualEstimado: number;
  custoTotalEstimado: number;
  custoIncorridoAcumulado: number;
  metodoReconhecimento: 'AO_LONGO_DO_TEMPO_POC' | 'PONTO_NO_TEMPO_ENTREGA';
  isEntreguePontoNoTempo?: boolean;
}

export interface CustomerContractInput {
  contratoId: string;
  clienteNome: string;
  precoTotalTransacao: number; // Preço pactuado
  obrigacoesDesempenho: ContractPerformanceObligation[];
}

export interface RevenueRecognitionResult {
  contratoId: string;
  precoTotalTransacao: number;
  receitaTotalReconhecidaNoPeriodo: number;
  saldoPassivoDeContratoReceitaDiferida: number;
  saldoAtivoDeContratoReceitaAExecutar: number;
  detalheObrigacoes: Array<{
    obrigacaoId: string;
    precoAlocado: number;
    percentualConclusaoPoc: number;
    receitaReconhecidaObrigacao: number;
  }>;
  partidasDobradaReceita: JournalEntryLine[];
}

export function calculateRevenueRecognitionCpc47(input: CustomerContractInput): Result<RevenueRecognitionResult, Error> {
  const { contratoId, precoTotalTransacao, obrigacoesDesempenho } = input;

  if (precoTotalTransacao <= 0 || obrigacoesDesempenho.length === 0) {
    return Err(new Error('Preço da transação e obrigações de desempenho devem ser válidos.'));
  }

  // 1. Alocação do preço da transação com base no Stand-alone Selling Price
  const somaPrecosIndividuais = obrigacoesDesempenho.reduce((s, o) => s + o.precoVendaIndividualEstimado, 0);
  let receitaTotalPeriodo = 0;
  const detalhe: RevenueRecognitionResult['detalheObrigacoes'] = [];

  for (const ob of obrigacoesDesempenho) {
    const proporcao = somaPrecosIndividuais > 0 ? (ob.precoVendaIndividualEstimado / somaPrecosIndividuais) : (1 / obrigacoesDesempenho.length);
    const precoAlocado = Number((precoTotalTransacao * proporcao).toFixed(2));

    let poc = 0;
    let receitaOb = 0;

    if (ob.metodoReconhecimento === 'AO_LONGO_DO_TEMPO_POC') {
      poc = ob.custoTotalEstimado > 0 ? Math.min(1.0, ob.custoIncorridoAcumulado / ob.custoTotalEstimado) : 0;
      receitaOb = Number((precoAlocado * poc).toFixed(2));
    } else {
      poc = ob.isEntreguePontoNoTempo ? 1.0 : 0.0;
      receitaOb = ob.isEntreguePontoNoTempo ? precoAlocado : 0.0;
    }

    receitaTotalPeriodo = Number((receitaTotalPeriodo + receitaOb).toFixed(2));

    detalhe.push({
      obrigacaoId: ob.id,
      precoAlocado,
      percentualConclusaoPoc: Number((poc * 100).toFixed(2)),
      receitaReconhecidaObrigacao: receitaOb
    });
  }

  const saldoPassivoDiferido = Number(Math.max(0, precoTotalTransacao - receitaTotalPeriodo).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes - Contas a Receber (Ativo Circulante)',
      type: 'DEBIT',
      amount: receitaTotalPeriodo
    },
    {
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Receita Bruta de Contratos com Clientes (Resultado - CPC 47)',
      type: 'CREDIT',
      amount: receitaTotalPeriodo
    }
  ];

  return Ok({
    contratoId,
    precoTotalTransacao,
    receitaTotalReconhecidaNoPeriodo: receitaTotalPeriodo,
    saldoPassivoDeContratoReceitaDiferida: saldoPassivoDiferido,
    saldoAtivoDeContratoReceitaAExecutar: 0,
    detalheObrigacoes: detalhe,
    partidasDobradaReceita: partidas
  });
}
