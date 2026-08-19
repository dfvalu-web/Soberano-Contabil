import { describe, it, expect } from 'vitest';
import {
  processClientPortalDispatchEngine,
  processClientPortalRequestsEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Portal do Cliente do Escritório de Contabilidade (B2B)', () => {
  it('1. Deve gerar protocolo eletrônico com hash e consolidar guias disponibilizadas ao cliente', () => {
    const resDispatch = processClientPortalDispatchEngine({
      clienteCnpj: '12.345.678/0001-90',
      razaoSocialCliente: 'Farmácia & Drogaria Central Ltda',
      documentosEnviados: [
        {
          documentoId: 'DOC-DAS-082026',
          tipoDocumento: 'GUIA_DAS',
          competencia: '2026-08',
          valorBrl: 14850.20,
          dataVencimento: '2026-08-20'
        },
        {
          documentoId: 'DOC-FGTS-082026',
          tipoDocumento: 'GUIA_FGTS_DIGITAL',
          competencia: '2026-08',
          valorBrl: 4320.10,
          dataVencimento: '2026-08-15'
        }
      ]
    });

    const dataDispatch = unwrap(resDispatch);
    expect(dataDispatch.totalDocumentosDisponibilizados).toBe(2);
    expect(dataDispatch.valorTotalGuiasBrl).toBe(19170.30);
    expect(dataDispatch.protocoloEntregaHashSha256).toContain('PROT-PORTAL-');
    expect(dataDispatch.statusEntrega).toBe('GUIAS_DISPONIBILIZADAS_COM_PROTOCOLO_JURIDICO');
    expect(dataDispatch.diagnosticoEntrega).toContain('Farmácia & Drogaria Central Ltda');
  });

  it('2. Deve recepcionar e triar solicitacoes de admissao e extratos OFX com validacao eSocial', () => {
    const resReq = processClientPortalRequestsEngine({
      clienteCnpj: '12.345.678/0001-90',
      solicitacoes: [
        {
          solicitacaoId: 'REQ-ADM-001',
          tipoSolicitacao: 'ADMISSAO_FUNCIONARIO',
          detalhes: 'Admissao de Farmaceutico Responsavel (CBO 2234-05)',
          prazoLimiteDesejado: '2026-08-19'
        },
        {
          solicitacaoId: 'REQ-OFX-001',
          tipoSolicitacao: 'UPLOAD_EXTRATO_OFX',
          detalhes: 'Extrato Itau Conta Corrente Agosto/2026',
          prazoLimiteDesejado: '2026-08-18'
        }
      ]
    });

    const dataReq = unwrap(resReq);
    expect(dataReq.totalSolicitacoesRecebidas).toBe(2);
    expect(dataReq.solicitacoesValidadasEsocial).toBe(1); // 1 admissão
    expect(dataReq.tempoMedioAtendimentoHoras).toBe(4.0);
    expect(dataReq.statusProcessamento).toBe('SOLICITACOES_ENCAMINHADAS_AOS_DEPARTAMENTOS');
    expect(dataReq.diagnosticoSolicitacoes).toContain('Fila de atendimento aberta');
  });
});
