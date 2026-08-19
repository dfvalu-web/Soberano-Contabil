import { Result, Ok, Err } from '../types/result.js';

export interface LicensingRiskInput {
  clienteCnpj: string;
  razaoSocial: string;
  cnaePrincipal: string;
  grauRiscoAtividade: 'NIVEL_I_LEVE_BAIXO_RISCO' | 'NIVEL_II_MODERADO_MEDIO_RISCO' | 'NIVEL_III_ALTO_RISCO';
  possuiAtendimentoPublico: boolean;
  areaEdificadaM2: number;
}

export interface LicensingRiskResult {
  clienteCnpj: string;
  razaoSocial: string;
  grauRiscoAtividade: string;
  dispensaAlvaraLeiLiberdadeEconomica13874: boolean;
  exigeAvcbVistoriaPreviaBombeiros: boolean;
  tipoLicencaBombeiros: 'DISPENSADO' | 'CLCB_SIMPLIFICADO' | 'AVCB_PROJETO_TECNICO';
  statusLicenciamento: 'LICENCIAMENTO_INTEGRADO_CONCLUIDO';
  diagnosticoLicenciamento: string;
}

export function processOfficeLicensingFireSanitaryRiskEngine(input: LicensingRiskInput): Result<LicensingRiskResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    cnaePrincipal,
    grauRiscoAtividade,
    possuiAtendimentoPublico,
    areaEdificadaM2
  } = input;

  if (!clienteCnpj || !cnaePrincipal) {
    return Err(new Error('CNPJ do cliente e CNAE principal são obrigatórios.'));
  }

  const baixoRisco = grauRiscoAtividade === 'NIVEL_I_LEVE_BAIXO_RISCO';
  const tipoBombeiro = baixoRisco ? 'CLCB_SIMPLIFICADO' : (areaEdificadaM2 > 750 ? 'AVCB_PROJETO_TECNICO' : 'CLCB_SIMPLIFICADO');

  const diag = "Licenciamento Integrado (" + razaoSocial + "): Grau de Risco: " + grauRiscoAtividade + " | Dispensa de Alvará (Lei 13.874/19): " + (baixoRisco ? "SIM (Início Imediato das Atividades)" : "NÃO (Sujeito a Licenças)") + " | Bombeiros: " + tipoBombeiro + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    grauRiscoAtividade,
    dispensaAlvaraLeiLiberdadeEconomica13874: baixoRisco,
    exigeAvcbVistoriaPreviaBombeiros: !baixoRisco,
    tipoLicencaBombeiros: tipoBombeiro,
    statusLicenciamento: 'LICENCIAMENTO_INTEGRADO_CONCLUIDO',
    diagnosticoLicenciamento: diag
  });
}
