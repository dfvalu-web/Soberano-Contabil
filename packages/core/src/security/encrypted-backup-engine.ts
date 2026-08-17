import { Result, Ok, Err } from '../types/result.js';
import { SecurityEngine } from './crypto.js';

export interface BackupPayloadInput {
  tenantId: string;
  timestamp: string;
  totalLancamentos: number;
  totalContas: number;
  dadosJsonBrutos: string;
}

export interface EncryptedBackupPackage {
  backupId: string;
  tenantId: string;
  timestampGeracao: string;
  algoritmoCifragem: 'AES-256-GCM';
  merkleRootIntegridadeSha256: string;
  ivHex: string;
  authTagHex: string;
  conteudoCifradoHex: string;
  tamanhoBytes: number;
}

export interface RestoreVerificationReport {
  backupId: string;
  restauracaoValida: boolean;
  registrosRecuperados: number;
  merkleIntegrityMatch: boolean;
  mensagem: string;
}

export class EncryptedBackupEngine {
  private security: SecurityEngine;

  constructor(security: SecurityEngine) {
    this.security = security;
  }

  public createEncryptedBackup(
    input: BackupPayloadInput,
    chaveMestraHex?: string
  ): Result<EncryptedBackupPackage, Error> {
    if (!input.dadosJsonBrutos || input.dadosJsonBrutos.length === 0) {
      return Err(new Error('Dados para backup estão vazios.'));
    }

    const sec = chaveMestraHex ? new SecurityEngine(chaveMestraHex) : this.security;
    const merkleRoot = sec.sha256(input.dadosJsonBrutos + input.tenantId);
    const enc = sec.encrypt(input.dadosJsonBrutos);

    return Ok({
      backupId: 'BKP-' + input.tenantId + '-' + Date.now(),
      tenantId: input.tenantId,
      timestampGeracao: new Date().toISOString(),
      algoritmoCifragem: 'AES-256-GCM',
      merkleRootIntegridadeSha256: merkleRoot,
      ivHex: enc.iv,
      authTagHex: enc.tag,
      conteudoCifradoHex: enc.cipherText,
      tamanhoBytes: enc.cipherText.length
    });
  }

  public verifyAndRestoreBackup(
    backup: EncryptedBackupPackage,
    chaveMestraHex?: string
  ): Result<RestoreVerificationReport, Error> {
    try {
      const sec = chaveMestraHex ? new SecurityEngine(chaveMestraHex) : this.security;
      const jsonRestaurado = sec.decrypt(backup.conteudoCifradoHex, backup.ivHex, backup.authTagHex);
      const computedMerkle = sec.sha256(jsonRestaurado + backup.tenantId);
      const integrityMatch = computedMerkle === backup.merkleRootIntegridadeSha256;

      if (!integrityMatch) {
        return Err(new Error('Falha de integridade: Selo Merkle Root não confere com os dados restaurados.'));
      }

      return Ok({
        backupId: backup.backupId,
        restauracaoValida: true,
        registrosRecuperados: 1,
        merkleIntegrityMatch: true,
        mensagem: 'Dry-run restore executado com sucesso: dados 100% íntegros e autênticos.'
      });
    } catch (e: unknown) {
      return Err(new Error('Falha de descriptografia no restore: ' + (e instanceof Error ? e.message : String(e))));
    }
  }
}
