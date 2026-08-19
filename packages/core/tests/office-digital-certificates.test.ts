import { describe, it, expect } from 'vitest';
import {
  processOfficeDigitalCertificatesVaultEngine,
  processOfficeBatchDocumentSignerEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Certificados Digitais, Cofre Seguro & Assinador ICP-Brasil', () => {
  it('1. Deve monitorar cofre de certificados digitais e classificar validades e alertas criticos', () => {
    const resVault = processOfficeDigitalCertificatesVaultEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      certificadosCarteira: [
        {
          certificadoId: 'CERT-001',
          clienteCnpjCpf: '11.111.111/0001-11',
          titularNome: 'Comércio Alfa Ltda',
          tipoCertificado: 'E_CNPJ_A1',
          autoridadeCertificadora: 'Certisign',
          dataVencimento: '2027-08-15',
          diasParaVencer: 365
        },
        {
          certificadoId: 'CERT-002',
          clienteCnpjCpf: '22.222.222/0001-22',
          titularNome: 'Indústria Beta S/A',
          tipoCertificado: 'E_CNPJ_A1',
          autoridadeCertificadora: 'Serasa',
          dataVencimento: '2026-08-30',
          diasParaVencer: 13 // crítico
        }
      ]
    });

    const dataVault = unwrap(resVault);
    expect(dataVault.totalCertificadosCustodiados).toBe(2);
    expect(dataVault.certificadosValidos).toBe(1);
    expect(dataVault.certificadosCriticosExpirando).toBe(1);
    expect(dataVault.certificadosExpirados).toBe(0);
    expect(dataVault.statusCofre).toBe('COFRE_CERTIFICADOS_SEGURO_E_OPERACIONAL');
    expect(dataVault.diagnosticoCofre).toContain('Criticos (<=30 dias): 1');
  });

  it('2. Deve assinar em lote documentos contabeis com padrao ICP-Brasil e carimbo do tempo', () => {
    const resSigner = processOfficeBatchDocumentSignerEngine({
      contadorCpf: '123.456.789-00',
      contadorNome: 'Dr. David Valu, Contador Responsável',
      numeroRegistroCrc: 'CRC/SP 999999/O-0',
      documentosParaAssinar: [
        {
          documentoId: 'DOC-BALANCO-2026',
          tipoDocumento: 'BALANCO_PATRIMONIAL_DRE',
          clienteCnpj: '11.111.111/0001-11',
          hashConteudoSha256: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'
        },
        {
          documentoId: 'DOC-DIARIO-2026',
          tipoDocumento: 'LIVRO_DIARIO_SPED',
          clienteCnpj: '11.111.111/0001-11',
          hashConteudoSha256: 'CA978112CA1BBDCAFAC231B39A23DC4DA786EFF8147C4E72B9807785AFEE48BB'
        }
      ]
    });

    const dataSigner = unwrap(resSigner);
    expect(dataSigner.totalDocumentosAssinados).toBe(2);
    expect(dataSigner.padraoAssinatura).toBe('ICP_BRASIL_PADES_CADES_QUALIFICADA');
    expect(dataSigner.carimboDoTempoAplicado).toBe(true);
    expect(dataSigner.statusAssinatura).toBe('LOTE_DOCUMENTOS_ASSINADO_COM_VALIDADE_JURIDICA');
    expect(dataSigner.diagnosticoAssinador).toContain('Dr. David Valu, Contador Responsável');
  });
});
