import { describe, it, expect } from 'vitest';
import {
  processPortTupCustomsTaxEngine,
  processPortLeaseStorageIcmsIssEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Portos, Terminais TUP (Lei 12.815/13), IFRS 16 & Armazenagem ISSQN', () => {
  it('1. Deve mensurar Ativo de Direito de Uso Portuario e amortizacao mensal (IFRS 16 / CPC 06 R2)', () => {
    const resTup = processPortTupCustomsTaxEngine({
      operadorPortuarioCnpj: '10.000.000/0001-00',
      terminalNome: 'Terminal de Grãos e Fertilizantes TUP Ponta da Praia',
      tipoOutorga: 'TERMINAL_USO_PRIVADO_TUP',
      valorArrendamentoMensalBrl: 500000.00, // R$ 500k / mês
      prazoContratoMeses: 240, // 20 anos
      taxaDescontoAnualPercent: 9.0
    });

    const dataTup = unwrap(resTup);
    expect(dataTup.valorAtivoDireitoUsoPortuarioBrl).toBeGreaterThan(50000000.00); // VP > 50M
    expect(dataTup.passivoArrendamentoInicialBrl).toBe(dataTup.valorAtivoDireitoUsoPortuarioBrl);
    expect(dataTup.despesaMensalAmortizacaoBrl).toBeGreaterThan(200000.00);
    expect(dataTup.statusOutorgaAntaq).toBe('OUTORGA_PORTUARIA_HOMOLOGADA_ANTAQ_LEI_12815');
    expect(dataTup.diagnosticoPortuario).toContain('Homologado ANTAQ');
  });

  it('2. Deve tributar servicos portuarios e armazenagem alfandegada com ISSQN (LC 116/03) e blindar ICMS', () => {
    const resStorage = processPortLeaseStorageIcmsIssEngine({
      recintoAlfandegadoCnpj: '20.000.000/0001-00',
      receitaCapataziaMovimentacaoBrl: 1000000.00, // R$ 1M
      receitaArmazenagemPuraBrl: 600000.00, // R$ 600k -> Total = R$ 1.6M
      aliquotaIssMunicipalPercent: 5.0 // 5% = R$ 80.000,00 ISSQN
    });

    const dataStorage = unwrap(resStorage);
    expect(dataStorage.receitaTotalServicosPortuariosBrl).toBe(1600000.00);
    expect(dataStorage.impostoIssqnDevidoBrl).toBe(80000.00);
    expect(dataStorage.impostoIcmsDevidoBrl).toBe(0.00); // Não incidência
    expect(dataStorage.statusTributario).toBe('SERVICOS_PORTUARIOS_TRIBUTADOS_EXCLUSIVAMENTE_ISSQN');
    expect(dataStorage.diagnosticoTributario).toContain('Nao Incidencia Sumula 166 STJ');
  });
});
