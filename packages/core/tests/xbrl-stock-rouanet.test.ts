import { describe, it, expect } from 'vitest';
import {
  generateXbrlFinancialStatements,
  calculateMonthlyStockOptionVesting,
  calculateCulturalAndSportsIncentives,
  unwrap
} from '../src/index.js';

describe('TESTES: Taxonomia XBRL CVM, Stock Options (CPC 10) & Lei Rouanet / Esporte', () => {
  it('1. Deve gerar instancia XBRL XML em conformidade com taxonomia CVM / IFRS', () => {
    const mockCompany = {
      id: 'comp-01',
      razaoSocial: 'Soberano Corp S.A.',
      cnpj: '33.000.167/0001-01',
      regimeTributario: 'LUCRO_REAL' as const,
      cnae: '6201-5/01',
      uf: 'SP',
      ativo: true
    };

    const res = generateXbrlFinancialStatements({
      company: mockCompany,
      anoExercicio: 2026,
      balanco: {
        totalAtivo: 5000000.00,
        ativoCirculante: 2000000.00,
        ativoNaoCirculante: 3000000.00,
        passivoCirculante: 1000000.00,
        passivoNaoCirculante: 1000000.00,
        patrimonioLiquido: 3000000.00,
        equilibrado: true
      },
      dre: {
        receitaBruta: 8000000.00,
        deducoesReceitaBruta: 1000000.00,
        receitaLiquida: 7000000.00,
        custos: 3000000.00,
        lucroBruto: 4000000.00,
        despesasOperacionais: 1500000.00,
        lucroOperacional: 2500000.00,
        resultadoFinanceiroLiquido: -100000.00,
        lucroAntesTributos: 2400000.00,
        impostosSobreLucro: 816000.00,
        lucroLiquido: 1584000.00
      }
    });

    const data = unwrap(res);
    expect(data.conformidadeTaxonomiaCvmIfrs).toBe(true);
    expect(data.xmlInstanceXbrl).toContain('<xbrli:xbrl');
    expect(data.xmlInstanceXbrl).toContain('<ifrs-full:Assets');
    expect(data.xmlInstanceXbrl).toContain('<ifrs-full:ProfitLoss');
  });

  it('2. Deve calcular apropriacao mensal de Stock Options (CPC 10 R1) no resultado e no PL', () => {
    const res = calculateMonthlyStockOptionVesting({
      planoId: 'PLAN-SOP-2026-KEY-EXECS',
      beneficiarioNome: 'Diretoria de Engenharia & IA',
      quantidadeOpcoesOutorgadas: 100000,
      valorJustoUnitarioOpcaoBlackScholes: 12.50, // Fair Value: R$ 1.250.000,00
      prazoVestingMeses: 36, // 3 anos
      taxaEsperadaTurnoverPercent: 4 // 4% turnover
    });

    const data = unwrap(res);
    expect(data.valorJustoTotalOutorgado).toBe(1200000.00); // 100k * 12.50 * 0.96
    expect(data.despesaVestingMensal).toBe(33333.33); // 1.2M / 36
    expect(data.partidasDobradaVesting.length).toBe(2);
    expect(data.partidasDobradaVesting[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaVesting[1]!.type).toBe('CREDIT');
  });

  it('3. Deve calcular deducao de incentivo da Lei Rouanet (4%) e Lei do Esporte (2%) no IRPJ', () => {
    const res = calculateCulturalAndSportsIncentives({
      anoCalendario: 2026,
      valorDoacaoPatrocinioLeiRouanetArt18: 50000.00, // Teto 4% = 40.000,00
      valorDoacaoPatrocinioLeiDoEsporte: 20000.00, // Teto 2% = 20.000,00
      irpjDevidoApuradoAliquota15: 1000000.00 // R$ 1 Milhão
    });

    const data = unwrap(res);
    expect(data.deducaoEfetivaRouanet4PercentMax).toBe(40000.00);
    expect(data.deducaoEfetivaEsporte2PercentMax).toBe(20000.00);
    expect(data.totalDeducaoIncentivosCulturais).toBe(60000.00);
    expect(data.irpjFinalAPagar).toBe(940000.00);
    expect(data.excessoNaoAproveitadoRouanet).toBe(10000.00); // 50k - 40k
  });
});
