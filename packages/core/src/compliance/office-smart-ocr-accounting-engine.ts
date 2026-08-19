import { Result, Ok, Err } from '../types/result.js';

export interface OcrReceiptEntry {
  reciboId: string;
  tipoDocumento: 'COMPROVANTE_PAGAMENTO_PDF' | 'RECIBO_ALUGUEL' | 'FATURA_ENERGIA_AGUA' | 'CUPOM_FISCAL_IMAGEM';
  fornecedorNome: string;
  fornecedorCnpj: string;
  dataDocumento: string;
  valorTotalBrl: number;
  contaContabilDebitoSugerida: string; // Ex: '3.1.01.02 - Despesas com Energia Elétrica'
  contaContabilCreditoSugerida: string; // Ex: '1.1.01.02 - Banco Itaú C/C'
  confiancaIaPercent: number; // Ex: 99.4%
}

export interface SmartOcrAccountingInput {
  clienteCnpj: string;
  loteComprovantesOcr: OcrReceiptEntry[];
}

export interface SmartOcrAccountingResult {
  clienteCnpj: string;
  totalComprovantesProcessados: number;
  totalValorClassificadoBrl: number;
  mediaConfiancaIaPercent: number;
  totalLancamentosPreClassificados: number;
  statusProcessamento: 'OCR_IA_PROCESSADO_E_CLASSIFICADO_PLANO_CONTAS';
  diagnosticoOcr: string;
}

export function processOfficeSmartOcrAccountingEngine(input: SmartOcrAccountingInput): Result<SmartOcrAccountingResult, Error> {
  const {
    clienteCnpj,
    loteComprovantesOcr
  } = input;

  if (!clienteCnpj || !loteComprovantesOcr || loteComprovantesOcr.length === 0) {
    return Err(new Error('CNPJ do cliente e lote de comprovantes para OCR são obrigatórios.'));
  }

  let totalValor = 0;
  let somaConfianca = 0;

  for (const c of loteComprovantesOcr) {
    totalValor += c.valorTotalBrl;
    somaConfianca += c.confiancaIaPercent;
  }

  const mediaConfianca = somaConfianca / loteComprovantesOcr.length;
  const lancamentos = loteComprovantesOcr.length * 2; // Partidas dobradas

  const diag = "Robo OCR com IA (" + clienteCnpj + "): " + loteComprovantesOcr.length + " comprovantes/faturas lidos | Total: R$ " + totalValor.toLocaleString('pt-BR') + " | Acuracia Media IA: " + mediaConfianca.toFixed(1) + "% | " + lancamentos + " partidas dobradas classificadas automaticamente.";

  return Ok({
    clienteCnpj,
    totalComprovantesProcessados: loteComprovantesOcr.length,
    totalValorClassificadoBrl: parseFloat(totalValor.toFixed(2)),
    mediaConfiancaIaPercent: parseFloat(mediaConfianca.toFixed(1)),
    totalLancamentosPreClassificados: lancamentos,
    statusProcessamento: 'OCR_IA_PROCESSADO_E_CLASSIFICADO_PLANO_CONTAS',
    diagnosticoOcr: diag
  });
}
