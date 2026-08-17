import { Company } from '../../types/company.js';

export function generateEfdReinfR4020Xml(
  company: Company,
  cnpjBeneficiario: string,
  naturezaRendimento: string, // e.g. "15001" (Serviços de desenvolvimento de software)
  valorBruto: number,
  valorIrrf: number,
  valorCsll: number,
  valorCofins: number,
  valorPis: number
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Reinf xmlns="http://www.reinf.esocial.gov.br/schemas/evt4020PagtoBeneficiarioPJ/v2_01_02">
  <evtRetPJ Id="ID1${company.cnpj}${Date.now()}">
    <ideEvento>
      <tpAmb>1</tpAmb>
      <procEmi>1</procEmi>
      <verProc>Soberano_2026.1</verProc>
    </ideEvento>
    <ideContri>
      <tpInsc>1</tpInsc>
      <nrInsc>${company.cnpj}</nrInsc>
    </ideContri>
    <ideEstab>
      <tpInscEstab>1</tpInscEstab>
      <nrInscEstab>${company.cnpj}</nrInscEstab>
      <ideBenef>
        <cnpjBenef>${cnpjBeneficiario}</cnpjBenef>
        <idePgto>
          <natRend>${naturezaRendimento}</natRend>
          <infoPgto>
            <dtFG>${new Date().toISOString().substring(0, 10)}</dtFG>
            <vlrBruto>${valorBruto.toFixed(2)}</vlrBruto>
            <vlrBaseIR>${valorBruto.toFixed(2)}</vlrBaseIR>
            <vlrIR>${valorIrrf.toFixed(2)}</vlrIR>
            <vlrBaseCSLL>${valorBruto.toFixed(2)}</vlrBaseCSLL>
            <vlrCSLL>${valorCsll.toFixed(2)}</vlrCSLL>
            <vlrBaseCofins>${valorBruto.toFixed(2)}</vlrBaseCofins>
            <vlrCofins>${valorCofins.toFixed(2)}</vlrCofins>
            <vlrBasePis>${valorBruto.toFixed(2)}</vlrBasePis>
            <vlrPis>${valorPis.toFixed(2)}</vlrPis>
          </infoPgto>
        </ideBenef>
      </ideEstab>
    </ideEstab>
  </evtRetPJ>
</Reinf>`;
}
