import { Result, Ok, Err } from '../types/result.js';

export interface CiapFactorInput {
  empresaCnpj: string;
  razaoSocial: string;
  competenciaMesAno: string;
  identificacaoBemImobilizado: string; // Ex: Injetora de Plástico Modelo 2026
  valorIcmsTotalDestacadoNfeBrl: number; // Ex: R$ 48.000,00
  numeroParcelaAtualMesCount: number; // Ex: 1 a 48
  valorSaidasTributadasExportacaoBrl: number; // Ex: R$ 900.000,00
  valorTotalSaidasMesBrl: number; // Ex: R$ 1.000.000,00
}

export interface CiapFactorResult {
  empresaCnpj: string;
  razaoSocial: string;
  competenciaMesAno: string;
  identificacaoBemImobilizado: string;
  parcelaBase1De48AvosBrl: number; // 48.000 / 48 = 1.000,00
  fatorSaidasTributadasPercent: number; // 900k / 1M = 90% (fator 0.90)
  valorCreditoIcmsApropriavelMesBrl: number; // 1.000 x 0.90 = 900,00
  valorIcmsPerdidoNaoAproveitavelBrl: number; // 1.000 x 0.10 = 100,00
  saldoRemanescenteIcmsApropriarBrl: number;
  statusApuracao: 'CIAP_BLOCO_G_APURADO_COM_SUCESSO';
  diagnosticoCiap: string;
}

export function processOfficeCiapBlockGFactorEngine(input: CiapFactorInput): Result<CiapFactorResult, Error> {
  const {
    empresaCnpj,
    razaoSocial,
    competenciaMesAno,
    identificacaoBemImobilizado,
    valorIcmsTotalDestacadoNfeBrl,
    numeroParcelaAtualMesCount,
    valorSaidasTributadasExportacaoBrl,
    valorTotalSaidasMesBrl
  } = input;

  if (!empresaCnpj || valorIcmsTotalDestacadoNfeBrl <= 0 || valorTotalSaidasMesBrl <= 0 || numeroParcelaAtualMesCount < 1 || numeroParcelaAtualMesCount > 48) {
    return Err(new Error('CNPJ, ICMS total do bem, saídas totais e parcela válida (1 a 48) são obrigatórios.'));
  }

  const parcela1De48 = valorIcmsTotalDestacadoNfeBrl / 48.0;

  // Fator = Saídas Tributadas e Exportações / Saídas Totais (limitado a 1.00)
  const fatorDecimal = Math.min(1.0, valorSaidasTributadasExportacaoBrl / valorTotalSaidasMesBrl);
  const fatorPercent = fatorDecimal * 100;

  const creditoApropriavel = parcela1De48 * fatorDecimal;
  const icmsPerdido = parcela1De48 - creditoApropriavel;

  // Saldo remanescente a apropriar após esta parcela
  const parcelasRestantes = 48 - numeroParcelaAtualMesCount;
  const saldoRemanescente = parcelasRestantes * parcela1De48;

  const diag = "CIAP Bloco G (" + razaoSocial + " - Parcela " + numeroParcelaAtualMesCount + "/48 - " + competenciaMesAno + "): Bem: " + identificacaoBemImobilizado + " | ICMS Total: R$ " + valorIcmsTotalDestacadoNfeBrl.toFixed(2) + " (1/48: R$ " + parcela1De48.toFixed(2) + ") | Fator de Saídas: " + fatorPercent.toFixed(2) + "% | Crédito Apropriado: R$ " + creditoApropriavel.toFixed(2) + " | ICMS Perdido: R$ " + icmsPerdido.toFixed(2) + " | Saldo a Apropriar: R$ " + saldoRemanescente.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    razaoSocial,
    competenciaMesAno,
    identificacaoBemImobilizado,
    parcelaBase1De48AvosBrl: parseFloat(parcela1De48.toFixed(2)),
    fatorSaidasTributadasPercent: parseFloat(fatorPercent.toFixed(2)),
    valorCreditoIcmsApropriavelMesBrl: parseFloat(creditoApropriavel.toFixed(2)),
    valorIcmsPerdidoNaoAproveitavelBrl: parseFloat(icmsPerdido.toFixed(2)),
    saldoRemanescenteIcmsApropriarBrl: parseFloat(saldoRemanescente.toFixed(2)),
    statusApuracao: 'CIAP_BLOCO_G_APURADO_COM_SUCESSO',
    diagnosticoCiap: diag
  });
}
