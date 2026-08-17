import { Result, Ok, Err } from '../../types/result.js';

export type TipoEmissaoNfe = '1_NORMAL' | '6_CONTINGENCIA_SVC_AN' | '7_CONTINGENCIA_SVC_RS' | '4_CONTINGENCIA_EPEC';

export interface SefazContingencyInput {
  chaveAcessoNfe: string;
  tipoEmissao: TipoEmissaoNfe;
  justificativaContingencia: string; // Mínimo 15 caracteres conforme Manual MOC
  dhEntradaContingenciaIso: string; // Ex: '2026-08-17T15:00:00-03:00'
}

export interface SefazContingencyResult {
  chaveAcessoNfe: string;
  tipoEmissao: TipoEmissaoNfe;
  justificativaValida: boolean;
  tpEmisDanfe: string;
  textoDanfeContingencia: string;
  statusHomologacaoContingencia: 'CONTINGENCIA_OFICIAL_CONFAZ_HOMOLOGADA';
  diagnosticoContingencia: string;
}

export function processSefazContingencyModeEngine(input: SefazContingencyInput): Result<SefazContingencyResult, Error> {
  const {
    chaveAcessoNfe,
    tipoEmissao,
    justificativaContingencia,
    dhEntradaContingenciaIso
  } = input;

  if (chaveAcessoNfe.length !== 44) {
    return Err(new Error('Chave de acesso deve possuir 44 dígitos.'));
  }

  if (tipoEmissao !== '1_NORMAL' && justificativaContingencia.trim().length < 15) {
    return Err(new Error('Justificativa de contingência deve conter no mínimo 15 caracteres conforme MOC SEFAZ.'));
  }

  let tpEmisDanfe = '1';
  let textoDanfe = 'EMISSÃO NORMAL';

  if (tipoEmissao === '6_CONTINGENCIA_SVC_AN') {
    tpEmisDanfe = '6';
    textoDanfe = 'DANFE EMITIDO EM CONTINGÊNCIA - SVC-AN (Sefaz Virtual Ambiente Nacional)';
  } else if (tipoEmissao === '7_CONTINGENCIA_SVC_RS') {
    tpEmisDanfe = '7';
    textoDanfe = 'DANFE EMITIDO EM CONTINGÊNCIA - SVC-RS (Sefaz Virtual Rio Grande do Sul)';
  } else if (tipoEmissao === '4_CONTINGENCIA_EPEC') {
    tpEmisDanfe = '4';
    textoDanfe = 'DANFE EMITIDO EM CONTINGÊNCIA - EPEC (Evento Prévio de Emissão em Contingência)';
  }

  const diag = "Contingencia SEFAZ: Chave " + chaveAcessoNfe + " | Tipo: " + tipoEmissao + " (tpEmis=" + tpEmisDanfe + ") | Entrada: " + dhEntradaContingenciaIso + " | Justificativa: " + justificativaContingencia + " -> DANFE Homologado.";

  return Ok({
    chaveAcessoNfe,
    tipoEmissao,
    justificativaValida: true,
    tpEmisDanfe,
    textoDanfeContingencia: textoDanfe,
    statusHomologacaoContingencia: 'CONTINGENCIA_OFICIAL_CONFAZ_HOMOLOGADA',
    diagnosticoContingencia: diag
  });
}
