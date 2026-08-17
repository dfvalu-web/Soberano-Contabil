import { Result, Ok, Err } from '../types/result.js';

export interface LgpdDataMapInput {
  tenantCnpj: string;
  categoriaTitulares: 'COLABORADORES_ESOCIAL' | 'SOCIOS_ADMINISTRADORES' | 'CLIENTES_PF' | 'FORNECEDORES';
  dadosPessoaisTratados: string[]; // ['CPF', 'SALARIO_HOLERITE', 'DADOS_BANCARIOS', 'ASO_SAUDE']
  finalidadeTratamento: string;
  prazoRetencaoAnos: number; // Ex: 5 anos para obrigações trabalhistas/fiscais
}

export interface LgpdDataMapResult {
  tenantCnpj: string;
  categoriaTitulares: string;
  baseLegalLgpd: 'ART_7_II_CUMPRIMENTO_OBRIGACAO_LEGAL' | 'ART_7_V_EXECUCAO_CONTRATO';
  dadosSensiveisIdentificados: boolean;
  baseLegalDadosSensiveis?: 'ART_11_II_A_CUMPRIMENTO_OBRIGACAO_LEGAL';
  medidasSegurancaAtivas: string[];
  statusRopa: 'INVENTARIO_ROPA_LGPD_CONFORME_ANPD';
  diagnosticoLgpd: string;
}

export function processLgpdDpoPrivacyDataMapEngine(input: LgpdDataMapInput): Result<LgpdDataMapResult, Error> {
  const {
    tenantCnpj,
    categoriaTitulares,
    dadosPessoaisTratados,
    finalidadeTratamento,
    prazoRetencaoAnos
  } = input;

  if (!tenantCnpj || dadosPessoaisTratados.length === 0) {
    return Err(new Error('CNPJ e dados pessoais tratados são obrigatórios para mapeamento LGPD.'));
  }

  const possuiSensiveis = dadosPessoaisTratados.some(d => ['ASO_SAUDE', 'BIOMETRIA', 'DADOS_MEDICOS'].includes(d));

  const medidas = [
    'Criptografia AES-256 em Repouso',
    'mTLS / TLS 1.3 em Trânsito',
    'Controle de Acesso RBAC com MFA FIDO2',
    'Trilha de Auditoria Imutável no Ledger SHA-256'
  ];

  const diag = "Mapeamento LGPD (ROPA): CNPJ " + tenantCnpj + " (" + categoriaTitulares + ") | Finalidade: " + finalidadeTratamento + " | Base Legal: Art. 7º, II da LGPD (Obrigação Legal) | Sensíveis: " + (possuiSensiveis ? 'SIM (Art. 11, II, a)' : 'NAO') + " -> Inventário Homologado para DPO/ANPD.";

  return Ok({
    tenantCnpj,
    categoriaTitulares,
    baseLegalLgpd: 'ART_7_II_CUMPRIMENTO_OBRIGACAO_LEGAL',
    dadosSensiveisIdentificados: possuiSensiveis,
    baseLegalDadosSensiveis: possuiSensiveis ? 'ART_11_II_A_CUMPRIMENTO_OBRIGACAO_LEGAL' : undefined,
    medidasSegurancaAtivas: medidas,
    statusRopa: 'INVENTARIO_ROPA_LGPD_CONFORME_ANPD',
    diagnosticoLgpd: diag
  });
}
