import { describe, it, expect } from 'vitest';
import {
  processOfficeMonthlyClosingChecklistEngine,
  processOfficeMonthlyDeliverablesDossierEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Fechamento Mensal dos 3 Pilares & Dossiê do Cliente', () => {
  it('1. Deve validar checklist dos 3 pilares e ativar trava de bloqueio retroativo com 100% de conformidade', () => {
    const resClose = processOfficeMonthlyClosingChecklistEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Indústria Líder S/A',
      mesCompetencia: '2026-08',
      conciliacaoBancaria100Feita: true,
      apuracaoFiscalConcluida: true,
      efdReinfTransmitido: true,
      folhaPagamentoFechada: true,
      esocialS1299Transmitido: true,
      dctfwebTransmitida: true,
      balanceteVerificacaoEquilibrado: true
    });

    const dataClose = unwrap(resClose);
    expect(dataClose.scoreConformidadeFechamentoPercent).toBe(100.0);
    expect(dataClose.bloqueioLancamentosRetroativosAtivo).toBe(true);
    expect(dataClose.statusFechamento).toBe('COMPETENCIA_MENSAL_FECHADA_E_TRAVADA');
    expect(dataClose.diagnosticoFechamento).toContain('Trava de lançamentos: ATIVADA');
  });

  it('2. Deve empacotar dossie mensal consolidado para entrega ao cliente via portal', () => {
    const resDossier = processOfficeMonthlyDeliverablesDossierEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Serviços Especializados Delta Ltda',
      mesCompetencia: '2026-08',
      itensEntregues: [
        { nomeDocumento: 'Balancete de Verificação', tipoPilar: 'CONTABIL', statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' },
        { nomeDocumento: 'DRE Gerencial', tipoPilar: 'CONTABIL', statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' },
        { nomeDocumento: 'Guia DAS com Pix', tipoPilar: 'FISCAL', statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' },
        { nomeDocumento: 'Folha Analítica', tipoPilar: 'FOLHA_DP', statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' },
        { nomeDocumento: 'Recibo eSocial S-1299', tipoPilar: 'FOLHA_DP', statusEntrega: 'DISPONIBILIZADO_PORTAL_CLIENTE' }
      ]
    });

    const dataDossier = unwrap(resDossier);
    expect(dataDossier.totalDocumentosDossie).toBe(5);
    expect(dataDossier.dossieEmpacotadoComSucesso).toBe(true);
    expect(dataDossier.statusDossie).toBe('DOSSIE_MENSAL_DISPONIBILIZADO_AO_CLIENTE');
    expect(dataDossier.diagnosticoDossie).toContain('protocolo de entrega digital');
  });
});
