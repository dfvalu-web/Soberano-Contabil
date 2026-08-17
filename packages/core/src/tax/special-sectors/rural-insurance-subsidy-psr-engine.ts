import { Result, Ok, Err } from '../../types/result.js';

export interface RuralInsurancePsrInput {
  apoliceSeguroRuralNumero: string;
  produtorRuralNome: string;
  valorPremioTotalSeguroBrl: number; // Ex: R$ 500.000,00
  percentualSubvencaoPsrPercent: number; // Ex: 40.0%
}

export interface RuralInsurancePsrResult {
  apoliceSeguroRuralNumero: string;
  produtorRuralNome: string;
  valorPremioTotalSeguroBrl: number;
  valorSubvencaoGovernoFederalBrl: number; // 40% de R$ 500k = R$ 200.000,00
  valorPremioLiquidoProdutorBrl: number; // R$ 300.000,00 (Dedutível no LCDPR/e-LALUR)
  aliquotaIofAplicavelPercent: number; // 0.0% (Isenção Decreto 6.306/07)
  statusApolicePsr: 'APOLICE_SUBVENCIONADA_MAPA_PSR_HOMOLOGADA';
  diagnosticoPsr: string;
}

export function processRuralInsuranceSubsidyPsrEngine(input: RuralInsurancePsrInput): Result<RuralInsurancePsrResult, Error> {
  const {
    apoliceSeguroRuralNumero,
    produtorRuralNome,
    valorPremioTotalSeguroBrl,
    percentualSubvencaoPsrPercent = 40.0
  } = input;

  if (!apoliceSeguroRuralNumero || valorPremioTotalSeguroBrl <= 0) {
    return Err(new Error('Número da apólice e valor total do prêmio são obrigatórios.'));
  }

  const subvencao = (valorPremioTotalSeguroBrl * percentualSubvencaoPsrPercent) / 100;
  const liquidoProdutor = valorPremioTotalSeguroBrl - subvencao;

  const diag = "Seguro Rural Subvencionado (PSR / MAPA): Apolice " + apoliceSeguroRuralNumero + " | Produtor: " + produtorRuralNome + " | Premio Total: R$ " + valorPremioTotalSeguroBrl.toLocaleString('pt-BR') + " | Subvencao Federal (" + percentualSubvencaoPsrPercent + "%): R$ " + subvencao.toLocaleString('pt-BR') + " | Premio Efetivo Produtor: R$ " + liquidoProdutor.toLocaleString('pt-BR') + " (IOF 0%)";

  return Ok({
    apoliceSeguroRuralNumero,
    produtorRuralNome,
    valorPremioTotalSeguroBrl,
    valorSubvencaoGovernoFederalBrl: subvencao,
    valorPremioLiquidoProdutorBrl: liquidoProdutor,
    aliquotaIofAplicavelPercent: 0.0,
    statusApolicePsr: 'APOLICE_SUBVENCIONADA_MAPA_PSR_HOMOLOGADA',
    diagnosticoPsr: diag
  });
}
