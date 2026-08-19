import { Result, Ok, Err } from '../types/result.js';

export interface DocumentItemInput {
  nomeArquivo: string;
  formatoExtensao: 'XML' | 'OFX' | 'PDF';
  tipoDocumentoDetectado: 'NFE_MERCADORIAS' | 'NFSE_SERVICOS' | 'CTE_TRANSPORTE' | 'OFX_EXTRATO_BANCARIO' | 'PDF_FATURA_COMPROVANTE';
  valorTotalDocumentoBrl: number;
}

export interface UniversalDropzoneInput {
  escritorioCnpj: string;
  clienteCnpj: string;
  clienteRazaoSocial: string;
  competenciaMesAno: string;
  listaDocumentos: DocumentItemInput[];
}

export interface UniversalDropzoneResult {
  clienteRazaoSocial: string;
  competenciaMesAno: string;
  quantidadeTotalDocumentosProcessadosCount: number;
  totalNfeMercadoriasBrl: number;
  totalNfseServicosBrl: number;
  totalCteTransporteBrl: number;
  totalOfxBancarioBrl: number;
  totalPdfComprovantesBrl: number;
  valorTotalGlobalMovimentadoBrl: number;
  statusProcessamento: 'LOTE_MULTI_DOCUMENTOS_PROCESSADO_COM_SUCESSO';
  diagnosticoDropzone: string;
}

export function processOfficeUniversalDropzoneOcrEngine(input: UniversalDropzoneInput): Result<UniversalDropzoneResult, Error> {
  const {
    escritorioCnpj,
    clienteCnpj,
    clienteRazaoSocial,
    competenciaMesAno,
    listaDocumentos
  } = input;

  if (!escritorioCnpj || !clienteCnpj || !listaDocumentos || listaDocumentos.length === 0) {
    return Err(new Error('CNPJ do escritório, do cliente e lista de documentos para processamento são obrigatórios.'));
  }

  let totNfe = 0.0;
  let totNfse = 0.0;
  let totCte = 0.0;
  let totOfx = 0.0;
  let totPdf = 0.0;

  for (const doc of listaDocumentos) {
    switch (doc.tipoDocumentoDetectado) {
      case 'NFE_MERCADORIAS':
        totNfe += doc.valorTotalDocumentoBrl;
        break;
      case 'NFSE_SERVICOS':
        totNfse += doc.valorTotalDocumentoBrl;
        break;
      case 'CTE_TRANSPORTE':
        totCte += doc.valorTotalDocumentoBrl;
        break;
      case 'OFX_EXTRATO_BANCARIO':
        totOfx += doc.valorTotalDocumentoBrl;
        break;
      case 'PDF_FATURA_COMPROVANTE':
        totPdf += doc.valorTotalDocumentoBrl;
        break;
    }
  }

  const globalTotal = totNfe + totNfse + totCte + totOfx + totPdf;

  const diag = "Dropzone Universal Multi-Documentos (" + clienteRazaoSocial + " - " + competenciaMesAno + "): Processados " + listaDocumentos.length + " arquivos | NF-e: R$ " + totNfe.toFixed(2) + " | NFS-e: R$ " + totNfse.toFixed(2) + " | CT-e: R$ " + totCte.toFixed(2) + " | OFX: R$ " + totOfx.toFixed(2) + " | Total Global: R$ " + globalTotal.toFixed(2) + " pronto para auto-classificação contábil.";

  return Ok({
    clienteRazaoSocial,
    competenciaMesAno,
    quantidadeTotalDocumentosProcessadosCount: listaDocumentos.length,
    totalNfeMercadoriasBrl: parseFloat(totNfe.toFixed(2)),
    totalNfseServicosBrl: parseFloat(totNfse.toFixed(2)),
    totalCteTransporteBrl: parseFloat(totCte.toFixed(2)),
    totalOfxBancarioBrl: parseFloat(totOfx.toFixed(2)),
    totalPdfComprovantesBrl: parseFloat(totPdf.toFixed(2)),
    valorTotalGlobalMovimentadoBrl: parseFloat(globalTotal.toFixed(2)),
    statusProcessamento: 'LOTE_MULTI_DOCUMENTOS_PROCESSADO_COM_SUCESSO',
    diagnosticoDropzone: diag
  });
}
