import { Result, Ok, Err } from '../../types/result.js';

export type CorporateOperationType = 'CISAO_PARCIAL' | 'CISAO_TOTAL' | 'INCORPORACAO' | 'FUSAO';

export interface CorporateRestructuringInput {
  tipoOperacao: CorporateOperationType;
  empresaSucedidaNome: string;
  empresaSucessoraNome: string;
  percentualPatrimonioLiquidoVertido: number; // e.g. 40 para 40%
  acervoLiquidoContabilVertido: number;
  acervoLiquidoValorMercadoVertido: number;
  saldoPrejuizoFiscalIrpjSucedida: number;
  saldoCreditosTributariosPendenteSucedida: number;
}

export interface CorporateRestructuringResult {
  tipoOperacao: CorporateOperationType;
  valorAcervoContabil: number;
  valorAcervoMercado: number;
  ganhoDeCapitalNaOperacao: number;
  tributacaoGanhoCapital34Percent: number;
  sucessaoPrejuizoFiscal: {
    saldoPrejuizoAproveitavelSucessora: number;
    saldoPrejuizoPerdidoExtinto: number;
    fundamentacaoArt581Rir: string;
  };
  sucessaoCreditosTributarios: {
    creditosTransferiveisSucessora: number;
  };
  diagnosticoSocietarioFiscal: string;
}

export function evaluateCorporateRestructuring(input: CorporateRestructuringInput): Result<CorporateRestructuringResult, Error> {
  const {
    tipoOperacao,
    percentualPatrimonioLiquidoVertido,
    acervoLiquidoContabilVertido,
    acervoLiquidoValorMercadoVertido,
    saldoPrejuizoFiscalIrpjSucedida,
    saldoCreditosTributariosPendenteSucedida
  } = input;

  if (percentualPatrimonioLiquidoVertido <= 0 || percentualPatrimonioLiquidoVertido > 100) {
    return Err(new Error('Percentual de acervo vertido deve estar entre 1% e 100%.'));
  }

  // Ganho de Capital se vertido a valor de mercado
  const ganhoCapital = Number(Math.max(0, acervoLiquidoValorMercadoVertido - acervoLiquidoContabilVertido).toFixed(2));
  const impostoGanho = Number((ganhoCapital * 0.34).toFixed(2));

  // Trava Art. 581 RIR/2018 sobre Prejuízos Fiscais
  let prejuizoAproveitavel = 0;
  let prejuizoPerdido = 0;

  if (tipoOperacao === 'INCORPORACAO' || tipoOperacao === 'FUSAO' || tipoOperacao === 'CISAO_TOTAL') {
    // Na incorporação/fusão/cisão total: Prejuízos da sucedida são EXTINTOS (Art. 581 do RIR/2018)
    prejuizoAproveitavel = 0;
    prejuizoPerdido = saldoPrejuizoFiscalIrpjSucedida;
  } else if (tipoOperacao === 'CISAO_PARCIAL') {
    // Na cisão parcial: Prejuízo da cindida é reduzido proporcionalmente ao PL vertido
    const propManter = (100 - percentualPatrimonioLiquidoVertido) / 100;
    prejuizoAproveitavel = Number((saldoPrejuizoFiscalIrpjSucedida * propManter).toFixed(2));
    prejuizoPerdido = Number((saldoPrejuizoFiscalIrpjSucedida * (percentualPatrimonioLiquidoVertido / 100)).toFixed(2));
  }

  // Sucessão de Créditos Tributários
  const creditosTransferiveis = Number((saldoCreditosTributariosPendenteSucedida * (percentualPatrimonioLiquidoVertido / 100)).toFixed(2));

  const diagnostico = 'Operação de ' + tipoOperacao + ': Acervo líquido de R$ ' + acervoLiquidoContabilVertido.toFixed(2) + ' vertido. Nos termos do Art. 581 do RIR/2018, R$ ' + prejuizoPerdido.toFixed(2) + ' de prejuízos fiscais foram cancelados/extintos, transferindo-se R$ ' + creditosTransferiveis.toFixed(2) + ' de créditos tributários.';

  return Ok({
    tipoOperacao,
    valorAcervoContabil: acervoLiquidoContabilVertido,
    valorAcervoMercado: acervoLiquidoValorMercadoVertido,
    ganhoDeCapitalNaOperacao: ganhoCapital,
    tributacaoGanhoCapital34Percent: impostoGanho,
    sucessaoPrejuizoFiscal: {
      saldoPrejuizoAproveitavelSucessora: prejuizoAproveitavel,
      saldoPrejuizoPerdidoExtinto: prejuizoPerdido,
      fundamentacaoArt581Rir: 'Art. 581 do RIR/2018 e Art. 33 do Decreto-Lei nº 2.341/1987'
    },
    sucessaoCreditosTributarios: {
      creditosTransferiveisSucessora: creditosTransferiveis
    },
    diagnosticoSocietarioFiscal: diagnostico
  });
}
