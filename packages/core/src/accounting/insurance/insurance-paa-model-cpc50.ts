import { Result, Ok, Err } from '../../types/result.js';
import { JournalEntryLine } from '../../types/accounting.js';

export interface InsurancePaaInput {
  apoliceGrupoId: string;
  seguradoraNome: string;
  ramoSeguro: string; // Ex: 'Seguro Automóvel / Seguro Residencial / Garantia Estendida'
  premioTotalRecebidoBrl: number;
  custosAquisicaoApoliceBrl: number; // Comissões de corretores
  mesesDecorridosCobertura: number; // Ex: 4 meses
  prazoTotalCoberturaMeses: number; // Ex: 12 meses
  sinistrosIncorridosAvisadosBrl: number; // Sinistros ocorridos
  ajusteRiscoNaoFinanceiroBrl: number; // Risk Adjustment (LIC)
}

export interface InsurancePaaResult {
  apoliceGrupoId: string;
  seguradoraNome: string;
  ramoSeguro: string;
  receitaSeguroReconhecidaDrebBrl: number; // Proporcional aos meses decorridos
  passivoCoberturaRemanescenteLrcBrl: number; // LRC (Liability for Remaining Coverage)
  passivoSinistrosIncorridosLicBrl: number; // LIC (Liability for Incurred Claims)
  resultadoTecnicoSeguroDrebBrl: number; // Receita - Sinistros
  partidasDobrada: JournalEntryLine[];
  diagnosticoCpc50Paa: string;
}

export function evaluateInsurancePaaModelCpc50(input: InsurancePaaInput): Result<InsurancePaaResult, Error> {
  const {
    apoliceGrupoId,
    seguradoraNome,
    ramoSeguro,
    premioTotalRecebidoBrl,
    custosAquisicaoApoliceBrl,
    mesesDecorridosCobertura,
    prazoTotalCoberturaMeses,
    sinistrosIncorridosAvisadosBrl,
    ajusteRiscoNaoFinanceiroBrl
  } = input;

  if (premioTotalRecebidoBrl <= 0 || prazoTotalCoberturaMeses <= 0) {
    return Err(new Error('Prêmio total e prazo de cobertura devem ser superiores a zero.'));
  }

  // CPC 50 / IFRS 17 - Abordagem de Alocação de Prêmio (PAA):
  // 1. Receita de Seguro = Prêmio Líquido * (Meses Decorridos / Prazo Total)
  const fracaoCobertura = Math.min(1.0, mesesDecorridosCobertura / prazoTotalCoberturaMeses);
  const receitaSeguro = Number((premioTotalRecebidoBrl * fracaoCobertura).toFixed(2));

  // 2. Passivo por Cobertura Remanescente (LRC) = Prêmio Recebido - Custos Aquisição - Receita Reconhecida
  const lrc = Number((premioTotalRecebidoBrl - custosAquisicaoApoliceBrl - receitaSeguro).toFixed(2));

  // 3. Passivo por Sinistros Incorridos (LIC) = Sinistros Avisados/Ocorridos + Ajuste de Risco Não Financeiro
  const lic = Number((sinistrosIncorridosAvisadosBrl + ajusteRiscoNaoFinanceiroBrl).toFixed(2));

  // 4. Resultado Técnico do Seguro (DRE) = Receita de Seguro - Sinistros Incorridos
  const resultadoTecnico = Number((receitaSeguro - sinistrosIncorridosAvisadosBrl).toFixed(2));

  const partidas: JournalEntryLine[] = [];

  // D: Bancos / Prêmios a Receber (Ativo Circulante)
  partidas.push({
    accountId: '1.1.1.01',
    accountCode: '1.1.1.01',
    accountName: 'Bancos Conta Movimento - Prêmios Recebidos (Ativo Circulante)',
    type: 'DEBIT',
    amount: premioTotalRecebidoBrl
  });

  // C: Passivo por Cobertura Remanescente - LRC (Passivo Circulante - CPC 50 PAA)
  partidas.push({
    accountId: '2.1.4.01',
    accountCode: '2.1.4.01',
    accountName: 'Passivo de Contratos de Seguro - LRC Cobertura Remanescente (Passivo - CPC 50)',
    type: 'CREDIT',
    amount: lrc
  });

  // C: Receita de Seguros Reconhecida no Período (Resultado - CPC 50)
  partidas.push({
    accountId: '3.1.1.05',
    accountCode: '3.1.1.05',
    accountName: 'Receita de Serviços de Seguros (Resultado - CPC 50 / IFRS 17 PAA)',
    type: 'CREDIT',
    amount: receitaSeguro
  });

  const diag = 'Contratos de Seguro PAA (CPC 50 / IFRS 17): ' + seguradoraNome + ' (' + ramoSeguro + '). Prêmio: R$ ' + premioTotalRecebidoBrl.toFixed(2) + ' (' + mesesDecorridosCobertura + '/' + prazoTotalCoberturaMeses + ' meses). Receita Reconhecida: R$ ' + receitaSeguro.toFixed(2) + '. Passivo LRC: R$ ' + lrc.toFixed(2) + ' | Passivo LIC: R$ ' + lic.toFixed(2) + ' (Resultado Técnico DRE: R$ ' + resultadoTecnico.toFixed(2) + ').';

  return Ok({
    apoliceGrupoId,
    seguradoraNome,
    ramoSeguro,
    receitaSeguroReconhecidaDrebBrl: receitaSeguro,
    passivoCoberturaRemanescenteLrcBrl: lrc,
    passivoSinistrosIncorridosLicBrl: lic,
    resultadoTecnicoSeguroDrebBrl: resultadoTecnico,
    partidasDobrada: partidas,
    diagnosticoCpc50Paa: diag
  });
}
