import { Result, Ok, Err } from '../../types/result.js';

export type OeaModalidade = 'OEA_SEGURANCA_S' | 'OEA_CONFORMIDADE_NIVEL_1' | 'OEA_CONFORMIDADE_NIVEL_2' | 'OEA_PLENO';

export interface OeaCustomsInput {
  empresaCnpj: string;
  modalidadeCertificacaoOea: OeaModalidade;
  numeroCertificadoOea: string; // Ex: 'OEA-BR-2026-00892'
  totalOperacoesImportacaoExportacaoAno: number; // Ex: 500 declarações
  valorTotalDesembaraçadoBrl: number; // Ex: R$ 50.000.000,00
  tempoMedioDesembaracoHorasNaoOea: number; // Ex: 120 horas (5 dias)
  tempoMedioDesembaracoHorasOea: number; // Ex: 2 horas (Canal Verde Imediato)
  custoMedioArmazenagemDemurragePorDiaBrl: number; // Ex: R$ 3.000,00 por operação
}

export interface OeaCustomsResult {
  empresaCnpj: string;
  modalidadeCertificacaoOea: OeaModalidade;
  numeroCertificadoOea: string;
  percentualCanalVerdeConquistadoPercent: number; // 99%
  reducaoTempoDesembaracoPercent: number; // ~98.33%
  economiaTotalArmazenagemDemurrageBrl: number;
  statusCertificacaoOea: 'CERTIFICACAO_OEA_RFB_HOMOLOGADA';
  beneficiosAduaneirosFiscais: string[];
  diagnosticoOea: string;
}

export function processAuthorizedEconomicOperatorOeaTaxEngine(input: OeaCustomsInput): Result<OeaCustomsResult, Error> {
  const {
    empresaCnpj,
    modalidadeCertificacaoOea,
    numeroCertificadoOea,
    totalOperacoesImportacaoExportacaoAno,
    valorTotalDesembaraçadoBrl,
    tempoMedioDesembaracoHorasNaoOea,
    tempoMedioDesembaracoHorasOea,
    custoMedioArmazenagemDemurragePorDiaBrl
  } = input;

  if (totalOperacoesImportacaoExportacaoAno <= 0 || valorTotalDesembaraçadoBrl <= 0) {
    return Err(new Error('Total de operações e valor desembaraçado devem ser positivos.'));
  }

  // 1. Redução de Tempo de Desembaraço
  const reducaoHoras = Math.max(0, tempoMedioDesembaracoHorasNaoOea - tempoMedioDesembaracoHorasOea);
  const reducaoPercent = Number(((reducaoHoras / tempoMedioDesembaracoHorasNaoOea) * 100).toFixed(2));
  const diasEconomizadosPorOperacao = reducaoHoras / 24;

  // 2. Economia de Custos Portuários / Aeroportuários (Demurrage & Armazenagem)
  const economiaTotal = Number((totalOperacoesImportacaoExportacaoAno * diasEconomizadosPorOperacao * custoMedioArmazenagemDemurragePorDiaBrl).toFixed(2));

  const pctCanalVerde = 99.0;
  const beneficios = [
    'Parametrização em Canal Verde de 99% das declarações aduaneiras (Duimp/Due)',
    'Dispensa de apresentação de garantias no regime de admissão temporária',
    'Prioridade na análise e atendimento pela Receita Federal do Brasil',
    'Ponto focal de contato exclusivo na Coordenação de Administração Aduaneira (Coana)'
  ];

  const diag = "Programa OEA (IN RFB 2.152/23): CNPJ " + empresaCnpj + " (Certificado " + numeroCertificadoOea + " - " + modalidadeCertificacaoOea + ") | Operacoes: " + totalOperacoesImportacaoExportacaoAno + " (R$ " + valorTotalDesembaraçadoBrl.toFixed(2) + ") -> Canal Verde: " + pctCanalVerde + "% | Reducao de Tempo: " + reducaoPercent + "% (" + tempoMedioDesembaracoHorasNaoOea + "h -> " + tempoMedioDesembaracoHorasOea + "h) -> Economia Logistica/Demurrage: R$ " + economiaTotal.toFixed(2) + ".";

  return Ok({
    empresaCnpj,
    modalidadeCertificacaoOea,
    numeroCertificadoOea,
    percentualCanalVerdeConquistadoPercent: pctCanalVerde,
    reducaoTempoDesembaracoPercent: reducaoPercent,
    economiaTotalArmazenagemDemurrageBrl: economiaTotal,
    statusCertificacaoOea: 'CERTIFICACAO_OEA_RFB_HOMOLOGADA',
    beneficiosAduaneirosFiscais: beneficios,
    diagnosticoOea: diag
  });
}
