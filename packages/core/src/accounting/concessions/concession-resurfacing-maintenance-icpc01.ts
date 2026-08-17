import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ConcessionResurfacingInput {
  concessaoId: string;
  concessionariaNome: string;
  objetoConcessao: string; // Ex: 'Rodovia Concessionada - Ciclo de Recapeamento Asfáltico'
  custoEstimadoDesembolsoRecapeamentoBrl: number; // Ex: R$ 25.000.000 a cada 5 anos
  cicloRecapeamentoAnos: number; // Ex: 5 anos
  anoAtualDoCiclo: number; // Ano 1, 2, 3...
  volumeTrafegoEfetivoVeiculosEquivalentes: number;
  volumeTrafegoTotalProjetadoCiclo: number;
}

export interface ConcessionResurfacingResult {
  concessaoId: string;
  concessionariaNome: string;
  objetoConcessao: string;
  desgasteProporcionalPeriodoPercent: number;
  despesaProvisaoPeriodoDrebBrl: number; // DRE
  saldoAcumuladoProvisaoPassivoBrl: number; // Passivo Não Circulante (CPC 25)
  partidasDobrada: JournalEntryLine[];
  diagnosticoIcpc01Manutencao: string;
}

export function evaluateConcessionResurfacingMaintenanceIcpc01(input: ConcessionResurfacingInput): Result<ConcessionResurfacingResult, Error> {
  const {
    concessaoId,
    concessionariaNome,
    objetoConcessao,
    custoEstimadoDesembolsoRecapeamentoBrl,
    cicloRecapeamentoAnos,
    anoAtualDoCiclo,
    volumeTrafegoEfetivoVeiculosEquivalentes,
    volumeTrafegoTotalProjetadoCiclo
  } = input;

  if (custoEstimadoDesembolsoRecapeamentoBrl <= 0 || cicloRecapeamentoAnos <= 0 || volumeTrafegoTotalProjetadoCiclo <= 0) {
    return Err(new Error('Custo estimado, ciclo e tráfego projetado devem ser superiores a zero.'));
  }

  // ICPC 01 R1 Itens 21-22 e CPC 25:
  // A obrigação contratual de restauração da infraestrutura é uma provisão reconhecida
  // proporcionalmente ao uso/desgaste gerado pelo tráfego em cada período (DRE despesa operacional).
  const proporcaoTrafego = Math.min(1.0, volumeTrafegoEfetivoVeiculosEquivalentes / volumeTrafegoTotalProjetadoCiclo);
  const desgastePercent = Number((proporcaoTrafego * 100).toFixed(2));

  const despesaPeriodo = Number((custoEstimadoDesembolsoRecapeamentoBrl * proporcaoTrafego).toFixed(2));
  const saldoProvisao = despesaPeriodo; // Para o período ou cumulativo

  const partidas: JournalEntryLine[] = [];

  // D: Despesas com Provisão para Manutenção Periódica e Recapeamento (Resultado - ICPC 01 / CPC 25)
  partidas.push({
    accountId: '3.2.1.25',
    accountCode: '3.2.1.25',
    accountName: 'Despesa com Provisão para Restauração e Recapeamento Asfáltico (Resultado - ICPC 01)',
    type: 'DEBIT',
    amount: despesaPeriodo
  });

  // C: Provisão para Manutenção e Restauração de Concessões (Passivo Não Circulante - CPC 25)
  partidas.push({
    accountId: '2.2.2.10',
    accountCode: '2.2.2.10',
    accountName: 'Provisão para Manutenção Periódica de Infraestrutura (Passivo Não Circulante - CPC 25)',
    type: 'CREDIT',
    amount: despesaPeriodo
  });

  const diag = 'ICPC 01 R1 (Itens 21-22 & CPC 25): ' + concessionariaNome + ' - ' + objetoConcessao + '. Ciclo ' + cicloRecapeamentoAnos + ' anos (Ano ' + anoAtualDoCiclo + '). Custo Previsto: R$ ' + custoEstimadoDesembolsoRecapeamentoBrl.toFixed(2) + '. Desgaste pelo Tráfego: ' + desgastePercent + '%. Provisão Constituída na DRE: R$ ' + despesaPeriodo.toFixed(2) + '. Vedada a capitalização em Imobilizado.';

  return Ok({
    concessaoId,
    concessionariaNome,
    objetoConcessao,
    desgasteProporcionalPeriodoPercent: desgastePercent,
    despesaProvisaoPeriodoDrebBrl: despesaPeriodo,
    saldoAcumuladoProvisaoPassivoBrl: saldoProvisao,
    partidasDobrada: partidas,
    diagnosticoIcpc01Manutencao: diag
  });
}
