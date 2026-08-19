import { Result, Ok, Err } from '../types/result.js';

export interface EnquadramentoReportInput {
  clienteCnpj: string;
  razaoSocial: string;
  nomeContadorResponsavel: string;
  crcContador: string;
  regimeRecomendado: string;
  economiaAnualProjetadaBrl: number;
}

export interface EnquadramentoReportResult {
  clienteCnpj: string;
  razaoSocial: string;
  dossieParecerPdfPronto: boolean;
  parecerTextoFormatado: string;
  statusParecer: 'PARECER_DE_ENQUADRAMENTO_EMITIDO_COM_SUCESSO';
  diagnosticoParecer: string;
}

export function processOfficeTaxRegimeEnquadramentoReportEngine(input: EnquadramentoReportInput): Result<EnquadramentoReportResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    nomeContadorResponsavel,
    crcContador,
    regimeRecomendado,
    economiaAnualProjetadaBrl
  } = input;

  if (!clienteCnpj || !regimeRecomendado) {
    return Err(new Error('CNPJ do cliente e regime recomendado são obrigatórios.'));
  }

  const texto = "PARECER TÉCNICO DE ENQUADRAMENTO TRIBUTÁRIO\n" +
    "Cliente: " + razaoSocial + " (CNPJ: " + clienteCnpj + ")\n" +
    "Responsável Técnico: " + nomeContadorResponsavel + " - CRC " + crcContador + "\n\n" +
    "Com base nas projeções financeiras, volume de faturamento e estrutura de custos operacionais, " +
    "RECOMENDA-SE o enquadramento no regime do " + regimeRecomendado + ".\n" +
    "Economia anual projetada: R$ " + economiaAnualProjetadaBrl.toLocaleString('pt-BR') + ".\n" +
    "Opção formal a ser formalizada perante a Receita Federal do Brasil até o último dia útil de janeiro.";

  const diag = "Parecer Técnico de Enquadramento emitido por " + nomeContadorResponsavel + " (" + crcContador + ") para " + razaoSocial + " -> Recomendação: " + regimeRecomendado + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    dossieParecerPdfPronto: true,
    parecerTextoFormatado: texto,
    statusParecer: 'PARECER_DE_ENQUADRAMENTO_EMITIDO_COM_SUCESSO',
    diagnosticoParecer: diag
  });
}
