export interface DfeItem {
  numeroItem: number;
  codigoProduto: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  icms: {
    cst: string;
    baseCalculo: number;
    aliquota: number;
    valor: number;
  };
  ipi?: {
    cst: string;
    aliquota: number;
    valor: number;
  };
  pis: {
    cst: string;
    baseCalculo: number;
    aliquota: number;
    valor: number;
  };
  cofins: {
    cst: string;
    baseCalculo: number;
    aliquota: number;
    valor: number;
  };
}

export interface DfeDocument {
  chaveAcesso: string;
  tipo: 'NFE' | 'NFCE' | 'CTE' | 'NFSE';
  numero: string;
  serie: string;
  dataEmissao: string;
  naturezaOperacao: string;
  emitente: {
    cnpj: string;
    razaoSocial: string;
    uf: string;
    inscricaoEstadual?: string;
  };
  destinatario: {
    cnpjCpf: string;
    razaoSocial: string;
    uf: string;
  };
  itens: DfeItem[];
  totais: {
    valorProdutos: number;
    valorFrete: number;
    valorSeguro: number;
    valorDesconto: number;
    valorIpi: number;
    valorIcms: number;
    valorIcmsSt: number;
    valorPis: number;
    valorCofins: number;
    valorTotalNota: number;
  };
  duplicatas: Array<{
    numero: string;
    vencimento: string;
    valor: number;
  }>;
}
