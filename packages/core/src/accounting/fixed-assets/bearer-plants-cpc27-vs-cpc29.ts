import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export type BearerPlantStage = 'EM_FORMACAO_DESENVOLVIMENTO' | 'PRODUCAO_MATURIDADE';

export interface BearerPlantInput {
  ativoId: string;
  culturaNome: string; // Ex: 'Pomar de Laranjas Citros', 'Cafezal Arábica', 'Seringueira Látex'
  estagio: BearerPlantStage;
  custosAcumuladosFormacaoBrl: number;
  vidaUtilProdutivaAnos: number;
  valorResidualImobilizadoBrl?: number;
  valorJustoFrutosEmDesenvolvimentoBrl?: number; // CPC 29 (Frutos no ramo)
  despesasEstimadasVendaFrutosBrl?: number;
}

export interface BearerPlantResult {
  ativoId: string;
  culturaNome: string;
  estagio: BearerPlantStage;
  valorContabilImobilizadoBrl: number; // CPC 27
  depreciacaoAnualImobilizadoBrl: number; // CPC 27
  valorJustoLiquidoFrutosCpc29Brl: number; // CPC 29
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc27vs29: string;
}

export function evaluateBearerPlantsCpc27vs29(input: BearerPlantInput): Result<BearerPlantResult, Error> {
  const {
    ativoId,
    culturaNome,
    estagio,
    custosAcumuladosFormacaoBrl,
    vidaUtilProdutivaAnos,
    valorResidualImobilizadoBrl = 0,
    valorJustoFrutosEmDesenvolvimentoBrl = 0,
    despesasEstimadasVendaFrutosBrl = 0
  } = input;

  if (custosAcumuladosFormacaoBrl <= 0 || vidaUtilProdutivaAnos <= 0) {
    return Err(new Error('Custos de formação e vida útil devem ser superiores a zero.'));
  }

  // 1. Imobilizado - Planta Portadora (CPC 27 / IAS 16)
  const baseDepreciavel = Math.max(0, custosAcumuladosFormacaoBrl - valorResidualImobilizadoBrl);
  let depreciacaoAnual = 0;

  if (estagio === 'PRODUCAO_MATURIDADE') {
    depreciacaoAnual = Number((baseDepreciavel / vidaUtilProdutivaAnos).toFixed(2));
  }

  // 2. Ativo Biológico Consumível - Frutos na Árvore (CPC 29 / IAS 41)
  const valorJustoLiquidoFrutos = Number((Math.max(0, valorJustoFrutosEmDesenvolvimentoBrl - despesasEstimadasVendaFrutosBrl)).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  if (estagio === 'EM_FORMACAO_DESENVOLVIMENTO') {
    // D: Imobilizado em Formação (Planta Portadora - CPC 27)
    partidas.push({
      accountId: '1.2.3.05',
      accountCode: '1.2.3.05',
      accountName: 'Plantas Portadoras em Formação (Ativo Não Circulante - CPC 27)',
      type: 'DEBIT',
      amount: custosAcumuladosFormacaoBrl
    });
    // C: Caixa / Fornecedores / Insumos
    partidas.push({
      accountId: '1.1.1.01',
      accountCode: '1.1.1.01',
      accountName: 'Bancos Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: custosAcumuladosFormacaoBrl
    });
  } else {
    // Fase Produtiva: Depreciação do Imobilizado
    if (depreciacaoAnual > 0) {
      partidas.push({
        accountId: '3.1.2.01',
        accountCode: '3.1.2.01',
        accountName: 'Despesa de Depreciação de Plantas Portadoras (Resultado - CPC 27)',
        type: 'DEBIT',
        amount: depreciacaoAnual
      });
      partidas.push({
        accountId: '1.2.3.09',
        accountCode: '1.2.3.09',
        accountName: 'Depreciação Acumulada - Plantas Portadoras (Ativo Não Circulante - CPC 27)',
        type: 'CREDIT',
        amount: depreciacaoAnual
      });
    }

    // Frutos nos Ramos a Valor Justo (CPC 29)
    if (valorJustoLiquidoFrutos > 0) {
      partidas.push({
        accountId: '1.1.4.01',
        accountCode: '1.1.4.01',
        accountName: 'Ativos Biológicos - Frutos em Crescimento (Ativo Circulante - CPC 29)',
        type: 'DEBIT',
        amount: valorJustoLiquidoFrutos
      });
      partidas.push({
        accountId: '3.1.1.05',
        accountCode: '3.1.1.05',
        accountName: 'Variação Positiva a Valor Justo de Ativos Biológicos (Resultado - CPC 29)',
        type: 'CREDIT',
        amount: valorJustoLiquidoFrutos
      });
    }
  }

  const diag = 'CPC 27 vs CPC 29 (Plantas Portadoras): ' + culturaNome + ' (' + estagio + '). Imobilizado: R$ ' + custosAcumuladosFormacaoBrl.toFixed(2) + ' (Depreciação Anual: R$ ' + depreciacaoAnual.toFixed(2) + '). Frutos nos Ramos (CPC 29): R$ ' + valorJustoLiquidoFrutos.toFixed(2) + ' a Valor Justo.';

  return Ok({
    ativoId,
    culturaNome,
    estagio,
    valorContabilImobilizadoBrl: custosAcumuladosFormacaoBrl,
    depreciacaoAnualImobilizadoBrl: depreciacaoAnual,
    valorJustoLiquidoFrutosCpc29Brl: valorJustoLiquidoFrutos,
    partidasDobrada: partidas,
    diagnosticoCpc27vs29: diag
  });
}
