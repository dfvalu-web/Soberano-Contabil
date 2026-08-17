import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface InsuranceContractGroupInput {
  grupoContratosId: string;
  ramoSeguroNome: string; // Ex: 'Seguro Garantia Corporativo' ou 'Seguro Patrimonial'
  totalPremiosReceberEsperadosVpBrl: number;
  totalSinistrosDespesasEsperadosVpBrl: number;
  ajusteDeRiscoNaoFinanceiroVpBrl: number;
  mesesVigenciaCoberturaTotal: number;
  mesesDecorridosNoPeriodo: number;
}

export interface InsuranceContractGroupResult {
  grupoId: string;
  ramoNome: string;
  fluxosCaixaCumprimentoTotalBrl: number;
  margemServicoContratualCsmInicialBrl: number;
  csmAmortizadaResultadoPeriodoBrl: number;
  saldoCsmRemanescentePassivoBrl: number;
  passivoTotalContratosSeguroBrl: number;
  partidasDobradaSeguros: JournalEntryLine[];
  diagnosticoCpc50: string;
}

export function evaluateInsuranceContractGroupCpc50(input: InsuranceContractGroupInput): Result<InsuranceContractGroupResult, Error> {
  const {
    grupoContratosId,
    ramoSeguroNome,
    totalPremiosReceberEsperadosVpBrl,
    totalSinistrosDespesasEsperadosVpBrl,
    ajusteDeRiscoNaoFinanceiroVpBrl,
    mesesVigenciaCoberturaTotal,
    mesesDecorridosNoPeriodo
  } = input;

  if (totalPremiosReceberEsperadosVpBrl <= 0 || mesesVigenciaCoberturaTotal <= 0) {
    return Err(new Error('Prêmios esperados e meses de cobertura devem ser superiores a zero.'));
  }

  // 1. Fluxos de Caixa de Cumprimento = Sinistros/Despesas VP + Ajuste de Risco
  const fluxosCumprimento = Number((totalSinistrosDespesasEsperadosVpBrl + ajusteDeRiscoNaoFinanceiroVpBrl).toFixed(2));

  // 2. Margem de Serviço Contratual (CSM) = Prêmios VP - Fluxos de Cumprimento
  const csmInicial = Number(Math.max(0, totalPremiosReceberEsperadosVpBrl - fluxosCumprimento).toFixed(2));

  // 3. Amortização da CSM no período (com base nas unidades de cobertura prestadas)
  const fatorAmortizacao = Math.min(1.0, mesesDecorridosNoPeriodo / mesesVigenciaCoberturaTotal);
  const csmAmortizada = Number((csmInicial * fatorAmortizacao).toFixed(2));
  const csmRemanescente = Number((csmInicial - csmAmortizada).toFixed(2));

  // Passivo Total = Fluxos de Cumprimento Remanescentes + Saldo CSM Remanescente
  const passivoTotal = Number((fluxosCumprimento + csmRemanescente).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '2.1.8.01',
      accountCode: '2.1.8.01',
      accountName: 'Margem de Serviço Contratual - CSM (Passivo de Contratos de Seguro - CPC 50)',
      type: 'DEBIT',
      amount: csmAmortizada
    },
    {
      accountId: '3.1.1.10',
      accountCode: '3.1.1.10',
      accountName: 'Receita de Serviços de Seguro - Amortização de CSM (Resultado - CPC 50)',
      type: 'CREDIT',
      amount: csmAmortizada
    }
  ];

  const diag = 'CPC 50 / IFRS 17 (Modelo BBA): Grupo ' + grupoContratosId + ' (' + ramoSeguroNome + '). CSM inicial de R$ ' + csmInicial.toFixed(2) + '. Reconhecida receita de seguro de R$ ' + csmAmortizada.toFixed(2) + ' por amortização de CSM (' + mesesDecorridosNoPeriodo + '/' + mesesVigenciaCoberturaTotal + ' meses). Saldo remanescente de CSM no passivo: R$ ' + csmRemanescente.toFixed(2) + '.';

  return Ok({
    grupoId: grupoContratosId,
    ramoNome: ramoSeguroNome,
    fluxosCaixaCumprimentoTotalBrl: fluxosCumprimento,
    margemServicoContratualCsmInicialBrl: csmInicial,
    csmAmortizadaResultadoPeriodoBrl: csmAmortizada,
    saldoCsmRemanescentePassivoBrl: csmRemanescente,
    passivoTotalContratosSeguroBrl: passivoTotal,
    partidasDobradaSeguros: partidas,
    diagnosticoCpc50: diag
  });
}
