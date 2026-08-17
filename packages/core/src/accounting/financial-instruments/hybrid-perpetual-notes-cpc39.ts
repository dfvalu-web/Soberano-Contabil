import { Result, Ok, Err } from '../../types/result.js';

export interface HybridPerpetualInput {
  instrumentoId: string;
  emissorNome: string; // Ex: 'Soberano Energia Renovável S.A.'
  valorEmissaoPrincipalBrl: number;
  taxaCupomAnualPercent: number; // Ex: 8,5% a.a.
  possuiObrigacaoContratualResgate: boolean; // false = perpétuo sem vencimento
  possuiDiscricionariedadeDiferirCupons: boolean; // true = pode cancelar/diferir cupons sem default
}

export interface HybridPerpetualResult {
  instrumentoId: string;
  emissorNome: string;
  classificacaoContabil: 'PATRIMONIO_LIQUIDO_EQUITY' | 'PASSIVO_FINANCEIRO_LIABILITY';
  valorPrincipalContabilBrl: number;
  valorCupomAnualBrl: number;
  tratamentoContabilCupom: 'DISTRIBUICAO_LUCROS_EQUITY' | 'DESPESA_FINANCEIRA_DRE';
  lancamentoEmissao: {
    debito: string;
    credito: string;
    valor: number;
    historico: string;
  };
  diagnosticoCpc39: string;
}

export function processHybridPerpetualNotesCpc39(input: HybridPerpetualInput): Result<HybridPerpetualResult, Error> {
  const {
    instrumentoId,
    emissorNome,
    valorEmissaoPrincipalBrl,
    taxaCupomAnualPercent,
    possuiObrigacaoContratualResgate,
    possuiDiscricionariedadeDiferirCupons
  } = input;

  if (valorEmissaoPrincipalBrl <= 0 || taxaCupomAnualPercent <= 0) {
    return Err(new Error('Valor da emissão e taxa do cupom devem ser maiores que zero.'));
  }

  // CPC 39 (IAS 32) Itens 15-20:
  // Se o instrumento não possui obrigação contratual de entregar caixa para resgate do principal
  // e o emissor tem discricionariedade incondicional para não pagar ou diferir os cupons,
  // o instrumento classifica-se como PATRIMÔNIO LÍQUIDO (Equity).
  const isEquity = !possuiObrigacaoContratualResgate && possuiDiscricionariedadeDiferirCupons;
  const classificacao = isEquity ? 'PATRIMONIO_LIQUIDO_EQUITY' : 'PASSIVO_FINANCEIRO_LIABILITY';
  const tratamentoCupom = isEquity ? 'DISTRIBUICAO_LUCROS_EQUITY' : 'DESPESA_FINANCEIRA_DRE';

  const valorCupom = Number((valorEmissaoPrincipalBrl * (taxaCupomAnualPercent / 100)).toFixed(2));

  const lancamento = {
    debito: '1.1.1.02 - Bancos Conta Movimento',
    credito: isEquity
      ? '2.4.1.08 - Outros Instrumentos Patrimoniais (Debêntures Perpétuas / Título Híbrido)'
      : '2.2.1.05 - Empréstimos e Financiamentos / Debêntures a Pagar (Passivo Não Circulante)',
    valor: valorEmissaoPrincipalBrl,
    historico: 'Emissão de títulos híbridos de capital perpétuos (' + instrumentoId + ')'
  };

  const diag = "Instrumentos Financeiros Hibridos (CPC 39 / IAS 32): " + emissorNome + " (" + instrumentoId + "). Principal: R$ " + valorEmissaoPrincipalBrl.toFixed(2) + " | Cupom: " + taxaCupomAnualPercent.toFixed(2) + "% a.a. (R$ " + valorCupom.toFixed(2) + "/ano) -> CLASSIFICACAO: " + classificacao + " | Tratamento Cupom: " + tratamentoCupom + ".";

  return Ok({
    instrumentoId,
    emissorNome,
    classificacaoContabil: classificacao,
    valorPrincipalContabilBrl: valorEmissaoPrincipalBrl,
    valorCupomAnualBrl: valorCupom,
    tratamentoContabilCupom: tratamentoCupom,
    lancamentoEmissao: lancamento,
    diagnosticoCpc39: diag
  });
}
