import { describe, it, expect } from 'vitest';
import {
  calculateBorrowingCostsCapitalizationCpc20,
  calculateCryptoTaxationIn1888,
  unwrap
} from '../src/index.js';

describe('TESTES: Custos de Empréstimos (CPC 20) & Tributação de Criptoativos (IN 1888)', () => {
  it('1. Deve capitalizar juros de emprestimos especificos e gerais no custo do ativo qualificavel (CPC 20)', () => {
    const res = calculateBorrowingCostsCapitalizationCpc20({
      ativoQualificavelId: 'OBRA-USINA-SOLAR-01',
      descricaoAtivo: 'Complexo Solar Fotovoltaico 50MW',
      jurosIncorridosEmprestimoEspecificoBrl: 1500000.00, // 1.5M Juros incorridos
      receitaFinanceiraAplicacaoTemporariaBrl: 200000.00, // 200k Receita aplicação (Líquido = 1.3M)
      gastosGeraisNoAtivoBrl: 5000000.00, // 5M Gastos gerais
      taxaMediaPonderadaFinanciamentosGeraisPercentAno: 10.0 // 10% = 500k
    });

    const data = unwrap(res);
    expect(data.jurosLiquidosCapitalizadosEmprestimoEspecifico).toBe(1300000.00);
    expect(data.jurosCapitalizadosFinanciamentosGerais).toBe(500000.00);
    expect(data.totalCustosEmprestimosCapitalizadosNoAtivo).toBe(1800000.00);
    expect(data.partidasDobradaCapitalizacao.length).toBe(2);
    expect(data.diagnosticoCpc20).toContain('Complexo Solar Fotovoltaico');
  });

  it('2. Deve aplicar isencao de 35k e apurar Ganho de Capital em operacoes com criptoativos (IN 1888)', () => {
    // 2.1 Operação isenta (Venda <= 35k)
    const resIsento = calculateCryptoTaxationIn1888({
      operacaoId: 'CRIPTO-OP-01',
      mesAnoCompetencia: '2026-03',
      simboloCripto: 'BTC',
      valorAlienacaoTotalMesBrl: 30000.00,
      custoAquisicaoTotalBrl: 10000.00
    });

    const dataIsento = unwrap(resIsento);
    expect(dataIsento.isentoAlienacaoAte35k).toBe(true);
    expect(dataIsento.impostoDeRendaDevidoBrl).toBe(0);
    expect(dataIsento.diagnosticoIn1888).toContain('ISENTO de IRPF');

    // 2.2 Operação tributada (Venda > 35k)
    const resTrib = calculateCryptoTaxationIn1888({
      operacaoId: 'CRIPTO-OP-02',
      mesAnoCompetencia: '2026-03',
      simboloCripto: 'ETH',
      valorAlienacaoTotalMesBrl: 100000.00, // 100k
      custoAquisicaoTotalBrl: 40000.00   // Ganho = 60k => 15% = 9k
    });

    const dataTrib = unwrap(resTrib);
    expect(dataTrib.isentoAlienacaoAte35k).toBe(false);
    expect(dataTrib.ganhoDeCapitalApuradoBrl).toBe(60000.00);
    expect(dataTrib.aliquotaGanhoCapitalPercent).toBe(15.0);
    expect(dataTrib.impostoDeRendaDevidoBrl).toBe(9000.00);
    expect(dataTrib.layoutIn1888Txt).toContain('IN1888|2026-03|CRIPTO-OP-02|ETH');
  });
});
