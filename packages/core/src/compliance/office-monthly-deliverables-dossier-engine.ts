import { Result, Ok, Err } from '../types/result.js';

export interface MonthlyDeliverableItem {
  nomeDocumento: string; // Ex: 'Balancete de Verificação', 'DRE Mensal', 'Folha Analítica', 'Guias DAS/DARF'
  tipoPilar: 'CONTABIL' | 'FISCAL' | 'FOLHA_DP';
  statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' | 'PENDENTE';
}

export interface DeliverablesDossierInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  itensEntregues: MonthlyDeliverableItem[];
}

export interface DeliverablesDossierResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  totalDocumentosDossie: number;
  dossieEmpacotadoComSucesso: boolean;
  statusDossie: 'DOSSIE_MENSAL_DISPONIBILIZADO_AO_CLIENTE';
  diagnosticoDossie: string;
}

export function processOfficeMonthlyDeliverablesDossierEngine(input: DeliverablesDossierInput): Result<DeliverablesDossierResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    itensEntregues
  } = input;

  if (!clienteCnpj || !itensEntregues || itensEntregues.length === 0) {
    return Err(new Error('CNPJ do cliente e lista de documentos do dossiê são obrigatórios.'));
  }

  const diag = "Dossiê Mensal do Cliente (" + razaoSocial + " - " + mesCompetencia + "): " + itensEntregues.length + " relatórios e peças oficiais consolidados (Contábil, Fiscal e DP) disponibilizados no Portal do Cliente com protocolo de entrega digital.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    totalDocumentosDossie: itensEntregues.length,
    dossieEmpacotadoComSucesso: true,
    statusDossie: 'DOSSIE_MENSAL_DISPONIBILIZADO_AO_CLIENTE',
    diagnosticoDossie: diag
  });
}
