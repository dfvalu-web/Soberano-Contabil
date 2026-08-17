import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface MineralExplorationInput {
  projetoJazidaId: string;
  nomeJazidaOuCampo: string; // Ex: 'Jazida de Lítio Vale do Jequitinhonha'
  gastosEstudosTopograficosGeologicosBrl: number;
  gastosPerfuracaoExploratoriaAmostragemBrl: number;
  gastosDireitosMinerariosExploracaoBrl: number;
  viabilidadeComercialDemonstrada: boolean;
}

export interface MineralExplorationResult {
  projetoId: string;
  nomeJazida: string;
  totalAtivoExploracaoAvaliacaoCapitalizadoBrl: number;
  transferidoParaAtivoEmDesenvolvimento: boolean;
  partidasDobradaRecursosMinerais: JournalEntryLine[];
  diagnosticoCpc34: string;
}

export function evaluateMineralResourcesExplorationCpc34(input: MineralExplorationInput): Result<MineralExplorationResult, Error> {
  const {
    projetoJazidaId,
    nomeJazidaOuCampo,
    gastosEstudosTopograficosGeologicosBrl,
    gastosPerfuracaoExploratoriaAmostragemBrl,
    gastosDireitosMinerariosExploracaoBrl,
    viabilidadeComercialDemonstrada
  } = input;

  const totalCapitalizado = Number((gastosEstudosTopograficosGeologicosBrl + gastosPerfuracaoExploratoriaAmostragemBrl + gastosDireitosMinerariosExploracaoBrl).toFixed(2));

  if (totalCapitalizado <= 0) {
    return Err(new Error('Total de gastos de exploração mineral deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (!viabilidadeComercialDemonstrada) {
    // Fase de Exploração e Avaliação (Ativo Intangível/Imobilizado de Exploração - CPC 34)
    partidas.push({
      accountId: '1.2.4.05',
      accountCode: '1.2.4.05',
      accountName: 'Ativos de Exploração e Avaliação Mineral (Ativo Não Circulante - CPC 34)',
      type: 'DEBIT',
      amount: totalCapitalizado
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento / Fornecedores (Ativo/Passivo - CPC 34)',
      type: 'CREDIT',
      amount: totalCapitalizado
    });
  } else {
    // Viabilidade Demonstrada: Transferência para Ativos em Desenvolvimento e Produção
    partidas.push({
      accountId: '1.2.3.15',
      accountCode: '1.2.3.15',
      accountName: 'Jazidas e Minas em Desenvolvimento (Imobilizado em Operação - CPC 34 / CPC 27)',
      type: 'DEBIT',
      amount: totalCapitalizado
    });
    partidas.push({
      accountId: '1.2.4.05',
      accountCode: '1.2.4.05',
      accountName: 'Ativos de Exploração e Avaliação Mineral (Ativo Não Circulante - CPC 34)',
      type: 'CREDIT',
      amount: totalCapitalizado
    });
  }

  const diag = 'CPC 34 / IFRS 6: Projeto ' + nomeJazidaOuCampo + '. Capitalizado R$ ' + totalCapitalizado.toFixed(2) + ' em gastos geológicos e de perfuração. ' + (viabilidadeComercialDemonstrada ? 'Viabilidade comercial atestada: Ativo transferido para Imobilizado em Desenvolvimento/Produção.' : 'Fase de exploração ativa.');

  return Ok({
    projetoId: projetoJazidaId,
    nomeJazida: nomeJazidaOuCampo,
    totalAtivoExploracaoAvaliacaoCapitalizadoBrl: totalCapitalizado,
    transferidoParaAtivoEmDesenvolvimento: viabilidadeComercialDemonstrada,
    partidasDobradaRecursosMinerais: partidas,
    diagnosticoCpc34: diag
  });
}
