import { describe, it, expect } from 'vitest';
import {
  processOfficeFiscalDocumentCloudEngine,
  processOfficeSmartOcrAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Guarda de XMLs DF-e (5 Anos) & OCR Inteligente com IA', () => {
  it('1. Deve registrar custodia de XMLs DF-e em nuvem com manifestacao do destinatario (CTN 173)', () => {
    const resCloud = processOfficeFiscalDocumentCloudEngine({
      escritorioNome: 'Soberano Contabilidade Global',
      mesCompetencia: '2026-08',
      documentosSefaz: [
        {
          documentoChave: '35260811111111000111550010000001011000000101',
          tipoDocumento: 'NFE',
          clienteCnpj: '11.111.111/0001-11',
          dataEmissao: '2026-08-01',
          valorTotalBrl: 25000.00,
          statusManifestacao: 'CONFIRMADA'
        },
        {
          documentoChave: '35260822222222000122550010000002022000000202',
          tipoDocumento: 'CTE',
          clienteCnpj: '22.222.222/0001-22',
          dataEmissao: '2026-08-02',
          valorTotalBrl: 4500.00,
          statusManifestacao: 'CIENCIA_DA_OPERACAO'
        }
      ]
    });

    const dataCloud = unwrap(resCloud);
    expect(dataCloud.totalXmlsCustodiados).toBe(2);
    expect(dataCloud.valorTotalMovimentadoBrl).toBe(29500.00);
    expect(dataCloud.xmlsConfirmadosManifestacao).toBe(2);
    expect(dataCloud.prazoGuardaAnos).toBe(5);
    expect(dataCloud.statusGuarda).toBe('XMLS_ARMAZENADOS_EM_NUVEM_CONFORME_CTN_173');
    expect(dataCloud.diagnosticoGuarda).toContain('Guarda em Nuvem garantida por 5 anos');
  });

  it('2. Deve extrair dados de comprovantes via OCR com IA e sugerir contas contabeis no plano de contas', () => {
    const resOcr = processOfficeSmartOcrAccountingEngine({
      clienteCnpj: '11.111.111/0001-11',
      loteComprovantesOcr: [
        {
          reciboId: 'REC-ENERGIA-082026',
          tipoDocumento: 'FATURA_ENERGIA_AGUA',
          fornecedorNome: 'Enel Distribuição São Paulo',
          fornecedorCnpj: '61.695.227/0001-93',
          dataDocumento: '2026-08-05',
          valorTotalBrl: 3420.50,
          contaContabilDebitoSugerida: '3.1.01.02 - Despesas com Energia Elétrica',
          contaContabilCreditoSugerida: '1.1.01.02 - Banco Itaú C/C',
          confiancaIaPercent: 99.8
        },
        {
          reciboId: 'REC-ALUGUEL-082026',
          tipoDocumento: 'RECIBO_ALUGUEL',
          fornecedorNome: 'Imobiliária Prime Empreendimentos',
          fornecedorCnpj: '10.200.300/0001-40',
          dataDocumento: '2026-08-10',
          valorTotalBrl: 8500.00,
          contaContabilDebitoSugerida: '3.1.01.01 - Despesas com Aluguéis Comerciais',
          contaContabilCreditoSugerida: '1.1.01.02 - Banco Itaú C/C',
          confiancaIaPercent: 99.2
        }
      ]
    });

    const dataOcr = unwrap(resOcr);
    expect(dataOcr.totalComprovantesProcessados).toBe(2);
    expect(dataOcr.totalValorClassificadoBrl).toBe(11920.50);
    expect(dataOcr.mediaConfiancaIaPercent).toBe(99.5);
    expect(dataOcr.totalLancamentosPreClassificados).toBe(4); // 2 * 2
    expect(dataOcr.statusProcessamento).toBe('OCR_IA_PROCESSADO_E_CLASSIFICADO_PLANO_CONTAS');
    expect(dataOcr.diagnosticoOcr).toContain('Acuracia Media IA: 99.5%');
  });
});
