import { Result, Ok, Err } from '../../types/result.js';

export interface StreamingDigitalTaxInput {
  plataformaId: string;
  plataformaNome: string; // Ex: 'Soberano Play Entretenimento Digital S.A.'
  competencia: string; // Ex: '2026-04'
  receitaAssinaturasBrasilBrl: number;
  totalAssinantesAtivos: number;
  aliquotaIssqnPercent?: number; // Padrão 2% a 5% (ex: 2.0% no domicílio do tomador)
  valorRemessasLicenciamentoExteriorBrl: number; // Remessas para estúdios no exterior
  condecineObrasEstrangeirasCatalogoBrl?: number; // CONDECINE anual estimada
}

export interface StreamingDigitalTaxResult {
  plataformaId: string;
  plataformaNome: string;
  competencia: string;
  issqnDevidoDomicilioTomadorBrl: number; // LC 157/16 Art. 3º Item 1.09
  pisCofinsFaturamento925PercentBrl: number; // 9,25%
  pisCofinsImportacaoRemessas965PercentBrl: number; // 9,65% s/ remessa
  cideRoyaltiesRemessas10PercentBrl: number; // 10% s/ remessa
  condecineAudiovisualDevidaBrl: number;
  totalTributosPlataformaBrl: number;
  diagnosticoStreaming: string;
}

export function processStreamingDigitalServicesTaxEngine(input: StreamingDigitalTaxInput): Result<StreamingDigitalTaxResult, Error> {
  const {
    plataformaId,
    plataformaNome,
    competencia,
    receitaAssinaturasBrasilBrl,
    totalAssinantesAtivos,
    aliquotaIssqnPercent = 2.0,
    valorRemessasLicenciamentoExteriorBrl,
    condecineObrasEstrangeirasCatalogoBrl = 50000.00
  } = input;

  if (receitaAssinaturasBrasilBrl <= 0 || totalAssinantesAtivos <= 0) {
    return Err(new Error('Receita de assinaturas e total de assinantes devem ser maiores que zero.'));
  }

  // LC 157/2016 (Item 1.09 da Lista do ISSQN) e STF ADI 5835:
  // 1. ISSQN devido aos Municípios onde residem os usuários assinantes
  const issqn = Number((receitaAssinaturasBrasilBrl * (aliquotaIssqnPercent / 100)).toFixed(2));

  // 2. PIS (1,65%) e COFINS (7,60%) sobre o faturamento nacional = 9,25%
  const pisCofinsNacional = Number((receitaAssinaturasBrasilBrl * 0.0925).toFixed(2));

  // 3. Tributação sobre Remessas ao Exterior por Licenciamento de Conteúdo:
  // PIS/COFINS Importação = 9,65%
  const pisCofinsImportacao = Number((valorRemessasLicenciamentoExteriorBrl * 0.0965).toFixed(2));
  // CIDE-Royalties = 10,00%
  const cideRemessas = Number((valorRemessasLicenciamentoExteriorBrl * 0.10).toFixed(2));

  const totalTributos = Number((issqn + pisCofinsNacional + pisCofinsImportacao + cideRemessas + condecineObrasEstrangeirasCatalogoBrl).toFixed(2));

  const diag = "Streaming e Midia Digital (LC 157/16 & Condecine): " + plataformaNome + " (" + competencia + "). " + totalAssinantesAtivos.toLocaleString('pt-BR') + " assinantes | Receita: R$ " + receitaAssinaturasBrasilBrl.toFixed(2) + ". ISSQN Domicilio (" + aliquotaIssqnPercent + "%): R$ " + issqn.toFixed(2) + " | PIS/COFINS (9,25%): R$ " + pisCofinsNacional.toFixed(2) + " | PIS/COFINS Imp (9,65%): R$ " + pisCofinsImportacao.toFixed(2) + " | CIDE (10%): R$ " + cideRemessas.toFixed(2) + " | CONDECINE: R$ " + condecineObrasEstrangeirasCatalogoBrl.toFixed(2) + " = Total Tributos: R$ " + totalTributos.toFixed(2) + ".";

  return Ok({
    plataformaId,
    plataformaNome,
    competencia,
    issqnDevidoDomicilioTomadorBrl: issqn,
    pisCofinsFaturamento925PercentBrl: pisCofinsNacional,
    pisCofinsImportacaoRemessas965PercentBrl: pisCofinsImportacao,
    cideRoyaltiesRemessas10PercentBrl: cideRemessas,
    condecineAudiovisualDevidaBrl: condecineObrasEstrangeirasCatalogoBrl,
    totalTributosPlataformaBrl: totalTributos,
    diagnosticoStreaming: diag
  });
}
