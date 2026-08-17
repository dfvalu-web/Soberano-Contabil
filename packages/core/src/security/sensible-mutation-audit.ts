import { Result, Ok, Err } from '../types/result.js';
import { SecurityEngine } from './crypto.js';

export interface BankAccountMutationInput {
  entidadeId: string; // ID Fornecedor ou Empregado
  tipoEntidade: 'FORNECEDOR' | 'COLABORADOR' | 'SOCIO';
  nomeEntidade: string;
  usuarioResponsavelAlteracaoId: string;
  dadosBancariosAnteriores: {
    banco: string;
    agencia: string;
    conta: string;
    chavePix: string;
  };
  novosDadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    chavePix: string;
  };
  justificativaAlteracao: string;
}

export interface BankAccountMutationAuditLog {
  logId: string;
  timestamp: string;
  entidadeId: string;
  tipoEntidade: string;
  usuarioResponsavel: string;
  hashRegistroAnterior: string;
  hashRegistroNovo: string;
  statusAprovacao: 'PENDENTE_CONFIRMACAO_DUPLA_2FA' | 'APROVADO_AUDITADO';
  alertaRiscoFraude: boolean;
  mensagemAlerta?: string;
}

export class SensibleMutationAuditEngine {
  private security: SecurityEngine;

  constructor(security: SecurityEngine) {
    this.security = security;
  }

  public auditBankAccountChange(
    input: BankAccountMutationInput,
    hashAnteriorCadeia: string = '0000000000000000000000000000000000000000000000000000000000000000'
  ): Result<BankAccountMutationAuditLog, Error> {
    if (!input.justificativaAlteracao || input.justificativaAlteracao.trim().length < 10) {
      return Err(new Error('Alterações cadastrais bancárias exigem justificativa formal detalhada (mínimo 10 caracteres).'));
    }

    const payloadNovo = JSON.stringify(input.novosDadosBancarios) + input.usuarioResponsavelAlteracaoId + Date.now();
    const hashNovo = this.security.sha256(payloadNovo + hashAnteriorCadeia);

    // Alerta se a alteração for de chave PIX sem confirmação prévia
    const isAlteracaoPix = input.dadosBancariosAnteriores.chavePix !== input.novosDadosBancarios.chavePix;

    return Ok({
      logId: 'MUT-BANK-' + Date.now(),
      timestamp: new Date().toISOString(),
      entidadeId: input.entidadeId,
      tipoEntidade: input.tipoEntidade,
      usuarioResponsavel: input.usuarioResponsavelAlteracaoId,
      hashRegistroAnterior: hashAnteriorCadeia,
      hashRegistroNovo: hashNovo,
      statusAprovacao: isAlteracaoPix ? 'PENDENTE_CONFIRMACAO_DUPLA_2FA' : 'APROVADO_AUDITADO',
      alertaRiscoFraude: isAlteracaoPix,
      mensagemAlerta: isAlteracaoPix
        ? 'Atenção: Houve alteração de chave PIX cadastrada. Exige confirmação de 2FA e contato telefônico gravado para liberação de pagamentos.'
        : undefined
    });
  }
}
