import { Result, Ok, Err } from '../../types/result.js';

export type PharmaSegmentType = 'FABRICANTE_LABORATORIO_INDUSTRIA' | 'DISTRIBUIDORA_FARMACIA_DROGARIA';
export type PharmaListType = 'LISTA_POSITIVA' | 'LISTA_NEGATIVA' | 'LISTA_NEUTRA';

export interface PharmaMonophasicInput {
  operacaoId: string;
  segmento: PharmaSegmentType;
  listaMedicamento: PharmaListType;
  medicamentoNome: string;
  valorTotalMedicamentosBrl: number;
  precoMaximoConsumidorPmcBrl?: number;
}

export interface PharmaMonophasicResult {
  operacaoId: string;
  segmento: PharmaSegmentType;
  listaMedicamento: PharmaListType;
  medicamentoNome: string;
  cstPisCofinsUtilizado: string;
  aliquotaPisPercent: number;
  aliquotaCofinsPercent: number;
  pisMonofasicoDevidoBrl: number;
  cofinsMonofasicoDevidoBrl: number;
  creditoPresumidoApropriadoBrl: number;
  tributacaoVarejoZero: boolean;
  diagnosticoFiscal: string;
}

export function processPharmaceuticalMonophasicTaxEngine(input: PharmaMonophasicInput): Result<PharmaMonophasicResult, Error> {
  const {
    operacaoId,
    segmento,
    listaMedicamento,
    medicamentoNome,
    valorTotalMedicamentosBrl
  } = input;

  if (valorTotalMedicamentosBrl <= 0) {
    return Err(new Error('Valor total dos medicamentos deve ser superior a zero.'));
  }

  if (segmento === 'FABRICANTE_LABORATORIO_INDUSTRIA') {
    if (listaMedicamento === 'LISTA_NEGATIVA') {
      // Lista Negativa: Alíquota Concentrada (2,10% PIS e 9,90% COFINS) - CST 02
      const pis = Number((valorTotalMedicamentosBrl * 0.0210).toFixed(2));
      const cofins = Number((valorTotalMedicamentosBrl * 0.0990).toFixed(2));

      const diag = 'Indústria Farmacêutica (Lista Negativa): ' + medicamentoNome + '. Alíquota concentrada de PIS (2,10%: R$ ' + pis.toFixed(2) + ') e COFINS (9,90%: R$ ' + cofins.toFixed(2) + ') nos termos da Lei nº 10.147/2000.';

      return Ok({
        operacaoId,
        segmento,
        listaMedicamento,
        medicamentoNome,
        cstPisCofinsUtilizado: '02',
        aliquotaPisPercent: 2.10,
        aliquotaCofinsPercent: 9.90,
        pisMonofasicoDevidoBrl: pis,
        cofinsMonofasicoDevidoBrl: cofins,
        creditoPresumidoApropriadoBrl: 0,
        tributacaoVarejoZero: false,
        diagnosticoFiscal: diag
      });
    } else if (listaMedicamento === 'LISTA_POSITIVA') {
      // Lista Positiva: Alíquota Concentrada (2,10% / 9,90%) com Crédito Presumido total equivalente (Lei 10.147/00 & Lei 10.548/02)
      const pisBruto = Number((valorTotalMedicamentosBrl * 0.0210).toFixed(2));
      const cofinsBruto = Number((valorTotalMedicamentosBrl * 0.0990).toFixed(2));
      const creditoPresumido = Number((pisBruto + cofinsBruto).toFixed(2));

      const diag = 'Indústria Farmacêutica (Lista Positiva): ' + medicamentoNome + '. PIS/COFINS concentrado compensado integralmente por Crédito Presumido de R$ ' + creditoPresumido.toFixed(2) + ' (Carga Efetiva Zero).';

      return Ok({
        operacaoId,
        segmento,
        listaMedicamento,
        medicamentoNome,
        cstPisCofinsUtilizado: '03',
        aliquotaPisPercent: 2.10,
        aliquotaCofinsPercent: 9.90,
        pisMonofasicoDevidoBrl: 0,
        cofinsMonofasicoDevidoBrl: 0,
        creditoPresumidoApropriadoBrl: creditoPresumido,
        tributacaoVarejoZero: false,
        diagnosticoFiscal: diag
      });
    } else {
      // Lista Neutra: Alíquotas normais (1,65% e 7,60%)
      const pis = Number((valorTotalMedicamentosBrl * 0.0165).toFixed(2));
      const cofins = Number((valorTotalMedicamentosBrl * 0.0760).toFixed(2));

      return Ok({
        operacaoId,
        segmento,
        listaMedicamento,
        medicamentoNome,
        cstPisCofinsUtilizado: '01',
        aliquotaPisPercent: 1.65,
        aliquotaCofinsPercent: 7.60,
        pisMonofasicoDevidoBrl: pis,
        cofinsMonofasicoDevidoBrl: cofins,
        creditoPresumidoApropriadoBrl: 0,
        tributacaoVarejoZero: false,
        diagnosticoFiscal: 'Lista Neutra: Tributação não cumulativa padrão de PIS/COFINS.'
      });
    }
  } else {
    // Distribuidoras, Drogarias e Farmácias: Alíquota ZERO de PIS e COFINS (CST 04)
    const diag = 'Distribuidora / Drogaria / Farmácia: Medicamento ' + medicamentoNome + ' (' + listaMedicamento + '). CST 04 (Operação Tributável Monofásica - Revenda a Alíquota Zero). PIS/COFINS Zero nos termos do Art. 2º da Lei nº 10.147/2000.';

    return Ok({
      operacaoId,
      segmento,
      listaMedicamento,
      medicamentoNome,
      cstPisCofinsUtilizado: '04',
      aliquotaPisPercent: 0,
      aliquotaCofinsPercent: 0,
      pisMonofasicoDevidoBrl: 0,
      cofinsMonofasicoDevidoBrl: 0,
      creditoPresumidoApropriadoBrl: 0,
      tributacaoVarejoZero: true,
      diagnosticoFiscal: diag
    });
  }
}
