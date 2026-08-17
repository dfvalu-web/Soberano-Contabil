import { Result, Ok } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ForexRevaluationInput {
  transacaoId: string;
  moedaEstrangeira: 'USD' | 'EUR' | 'GBP';
  saldoMoedaEstrangeira: number; // e.g. $ 100,000.00
  taxaCambialPtaxAnterior: number; // e.g. R$ 5.00
  taxaCambialPtaxFechamento: number; // e.g. R$ 5.40
  tipoItemMonetario: 'CLIENTES_EXTERIOR_ATIVO' | 'FORNECEDORES_EXTERIOR_PASSIVO';
  opcaoTributariaLalur: 'REGIME_DE_COMPETENCIA' | 'REGIME_DE_CAIXA';
}

export interface ForexRevaluationResult {
  transacaoId: string;
  moeda: string;
  saldoMoedaEstrangeira: number;
  valorContabilAnteriorBrl: number;
  novoValorContabilFechamentoBrl: number;
  variacaoCambialApurada: number;
  tipoVariacao: 'VAR_CAMBIAL_ATIVA_RECEITA' | 'VAR_CAMBIAL_PASSIVA_DESPESA' | 'SEM_VARIACAO';
  impactoLalurTrimestre: number;
  partidasDobradaSugeridas: JournalEntryLine[];
}

export function calculateForexRevaluation(input: ForexRevaluationInput): Result<ForexRevaluationResult, Error> {
  const {
    transacaoId,
    moedaEstrangeira,
    saldoMoedaEstrangeira,
    taxaCambialPtaxAnterior,
    taxaCambialPtaxFechamento,
    tipoItemMonetario,
    opcaoTributariaLalur
  } = input;

  const valorAnterior = Number((saldoMoedaEstrangeira * taxaCambialPtaxAnterior).toFixed(2));
  const valorFechamento = Number((saldoMoedaEstrangeira * taxaCambialPtaxFechamento).toFixed(2));
  const diffCambial = Number((valorFechamento - valorAnterior).toFixed(2));

  let tipoVariacao: 'VAR_CAMBIAL_ATIVA_RECEITA' | 'VAR_CAMBIAL_PASSIVA_DESPESA' | 'SEM_VARIACAO' = 'SEM_VARIACAO';
  const partidas: JournalEntryLine[] = [];

  if (tipoItemMonetario === 'CLIENTES_EXTERIOR_ATIVO') {
    if (diffCambial > 0) {
      tipoVariacao = 'VAR_CAMBIAL_ATIVA_RECEITA';
      // D: Clientes Exterior / C: Variação Cambial Ativa (Receita Financeira)
      partidas.push({
        accountId: '1.1.2.02',
        accountCode: '1.1.2.02',
        accountName: 'Clientes no Exterior (Ativo Circulante - CPC 02)',
        type: 'DEBIT',
        amount: Math.abs(diffCambial)
      });
      partidas.push({
        accountId: '3.1.3.01',
        accountCode: '3.1.3.01',
        accountName: 'Variações Monetárias Ativas / Cambiais (Resultado)',
        type: 'CREDIT',
        amount: Math.abs(diffCambial)
      });
    } else if (diffCambial < 0) {
      tipoVariacao = 'VAR_CAMBIAL_PASSIVA_DESPESA';
      // D: Variação Cambial Passiva / C: Clientes Exterior
      partidas.push({
        accountId: '4.1.3.05',
        accountCode: '4.1.3.05',
        accountName: 'Variações Monetárias Passivas / Cambiais (Resultado)',
        type: 'DEBIT',
        amount: Math.abs(diffCambial)
      });
      partidas.push({
        accountId: '1.1.2.02',
        accountCode: '1.1.2.02',
        accountName: 'Clientes no Exterior (Ativo Circulante - CPC 02)',
        type: 'CREDIT',
        amount: Math.abs(diffCambial)
      });
    }
  }

  // Impacto LALUR: Se regime de caixa, a variação não realizada é excluída/adicionada no LALUR (diferimento)
  const impactoLalur = opcaoTributariaLalur === 'REGIME_DE_COMPETENCIA' ? diffCambial : 0;

  return Ok({
    transacaoId,
    moeda: moedaEstrangeira,
    saldoMoedaEstrangeira,
    valorContabilAnteriorBrl: valorAnterior,
    novoValorContabilFechamentoBrl: valorFechamento,
    variacaoCambialApurada: diffCambial,
    tipoVariacao,
    impactoLalurTrimestre: impactoLalur,
    partidasDobradaSugeridas: partidas
  });
}
