import { describe, it, expect } from 'vitest';
import {
  processOfficeDdaBankingNfeCrossmatchingEngine,
  processOfficeAccountsPayableAutomationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: DDA Bancário & Conciliação com NF-e de Entrada', () => {
  it('1. Deve casar boletos DDA com NF-e de entrada e emitir alerta para boleto sem nota', () => {
    const resDda = processOfficeDdaBankingNfeCrossmatchingEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio de Ferragens e Aço Paulista S/A',
      listaBoletosDda: [
        {
          codigoBarras: '34191.79001 01043.510047 91020.150008 5 95600000150000',
          cnpjCedente: '22.222.222/0001-22',
          nomeCedente: 'Usinas Siderúrgicas do Brasil Ltda',
          valorBoletoBrl: 15000.00,
          dataVencimento: '2026-08-25'
        },
        {
          codigoBarras: '03399.12345 67890.123456 78901.123456 1 95600000050000',
          cnpjCedente: '33.333.333/0001-33',
          nomeCedente: 'Cobrança Desconhecida e Suspeita ME',
          valorBoletoBrl: 5000.00,
          dataVencimento: '2026-08-28'
        }
      ],
      listaNfeEntrada: [
        {
          chaveAcessoNfe: '35260822222222000122550010000123451000123456',
          cnpjEmitente: '22.222.222/0001-22',
          nomeEmitente: 'Usinas Siderúrgicas do Brasil Ltda',
          valorDuplicataBrl: 15000.00,
          dataVencimento: '2026-08-25'
        }
      ]
    });

    const dataDda = unwrap(resDda);
    expect(dataDda.totalBoletosDdaLidos).toBe(2);
    expect(dataDda.totalBoletosCasadosComNfe).toBe(1);
    expect(dataDda.totalBoletosSemNotaFiscal).toBe(1);
    expect(dataDda.itensProcessados[0].statusCasamento).toBe('CASADO_COM_NFE');
    expect(dataDda.itensProcessados[0].chaveAcessoNfeVinculada).toContain('35260822222222000122550010000123451000123456');
    expect(dataDda.itensProcessados[1].statusCasamento).toBe('ALERTA_BOLETO_SEM_NOTA_FISCAL');
    expect(dataDda.statusProcessamento).toBe('DDA_CONCILIADO_COM_SUCESSO');
    expect(dataDda.diagnosticoDda).toContain('1 amparados por NF-e');
  });

  it('2. Deve provisionar e liquidar contas a pagar com partidas dobradas contabeis', () => {
    const resAp = processOfficeAccountsPayableAutomationEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio de Ferragens e Aço Paulista S/A',
      fornecedorNome: 'Usinas Siderúrgicas do Brasil Ltda',
      fornecedorCnpj: '22.222.222/0001-22',
      valorTotalTituloBrl: 15000.00,
      dataEmissao: '2026-08-10',
      dataVencimento: '2026-08-25',
      dataLiquidacaoDda: '2026-08-25',
      contaContabilDespesaOuEstoque: '1.1.04.001 Estoque de Matéria-Prima'
    });

    const dataAp = unwrap(resAp);
    expect(dataAp.valorTotalTituloBrl).toBe(15000.00);
    expect(dataAp.partidaDobradaProvisao).toContain('D - 1.1.04.001 Estoque de Matéria-Prima');
    expect(dataAp.partidaDobradaProvisao).toContain('2.1.01.001 Fornecedores Nacionais');
    expect(dataAp.partidaDobradaLiquidacaoDda).toContain('1.1.01.002 Banco Conta Movimento');
    expect(dataAp.statusTitulo).toBe('TITULO_PROVISIONADO_E_LIQUIDADO_DDA');
    expect(dataAp.diagnosticoContasPagar).toContain('liquidado via DDA bancário');
  });
});
