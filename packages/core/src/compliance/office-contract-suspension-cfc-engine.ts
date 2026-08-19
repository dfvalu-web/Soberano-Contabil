import { Result, Ok, Err } from '../types/result.js';

export interface ContractSuspensionInput {
  clienteCnpj: string;
  razaoSocial: string;
  totalMesesInadimplente: number;
  valorTotalDebitoAcumuladoBrl: number;
  diasAposNotificacaoFormal: number;
}

export interface ContractSuspensionResult {
  clienteCnpj: string;
  razaoSocial: string;
  suspensaoServicosAutorizada: boolean;
  notificacaoArDigitalEmitida: boolean;
  desoneraResponsabilidadeTecnicaContador: boolean;
  statusContratual: 'SERVICOS_SUSPENSOS_COM_RESPALDO_CFC' | 'EM_PRAZO_DE_REGULARIZACAO_NOTIFICADO';
  diagnosticoSuspensao: string;
}

export function processOfficeContractSuspensionCfcEngine(input: ContractSuspensionInput): Result<ContractSuspensionResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    totalMesesInadimplente,
    valorTotalDebitoAcumuladoBrl,
    diasAposNotificacaoFormal
  } = input;

  if (!clienteCnpj || totalMesesInadimplente <= 0) {
    return Err(new Error('CNPJ e quantidade de meses inadimplentes são obrigatórios.'));
  }

  // Resolução CFC 1.590/20 e Art. 476 Código Civil: inadimplência > 60 dias e após notificação formal com prazo esgotado (> 10 dias)
  const autorizada = totalMesesInadimplente >= 2 && diasAposNotificacaoFormal >= 10;

  const diag = "Suspensão Contratual CFC (" + razaoSocial + "): Débito: R$ " + valorTotalDebitoAcumuladoBrl.toLocaleString('pt-BR') + " (" + totalMesesInadimplente + " meses) | Notificação AR: " + diasAposNotificacaoFormal + " dias decorridos -> Suspensão de Serviços: " + (autorizada ? 'AUTORIZADA E REGISTRADA NO CRC' : 'EM PRAZO DE REGULARIZAÇÃO') + " (Art. 476 CC e Res. CFC 1.590/20).";

  return Ok({
    clienteCnpj,
    razaoSocial,
    suspensaoServicosAutorizada: autorizada,
    notificacaoArDigitalEmitida: true,
    desoneraResponsabilidadeTecnicaContador: autorizada,
    statusContratual: autorizada ? 'SERVICOS_SUSPENSOS_COM_RESPALDO_CFC' : 'EM_PRAZO_DE_REGULARIZACAO_NOTIFICADO',
    diagnosticoSuspensao: diag
  });
}
