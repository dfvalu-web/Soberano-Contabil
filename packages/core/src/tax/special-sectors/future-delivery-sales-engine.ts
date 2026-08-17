import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type DeliveryStageType = 'SIMPLES_FATURAMENTO' | 'REMESSA_EFETIVA_ENTREGA';

export interface FutureDeliveryInput {
  vendaId: string;
  etapa: DeliveryStageType;
  clienteNome: string;
  valorTotalMercadoriaBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaIpiPercent: number;  // Ex: 10%
  aliquotaPisPercent: number;  // Ex: 1.65%
  aliquotaCofinsPercent: number; // Ex: 7.60%
  custoDasMercadoriasVendidasBrl?: number; // Para baixa de estoque na entrega efetiva
}

export interface FutureDeliveryResult {
  vendaId: string;
  etapa: DeliveryStageType;
  cfopUtilizado: string;
  valorTotalBrl: number;
  tributosDestacados: {
    icmsDestacadoBrl: number;
    ipiDestacadoBrl: number;
    pisDevidoBrl: number;
    cofinsDevidoBrl: number;
    totalTributosBrl: number;
  };
  partidasDobradaFaturamento: JournalEntryLine[];
  diagnosticoSinief: string;
}

export function processFutureDeliverySalesEngine(input: FutureDeliveryInput): Result<FutureDeliveryResult, Error> {
  const {
    vendaId,
    etapa,
    clienteNome,
    valorTotalMercadoriaBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent,
    aliquotaPisPercent,
    aliquotaCofinsPercent,
    custoDasMercadoriasVendidasBrl = 0
  } = input;

  if (valorTotalMercadoriaBrl <= 0) {
    return Err(new Error('Valor da mercadoria na venda para entrega futura deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (etapa === 'SIMPLES_FATURAMENTO') {
    // CFOP 5.922 / 6.922: Lançamento de Simples Faturamento decorrente de venda para entrega futura
    // Não há destaque de ICMS nem IPI (Ajuste SINIEF 01/2003)
    // Contabilmente: D: Clientes a Receber / C: Adiantamento de Clientes (Passivo Circulante - CPC 47)
    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Contas a Receber de Clientes (Ativo Circulante - SINIEF 01/03)',
      type: 'DEBIT',
      amount: valorTotalMercadoriaBrl
    });
    partidas.push({
      accountId: '2.1.3.01',
      accountCode: '2.1.3.01',
      accountName: 'Adiantamento de Clientes por Faturamento Antecipado (Passivo Circulante - CPC 47)',
      type: 'CREDIT',
      amount: valorTotalMercadoriaBrl
    });

    const diag = 'Ajuste SINIEF nº 01/2003 & CPC 47: Simples Faturamento (CFOP 5.922) para ' + clienteNome + ' no valor de R$ ' + valorTotalMercadoriaBrl.toFixed(2) + '. Sem destaque de ICMS e IPI. Reconhecido Adiantamento de Clientes no Passivo Circulante.';

    return Ok({
      vendaId,
      etapa,
      cfopUtilizado: '5.922',
      valorTotalBrl: valorTotalMercadoriaBrl,
      tributosDestacados: {
        icmsDestacadoBrl: 0,
        ipiDestacadoBrl: 0,
        pisDevidoBrl: 0,
        cofinsDevidoBrl: 0,
        totalTributosBrl: 0
      },
      partidasDobradaFaturamento: partidas,
      diagnosticoSinief: diag
    });
  } else {
    // CFOP 5.116 / 5.117: Remessa de mercadoria originada de venda para entrega futura
    // Destaque integral de ICMS e IPI na NF-e de saída física
    const icms = Number((valorTotalMercadoriaBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
    const ipi = Number((valorTotalMercadoriaBrl * (aliquotaIpiPercent / 100)).toFixed(2));
    const pis = Number((valorTotalMercadoriaBrl * (aliquotaPisPercent / 100)).toFixed(2));
    const cofins = Number((valorTotalMercadoriaBrl * (aliquotaCofinsPercent / 100)).toFixed(2));
    const totalTrib = Number((icms + ipi + pis + cofins).toFixed(2));

    // 1. Baixa do Adiantamento de Clientes para Receita de Vendas
    partidas.push({
      accountId: '2.1.3.01',
      accountCode: '2.1.3.01',
      accountName: 'Adiantamento de Clientes por Faturamento Antecipado (Passivo Circulante - CPC 47)',
      type: 'DEBIT',
      amount: valorTotalMercadoriaBrl
    });
    partidas.push({
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Receita Bruta de Vendas (Resultado - CPC 47)',
      type: 'CREDIT',
      amount: valorTotalMercadoriaBrl
    });

    // 2. Baixa do Estoque para CPV
    if (custoDasMercadoriasVendidasBrl > 0) {
      partidas.push({
        accountId: '3.1.2.01',
        accountCode: '3.1.2.01',
        accountName: 'Custo das Mercadorias Vendidas - CPV (Resultado - CPC 16)',
        type: 'DEBIT',
        amount: custoDasMercadoriasVendidasBrl
      });
      partidas.push({
        accountId: '1.1.4.01',
        accountCode: '1.1.4.01',
        accountName: 'Estoques de Produtos Acabados (Ativo Circulante - CPC 16)',
        type: 'CREDIT',
        amount: custoDasMercadoriasVendidasBrl
      });
    }

    const diag = 'Ajuste SINIEF nº 01/2003 & CPC 47: Remessa Efetiva (CFOP 5.116) para ' + clienteNome + '. Destaque de ICMS (R$ ' + icms.toFixed(2) + '), IPI (R$ ' + ipi.toFixed(2) + '), PIS/COFINS (R$ ' + (pis + cofins).toFixed(2) + '). Reconhecida Receita Bruta e baixado estoque no CPV.';

    return Ok({
      vendaId,
      etapa,
      cfopUtilizado: '5.116',
      valorTotalBrl: valorTotalMercadoriaBrl,
      tributosDestacados: {
        icmsDestacadoBrl: icms,
        ipiDestacadoBrl: ipi,
        pisDevidoBrl: pis,
        cofinsDevidoBrl: cofins,
        totalTributosBrl: totalTrib
      },
      partidasDobradaFaturamento: partidas,
      diagnosticoSinief: diag
    });
  }
}
