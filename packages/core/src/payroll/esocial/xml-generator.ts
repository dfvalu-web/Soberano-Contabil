import { Company } from '../../types/company.js';

export function generateEsocialS1000Xml(company: Company): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoEmpregador/v_S_01_02_00">
  <evtInfoEmpregador Id="ID1${company.cnpj}${Date.now().toString().padStart(14, '0')}">
    <ideEvento>
      <tpAmb>1</tpAmb>
      <procEmi>1</procEmi>
      <verProc>SoberanoContabil_2026.1</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${company.cnpj}</nrInsc>
    </ideEmpregador>
    <infoEmpregador>
      <inclusao>
        <idePeriodo>
          <iniValid>2026-01</iniValid>
        </idePeriodo>
        <infoCadastro>
          <classTrib>${company.optanteSimples ? '01' : '99'}</classTrib>
          <indCoop>0</indCoop>
          <indConstr>0</indConstr>
          <indDesFolha>0</indDesFolha>
          <indOptRegEletron>1</indOptRegEletron>
          <contato>
            <nmCtt>RESPONSAVEL RH SOBERANO</nmCtt>
            <cpfCtt>12345678901</cpfCtt>
            <foneFixo>1133334444</foneFixo>
            <email>rh@soberano.com.br</email>
          </contato>
        </infoCadastro>
      </inclusao>
    </infoEmpregador>
  </evtInfoEmpregador>
</eSocial>`;
}

export function generateEsocialS1200Xml(
  company: Company,
  cpfTrabalhador: string,
  matricula: string,
  mesAno: string, // e.g. "2026-01"
  valorSalarioBruto: number,
  valorInssDescontado: number
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtRemun/v_S_01_02_00">
  <evtRemun Id="ID1${company.cnpj}${Date.now().toString().padStart(14, '0')}">
    <ideEvento>
      <indRetif>1</indRetif>
      <perApur>${mesAno}</perApur>
      <tpAmb>1</tpAmb>
      <procEmi>1</procEmi>
      <verProc>SoberanoContabil_2026.1</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${company.cnpj}</nrInsc>
    </ideEmpregador>
    <ideTrabalhador>
      <cpfTrab>${cpfTrabalhador.replace(/\D/g, '')}</cpfTrab>
      <infoComplem>
        <nmTrab>COLABORADOR SOBERANO</nmTrab>
      </infoComplem>
    </ideTrabalhador>
    <dmDev>
      <ideDmDev>DEMO-01</ideDmDev>
      <codCateg>101</codCateg>
      <infoPerApur>
        <ideEstabLot>
          <tpInsc>1</tpInsc>
          <nrInsc>${company.cnpj}</nrInsc>
          <codLotacao>LOT-001</codLotacao>
          <remunPerApur>
            <matricula>${matricula}</matricula>
            <itensRemun>
              <codRubr>1000</codRubr>
              <ideTabRubr>TAB-01</ideTabRubr>
              <qtdRubr>30</qtdRubr>
              <vrRubr>${valorSalarioBruto.toFixed(2)}</vrRubr>
              <indApurIR>0</indApurIR>
            </itensRemun>
            <itensRemun>
              <codRubr>9000</codRubr>
              <ideTabRubr>TAB-01</ideTabRubr>
              <vrRubr>${valorInssDescontado.toFixed(2)}</vrRubr>
              <indApurIR>0</indApurIR>
            </itensRemun>
          </remunPerApur>
        </ideEstabLot>
      </infoPerApur>
    </dmDev>
  </evtRemun>
</eSocial>`;
}
