import { Result, Ok, Err } from '../../types/result.js';

export type FuelType = 'GASOLINA_AUTOMOTIVA' | 'OLEO_DIESEL' | 'QUEROSENE_AVIACAO_QAV' | 'GLP_GAS_LIQUEFEITO_PETROLEO';
export type FuelDestination = 'MERCADO_INTERNO' | 'EXPORTACAO_EXTERIOR';

export interface CideFuelInput {
  operacaoId: string;
  refinariaNome: string;
  tipoCombustivel: FuelType;
  destinacao: FuelDestination;
  volumeComercializadoM3: number; // Em Metros Cúbicos (m³) ou Toneladas para GLP
  aliquotaEspecificaAdRemBrlPorM3?: number; // Ex: Gasolina R$ 100,00/m³ (Dec. 5.060/04)
}

export interface CideFuelResult {
  operacaoId: string;
  refinariaNome: string;
  tipoCombustivel: FuelType;
  destinacao: FuelDestination;
  isImunidadeExportacaoConstitucional: boolean;
  aliquotaAdRemEfetivaBrlPorUnidade: number;
  volumeComercializadoM3: number;
  valorCideDevidaBrl: number;
  diagnosticoFiscal: string;
}

export function processCideFuelsPetroleumTaxEngine(input: CideFuelInput): Result<CideFuelResult, Error> {
  const {
    operacaoId,
    refinariaNome,
    tipoCombustivel,
    destinacao,
    volumeComercializadoM3,
    aliquotaEspecificaAdRemBrlPorM3 = 100.00 // Padrão Gasolina R$ 100/m³
  } = input;

  if (volumeComercializadoM3 <= 0) {
    return Err(new Error('Volume comercializado de combustível deve ser superior a zero.'));
  }

  // CF/88 Art. 149, § 2º, I: A CIDE NÃO incide sobre as receitas decorrentes de exportação
  if (destinacao === 'EXPORTACAO_EXTERIOR') {
    const diag = 'CIDE-Combustíveis (Art. 149 CF/88 & Lei nº 10.336/01): ' + tipoCombustivel + ' destinado à EXPORTAÇÃO. Imunidade Constitucional (CIDE R$ 0,00).';

    return Ok({
      operacaoId,
      refinariaNome,
      tipoCombustivel,
      destinacao,
      isImunidadeExportacaoConstitucional: true,
      aliquotaAdRemEfetivaBrlPorUnidade: 0,
      volumeComercializadoM3,
      valorCideDevidaBrl: 0,
      diagnosticoFiscal: diag
    });
  }

  // Mercado Interno: Alíquota Ad Rem em R$/m³ ou R$/tonelada
  const valorCide = Number((volumeComercializadoM3 * aliquotaEspecificaAdRemBrlPorM3).toFixed(2));
  const diag = 'CIDE-Combustíveis (Lei nº 10.336/01 e Dec. nº 5.060/04): ' + refinariaNome + ' (' + tipoCombustivel + '). Volume: ' + volumeComercializadoM3 + ' m³ x Alíquota Ad Rem R$ ' + aliquotaEspecificaAdRemBrlPorM3.toFixed(2) + '/m³ = CIDE Devida R$ ' + valorCide.toFixed(2) + '.';

  return Ok({
    operacaoId,
    refinariaNome,
    tipoCombustivel,
    destinacao,
    isImunidadeExportacaoConstitucional: false,
    aliquotaAdRemEfetivaBrlPorUnidade: aliquotaEspecificaAdRemBrlPorM3,
    volumeComercializadoM3,
    valorCideDevidaBrl: valorCide,
    diagnosticoFiscal: diag
  });
}
