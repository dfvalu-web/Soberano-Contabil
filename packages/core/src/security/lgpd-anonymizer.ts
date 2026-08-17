import { SecurityEngine } from './crypto.js';

export interface PersonalDataRecord {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  salario: number;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
  };
  consentimentoLgpdColetado: boolean;
  dataConsentimento: string;
}

export class LgpdComplianceManager {
  private security: SecurityEngine;

  constructor(security: SecurityEngine) {
    this.security = security;
  }

  public maskForViewer(record: PersonalDataRecord): Record<string, any> {
    return {
      id: record.id,
      nome: record.nome,
      cpf: SecurityEngine.maskCpf(record.cpf),
      email: record.email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '***'),
      salario: SecurityEngine.maskSalary(record.salario),
      dadosBancarios: {
        banco: record.dadosBancarios.banco,
        agencia: '***',
        conta: SecurityEngine.maskBankAccount(record.dadosBancarios.conta)
      },
      consentimentoLgpdColetado: record.consentimentoLgpdColetado,
      dataConsentimento: record.dataConsentimento
    };
  }

  public anonymizePermanently(record: PersonalDataRecord): PersonalDataRecord {
    const anonId = this.security.sha256(record.id).substring(0, 12);
    return {
      id: record.id,
      nome: 'TITULAR ANONIMIZADO ' + anonId,
      cpf: '00000000000',
      email: 'anonimizado_' + anonId + '@soberanoprivacy.internal',
      salario: 0,
      dadosBancarios: {
        banco: '000',
        agencia: '0000',
        conta: '00000-0'
      },
      consentimentoLgpdColetado: false,
      dataConsentimento: new Date().toISOString()
    };
  }
}
