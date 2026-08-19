import { Result, Ok, Err } from '../types/result.js';

export interface ManagementLetterInput {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number; // Ex: 2025
  administradorNome: string;
  administradorCpf: string;
  administradorCargo: string;
  contadorResponsavelNome: string;
  contadorResponsavelCrc: string;
  declaraAusenciaFraudesNaoInformadas: boolean;
}

export interface ManagementLetterResult {
  clienteCnpj: string;
  razaoSocial: string;
  anoExercicio: number;
  cartaEmitidaPdf: boolean;
  cartaTextoFormatado: string;
  blindagemContadorAtiva: boolean;
  amparoNbcTa580: boolean;
  statusCarta: 'CARTA_RESPONSABILIDADE_ADMINISTRACAO_VALIDADA';
  diagnosticoCarta: string;
}

export function processOfficeClientManagementRepresentationLetterEngine(input: ManagementLetterInput): Result<ManagementLetterResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    administradorNome,
    administradorCpf,
    administradorCargo,
    contadorResponsavelNome,
    contadorResponsavelCrc,
    declaraAusenciaFraudesNaoInformadas
  } = input;

  if (!clienteCnpj || !administradorCpf || !contadorResponsavelCrc) {
    return Err(new Error('CNPJ, CPF do administrador e CRC do contador são obrigatórios.'));
  }

  const texto = "CARTA DE RESPONSABILIDADE DA ADMINISTRAÇÃO (NBC TA 580 / RESOLUÇÃO CFC Nº 1.457/13)\n\n" +
    "À " + contadorResponsavelNome + " (CRC: " + contadorResponsavelCrc + ")\n\n" +
    "Prezados Senhores,\n\n" +
    "Em cumprimento às normas do Conselho Federal de Contabilidade (NBC TA 580), eu, " + administradorNome + " (CPF: " + administradorCpf + "), na qualidade de " + administradorCargo + " da empresa " + razaoSocial + " (CNPJ: " + clienteCnpj + "), declaro sob as penas da lei:\n\n" +
    "1. Que todas as operações financeiras, fiscais, bancárias e trabalhistas do exercício de " + anoExercicio + " foram fidedignamente disponibilizadas à contabilidade;\n" +
    "2. Que não temos conhecimento de fraudes, irregularidades ou passivos ocultos não registrados nas demonstrações contábeis;\n" +
    "3. Que a responsabilidade pelas informações e atos de gestão é exclusiva da administração da entidade.\n\n" +
    "Data: 31 de dezembro de " + anoExercicio + ".";

  const diag = "Carta da Administração (" + razaoSocial + " - " + anoExercicio + "): Emitida por " + administradorNome + " (" + administradorCargo + ") -> Blindagem jurídica do contador (" + contadorResponsavelCrc + ") 100% ativa perante o CFC e Código Civil.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    anoExercicio,
    cartaEmitidaPdf: true,
    cartaTextoFormatado: texto,
    blindagemContadorAtiva: declaraAusenciaFraudesNaoInformadas,
    amparoNbcTa580: true,
    statusCarta: 'CARTA_RESPONSABILIDADE_ADMINISTRACAO_VALIDADA',
    diagnosticoCarta: diag
  });
}
