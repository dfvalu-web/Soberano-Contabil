import { Result, Ok, Err } from '../types/result.js';

export interface CompanyValuationInput {
  clienteCnpj: string;
  razaoSocial: string;
  setorAtuacao: 'TECNOLOGIA_SAAS' | 'VAREJO_COMERCIO' | 'INDUSTRIA' | 'SERVICOS_SAUDE';
  ebitdaUltimos12MesesBrl: number;
  dividaLiquidaBrl: number; // Dívida Bruta - Caixa
  fluxoCaixaLivreProjetadoAno1Brl: number;
  taxaWaccPercent: number; // Ex: 13.5%
  taxaCrescimentoPerpetuoPercent: number; // Ex: 3.5%
}

export interface CompanyValuationResult {
  clienteCnpj: string;
  razaoSocial: string;
  multiploEvEbitdaSetor: number;
  enterpriseValueMultiplosBrl: number;
  equityValueMultiplosBrl: number;
  equityValueFcdBrl: number;
  valuationSugeridoMedioBrl: number;
  statusValuation: 'VALUATION_ESTRATEGICO_CONCLUIDO_COM_SUCESSO';
  diagnosticoValuation: string;
}

export function processOfficeStrategicAdvisoryValuationEngine(input: CompanyValuationInput): Result<CompanyValuationResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    setorAtuacao,
    ebitdaUltimos12MesesBrl,
    dividaLiquidaBrl,
    fluxoCaixaLivreProjetadoAno1Brl,
    taxaWaccPercent,
    taxaCrescimentoPerpetuoPercent
  } = input;

  if (!clienteCnpj || ebitdaUltimos12MesesBrl <= 0) {
    return Err(new Error('CNPJ e EBITDA positivo são obrigatórios para valuation.'));
  }

  // Múltiplos típicos de mercado brasileiro
  let multiplo = 6.0;
  if (setorAtuacao === 'TECNOLOGIA_SAAS') multiplo = 12.0;
  else if (setorAtuacao === 'SERVICOS_SAUDE') multiplo = 8.5;
  else if (setorAtuacao === 'INDUSTRIA') multiplo = 7.0;

  const evMultiplos = ebitdaUltimos12MesesBrl * multiplo;
  const equityMultiplos = Math.max(0, evMultiplos - dividaLiquidaBrl);

  // FCD Simplificado: Perpetuidade de Gordon = FCF1 / (WACC - g)
  const spreadTaxa = (taxaWaccPercent - taxaCrescimentoPerpetuoPercent) / 100;
  const evFcd = spreadTaxa > 0 ? fluxoCaixaLivreProjetadoAno1Brl / spreadTaxa : evMultiplos;
  const equityFcd = Math.max(0, evFcd - dividaLiquidaBrl);

  const valuationMedio = (equityMultiplos + equityFcd) / 2;

  const diag = "Valuation Estratégico (" + razaoSocial + " - " + setorAtuacao + "): EBITDA: R$ " + ebitdaUltimos12MesesBrl.toLocaleString('pt-BR') + " | Múltiplos (" + multiplo + "x EV/EBITDA): R$ " + equityMultiplos.toLocaleString('pt-BR') + " | FCD (WACC " + taxaWaccPercent + "%): R$ " + equityFcd.toLocaleString('pt-BR') + " -> Valor de Mercado Médio do Equity: R$ " + valuationMedio.toLocaleString('pt-BR') + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    multiploEvEbitdaSetor: multiplo,
    enterpriseValueMultiplosBrl: parseFloat(evMultiplos.toFixed(2)),
    equityValueMultiplosBrl: parseFloat(equityMultiplos.toFixed(2)),
    equityValueFcdBrl: parseFloat(equityFcd.toFixed(2)),
    valuationSugeridoMedioBrl: parseFloat(valuationMedio.toFixed(2)),
    statusValuation: 'VALUATION_ESTRATEGICO_CONCLUIDO_COM_SUCESSO',
    diagnosticoValuation: diag
  });
}
