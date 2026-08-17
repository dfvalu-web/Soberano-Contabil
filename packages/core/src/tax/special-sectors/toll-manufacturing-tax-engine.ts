import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type TollManufacturingStageType = 'REMESSA_PARA_INDUSTRIALIZACAO' | 'RETORNO_E_COBRANCA_INDUSTRIALIZACAO';

export interface TollManufacturingInput {
  ordemId: string;
  etapa: TollManufacturingStageType;
  encomendanteNome: string;
  industrializadorNome: string;
  valorInsumosEncomendanteBrl: number;
  valorMaoDeObraAplicadaBrl: number;
  valorInsumosPropriosIndustrializadorBrl: number;
  aliquotaIcmsInsumosPropriosPercent: number; // Ex: 18%
  aliquotaIpiInsumosPropriosPercent: number;  // Ex: 10%
  aliquotaPisPercent: number;  // Ex: 1.65%
  aliquotaCofinsPercent: number; // Ex: 7.60%
}

export interface TollManufacturingResult {
  ordemId: string;
  etapa: TollManufacturingStageType;
  notasFiscaisEmitidas: {
    nfRetornoInsumos: {
      cfop: string;
      naturezaOperacao: string;
      valorTotalBrl: number;
      icmsSuspensoBrl: number;
      ipiSuspensoBrl: number;
    };
    nfCobrancaValorAgregado: {
      cfop: string;
      naturezaOperacao: string;
      valorTotalFaturadoBrl: number;
      icmsDestacadoBrl: number;
      ipiDestacadoBrl: number;
      pisDevidoBrl: number;
      cofinsDevidoBrl: number;
    };
  };
  partidasDobradaIndustrializacao: JournalEntryLine[];
  diagnosticoIndustrializacao: string;
}

export function processTollManufacturingOperation(input: TollManufacturingInput): Result<TollManufacturingResult, Error> {
  const {
    ordemId,
    etapa,
    encomendanteNome,
    industrializadorNome,
    valorInsumosEncomendanteBrl,
    valorMaoDeObraAplicadaBrl,
    valorInsumosPropriosIndustrializadorBrl,
    aliquotaIcmsInsumosPropriosPercent,
    aliquotaIpiInsumosPropriosPercent,
    aliquotaPisPercent,
    aliquotaCofinsPercent
  } = input;

  if (valorInsumosEncomendanteBrl <= 0) {
    return Err(new Error('Valor dos insumos do encomendante deve ser superior a zero.'));
  }

  const partidas: JournalEntryLine[] = [];

  if (etapa === 'REMESSA_PARA_INDUSTRIALIZACAO') {
    // CFOP 5.901 / 6.901: Remessa para industrialização por encomenda (Suspensão ICMS/IPI)
    const icmsSuspenso = Number((valorInsumosEncomendanteBrl * 0.18).toFixed(2));
    const ipiSuspenso = Number((valorInsumosEncomendanteBrl * 0.10).toFixed(2));

    partidas.push({
      accountId: '1.1.4.09',
      accountCode: '1.1.4.09',
      accountName: 'Matérias-Primas em Poder de Terceiros / Industrialização (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorInsumosEncomendanteBrl
    });
    partidas.push({
      accountId: '1.1.4.02',
      accountCode: '1.1.4.02',
      accountName: 'Estoques de Matérias-Primas (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorInsumosEncomendanteBrl
    });

    const diag = 'Industrialização por Encomenda (Art. 402 RICMS): Remessa de Insumos (CFOP 5.901) para ' + industrializadorNome + '. Suspensão de ICMS (R$ ' + icmsSuspenso.toFixed(2) + ') e IPI (R$ ' + ipiSuspenso.toFixed(2) + '). Estoque em poder de terceiros registrado.';

    return Ok({
      ordemId,
      etapa,
      notasFiscaisEmitidas: {
        nfRetornoInsumos: {
          cfop: '5.901',
          naturezaOperacao: 'Remessa de Insumos para Industrialização por Encomenda',
          valorTotalBrl: valorInsumosEncomendanteBrl,
          icmsSuspensoBrl: icmsSuspenso,
          ipiSuspensoBrl: ipiSuspenso
        },
        nfCobrancaValorAgregado: {
          cfop: 'N/A',
          naturezaOperacao: 'N/A',
          valorTotalFaturadoBrl: 0,
          icmsDestacadoBrl: 0,
          ipiDestacadoBrl: 0,
          pisDevidoBrl: 0,
          cofinsDevidoBrl: 0
        }
      },
      partidasDobradaIndustrializacao: partidas,
      diagnosticoIndustrializacao: diag
    });
  } else {
    // Retorno e Cobrança de Industrialização (CFOP 5.902 e CFOP 5.124)
    const icmsSuspenso = Number((valorInsumosEncomendanteBrl * 0.18).toFixed(2));
    const ipiSuspenso = Number((valorInsumosEncomendanteBrl * 0.10).toFixed(2));

    const valorTotalFaturado = Number((valorMaoDeObraAplicadaBrl + valorInsumosPropriosIndustrializadorBrl).toFixed(2));
    const icmsInsumos = Number((valorInsumosPropriosIndustrializadorBrl * (aliquotaIcmsInsumosPropriosPercent / 100)).toFixed(2));
    const ipiInsumos = Number((valorInsumosPropriosIndustrializadorBrl * (aliquotaIpiInsumosPropriosPercent / 100)).toFixed(2));
    const pis = Number((valorTotalFaturado * (aliquotaPisPercent / 100)).toFixed(2));
    const cofins = Number((valorTotalFaturado * (aliquotaCofinsPercent / 100)).toFixed(2));

    partidas.push({
      accountId: '1.1.4.01',
      accountCode: '1.1.4.01',
      accountName: 'Estoques de Produtos Acabados (Ativo Circulante)',
      type: 'DEBIT',
      amount: valorInsumosEncomendanteBrl + valorTotalFaturado
    });
    partidas.push({
      accountId: '1.1.4.09',
      accountCode: '1.1.4.09',
      accountName: 'Matérias-Primas em Poder de Terceiros / Industrialização (Ativo Circulante)',
      type: 'CREDIT',
      amount: valorInsumosEncomendanteBrl
    });
    partidas.push({
      accountId: '2.1.2.01',
      accountCode: '2.1.2.01',
      accountName: 'Fornecedores / Serviços de Industrialização a Pagar (Passivo Circulante)',
      type: 'CREDIT',
      amount: valorTotalFaturado
    });

    const diag = 'Industrialização por Encomenda (Art. 402 RICMS): Retorno de Insumos (CFOP 5.902: R$ ' + valorInsumosEncomendanteBrl.toFixed(2) + ' com suspensão) e Cobrança de Valor Agregado (CFOP 5.124: R$ ' + valorTotalFaturado.toFixed(2) + ' com ICMS/IPI/PIS/COFINS destacados). Produto acabado incorporado ao estoque.';

    return Ok({
      ordemId,
      etapa,
      notasFiscaisEmitidas: {
        nfRetornoInsumos: {
          cfop: '5.902',
          naturezaOperacao: 'Retorno de Mercadoria Utilizada na Industrialização por Encomenda',
          valorTotalBrl: valorInsumosEncomendanteBrl,
          icmsSuspensoBrl: icmsSuspenso,
          ipiSuspensoBrl: ipiSuspenso
        },
        nfCobrancaValorAgregado: {
          cfop: '5.124',
          naturezaOperacao: 'Industrialização Efetuada para Outra Empresa (Mão de Obra e Insumos)',
          valorTotalFaturadoBrl: valorTotalFaturado,
          icmsDestacadoBrl: icmsInsumos,
          ipiDestacadoBrl: ipiInsumos,
          pisDevidoBrl: pis,
          cofinsDevidoBrl: cofins
        }
      },
      partidasDobradaIndustrializacao: partidas,
      diagnosticoIndustrializacao: diag
    });
  }
}
