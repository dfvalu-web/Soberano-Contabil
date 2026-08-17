import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface HeldForSaleInput {
  ativoId: string;
  descricaoAtivo: string; // Ex: 'Unidade Fabril de Embalagens'
  valorContabilOriginalBrl: number;
  depreciacaoAcumuladaBrl: number;
  valorJustoAvaliadoBrl: number;
  despesasEstimadasDeVendaBrl: number;
  operacaoDescontinuada: boolean;
  lucroLiquidoGeradoPelaUnidadeNoExercicioBrl?: number;
}

export interface HeldForSaleResult {
  ativoId: string;
  descricao: string;
  valorContabilLiquidoOriginalBrl: number;
  valorJustoMenosDespesasDeVendaBrl: number;
  valorFinalReclassificadoAtivoCirculanteBrl: number;
  perdaPorDesvalorizacaoImpairmentBrl: number;
  cessouDepreciacao: boolean;
  operacaoDescontinuadaSegregadaDRE: boolean;
  partidasDobradaReclassificacao: JournalEntryLine[];
  diagnosticoCpc31: string;
}

export function evaluateHeldForSaleAndDiscontinuedOperationsCpc31(input: HeldForSaleInput): Result<HeldForSaleResult, Error> {
  const {
    ativoId,
    descricaoAtivo,
    valorContabilOriginalBrl,
    depreciacaoAcumuladaBrl,
    valorJustoAvaliadoBrl,
    despesasEstimadasDeVendaBrl,
    operacaoDescontinuada,
    lucroLiquidoGeradoPelaUnidadeNoExercicioBrl = 0
  } = input;

  if (valorContabilOriginalBrl <= 0) {
    return Err(new Error('Valor contábil do ativo deve ser superior a zero.'));
  }

  const vclOriginal = Number((valorContabilOriginalBrl - depreciacaoAcumuladaBrl).toFixed(2));
  const vjMenosDespesas = Number((valorJustoAvaliadoBrl - despesasEstimadasDeVendaBrl).toFixed(2));

  // Menor valor entre o VCL e o Valor Justo Líquido (CPC 31, Item 15)
  const perdaImpairment = Number(Math.max(0, vclOriginal - vjMenosDespesas).toFixed(2));
  const valorFinalReclassificado = Number(Math.min(vclOriginal, vjMenosDespesas).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // Baixa da depreciação acumulada anterior
  if (depreciacaoAcumuladaBrl > 0) {
    partidas.push({
      accountId: '1.2.3.90',
      accountCode: '1.2.3.90',
      accountName: 'Depreciação Acumulada (Ativo Não Circulante - CPC 31)',
      type: 'DEBIT',
      amount: depreciacaoAcumuladaBrl
    });
  }

  // Se houver perda por impairment na reclassificação
  if (perdaImpairment > 0) {
    partidas.push({
      accountId: '3.1.8.01',
      accountCode: '3.1.8.01',
      accountName: 'Perda por Desvalorização de Ativo Mantido para Venda (Resultado - CPC 31)',
      type: 'DEBIT',
      amount: perdaImpairment
    });
  }

  // Reclassificação para Ativo Circulante
  partidas.push({
    accountId: '1.1.5.01',
    accountCode: '1.1.5.01',
    accountName: 'Ativos Não Circulantes Mantidos para Venda (Ativo Circulante - CPC 31)',
    type: 'DEBIT',
    amount: valorFinalReclassificado
  });

  // Baixa do custo original no Imobilizado
  partidas.push({
    accountId: '1.2.3.01',
    accountCode: '1.2.3.01',
    accountName: 'Imobilizado em Operação (Ativo Não Circulante - CPC 31)',
    type: 'CREDIT',
    amount: valorContabilOriginalBrl
  });

  const diag = 'CPC 31 / IFRS 5: Ativo ' + descricaoAtivo + ' classificado como Mantido para Venda. Reclassificado para o Ativo Circulante por R$ ' + valorFinalReclassificado.toFixed(2) + ' (VCL: R$ ' + vclOriginal.toFixed(2) + ' vs VJ Líquido: R$ ' + vjMenosDespesas.toFixed(2) + '). ' + (perdaImpairment > 0 ? 'Reconhecida perda de R$ ' + perdaImpairment.toFixed(2) + ' no resultado. ' : 'Sem perda inicial. ') + 'Depreciação cessada imediatamente.' + (operacaoDescontinuada ? ' Operação Descontinuada: Lucro de R$ ' + lucroLiquidoGeradoPelaUnidadeNoExercicioBrl.toFixed(2) + ' segregado na linha final da DRE.' : '');

  return Ok({
    ativoId,
    descricao: descricaoAtivo,
    valorContabilLiquidoOriginalBrl: vclOriginal,
    valorJustoMenosDespesasDeVendaBrl: vjMenosDespesas,
    valorFinalReclassificadoAtivoCirculanteBrl: valorFinalReclassificado,
    perdaPorDesvalorizacaoImpairmentBrl: perdaImpairment,
    cessouDepreciacao: true,
    operacaoDescontinuadaSegregadaDRE: operacaoDescontinuada,
    partidasDobradaReclassificacao: partidas,
    diagnosticoCpc31: diag
  });
}
