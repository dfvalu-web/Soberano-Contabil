import { Account } from '../../types/accounting.js';

export function createStandardChartOfAccounts(tenantId: string): Account[] {
  return [
    // 1 - ATIVO
    { id: '1.0', tenantId, codigo: '1', codigoReduzido: 1, nome: 'ATIVO', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 1, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1', tenantId, codigo: '1.1', codigoReduzido: 2, nome: 'ATIVO CIRCULANTE', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 2, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1.1', tenantId, codigo: '1.1.1', codigoReduzido: 3, nome: 'Disponibilidades', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1.1.01', tenantId, codigo: '1.1.1.01', codigoReduzido: 101, nome: 'Caixa Geral', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.01.01.01', saldoAtual: 0 },
    { id: '1.1.1.02', tenantId, codigo: '1.1.1.02', codigoReduzido: 102, nome: 'Bancos Conta Movimento', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.01.02.01', saldoAtual: 0 },
    { id: '1.1.1.03', tenantId, codigo: '1.1.1.03', codigoReduzido: 103, nome: 'Aplicações de Liquidez Imediata', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.01.03.01', saldoAtual: 0 },
    { id: '1.1.2', tenantId, codigo: '1.1.2', codigoReduzido: 4, nome: 'Contas a Receber (Clientes)', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1.2.01', tenantId, codigo: '1.1.2.01', codigoReduzido: 104, nome: 'Clientes Nacionais', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.02.01.01', saldoAtual: 0 },
    { id: '1.1.3', tenantId, codigo: '1.1.3', codigoReduzido: 5, nome: 'Estoques', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1.3.01', tenantId, codigo: '1.1.3.01', codigoReduzido: 105, nome: 'Mercadorias para Revenda', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.03.01.01', saldoAtual: 0 },
    { id: '1.1.3.02', tenantId, codigo: '1.1.3.02', codigoReduzido: 106, nome: 'Matérias-Primas', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.03.02.01', saldoAtual: 0 },
    { id: '1.1.4', tenantId, codigo: '1.1.4', codigoReduzido: 6, nome: 'Impostos e Tributos a Recuperar', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '1.1.4.01', tenantId, codigo: '1.1.4.01', codigoReduzido: 107, nome: 'ICMS a Recuperar', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.04.01.01', saldoAtual: 0 },
    { id: '1.1.4.02', tenantId, codigo: '1.1.4.02', codigoReduzido: 108, nome: 'PIS a Recuperar', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.04.02.01', saldoAtual: 0 },
    { id: '1.1.4.03', tenantId, codigo: '1.1.4.03', codigoReduzido: 109, nome: 'COFINS a Recuperar', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.04.03.01', saldoAtual: 0 },
    { id: '1.1.4.04', tenantId, codigo: '1.1.4.04', codigoReduzido: 110, nome: 'IBS a Compensar (Reforma)', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.04.04.01', saldoAtual: 0 },
    { id: '1.1.4.05', tenantId, codigo: '1.1.4.05', codigoReduzido: 111, nome: 'CBS a Compensar (Reforma)', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.01.04.05.01', saldoAtual: 0 },
    
    // 1.2 - ATIVO NÃO CIRCULANTE
    { id: '1.2', tenantId, codigo: '1.2', codigoReduzido: 7, nome: 'ATIVO NÃO CIRCULANTE', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 2, isAnalitica: false, saldoAtual: 0 },
    { id: '1.2.1', tenantId, codigo: '1.2.1', codigoReduzido: 8, nome: 'Imobilizado', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '1.2.1.01', tenantId, codigo: '1.2.1.01', codigoReduzido: 112, nome: 'Máquinas e Equipamentos', natureza: 'DEBIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.02.01.01.01', saldoAtual: 0 },
    { id: '1.2.1.02', tenantId, codigo: '1.2.1.02', codigoReduzido: 113, nome: '(-) Depreciação Acumulada', natureza: 'CREDIT', tipo: 'ATIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '1.02.01.01.99', saldoAtual: 0 },

    // 2 - PASSIVO
    { id: '2.0', tenantId, codigo: '2', codigoReduzido: 10, nome: 'PASSIVO', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 1, isAnalitica: false, saldoAtual: 0 },
    { id: '2.1', tenantId, codigo: '2.1', codigoReduzido: 11, nome: 'PASSIVO CIRCULANTE', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 2, isAnalitica: false, saldoAtual: 0 },
    { id: '2.1.1', tenantId, codigo: '2.1.1', codigoReduzido: 12, nome: 'Fornecedores', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '2.1.1.01', tenantId, codigo: '2.1.1.01', codigoReduzido: 201, nome: 'Fornecedores Nacionais', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.01.01.01', saldoAtual: 0 },
    { id: '2.1.2', tenantId, codigo: '2.1.2', codigoReduzido: 13, nome: 'Obrigações Trabalhistas e Previdenciárias', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '2.1.2.01', tenantId, codigo: '2.1.2.01', codigoReduzido: 202, nome: 'Salários a Pagar', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.02.01.01', saldoAtual: 0 },
    { id: '2.1.2.02', tenantId, codigo: '2.1.2.02', codigoReduzido: 203, nome: 'INSS a Recolher (DCTFWeb)', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.02.02.01', saldoAtual: 0 },
    { id: '2.1.2.03', tenantId, codigo: '2.1.2.03', codigoReduzido: 204, nome: 'FGTS Digital a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.02.03.01', saldoAtual: 0 },
    { id: '2.1.2.04', tenantId, codigo: '2.1.2.04', codigoReduzido: 205, nome: 'Provisão de 13º Salário', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.02.04.01', saldoAtual: 0 },
    { id: '2.1.2.05', tenantId, codigo: '2.1.2.05', codigoReduzido: 206, nome: 'Provisão de Férias e Encargos', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.02.05.01', saldoAtual: 0 },
    { id: '2.1.3', tenantId, codigo: '2.1.3', codigoReduzido: 14, nome: 'Obrigações Tributárias', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 3, isAnalitica: false, saldoAtual: 0 },
    { id: '2.1.3.01', tenantId, codigo: '2.1.3.01', codigoReduzido: 207, nome: 'Simples Nacional a Recolher (DAS)', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.01.01', saldoAtual: 0 },
    { id: '2.1.3.02', tenantId, codigo: '2.1.3.02', codigoReduzido: 208, nome: 'IRPJ a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.02.01', saldoAtual: 0 },
    { id: '2.1.3.03', tenantId, codigo: '2.1.3.03', codigoReduzido: 209, nome: 'CSLL a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.03.01', saldoAtual: 0 },
    { id: '2.1.3.04', tenantId, codigo: '2.1.3.04', codigoReduzido: 210, nome: 'PIS a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.04.01', saldoAtual: 0 },
    { id: '2.1.3.05', tenantId, codigo: '2.1.3.05', codigoReduzido: 211, nome: 'COFINS a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.05.01', saldoAtual: 0 },
    { id: '2.1.3.06', tenantId, codigo: '2.1.3.06', codigoReduzido: 212, nome: 'ICMS a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.06.01', saldoAtual: 0 },
    { id: '2.1.3.07', tenantId, codigo: '2.1.3.07', codigoReduzido: 213, nome: 'ISS a Recolher', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.07.01', saldoAtual: 0 },
    { id: '2.1.3.08', tenantId, codigo: '2.1.3.08', codigoReduzido: 214, nome: 'IBS a Recolher (Reforma)', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.08.01', saldoAtual: 0 },
    { id: '2.1.3.09', tenantId, codigo: '2.1.3.09', codigoReduzido: 215, nome: 'CBS a Recolher (Reforma)', natureza: 'CREDIT', tipo: 'PASSIVO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.01.03.09.01', saldoAtual: 0 },

    // 2.3 - PATRIMÔNIO LÍQUIDO
    { id: '2.3', tenantId, codigo: '2.3', codigoReduzido: 20, nome: 'PATRIMÔNIO LÍQUIDO', natureza: 'CREDIT', tipo: 'PATRIMONIO_LIQUIDO', nivel: 2, isAnalitica: false, saldoAtual: 0 },
    { id: '2.3.1.01', tenantId, codigo: '2.3.1.01', codigoReduzido: 250, nome: 'Capital Social Subscrito', natureza: 'CREDIT', tipo: 'PATRIMONIO_LIQUIDO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.03.01.01.01', saldoAtual: 0 },
    { id: '2.3.2.01', tenantId, codigo: '2.3.2.01', codigoReduzido: 251, nome: 'Reservas de Lucros', natureza: 'CREDIT', tipo: 'PATRIMONIO_LIQUIDO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.03.02.01.01', saldoAtual: 0 },
    { id: '2.3.3.01', tenantId, codigo: '2.3.3.01', codigoReduzido: 252, nome: 'Lucros ou Prejuízos Acumulados', natureza: 'CREDIT', tipo: 'PATRIMONIO_LIQUIDO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '2.03.03.01.01', saldoAtual: 0 },

    // 3 - RECEITAS
    { id: '3.0', tenantId, codigo: '3', codigoReduzido: 30, nome: 'RECEITAS', natureza: 'CREDIT', tipo: 'RECEITA', nivel: 1, isAnalitica: false, saldoAtual: 0 },
    { id: '3.1.1.01', tenantId, codigo: '3.1.1.01', codigoReduzido: 301, nome: 'Receita de Venda de Mercadorias', natureza: 'CREDIT', tipo: 'RECEITA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '3.01.01.01.01', saldoAtual: 0 },
    { id: '3.1.1.02', tenantId, codigo: '3.1.1.02', codigoReduzido: 302, nome: 'Receita de Prestação de Serviços', natureza: 'CREDIT', tipo: 'RECEITA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '3.01.01.02.01', saldoAtual: 0 },
    { id: '3.1.2.01', tenantId, codigo: '3.1.2.01', codigoReduzido: 303, nome: '(-) Deduções e Tributos sobre Vendas', natureza: 'DEBIT', tipo: 'RECEITA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '3.01.02.01.01', saldoAtual: 0 },

    // 4 - CUSTOS E DESPESAS
    { id: '4.0', tenantId, codigo: '4', codigoReduzido: 40, nome: 'CUSTOS E DESPESAS OPERACIONAIS', natureza: 'DEBIT', tipo: 'DESPESA', nivel: 1, isAnalitica: false, saldoAtual: 0 },
    { id: '4.1.1.01', tenantId, codigo: '4.1.1.01', codigoReduzido: 401, nome: 'Custo das Mercadorias Vendidas (CMV)', natureza: 'DEBIT', tipo: 'CUSTO', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '4.01.01.01.01', saldoAtual: 0 },
    { id: '4.2.1.01', tenantId, codigo: '4.2.1.01', codigoReduzido: 402, nome: 'Despesas com Pessoal e Encargos', natureza: 'DEBIT', tipo: 'DESPESA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '4.02.01.01.01', saldoAtual: 0 },
    { id: '4.2.1.02', tenantId, codigo: '4.2.1.02', codigoReduzido: 403, nome: 'Despesas Administrativas e Aluguéis', natureza: 'DEBIT', tipo: 'DESPESA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '4.02.01.02.01', saldoAtual: 0 },
    { id: '4.2.1.03', tenantId, codigo: '4.2.1.03', codigoReduzido: 404, nome: 'Despesas Tributárias', natureza: 'DEBIT', tipo: 'DESPESA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '4.02.01.03.01', saldoAtual: 0 },
    { id: '4.2.1.04', tenantId, codigo: '4.2.1.04', codigoReduzido: 405, nome: 'Despesas Financeiras Líquidas', natureza: 'DEBIT', tipo: 'DESPESA', nivel: 4, isAnalitica: true, codigoContaReferencialRfb: '4.02.01.04.01', saldoAtual: 0 }
  ];
}
