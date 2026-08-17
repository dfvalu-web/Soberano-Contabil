import { describe, it, expect } from 'vitest';
import {
  processTreasurySharesOperation,
  processDemonstrationShowcaseTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ações em Tesouraria (CPC 08) & Demonstração/Mostruário (SINIEF 08/2008)', () => {
  it('1. Deve processar recompra como redutora do PL, checar limite legal e registrar agio em reserva de capital (CPC 08 R1 / Lei 6.404)', () => {
    // 1.1 Recompra Legal
    const resRecompra = processTreasurySharesOperation({
      transacaoId: 'BUYBACK-01',
      tipoOperacao: 'RECOMPRA_AQUISICAO',
      quantidadeAcoes: 1000000,
      valorTotalAquisicaoBrl: 20000000.00,
      saldoReservasLucrosDisponiveisBrl: 50000000.00 // Limite suficiente
    });

    const dataRec = unwrap(resRecompra);
    expect(dataRec.saldoAcoesEmTesourariaRedutoraPlBrl).toBe(20000000.00);
    expect(dataRec.partidasDobradaTesouraria.length).toBe(2);
    expect(dataRec.diagnosticoCpc08).toContain('Conta redutora do PL registrada com sucesso');

    // 1.2 Alienação com Ágio (Reserva de Capital)
    const resAlienacao = processTreasurySharesOperation({
      transacaoId: 'BUYBACK-01',
      tipoOperacao: 'ALIENACAO_COM_AGIO',
      quantidadeAcoes: 1000000,
      valorTotalAquisicaoBrl: 20000000.00,
      valorTotalVendaBrl: 25000000.00, // Ágio = 5M
      saldoReservasLucrosDisponiveisBrl: 50000000.00
    });

    const dataAli = unwrap(resAlienacao);
    expect(dataAli.reservaCapitalAgioAlienacaoPlBrl).toBe(5000000.00);
    expect(dataAli.partidasDobradaTesouraria.length).toBe(3);
    expect(dataAli.diagnosticoCpc08).toContain('creditado diretamente na Reserva de Capital');
  });

  it('2. Deve controlar prazos de suspensao de 60 e 90 dias em Demonstracao e Mostruario (Ajuste SINIEF 08/2008)', () => {
    // 2.1 Demonstração regular (25 dias de 60)
    const resDemo = processDemonstrationShowcaseTaxEngine({
      remessaId: 'DEMO-01',
      tipoRemessa: 'REMESSA_DEMONSTRACAO',
      clienteDestinatarioNome: 'Hospital Santa Cruz S.A.',
      valorMercadoriasBrl: 500000.00,
      diasDecorridosDesdeRemessa: 25,
      retornoEfetivado: false,
      aliquotaIcmsPercent: 18
    });

    const dataDemo = unwrap(resDemo);
    expect(dataDemo.cfopUtilizado).toBe('5.912');
    expect(dataDemo.prazoLimiteLegalDias).toBe(60);
    expect(dataDemo.prazoExpirado).toBe(false);
    expect(dataDemo.icmsSuspensoIsentoBrl).toBe(90000.00);
    expect(dataDemo.icmsExigivelRetroativoBrl).toBe(0);

    // 2.2 Demonstração com prazo estourado (75 dias > 60 dias)
    const resExp = processDemonstrationShowcaseTaxEngine({
      remessaId: 'DEMO-02',
      tipoRemessa: 'REMESSA_DEMONSTRACAO',
      clienteDestinatarioNome: 'Clínica São Paulo Ltda',
      valorMercadoriasBrl: 200000.00,
      diasDecorridosDesdeRemessa: 75,
      retornoEfetivado: false,
      aliquotaIcmsPercent: 18
    });

    const dataExp = unwrap(resExp);
    expect(dataExp.prazoExpirado).toBe(true);
    expect(dataExp.icmsExigivelRetroativoBrl).toBe(36000.00); // 18% de 200k exigível
    expect(dataExp.diagnosticoFiscal).toContain('ALERTA: Prazo de 60 dias expirado');
  });
});
