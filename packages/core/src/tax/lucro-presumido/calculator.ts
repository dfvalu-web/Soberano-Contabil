import { LucroPresumidoInput, LucroPresumidoResult } from '../../types/tax.js';
import { Result, Ok } from '../../types/result.js';

export const TAXA_IRPJ_BASE = 0.15;
export const TAXA_ADICIONAL_IRPJ = 0.10;
export const LIMITE_ISENCAO_ADICIONAL_TRIMESTRAL = 60000.00;
export const TAXA_CSLL_GERAL = 0.09;
export const TAXA_PIS_CUMULATIVO = 0.0065;
export const TAXA_COFINS_CUMULATIVO = 0.0300;

export function calculateLucroPresumido(input: LucroPresumidoInput): Result<LucroPresumidoResult, Error> {
  const {
    trimestre,
    ano,
    receitaComercio,
    receitaIndustria,
    receitaServicosGerais,
    receitaServicosHospitalares,
    receitaTransportes,
    outrasReceitas,
    retencoesFonteSofridas
  } = input;

  const baseIrpjComercio = receitaComercio * 0.08;
  const baseIrpjIndustria = receitaIndustria * 0.08;
  const baseIrpjServicosHosp = receitaServicosHospitalares * 0.08;
  const baseIrpjTransportes = receitaTransportes * 0.16;
  const baseIrpjServicos = receitaServicosGerais * 0.32;
  
  const basePresumidaIrpj = Number((
    baseIrpjComercio +
    baseIrpjIndustria +
    baseIrpjServicosHosp +
    baseIrpjTransportes +
    baseIrpjServicos +
    outrasReceitas
  ).toFixed(2));

  const irpjBase15 = Number((basePresumidaIrpj * TAXA_IRPJ_BASE).toFixed(2));
  const excessoTrimestral = Math.max(0, basePresumidaIrpj - LIMITE_ISENCAO_ADICIONAL_TRIMESTRAL);
  const adicionalIrpj10 = Number((excessoTrimestral * TAXA_ADICIONAL_IRPJ).toFixed(2));
  const irpjTotalDevido = Number((irpjBase15 + adicionalIrpj10).toFixed(2));
  const irpjRetidoFonte = retencoesFonteSofridas?.irrf || 0;
  const irpjAPagar = Number(Math.max(0, irpjTotalDevido - irpjRetidoFonte).toFixed(2));

  const baseCsllComercio = receitaComercio * 0.12;
  const baseCsllIndustria = receitaIndustria * 0.12;
  const baseCsllServicosHosp = receitaServicosHospitalares * 0.12;
  const baseCsllTransportes = receitaTransportes * 0.12;
  const baseCsllServicos = receitaServicosGerais * 0.32;

  const basePresumidaCsll = Number((
    baseCsllComercio +
    baseCsllIndustria +
    baseCsllServicosHosp +
    baseCsllTransportes +
    baseCsllServicos +
    outrasReceitas
  ).toFixed(2));

  const csllTotalDevida = Number((basePresumidaCsll * TAXA_CSLL_GERAL).toFixed(2));
  const csllRetidaFonte = retencoesFonteSofridas?.csll || 0;
  const csllAPagar = Number(Math.max(0, csllTotalDevida - csllRetidaFonte).toFixed(2));

  const receitaBrutaTotalOperacional = receitaComercio + receitaIndustria + receitaServicosGerais + receitaServicosHospitalares + receitaTransportes;
  const pisCumulativoMensal = Number((receitaBrutaTotalOperacional * TAXA_PIS_CUMULATIVO).toFixed(2));
  const cofinsCumulativoMensal = Number((receitaBrutaTotalOperacional * TAXA_COFINS_CUMULATIVO).toFixed(2));
  const csrfRetidaCompensavel = retencoesFonteSofridas?.csrf || 0;

  const totalTributosFederaisAPagar = Number((irpjAPagar + csllAPagar + pisCumulativoMensal + cofinsCumulativoMensal).toFixed(2));

  return Ok({
    trimestre,
    ano,
    basePresumidaIrpj,
    irpjBase15,
    adicionalIrpj10,
    irpjTotalDevido,
    irpjRetidoFonte,
    irpjAPagar,
    basePresumidaCsll,
    csllTotalDevida,
    csllRetidaFonte,
    csllAPagar,
    pisCumulativoMensal,
    cofinsCumulativoMensal,
    csrfRetidaCompensavel,
    totalTributosFederaisAPagar
  });
}
