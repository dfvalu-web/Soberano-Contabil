import { Result, Ok, Err } from '../../types/result.js';

export interface MedicalCooperativePayrollInput {
  cooperadoCpf: string;
  cooperadoNome: string;
  valorProducaoMedicaBrutaBrl: number; // Ex: R$ 25.000,00
  tetoInssPrevidenciarioBrl: number; // Ex: R$ 8.157,41 (2026)
  aliquotaRetencaoCooperadoPercent: number; // 11.0%
}

export interface MedicalCooperativePayrollResult {
  cooperadoCpf: string;
  cooperadoNome: string;
  valorProducaoMedicaBrutaBrl: number;
  baseCalculoInssBrl: number; // Limitada ao teto ou valor da produção
  inssRetidoCooperadoBrl: number; // 11% sobre base (Ex: 11% de R$ 8.157,41 = R$ 897,32)
  valorLiquidoRepasseMedicoBrl: number;
  eventoEsocialGerado: 'S-1200_REMUNERACAO_TRABALHADOR_AVULSO_COOPERADO';
  statusRetencao: 'RETENCAO_INSS_COOPERADO_HOMOLOGADA_ESOCIAL';
  diagnosticoMedico: string;
}

export function processMedicalCooperativePayrollInssEngine(input: MedicalCooperativePayrollInput): Result<MedicalCooperativePayrollResult, Error> {
  const {
    cooperadoCpf,
    cooperadoNome,
    valorProducaoMedicaBrutaBrl,
    tetoInssPrevidenciarioBrl = 8157.41,
    aliquotaRetencaoCooperadoPercent = 11.0
  } = input;

  if (!cooperadoCpf || valorProducaoMedicaBrutaBrl <= 0) {
    return Err(new Error('CPF do médico cooperado e valor de produção bruta são obrigatórios.'));
  }

  const baseCalculo = Math.min(valorProducaoMedicaBrutaBrl, tetoInssPrevidenciarioBrl);
  const inssRetido = (baseCalculo * aliquotaRetencaoCooperadoPercent) / 100;
  const liquidoRepasse = valorProducaoMedicaBrutaBrl - inssRetido;

  const diag = "Medico Cooperado: " + cooperadoNome + " (CPF: " + cooperadoCpf + ") | Producao: R$ " + valorProducaoMedicaBrutaBrl.toLocaleString('pt-BR') + " | Base INSS (Teto): R$ " + baseCalculo.toLocaleString('pt-BR') + " | INSS 11%: R$ " + inssRetido.toFixed(2) + " -> Liquido Repasse: R$ " + liquidoRepasse.toLocaleString('pt-BR') + " (eSocial S-1200)";

  return Ok({
    cooperadoCpf,
    cooperadoNome,
    valorProducaoMedicaBrutaBrl,
    baseCalculoInssBrl: baseCalculo,
    inssRetidoCooperadoBrl: parseFloat(inssRetido.toFixed(2)),
    valorLiquidoRepasseMedicoBrl: parseFloat(liquidoRepasse.toFixed(2)),
    eventoEsocialGerado: 'S-1200_REMUNERACAO_TRABALHADOR_AVULSO_COOPERADO',
    statusRetencao: 'RETENCAO_INSS_COOPERADO_HOMOLOGADA_ESOCIAL',
    diagnosticoMedico: diag
  });
}
