import { describe, it, expect } from 'vitest';
import {
  processOfficeInboundDfeManifestationEngine,
  processOfficeAutomaticTaxBookkeepingEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de DF-e de Entrada, Manifestação SEFAZ & Escrituração', () => {
  it('1. Deve processar manifestacao do destinatario e registrar eventos com a SEFAZ', () => {
    const resMani = processOfficeInboundDfeManifestationEngine({
      destinatarioCnpj: '11.111.111/0001-11',
      destinatarioRazaoSocial: 'Varejo Comercial Aliança Ltda',
      notasRecebidas: [
        {
          chaveAcesso44: '35260811111111000111550010000012341000012345',
          numeroNota: 1234,
          serieNota: 1,
          emitenteCnpj: '99.999.999/0001-99',
          emitenteRazaoSocial: 'Distribuidora Global de Bebidas S/A',
          dataEmissao: '2026-08-10',
          valorTotalNfeBrl: 45000.00,
          eventoManifestacao: 'CONFIRMACAO_DA_OPERACAO_210200'
        }
      ]
    });

    const dataMani = unwrap(resMani);
    expect(dataMani.totalNotasProcessadas).toBe(1);
    expect(dataMani.totalValorNotasBrl).toBe(45000.00);
    expect(dataMani.xmlCompletoBaixadoSefaz).toBe(true);
    expect(dataMani.statusManifestacao).toBe('MANIFESTACAO_DESTINATARIO_HOMOLOGADA_SEFAZ');
    expect(dataMani.diagnosticoManifestacao).toContain('SEFAZ Nacional');
  });

  it('2. Deve converter CFOP e gerar lancamentos contabeis de estoque e fornecedores automaticamente', () => {
    const resBook = processOfficeAutomaticTaxBookkeepingEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Supermercado Central de Alimentos Ltda',
      chaveNfe: '35260822222222000122550010000056781000056789',
      itensNota: [
        {
          descricaoProduto: 'Arroz Tipo 1 - Fardo 30kg',
          ncm: '10063021',
          cfopFornecedor: '5102',
          cfopEntradaSugerido: '1102',
          cstIcms: '00',
          valorTotalItemBrl: 10000.00,
          valorIcmsCreditavelBrl: 1200.00,
          valorPisCofinsCreditavelBrl: 925.00 // 2.125k créditos -> Estoque líquido = 7.875k
        }
      ]
    });

    const dataBook = unwrap(resBook);
    expect(dataBook.totalItensEscriturados).toBe(1);
    expect(dataBook.totalCreditosTributariosBrl).toBe(2125.00);
    expect(dataBook.lancamentosContabeisGerados.length).toBe(2);
    expect(dataBook.lancamentosContabeisGerados[0].contaDebito).toContain('Estoque de Mercadorias');
    expect(dataBook.lancamentosContabeisGerados[1].contaDebito).toContain('Tributos a Recuperar');
    expect(dataBook.statusEscrituracao).toBe('ESCRITURACAO_FISCAL_E_CONTABIL_CONCLUIDA');
    expect(dataBook.diagnosticoEscrituracao).toContain('Estoque e Fornecedores gerados');
  });
});
