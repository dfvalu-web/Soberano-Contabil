import { Result, Ok, Err } from '../types/result.js';

export interface VersionedEntity {
  id: string;
  version: number;
}

export class TransactionManager {
  public static async executeWithOptimisticLock<T extends VersionedEntity, R>(
    entity: T,
    operation: (lockedEntity: T) => Promise<R>,
    persist: (updatedEntity: T, newVersion: number) => Promise<boolean>
  ): Promise<Result<R, Error>> {
    const currentVersion = entity.version;
    
    try {
      const result = await operation(entity);
      const nextVersion = currentVersion + 1;
      
      const success = await persist({ ...entity, version: nextVersion }, nextVersion);
      if (!success) {
        return Err(new Error('Conflito de Concorrencia Otimista: o registro foi modificado por outra transacao concorrente.'));
      }

      entity.version = nextVersion;
      return Ok(result);
    } catch (err) {
      return Err(err instanceof Error ? err : new Error('Falha na execucao da transacao.'));
    }
  }
}
