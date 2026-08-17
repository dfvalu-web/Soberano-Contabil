import { describe, it, expect } from 'vitest';
import { calculateSimplesNacional, calculateFatorR } from '../src/tax/simples-nacional/calculator.js';
import { unwrap } from '../src/types/result.js';

describe('Motor Tributário: Simples Nacional (LC 123/2006)', () => {
  it('deve calcular corretamente a alíquota efetiva e valor devido do Anexo I (Comércio) na 1ª faixa', () => {
    const res = calculateSimplesNacional({
      rbt12: 120000.00,
      receitaMes: 10000.00,
      anexo: 'ANEXO_I'
    });

    const data = unwrap(res);
    expect(data.faixa).toBe(1);
    expect(data.aliquotaNominal).toBe(0.04);
    expect(data.aliquotaEfetiva).toBe(0.04);
    expect(data.valorDevidoTotal).toBe(400.00);
    expect(data.segregacao.icms).toBeCloseTo(136.00, 1);
    expect(data.segregacao.cpp).toBeCloseTo(166.00, 1);
  });

  it('deve calcular alíquota efetiva com dedução na 3ª faixa do Anexo I', () => {
    // RBT12 = 500.000,00 -> Faixa 3: Alíquota 9.5%, Parcela a deduzir: 13.860,00
    // Alíquota efetiva = (500000 * 0.095 - 13860) / 500000 = 33640 / 500000 = 0.06728 (6.728%)
    const res = calculateSimplesNacional({
      rbt12: 500000.00,
      receitaMes: 50000.00,
      anexo: 'ANEXO_I'
    });

    const data = unwrap(res);
    expect(data.faixa).toBe(3);
    expect(data.aliquotaEfetiva).toBeCloseTo(0.06728, 4);
    expect(data.valorDevidoTotal).toBeCloseTo(3364.00, 1);
  });

  it('deve aplicar chaveamento automático do Fator R: Anexo III se Fator R >= 28%', () => {
    const fatorR = calculateFatorR(30000.00, 100000.00); // 30% >= 28%
    expect(fatorR).toBe(0.3);

    const res = calculateSimplesNacional({
      rbt12: 100000.00,
      receitaMes: 10000.00,
      anexo: 'ANEXO_V',
      folha12Meses: 30000.00
    });

    const data = unwrap(res);
    expect(data.anexoAplicado).toBe('ANEXO_III'); // migrou para o Anexo III
  });

  it('deve aplicar chaveamento para o Anexo V se Fator R < 28%', () => {
    const res = calculateSimplesNacional({
      rbt12: 100000.00,
      receitaMes: 10000.00,
      anexo: 'ANEXO_III',
      folha12Meses: 10000.00 // 10% < 28%
    });

    const data = unwrap(res);
    expect(data.anexoAplicado).toBe('ANEXO_V');
  });

  it('deve segregar ICMS e ISS fora do DAS se ultrapassar o sublimite estadual de R$ 3.600.000,00', () => {
    const res = calculateSimplesNacional({
      rbt12: 3800000.00,
      receitaMes: 100000.00,
      anexo: 'ANEXO_I'
    });

    const data = unwrap(res);
    expect(data.segregacao.icms).toBe(0);
    expect(data.icmsSegregadoForaDas).toBeGreaterThan(0);
  });
});
