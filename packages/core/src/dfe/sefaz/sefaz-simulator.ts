import { Result, Ok } from '../../types/result.js';

export interface SefazDistributionBatch {
  ultimoNsu: number;
  maxNsu: number;
  documentosEncontrados: Array<{
    nsu: number;
    schema: 'procNFe' | 'procCTe' | 'procNFSe';
    chave: string;
    xml: string;
  }>;
}

export function simulateSefazBatchDistribution(cnpjConsulta: string, ultimoNsuConsultado: number = 0): Result<SefazDistributionBatch, Error> {
  const chave1 = '35260199888777000111550010000004561000004567';
  const chave2 = '35260199888777000111570010000001231000001234';

  const xmlNfe = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${chave1}" versao="4.00">
      <ide><nNF>456</nNF><dhEmi>2026-01-20T14:30:00-03:00</dhEmi><natOp>VENDA MERCADORIAS</natOp></ide>
      <emit><CNPJ>99888777000111</CNPJ><xNome>DISTRIBUIDORA HARDWARE S/A</xNome><UF>SP</UF></emit>
      <dest><CNPJ>${cnpjConsulta}</CNPJ><xNome>CLIENTE SOBERANO</xNome><UF>SP</UF></dest>
      <det nItem="1">
        <prod><cProd>SRV-01</cProd><xProd>SERVIDOR DELL R750</xProd><NCM>84715010</NCM><CFOP>5102</CFOP><vProd>30000.00</vProd></prod>
        <imposto>
          <ICMS><ICMS00><CST>00</CST><vBC>30000.00</vBC><pICMS>18.00</pICMS><vICMS>5400.00</vICMS></ICMS00></ICMS>
          <PIS><PISAliq><CST>01</CST><vBC>30000.00</vBC><pPIS>1.65</pPIS><vPIS>495.00</vPIS></PISAliq></PIS>
          <COFINS><COFINSAliq><CST>01</CST><vBC>30000.00</vBC><pCOFINS>7.60</pCOFINS><vCOFINS>2280.00</vCOFINS></COFINSAliq></COFINS>
        </imposto>
      </det>
      <total><ICMSTot><vProd>30000.00</vProd><vICMS>5400.00</vICMS><vPIS>495.00</vPIS><vCOFINS>2280.00</vCOFINS><vNF>30000.00</vNF></ICMSTot></total>
    </infNFe>
  </NFe>
</nfeProc>`;

  const xmlCte = `<cteProc><CTe Id="CTe${chave2}"><infCte><ide><nCT>123</nCT><dhEmi>2026-01-20T16:00:00-03:00</dhEmi><CFOP>5353</CFOP></ide><emit><CNPJ>99888777000111</CNPJ><xNome>TRANS EXPRESS</xNome></emit><vPrest><vTPrest>2500.00</vTPrest></vPrest><imp><ICMS><ICMS00><CST>00</CST><pICMS>12.00</pICMS><vICMS>300.00</vICMS></ICMS00></ICMS></imp></infCte></CTe></cteProc>`;

  return Ok({
    ultimoNsu: ultimoNsuConsultado + 2,
    maxNsu: ultimoNsuConsultado + 2,
    documentosEncontrados: [
      {
        nsu: ultimoNsuConsultado + 1,
        schema: 'procNFe',
        chave: chave1,
        xml: xmlNfe
      },
      {
        nsu: ultimoNsuConsultado + 2,
        schema: 'procCTe',
        chave: chave2,
        xml: xmlCte
      }
    ]
  });
}
