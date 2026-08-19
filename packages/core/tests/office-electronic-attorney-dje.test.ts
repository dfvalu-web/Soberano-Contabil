import { describe, it, expect } from 'vitest';
import {
  processOfficeElectronicPowerAttorneyEcacEngine,
  processOfficeJudicialDomicileCnjAlertsEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Procurações Eletrônicas e-CAC & Domicílio Judicial (DJE / CNJ)', () => {
  it('1. Deve monitorar validade de procuracao e-CAC e alertar vencimento em menos de 30 dias', () => {
    const resAtt = processOfficeElectronicPowerAttorneyEcacEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio e Logística Metropolitana S/A',
      tipoProcuracao: 'RFB_ECAC_TODOS_SERVICOS',
      outorgadoCnpjEscritorio: '99.999.999/0001-99',
      dataEmissao: '2023-09-01',
      dataValidade: '2026-09-15',
      dataConsultaAtual: '2026-08-17'
    });

    const dataAtt = unwrap(resAtt);
    expect(dataAtt.estaVigente).toBe(true);
    expect(dataAtt.diasParaExpirar).toBe(29); // 29 dias restantes (< 30)
    expect(dataAtt.statusProcuracao).toBe('ALERTA_EXPIRANDO_EM_BREVE');
    expect(dataAtt.linkRenovacaoAutomatica).toContain('https://app.soberanocontabil.com.br/procuracao/renovar/');
    expect(dataAtt.diagnosticoProcuracao).toContain('ALERTA_EXPIRANDO_EM_BREVE');
  });

  it('2. Deve monitorar comunicacoes do Domicilio Judicial Eletronico (CNJ) e alertar risco de revelia', () => {
    const resDje = processOfficeJudicialDomicileCnjAlertsEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Metalúrgica Central Ltda',
      intimacoesRecebidas: [
        {
          idProcessoJudicial: '1002345-67.2026.5.02.0001',
          tribunalOrigem: 'TRT-2',
          tipoComunicacao: 'CITACAO_INICIAL',
          dataDisponibilizacaoDje: '2026-08-10',
          prazoLeituraDiasUteis: 3,
          diasCorridosDesdeEnvio: 4 // Excedeu os 3 dias úteis!
        }
      ]
    });

    const dataDje = unwrap(resDje);
    expect(dataDje.totalIntimacoesLidas).toBe(1);
    expect(dataDje.intimacoesEmRiscoReveliaCount).toBe(1);
    expect(dataDje.statusDje).toBe('ALERTA_INTIMACOES_PENDENTES_LEITURA_URGENTE');
    expect(dataDje.diagnosticoDje).toContain('risco de perda de prazo de leitura');
  });
});
