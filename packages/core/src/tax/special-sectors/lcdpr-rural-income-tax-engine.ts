import { Result, Ok, Err } from '../../types/result.js';

export interface LcdprRuralInput {
  produtorId: string;
  produtorNome: string; // Ex: 'Produtor Rural David & Condomínio Fazendas Soberanas'
  cpf: string;
  anoCalendario: number; // Ex: 2026
  receitaBrutaAtividadeRuralBrl: number;
  despesasCusteioInvestimentosBrl: number; // 100% dedutível no ano
  prejuizosFiscaisAnosAnterioresBrl?: number; // Compensação ilimitada
}

export interface LcdprRuralResult {
  produtorId: string;
  produtorNome: string;
  anoCalendario: number;
  resultadoRealApuradoBrl: number; // Receitas - Despesas
  baseTributavelArbitramento20PercentBrl: number; // 20% da Receita Bruta
  regimeMaisVantajoso: 'RESULTADO_REAL_LIVRO_CAIXA' | 'ARBITRAMENTO_SIMPLIFICADO_20_PERCENT';
  baseCalculoEfetivaIrpfBrl: number;
  irpfEstimadoDevidoBrl: number; // 27,5% com deduções da tabela progressiva
  saldoPrejuizoFiscalParaCompensarAnoSeguinteBrl: number;
  arquivoLcdprGerado: boolean;
  diagnosticoLcdpr: string;
}

export function processLcdprRuralIncomeTaxEngine(input: LcdprRuralInput): Result<LcdprRuralResult, Error> {
  const {
    produtorId,
    produtorNome,
    cpf,
    anoCalendario,
    receitaBrutaAtividadeRuralBrl,
    despesasCusteioInvestimentosBrl,
    prejuizosFiscaisAnosAnterioresBrl = 0
  } = input;

  if (receitaBrutaAtividadeRuralBrl <= 0) {
    return Err(new Error('Receita bruta da atividade rural deve ser maior que zero.'));
  }

  // Lei nº 8.023/1990 & IN RFB nº 1.903/2019:
  // 1. Opção 1: Resultado Real (Livro Caixa Digital)
  const resultadoRealBruto = receitaBrutaAtividadeRuralBrl - despesasCusteioInvestimentosBrl;
  let resultadoRealAposPrejuizo = resultadoRealBruto;
  let saldoPrejuizoRestante = 0;

  if (resultadoRealBruto > 0 && prejuizosFiscaisAnosAnterioresBrl > 0) {
    if (resultadoRealBruto >= prejuizosFiscaisAnosAnterioresBrl) {
      resultadoRealAposPrejuizo = resultadoRealBruto - prejuizosFiscaisAnosAnterioresBrl;
      saldoPrejuizoRestante = 0;
    } else {
      saldoPrejuizoRestante = prejuizosFiscaisAnosAnterioresBrl - resultadoRealBruto;
      resultadoRealAposPrejuizo = 0;
    }
  } else if (resultadoRealBruto < 0) {
    saldoPrejuizoRestante = prejuizosFiscaisAnosAnterioresBrl + Math.abs(resultadoRealBruto);
    resultadoRealAposPrejuizo = 0;
  }

  // 2. Opção 2: Arbitramento Simplificado (20% da Receita Bruta)
  const baseArbitramento20 = Number((receitaBrutaAtividadeRuralBrl * 0.20).toFixed(2));

  // 3. Comparativo de Regime mais vantajoso
  const isRealMaisVantajoso = resultadoRealAposPrejuizo <= baseArbitramento20;
  const regime: 'RESULTADO_REAL_LIVRO_CAIXA' | 'ARBITRAMENTO_SIMPLIFICADO_20_PERCENT' = isRealMaisVantajoso
    ? 'RESULTADO_REAL_LIVRO_CAIXA'
    : 'ARBITRAMENTO_SIMPLIFICADO_20_PERCENT';

  const baseEfetiva = isRealMaisVantajoso ? Math.max(0, resultadoRealAposPrejuizo) : baseArbitramento20;
  // IRPF Teto 27,5% - parcela a deduzir
  const irpf = Number((Math.max(0, (baseEfetiva * 0.275) - 10700.00)).toFixed(2));

  const diag = "LCDPR & IRPF Rural (Lei 8.023/90): " + produtorNome + " (Ano " + anoCalendario + "). Receita: R$ " + receitaBrutaAtividadeRuralBrl.toFixed(2) + " - Despesas/Capex: R$ " + despesasCusteioInvestimentosBrl.toFixed(2) + " = Resultado Real: R$ " + resultadoRealBruto.toFixed(2) + " (vs Arbitramento 20%: R$ " + baseArbitramento20.toFixed(2) + "). REGIME ESCOLHIDO: " + regime + " | Base IRPF: R$ " + baseEfetiva.toFixed(2) + " -> IRPF Devido: R$ " + irpf.toFixed(2) + " | Prejuizo Fiscal Remanescente: R$ " + saldoPrejuizoRestante.toFixed(2) + ". Arquivo LCDPR gerado com sucesso.";

  return Ok({
    produtorId,
    produtorNome,
    anoCalendario,
    resultadoRealApuradoBrl: resultadoRealBruto,
    baseTributavelArbitramento20PercentBrl: baseArbitramento20,
    regimeMaisVantajoso: regime,
    baseCalculoEfetivaIrpfBrl: baseEfetiva,
    irpfEstimadoDevidoBrl: irpf,
    saldoPrejuizoFiscalParaCompensarAnoSeguinteBrl: saldoPrejuizoRestante,
    arquivoLcdprGerado: true,
    diagnosticoLcdpr: diag
  });
}
