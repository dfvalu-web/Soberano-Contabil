import { Result, Ok, Err } from '../../types/result.js';

export interface TriangularOperationInput {
  operacaoId: string;
  adquirenteOriginarioNome: string; // Vendedor comercial (quem vendeu para o cliente final)
  vendedorRemetenteNome: string;    // Fornecedor/Fábrica (quem possui o estoque e entrega)
  destinatarioFinalNome: string;    // Cliente final
  valorVendaComercialBrl: number;   // Preço de venda para o cliente final
  valorCustoFornecedorBrl: number;  // Preço cobrado pela fábrica do adquirente originário
  aliquotaIcmsPercent: number;      // Ex: 18%
  aliquotaIpiPercent: number;       // Ex: 10%
}

export interface TriangularOperationResult {
  operacaoId: string;
  notasFiscaisOperacaoTriangular: {
    nf1VendaComercial: {
      emitente: string;
      destinatario: string;
      cfop: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      observacaoLegal: string;
    };
    nf2RemessaContaEOrdem: {
      emitente: string;
      destinatario: string;
      cfop: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      observacaoLegal: string;
    };
    nf3SimbolicaFaturamento: {
      emitente: string;
      destinatario: string;
      cfop: string;
      valorTotalBrl: number;
      icmsDestacadoBrl: number;
      ipiDestacadoBrl: number;
      observacaoLegal: string;
    };
  };
  diagnosticoTriangular: string;
}

export function processTriangularSalesOperation(input: TriangularOperationInput): Result<TriangularOperationResult, Error> {
  const {
    operacaoId,
    adquirenteOriginarioNome,
    vendedorRemetenteNome,
    destinatarioFinalNome,
    valorVendaComercialBrl,
    valorCustoFornecedorBrl,
    aliquotaIcmsPercent,
    aliquotaIpiPercent
  } = input;

  if (valorVendaComercialBrl <= 0 || valorCustoFornecedorBrl <= 0) {
    return Err(new Error('Valores da operação triangular devem ser superiores a zero.'));
  }

  // 1. NF 1: Venda Comercial (Adquirente Originário -> Destinatário Final) - CFOP 5.120 / 6.120
  const icmsNf1 = Number((valorVendaComercialBrl * (aliquotaIcmsPercent / 100)).toFixed(2));

  // 2. NF 2: Remessa por Conta e Ordem (Vendedor Remetente -> Destinatário Final) - CFOP 5.923 / 6.923
  // Apenas acompanha a mercadoria fisicamente (Sem destaque de tributos)

  // 3. NF 3: Simples Faturamento / Remessa Simbólica (Vendedor Remetente -> Adquirente Originário) - CFOP 5.118 / 6.118
  const icmsNf3 = Number((valorCustoFornecedorBrl * (aliquotaIcmsPercent / 100)).toFixed(2));
  const ipiNf3 = Number((valorCustoFornecedorBrl * (aliquotaIpiPercent / 100)).toFixed(2));

  const diag = 'Operação Triangular por Conta e Ordem (Art. 40 do Conv. S/Nº de 1970): NF 1 Venda (CFOP 5.120: R$ ' + valorVendaComercialBrl.toFixed(2) + '), NF 2 Remessa Física (CFOP 5.923 para ' + destinatarioFinalNome + ') e NF 3 Remessa Simbólica (CFOP 5.118: R$ ' + valorCustoFornecedorBrl.toFixed(2) + '). Rastreabilidade fiscal integral homologada.';

  return Ok({
    operacaoId,
    notasFiscaisOperacaoTriangular: {
      nf1VendaComercial: {
        emitente: adquirenteOriginarioNome,
        destinatario: destinatarioFinalNome,
        cfop: '5.120',
        valorTotalBrl: valorVendaComercialBrl,
        icmsDestacadoBrl: icmsNf1,
        observacaoLegal: 'Mercadoria a ser entregue por ' + vendedorRemetenteNome + ' por conta e ordem.'
      },
      nf2RemessaContaEOrdem: {
        emitente: vendedorRemetenteNome,
        destinatario: destinatarioFinalNome,
        cfop: '5.923',
        valorTotalBrl: valorCustoFornecedorBrl,
        icmsDestacadoBrl: 0,
        observacaoLegal: 'Remessa por conta e ordem de terceiros emitida nos termos do Art. 40 do Convênio S/Nº de 1970.'
      },
      nf3SimbolicaFaturamento: {
        emitente: vendedorRemetenteNome,
        destinatario: adquirenteOriginarioNome,
        cfop: '5.118',
        valorTotalBrl: valorCustoFornecedorBrl,
        icmsDestacadoBrl: icmsNf3,
        ipiDestacadoBrl: ipiNf3,
        observacaoLegal: 'Remessa simbólica - Venda para entrega a destinatário final por conta e ordem.'
      }
    },
    diagnosticoTriangular: diag
  });
}
