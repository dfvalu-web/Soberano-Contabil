import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface FirstTimeAdoptionInput {
  transicaoId: string;
  empresaNome: string;
  dataTransicao: string; // Ex: '2026-01-01' (Data do Balanço de Abertura)
  patrimonioLiquidoAnteriorBrGaapBrl: number;
  ajusteCustoAtribuidoImobilizadoBrl: number; // Aumento no Ativo Imobilizado (CPC 27)
  ajusteReconhecimentoArrendamentoIfrs16Brl: number; // Direito de Uso vs Passivo (Efeito Líquido)
  ajusteAjusteValorPresenteAvpBrl: number; // Redução de Contas a Receber/Pagar (CPC 12)
  ajusteTributosDiferidosSobreAjustesBrl: number; // Passivo Fiscal Diferido (CPC 32 - 34%)
}

export interface FirstTimeAdoptionResult {
  transicaoId: string;
  empresaNome: string;
  dataTransicao: string;
  patrimonioLiquidoAnteriorBrGaapBrl: number;
  totalAjustesPositivosPlBrl: number;
  totalAjustesNegativosPlBrl: number;
  ajusteLiquidoTransicaoPlBrl: number; // Impacto Líquido em Lucros/Prejuízos Acumulados
  patrimonioLiquidoAberturaIfrsBrl: number;
  partidasDobradaAbertura: JournalEntryLine[];
  diagnosticoCpc37: string;
}

export function evaluateFirstTimeAdoptionCpc37Ifrs1(input: FirstTimeAdoptionInput): Result<FirstTimeAdoptionResult, Error> {
  const {
    transicaoId,
    empresaNome,
    dataTransicao,
    patrimonioLiquidoAnteriorBrGaapBrl,
    ajusteCustoAtribuidoImobilizadoBrl,
    ajusteReconhecimentoArrendamentoIfrs16Brl,
    ajusteAjusteValorPresenteAvpBrl,
    ajusteTributosDiferidosSobreAjustesBrl
  } = input;

  if (patrimonioLiquidoAnteriorBrGaapBrl <= 0) {
    return Err(new Error('Patrimônio Líquido anterior deve ser superior a zero.'));
  }

  // CPC 37 / IFRS 1:
  // Todos os ajustes decorrentes da primeira adoção dos CPCs devem ser reconhecidos
  // DIRETAMENTE no Patrimônio Líquido (Lucros ou Prejuízos Acumulados / Outros Resultados Abrangentes)
  // na Data de Transição (Balanço de Abertura), sem transitar pela DRE do período de transição.
  const ajustesPositivos = ajusteCustoAtribuidoImobilizadoBrl;
  const ajustesNegativos = ajusteReconhecimentoArrendamentoIfrs16Brl + ajusteAjusteValorPresenteAvpBrl + ajusteTributosDiferidosSobreAjustesBrl;
  const ajusteLiquidoPl = Number((ajustesPositivos - ajustesNegativos).toFixed(2));
  const plAberturaIfrs = Number((patrimonioLiquidoAnteriorBrGaapBrl + ajusteLiquidoPl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // 1. D: Imobilizado - Custo Atribuído (Ativo Não Circulante - CPC 27/37)
  if (ajusteCustoAtribuidoImobilizadoBrl > 0) {
    partidas.push({
      accountId: '1.2.2.01',
      accountCode: '1.2.2.01',
      accountName: 'Imobilizado em Operação - Ajuste Custo Atribuído (Ativo Não Circulante)',
      type: 'DEBIT',
      amount: ajusteCustoAtribuidoImobilizadoBrl
    });
  }

  // 2. C: Passivo Fiscal Diferido sobre Ajustes de Transição (Passivo Não Circulante - CPC 32)
  if (ajusteTributosDiferidosSobreAjustesBrl > 0) {
    partidas.push({
      accountId: '2.2.3.01',
      accountCode: '2.2.3.01',
      accountName: 'Passivo Fiscal Diferido - Transição IFRS (Passivo Não Circulante)',
      type: 'CREDIT',
      amount: ajusteTributosDiferidosSobreAjustesBrl
    });
  }

  // 3. C/D: Ajuste de Transição em Lucros/Prejuízos Acumulados (Patrimônio Líquido - CPC 37)
  if (ajusteLiquidoPl > 0) {
    partidas.push({
      accountId: '2.3.3.01',
      accountCode: '2.3.3.01',
      accountName: 'Ajustes Acumulados de Primeira Adoção IFRS / CPC (Patrimônio Líquido)',
      type: 'CREDIT',
      amount: ajusteLiquidoPl
    });
  } else if (ajusteLiquidoPl < 0) {
    partidas.push({
      accountId: '2.3.3.01',
      accountCode: '2.3.3.01',
      accountName: 'Ajustes Acumulados de Primeira Adoção IFRS / CPC (Patrimônio Líquido)',
      type: 'DEBIT',
      amount: Math.abs(ajusteLiquidoPl)
    });
  }

  const diag = 'Adoção Inicial IFRS / CPC (CPC 37 / IFRS 1): ' + empresaNome + ' em ' + dataTransicao + '. PL Anterior: R$ ' + patrimonioLiquidoAnteriorBrGaapBrl.toFixed(2) + ' -> Ajuste Líquido no PL: R$ ' + ajusteLiquidoPl.toFixed(2) + ' (Imobilizado +R$ ' + ajusteCustoAtribuidoImobilizadoBrl.toFixed(2) + ', PFD -R$ ' + ajusteTributosDiferidosSobreAjustesBrl.toFixed(2) + '). PL DE ABERTURA IFRS: R$ ' + plAberturaIfrs.toFixed(2) + '.';

  return Ok({
    transicaoId,
    empresaNome,
    dataTransicao,
    patrimonioLiquidoAnteriorBrGaapBrl,
    totalAjustesPositivosPlBrl: ajustesPositivos,
    totalAjustesNegativosPlBrl: ajustesNegativos,
    ajusteLiquidoTransicaoPlBrl: ajusteLiquidoPl,
    patrimonioLiquidoAberturaIfrsBrl: plAberturaIfrs,
    partidasDobradaAbertura: partidas,
    diagnosticoCpc37: diag
  });
}
