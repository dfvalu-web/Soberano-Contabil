import { describe, it, expect } from 'vitest';
import { parseNfeXml } from '../src/dfe/nfe/nfe-parser.js';
import { convertDfeToJournalLines } from '../src/dfe/auto-entry/dfe-to-accounting.js';
import { runCrossCheckAudit } from '../src/audit/cross-check/cross-auditor.js';
import { Company } from '../src/types/company.js';
import { unwrap } from '../src/types/result.js';

describe('Ingestão DF-e & Conversão Contábil Automática', () => {
  const xmlExemploNfe = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe35260112345678000195550010000001231000001234" versao="4.00">
      <ide>
        <nNF>123</nNF>
        <serie>1</serie>
        <dhEmi>2026-01-15T10:00:00-03:00</dhEmi>
        <natOp>VENDA DE MERCADORIAS</natOp>
      </ide>
      <emit>
        <CNPJ>99888777000111</CNPJ>
        <xNome>FORNECEDOR DE PECAS LTDA</xNome>
        <UF>SP</UF>
      </emit>
      <dest>
        <CNPJ>12345678000195</CNPJ>
        <xNome>SOBERANO CONTABIL CLIENTE LTDA</xNome>
        <UF>SP</UF>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>SKU-001</cProd>
          <xProd>NOTEBOOK CORPORATIVO ULTRA</xProd>
          <NCM>84713012</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>2</qCom>
          <vUnCom>4000.00</vUnCom>
          <vProd>8000.00</vProd>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <CST>00</CST>
              <vBC>8000.00</vBC>
              <pICMS>18.00</pICMS>
              <vICMS>1440.00</vICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>01</CST>
              <vBC>8000.00</vBC>
              <pPIS>1.65</pPIS>
              <vPIS>132.00</vPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>01</CST>
              <vBC>8000.00</vBC>
              <pCOFINS>7.60</pCOFINS>
              <vCOFINS>608.00</vCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vProd>8000.00</vProd>
          <vICMS>1440.00</vICMS>
          <vPIS>132.00</vPIS>
          <vCOFINS>608.00</vCOFINS>
          <vNF>8000.00</vNF>
        </ICMSTot>
      </total>
      <cobr>
        <dup>
          <nDup>001</nDup>
          <dVenc>2026-02-15</dVenc>
          <vDup>8000.00</vDup>
        </dup>
      </cobr>
    </infNFe>
  </NFe>
</nfeProc>`;

  const mockCompanyDest: Company = {
    id: 'comp-1',
    tenantId: 'tenant-1',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO CONTABIL CLIENTE LTDA',
    nomeFantasia: 'Soberano Cliente',
    cnaePrincipal: '4751201',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('deve parsear o XML de NF-e e extrair emitente, itens e impostos corretamente', () => {
    const res = parseNfeXml(xmlExemploNfe);
    const dfe = unwrap(res);

    expect(dfe.numero).toBe('123');
    expect(dfe.emitente.razaoSocial).toBe('FORNECEDOR DE PECAS LTDA');
    expect(dfe.itens.length).toBe(1);
    expect(dfe.itens[0]?.ncm).toBe('84713012');
    expect(dfe.totais.valorIcms).toBe(1440.00);
    expect(dfe.totais.valorPis).toBe(132.00);
    expect(dfe.totais.valorCofins).toBe(608.00);
  });

  it('deve gerar lançamentos de compra com apropriação de créditos de ICMS, PIS e COFINS no Lucro Real', () => {
    const dfe = unwrap(parseNfeXml(xmlExemploNfe));
    const linhas = unwrap(convertDfeToJournalLines(dfe, mockCompanyDest));

    expect(linhas.length).toBe(5); // Estoque Líquido, ICMS a rec, PIS a rec, COFINS a rec, Fornecedores
    const totalDebito = linhas.filter(l => l.type === 'DEBIT').reduce((s, l) => s + l.amount, 0);
    const totalCredito = linhas.filter(l => l.type === 'CREDIT').reduce((s, l) => s + l.amount, 0);

    expect(totalDebito).toBeCloseTo(8000.00, 2);
    expect(totalCredito).toBeCloseTo(8000.00, 2);
  });
});

describe('Auditoria Preditiva: Pre-Flight Cross-Auditor', () => {
  it('deve detectar discrepância de faturamento entre EFD-ICMS e ECF e alertar severidade crítica', () => {
    const mockCompany: Company = {
      id: 'comp-1',
      tenantId: 'tenant-1',
      cnpj: '12345678000195',
      razaoSocial: 'EMPRESA AUDITADA S/A',
      nomeFantasia: 'Auditada',
      cnaePrincipal: '4751201',
      cnaesSecundarios: [],
      regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
      uf: 'SP',
      codigoMunicipioIbge: '3550308',
      aliquotaIssMunicipal: 0.05,
      fatorRElegivel: false,
      optanteSimples: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const report = unwrap(runCrossCheckAudit(mockCompany, '2026-Q1', {
      faturamentoEfdIcms: 1000000.00,
      faturamentoEfdContribuicoes: 1000000.00,
      faturamentoEcfDRE: 1200000.00, // Divergência de 200k
      inssDctfWebApurado: 50000.00,
      inssEsocialCalculado: 50000.00,
      inssReinfRetido: 0
    }));

    expect(report.totalAnomalias).toBe(1);
    expect(report.anomaliasCriticas).toBe(1);
    expect(report.scoreConformidadeFiscal).toBeLessThan(100);
    expect(report.anomalias[0]?.id).toBe('ANOM-002');
  });
});
