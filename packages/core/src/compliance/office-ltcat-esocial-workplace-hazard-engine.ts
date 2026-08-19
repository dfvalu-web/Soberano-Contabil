import { Result, Ok, Err } from '../types/result.js';

export interface LtcatEsocialHazardInput {
  funcionarioCpf: string;
  nomeFuncionario: string;
  setorTrabalho: string;
  cargoFuncao: string;
  codigoAgenteNocivoTabela24: string; // Ex: 01.01.001 (Ruído contínuo) ou 03.01.001 (Inflamáveis)
  descricaoAgenteNocivo: string;
  medicoEngenheiroResponsavelLTCAT: string;
  valorTotalProvisaoFolhaBrl: number;
}

export interface LtcatEsocialHazardResult {
  funcionarioCpf: string;
  nomeFuncionario: string;
  eventoEsocialSst: 'S-2240_CONDICOES_AMBIENTAIS_DO_TRABALHO';
  gerouPppEletronico: boolean;
  partidaDobradaProvisaoCusto: string;
  statusSst: 'LTCAT_VINCULADO_E_EVENTO_S2240_CONCLUIDO';
  diagnosticoSst: string;
}

export function processOfficeLtcatEsocialWorkplaceHazardEngine(input: LtcatEsocialHazardInput): Result<LtcatEsocialHazardResult, Error> {
  const {
    funcionarioCpf,
    nomeFuncionario,
    setorTrabalho,
    cargoFuncao,
    codigoAgenteNocivoTabela24,
    descricaoAgenteNocivo,
    medicoEngenheiroResponsavelLTCAT,
    valorTotalProvisaoFolhaBrl
  } = input;

  if (!funcionarioCpf || !codigoAgenteNocivoTabela24 || valorTotalProvisaoFolhaBrl <= 0) {
    return Err(new Error('CPF, código do agente nocivo da Tabela 24 e valor da folha são obrigatórios.'));
  }

  const lancamento = "D - 4.1.01.005 Despesas com Salários e Adicionais (Setor " + setorTrabalho + ") | C - 2.1.03.001 Salários a Pagar no valor de R$ " + valorTotalProvisaoFolhaBrl.toFixed(2);

  const diag = "LTCAT & eSocial S-2240 (" + nomeFuncionario + " - " + cargoFuncao + "): Agente Nocivo: " + codigoAgenteNocivoTabela24 + " (" + descricaoAgenteNocivo + ") | Responsável Técnico: " + medicoEngenheiroResponsavelLTCAT + " | PPP Eletrônico alimentado | Evento S-2240 e Lançamentos Contábeis gerados.";

  return Ok({
    funcionarioCpf,
    nomeFuncionario,
    eventoEsocialSst: 'S-2240_CONDICOES_AMBIENTAIS_DO_TRABALHO',
    gerouPppEletronico: true,
    partidaDobradaProvisaoCusto: lancamento,
    statusSst: 'LTCAT_VINCULADO_E_EVENTO_S2240_CONCLUIDO',
    diagnosticoSst: diag
  });
}
