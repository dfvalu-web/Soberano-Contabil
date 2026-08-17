import { Result, Ok } from '../types/result.js';

export interface FiscalItemAnomalyCheck {
  ncm: string;
  cfop: string;
  cstIcms: string;
  cstPisCofins: string;
  aliqIcms: number;
  aliqPis: number;
  aliqCofins: number;
  valorOperacao: number;
}

export interface AnomalyReport {
  totalItensAnalisados: number;
  totalAnomaliasEncontradas: number;
  scoreConformidadeItem: number; // 0 a 100
  anomalias: Array<{
    itemIndex: number;
    gravidade: 'ALTA' | 'MEDIA' | 'BAIXA';
    tipo: 'CST_INCOMPATIVEL' | 'ALIQUOTA_ZERADA_INDEVIDA' | 'CREDITO_PROIBIDO' | 'MONOFASICO_TRIBUTADO';
    descricao: string;
    recomendacaoCorrecao: string;
  }>;
}

export function detectFiscalAnomalies(itens: FiscalItemAnomalyCheck[]): Result<AnomalyReport, Error> {
  const anomalias: AnomalyReport['anomalias'] = [];

  itens.forEach((item, index) => {
    // 1. CST 00 (Integralmente Tributado) com alíquota de ICMS zerada
    if (item.cstIcms === '00' && item.aliqIcms <= 0) {
      anomalias.push({
        itemIndex: index,
        gravidade: 'ALTA',
        tipo: 'CST_INCOMPATIVEL',
        descricao: `Item ${index + 1}: CST ICMS é '00' (Tributado integralmente), porém a alíquota informada é 0%.`,
        recomendacaoCorrecao: 'Corrigir a alíquota de ICMS para a alíquota da operação ou alterar o CST para 40/41 (Isenção/Não-Incidência).'
      });
    }

    // 2. CST PIS/COFINS 04 (Monofásico) com alíquotas de 1.65% e 7.60%
    if ((item.cstPisCofins === '04' || item.cstPisCofins === '06') && (item.aliqPis > 0 || item.aliqCofins > 0)) {
      anomalias.push({
        itemIndex: index,
        gravidade: 'ALTA',
        tipo: 'MONOFASICO_TRIBUTADO',
        descricao: `Item ${index + 1}: CST PIS/COFINS é monofásico/alíquota zero ('${item.cstPisCofins}'), mas foram informadas alíquotas positivas (${item.aliqPis}% / ${item.aliqCofins}%).`,
        recomendacaoCorrecao: 'Zerar o valor de PIS e COFINS ou alterar o CST para 01 (Operação Tributada com Alíquota Básica).'
      });
    }

    // 3. CFOP de Exportação (iniciado em 7) com incidência de ICMS ou PIS/COFINS
    if (item.cfop.startsWith('7') && (item.aliqIcms > 0 || item.aliqPis > 0 || item.aliqCofins > 0)) {
      anomalias.push({
        itemIndex: index,
        gravidade: 'ALTA',
        tipo: 'CREDITO_PROIBIDO',
        descricao: `Item ${index + 1}: Operação de Exportação (CFOP ${item.cfop}) com tributação indevida de ICMS/PIS/COFINS (Imunidade Constitucional Art. 149 e 155 CF/88).`,
        recomendacaoCorrecao: 'Aplicar CST ICMS 41 e CST PIS/COFINS 08 (Operação Sem Incidência da Contribuição).'
      });
    }
  });

  const totalAnomalias = anomalias.length;
  const score = Math.max(0, 100 - (totalAnomalias * 20));

  return Ok({
    totalItensAnalisados: itens.length,
    totalAnomaliasEncontradas: totalAnomalias,
    scoreConformidadeItem: score,
    anomalias
  });
}
