import { Result, Ok, Err } from '../../types/result.js';

export interface TaxTreatyInput {
  empresaBrasilCnpj: string;
  paisTratadoAdt: 'ESPANHA' | 'FRANCA' | 'PORTUGAL' | 'ALEMANHA' | 'ESTADOS_UNIDOS';
  lucroFilialExteriorBrl: number; // Ex: R$ 10.000.000,00
  impostoRendaPagoExteriorBrl: number; // Ex: R$ 2.500.000,00 (25%)
  aliquotaIrpjCsllBrasilPercent: number; // 34.0%
}

export interface TaxTreatyResult {
  empresaBrasilCnpj: string;
  paisTratadoAdt: string;
  irpjCsllDevidoBrasilAntesCreditoBrl: number; // R$ 3.400.000,00
  creditoImpostoExteriorAproveitavelBrl: number; // R$ 2.500.000,00
  irpjCsllComplementarBrasilBrl: number; // R$ 900.000,00
  statusTratado: 'CREDITO_TRIBUTARIO_EXTERIOR_HOMOLOGADO_ECF';
  diagnosticoTratado: string;
}

export function processTaxTreatyPermanentEstablishmentEngine(input: TaxTreatyInput): Result<TaxTreatyResult, Error> {
  const {
    empresaBrasilCnpj,
    paisTratadoAdt,
    lucroFilialExteriorBrl,
    impostoRendaPagoExteriorBrl,
    aliquotaIrpjCsllBrasilPercent = 34.0
  } = input;

  if (!empresaBrasilCnpj || lucroFilialExteriorBrl <= 0) {
    return Err(new Error('CNPJ e lucro auferido no exterior devem ser válidos.'));
  }

  const impostoBrasil = (lucroFilialExteriorBrl * aliquotaIrpjCsllBrasilPercent) / 100;
  // O crédito no Brasil é limitado ao imposto devido no Brasil sobre a mesma renda (Art. 26 da Lei 12.973/14)
  const creditoMaximo = Math.min(impostoRendaPagoExteriorBrl, impostoBrasil);
  const complementar = impostoBrasil - creditoMaximo;

  const diag = "Tratado ADT Brasil-" + paisTratadoAdt + " (Art. 26 Lei 12.973/14): Lucro Exterior: R$ " + lucroFilialExteriorBrl.toLocaleString('pt-BR') + " | IRPJ/CSLL Brasil (34%): R$ " + impostoBrasil.toLocaleString('pt-BR') + " | Credito Exterior: R$ " + creditoMaximo.toLocaleString('pt-BR') + " -> Imposto Complementar a Recolher: R$ " + complementar.toLocaleString('pt-BR');

  return Ok({
    empresaBrasilCnpj,
    paisTratadoAdt,
    irpjCsllDevidoBrasilAntesCreditoBrl: impostoBrasil,
    creditoImpostoExteriorAproveitavelBrl: creditoMaximo,
    irpjCsllComplementarBrasilBrl: complementar,
    statusTratado: 'CREDITO_TRIBUTARIO_EXTERIOR_HOMOLOGADO_ECF',
    diagnosticoTratado: diag
  });
}
