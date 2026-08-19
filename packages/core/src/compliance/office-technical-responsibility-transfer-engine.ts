import { Result, Ok, Err } from '../types/result.js';

export interface TechnicalTransferInput {
  clienteCnpj: string;
  razaoSocialCliente: string;
  contadorAnteriorNome: string;
  contadorAnteriorCrc: string;
  novoContadorNome: string;
  novoContadorCrc: string;
  dataEfetivacaoTransferencia: string;
  itensInventarioEntregues: string[]; // Ex: ['Livros Diários 2023-2025', 'Arquivos SPED Fiscal', 'Certificado Digital A1']
}

export interface TechnicalTransferResult {
  clienteCnpj: string;
  razaoSocialCliente: string;
  totalItensInventariados: number;
  dataEfetivacaoTransferencia: string;
  termoEmitidoComSucesso: boolean;
  statusTransferencia: 'TRANSFERENCIA_RESPONSABILIDADE_TECNICA_CONCLUIDA';
  diagnosticoTransferencia: string;
}

export function processOfficeTechnicalResponsibilityTransferEngine(input: TechnicalTransferInput): Result<TechnicalTransferResult, Error> {
  const {
    clienteCnpj,
    razaoSocialCliente,
    contadorAnteriorNome,
    contadorAnteriorCrc,
    novoContadorNome,
    novoContadorCrc,
    dataEfetivacaoTransferencia,
    itensInventarioEntregues
  } = input;

  if (!clienteCnpj || !contadorAnteriorCrc || !novoContadorCrc || !itensInventarioEntregues || itensInventarioEntregues.length === 0) {
    return Err(new Error('CNPJ, dados dos contadores e inventário de documentos são obrigatórios.'));
  }

  const diag = "Termo de Transferencia Tecnica (" + razaoSocialCliente + "): Transicao formal de " + contadorAnteriorNome + " (" + contadorAnteriorCrc + ") para " + novoContadorNome + " (" + novoContadorCrc + ") | " + itensInventarioEntregues.length + " itens de acervo contábil e fiscal entregues e protocolados em " + dataEfetivacaoTransferencia + ".";

  return Ok({
    clienteCnpj,
    razaoSocialCliente,
    totalItensInventariados: itensInventarioEntregues.length,
    dataEfetivacaoTransferencia,
    termoEmitidoComSucesso: true,
    statusTransferencia: 'TRANSFERENCIA_RESPONSABILIDADE_TECNICA_CONCLUIDA',
    diagnosticoTransferencia: diag
  });
}
