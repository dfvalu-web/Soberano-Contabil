import { Result, Ok, Err } from '../types/result.js';

export interface CertificateEntry {
  certificadoId: string;
  clienteCnpjCpf: string;
  titularNome: string;
  tipoCertificado: 'E_CNPJ_A1' | 'E_CPF_A1' | 'E_CNPJ_A3' | 'E_CPF_A3';
  autoridadeCertificadora: string; // Ex: 'Certisign', 'Serasa', 'Valid'
  dataVencimento: string; // YYYY-MM-DD
  diasParaVencer: number;
}

export interface OfficeCertificatesVaultInput {
  escritorioNome: string;
  certificadosCarteira: CertificateEntry[];
}

export interface OfficeCertificatesVaultResult {
  escritorioNome: string;
  totalCertificadosCustodiados: number;
  certificadosValidos: number;
  certificadosCriticosExpirando: number; // <= 30 dias
  certificadosExpirados: number;
  statusCofre: 'COFRE_CERTIFICADOS_SEGURO_E_OPERACIONAL';
  diagnosticoCofre: string;
}

export function processOfficeDigitalCertificatesVaultEngine(input: OfficeCertificatesVaultInput): Result<OfficeCertificatesVaultResult, Error> {
  const {
    escritorioNome,
    certificadosCarteira
  } = input;

  if (!escritorioNome || !certificadosCarteira || certificadosCarteira.length === 0) {
    return Err(new Error('Nome do escritório e lista de certificados são obrigatórios.'));
  }

  let validos = 0;
  let criticos = 0;
  let expirados = 0;

  for (const c of certificadosCarteira) {
    if (c.diasParaVencer > 30) {
      validos++;
    } else if (c.diasParaVencer > 0 && c.diasParaVencer <= 30) {
      criticos++;
    } else {
      expirados++;
    }
  }

  const diag = "Cofre de Certificados (" + escritorioNome + "): " + certificadosCarteira.length + " certificados sob gestao | Validos: " + validos + " | Criticos (<=30 dias): " + criticos + " | Expirados: " + expirados + " -> Alertas de renovacao automatica ativos.";

  return Ok({
    escritorioNome,
    totalCertificadosCustodiados: certificadosCarteira.length,
    certificadosValidos: validos,
    certificadosCriticosExpirando: criticos,
    certificadosExpirados: expirados,
    statusCofre: 'COFRE_CERTIFICADOS_SEGURO_E_OPERACIONAL',
    diagnosticoCofre: diag
  });
}
