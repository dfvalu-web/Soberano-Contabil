import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type FixedAssetCategory = 'MAQUINAS_EQUIPAMENTOS' | 'VEICULOS' | 'EDIFICACOES' | 'EQUIPAMENTOS_INFORMATICA' | 'MOVEIS_UTENSILIOS' | 'INTANGIVEL_SOFTWARE';

export interface FixedAssetItem {
  id: string;
  tenantId: string;
  codigoPatrimonial: string;
  descricao: string;
  categoria: FixedAssetCategory;
  dataAquisicao: string;
  dataInicioDepreciacao: string;
  custoAquisicao: number;
  valorResidualEstimado: number;
  vidaUtilAnos: number;
  taxaDepreciacaoAnualPercent: number; // e.g. 10 para 10%
  depreciacaoAcumuladaAnterior: number;
  valorRecuperavelImpairment?: number;
}

export interface DepreciationCalculationResult {
  assetId: string;
  codigoPatrimonial: string;
  mesCompetencia: string;
  baseCalculoDepreciavel: number;
  depreciacaoMensal: number;
  novaDepreciacaoAcumulada: number;
  valorContabilLiquido: number;
  perdaPorImpairmentReconhecida: number;
  partidasDobradaSugeridas: JournalEntryLine[];
}

export function calculateAssetDepreciation(
  asset: FixedAssetItem,
  mesCompetencia: string
): Result<DepreciationCalculationResult, Error> {
  if (asset.custoAquisicao <= 0) {
    return Err(new Error('Custo de aquisição do ativo deve ser maior que zero.'));
  }

  const baseDepreciavel = Math.max(0, asset.custoAquisicao - asset.valorResidualEstimado);
  const vidaUtilMeses = asset.vidaUtilAnos * 12;

  if (vidaUtilMeses <= 0) {
    return Err(new Error('Vida útil do ativo deve ser superior a zero.'));
  }

  const depreciacaoMensalTeorica = Number((baseDepreciavel / vidaUtilMeses).toFixed(2));
  const limiteMaximoDepreciacao = baseDepreciavel;
  const depreciacaoPossivel = Math.max(0, limiteMaximoDepreciacao - asset.depreciacaoAcumuladaAnterior);
  const depreciacaoEfetivaDoMes = Number(Math.min(depreciacaoMensalTeorica, depreciacaoPossivel).toFixed(2));
  const novaDepreciacaoAcumulada = Number((asset.depreciacaoAcumuladaAnterior + depreciacaoEfetivaDoMes).toFixed(2));
  let valorContabilLiquido = Number((asset.custoAquisicao - novaDepreciacaoAcumulada).toFixed(2));

  let perdaImpairment = 0;
  if (asset.valorRecuperavelImpairment !== undefined && asset.valorRecuperavelImpairment < valorContabilLiquido) {
    perdaImpairment = Number((valorContabilLiquido - asset.valorRecuperavelImpairment).toFixed(2));
    valorContabilLiquido = asset.valorRecuperavelImpairment;
  }

  const partidas: JournalEntryLine[] = [];
  if (depreciacaoEfetivaDoMes > 0) {
    partidas.push({
      accountId: '4.1.3.01',
      accountCode: '4.1.3.01',
      accountName: 'Despesa com Depreciação e Amortização (Resultado - CPC 27)',
      type: 'DEBIT',
      amount: depreciacaoEfetivaDoMes
    });
    partidas.push({
      accountId: '1.2.3.09',
      accountCode: '1.2.3.09',
      accountName: '(-) Depreciação Acumulada do Imobilizado (Ativo Não Circulante)',
      type: 'CREDIT',
      amount: depreciacaoEfetivaDoMes
    });
  }

  return Ok({
    assetId: asset.id,
    codigoPatrimonial: asset.codigoPatrimonial,
    mesCompetencia,
    baseCalculoDepreciavel: baseDepreciavel,
    depreciacaoMensal: depreciacaoEfetivaDoMes,
    novaDepreciacaoAcumulada,
    valorContabilLiquido,
    perdaPorImpairmentReconhecida: perdaImpairment,
    partidasDobradaSugeridas: partidas
  });
}
