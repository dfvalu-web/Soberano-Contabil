import { ReformaTributariaInput, ReformaTributariaResult } from '../../types/tax.js';
import { Result, Ok } from '../../types/result.js';

export const ALIQUOTA_PADRAO_CBS_REFERENCIA = 0.088;
export const ALIQUOTA_PADRAO_IBS_REFERENCIA = 0.177;
export const REDUCAO_REGIME_DIFERENCIADO = 0.60;

export function calculateDualEngineReforma(input: ReformaTributariaInput): Result<ReformaTributariaResult, Error> {
  const {
    anoSimulacao,
    valorOperacao,
    isRegimeDiferenciadoSaudeEducacao,
    isCestaBasicaNacional,
    isImpostoSeletivoIncidente,
    aliquotaImpostoSeletivoPercent = 0.10,
    regimeLegado
  } = input;

  let aliquotaCbsBase = ALIQUOTA_PADRAO_CBS_REFERENCIA;
  let aliquotaIbsBase = ALIQUOTA_PADRAO_IBS_REFERENCIA;
  let faseDescricao = '';

  if (anoSimulacao === 2026) {
    aliquotaCbsBase = 0.009;
    aliquotaIbsBase = 0.001;
    faseDescricao = 'Ano-Teste (2026): CBS a 0,9% e IBS a 0,1% compensáveis integralmente.';
  } else if (anoSimulacao === 2027 || anoSimulacao === 2028) {
    aliquotaCbsBase = ALIQUOTA_PADRAO_CBS_REFERENCIA;
    aliquotaIbsBase = 0.001;
    faseDescricao = 'Fase Federal (2027-2028): CBS entra integralmente, PIS e COFINS são extintos.';
  } else if (anoSimulacao >= 2029 && anoSimulacao <= 2032) {
    const proporcaoIbs = (anoSimulacao - 2028) * 0.25;
    aliquotaCbsBase = ALIQUOTA_PADRAO_CBS_REFERENCIA;
    aliquotaIbsBase = ALIQUOTA_PADRAO_IBS_REFERENCIA * proporcaoIbs;
    faseDescricao = `Transição Subnacional (${anoSimulacao}): Redução gradual de ICMS/ISS e transição de ${(proporcaoIbs * 100).toFixed(0)}% para o IBS.`;
  } else {
    aliquotaCbsBase = ALIQUOTA_PADRAO_CBS_REFERENCIA;
    aliquotaIbsBase = ALIQUOTA_PADRAO_IBS_REFERENCIA;
    faseDescricao = 'Modelo Definitivo (2033+): CBS e IBS em vigência plena sob Princípio do Destino.';
  }

  let aliquotaCbsEfetiva = aliquotaCbsBase;
  let aliquotaIbsEfetiva = aliquotaIbsBase;

  if (isCestaBasicaNacional) {
    aliquotaCbsEfetiva = 0;
    aliquotaIbsEfetiva = 0;
  } else if (isRegimeDiferenciadoSaudeEducacao) {
    aliquotaCbsEfetiva = Number((aliquotaCbsBase * (1 - REDUCAO_REGIME_DIFERENCIADO)).toFixed(6));
    aliquotaIbsEfetiva = Number((aliquotaIbsBase * (1 - REDUCAO_REGIME_DIFERENCIADO)).toFixed(6));
  }

  const valorCbs = Number((valorOperacao * aliquotaCbsEfetiva).toFixed(2));
  const valorIbs = Number((valorOperacao * aliquotaIbsEfetiva).toFixed(2));

  let aliquotaImpostoSeletivo = 0;
  let valorImpostoSeletivo = 0;
  if (isImpostoSeletivoIncidente) {
    aliquotaImpostoSeletivo = aliquotaImpostoSeletivoPercent;
    valorImpostoSeletivo = Number((valorOperacao * aliquotaImpostoSeletivo).toFixed(2));
  }

  const totalTributosNovos = Number((valorCbs + valorIbs + valorImpostoSeletivo).toFixed(2));
  const retencaoTributariaAutomatica = totalTributosNovos;
  const valorLiquidoFornecedor = Number((valorOperacao - retencaoTributariaAutomatica).toFixed(2));

  let pisLegado = 0;
  let cofinsLegado = 0;
  let icmsLegado = 0;
  let issLegado = 0;
  let ipiLegado = 0;

  if (anoSimulacao >= 2027) {
    pisLegado = 0;
    cofinsLegado = 0;
  } else {
    if (regimeLegado === 'LUCRO_REAL_TRIMESTRAL' || regimeLegado === 'LUCRO_REAL_ANUAL') {
      pisLegado = Number((valorOperacao * 0.0165).toFixed(2));
      cofinsLegado = Number((valorOperacao * 0.0760).toFixed(2));
    } else {
      pisLegado = Number((valorOperacao * 0.0065).toFixed(2));
      cofinsLegado = Number((valorOperacao * 0.0300).toFixed(2));
    }
  }

  const fatorRemanescenteIcms = anoSimulacao >= 2033 ? 0 : anoSimulacao >= 2029 ? (1 - (anoSimulacao - 2028) * 0.25) : 1;
  const aliquotaIcmsAplicada = (input.aliquotaIcmsDestino || 0.18) * fatorRemanescenteIcms;
  
  if (input.tipoItem === 'MERCADORIA' || input.tipoItem === 'BEM_CAPITAL') {
    icmsLegado = Number((valorOperacao * aliquotaIcmsAplicada).toFixed(2));
  } else {
    const aliquotaIssAplicada = (input.aliquotaIssLocal || 0.05) * fatorRemanescenteIcms;
    issLegado = Number((valorOperacao * aliquotaIssAplicada).toFixed(2));
  }

  const totalTributosLegado = Number((pisLegado + cofinsLegado + icmsLegado + issLegado + ipiLegado).toFixed(2));
  const diferencaValor = Number((totalTributosNovos - totalTributosLegado).toFixed(2));
  const variacaoPercentual = totalTributosLegado > 0
    ? Number(((diferencaValor / totalTributosLegado) * 100).toFixed(2))
    : 0;

  return Ok({
    anoSimulacao,
    valorBase: valorOperacao,
    novoModelo: {
      aliquotaCbsEfetiva,
      valorCbs,
      aliquotaIbsEfetiva,
      valorIbs,
      aliquotaImpostoSeletivo,
      valorImpostoSeletivo,
      totalTributosNovos,
      splitPaymentEstimado: {
        valorLiquidoFornecedor,
        retencaoTributariaAutomatica
      }
    },
    modeloLegado: {
      pis: pisLegado,
      cofins: cofinsLegado,
      icms: icmsLegado,
      iss: issLegado,
      ipi: ipiLegado,
      totalTributosLegado
    },
    diferencaValor,
    variacaoPercentual,
    faseTransicaoDescricao: faseDescricao
  });
}
