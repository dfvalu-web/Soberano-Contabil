import { calculateSimplesNacional } from '../simples-nacional/calculator.js';
import { calculateLucroPresumido } from '../lucro-presumido/calculator.js';
import { calculateLucroReal } from '../lucro-real/lalur.js';
import { calculateDualEngineReforma } from '../reforma-tributaria/dual-engine.js';
import { Result, Ok, Err } from '../../types/result.js';

export interface ComprehensiveTaxSimulationInput {
  receitaBrutaMensal: number;
  receitaBruta12Meses: number;
  folhaSalariosMensal: number;
  folhaSalarios12Meses: number;
  custoInsumosMercadoriasMensal: number;
  despesasOperacionaisMensal: number;
  tipoAtividade: 'COMERCIO' | 'SERVICOS' | 'INDUSTRIA' | 'TRANSPORTE';
  ufOrigem: string;
  ufDestino: string;
}

export interface RegimeComparisonResult {
  simplesNacional: {
    elegivel: boolean;
    impostoTotalMes: number;
    aliquotaEfetivaPercent: number;
    motivoInelegibilidade?: string;
  };
  lucroPresumido: {
    impostoTotalMes: number;
    aliquotaEfetivaPercent: number;
  };
  lucroReal: {
    impostoTotalMes: number;
    aliquotaEfetivaPercent: number;
    lucroLiquidoApurado: number;
  };
  reformaEc132Ano2026: {
    impostoTotalMes: number;
    aliquotaEfetivaPercent: number;
    splitPaymentRetido: number;
  };
  regimeMaisEconomico: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  economiaAnualEstimadaVsPiorCenario: number;
  diagnosticoEstrategico: string;
}

export function runComprehensiveTaxComparison(input: ComprehensiveTaxSimulationInput): Result<RegimeComparisonResult, Error> {
  const {
    receitaBrutaMensal,
    receitaBruta12Meses,
    folhaSalariosMensal,
    folhaSalarios12Meses,
    custoInsumosMercadoriasMensal,
    despesasOperacionaisMensal,
    tipoAtividade,
    ufOrigem,
    ufDestino
  } = input;

  if (receitaBrutaMensal <= 0) {
    return Err(new Error('Receita bruta mensal deve ser maior que zero.'));
  }

  // 1. Simulação Simples Nacional
  const isElegivelSimples = receitaBruta12Meses <= 4800000.00;
  let impostoSimples = 0;
  let aliqEfetivaSimples = 0;

  if (isElegivelSimples) {
    const anexo = tipoAtividade === 'COMERCIO' ? 'ANEXO_I' : tipoAtividade === 'INDUSTRIA' ? 'ANEXO_II' : 'ANEXO_III';
    const sRes = calculateSimplesNacional({
      rbt12: receitaBruta12Meses,
      receitaMes: receitaBrutaMensal,
      anexo,
      folha12Meses: folhaSalarios12Meses
    });
    if (sRes.success) {
      impostoSimples = sRes.data.valorDevidoTotal;
      aliqEfetivaSimples = Number((sRes.data.aliquotaEfetiva * 100).toFixed(2));
    }
  }

  // 2. Simulação Lucro Presumido
  const pRes = calculateLucroPresumido({
    trimestre: 1,
    ano: 2026,
    receitaComercio: tipoAtividade === 'COMERCIO' ? receitaBrutaMensal : 0,
    receitaIndustria: tipoAtividade === 'INDUSTRIA' ? receitaBrutaMensal : 0,
    receitaServicosGerais: tipoAtividade === 'SERVICOS' ? receitaBrutaMensal : 0,
    receitaServicosHospitalares: 0,
    receitaTransportes: tipoAtividade === 'TRANSPORTE' ? receitaBrutaMensal : 0,
    outrasReceitas: 0,
    retencoesFonteSofridas: { irrf: 0, csrf: 0, csll: 0, inss: 0, iss: 0 }
  });
  const impostoPresumido = pRes.success ? pRes.data.totalTributosFederaisAPagar : 0;
  const aliqEfetivaPresumido = Number(((impostoPresumido / receitaBrutaMensal) * 100).toFixed(2));

  // 3. Simulação Lucro Real
  const lucroContabil = receitaBrutaMensal - custoInsumosMercadoriasMensal - folhaSalariosMensal - despesasOperacionaisMensal;
  const rRes = calculateLucroReal({
    periodo: '2026-Q1',
    lucroLiquidoAntesIrpjCsll: lucroContabil,
    adicoesParteA: [],
    exclusoesParteA: [],
    saldoPrejuizoFiscalAnteriorParteB: 0,
    saldoBaseNegativaCsllAnteriorParteB: 0,
    receitaBrutaNaoCumulativaPisCofins: receitaBrutaMensal,
    creditosInsumosEnergiaDepreciacao: custoInsumosMercadoriasMensal + despesasOperacionaisMensal,
    retencoesFonteCompensaveis: { irrf: 0, csll: 0, pis: 0, cofins: 0 }
  });
  const impostoReal = rRes.success ? rRes.data.totalTributosFederaisDevidos : 0;
  const aliqEfetivaReal = Number(((impostoReal / receitaBrutaMensal) * 100).toFixed(2));

  // 4. Simulação Reforma EC 132/2023 (Ano 2026)
  const refRes = calculateDualEngineReforma({
    anoSimulacao: 2026,
    valorOperacao: receitaBrutaMensal,
    ufOrigem,
    ufDestino,
    municipioDestinoIbge: '3550308',
    tipoItem: tipoAtividade === 'SERVICOS' ? 'SERVICO' : 'MERCADORIA',
    regimeLegado: 'LUCRO_PRESUMIDO'
  });
  const impostoReforma = refRes.success ? refRes.data.novoModelo.totalTributosNovos : 0;
  const aliqEfetivaReforma = Number(((impostoReforma / receitaBrutaMensal) * 100).toFixed(2));
  const splitRetido = refRes.success ? refRes.data.novoModelo.splitPaymentEstimado.retencaoTributariaAutomatica : 0;

  // Comparação e Melhor Opção
  const opcoesValidas: Array<{ regime: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'; valor: number }> = [];
  if (isElegivelSimples) opcoesValidas.push({ regime: 'SIMPLES_NACIONAL', valor: impostoSimples });
  opcoesValidas.push({ regime: 'LUCRO_PRESUMIDO', valor: impostoPresumido });
  opcoesValidas.push({ regime: 'LUCRO_REAL', valor: impostoReal });

  opcoesValidas.sort((a, b) => a.valor - b.valor);
  const melhor = opcoesValidas[0]!;
  const pior = opcoesValidas[opcoesValidas.length - 1]!;
  const economiaAnual = Number(((pior.valor - melhor.valor) * 12).toFixed(2));

  let diagnostico = `O regime mais vantajoso é o ${melhor.regime}, gerando uma economia de R$ ${(pior.valor - melhor.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês.`;
  if (lucroContabil <= 0) {
    diagnostico += ' Em períodos com margens estreitas ou prejuízo operacional, o Lucro Real anula a tributação de IRPJ e CSLL.';
  }

  return Ok({
    simplesNacional: {
      elegivel: isElegivelSimples,
      impostoTotalMes: impostoSimples,
      aliquotaEfetivaPercent: aliqEfetivaSimples,
      motivoInelegibilidade: !isElegivelSimples ? 'RBT12 superior ao teto de R$ 4,8 milhões' : undefined
    },
    lucroPresumido: {
      impostoTotalMes: impostoPresumido,
      aliquotaEfetivaPercent: aliqEfetivaPresumido
    },
    lucroReal: {
      impostoTotalMes: impostoReal,
      aliquotaEfetivaPercent: aliqEfetivaReal,
      lucroLiquidoApurado: lucroContabil
    },
    reformaEc132Ano2026: {
      impostoTotalMes: impostoReforma,
      aliquotaEfetivaPercent: aliqEfetivaReforma,
      splitPaymentRetido: splitRetido
    },
    regimeMaisEconomico: melhor.regime,
    economiaAnualEstimadaVsPiorCenario: economiaAnual,
    diagnosticoEstrategico: diagnostico
  });
}
