import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ImpairmentTestInput {
  ativoOuUgcId: string;
  descricaoAtivo: string;
  custoAquisicaoOriginal: number;
  depreciacaoAcumulada: number;
  valorJustoLiquidoDespesasVenda: number;
  fluxosCaixaFuturosEstimadosDescontados: number;
}

export interface ImpairmentTestResult {
  ativoOuUgcId: string;
  valorContabilLiquidoVcl: number;
  valorRecuperavel: number;
  houveDesvalorizacaoImpairment: boolean;
  valorPerdaImpairment: number;
  novoValorContabilAposTeste: number;
  partidasDobradaImpairment: JournalEntryLine[];
  diagnosticoSocietario: string;
}

export function performImpairmentTest(input: ImpairmentTestInput): Result<ImpairmentTestResult, Error> {
  const {
    ativoOuUgcId,
    descricaoAtivo,
    custoAquisicaoOriginal,
    depreciacaoAcumulada,
    valorJustoLiquidoDespesasVenda,
    fluxosCaixaFuturosEstimadosDescontados
  } = input;

  const vcl = Number((custoAquisicaoOriginal - depreciacaoAcumulada).toFixed(2));
  if (vcl < 0) {
    return Err(new Error('Valor contábil líquido não pode ser negativo.'));
  }

  const valorRecuperavel = Number(Math.max(valorJustoLiquidoDespesasVenda, fluxosCaixaFuturosEstimadosDescontados).toFixed(2));
  const houveDesvalorizacao = vcl > valorRecuperavel;
  const valorPerda = houveDesvalorizacao ? Number((vcl - valorRecuperavel).toFixed(2)) : 0;
  const novoValor = Number((vcl - valorPerda).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (houveDesvalorizacao) {
    partidas.push({
      accountId: '4.1.3.15',
      accountCode: '4.1.3.15',
      accountName: 'Despesa com Perda por Redução ao Valor Recuperável (Resultado - CPC 01)',
      type: 'DEBIT',
      amount: valorPerda
    });
    partidas.push({
      accountId: '1.2.3.09',
      accountCode: '1.2.3.09',
      accountName: '(-) Provisão para Redução ao Valor Recuperável - Impairment (Redutora do Imobilizado)',
      type: 'CREDIT',
      amount: valorPerda
    });
  }

  const diagnostico = houveDesvalorizacao
    ? 'Foi identificada desvalorização de R$ ' + valorPerda.toFixed(2) + ' no ativo ' + descricaoAtivo + '. Deverá ser constituída provisão de perda para ajustar o valor contábil ao valor recuperável.'
    : 'O ativo ' + descricaoAtivo + ' possui valor recuperável superior ao valor contábil líquido. Nenhuma perda por impairment é necessária.';

  return Ok({
    ativoOuUgcId,
    valorContabilLiquidoVcl: vcl,
    valorRecuperavel,
    houveDesvalorizacaoImpairment: houveDesvalorizacao,
    valorPerdaImpairment: valorPerda,
    novoValorContabilAposTeste: novoValor,
    partidasDobradaImpairment: partidas,
    diagnosticoSocietario: diagnostico
  });
}
