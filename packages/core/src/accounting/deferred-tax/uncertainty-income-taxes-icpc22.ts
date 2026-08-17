import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type UncertaintyMeasurementMethod = 'VALOR_MAIS_PROVAVEL_SINGLE_MOST_LIKELY' | 'VALOR_ESPERADO_PROBABILIDADE_PONDERADA';

export interface TaxUncertaintyScenario {
  cenarioDescricao: string;
  valorPassivoExigivelBrl: number;
  probabilidadeOcorrenciaPercent: number;
}

export interface UncertaintyIncomeTaxesInput {
  posicaoFiscalId: string;
  descricaoTratamentoIncertos: string; // Ex: 'Amortização Fiscal de Ágio por Empresa Veículo'
  probabilidadeAceitacaoPeloFiscoPercent: number; // Ex: 40% (< 50% exige provisão)
  metodoMensuracao: UncertaintyMeasurementMethod;
  cenariosFiscais: TaxUncertaintyScenario[];
}

export interface UncertaintyIncomeTaxesResult {
  posicaoFiscalId: string;
  descricaoTratamentoIncertos: string;
  provavelAceitacaoPeloFisco: boolean;
  metodoMensuracaoUtilizado: UncertaintyMeasurementMethod;
  passivoFiscalAdicionalReconhecidoBrl: number;
  partidasDobradaProvisaoFiscal: JournalEntryLine[];
  diagnosticoIcpc22: string;
}

export function evaluateUncertaintyIncomeTaxTreatmentsIcpc22(input: UncertaintyIncomeTaxesInput): Result<UncertaintyIncomeTaxesResult, Error> {
  const {
    posicaoFiscalId,
    descricaoTratamentoIncertos,
    probabilidadeAceitacaoPeloFiscoPercent,
    metodoMensuracao,
    cenariosFiscais
  } = input;

  if (cenariosFiscais.length === 0) {
    return Err(new Error('Pelo menos um cenário fiscal de probabilidade deve ser informado.'));
  }

  // ICPC 22 / IFRIC 23: Se for PROVÁVEL que a autoridade fiscal aceitará (>= 50%), não reconhece passivo adicional
  const isAceito = probabilidadeAceitacaoPeloFiscoPercent >= 50.0;
  let passivoAdicional = 0;

  if (!isAceito) {
    if (metodoMensuracao === 'VALOR_MAIS_PROVAVEL_SINGLE_MOST_LIKELY') {
      // Seleciona o cenário com a maior probabilidade individual
      let maiorProb = -1;
      let cenarioMaisProvavel = cenariosFiscais[0];
      for (const c of cenariosFiscais) {
        if (c.probabilidadeOcorrenciaPercent > maiorProb) {
          maiorProb = c.probabilidadeOcorrenciaPercent;
          cenarioMaisProvavel = c;
        }
      }
      passivoAdicional = cenarioMaisProvavel.valorPassivoExigivelBrl;
    } else {
      // Método do Valor Esperado (Soma Ponderada: Sum(valor * prob))
      let somaPonderada = 0;
      for (const c of cenariosFiscais) {
        somaPonderada += c.valorPassivoExigivelBrl * (c.probabilidadeOcorrenciaPercent / 100);
      }
      passivoAdicional = Number(somaPonderada.toFixed(2));
    }
  }

  const partidas: JournalEntryLine[] = [];

  if (passivoAdicional > 0) {
    // D: Despesa de IRPJ e CSLL - Incertezas Tributárias (Resultado - ICPC 22)
    partidas.push({
      accountId: '3.1.9.05',
      accountCode: '3.1.9.05',
      accountName: 'Despesa com IRPJ/CSLL sobre Incertezas Tributárias (Resultado - ICPC 22)',
      type: 'DEBIT',
      amount: passivoAdicional
    });
    // C: Passivo Fiscal de Tributos sobre o Lucro Incertos (Passivo Circulante/Não Circulante - ICPC 22)
    partidas.push({
      accountId: '2.1.3.15',
      accountCode: '2.1.3.15',
      accountName: 'Provisão para Incertezas sobre Tratamentos Tributários de IRPJ/CSLL (Passivo - ICPC 22)',
      type: 'CREDIT',
      amount: passivoAdicional
    });
  }

  const diag = 'ICPC 22 / IFRIC 23 (Incertezas sobre Tributos sobre o Lucro): Posição ' + descricaoTratamentoIncertos + '. Probabilidade de Aceitação pelo Fisco: ' + probabilidadeAceitacaoPeloFiscoPercent + '% (' + (isAceito ? 'PROVÁVEL ACEITAÇÃO - Passivo adicional R$ 0,00' : 'IMPROVÁVEL ACEITAÇÃO - Passivo adicional de R$ ' + passivoAdicional.toFixed(2) + ' mensurado pelo método ' + metodoMensuracao) + ').';

  return Ok({
    posicaoFiscalId,
    descricaoTratamentoIncertos,
    provavelAceitacaoPeloFisco: isAceito,
    metodoMensuracaoUtilizado: metodoMensuracao,
    passivoFiscalAdicionalReconhecidoBrl: passivoAdicional,
    partidasDobradaProvisaoFiscal: partidas,
    diagnosticoIcpc22: diag
  });
}
