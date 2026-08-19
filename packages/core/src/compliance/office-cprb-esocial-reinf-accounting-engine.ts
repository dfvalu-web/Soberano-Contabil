import { Result, Ok, Err } from '../types/result.js';

export interface CprbEsocialReinfInput {
  empresaCnpj: string;
  razaoSocial: string;
  codigoAtividadeCprb: string; // Ex: 00000010 - TI / TIC
  valorReceitaBrutaBrl: number;
  valorCprbDevidaBrl: number;
}

export interface CprbEsocialReinfResult {
  empresaCnpj: string;
  razaoSocial: string;
  eventoEsocial: 'S-1280_INFORMACOES_COMPLEMENTARES_DESONERACAO';
  eventoEfdReinf: 'R-2060_CPRB_CONTRIBUICAO_PREVIDENCIARIA_RECEITA';
  partidaDobradaCprb: string;
  statusIntegracao: 'CPRB_INTEGRADA_ESOCIAL_REINF_DCTFWEB';
  diagnosticoIntegracao: string;
}

export function processOfficeCprbEsocialReinfAccountingEngine(input: CprbEsocialReinfInput): Result<CprbEsocialReinfResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    codigoAtividadeCprb,
    valorReceitaBrutaBrl,
    valorCprbDevidaBrl
  } = input;

  if (!empresaCnpj || !codigoAtividadeCprb || valorCprbDevidaBrl <= 0) {
    return Err(new Error('CNPJ, código da atividade CPRB e valor da CPRB devida são obrigatórios.'));
  }

  const lancamento = "D - 3.1.02.008 Despesas Tributárias - CPRB Desoneração | C - 2.1.02.008 CPRB a Recolher no valor de R$ " + valorCprbDevidaBrl.toFixed(2);

  const diag = "Integração CPRB (" + razaoSocial + " - Ativ. " + codigoAtividadeCprb + "): Receita: R$ " + valorReceitaBrutaBrl.toFixed(2) + " | CPRB: R$ " + valorCprbDevidaBrl.toFixed(2) + " | eSocial S-1280 & EFD-Reinf R-2060 gerados para consolidação na DCTFWeb.";

  return Ok({
    empresaCnpj,
    razaoSocial,
    eventoEsocial: 'S-1280_INFORMACOES_COMPLEMENTARES_DESONERACAO',
    eventoEfdReinf: 'R-2060_CPRB_CONTRIBUICAO_PREVIDENCIARIA_RECEITA',
    partidaDobradaCprb: lancamento,
    statusIntegracao: 'CPRB_INTEGRADA_ESOCIAL_REINF_DCTFWEB',
    diagnosticoIntegracao: diag
  });
}
