import { Result, Ok, Err } from '../../types/result.js';

export type PrintingDestinyType = 'EMBALAGEM_INTEGRANTE_CADEIA_INDUSTRIAL' | 'IMPRESSO_CONSUMO_FINAL_ENCOMENDANTE';

export interface PrintingPackagingInput {
  operacaoId: string;
  graficaNome: string;
  descricaoProduto: string; // Ex: 'Caixas de Embalagem para Cosméticos / Rótulos / Folders'
  destinacao: PrintingDestinyType;
  valorOperacaoBrl: number;
  aliquotaIcmsPadraoPercent?: number; // 18%
  aliquotaIpiPadraoPercent?: number; // 5%
  aliquotaIssqnPadraoPercent?: number; // 5%
}

export interface PrintingPackagingResult {
  operacaoId: string;
  graficaNome: string;
  descricaoProduto: string;
  destinacao: PrintingDestinyType;
  regimeTributarioAplicavel: string; // ICMS + IPI vs ISSQN Exclusivo
  valorIcmsDevidoBrl: number;
  valorIpiDevidoBrl: number;
  valorIssqnDevidoBrl: number;
  totalTributosDevidosBrl: number;
  diagnosticoFiscal: string;
}

export function processPrintingPackagingStf164TaxEngine(input: PrintingPackagingInput): Result<PrintingPackagingResult, Error> {
  const {
    operacaoId,
    graficaNome,
    descricaoProduto,
    destinacao,
    valorOperacaoBrl,
    aliquotaIcmsPadraoPercent = 18.0,
    aliquotaIpiPadraoPercent = 5.0,
    aliquotaIssqnPadraoPercent = 5.0
  } = input;

  if (valorOperacaoBrl <= 0) {
    return Err(new Error('Valor da operação gráfica deve ser superior a zero.'));
  }

  // Tese Vinculante do STF (Tema 164 / RE 592.891):
  // 1. Embalagens, rótulos e caixas personalizadas para indústria/comércio (integram cadeia produtiva):
  //    Incidência de ICMS e IPI (não incidência de ISSQN).
  // 2. Impressos personalizados para consumo final do encomendante (cartões, manuais, folders):
  //    Incidência EXCLUSIVA de ISSQN (não incidência de ICMS nem IPI).
  if (destinacao === 'EMBALAGEM_INTEGRANTE_CADEIA_INDUSTRIAL') {
    const icms = Number((valorOperacaoBrl * (aliquotaIcmsPadraoPercent / 100)).toFixed(2));
    const ipi = Number((valorOperacaoBrl * (aliquotaIpiPadraoPercent / 100)).toFixed(2));
    const total = Number((icms + ipi).toFixed(2));

    const diag = 'Indústria Gráfica - Embalagens Industriais (STF Tema 164): ' + graficaNome + ' - ' + descricaoProduto + '. Produto integra cadeia produtiva. INCIDÊNCIA DE ICMS (' + aliquotaIcmsPadraoPercent + '% = R$ ' + icms.toFixed(2) + ') e IPI (' + aliquotaIpiPadraoPercent + '% = R$ ' + ipi.toFixed(2) + '). ISSQN NÃO APLICÁVEL.';

    return Ok({
      operacaoId,
      graficaNome,
      descricaoProduto,
      destinacao,
      regimeTributarioAplicavel: 'ICMS + IPI (Operação de Industrialização - STF Tema 164)',
      valorIcmsDevidoBrl: icms,
      valorIpiDevidoBrl: ipi,
      valorIssqnDevidoBrl: 0,
      totalTributosDevidosBrl: total,
      diagnosticoFiscal: diag
    });
  }

  // Destinação: IMPRESSO_CONSUMO_FINAL_ENCOMENDANTE
  const issqn = Number((valorOperacaoBrl * (aliquotaIssqnPadraoPercent / 100)).toFixed(2));

  const diag = 'Indústria Gráfica - Impressos para Uso Próprio (STF Tema 164): ' + graficaNome + ' - ' + descricaoProduto + '. Destinado ao consumo do encomendante. INCIDÊNCIA EXCLUSIVA DE ISSQN (' + aliquotaIssqnPadraoPercent + '% = R$ ' + issqn.toFixed(2) + '). ICMS e IPI NÃO APLICÁVEIS.';

  return Ok({
    operacaoId,
    graficaNome,
    descricaoProduto,
    destinacao,
    regimeTributarioAplicavel: 'ISSQN Exclusivo (Prestação de Serviços - STF Tema 164)',
    valorIcmsDevidoBrl: 0,
    valorIpiDevidoBrl: 0,
    valorIssqnDevidoBrl: issqn,
    totalTributosDevidosBrl: issqn,
    diagnosticoFiscal: diag
  });
}
