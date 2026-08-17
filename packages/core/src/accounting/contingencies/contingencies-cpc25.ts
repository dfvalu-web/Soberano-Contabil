import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ContingencyType = 'TRABALHISTA' | 'TRIBUTARIA' | 'CIVEL' | 'AMBIENTAL';
export type ContingencyProbability = 'PROVAVEL' | 'POSSIVEL' | 'REMOTA';

export interface LawsuitItem {
  processoId: string;
  numeroProcesso: string;
  tipo: ContingencyType;
  parteContraria: string;
  valorCausa: number;
  melhorEstimativaPerda: number;
  probabilidadePerda: ContingencyProbability;
  parecerJuridicoResumido: string;
}

export interface ContingencyAnalysisResult {
  totalProcessosAnalisados: number;
  totalProvisaoPassivoReconhecida: number;
  totalContingenciaPossivelDivulgadaNota: number;
  totalRiscoRemoto: number;
  partidasDobradaProvisao: JournalEntryLine[];
  resumoDivulgacaoNotaExplicativa: string;
}

export function evaluateContingencies(processos: LawsuitItem[]): Result<ContingencyAnalysisResult, Error> {
  if (!processos || processos.length === 0) {
    return Err(new Error('Nenhum processo informado para avaliação de contingências.'));
  }

  let totalProvisao = 0;
  let totalPossivel = 0;
  let totalRemoto = 0;
  const partidas: JournalEntryLine[] = [];

  for (const proc of processos) {
    if (proc.probabilidadePerda === 'PROVAVEL') {
      totalProvisao = Number((totalProvisao + proc.melhorEstimativaPerda).toFixed(2));
      
      const contaDespesa = proc.tipo === 'TRABALHISTA' ? '4.1.2.09' : proc.tipo === 'TRIBUTARIA' ? '4.1.3.09' : '4.1.4.09';
      const contaPassivo = '2.1.4.01'; // Provisão para Contingências no Passivo

      partidas.push({
        accountId: contaDespesa,
        accountCode: contaDespesa,
        accountName: `Despesas com Provisão para Contingência ${proc.tipo} (Resultado - CPC 25)`,
        type: 'DEBIT',
        amount: proc.melhorEstimativaPerda
      });
      partidas.push({
        accountId: contaPassivo,
        accountCode: contaPassivo,
        accountName: `Provisão para Contingências ${proc.tipo} - Proc. ${proc.numeroProcesso} (Passivo)`,
        type: 'CREDIT',
        amount: proc.melhorEstimativaPerda
      });
    } else if (proc.probabilidadePerda === 'POSSIVEL') {
      totalPossivel = Number((totalPossivel + proc.valorCausa).toFixed(2));
    } else {
      totalRemoto = Number((totalRemoto + proc.valorCausa).toFixed(2));
    }
  }

  const textoNota = `A sociedade possui ações judiciais em andamento avaliadas por seus assessores jurídicos. Foram constituídas provisões no montante de R$ ${totalProvisao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para os processos de perda provável. Os processos com risco de perda possível totalizam R$ ${totalPossivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, não sendo provisionados em conformidade com o CPC 25.`;

  return Ok({
    totalProcessosAnalisados: processos.length,
    totalProvisaoPassivoReconhecida: totalProvisao,
    totalContingenciaPossivelDivulgadaNota: totalPossivel,
    totalRiscoRemoto: totalRemoto,
    partidasDobradaProvisao: partidas,
    resumoDivulgacaoNotaExplicativa: textoNota
  });
}
