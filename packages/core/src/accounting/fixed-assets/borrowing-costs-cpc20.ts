import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface BorrowingCostsInput {
  ativoQualificavelId: string;
  descricaoAtivo: string; // Ex: 'Construção de Usina Fotovoltaica'
  jurosIncorridosEmprestimoEspecificoBrl: number;
  receitaFinanceiraAplicacaoTemporariaBrl: number;
  gastosGeraisNoAtivoBrl?: number;
  taxaMediaPonderadaFinanciamentosGeraisPercentAno?: number;
}

export interface BorrowingCostsResult {
  ativoId: string;
  descricao: string;
  jurosLiquidosCapitalizadosEmprestimoEspecifico: number;
  jurosCapitalizadosFinanciamentosGerais: number;
  totalCustosEmprestimosCapitalizadosNoAtivo: number;
  partidasDobradaCapitalizacao: JournalEntryLine[];
  diagnosticoCpc20: string;
}

export function calculateBorrowingCostsCapitalizationCpc20(input: BorrowingCostsInput): Result<BorrowingCostsResult, Error> {
  const {
    ativoQualificavelId,
    descricaoAtivo,
    jurosIncorridosEmprestimoEspecificoBrl,
    receitaFinanceiraAplicacaoTemporariaBrl,
    gastosGeraisNoAtivoBrl = 0,
    taxaMediaPonderadaFinanciamentosGeraisPercentAno = 0
  } = input;

  if (jurosIncorridosEmprestimoEspecificoBrl < 0) {
    return Err(new Error('Juros incorridos não podem ser negativos.'));
  }

  // 1. Empréstimo Específico: Juros incorridos - Receitas financeiras de aplicação temporária
  const jurosEspLiquidos = Number(Math.max(0, jurosIncorridosEmprestimoEspecificoBrl - receitaFinanceiraAplicacaoTemporariaBrl).toFixed(2));

  // 2. Financiamentos Gerais (se houver)
  const jurosGerais = Number((gastosGeraisNoAtivoBrl * (taxaMediaPonderadaFinanciamentosGeraisPercentAno / 100)).toFixed(2));

  const totalCapitalizado = Number((jurosEspLiquidos + jurosGerais).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.2.3.09',
      accountCode: '1.2.3.09',
      accountName: 'Imobilizado em Construção - Custos de Empréstimos (Ativo Não Circulante - CPC 20)',
      type: 'DEBIT',
      amount: totalCapitalizado
    },
    {
      accountId: '2.1.4.05',
      accountCode: '2.1.4.05',
      accountName: 'Juros e Encargos Financeiros a Pagar (Passivo Circulante - CPC 20)',
      type: 'CREDIT',
      amount: totalCapitalizado
    }
  ];

  const diag = 'CPC 20 (R1) / IAS 23: Ativo Qualificável ' + descricaoAtivo + '. Capitalizado R$ ' + totalCapitalizado.toFixed(2) + ' no custo da obra (Juros Específicos líquidos: R$ ' + jurosEspLiquidos.toFixed(2) + ' / Financiamentos Gerais: R$ ' + jurosGerais.toFixed(2) + ').';

  return Ok({
    ativoId: ativoQualificavelId,
    descricao: descricaoAtivo,
    jurosLiquidosCapitalizadosEmprestimoEspecifico: jurosEspLiquidos,
    jurosCapitalizadosFinanciamentosGerais: jurosGerais,
    totalCustosEmprestimosCapitalizadosNoAtivo: totalCapitalizado,
    partidasDobradaCapitalizacao: partidas,
    diagnosticoCpc20: diag
  });
}
