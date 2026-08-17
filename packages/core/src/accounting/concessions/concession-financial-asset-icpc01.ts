import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ConcessionFinancialAssetInput {
  contratoId: string;
  concessionariaNome: string;
  poderConcedenteEnte: string; // Ex: 'Governo do Estado de SP'
  custoConstrucaoInfraestruturaBrl: number;
  margemConstrucaoPercent: number; // Ex: 10% de margem na fase de obras
  taxaEfetivaJurosRemuneracaoAnualPercent: number; // Ex: 8,5% a.a.
  prazoOperacaoAnos: number;
}

export interface ConcessionFinancialAssetResult {
  contratoId: string;
  concessionariaNome: string;
  poderConcedenteEnte: string;
  receitaConstrucaoReconhecidaBrl: number; // CPC 47 / ICPC 01
  valorInicialAtivoFinanceiroConcessaoBrl: number; // CPC 48 / ICPC 01
  receitaFinanceiraJurosAno1Brl: number;
  partidasDobradaConstrucao: JournalEntryLine[];
  diagnosticoIcpc01: string;
}

export function evaluateConcessionFinancialAssetIcpc01(input: ConcessionFinancialAssetInput): Result<ConcessionFinancialAssetResult, Error> {
  const {
    contratoId,
    concessionariaNome,
    poderConcedenteEnte,
    custoConstrucaoInfraestruturaBrl,
    margemConstrucaoPercent,
    taxaEfetivaJurosRemuneracaoAnualPercent,
    prazoOperacaoAnos
  } = input;

  if (custoConstrucaoInfraestruturaBrl <= 0 || prazoOperacaoAnos <= 0) {
    return Err(new Error('Custo de construção e prazo de operação devem ser superiores a zero.'));
  }

  // 1. Receita de Construção (Fase de Obras): Custo + Margem de Construção
  const receitaConstrucao = Number((custoConstrucaoInfraestruturaBrl * (1 + (margemConstrucaoPercent / 100))).toFixed(2));

  // 2. Reconhecimento Inicial do Ativo Financeiro de Concessão (Direito Incondicional de Receber Caixa do Poder Público)
  const ativoFinanceiroInicial = receitaConstrucao;

  // 3. Receita Financeira do Ano 1 (Juros Efetivos pelo Custo Amortizado - CPC 48)
  const receitaFinanceiraAno1 = Number((ativoFinanceiroInicial * (taxaEfetivaJurosRemuneracaoAnualPercent / 100)).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Ativo Financeiro de Concessão (Contas a Receber de Longo Prazo - ICPC 01 / CPC 48)
  partidas.push({
    accountId: '1.2.2.05',
    accountCode: '1.2.2.05',
    accountName: 'Ativo Financeiro de Concessão - PPP com Garantia Pública (Ativo Não Circulante - ICPC 01)',
    type: 'DEBIT',
    amount: ativoFinanceiroInicial
  });

  // C: Receita de Construção de Infraestrutura de Concessão (Resultado - CPC 47)
  partidas.push({
    accountId: '3.1.1.20',
    accountCode: '3.1.1.20',
    accountName: 'Receita de Construção de Infraestrutura de Concessão (Resultado - ICPC 01 / CPC 47)',
    type: 'CREDIT',
    amount: receitaConstrucao
  });

  // D: Custo de Construção de Infraestrutura (Resultado)
  partidas.push({
    accountId: '3.2.1.20',
    accountCode: '3.2.1.20',
    accountName: 'Custos de Construção da Infraestrutura de Concessão (Resultado - ICPC 01)',
    type: 'DEBIT',
    amount: custoConstrucaoInfraestruturaBrl
  });

  // C: Caixa / Fornecedores de Obras (Ativo Circulante)
  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento - Gastos de Obras (Ativo Circulante)',
    type: 'CREDIT',
    amount: custoConstrucaoInfraestruturaBrl
  });

  const diag = 'ICPC 01 R1 / IFRIC 12 (Modelo do Ativo Financeiro): ' + concessionariaNome + ' (Concedente: ' + poderConcedenteEnte + '). Obras R$ ' + custoConstrucaoInfraestruturaBrl.toFixed(2) + ' (Margem ' + margemConstrucaoPercent + '%). Receita de Construção: R$ ' + receitaConstrucao.toFixed(2) + '. Ativo Financeiro Constituído: R$ ' + ativoFinanceiroInicial.toFixed(2) + ' (Receita Financeira Ano 1: R$ ' + receitaFinanceiraAno1.toFixed(2) + ' a ' + taxaEfetivaJurosRemuneracaoAnualPercent + '% a.a.). Sem geração de Ativo Intangível.';

  return Ok({
    contratoId,
    concessionariaNome,
    poderConcedenteEnte,
    receitaConstrucaoReconhecidaBrl: receitaConstrucao,
    valorInicialAtivoFinanceiroConcessaoBrl: ativoFinanceiroInicial,
    receitaFinanceiraJurosAno1Brl: receitaFinanceiraAno1,
    partidasDobradaConstrucao: partidas,
    diagnosticoIcpc01: diag
  });
}
