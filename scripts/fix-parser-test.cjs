const fs = require('fs');
const path = require('path');

function write(p, c) {
  const full = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, c.trim() + '\n', 'utf8');
  console.log('Created: ' + p);
}

write('packages/core/src/dfe/nfe/nfe-parser.ts', `
import { DfeDocument, DfeItem } from '../../types/dfe.js';
import { Result, Ok, Err } from '../../types/result.js';

export function parseNfeXml(xmlContent: string): Result<DfeDocument, Error> {
  try {
    if (!xmlContent || typeof xmlContent !== 'string') {
      return Err(new Error('Conteúdo XML de NF-e inválido ou vazio.'));
    }

    const getTag = (xml: string, tag: string) => {
      const match = new RegExp('<' + tag + '[^>]*>([\\\\s\\\\S]*?)<\\\\/' + tag + '>', 'i').exec(xml);
      return match ? match[1].trim() : '';
    };

    const chaveMatch = /Id="NFe([0-9]{44})"/i.exec(xmlContent);
    const chaveAcesso = chaveMatch ? chaveMatch[1] : ('NFE-' + Date.now());

    const nNF = getTag(xmlContent, 'nNF') || '1';
    const serie = getTag(xmlContent, 'serie') || '1';
    const dhEmi = getTag(xmlContent, 'dhEmi') || new Date().toISOString();
    const natOp = getTag(xmlContent, 'natOp') || 'VENDA DE MERCADORIAS';

    // Emitente
    const emitBlock = getTag(xmlContent, 'emit');
    const emitCnpj = getTag(emitBlock, 'CNPJ') || '00000000000000';
    const emitXNome = getTag(emitBlock, 'xNome') || 'EMITENTE';
    const emitUf = getTag(emitBlock, 'UF') || 'SP';
    const emitIe = getTag(emitBlock, 'IE');

    // Destinatário
    const destBlock = getTag(xmlContent, 'dest');
    const destCnpj = getTag(destBlock, 'CNPJ') || getTag(destBlock, 'CPF') || '00000000000000';
    const destXNome = getTag(destBlock, 'xNome') || 'DESTINATARIO';
    const destUf = getTag(destBlock, 'UF') || 'SP';

    // Itens (det)
    const itens: DfeItem[] = [];
    const detRegex = new RegExp('<det\\\\s+nItem="(\\\\d+)">([\\\\s\\\\S]*?)<\\\\/det>', 'gi');
    let detMatch;

    while ((detMatch = detRegex.exec(xmlContent)) !== null) {
      const nItem = parseInt(detMatch[1] || '1', 10);
      const detContent = detMatch[2] || '';
      
      const cProd = getTag(detContent, 'cProd') || ('PROD-' + nItem);
      const xProd = getTag(detContent, 'xProd') || ('Item ' + nItem);
      const ncm = getTag(detContent, 'NCM') || '84713012';
      const cfop = getTag(detContent, 'CFOP') || '5102';
      const uCom = getTag(detContent, 'uCom') || 'UN';
      const qCom = parseFloat(getTag(detContent, 'qCom') || '1');
      const vUnCom = parseFloat(getTag(detContent, 'vUnCom') || '100');
      const vProd = parseFloat(getTag(detContent, 'vProd') || String(qCom * vUnCom));

      // ICMS
      const icmsBlock = getTag(detContent, 'ICMS');
      const cstIcms = getTag(icmsBlock, 'CST') || getTag(icmsBlock, 'CSOSN') || '00';
      const vBcIcms = parseFloat(getTag(icmsBlock, 'vBC') || '0');
      const pIcms = parseFloat(getTag(icmsBlock, 'pICMS') || '0');
      const vIcms = parseFloat(getTag(icmsBlock, 'vICMS') || '0');

      // PIS
      const pisBlock = getTag(detContent, 'PIS');
      const cstPis = getTag(pisBlock, 'CST') || '01';
      const vBcPis = parseFloat(getTag(pisBlock, 'vBC') || '0');
      const pPis = parseFloat(getTag(pisBlock, 'pPIS') || '0');
      const vPis = parseFloat(getTag(pisBlock, 'vPIS') || '0');

      // COFINS
      const cofinsBlock = getTag(detContent, 'COFINS');
      const cstCofins = getTag(cofinsBlock, 'CST') || '01';
      const vBcCofins = parseFloat(getTag(cofinsBlock, 'vBC') || '0');
      const pCofins = parseFloat(getTag(cofinsBlock, 'pCOFINS') || '0');
      const vCofins = parseFloat(getTag(cofinsBlock, 'vCOFINS') || '0');

      itens.push({
        numeroItem: nItem,
        codigoProduto: cProd,
        descricao: xProd,
        ncm,
        cfop,
        unidade: uCom,
        quantidade: qCom,
        valorUnitario: vUnCom,
        valorTotal: vProd,
        icms: { cst: cstIcms, baseCalculo: vBcIcms, aliquota: pIcms, valor: vIcms },
        pis: { cst: cstPis, baseCalculo: vBcPis, aliquota: pPis, valor: vPis },
        cofins: { cst: cstCofins, baseCalculo: vBcCofins, aliquota: pCofins, valor: vCofins }
      });
    }

    // Totais
    const totalBlock = getTag(xmlContent, 'total');
    const vProdTot = parseFloat(getTag(totalBlock, 'vProd') || '0');
    const vFrete = parseFloat(getTag(totalBlock, 'vFrete') || '0');
    const vSeg = parseFloat(getTag(totalBlock, 'vSeg') || '0');
    const vDesc = parseFloat(getTag(totalBlock, 'vDesc') || '0');
    const vIpi = parseFloat(getTag(totalBlock, 'vIPI') || '0');
    const vIcmsTot = parseFloat(getTag(totalBlock, 'vICMS') || '0');
    const vIcmsSt = parseFloat(getTag(totalBlock, 'vST') || '0');
    const vPisTot = parseFloat(getTag(totalBlock, 'vPIS') || '0');
    const vCofinsTot = parseFloat(getTag(totalBlock, 'vCOFINS') || '0');
    const vNF = parseFloat(getTag(totalBlock, 'vNF') || String(vProdTot + vFrete + vSeg + vIpi + vIcmsSt - vDesc));

    // Duplicatas
    const duplicatas: DfeDocument['duplicatas'] = [];
    const dupRegex = new RegExp('<dup>([\\\\s\\\\S]*?)<\\\\/dup>', 'gi');
    let dupMatch;
    while ((dupMatch = dupRegex.exec(xmlContent)) !== null) {
      const dupBlock = dupMatch[1] || '';
      duplicatas.push({
        numero: getTag(dupBlock, 'nDup') || '001',
        vencimento: getTag(dupBlock, 'dVenc') || dhEmi.substring(0, 10),
        valor: parseFloat(getTag(dupBlock, 'vDup') || String(vNF))
      });
    }

    return Ok({
      chaveAcesso,
      tipo: 'NFE',
      numero: nNF,
      serie,
      dataEmissao: dhEmi.substring(0, 10),
      naturezaOperacao: natOp,
      emitente: { cnpj: emitCnpj, razaoSocial: emitXNome, uf: emitUf, inscricaoEstadual: emitIe },
      destinatario: { cnpjCpf: destCnpj, razaoSocial: destXNome, uf: destUf },
      itens,
      totais: {
        valorProdutos: vProdTot,
        valorFrete: vFrete,
        valorSeguro: vSeg,
        valorDesconto: vDesc,
        valorIpi: vIpi,
        valorIcms: vIcmsTot,
        valorIcmsSt: vIcmsSt,
        valorPis: vPisTot,
        valorCofins: vCofinsTot,
        valorTotalNota: vNF
      },
      duplicatas
    });
  } catch (err) {
    return Err(err instanceof Error ? err : new Error('Falha ao parsear XML de NF-e.'));
  }
}
`);

write('packages/core/tests/sped.test.ts', `
import { describe, it, expect } from 'vitest';
import { generateSpedEcd } from '../src/sped/ecd/ecd-generator.js';
import { validateSpedFile } from '../src/sped/validator/pva-validator.js';
import { createStandardChartOfAccounts } from '../src/accounting/chart-of-accounts/standard-chart.js';
import { DoubleEntryEngine } from '../src/accounting/ledger/double-entry.js';
import { Company } from '../src/types/company.js';
import { unwrap } from '../src/types/result.js';

describe('SPED ECD & Validador PVA Pre-Flight', () => {
  const mockCompany: Company = {
    id: 'comp-1',
    tenantId: 'tenant-1',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO TECNOLOGIA E SERVICOS CONTABEIS LTDA',
    nomeFantasia: 'Soberano Contábil',
    cnaePrincipal: '6920601',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_PRESUMIDO',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('deve gerar um arquivo SPED ECD válido e passar na validação Pre-Flight PVA sem erros', () => {
    const contas = createStandardChartOfAccounts('tenant-1');
    const engine = new DoubleEntryEngine(contas);
    
    engine.postEntry(
      'tenant-1',
      '2026-01-15',
      'Recebimento de Duplicatas',
      [
        { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 5000.00 },
        { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'CREDIT', amount: 5000.00 }
      ]
    );

    const spedConteudo = generateSpedEcd(mockCompany, 2026, engine.getAccounts(), engine.getEntries());
    expect(spedConteudo).toContain('|0000|LECD|01012026|31122026|');
    expect(spedConteudo).toContain('|I010|G|10.00|');
    expect(spedConteudo).toContain('|9999|');

    const validacao = unwrap(validateSpedFile('ECD', spedConteudo));
    expect(validacao.isAprovadoPreFlight).toBe(true);
    expect(validacao.totalErros).toBe(0);
    expect(validacao.totalLinhas).toBeGreaterThan(10);
  });

  it('deve acusar erro Pre-Flight quando uma conta contábil for lançada sem constar no registro I050', () => {
    const spedInvalido = [
      '|0000|LECD|01012026|31122026|EMPRESA TESTE|12345678000195|SP||3550308||0|1|',
      '|I050|01012026|D|A|4|1.1.1.01|101|Caixa Geral|',
      '|I200|1|15012026|1000,00|N|',
      '|I250|9.9.9.99||1000,00|D|1|Lancamento Fantasma|',
      '|I250|1.1.1.01||1000,00|C|1|Contrapartida|',
      '|9999|6|'
    ].join('\n');

    const validacao = unwrap(validateSpedFile('ECD', spedInvalido));
    expect(validacao.isAprovadoPreFlight).toBe(false);
    expect(validacao.totalErros).toBeGreaterThan(0);
    expect(validacao.inconsistencias[0]?.campo).toBe('COD_CTA');
  });
});
`);
