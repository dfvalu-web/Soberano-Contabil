import { Result, Ok, Err } from '../../types/result.js';

export interface CiapAssetInput {
  codigoBem: string;
  descricaoBem: string;
  numeroNotaFiscal: string;
  dataEntrada: string;
  valorIcmsTotalDestacado: number;
  parcelaAtualMes: number; // 1 a 48
  saidasTributadasMes: number;
  saidasExportacaoImunesMes: number;
  totalGeralSaidasMes: number;
}

export interface CiapCalculationResult {
  codigoBem: string;
  parcelaNumero: number;
  totalParcelas: number;
  valorFracao1_48Avos: number;
  fatorApropriacaoIcmsPercent: number;
  creditoIcmsApropriavelMes: number;
  saldoIcmsARecuperarRemanescente: number;
}

export function calculateCiapBlocoG(input: CiapAssetInput): Result<CiapCalculationResult, Error> {
  const {
    codigoBem,
    valorIcmsTotalDestacado,
    parcelaAtualMes,
    saidasTributadasMes,
    saidasExportacaoImunesMes,
    totalGeralSaidasMes
  } = input;

  if (parcelaAtualMes < 1 || parcelaAtualMes > 48) {
    return Err(new Error('Número da parcela do CIAP deve estar entre 1 e 48 conforme LC 87/96.'));
  }

  if (totalGeralSaidasMes <= 0) {
    return Err(new Error('Total geral das saídas do mês deve ser superior a zero para cálculo do índice CIAP.'));
  }

  const saidasQualificadas = saidasTributadasMes + saidasExportacaoImunesMes;
  const fatorApropriacao = Math.min(1.0, Math.max(0.0, saidasQualificadas / totalGeralSaidasMes));
  const fracao1_48 = Number((valorIcmsTotalDestacado / 48).toFixed(2));
  const creditoApropriavel = Number((fracao1_48 * fatorApropriacao).toFixed(2));
  const totalJaApropriadoEstimado = Number((fracao1_48 * parcelaAtualMes).toFixed(2));
  const saldoRemanescente = Number(Math.max(0, valorIcmsTotalDestacado - totalJaApropriadoEstimado).toFixed(2));

  return Ok({
    codigoBem,
    parcelaNumero: parcelaAtualMes,
    totalParcelas: 48,
    valorFracao1_48Avos: fracao1_48,
    fatorApropriacaoIcmsPercent: Number((fatorApropriacao * 100).toFixed(4)),
    creditoIcmsApropriavelMes: creditoApropriavel,
    saldoIcmsARecuperarRemanescente: saldoRemanescente
  });
}
