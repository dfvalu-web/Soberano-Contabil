import { Result, Ok } from '../../types/result.js';

export interface ImportCalculationInput {
  numeroDuimpOuDi: string;
  valorMercadoriaMoedaEstrangeira: number;
  taxaCambialPtaxAduaneira: number;
  valorFreteInternacionalUsd: number;
  valorSeguroInternacionalUsd: number;
  aliquotaImpostoImportacaoPercent: number; // e.g. 14 para 14%
  aliquotaIpiImportacaoPercent: number; // e.g. 10 para 10%
  aliquotaIcmsInternoPercent: number; // e.g. 18 para 18%
  taxaSiscomexBrl: number; // e.g. 214.50
  despesasAduaneirasCapataziaBrl: number;
  regimeTributarioImportador: 'LUCRO_REAL' | 'LUCRO_PRESUMIDO';
}

export interface ImportCalculationResult {
  numeroDocumento: string;
  valorAduaneiroBrl: number;
  tributosAduaneiros: {
    impostoImportacaoII: number;
    ipiImportacao: number;
    pisImportacao: number; // 2.10%
    cofinsImportacao: number; // 9.65%
    baseCalculoIcmsPorDentro: number;
    icmsImportacao: number;
    totalTributosDesembaraco: number;
  };
  custoTotalDesembaraco: number;
  creditosFiscaisRecuperaveis: {
    creditoIcms: number;
    creditoPis: number;
    creditoCofins: number;
    creditoIpi: number;
    totalCreditosRecuperaveis: number;
  };
  custoAquisicaoLiquidoEstoque: number;
}

export function calculateImportTaxation(input: ImportCalculationInput): Result<ImportCalculationResult, Error> {
  const {
    numeroDuimpOuDi,
    valorMercadoriaMoedaEstrangeira,
    taxaCambialPtaxAduaneira,
    valorFreteInternacionalUsd,
    valorSeguroInternacionalUsd,
    aliquotaImpostoImportacaoPercent,
    aliquotaIpiImportacaoPercent,
    aliquotaIcmsInternoPercent,
    taxaSiscomexBrl,
    despesasAduaneirasCapataziaBrl,
    regimeTributarioImportador
  } = input;

  // 1. Valor Aduaneiro
  const totalCifUsd = valorMercadoriaMoedaEstrangeira + valorFreteInternacionalUsd + valorSeguroInternacionalUsd;
  const valorAduaneiroBrl = Number((totalCifUsd * taxaCambialPtaxAduaneira).toFixed(2));

  // 2. Tributos Federais de Importação
  const ii = Number((valorAduaneiroBrl * (aliquotaImpostoImportacaoPercent / 100)).toFixed(2));
  const baseIpi = valorAduaneiroBrl + ii;
  const ipi = Number((baseIpi * (aliquotaIpiImportacaoPercent / 100)).toFixed(2));
  const pisImportacao = Number((valorAduaneiroBrl * 0.0210).toFixed(2)); // 2.10%
  const cofinsImportacao = Number((valorAduaneiroBrl * 0.0965).toFixed(2)); // 9.65%

  // 3. ICMS Importação (Cálculo "Por Dentro")
  const somaComponentesSemIcms = valorAduaneiroBrl + ii + ipi + pisImportacao + cofinsImportacao + taxaSiscomexBrl + despesasAduaneirasCapataziaBrl;
  const aliquotaIcmsDecimal = aliquotaIcmsInternoPercent / 100;
  const baseIcmsPorDentro = Number((somaComponentesSemIcms / (1 - aliquotaIcmsDecimal)).toFixed(2));
  const icmsImportacao = Number((baseIcmsPorDentro * aliquotaIcmsDecimal).toFixed(2));

  const totalTributosDesembaraco = Number((ii + ipi + pisImportacao + cofinsImportacao + icmsImportacao).toFixed(2));
  const custoTotalDesembaraco = Number((valorAduaneiroBrl + totalTributosDesembaraco + taxaSiscomexBrl + despesasAduaneirasCapataziaBrl).toFixed(2));

  // 4. Créditos Recuperáveis (Se Lucro Real, toma crédito de ICMS, PIS, COFINS e IPI industrial)
  const isReal = regimeTributarioImportador === 'LUCRO_REAL';
  const creditoIcms = icmsImportacao;
  const creditoPis = isReal ? pisImportacao : 0;
  const creditoCofins = isReal ? cofinsImportacao : 0;
  const creditoIpi = ipi;
  const totalCreditos = Number((creditoIcms + creditoPis + creditoCofins + creditoIpi).toFixed(2));

  const custoLiquidoEstoque = Number((custoTotalDesembaraco - totalCreditos).toFixed(2));

  return Ok({
    numeroDocumento: numeroDuimpOuDi,
    valorAduaneiroBrl,
    tributosAduaneiros: {
      impostoImportacaoII: ii,
      ipiImportacao: ipi,
      pisImportacao,
      cofinsImportacao,
      baseCalculoIcmsPorDentro: baseIcmsPorDentro,
      icmsImportacao,
      totalTributosDesembaraco
    },
    custoTotalDesembaraco,
    creditosFiscaisRecuperaveis: {
      creditoIcms,
      creditoPis,
      creditoCofins,
      creditoIpi,
      totalCreditosRecuperaveis: totalCreditos
    },
    custoAquisicaoLiquidoEstoque: custoLiquidoEstoque
  });
}
