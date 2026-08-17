import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type RegulatoryAccountType = 'ATIVO_REGULATORIO_REPASSE_TARIFARIO' | 'PASSIVO_REGULATORIO_DEVOLUCAO_CONSUMIDOR';

export interface RegulatoryAccountInput {
  concessaoId: string;
  concessionariaNome: string; // Ex: 'Distribuidora de Energia do Sudeste S.A.'
  tipoContaRegulatoria: RegulatoryAccountType;
  descricaoComponente: string; // Ex: 'CVA - Variação Parcela A e Encargos Setoriais CDE'
  custosNaoGerenciaveisEfetivosBrl: number;
  custosCobertosTarifaBrl: number;
}

export interface RegulatoryAccountResult {
  concessaoId: string;
  concessionariaNome: string;
  tipoContaRegulatoria: RegulatoryAccountType;
  variacaoRegulatoriaLiquidaBrl: number;
  saldoAtivoRegulatorioPassivoBrl: number;
  partidasDobradaReconhecimento: JournalEntryLine[];
  diagnosticoRegulatorio: string;
}

export function evaluateRegulatoryDeferralAccountsIfrs14(input: RegulatoryAccountInput): Result<RegulatoryAccountResult, Error> {
  const {
    concessaoId,
    concessionariaNome,
    tipoContaRegulatoria,
    descricaoComponente,
    custosNaoGerenciaveisEfetivosBrl,
    custosCobertosTarifaBrl
  } = input;

  if (custosNaoGerenciaveisEfetivosBrl < 0 || custosCobertosTarifaBrl < 0) {
    return Err(new Error('Custos regulatórios não podem ser negativos.'));
  }

  // Variação da Parcela A (CVA): Custos Efetivos - Cobertura Tarifária
  const variacaoLiquida = Number((custosNaoGerenciaveisEfetivosBrl - custosCobertosTarifaBrl).toFixed(2));
  const partidas: JournalEntryLine[] = [];

  if (variacaoLiquida > 0) {
    // ATIVO REGULATÓRIO (Direito a Repasse Tarifário Futuro): D: Ativo Regulatório / C: Receita Regulatória (DRE)
    partidas.push({
      accountId: '1.1.4.15',
      accountCode: '1.1.4.15',
      accountName: 'Ativos Regulatórios a Compensar na Tarifa - CVA (Ativo Circulante / Não Circulante - IFRS 14)',
      type: 'DEBIT',
      amount: variacaoLiquida
    });
    partidas.push({
      accountId: '3.1.1.12',
      accountCode: '3.1.1.12',
      accountName: 'Receitas Operacionais de Compensações Regulatórias (Resultado - IFRS 14 / ANEEL)',
      type: 'CREDIT',
      amount: variacaoLiquida
    });

    const diag = 'IFRS 14 / CPC 48 & ANEEL (Ativos Regulatórios): ' + concessionariaNome + ' (' + descricaoComponente + '). Custo efetivo de R$ ' + custosNaoGerenciaveisEfetivosBrl.toFixed(2) + ' superou a tarifa de R$ ' + custosCobertosTarifaBrl.toFixed(2) + '. Reconhecido ATIVO REGULATÓRIO de R$ ' + variacaoLiquida.toFixed(2) + ' a ser compensado no próximo reajuste tarifário anual.';

    return Ok({
      concessaoId,
      concessionariaNome,
      tipoContaRegulatoria: 'ATIVO_REGULATORIO_REPASSE_TARIFARIO',
      variacaoRegulatoriaLiquidaBrl: variacaoLiquida,
      saldoAtivoRegulatorioPassivoBrl: variacaoLiquida,
      partidasDobradaReconhecimento: partidas,
      diagnosticoRegulatorio: diag
    });
  } else {
    // PASSIVO REGULATÓRIO (Obrigação de Devolução aos Consumidores): D: Dedução de Receita (DRE) / C: Passivo Regulatório
    const valorPassivo = Math.abs(variacaoLiquida);
    partidas.push({
      accountId: '3.1.1.13',
      accountCode: '3.1.1.13',
      accountName: 'Dedução da Receita por Devolução Regulatória (Resultado - IFRS 14 / ANEEL)',
      type: 'DEBIT',
      amount: valorPassivo
    });
    partidas.push({
      accountId: '2.1.4.20',
      accountCode: '2.1.4.20',
      accountName: 'Passivos Regulatórios a Devolver na Tarifa (Passivo Circulante - IFRS 14)',
      type: 'CREDIT',
      amount: valorPassivo
    });

    const diag = 'IFRS 14 / CPC 48 & ANEEL (Passivos Regulatórios): ' + concessionariaNome + ' (' + descricaoComponente + '). Tarifa cobrada superior aos custos em R$ ' + valorPassivo.toFixed(2) + '. Reconhecido PASSIVO REGULATÓRIO de R$ ' + valorPassivo.toFixed(2) + ' a ser devolvido na tarifa.';

    return Ok({
      concessaoId,
      concessionariaNome,
      tipoContaRegulatoria: 'PASSIVO_REGULATORIO_DEVOLUCAO_CONSUMIDOR',
      variacaoRegulatoriaLiquidaBrl: variacaoLiquida,
      saldoAtivoRegulatorioPassivoBrl: valorPassivo,
      partidasDobradaReconhecimento: partidas,
      diagnosticoRegulatorio: diag
    });
  }
}
