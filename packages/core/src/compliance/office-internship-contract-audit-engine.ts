import { Result, Ok, Err } from '../types/result.js';

export interface InternshipContractInput {
  clienteCnpj: string;
  razaoSocial: string;
  estagiarioCpf: string;
  nomeEstagiario: string;
  instituicaoEnsinoNome: string;
  valorBolsaAuxilioBrl: number;
  horasSemanais: number; // Máximo 30h
  apoliceSeguroNumero: string;
  dataInicioEstagio: string; // YYYY-MM-DD
  mesesDecorridosEstagio: number; // Máximo 24 meses (2 anos)
}

export interface InternshipContractResult {
  clienteCnpj: string;
  razaoSocial: string;
  estagiarioCpf: string;
  nomeEstagiario: string;
  horasSemanaisEmConformidade: boolean;
  duracaoMaximaEmConformidade: boolean;
  categoriaEsocial: '901_ESTAGIARIO_SEM_VINCULO';
  eventoEsocial: 'S-2300';
  statusEstagio: 'CONTRATO_ESTAGIO_100_CONFORME_LEI_11788' | 'ALERTA_RISCO_VINCULO_EMPREGATICIO_CLT';
  diagnosticoEstagio: string;
}

export function processOfficeInternshipContractAuditEngine(input: InternshipContractInput): Result<InternshipContractResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    estagiarioCpf,
    nomeEstagiario,
    instituicaoEnsinoNome,
    valorBolsaAuxilioBrl,
    horasSemanais,
    apoliceSeguroNumero,
    dataInicioEstagio,
    mesesDecorridosEstagio
  } = input;

  if (!clienteCnpj || !estagiarioCpf || !apoliceSeguroNumero || valorBolsaAuxilioBrl <= 0) {
    return Err(new Error('CNPJ, CPF, apólice de seguro e bolsa auxílio são obrigatórios.'));
  }

  const horasOk = horasSemanais <= 30;
  const duracaoOk = mesesDecorridosEstagio <= 24;

  const conforme = horasOk && duracaoOk;
  const status = conforme ? 'CONTRATO_ESTAGIO_100_CONFORME_LEI_11788' : 'ALERTA_RISCO_VINCULO_EMPREGATICIO_CLT';

  const diag = "Estágio Lei 11.788/08 (" + nomeEstagiario + " - " + instituicaoEnsinoNome + "): Carga " + horasSemanais + "h/sem | Duração: " + mesesDecorridosEstagio + " meses | Bolsa: R$ " + valorBolsaAuxilioBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " | Seguro: " + apoliceSeguroNumero + " | eSocial S-2300 (TSVE 901) -> Status: " + status + ".";

  return Ok({
    clienteCnpj,
    razaoSocial,
    estagiarioCpf,
    nomeEstagiario,
    horasSemanaisEmConformidade: horasOk,
    duracaoMaximaEmConformidade: duracaoOk,
    categoriaEsocial: '901_ESTAGIARIO_SEM_VINCULO',
    eventoEsocial: 'S-2300',
    statusEstagio: status,
    diagnosticoEstagio: diag
  });
}
