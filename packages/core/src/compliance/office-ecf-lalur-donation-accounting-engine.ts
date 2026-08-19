import { Result, Ok, Err } from '../types/result.js';

export interface EcfLalurDonationInput {
  empresaCnpj: string;
  razaoSocial: string;
  valorTotalDoacoesDREBrl: number;
  valorDeducaoDiretaIrpjBrl: number;
}

export interface EcfLalurDonationResult {
  empresaCnpj: string;
  razaoSocial: string;
  adicaoLalurRegistroM300: string;
  deducaoEcfRegistroN620: string;
  partidaDobradaProvisaoDespesa: string;
  partidaDobradaCompensacaoIrpj: string;
  statusEscrituracao: 'DOACOES_LALUR_ECF_ESCRITURADAS';
  diagnosticoEcf: string;
}

export function processOfficeEcfLalurDonationAccountingEngine(input: EcfLalurDonationInput): Result<EcfLalurDonationResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    valorTotalDoacoesDREBrl,
    valorDeducaoDiretaIrpjBrl
  } = input;

  if (!empresaCnpj || valorTotalDoacoesDREBrl <= 0) {
    return Err(new Error('CNPJ e valor de doações na DRE são obrigatórios.'));
  }

  const adicaoLalur = "ECF Bloco M300 (LALUR Linha 35.01): Adição integral das despesas com doações incentivadas no valor de R$ " + valorTotalDoacoesDREBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const deducaoEcf = "ECF Bloco N620 / N630 (Linha 15): Dedução direta do IRPJ apurado no valor de R$ " + valorDeducaoDiretaIrpjBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const provisao = "D - 3.2.03.001 Despesas com Doações e Patrocínios Incentivados | C - 1.1.01.002 Banco no valor de R$ " + valorTotalDoacoesDREBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const compensacao = "D - 2.1.02.001 IRPJ a Recolher | C - 2.1.02.005 Créditos de Incentivos Fiscais Aproveitados no valor de R$ " + valorDeducaoDiretaIrpjBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diag = "Escrituração ECF/LALUR (" + razaoSocial + "): Adição no M300 de R$ " + valorTotalDoacoesDREBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " e abatimento direto de IRPJ no N620 de R$ " + valorDeducaoDiretaIrpjBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    adicaoLalurRegistroM300: adicaoLalur,
    deducaoEcfRegistroN620: deducaoEcf,
    partidaDobradaProvisaoDespesa: provisao,
    partidaDobradaCompensacaoIrpj: compensacao,
    statusEscrituracao: 'DOACOES_LALUR_ECF_ESCRITURADAS',
    diagnosticoEcf: diag
  });
}
