import { SpedRecord } from '../../types/sped.js';

export class SpedWriter {
  private lines: string[] = [];
  private recordCounts: Map<string, number> = new Map();

  public addRecord(registro: string, ...campos: (string | number | undefined | null)[]): void {
    const formattedFields = campos.map(f => {
      if (f === undefined || f === null) return '';
      if (typeof f === 'number') {
        // Se for inteiro puro e for indicador ou sequência curta, mantém inteiro, senão formata com 2 casas
        if (Number.isInteger(f) && (f >= 0 && f <= 9999 && !String(f).includes('.'))) {
          return String(f);
        }
        return f.toFixed(2).replace('.', ',');
      }
      return String(f).replace(/\|/g, '');
    });

    const line = '|' + registro + '|' + formattedFields.join('|') + '|';
    this.lines.push(line);

    const count = this.recordCounts.get(registro) || 0;
    this.recordCounts.set(registro, count + 1);
  }

  public closeBlock9(): void {
    this.addRecord('9001', '0');

    for (const [reg, count] of this.recordCounts.entries()) {
      this.addRecord('9900', reg, count);
    }
    
    this.addRecord('9900', '9001', 1);
    this.addRecord('9900', '9900', this.recordCounts.size + 4);
    this.addRecord('9900', '9990', 1);
    this.addRecord('9900', '9999', 1);

    this.addRecord('9990', this.lines.length + 2);
    this.addRecord('9999', this.lines.length + 1);
  }

  public build(): string {
    return this.lines.join(String.fromCharCode(13, 10));
  }

  public getLines(): string[] {
    return [...this.lines];
  }
}
