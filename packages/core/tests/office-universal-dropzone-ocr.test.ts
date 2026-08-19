import { describe, it, expect } from 'vitest';
import {
  processOfficeUniversalDropzoneOcrEngine,
  processOfficeBatchDocumentAccountingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Dropzone Massivo Multi-Documentos com OCR IA (Fase 2)', () => {
  it('1. Deve processar lote misto de NF-e, NFS-e e OFX consolidando volume de R$ 1.090.000,00', () => {
    const resDrop = processOfficeUniversalDropzoneOcrEngine({
      escritorioCnpj: '00.000.000/0001-00',
      clienteCnpj: '11.111.111/0001-11',
      clienteRazaoSocial: 'Varejo & Serviços do Brasil S/A',
      competenciaMesAno: '2026-08',
      listaDocumentos: [
        {
          nomeArquivo: 'NFe_55_001.xml',
          formatoExtensao: 'XML',
          tipoDocumentoDetectado: 'NFE_MERCADORIAS',
          valorTotalDocumentoBrl: 450000.00
        },
        {
          nomeArquivo: 'NFSe_SaoPaulo_002.xml',
          formatoExtensao: 'XML',
          tipoDocumentoDetectado: 'NFSE_SERVICOS',
          valorTotalDocumentoBrl: 120000.00
        },
        {
          nomeArquivo: 'Extrato_Itau_Agosto.ofx',
          formatoExtensao: 'OFX',
          tipoDocumentoDetectado: 'OFX_EXTRATO_BANCARIO',
          valorTotalDocumentoBrl: 520000.00
        }
      ]
    });

    const dataDrop = unwrap(resDrop);
    expect(dataDrop.quantidadeTotalDocumentosProcessadosCount).toBe(3);
    expect(dataDrop.totalNfeMercadoriasBrl).toBe(450000.00);
    expect(dataDrop.totalNfseServicosBrl).toBe(120000.00);
    expect(dataDrop.totalOfxBancarioBrl).toBe(520000.00);
    expect(dataDrop.valorTotalGlobalMovimentadoBrl).toBe(1090000.00);
    expect(dataDrop.statusProcessamento).toBe('LOTE_MULTI_DOCUMENTOS_PROCESSADO_COM_SUCESSO');
    expect(dataDrop.diagnosticoDropzone).toContain('Dropzone Universal Multi-Documentos');
  });

  it('2. Deve gerar lote contabil auto-classificado com partidas dobradas e equilibrio perfeito de debito e credito (ACID)', () => {
    const resBatch = processOfficeBatchDocumentAccountingEngine({
      clienteRazaoSocial: 'Varejo & Serviços do Brasil S/A',
      competenciaMesAno: '2026-08',
      totalNfeMercadoriasBrl: 450000.00,
      totalNfseServicosBrl: 120000.00,
      totalOfxBancarioBrl: 520000.00
    });

    const dataBatch = unwrap(resBatch);
    expect(dataBatch.numeroLoteContabilGerado).toBe('LOTE_AUTO_202608_001');
    expect(dataBatch.partidaDobradaComprasMercadorias).toContain('1.1.04.001 Estoques de Mercadorias');
    expect(dataBatch.partidaDobradaServicosTomados).toContain('4.1.02.001 Despesas com Serviços de Terceiros');
    expect(dataBatch.partidaDobradaConciliacaoBancaria).toContain('1.1.01.002 Banco Conta Movimento');
    expect(dataBatch.equilibrioDebitoCreditoStatus).toBe('DEBITOS_IGUAIS_A_CREDITOS_100_ACID');
    expect(dataBatch.statusLote).toBe('LOTE_CONTABIL_INTEGRADO_AO_RAZAO');
    expect(dataBatch.diagnosticoLote).toContain('Diferença Débito/Crédito: R$ 0,00');
  });
});
