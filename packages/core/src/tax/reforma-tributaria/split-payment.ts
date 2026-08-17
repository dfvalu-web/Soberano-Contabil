import { Result, Ok, Err } from '../../types/result.js';

export interface SplitPaymentTransaction {
  idTransacao: string;
  chaveDfe: string;
  valorTotalFatura: number;
  valorCbsDevido: number;
  valorIbsDevido: number;
  valorImpostoSeletivoDevido?: number;
  dadosBancariosFornecedor: {
    banco: string;
    agencia: string;
    conta: string;
    chavePix?: string;
  };
}

export interface SplitPaymentSettlement {
  idTransacao: string;
  chaveDfe: string;
  valorBrutoFatura: number;
  retencaoCbsFederal: number;
  retencaoIbsEstadualMunicipal: number;
  retencaoImpostoSeletivo: number;
  totalTributosRetidosImediatamente: number;
  valorLiquidoCreditadoFornecedor: number;
  comprovanteLiquidacaoSefaz: {
    protocoloSplitPayment: string;
    autenticacaoBancaria: string;
    dataHoraLiquidacao: string;
    status: 'LIQUIDADO_COM_SUCESSO' | 'PENDENTE' | 'FALHA_CONCILIACAO';
  };
}

export function executeSplitPaymentSettlement(
  transaction: SplitPaymentTransaction
): Result<SplitPaymentSettlement, Error> {
  const { valorTotalFatura, valorCbsDevido, valorIbsDevido, valorImpostoSeletivoDevido = 0 } = transaction;

  if (valorTotalFatura <= 0) {
    return Err(new Error('Valor total da fatura deve ser maior que zero.'));
  }

  const totalTributosRetidos = Number((valorCbsDevido + valorIbsDevido + valorImpostoSeletivoDevido).toFixed(2));
  if (totalTributosRetidos >= valorTotalFatura) {
    return Err(new Error('Total de tributos retidos nao pode exceder o valor total da fatura.'));
  }

  const valorLiquidoCreditadoFornecedor = Number((valorTotalFatura - totalTributosRetidos).toFixed(2));
  const dataHoraLiquidacao = new Date().toISOString();

  return Ok({
    idTransacao: transaction.idTransacao,
    chaveDfe: transaction.chaveDfe,
    valorBrutoFatura: valorTotalFatura,
    retencaoCbsFederal: valorCbsDevido,
    retencaoIbsEstadualMunicipal: valorIbsDevido,
    retencaoImpostoSeletivo: valorImpostoSeletivoDevido,
    totalTributosRetidosImediatamente: totalTributosRetidos,
    valorLiquidoCreditadoFornecedor,
    comprovanteLiquidacaoSefaz: {
      protocoloSplitPayment: 'SP-SEFAZ-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
      autenticacaoBancaria: 'AUTH-BACEN-' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      dataHoraLiquidacao,
      status: 'LIQUIDADO_COM_SUCESSO'
    }
  });
}
