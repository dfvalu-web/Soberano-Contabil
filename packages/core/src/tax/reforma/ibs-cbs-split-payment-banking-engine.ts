import { Result, Ok, Err } from '../../types/result.js';

export interface SplitPaymentInput {
  chaveAcessoNfe: string;
  valorTotalFaturaBrl: number;
  aliquotaIbsPercent: number; // Ex: 17.5% (Estados/Municípios)
  aliquotaCbsPercent: number; // Ex: 8.8% (Federal)
  chavePixDestinatario: string;
}

export interface SplitPaymentResult {
  chaveAcessoNfe: string;
  valorTotalFaturaBrl: number;
  valorLiquidoFornecedorBrl: number;
  retencaoIbsComiteGestorBrl: number;
  retencaoCbsReceitaFederalBrl: number;
  totalTributosRetidosSplitBrl: number;
  statusSplitPayment: 'SPLIT_LIQUIDADO_INSTANTANEAMENTE_BACEN';
  codigoLiquidacaoBacenPix: string;
  creditoFinanceiroImediatoAdquirenteBrl: number;
  diagnosticoSplitPayment: string;
}

export function processIbsCbsSplitPaymentBankingEngine(input: SplitPaymentInput): Result<SplitPaymentResult, Error> {
  const {
    chaveAcessoNfe,
    valorTotalFaturaBrl,
    aliquotaIbsPercent,
    aliquotaCbsPercent,
    chavePixDestinatario
  } = input;

  if (valorTotalFaturaBrl <= 0 || aliquotaIbsPercent < 0 || aliquotaCbsPercent < 0) {
    return Err(new Error('Valor da fatura e alíquotas de IBS/CBS devem ser positivos.'));
  }

  // Cálculo de IBS e CBS em regime por fora (base líquida da operação)
  const valorIbs = Number((valorTotalFaturaBrl * (aliquotaIbsPercent / 100)).toFixed(2));
  const valorCbs = Number((valorTotalFaturaBrl * (aliquotaCbsPercent / 100)).toFixed(2));
  const totalRetido = Number((valorIbs + valorCbs).toFixed(2));
  const liquidoFornecedor = Number((valorTotalFaturaBrl - totalRetido).toFixed(2));

  const codBacen = 'BACEN-SPLIT-PIX-' + Date.now();

  const diag = "Split Payment Inteligente IBS/CBS (EC 132/23): NF-e " + chaveAcessoNfe.slice(0, 20) + "... | Fatura: R$ " + valorTotalFaturaBrl.toFixed(2) + " -> Liquidacao Fornecedor: R$ " + liquidoFornecedor.toFixed(2) + " (Pix: " + chavePixDestinatario + ") | Retencao IBS Comite Gestor (" + aliquotaIbsPercent + "%): R$ " + valorIbs.toFixed(2) + " | Retencao CBS RFB (" + aliquotaCbsPercent + "%): R$ " + valorCbs.toFixed(2) + " | Credito Financeiro Adquirente: R$ " + totalRetido.toFixed(2) + " liberado instantaneamente.";

  return Ok({
    chaveAcessoNfe,
    valorTotalFaturaBrl,
    valorLiquidoFornecedorBrl: liquidoFornecedor,
    retencaoIbsComiteGestorBrl: valorIbs,
    retencaoCbsReceitaFederalBrl: valorCbs,
    totalTributosRetidosSplitBrl: totalRetido,
    statusSplitPayment: 'SPLIT_LIQUIDADO_INSTANTANEAMENTE_BACEN',
    codigoLiquidacaoBacenPix: codBacen,
    creditoFinanceiroImediatoAdquirenteBrl: totalRetido,
    diagnosticoSplitPayment: diag
  });
}
