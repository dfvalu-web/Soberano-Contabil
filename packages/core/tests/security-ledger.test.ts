import { describe, it, expect } from 'vitest';
import { SecurityEngine } from '../src/security/crypto.js';
import { AuditTrailManager } from '../src/security/audit-trail.js';
import { ImmutableLedgerChain } from '../src/accounting/ledger/immutable-ledger-chain.js';
import { JournalEntry } from '../src/types/accounting.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 1: Seguranca, Criptografia AES-256 e LGPD', () => {
  const security = new SecurityEngine();

  it('deve criptografar e descriptografar dados sensiveis com AES-256-GCM com autenticidade (tag)', () => {
    const secret = 'SenhaForteCertificadoA1!2026';
    const encrypted = security.encrypt(secret);

    expect(encrypted.cipherText).not.toBe(secret);
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();

    const decrypted = security.decrypt(encrypted.cipherText, encrypted.iv, encrypted.tag);
    expect(decrypted).toBe(secret);
  });

  it('deve mascarar dados pessoais em conformidade com as diretrizes da LGPD', () => {
    expect(SecurityEngine.maskCpf('12345678901')).toBe('123.***.***-01');
    expect(SecurityEngine.maskCnpj('12345678000195')).toBe('12.***.***/0001-95');
    expect(SecurityEngine.maskBankAccount('123456-7')).toBe('***56-7');
    expect(SecurityEngine.maskSalary(15000)).toBe('R$ ****,**');
  });

  it('deve registrar e validar a integridade de trilhas de auditoria imutaveis', () => {
    const audit = new AuditTrailManager(security);
    const log = audit.record(
      'tenant-1',
      'TRANSMISSAO_ECD',
      'SPED_FILE',
      'FILE-001',
      { status: 'DRAFT' },
      { status: 'TRANSMITTED' },
      'user-1',
      'SECURITY',
      '192.168.1.100'
    );

    expect(audit.verifyLogIntegrity(log)).toBe(true);

    // Se o log for adulterado externamente:
    const logAdulterado = { ...log, action: 'DELECAO_ILEGAL' };
    expect(audit.verifyLogIntegrity(logAdulterado)).toBe(false);
  });

  it('deve selar blocos contabeis em Append-Only Ledger e detectar qualquer violacao de integridade', () => {
    const ledger = new ImmutableLedgerChain(security);
    ledger.createGenesisBlock('tenant-1', 'company-1');

    const mockEntries: JournalEntry[] = [
      {
        id: 'JE-1',
        tenantId: 'tenant-1',
        numeroLancamento: 1,
        data: '2026-01-01',
        historicoPadrao: 'Lancamento Teste 1',
        linhas: [],
        totalDebito: 1000,
        totalCredito: 1000,
        criadoEm: new Date(),
        hashTransacao: security.sha256('JE1_CONTENT')
      },
      {
        id: 'JE-2',
        tenantId: 'tenant-1',
        numeroLancamento: 2,
        data: '2026-01-02',
        historicoPadrao: 'Lancamento Teste 2',
        linhas: [],
        totalDebito: 2000,
        totalCredito: 2000,
        criadoEm: new Date(),
        hashTransacao: security.sha256('JE2_CONTENT')
      }
    ];

    const block1 = unwrap(ledger.sealBlock('tenant-1', 'company-1', mockEntries));
    expect(block1.sequence).toBe(1);
    expect(block1.isSealed).toBe(true);

    const verification = ledger.verifyChainIntegrity();
    expect(verification.isValid).toBe(true);

    // Adulteracao simulada: alterando um lancamento dentro do bloco selado
    block1.entries[0]!.totalDebito = 999999;
    block1.entries[0]!.hashTransacao = security.sha256('JE1_ADULTERADO');
    
    const verificationAdulterada = ledger.verifyChainIntegrity();
    expect(verificationAdulterada.isValid).toBe(false);
    expect(verificationAdulterada.reason).toContain('Merkle Root adulterado');
  });
});
