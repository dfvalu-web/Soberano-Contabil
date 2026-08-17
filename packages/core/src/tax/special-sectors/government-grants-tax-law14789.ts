import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface GovernmentGrantInput {
  empresaHabilitadaId: string;
  anoExercicio: number;
  enteConcessorNome: string; // Ex: 'Governo do Estado de Minas Gerais'
  tipoAtoConcessorio: 'IMPLANTACAO_EMPREENDIMENTO' | 'EXPANSAO_EMPREENDIMENTO';
  valorReceitaSubvencaoBrl: number;
  custosImplantacaoExpansaoComputaveisBrl: number;
}

export interface GovernmentGrantResult {
  empresaId: string;
  anoExercicio: number;
  receitaSubvencaoTotalBrl: number;
  creditoFiscalIrpjApurado25Percent: number;
  destinacaoReservaIncentivosFiscaisPlBrl: number;
  partidasDobradaSubvencao: JournalEntryLine[];
  diagnosticoLei14789: string;
}

export function calculateGovernmentGrantLaw14789(input: GovernmentGrantInput): Result<GovernmentGrantResult, Error> {
  const { empresaHabilitadaId, anoExercicio, enteConcessorNome, tipoAtoConcessorio, valorReceitaSubvencaoBrl, custosImplantacaoExpansaoComputaveisBrl } = input;

  if (valorReceitaSubvencaoBrl <= 0 || custosImplantacaoExpansaoComputaveisBrl <= 0) {
    return Err(new Error('Receita de subvenção e custos computáveis devem ser superiores a zero.'));
  }

  // Base do crédito limitada ao menor entre a receita de subvenção e as despesas de implantação/expansão
  const baseComputavel = Math.min(valorReceitaSubvencaoBrl, custosImplantacaoExpansaoComputaveisBrl);

  // Crédito Fiscal de 25% de IRPJ (Art. 6º da Lei nº 14.789/2023)
  const creditoFiscal = Number((baseComputavel * 0.25).toFixed(2));

  // Reserva de Incentivos Fiscais (Art. 195-A da Lei nº 6.404/76)
  const partidas: JournalEntryLine[] = [
    {
      accountId: '1.1.2.08',
      accountCode: '1.1.2.08',
      accountName: 'Crédito Fiscal de Subvenção para Investimento (Ativo Circulante - Lei 14.789)',
      type: 'DEBIT',
      amount: creditoFiscal
    },
    {
      accountId: '3.1.5.08',
      accountCode: '3.1.5.08',
      accountName: 'Receita de Crédito Fiscal de Subvenção de IRPJ (Resultado - Lei 14.789)',
      type: 'CREDIT',
      amount: creditoFiscal
    }
  ];

  const diag = 'Novo Marco das Subvenções (Lei nº 14.789/2023): Subvenção de ' + enteConcessorNome + ' (' + tipoAtoConcessorio + '). Apurado Crédito Fiscal de IRPJ de R$ ' + creditoFiscal.toFixed(2) + ' (25% sobre base de R$ ' + baseComputavel.toFixed(2) + ') com destinação obrigatória de R$ ' + valorReceitaSubvencaoBrl.toFixed(2) + ' para a Reserva de Incentivos Fiscais no PL.';

  return Ok({
    empresaId: empresaHabilitadaId,
    anoExercicio,
    receitaSubvencaoTotalBrl: valorReceitaSubvencaoBrl,
    creditoFiscalIrpjApurado25Percent: creditoFiscal,
    destinacaoReservaIncentivosFiscaisPlBrl: valorReceitaSubvencaoBrl,
    partidasDobradaSubvencao: partidas,
    diagnosticoLei14789: diag
  });
}
