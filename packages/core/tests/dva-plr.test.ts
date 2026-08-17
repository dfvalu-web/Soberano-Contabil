import { describe, it, expect } from 'vitest';
import {
  generateDvaStatement,
  calculatePlrProfitSharing,
  unwrap
} from '../src/index.js';

describe('TESTES: Demonstração do Valor Adicionado (DVA CPC 09) & PLR (Lei 10.101/2000)', () => {
  it('1. Deve gerar Demonstração do Valor Adicionado (DVA - CPC 09) equilibrada', () => {
    // 1. Receitas: 10.000.000,00
    // 2. Insumos: 4.000.000,00
    // 3. VA Bruto: 6.000.000,00
    // 4. Retenções: 500.000,00
    // 5. VA Líquido: 5.500.000,00
    // 6. Transferências: 500.000,00
    // 7. Total a Distribuir: 6.000.000,00
    // 8. Distribuição:
    //    - Pessoal: 2.000.000,00
    //    - Governo: 2.000.000,00
    //    - Capitais de Terceiros: 500.000,00
    //    - Capitais Próprios: 1.500.000,00
    //    Total Distribuído: 6.000.000,00 (100% equilibrada)

    const res = generateDvaStatement({
      anoExercicio: 2026,
      vendasMercadoriasServicos: 10000000.00,
      outrasReceitasOperacionais: 0,
      provisaoCreditosLiquidacaoDuvidosa: 0,
      custosProdutosMercadoriasVendidos: 3000000.00,
      materiaisEnergiaServicosTerceiros: 1000000.00,
      depreciacaoAmortizacaoExaustao: 500000.00,
      resultadoEquivalenciaPatrimonialMep: 300000.00,
      receitasFinanceiras: 200000.00,
      distribuicaoPessoalRemuneracaoBeneficiosFgts: 2000000.00,
      distribuicaoImpostosTaxasContribuicoesGoverno: 2000000.00,
      distribuicaoJurosAlugueisCapitaisTerceiros: 500000.00,
      distribuicaoDividendosJcpLucrosRetidosAcionistas: 1500000.00
    });

    const data = unwrap(res);
    expect(data.equilibradaDva).toBe(true);
    expect(data.valorAdicionadoTotalADistribuirItem7).toBe(6000000.00);
    expect(data.distribuicaoValorAdicionadoItem8.totalDistribuido).toBe(6000000.00);
    expect(data.diferencaEquilibrio).toBe(0);
  });

  it('2. Deve calcular PLR com isencao total de INSS/FGTS e dedutibilidade no LALUR', () => {
    const res = calculatePlrProfitSharing({
      colaboradorId: 'EMP-ENG-001',
      nome: 'Carlos Eduardo Engenheiro',
      cargo: 'Tech Lead',
      valorPlrBrutoCalculado: 25000.00 // Faixa 27.5% com dedução de 3.123,78
    });

    const data = unwrap(res);
    expect(data.valorPlrBruto).toBe(25000.00);
    expect(data.isencaoInssPatronal).toBe(0); // 0% INSS
    expect(data.isencaoFgts).toBe(0); // 0% FGTS
    // IRRF = 25000 * 0.275 - 3123.78 = 6875 - 3123.78 = 3751.22
    expect(data.irrfExclusivoFontePlr).toBe(3751.22);
    expect(data.valorPlrLiquidoReceber).toBe(21248.78);
    expect(data.dedutibilidadeTotalLalurLucroReal).toBe(25000.00);
  });
});
