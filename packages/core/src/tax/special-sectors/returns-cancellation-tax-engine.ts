import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ReturnType = 'DEVOLUCAO_VENDA_CLIENTE_CONTRIBUINTE' | 'DEVOLUCAO_VENDA_NAO_CONTRIBUINTE' | 'DEVOLUCAO_COMPRA_FORNECEDOR';

export interface ReturnOperationInput {
  devolucaoId: string;
  tipoDevolucao: ReturnType;
  parceiroNome: string;
  valorMercadoriasDevolvidasBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaIpiPercent: number;  // Ex: 10%
  aliquotaPisPercent: number;  // Ex: 1.65%
  aliquotaCofinsPercent: number; // Ex: 7.60%
  custoEstoqueMercadoriaBrl: number;
}

export interface ReturnOperationResult {
  devolucaoId: string;
  tipoDevolucao: ReturnType;
  cfopUtilizado: string;
  documentoFiscalEmitido: string;
  tributosRecuperadosOuEstornados: {
    icmsCreditoOuEstornoBrl: number;
    ipiCreditoOuEstornoBrl: number;
    pisCreditoBrl: number;
    cofinsCreditoBrl: number;
    totalRecuperacaoTributariaBrl: number;
  };
  partidasDobradaDevolucao: JournalEntryLine[];
  diagnosticoDevolucao: string;
}

export function processReturnAndCancellationTaxEngine(input: ReturnOperationInput): Result<ReturnOperationResult, Error> {
  const {
    devolucaoId,
    tipoDevolucao,
    parceiroNome,
    valorMercadoriasDevolvidasBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent,
    aliquotaPisPercent,
    aliquotaCofinsPercent,
    custoEstoqueMercadoriaBrl
  } = input;

  if (valorMercadoriasDevolvidasBrl <= 0) {
    return Err(new Error('Valor das mercadorias devolvidas deve ser superior a zero.'));
  }

  const icms = Number((valorMercadoriasDevolvidasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
  const ipi = Number((valorMercadoriasDevolvidasBrl * (aliquotaIpiPercent / 100)).toFixed(2));
  const pis = Number((valorMercadoriasDevolvidasBrl * (aliquotaPisPercent / 100)).toFixed(2));
  const cofins = Number((valorMercadoriasDevolvidasBrl * (aliquotaCofinsPercent / 100)).toFixed(2));
  const totalRecuperado = Number((icms + ipi + pis + cofins).toFixed(2));

  let cfop = '1.202';
  let docTipo = 'NF-e de Devolução emitida pelo Cliente Contribuinte';
  const partidas: JournalEntryLine[] = [];

  if (tipoDevolucao === 'DEVOLUCAO_VENDA_CLIENTE_CONTRIBUINTE') {
    cfop = '1.202';
    docTipo = 'NF-e de Devolução emitida pelo Cliente Contribuinte';

    // D: Devolução de Vendas (Redutora da Receita Bruta)
    partidas.push({
      accountId: '3.1.1.09',
      accountCode: '3.1.1.09',
      accountName: 'Devoluções e Abatimentos de Vendas (Resultado - CPC 47)',
      type: 'DEBIT',
      amount: valorMercadoriasDevolvidasBrl
    });
    // C: Clientes a Receber (Ativo Circulante)
    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes a Receber (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorMercadoriasDevolvidasBrl
    });
    // Reincorporação do estoque: D: Estoques / C: CPV
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias (Ativo Circulante)',
      type: 'DEBIT',
      amount: custoEstoqueMercadoriaBrl
    });
    partidas.push({
      accountId: '3.1.2.01',
      accountCode: '3.1.2.01',
      accountName: 'Custo das Mercadorias Vendidas - Estorno CPV (Resultado - CPC 16)',
      type: 'CREDIT',
      amount: custoEstoqueMercadoriaBrl
    });
  } else if (tipoDevolucao === 'DEVOLUCAO_VENDA_NAO_CONTRIBUINTE') {
    cfop = '1.201';
    docTipo = 'NF-e de Entrada própria emitida pelo Vendedor (Art. 453 RICMS)';

    partidas.push({
      accountId: '3.1.1.09',
      accountCode: '3.1.1.09',
      accountName: 'Devoluções de Vendas de Não Contribuinte (Resultado - CPC 47)',
      type: 'DEBIT',
      amount: valorMercadoriasDevolvidasBrl
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento / Reembolso ao Cliente (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorMercadoriasDevolvidasBrl
    });
  } else {
    // Devolução de Compra ao Fornecedor (CFOP 5.202)
    cfop = '5.202';
    docTipo = 'NF-e de Devolução de Compra emitida pelo Adquirente';

    partidas.push({
      accountId: '2.1.2.01',
      accountCode: '2.1.2.01',
      accountName: 'Fornecedores a Pagar (Passivo Circulante)',
      type: 'DEBIT',
      amount: valorMercadoriasDevolvidasBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorMercadoriasDevolvidasBrl
    });
  }

  const diag = 'Devolução Fiscal (' + tipoDevolucao + ' - ' + docTipo + '): CFOP ' + cfop + ' referente a ' + parceiroNome + '. Valor total devolvido: R$ ' + valorMercadoriasDevolvidasBrl.toFixed(2) + '. Crédito/Recuperação de Tributos: R$ ' + totalRecuperado.toFixed(2) + ' (ICMS: R$ ' + icms.toFixed(2) + ', IPI: R$ ' + ipi.toFixed(2) + ', PIS: R$ ' + pis.toFixed(2) + ', COFINS: R$ ' + cofins.toFixed(2) + '). Reincorporação ao estoque e estorno de CPV efetivados.';

  return Ok({
    devolucaoId,
    tipoDevolucao,
    cfopUtilizado: cfop,
    documentoFiscalEmitido: docTipo,
    tributosRecuperadosOuEstornados: {
      icmsCreditoOuEstornoBrl: icms,
      ipiCreditoOuEstornoBrl: ipi,
      pisCreditoBrl: pis,
      cofinsCreditoBrl: cofins,
      totalRecuperacaoTributariaBrl: totalRecuperado
    },
    partidasDobradaDevolucao: partidas,
    diagnosticoDevolucao: diag
  });
}
