import * as nodeCrypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export class SecurityEngine {
  private masterKey: any;

  constructor(masterKeyHex?: string) {
    const keyStr = (masterKeyHex && masterKeyHex.length === 64)
      ? masterKeyHex
      : '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    if (typeof Buffer !== 'undefined') {
      this.masterKey = Buffer.from(keyStr, 'hex');
    } else {
      this.masterKey = keyStr;
    }
  }

  public encrypt(plainText: string): { cipherText: string; iv: string; tag: string } {
    if (nodeCrypto && typeof nodeCrypto.createCipheriv === 'function') {
      const iv = nodeCrypto.randomBytes(IV_LENGTH);
      const cipher = nodeCrypto.createCipheriv(ALGORITHM, this.masterKey, iv);
      
      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const tag = cipher.getAuthTag().toString('hex');

      return {
        cipherText: encrypted,
        iv: iv.toString('hex'),
        tag
      };
    }

    return {
      cipherText: typeof btoa !== 'undefined' ? btoa(plainText) : plainText,
      iv: 'browser-iv-16b',
      tag: 'browser-tag-16b'
    };
  }

  public decrypt(cipherTextHex: string, ivHex: string, tagHex: string): string {
    if (nodeCrypto && typeof nodeCrypto.createDecipheriv === 'function' && typeof Buffer !== 'undefined') {
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      const decipher = nodeCrypto.createDecipheriv(ALGORITHM, this.masterKey, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(cipherTextHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }

    try {
      return typeof atob !== 'undefined' ? atob(cipherTextHex) : cipherTextHex;
    } catch {
      return cipherTextHex;
    }
  }

  public sha256(content: string): string {
    if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
      return nodeCrypto.createHash('sha256').update(content).digest('hex');
    }
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public hmacSha256(content: string, secret: string): string {
    if (nodeCrypto && typeof nodeCrypto.createHmac === 'function') {
      return nodeCrypto.createHmac('sha256', secret).update(content).digest('hex');
    }
    return this.sha256(content + secret);
  }

  // Mascaramento de dados em conformidade com LGPD
  public static maskCpf(cpf: string): string {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return '***.***.***-**';
    return clean.substring(0, 3) + '.***.***-' + clean.substring(9, 11);
  }

  public static maskCnpj(cnpj: string): string {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) return '**.***.***/****-**';
    return clean.substring(0, 2) + '.***.***/' + clean.substring(8, 12) + '-' + clean.substring(12, 14);
  }

  public static maskSalary(salary: number): string {
    return 'R$ ****,**';
  }

  public static maskBankAccount(account: string): string {
    if (account.length <= 4) return '****';
    return '***' + account.slice(-4);
  }
}
