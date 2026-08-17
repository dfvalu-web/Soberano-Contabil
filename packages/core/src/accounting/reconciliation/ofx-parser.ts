import { Result, Ok, Err } from '../../types/result.js';

export interface BankTransaction {
  fitId: string;
  type: 'CREDIT' | 'DEBIT';
  datePosted: string;
  amount: number;
  memo: string;
  checkNum?: string;
}

export interface BankStatement {
  bankId: string;
  accountId: string;
  startDate: string;
  endDate: string;
  transactions: BankTransaction[];
  ledgerBalance: number;
}

export function parseOfx(ofxContent: string): Result<BankStatement, Error> {
  try {
    if (!ofxContent || typeof ofxContent !== 'string') {
      return Err(new Error('Conteúdo OFX inválido ou vazio.'));
    }

    const transactions: BankTransaction[] = [];
    const stmtTrnRegex = new RegExp('<STMTTRN>([\\s\\S]*?)<\\/STMTTRN>', 'gi');
    let match;

    while ((match = stmtTrnRegex.exec(ofxContent)) !== null) {
      const trnBlock = match[1] || '';
      
      const trnTypeMatch = new RegExp('<TRNTYPE>([^<\\r\\n]+)', 'i').exec(trnBlock);
      const dtPostedMatch = new RegExp('<DTPOSTED>([^<\\r\\n]+)', 'i').exec(trnBlock);
      const trnAmtMatch = new RegExp('<TRNAMT>([^<\\r\\n]+)', 'i').exec(trnBlock);
      const fitIdMatch = new RegExp('<FITID>([^<\\r\\n]+)', 'i').exec(trnBlock);
      const memoMatch = new RegExp('<MEMO>([^<\\r\\n]+)', 'i').exec(trnBlock);
      const checkNumMatch = new RegExp('<CHECKNUM>([^<\\r\\n]+)', 'i').exec(trnBlock);

      const rawDate = dtPostedMatch ? dtPostedMatch[1].trim() : '';
      let formattedDate = new Date().toISOString().substring(0, 10);
      if (rawDate.length >= 8) {
        formattedDate = rawDate.substring(0, 4) + '-' + rawDate.substring(4, 6) + '-' + rawDate.substring(6, 8);
      }

      const rawAmount = trnAmtMatch ? parseFloat(trnAmtMatch[1].trim().replace(',', '.')) : 0;
      const amount = Math.abs(rawAmount);
      const type: 'CREDIT' | 'DEBIT' = rawAmount >= 0 ? 'CREDIT' : 'DEBIT';

      transactions.push({
        fitId: fitIdMatch ? fitIdMatch[1].trim() : ('TRN-' + Date.now() + '-' + Math.random()),
        type,
        datePosted: formattedDate,
        amount,
        memo: memoMatch ? memoMatch[1].trim() : (type === 'CREDIT' ? 'Depósito / Transferência Recebida' : 'Pagamento / Tarifa'),
        checkNum: checkNumMatch ? checkNumMatch[1].trim() : undefined
      });
    }

    const bankIdMatch = new RegExp('<BANKID>([^<\\r\\n]+)', 'i').exec(ofxContent);
    const acctIdMatch = new RegExp('<ACCTID>([^<\\r\\n]+)', 'i').exec(ofxContent);
    const balAmtMatch = new RegExp('<BALAMT>([^<\\r\\n]+)', 'i').exec(ofxContent);

    return Ok({
      bankId: bankIdMatch ? bankIdMatch[1].trim() : '001',
      accountId: acctIdMatch ? acctIdMatch[1].trim() : 'CC-0001',
      startDate: transactions.length > 0 ? transactions[0].datePosted : new Date().toISOString().substring(0, 10),
      endDate: transactions.length > 0 ? transactions[transactions.length - 1].datePosted : new Date().toISOString().substring(0, 10),
      transactions,
      ledgerBalance: balAmtMatch ? parseFloat(balAmtMatch[1].trim().replace(',', '.')) : 0
    });
  } catch (err) {
    return Err(err instanceof Error ? err : new Error('Falha ao processar arquivo OFX.'));
  }
}
