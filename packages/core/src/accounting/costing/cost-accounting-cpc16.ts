import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface ProductionCostInput {
  periodo: string;
  estoqueInicialMateriaPrima: number;
  comprasMateriaPrimaPeriodo: number;
  estoqueFinalMateriaPrima: number;
  maoDeObraDiretaModPeriodo: number;
  custosIndiretosFabricacaoCif: {
    energiaEletricaFabrica: number;
    depreciacaoMaquinasFabrica: number;
    manutencaoEInsumosIndiretos: number;
  };
  estoqueInicialProdutosEmElaboracao: number;
  estoqueFinalProdutosEmElaboracao: number;
  estoqueInicialProdutosAcabados: number;
  estoqueFinalProdutosAcabados: number;
}

export interface ProductionCostResult {
  periodo: string;
  materiaPrimaConsumidaMp: number;
  maoDeObraDiretaMod: number;
  totalCustosIndiretosCif: number;
  custoProducaoPeriodoCpp: number;
  custoProducaoAcabadaCpa: number;
  custoProdutosVendidosCpv: number;
  partidasDobradaCpv: JournalEntryLine[];
}

export function calculateCostOfGoodsManufactured(input: ProductionCostInput): Result<ProductionCostResult, Error> {
  const {
    periodo,
    estoqueInicialMateriaPrima,
    comprasMateriaPrimaPeriodo,
    estoqueFinalMateriaPrima,
    maoDeObraDiretaModPeriodo,
    custosIndiretosFabricacaoCif,
    estoqueInicialProdutosEmElaboracao,
    estoqueFinalProdutosEmElaboracao,
    estoqueInicialProdutosAcabados,
    estoqueFinalProdutosAcabados
  } = input;

  // 1. MP Consumida = EI + Compras - EF
  const mpConsumida = Number((estoqueInicialMateriaPrima + comprasMateriaPrimaPeriodo - estoqueFinalMateriaPrima).toFixed(2));
  if (mpConsumida < 0) {
    return Err(new Error('Consumo de matéria-prima não pode ser negativo. Verifique estoques.'));
  }

  // 2. CIF Total
  const cifTotal = Number((
    custosIndiretosFabricacaoCif.energiaEletricaFabrica +
    custosIndiretosFabricacaoCif.depreciacaoMaquinasFabrica +
    custosIndiretosFabricacaoCif.manutencaoEInsumosIndiretos
  ).toFixed(2));

  // 3. CPP = MP + MOD + CIF
  const cpp = Number((mpConsumida + maoDeObraDiretaModPeriodo + cifTotal).toFixed(2));

  // 4. CPA = EIPE + CPP - EFPE
  const cpa = Number((estoqueInicialProdutosEmElaboracao + cpp - estoqueFinalProdutosEmElaboracao).toFixed(2));

  // 5. CPV = EIPA + CPA - EFPA
  const cpv = Number((estoqueInicialProdutosAcabados + cpa - estoqueFinalProdutosAcabados).toFixed(2));

  const partidas: JournalEntryLine[] = [
    {
      accountId: '4.1.1.01',
      accountCode: '4.1.1.01',
      accountName: 'Custo dos Produtos Vendidos - CPV (Resultado - CPC 16)',
      type: 'DEBIT',
      amount: cpv
    },
    {
      accountId: '1.1.3.02',
      accountCode: '1.1.3.02',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'CREDIT',
      amount: cpv
    }
  ];

  return Ok({
    periodo,
    materiaPrimaConsumidaMp: mpConsumida,
    maoDeObraDiretaMod: maoDeObraDiretaModPeriodo,
    totalCustosIndiretosCif: cifTotal,
    custoProducaoPeriodoCpp: cpp,
    custoProducaoAcabadaCpa: cpa,
    custoProdutosVendidosCpv: cpv,
    partidasDobradaCpv: partidas
  });
}
