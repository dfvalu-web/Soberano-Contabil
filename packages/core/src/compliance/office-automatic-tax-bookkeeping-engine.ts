import { Result, Ok, Err } from '../types/result.js';

export interface InboundTaxItem {
  descricaoProduto: string;
  ncm: string;
  cfopFornecedor: string; // Ex: '5102', '6102'
  cfopEntradaSugerido: string; // Ex: '1102' (Revenda) ou '1556' (Uso/Consumo)
  cstIcms: string;
  valorTotalItemBrl: number;
  valorIcmsCreditavelBrl: number;
  valorPisCofinsCreditavelBrl: number;
}

export interface AutomaticBookkeepingInput {
  clienteCnpj: string;
  razaoSocial: string;
  chaveNfe: string;
  itensNota: InboundTaxItem[];
}

export interface AccountingEntryInbound {
  contaDebito: string;
  contaCredito: string;
  historico: string;
  valorBrl: number;
}

export interface AutomaticBookkeepingResult {
  clienteCnpj: string;
  razaoSocial: string;
  chaveNfe: string;
  totalItensEscriturados: number;
  totalCreditosTributariosBrl: number;
  lancamentosContabeisGerados: AccountingEntryInbound[];
  statusEscrituracao: 'ESCRITURACAO_FISCAL_E_CONTABIL_CONCLUIDA';
  diagnosticoEscrituracao: string;
}

export function processOfficeAutomaticTaxBookkeepingEngine(input: AutomaticBookkeepingInput): Result<AutomaticBookkeepingResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    chaveNfe,
    itensNota
  } = input;

  if (!clienteCnpj || !chaveNfe || !itensNota || itensNota.length === 0) {
    return Err(new Error('CNPJ, Chave da NF-e e itens da nota são obrigatórios.'));
  }

  let totalValorProdutos = 0;
  let totalCreditos = 0;
  const lancamentos: AccountingEntryInbound[] = [];

  for (const item of itensNota) {
    totalValorProdutos += item.valorTotalItemBrl;
    const cred = item.valorIcmsCreditavelBrl + item.valorPisCofinsCreditavelBrl;
    totalCreditos += cred;

    const valorEstoqueLiquido = item.valorTotalItemBrl - cred;

    // D: Estoque de Mercadorias | C: Fornecedores
    lancamentos.push({
      contaDebito: '1.1.04.001 - Estoque de Mercadorias para Revenda',
      contaCredito: '2.1.01.001 - Fornecedores Nacionais',
      historico: "Compra NF-e " + chaveNfe.slice(25, 34) + " - " + item.descricaoProduto,
      valorBrl: parseFloat(valorEstoqueLiquido.toFixed(2))
    });

    if (cred > 0) {
      // D: Impostos a Recuperar | C: Fornecedores
      lancamentos.push({
        contaDebito: '1.1.03.001 - Tributos a Recuperar (ICMS/PIS/COFINS)',
        contaCredito: '2.1.01.001 - Fornecedores Nacionais',
        historico: "Créditos Tributários NF-e " + chaveNfe.slice(25, 34),
        valorBrl: parseFloat(cred.toFixed(2))
      });
    }
  }

  const diag = "Escrituração Automática (" + razaoSocial + " - NF-e " + chaveNfe.slice(25, 34) + "): " + itensNota.length + " itens | Produtos: R$ " + totalValorProdutos.toLocaleString('pt-BR') + " | Créditos Tributários: R$ " + totalCreditos.toLocaleString('pt-BR') + " -> Lançamentos em Estoque e Fornecedores gerados.";

  return Ok({
    clienteCnpj,
    razaoSocial,
    chaveNfe,
    totalItensEscriturados: itensNota.length,
    totalCreditosTributariosBrl: parseFloat(totalCreditos.toFixed(2)),
    lancamentosContabeisGerados: lancamentos,
    statusEscrituracao: 'ESCRITURACAO_FISCAL_E_CONTABIL_CONCLUIDA',
    diagnosticoEscrituracao: diag
  });
}
