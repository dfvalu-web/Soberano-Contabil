import { Result, Ok, Err } from '../types/result.js';

export interface ProlaboreDividendsInput {
  clienteCnpj: string;
  razaoSocial: string;
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  lucroLiquidoMensalDisponivelBrl: number;
  proLaboreSugeridoBrl: number;
}

export interface ProlaboreDividendsResult {
  clienteCnpj: string;
  razaoSocial: string;
  valorProLaboreBrutoBrl: number;
  valorInssRetidoBrl: number; // 11% limitado ao teto (~R$ 856,46)
  valorIrpfRetidoBrl: number; // Tabela progressiva
  valorProLaboreLiquidoBrl: number;
  valorLucrosIsentosDistribuidosBrl: number;
  custoTributarioTotalSocioBrl: number;
  cargaEfetivaPercent: number;
  statusPlanejamento: 'PLANEJAMENTO_PROLABORE_LUCROS_CONCLUIDO';
  diagnosticoPlanejamento: string;
}

export function processOfficeOptimalProlaboreDividendsEngine(input: ProlaboreDividendsInput): Result<ProlaboreDividendsResult, Error> {
  const {
    clienteCnpj,
    razaoSocial,
    regimeTributario,
    lucroLiquidoMensalDisponivelBrl,
    proLaboreSugeridoBrl
  } = input;

  if (!clienteCnpj || lucroLiquidoMensalDisponivelBrl <= 0 || proLaboreSugeridoBrl < 0) {
    return Err(new Error('CNPJ e lucro líquido válido são obrigatórios.'));
  }

  // Teto INSS 2026 (~R$ 8.157,41 * 11% = ~R$ 897,32)
  const tetoInss = 8157.41;
  const baseInss = Math.min(proLaboreSugeridoBrl, tetoInss);
  const inssRetido = baseInss * 0.11;

  // IRPF Simples
  const baseIrpf = Math.max(0, proLaboreSugeridoBrl - inssRetido);
  let irpf = 0;
  if (baseIrpf > 4664.68) irpf = (baseIrpf * 0.275) - 896.00;
  else if (baseIrpf > 3751.05) irpf = (baseIrpf * 0.225) - 662.77;
  else if (baseIrpf > 2826.65) irpf = (baseIrpf * 0.15) - 381.44;
  else if (baseIrpf > 2259.20) irpf = (baseIrpf * 0.075) - 169.44;
  irpf = Math.max(0, irpf);

  const proLaboreLiq = proLaboreSugeridoBrl - inssRetido - irpf;
  const lucrosIsentos = Math.max(0, lucroLiquidoMensalDisponivelBrl - proLaboreSugeridoBrl);

  const custoTotal = inssRetido + irpf;
  const rendaTotalSocio = proLaboreLiq + lucrosIsentos;
  const cargaEfetiva = ((custoTotal) / lucroLiquidoMensalDisponivelBrl) * 100;

  const diag = "Planejamento Pró-Labore & Lucros (" + razaoSocial + " - " + regimeTributario + "): Pró-labore Bruto: R$ " + proLaboreSugeridoBrl.toLocaleString('pt-BR') + " (INSS: R$ " + inssRetido.toFixed(2) + " | IRPF: R$ " + irpf.toFixed(2) + ") + Lucros Isentos: R$ " + lucrosIsentos.toLocaleString('pt-BR') + " -> Renda Líquida Total: R$ " + rendaTotalSocio.toLocaleString('pt-BR') + " (Carga Efetiva: " + cargaEfetiva.toFixed(2) + "%).";

  return Ok({
    clienteCnpj,
    razaoSocial,
    valorProLaboreBrutoBrl: parseFloat(proLaboreSugeridoBrl.toFixed(2)),
    valorInssRetidoBrl: parseFloat(inssRetido.toFixed(2)),
    valorIrpfRetidoBrl: parseFloat(irpf.toFixed(2)),
    valorProLaboreLiquidoBrl: parseFloat(proLaboreLiq.toFixed(2)),
    valorLucrosIsentosDistribuidosBrl: parseFloat(lucrosIsentos.toFixed(2)),
    custoTributarioTotalSocioBrl: parseFloat(custoTotal.toFixed(2)),
    cargaEfetivaPercent: parseFloat(cargaEfetiva.toFixed(2)),
    statusPlanejamento: 'PLANEJAMENTO_PROLABORE_LUCROS_CONCLUIDO',
    diagnosticoPlanejamento: diag
  });
}
