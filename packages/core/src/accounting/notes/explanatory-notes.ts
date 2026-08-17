import { Company } from '../../types/company.js';
import { BalanceSheet, IncomeStatement } from '../../types/accounting.js';
import { Result, Ok } from '../../types/result.js';

export interface ExplanatoryNoteItem {
  numero: number;
  titulo: string;
  conteudo: string;
  tabelaApoio?: Array<{ descricao: string; valor: number }>;
}

export interface FinancialNotesReport {
  empresa: string;
  cnpj: string;
  exercicioSocial: string;
  notasExplicativas: ExplanatoryNoteItem[];
}

export function generateExplanatoryNotes(
  company: Company,
  exercicioSocial: string,
  balanceSheet: BalanceSheet,
  incomeStatement: IncomeStatement
): Result<FinancialNotesReport, Error> {
  const notas: ExplanatoryNoteItem[] = [
    {
      numero: 1,
      titulo: 'Informações Gerais e Contexto Operacional',
      conteudo: `A ${company.razaoSocial}, inscrita no CNPJ ${company.cnpj}, com sede em ${company.uf}, tem por objeto social principal as atividades enquadradas no CNAE ${company.cnaePrincipal}. As demonstrações financeiras foram preparadas com base no pressuposto de continuidade operacional.`
    },
    {
      numero: 2,
      titulo: 'Base de Preparação e Apresentação das Demonstrações Contábeis',
      conteudo: 'As demonstrações financeiras foram elaboradas e estão sendo apresentadas em conformidade com as Normas Brasileiras de Contabilidade (NBC TG / CPCs) emitidas pelo Conselho Federal de Contabilidade (CFC) e pronunciamentos do Comitê de Pronunciamentos Contábeis (CPC), alinhados às normas internacionais de contabilidade (IFRS).'
    },
    {
      numero: 3,
      titulo: 'Principais Práticas Contábeis Adotadas',
      conteudo: 'a) Caixa e Equivalentes de Caixa: incluem disponibilidades imediatas e aplicações de alta liquidez; b) Contas a Receber: mensuradas pelo valor nominal das transações deduzidas de perdas estimadas por créditos de liquidação duvidosa (PECLD); c) Estoques: avaliados ao custo médio ponderado de aquisição ou valor realizável líquido, dos dois o menor; d) Imobilizado: mensurado ao custo histórico menos depreciação acumulada com base nas vidas úteis estimadas.'
    },
    {
      numero: 4,
      titulo: 'Composição do Ativo e Passivo',
      conteudo: `O total do ativo apurado no encerramento do exercício é de R$ ${balanceSheet.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, correspondendo exatamente ao total do Passivo e Patrimônio Líquido de R$ ${balanceSheet.totalPassivoEPatrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      tabelaApoio: [
        { descricao: 'Total do Ativo Circulante', valor: balanceSheet.totalAtivo },
        { descricao: 'Total do Patrimônio Líquido', valor: balanceSheet.totalPatrimonioLiquido }
      ]
    },
    {
      numero: 5,
      titulo: 'Resultado do Exercício e Regime Tributário',
      conteudo: `A sociedade apurou o resultado sob o regime de competência, totalizando receitas e custos em conformidade com o CPC 26. O regime tributário adotado é ${company.regimeTributario}.`
    }
  ];

  return Ok({
    empresa: company.razaoSocial,
    cnpj: company.cnpj,
    exercicioSocial,
    notasExplicativas: notas
  });
}
