import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface BiologicalAssetInput {
  ativoBiologicoId: string;
  tipoAtivo: 'REBANHO_BOVINO' | 'LAVOURA_SOJA' | 'CULTURA_CANA' | 'FLORESTA_EUCALIPTO';
  quantidadeUnidades: number;
  cotacaoMercadoPorUnidade: number;
  despesasEstimadasPontoVendaPorUnidade: number;
  custoContabilAnteriorTotal: number;
}

export interface BiologicalAssetResult {
  ativoBiologicoId: string;
  tipoAtivo: string;
  valorJustoLiquidoTotal: number;
  variacaoValorJustoResultado: number;
  tipoVariacao: 'GANHO_VALOR_JUSTO' | 'PERDA_VALOR_JUSTO' | 'SEM_VARIACAO';
  partidasDobradaAtivoBiologico: JournalEntryLine[];
}

export function evaluateBiologicalAssetCpc29(input: BiologicalAssetInput): Result<BiologicalAssetResult, Error> {
  const { ativoBiologicoId, tipoAtivo, quantidadeUnidades, cotacaoMercadoPorUnidade, despesasEstimadasPontoVendaPorUnidade, custoContabilAnteriorTotal } = input;

  if (quantidadeUnidades <= 0 || cotacaoMercadoPorUnidade <= 0) {
    return Err(new Error('Quantidade e cotação do ativo biológico devem ser superiores a zero.'));
  }

  const precoLiquidoUnitario = cotacaoMercadoPorUnidade - despesasEstimadasPontoVendaPorUnidade;
  const valorJustoTotal = Number((quantidadeUnidades * precoLiquidoUnitario).toFixed(2));
  const diff = Number((valorJustoTotal - custoContabilAnteriorTotal).toFixed(2));

  let tipoVar: BiologicalAssetResult['tipoVariacao'] = 'SEM_VARIACAO';
  const partidas: JournalEntryLine[] = [];

  if (diff > 0) {
    tipoVar = 'GANHO_VALOR_JUSTO';
    partidas.push({
      accountId: '1.2.3.08',
      accountCode: '1.2.3.08',
      accountName: 'Ativos Biológicos - ' + tipoAtivo + ' (Ativo Não Circulante - CPC 29)',
      type: 'DEBIT',
      amount: diff
    });
    partidas.push({
      accountId: '3.1.2.05',
      accountCode: '3.1.2.05',
      accountName: 'Variação Positiva do Valor Justo de Ativos Biológicos (Resultado - CPC 29)',
      type: 'CREDIT',
      amount: diff
    });
  }

  return Ok({
    ativoBiologicoId,
    tipoAtivo,
    valorJustoLiquidoTotal: valorJustoTotal,
    variacaoValorJustoResultado: diff,
    tipoVariacao: tipoVar,
    partidasDobradaAtivoBiologico: partidas
  });
}

export interface LcdprGenerationInput {
  cpfProdutorRural: string;
  nomeProdutorRural: string;
  anoExercicio: number;
  imovelRuralNome: string;
  nirfImovel: string;
  receitasDaAtividadeRuralTotal: number;
  despesasDeCusteioEInvestimentoTotal: number;
}

export interface LcdprGenerationResult {
  anoExercicio: number;
  resultadoAtividadeRural: number;
  opcaoTributacao: 'LIVRO_CAIXA_REAL' | 'ARBITRAMENTO_20_PERCENT';
  arquivoLcdprTxt: string;
  totalLinhasGeradas: number;
}

export function generateLcdprFile(input: LcdprGenerationInput): Result<LcdprGenerationResult, Error> {
  const { cpfProdutorRural, nomeProdutorRural, anoExercicio, imovelRuralNome, nirfImovel, receitasDaAtividadeRuralTotal, despesasDeCusteioEInvestimentoTotal } = input;

  const resultadoRural = Number((receitasDaAtividadeRuralTotal - despesasDeCusteioEInvestimentoTotal).toFixed(2));
  const baseArbitrada20 = Number((receitasDaAtividadeRuralTotal * 0.20).toFixed(2));
  const opcao: LcdprGenerationResult['opcaoTributacao'] = resultadoRural < baseArbitrada20 ? 'LIVRO_CAIXA_REAL' : 'ARBITRAMENTO_20_PERCENT';

  const cpfClean = cpfProdutorRural.replace(/\D/g, '');

  const linhas = [
    '0000|LCDPR|0013|' + cpfClean + '|' + nomeProdutorRural.toUpperCase() + '|0|' + anoExercicio + '0101|' + anoExercicio + '1231|',
    '0010|1|',
    '0030|1|BR|' + nirfImovel + '|' + imovelRuralNome.toUpperCase() + '|FAZENDA MODELO|100.00|1|',
    '0040|1|341|1234|567890|BANCO ITAU RURAL|',
    'Q100|' + anoExercicio + '0630|1|1|1|Venda de Safra de Soja|' + cpfClean + '|1|' + receitasDaAtividadeRuralTotal.toFixed(2).replace('.', '') + '|E|' + receitasDaAtividadeRuralTotal.toFixed(2).replace('.', '') + '|',
    'Q100|' + anoExercicio + '0715|1|1|1|Compra de Fertilizantes e Defensivos|' + cpfClean + '|1|' + despesasDeCusteioEInvestimentoTotal.toFixed(2).replace('.', '') + '|S|' + resultadoRural.toFixed(2).replace('.', '') + '|',
    '9999|' + cpfClean + '|' + nomeProdutorRural.toUpperCase() + '|' + anoExercicio + '|7|'
  ];

  return Ok({
    anoExercicio,
    resultadoAtividadeRural: resultadoRural,
    opcaoTributacao: opcao,
    arquivoLcdprTxt: linhas.join(String.fromCharCode(13, 10)),
    totalLinhasGeradas: linhas.length
  });
}
