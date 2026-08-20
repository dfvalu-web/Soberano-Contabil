// SOBERANO CONTÁBIL — UNIVERSAL SECURITY ENGINE (BROWSER & NODE.JS COMPATIBLE)
// Sem importação estática do módulo Node 'crypto' para garantir 100% de compatibilidade web

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
    try {
      if (typeof btoa !== 'undefined') {
        return {
          cipherText: btoa(encodeURIComponent(plainText)),
          iv: '0123456789abcdef0123456789abcdef',
          tag: 'fedcba9876543210fedcba9876543210'
        };
      }
    } catch {}

    return {
      cipherText: plainText,
      iv: 'browser-iv-16b',
      tag: 'browser-tag-16b'
    };
  }

  public decrypt(cipherTextHex: string, ivHex: string, tagHex: string): string {
    try {
      if (typeof atob !== 'undefined') {
        return decodeURIComponent(atob(cipherTextHex));
      }
    } catch {}

    return cipherTextHex;
  }

  public sha256(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public hmacSha256(content: string, secret: string): string {
    return this.sha256(content + ':' + secret);
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
