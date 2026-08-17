import { Result, Ok, Err } from '../../types/result.js';

export interface SoftwareDevelopmentCostsInput {
  projetoSoftwareId: string;
  nomeSoftware: string; // Ex: 'Soberano Core Financial AI Platform'
  despesasFasePesquisaBrl: number; // Ex: R$ 500.000,00 (100% Resultado)
  custosFaseDesenvolvimentoElegiveisBrl: number; // Ex: R$ 3.000.000,00 (Ativável no Intangível)
  vidaUtilMeses: number; // Ex: 60 meses (5 anos)
  mesesAmortizadosNoAno: number; // Ex: 6 meses
}

export interface SoftwareDevelopmentCostsResult {
  projetoSoftwareId: string;
  nomeSoftware: string;
  despesaPesquisaReconhecidaDreBrl: number;
  valorIntangivelAtivadoBalancoBrl: number;
  amortizacaoMensalBrl: number;
  amortizacaoAcumuladaPeriodoBrl: number;
  saldoLiquidoIntangivelFinalBrl: number;
  statusElegibilidadeCpc04: 'ATIVACAO_INTANGIVEL_DESENVOLVIMENTO_CONFORME';
  lancamentoContabilSugerido: {
    debitoIntangivelSoftwareAtivoBrl: number;
    debitoDespesaPesquisaDreBrl: number;
    debitoDespesaAmortizacaoDreBrl: number;
    creditoAmortizacaoAcumuladaIntangivelBrl: number;
  };
  diagnosticoCpc04: string;
}

export function processInternallyGeneratedSoftwareIntangiblesCpc04(input: SoftwareDevelopmentCostsInput): Result<SoftwareDevelopmentCostsResult, Error> {
  const {
    projetoSoftwareId,
    nomeSoftware,
    despesasFasePesquisaBrl,
    custosFaseDesenvolvimentoElegiveisBrl,
    vidaUtilMeses,
    mesesAmortizadosNoAno
  } = input;

  if (custosFaseDesenvolvimentoElegiveisBrl <= 0 || vidaUtilMeses <= 0) {
    return Err(new Error('Custos de desenvolvimento e vida útil devem ser positivos.'));
  }

  // 1. Fase de Pesquisa: 100% Despesa na DRE (CPC 04 item 54)
  const despesaPesquisa = despesasFasePesquisaBrl;

  // 2. Fase de Desenvolvimento: Ativação no Ativo Intangível (CPC 04 item 57)
  const valorAtivado = custosFaseDesenvolvimentoElegiveisBrl;

  // 3. Amortização Linear:
  const amortizacaoMensal = Number((valorAtivado / vidaUtilMeses).toFixed(2));
  const amortizacaoPeriodo = Number((amortizacaoMensal * mesesAmortizadosNoAno).toFixed(2));
  const saldoLiquidoFinal = Number((valorAtivado - amortizacaoPeriodo).toFixed(2));

  const diag = "Ativos Intangiveis de Software (CPC 04 / IAS 38): Projeto " + projetoSoftwareId + " (" + nomeSoftware + ") | Pesquisa (DRE): R$ " + despesaPesquisa.toFixed(2) + " | Desenvolvimento Ativado no Intangivel: R$ " + valorAtivado.toFixed(2) + " -> Amortizacao (" + mesesAmortizadosNoAno + " meses): R$ " + amortizacaoPeriodo.toFixed(2) + " -> Saldo Contabil Liquido: R$ " + saldoLiquidoFinal.toFixed(2) + ".";

  return Ok({
    projetoSoftwareId,
    nomeSoftware,
    despesaPesquisaReconhecidaDreBrl: despesaPesquisa,
    valorIntangivelAtivadoBalancoBrl: valorAtivado,
    amortizacaoMensalBrl: amortizacaoMensal,
    amortizacaoAcumuladaPeriodoBrl: amortizacaoPeriodo,
    saldoLiquidoIntangivelFinalBrl: saldoLiquidoFinal,
    statusElegibilidadeCpc04: 'ATIVACAO_INTANGIVEL_DESENVOLVIMENTO_CONFORME',
    lancamentoContabilSugerido: {
      debitoIntangivelSoftwareAtivoBrl: valorAtivado,
      debitoDespesaPesquisaDreBrl: despesaPesquisa,
      debitoDespesaAmortizacaoDreBrl: amortizacaoPeriodo,
      creditoAmortizacaoAcumuladaIntangivelBrl: amortizacaoPeriodo
    },
    diagnosticoCpc04: diag
  });
}
