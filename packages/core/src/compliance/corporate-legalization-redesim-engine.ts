import { Result, Ok, Err } from '../types/result.js';

export interface CorporateProcessInput {
  processoId: string;
  tipoProcesso: 'ABERTURA_EMPRESA' | 'ALTERACAO_CONTRATUAL' | 'BAIXA_ENCERRAMENTO';
  razaoSocialPretendida: string;
  naturezaJuridica: 'LTDA' | 'SLU' | 'SA' | 'MEI';
  capitalSocialBrl: number;
  atividadesCnae: string[];
  viabilidadeMunicipalAprovada: boolean;
  dbeReceitaFederalDeferido: boolean;
}

export interface CorporateProcessResult {
  processoId: string;
  tipoProcesso: string;
  razaoSocialPretendida: string;
  naturezaJuridica: string;
  etapaAtual: 'PRONTO_PARA_REGISTRO_JUNTA_COMERCIAL' | 'PENDENCIA_VIABILIDADE_OU_DBE';
  tempoMedioProcessamentoDias: number;
  statusProcessamento: 'PROCESSO_SOCIETARIO_HOMOLOGADO_REDESIM';
  diagnosticoSocietario: string;
}

export function processCorporateLegalizationRedesimEngine(input: CorporateProcessInput): Result<CorporateProcessResult, Error> {
  const {
    processoId,
    tipoProcesso,
    razaoSocialPretendida,
    naturezaJuridica,
    capitalSocialBrl,
    atividadesCnae,
    viabilidadeMunicipalAprovada,
    dbeReceitaFederalDeferido
  } = input;

  if (!processoId || !razaoSocialPretendida || !atividadesCnae || atividadesCnae.length === 0) {
    return Err(new Error('Processo ID, razão social e CNAEs são obrigatórios.'));
  }

  const pronto = viabilidadeMunicipalAprovada && dbeReceitaFederalDeferido;
  const etapa = pronto ? 'PRONTO_PARA_REGISTRO_JUNTA_COMERCIAL' : 'PENDENCIA_VIABILIDADE_OU_DBE';

  const diag = "Processo Societario (" + processoId + "): " + tipoProcesso + " de " + razaoSocialPretendida + " (" + naturezaJuridica + ") | Capital: R$ " + capitalSocialBrl.toLocaleString('pt-BR') + " | Viabilidade: " + (viabilidadeMunicipalAprovada ? 'OK' : 'Pendente') + " | DBE: " + (dbeReceitaFederalDeferido ? 'OK' : 'Pendente') + " -> " + etapa + ".";

  return Ok({
    processoId,
    tipoProcesso,
    razaoSocialPretendida,
    naturezaJuridica,
    etapaAtual: etapa,
    tempoMedioProcessamentoDias: 3.0,
    statusProcessamento: 'PROCESSO_SOCIETARIO_HOMOLOGADO_REDESIM',
    diagnosticoSocietario: diag
  });
}
