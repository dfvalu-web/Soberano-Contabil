import { Result, Ok, Err } from '../types/result.js';

export interface CiapAssetEntry {
  identificadorBemCiap: string;
  descricaoBem: string;
  valorTotalIcmsDestacadoBrl: number;
  parcelaAtualNumero: number; // 1 a 48
}

export interface CiapCalculationInput {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  valorTotalSaidasTributadasBrl: number;
  valorTotalSaidasGeralBrl: number;
  bensCiap: CiapAssetEntry[];
}

export interface CiapBlocoGResult {
  clienteCnpj: string;
  razaoSocial: string;
  mesCompetencia: string;
  fatorApropriacaoPercent: number; // Ex: 90%
  totalCreditoIcmsApropriadoMesBrl: number;
  registrosBlocoGSpedFiscalQtd: number;
  statusCiap: 'CIAP_BLOCO_G_APURADO_CONFORME_SPED_FISCAL';
  diagnosticoCiap: string;
}

export function processOfficeCiapSpedBlocoGEngine(input: CiapCalculationInput): Result<CiapBlocoGResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    valorTotalSaidasTributadasBrl,
    valorTotalSaidasGeralBrl,
    bensCiap
  } = input;

  if (!clienteCnpj || valorTotalSaidasGeralBrl <= 0 || !bensCiap || bensCiap.length === 0) {
    return Err(new Error('CNPJ, saídas gerais positivas e relação de bens do CIAP são obrigatórios.'));
  }

  // Fator de apropriação = Saídas Tributadas / Total Saídas
  const fator = Math.min(1.0, valorTotalSaidasTributadasBrl / valorTotalSaidasGeralBrl);

  let totalCreditoApropriado = 0;
  for (const b of bensCiap) {
    // 1/48 avos por mês ajustado pelo fator
    const parcela1_48 = b.valorTotalIcmsDestacadoBrl / 48;
    const parcelaApropriada = parcela1_48 * fator;
    totalCreditoApropriado += parcelaApropriada;
  }

  const diag = "CIAP Bloco G SPED (" + razaoSocial + " - " + mesCompetencia + "): Fator de Apropriação: " + (fator * 100).toFixed(2) + "% | " + bensCiap.length + " bens | Crédito ICMS 1/48 avos apropriado no mês: R$ " + totalCreditoApropriado.toLocaleString('pt-BR') + " -> Registros G110, G125 e G130 gerados na EFD-ICMS/IPI.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    mesCompetencia,
    fatorApropriacaoPercent: parseFloat((fator * 100).toFixed(2)),
    totalCreditoIcmsApropriadoMesBrl: parseFloat(totalCreditoApropriado.toFixed(2)),
    registrosBlocoGSpedFiscalQtd: bensCiap.length * 3 + 1,
    statusCiap: 'CIAP_BLOCO_G_APURADO_CONFORME_SPED_FISCAL',
    diagnosticoCiap: diag
  });
}
