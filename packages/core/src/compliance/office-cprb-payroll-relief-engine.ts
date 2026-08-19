import { Result, Ok, Err } from '../types/result.js';

export interface CprbPayrollReliefInput {
  empresaCnpj: string;
  razaoSocial: string;
  competenciaMesAno: string;
  valorFolhaPagamentoBrutaBrl: number;
  valorReceitaBrutaDesoneradaBrl: number;
  valorReceitaBrutaTotalEmpresaBrl: number;
  aliquotaCprbSetorialPercent: number; // Ex: 2.5% TI ou 1.0% Transporte
  tipoEnquadramento: 'TOTALMENTE_DESONERADA' | 'PARCIALMENTE_DESONERADA_MISTA';
}

export interface CprbPayrollReliefResult {
  empresaCnpj: string;
  razaoSocial: string;
  competenciaMesAno: string;
  valorInssPatronalNormal20PercentBrl: number;
  coeficienteDesoneracaoPercent: number;
  valorInssPatronalDevidoAposDesoneracaoBrl: number;
  valorCprbDevidaReceitaBrl: number;
  custoPrevidenciarioTotalFinalBrl: number;
  economiaTributariaObtidaBrl: number;
  indicativoDesoneracaoEsocial: '1_TOTALMENTE_DESONERADA' | '2_PARCIALMENTE_DESONERADA';
  statusApuracao: 'DESONERACAO_CPRB_APURADA_COM_SUCESSO';
  diagnosticoCprb: string;
}

export function processOfficeCprbPayrollReliefEngine(input: CprbPayrollReliefInput): Result<CprbPayrollReliefResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    competenciaMesAno,
    valorFolhaPagamentoBrutaBrl,
    valorReceitaBrutaDesoneradaBrl,
    valorReceitaBrutaTotalEmpresaBrl,
    aliquotaCprbSetorialPercent,
    tipoEnquadramento
  } = input;

  if (!empresaCnpj || valorFolhaPagamentoBrutaBrl <= 0 || valorReceitaBrutaTotalEmpresaBrl <= 0) {
    return Err(new Error('CNPJ, valor da folha e receita bruta total são obrigatórios.'));
  }

  const inssPatronalNormal = (valorFolhaPagamentoBrutaBrl * 20.0) / 100;
  const valorCprb = (valorReceitaBrutaDesoneradaBrl * aliquotaCprbSetorialPercent) / 100;

  let coeficiente = 100.0;
  let inssPatronalFinal = 0.0;
  let indicativo: '1_TOTALMENTE_DESONERADA' | '2_PARCIALMENTE_DESONERADA' = '1_TOTALMENTE_DESONERADA';

  if (tipoEnquadramento === 'TOTALMENTE_DESONERADA') {
    coeficiente = 100.0;
    inssPatronalFinal = 0.0; // Isenção total dos 20% da cota patronal
    indicativo = '1_TOTALMENTE_DESONERADA';
  } else {
    // Parcialmente desonerada: Proporção entre receita desonerada e total
    coeficiente = (valorReceitaBrutaDesoneradaBrl / valorReceitaBrutaTotalEmpresaBrl) * 100;
    // INSS Patronal devido incide sobre a parcela não desonerada
    const parcelaNaoDesoneradaPercent = 100.0 - coeficiente;
    inssPatronalFinal = (inssPatronalNormal * parcelaNaoDesoneradaPercent) / 100;
    indicativo = '2_PARCIALMENTE_DESONERADA';
  }

  const custoFinal = inssPatronalFinal + valorCprb;
  const economia = inssPatronalNormal - custoFinal;

  const diag = "Desoneração da Folha CPRB (" + razaoSocial + " - " + competenciaMesAno + "): INSS 20% Normal: R$ " + inssPatronalNormal.toFixed(2) + " | CPRB (" + aliquotaCprbSetorialPercent + "% s/ Receita): R$ " + valorCprb.toFixed(2) + " | INSS Patronal Final: R$ " + inssPatronalFinal.toFixed(2) + " | Economia Líquida: R$ " + economia.toFixed(2) + " | eSocial Indicativo " + indicativo + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    competenciaMesAno,
    valorInssPatronalNormal20PercentBrl: parseFloat(inssPatronalNormal.toFixed(2)),
    coeficienteDesoneracaoPercent: parseFloat(coeficiente.toFixed(2)),
    valorInssPatronalDevidoAposDesoneracaoBrl: parseFloat(inssPatronalFinal.toFixed(2)),
    valorCprbDevidaReceitaBrl: parseFloat(valorCprb.toFixed(2)),
    custoPrevidenciarioTotalFinalBrl: parseFloat(custoFinal.toFixed(2)),
    economiaTributariaObtidaBrl: parseFloat(economia.toFixed(2)),
    indicativoDesoneracaoEsocial: indicativo,
    statusApuracao: 'DESONERACAO_CPRB_APURADA_COM_SUCESSO',
    diagnosticoCprb: diag
  });
}
