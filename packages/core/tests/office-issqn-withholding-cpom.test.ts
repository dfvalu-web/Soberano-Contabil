import { describe, it, expect } from 'vitest';
import {
  processOfficeIssqnWithholdingAuditEngine,
  processOfficeCpomServiceTaxAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: ISSQN Tomador, CPOM Municipal & Prevenção de Bitributação (LC 116/03)', () => {
  it('1. Deve auditar retencao de ISS no tomador para servico de construcao civil (LC 116 Item 07.02)', () => {
    const resIss = processOfficeIssqnWithholdingAuditEngine({
      clienteTomadorCnpj: '11.111.111/0001-11',
      tomadorMunicipioIbge: '3550308', // São Paulo
      prestadorCnpj: '22.222.222/0001-22',
      prestadorRazaoSocial: 'Construtora e Obras Campinas Ltda',
      prestadorMunicipioIbge: '3509502', // Campinas
      codigoServicoLc116: '07.02', // Construção civil (exceção LC 116 - devido no tomador)
      valorBrutoServicoBrl: 100000.00,
      prestadorOptanteSimplesNacional: false,
      prestadorInscritoCpomTomador: true
    });

    const dataIss = unwrap(resIss);
    expect(dataIss.exigeRetencaoIssTomador).toBe(true);
    expect(dataIss.localDevidoIss).toBe('MUNICIPIO_DO_TOMADOR_RETENCAO_OBRIGATORIA');
    expect(dataIss.aliquotaIssAplicadaPercent).toBe(5.0);
    expect(dataIss.valorIssRetidoBrl).toBe(5000.00);
    expect(dataIss.valorLiquidoAPagarAoPrestadorBrl).toBe(95000.00);
    expect(dataIss.statusIssqn).toBe('ISS_TOMADOR_AUDITADO_COM_SUCESSO');
    expect(dataIss.diagnosticoIssqn).toContain('R$ 5.000,00');
  });

  it('2. Deve gerar lancamentos contabeis de provisao com retencao municipal e recolhimento de guia', () => {
    const resAcc = processOfficeCpomServiceTaxAccountingEngine({
      clienteTomadorCnpj: '11.111.111/0001-11',
      prestadorRazaoSocial: 'Construtora e Obras Campinas Ltda',
      valorBrutoBrl: 100000.00,
      valorIssRetidoBrl: 5000.00,
      valorLiquidoBrl: 95000.00,
      contaDespesaServico: '3.1.02.005 Serviços de Terceiros PJ'
    });

    const dataAcc = unwrap(resAcc);
    expect(dataAcc.partidaDobradaDespesaEPassivo).toContain('3.1.02.005 Serviços de Terceiros PJ');
    expect(dataAcc.partidaDobradaDespesaEPassivo).toContain('2.1.02.003 ISS a Recolher - Retenções na Fonte');
    expect(dataAcc.partidaDobradaDespesaEPassivo).toContain('2.1.01.001 Fornecedores / Contas a Pagar');
    expect(dataAcc.partidaDobradaRecolhimentoGuiaIss).toContain('1.1.01.002 Banco Conta Movimento');
    expect(dataAcc.statusContabilizacao).toBe('LANCAMENTOS_ISS_TOMADOR_CONCLUIDOS');
    expect(dataAcc.diagnosticoContabil).toContain('retenção de R$ 5.000,00');
  });
});
