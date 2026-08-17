import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type SettlementChoiceParty = 'OPCAO_ESCOLHA_EMPREGADO' | 'OPCAO_ESCOLHA_ENTIDADE';

export interface CompoundShareBasedInput {
  planoId: string;
  beneficiarioNome: string; // Ex: 'Diretoria Executiva / Key Executives'
  quemEscolheLiquidacao: SettlementChoiceParty;
  quantidadeOpcoesOuDireitos: number;
  valorJustoAlternativaCaixaBrl: number;   // Valor justo da parcela em caixa (Passivo)
  valorJustoAlternativaAcoesBrl: number;  // Valor justo da parcela em ações
  prazoAquisicaoVestAnos: number;
}

export interface CompoundShareBasedResult {
  planoId: string;
  beneficiarioNome: string;
  quemEscolheLiquidacao: SettlementChoiceParty;
  valorPassivoReconhecidoBrl: number;
  valorPatrimonioLiquidoReconhecidoBrl: number;
  despesaAnualResultadoDREBrl: number;
  partidasDobradaReconhecimentoAno1: JournalEntryLine[];
  diagnosticoCpc10: string;
}

export function evaluateCompoundShareBasedSettlementCpc10(input: CompoundShareBasedInput): Result<CompoundShareBasedResult, Error> {
  const {
    planoId,
    beneficiarioNome,
    quemEscolheLiquidacao,
    quantidadeOpcoesOuDireitos,
    valorJustoAlternativaCaixaBrl,
    valorJustoAlternativaAcoesBrl,
    prazoAquisicaoVestAnos
  } = input;

  if (quantidadeOpcoesOuDireitos <= 0 || prazoAquisicaoVestAnos <= 0 || valorJustoAlternativaAcoesBrl <= 0) {
    return Err(new Error('Quantidade, prazo e valor justo das ações devem ser superiores a zero.'));
  }

  // CPC 10 (R1) Itens 35-38:
  // Se a contraparte tem o direito de escolha:
  // Componente de Passivo = Valor Justo da alternativa em caixa
  // Componente de Patrimônio Líquido = Max(0, Valor Justo da alternativa em ações - Valor Justo da alternativa em caixa)
  const totalPassivo = Number((quantidadeOpcoesOuDireitos * valorJustoAlternativaCaixaBrl).toFixed(2));
  const totalAcoes = Number((quantidadeOpcoesOuDireitos * valorJustoAlternativaAcoesBrl).toFixed(2));
  const totalPL = Number(Math.max(0, totalAcoes - totalPassivo).toFixed(2));

  // Apropriação Linear no Período de Vesting (Ano 1)
  const despesaAno1Passivo = Number((totalPassivo / prazoAquisicaoVestAnos).toFixed(2));
  const despesaAno1PL = Number((totalPL / prazoAquisicaoVestAnos).toFixed(2));
  const despesaTotalAno1 = Number((despesaAno1Passivo + despesaAno1PL).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Despesa com Remuneração Baseada em Ações (Resultado - CPC 10)
  partidas.push({
    accountId: '3.1.2.15',
    accountCode: '3.1.2.15',
    accountName: 'Despesa com Planos de Opção e Remuneração Baseada em Ações (Resultado - CPC 10)',
    type: 'DEBIT',
    amount: despesaTotalAno1
  });

  // C: Provisão para Liquidação em Dinheiro (Passivo Circulante / Não Circulante - CPC 10)
  if (despesaAno1Passivo > 0) {
    partidas.push({
      accountId: '2.1.2.20',
      accountCode: '2.1.2.20',
      accountName: 'Provisão para Remuneração em Ações a Liquidar em Dinheiro (Passivo - CPC 10)',
      type: 'CREDIT',
      amount: despesaAno1Passivo
    });
  }

  // C: Reserva de Opções Outorgadas (Patrimônio Líquido - CPC 10)
  if (despesaAno1PL > 0) {
    partidas.push({
      accountId: '2.4.1.05',
      accountCode: '2.4.1.05',
      accountName: 'Reserva de Remuneração Baseada em Ações Outorgadas (Patrimônio Líquido - CPC 10)',
      type: 'CREDIT',
      amount: despesaAno1PL
    });
  }

  const diag = 'CPC 10 (R1) / IFRS 2 (Instrumento Composto com Escolha de Liquidação): Beneficiário ' + beneficiarioNome + '. Total de ' + quantidadeOpcoesOuDireitos + ' direitos em ' + prazoAquisicaoVestAnos + ' anos. Componente de PASSIVO: R$ ' + totalPassivo.toFixed(2) + '. Componente de PATRIMÔNIO LÍQUIDO: R$ ' + totalPL.toFixed(2) + '. Despesa reconhecida no Ano 1: R$ ' + despesaTotalAno1.toFixed(2) + ' (Passivo R$ ' + despesaAno1Passivo.toFixed(2) + ' + PL R$ ' + despesaAno1PL.toFixed(2) + ').';

  return Ok({
    planoId,
    beneficiarioNome,
    quemEscolheLiquidacao,
    valorPassivoReconhecidoBrl: totalPassivo,
    valorPatrimonioLiquidoReconhecidoBrl: totalPL,
    despesaAnualResultadoDREBrl: despesaTotalAno1,
    partidasDobradaReconhecimentoAno1: partidas,
    diagnosticoCpc10: diag
  });
}
