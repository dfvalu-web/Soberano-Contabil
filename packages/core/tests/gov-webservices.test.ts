import { describe, it, expect } from 'vitest';
import {
  processSefazSoapTransmission,
  processGovTransmissionGateway,
  unwrap
} from '../src/index.js';

describe('TESTES: Conectores WebServices Governamentais em Tempo Real (Pilar 1 - Produção)', () => {
  it('1. Deve montar envelope SOAP 1.2 e simular autorizacao oficial de NF-e na SEFAZ com roteamento de contingencia SVC', () => {
    const resSefaz = processSefazSoapTransmission({
      ufOrigem: 'SP',
      tipoAmbiente: '1_PRODUCAO',
      servico: 'NFeAutorizacao4',
      numeroLote: '2026040101',
      xmlNfeAssinado: '<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe Id="NFe35260400000000000191550010000000011000000018"></infNFe></NFe>',
      forcarContingenciaSvc: true
    });

    const dataSefaz = unwrap(resSefaz);
    expect(dataSefaz.codigoStatusSefaz).toBe(100);
    expect(dataSefaz.motivoStatus).toContain('Autorizado o uso da NF-e');
    expect(dataSefaz.canalUtilizado).toBe('CONTINGENCIA_SVC_AN');
    expect(dataSefaz.envelopeSoapEnviado).toContain('soap12:Envelope');
    expect(dataSefaz.tempoRespostaMs).toBe(120);
    expect(dataSefaz.diagnosticoSefaz).toContain('Status 100');
  });

  it('2. Deve transmitir lotes de eventos eSocial e EFD-Reinf com captura de recibo oficial de entrega', () => {
    const resGov = processGovTransmissionGateway({
      sistemaDestino: 'ESOCIAL_SOAP_WS',
      tipoAmbiente: '1_PRODUCAO',
      cnpjEmissor: '12.345.678/0001-90',
      eventoTipo: 'S-1200',
      conteudoXmlLote: '<eSocial xmlns="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1"><envioLoteEventos></envioLoteEventos></eSocial>'
    });

    const dataGov = unwrap(resGov);
    expect(dataGov.statusConexaoHttp).toBe(200);
    expect(dataGov.codigoRetornoGov).toBe('201');
    expect(dataGov.numeroReciboEntregaOficial).toContain('REC-S-1200-12345678000190');
    expect(dataGov.hashReciboSha256).toBeDefined();
    expect(dataGov.tempoRespostaMs).toBe(145);
    expect(dataGov.diagnosticoGov).toContain('Retorno: 200 OK (Código 201: Processado com Sucesso)');
  });
});
