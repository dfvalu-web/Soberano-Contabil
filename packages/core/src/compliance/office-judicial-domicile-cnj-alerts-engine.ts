import { Result, Ok, Err } from '../types/result.js';

export interface DjeIntimacaoItem {
  idProcessoJudicial: string;
  tribunalOrigem: string; // Ex: 'TRT-2', 'TJ-SP', 'TRF-3'
  tipoComunicacao: 'CITACAO_INICIAL' | 'INTIMACAO_DESPACHO' | 'SENTENCA';
  dataDisponibilizacaoDje: string; // YYYY-MM-DD
  prazoLeituraDiasUteis: number; // Padrão: 3 dias úteis para leitura (Res. CNJ 455/22)
  diasCorridosDesdeEnvio: number;
}

export interface DjeMonitoringInput {
  clienteCnpj: string;
  razaoSocial: string;
  intimacoesRecebidas: DjeIntimacaoItem[];
}

export interface DjeMonitoringResult {
  clienteCnpj: string;
  razaoSocial: string;
  totalIntimacoesLidas: number;
  intimacoesEmRiscoReveliaCount: number;
  statusDje: 'DOMICILIO_JUDICIAL_MONITORADO_SEM_PENDENCIAS' | 'ALERTA_INTIMACOES_PENDENTES_LEITURA_URGENTE';
  diagnosticoDje: string;
}

export function processOfficeJudicialDomicileCnjAlertsEngine(input: DjeMonitoringInput): Result<DjeMonitoringResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    intimacoesRecebidas
  } = input;

  if (!clienteCnpj || !intimacoesRecebidas) {
    return Err(new Error('CNPJ do cliente e lista de intimações do DJE são obrigatórios.'));
  }

  let riscoCount = 0;
  for (const int of intimacoesRecebidas) {
    if (int.diasCorridosDesdeEnvio >= int.prazoLeituraDiasUteis) {
      riscoCount++;
    }
  }

  const status = riscoCount > 0 ? 'ALERTA_INTIMACOES_PENDENTES_LEITURA_URGENTE' : 'DOMICILIO_JUDICIAL_MONITORADO_SEM_PENDENCIAS';

  const diag = "Domicílio Judicial Eletrônico (" + razaoSocial + "): " + intimacoesRecebidas.length + " comunicações monitoradas no CNJ | " + riscoCount + " com risco de perda de prazo de leitura (3 dias úteis) -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    totalIntimacoesLidas: intimacoesRecebidas.length,
    intimacoesEmRiscoReveliaCount: riscoCount,
    statusDje: status,
    diagnosticoDje: diag
  });
}
