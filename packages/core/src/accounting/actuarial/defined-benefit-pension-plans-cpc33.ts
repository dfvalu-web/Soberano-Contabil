import { Result, Ok, Err } from '../../types/result.js';

export interface PensionDefinedBenefitInput {
  planoPrevidenciaId: string;
  nomeEntidadeFechada: string; // Ex: 'Fundação Soberano de Seguridade Social'
  obrigacaoBeneficioDefinidoInicioDboBrl: number; // Ex: R$ 50.000.000,00
  ativosDoPlanoInicioValorJustoBrl: number; // Ex: R$ 42.000.000,00 -> Déficit Inicial = R$ 8.000.000,00
  custoServicoCorrenteAnoBrl: number; // Ex: R$ 2.500.000,00 (DRE)
  taxaDescontoAtuarialAnualPercent: number; // Ex: 10.5% a.a.
  beneficiosPagosNoAnoBrl: number; // Ex: R$ 3.000.000,00
  contribuicoesPatrocinadoraPagasBrl: number; // Ex: R$ 2.800.000,00
  ganhoOuPerdaAtuarialRemensuracaoPlBrl: number; // Ex: - R$ 600.000,00 (Perda Atuarial em ORA)
}

export interface PensionDefinedBenefitResult {
  planoPrevidenciaId: string;
  nomeEntidadeFechada: string;
  obrigacaoBeneficioDefinidoFinalDboBrl: number;
  ativosDoPlanoFinalValorJustoBrl: number;
  deficitAtuarialLiquidoPassivoBalancoBrl: number;
  despesaTotalPrevidenciaReconhecidaDreBrl: number;
  remensuracaoAtuarialOutrosResultadosPlBrl: number;
  statusConformidadeCpc33: 'AVALIACAO_ATUARIAL_CPC33_CONFORME';
  lancamentoContabilPatrocinadora: {
    debitoDespesaPrevidenciariaDreBrl: number;
    debitoRemensuracaoAtuarialOraPlBrl: number;
    creditoCaixaContribuicoesBrl: number;
    creditoPassivoAtuarialBeneficioDefinidoBrl: number;
  };
  diagnosticoCpc33: string;
}

export function processDefinedBenefitPensionPlansCpc33(input: PensionDefinedBenefitInput): Result<PensionDefinedBenefitResult, Error> {
  const {
    planoPrevidenciaId,
    nomeEntidadeFechada,
    obrigacaoBeneficioDefinidoInicioDboBrl,
    ativosDoPlanoInicioValorJustoBrl,
    custoServicoCorrenteAnoBrl,
    taxaDescontoAtuarialAnualPercent,
    beneficiosPagosNoAnoBrl,
    contribuicoesPatrocinadoraPagasBrl,
    ganhoOuPerdaAtuarialRemensuracaoPlBrl
  } = input;

  if (obrigacaoBeneficioDefinidoInicioDboBrl <= 0 || taxaDescontoAtuarialAnualPercent <= 0) {
    return Err(new Error('Obrigação atuarial e taxa de desconto devem ser positivas.'));
  }

  // 1. Juros Líquidos sobre o Passivo/Ativo Líquido Atuarial (CPC 33 item 83)
  const deficitInicial = obrigacaoBeneficioDefinidoInicioDboBrl - ativosDoPlanoInicioValorJustoBrl;
  const jurosLiquidosDre = Number((deficitInicial * (taxaDescontoAtuarialAnualPercent / 100)).toFixed(2));

  // Despesa total na DRE = Custo do Serviço Corrente + Juros Líquidos
  const despesaTotalDre = Number((custoServicoCorrenteAnoBrl + jurosLiquidosDre).toFixed(2));

  // 2. Evolução da DBO (Obrigação)
  const jurosDbo = obrigacaoBeneficioDefinidoInicioDboBrl * (taxaDescontoAtuarialAnualPercent / 100);
  const dboFinal = Number((obrigacaoBeneficioDefinidoInicioDboBrl + custoServicoCorrenteAnoBrl + jurosDbo - beneficiosPagosNoAnoBrl - ganhoOuPerdaAtuarialRemensuracaoPlBrl).toFixed(2));

  // 3. Evolução dos Ativos do Plano
  const rendimentoAtivosPlano = ativosDoPlanoInicioValorJustoBrl * (taxaDescontoAtuarialAnualPercent / 100);
  const ativosFinal = Number((ativosDoPlanoInicioValorJustoBrl + rendimentoAtivosPlano + contribuicoesPatrocinadoraPagasBrl - beneficiosPagosNoAnoBrl).toFixed(2));

  // 4. Déficit Líquido Final no Balanço
  const deficitFinal = Number((dboFinal - ativosFinal).toFixed(2));

  const diag = "Plano de Beneficio Definido (CPC 33 / IAS 19): " + planoPrevidenciaId + " (" + nomeEntidadeFechada + ") | DBO Final: R$ " + dboFinal.toFixed(2) + " vs Ativos do Plano: R$ " + ativosFinal.toFixed(2) + " -> Deficit Passivo no Balanco: R$ " + deficitFinal.toFixed(2) + " | Despesa DRE: R$ " + despesaTotalDre.toFixed(2) + " | Perda Atuarial em ORA (PL): R$ " + Math.abs(ganhoOuPerdaAtuarialRemensuracaoPlBrl).toFixed(2) + ".";

  return Ok({
    planoPrevidenciaId,
    nomeEntidadeFechada,
    obrigacaoBeneficioDefinidoFinalDboBrl: dboFinal,
    ativosDoPlanoFinalValorJustoBrl: ativosFinal,
    deficitAtuarialLiquidoPassivoBalancoBrl: deficitFinal,
    despesaTotalPrevidenciaReconhecidaDreBrl: despesaTotalDre,
    remensuracaoAtuarialOutrosResultadosPlBrl: ganhoOuPerdaAtuarialRemensuracaoPlBrl,
    statusConformidadeCpc33: 'AVALIACAO_ATUARIAL_CPC33_CONFORME',
    lancamentoContabilPatrocinadora: {
      debitoDespesaPrevidenciariaDreBrl: despesaTotalDre,
      debitoRemensuracaoAtuarialOraPlBrl: Math.abs(ganhoOuPerdaAtuarialRemensuracaoPlBrl),
      creditoCaixaContribuicoesBrl: contribuicoesPatrocinadoraPagasBrl,
      creditoPassivoAtuarialBeneficioDefinidoBrl: Number((despesaTotalDre + Math.abs(ganhoOuPerdaAtuarialRemensuracaoPlBrl) - contribuicoesPatrocinadoraPagasBrl).toFixed(2))
    },
    diagnosticoCpc33: diag
  });
}
