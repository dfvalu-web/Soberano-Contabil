import { JournalEntry } from '../../types/accounting.js';
import { SecurityEngine } from '../../security/crypto.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface LedgerBlock {
  sequence: number;
  tenantId: string;
  companyId: string;
  merkleRootHash: string;
  previousBlockHash: string;
  blockHash: string;
  entries: JournalEntry[];
  timestamp: string;
  isSealed: boolean;
}

export class ImmutableLedgerChain {
  private chain: LedgerBlock[] = [];
  private security: SecurityEngine;

  constructor(security: SecurityEngine) {
    this.security = security;
  }

  public createGenesisBlock(tenantId: string, companyId: string): LedgerBlock {
    const timestamp = new Date().toISOString();
    const genesisHash = this.security.sha256('GENESIS_BLOCK_' + tenantId + '_' + companyId + '_' + timestamp);
    
    const block: LedgerBlock = {
      sequence: 0,
      tenantId,
      companyId,
      merkleRootHash: '0000000000000000000000000000000000000000000000000000000000000000',
      previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      blockHash: genesisHash,
      entries: [],
      timestamp,
      isSealed: true
    };

    this.chain.push(block);
    return block;
  }

  public sealBlock(tenantId: string, companyId: string, entries: JournalEntry[]): Result<LedgerBlock, Error> {
    if (this.chain.length === 0) {
      this.createGenesisBlock(tenantId, companyId);
    }

    const previousBlock = this.chain[this.chain.length - 1]!;
    const sequence = previousBlock.sequence + 1;
    const timestamp = new Date().toISOString();

    // Calcula Merkle Root dos hashes dos lançamentos
    const entryHashes = entries.map(e => e.hashTransacao);
    const merkleRootHash = entryHashes.length > 0
      ? this.security.sha256(entryHashes.join('::'))
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const blockPayload = JSON.stringify({
      sequence,
      tenantId,
      companyId,
      previousBlockHash: previousBlock.blockHash,
      merkleRootHash,
      timestamp,
      entriesCount: entries.length
    });

    const blockHash = this.security.sha256(blockPayload);

    const block: LedgerBlock = {
      sequence,
      tenantId,
      companyId,
      merkleRootHash,
      previousBlockHash: previousBlock.blockHash,
      blockHash,
      entries: [...entries],
      timestamp,
      isSealed: true
    };

    this.chain.push(block);
    return Ok(block);
  }

  public verifyChainIntegrity(): { isValid: boolean; corruptedBlockSequence?: number; reason?: string } {
    if (this.chain.length <= 1) return { isValid: true };

    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i]!;
      const previous = this.chain[i - 1]!;

      // 1. Verifica apontamento de hash do bloco anterior
      if (current.previousBlockHash !== previous.blockHash) {
        return {
          isValid: false,
          corruptedBlockSequence: current.sequence,
          reason: 'Encadeamento quebrado: previousBlockHash nao corresponde ao hash do bloco anterior.'
        };
      }

      // 2. Recalcula Merkle Root das entradas
      const entryHashes = current.entries.map(e => e.hashTransacao);
      const computedMerkle = entryHashes.length > 0
        ? this.security.sha256(entryHashes.join('::'))
        : '0000000000000000000000000000000000000000000000000000000000000000';

      if (computedMerkle !== current.merkleRootHash) {
        return {
          isValid: false,
          corruptedBlockSequence: current.sequence,
          reason: 'Merkle Root adulterado: o conteudo dos lancamentos foi modificado.'
        };
      }

      // 3. Recalcula o hash do bloco atual
      const blockPayload = JSON.stringify({
        sequence: current.sequence,
        tenantId: current.tenantId,
        companyId: current.companyId,
        previousBlockHash: current.previousBlockHash,
        merkleRootHash: current.merkleRootHash,
        timestamp: current.timestamp,
        entriesCount: current.entries.length
      });

      const computedBlockHash = this.security.sha256(blockPayload);
      if (computedBlockHash !== current.blockHash) {
        return {
          isValid: false,
          corruptedBlockSequence: current.sequence,
          reason: 'Hash do bloco invalido.'
        };
      }
    }

    return { isValid: true };
  }

  public getBlocks(): LedgerBlock[] {
    return [...this.chain];
  }
}
