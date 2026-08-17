import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface AssetsHeldForDistributionInput {
  ativoId: string;
  descricaoAtivo: string; // Ex: 'Edifício Corporativo da Sucursal Sul'
  valorContabilLiquidoOriginalBrl: number;
  valorJustoEstimadoBrl: number;
  custosEstimadosDistribuicaoBrl: number;
  distribuicaoEfetivada: boolean;
}

export interface AssetsHeldForDistributionResult {
  ativoId: string;
  descricaoAtivo: string;
  valorJustoMenosCustosDistribuicaoBrl: number;
  valorContabilAtivoReclassificadoBrl: number;
  passivoDividendosInNaturaBrl: number;
  ganhoOuPerdaLiquidacaoResultadoBrl: number;
  partidasDobradaReclassificacaoEProvisao: JournalEntryLine[];
  partidasDobradaLiquidacaoEntrega: JournalEntryLine[];
  diagnosticoCpc31: string;
}

export function evaluateAssetsHeldForDistributionCpc31(input: AssetsHeldForDistributionInput): Result<AssetsHeldForDistributionResult, Error> {
  const {
    ativoId,
    descricaoAtivo,
    valorContabilLiquidoOriginalBrl,
    valorJustoEstimadoBrl,
    custosEstimadosDistribuicaoBrl,
    distribuicaoEfetivada
  } = input;

  if (valorContabilLiquidoOriginalBrl <= 0 || valorJustoEstimadoBrl <= 0) {
    return Err(new Error('Valores contábeis e de mercado do ativo devem ser superiores a zero.'));
  }

  // Valor Justo Líquido de Despesas de Distribuição (Fair Value Less Costs to Distribute)
  const vjl = Number((valorJustoEstimadoBrl - custosEstimadosDistribuicaoBrl).toFixed(2));

  // CPC 31: Ativo reclassificado pelo MENOR entre valor contábil e VJL
  const valorAtivoReclassificado = Math.min(valorContabilLiquidoOriginalBrl, vjl);

  // ICPC 08 / IFRIC 17: Passivo de Dividendos In Natura mensurado pelo VALOR JUSTO (VJL)
  const passivoDividendos = vjl;

  // Na Liquidação: Ganho no Resultado = Passivo Dividendos - Valor Contábil do Ativo Entregue
  const ganhoLiquidacao = Number((passivoDividendos - valorAtivoReclassificado).toFixed(2));

  const partidasReclassificacao: JournalEntryLine[] = [];

  // Reclassificação do Ativo Imobilizado para Ativo Não Circulante Mantido para Distribuição
  partidasReclassificacao.push({
    accountId: '1.2.4.05',
    accountCode: '1.2.4.05',
    accountName: 'Ativos Não Circulantes Mantidos para Distribuição aos Sócios (Ativo Circulante - CPC 31)',
    type: 'DEBIT',
    amount: valorAtivoReclassificado
  });
  partidasReclassificacao.push({
    accountId: '1.2.3.01',
    accountCode: '1.2.3.01',
    accountName: 'Imobilizado em Operação (Baixa por Reclassificação - CPC 31)',
    type: 'CREDIT',
    amount: valorContabilLiquidoOriginalBrl
  });

  // Provisão dos Dividendos In Natura contra Lucros Acumulados no PL
  partidasReclassificacao.push({
    accountId: '2.4.3.01',
    accountCode: '2.4.3.01',
    accountName: 'Lucros ou Prejuízos Acumulados - Distribuição de Dividendos In Natura (PL - ICPC 08)',
    type: 'DEBIT',
    amount: passivoDividendos
  });
  partidasReclassificacao.push({
    accountId: '2.1.2.05',
    accountCode: '2.1.2.05',
    accountName: 'Dividendos In Natura a Pagar aos Acionistas (Passivo Circulante - ICPC 08)',
    type: 'CREDIT',
    amount: passivoDividendos
  });

  const partidasLiquidacao: JournalEntryLine[] = [];
  if (distribuicaoEfetivada) {
    // Baixa do Passivo de Dividendos, Baixa do Ativo e Ganho no Resultado
    partidasLiquidacao.push({
      accountId: '2.1.2.05',
      accountCode: '2.1.2.05',
      accountName: 'Dividendos In Natura a Pagar aos Acionistas (Liquidação - ICPC 08)',
      type: 'DEBIT',
      amount: passivoDividendos
    });
    partidasLiquidacao.push({
      accountId: '1.2.4.05',
      accountCode: '1.2.4.05',
      accountName: 'Ativos Não Circulantes Mantidos para Distribuição aos Sócios (Baixa por Entrega)',
      type: 'CREDIT',
      amount: valorAtivoReclassificado
    });
    if (ganhoLiquidacao > 0) {
      partidasLiquidacao.push({
        accountId: '3.1.1.90',
        accountCode: '3.1.1.90',
        accountName: 'Ganho na Liquidação de Dividendos In Natura com Ativos Não Monetários (Resultado - ICPC 08)',
        type: 'CREDIT',
        amount: ganhoLiquidacao
      });
    }
  }

  const diag = 'CPC 31 / IFRS 5 & ICPC 08 (Ativos Mantidos para Distribuição aos Sócios): Ativo ' + descricaoAtivo + '. Valor Contábil Original: R$ ' + valorContabilLiquidoOriginalBrl.toFixed(2) + '. Valor Justo Líquido (VJL): R$ ' + vjl.toFixed(2) + '. Ativo Mensurado pelo menor valor (R$ ' + valorAtivoReclassificado.toFixed(2) + '). Passivo de Dividendos In Natura no PL: R$ ' + passivoDividendos.toFixed(2) + '.' + (distribuicaoEfetivada ? ' Distribuição homologada com ganho de R$ ' + ganhoLiquidacao.toFixed(2) + ' reconhecido na DRE.' : '');

  return Ok({
    ativoId,
    descricaoAtivo,
    valorJustoMenosCustosDistribuicaoBrl: vjl,
    valorContabilAtivoReclassificadoBrl: valorAtivoReclassificado,
    passivoDividendosInNaturaBrl: passivoDividendos,
    ganhoOuPerdaLiquidacaoResultadoBrl: ganhoLiquidacao,
    partidasDobradaReclassificacaoEProvisao: partidasReclassificacao,
    partidasDobradaLiquidacaoEntrega: partidasLiquidacao,
    diagnosticoCpc31: diag
  });
}
