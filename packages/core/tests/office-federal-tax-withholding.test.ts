import { describe, it, expect } from 'vitest';
import {
  processOfficeFederalTaxWithholdingEngine,
  processOfficeWithholdingCompensationAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Retenções Federais na Fonte (IRRF 1,5% e CSRF 4,65% Lei 10.833/03)', () => {
  it('1. Deve apurar retencoes de IRRF (1,5%) e CSRF (4,65%) sobre servicos profissionais de R$ 10.000,00', () => {
    const resWith = processOfficeFederalTaxWithholdingEngine({
      prestadorCnpj: '11.111.111/0001-11',
      tomadorCnpj: '22.222.222/0001-22',
      numeroNfse: '123456',
      valorServicoBrutoBrl: 10000.00,
      tipoServico: 'SERVICOS_PROFISSIONAIS_1_5',
      optanteSimplesNacionalPrestador: false
    });

    const dataWith = unwrap(resWith);
    expect(dataWith.aliquotaIrrfPercent).toBe(1.5);
    expect(dataWith.valorIrrfRetidoBrl).toBe(150.00);
    expect(dataWith.aliquotaCsrfPercent).toBe(4.65);
    expect(dataWith.valorCsrfRetidoBrl).toBe(465.00);
    expect(dataWith.totalRetencoesFederaisBrl).toBe(615.00);
    expect(dataWith.valorLiquidoNfseBrl).toBe(9385.00); // 10000 - 615
    expect(dataWith.dispensaRetencaoMinima10Reais).toBe(false);
    expect(dataWith.statusRetencao).toBe('RETENCOES_FEDERAIS_APURADAS_COM_SUCESSO');
    expect(dataWith.diagnosticoRetencao).toContain('Total Retido: R$ 615.00');
  });

  it('2. Deve gerar partidas dobradas de compensacao no prestador (ativo) e provisao EFD-Reinf R-4020 no tomador (passivo)', () => {
    // Prestador: Ativo
    const resPres = processOfficeWithholdingCompensationAccountingEngine({
      empresaCnpj: '11.111.111/0001-11',
      perfilOperacao: 'PRESTADOR_SERVICO_ATIVO',
      valorServicoBrutoBrl: 10000.00,
      valorIrrfRetidoBrl: 150.00,
      valorCsrfRetidoBrl: 465.00
    });
    const dataPres = unwrap(resPres);
    expect(dataPres.partidaDobradaLancamento).toContain('1.1.03.001 IRRF a Compensar');
    expect(dataPres.partidaDobradaLancamento).toContain('1.1.03.004 CSRF a Compensar');
    expect(dataPres.statusContabilizacao).toBe('LANCAMENTOS_RETENCOES_CONCLUIDOS');

    // Tomador: Passivo & EFD-Reinf
    const resTom = processOfficeWithholdingCompensationAccountingEngine({
      empresaCnpj: '22.222.222/0001-22',
      perfilOperacao: 'TOMADOR_SERVICO_PASSIVO',
      valorServicoBrutoBrl: 10000.00,
      valorIrrfRetidoBrl: 150.00,
      valorCsrfRetidoBrl: 465.00
    });
    const dataTom = unwrap(resTom);
    expect(dataTom.eventoEfdReinf).toBe('R-4020_PAGAMENTO_PJ_RETENCAO');
    expect(dataTom.partidaDobradaLancamento).toContain('2.1.02.003 IRRF a Recolher');
    expect(dataTom.partidaDobradaLancamento).toContain('2.1.02.004 CSRF a Recolher');
    expect(dataTom.diagnosticoContabil).toContain('EFD-Reinf Evento R-4020');
  });
});
