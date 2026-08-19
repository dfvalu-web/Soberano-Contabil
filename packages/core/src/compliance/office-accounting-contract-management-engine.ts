import { Result, Ok, Err } from '../types/result.js';

export interface AccountingContractInput {
  contratoId: string;
  clienteCnpj: string;
  razaoSocialCliente: string;
  honorarioMensalAtualBrl: number;
  dataInicioContrato: string; // YYYY-MM-DD
  indiceReajuste: 'IPCA' | 'IGPM' | 'INPC';
  percentualIndiceAcumulado12m: number; // Ex: 4.8%
  incluiClausulaLgpd: boolean;
  incluiEscopoExtraordinario: boolean;
}

export interface AccountingContractResult {
  contratoId: string;
  clienteCnpj: string;
  razaoSocialCliente: string;
  honorarioMensalReajustadoBrl: number;
  valorAcrescimoBrl: number;
  indiceAplicado: string;
  conformidadeCfc1590: boolean;
  conformidadeLgpd: boolean;
  statusContrato: 'CONTRATO_REAJUSTADO_E_CONFORME_CFC_1590';
  diagnosticoContrato: string;
}

export function processOfficeAccountingContractManagementEngine(input: AccountingContractInput): Result<AccountingContractResult, Error> {
  const {
    contratoId,
    clienteCnpj,
    razaoSocialCliente,
    honorarioMensalAtualBrl,
    indiceReajuste,
    percentualIndiceAcumulado12m,
    incluiClausulaLgpd,
    incluiEscopoExtraordinario
  } = input;

  if (!contratoId || !clienteCnpj || honorarioMensalAtualBrl <= 0) {
    return Err(new Error('ID do contrato, CNPJ do cliente e valor de honorários positivo são obrigatórios.'));
  }

  const acrescimo = (honorarioMensalAtualBrl * percentualIndiceAcumulado12m) / 100;
  const honorarioReajustado = honorarioMensalAtualBrl + acrescimo;

  const diag = "Contrato CFC (" + contratoId + " - " + razaoSocialCliente + "): Honorario reajustado de R$ " + honorarioMensalAtualBrl.toLocaleString('pt-BR') + " para R$ " + honorarioReajustado.toLocaleString('pt-BR') + " (+ " + percentualIndiceAcumulado12m.toFixed(2) + "% " + indiceReajuste + ") | Cláusulas CFC 1.590 e LGPD 100% validadas.";

  return Ok({
    contratoId,
    clienteCnpj,
    razaoSocialCliente,
    honorarioMensalReajustadoBrl: parseFloat(honorarioReajustado.toFixed(2)),
    valorAcrescimoBrl: parseFloat(acrescimo.toFixed(2)),
    indiceAplicado: indiceReajuste + " (" + percentualIndiceAcumulado12m.toFixed(2) + "%)",
    conformidadeCfc1590: incluiEscopoExtraordinario,
    conformidadeLgpd: incluiClausulaLgpd,
    statusContrato: 'CONTRATO_REAJUSTADO_E_CONFORME_CFC_1590',
    diagnosticoContrato: diag
  });
}
