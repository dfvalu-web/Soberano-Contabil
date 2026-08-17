import { Result, Ok, Err } from '../../types/result.js';

export interface RecofSpedInput {
  empresaCnpj: string;
  numeroAtoHabilitacaoRf: string; // Ex: 'RECOF-2026-SP-0042'
  valorInsumosImportadosCifBrl: number; // Ex: R$ 10.000.000,00
  valorInsumosNacionaisAdquiridosBrl: number; // Ex: R$ 5.000.000,00
  aliquotaMediaImpostoImportacaoPercent: number; // 14%
  aliquotaMediaIpiPercent: number; // 10%
  aliquotaMediaPisCofinsPercent: number; // 9.25%
  aliquotaMediaIcmsImportacaoPercent: number; // 18%
  percentualProducaoDestinadaExportacaoPercent: number; // Ex: 80%
}

export interface RecofSpedResult {
  empresaCnpj: string;
  numeroAtoHabilitacaoRf: string;
  totalInsumosAdquiridosComSuspensaoBrl: number;
  impostosFederaisSuspensosBrl: number;
  icmsImportacaoSuspensoBrl: number;
  totalEconomiaFluxoCaixaSuspensaoBrl: number;
  statusHabilitacaoRecof: 'HABILITADO_RECOF_SPED_COMPLIANT';
  controleBlocoKSpedFiscal: {
    registroK200EstoqueEscriturado: string;
    registroK280CorrecaoApontamento: string;
    statusControleInformatizado: 'INTEGRADO_COM_SUCESSO';
  };
  diagnosticoRecofSped: string;
}

export function processRecofSpedCustomsBondedEngine(input: RecofSpedInput): Result<RecofSpedResult, Error> {
  const {
    empresaCnpj,
    numeroAtoHabilitacaoRf,
    valorInsumosImportadosCifBrl,
    valorInsumosNacionaisAdquiridosBrl,
    aliquotaMediaImpostoImportacaoPercent,
    aliquotaMediaIpiPercent,
    aliquotaMediaPisCofinsPercent,
    aliquotaMediaIcmsImportacaoPercent,
    percentualProducaoDestinadaExportacaoPercent
  } = input;

  if (valorInsumosImportadosCifBrl <= 0 || valorInsumosNacionaisAdquiridosBrl <= 0) {
    return Err(new Error('Valores de insumos importados e nacionais devem ser positivos.'));
  }

  const totalInsumos = valorInsumosImportadosCifBrl + valorInsumosNacionaisAdquiridosBrl;

  // 1. Suspensão de Tributos Federais na Importação e Mercado Interno
  const susIi = valorInsumosImportadosCifBrl * (aliquotaMediaImpostoImportacaoPercent / 100);
  const baseIpi = valorInsumosImportadosCifBrl + susIi;
  const susIpi = (baseIpi * (aliquotaMediaIpiPercent / 100)) + (valorInsumosNacionaisAdquiridosBrl * (aliquotaMediaIpiPercent / 100));
  const susPisCofins = totalInsumos * (aliquotaMediaPisCofinsPercent / 100);

  const impostosFederais = Number((susIi + susIpi + susPisCofins).toFixed(2));
  const icmsSuspenso = Number((valorInsumosImportadosCifBrl * (aliquotaMediaIcmsImportacaoPercent / 100)).toFixed(2));

  const totalEconomia = Number((impostosFederais + icmsSuspenso).toFixed(2));

  const diag = "Regime Especial RECOF-SPED (IN RFB 2.126/22): CNPJ " + empresaCnpj + " (Ato " + numeroAtoHabilitacaoRf + ") | Insumos: R$ " + totalInsumos.toFixed(2) + " -> Tributos Federais Suspensos: R$ " + impostosFederais.toFixed(2) + " | ICMS Suspenso: R$ " + icmsSuspenso.toFixed(2) + " -> Economia de Fluxo de Caixa: R$ " + totalEconomia.toFixed(2) + " com controle no Bloco K.";

  return Ok({
    empresaCnpj,
    numeroAtoHabilitacaoRf,
    totalInsumosAdquiridosComSuspensaoBrl: totalInsumos,
    impostosFederaisSuspensosBrl: impostosFederais,
    icmsImportacaoSuspensoBrl: icmsSuspenso,
    totalEconomiaFluxoCaixaSuspensaoBrl: totalEconomia,
    statusHabilitacaoRecof: 'HABILITADO_RECOF_SPED_COMPLIANT',
    controleBlocoKSpedFiscal: {
      registroK200EstoqueEscriturado: 'K200_ESTOQUE_ESCRITURADO_RECOF',
      registroK280CorrecaoApontamento: 'K280_APONTAMENTO_PRODUCAO_EXPORTACAO',
      statusControleInformatizado: 'INTEGRADO_COM_SUCESSO'
    },
    diagnosticoRecofSped: diag
  });
}
