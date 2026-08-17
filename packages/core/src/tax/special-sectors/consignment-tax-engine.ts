import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type ConsignmentStageType = 'REMESSA_EM_CONSIGNACAO' | 'VENDA_EFETIVA_MERCADORIA_CONSIGNADA' | 'DEVOLUCAO_CONSIGNACAO';

export interface ConsignmentOperationInput {
  operacaoId: string;
  etapa: ConsignmentStageType;
  clienteConsignatarioNome: string;
  valorMercadoriasBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaIpiPercent: number;  // Ex: 10%
  aliquotaPisPercent: number;  // Ex: 1.65%
  aliquotaCofinsPercent: number; // Ex: 7.60%
  custoEstoqueBrl?: number;
}

export interface ConsignmentOperationResult {
  operacaoId: string;
  etapa: ConsignmentStageType;
  cfopUtilizado: string;
  valorTotalBrl: number;
  tributosDestacados: {
    icmsDestacadoBrl: number;
    ipiDestacadoBrl: number;
    pisDevidoBrl: number;
    cofinsDevidoBrl: number;
    totalTributosBrl: number;
  };
  partidasDobradaConsignacao: JournalEntryLine[];
  diagnosticoConsignacao: string;
}

export function processConsignmentOperation(input: ConsignmentOperationInput): Result<ConsignmentOperationResult, Error> {
  const {
    operacaoId,
    etapa,
    clienteConsignatarioNome,
    valorMercadoriasBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent,
    aliquotaPisPercent,
    aliquotaCofinsPercent,
    custoEstoqueBrl = 0
  } = input;

  if (valorMercadoriasBrl <= 0) {
    return Err(new Error('Valor das mercadorias na consignação deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (etapa === 'REMESSA_EM_CONSIGNACAO') {
    // CFOP 5.917 / 6.917: Remessa de mercadoria em consignação mercantil ou industrial
    // Destaque de ICMS e IPI. Sem incidência de PIS/COFINS (não há faturamento)
    const icms = Number((valorMercadoriasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
    const ipi = Number((valorMercadoriasBrl * (aliquotaIpiPercent / 100)).toFixed(2));

    partidas.push({
      accountId: '1.1.4.08',
      accountCode: '1.1.4.08',
      accountName: 'Estoques de Mercadorias em Poder de Terceiros / Consignação (Ativo Circulante)',
      type: 'DEBIT',
      amount: custoEstoqueBrl > 0 ? custoEstoqueBrl : valorMercadoriasBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueBrl > 0 ? custoEstoqueBrl : valorMercadoriasBrl
    });

    const diag = 'Consignação Mercantil (Art. 465 RICMS): Remessa em Consignação (CFOP 5.917) para ' + clienteConsignatarioNome + '. Destaque de ICMS de R$ ' + icms.toFixed(2) + ' e IPI de R$ ' + ipi.toFixed(2) + '. Transferido estoque para poder de terceiros.';

    return Ok({
      operacaoId,
      etapa,
      cfopUtilizado: '5.917',
      valorTotalBrl: valorMercadoriasBrl,
      tributosDestacados: {
        icmsDestacadoBrl: icms,
        ipiDestacadoBrl: ipi,
        pisDevidoBrl: 0,
        cofinsDevidoBrl: 0,
        totalTributosBrl: Number((icms + ipi).toFixed(2))
      },
      partidasDobradaConsignacao: partidas,
      diagnosticoConsignacao: diag
    });
  } else if (etapa === 'VENDA_EFETIVA_MERCADORIA_CONSIGNADA') {
    // CFOP 5.115 / 6.115: Venda de mercadoria adquirida ou recebida anteriormente em consignação
    // Incidência de PIS/COFINS e IRPJ/CSLL sobre a receita de vendas
    const pis = Number((valorMercadoriasBrl * (aliquotaPisPercent / 100)).toFixed(2));
    const cofins = Number((valorMercadoriasBrl * (aliquotaCofinsPercent / 100)).toFixed(2));

    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes a Receber (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorMercadoriasBrl
    });
    partidas.push({
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Receita de Venda de Mercadoria Consignada (Resultado - CPC 47)',
      type: 'CREDIT',
      amount: valorMercadoriasBrl
    });

    if (custoEstoqueBrl > 0) {
      partidas.push({
        accountId: '3.1.2.01',
        accountCode: '3.1.2.01',
        accountName: 'Custo das Mercadorias Vendidas - CPV (Resultado - CPC 16)',
        type: 'DEBIT',
        amount: custoEstoqueBrl
      });
      partidas.push({
        accountId: '1.1.4.08',
        accountCode: '1.1.4.08',
        accountName: 'Estoques de Mercadorias em Poder de Terceiros / Consignação (Ativo Circulante)',
        type: 'CREDIT',
        amount: custoEstoqueBrl
      });
    }

    const diag = 'Consignação Mercantil (Art. 465 RICMS): Venda Definitiva (CFOP 5.115) para ' + clienteConsignatarioNome + '. Apuração de PIS/COFINS (R$ ' + (pis + cofins).toFixed(2) + '), reconhecimento de Receita e baixa de CPV.';

    return Ok({
      operacaoId,
      etapa,
      cfopUtilizado: '5.115',
      valorTotalBrl: valorMercadoriasBrl,
      tributosDestacados: {
        icmsDestacadoBrl: 0, // ICMS já tributado na remessa
        ipiDestacadoBrl: 0,
        pisDevidoBrl: pis,
        cofinsDevidoBrl: cofins,
        totalTributosBrl: Number((pis + cofins).toFixed(2))
      },
      partidasDobradaConsignacao: partidas,
      diagnosticoConsignacao: diag
    });
  } else {
    // Devolução de Consignação (CFOP 5.918 / 6.918)
    const icms = Number((valorMercadoriasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
    const ipi = Number((valorMercadoriasBrl * (aliquotaIpiPercent / 100)).toFixed(2));

    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'DEBIT',
      amount: custoEstoqueBrl > 0 ? custoEstoqueBrl : valorMercadoriasBrl
    });
    partidas.push({
      accountId: '1.1.4.08',
      accountCode: '1.1.4.08',
      accountName: 'Estoques de Mercadorias em Poder de Terceiros / Consignação (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueBrl > 0 ? custoEstoqueBrl : valorMercadoriasBrl
    });

    const diag = 'Consignação Mercantil (Art. 465 RICMS): Devolução de Mercadoria Consignada (CFOP 5.918) por ' + clienteConsignatarioNome + '. Retorno do estoque próprio e estorno de créditos/débitos fiscais.';

    return Ok({
      operacaoId,
      etapa,
      cfopUtilizado: '5.918',
      valorTotalBrl: valorMercadoriasBrl,
      tributosDestacados: {
        icmsDestacadoBrl: icms,
        ipiDestacadoBrl: ipi,
        pisDevidoBrl: 0,
        cofinsDevidoBrl: 0,
        totalTributosBrl: Number((icms + ipi).toFixed(2))
      },
      partidasDobradaConsignacao: partidas,
      diagnosticoConsignacao: diag
    });
  }
}
