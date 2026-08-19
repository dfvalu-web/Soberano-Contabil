import { Result, Ok, Err } from '../types/result.js';

export interface ClientProfitabilityEntry {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  honorarioMensalBrl: number;
  horasContabilMes: number;
  horasFiscalMes: number;
  horasDpMes: number;
  custoHoraMediaEquipeBrl: number; // Ex: R$ 60,00/hora
  custoSoftwaresLicencasBrl: number; // Ex: R$ 80,00
}

export interface ClientProfitabilityInput {
  escritorioNome: string;
  mesCompetencia: string;
  carteiraClientes: ClientProfitabilityEntry[];
}

export interface ClientProfitabilityReport {
  clienteCnpj: string;
  razaoSocial: string;
  honorarioMensalBrl: number;
  custoTotalOperacionalBrl: number;
  margemContribuicaoBrl: number;
  margemPercentual: number;
  classificacaoRentabilidade: 'ALTA_RENTABILIDADE' | 'RENTABILIDADE_ADEQUADA' | 'CLIENTE_DEFICITARIO_PREJUIZO';
}

export interface PortfolioProfitabilityResult {
  escritorioNome: string;
  mesCompetencia: string;
  totalClientesAnalisados: number;
  faturamentoTotalHonorariosBrl: number;
  custoTotalOperacionalCarteiraBrl: number;
  lucroOperacionalCarteiraBrl: number;
  margemMediaCarteiraPercent: number;
  totalClientesDeficitarios: number;
  detalhePorCliente: ClientProfitabilityReport[];
  statusBI: 'RENTABILIDADE_CARTEIRA_CALCULADA_COM_SUCESSO';
  diagnosticoBI: string;
}

export function processOfficeClientProfitabilityBiEngine(input: ClientProfitabilityInput): Result<PortfolioProfitabilityResult, Error> {
  const {
    escritorioNome,
    mesCompetencia,
    carteiraClientes
  } = input;

  if (!escritorioNome || !carteiraClientes || carteiraClientes.length === 0) {
    return Err(new Error('Nome do escritório e carteira de clientes são obrigatórios.'));
  }

  let totalFaturamento = 0;
  let totalCusto = 0;
  let deficitarios = 0;
  const relatorio: ClientProfitabilityReport[] = [];

  for (const c of carteiraClientes) {
    const totalHoras = c.horasContabilMes + c.horasFiscalMes + c.horasDpMes;
    const custoMaoDeObra = totalHoras * c.custoHoraMediaEquipeBrl;
    const custoTotal = custoMaoDeObra + c.custoSoftwaresLicencasBrl;
    const margem = c.honorarioMensalBrl - custoTotal;
    const margemPerc = c.honorarioMensalBrl > 0 ? (margem / c.honorarioMensalBrl) * 100 : -100;

    let classif: 'ALTA_RENTABILIDADE' | 'RENTABILIDADE_ADEQUADA' | 'CLIENTE_DEFICITARIO_PREJUIZO' = 'RENTABILIDADE_ADEQUADA';
    if (margemPerc >= 50) classif = 'ALTA_RENTABILIDADE';
    else if (margem < 0) {
      classif = 'CLIENTE_DEFICITARIO_PREJUIZO';
      deficitarios++;
    }

    totalFaturamento += c.honorarioMensalBrl;
    totalCusto += custoTotal;

    relatorio.push({
      clienteCnpj: c.clienteCnpj,
      razaoSocial: c.razaoSocial,
      honorarioMensalBrl: c.honorarioMensalBrl,
      custoTotalOperacionalBrl: parseFloat(custoTotal.toFixed(2)),
      margemContribuicaoBrl: parseFloat(margem.toFixed(2)),
      margemPercentual: parseFloat(margemPerc.toFixed(1)),
      classificacaoRentabilidade: classif
    });
  }

  const lucroTotal = totalFaturamento - totalCusto;
  const margemMedia = totalFaturamento > 0 ? (lucroTotal / totalFaturamento) * 100 : 0;

  const diag = "BI de Rentabilidade (" + escritorioNome + " - " + mesCompetencia + "): " + carteiraClientes.length + " clientes | Faturamento: R$ " + totalFaturamento.toLocaleString('pt-BR') + " | Custos: R$ " + totalCusto.toLocaleString('pt-BR') + " | Lucro Operacional: R$ " + lucroTotal.toLocaleString('pt-BR') + " (Margem " + margemMedia.toFixed(1) + "%) | Clientes deficitários: " + deficitarios + ".";

  return Ok({
    escritorioNome,
    mesCompetencia,
    totalClientesAnalisados: carteiraClientes.length,
    faturamentoTotalHonorariosBrl: parseFloat(totalFaturamento.toFixed(2)),
    custoTotalOperacionalCarteiraBrl: parseFloat(totalCusto.toFixed(2)),
    lucroOperacionalCarteiraBrl: parseFloat(lucroTotal.toFixed(2)),
    margemMediaCarteiraPercent: parseFloat(margemMedia.toFixed(1)),
    totalClientesDeficitarios: deficitarios,
    detalhePorCliente: relatorio,
    statusBI: 'RENTABILIDADE_CARTEIRA_CALCULADA_COM_SUCESSO',
    diagnosticoBI: diag
  });
}
