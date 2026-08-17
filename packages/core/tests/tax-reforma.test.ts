import { describe, it, expect } from 'vitest';
import { calculateDualEngineReforma } from '../src/tax/reforma-tributaria/dual-engine.js';
import { calculateIcmsSt } from '../src/tax/special-sectors/icms-st.js';
import { unwrap } from '../src/types/result.js';

describe('Reforma Tributária: Dual-Engine (EC 132/2023)', () => {
  it('deve simular o ano-teste 2026 com CBS 0.9% e IBS 0.1%', () => {
    const res = calculateDualEngineReforma({
      anoSimulacao: 2026,
      valorOperacao: 100000.00,
      ufOrigem: 'SP',
      ufDestino: 'RJ',
      municipioDestinoIbge: '3304557',
      tipoItem: 'MERCADORIA',
      isRegimeDiferenciadoSaudeEducacao: false,
      isCestaBasicaNacional: false,
      isImpostoSeletivoIncidente: false,
      regimeLegado: 'LUCRO_PRESUMIDO'
    });

    const data = unwrap(res);
    expect(data.novoModelo.aliquotaCbsEfetiva).toBe(0.009);
    expect(data.novoModelo.valorCbs).toBe(900.00);
    expect(data.novoModelo.aliquotaIbsEfetiva).toBe(0.001);
    expect(data.novoModelo.valorIbs).toBe(100.00);
    expect(data.novoModelo.totalTributosNovos).toBe(1000.00);
    expect(data.novoModelo.splitPaymentEstimado.retencaoTributariaAutomatica).toBe(1000.00);
  });

  it('deve aplicar alíquota zero para itens da Cesta Básica Nacional', () => {
    const res = calculateDualEngineReforma({
      anoSimulacao: 2033,
      valorOperacao: 50000.00,
      ufOrigem: 'PR',
      ufDestino: 'PR',
      municipioDestinoIbge: '4106902',
      tipoItem: 'MERCADORIA',
      isRegimeDiferenciadoSaudeEducacao: false,
      isCestaBasicaNacional: true,
      isImpostoSeletivoIncidente: false,
      regimeLegado: 'LUCRO_REAL_TRIMESTRAL'
    });

    const data = unwrap(res);
    expect(data.novoModelo.aliquotaCbsEfetiva).toBe(0);
    expect(data.novoModelo.aliquotaIbsEfetiva).toBe(0);
    expect(data.novoModelo.totalTributosNovos).toBe(0);
  });
});

describe('Setores Especiais: ICMS-ST com MVA Ajustada', () => {
  it('deve calcular MVA ajustada e débito de ICMS-ST para operação interestadual', () => {
    // Operação: R$ 1.000,00 | Alíquota Inter: 12% | Alíquota Destino: 18% | MVA Original: 40%
    // MVA Ajustada = [(1 + 0.40) * (1 - 0.12) / (1 - 0.18)] - 1 = [1.40 * 0.88 / 0.82] - 1 = 1.5024 - 1 = 0.5024 (50.24%)
    // Base ST = 1.000 * 1.5024 = 1.502,40
    // ICMS ST Bruto = 1.502,40 * 18% = 270,43
    // ICMS Próprio = 1.000 * 12% = 120,00
    // ICMS ST a Recolher = 270,43 - 120,00 = 150,43
    const res = calculateIcmsSt({
      valorOperacao: 1000.00,
      mvaOriginalPercent: 0.40,
      aliquotaInterestadualPercent: 0.12,
      aliquotaInternaDestinoPercent: 0.18,
      isInterestadual: true
    });

    const data = unwrap(res);
    expect(data.icmsProprio).toBe(120.00);
    expect(data.mvaAjustadaPercent).toBeCloseTo(0.5024, 2);
    expect(data.baseCalculoSt).toBeCloseTo(1502.40, 1);
    expect(data.icmsStTotalDevido).toBeCloseTo(150.43, 1);
  });
});
