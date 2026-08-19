import { describe, it, expect } from 'vitest';
import {
  processOfficeCarneLeaoMonthlyTaxEngine,
  processOfficeCashBookDeductionsIrpfEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Carnê-Leão Web & Livro Caixa IRPF (IN RFB 1.500/14)', () => {
  it('1. Deve apurar imposto mensal de Carne-Leao com deducoes de Livro Caixa e dependentes', () => {
    const resCarne = processOfficeCarneLeaoMonthlyTaxEngine({
      contribuinteCpf: '123.456.789-00',
      nomeContribuinte: 'Dra. Mariana Albuquerque (Médica)',
      mesAnoCompetencia: '2026-08',
      totalRendimentosRecebidosBrl: 30000.00,
      totalDespesasLivroCaixaDedutiveisBrl: 10000.00,
      dependentesCount: 2, // 2 * 189.59 = 379.18
      pensaoAlimenticiaPagaBrl: 0
    });

    const dataCarne = unwrap(resCarne);
    expect(dataCarne.totalRendimentosBrl).toBe(30000.00);
    expect(dataCarne.totalDespesasDedutiveisBrl).toBe(10000.00);
    expect(dataCarne.deducaoDependentesBrl).toBe(379.18);
    // Base = 30000 - 10379.18 = 19620.82
    // Imposto = (19620.82 * 0.275) - 896.00 = 5395.7255 - 896 = 4499.73
    expect(dataCarne.baseCalculoImpostoBrl).toBe(19620.82);
    expect(dataCarne.valorDarf0190DevidoBrl).toBe(4499.73);
    expect(dataCarne.statusApuracao).toBe('CARNE_LEAO_APURADO_DARF_EMITIDO');
    expect(dataCarne.diagnosticoCarneLeao).toContain('DARF 0190');
  });

  it('2. Deve validar escrituracao de despesas de custeio dedutiveis no Livro Caixa Digital', () => {
    const resCash = processOfficeCashBookDeductionsIrpfEngine({
      contribuinteCpf: '123.456.789-00',
      nomeContribuinte: 'Dra. Mariana Albuquerque (Médica)',
      mesAnoCompetencia: '2026-08',
      itensDespesas: [
        { descricao: 'Aluguel e Condomínio do Consultório', categoria: 'ALUGUEL_CONDOMINIO_IPTU', valorBrl: 5000.00 },
        { descricao: 'Salário Recepcionista + INSS', categoria: 'FOLHA_SECRETARIA_INSS', valorBrl: 3500.00 },
        { descricao: 'Materiais Cirúrgicos Descartáveis', categoria: 'MATERIAIS_CONSUMO', valorBrl: 1500.00 }
      ]
    });

    const dataCash = unwrap(resCash);
    expect(dataCash.totalDespesasDedutiveisAprovadasBrl).toBe(10000.00);
    expect(dataCash.totalItensEscrituradosCount).toBe(3);
    expect(dataCash.statusLivroCaixa).toBe('LIVRO_CAIXA_ESCRITURADO_E_VALIDADO');
    expect(dataCash.diagnosticoLivroCaixa).toContain('100% dedutíveis');
  });
});
