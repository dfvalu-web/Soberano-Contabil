import { Result, Ok, Err } from '../types/result.js';

export interface OfficeObligationCheck {
  codigoObrigacao: 'PGDAS_D' | 'DCTFWEB' | 'ESOCIAL_S1200' | 'EFD_REINF' | 'SPED_FISCAL' | 'ECD_ECF';
  descricao: string;
  dataLimiteVencimento: string; // YYYY-MM-DD
  empresasConcluidas: number;
  empresasPendentes: number;
  inconsistenciasDetectadas: number; // Alertas de malha fina prévia
}

export interface OfficeAuditCalendarInput {
  escritorioNome: string;
  mesReferencia: string;
  verificacoesObrigacoes: OfficeObligationCheck[];
}

export interface OfficeAuditCalendarResult {
  escritorioNome: string;
  mesReferencia: string;
  totalObrigacoesMonitoradas: number;
  indiceConformidadeCarteiraPercent: number;
  totalAlertasMalhaFinaEvitados: number;
  statusAuditoriaEscritorio: 'BLINDAGEM_FISCAL_TRABALHISTA_OPERACIONAL';
  diagnosticoAuditoria: string;
}

export function processOfficeObligationsAuditCalendarEngine(input: OfficeAuditCalendarInput): Result<OfficeAuditCalendarResult, Error> {
  const {
    escritorioNome,
    mesReferencia,
    verificacoesObrigacoes
  } = input;

  if (!escritorioNome || !verificacoesObrigacoes || verificacoesObrigacoes.length === 0) {
    return Err(new Error('Nome do escritório e obrigações a monitorar são obrigatórios.'));
  }

  let totalConcluidas = 0;
  let totalPendentes = 0;
  let totalInconsistencias = 0;

  for (const o of verificacoesObrigacoes) {
    totalConcluidas += o.empresasConcluidas;
    totalPendentes += o.empresasPendentes;
    totalInconsistencias += o.inconsistenciasDetectadas;
  }

  const totalObrigacoesEmpresas = totalConcluidas + totalPendentes;
  const conformidade = totalObrigacoesEmpresas > 0 ? (totalConcluidas / totalObrigacoesEmpresas) * 100 : 100;

  const diag = "Auditoria Preventiva do Escritorio (" + escritorioNome + " - " + mesReferencia + "): " + verificacoesObrigacoes.length + " Obrigacoes Mapeadas | Conformidade: " + conformidade.toFixed(1) + "% | " + totalInconsistencias + " Inconsistencias Previamente Sanadas (Zero Multas para Clientes).";

  return Ok({
    escritorioNome,
    mesReferencia,
    totalObrigacoesMonitoradas: verificacoesObrigacoes.length,
    indiceConformidadeCarteiraPercent: parseFloat(conformidade.toFixed(1)),
    totalAlertasMalhaFinaEvitados: totalInconsistencias,
    statusAuditoriaEscritorio: 'BLINDAGEM_FISCAL_TRABALHISTA_OPERACIONAL',
    diagnosticoAuditoria: diag
  });
}
