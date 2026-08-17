const fs = require('fs');

const b64 = Buffer.from(`import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type SubsequentEventType = 'EVENTO_AJUSTAVEL' | 'EVENTO_NAO_AJUSTAVEL_DIVULGAVEL';

export interface SubsequentEventInput {
  eventoId: string;
  dataOcorrencia: string; // Ex: '2026-02-15' (após encerramento de 2025-12-31 e antes da emissão)
  dataEncerramentoExercicio: string; // Ex: '2025-12-31'
  descricaoFato: string;
  tipoEvento: SubsequentEventType;
  valorImpactoFinanceiroEstimado: number;
  motivoEnquadramento: string;
}

export interface SubsequentEventResult {
  eventoId: string;
  tipoEvento: SubsequentEventType;
  exigeAjustePatrimonial: boolean;
  exigeDivulgacaoNotaExplicativa: boolean;
  partidasDobradaAjuste?: JournalEntryLine[];
  minutaNotaExplicativaDivulgacao?: string;
  diagnosticoCpc24: string;
}

export function processSubsequentEventCpc24(input: SubsequentEventInput): Result<SubsequentEventResult, Error> {
  const { eventoId, dataOcorrencia, descricaoFato, tipoEvento, valorImpactoFinanceiroEstimado, motivoEnquadramento } = input;

  if (valorImpactoFinanceiroEstimado < 0) {
    return Err(new Error('Valor de impacto do evento subsequente não pode ser negativo.'));
  }

  if (tipoEvento === 'EVENTO_AJUSTAVEL') {
    // Ex: Sentença judicial definitiva ou perda de cliente insolvente existente no balanço
    const partidas: JournalEntryLine[] = [
      {
        accountId: '3.2.1.08',
        accountCode: '3.2.1.08',
        accountName: 'Despesa com Perdas em Eventos Subsequentes (Resultado - CPC 24)',
        type: 'DEBIT',
        amount: valorImpactoFinanceiroEstimado
      },
      {
        accountId: '1.1.3.99',
        accountCode: '1.1.3.99',
        accountName: 'Provisão para Ajustes de Eventos Subsequentes (Ativo/Passivo - CPC 24)',
        type: 'CREDIT',
        amount: valorImpactoFinanceiroEstimado
      }
    ];

    return Ok({
      eventoId,
      tipoEvento,
      exigeAjustePatrimonial: true,
      exigeDivulgacaoNotaExplicativa: false,
      partidasDobradaAjuste: partidas,
      diagnosticoCpc24: 'CPC 24: Evento originou evidência de condição preexistente em ' + input.dataEncerramentoExercicio + '. Realizado ajuste contábil retroativo no montante de R$ ' + valorImpactoFinanceiroEstimado.toFixed(2) + '.'
    });
  } else {
    // Evento Não Ajustável mas Divulgável (Ex: Sinistro de incêndio ou variação cambial extraordinária)
    const nota = 'NOTA EXPLICATIVA Nº XX - EVENTOS SUBSEQUENTES (CPC 24 / IAS 10): Em ' + dataOcorrencia + ', ocorreu o seguinte fato relevante: ' + descricaoFato + ' (' + motivoEnquadramento + '), com impacto financeiro estimado de R$ ' + valorImpactoFinanceiroEstimado.toFixed(2) + '. Por se tratar de condição originada após o encerramento do exercício, este evento não requer ajuste nos saldos contábeis patrimoniais, sendo divulgado tempestivamente aos acionistas e ao mercado.';

    return Ok({
      eventoId,
      tipoEvento,
      exigeAjustePatrimonial: false,
      exigeDivulgacaoNotaExplicativa: true,
      minutaNotaExplicativaDivulgacao: nota,
      diagnosticoCpc24: 'CPC 24: Condição originada após a data do balanço. Ajuste contábil vedado; minuta de Nota Explicativa gerada para publicação.'
    });
  }
}
`, 'utf8').toString('base64');

fs.writeFileSync('packages/core/src/accounting/closing/subsequent-events-cpc24.ts', Buffer.from(b64, 'base64').toString('utf8'), 'utf8');
console.log('Cleaned subsequent-events-cpc24.ts.');
