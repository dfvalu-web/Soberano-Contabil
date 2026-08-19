import { describe, it, expect } from 'vitest';
import {
  processOfficeAntiMoneyLaunderingCoafEngine,
  processOfficeCoafNonOccurrenceComplianceEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Prevenção à Lavagem de Dinheiro (PLD/CFT) & COAF / CFC', () => {
  it('1. Deve auditar operacoes e identificar transacoes atipicas ou socios PEPs requerendo COAF', () => {
    const resAml = processOfficeAntiMoneyLaunderingCoafEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      mesReferencia: '2026-08',
      operacoesAvaliadas: [
        {
          operacaoId: 'OP-001',
          clienteCnpj: '11.111.111/0001-11',
          razaoSocialCliente: 'Comércio Varejista Alfa Ltda',
          valorOperacaoBrl: 15000.00,
          tipoOperacao: 'OPERACAO_NORMAL',
          envolvePessoaExpostaPoliticamentePep: false
        },
        {
          operacaoId: 'OP-002',
          clienteCnpj: '22.222.222/0001-22',
          razaoSocialCliente: 'Factoring e Investimentos Beta Ltda',
          valorOperacaoBrl: 150000.00,
          tipoOperacao: 'ESPECIE_ACIMA_50K',
          envolvePessoaExpostaPoliticamentePep: true
        }
      ]
    });

    const dataAml = unwrap(resAml);
    expect(dataAml.totalOperacoesAvaliadas).toBe(2);
    expect(dataAml.operacoesSuspeitasIdentificadas).toBe(1);
    expect(dataAml.operacoesNormais).toBe(1);
    expect(dataAml.requerComunicacaoCoaf).toBe(true);
    expect(dataAml.statusPld).toBe('AUDITORIA_PLD_CFT_CONCLUIDA_COM_SUCESSO');
    expect(dataAml.diagnosticoPld).toContain('Requer comunicacao formal ao COAF');
  });

  it('2. Deve gerar Declaracao Anual de Nao Ocorrencia (DNO) ao CFC/COAF com protocolo hash', () => {
    const resDno = processOfficeCoafNonOccurrenceComplianceEngine({
      contadorCpf: '123.456.789-00',
      contadorNome: 'Dr. David Valu',
      numeroRegistroCrc: 'CRC/SP 123456/O-0',
      anoExercicioDeclarado: 2026,
      totalClientesAuditados: 128,
      houveOperacoesSuspeitasNoAno: false
    });

    const dataDno = unwrap(resDno);
    expect(dataDno.anoExercicioDeclarado).toBe(2026);
    expect(dataDno.tipoDeclaracao).toBe('DECLARACAO_DE_NAO_OCORRENCIA_DNO');
    expect(dataDno.reciboTransmissaoHashSha256).toContain('COAF-2026-');
    expect(dataDno.statusDeclaracao).toBe('DECLARACAO_TRANSMITIDA_E_ARQUIVADA_CFC_COAF');
    expect(dataDno.diagnosticoDeclaracao).toContain('transmitiu com sucesso DECLARACAO_DE_NAO_OCORRENCIA_DNO');
  });
});
