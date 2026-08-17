import { Result, Ok, Err } from '../../types/result.js';

export interface ZpeProjectInput {
  empresaHabilitadaId: string;
  zpeLocalizacaoNome: string; // e.g. "ZPE Pecém - CE", "ZPE Parnaíba - PI"
  numeroAtoDeclaratorioExecutivo: string;
  aquisicoesMercadoInternoBensServicos: number;
  importacoesDiretasInsumosMaquinasUsd: number;
  taxaCambialPtaxAduaneira: number;
}

export interface ZpeProjectResult {
  empresaId: string;
  zpeNome: string;
  adeNumero: string;
  totalAquisicoesInternasBrl: number;
  totalImportacoesCifBrl: number;
  tributosSuspensosApurados: {
    pisCofinsInternoSuspenso9_25Percent: number;
    ipiInternoSuspensoEstimado10Percent: number;
    impostoImportacaoSuspenso14Percent: number;
    pisCofinsImportacaoSuspenso11_75Percent: number;
    totalSuspensaoTributariaZpeBrl: number;
  };
  diagnosticoZpe: string;
}

export function calculateZpeTaxSuspension(input: ZpeProjectInput): Result<ZpeProjectResult, Error> {
  const {
    empresaHabilitadaId,
    zpeLocalizacaoNome,
    numeroAtoDeclaratorioExecutivo,
    aquisicoesMercadoInternoBensServicos,
    importacoesDiretasInsumosMaquinasUsd,
    taxaCambialPtaxAduaneira
  } = input;

  if (aquisicoesMercadoInternoBensServicos < 0 || importacoesDiretasInsumosMaquinasUsd < 0) {
    return Err(new Error('Valores de aquisições e importações ZPE não podem ser negativos.'));
  }

  // 1. Suspensão Mercado Interno
  const pisCofinsInterno = Number((aquisicoesMercadoInternoBensServicos * 0.0925).toFixed(2));
  const ipiInterno = Number((aquisicoesMercadoInternoBensServicos * 0.10).toFixed(2));

  // 2. Suspensão Importação
  const totalImportacaoBrl = Number((importacoesDiretasInsumosMaquinasUsd * taxaCambialPtaxAduaneira).toFixed(2));
  const iiImportacao = Number((totalImportacaoBrl * 0.14).toFixed(2));
  const pisCofinsImportacao = Number((totalImportacaoBrl * 0.1175).toFixed(2));

  const totalSuspenso = Number((pisCofinsInterno + ipiInterno + iiImportacao + pisCofinsImportacao).toFixed(2));

  const diagnostico = 'Indústria habilitada na ' + zpeLocalizacaoNome + ' (ADE nº ' + numeroAtoDeclaratorioExecutivo + '). Suspensão total de R$ ' + totalSuspenso.toFixed(2) + ' em tributos federais e aduaneiros (Lei nº 11.508/2007).';

  return Ok({
    empresaId: empresaHabilitadaId,
    zpeNome: zpeLocalizacaoNome,
    adeNumero: numeroAtoDeclaratorioExecutivo,
    totalAquisicoesInternasBrl: aquisicoesMercadoInternoBensServicos,
    totalImportacoesCifBrl: totalImportacaoBrl,
    tributosSuspensosApurados: {
      pisCofinsInternoSuspenso9_25Percent: pisCofinsInterno,
      ipiInternoSuspensoEstimado10Percent: ipiInterno,
      impostoImportacaoSuspenso14Percent: iiImportacao,
      pisCofinsImportacaoSuspenso11_75Percent: pisCofinsImportacao,
      totalSuspensaoTributariaZpeBrl: totalSuspenso
    },
    diagnosticoZpe: diagnostico
  });
}
