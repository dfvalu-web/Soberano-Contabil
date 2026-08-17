import { Result, Ok, Err } from '../types/result.js';
import { SecurityEngine } from './crypto.js';

export interface DataEncryptionKeyRecord {
  dekId: string;
  kekVersion: number;
  encryptedDekHex: string;
  ivHex: string;
  tagHex: string;
  criadoEm: string;
}

export class KmsKeyRotationManager {
  private security: SecurityEngine;
  private currentKekVersion = 1;
  private masterKeks: Map<number, string> = new Map();

  constructor(security: SecurityEngine, initialKekHex: string) {
    this.security = security;
    this.masterKeks.set(1, initialKekHex);
  }

  public createEncryptedDek(dekId: string, plainDekHex: string): Result<DataEncryptionKeyRecord, Error> {
    const kek = this.masterKeks.get(this.currentKekVersion);
    if (!kek) return Err(new Error('KEK da versão atual não encontrada.'));

    const sec = new SecurityEngine(kek);
    const enc = sec.encrypt(plainDekHex);

    return Ok({
      dekId,
      kekVersion: this.currentKekVersion,
      encryptedDekHex: enc.cipherText,
      ivHex: enc.iv,
      tagHex: enc.tag,
      criadoEm: new Date().toISOString()
    });
  }

  public decryptDek(record: DataEncryptionKeyRecord): Result<string, Error> {
    const kek = this.masterKeks.get(record.kekVersion);
    if (!kek) return Err(new Error('KEK da versão ' + record.kekVersion + ' não encontrada.'));

    try {
      const sec = new SecurityEngine(kek);
      const plainDek = sec.decrypt(record.encryptedDekHex, record.ivHex, record.tagHex);
      return Ok(plainDek);
    } catch (e: unknown) {
      return Err(new Error('Falha ao decifrar DEK: ' + (e instanceof Error ? e.message : String(e))));
    }
  }

  public rotateKek(newKekHex: string, activeDeks: DataEncryptionKeyRecord[]): Result<DataEncryptionKeyRecord[], Error> {
    const newVersion = this.currentKekVersion + 1;
    this.masterKeks.set(newVersion, newKekHex);

    const reEncryptedDeks: DataEncryptionKeyRecord[] = [];

    for (const record of activeDeks) {
      const decResult = this.decryptDek(record);
      if (!decResult.success) {
        return Err(new Error('Falha ao rodar DEK ' + record.dekId + ' durante a rotação de KEK: ' + decResult.error.message));
      }

      const secNew = new SecurityEngine(newKekHex);
      const encNew = secNew.encrypt(decResult.data);

      reEncryptedDeks.push({
        dekId: record.dekId,
        kekVersion: newVersion,
        encryptedDekHex: encNew.cipherText,
        ivHex: encNew.iv,
        tagHex: encNew.tag,
        criadoEm: new Date().toISOString()
      });
    }

    this.currentKekVersion = newVersion;
    return Ok(reEncryptedDeks);
  }

  public getCurrentKekVersion(): number {
    return this.currentKekVersion;
  }
}
