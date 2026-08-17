import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type LeasingOperationType = 'REMESSA_LOCACAO_BENS' | 'RETORNO_LOCACAO_BENS' | 'FATURAMENTO_MENSAL_LOCACAO' | 'REMESSA_COMODATO';

export interface LeasingOperationInput {
  operacaoId: string;
  tipoOperacao: LeasingOperationType;
  clienteLocatarioNome: string;
  valorOperacaoBrl: number;
  custoAtivoImobilizadoBrl?: number;
}

export interface LeasingOperationResult {
  operacaoId: string;
  tipoOperacao: LeasingOperationType;
  cfopOuDocumento: string;
  tributacaoIncidentes: {
    icmsDevidoBrl: number;
    issDevidoBrl: number;
    pisDevido9_25PercentBrl: number;
    cofinsDevido9_25PercentBrl: number;
    totalTributosBrl: number;
  };
  partidasDobradaLocacao: JournalEntryLine[];
  diagnosticoFiscal: string;
}

export function processLeasingAndComodatoTaxEngine(input: LeasingOperationInput): Result<LeasingOperationResult, Error> {
  const {
    operacaoId,
    tipoOperacao,
    clienteLocatarioNome,
    valorOperacaoBrl,
    custoAtivoImobilizadoBrl = 0
  } = input;

  if (valorOperacaoBrl <= 0) {
    return Err(new Error('Valor da operação de locação/comodato deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];
  let doc = 'NF-e de Remessa de Locação (CFOP 5.908)';
  let icms = 0;
  let iss = 0;
  let pis = 0;
  let cofins = 0;
  let diag = '';

  if (tipoOperacao === 'REMESSA_LOCACAO_BENS') {
    doc = 'CFOP 5.908 - Remessa de Bem para Locação';
    // Súmula Vinculante nº 31 do STF & Art. 7º IX RICMS: NÃO INCIDE ICMS e NÃO INCIDE ISS
    icms = 0;
    iss = 0;

    partidas.push({
      accountId: '1.2.3.19',
      accountCode: '1.2.3.19',
      accountName: 'Bens do Imobilizado em Locação a Terceiros (Ativo Não Circulante)',
      type: 'DEBIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imobilizado em Operação Própria (Ativo Não Circulante)',
      type: 'CREDIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });

    diag = 'Remessa para Locação (CFOP 5.908): Locatário ' + clienteLocatarioNome + '. SÚMULA VINCULANTE Nº 31 DO STF: Não incidência de ICMS e ISS. Controle de ativo cedido em locação registrado.';
  } else if (tipoOperacao === 'FATURAMENTO_MENSAL_LOCACAO') {
    doc = 'Fatura / Recibo de Cobrança de Locação de Bens Móveis';
    // Sem ICMS e Sem ISS. Incidência de PIS (1,65%) e COFINS (7,60%)
    pis = Number((valorOperacaoBrl * 0.0165).toFixed(2));
    cofins = Number((valorOperacaoBrl * 0.0760).toFixed(2));

    partidas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes - Aluguéis a Receber (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorOperacaoBrl
    });
    partidas.push({
      accountId: '3.1.1.08',
      accountCode: '3.1.1.08',
      accountName: 'Receita de Locação de Bens Móveis (Resultado - CPC 47 / IFRS 16)',
      type: 'CREDIT',
      amount: valorOperacaoBrl
    });

    diag = 'Faturamento de Locação: Locatário ' + clienteLocatarioNome + '. Valor: R$ ' + valorOperacaoBrl.toFixed(2) + '. Sem ICMS/ISS. PIS (1,65%: R$ ' + pis.toFixed(2) + ') e COFINS (7,60%: R$ ' + cofins.toFixed(2) + ') apurados.';
  } else if (tipoOperacao === 'RETORNO_LOCACAO_BENS') {
    doc = 'CFOP 5.909 - Retorno de Bem Recebido em Locação';
    icms = 0;
    iss = 0;

    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imobilizado em Operação Própria (Ativo Não Circulante)',
      type: 'DEBIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });
    partidas.push({
      accountId: '1.2.3.19',
      accountCode: '1.2.3.19',
      accountName: 'Bens do Imobilizado em Locação a Terceiros (Ativo Não Circulante)',
      type: 'CREDIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });

    diag = 'Retorno de Locação (CFOP 5.909): Reincorporação de maquinário/veículo ao imobilizado próprio.';
  } else {
    // Comodato (CFOP 5.912)
    doc = 'CFOP 5.912 - Remessa de Bem em Comodato';
    icms = 0;
    iss = 0;

    partidas.push({
      accountId: '1.2.3.20',
      accountCode: '1.2.3.20',
      accountName: 'Bens do Imobilizado em Comodato Gratuito (Ativo Não Circulante)',
      type: 'DEBIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imobilizado em Operação Própria (Ativo Não Circulante)',
      type: 'CREDIT',
      amount: custoAtivoImobilizadoBrl > 0 ? custoAtivoImobilizadoBrl : valorOperacaoBrl
    });

    diag = 'Remessa em Comodato (CFOP 5.912): Empréstimo gratuito para ' + clienteLocatarioNome + '. Não incidência tributária.';
  }

  return Ok({
    operacaoId,
    tipoOperacao,
    cfopOuDocumento: doc,
    tributacaoIncidentes: {
      icmsDevidoBrl: icms,
      issDevidoBrl: iss,
      pisDevido9_25PercentBrl: pis,
      cofinsDevido9_25PercentBrl: cofins,
      totalTributosBrl: Number((pis + cofins).toFixed(2))
    },
    partidasDobradaLocacao: partidas,
    diagnosticoFiscal: diag
  });
}
