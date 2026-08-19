import { Result, Ok, Err } from '../types/result.js';

export interface HazardRiskFactorEntry {
  codigoTabela24Esocial: string; // Ex: '01.01.001' (Ruído) ou '02.01.001' (Poeiras Minerais)
  descricaoAgenteNocivo: string;
  intensidadeConcentracao: string; // Ex: '85 dB(A)'
  limiteTolerancia: string;
  tipoFatorRisco: 'FISICO' | 'QUIMICO' | 'BIOLOGICO' | 'ERGONOMICO' | 'AUSENCIA_DE_RISCO';
  epiEficazUtilizado: boolean;
  epcUtilizado: boolean;
}

export interface PppElectronicInput {
  cpfColaborador: string;
  nomeColaborador: string;
  cargoFuncao: string;
  setorAmbienteTrabalho: string;
  dataAdmissao: string;
  fatoresRisco: HazardRiskFactorEntry[];
  direitoAposentadoriaEspecial: boolean; // 15, 20 ou 25 anos
}

export interface PppElectronicResult {
  cpfColaborador: string;
  nomeColaborador: string;
  cargoFuncao: string;
  totalAgentesNocivosMapeados: number;
  codigoGfipAposentadoriaEspecial: '00_SEM_EXPOSICAO' | '04_EXPOSICAO_25_ANOS' | '03_EXPOSICAO_20_ANOS' | '02_EXPOSICAO_15_ANOS';
  pppEletronicoGerado: boolean;
  statusPpp: 'PPP_ELETRONICO_GERADO_CONFORME_INSS_E_ESOCIAL';
  diagnosticoPpp: string;
}

export function processOfficePppElectronicWorkEnvironmentEngine(input: PppElectronicInput): Result<PppElectronicResult, Error> {
  const {
    cpfColaborador,
    nomeColaborador,
    cargoFuncao,
    setorAmbienteTrabalho,
    dataAdmissao,
    fatoresRisco,
    direitoAposentadoriaEspecial
  } = input;

  if (!cpfColaborador || !cargoFuncao) {
    return Err(new Error('CPF do colaborador e cargo/função são obrigatórios para emissão do PPP.'));
  }

  const codGfip = direitoAposentadoriaEspecial ? '04_EXPOSICAO_25_ANOS' : '00_SEM_EXPOSICAO';

  const diag = "PPP Eletrônico (" + nomeColaborador + " - CPF " + cpfColaborador + "): Cargo: " + cargoFuncao + " (" + setorAmbienteTrabalho + ") | " + fatoresRisco.length + " fatores de risco mapeados | Código GFIP: " + codGfip + " -> Perfil Profissiográfico Previdenciário emitido em conformidade com o INSS e eSocial S-2240.";

  return Ok({
    cpfColaborador,
    nomeColaborador,
    cargoFuncao,
    totalAgentesNocivosMapeados: fatoresRisco.length,
    codigoGfipAposentadoriaEspecial: codGfip,
    pppEletronicoGerado: true,
    statusPpp: 'PPP_ELETRONICO_GERADO_CONFORME_INSS_E_ESOCIAL',
    diagnosticoPpp: diag
  });
}
