import { describe, it, expect } from 'vitest';
import { parseCteXml, parseNfseXml } from '../src/dfe/parsers/cte-nfse-parser.js';
import { detectFiscalAnomalies } from '../src/audit/anomaly-detector.js';
import { unwrap } from '../src/types/result.js';

describe('Etapa 6: Ingestao DF-e Avancada (CT-e, NFS-e) & Detector de Anomalias Fiscais', () => {
  it('deve fazer o parsing de CT-e extraindo valores de frete e ICMS para tomada de credito', () => {
    const cteXml = '<cteProc><CTe Id="CTe35260199888777000111570010000001231000001234"><infCte><ide><nCT>123</nCT><serie>1</serie><dhEmi>2026-01-15T10:00:00-03:00</dhEmi><CFOP>5353</CFOP></ide><emit><CNPJ>99888777000111</CNPJ><xNome>TRANS EXPRESS TRANSPORTES LTDA</xNome></emit><vPrest><vTPrest>5000.00</vTPrest></vPrest><imp><ICMS><ICMS00><CST>00</CST><pICMS>12.00</pICMS><vICMS>600.00</vICMS></ICMS00></ICMS></imp></infCte></CTe></cteProc>';
    const res = parseCteXml(cteXml);
    const data = unwrap(res);

    expect(data.chaveCte).toContain('35260199888777000111570010000001231000001234');
    expect(data.valorTotalServico).toBe(5000.00);
    expect(data.valorIcms).toBe(600.00);
    expect(data.aliquotaIcms).toBe(12.00);
  });

  it('deve fazer o parsing de NFS-e extraindo retencoes federais (PIS, COFINS, CSLL, IRRF, INSS)', () => {
    const nfseXml = '<CompNfse><Nfse><InfNfse><Numero>987</Numero><CodigoVerificacao>ABCD1234</CodigoVerificacao><DataEmissao>2026-01-20T15:00:00</DataEmissao><ValoresNfse><ValorServicos>10000.00</ValorServicos><ValorPis>65.00</ValorPis><ValorCofins>300.00</ValorCofins><ValorInss>0.00</ValorInss><ValorIr>150.00</ValorIr><ValorCsll>100.00</ValorCsll><ValorIss>500.00</ValorIss><Aliquota>0.05</Aliquota></ValoresNfse><ItemListaServico>01.07</ItemListaServico></InfNfse></Nfse></CompNfse>';
    const res = parseNfseXml(nfseXml);
    const data = unwrap(res);

    expect(data.numeroNfse).toBe('987');
    expect(data.valorServicos).toBe(10000.00);
    expect(data.valorPis).toBe(65.00);
    expect(data.valorCofins).toBe(300.00);
    expect(data.valorIrrf).toBe(150.00);
    expect(data.valorCsll).toBe(100.00);
    expect(data.valorLiquidoNfse).toBe(8885.00); // 10k - 65 - 300 - 150 - 100 - 500
  });

  it('deve detectar anomalias fiscais como CST 00 com aliquota 0% e produtos monofásicos tributados indevidamente', () => {
    const itens = [
      {
        ncm: '84715010',
        cfop: '5102',
        cstIcms: '00', // Anomalia: CST 00 com aliq 0
        cstPisCofins: '01',
        aliqIcms: 0,
        aliqPis: 1.65,
        aliqCofins: 7.60,
        valorOperacao: 10000.00
      },
      {
        ncm: '30049099',
        cfop: '5102',
        cstIcms: '60',
        cstPisCofins: '04', // Monofásico
        aliqIcms: 0,
        aliqPis: 1.65, // Anomalia: monofásico com aliquota positiva
        aliqCofins: 7.60,
        valorOperacao: 5000.00
      }
    ];

    const res = detectFiscalAnomalies(itens);
    const rep = unwrap(res);

    expect(rep.totalItensAnalisados).toBe(2);
    expect(rep.totalAnomaliasEncontradas).toBe(2);
    expect(rep.scoreConformidadeItem).toBe(60); // 100 - (2 * 20)
    expect(rep.anomalias.some(a => a.tipo === 'CST_INCOMPATIVEL')).toBe(true);
    expect(rep.anomalias.some(a => a.tipo === 'MONOFASICO_TRIBUTADO')).toBe(true);
  });
});
