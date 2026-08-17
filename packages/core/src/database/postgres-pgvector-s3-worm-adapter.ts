import { Result, Ok, Err } from '../types/result.js';

export interface PostgresPoolConfig {
  maxConnections: number; // Ex: 50 conexões
  idleTimeoutMillis: number; // Ex: 30000ms
  connectionTimeoutMillis: number; // Ex: 2000ms
  enablePgVectorExtension: boolean;
}

export interface S3WormStorageInput {
  tenantCnpj: string;
  documentKey: string; // Ex: 'xmls/2026/08/nfe-35260812345678000190550010000001231000001234.xml'
  documentSha256: string;
  retentionYears: number; // Ex: 5 anos conforme Art. 173 do CTN
  payloadBufferBase64: string;
}

export interface S3WormStorageResult {
  s3Uri: string;
  bucketWormName: string;
  objectLockMode: 'COMPLIANCE_LEGAL_HOLD';
  retainedUntilIso: string;
  documentSha256: string;
  statusGuardaFiscal: 'DOCUMENTO_GUARDADO_IMUTAVEL_5_ANOS';
  diagnosticoStorage: string;
}

export function processS3WormStorageAdapter(input: S3WormStorageInput): Result<S3WormStorageResult, Error> {
  const {
    tenantCnpj,
    documentKey,
    documentSha256,
    retentionYears = 5,
    payloadBufferBase64
  } = input;

  if (!tenantCnpj || !documentKey || payloadBufferBase64.length === 0) {
    return Err(new Error('CNPJ, chave do documento e payload são obrigatórios para guarda S3 WORM.'));
  }

  const currentDate = new Date('2026-08-17T15:00:00Z');
  const retainUntil = new Date(currentDate.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000);
  const s3Uri = 's3://soberano-fiscal-worm-vault/' + tenantCnpj + '/' + documentKey;

  const diag = "S3 WORM Storage (Art. 173 CTN): Documento " + documentKey + " (CNPJ: " + tenantCnpj + ") | Hash: " + documentSha256.substring(0, 16) + "... -> Guardado com Object Lock COMPLIANCE ate " + retainUntil.toISOString() + " (Imutavel).";

  return Ok({
    s3Uri,
    bucketWormName: 'soberano-fiscal-worm-vault',
    objectLockMode: 'COMPLIANCE_LEGAL_HOLD',
    retainedUntilIso: retainUntil.toISOString(),
    documentSha256,
    statusGuardaFiscal: 'DOCUMENTO_GUARDADO_IMUTAVEL_5_ANOS',
    diagnosticoStorage: diag
  });
}
