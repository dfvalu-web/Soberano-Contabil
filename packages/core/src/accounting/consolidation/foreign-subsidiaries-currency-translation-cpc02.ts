import { Result, Ok, Err } from '../../types/result.js';

export interface ForeignCurrencyTranslationInput {
  subsidiariaId: string;
  subsidiariaNome: string; // Ex: 'Soberano Global Holdings LLC (Delaware)'
  moedaFuncional: 'USD' | 'EUR' | 'GBP';
  ativosTotaisMoedaEstrangeira: number; // Ex: US$ 5.000.000,00
  passivosTotaisMoedaEstrangeira: number; // Ex: US$ 2.000.000,00
  patrimonioLiquidoHistoricoBrl: number; // Ex: R$ 15.000.000,00
  lucroLiquidoAnoMoedaEstrangeira: number; // Ex: US$ 500.000,00
  taxaCambioFechamentoBrl: number; // Ex: R$ 5,60 (Balanço)
  taxaCambioMediaPeriodoBrl: number; // Ex: R$ 5,35 (DRE)
}

export interface ForeignCurrencyTranslationResult {
  subsidiariaId: string;
  subsidiariaNome: string;
  ativosConvertidosBrl: number;
  passivosConvertidosBrl: number;
  lucroLiquidoConvertidoDreBrl: number;
  patrimonioLiquidoFechamentoBrl: number;
  ajusteAcumuladoConversaoCtaPlBrl: number;
  statusConversao: 'CONVERSAO_CPC02_HOMOLOGADA_COM_SUCESSO';
  lancamentoContabilConsolidacao: {
    debitoAtivoCirculanteENaoCirculanteBrl: number;
    creditoPassivoCirculanteENaoCirculanteBrl: number;
    creditoLucroExercicioDreBrl: number;
    ajusteCtaPlBrl: number;
  };
  diagnosticoCpc02: string;
}

export function processForeignSubsidiariesCurrencyTranslationCpc02(input: ForeignCurrencyTranslationInput): Result<ForeignCurrencyTranslationResult, Error> {
  const {
    subsidiariaId,
    subsidiariaNome,
    moedaFuncional,
    ativosTotaisMoedaEstrangeira,
    passivosTotaisMoedaEstrangeira,
    patrimonioLiquidoHistoricoBrl,
    lucroLiquidoAnoMoedaEstrangeira,
    taxaCambioFechamentoBrl,
    taxaCambioMediaPeriodoBrl
  } = input;

  if (ativosTotaisMoedaEstrangeira <= 0 || taxaCambioFechamentoBrl <= 0 || taxaCambioMediaPeriodoBrl <= 0) {
    return Err(new Error('Ativos e taxas cambiais devem ser positivos.'));
  }

  // 1. Ativos e Passivos convertidos à taxa de fechamento (CPC 02 item 39(a))
  const ativosBrl = Number((ativosTotaisMoedaEstrangeira * taxaCambioFechamentoBrl).toFixed(2));
  const passivosBrl = Number((passivosTotaisMoedaEstrangeira * taxaCambioFechamentoBrl).toFixed(2));
  const plFechamentoBrl = Number((ativosBrl - passivosBrl).toFixed(2));

  // 2. Lucro Líquido convertido à taxa média do período (CPC 02 item 39(b))
  const lucroDreBrl = Number((lucroLiquidoAnoMoedaEstrangeira * taxaCambioMediaPeriodoBrl).toFixed(2));

  // 3. CTA (Cumulative Translation Adjustment) no PL = PL Fechamento - (PL Histórico + Lucro DRE)
  const ctaPlBrl = Number((plFechamentoBrl - (patrimonioLiquidoHistoricoBrl + lucroDreBrl)).toFixed(2));

  const diag = "Conversao de Moeda Estrangeira (CPC 02 / IAS 21): " + subsidiariaNome + " (" + moedaFuncional + ") | Ativos: R$ " + ativosBrl.toFixed(2) + " (Taxa Fechamento: R$ " + taxaCambioFechamentoBrl.toFixed(4) + ") | Lucro DRE: R$ " + lucroDreBrl.toFixed(2) + " (Taxa Media: R$ " + taxaCambioMediaPeriodoBrl.toFixed(4) + ") -> Ajuste de Avaliacao Patrimonial (CTA no PL): R$ " + ctaPlBrl.toFixed(2) + ".";

  return Ok({
    subsidiariaId,
    subsidiariaNome,
    ativosConvertidosBrl: ativosBrl,
    passivosConvertidosBrl: passivosBrl,
    lucroLiquidoConvertidoDreBrl: lucroDreBrl,
    patrimonioLiquidoFechamentoBrl: plFechamentoBrl,
    ajusteAcumuladoConversaoCtaPlBrl: ctaPlBrl,
    statusConversao: 'CONVERSAO_CPC02_HOMOLOGADA_COM_SUCESSO',
    lancamentoContabilConsolidacao: {
      debitoAtivoCirculanteENaoCirculanteBrl: ativosBrl,
      creditoPassivoCirculanteENaoCirculanteBrl: passivosBrl,
      creditoLucroExercicioDreBrl: lucroDreBrl,
      ajusteCtaPlBrl: ctaPlBrl
    },
    diagnosticoCpc02: diag
  });
}
