import { Result, Ok, Err } from '../../types/result.js';

export interface BillOfMaterialsItem {
  codigoInsumo: string;
  descricao: string;
  quantidadeNecessariaPorUnidade: number;
  unidadeMedida: string;
  percentualPerdaPadrao: number; // e.g. 0.02 (2%)
  custoUnitarioInsumo: number;
}

export interface ProductionOrder {
  numeroOrdem: string;
  codigoProdutoFinal: string;
  descricaoProdutoFinal: string;
  quantidadePlanejada: number;
  quantidadeProduzidaReal: number;
  dataInicio: string;
  dataConclusao: string;
  itensConsumidos: Array<{
    codigoInsumo: string;
    quantidadeConsumidaReal: number;
  }>;
}

export interface BlocoKProductionReport {
  numeroOrdem: string;
  codigoProdutoFinal: string;
  quantidadeProduzida: number;
  custoTotalInsumos: number;
  custoUnitarioProducao: number;
  desviosDeConsumoEPerdas: Array<{
    codigoInsumo: string;
    quantidadeEsperadaComPerda: number;
    quantidadeConsumidaReal: number;
    variacaoQuantidade: number;
    statusConformidade: 'DENTRO_DO_PADRAO' | 'PERDA_EXCESSIVA' | 'ECONOMIA_DE_INSUMO';
  }>;
  registrosBlocoK: Array<{
    registro: 'K200' | 'K230' | 'K235' | 'K280';
    campos: string[];
  }>;
}

export function processBlocoKProduction(
  order: ProductionOrder,
  bom: BillOfMaterialsItem[]
): Result<BlocoKProductionReport, Error> {
  const bomMap = new Map<string, BillOfMaterialsItem>();
  bom.forEach(item => bomMap.set(item.codigoInsumo, item));

  let custoTotalInsumos = 0;
  const desvios: BlocoKProductionReport['desviosDeConsumoEPerdas'] = [];
  const registrosBlocoK: BlocoKProductionReport['registrosBlocoK'] = [];

  // Registro K230: Itens Produzidos
  registrosBlocoK.push({
    registro: 'K230',
    campos: [
      order.dataInicio.replace(/-/g, ''),
      order.dataConclusao.replace(/-/g, ''),
      order.numeroOrdem,
      order.codigoProdutoFinal,
      order.quantidadeProduzidaReal.toString().replace('.', ',')
    ]
  });

  for (const itemConsumido of order.itensConsumidos) {
    const bomItem = bomMap.get(itemConsumido.codigoInsumo);
    if (!bomItem) {
      return Err(new Error('Insumo ' + itemConsumido.codigoInsumo + ' nao cadastrado na Ficha Tecnica (BOM).'));
    }

    const qtdPadraoSemPerda = order.quantidadeProduzidaReal * bomItem.quantidadeNecessariaPorUnidade;
    const qtdEsperadaComPerda = Number((qtdPadraoSemPerda * (1 + bomItem.percentualPerdaPadrao)).toFixed(4));
    const variacao = Number((itemConsumido.quantidadeConsumidaReal - qtdEsperadaComPerda).toFixed(4));

    let status: 'DENTRO_DO_PADRAO' | 'PERDA_EXCESSIVA' | 'ECONOMIA_DE_INSUMO' = 'DENTRO_DO_PADRAO';
    if (variacao > (qtdEsperadaComPerda * 0.05)) {
      status = 'PERDA_EXCESSIVA';
    } else if (variacao < -(qtdEsperadaComPerda * 0.05)) {
      status = 'ECONOMIA_DE_INSUMO';
    }

    const custoItem = Number((itemConsumido.quantidadeConsumidaReal * bomItem.custoUnitarioInsumo).toFixed(2));
    custoTotalInsumos += custoItem;

    desvios.push({
      codigoInsumo: itemConsumido.codigoInsumo,
      quantidadeEsperadaComPerda: qtdEsperadaComPerda,
      quantidadeConsumidaReal: itemConsumido.quantidadeConsumidaReal,
      variacaoQuantidade: variacao,
      statusConformidade: status
    });

    // Registro K235: Insumos Consumidos
    registrosBlocoK.push({
      registro: 'K235',
      campos: [
        order.dataConclusao.replace(/-/g, ''),
        itemConsumido.codigoInsumo,
        itemConsumido.quantidadeConsumidaReal.toString().replace('.', ','),
        '0' // insumo do próprio informante
      ]
    });
  }

  const custoUnitarioProducao = order.quantidadeProduzidaReal > 0
    ? Number((custoTotalInsumos / order.quantidadeProduzidaReal).toFixed(2))
    : 0;

  return Ok({
    numeroOrdem: order.numeroOrdem,
    codigoProdutoFinal: order.codigoProdutoFinal,
    quantidadeProduzida: order.quantidadeProduzidaReal,
    custoTotalInsumos: Number(custoTotalInsumos.toFixed(2)),
    custoUnitarioProducao,
    desviosDeConsumoEPerdas: desvios,
    registrosBlocoK
  });
}
