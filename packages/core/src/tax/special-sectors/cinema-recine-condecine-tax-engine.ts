import { Result, Ok, Err } from '../../types/result.js';

export type CinemaActivityType = 'EXIBIDOR_SALAS_CINEMA' | 'DISTRIBUIDOR_TITULOS' | 'PUBLICIDADE_COMERCIAL';

export interface CinemaTaxInput {
  empresaId: string;
  empresaNome: string;
  atividadeTipo: CinemaActivityType;
  habilitadaNoRecine: boolean; // Regime Especial Cinema (Lei 12.599/12)
  valorAquisicaoEquipamentosProjecaoDigitalBrl?: number; // Para RECINE
  quantidadeTitulosObrasAudiovisuais?: number; // Para CONDECINE Título
  valorReceitaPublicidadeAudiovisualBrl?: number; // Para CONDECINE Publicidade
}

export interface CinemaTaxResult {
  empresaId: string;
  empresaNome: string;
  atividadeTipo: CinemaActivityType;
  isBeneficioRecineAplicavel: boolean;
  desoneracaoTributosRecineBrl: number; // PIS + COFINS + IPI + II suspensos/0%
  valorCondecineDevidaBrl: number; // MP 2.228-1
  totalTributosFederaisDevidosBrl: number;
  diagnosticoFiscal: string;
}

export function processCinemaRecineCondecineTaxEngine(input: CinemaTaxInput): Result<CinemaTaxResult, Error> {
  const {
    empresaId,
    empresaNome,
    atividadeTipo,
    habilitadaNoRecine,
    valorAquisicaoEquipamentosProjecaoDigitalBrl = 0,
    quantidadeTitulosObrasAudiovisuais = 0,
    valorReceitaPublicidadeAudiovisualBrl = 0
  } = input;

  // 1. Benefício RECINE (Lei nº 12.599/2012):
  // Suspensão / Desoneração de PIS (1,65%), COFINS (7,60%), IPI (5%) e Imposto de Importação (10%)
  // sobre bens de capital destinados à construção e modernização de salas de exibição cinematográfica.
  let desoneracaoRecine = 0;
  if (habilitadaNoRecine && valorAquisicaoEquipamentosProjecaoDigitalBrl > 0) {
    const aliquotaTotalDesonerada = 0.0165 + 0.0760 + 0.0500 + 0.1000; // ~24,25%
    desoneracaoRecine = Number((valorAquisicaoEquipamentosProjecaoDigitalBrl * aliquotaTotalDesonerada).toFixed(2));
  }

  // 2. CONDECINE (MP nº 2.228-1/2001 Art. 32):
  // Apuração de CONDECINE Título ou CONDECINE Publicidade
  let condecine = 0;
  if (quantidadeTitulosObrasAudiovisuais > 0) {
    // CONDECINE Título (Média R$ 3.000,00 por obra cinematográfica de longa metragem)
    condecine += Number((quantidadeTitulosObrasAudiovisuais * 3000.00).toFixed(2));
  }
  if (valorReceitaPublicidadeAudiovisualBrl > 0) {
    // CONDECINE Publicidade (Ex: taxa sobre veiculação comercial)
    condecine += Number((valorReceitaPublicidadeAudiovisualBrl * 0.02).toFixed(2));
  }

  const diag = 'Setor Cinematográfico (RECINE Lei 12.599/12 & CONDECINE MP 2.228-1): ' + empresaNome + ' (' + atividadeTipo + '). RECINE Habilitado: ' + (habilitadaNoRecine ? 'SIM (Economia de R$ ' + desoneracaoRecine.toFixed(2) + ' em PIS/COFINS/IPI/II)' : 'NÃO') + ' | CONDECINE Devida: R$ ' + condecine.toFixed(2) + '.';

  return Ok({
    empresaId,
    empresaNome,
    atividadeTipo,
    isBeneficioRecineAplicavel: habilitadaNoRecine,
    desoneracaoTributosRecineBrl: desoneracaoRecine,
    valorCondecineDevidaBrl: condecine,
    totalTributosFederaisDevidosBrl: condecine,
    diagnosticoFiscal: diag
  });
}
