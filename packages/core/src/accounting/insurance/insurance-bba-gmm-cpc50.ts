import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface InsuranceBbaInput {
  grupoContratosId: string;
  seguradoraNome: string; // Ex: 'Soberano Seguros e Previdência S.A.'
  carteiraRamo: string; // Ex: 'Seguro de Vida e Riscos Patrimoniais'
  premioRecebidoVistaBrl: number;
  valorPresenteFluxosCaixaFuturosSinistrosBrl: number; // PVFCF
  ajusteRiscoNaoFinanceiroBrl: number; // Risk Adjustment (RA)
  prazoCoberturaAnos: number;
}

export interface InsuranceBbaResult {
  grupoContratosId: string;
  seguradoraNome: string;
  carteiraRamo: string;
  fluxosCaixaCumprimentoBrl: number; // Fulfillment Cash Flows = PVFCF + RA
  margemServicoContratualInicialCsmBrl: number; // Contractual Service Margin (CSM)
  isGrupoContratoOneroso: boolean;
  perdaImediataOnerosidadeResultadoBrl: number;
  liberacaoCsmAno1ResultadoBrl: number;
  partidasDobradaReconhecimentoInicial: JournalEntryLine[];
  diagnosticoCpc50: string;
}

export function evaluateInsuranceBbaGmmCpc50(input: InsuranceBbaInput): Result<InsuranceBbaResult, Error> {
  const {
    grupoContratosId,
    seguradoraNome,
    carteiraRamo,
    premioRecebidoVistaBrl,
    valorPresenteFluxosCaixaFuturosSinistrosBrl,
    ajusteRiscoNaoFinanceiroBrl,
    prazoCoberturaAnos
  } = input;

  if (premioRecebidoVistaBrl <= 0 || valorPresenteFluxosCaixaFuturosSinistrosBrl < 0 || prazoCoberturaAnos <= 0) {
    return Err(new Error('Prêmio, fluxos de sinistros e prazo devem ser válidos.'));
  }

  // Fluxos de Caixa de Cumprimento (Fulfillment Cash Flows - FCF) = PVFCF + RA
  const fluxosCumprimento = Number((valorPresenteFluxosCaixaFuturosSinistrosBrl + ajusteRiscoNaoFinanceiroBrl).toFixed(2));

  // Cálculo da Margem de Serviço Contratual (CSM):
  // Se Prêmio > Fluxos de Cumprimento -> CSM = Prêmio - FCF (Lucro não realizado no Passivo)
  // Se Prêmio < Fluxos de Cumprimento -> Contrato Oneroso (CSM = 0 e Perda Imediata no Resultado)
  let csmInicial = 0;
  let perdaOnerosa = 0;
  let isOneroso = false;

  if (premioRecebidoVistaBrl >= fluxosCumprimento) {
    csmInicial = Number((premioRecebidoVistaBrl - fluxosCumprimento).toFixed(2));
  } else {
    isOneroso = true;
    perdaOnerosa = Number((fluxosCumprimento - premioRecebidoVistaBrl).toFixed(2));
  }

  // Liberação da CSM no Ano 1
  const liberacaoCsmAno1 = Number((csmInicial / prazoCoberturaAnos).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Caixa / Bancos (Prêmio Recebido)
  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento (Ativo Circulante)',
    type: 'DEBIT',
    amount: premioRecebidoVistaBrl
  });

  // C: Passivo de Cobertura Remanescente - FCF (Passivo - CPC 50)
  partidas.push({
    accountId: '2.1.5.01',
    accountCode: '2.1.5.01',
    accountName: 'Passivo de Cobertura de Seguros - FCF / PVFCF + RA (Passivo - CPC 50)',
    type: 'CREDIT',
    amount: fluxosCumprimento
  });

  if (csmInicial > 0) {
    // C: Margem de Serviço Contratual - CSM (Passivo de Cobertura - CPC 50)
    partidas.push({
      accountId: '2.1.5.02',
      accountCode: '2.1.5.02',
      accountName: 'Margem de Serviço Contratual - CSM (Passivo - CPC 50)',
      type: 'CREDIT',
      amount: csmInicial
    });
  }

  if (perdaOnerosa > 0) {
    // D: Perda em Contratos de Seguros Onerosos (Resultado - CPC 50)
    partidas.push({
      accountId: '3.1.8.20',
      accountCode: '3.1.8.20',
      accountName: 'Perdas em Grupos de Contratos Onerosos (Resultado - CPC 50)',
      type: 'DEBIT',
      amount: perdaOnerosa
    });
  }

  const diag = 'CPC 50 / IFRS 17 (Modelo Geral BBA): ' + seguradoraNome + ' (' + carteiraRamo + '). Prêmio R$ ' + premioRecebidoVistaBrl.toFixed(2) + ' vs FCF R$ ' + fluxosCumprimento.toFixed(2) + ' (PVFCF R$ ' + valorPresenteFluxosCaixaFuturosSinistrosBrl.toFixed(2) + ' + RA R$ ' + ajusteRiscoNaoFinanceiroBrl.toFixed(2) + '). ' + (isOneroso ? 'GRUPO ONEROSO: Perda imediata na DRE de R$ ' + perdaOnerosa.toFixed(2) + '.' : 'CSM Constituída: R$ ' + csmInicial.toFixed(2) + ' (Liberação Ano 1: R$ ' + liberacaoCsmAno1.toFixed(2) + ').');

  return Ok({
    grupoContratosId,
    seguradoraNome,
    carteiraRamo,
    fluxosCaixaCumprimentoBrl: fluxosCumprimento,
    margemServicoContratualInicialCsmBrl: csmInicial,
    isGrupoContratoOneroso: isOneroso,
    perdaImediataOnerosidadeResultadoBrl: perdaOnerosa,
    liberacaoCsmAno1ResultadoBrl: liberacaoCsmAno1,
    partidasDobradaReconhecimentoInicial: partidas,
    diagnosticoCpc50: diag
  });
}
