import { Result, Ok, Err } from '../../types/result.js';

export type PharmacyItemType = 'MEDICAMENTO_MANIPULADO_SOB_ENCOMENDA' | 'PRODUTO_INDUSTRIALIZADO_PRATELEIRA';

export interface CompoundingPharmacyInput {
  vendaId: string;
  farmaciaNome: string;
  tipoItem: PharmacyItemType;
  valorTotalItemBrl: number;
  aliquotaIssqnMunicipalPercent?: number; // Ex: 3% a 5% (Item 4.07 LC 116/03)
  aliquotaIcmsEstadualPercent?: number; // Ex: 18% para produtos prontos
}

export interface CompoundingPharmacyResult {
  vendaId: string;
  farmaciaNome: string;
  tipoItem: PharmacyItemType;
  tributacaoExclusivaIssqnSTF: boolean;
  aliquotaIssqnPercent: number;
  valorIssqnDevidoBrl: number;
  aliquotaIcmsPercent: number;
  valorIcmsDevidoBrl: number;
  totalTributosIncidentesBrl: number;
  diagnosticoFiscal: string;
}

export function processCompoundingPharmacyMagistralTaxEngine(input: CompoundingPharmacyInput): Result<CompoundingPharmacyResult, Error> {
  const {
    vendaId,
    farmaciaNome,
    tipoItem,
    valorTotalItemBrl,
    aliquotaIssqnMunicipalPercent = 4.0,
    aliquotaIcmsEstadualPercent = 18.0
  } = input;

  if (valorTotalItemBrl <= 0) {
    return Err(new Error('Valor do item da farmácia de manipulação deve ser superior a zero.'));
  }

  // STF Tema 1079 da Repercussão Geral:
  // "Incide ISSQN sobre as operações de venda de medicamentos preparados por farmácias de manipulação sob encomenda.
  // Incide ICMS sobre as operações de venda de medicamentos prontos/industrializados por elas ofertados aos consumidores."
  if (tipoItem === 'MEDICAMENTO_MANIPULADO_SOB_ENCOMENDA') {
    const valorIss = Number((valorTotalItemBrl * (aliquotaIssqnMunicipalPercent / 100)).toFixed(2));
    const diag = 'Farmácia de Manipulação (STF Tema 1079 & Item 4.07 LC 116/03): Medicamento Manipulado sob Encomenda. INCIDÊNCIA EXCLUSIVA DE ISSQN (' + aliquotaIssqnMunicipalPercent + '%: R$ ' + valorIss.toFixed(2) + '). Não incidência de ICMS.';

    return Ok({
      vendaId,
      farmaciaNome,
      tipoItem,
      tributacaoExclusivaIssqnSTF: true,
      aliquotaIssqnPercent: aliquotaIssqnMunicipalPercent,
      valorIssqnDevidoBrl: valorIss,
      aliquotaIcmsPercent: 0,
      valorIcmsDevidoBrl: 0,
      totalTributosIncidentesBrl: valorIss,
      diagnosticoFiscal: diag
    });
  } else {
    // Produtos de Prateleira (Cosméticos, Suplementos, Medicamentos Prontos) -> ICMS
    const valorIcms = Number((valorTotalItemBrl * (aliquotaIcmsEstadualPercent / 100)).toFixed(2));
    const diag = 'Farmácia de Manipulação (STF Tema 1079): Produto Industrializado / Balcão. INCIDÊNCIA DE ICMS (' + aliquotaIcmsEstadualPercent + '%: R$ ' + valorIcms.toFixed(2) + '). Não incidência de ISSQN.';

    return Ok({
      vendaId,
      farmaciaNome,
      tipoItem,
      tributacaoExclusivaIssqnSTF: false,
      aliquotaIssqnPercent: 0,
      valorIssqnDevidoBrl: 0,
      aliquotaIcmsPercent: aliquotaIcmsEstadualPercent,
      valorIcmsDevidoBrl: valorIcms,
      totalTributosIncidentesBrl: valorIcms,
      diagnosticoFiscal: diag
    });
  }
}
