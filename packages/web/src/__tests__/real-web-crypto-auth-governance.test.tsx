import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RealWebCryptoEngine } from '../security/real-web-crypto';
import { officeStore } from '../state/office-store';
import { OfficeLoginSecurityGovernanceView } from '../views/OfficeLoginSecurityGovernanceView';

describe('Governança de Login, Criptografia Real & RBAC Modular Suite', () => {
  it('1. RealWebCryptoEngine: deriva chaves com PBKDF2 e cifra/decifra com AES-256-GCM', async () => {
    const password = 'SoberanoMasterPassword#2026';
    const secretMessage = JSON.stringify({ user: 'david.valu@soberanocontabil.com.br', role: 'MASTER_ADMIN' });
    const encrypted = await RealWebCryptoEngine.encryptAesGcm(secretMessage, password);

    expect(encrypted.ciphertextHex).toBeDefined();
    expect(encrypted.ivHex).toBeDefined();
    expect(encrypted.saltHex).toBeDefined();

    const decrypted = await RealWebCryptoEngine.decryptAesGcm(encrypted, password);
    expect(decrypted).toBe(secretMessage);
    const parsed = JSON.parse(decrypted);
    expect(parsed.user).toBe('david.valu@soberanocontabil.com.br');
  });

  it('2. RealWebCryptoEngine: assina desafios com HMAC-SHA256 para Tokens A3/ICP-Brasil', async () => {
    const challenge = 'ICP-BRASIL-CHALLENGE-2026-FINGERPRINT-8899AABB';
    const pinSecret = '123456';

    const signature = await RealWebCryptoEngine.signChallengeHMAC(challenge, pinSecret);
    expect(signature).toHaveLength(64);

    const signature2 = await RealWebCryptoEngine.signChallengeHMAC(challenge, pinSecret);
    expect(signature).toBe(signature2);
  });

  it('3. OfficeStateStore: gerencia políticas de login, aprovações e auditoria imutável', () => {
    const policies = officeStore.getLoginPolicies();
    expect(policies.length).toBeGreaterThanOrEqual(3);

    const certPolicy = officeStore.isLoginMethodAllowed('CERTIFICATE_ICP_BRASIL');
    expect(certPolicy.allowed).toBe(true);

    const passPolicy = officeStore.isLoginMethodAllowed('EMAIL_PASSWORD_HASH');
    expect(passPolicy.allowed).toBe(true);

    // Testar aprovação de acesso
    const pending = officeStore.getPendingUserApprovals();
    expect(pending.length).toBeGreaterThan(0);

    const firstReq = pending[0];
    officeStore.approveUserAccess(firstReq.id, 'DAVID VALU');

    const updatedPending = officeStore.getPendingUserApprovals();
    const approved = updatedPending.find(r => r.id === firstReq.id);
    expect(approved?.status).toBe('APPROVED');
    expect(approved?.approvedBy).toBe('DAVID VALU');
  });

  it('4. OfficeLoginSecurityGovernanceView: renderiza o painel executivo com Matriz de Permissões & Dossiê A4', () => {
    const html = renderToStaticMarkup(
      React.createElement(OfficeLoginSecurityGovernanceView)
    );

    expect(html).toContain('Central de Controle de Login');
    expect(html).toContain('Matriz de Permissões');
    expect(html).toContain('RBAC &amp; SAAS MODULAR');
    expect(html).toContain('Perfis &amp; Empresas');
    expect(html).toContain('Total de Módulos');
    expect(html).toContain('181 Módulos');
    expect(html).toContain('diamond-paper-a4');
    expect(html).toContain('RELATÓRIO OFICIAL DE GOVERNANÇA DE ACESSOS &amp; SEGURANÇA CRIPTOGRÁFICA');
  });

  it('5. OfficeStateStore & RBAC: controla acesso a módulos individuais e departamentos contratados', () => {
    // 5.1 Proprietário Master tem acesso total
    expect(officeStore.isModuleAllowedForUser('dfvalu@gmail.com', 'office_predictive_tax_audit_radar', 'fiscal')).toBe(true);
    expect(officeStore.isModuleAllowedForUser('dfvalu@gmail.com', 'payroll', 'dp')).toBe(true);
    expect(officeStore.isModuleAllowedForUser('dfvalu@gmail.com', 'accounting', 'contabil')).toBe(true);

    // 5.2 Analista Fiscal tem acesso aos módulos fiscais mas não de folha de pagamento
    expect(officeStore.isModuleAllowedForUser('beatriz.tributario@soberanocontabil.com.br', 'office_predictive_tax_audit_radar', 'fiscal')).toBe(true);
    expect(officeStore.isModuleAllowedForUser('beatriz.tributario@soberanocontabil.com.br', 'payroll', 'dp')).toBe(false);

    // 5.3 Analista de DP tem acesso a DP mas não a apuração fiscal
    expect(officeStore.isModuleAllowedForUser('carlos.dp@soberanocontabil.com.br', 'payroll', 'dp')).toBe(true);
    expect(officeStore.isModuleAllowedForUser('carlos.dp@soberanocontabil.com.br', 'office_predictive_tax_audit_radar', 'fiscal')).toBe(false);

    // 5.4 Cliente BPO tem acesso aos módulos contratados (Emissor) mas não a folha
    expect(officeStore.isModuleAllowedForUser('diretoria@soberanotech.com.br', 'office_invoice_billing_issuer', 'fiscal')).toBe(true);
    expect(officeStore.isModuleAllowedForUser('diretoria@soberanotech.com.br', 'payroll', 'dp')).toBe(false);
  });

  it('6. OfficeStateStore: valida primeiro acesso e criação de senha apenas para e-mails pré-aprovados', () => {
    // 6.1 E-mails pré-aprovados no sistema devem ser autorizados
    const checkMaster = officeStore.isUserAuthorizedForPasswordCreation('dfvalu@gmail.com');
    expect(checkMaster.authorized).toBe(true);
    expect(checkMaster.userName).toBe('DAVID VALU');

    const checkTax = officeStore.isUserAuthorizedForPasswordCreation('beatriz.tributario@soberanocontabil.com.br');
    expect(checkTax.authorized).toBe(true);
    expect(checkTax.userName).toContain('Beatriz');

    // 6.2 E-mail desconhecido deve ser terminantemente rejeitado
    const checkUnknown = officeStore.isUserAuthorizedForPasswordCreation('hacker.estranho@gmail.com');
    expect(checkUnknown.authorized).toBe(false);
    expect(checkUnknown.reason).toContain('não localizado');

    // 6.3 Registro de senha com hash e trilha de auditoria
    const regSuccess = officeStore.registerUserPassword('beatriz.tributario@soberanocontabil.com.br', 'mock-sha256-hash-12345');
    expect(regSuccess).toBe(true);

    const regFail = officeStore.registerUserPassword('hacker.estranho@gmail.com', 'mock-sha256-hash-12345');
    expect(regFail).toBe(false);
  });

  it('7. OfficeStateStore: valida autenticação por Certificado Digital ICP-Brasil e PIN na base homologada', () => {
    // 7.1 Certificado Homologado com PIN Correto -> Autorizado
    const checkValid = officeStore.isCertificateAuthorizedForLogin('cert-david', '123456');
    expect(checkValid.authorized).toBe(true);
    expect(checkValid.certificate?.holderName).toContain('DAVID VALU');
    expect(checkValid.certificate?.linkedUserEmail).toBe('dfvalu@gmail.com');

    // 7.2 Certificado Homologado com PIN Incorreto -> Bloqueado com erro
    const checkWrongPin = officeStore.isCertificateAuthorizedForLogin('cert-david', 'senha-errada-999');
    expect(checkWrongPin.authorized).toBe(false);
    expect(checkWrongPin.reason).toContain('Senha PIN / Token A3 incorreta');

    // 7.3 Certificado Inexistente / Não Homologado -> Bloqueado com erro
    const checkFakeCert = officeStore.isCertificateAuthorizedForLogin('cert-fake-atacante', '123456');
    expect(checkFakeCert.authorized).toBe(false);
    expect(checkFakeCert.reason).toContain('não homologado na base de dados');
  });

  it('8. OfficeStateStore: valida credenciais corporativas com bloqueio estrito de senhas e usuários não autorizados', () => {
    // 8.1 Usuário Homologado com Senha Correta -> Autorizado
    const validLogin = officeStore.validateUserCredentials('dfvalu@gmail.com', 'Soberano#2026');
    expect(validLogin.success).toBe(true);
    expect(validLogin.userProfile?.name).toBe('DAVID VALU');
    expect(validLogin.userProfile?.role).toBe('MASTER_ACCOUNTANT');

    // 8.2 Usuário Homologado com Senha Incorreta -> Bloqueado
    const wrongPasswordLogin = officeStore.validateUserCredentials('dfvalu@gmail.com', '123456');
    expect(wrongPasswordLogin.success).toBe(false);
    expect(wrongPasswordLogin.reason).toContain('Senha de acesso incorreta');

    // 8.3 Senha com menos de 6 dígitos -> Bloqueado
    const shortPasswordLogin = officeStore.validateUserCredentials('dfvalu@gmail.com', '1234');
    expect(shortPasswordLogin.success).toBe(false);
    expect(shortPasswordLogin.reason).toContain('mínimo 6 caracteres');

    // 8.4 Usuário Não Cadastrado -> Bloqueado com Erro de Governança
    const unknownUserLogin = officeStore.validateUserCredentials('hacker.estranho@gmail.com', 'SenhaForte#2026');
    expect(unknownUserLogin.success).toBe(false);
    expect(unknownUserLogin.reason).toContain('não cadastrado no sistema');

    // 8.5 Testar atualização de senha no Primeiro Acesso e login subsequente
    officeStore.registerUserPassword('beatriz.tributario@soberanocontabil.com.br', 'NovaSenhaBeatriz#2026');
    const newPassLogin = officeStore.validateUserCredentials('beatriz.tributario@soberanocontabil.com.br', 'NovaSenhaBeatriz#2026');
    expect(newPassLogin.success).toBe(true);
    expect(newPassLogin.userProfile?.name).toContain('Beatriz');
  });
});
