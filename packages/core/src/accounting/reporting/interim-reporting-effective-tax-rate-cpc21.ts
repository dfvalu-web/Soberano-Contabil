import { Result, Ok, Err } from '../../types/result.js';

export interface InterimPeriodReportingInput {
  empresaCnpj: string;
  trimestreRef: '1T' | '2T' | '3T' | '4T';
  anoCalendario: number;
  lucroContabilAntesTributosTrimestreBrl: number; // Ex: R$ 4.000.000,00 no 1T
  lucroContabilAnualEsperadoBrl: number; // Ex: R$ 16.000.000,00
  despesasNaoDedutiveisAnuaisEstimadasBrl: number; // Ex: R$ 1.000.000,00
  exclusoesEIncentivosFiscaisAnuaisEstimadosBrl: number; // Ex: R$ 3.000.000,00 (Subvenções / Lei do Bem)
}

export interface InterimPeriodReportingResult {
  empresaCnpj: string;
  trimestreRef: string;
  anoCalendario: number;
  lucroContabilTrimestreBrl: number;
  taxaEfetivaAnualEstimadaPercent: number; // Ex: ~29.75% (em vez de 34% nominal)
  despesaIrpjCsllTrimestreBrl: number;
  lucroLiquidoTrimestreAposTributosBrl: number;
  statusConformidadeCpc21: 'APURACAO_ITR_CPC21_CONFORME';
  lancamentoContabilTrimestral: {
    debitoDespesaIrpjCsllDreBrl: number;
    creditoProvisaoIrpjCsllPassivoBrl: number;
  };
  diagnosticoCpc21: string;
}

export function processInterimReportingEffectiveTaxRateCpc21(input: InterimPeriodReportingInput): Result<InterimPeriodReportingResult, Error> {
  const {
    empresaCnpj,
    trimestreRef,
    anoCalendario,
    lucroContabilAntesTributosTrimestreBrl,
    lucroContabilAnualEsperadoBrl,
    despesasNaoDedutiveisAnuaisEstimadasBrl,
    exclusoesEIncentivosFiscaisAnuaisEstimadosBrl
  } = input;

  if (lucroContabilAntesTributosTrimestreBrl <= 0 || lucroContabilAnualEsperadoBrl <= 0) {
    return Err(new Error('Lucros contábeis devem ser positivos.'));
  }

  // 1. Estimativa do Lucro Real Anual e Imposto Total Anual Esperado
  const baseTributavelAnualEsperada = lucroContabilAnualEsperadoBrl + despesasNaoDedutiveisAnuaisEstimadasBrl - exclusoesEIncentivosFiscaisAnuaisEstimadosBrl;
  const impostoAnualEsperado = baseTributavelAnualEsperada * 0.34; // 34% (25% IRPJ + 9% CSLL)

  // 2. Taxa Efetiva Anual Ponderada Estimada (CPC 21 item 30(c))
  const taxaEfetivaAnual = Number(((impostoAnualEsperado / lucroContabilAnualEsperadoBrl) * 100).toFixed(4));

  // 3. Provisão Trimestral de IRPJ/CSLL = Lucro do Trimestre * Taxa Efetiva Estimada
  const despesaTrimestralTributos = Number((lucroContabilAntesTributosTrimestreBrl * (taxaEfetivaAnual / 100)).toFixed(2));
  const lucroLiquidoTrimestre = Number((lucroContabilAntesTributosTrimestreBrl - despesaTrimestralTributos).toFixed(2));

  const diag = "Demonstracoes Intermediarias (CPC 21 / IAS 34): " + trimestreRef + "/" + anoCalendario + " (CNPJ " + empresaCnpj + ") | Lucro Trimestral: R$ " + lucroContabilAntesTributosTrimestreBrl.toFixed(2) + " -> Taxa Efetiva Anual Estimada (ETR): " + taxaEfetivaAnual + "% | Despesa IRPJ/CSLL Trimestral: R$ " + despesaTrimestralTributos.toFixed(2) + " -> Lucro Liquido ITR: R$ " + lucroLiquidoTrimestre.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    trimestreRef,
    anoCalendario,
    lucroContabilTrimestreBrl: lucroContabilAntesTributosTrimestreBrl,
    taxaEfetivaAnualEstimadaPercent: taxaEfetivaAnual,
    despesaIrpjCsllTrimestreBrl: despesaTrimestralTributos,
    lucroLiquidoTrimestreAposTributosBrl: lucroLiquidoTrimestre,
    statusConformidadeCpc21: 'APURACAO_ITR_CPC21_CONFORME',
    lancamentoContabilTrimestral: {
      debitoDespesaIrpjCsllDreBrl: despesaTrimestralTributos,
      creditoProvisaoIrpjCsllPassivoBrl: despesaTrimestralTributos
    },
    diagnosticoCpc21: diag
  });
}
