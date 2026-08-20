import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RealWebCryptoEngine } from '@soberano/core';
import { officeStore } from '../state/office-store';
import { OfficeLoginSecurityGovernanceView } from '../views/OfficeLoginSecurityGovernanceView';

describe('Criptografia Real Web Crypto API & Central de Governança de Login', () => {
  it('1. RealWebCryptoEngine: gera hashes SHA-256 reais, derivação PBKDF2 e envelopes AES-256-GCM', async () => {
    // 1.1 Hash SHA-256 com Salt
    const salt = RealWebCryptoEngine.generateSecureNonce(16);
    expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars

    const hash1 = await RealWebCryptoEngine.hashSha256('Soberano@2026', salt);
    expect(hash1).toHaveLength(64); // SHA-256 = 64 hex chars
    
    const isValid = await RealWebCryptoEngine.verifyHash('Soberano@2026', hash1, salt);
    expect(isValid).toBe(true);

    // 1.2 Criptografia e Descriptografia Real AES-256-GCM
    const secretMessage = JSON.stringify({ user: 'david.valu@soberanocontabil.com.br', role: 'MASTER_ADMIN' });
    const encrypted = await RealWebCryptoEngine.encryptAesGcm(secretMessage, 'SoberanoMasterPass#2026');

    expect(encrypted.ciphertextHex).toBeDefined();
    expect(encrypted.ivHex).toHaveLength(24); // 12 bytes = 24 hex chars (GCM standard)
    expect(encrypted.hashSha256).toHaveLength(64);

    const decrypted = await RealWebCryptoEngine.decryptAesGcm(encrypted, 'SoberanoMasterPass#2026');
    expect(decrypted).toBe(secretMessage);
    const parsed = JSON.parse(decrypted);
    expect(parsed.user).toBe('david.valu@soberanocontabil.com.br');

    // 1.3 Assinatura Criptográfica HMAC-SHA256 para Desafio de Certificado
    const challenge = 'ICP-BRASIL-AUTH-CHALLENGE-2026';
    const pin = '123456';
    const signature = await RealWebCryptoEngine.signChallengeHMAC(challenge, pin);
    expect(signature).toHaveLength(64);
  });

  it('2. OfficeStateStore: controla e valida políticas de métodos de login permitidos', () => {
    const policies = officeStore.getLoginPolicies();
    expect(policies.length).toBe(4);

    // Certificado e Senha devem estar habilitados por padrão
    const certPolicy = officeStore.isLoginMethodAllowed('CERTIFICATE_ICP_BRASIL');
    expect(certPolicy.allowed).toBe(true);

    const passPolicy = officeStore.isLoginMethodAllowed('EMAIL_PASSWORD_HASH');
    expect(passPolicy.allowed).toBe(true);

    // Magic Link deve estar desabilitado por política rígida
    const magicPolicy = officeStore.isLoginMethodAllowed('MAGIC_LINK');
    expect(magicPolicy.allowed).toBe(false);
    expect(magicPolicy.reason).toContain('temporariamente desabilitado');
  });

  it('3. OfficeStateStore: gerencia fila de aprovação master e registro de auditoria imutável', () => {
    const pending = officeStore.getPendingUserApprovals();
    expect(pending.length).toBeGreaterThanOrEqual(1);

    const firstReq = pending[0];
    officeStore.approveUserAccess(firstReq.id, 'DAVID VALU');
    
    const updatedPending = officeStore.getPendingUserApprovals();
    const approvedReq = updatedPending.find(r => r.id === firstReq.id);
    expect(approvedReq?.status).toBe('APPROVED');
    expect(approvedReq?.approvedBy).toBe('DAVID VALU');

    // Log de auditoria
    officeStore.logAuthSecurityEvent({
      userEmail: 'auditor@soberanocontabil.com.br',
      userName: 'AUDITOR FISCAL',
      method: 'Certificado ICP-Brasil (e-CPF A3)',
      ipAddress: '200.180.90.10',
      deviceInfo: 'Chrome 128 / Windows',
      status: 'SUCCESS',
      hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      encryptionTag: 'AES-256-GCM / HMAC-SHA256'
    });

    const logs = officeStore.getAuthSecurityAuditLogs();
    expect(logs[0].userEmail).toBe('auditor@soberanocontabil.com.br');
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
});
