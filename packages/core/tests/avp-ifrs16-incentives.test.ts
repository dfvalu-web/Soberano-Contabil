import { describe, it, expect } from 'vitest';
import {
  calculateAvp,
  calculateIfrs16Lease,
  calculateLeiDoBem,
  calculateSudeneIncentive,
  unwrap
} from '../src/index.js';

describe('TESTES: AVP (CPC 12), IFRS 16 (CPC 06 R2), Lei do Bem & SUDENE', () => {
  it('1. Deve calcular Ajuste a Valor Presente (AVP - CPC 12) em vendas a prazo longo', () => {
    const res = calculateAvp({
      transacaoId: 'TX-AVP-01',
      tipoTransacao: 'CLIENTES_A_RECEBER',
      valorNominalFuturo: 120000.00,
      prazoMeses: 12,
      taxaDescontoMensalPercent: 1.0 // 1% ao mês
    });

    const data = unwrap(res);
    expect(data.valorNominalFuturo).toBe(120000.00);
    expect(data.valorPresenteCalculado).toBeLessThan(120000.00);
    expect(data.valorAjusteAvp).toBeGreaterThan(0);
    expect(data.partidasDobradaSugeridas.length).toBe(3);
    expect(data.partidasDobradaSugeridas[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaSugeridas[1]!.type).toBe('CREDIT');
  });

  it('2. Deve calcular Ativo de Direito de Uso e Passivo de Arrendamento IFRS 16', () => {
    const res = calculateIfrs16Lease({
      contratoId: 'LEASE-HQ-01',
      descricaoBemArrendado: 'Sede Corporativa Av. Paulista',
      valorParcelaMensal: 25000.00,
      prazoContratoMeses: 60,
      taxaJurosMensalPercent: 0.85 // 0.85% a.m.
    });

    const data = unwrap(res);
    expect(data.valorAtivoDireitoDeUsoInicial).toBeGreaterThan(1000000.00);
    expect(data.despesaAmortizacaoMensal).toBeGreaterThan(0);
    expect(data.jurosPrimeiroMes).toBeGreaterThan(0);
    expect(data.partidasDobradaInicial.length).toBe(2);
  });

  it('3. Deve calcular deducao adicional de P&D da Lei do Bem (Lei 11.196/05) no LALUR', () => {
    const res = calculateLeiDoBem({
      anoBase: 2026,
      totalGastosOperacionaisPesquisaDesenvolvimento: 1000000.00,
      houveIncrementoPesquisadoresSuperior5Percent: true, // +10%
      patentesConcedidasNoAno: true // +10% => Total 80%
    });

    const data = unwrap(res);
    expect(data.percentualExclusaoLalur).toBe(80);
    expect(data.valorExclusaoLalurParteA).toBe(800000.00);
    expect(data.economiaTributariaIrpjCsll34Percent).toBe(272000.00);
  });

  it('4. Deve calcular beneficio fiscal regional de reducao de 75% do IRPJ (SUDENE/SUDAM)', () => {
    const res = calculateSudeneIncentive({
      lucroDaExploracaoApurado: 2000000.00
    });

    const data = unwrap(res);
    expect(data.irpjPadrao15SemIncentivo).toBe(300000.00);
    expect(data.economiaTributariaDireta).toBe(225000.00); // 75% de 300k = 225k
    expect(data.irpjComReducao75Percent).toBe(75000.00); // 25% de 300k = 75k
    expect(data.obrigacaoDestinacaoReservaIncentivosFiscaisPL).toBe(225000.00);
  });
});
