import { Result, Ok, Err } from '../../types/result.js';

export interface IndirectExportInput {
  remessaId: string;
  empresaProdutoraNome: string;
  tradingCompanyDestinatariaNome: string;
  valorMercadoriaBrl: number;
  diasDecorridosDesdeRemessa: number; // Limite legal: 180 dias
  despachoDuEConcluido: boolean;
  aliquotaIcmsInternaEstadoOrigemPercent: number; // Ex: 18% para caso de não exportação
}

export interface IndirectExportResult {
  remessaId: string;
  empresaProdutora: string;
  tradingDestinataria: string;
  cfopUtilizado: string;
  valorMercadoriaBrl: number;
  desoneracoesAplicadas: {
    icmsNaoIncidenteBrl: number;
    ipiIsentoSuspensoBrl: number;
    pisCofinsAliquotaZero9_25PercentBrl: number;
    totalDesoneracaoExportacaoBrl: number;
  };
  prazo180DiasVencido: boolean;
  icmsCobravelPorNaoExportacaoBrl: number;
  diagnosticoExportacao: string;
}

export function processIndirectExportTradingEngine(input: IndirectExportInput): Result<IndirectExportResult, Error> {
  const {
    remessaId,
    empresaProdutoraNome,
    tradingCompanyDestinatariaNome,
    valorMercadoriaBrl,
    diasDecorridosDesdeRemessa,
    despachoDuEConcluido,
    aliquotaIcmsInternaEstadoOrigemPercent
  } = input;

  if (valorMercadoriaBrl <= 0) {
    return Err(new Error('Valor da mercadoria para exportação indireta deve ser superior a zero.'));
  }

  const icmsNaoIncidente = Number((valorMercadoriaBrl * (aliquotaIcmsInternaEstadoOrigemPercent / 100)).toFixed(2));
  const ipiIsento = Number((valorMercadoriaBrl * 0.10).toFixed(2));
  const pisCofinsZero = Number((valorMercadoriaBrl * 0.0925).toFixed(2));
  const totalDesonerado = Number((icmsNaoIncidente + ipiIsento + pisCofinsZero).toFixed(2));

  const prazoVencido = diasDecorridosDesdeRemessa > 180 && !despachoDuEConcluido;
  const icmsCobravel = prazoVencido ? icmsNaoIncidente : 0;

  const diag = 'Exportação Indireta (Art. 3º da LC 87/96 & Convênio ICMS 84/2009): Remessa com Fim Específico (CFOP 5.501/6.501) para ' + tradingCompanyDestinatariaNome + '. Desoneração tributária de R$ ' + totalDesonerado.toFixed(2) + ' (ICMS Não Incidente: R$ ' + icmsNaoIncidente.toFixed(2) + ', PIS/COFINS 0%: R$ ' + pisCofinsZero.toFixed(2) + '). ' + (prazoVencido ? 'ALERTA FISCAL: Prazo de 180 dias expirado sem embarque da DU-E. ICMS retroativo exigível de R$ ' + icmsCobravel.toFixed(2) + '.' : 'Operação regular dentro do prazo de 180 dias.');

  return Ok({
    remessaId,
    empresaProdutora: empresaProdutoraNome,
    tradingDestinataria: tradingCompanyDestinatariaNome,
    cfopUtilizado: '5.501',
    valorMercadoriaBrl,
    desoneracoesAplicadas: {
      icmsNaoIncidenteBrl: icmsNaoIncidente,
      ipiIsentoSuspensoBrl: ipiIsento,
      pisCofinsAliquotaZero9_25PercentBrl: pisCofinsZero,
      totalDesoneracaoExportacaoBrl: totalDesonerado
    },
    prazo180DiasVencido: prazoVencido,
    icmsCobravelPorNaoExportacaoBrl: icmsCobravel,
    diagnosticoExportacao: diag
  });
}
