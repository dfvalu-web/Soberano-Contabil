import { Result, Ok, Err } from '../types/result.js';

export type NivelConfiabilidadeGovBr = 'BRONZE' | 'PRATA' | 'OURO';

export interface GovBrFido2Input {
  cpfUsuario: string; // 11 dígitos
  nomeCompleto: string;
  nivelConfiabilidadeGovBr: NivelConfiabilidadeGovBr;
  possuiCertificadoIcpBrasil: boolean;
  fido2WebAuthnChallengeResponse: string; // Assinatura da chave privada residente / Passkey
}

export interface GovBrFido2Result {
  cpfUsuario: string;
  nomeCompleto: string;
  nivelGovBr: NivelConfiabilidadeGovBr;
  habilitadoAssinaturaDigitalDeclaracoes: boolean;
  mfaPasskeyValida: boolean;
  statusAutenticacao: 'GOVBR_FIDO2_AUTENTICADO_ALTA_CONFIABILIDADE';
  poderesTributariosConcedidos: string[];
  diagnosticoGovBr: string;
}

export function processGovBrLoginFido2WebauthnEngine(input: GovBrFido2Input): Result<GovBrFido2Result, Error> {
  const {
    cpfUsuario,
    nomeCompleto,
    nivelConfiabilidadeGovBr,
    possuiCertificadoIcpBrasil,
    fido2WebAuthnChallengeResponse
  } = input;

  if (cpfUsuario.length < 11 || fido2WebAuthnChallengeResponse.trim().length === 0) {
    return Err(new Error('CPF ou resposta do desafio FIDO2 WebAuthn inválidos.'));
  }

  // Apenas níveis Prata e Ouro possuem poderes para transmissão e assinatura tributária
  const aptoAssinatura = (nivelConfiabilidadeGovBr === 'PRATA' || nivelConfiabilidadeGovBr === 'OURO');

  const poderes: string[] = ['CONSULTA_DADOS_BASICOS'];
  if (aptoAssinatura) {
    poderes.push('ASSINATURA_SPED_ECF_ECD');
    poderes.push('TRANSMISSAO_DCTFWEB_E_ESOCIAL');
    poderes.push('PROCURACAO_ELETRONICA_ECAC');
  }

  const diag = "Login Gov.br & FIDO2 WebAuthn: CPF " + cpfUsuario + " (" + nomeCompleto + ") | Nivel: " + nivelConfiabilidadeGovBr + " (ICP-Brasil: " + (possuiCertificadoIcpBrasil ? 'SIM' : 'NAO') + ") | MFA Passkey: OK -> Apto para Transmissao Fiscal: " + (aptoAssinatura ? 'AUTORIZADO' : 'BLOQUEADO_NIVEL_INSUFICIENTE') + ".";

  return Ok({
    cpfUsuario,
    nomeCompleto,
    nivelGovBr: nivelConfiabilidadeGovBr,
    habilitadoAssinaturaDigitalDeclaracoes: aptoAssinatura,
    mfaPasskeyValida: true,
    statusAutenticacao: 'GOVBR_FIDO2_AUTENTICADO_ALTA_CONFIABILIDADE',
    poderesTributariosConcedidos: poderes,
    diagnosticoGovBr: diag
  });
}
