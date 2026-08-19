import { Result, Ok, Err } from '../types/result.js';

export interface EmployeeComplianceCheck {
  funcionarioCpf: string;
  nome: string;
  cargo: string;
  salarioAtualBrl: number;
  pisoSalarialConvencaoBrl: number;
  diasFeriasVencidas: number; // se > 360, risco de dobro
  possuiHorasExtrasHabituaisSemDsr: boolean;
}

export interface LaborLiabilitiesInput {
  clienteCnpj: string;
  razaoSocial: string;
  funcionariosAvaliados: EmployeeComplianceCheck[];
}

export interface LaborLiabilitiesResult {
  clienteCnpj: string;
  razaoSocial: string;
  totalVidasAuditadas: number;
  alertasPisoSalarialAbaixo: number;
  alertasFeriasEmDobro: number;
  alertasDsrHorasExtras: number;
  nivelRiscoTrabalhista: 'BAIXO_RISCO_CONFORME' | 'MEDIO_RISCO_ALERTAS' | 'ALTO_RISCO_PASSIVOS';
  statusPrevencao: 'AUDITORIA_TRABALHISTA_CONCLUIDA_COM_SUCESSO';
  diagnosticoPrevencao: string;
}

export function processOfficeLaborLiabilitiesPreventionEngine(input: LaborLiabilitiesInput): Result<LaborLiabilitiesResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    funcionariosAvaliados
  } = input;

  if (!clienteCnpj || !funcionariosAvaliados || funcionariosAvaliados.length === 0) {
    return Err(new Error('CNPJ e relação de funcionários para auditoria trabalhista são obrigatórios.'));
  }

  let pisoAlertas = 0;
  let feriasAlertas = 0;
  let dsrAlertas = 0;

  for (const f of funcionariosAvaliados) {
    if (f.salarioAtualBrl < f.pisoSalarialConvencaoBrl) pisoAlertas++;
    if (f.diasFeriasVencidas >= 330) feriasAlertas++; // Alerta preventivo antes do dobro
    if (f.possuiHorasExtrasHabituaisSemDsr) dsrAlertas++;
  }

  const totalAlertas = pisoAlertas + feriasAlertas + dsrAlertas;
  let risco: 'BAIXO_RISCO_CONFORME' | 'MEDIO_RISCO_ALERTAS' | 'ALTO_RISCO_PASSIVOS' = 'BAIXO_RISCO_CONFORME';

  if (totalAlertas > 3) risco = 'ALTO_RISCO_PASSIVOS';
  else if (totalAlertas > 0) risco = 'MEDIO_RISCO_ALERTAS';

  const diag = "Auditoria de Passivos Trabalhistas (" + razaoSocial + "): " + funcionariosAvaliados.length + " vidas | Pisos Salariais: " + (pisoAlertas === 0 ? "OK" : pisoAlertas + " abaixo") + " | Férias Vencidas: " + (feriasAlertas === 0 ? "OK" : feriasAlertas + " em risco de dobro") + " | DSR: " + (dsrAlertas === 0 ? "OK" : dsrAlertas + " pendentes") + " -> Risco Classificado: " + risco + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    totalVidasAuditadas: funcionariosAvaliados.length,
    alertasPisoSalarialAbaixo: pisoAlertas,
    alertasFeriasEmDobro: feriasAlertas,
    alertasDsrHorasExtras: dsrAlertas,
    nivelRiscoTrabalhista: risco,
    statusPrevencao: 'AUDITORIA_TRABALHISTA_CONCLUIDA_COM_SUCESSO',
    diagnosticoPrevencao: diag
  });
}
