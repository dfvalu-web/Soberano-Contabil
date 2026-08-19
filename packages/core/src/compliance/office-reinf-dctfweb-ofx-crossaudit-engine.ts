import { Result, Ok, Err } from '../types/result.js';

export interface ReinfDctfwebCrossAuditInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalRetencoesReinfBrl: number;
  totalDebitoApuradoDctfwebBrl: number;
  totalDarfPagoExtratoOfxBrl: number;
}

export interface ReinfDctfwebCrossAuditResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  divergenciaReinfVsDctfwebBrl: number;
  divergenciaDctfwebVsOfxBrl: number;
  statusConciliacaoTriplice: 'CONCILIACAO_TRIPLICE_100_PORCENTO_CONFORME' | 'DIVERGENCIA_DETECTADA';
  diagnosticoConciliacao: string;
}

export function processOfficeReinfDctfwebOfxCrossauditEngine(input: ReinfDctfwebCrossAuditInput): Result<ReinfDctfwebCrossAuditResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalRetencoesReinfBrl,
    totalDebitoApuradoDctfwebBrl,
    totalDarfPagoExtratoOfxBrl
  } = input;

  if (!clienteCnpj || !mesCompetencia) {
    return Err(new Error('CNPJ do cliente e mês de competência são obrigatórios.'));
  }

  const divReinfDctf = Math.abs(totalRetencoesReinfBrl - totalDebitoApuradoDctfwebBrl);
  const divDctfOfx = Math.abs(totalDebitoApuradoDctfwebBrl - totalDarfPagoExtratoOfxBrl);

  const conforme = divReinfDctf < 0.05 && divDctfOfx < 0.05;
  const status = conforme ? 'CONCILIACAO_TRIPLICE_100_PORCENTO_CONFORME' : 'DIVERGENCIA_DETECTADA';

  const diag = "Cruzamento Tríplice (" + razaoSocial + " - " + mesCompetencia + "): EFD-Reinf (R$ " + totalRetencoesReinfBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") vs DCTFWeb (R$ " + totalDebitoApuradoDctfwebBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") vs OFX (R$ " + totalDarfPagoExtratoOfxBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    divergenciaReinfVsDctfwebBrl: parseFloat(divReinfDctf.toFixed(2)),
    divergenciaDctfwebVsOfxBrl: parseFloat(divDctfOfx.toFixed(2)),
    statusConciliacaoTriplice: status,
    diagnosticoConciliacao: diag
  });
}
