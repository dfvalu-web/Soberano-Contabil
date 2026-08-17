import { Company } from '../../types/company.js';

export function generateEsocialS1299Xml(company: Company, perApur: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtFechaEvPer/v_S_01_02_00">
  <evtFechaEvPer Id="ID1${company.cnpj}${Date.now()}">
    <ideEvento>
      <tpAmb>1</tpAmb>
      <procEmi>1</procEmi>
      <verProc>SoberanoContabil_2026</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${company.cnpj}</nrInsc>
    </ideEmpregador>
    <infoFechaEvPer>
      <idePeriodo>
        <perApur>${perApur}</perApur>
      </idePeriodo>
      <infoFech>
        <evtRemun>S</evtRemun>
        <evtComProd>N</evtComProd>
        <evtContratAvNP>N</evtContratAvNP>
        <evtInfoComplPer>N</evtInfoComplPer>
      </infoFech>
    </infoFechaEvPer>
  </evtFechaEvPer>
</eSocial>`;
}
