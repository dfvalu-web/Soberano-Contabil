import { Result, Ok, Err } from '../types/result.js';

export interface CompanyCndStatus {
  clienteCnpj: string;
  razaoSocial: string;
  cndFederalValida: boolean;
  cndEstadualValida: boolean;
  cndMunicipalValida: boolean;
  crfFgtsValido: boolean;
}

export interface CndMonitoringInput {
  escritorioNome: string;
  carteiraEmpresas: CompanyCndStatus[];
}

export interface CndMonitoringResult {
  escritorioNome: string;
  totalEmpresasMonitoradas: number;
  empresasTotalmenteRegulares: number;
  empresasComPendenciaFiscal: number;
  taxaConformidadeCndPercent: number;
  statusMonitoramento: 'MONITOR_CNDS_EXECUTADO_COM_SUCESSO';
  diagnosticoCnd: string;
}

export function processCndMonitoringComplianceEngine(input: CndMonitoringInput): Result<CndMonitoringResult, Error> {
  const {
    escritorioNome,
    carteiraEmpresas
  } = input;

  if (!escritorioNome || !carteiraEmpresas || carteiraEmpresas.length === 0) {
    return Err(new Error('Nome do escritório e carteira de empresas para monitoramento são obrigatórios.'));
  }

  let regulares = 0;
  let pendentes = 0;

  for (const c of carteiraEmpresas) {
    if (c.cndFederalValida && c.cndEstadualValida && c.cndMunicipalValida && c.crfFgtsValido) {
      regulares++;
    } else {
      pendentes++;
    }
  }

  const conformidade = (regulares / carteiraEmpresas.length) * 100;

  const diag = "Monitor de CNDs (" + escritorioNome + "): " + carteiraEmpresas.length + " empresas monitoradas | Regulares: " + regulares + " | Pendentes: " + pendentes + " | Taxa de Conformidade: " + conformidade.toFixed(1) + "% -> Alertas de impedimentos emitidos.";

  return Ok({
    escritorioNome,
    totalEmpresasMonitoradas: carteiraEmpresas.length,
    empresasTotalmenteRegulares: regulares,
    empresasComPendenciaFiscal: pendentes,
    taxaConformidadeCndPercent: parseFloat(conformidade.toFixed(1)),
    statusMonitoramento: 'MONITOR_CNDS_EXECUTADO_COM_SUCESSO',
    diagnosticoCnd: diag
  });
}
