import { Result, Ok, Err } from '../types/result.js';

export interface TaxIncentivesDonationInput {
  empresaCnpj: string;
  razaoSocial: string;
  exercicioAno: number;
  valorIrpjDevidoAliquota15Brl: number; // Base para o teto de 4%
  doacoesFiaCriancaBrl: number; // Teto 1%
  doacoesFundoIdosoBrl: number; // Teto 1%
  patrociniosLeiEsporteBrl: number; // Teto 1%
  patrociniosLeiRouanetBrl: number; // Teto até 4%
}

export interface TaxIncentivesDonationResult {
  empresaCnpj: string;
  razaoSocial: string;
  limiteGlobalMaximo4PercentBrl: number;
  totalDoacoesEfetuadasBrl: number;
  totalDoacoesAproveitadasDedutivelBrl: number;
  excessoNaoDedutivelBrl: number;
  saldoIrpjARecolherAposIncentivosBrl: number;
  statusApuracao: 'INCENTIVOS_FISCAIS_APURADOS_COM_SUCESSO';
  diagnosticoIncentivos: string;
}

export function processOfficeTaxIncentivesDonationEngine(input: TaxIncentivesDonationInput): Result<TaxIncentivesDonationResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    exercicioAno,
    valorIrpjDevidoAliquota15Brl,
    doacoesFiaCriancaBrl,
    doacoesFundoIdosoBrl,
    patrociniosLeiEsporteBrl,
    patrociniosLeiRouanetBrl
  } = input;

  if (!empresaCnpj || valorIrpjDevidoAliquota15Brl <= 0) {
    return Err(new Error('CNPJ e valor do IRPJ devido (15%) são obrigatórios.'));
  }

  const limiteGlobal = (valorIrpjDevidoAliquota15Brl * 4.0) / 100; // 4% do IRPJ devido
  const totalDoacoes = doacoesFiaCriancaBrl + doacoesFundoIdosoBrl + patrociniosLeiEsporteBrl + patrociniosLeiRouanetBrl;

  // Respeitar tetos individuais (1% cada) e teto global (4%)
  const teto1Percent = (valorIrpjDevidoAliquota15Brl * 1.0) / 100;
  const fiaDedutivel = Math.min(doacoesFiaCriancaBrl, teto1Percent);
  const idosoDedutivel = Math.min(doacoesFundoIdosoBrl, teto1Percent);
  const esporteDedutivel = Math.min(patrociniosLeiEsporteBrl, teto1Percent);
  const rouanetDedutivel = Math.min(patrociniosLeiRouanetBrl, limiteGlobal);

  const somaDedutivel = fiaDedutivel + idosoDedutivel + esporteDedutivel + rouanetDedutivel;
  const aproveitado = Math.min(somaDedutivel, limiteGlobal);
  const excesso = Math.max(0, totalDoacoes - aproveitado);
  const saldoIrpj = Math.max(0, valorIrpjDevidoAliquota15Brl - aproveitado);

  const diag = "Incentivos Fiscais (" + razaoSocial + " - Ano " + exercicioAno + "): IRPJ 15%: R$ " + valorIrpjDevidoAliquota15Brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Teto 4%: R$ " + limiteGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Doações Efetuadas: R$ " + totalDoacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Abatimento Direto: R$ " + aproveitado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Excesso Não Dedutível: R$ " + excesso.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | IRPJ Final: R$ " + saldoIrpj.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    limiteGlobalMaximo4PercentBrl: parseFloat(limiteGlobal.toFixed(2)),
    totalDoacoesEfetuadasBrl: parseFloat(totalDoacoes.toFixed(2)),
    totalDoacoesAproveitadasDedutivelBrl: parseFloat(aproveitado.toFixed(2)),
    excessoNaoDedutivelBrl: parseFloat(excesso.toFixed(2)),
    saldoIrpjARecolherAposIncentivosBrl: parseFloat(saldoIrpj.toFixed(2)),
    statusApuracao: 'INCENTIVOS_FISCAIS_APURADOS_COM_SUCESSO',
    diagnosticoIncentivos: diag
  });
}
