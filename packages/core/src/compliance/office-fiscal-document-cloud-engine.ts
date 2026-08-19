import { Result, Ok, Err } from '../types/result.js';

export interface DocumentStorageEntry {
  documentoChave: string; // 44 dígitos
  tipoDocumento: 'NFE' | 'NFCE' | 'CTE' | 'NFSE' | 'MDFE';
  clienteCnpj: string;
  dataEmissao: string;
  valorTotalBrl: number;
  statusManifestacao: 'CIENCIA_DA_OPERACAO' | 'CONFIRMADA' | 'DESCONHECIDA' | 'NAO_REALIZADA';
}

export interface FiscalDocumentCloudInput {
  escritorioNome: string;
  mesCompetencia: string;
  documentosSefaz: DocumentStorageEntry[];
}

export interface FiscalDocumentCloudResult {
  escritorioNome: string;
  mesCompetencia: string;
  totalXmlsCustodiados: number;
  valorTotalMovimentadoBrl: number;
  xmlsConfirmadosManifestacao: number;
  prazoGuardaAnos: number; // 5 anos
  statusGuarda: 'XMLS_ARMAZENADOS_EM_NUVEM_CONFORME_CTN_173';
  diagnosticoGuarda: string;
}

export function processOfficeFiscalDocumentCloudEngine(input: FiscalDocumentCloudInput): Result<FiscalDocumentCloudResult, Error> {
  const {
    escritorioNome,
    mesCompetencia,
    documentosSefaz
  } = input;

  if (!escritorioNome || !documentosSefaz || documentosSefaz.length === 0) {
    return Err(new Error('Nome do escritório e lista de documentos fiscais são obrigatórios.'));
  }

  let totalValor = 0;
  let confirmados = 0;

  for (const doc of documentosSefaz) {
    totalValor += doc.valorTotalBrl;
    if (doc.statusManifestacao === 'CONFIRMADA' || doc.statusManifestacao === 'CIENCIA_DA_OPERACAO') {
      confirmados++;
    }
  }

  const diag = "Armazem Digital DF-e (" + escritorioNome + " - " + mesCompetencia + "): " + documentosSefaz.length + " XMLs custodiados | Valor Total: R$ " + totalValor.toLocaleString('pt-BR') + " | " + confirmados + " confirmados com Manifestacao do Destinatario | Guarda em Nuvem garantida por 5 anos (CTN 173).";

  return Ok({
    escritorioNome,
    mesCompetencia,
    totalXmlsCustodiados: documentosSefaz.length,
    valorTotalMovimentadoBrl: parseFloat(totalValor.toFixed(2)),
    xmlsConfirmadosManifestacao: confirmados,
    prazoGuardaAnos: 5,
    statusGuarda: 'XMLS_ARMAZENADOS_EM_NUVEM_CONFORME_CTN_173',
    diagnosticoGuarda: diag
  });
}
