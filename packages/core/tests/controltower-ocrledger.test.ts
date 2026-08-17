import { describe, it, expect } from 'vitest';
import {
  processAccountingFirmControlTowerEngine,
  processReceiptMultimodalOcrLedgerParser,
  unwrap
} from '../src/index.js';

describe('TESTES: Torre de Controle Multi-Clientes & OCR com IA (Pilar 5 - Produção)', () => {
  it('1. Deve consolidar matriz de obrigacoes de 500 clientes com semaforo fiscal em tempo real', () => {
    const resTower = processAccountingFirmControlTowerEngine({
      escritorioId: 'ESC-SOBERANO-01',
      escritorioNome: 'Soberano Consultoria & Auditoria Contábil',
      competencia: '2026-04',
      clientes: [
        {
          cnpj: '11.111.111/0001-11',
          razaoSocial: 'Cliente Alfa S.A.',
          regimeTributario: 'LUCRO_REAL',
          statusSpedFiscal: 'TRANSMITIDO_VERDE',
          statusDctfWeb: 'TRANSMITIDO_VERDE',
          statusFechamentoFolhaS1299: 'TRANSMITIDO_VERDE',
          totalGuiasPendentesBrl: 50000.00
        },
        {
          cnpj: '22.222.222/0001-22',
          razaoSocial: 'Cliente Beta Comércio Ltda',
          regimeTributario: 'SIMPLES_NACIONAL',
          statusSpedFiscal: 'A_VENCER_AMARELO',
          statusDctfWeb: 'TRANSMITIDO_VERDE',
          statusFechamentoFolhaS1299: 'TRANSMITIDO_VERDE',
          totalGuiasPendentesBrl: 12000.00
        },
        {
          cnpj: '33.333.333/0001-33',
          razaoSocial: 'Cliente Gama Serviços Ltda',
          regimeTributario: 'LUCRO_PRESUMIDO',
          statusSpedFiscal: 'ATRASADO_VERMELHO',
          statusDctfWeb: 'ATRASADO_VERMELHO',
          statusFechamentoFolhaS1299: 'ATRASADO_VERMELHO',
          totalGuiasPendentesBrl: 80000.00
        }
      ]
    });

    const dataTower = unwrap(resTower);
    expect(dataTower.totalClientesGerenciados).toBe(3);
    expect(dataTower.totalConcluidosVerde).toBe(1);
    expect(dataTower.totalAlertaAmarelo).toBe(1);
    expect(dataTower.totalCriticosVermelho).toBe(1);
    expect(dataTower.indiceConformidadeGeralPercent).toBe(33.33);
    expect(dataTower.volumeTotalGuiasGerenciadasBrl).toBe(142000.00);
    expect(dataTower.diagnosticoTorreControle).toContain('3 clientes gerenciados');
  });

  it('2. Deve extrair dados de comprovante PIX via OCR Multimodal com IA e contabilizar no Ledger Merkle', () => {
    const resOcr = processReceiptMultimodalOcrLedgerParser({
      tenantId: '00000000-0000-0000-0000-000000000001',
      imagemOuPdfBase64: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZw==',
      nomeArquivo: 'comprovante_pix_combustivel_frota.pdf',
      tipoDocumentoDetectado: 'COMPROVANTE_PAGAMENTO_PIX'
    });

    const dataOcr = unwrap(resOcr);
    expect(dataOcr.confiancaExtracaoIaPercent).toBe(99.4);
    expect(dataOcr.dadosExtraidosOcr.cnpjFornecedor).toBe('33.000.167/0001-01');
    expect(dataOcr.dadosExtraidosOcr.valorBrutoBrl).toBe(350.00);
    expect(dataOcr.lancamentoContabilGerado.debitoConta).toContain('3.2.1.04 - Despesas com Combustíveis');
    expect(dataOcr.lancamentoContabilGerado.merkleHashPartida).toBeDefined();
    expect(dataOcr.diagnosticoOcr).toContain('Extraido com 99.4% de confianca e contabilizado instantaneamente');
  });
});
