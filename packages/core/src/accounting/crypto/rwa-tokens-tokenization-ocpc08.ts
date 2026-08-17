import { Result, Ok, Err } from '../../types/result.js';

export type RwaTokenType = 'RECEBIVEL_AGRO_CPR_DIGITAL' | 'DEBENTURE_TOKENIZADA' | 'IMOVEL_FRACIONADO_RWA';

export interface RwaTokenInput {
  tokenId: string;
  smartContractAddress: string;
  emissorNome: string;
  tipoToken: RwaTokenType;
  quantidadeTokens: number;
  custoAquisicaoUnitarioBrl: number;
  valorJustoMercadoUnitarioBrl: number; // Preço na blockchain / DVP
  taxaYieldAnualPactuadaPercent?: number; // Ex: CDI + 2,5% ou 12% a.a.
}

export interface RwaTokenResult {
  tokenId: string;
  smartContractAddress: string;
  classificacaoContabil: 'CPC48_INSTRUMENTO_FINANCEIRO_FVTPL' | 'CPC04_INTANGIVEL_REAVALIACAO';
  custoTotalAquisicaoBrl: number;
  valorJustoTotalBrl: number;
  ajusteValorJustoResultadoBrl: number; // Ganho/Perda DRE
  rendimentoYieldProjetadoMensalBrl: number;
  lancamentosContabeis: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  }[];
  diagnosticoRwa: string;
}

export function evaluateRwaTokenizationOcpc08(input: RwaTokenInput): Result<RwaTokenResult, Error> {
  const {
    tokenId,
    smartContractAddress,
    emissorNome,
    tipoToken,
    quantidadeTokens,
    custoAquisicaoUnitarioBrl,
    valorJustoMercadoUnitarioBrl,
    taxaYieldAnualPactuadaPercent = 12.0
  } = input;

  if (quantidadeTokens <= 0 || custoAquisicaoUnitarioBrl <= 0) {
    return Err(new Error('Quantidade de tokens e custo de aquisição devem ser maiores que zero.'));
  }

  // OCPC 08 / CPC 48 / CPC 04:
  // Tokens que conferem direitos a fluxos de caixa contratuais (recebíveis e debêntures) são mensurados a Valor Justo por meio do Resultado (FVTPL).
  const custoTotal = Number((quantidadeTokens * custoAquisicaoUnitarioBrl).toFixed(2));
  const valorJustoTotal = Number((quantidadeTokens * valorJustoMercadoUnitarioBrl).toFixed(2));
  const ajusteFv = Number((valorJustoTotal - custoTotal).toFixed(2));

  // Yield Mensal Projetado
  const yieldMensal = Number((valorJustoTotal * (taxaYieldAnualPactuadaPercent / 100 / 12)).toFixed(2));

  const lancamentos = [
    {
      debito: '1.1.4.05 - Tokens RWA em Carteira (FVTPL)',
      credito: '1.1.1.02 - Bancos Conta Movimento / DVP Liquidação',
      valor: custoTotal,
      historico: 'Aquisição de ' + quantidadeTokens + ' tokens RWA (' + tipoToken + ') de ' + emissorNome
    }
  ];

  if (ajusteFv !== 0) {
    lancamentos.push({
      debito: ajusteFv > 0 ? '1.1.4.05 - Tokens RWA em Carteira (FVTPL)' : '3.2.1.10 - Perda por Desvalorização de Ativos Digitais',
      credito: ajusteFv > 0 ? '3.1.1.15 - Ganho com Valor Justo de Tokens RWA' : '1.1.4.05 - Tokens RWA em Carteira (FVTPL)',
      valor: Math.abs(ajusteFv),
      historico: 'Ajuste a Valor Justo de Tokens RWA no encerramento contábil'
    });
  }

  const diag = "Tokens RWA (OCPC 08 & CPC 48): " + emissorNome + " (" + tipoToken + "). Contrato: " + smartContractAddress.substring(0, 10) + "... Qtd: " + quantidadeTokens + " | Custo Total: R$ " + custoTotal.toFixed(2) + " vs Valor Justo: R$ " + valorJustoTotal.toFixed(2) + " -> Ajuste FVTPL: R$ " + ajusteFv.toFixed(2) + " | Yield Mensal: R$ " + yieldMensal.toFixed(2) + ".";

  return Ok({
    tokenId,
    smartContractAddress,
    classificacaoContabil: 'CPC48_INSTRUMENTO_FINANCEIRO_FVTPL',
    custoTotalAquisicaoBrl: custoTotal,
    valorJustoTotalBrl: valorJustoTotal,
    ajusteValorJustoResultadoBrl: ajusteFv,
    rendimentoYieldProjetadoMensalBrl: yieldMensal,
    lancamentosContabeis: lancamentos,
    diagnosticoRwa: diag
  });
}
