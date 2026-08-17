import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface BusinessCombinationInput {
  transacaoId: string;
  adquirenteNome: string;
  adquiridaNome: string;
  // Custo total da aquisição (Consideration Transferred)
  contraprestacaoCaixaBrl: number;
  contraprestacaoAcoesEmitidasValorJustoBrl: number;
  contraprestacaoContingenteEarnOutValorJustoBrl: number;
  // Patrimônio Líquido Contábil da adquirida na data da aquisição
  patrimonioLiquidoContabilAdquiridaBrl: number;
  // PPA: Mensuração a Valor Justo dos Ativos e Passivos Líquidos Identificáveis
  maisValiaImobilizadoValorJustoBrl: number;
  ativosIntangiveisIdentificadosValorJustoBrl: number; // Ex: Marcas, Patentes, Softwares, Clientes
  passivosContingentesAssumidosValorJustoBrl: number;
  aliquotaTributosDiferidosPercent: number; // 34%
}

export interface BusinessCombinationResult {
  transacaoId: string;
  adquirente: string;
  adquirida: string;
  custoTotalAquisicaoBrl: number;
  ativosLiquidosIdentificaveisValorJustoBrl: number;
  tributosDiferidosPassivosMaisValiaBrl: number;
  goodwillPorExpectativaRentabilidadeFuturaBrl: number;
  ganhoPorCompraVantajosaBargainPurchaseBrl: number;
  partidasDobradaCombinacaoNegocios: JournalEntryLine[];
  diagnosticoCpc15: string;
}

export function evaluateBusinessCombinationAndGoodwillCpc15(input: BusinessCombinationInput): Result<BusinessCombinationResult, Error> {
  const {
    transacaoId,
    adquirenteNome,
    adquiridaNome,
    contraprestacaoCaixaBrl,
    contraprestacaoAcoesEmitidasValorJustoBrl,
    contraprestacaoContingenteEarnOutValorJustoBrl,
    patrimonioLiquidoContabilAdquiridaBrl,
    maisValiaImobilizadoValorJustoBrl,
    ativosIntangiveisIdentificadosValorJustoBrl,
    passivosContingentesAssumidosValorJustoBrl,
    aliquotaTributosDiferidosPercent
  } = input;

  const custoTotalAquisicao = Number((contraprestacaoCaixaBrl + contraprestacaoAcoesEmitidasValorJustoBrl + contraprestacaoContingenteEarnOutValorJustoBrl).toFixed(2));

  if (custoTotalAquisicao <= 0) {
    return Err(new Error('Custo total de aquisição deve ser superior a zero.'));
  }

  // Tributos Diferidos Passivos (34%) sobre a Mais-Valia de Imobilizado e Intangíveis Identificados (CPC 32)
  const baseTributavelMaisValia = maisValiaImobilizadoValorJustoBrl + ativosIntangiveisIdentificadosValorJustoBrl;
  const tributosDiferidosPassivos = Number((baseTributavelMaisValia * (aliquotaTributosDiferidosPercent / 100)).toFixed(2));

  // Ativos Líquidos Identificáveis a Valor Justo (PPA)
  const ativosLiquidosIdentificaveis = Number((
    patrimonioLiquidoContabilAdquiridaBrl +
    maisValiaImobilizadoValorJustoBrl +
    ativosIntangiveisIdentificadosValorJustoBrl -
    passivosContingentesAssumidosValorJustoBrl -
    tributosDiferidosPassivos
  ).toFixed(2));

  let goodwill = 0;
  let bargainPurchase = 0;

  if (custoTotalAquisicao > ativosLiquidosIdentificaveis) {
    goodwill = Number((custoTotalAquisicao - ativosLiquidosIdentificaveis).toFixed(2));
  } else if (custoTotalAquisicao < ativosLiquidosIdentificaveis) {
    bargainPurchase = Number((ativosLiquidosIdentificaveis - custoTotalAquisicao).toFixed(2));
  }

  const partidas: JournalEntryLine[] = [];

  // Lançamentos Contábeis no Adquirente (Lei nº 12.973/2014 & CPC 15)
  partidas.push({
    accountId: '1.2.2.01',
    accountCode: '1.2.2.01',
    accountName: 'Participação Societária em Controladas - PL Contábil (Ativo Não Circulante - CPC 15)',
    type: 'DEBIT',
    amount: patrimonioLiquidoContabilAdquiridaBrl
  });

  if (maisValiaImobilizadoValorJustoBrl > 0) {
    partidas.push({
      accountId: '1.2.2.02',
      accountCode: '1.2.2.02',
      accountName: 'Mais-Valia de Ativos Imobilizados (Subconta Lei 12.973 - CPC 15)',
      type: 'DEBIT',
      amount: maisValiaImobilizadoValorJustoBrl
    });
  }

  if (ativosIntangiveisIdentificadosValorJustoBrl > 0) {
    partidas.push({
      accountId: '1.2.4.01',
      accountCode: '1.2.4.01',
      accountName: 'Ativos Intangíveis Identificados - Marcas e Patentes (Ativo Não Circulante - CPC 15 / CPC 04)',
      type: 'DEBIT',
      amount: ativosIntangiveisIdentificadosValorJustoBrl
    });
  }

  if (goodwill > 0) {
    partidas.push({
      accountId: '1.2.4.99',
      accountCode: '1.2.4.99',
      accountName: 'Goodwill por Expectativa de Rentabilidade Futura (Ativo Não Circulante - CPC 15)',
      type: 'DEBIT',
      amount: goodwill
    });
  }

  if (tributosDiferidosPassivos > 0) {
    partidas.push({
      accountId: '2.2.2.05',
      accountCode: '2.2.2.05',
      accountName: 'Passivo Fiscal Diferido sobre Mais-Valia PPA (Passivo Não Circulante - CPC 32)',
      type: 'CREDIT',
      amount: tributosDiferidosPassivos
    });
  }

  if (contraprestacaoCaixaBrl > 0) {
    partidas.push({
      accountId: '1.1.1.02',
      accountCode: '1.1.1.02',
      accountName: 'Banco Conta Movimento (Ativo Circulante)',
      type: 'CREDIT',
      amount: contraprestacaoCaixaBrl
    });
  }

  if (contraprestacaoContingenteEarnOutValorJustoBrl > 0) {
    partidas.push({
      accountId: '2.2.1.10',
      accountCode: '2.2.1.10',
      accountName: 'Contas a Pagar por Aquisição de Participação Societária / Earn-out (Passivo Não Circulante - CPC 15)',
      type: 'CREDIT',
      amount: contraprestacaoContingenteEarnOutValorJustoBrl
    });
  }

  const diag = 'CPC 15 (R1) / IFRS 3: Combinação de Negócios entre ' + adquirenteNome + ' e ' + adquiridaNome + '. Custo Total de Aquisição: R$ ' + custoTotalAquisicao.toFixed(2) + '. Ativos Líquidos Identificáveis a Valor Justo (PPA): R$ ' + ativosLiquidosIdentificaveis.toFixed(2) + ' (PL Contábil: R$ ' + patrimonioLiquidoContabilAdquiridaBrl.toFixed(2) + ', Mais-valia Imob: R$ ' + maisValiaImobilizadoValorJustoBrl.toFixed(2) + ', Intangíveis: R$ ' + ativosIntangiveisIdentificadosValorJustoBrl.toFixed(2) + ', Passivo Fiscal Diferido: R$ ' + tributosDiferidosPassivos.toFixed(2) + '). ' + (goodwill > 0 ? 'Goodwill reconhecido no Ativo Intangível: R$ ' + goodwill.toFixed(2) + '.' : 'Ganho por Compra Vantajosa no Resultado: R$ ' + bargainPurchase.toFixed(2) + '.');

  return Ok({
    transacaoId,
    adquirente: adquirenteNome,
    adquirida: adquiridaNome,
    custoTotalAquisicaoBrl: custoTotalAquisicao,
    ativosLiquidosIdentificaveisValorJustoBrl: ativosLiquidosIdentificaveis,
    tributosDiferidosPassivosMaisValiaBrl: tributosDiferidosPassivos,
    goodwillPorExpectativaRentabilidadeFuturaBrl: goodwill,
    ganhoPorCompraVantajosaBargainPurchaseBrl: bargainPurchase,
    partidasDobradaCombinacaoNegocios: partidas,
    diagnosticoCpc15: diag
  });
}
