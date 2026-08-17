import { describe, it, expect } from 'vitest';
import {
  evaluateConcessionContractIcpc01,
  calculateMiningCfem,
  unwrap
} from '../src/index.js';

describe('TESTES: Contratos de Concessão (ICPC 01 / IFRIC 12) & Royalties Minerais CFEM (Lei 13.540/2017)', () => {
  it('1. Deve segregar ativo intangivel e financeiro com margem de construcao em concessao (ICPC 01)', () => {
    const res = evaluateConcessionContractIcpc01({
      contratoId: 'CONC-RODOVIA-01',
      concessionariaNome: 'Autopistas do Brasil S.A.',
      objetoConcessao: 'Concessão de Trecho Rodoviário Federal',
      tipoModelo: 'MODELO_BIFURCADO_HIBRIDO',
      custoConstrucaoObrasBrl: 10000000.00,
      margemConstrucaoPercent: 10, // Receita = 11.000.000,00 (Lucro 1M)
      parcelaGarantidaPoderConcedenteBrl: 4000000.00 // Ativo Financeiro = 4M, Ativo Intangível = 7M
    });

    const data = unwrap(res);
    expect(data.receitaConstrucaoApurada).toBe(11000000.00);
    expect(data.custoConstrucaoReconhecido).toBe(10000000.00);
    expect(data.lucroBrutoConstrucao).toBe(1000000.00);
    expect(data.saldoAtivoFinanceiroContasReceber).toBe(4000000.00);
    expect(data.saldoAtivoIntangivelDireitoCobranca).toBe(7000000.00);
    expect(data.partidasDobradaConstrucao.length).toBe(3);
    expect(data.diagnosticoIcpc01).toContain('MODELO_BIFURCADO_HIBRIDO');
  });

  it('2. Deve apurar CFEM e partilha federativa na exploracao mineral de Minerio de Ferro (Lei 13.540/2017)', () => {
    const res = calculateMiningCfem({
      empresaMineradoraId: 'MINERACAO-VALE-01',
      tipoMineral: 'MINERIO_DE_FERRO', // 3.5%
      municipioProdutorNome: 'Parauapebas (PA)',
      receitaBrutaVendaMineralBrl: 100000000.00, // 100M
      tributosIncidentesNaComercializacaoBrl: 10000000.00 // Base = 90M
    });

    const data = unwrap(res);
    expect(data.receitaLiquidaBaseCalculoCfem).toBe(90000000.00);
    expect(data.aliquotaCfemPercent).toBe(3.5);
    expect(data.totalCfemDevidaBrl).toBe(3150000.00); // 3.5% de 90M
    // Partilha: 60% Mun Produtor (1.89M), 15% Afetados (472.5k), 15% Estado (472.5k), 10% União (315k)
    expect(data.partilhaFederativa.municipiosProdutores60Percent).toBe(1890000.00);
    expect(data.partilhaFederativa.municipiosAfetados15Percent).toBe(472500.00);
    expect(data.partilhaFederativa.estadoProdutor15Percent).toBe(472500.00);
    expect(data.partilhaFederativa.uniao10Percent).toBe(315000.00);
    expect(data.diagnosticoCfem).toContain('Parauapebas (PA)');
  });
});
