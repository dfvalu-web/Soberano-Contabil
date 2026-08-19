import { Result, Ok, Err } from '../types/result.js';

export interface FeeInvoiceItem {
  faturaId: string;
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  valorHonorarioBaseBrl: number;
  valorServicosExtrasBrl: number;
  incluir13Honorario: boolean;
  diasAtraso: number;
}

export interface FeeCollectionResult {
  faturaId: string;
  clienteCnpj: string;
  razaoSocial: string;
  valorTotalFaturaBrl: number;
  valorMultaMoraBrl: number; // 2%
  valorJurosMoraBrl: number; // 1% ao mês pro-rata
  totalLiquidoCobradoBrl: number;
  etapaReguaCobranca: 'D_MENOS_3_LEMBRETE' | 'D_ZERO_VENCIMENTO' | 'D_MAIS_5_COBRANCA_AMIGAVEL' | 'D_MAIS_15_NOTIFICACAO_EXTRAJUDICIAL' | 'EM_DIA';
  chavePixCopiaECola: string;
  statusCobranca: 'FATURA_PROCESSADA_REGUA_ATIVA';
  diagnosticoCobranca: string;
}

export function processOfficeFeesCollectionDunningEngine(input: FeeInvoiceItem): Result<FeeCollectionResult, Error> {
  const {
    faturaId,
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    valorHonorarioBaseBrl,
    valorServicosExtrasBrl,
    incluir13Honorario,
    diasAtraso
  } = input;

  if (!clienteCnpj || valorHonorarioBaseBrl <= 0) {
    return Err(new Error('CNPJ do cliente e valor base de honorários são obrigatórios.'));
  }

  let totalFatura = valorHonorarioBaseBrl + valorServicosExtrasBrl;
  if (incluir13Honorario) {
    totalFatura += valorHonorarioBaseBrl; // Dobra no mês do 13º
  }

  let multa = 0;
  let juros = 0;
  let etapa: 'D_MENOS_3_LEMBRETE' | 'D_ZERO_VENCIMENTO' | 'D_MAIS_5_COBRANCA_AMIGAVEL' | 'D_MAIS_15_NOTIFICACAO_EXTRAJUDICIAL' | 'EM_DIA' = 'EM_DIA';

  if (diasAtraso > 0) {
    multa = totalFatura * 0.02; // Multa 2%
    juros = totalFatura * (0.01 * (diasAtraso / 30)); // 1% ao mês
    if (diasAtraso >= 15) etapa = 'D_MAIS_15_NOTIFICACAO_EXTRAJUDICIAL';
    else if (diasAtraso >= 5) etapa = 'D_MAIS_5_COBRANCA_AMIGAVEL';
    else etapa = 'D_ZERO_VENCIMENTO';
  } else if (diasAtraso === 0) {
    etapa = 'D_ZERO_VENCIMENTO';
  } else if (diasAtraso >= -3) {
    etapa = 'D_MENOS_3_LEMBRETE';
  }

  const totalComEncargos = totalFatura + multa + juros;
  const pix = "00020126580014br.gov.bcb.pix0114soberanocontabil" + faturaId + "5204000053039865408" + totalComEncargos.toFixed(2) + "5802BR5916SOBERANO CONTAB6009SAO PAULO62070503***6304ABCD";

  const diag = "Honorários (" + razaoSocial + " - " + mesCompetencia + "): Base: R$ " + valorHonorarioBaseBrl.toLocaleString('pt-BR') + " | Extras: R$ " + valorServicosExtrasBrl.toLocaleString('pt-BR') + " | Atraso: " + diasAtraso + " dias | Total Cobrado: R$ " + totalComEncargos.toLocaleString('pt-BR') + " (Etapa: " + etapa + ").";

  return Ok({
    faturaId,
    clienteCnpj,
    razaoSocial,
    valorTotalFaturaBrl: parseFloat(totalFatura.toFixed(2)),
    valorMultaMoraBrl: parseFloat(multa.toFixed(2)),
    valorJurosMoraBrl: parseFloat(juros.toFixed(2)),
    totalLiquidoCobradoBrl: parseFloat(totalComEncargos.toFixed(2)),
    etapaReguaCobranca: etapa,
    chavePixCopiaECola: pix,
    statusCobranca: 'FATURA_PROCESSADA_REGUA_ATIVA',
    diagnosticoCobranca: diag
  });
}
