import { DfeDocument } from '../../types/dfe.js';
import { Company } from '../../types/company.js';
import { JournalEntryLine } from '../../types/accounting.js';
import { Result, Ok } from '../../types/result.js';

export function convertDfeToJournalLines(
  dfe: DfeDocument,
  company: Company
): Result<JournalEntryLine[], Error> {
  const isEntrada = dfe.destinatario.cnpjCpf === company.cnpj;
  const linhas: JournalEntryLine[] = [];

  if (isEntrada) {
    // COMPRA DE MERCADORIA / INSUMO
    const isLucroReal = company.regimeTributario.startsWith('LUCRO_REAL');
    
    // Créditos tributários recuperáveis (se Lucro Real)
    const icmsRecuperavel = isLucroReal ? dfe.totais.valorIcms : 0;
    const pisRecuperavel = isLucroReal ? dfe.totais.valorPis : 0;
    const cofinsRecuperavel = isLucroReal ? dfe.totais.valorCofins : 0;
    
    const valorLiquidoEstoque = Number((dfe.totais.valorTotalNota - icmsRecuperavel - pisRecuperavel - cofinsRecuperavel).toFixed(2));

    // Débito no Estoque
    linhas.push({
      accountId: '1.1.3.01',
      accountCode: '1.1.3.01',
      accountName: 'Mercadorias para Revenda / Estoque',
      type: 'DEBIT',
      amount: valorLiquidoEstoque,
      historicoComplementar: `NF-e ${dfe.numero} - ${dfe.emitente.razaoSocial}`
    });

    if (icmsRecuperavel > 0) {
      linhas.push({
        accountId: '1.1.4.01',
        accountCode: '1.1.4.01',
        accountName: 'ICMS a Recuperar',
        type: 'DEBIT',
        amount: icmsRecuperavel,
        historicoComplementar: `Crédito ICMS NF-e ${dfe.numero}`
      });
    }

    if (pisRecuperavel > 0) {
      linhas.push({
        accountId: '1.1.4.02',
        accountCode: '1.1.4.02',
        accountName: 'PIS a Recuperar',
        type: 'DEBIT',
        amount: pisRecuperavel,
        historicoComplementar: `Crédito PIS NF-e ${dfe.numero}`
      });
    }

    if (cofinsRecuperavel > 0) {
      linhas.push({
        accountId: '1.1.4.03',
        accountCode: '1.1.4.03',
        accountName: 'COFINS a Recuperar',
        type: 'DEBIT',
        amount: cofinsRecuperavel,
        historicoComplementar: `Crédito COFINS NF-e ${dfe.numero}`
      });
    }

    // Crédito em Fornecedores
    linhas.push({
      accountId: '2.1.1.01',
      accountCode: '2.1.1.01',
      accountName: 'Fornecedores Nacionais',
      type: 'CREDIT',
      amount: dfe.totais.valorTotalNota,
      historicoComplementar: `Fatura NF-e ${dfe.numero}`
    });

  } else {
    // VENDA DE MERCADORIA
    // Débito em Clientes
    linhas.push({
      accountId: '1.1.2.01',
      accountCode: '1.1.2.01',
      accountName: 'Clientes Nacionais',
      type: 'DEBIT',
      amount: dfe.totais.valorTotalNota,
      historicoComplementar: `Venda NF-e ${dfe.numero} a ${dfe.destinatario.razaoSocial}`
    });

    // Crédito na Receita Bruta de Vendas
    linhas.push({
      accountId: '3.1.1.01',
      accountCode: '3.1.1.01',
      accountName: 'Receita de Venda de Mercadorias',
      type: 'CREDIT',
      amount: dfe.totais.valorTotalNota,
      historicoComplementar: `NF-e ${dfe.numero}`
    });
  }

  return Ok(linhas);
}
