import { Result, Ok, Err } from '../../types/result.js';

export interface VaspSegregationInput {
  vaspExchangeCnpj: string;
  saldoCustodiaClientesBtc: number; // Ex: 500 BTC
  cotacaoBtcBrl: number; // Ex: R$ 350.000,00
  reservasEmCarteirasFriasBtc: number; // Ex: 520 BTC (Índice de cobertura = 104%)
  patrimonioProprioVaspBrl: number; // Ex: R$ 50.000.000,00
}

export interface VaspSegregationResult {
  vaspExchangeCnpj: string;
  valorTotalCustodiaClientesBrl: number; // R$ 175.000.000,00
  valorTotalReservasComprovadasBrl: number; // R$ 182.000.000,00
  indiceCoberturaReservasPercent: number; // 104.0%
  segregacaoPatrimonialAtiva: boolean;
  statusConformidadeMarcoCripto: 'VASP_EM_CONFORMIDADE_LEI_14478_PROVA_RESERVAS';
  diagnosticoVasp: string;
}

export function processCryptoVaspRegulatoryComplianceEngine(input: VaspSegregationInput): Result<VaspSegregationResult, Error> {
  const {
    vaspExchangeCnpj,
    saldoCustodiaClientesBtc,
    cotacaoBtcBrl,
    reservasEmCarteirasFriasBtc,
    patrimonioProprioVaspBrl
  } = input;

  if (!vaspExchangeCnpj || saldoCustodiaClientesBtc <= 0 || cotacaoBtcBrl <= 0) {
    return Err(new Error('CNPJ, saldo de clientes e cotação do BTC são obrigatórios.'));
  }

  const valorCustodia = saldoCustodiaClientesBtc * cotacaoBtcBrl;
  const valorReservas = reservasEmCarteirasFriasBtc * cotacaoBtcBrl;
  const cobertura = (reservasEmCarteirasFriasBtc / saldoCustodiaClientesBtc) * 100;

  if (cobertura < 100.0) {
    return Err(new Error('Inconformidade regulatória: Reservas comprovadas inferiores a 100% dos saldos dos clientes.'));
  }

  const diag = "Marco Legal dos Criptoativos (Lei 14.478/22): VASP " + vaspExchangeCnpj + " | Custodia Clientes: R$ " + valorCustodia.toLocaleString('pt-BR') + " (" + saldoCustodiaClientesBtc + " BTC) | Reservas On-Chain: " + reservasEmCarteirasFriasBtc + " BTC | Cobertura: " + cobertura.toFixed(2) + "% -> Segregacao 100% Homologada.";

  return Ok({
    vaspExchangeCnpj,
    valorTotalCustodiaClientesBrl: valorCustodia,
    valorTotalReservasComprovadasBrl: valorReservas,
    indiceCoberturaReservasPercent: parseFloat(cobertura.toFixed(2)),
    segregacaoPatrimonialAtiva: true,
    statusConformidadeMarcoCripto: 'VASP_EM_CONFORMIDADE_LEI_14478_PROVA_RESERVAS',
    diagnosticoVasp: diag
  });
}
