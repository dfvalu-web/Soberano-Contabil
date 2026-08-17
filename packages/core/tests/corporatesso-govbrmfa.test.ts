import { describe, it, expect } from 'vitest';
import {
  processCorporateSsoSamlOidcEngine,
  processGovBrLoginFido2WebauthnEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: SSO Corporativo (Azure/Okta), Login Gov.br & MFA FIDO2 Passkeys', () => {
  it('1. Deve autenticar sessao federada SSO com provisionamento JIT e roles RBAC conforme SOC 2', () => {
    const resSso = processCorporateSsoSamlOidcEngine({
      providerType: 'AZURE_ACTIVE_DIRECTORY',
      tenantIdDomain: 'soberanogroup.com.br',
      rawTokenOrAssertion: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      userEmail: 'controller@soberanogroup.com.br',
      assignedRoles: ['CONTROLLER_GERAL', 'AUDITOR_SENIOR_IFRS']
    });

    const dataSso = unwrap(resSso);
    expect(dataSso.userEmail).toBe('controller@soberanogroup.com.br');
    expect(dataSso.providerType).toBe('AZURE_ACTIVE_DIRECTORY');
    expect(dataSso.grantedRoles).toContain('CONTROLLER_GERAL');
    expect(dataSso.jitUserProvisioned).toBe(true);
    expect(dataSso.statusSso).toBe('SSO_FEDERADO_AUTENTICADO_COM_SUCESSO');
    expect(dataSso.diagnosticoSso).toContain('Sessao Federada');
  });

  it('2. Deve validar nivel Ouro do Gov.br com MFA FIDO2 WebAuthn para assinatura de SPED e DCTFWeb', () => {
    const resGovBr = processGovBrLoginFido2WebauthnEngine({
      cpfUsuario: '12345678901',
      nomeCompleto: 'Dr. Roberto Silveira - Contador CRC/SP',
      nivelConfiabilidadeGovBr: 'OURO',
      possuiCertificadoIcpBrasil: true,
      fido2WebAuthnChallengeResponse: 'fido2_signature_token_challenge_passkey_991823'
    });

    const dataGovBr = unwrap(resGovBr);
    expect(dataGovBr.nivelGovBr).toBe('OURO');
    expect(dataGovBr.habilitadoAssinaturaDigitalDeclaracoes).toBe(true);
    expect(dataGovBr.mfaPasskeyValida).toBe(true);
    expect(dataGovBr.poderesTributariosConcedidos).toContain('ASSINATURA_SPED_ECF_ECD');
    expect(dataGovBr.poderesTributariosConcedidos).toContain('TRANSMISSAO_DCTFWEB_E_ESOCIAL');
    expect(dataGovBr.statusAutenticacao).toBe('GOVBR_FIDO2_AUTENTICADO_ALTA_CONFIABILIDADE');
    expect(dataGovBr.diagnosticoGovBr).toContain('Apto para Transmissao Fiscal: AUTORIZADO');
  });
});
