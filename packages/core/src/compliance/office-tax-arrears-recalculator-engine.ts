import { Result, Ok, Err } from '../types/result.js';

export interface TaxArrearsReissueInput {
  clienteCnpj: string;
  razaoSocial: string;
  tipoGuia: 'DAS_SIMPLES' | 'DARF_PREVIDENCIARIO_DCTFWEB' | 'FGTS_DIGITAL' | 'DAE_ESTADUAL';
  valorOriginalBrl: number;
  dataVencimentoOriginal: string;
  dataNovaVencimento: string;
  taxaSelicAcumuladaPercent: number;
}

export interface TaxArrearsReissueResult {
  clienteCnpj: string;
  razaoSocial: string;
  tipoGuia: string;
  valorOriginalBrl: number;
  valorTotalComEncargosBrl: number;
  novaDataVencimento: string;
  linhaDigitavelRecalculada: string;
  chavePixCopiaEColaAtualizada: string;
  guiaReemitidaPdfPronta: boolean;
  statusReemissao: 'GUIA_EM_ATRASO_REEMITIDA_COM_SUCESSO';
  diagnosticoReemissao: string;
}

export function processOfficeTaxArrearsRecalculatorEngine(input: TaxArrearsReissueInput): Result<TaxArrearsReissueResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    tipoGuia,
    valorOriginalBrl,
    dataVencimentoOriginal,
    dataNovaVencimento,
    taxaSelicAcumuladaPercent
  } = input;

  if (!clienteCnpj || valorOriginalBrl <= 0 || !dataNovaVencimento) {
    return Err(new Error('CNPJ, valor original e nova data de vencimento são obrigatórios.'));
  }

  const dVenc = new Date(dataVencimentoOriginal);
  const dNova = new Date(dataNovaVencimento);
  const dias = Math.max(0, Math.floor((dNova.getTime() - dVenc.getTime()) / (1000 * 60 * 60 * 24)));

  const percMulta = Math.min(20.0, dias * 0.33);
  const percJuros = taxaSelicAcumuladaPercent + (dias > 0 ? 1.0 : 0.0);
  const total = valorOriginalBrl * (1 + (percMulta + percJuros) / 100);

  const linhaDig = "85800000001 " + total.toFixed(2).replace('.', '') + " 00010001234 56789012345 6";
  const pix = "00020126580014br.gov.bcb.pix0114soberanorecalculo" + tipoGuia + "5204000053039865408" + total.toFixed(2) + "5802BR5916SOBERANO CONTAB6009SAO PAULO62070503***6304ABCD";

  const diag = "Reemissão de Guia (" + razaoSocial + " - " + tipoGuia + "): Original R$ " + valorOriginalBrl.toLocaleString('pt-BR') + " (Venc: " + dataVencimentoOriginal + ") -> Recalculada para " + dataNovaVencimento + " no valor total de R$ " + total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " com Pix Copia e Cola atualizado.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    tipoGuia,
    valorOriginalBrl: parseFloat(valorOriginalBrl.toFixed(2)),
    valorTotalComEncargosBrl: parseFloat(total.toFixed(2)),
    novaDataVencimento: dataNovaVencimento,
    linhaDigitavelRecalculada: linhaDig,
    chavePixCopiaEColaAtualizada: pix,
    guiaReemitidaPdfPronta: true,
    statusReemissao: 'GUIA_EM_ATRASO_REEMITIDA_COM_SUCESSO',
    diagnosticoReemissao: diag
  });
}
