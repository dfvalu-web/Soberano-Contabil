import { describe, it, expect } from 'vitest';
import {
  processCloudHsmSignature,
  processPfxVaultKmsManager,
  unwrap
} from '../src/index.js';

describe('TESTES: Cloud HSM ICP-Brasil & Cofre A1 PFX (Pilar 3 - Produção)', () => {
  it('1. Deve autenticar via OAuth2 PKCE com OTP e assinar XML diretamente no Cloud HSM (BirdId / NeoID)', () => {
    const resHsm = processCloudHsmSignature({
      provedorHsm: 'BIRD_ID_SOLUTI',
      clientId: 'client-soberano-audit-01',
      codigoOtpAutorizacao: '849201', // OTP 6 dígitos
      cpfCnpjTitular: '12.345.678/0001-90',
      xmlConteudoParaAssinar: '<NFe><infNFe>CONTEUDO_PARA_ASSINAR</infNFe></NFe>'
    });

    const dataHsm = unwrap(resHsm);
    expect(dataHsm.statusAssinatura).toBe('ASSINADO_COM_SUCESSO_ICP_BRASIL');
    expect(dataHsm.algoritmoAssinatura).toBe('SHA256withRSA_XMLDSig');
    expect(dataHsm.provedorHsm).toBe('BIRD_ID_SOLUTI');
    expect(dataHsm.tokenSessaoHsm).toContain('HSM_TOKEN_BIRD_ID_SOLUTI');
    expect(dataHsm.hashXmlAssinadoSha256).toBeDefined();
    expect(dataHsm.diagnosticoHsm).toContain('Assinatura XMLDSig SHA-256 com RSA gerada diretamente no cofre seguro em nuvem');
  });

  it('2. Deve cifrar certificado A1 (.pfx) com AES-256-GCM e chave KMS para rotinas em background', () => {
    const resVault = processPfxVaultKmsManager({
      tenantId: '00000000-0000-0000-0000-000000000001',
      cnpjEmpresa: '12.345.678/0001-90',
      nomeArquivoPfx: 'certificado_matriz_2026.pfx',
      conteudoBase64Pfx: 'MIIJyQIBAzCCCVEGCSqGSIb3DQEHAaCCCUIEggk+MIIJOjCCB64GCSqGSIb3DQEHAaCCB68Egger',
      senhaCertificadoPfx: 'SenhaForte123@#$',
      kmsChaveMestreId: 'arn:aws:kms:sa-east-1:123456789:key/soberano-master-key'
    });

    const dataVault = unwrap(resVault);
    expect(dataVault.statusCofre).toBe('CERTIFICADO_A1_CIFRADO_COM_SUCESSO');
    expect(dataVault.algoritmoEnvelopeEncryption).toBe('AES-256-GCM_KMS_WRAPPED');
    expect(dataVault.vaultId).toContain('VAULT-A1-12345678000190');
    expect(dataVault.autorizadoParaRotinasNoturnasBackground).toBe(true);
    expect(dataVault.validadeCertificadoAte).toBeDefined();
    expect(dataVault.diagnosticoPfxVault).toContain('Liberado para emissoes automaticas e fechamentos em lote');
  });
});
