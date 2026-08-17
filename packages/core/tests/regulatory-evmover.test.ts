import { describe, it, expect } from 'vitest';
import {
  evaluateRegulatoryDeferralAccountsIfrs14,
  processEvHybridMoverTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativos Regulatórios (IFRS 14 / ANEEL) & Programa MOVER / IPI Verde (Lei 14.902/24)', () => {
  it('1. Deve reconhecer ativo regulatorio por variacao de custos nao gerenciaveis da Parcela A / CVA (IFRS 14 / ANEEL)', () => {
    // 1.1 Ativo Regulatório (Custos superam tarifa homologada -> direito de repasse futuro)
    const resAtivo = evaluateRegulatoryDeferralAccountsIfrs14({
      concessaoId: 'CONC-ELETRO-01',
      concessionariaNome: 'Distribuidora de Energia do Sudeste S.A.',
      tipoContaRegulatoria: 'ATIVO_REGULATORIO_REPASSE_TARIFARIO',
      descricaoComponente: 'CVA - Variação de Compra de Energia e Encargos Setoriais CDE',
      custosNaoGerenciaveisEfetivosBrl: 150000000.00,
      custosCobertosTarifaBrl: 130000000.00 // Variação Positiva = 20M
    });

    const dataAtivo = unwrap(resAtivo);
    expect(dataAtivo.tipoContaRegulatoria).toBe('ATIVO_REGULATORIO_REPASSE_TARIFARIO');
    expect(dataAtivo.variacaoRegulatoriaLiquidaBrl).toBe(20000000.00);
    expect(dataAtivo.saldoAtivoRegulatorioPassivoBrl).toBe(20000000.00);
    expect(dataAtivo.partidasDobradaReconhecimento.length).toBe(2);
    expect(dataAtivo.diagnosticoRegulatorio).toContain('Reconhecido ATIVO REGULATÓRIO');

    // 1.2 Passivo Regulatório (Tarifa homologada superou custos -> obrigação de devolução tarifária)
    const resPassivo = evaluateRegulatoryDeferralAccountsIfrs14({
      concessaoId: 'CONC-ELETRO-02',
      concessionariaNome: 'Transmissora de Energia Norte S.A.',
      tipoContaRegulatoria: 'PASSIVO_REGULATORIO_DEVOLUCAO_CONSUMIDOR',
      descricaoComponente: 'Devolução de Encargo Tarifário',
      custosNaoGerenciaveisEfetivosBrl: 40000000.00,
      custosCobertosTarifaBrl: 45000000.00 // Devolução = 5M
    });

    const dataPassivo = unwrap(resPassivo);
    expect(dataPassivo.tipoContaRegulatoria).toBe('PASSIVO_REGULATORIO_DEVOLUCAO_CONSUMIDOR');
    expect(dataPassivo.saldoAtivoRegulatorioPassivoBrl).toBe(5000000.00);
  });

  it('2. Deve apurar IPI Verde incentivado para eletrico/hibrido e credito financeiro MOVER de P&D (Lei 14.902/24)', () => {
    // 2.1 Veículo Elétrico Puro BEV (IPI Verde 2,0% + Crédito Financeiro MOVER 50% de P&D)
    const resBev = processEvHybridMoverTaxEngine({
      veiculoId: 'EV-01',
      modeloNome: 'SUV 100% Elétrico Urbano',
      tipoPropulsao: 'ELETRICO_PURO_BEV',
      eficienciaEnergeticaMjKm: 1.10, // Alta Eficiência (< 1.20 MJ/km)
      valorNotaFiscalFabricaBrl: 200000.00,
      dispendioInvestimentoPesquisaMoverBrl: 1000000.00 // 1M em P&D
    });

    const dataBev = unwrap(resBev);
    expect(dataBev.aliquotaIpiVerdeEfetivaPercent).toBe(2.0);
    expect(dataBev.valorIpiVerdeDevidoBrl).toBe(4000.00);
    expect(dataBev.creditoFinanceiroMoverApropriadoBrl).toBe(500000.00); // 50% de 1M
    expect(dataBev.diagnosticoFiscal).toContain('Programa MOVER & IPI Verde');

    // 2.2 Veículo Híbrido Flex HEV com Eficiência 1.15 MJ/km (Alíquota base 5,5% - 1,0% bônus = 4,5%)
    const resHev = processEvHybridMoverTaxEngine({
      veiculoId: 'HEV-02',
      modeloNome: 'Sedan Híbrido Flex Biocombustível',
      tipoPropulsao: 'HIBRIDO_FLEX_HEV',
      eficienciaEnergeticaMjKm: 1.15,
      valorNotaFiscalFabricaBrl: 150000.00
    });

    const dataHev = unwrap(resHev);
    expect(dataHev.aliquotaIpiVerdeEfetivaPercent).toBe(4.5);
    expect(dataHev.valorIpiVerdeDevidoBrl).toBe(6750.00);
    expect(dataHev.creditoFinanceiroMoverApropriadoBrl).toBe(0);
  });
});
