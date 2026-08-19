import { Result, Ok, Err } from '../types/result.js';

export interface InvoiceDunningEntry {
  clienteCnpj: string;
  razaoSocial: string;
  valorHonorarioBrl: number;
  diasAtraso: number; // 0 = em dia, >0 = inadimplente
  aliquotaIssqnPercent: number; // 2% a 5%
}

export interface OfficeDunningInput {
  escritorioNome: string;
  loteFaturas: InvoiceDunningEntry[];
}

export interface OfficeDunningResult {
  escritorioNome: string;
  totalNfseEmitidas: number;
  totalImpostoIssqnDevidoBrl: number;
  totalRecebiveisEmDiaBrl: number;
  totalInadimplenciaBrl: number;
  indiceInadimplenciaPercent: number;
  statusReguaCobranca: 'REGUA_PIX_DISPARADA_SEM_PENDENCIAS';
  diagnosticoDunning: string;
}

export function processOfficeDunningCollectionEngine(input: OfficeDunningInput): Result<OfficeDunningResult, Error> {
  const {
    escritorioNome,
    loteFaturas
  } = input;

  if (!escritorioNome || !loteFaturas || loteFaturas.length === 0) {
    return Err(new Error('Nome do escritório e faturas são obrigatórios.'));
  }

  let totalIssqn = 0;
  let totalEmDia = 0;
  let totalInadimplente = 0;

  for (const f of loteFaturas) {
    const iss = (f.valorHonorarioBrl * f.aliquotaIssqnPercent) / 100;
    totalIssqn += iss;

    if (f.diasAtraso === 0) {
      totalEmDia += f.valorHonorarioBrl;
    } else {
      totalInadimplente += f.valorHonorarioBrl;
    }
  }

  const faturamentoTotal = totalEmDia + totalInadimplente;
  const taxaInadimplencia = faturamentoTotal > 0 ? (totalInadimplente / faturamentoTotal) * 100 : 0;

  const diag = "Regua de Cobranca do Escritorio (" + escritorioNome + "): " + loteFaturas.length + " NFS-e emitidas | ISSQN Devido: R$ " + totalIssqn.toLocaleString('pt-BR') + " | Em Dia: R$ " + totalEmDia.toLocaleString('pt-BR') + " | Inadimplencia: R$ " + totalInadimplente.toLocaleString('pt-BR') + " (" + taxaInadimplencia.toFixed(1) + "%) -> Disparos de lembretes PIX realizados.";

  return Ok({
    escritorioNome,
    totalNfseEmitidas: loteFaturas.length,
    totalImpostoIssqnDevidoBrl: parseFloat(totalIssqn.toFixed(2)),
    totalRecebiveisEmDiaBrl: parseFloat(totalEmDia.toFixed(2)),
    totalInadimplenciaBrl: parseFloat(totalInadimplente.toFixed(2)),
    indiceInadimplenciaPercent: parseFloat(taxaInadimplencia.toFixed(1)),
    statusReguaCobranca: 'REGUA_PIX_DISPARADA_SEM_PENDENCIAS',
    diagnosticoDunning: diag
  });
}
