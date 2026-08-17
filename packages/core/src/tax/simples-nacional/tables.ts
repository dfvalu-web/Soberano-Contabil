import { SimplesBracket, SimplesAnexo } from '../../types/tax.js';

export const ANEXO_I_COMERCIO: SimplesBracket[] = [
  { faixa: 1, limiteSuperior: 180000.00, aliquotaNominal: 0.0400, parcelaADeduzir: 0.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.4150, icms: 0.3400, iss: 0.00 } },
  { faixa: 2, limiteSuperior: 360000.00, aliquotaNominal: 0.0730, parcelaADeduzir: 5940.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.4150, icms: 0.3400, iss: 0.00 } },
  { faixa: 3, limiteSuperior: 720000.00, aliquotaNominal: 0.0950, parcelaADeduzir: 13860.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.4200, icms: 0.3350, iss: 0.00 } },
  { faixa: 4, limiteSuperior: 1800000.00, aliquotaNominal: 0.1070, parcelaADeduzir: 22500.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.4200, icms: 0.3350, iss: 0.00 } },
  { faixa: 5, limiteSuperior: 3600000.00, aliquotaNominal: 0.1430, parcelaADeduzir: 87300.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1274, pis: 0.0276, cpp: 0.4200, icms: 0.3350, iss: 0.00 } },
  { faixa: 6, limiteSuperior: 4800000.00, aliquotaNominal: 0.1900, parcelaADeduzir: 378000.00, percentuais: { irpj: 0.135, csll: 0.100, cofins: 0.2827, pis: 0.0613, cpp: 0.4210, icms: 0.00, iss: 0.00 } }
];

export const ANEXO_II_INDUSTRIA: SimplesBracket[] = [
  { faixa: 1, limiteSuperior: 180000.00, aliquotaNominal: 0.0450, parcelaADeduzir: 0.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1151, pis: 0.0249, cpp: 0.3750, icms: 0.3200, iss: 0.0750 } },
  { faixa: 2, limiteSuperior: 360000.00, aliquotaNominal: 0.0780, parcelaADeduzir: 5940.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1151, pis: 0.0249, cpp: 0.3750, icms: 0.3200, iss: 0.0750 } },
  { faixa: 3, limiteSuperior: 720000.00, aliquotaNominal: 0.1000, parcelaADeduzir: 13860.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1151, pis: 0.0249, cpp: 0.3750, icms: 0.3200, iss: 0.0750 } },
  { faixa: 4, limiteSuperior: 1800000.00, aliquotaNominal: 0.1120, parcelaADeduzir: 22500.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1151, pis: 0.0249, cpp: 0.3750, icms: 0.3200, iss: 0.0750 } },
  { faixa: 5, limiteSuperior: 3600000.00, aliquotaNominal: 0.1470, parcelaADeduzir: 85500.00, percentuais: { irpj: 0.055, csll: 0.035, cofins: 0.1151, pis: 0.0249, cpp: 0.3750, icms: 0.3200, iss: 0.0750 } },
  { faixa: 6, limiteSuperior: 4800000.00, aliquotaNominal: 0.3000, parcelaADeduzir: 720000.00, percentuais: { irpj: 0.085, csll: 0.075, cofins: 0.2096, pis: 0.0454, cpp: 0.2350, icms: 0.00, iss: 0.3500 } }
];

export const ANEXO_III_SERVICOS: SimplesBracket[] = [
  { faixa: 1, limiteSuperior: 180000.00, aliquotaNominal: 0.0600, parcelaADeduzir: 0.00, percentuais: { irpj: 0.040, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.4340, icms: 0.00, iss: 0.3350 } },
  { faixa: 2, limiteSuperior: 360000.00, aliquotaNominal: 0.1120, parcelaADeduzir: 9360.00, percentuais: { irpj: 0.040, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.4340, icms: 0.00, iss: 0.3350 } },
  { faixa: 3, limiteSuperior: 720000.00, aliquotaNominal: 0.1350, parcelaADeduzir: 17640.00, percentuais: { irpj: 0.040, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.4340, icms: 0.00, iss: 0.3350 } },
  { faixa: 4, limiteSuperior: 1800000.00, aliquotaNominal: 0.1600, parcelaADeduzir: 35640.00, percentuais: { irpj: 0.040, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.4340, icms: 0.00, iss: 0.3350 } },
  { faixa: 5, limiteSuperior: 3600000.00, aliquotaNominal: 0.2100, parcelaADeduzir: 125640.00, percentuais: { irpj: 0.040, csll: 0.035, cofins: 0.1282, pis: 0.0278, cpp: 0.4340, icms: 0.00, iss: 0.3350 } },
  { faixa: 6, limiteSuperior: 4800000.00, aliquotaNominal: 0.3300, parcelaADeduzir: 648000.00, percentuais: { irpj: 0.350, csll: 0.150, cofins: 0.1603, pis: 0.0347, cpp: 0.3050, icms: 0.00, iss: 0.00 } }
];

export const ANEXO_IV_SERVICOS: SimplesBracket[] = [
  { faixa: 1, limiteSuperior: 180000.00, aliquotaNominal: 0.0450, parcelaADeduzir: 0.00, percentuais: { irpj: 0.188, csll: 0.152, cofins: 0.1767, pis: 0.0383, cpp: 0.00, icms: 0.00, iss: 0.4450 } },
  { faixa: 2, limiteSuperior: 360000.00, aliquotaNominal: 0.0900, parcelaADeduzir: 8100.00, percentuais: { irpj: 0.198, csll: 0.152, cofins: 0.2055, pis: 0.0445, cpp: 0.00, icms: 0.00, iss: 0.4000 } },
  { faixa: 3, limiteSuperior: 720000.00, aliquotaNominal: 0.1020, parcelaADeduzir: 12420.00, percentuais: { irpj: 0.208, csll: 0.152, cofins: 0.1973, pis: 0.0427, cpp: 0.00, icms: 0.00, iss: 0.4000 } },
  { faixa: 4, limiteSuperior: 1800000.00, aliquotaNominal: 0.1400, parcelaADeduzir: 39780.00, percentuais: { irpj: 0.178, csll: 0.192, cofins: 0.1890, pis: 0.0410, cpp: 0.00, icms: 0.00, iss: 0.4000 } },
  { faixa: 5, limiteSuperior: 3600000.00, aliquotaNominal: 0.2200, parcelaADeduzir: 183780.00, percentuais: { irpj: 0.188, csll: 0.230, cofins: 0.1810, pis: 0.0390, cpp: 0.00, icms: 0.00, iss: 0.3620 } },
  { faixa: 6, limiteSuperior: 4800000.00, aliquotaNominal: 0.3300, parcelaADeduzir: 828000.00, percentuais: { irpj: 0.535, csll: 0.215, cofins: 0.2055, pis: 0.0445, cpp: 0.00, icms: 0.00, iss: 0.00 } }
];

export const ANEXO_V_SERVICOS: SimplesBracket[] = [
  { faixa: 1, limiteSuperior: 180000.00, aliquotaNominal: 0.1550, parcelaADeduzir: 0.00, percentuais: { irpj: 0.250, csll: 0.150, cofins: 0.1410, pis: 0.0305, cpp: 0.2885, icms: 0.00, iss: 0.1400 } },
  { faixa: 2, limiteSuperior: 360000.00, aliquotaNominal: 0.1800, parcelaADeduzir: 4500.00, percentuais: { irpj: 0.230, csll: 0.150, cofins: 0.1410, pis: 0.0305, cpp: 0.2785, icms: 0.00, iss: 0.1700 } },
  { faixa: 3, limiteSuperior: 720000.00, aliquotaNominal: 0.1950, parcelaADeduzir: 9900.00, percentuais: { irpj: 0.240, csll: 0.150, cofins: 0.1492, pis: 0.0323, cpp: 0.2385, icms: 0.00, iss: 0.1900 } },
  { faixa: 4, limiteSuperior: 1800000.00, aliquotaNominal: 0.2050, parcelaADeduzir: 17100.00, percentuais: { irpj: 0.210, csll: 0.150, cofins: 0.1574, pis: 0.0341, cpp: 0.2385, icms: 0.00, iss: 0.2100 } },
  { faixa: 5, limiteSuperior: 3600000.00, aliquotaNominal: 0.2300, parcelaADeduzir: 62100.00, percentuais: { irpj: 0.230, csll: 0.125, cofins: 0.1410, pis: 0.0305, cpp: 0.2385, icms: 0.00, iss: 0.2350 } },
  { faixa: 6, limiteSuperior: 4800000.00, aliquotaNominal: 0.3050, parcelaADeduzir: 540000.00, percentuais: { irpj: 0.350, csll: 0.155, cofins: 0.1644, pis: 0.0356, cpp: 0.2950, icms: 0.00, iss: 0.00 } }
];

export function getSimplesTable(anexo: SimplesAnexo): SimplesBracket[] {
  switch (anexo) {
    case 'ANEXO_I': return ANEXO_I_COMERCIO;
    case 'ANEXO_II': return ANEXO_II_INDUSTRIA;
    case 'ANEXO_III': return ANEXO_III_SERVICOS;
    case 'ANEXO_IV': return ANEXO_IV_SERVICOS;
    case 'ANEXO_V': return ANEXO_V_SERVICOS;
  }
}
