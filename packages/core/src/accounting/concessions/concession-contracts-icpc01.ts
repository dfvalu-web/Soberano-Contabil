import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ConcessionModelType = 'ATIVO_INTANGIVEL' | 'ATIVO_FINANCEIRO' | 'MODELO_BIFURCADO_HIBRIDO';

export interface ConcessionContractInput {
  contratoId: string;
  concessionariaNome: string;
  objetoConcessao: string; // Ex: 'Rodovia Federal BR-101' ou 'Concessão de Saneamento'
  tipoModelo: ConcessionModelType;
  custoConstrucaoObrasBrl: number;
  margemConstrucaoPercent: number; // Ex: 10%
  parcelaGarantidaPoderConcedenteBrl?: number; // Para Ativo Financeiro ou Modelo Híbrido
}

export interface ConcessionContractResult {
  contratoId: string;
  tipoModelo: ConcessionModelType;
  receitaConstrucaoApurada: number;
  custoConstrucaoReconhecido: number;
  lucroBrutoConstrucao: number;
  saldoAtivoIntangivelDireitoCobranca: number;
  saldoAtivoFinanceiroContasReceber: number;
  partidasDobradaConstrucao: JournalEntryLine[];
  diagnosticoIcpc01: string;
}

export function evaluateConcessionContractIcpc01(input: ConcessionContractInput): Result<ConcessionContractResult, Error> {
  const { contratoId, concessionariaNome, objetoConcessao, tipoModelo, custoConstrucaoObrasBrl, margemConstrucaoPercent, parcelaGarantidaPoderConcedenteBrl = 0 } = input;

  if (custoConstrucaoObrasBrl <= 0) {
    return Err(new Error('Custo de construção da concessão deve ser superior a zero.'));
  }

  const fatorMargem = 1 + (margemConstrucaoPercent / 100);
  const receitaConstrucao = Number((custoConstrucaoObrasBrl * fatorMargem).toFixed(2));
  const lucroBruto = Number((receitaConstrucao - custoConstrucaoObrasBrl).toFixed(2));

  let ativoIntangivel = 0;
  let ativoFinanceiro = 0;

  if (tipoModelo === 'ATIVO_INTANGIVEL') {
    ativoIntangivel = receitaConstrucao;
    ativoFinanceiro = 0;
  } else if (tipoModelo === 'ATIVO_FINANCEIRO') {
    ativoFinanceiro = receitaConstrucao;
    ativoIntangivel = 0;
  } else {
    // Híbrido
    ativoFinanceiro = Math.min(receitaConstrucao, parcelaGarantidaPoderConcedenteBrl);
    ativoIntangivel = Number((receitaConstrucao - ativoFinanceiro).toFixed(2));
  }

  const partidas: JournalEntryLine[] = [];

  if (ativoIntangivel > 0) {
    partidas.push({
      accountId: '1.2.3.05',
      accountCode: '1.2.3.05',
      accountName: 'Direito de Concessão - Ativo Intangível (ICPC 01)',
      type: 'DEBIT',
      amount: ativoIntangivel
    });
  }

  if (ativoFinanceiro > 0) {
    partidas.push({
      accountId: '1.2.4.08',
      accountCode: '1.2.4.08',
      accountName: 'Contas a Receber do Poder Concedente - Ativo Financeiro (ICPC 01)',
      type: 'DEBIT',
      amount: ativoFinanceiro
    });
  }

  partidas.push({
    accountId: '3.1.1.08',
    accountCode: '3.1.1.08',
    accountName: 'Receita de Construção de Infraestrutura de Concessão (Resultado - CPC 47 / ICPC 01)',
    type: 'CREDIT',
    amount: receitaConstrucao
  });

  const diagnostico = 'Contrato de Concessão ' + contratoId + ' (' + objetoConcessao + '): Modelo ' + tipoModelo + '. Receita de construção reconhecida de R$ ' + receitaConstrucao.toFixed(2) + ' (Margem ' + margemConstrucaoPercent + '%). Ativo Intangível: R$ ' + ativoIntangivel.toFixed(2) + ' / Ativo Financeiro: R$ ' + ativoFinanceiro.toFixed(2) + '.';

  return Ok({
    contratoId,
    tipoModelo,
    receitaConstrucaoApurada: receitaConstrucao,
    custoConstrucaoReconhecido: custoConstrucaoObrasBrl,
    lucroBrutoConstrucao: lucroBruto,
    saldoAtivoIntangivelDireitoCobranca: ativoIntangivel,
    saldoAtivoFinanceiroContasReceber: ativoFinanceiro,
    partidasDobradaConstrucao: partidas,
    diagnosticoIcpc01: diagnostico
  });
}
