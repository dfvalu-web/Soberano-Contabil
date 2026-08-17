import { SecurityEngine } from './crypto.js';

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  oldState?: Record<string, any>;
  newState?: Record<string, any>;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY';
  timestamp: string;
  integritySignature: string;
}

export class AuditTrailManager {
  private securityEngine: SecurityEngine;
  private logs: AuditLogEntry[] = [];

  constructor(securityEngine: SecurityEngine) {
    this.securityEngine = securityEngine;
  }

  public record(
    tenantId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    oldState?: Record<string, any>,
    newState?: Record<string, any>,
    userId?: string,
    severity: AuditLogEntry['severity'] = 'INFO',
    ipAddress?: string
  ): AuditLogEntry {
    const timestamp = new Date().toISOString();
    const payloadToSign = JSON.stringify({
      tenantId,
      userId,
      action,
      resourceType,
      resourceId,
      oldState,
      newState,
      timestamp,
      severity
    });

    const integritySignature = this.securityEngine.sha256(payloadToSign);

    const log: AuditLogEntry = {
      id: 'AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      tenantId,
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      oldState,
      newState,
      severity,
      timestamp,
      integritySignature
    };

    this.logs.push(log);
    return log;
  }

  public verifyLogIntegrity(log: AuditLogEntry): boolean {
    const payloadToSign = JSON.stringify({
      tenantId: log.tenantId,
      userId: log.userId,
      action: log.action,
      resourceType: log.resourceType,
      resourceId: log.resourceId,
      oldState: log.oldState,
      newState: log.newState,
      timestamp: log.timestamp,
      severity: log.severity
    });

    const expectedSignature = this.securityEngine.sha256(payloadToSign);
    return expectedSignature === log.integritySignature;
  }

  public getLogs(tenantId: string): AuditLogEntry[] {
    return this.logs.filter(l => l.tenantId === tenantId);
  }
}
