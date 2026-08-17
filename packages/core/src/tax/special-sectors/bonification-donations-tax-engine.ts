import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type BonificationType = 'BONIFICACAO_MERCADORIAS_VINCULADA' | 'AMOSTRA_GRATIS' | 'BRINDES_DISTRIBUICAO' | 'DOACAO_INSTITUICAO_BENEFICENTE';

export interface BonificationOperationInput {
  operacaoId: string;
  tipoOperacao: BonificationType;
  destinatarioNome: string;
  valorMercadoriasBrl: number;
  custoEstoqueMercadoriaBrl: number;
  aliquotaIcmsPercent: number; // Ex: 18%
  aliquotaIpiPercent: number;  // Ex: 10%
}

export interface BonificationOperationResult {
  operacaoId: string;
  tipoOperacao: BonificationType;
  cfopUtilizado: string;
  tributosIncidentes: {
    icmsDevidoBrl: number;
    ipiDevidoBrl: number;
    pisExcluidoCompulsoriamenteTema1050StjBrl: number;
    cofinsExcluidaCompulsoriamenteTema1050StjBrl: number;
    totalTributosDevidosBrl: number;
  };
  partidasDobradaOperacao: JournalEntryLine[];
  diagnosticoFiscal: string;
}

export function processBonificationAndDonationTaxEngine(input: BonificationOperationInput): Result<BonificationOperationResult, Error> {
  const {
    operacaoId,
    tipoOperacao,
    destinatarioNome,
    valorMercadoriasBrl,
    custoEstoqueMercadoriaBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent
  } = input;

  if (valorMercadoriasBrl <= 0) {
    return Err(new Error('Valor das mercadorias na bonificação/doação deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];
  let cfop = '5.910';
  let icms = 0;
  let ipi = 0;
  let pisExcluido = 0;
  let cofinsExcluida = 0;
  let diag = '';

  if (tipoOperacao === 'BONIFICACAO_MERCADORIAS_VINCULADA') {
    cfop = '5.910';
    // Incide ICMS e IPI, mas NÃO INCIDE PIS e COFINS (Tema 1.050 do STJ)
    icms = Number((valorMercadoriasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
    ipi = Number((valorMercadoriasBrl * (aliquotaIpiPercent / 100)).toFixed(2));
    pisExcluido = Number((valorMercadoriasBrl * 0.0165).toFixed(2));
    cofinsExcluida = Number((valorMercadoriasBrl * 0.0760).toFixed(2));

    partidas.push({
      accountId: '3.1.3.15',
      accountCode: '3.1.3.15',
      accountName: 'Despesas com Bonificações Comerciais a Clientes (Resultado)',
      type: 'DEBIT',
      amount: custoEstoqueMercadoriaBrl + icms + ipi
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueMercadoriaBrl
    });
    if (icms > 0) {
      partidas.push({
        accountId: '2.1.3.01',
        accountCode: '2.1.3.01',
        accountName: 'ICMS a Recolher sobre Bonificações (Passivo Circulante)',
        type: 'CREDIT',
        amount: icms
      });
    }
    if (ipi > 0) {
      partidas.push({
        accountId: '2.1.3.02',
        accountCode: '2.1.3.02',
        accountName: 'IPI a Recolher sobre Bonificações (Passivo Circulante)',
        type: 'CREDIT',
        amount: ipi
      });
    }

    diag = 'Remessa em Bonificação (CFOP 5.910): Destinatário ' + destinatarioNome + '. Destaque de ICMS (R$ ' + icms.toFixed(2) + ') e IPI (R$ ' + ipi.toFixed(2) + '). TEMA 1.050 DO STJ: Exclusão compulsória de PIS (R$ ' + pisExcluido.toFixed(2) + ') e COFINS (R$ ' + cofinsExcluida.toFixed(2) + ') da base de cálculo tributária homologada.';
  } else if (tipoOperacao === 'AMOSTRA_GRATIS') {
    cfop = '5.911';
    // Isenção de ICMS e IPI nos limites regulamentares
    icms = 0;
    ipi = 0;

    partidas.push({
      accountId: '3.1.3.16',
      accountCode: '3.1.3.16',
      accountName: 'Despesas com Amostras Grátis Promocionais (Resultado)',
      type: 'DEBIT',
      amount: custoEstoqueMercadoriaBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueMercadoriaBrl
    });

    diag = 'Remessa de Amostra Grátis (CFOP 5.911): Isenção regulamentar de ICMS e IPI para ' + destinatarioNome + '. Baixa de estoque registrada.';
  } else if (tipoOperacao === 'BRINDES_DISTRIBUICAO') {
    cfop = '5.949';
    icms = Number((valorMercadoriasBrl * (aliquotaIcmsPercent / 100)).toFixed(2));

    partidas.push({
      accountId: '3.1.3.17',
      accountCode: '3.1.3.17',
      accountName: 'Despesas com Brindes e Marketing (Resultado)',
      type: 'DEBIT',
      amount: custoEstoqueMercadoriaBrl + icms
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias para Brindes (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueMercadoriaBrl
    });
    partidas.push({
      accountId: '2.1.3.01',
      accountCode: '2.1.3.01',
      accountName: 'ICMS a Recolher sobre Brindes (Passivo Circulante)',
      type: 'CREDIT',
      amount: icms
    });

    diag = 'Distribuição de Brindes (CFOP 5.949): Destaque de ICMS (R$ ' + icms.toFixed(2) + ') nos termos do Art. 458 do RICMS.';
  } else {
    // Doação Instituição Beneficente
    cfop = '5.910';
    icms = 0; // Isento por convênio específico
    partidas.push({
      accountId: '3.1.3.18',
      accountCode: '3.1.3.18',
      accountName: 'Despesas com Doações Sociais e Filantrópicas (Resultado)',
      type: 'DEBIT',
      amount: custoEstoqueMercadoriaBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoEstoqueMercadoriaBrl
    });

    diag = 'Doação Social / Filantrópica: Beneficiário ' + destinatarioNome + '. Dedutibilidade no Lalur conforme limites da Lei nº 9.249/95.';
  }

  return Ok({
    operacaoId,
    tipoOperacao,
    cfopUtilizado: cfop,
    tributosIncidentes: {
      icmsDevidoBrl: icms,
      ipiDevidoBrl: ipi,
      pisExcluidoCompulsoriamenteTema1050StjBrl: pisExcluido,
      cofinsExcluidaCompulsoriamenteTema1050StjBrl: cofinsExcluida,
      totalTributosDevidosBrl: Number((icms + ipi).toFixed(2))
    },
    partidasDobradaOperacao: partidas,
    diagnosticoFiscal: diag
  });
}
