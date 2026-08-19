import { Result, Ok, Err } from '../types/result.js';

export interface DdaBoletoItem {
  codigoBarras: string;
  cnpjCedente: string;
  nomeCedente: string;
  valorBoletoBrl: number;
  dataVencimento: string; // YYYY-MM-DD
}

export interface NfeEntradaItem {
  chaveAcessoNfe: string;
  cnpjEmitente: string;
  nomeEmitente: string;
  valorDuplicataBrl: number;
  dataVencimento: string; // YYYY-MM-DD
}

export interface DdaMatchingInput {
  clienteCnpj: string;
  razaoSocial: string;
  listaBoletosDda: DdaBoletoItem[];
  listaNfeEntrada: NfeEntradaItem[];
}

export interface DdaMatchedItem {
  codigoBarras: string;
  nomeCedente: string;
  valorBrl: number;
  dataVencimento: string;
  chaveAcessoNfeVinculada?: string;
  statusCasamento: 'CASADO_COM_NFE' | 'ALERTA_BOLETO_SEM_NOTA_FISCAL';
}

export interface DdaMatchingResult {
  clienteCnpj: string;
  razaoSocial: string;
  totalBoletosDdaLidos: number;
  totalBoletosCasadosComNfe: number;
  totalBoletosSemNotaFiscal: number;
  itensProcessados: DdaMatchedItem[];
  statusProcessamento: 'DDA_CONCILIADO_COM_SUCESSO';
  diagnosticoDda: string;
}

export function processOfficeDdaBankingNfeCrossmatchingEngine(input: DdaMatchingInput): Result<DdaMatchingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    listaBoletosDda,
    listaNfeEntrada
  } = input;

  if (!clienteCnpj || !listaBoletosDda) {
    return Err(new Error('CNPJ do cliente e lista de boletos DDA são obrigatórios.'));
  }

  const itensProcessados: DdaMatchedItem[] = [];
  let casadosCount = 0;
  let semNfeCount = 0;

  for (const bol of listaBoletosDda) {
    const nfeMatch = listaNfeEntrada.find(n => 
      n.cnpjEmitente === bol.cnpjCedente && 
      Math.abs(n.valorDuplicataBrl - bol.valorBoletoBrl) < 0.05
    );

    if (nfeMatch) {
      casadosCount++;
      itensProcessados.push({
        codigoBarras: bol.codigoBarras,
        nomeCedente: bol.nomeCedente,
        valorBrl: bol.valorBoletoBrl,
        dataVencimento: bol.dataVencimento,
        chaveAcessoNfeVinculada: nfeMatch.chaveAcessoNfe,
        statusCasamento: 'CASADO_COM_NFE'
      });
    } else {
      semNfeCount++;
      itensProcessados.push({
        codigoBarras: bol.codigoBarras,
        nomeCedente: bol.nomeCedente,
        valorBrl: bol.valorBoletoBrl,
        dataVencimento: bol.dataVencimento,
        statusCasamento: 'ALERTA_BOLETO_SEM_NOTA_FISCAL'
      });
    }
  }

  const diag = "DDA Bancário (" + razaoSocial + "): " + listaBoletosDda.length + " boletos lidos | " + casadosCount + " amparados por NF-e | " + semNfeCount + " alertas de cobrança sem nota fiscal emitida.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    totalBoletosDdaLidos: listaBoletosDda.length,
    totalBoletosCasadosComNfe: casadosCount,
    totalBoletosSemNotaFiscal: semNfeCount,
    itensProcessados,
    statusProcessamento: 'DDA_CONCILIADO_COM_SUCESSO',
    diagnosticoDda: diag
  });
}
