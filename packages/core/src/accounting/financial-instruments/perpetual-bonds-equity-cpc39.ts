import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type PerpetualInstrumentType = 'TITULO_PERPETUO_PATRIMONIO_LIQUIDO' | 'DEBENTURE_SUBORDINADA_PASSIVO';

export interface PerpetualBondInput {
  instrumentoId: string;
  emissoraNome: string; // Ex: 'Banco Múltiplo Alpha S.A.'
  valorNominalCaptadoBrl: number;
  cupomJurosAnualPercent: number; // Ex: 9.0% a.a.
  discricionariedadePagamentoJuros: boolean; // Se a emissora pode diferir/cancelar cupom sem default
  semObrigacaoResgatePrincipal: boolean;     // Se é perpétuo sem data fixa de vencimento
}

export interface PerpetualBondResult {
  instrumentoId: string;
  emissoraNome: string;
  tipoClassificacaoContabil: PerpetualInstrumentType;
  classificacaoDescricao: 'PATRIMONIO_LIQUIDO_OUTROS_INSTRUMENTOS' | 'PASSIVO_EXIGIVEL_NAO_CIRCULANTE';
  cupomAnualBrl: number;
  impactoNaDRE: boolean;
  partidasDobradaEmissao: JournalEntryLine[];
  partidasDobradaPagamentoCupom: JournalEntryLine[];
  diagnosticoCpc39: string;
}

export function evaluatePerpetualBondClassificationCpc39(input: PerpetualBondInput): Result<PerpetualBondResult, Error> {
  const {
    instrumentoId,
    emissoraNome,
    valorNominalCaptadoBrl,
    cupomJurosAnualPercent,
    discricionariedadePagamentoJuros,
    semObrigacaoResgatePrincipal
  } = input;

  if (valorNominalCaptadoBrl <= 0 || cupomJurosAnualPercent < 0) {
    return Err(new Error('Valor captado e cupom de juros devem ser superiores ou iguais a zero.'));
  }

  const cupomAnual = Number((valorNominalCaptadoBrl * (cupomJurosAnualPercent / 100)).toFixed(2));
  const isPatrimonioLiquido = discricionariedadePagamentoJuros && semObrigacaoResgatePrincipal;

  const partidasEmissao: JournalEntryLine[] = [];
  const partidasCupom: JournalEntryLine[] = [];

  if (isPatrimonioLiquido) {
    // Classificação no PATRIMÔNIO LÍQUIDO (CPC 39 / IAS 32)
    partidasEmissao.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorNominalCaptadoBrl
    });
    partidasEmissao.push({
      accountId: '2.4.1.20',
      accountCode: '2.4.1.20',
      accountName: 'Outros Instrumentos Patrimoniais - Títulos Perpétuos / Capital Tier 1 (Patrimônio Líquido - CPC 39)',
      type: 'CREDIT',
      amount: valorNominalCaptadoBrl
    });

    // Pagamento de Cupom: Redução de Lucros Acumulados no PL (Tratado como dividendo - SEM IMPACTO NA DRE)
    partidasCupom.push({
      accountId: '2.4.3.01',
      accountCode: '2.4.3.01',
      accountName: 'Lucros ou Prejuízos Acumulados - Remuneração de Títulos Perpétuos (PL - CPC 39)',
      type: 'DEBIT',
      amount: cupomAnual
    });
    partidasCupom.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: cupomAnual
    });

    const diag = 'CPC 39 / IAS 32 (Instrumentos Patrimoniais): Emissor ' + emissoraNome + '. Título Perpétuo de R$ ' + valorNominalCaptadoBrl.toFixed(2) + ' classificado no PATRIMÔNIO LÍQUIDO devido à ausência de obrigação de resgate e discricionariedade no pagamento de cupons. Cupom anual de R$ ' + cupomAnual.toFixed(2) + ' debitado diretamente de Lucros Acumulados no PL sem impacto na DRE.';

    return Ok({
      instrumentoId,
      emissoraNome,
      tipoClassificacaoContabil: 'TITULO_PERPETUO_PATRIMONIO_LIQUIDO',
      classificacaoDescricao: 'PATRIMONIO_LIQUIDO_OUTROS_INSTRUMENTOS',
      cupomAnualBrl: cupomAnual,
      impactoNaDRE: false,
      partidasDobradaEmissao: partidasEmissao,
      partidasDobradaPagamentoCupom: partidasCupom,
      diagnosticoCpc39: diag
    });
  } else {
    // Classificação no PASSIVO NÃO CIRCULANTE (CPC 39 / CPC 48)
    partidasEmissao.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorNominalCaptadoBrl
    });
    partidasEmissao.push({
      accountId: '2.2.1.10',
      accountCode: '2.2.1.10',
      accountName: 'Debêntures e Títulos de Dívida Emitidos (Passivo Não Circulante - CPC 48)',
      type: 'CREDIT',
      amount: valorNominalCaptadoBrl
    });

    // Pagamento de Juros: Despesa Financeira na DRE
    partidasCupom.push({
      accountId: '3.1.5.02',
      accountCode: '3.1.5.02',
      accountName: 'Despesas Financeiras de Debêntures e Títulos Emitidos (Resultado - CPC 39 / 48)',
      type: 'DEBIT',
      amount: cupomAnual
    });
    partidasCupom.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: cupomAnual
    });

    const diag = 'CPC 39 / IAS 32 (Passivo Financeiro): Emissor ' + emissoraNome + '. Instrumento com obrigação de liquidação reconhecido no PASSIVO NÃO CIRCULANTE. Juros anuais de R$ ' + cupomAnual.toFixed(2) + ' reconhecidos como Despesa Financeira na DRE.';

    return Ok({
      instrumentoId,
      emissoraNome,
      tipoClassificacaoContabil: 'DEBENTURE_SUBORDINADA_PASSIVO',
      classificacaoDescricao: 'PASSIVO_EXIGIVEL_NAO_CIRCULANTE',
      cupomAnualBrl: cupomAnual,
      impactoNaDRE: true,
      partidasDobradaEmissao: partidasEmissao,
      partidasDobradaPagamentoCupom: partidasCupom,
      diagnosticoCpc39: diag
    });
  }
}
