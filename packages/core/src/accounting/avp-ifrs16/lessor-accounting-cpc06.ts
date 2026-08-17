import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface LessorFinanceLeaseInput {
  contratoArrendamentoId: string;
  arrendatarioNome: string; // Ex: 'Companhia Logística Integrada S.A.'
  descricaoAtivoSubjacente: string; // Ex: 'Frota de Locomotivas Elétricas'
  custoOriginalAtivoBrl: number;
  prazoMeses: number;
  taxaJurosImplicitaMensalPercent: number; // Ex: 1.0% a.m.
  valorParcelaMensalBrl: number;
  valorResidualNaoGarantidoBrl?: number;
}

export interface LessorFinanceLeaseResult {
  contratoArrendamentoId: string;
  arrendatarioNome: string;
  investimentoBrutoArrendamentoBrl: number;
  receitaFinanceiraNaoApropriadaBrl: number;
  investimentoLiquidoArrendamentoBrl: number;
  receitaJurosMes1Brl: number;
  partidasDobradaReconhecimentoInicial: JournalEntryLine[];
  partidasDobradaApropriacaoMes1: JournalEntryLine[];
  diagnosticoCpc06: string;
}

export function evaluateLessorFinanceLeaseCpc06(input: LessorFinanceLeaseInput): Result<LessorFinanceLeaseResult, Error> {
  const {
    contratoArrendamentoId,
    arrendatarioNome,
    descricaoAtivoSubjacente,
    custoOriginalAtivoBrl,
    prazoMeses,
    taxaJurosImplicitaMensalPercent,
    valorParcelaMensalBrl,
    valorResidualNaoGarantidoBrl = 0
  } = input;

  if (custoOriginalAtivoBrl <= 0 || prazoMeses <= 0 || valorParcelaMensalBrl <= 0) {
    return Err(new Error('Custo do ativo, prazo e parcela devem ser superiores a zero.'));
  }

  // Investimento Bruto no Arrendamento = Soma das Parcelas + Valor Residual Não Garantido
  const somaParcelas = Number((valorParcelaMensalBrl * prazoMeses).toFixed(2));
  const investimentoBruto = Number((somaParcelas + valorResidualNaoGarantidoBrl).toFixed(2));

  // O Investimento Líquido no Arrendamento inicial é equivalente ao valor justo/custo do ativo arrendado
  const investimentoLiquidoInicial = custoOriginalAtivoBrl;

  // Receita Financeira a Apropriar (Juros Não Apropriados)
  const receitaNaoApropriada = Number((investimentoBruto - investimentoLiquidoInicial).toFixed(2));

  // Juros Mês 1 = Investimento Líquido Inicial * Taxa Implícita
  const taxaDecimal = taxaJurosImplicitaMensalPercent / 100;
  const receitaJurosMes1 = Number((investimentoLiquidoInicial * taxaDecimal).toFixed(2));
  const amortizacaoPrincipalMes1 = Number((valorParcelaMensalBrl - receitaJurosMes1).toFixed(2));

  const partidasInicial: JournalEntryLine[] = [];

  // D: Investimento Bruto no Arrendamento (Contas a Receber - Ativo Circulante / Não Circulante)
  partidasInicial.push({
    accountId: '1.1.3.10',
    accountCode: '1.1.3.10',
    accountName: 'Contas a Receber de Arrendamento Financeiro (Ativo Circulante / Não Circulante - CPC 06 R2)',
    type: 'DEBIT',
    amount: investimentoBruto
  });
  // C: Receita Financeira a Apropriar de Arrendamento (Conta Redutora do Ativo - CPC 06 R2)
  partidasInicial.push({
    accountId: '1.1.3.11',
    accountCode: '1.1.3.11',
    accountName: '(-) Receitas Financeiras a Apropriar de Arrendamento (Redutora do Ativo - CPC 06 R2)',
    type: 'CREDIT',
    amount: receitaNaoApropriada
  });
  // C: Imobilizado em Operação (Desreconhecimento do Ativo Subjacente)
  partidasInicial.push({
    accountId: '1.2.3.01',
    accountCode: '1.2.3.01',
    accountName: 'Imobilizado Arrendado - Desreconhecimento (Ativo Não Circulante)',
    type: 'CREDIT',
    amount: custoOriginalAtivoBrl
  });

  const partidasMes1: JournalEntryLine[] = [];

  // D: Caixa e Equivalentes de Caixa (Recebimento da Parcela)
  partidasMes1.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Caixa e Bancos Conta Movimento (Ativo Circulante)',
    type: 'DEBIT',
    amount: valorParcelaMensalBrl
  });
  // C: Contas a Receber de Arrendamento Financeiro (Baixa da Parcela Bruta)
  partidasMes1.push({
    accountId: '1.1.3.10',
    accountCode: '1.1.3.10',
    accountName: 'Contas a Receber de Arrendamento Financeiro (Ativo Circulante)',
    type: 'CREDIT',
    amount: valorParcelaMensalBrl
  });
  // D: Receitas Financeiras a Apropriar (Amortização da Redutora)
  partidasMes1.push({
    accountId: '1.1.3.11',
    accountCode: '1.1.3.11',
    accountName: '(-) Receitas Financeiras a Apropriar (Redutora do Ativo - CPC 06 R2)',
    type: 'DEBIT',
    amount: receitaJurosMes1
  });
  // C: Receita Financeira de Arrendamento (Resultado / DRE - CPC 06 R2)
  partidasMes1.push({
    accountId: '3.1.5.01',
    accountCode: '3.1.5.01',
    accountName: 'Receitas Financeiras de Arrendamento Mercantil (Resultado - CPC 06 R2)',
    type: 'CREDIT',
    amount: receitaJurosMes1
  });

  const diag = 'CPC 06 R2 / IFRS 16 (Contabilidade do Arrendador): ' + arrendatarioNome + ' (' + descricaoAtivoSubjacente + '). Investimento Bruto: R$ ' + investimentoBruto.toFixed(2) + ' (Juros a Apropriar: R$ ' + receitaNaoApropriada.toFixed(2) + '). Investimento Líquido Reconhecido: R$ ' + investimentoLiquidoInicial.toFixed(2) + '. Receita de Juros Mês 1: R$ ' + receitaJurosMes1.toFixed(2) + ' (Amortização Principal: R$ ' + amortizacaoPrincipalMes1.toFixed(2) + ').';

  return Ok({
    contratoArrendamentoId,
    arrendatarioNome,
    investimentoBrutoArrendamentoBrl: investimentoBruto,
    receitaFinanceiraNaoApropriadaBrl: receitaNaoApropriada,
    investimentoLiquidoArrendamentoBrl: investimentoLiquidoInicial,
    receitaJurosMes1Brl: receitaJurosMes1,
    partidasDobradaReconhecimentoInicial: partidasInicial,
    partidasDobradaApropriacaoMes1: partidasMes1,
    diagnosticoCpc06: diag
  });
}
