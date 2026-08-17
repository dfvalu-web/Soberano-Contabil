import { Company } from '../../types/company.js';
import { PayrollResult } from '../../types/payroll.js';

export function generateEsocialS1000(company: Company): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoEmpregador/v_S_01_02_00">
  <evtInfoEmpregador id="ID1${company.cnpj.padStart(14, '0')}${Date.now()}">
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
          <nmRazao>${company.razaoSocial}</nmRazao>
          <classTrib>${company.optanteSimples ? '01' : '99'}</classTrib>
          <indCoop>0</indCoop>
          <indConstr>0</indConstr>
          <indDesFolha>0</indDesFolha>
          <indOptRegEletron>1</indOptRegEletron>
        </infoCadastro>
      </inclusao>
    </infoEmpregador>
  </evtInfoEmpregador>
</eSocial>`;
}

export function generateEsocialS1200(
  company: Company,
  cpfTrabalhador: string,
  matricula: string,
  periodoApuracao: string,
  payroll: PayrollResult
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtRemun/v_S_01_02_00">
  <evtRemun id="ID1${company.cnpj.padStart(14, '0')}${Date.now()}">
    <ideEvento>
      <indRetif>1</indRetif>
      <perApur>${periodoApuracao}</perApur>
      <tpAmb>1</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${company.cnpj}</nrInsc>
    </ideEmpregador>
    <ideTrabalhador>
      <cpfTrab>${cpfTrabalhador}</cpfTrab>
    </ideTrabalhador>
    <dmDev>
      <ideDmDev>DM-${matricula}-01</ideDmDev>
      <infoPerApur>
        <ideEstabLot>
          <tpInsc>1</tpInsc>
          <nrInsc>${company.cnpj}</nrInsc>
          <codLotacao>01</codLotacao>
          <remunPerApur>
            <matricula>${matricula}</matricula>
            <itensRemun>
              <codRubr>1000</codRubr>
              <ideTabRubr>TAB01</ideTabRubr>
              <vrRubr>${payroll.proventos.salarioBase.toFixed(2)}</vrRubr>
            </itensRemun>
            <itensRemun>
              <codRubr>9001</codRubr>
              <ideTabRubr>TAB01</ideTabRubr>
              <vrRubr>${payroll.descontos.inss.toFixed(2)}</vrRubr>
            </itensRemun>
          </remunPerApur>
        </ideEstabLot>
      </infoPerApur>
    </dmDev>
  </evtRemun>
</eSocial>`;
}
