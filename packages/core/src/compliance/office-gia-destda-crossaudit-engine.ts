import { Result, Ok, Err } from '../types/result.js';

export interface GiaEfdCrossAuditInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesAnoCompetencia: string;
  valorIcmsDeclaradoGiaBrl: number;
  valorIcmsApuradoSpedEfdBrl: number;
  valorIcmsStDeclaradoGiaBrl: number;
  valorIcmsStApuradoSpedEfdBrl: number;
}

export interface GiaEfdCrossAuditResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesAnoCompetencia: string;
  divergenciaIcmsProprioBrl: number;
  divergenciaIcmsStBrl: number;
  statusCruzamento: 'GIA_E_SPED_EFD_100_CONCILIADOS' | 'DIVERGENCIA_GIA_VS_SPED_DETECTADA';
  diagnosticoCruzamento: string;
}

export function processOfficeGiaDestdaCrossauditEngine(input: GiaEfdCrossAuditInput): Result<GiaEfdCrossAuditResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesAnoCompetencia,
    valorIcmsDeclaradoGiaBrl,
    valorIcmsApuradoSpedEfdBrl,
    valorIcmsStDeclaradoGiaBrl,
    valorIcmsStApuradoSpedEfdBrl
  } = input;

  if (!clienteCnpj || !mesAnoCompetencia) {
    return Err(new Error('CNPJ do cliente e competência são obrigatórios.'));
  }

  const divProprio = Math.abs(valorIcmsDeclaradoGiaBrl - valorIcmsApuradoSpedEfdBrl);
  const divSt = Math.abs(valorIcmsStDeclaradoGiaBrl - valorIcmsStApuradoSpedEfdBrl);

  const conciliado = divProprio < 0.05 && divSt < 0.05;
  const status = conciliado ? 'GIA_E_SPED_EFD_100_CONCILIADOS' : 'DIVERGENCIA_GIA_VS_SPED_DETECTADA';

  const diag = "Cruzamento GIA vs SPED EFD (" + razaoSocial + " - " + mesAnoCompetencia + "): ICMS Próprio (GIA R$ " + valorIcmsDeclaradoGiaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " vs SPED R$ " + valorIcmsApuradoSpedEfdBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") | ICMS ST (GIA R$ " + valorIcmsStDeclaradoGiaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " vs SPED R$ " + valorIcmsStApuradoSpedEfdBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ") -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesAnoCompetencia,
    divergenciaIcmsProprioBrl: parseFloat(divProprio.toFixed(2)),
    divergenciaIcmsStBrl: parseFloat(divSt.toFixed(2)),
    statusCruzamento: status,
    diagnosticoCruzamento: diag
  });
}
