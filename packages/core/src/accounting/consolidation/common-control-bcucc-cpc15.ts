import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface CommonControlBcuccInput {
  operacaoId: string;
  holdingControladoraNome: string;
  empresaAdquirenteNome: string;
  empresaTransferidaNome: string;
  valorContraprestacaoPagaBrl: number; // Caixa ou ações emitidas
  valorContabilAtivosTransferidosBrl: number; // Predecessor Book Value
  valorContabilPassivosTransferidosBrl: number;
}

export interface CommonControlBcuccResult {
  operacaoId: string;
  holdingControladoraNome: string;
  empresaAdquirenteNome: string;
  empresaTransferidaNome: string;
  patrimonioLiquidoContabilTransferidoBrl: number;
  isCriacaoGoodwillVedada: boolean; // Vedado no controle comum
  ajusteControleComumPatrimonioLiquidoBrl: number; // Diferença no PL
  partidasDobrada: JournalEntryLine[];
  diagnosticoBcucc: string;
}

export function processCommonControlBcucc(input: CommonControlBcuccInput): Result<CommonControlBcuccResult, Error> {
  const {
    operacaoId,
    holdingControladoraNome,
    empresaAdquirenteNome,
    empresaTransferidaNome,
    valorContraprestacaoPagaBrl,
    valorContabilAtivosTransferidosBrl,
    valorContabilPassivosTransferidosBrl
  } = input;

  if (valorContraprestacaoPagaBrl <= 0 || valorContabilAtivosTransferidosBrl <= 0) {
    return Err(new Error('Contraprestação e ativos transferidos devem ser superiores a zero.'));
  }

  // Método do Valor Contábil Predecessor (Predecessor Accounting / Book Value Method):
  // Ativos e passivos são transferidos pelo valor contábil histórico, sem reavaliação a valor justo.
  const plTransferido = Number((valorContabilAtivosTransferidosBrl - valorContabilPassivosTransferidosBrl).toFixed(2));

  // Diferença entre a contraprestação e o PL contábil transferido é lançada no Patrimônio Líquido
  // (Reserva de Capital / Ajustes de Controle Comum), sem gerar Goodwill comercial nem ganho/perda na DRE.
  const ajustePl = Number((valorContraprestacaoPagaBrl - plTransferido).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // 1. D: Ativos da Transferida (ao Custo Contábil Predecessor)
  partidas.push({
    accountId: '1.2.1.01',
    accountCode: '1.2.1.01',
    accountName: 'Ativos Incorporados sob Controle Comum (Predecessor Book Value - CPC 15)',
    type: 'DEBIT',
    amount: valorContabilAtivosTransferidosBrl
  });

  // 2. C: Passivos da Transferida
  if (valorContabilPassivosTransferidosBrl > 0) {
    partidas.push({
      accountId: '2.1.1.01',
      accountCode: '2.1.1.01',
      accountName: 'Passivos Assumidos sob Controle Comum (CPC 15)',
      type: 'CREDIT',
      amount: valorContabilPassivosTransferidosBrl
    });
  }

  // 3. C: Caixa / Bancos (Contraprestação)
  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento - Pagamento Aquisição (Ativo Circulante)',
    type: 'CREDIT',
    amount: valorContraprestacaoPagaBrl
  });

  // 4. Ajuste no Patrimônio Líquido
  if (ajustePl > 0) {
    // D: Ajuste de Reestruturação sob Controle Comum (Redutor do PL)
    partidas.push({
      accountId: '2.3.3.05',
      accountCode: '2.3.3.05',
      accountName: 'Ajuste de Reestruturação Societária sob Controle Comum (Patrimônio Líquido - CPC 15)',
      type: 'DEBIT',
      amount: ajustePl
    });
  } else if (ajustePl < 0) {
    // C: Reserva de Capital sob Controle Comum (Adição ao PL)
    partidas.push({
      accountId: '2.3.2.06',
      accountCode: '2.3.2.06',
      accountName: 'Reserva de Capital por Combinação sob Controle Comum (Patrimônio Líquido - CPC 15)',
      type: 'CREDIT',
      amount: Math.abs(ajustePl)
    });
  }

  const diag = 'Combinação sob Controle Comum (BCUCC / CPC 15): ' + empresaAdquirenteNome + ' adquiriu ' + empresaTransferidaNome + ' do grupo ' + holdingControladoraNome + '. Método Predecessor: PL Contábil de R$ ' + plTransferido.toFixed(2) + ' incorporado. Contraprestação: R$ ' + valorContraprestacaoPagaBrl.toFixed(2) + '. GOODWILL VEDADO: Diferença de R$ ' + ajustePl.toFixed(2) + ' alocada diretamente no Patrimônio Líquido.';

  return Ok({
    operacaoId,
    holdingControladoraNome,
    empresaAdquirenteNome,
    empresaTransferidaNome,
    patrimonioLiquidoContabilTransferidoBrl: plTransferido,
    isCriacaoGoodwillVedada: true,
    ajusteControleComumPatrimonioLiquidoBrl: ajustePl,
    partidasDobrada: partidas,
    diagnosticoBcucc: diag
  });
}
