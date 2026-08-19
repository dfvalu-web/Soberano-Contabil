import { Result, Ok, Err } from '../types/result.js';

export interface PowerOfAttorneyInput {
  clienteCnpj: string;
  razaoSocial: string;
  tipoProcuracao: 'RFB_ECAC_TODOS_SERVICOS' | 'CONECTIVIDADE_SOCIAL_FGTS' | 'SEFAZ_DOMICILIO_DTE';
  outorgadoCnpjEscritorio: string;
  dataEmissao: string; // YYYY-MM-DD
  dataValidade: string; // YYYY-MM-DD
  dataConsultaAtual: string; // YYYY-MM-DD
}

export interface PowerOfAttorneyResult {
  clienteCnpj: string;
  razaoSocial: string;
  tipoProcuracao: string;
  estaVigente: boolean;
  diasParaExpirar: number;
  statusProcuracao: 'PROCURACAO_VIGENTE_REGULAR' | 'ALERTA_EXPIRANDO_EM_BREVE' | 'PROCURACAO_EXPIRADA_RENOVACAO_URGENTE';
  linkRenovacaoAutomatica: string;
  diagnosticoProcuracao: string;
}

export function processOfficeElectronicPowerAttorneyEcacEngine(input: PowerOfAttorneyInput): Result<PowerOfAttorneyResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    tipoProcuracao,
    outorgadoCnpjEscritorio,
    dataEmissao,
    dataValidade,
    dataConsultaAtual
  } = input;

  if (!clienteCnpj || !dataValidade || !outorgadoCnpjEscritorio) {
    return Err(new Error('CNPJ do cliente, data de validade e CNPJ do escritório são obrigatórios.'));
  }

  const dtVal = new Date(dataValidade).getTime();
  const dtHoje = new Date(dataConsultaAtual).getTime();
  const diffDias = Math.ceil((dtVal - dtHoje) / (1000 * 60 * 60 * 24));

  let status: 'PROCURACAO_VIGENTE_REGULAR' | 'ALERTA_EXPIRANDO_EM_BREVE' | 'PROCURACAO_EXPIRADA_RENOVACAO_URGENTE' = 'PROCURACAO_VIGENTE_REGULAR';
  if (diffDias < 0) {
    status = 'PROCURACAO_EXPIRADA_RENOVACAO_URGENTE';
  } else if (diffDias <= 30) {
    status = 'ALERTA_EXPIRANDO_EM_BREVE';
  }

  const link = "https://app.soberanocontabil.com.br/procuracao/renovar/" + Buffer.from(clienteCnpj).toString('base64');
  const diag = "Procuração Eletrônica (" + razaoSocial + " - " + tipoProcuracao + "): Vence em " + dataValidade + " (" + diffDias + " dias restantes) | Outorgado: " + outorgadoCnpjEscritorio + " -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    tipoProcuracao,
    estaVigente: diffDias >= 0,
    diasParaExpirar: diffDias,
    statusProcuracao: status,
    linkRenovacaoAutomatica: link,
    diagnosticoProcuracao: diag
  });
}
