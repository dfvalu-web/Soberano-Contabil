import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type RealEstateSwapType = 'PERMUTA_IMOVEIS_SEM_TORNA' | 'PERMUTA_IMOVEIS_COM_TORNA_RECEBIDA' | 'PERMUTA_MERCADORIAS_OPERACIONAL';

export interface RealEstateSwapInput {
  operacaoId: string;
  tipoPermuta: RealEstateSwapType;
  parceiroPermutanteNome: string;
  valorImovelEntregueBrl: number;
  valorImovelRecebidoBrl: number;
  valorTornaFinanceiraRecebidaBrl?: number;
  custoContabilImovelEntregueBrl: number;
}

export interface RealEstateSwapResult {
  operacaoId: string;
  tipoPermuta: RealEstateSwapType;
  baseCalculoTributavelTornaBrl: number;
  tributacaoFederalDevida: {
    irpjBrl: number;
    csllBrl: number;
    pisBrl: number;
    cofinsBrl: number;
    totalTributosFederaisBrl: number;
  };
  partidasDobradaPermuta: JournalEntryLine[];
  diagnosticoFiscal: string;
}

export function processRealEstateSwapTaxEngine(input: RealEstateSwapInput): Result<RealEstateSwapResult, Error> {
  const {
    operacaoId,
    tipoPermuta,
    parceiroPermutanteNome,
    valorImovelEntregueBrl,
    valorImovelRecebidoBrl,
    valorTornaFinanceiraRecebidaBrl = 0,
    custoContabilImovelEntregueBrl
  } = input;

  if (valorImovelEntregueBrl <= 0 || valorImovelRecebidoBrl <= 0) {
    return Err(new Error('Valores dos imóveis na permuta devem ser superiores a zero.'));
  }

  const partidas: JournalEntryLine[] = [];
  let baseTributavel = 0;
  let irpj = 0;
  let csll = 0;
  let pis = 0;
  let cofins = 0;
  let diag = '';

  if (tipoPermuta === 'PERMUTA_IMOVEIS_SEM_TORNA') {
    // TEMA 1.098 DO STJ & Parecer Normativo COSIT nº 09/2014: NÃO CONSTITUI RECEITA BRUTA
    baseTributavel = 0;
    irpj = 0;
    csll = 0;
    pis = 0;
    cofins = 0;

    // D: Imóvel Recebido (Pelo custo contábil do entregue) / C: Imóvel Entregue
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imóveis Recebidos em Permuta (Ativo Não Circulante / Estoque)',
      type: 'DEBIT',
      amount: custoContabilImovelEntregueBrl
    });
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imóveis Entregues em Permuta (Baixa de Ativo)',
      type: 'CREDIT',
      amount: custoContabilImovelEntregueBrl
    });

    diag = 'Permuta de Imóveis Sem Torna: Permutante ' + parceiroPermutanteNome + '. TEMA 1.098 DO STJ: Não incidência de IRPJ, CSLL, PIS e COFINS. Operação patrimonial neutra sem apuração de ganho de capital.';
  } else if (tipoPermuta === 'PERMUTA_IMOVEIS_COM_TORNA_RECEBIDA') {
    baseTributavel = valorTornaFinanceiraRecebidaBrl;
    // Presunção Lucro Presumido Atividade Imobiliária: 8% IRPJ (15% + 10% adicional) e 12% CSLL (9%) + PIS/COFINS cumulativo (3,65%)
    // Alíquota efetiva sobre a torna = ~6,73% (1,20% + 0,80% + 1,08% + 0,65% + 3,00%)
    irpj = Number((baseTributavel * 0.0200).toFixed(2)); // 2.0% efetivo
    csll = Number((baseTributavel * 0.0108).toFixed(2)); // 1.08% efetivo
    pis = Number((baseTributavel * 0.0065).toFixed(2));  // 0.65%
    cofins = Number((baseTributavel * 0.0300).toFixed(2)); // 3.00%

    // Lançamento com entrada de caixa pela torna
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imóveis Recebidos em Permuta (Ativo Não Circulante / Estoque)',
      type: 'DEBIT',
      amount: valorImovelRecebidoBrl
    });
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento - Torna Financeira Recebida (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorTornaFinanceiraRecebidaBrl
    });
    partidas.push({
      accountId: '1.2.3.01',
      accountCode: '1.2.3.01',
      accountName: 'Imóveis Entregues em Permuta (Baixa de Ativo)',
      type: 'CREDIT',
      amount: custoContabilImovelEntregueBrl
    });

    diag = 'Permuta de Imóveis Com Torna: Torna recebida de R$ ' + valorTornaFinanceiraRecebidaBrl.toFixed(2) + '. Tributação exclusiva sobre a torna financeira apurada conforme Parecer Normativo COSIT nº 09/2014.';
  } else {
    // Permuta Mercadorias Operacional
    baseTributavel = valorImovelEntregueBrl;
    irpj = 0;
    csll = 0;
    pis = Number((baseTributavel * 0.0165).toFixed(2));
    cofins = Number((baseTributavel * 0.0760).toFixed(2));

    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias Recebidas em Permuta (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorImovelRecebidoBrl
    });
    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Mercadorias Entregues em Permuta (Ativo Circulante)',
      type: 'CREDIT',
      amount: custoContabilImovelEntregueBrl
    });

    diag = 'Permuta Mercantil Operacional (CFOP 5.949): Troca de estoques com apuração de PIS/COFINS não cumulativo.';
  }

  const totalFed = Number((irpj + csll + pis + cofins).toFixed(2));

  return Ok({
    operacaoId,
    tipoPermuta,
    baseCalculoTributavelTornaBrl: baseTributavel,
    tributacaoFederalDevida: {
      irpjBrl: irpj,
      csllBrl: csll,
      pisBrl: pis,
      cofinsBrl: cofins,
      totalTributosFederaisBrl: totalFed
    },
    partidasDobradaPermuta: partidas,
    diagnosticoFiscal: diag
  });
}
