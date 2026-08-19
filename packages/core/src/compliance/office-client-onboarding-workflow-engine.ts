import { Result, Ok, Err } from '../types/result.js';

export interface ClientOnboardingInput {
  clienteCnpj: string;
  razaoSocial: string;
  emailContatoPrincipal: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  procuracaoEcacAtiva: boolean;
  procuracaoSefazAtiva: boolean;
  cndFederalValida: boolean;
  cndFgtsValida: boolean;
  cndTrabalhistaValida: boolean;
}

export interface ClientOnboardingResult {
  clienteCnpj: string;
  razaoSocial: string;
  scoreProntidaoOnboardingPercent: number; // Ex: 100%
  pendenciasCadastrais: string[];
  kitBoasVindasLiberado: boolean;
  statusOnboarding: 'ONBOARDING_CONCLUIDO_100_CONFORME' | 'ONBOARDING_EM_ANDAMENTO_COM_PENDENCIAS';
  diagnosticoOnboarding: string;
}

export function processOfficeClientOnboardingWorkflowEngine(input: ClientOnboardingInput): Result<ClientOnboardingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    emailContatoPrincipal,
    regimeTributario,
    procuracaoEcacAtiva,
    procuracaoSefazAtiva,
    cndFederalValida,
    cndFgtsValida,
    cndTrabalhistaValida
  } = input;

  if (!clienteCnpj || !razaoSocial || !emailContatoPrincipal) {
    return Err(new Error('CNPJ, Razão Social e E-mail de contato são obrigatórios para onboarding.'));
  }

  const pendencias: string[] = [];
  let pontos = 0;

  if (procuracaoEcacAtiva) pontos += 20;
  else pendencias.push('Procuração Eletrônica e-CAC RFB pendente');

  if (procuracaoSefazAtiva) pontos += 20;
  else pendencias.push('Acesso/Procuração SEFAZ Estadual pendente');

  if (cndFederalValida) pontos += 20;
  else pendencias.push('CND Federal com débitos/pendências preexistentes');

  if (cndFgtsValida) pontos += 20;
  else pendencias.push('CRF FGTS irregular');

  if (cndTrabalhistaValida) pontos += 20;
  else pendencias.push('CNDT Trabalhista com apontamentos');

  const isConcluido = pontos === 100;
  const status = isConcluido ? 'ONBOARDING_CONCLUIDO_100_CONFORME' : 'ONBOARDING_EM_ANDAMENTO_COM_PENDENCIAS';

  const diag = "Onboarding Digital (" + razaoSocial + " - " + regimeTributario + "): Prontidão: " + pontos + "% | Pendências: " + pendencias.length + " | Kit de Boas-Vindas: " + (isConcluido ? "Liberado para " + emailContatoPrincipal : "Aguardando regularização de procurações") + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    scoreProntidaoOnboardingPercent: pontos,
    pendenciasCadastrais: pendencias,
    kitBoasVindasLiberado: isConcluido,
    statusOnboarding: status,
    diagnosticoOnboarding: diag
  });
}
